// XP needed to reach the NEXT level
export const XP_THRESHOLDS = [0, 200, 500, 1000, 2000, 9999];

export function xpForCurrentLevel(level) {
  return XP_THRESHOLDS[level - 1] ?? 0;
}

export function xpForNextLevel(level) {
  return XP_THRESHOLDS[level] ?? 9999;
}

export function xpProgress(xp, level) {
  const start = xpForCurrentLevel(level);
  const end   = xpForNextLevel(level);
  const range = end - start;
  const earned = xp - start;
  return Math.min(100, Math.max(0, Math.round((earned / range) * 100)));
}

export function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}