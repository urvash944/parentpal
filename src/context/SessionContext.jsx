import { createContext, useContext, useState } from "react";

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [session, setSession]           = useState(null);   // generated session plan
  const [currentIdx, setCurrentIdx]     = useState(0);      // which activity we're on
  const [completed, setCompleted]       = useState([]);     // completed activity ids
  const [sessionDone, setSessionDone]   = useState(false);
  const [totalXP, setTotalXP]           = useState(0);

 function completeActivity(activityId, xp) {
  console.log("Button clicked");

  setCompleted((prev) => [...prev, activityId]);
  setTotalXP((prev) => prev + xp);

  const lastIndex = (session?.activities?.length ?? 0) - 1;

  console.log("Current Index:", currentIdx);
  console.log("Last Index:", lastIndex);

  if (currentIdx === lastIndex) {
    console.log("Session Complete");
    setSessionDone(true);
  } else {
    console.log("Moving to next activity");
    setCurrentIdx((prev) => prev + 1);
  }
}

  function resetSession() {
    setSession(null);
    setCurrentIdx(0);
    setCompleted([]);
    setSessionDone(false);
    setTotalXP(0);
  }

  return (
    <SessionContext.Provider
      value={{
        session, setSession,
        currentIdx, completed,
        sessionDone, totalXP,
        completeActivity, resetSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => useContext(SessionContext);