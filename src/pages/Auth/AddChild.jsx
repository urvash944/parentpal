import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { addChild, getLevel } from "../../firebase/firestore";
import { AVATARS, LEVEL_INFO } from "../../utils/constants";
import styles from "./AddChild.module.css";

export default function AddChild({ isOnboarding = true }) {
  const { user, userData } = useAuth();
  const navigate = useNavigate();

  const [name, setName]     = useState("");
  const [age, setAge]       = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  const levelInfo = age ? getLevel(Number(age)) : null;

  async function handleSubmit() {
    if (!name.trim()) { setError("Please enter your child's name."); return; }
    if (!age || age < 3 || age > 12) { setError("Please enter an age between 3 and 12."); return; }

    setLoading(true);
    try {
      await addChild(user.uid, { name: name.trim(), age: Number(age), avatar });
      // Reload user data by refreshing — AuthContext will re-fetch on next auth state
      window.location.href = "/";
    } catch (e) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        {!isOnboarding && (
          <button className={styles.back} onClick={() => navigate(-1)}>← Back</button>
        )}
        <h1 className={styles.pageTitle}>
          {isOnboarding ? "👶 Add Your Child" : "➕ New Child Profile"}
        </h1>
        {isOnboarding && (
          <p className={styles.pageSubtitle}>Set up your child's learning profile</p>
        )}
      </div>

      <div className={styles.section}>
        <p className={styles.sectionLabel}>Choose an Avatar</p>
        <div className={styles.avatarGrid}>
          {AVATARS.map((av) => (
            <button
              key={av}
              className={`${styles.avatarBtn} ${avatar === av ? styles.avatarSelected : ""}`}
              onClick={() => setAvatar(av)}
            >
              {av}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <p className={styles.sectionLabel}>Child's Name</p>
        <input
          className={styles.input}
          type="text"
          placeholder="e.g. Arjun"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={20}
        />
      </div>

      <div className={styles.section}>
        <p className={styles.sectionLabel}>Age</p>
        <div className={styles.ageRow}>
          {[3,4,5,6,7,8,9,10,11,12].map((a) => (
            <button
              key={a}
              className={`${styles.ageBtn} ${Number(age) === a ? styles.ageSelected : ""}`}
              onClick={() => setAge(a)}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {levelInfo && (
        <div className={styles.levelPreview} style={{ background: LEVEL_INFO[levelInfo.num]?.bg, borderColor: levelInfo.color }}>
          <span className={styles.levelEmoji}>{LEVEL_INFO[levelInfo.num]?.emoji}</span>
          <div>
            <p className={styles.levelName} style={{ color: levelInfo.color }}>
              Level {levelInfo.num} — {levelInfo.label}
            </p>
            <p className={styles.levelFocus}>
              Focus: {LEVEL_INFO[levelInfo.num]?.focus.join(", ")}
            </p>
          </div>
        </div>
      )}

      {error && <p className={styles.error}>{error}</p>}

      <button
        className={styles.btnPrimary}
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Saving…" : isOnboarding ? "Start Learning! 🚀" : "Save Profile"}
      </button>

      {isOnboarding && userData?.children?.length > 0 && (
        <button className={styles.skip} onClick={() => navigate("/")}>
          Skip for now
        </button>
      )}
    </div>
  );
}