import { callGrok, parseJSON } from "./grokService";

export async function generateStory(child) {
  const system = `You are a children's story writer. 
Respond ONLY with valid JSON. No markdown, no extra text.`;

  const user = `Write a short story for a ${child.age}-year-old at ${child.level?.label ?? "Beginner"} level.

Return this exact JSON:
{
  "title": "Story title",
  "type": "animal|moral|adventure",
  "emoji": "one relevant emoji",
  "paragraphs": ["paragraph 1", "paragraph 2", "paragraph 3"],
  "questions": [
    { "q": "question text", "options": ["A","B","C","D"], "answer": "A" },
    { "q": "question text", "options": ["A","B","C","D"], "answer": "B" }
  ],
  "vocabWords": [
    { "word": "word", "meaning": "simple meaning" }
  ],
  "moral": "one sentence moral of the story"
}

Keep paragraphs short (2-3 sentences each). Questions must be multiple choice with 4 options. Make it fun and age-appropriate.`;

  const raw = await callGrok(system, user, 900);
  return parseJSON(raw);
}