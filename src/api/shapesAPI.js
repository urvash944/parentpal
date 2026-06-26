import { callGrok, parseJSON } from "./grokService";

export async function generateShapes(child) {
  const system = `You are a children's shapes teacher.
Respond ONLY with valid JSON. No markdown, no extra text.`;

  const user = `Create a shapes activity for a ${child.age}-year-old.

Return this exact JSON:
{
  "topic": "Shape Fun",
  "emoji": "🔷",
  "questions": [
    {
      "question": "question text",
      "shapeEmoji": "emoji representing a shape e.g. 🔴 🟡 🟦 🔺 ⬛",
      "options": ["Circle","Square","Triangle","Rectangle"],
      "answer": "Circle",
      "hint": "hint text",
      "funFact": "one fun fact about this shape"
    }
  ]
}

Make exactly 5 questions. Use shape emojis. Mix identification, counting, and matching questions.`;

  const raw = await callGrok(system, user, 700);
  return parseJSON(raw);
}