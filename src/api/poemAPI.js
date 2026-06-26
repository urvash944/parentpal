import { callGrok, parseJSON } from "./grokService";

export async function generatePoem(child) {
  const age = child.age;
  const levelLabel = child.level?.label ?? "Beginner";

  const ageInstructions = {
    3:  "very simple nursery rhyme style. 4 lines only. Single syllable words. Example style: 'Twinkle twinkle little star'",
    4:  "simple rhyming poem. 4-6 lines. Very common words. Animals or nature theme.",
    5:  "simple rhyming poem. 6 lines. Easy words. Fun and playful theme.",
    6:  "short poem with clear rhyme scheme. 6-8 lines. Themes like seasons, animals, school.",
    7:  "poem with AABB rhyme scheme. 8 lines. More descriptive words. Themes like adventure, friendship.",
    8:  "poem with ABAB or AABB rhyme. 8-10 lines. Introduce some metaphors. Nature or adventure themes.",
    9:  "poem with consistent rhyme and rhythm. 10-12 lines. Use similes and metaphors. Deeper themes.",
    10: "structured poem with literary devices. 12 lines. Themes like courage, dreams, nature's beauty.",
    11: "poem with complex structure. 12-14 lines. Use personification, alliteration, metaphors.",
    12: "sophisticated poem. 14-16 lines. Rich imagery, complex themes like life, time, human nature.",
  };

  const inst = ageInstructions[age] ?? ageInstructions[7];

  const system = `You are an expert children's poetry teacher who writes age-perfect poems.
Respond ONLY with valid JSON. No markdown, no extra text.`;

  const user = `Write a poem for a ${age}-year-old at ${levelLabel} level.

AGE-SPECIFIC POETRY RULES: ${inst}

Return this exact JSON:
{
  "title": "poem title",
  "theme": "nature|animals|adventure|friendship|dreams|seasons",
  "emoji": "one relevant emoji",
  "lines": [
    "line 1",
    "line 2",
    "line 3",
    "line 4",
    "line 5",
    "line 6"
  ],
  "questions": [
    {
      "q": "question about the poem for age ${age}",
      "options": ["A", "B", "C", "D"],
      "answer": "A"
    },
    {
      "q": "another question about the poem",
      "options": ["A", "B", "C", "D"],
      "answer": "B"
    }
  ],
  "rhymeScheme": "AABB or ABAB",
  "funActivity": "one simple activity to do with this poem"
}

STRICT RULES:
- Poem complexity must exactly match age ${age}
- Age 3-5: very simple words, lots of repetition, nursery rhyme feel
- Age 6-8: clear rhymes, fun themes, slightly more vocabulary
- Age 9-12: richer language, deeper meaning, literary devices
- Questions must match reading level of age ${age}`;

  const raw = await callGrok(system, user, 1000);
  return parseJSON(raw);
}