import { callGrok, parseJSON } from "./grokService";

export async function generateStory(child) {
  const age = child.age;
  const levelLabel = child.level?.label ?? "Beginner";

  const ageInstructions = {
    3:  { words: "very simple 3-4 letter words only", sentences: "3-4 words per sentence", length: "3 very short paragraphs of 1-2 sentences each", vocab: "extremely basic words like cat, dog, run, big, red" },
    4:  { words: "simple common words", sentences: "5-6 words per sentence", length: "3 short paragraphs of 2 sentences each", vocab: "simple everyday words" },
    5:  { words: "simple words with a few new ones", sentences: "6-8 words per sentence", length: "3 paragraphs of 2-3 sentences", vocab: "basic words plus 2-3 new words" },
    6:  { words: "mix of familiar and some new words", sentences: "8-10 words per sentence", length: "3 paragraphs of 3 sentences", vocab: "grade 1 level vocabulary" },
    7:  { words: "grade 2 vocabulary", sentences: "10-12 words per sentence", length: "3 paragraphs of 3-4 sentences", vocab: "grade 2 level words" },
    8:  { words: "grade 3 vocabulary with some challenging words", sentences: "12-14 words per sentence", length: "4 paragraphs of 3-4 sentences", vocab: "introduce words like curious, enormous, journey" },
    9:  { words: "rich vocabulary", sentences: "14-16 words per sentence", length: "4 paragraphs of 4 sentences", vocab: "words like magnificent, perseverance, challenge" },
    10: { words: "advanced vocabulary", sentences: "15-18 words per sentence", length: "5 paragraphs of 4 sentences", vocab: "words like consequence, determination, strategy" },
    11: { words: "sophisticated vocabulary", sentences: "18-20 words per sentence", length: "5 paragraphs of 4-5 sentences", vocab: "complex words like ambiguous, resilience, hypothesis" },
    12: { words: "mature vocabulary", sentences: "complex sentences", length: "5-6 paragraphs with rich detail", vocab: "advanced words like paradox, philosophical, dilemma" },
  };

  const inst = ageInstructions[age] ?? ageInstructions[7];

  const system = `You are an expert children's story writer who writes age-perfect stories.
Respond ONLY with valid JSON. No markdown, no extra text.`;

  const user = `Write a story for a ${age}-year-old at ${levelLabel} level.

AGE-SPECIFIC WRITING RULES:
- Word complexity: ${inst.words}
- Sentence length: ${inst.sentences}
- Story length: ${inst.length}
- Vocabulary focus: ${inst.vocab}

Story types for age ${age}:
${age <= 5 ? "- Simple animal stories, toy stories, bedtime stories with happy endings" : ""}
${age >= 6 && age <= 8 ? "- Adventure stories, friendship stories, moral stories, animal adventures" : ""}
${age >= 9 && age <= 10 ? "- Mystery stories, science adventures, historical stories, hero stories" : ""}
${age >= 11 ? "- Complex narratives with plot twists, moral dilemmas, inspiring real-world themes" : ""}

Return this exact JSON:
{
  "title": "engaging story title",
  "type": "animal|moral|adventure|mystery|friendship",
  "emoji": "one relevant emoji",
  "paragraphs": ["paragraph 1", "paragraph 2", "paragraph 3"],
  "questions": [
    {
      "q": "comprehension question appropriate for age ${age}",
      "options": ["A", "B", "C", "D"],
      "answer": "A"
    },
    {
      "q": "another question testing understanding",
      "options": ["A", "B", "C", "D"],
      "answer": "B"
    }
  ],
  "vocabWords": [
    { "word": "word from story", "meaning": "simple meaning" }
  ],
  "moral": "one sentence lesson from the story"
}

STRICT RULES:
- Story complexity must match exactly age ${age}
- Questions must be answerable from the story
- For age 3-6: questions should be very simple (what color, how many, who did)
- For age 7-9: questions should test understanding (why did, what happened, how did)
- For age 10-12: questions should test analysis (what is the moral, why did the character, what would you do)`;

  const raw = await callGrok(system, user, 1200);
  return parseJSON(raw);
}