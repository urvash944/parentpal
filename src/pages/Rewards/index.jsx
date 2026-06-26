import { useState } from "react";
import { useAuth }  from "../../context/AuthContext";
import { useChild } from "../../context/ChildContext";
import XPBar from "../../components/XPBar";
import { LEVEL_INFO, BADGES, STREAK_MILESTONES, SHOP_AVATARS } from "../../utils/constants";
import { unlockAvatar, setChildAvatar } from "../../firebase/firestore";
import styles from "./Rewards.module.css";

export default function Rewards() {
  const { user } = useAuth();
  const { activeChild, childList } = useChild();
  const [tab, setTab] = useState("badges"); // badges | shop | streak
  const [shopError, setShopError] = useState("");
  const [unlocking, setUnlocking] = useState(null);

  if (!activeChild) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>🏆 Rewards</h1>
        <div className={styles.noChild}>
          <span className={styles.noChildEmoji}>👶</span>
          <p>Add a child profile to see rewards.</p>
        </div>
      </div>
    );
  }

  const levelNum = activeChild.level?.num ?? 1;
  const lvlInfo  = LEVEL_INFO[levelNum] ?? LEVEL_INFO[1];
  const earnedBadges = activeChild.badges || [];
  const unlockedAvatars = activeChild.unlockedAvatars || ["🦄"];
  const streak = activeChild.streak || 0;
  const coins = activeChild.coins || 0;

  async function handleUnlock(avatar) {
    setShopError("");
    if (coins < avatar.cost) { setShopError("Not enough coins!"); return; }
    setUnlocking(avatar.emoji);
    const result = await unlockAvatar(user.uid, activeChild.childId, avatar.emoji, avatar.cost);
    if (result?.error) setShopError("Not enough coins!");
    setUnlocking(null);
  }

  async function handleSelectAvatar(avatarEmoji) {
    await setChildAvatar(user.uid, activeChild.childId, avatarEmoji);
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>🏆 Rewards</h1>

      {/* Top summary card */}
      <div className={styles.topCard} style={{ borderColor: lvlInfo.color }}>
        <div className={styles.topRow}>
          <span className={styles.topAvatar}>{activeChild.avatar}</span>
          <div className={styles.topInfo}>
            <p className={styles.topName}>{activeChild.name}</p>
            <span className={styles.topLevel} style={{ background: lvlInfo.bg, color: lvlInfo.color }}>
              {lvlInfo.emoji} Level {levelNum} — {lvlInfo.label}
            </span>
          </div>
        </div>
        <div className={styles.xpWrap}>
          <XPBar xp={activeChild.xp ?? 0} level={levelNum} />
        </div>
        <div className={styles.statRow}>
          <div className={styles.statBox}>
            <span className={styles.statEmoji}>🔥</span>
            <span className={styles.statVal}>{streak}</span>
            <span className={styles.statLbl}>Day Streak</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statEmoji}>🪙</span>
            <span className={styles.statVal}>{coins}</span>
            <span className={styles.statLbl}>Coins</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statEmoji}>🎖</span>
            <span className={styles.statVal}>{earnedBadges.length}/{BADGES.length}</span>
            <span className={styles.statLbl}>Badges</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button className={`${styles.tabBtn} ${tab === "badges" ? styles.tabActive : ""}`} onClick={() => setTab("badges")}>🎖 Badges</button>
        <button className={`${styles.tabBtn} ${tab === "streak" ? styles.tabActive : ""}`} onClick={() => setTab("streak")}>🔥 Streak</button>
        <button className={`${styles.tabBtn} ${tab === "shop" ? styles.tabActive : ""}`} onClick={() => setTab("shop")}>🛍 Avatar Shop</button>
      </div>

      {/* Badges tab */}
      {tab === "badges" && (
        <div className={styles.badgeGrid}>
          {BADGES.map((b) => {
            const unlocked = earnedBadges.includes(b.id);
            return (
              <div key={b.id} className={`${styles.badgeCard} ${unlocked ? styles.badgeUnlocked : styles.badgeLocked}`}>
                <span className={styles.badgeEmoji}>{unlocked ? b.emoji : "🔒"}</span>
                <p className={styles.badgeLabel}>{b.label}</p>
                <p className={styles.badgeDesc}>{b.desc}</p>
                {unlocked && <span className={styles.badgeCheck}>✅ Unlocked</span>}
              </div>
            );
          })}
        </div>
      )}

      {/* Streak tab */}
      {tab === "streak" && (
        <div>
          <div className={styles.streakBanner}>
            <span className={styles.streakBig}>🔥</span>
            <p className={styles.streakNum}>{streak}</p>
            <p className={styles.streakLabel}>Day{streak !== 1 ? "s" : ""} in a row!</p>
            <p className={styles.streakSub}>Complete an activity every day to keep your streak alive.</p>
          </div>
          <p className={styles.sectionTitle}>Milestones</p>
          <div className={styles.milestoneList}>
            {STREAK_MILESTONES.map((m) => {
              const reached = streak >= m.days;
              return (
                <div key={m.days} className={`${styles.milestoneCard} ${reached ? styles.milestoneReached : ""}`}>
                  <span className={styles.milestoneEmoji}>{m.emoji}</span>
                  <div className={styles.milestoneInfo}>
                    <p className={styles.milestoneLabel}>{m.label}</p>
                    <p className={styles.milestoneStatus}>{reached ? "Achieved! 🎉" : `${m.days - streak} days to go`}</p>
                  </div>
                  {reached && <span className={styles.milestoneCheck}>✅</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Shop tab */}
      {tab === "shop" && (
        <div>
          <div className={styles.coinBanner}>
            <span className={styles.coinEmoji}>🪙</span>
            <span className={styles.coinAmount}>{coins} Coins</span>
          </div>
          {shopError && <p className={styles.shopError}>{shopError}</p>}
          <div className={styles.shopGrid}>
            {SHOP_AVATARS.map((av) => {
              const owned = unlockedAvatars.includes(av.emoji);
              const isActive = activeChild.avatar === av.emoji;
              return (
                <div key={av.emoji} className={`${styles.shopCard} ${isActive ? styles.shopActive : ""}`}>
                  <span className={styles.shopEmoji}>{av.emoji}</span>
                  <p className={styles.shopLabel}>{av.label}</p>
                  {owned ? (
                    <button
                      className={isActive ? styles.shopEquippedBtn : styles.shopEquipBtn}
                      onClick={() => handleSelectAvatar(av.emoji)}
                      disabled={isActive}
                    >
                      {isActive ? "✅ Equipped" : "Equip"}
                    </button>
                  ) : (
                    <button
                      className={styles.shopBuyBtn}
                      onClick={() => handleUnlock(av)}
                      disabled={unlocking === av.emoji}
                    >
                      {unlocking === av.emoji ? "…" : `🪙 ${av.cost}`}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}