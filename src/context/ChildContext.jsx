import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const ChildContext = createContext(null);

export function ChildProvider({ children }) {
  const { userData } = useAuth();
  const [activeChild, setActiveChild] = useState(null);

  // When user data loads, auto-select the first child
  useEffect(() => {
    if (userData?.children?.length > 0 && !activeChild) {
      setActiveChild(userData.children[0]);
    }
  }, [userData]);

  // Keep activeChild in sync when userData updates (e.g. after XP gain)
  useEffect(() => {
    if (activeChild && userData?.children) {
      const updated = userData.children.find(
        (c) => c.childId === activeChild.childId
      );
      if (updated) setActiveChild(updated);
    }
  }, [userData]);

  const childList = userData?.children || [];

  return (
    <ChildContext.Provider value={{ activeChild, setActiveChild, childList }}>
      {children}
    </ChildContext.Provider>
  );
}

export const useChild = () => useContext(ChildContext);