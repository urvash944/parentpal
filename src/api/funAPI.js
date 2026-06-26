import { callGrok, parseJSON } from "./grokService";

export async function generateFunActivity(child) {
  const system = `You are a fun children's activity designer.
Respond ONLY with valid JSON. No markdown, no extra text.`;

  const user = `Create a fun educational activity for a ${child.age}-year-old.

Return this exact JSON:
{
  "topic": "Fun Learning",
  "emoji": "🎉",
  "questions": [
    {
      "question": "a fun question appropriate for age ${child.age}",
      "options": ["option A", "option B", "option C", "option D"],
      "answer": "option A",
      "hint": "helpful clue without revealing answer"
    }
  ]
}

CRITICAL RULES:
- answer must EXACTLY match one of the options word for word
- Make exactly 5 fun, creative questions
- Mix riddles, general knowledge, creative thinking
- Keep it age appropriate for a ${child.age} year old
- Options should be words/phrases, NOT numbers unless question is about counting`;

  const raw = await callGrok(system, user, 700);
  return parseJSON(raw);
}