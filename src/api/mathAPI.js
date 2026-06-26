import { callGrok, parseJSON } from "./grokService";

export async function generateMath(child) {
  const levelLabel = child.level?.label ?? "Beginner";
  const age = child.age;

  const typeMap = {
    Beginner:  "counting and simple number recognition (1-10)",
    Explorer:  "addition and subtraction with numbers up to 20",
    Learner:   "multiplication tables and division basics",
    Champion:  "multi-step word problems and fractions",
  };
  const focus = typeMap[levelLabel] ?? typeMap.Beginner;

  const system = `You are a children's math teacher.
Respond ONLY with valid JSON. No markdown, no extra text.`;

  const user = `Create 5 math questions for a ${age}-year-old focused on ${focus}.

Return this exact JSON:
{
  "topic": "topic name",
  "emoji": "one relevant emoji",
  "questions": [
    {
      "question": "question text (use emojis for visual counting if beginner)",
      "options": ["A","B","C","D"],
      "answer": "A",
      "hint": "a helpful clue that guides thinking WITHOUT giving away the answer. Example: 'Think about sharing equally' NOT '12 divided by 4 equals 3'",
      "explanation": "brief explanation shown AFTER they answer"
    }
  ]
}

IMPORTANT: hints must guide thinking, never state the answer directly.
Make exactly 5 questions. Options must be short (numbers or short phrases). Answer must match one of the options exactly.`;

  const raw = await callGrok(system, user, 900);
  return parseJSON(raw);
}