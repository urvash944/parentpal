import { useState, useEffect } from "react";
import { useChild }   from "../../../context/ChildContext";
import { generatePoem } from "../../../api/poemAPI";
import ActivityShell  from "../../../components/ActivityShell";
import QuestionCard   from "../../../components/QuestionCard";
import styles from "./Activity.module.css";

export default function PoemActivity({ onXP }) {
  const { activeChild }       = useChild();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [qIdx, setQIdx]       = useState(0);
  const [score, setScore]     = useState(0);
  const [done, setDone]       = useState(false);
  const [readDone, setReadDone] = useState(false);
  const [activeLine, setActiveLine] = useState(0);

  async function load() {
    setLoading(true); setError(""); setDone(false);
    setQIdx(0); setScore(0); setReadDone(false); setActiveLine(0);
    try { setData(await generatePoem(activeChild)); }
    catch { setError("Couldn't load poem. Try again."); }
    finally { setLoading(false); }
  }

  useEffect(() => { if (activeChild) load(); }, [activeChild]);

  const questions = data?.questions ?? [];
  const xpEarned  = score * 5 + (score === questions.length ? 5 : 0);

  return (
    <ActivityShell
      emoji="🎵" title="Poem" topic={data?.title ?? ""}
      score={score} total={questions.length}
      xpEarned={xpEarned}
      loading={loading} error={error} onRetry={load}
      done={done} onDone={() => onXP?.(xpEarned, "poem", score === questions.length)}
    >
      {data && !readDone && (
        <div>
          <div className={styles.poemCard}>
            <div className={styles.poemHeader}>
              <span className={styles.poemEmoji}>{data.emoji}</span>
              <h2 className={styles.poemTitle}>{data.title}</h2>
              <span className={styles.poemTheme}>{data.theme}</span>
            </div>
            <div className={styles.poemLines}>
              {data.lines.map((line, i) => (
                <p
                  key={i}
                  className={`${styles.poemLine} ${i === activeLine ? styles.poemLineActive : ""}`}
                  onClick={() => setActiveLine(i)}
                >
                  {line}
                </p>
              ))}
            </div>
            {data.funActivity && (
              <div className={styles.funActivity}>
                🎯 <strong>Fun:</strong> {data.funActivity}
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