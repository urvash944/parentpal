import { useState, useEffect } from "react";
import { useChild }      from "../../../context/ChildContext";
import { generateAnimals } from "../../../api/animalsAPI";
import ActivityShell     from "../../../components/ActivityShell";
import QuestionCard      from "../../../components/QuestionCard";
import styles from "./Activity.module.css";

export default function AnimalsActivity({ onXP, onBack }) {
  const { activeChild }       = useChild();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [qIdx, setQIdx]       = useState(0);
  const [score, setScore]     = useState(0);
  const [done, setDone]       = useState(false);

  async function load() {
    setLoading(true); setError(""); setDone(false); setQIdx(0); setScore(0);
    try { setData(await generateAnimals(activeChild)); }
    catch { setError("Couldn't load animal activity. Try again."); }
    finally { setLoading(false); }
  }

  useEffect(() => { if (activeChild) load(); }, [activeChild]);

  const questions = data?.questions ?? [];
  const xpEarned  = score * 3 + (score === questions.length ? 10 : 0);

  return (
    <ActivityShell
      emoji="🐾" title="Animals" topic={data?.topic ?? "Animal World"}
      score={score} total={questions.length}
      xpEarned={xpEarned}
      loading={loading} error={error} onRetry={load}
      done={done} onDone={() => onXP?.(xpEarned, "animals", score === questions.length)}
      onBack={onBack}
    >
      {data && !done && questions[qIdx] && (
        <div>
          {questions[qIdx].animalEmojis && (
            <div className={styles.animalDisplay}>
              <p className={styles.animalEmojis}>{questions[qIdx].animalEmojis}</p>
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
          {questions[qIdx].animalFact && (
            <div className={styles.funFact}>🐾 {questions[qIdx].animalFact}</div>
          )}
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