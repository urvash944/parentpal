import { NavLink } from "react-router-dom";
import styles from "./BottomNav.module.css";

const tabs = [
  { to: "/",        icon: "🏠", label: "Home"    },
  { to: "/learn",   icon: "📚", label: "Learn"   },
  { to: "/games",   icon: "🎮", label: "Games"   },
  { to: "/rewards", icon: "🏆", label: "Rewards" },
  { to: "/profile", icon: "👤", label: "Profile" },
];

export default function BottomNav() {
  return (
    <nav className={styles.nav}>
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === "/"}
          className={({ isActive }) =>
            `${styles.tab} ${isActive ? styles.active : ""}`
          }
        >
          <span className={styles.icon}>{tab.icon}</span>
          <span className={styles.label}>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}