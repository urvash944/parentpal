import { callGrok, parseJSON } from "./grokService";

export async function generateSession(child) {
  const { age, level, name } = child;
  const levelLabel = level?.label ?? "Beginner";

  const ageContext = age <= 5
    ? "very simple activities with emojis, counting, basic shapes and colors"
    : age <= 7
    ? "simple reading, basic math, word building, fun games"
    : age <= 9
    ? "reading comprehension, multiplication, vocabulary, logic activities"
    : "advanced reading, complex math, problem solving, critical thinking";

  const system = `You are an expert children's education planner.
Respond ONLY with valid JSON. No markdown, no extra text.`;

  const user = `Create a learning session for:
- Child name: ${name}
- Age: ${age} years old
- Learning level: ${levelLabel}
- Age-appropriate content: ${ageContext}

The session MUST be perfectly calibrated for a ${age}-year-old child.
Not too easy, not too hard — just right for age ${age}.

Return this exact JSON:
{
  "sessionTitle": "engaging session title for age ${age}",
  "totalMinutes": 20,
  "activities": [
    {
      "id": "reading",
      "type": "reading",
      "emoji": "📖",
      "title": "age-appropriate reading title",
      "description": "one engaging sentence about this activity",
      "minutes": 5,
      "xp": 20,
      "difficulty": "${age <= 5 ? "easy" : age <= 8 ? "medium" : "hard"}"
    },
    {
      "id": "math",
      "type": "math",
      "emoji": "🔢",
      "title": "age-appropriate math title",
      "description": "one engaging sentence",
      "minutes": 5,
      "xp": 20,
      "difficulty": "${age <= 5 ? "easy" : age <= 8 ? "medium" : "hard"}"
    },
    {
      "id": "vocab",
      "type": "vocab",
      "emoji": "📝",
      "title": "age-appropriate vocab title",
      "description": "one engaging sentence",
      "minutes": 5,
      "xp": 15,
      "difficulty": "${age <= 5 ? "easy" : age <= 8 ? "medium" : "hard"}"
    },
    {
      "id": "fun",
      "type": "fun",
      "emoji": "🎉",
      "title": "fun activity title for age ${age}",
      "description": "one engaging sentence",
      "minutes": 5,
      "xp": 25,
      "difficulty": "${age <= 5 ? "easy" : age <= 8 ? "medium" : "hard"}"
    }
  ],
  "encouragement": "short motivational message for ${name} aged ${age}"
}`;

  const raw = await callGrok(system, user, 800);
  const parsed = parseJSON(raw);
  if (!parsed) throw new Error("Failed to parse session from Grok.");
  return parsed;
}