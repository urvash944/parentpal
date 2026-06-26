import { callGrok, parseJSON } from "./grokService";

export async function generateAnimals(child) {
  const system = `You are a fun children's animal teacher.
Respond ONLY with valid JSON. No markdown, no extra text.`;

  const user = `Create an animal learning activity for a ${child.age}-year-old.

Return this exact JSON:
{
  "topic": "Animal World",
  "emoji": "🐾",
  "questions": [
    {
      "question": "question text e.g. How many elephants? 🐘🐘🐘",
      "animalEmojis": "repeated emojis string e.g. 🐘🐘🐘",
      "options": ["1","2","3","4"],
      "answer": "3",
      "hint": "Count the animals one by one!",
      "animalFact": "one fun fact about this animal"
    }
  ]
}

CRITICAL RULES:
- answer must EXACTLY match one of the options as a string
- For counting questions: options are number strings like "1","2","3","4" and answer is the correct number string
- For identification questions: options are animal names and answer is the exact animal name
- NEVER use index numbers as answers
- Make exactly 5 questions.`;

  const raw = await callGrok(system, user, 700);
  return parseJSON(raw);
}