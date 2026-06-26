import { callGrok, parseJSON } from "./grokService";

export async function generateVocab(child) {
  const levelLabel = child.level?.label ?? "Beginner";

  const typeMap = {
    Beginner:  "simple 3-4 letter words with pictures described in text",
    Explorer:  "word building and missing letters",
    Learner:   "synonyms and antonyms",
    Champion:  "advanced vocabulary with definitions and usage",
  };
  const focus = typeMap[levelLabel] ?? typeMap.Beginner;

  const system = `You are a children's vocabulary teacher.
Respond ONLY with valid JSON. No markdown, no extra text.`;

  const user = `Create a vocabulary activity for a ${child.age}-year-old focused on ${focus}.

Return this exact JSON:
{
  "topic": "topic name",
  "emoji": "one relevant emoji",
  "activityType": "missing-letter|matching|mcq",
  "questions": [
    {
      "question": "question text",
      "display": "visual like A_PLE or word to match",
      "options": ["option1","option2","option3","option4"],
      "answer": "option1",
      "hint": "helpful hint",
      "emoji": "relevant emoji"
    }
  ]
}

Make exactly 5 questions. Keep language simple and fun.`;

  const raw = await callGrok(system, user, 900);
  return parseJSON(raw);
}