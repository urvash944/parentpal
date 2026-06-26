import { callGrok, parseJSON } from "./grokService";

export async function generatePoem(child) {
  const system = `You are a children's poetry teacher.
Respond ONLY with valid JSON. No markdown, no extra text.`;

  const user = `Write an age-appropriate poem for a ${child.age}-year-old at ${child.level?.label ?? "Beginner"} level.

Return this exact JSON:
{
  "title": "poem title",
  "theme": "nature|animals|adventure|friendship",
  "emoji": "one relevant emoji",
  "lines": [
    "line 1 of poem",
    "line 2 of poem",
    "line 3 of poem",
    "line 4 of poem",
    "line 5 of poem",
    "line 6 of poem"
  ],
  "questions": [
    {
      "q": "question about the poem",
      "options": ["A","B","C","D"],
      "answer": "A"
    },
    {
      "q": "another question about the poem",
      "options": ["A","B","C","D"],
      "answer": "B"
    }
  ],
  "rhymeScheme": "AABB or ABAB",
  "funActivity": "one simple activity to do with this poem e.g. clap on rhyming words"
}

Keep lines short and rhythmic. Make questions fun and simple.`;

  const raw = await callGrok(system, user, 800);
  return parseJSON(raw);
}