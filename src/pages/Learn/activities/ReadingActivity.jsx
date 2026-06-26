import { useState, useEffect } from "react";
import { useChild }   from "../../../context/ChildContext";
import { generateStory } from "../../../api/readingAPI";
import ActivityShell  from "../../../components/ActivityShell";
import QuestionCard   from "../../../components/QuestionCard";
import styles from "./Activity.module.css";

export default function ReadingActivity({ onXP, onBack }) {
  const { activeChild }            = useChild();
  const [data, setData]            = useState(null);
  const [loading, setLoading]      = useState(true);
  const [error, setError]          = useState("");
  const [qIdx, setQIdx]            = useState(0);
  const [score, setScore]          = useState(0);
  const [done, setDone]            = useState(false);
  const [readDone, setReadDone]    = useState(false);

  async function load() {
    setLoading(true); setError(""); setDone(false);
    setQIdx(0); setScore(0); setReadDone(false);
    try {
      const d = await generateStory(activeChild);
      setData(d);
    } catch { setError("Couldn't load story. Please try again."); }
    finally { setLoading(false); }
  }

  useEffect(() => { if (activeChild) load(); }, [activeChild]);

  const questions = data?.questions ?? [];
  const xpEarned  = score * 5 + (score === questions.length ? 10 : 0);

  return (
    <ActivityShell
      emoji="📖" title="Reading" topic={data?.title ?? ""}
      score={score} total={questions.length}
      xpEarned={xpEarned}
      loading={loading} error={error} onRetry={load}
      done={done} onDone={() => onXP?.(xpEarned, "reading", score === questions.length)}
      onBack={onBack}
    >
      {data && !readDone && (
        <div>
          <div className={styles.storyCard}>
            <div className={styles.storyHeader}>
              <span className={styles.storyEmoji}>{data.emoji}</span>
              <div>
                <h2 className={styles.storyTitle}>{data.title}</h2>
                <span className={styles.storyType}>{data.type}</span>
              </div>
            </div>
            {data.paragraphs?.map((p, i) => (
              <p key={i} className={styles.storyPara}>{p}</p>
            ))}
            {data.moral && (
              <div className={styles.moral}>
                <span className={styles.moralIcon}>💡</span>
                <p>{data.moral}</p>
              </div>
            )}
            {data.vocabWords?.length > 0 && (
              <div className={styles.vocabBox}>
                <p className={styles.vocabTitle}>📚 New Words</p>
                <div className={styles.vocabList}>
                  {data.vocabWords.map((v) => (
                    <div key={v.word} className={styles.vocabItem}>
                      <span className={styles.vocabWord}>{v.word}</span>
                      <span className={styles.vocabMeaning}>{v.meaning}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <button className={styles.nextBtn} onClick={() => setReadDone(true)}>
              ✅ Done Reading — Answer Questions →
            </button>
          </div>
        </div>
      )}

      {data && readDone && !done && questions[qIdx] && (
        <div>
          <QuestionCard
            key={qIdx}
            question={questions[qIdx].q}
            options={questions[qIdx].options}
            answer={questions[qIdx].answer}
            questionNum={qIdx + 1}
            total={questions.length}
            onCorrect={() => setScore((s) => s + 1)}
            onWrong={() => {}}
          />
          <button
            className={styles.nextBtn}
            style={{ marginTop: 16 }}
            onClick={() => {
              if (qIdx + 1 >= questions.length) setDone(true);
              else setQIdx((i) => i + 1);
            }}
          >
            {qIdx + 1 >= questions.length ? "Finish ✅" : "Next Question →"}
          </button>
        </div>
      )}
    </ActivityShell>
  );
}