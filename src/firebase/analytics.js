import {
  collection, query, where, orderBy, getDocs, limit,
} from "firebase/firestore";
import { db } from "./config";

// Fetch all sessions for a child
export async function getChildSessions(uid, childId) {
  const ref = collection(db, "sessions");
  const q = query(ref, where("uid", "==", uid), where("childId", "==", childId), orderBy("createdAt", "desc"), limit(100));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// Fetch all game results for a child
export async function getChildGameResults(uid, childId) {
  const ref = collection(db, "gameResults");
  const q = query(ref, where("uid", "==", uid), where("childId", "==", childId), orderBy("createdAt", "desc"), limit(100));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// Combine and compute analytics
export function computeAnalytics(sessions, gameResults) {
  const now = new Date();
  const sevenDaysAgo = new Date(now - 7 * 86400000);
  const thirtyDaysAgo = new Date(now - 30 * 86400000);

  // ── Weekly activity count (last 7 days) ──
  const weekDays = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now - i * 86400000);
    weekDays.push({
      date: d.toISOString().split("T")[0],
      label: d.toLocaleDateString("en-US", { weekday: "short" }),
      count: 0,
      xp: 0,
    });
  }

  const allActivities = [
    ...sessions.map((s) => ({ ...s, kind: "session", date: s.date })),
    ...gameResults.map((g) => ({ ...g, kind: "game", date: g.date })),
  ];

  for (const a of allActivities) {
    const dateStr = a.date?.split("T")[0];
    const day = weekDays.find((w) => w.date === dateStr);
    if (day) {
      day.count += 1;
      day.xp += a.xpEarned ?? a.xp ?? 0;
    }
  }

  // ── Monthly totals ──
  const monthActivities = allActivities.filter((a) => new Date(a.date) >= thirtyDaysAgo);
  const totalActivitiesMonth = monthActivities.length;
  const totalXPMonth = monthActivities.reduce((s, a) => s + (a.xpEarned ?? a.xp ?? 0), 0);
  const totalMinutesMonth = sessions
    .filter((s) => new Date(s.date) >= thirtyDaysAgo)
    .reduce((s, a) => s + (a.totalMinutes || 0), 0);

  // ── Subject scores (0-100, based on activity completion in sessions) ──
  // Heuristic: each completed session activity of a given type contributes to score
  const subjectCounts = { reading: 0, math: 0, vocab: 0 };
  const subjectXP = { reading: 0, math: 0, vocab: 0 };

  for (const s of sessions) {
    const completedTypes = s.activitiesCompleted || [];
    for (const id of completedTypes) {
      if (id.includes("reading")) { subjectCounts.reading++; subjectXP.reading += 20; }
      if (id.includes("math"))    { subjectCounts.math++;    subjectXP.math    += 20; }
      if (id.includes("vocab"))   { subjectCounts.vocab++;   subjectXP.vocab   += 15; }
    }
  }

  // Score = min(100, count * 10) — simple growth curve, caps at 100
  const subjectScores = {
    reading: Math.min(100, subjectCounts.reading * 10),
    math:    Math.min(100, subjectCounts.math * 10),
    vocab:   Math.min(100, subjectCounts.vocab * 10),
  };

  // ── Recent activity timeline (last 10) ──
  const timeline = allActivities
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

  return {
    weekDays,
    totalActivitiesMonth,
    totalXPMonth,
    totalMinutesMonth,
    subjectScores,
    subjectCounts,
    timeline,
    totalActivitiesAllTime: allActivities.length,
  };
}