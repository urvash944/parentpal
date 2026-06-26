import { callGrok, parseJSON } from "./grokService";

export async function generateSession(child) {
  const { age, level, name } = child;
  const levelLabel = level?.label ?? "Beginner";

  const system = `You are an expert children's education planner.
Your job is to generate a structured 20-minute learning session for a child.
Always respond ONLY with valid JSON — no markdown, no explanation, no extra text.`;

  const user = `Create a learning session for:
- Child name: ${name}
- Age: ${age}
- Learning level: ${levelLabel}

Return a JSON object with this exact structure:
{
  "sessionTitle": "string",
  "totalMinutes": 20,
  "activities": [
    {
      "id": "reading",
      "type": "reading",
      "emoji": "📖",
      "title": "string",
      "description": "string (one engaging sentence)",
      "minutes": 5,
      "xp": 20,
      "difficulty": "easy|medium|hard"
    },
    {
      "id": "math",
      "type": "math",
      "emoji": "🔢",
      "title": "string",
      "description": "string",
      "minutes": 5,
      "xp": 20,
      "difficulty": "easy|medium|hard"
    },
    {
      "id": "vocab",
      "type": "vocab",
      "emoji": "📝",
      "title": "string",
      "description": "string",
      "minutes": 5,
      "xp": 15,
      "difficulty": "easy|medium|hard"
    },
    {
      "id": "fun",
      "type": "fun",
      "emoji": "🎉",
      "title": "string",
      "description": "string",
      "minutes": 5,
      "xp": 25,
      "difficulty": "easy|medium|hard"
    }
  ],
  "encouragement": "A short fun motivational message for ${name}"
}

Make titles and descriptions age-appropriate for a ${age}-year-old at ${levelLabel} level.`;

  const raw = await callGrok(system, user, 600);
  const parsed = parseJSON(raw);
  if (!parsed) throw new Error("Failed to parse session from Grok.");
  return parsed;
}