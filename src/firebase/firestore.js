import {
  doc, setDoc, getDoc, updateDoc,
  arrayUnion, collection, addDoc, serverTimestamp
} from "firebase/firestore";
import { db } from "./config";
import { v4 as uuid } from "uuid"; // install below


export async function createUserDoc(user) {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || "",
      createdAt: serverTimestamp(),
      children: [],
    });
  }
}

export async function getUserDoc(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
}

export async function addChild(uid, childData) {
  const child = {
    childId: uuid(),
    name: childData.name,
    age: childData.age,
    avatar: childData.avatar,
    level: getLevel(childData.age),
    xp: 0,
    coins: 0,
    streak: 0,
    badges: [],
    unlockedAvatars: ["🦄"],
    activityCounts: {},
    lastActiveDate: null,
    lastSession: null,
    createdAt: new Date().toISOString(),
  };
  await updateDoc(doc(db, "users", uid), {
    children: arrayUnion(child),
  });
  return child;
}
export async function updateChild(uid, updatedChild) {
  const userData = await getUserDoc(uid);
  const updated = userData.children.map((c) =>
    c.childId === updatedChild.childId ? { ...c, ...updatedChild } : c
  );
  await updateDoc(doc(db, "users", uid), { children: updated });
}

export async function deleteChild(uid, childId) {
  const userData = await getUserDoc(uid);
  const updated = userData.children.filter((c) => c.childId !== childId);
  await updateDoc(doc(db, "users", uid), { children: updated });
}

export async function updateChildXP(uid, childId, xpToAdd, coinsToAdd = 0) {
  const userData = await getUserDoc(uid);
  const updated = userData.children.map((c) => {
    if (c.childId !== childId) return c;
    const newXP = (c.xp || 0) + xpToAdd;
    return {
      ...c,
      xp: newXP,
      coins: (c.coins || 0) + coinsToAdd,
      level: getLevelFromXP(newXP),
    };
  });
  await updateDoc(doc(db, "users", uid), { children: updated });
}

// Age → Level label
export function getLevel(age) {
  if (age <= 5) return { num: 1, label: "Beginner",  color: "#6BCB77" };
  if (age <= 7) return { num: 2, label: "Explorer",  color: "#4D96FF" };
  if (age <= 9) return { num: 3, label: "Learner",   color: "#FFD93D" };
  return            { num: 4, label: "Champion",  color: "#FF6B6B" };
}

// XP → Level progression
export function getLevelFromXP(xp) {
  if (xp < 200)  return 1;
  if (xp < 500)  return 2;
  if (xp < 1000) return 3;
  if (xp < 2000) return 4;
  return 5;
}
export async function saveSession(uid, childId, sessionData) {
  const ref = collection(db, "sessions");
  const doc_ = await addDoc(ref, {
    uid,
    childId,
    date: new Date().toISOString(),
    sessionTitle: sessionData.sessionTitle,
    totalMinutes: sessionData.totalMinutes,
    activitiesCompleted: sessionData.activitiesCompleted,
    xpEarned: sessionData.xpEarned,
    coinsEarned: sessionData.coinsEarned,
    createdAt: serverTimestamp(),
  });
  return doc_.id;
}
export async function recordGameResult(uid, childId, gameId, score, total, xp, coins) {
  const wasPerfect = total > 0 && score === total;
  const result = await recordActivityCompletion(uid, childId, gameId.includes("animal") ? "animals" : "game", xp, wasPerfect);

  // Add coins separately (recordActivityCompletion doesn't add coins)
  const userData = await getUserDoc(uid);
  const child = userData.children.find((c) => c.childId === childId);
  await updateChild(uid, { ...child, coins: (child.coins || 0) + coins });

  const ref = collection(db, "gameResults");
  await addDoc(ref, {
    uid, childId, gameId, score, total, xp, coins,
    date: new Date().toISOString(),
    createdAt: serverTimestamp(),
  });

  return result;
}
import { LEVEL_INFO, BADGES } from "../utils/constants";

// ── Activity counters & streak tracking ──
export async function recordActivityCompletion(uid, childId, activityType, xpEarned, wasPerfect = false) {
  const userData = await getUserDoc(uid);
  const child = userData.children.find((c) => c.childId === childId);
  if (!child) return null;

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const lastActive = child.lastActiveDate;

  // ── Streak logic ──
  let newStreak = child.streak || 0;
  if (lastActive !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    if (lastActive === yesterday) {
      newStreak += 1; // consecutive day
    } else {
      newStreak = 1; // streak broken, restart
    }
  }

  // ── Activity counters ──
  const counters = { ...(child.activityCounts || {}) };
  counters[activityType] = (counters[activityType] || 0) + 1;

  // ── XP / Level ──
  const newXP = (child.xp || 0) + xpEarned;
  const newLevelNum = getLevelFromXP(newXP);

  // ── Badge checks ──
  const earnedBadges = new Set(child.badges || []);
  for (const badge of BADGES) {
    if (earnedBadges.has(badge.id)) continue;
    let qualifies = false;
    if (badge.type === "streak" && newStreak >= badge.target) qualifies = true;
    else if (badge.type === "xp" && newXP >= badge.target) qualifies = true;
    else if (badge.type === "perfect" && wasPerfect) qualifies = true;
    else if (counters[badge.type] >= badge.target) qualifies = true;

    if (qualifies) earnedBadges.add(badge.id);
  }

  const updatedChild = {
    ...child,
    xp: newXP,
    level: { num: newLevelNum, label: LEVEL_INFO[newLevelNum]?.label, color: LEVEL_INFO[newLevelNum]?.color },
    streak: newStreak,
    lastActiveDate: today,
    activityCounts: counters,
    badges: Array.from(earnedBadges),
  };

  await updateChild(uid, updatedChild);

  return {
    updatedChild,
    newBadges: Array.from(earnedBadges).filter((b) => !(child.badges || []).includes(b)),
    leveledUp: newLevelNum > (child.level?.num || 1),
    newLevelNum,
    streakChanged: newStreak !== (child.streak || 0),
  };
}

// ── Coin shop: unlock avatar ──
export async function unlockAvatar(uid, childId, avatarEmoji, cost) {
  const userData = await getUserDoc(uid);
  const child = userData.children.find((c) => c.childId === childId);
  if (!child) return null;
  if ((child.coins || 0) < cost) return { error: "not_enough_coins" };

  const unlocked = new Set(child.unlockedAvatars || ["🦄"]);
  unlocked.add(avatarEmoji);

  const updatedChild = {
    ...child,
    coins: (child.coins || 0) - cost,
    unlockedAvatars: Array.from(unlocked),
  };
  await updateChild(uid, updatedChild);
  return { updatedChild };
}

// ── Set active avatar ──
export async function setChildAvatar(uid, childId, avatarEmoji) {
  const userData = await getUserDoc(uid);
  const child = userData.children.find((c) => c.childId === childId);
  if (!child) return null;
  const updatedChild = { ...child, avatar: avatarEmoji };
  await updateChild(uid, updatedChild);
  return updatedChild;
}
