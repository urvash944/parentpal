import { callGrok, parseJSON } from "./grokService";

export async function generateAnimals(child) {
  const age = child.age;

  const ageInstructions = {
    3:  "counting 1-3 animals only. Very simple. Example: 🐱🐱 How many cats? Answer: 2",
    4:  "counting 1-5 animals. Simple identification. What sound does a cow make?",
    5:  "counting 1-10 animals. Simple facts. Where does a fish live?",
    6:  "counting up to 15. Animal habitats, what animals eat. Example: What do rabbits eat?",
    7:  "animal classification, habitats, diet. Example: Which animal is a mammal?",
    8:  "animal facts, life cycles, food chains. Example: What is the largest land animal?",
    9:  "endangered animals, ecosystems, adaptations. Example: Why do polar bears have white fur?",
    10: "animal kingdoms, scientific classifications, complex food webs.",
    11: "animal behavior, migration, evolution basics. Example: Why do birds migrate?",
    12: "complex ecology, animal adaptations, conservation. Example: How do animals adapt to climate change?",
  };

  const focus = ageInstructions[age] ?? ageInstructions[6];

  const system = `You are a fun children's animal education expert.
Respond ONLY with valid JSON. No markdown, no extra text.`;

  const user = `Create an animal activity for a ${age}-year-old.

AGE-SPECIFIC REQUIREMENT: ${focus}

Return this exact JSON:
{
  "topic": "Animal World",
  "emoji": "🐾",
  "questions": [
    {
      "question": "age-appropriate animal question for ${age}-year-old",
      "animalEmojis": "relevant animal emojis (use multiple for counting questions)",
      "options": ["option1", "option2", "option3", "option4"],
      "answer": "option1",
      "hint": "helpful hint",
      "animalFact": "one interesting fact about this animal"
    }
  ]
}

STRICT RULES:
- Age 3-5: ONLY counting emojis questions (How many? 🐶🐶🐶)
- Age 6-7: mix of counting and simple identification
- Age 8-9: animal facts, habitats, what they eat
- Age 10-12: harder questions about ecosystems, adaptations, classifications
- answer must EXACTLY match one option as a string
- For counting: answer is the number as string like "3"
- Make exactly 5 questions, getting slightly harder each time`;

  const raw = await callGrok(system, user, 900);
  return parseJSON(raw);
}