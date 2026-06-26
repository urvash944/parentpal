import { useLocation } from "react-router-dom";
import BottomNav from "./BottomNav";
import styles from "./Layout.module.css";

export default function Layout({ children }) {
  const location = useLocation();

  return (
    <div className={styles.layout}>
      <main key={location.pathname} className={`${styles.main} page-fade`}>
        {children}
      </main>
      <BottomNav />
    </div>
  );
}