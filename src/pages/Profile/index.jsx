import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useChild } from "../../context/ChildContext";
import { deleteChild } from "../../firebase/firestore";
import { logout } from "../../firebase/auth";
import { LEVEL_INFO } from "../../utils/constants";
import { getLevel } from "../../firebase/firestore";
import styles from "./Profile.module.css";

export default function Profile() {
  const { user, userData } = useAuth();
  const { activeChild, setActiveChild, childList } = useChild();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(null);

  async function handleDelete(childId) {
    if (!window.confirm("Remove this child profile?")) return;
    setDeleting(childId);
    await deleteChild(user.uid, childId);
    window.location.reload();
  }

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className={styles.page}>
      {/* Parent Info */}
      <div className={styles.parentCard}>
        <div className={styles.parentAvatar}>
          {user?.displayName?.[0]?.toUpperCase() || "P"}
        </div>
        <div>
          <p className={styles.parentName}>{user?.displayName || "Parent"}</p>
          <p className={styles.parentEmail}>{user?.email}</p>
        </div>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Sign Out
        </button>
      </div>
      


{activeChild && (
  <button className={styles.analyticsBtn} onClick={() => navigate("/analytics")}>
    <span className={styles.analyticsIcon}>📊</span>
    <div className={styles.analyticsText}>
      <p className={styles.analyticsTitle}>Progress Analytics</p>
      <p className={styles.analyticsSub}>View {activeChild.name}'s learning progress</p>
    </div>
    <span className={styles.analyticsArrow}>→</span>
  </button>
)}
      {/* Children */}
      <div className={styles.sectionHeader}>
        <p className={styles.sectionTitle}>👦 Children</p>
        {childList.length < 4 && (
          <button
            className={styles.addBtn}
            onClick={() => navigate("/add-child")}
          >
            + Add
          </button>
        )}
      </div>

      {childList.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyEmoji}>👶</p>
          <p className={styles.emptyText}>No children added yet.</p>
          <button
            className={styles.btnPrimary}
            onClick={() => navigate("/add-child")}
          >
            Add First Child
          </button>
        </div>
      ) : (
        <div className={styles.childList}>
          {childList.map((child) => {
            const lvl = LEVEL_INFO[child.level?.num || getLevel(child.age).num];
            const isActive = activeChild?.childId === child.childId;
            return (
              <div
                key={child.childId}
                className={`${styles.childCard} ${isActive ? styles.childActive : ""}`}
                onClick={() => setActiveChild(child)}
              >
                <div className={styles.childAvatar}>{child.avatar}</div>
                <div className={styles.childInfo}>
                  <p className={styles.childName}>{child.name}</p>
                  <p className={styles.childMeta}>
                    Age {child.age} &nbsp;·&nbsp;
                    <span style={{ color: lvl?.color }}>
                      {lvl?.emoji} {lvl?.label}
                    </span>
                  </p>
                  <div className={styles.statRow}>
                    <span className={styles.stat}>⚡ {child.xp || 0} XP</span>
                    <span className={styles.stat}>🪙 {child.coins || 0}</span>
                    <span className={styles.stat}>🔥 {child.streak || 0}</span>
                  </div>
                </div>
                <div className={styles.childActions}>
                  {isActive && (
                    <span className={styles.activeBadge}>Active</span>
                  )}
                  <button
                    className={styles.deleteBtn}
                    onClick={(e) => { e.stopPropagation(); handleDelete(child.childId); }}
                    disabled={deleting === child.childId}
                  >
                    🗑
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}