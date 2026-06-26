import { callGrok, parseJSON } from "./grokService";

export async function generateVocab(child) {
  const age = child.age;
  const levelLabel = child.level?.label ?? "Beginner";

  const ageInstructions = {
    3:  "matching pictures to words. Words must be 3 letters max like cat, dog, sun, hat, cup",
    4:  "simple word recognition. Words like ball, tree, fish, bird, cake",
    5:  "missing letter in simple words. Example: C_T = CAT. Use 3-4 letter words only",
    6:  "missing letter in common words. Example: H_USE = HOUSE. Use 4-5 letter words",
    7:  "simple synonyms. Example: happy means the same as? Options: sad, joyful, angry, tired",
    8:  "synonyms and antonyms mixed. Example: opposite of brave? or another word for big?",
    9:  "advanced synonyms, antonyms, word meanings. Example: What does 'ancient' mean?",
    10: "vocabulary in context. Example: She was very 'persistent'. Persistent means?",
    11: "advanced word meanings, prefixes, suffixes. Example: What does 'un' in 'unhappy' mean?",
    12: "complex vocabulary, idioms, word roots. Example: The word 'biography' means?",
  };

  const focus = ageInstructions[age] ?? ageInstructions[7];

  const system = `You are an expert children's vocabulary teacher.
Respond ONLY with valid JSON. No markdown, no extra text.`;

  const user = `Create a vocabulary activity for a ${age}-year-old at ${levelLabel} level.

AGE-SPECIFIC REQUIREMENT: Focus on ${focus}

Return this exact JSON:
{
  "topic": "specific topic name",
  "emoji": "one relevant emoji",
  "activityType": "missing-letter|matching|mcq",
  "questions": [
    {
      "question": "question text for age ${age}",
      "display": "word display like A_PLE or word to identify",
      "options": ["option1", "option2", "option3", "option4"],
      "answer": "option1",
      "hint": "helpful hint",
      "emoji": "relevant emoji for this word"
    }
  ]
}

STRICT RULES:
- All questions must be perfectly suited for age ${age}
- Age 3-5: use only very simple common words with emoji help
- Age 6-8: simple word games, missing letters, basic synonyms
- Age 9-12: harder vocabulary, meanings in context, antonyms
- answer must EXACTLY match one of the options
- Make exactly 5 questions, slightly harder each time`;

  const raw = await callGrok(system, user, 1000);
  return parseJSON(raw);
}