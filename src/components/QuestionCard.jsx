import { useState } from "react";
import styles from "./QuestionCard.module.css";

export default function QuestionCard({
  question, options, answer, hint, explanation,
  onCorrect, onWrong, questionNum, total,
}) {
  const normAnswer  = (answer ?? "").toString().trim();
  const normOptions = (options ?? []).map((o) => (o ?? "").toString().trim());

  const [selected, setSelected]   = useState(null);
  const [revealed, setRevealed]   = useState(false);
  const [showHint, setShowHint]   = useState(false);

  function handleSelect(opt) {
    if (revealed) return;
    setSelected(opt);
    setRevealed(true);
    setShowHint(false); // hide hint after answering
    if (opt.trim().toLowerCase() === normAnswer.toLowerCase()) {
      onCorrect?.();
    } else {
      onWrong?.();
    }
  }

  const isCorrect = revealed && selected?.trim().toLowerCase() === normAnswer.toLowerCase();

  return (
    <div className={styles.card}>
      <div className={styles.topRow}>
        <span className={styles.qNum}>Q{questionNum}/{total}</span>
        {hint && !revealed && (
          <button
            className={styles.hintBtn}
            onClick={() => setShowHint((p) => !p)}
          >
            💡 {showHint ? "Hide Hint" : "Hint"}
          </button>
        )}
      </div>

      <p className={styles.question}>{question}</p>

      {/* Hint — only shows before answering */}
      {showHint && !revealed && (
        <div className={styles.hint}>💡 {hint}</div>
      )}

      <div className={styles.options}>
        {normOptions.map((opt) => {
          const isThisCorrect = opt.toLowerCase() === normAnswer.toLowerCase();
          const isThisSelected = opt === selected;
          let cls = styles.option;
          if (revealed) {
            if (isThisCorrect)           cls = `${styles.option} ${styles.correct}`;
            else if (isThisSelected)     cls = `${styles.option} ${styles.wrong}`;
            else                         cls = `${styles.option} ${styles.dim}`;
          }
          return (
            <button key={opt} className={cls} onClick={() => handleSelect(opt)}>
              {opt}
              {revealed && isThisCorrect && <span className={styles.tick}> ✓</span>}
              {revealed && isThisSelected && !isThisCorrect && <span className={styles.cross}> ✗</span>}
            </button>
          );
        })}
      </div>

      {revealed && (
        <div className={`${styles.feedback} ${isCorrect ? styles.feedbackGood : styles.feedbackBad}`}>
          {isCorrect ? "🎉 Correct! Well done!" : `❌ Not quite. The answer is: ${normAnswer}`}
        </div>
      )}

      {/* Explanation — only shows AFTER answering */}
      {revealed && explanation && (
        <div className={styles.explanationBox}>
          💡 {explanation}
        </div>
      )}
    </div>
  );
}