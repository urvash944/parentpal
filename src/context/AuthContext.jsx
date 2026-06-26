import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import { createUserDoc } from "../firebase/firestore";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]         = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    let unsubSnapshot = null;

    const unsubAuth = onAuthStateChanged(auth, async (u) => {
      if (u) {
        await createUserDoc(u);
        setUser(u);

        // ── Real-time Firestore listener ──
        // This fires every time the user document changes in Firestore
        // So when XP/coins/badges update → userData updates automatically
        const userRef = doc(db, "users", u.uid);
        unsubSnapshot = onSnapshot(userRef, (snap) => {
          if (snap.exists()) {
            setUserData(snap.data());
          }
        });

      } else {
        setUser(null);
        setUserData(null);
        if (unsubSnapshot) {
          unsubSnapshot(); // stop listening on logout
          unsubSnapshot = null;
        }
      }
      setLoading(false);
    });

    return () => {
      unsubAuth();
      if (unsubSnapshot) unsubSnapshot();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);