import { useState, useEffect } from "react";
import { useSession } from "../../context/SessionContext";
import { useChild }    from "../../context/ChildContext";
import { generateStory }   from "../../api/readingAPI";
import { generateMath }    from "../../api/mathAPI";
import { generateVocab }   from "../../api/vocabAPI";
import { generatePoem }    from "../../api/poemAPI";
import { generateAnimals } from "../../api/animalsAPI";
import { generateShapes }  from "../../api/shapesAPI";
import QuestionCard from "../../components/QuestionCard";
import styles from "./ActivityRunner.module.css";
import { generateFunActivity } from "../../api/funAPI";

const BG_COLORS = {
  reading: "linear-gradient(135deg,#4D96FF,#6C63FF)",
  math:    "linear-gradient(135deg,#6BCB77,#4D96FF)",
  vocab:   "linear-gradient(135deg,#FFD93D,#FF9F43)",
  fun:     "linear-gradient(135deg,#FF6B6B,#FF9F43)",
};

// Map session activity "type" → content generator
const GENERATORS = {
  reading: generateStory,
  math:    generateMath,
  vocab:   generateVocab,
  poem:    generatePoem,
  animals: generateAnimals,
  shapes:  generateShapes,
  fun:     generateFunActivity, // NEW — use dedicated fun generator
};

export default function ActivityRunner() {
  const { session, currentIdx, completed, completeActivity } = useSession();
  const { activeChild } = useChild();

  const activities = session?.activities ?? [];
  const activity   = activities[currentIdx];

  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [qIdx, setQIdx]       = useState(0);
  const [score, setScore]     = useState(0);
  const [phase, setPhase]     = useState("read"); // "read" | "questions"

  useEffect(() => {
    if (!activity) return;
    load();
    // eslint-disable-next-line
  }, [currentIdx]);

  async function load() {
    setLoading(true); setError(""); setContent(null);
    setQIdx(0); setScore(0); setPhase("read");
    try {
      const generator = GENERATORS[activity.type] ?? generateAnimals;
      const data = await generator(activeChild);
      if (!data) throw new Error("empty");
      setContent(data);
    } catch (e) {
      setError("Couldn't generate content. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!activity) return null;

  const isLast = currentIdx === activities.length - 1;
  const questions = content?.questions ?? [];
  const hasReading = ["reading", "poem"].includes(activity.type) && content;

  function handleFinishActivity() {
    completeActivity(activity.id, activity.xp);
  }

  return (
    <div className={styles.page}>
      {/* Progress dots */}
      <div className={styles.progressDots}>
        {activities.map((a, i) => (
          <div
            key={a.id}
            className={`${styles.dot} ${
              completed.includes(a.id)
                ? styles.dotDone
                : i === currentIdx
                ? styles.dotActive
                : styles.dotPending
            }`}
          />
        ))}
      </div>

      {/* Activity header card */}
      <div
        className={styles.actCard}
        style={{ background: BG_COLORS[activity.type] ?? BG_COLORS.fun }}
      >
        <span className={styles.actEmoji}>{activity.emoji}</span>
        <p className={styles.actType}>{activity.type.toUpperCase()}</p>
        <h2 className={styles.actTitle}>{activity.title}</h2>
        <p className={styles.actDesc}>{activity.description}</p>
        <div className={styles.actStats}>
          <span className={styles.stat}>⏱ {activity.minutes} min</span>
          <span className={styles.stat}>⚡ +{activity.xp} XP</span>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className={styles.loadingBox}>
          <div className={styles.spinner} />
          <p>Generating content…</p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className={styles.instructBox}>
          <p className={styles.instructTitle}>⚠️ {error}</p>
          <button className={styles.doneBtn} onClick={load}>Try Again</button>
        </div>
      )}

      {/* Reading / Poem content */}
      {!loading && !error && hasReading && phase === "read" && (
        <div className={styles.contentBox}>
          {activity.type === "reading" && (
            <>
              <h3 className={styles.contentTitle}>{content.emoji} {content.title}</h3>
              {content.paragraphs?.map((p, i) => (
                <p key={i} className={styles.para}>{p}</p>
              ))}
              {content.moral && <div className={styles.moral}>💡 {content.moral}</div>}
            </>
          )}
          {activity.type === "poem" && (
            <>
              <h3 className={styles.contentTitle}>{content.emoji} {content.title}</h3>
              {content.lines?.map((line, i) => (
                <p key={i} className={styles.poemLine}>{line}</p>
              ))}
            </>
          )}
          <button
            className={styles.doneBtn}
            onClick={() => questions.length ? setPhase("questions") : handleFinishActivity()}
          >
            {questions.length ? "✅ Done Reading — Answer Questions →" : "✅ Done!"}
          </button>
        </div>
      )}

      {/* Non-reading content display (math/vocab/shapes/animals) */}
      {!loading && !error && !hasReading && content && phase === "read" && (
        <>
          {content.animalEmojis && (
            <div className={styles.emojiDisplay}>{content.animalEmojis}</div>
          )}
          {content.questions?.length > 0 && (
            <p className={styles.topicLine}>{content.emoji} {content.topic}</p>
          )}
          <button className={styles.doneBtn} onClick={() => setPhase("questions")}>
            ✏️ Start Questions →
          </button>
        </>
      )}

      {/* Questions phase */}
      {!loading && !error && content && phase === "questions" && questions[qIdx] && (
        <div>
          <QuestionCard
            key={qIdx}
            question={questions[qIdx].q || questions[qIdx].question}
            options={questions[qIdx].options}
            answer={questions[qIdx].answer}
            hint={questions[qIdx].hint}
            questionNum={qIdx + 1}
            total={questions.length}
            onCorrect={() => setScore((s) => s + 1)}
            onWrong={() => {}}
          />
          <button
            className={styles.doneBtn}
            style={{ marginTop: 14 }}
            onClick={() => {
              if (qIdx + 1 >= questions.length) handleFinishActivity();
              else setQIdx((i) => i + 1);
            }}
          >
            {qIdx + 1 >= questions.length
              ? (isLast ? "🎉 Complete Session!" : "✅ Done! Next Activity →")
              : "Next Question →"}
          </button>
        </div>
      )}

      {/* No questions at all → just finish */}
      {!loading && !error && content && phase === "questions" && questions.length === 0 && (
        <button className={styles.doneBtn} onClick={handleFinishActivity}>
          {isLast ? "🎉 Complete Session!" : "✅ Done! Next Activity →"}
        </button>
      )}
    </div>
  );
}