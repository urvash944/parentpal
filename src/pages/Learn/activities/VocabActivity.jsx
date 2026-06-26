import { useState, useEffect } from "react";
import { useChild }    from "../../../context/ChildContext";
import { generateVocab } from "../../../api/vocabAPI";
import ActivityShell   from "../../../components/ActivityShell";
import QuestionCard    from "../../../components/QuestionCard";
import styles from "./Activity.module.css";

export default function VocabActivity({ onXP }) {
  const { activeChild }       = useChild();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [qIdx, setQIdx]       = useState(0);
  const [score, setScore]     = useState(0);
  const [done, setDone]       = useState(false);

  async function load() {
    setLoading(true); setError(""); setDone(false); setQIdx(0); setScore(0);
    try { setData(await generateVocab(activeChild)); }
    catch { setError("Couldn't load vocabulary activity. Try again."); }
    finally { setLoading(false); }
  }

  useEffect(() => { if (activeChild) load(); }, [activeChild]);

  const questions = data?.questions ?? [];
  const xpEarned  = score * 3 + (score === questions.length ? 10 : 0);

  return (
    <ActivityShell
      emoji="📝" title="Vocabulary" topic={data?.topic ?? ""}
      score={score} total={questions.length}
      xpEarned={xpEarned}
      loading={loading} error={error} onRetry={load}
      done={done} onDone={() => onXP?.(xpEarned, "vocab", score === questions.length)}
    >
      {data && !done && questions[qIdx] && (
        <div>
          <div className={styles.topicBanner}>
            <span>{data.emoji}</span>
            <span className={styles.topicText}>{data.topic}</span>
          </div>
          {questions[qIdx].display && (
            <div className={styles.displayBox}>
              <span className={styles.displayEmoji}>{questions[qIdx].emoji}</span>
              <p className={styles.displayText}>{questions[qIdx].display}</p>
            </div>
          )}
          <QuestionCard
            key={qIdx}
            question={questions[qIdx].question}
            options={questions[qIdx].options}
            answer={questions[qIdx].answer}
            hint={questions[qIdx].hint}
            questionNum={qIdx + 1}
            total={questions.length}
            onCorrect={() => setScore((s) => s + 1)}
            onWrong={() => {}}
          />
          <button
            className={styles.nextBtn}
            style={{ marginTop: 14 }}
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