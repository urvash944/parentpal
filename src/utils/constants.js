export const AVATARS = [
  "🦁", "🐯", "🐻", "🦊", "🐼", "🐨",
  "🐸", "🦋", "🐬", "🦄", "🐲", "🌟",
];

// Shop avatars — unlockable with coins
export const SHOP_AVATARS = [
  { emoji: "🦄", cost: 0,   label: "Unicorn" },     // free starter
  { emoji: "🐉", cost: 50,  label: "Dragon" },
  { emoji: "🦖", cost: 50,  label: "Dino" },
  { emoji: "🚀", cost: 75,  label: "Rocket" },
  { emoji: "👑", cost: 100, label: "Crown" },
  { emoji: "🦸", cost: 100, label: "Superhero" },
  { emoji: "🌈", cost: 75,  label: "Rainbow" },
  { emoji: "🎩", cost: 60,  label: "Top Hat" },
  { emoji: "💎", cost: 150, label: "Diamond" },
  { emoji: "🏆", cost: 200, label: "Trophy" },
  { emoji: "🧙", cost: 120, label: "Wizard" },
  { emoji: "🎮", cost: 90,  label: "Gamer" },
];

export const LEVEL_INFO = {
  1: { label: "Beginner",  color: "#6BCB77", bg: "#EBF9EE", emoji: "🌱", ageRange: "3–5",  focus: ["Shapes","Colors","Counting","Alphabet","Animals"] },
  2: { label: "Explorer",  color: "#4D96FF", bg: "#EBF4FF", emoji: "🔭", ageRange: "5–7",  focus: ["Reading","Word Building","Addition","Poems"] },
  3: { label: "Learner",   color: "#E8A020", bg: "#FFF8EB", emoji: "📖", ageRange: "7–9",  focus: ["Comprehension","Multiplication","Vocabulary"] },
  4: { label: "Champion",  color: "#FF6B6B", bg: "#FFF0F0", emoji: "🏆", ageRange: "9–12", focus: ["Problem Solving","Advanced Math","Logic"] },
  5: { label: "Legend",    color: "#6C63FF", bg: "#EAE8FF", emoji: "⭐", ageRange: "12+",  focus: ["All topics mastered"] },
};

export const XP_REWARDS = {
  reading:   20,
  math:      20,
  vocab:     15,
  poem:      15,
  game:      25,
  session:   10,
};

export const BADGES = [
  { id: "reading_star",   emoji: "📚", label: "Reading Star",   desc: "Complete 5 reading activities",  type: "reading",  target: 5 },
  { id: "math_master",    emoji: "🔢", label: "Math Master",    desc: "Complete 5 math activities",     type: "math",     target: 5 },
  { id: "animal_expert",  emoji: "🐘", label: "Animal Expert",  desc: "Complete 5 animal activities/games", type: "animals", target: 5 },
  { id: "creative_kid",   emoji: "🎨", label: "Creative Kid",   desc: "Complete 3 poems",                type: "poem",     target: 3 },
  { id: "streak_hero",    emoji: "🔥", label: "Streak Hero",    desc: "Achieve a 7-day streak",          type: "streak",   target: 7 },
  { id: "quiz_champion",  emoji: "🏆", label: "Quiz Champion",  desc: "Score 100% in any activity",      type: "perfect",  target: 1 },
  { id: "super_learner",  emoji: "🎖", label: "Super Learner",  desc: "Earn 500 XP total",               type: "xp",       target: 500 },
];

// Streak milestone definitions
export const STREAK_MILESTONES = [
  { days: 1,   label: "1 Day",   emoji: "🔥" },
  { days: 7,   label: "7 Days",  emoji: "🔥🔥" },
  { days: 14,  label: "14 Days", emoji: "🔥🔥🔥" },
  { days: 30,  label: "30 Days", emoji: "⚡🔥" },
  { days: 100, label: "100 Days",emoji: "👑🔥" },
];