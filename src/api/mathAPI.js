import { callGrok, parseJSON } from "./grokService";

export async function generateMath(child) {
  const age = child.age;
  const levelLabel = child.level?.label ?? "Beginner";

  // Very specific instructions per age group
  const ageInstructions = {
    3:  "counting objects 1-5 only. Example: 'How many apples? 🍎🍎🍎' Answer: 3. Use only emojis and very simple counting.",
    4:  "counting objects 1-10 only. Use emojis to show objects. Very simple addition like 1+1, 2+1.",
    5:  "simple addition up to 10. Example: 2+3=? Use emojis to help visualize.",
    6:  "addition and subtraction up to 20. Example: 15-7=? or 8+9=?",
    7:  "addition and subtraction up to 100. Simple multiplication tables 2x and 5x only.",
    8:  "multiplication tables 2x to 10x. Simple division. Example: 24÷6=?",
    9:  "multi-digit multiplication. Long division. Example: 144÷12=? or 23×4=?",
    10: "fractions, decimals, percentages. Example: What is 25% of 80? or 3/4 + 1/4=?",
    11: "algebra basics, ratio, proportion. Example: If x+5=12 then x=? or 3:4 ratio problems.",
    12: "advanced algebra, geometry area/perimeter, word problems with multiple steps.",
  };

  const focus = ageInstructions[age] ?? ageInstructions[7];

  const system = `You are an expert children's math teacher who creates age-perfect questions.
Respond ONLY with valid JSON. No markdown, no extra text.`;

  const user = `Create 5 math questions for a ${age}-year-old child.

AGE-SPECIFIC REQUIREMENT: Questions must be about ${focus}

Difficulty level: ${levelLabel}
- Beginner: very easy, use emojis/visuals
- Explorer: slightly harder, mix of easy and medium
- Learner: medium difficulty, no visuals needed
- Champion: challenging, multi-step problems

Return this exact JSON:
{
  "topic": "specific topic name based on age",
  "emoji": "one relevant emoji",
  "questions": [
    {
      "question": "question text appropriate for age ${age}",
      "options": ["option1", "option2", "option3", "option4"],
      "answer": "option1",
      "hint": "a helpful clue that guides thinking WITHOUT giving the answer",
      "explanation": "brief explanation shown AFTER they answer"
    }
  ]
}

STRICT RULES:
- All 5 questions must match exactly age ${age} difficulty
- answer must EXACTLY match one option
- For age 3-5: always use emoji visuals in questions
- For age 6-8: mix of numbers and simple word problems
- For age 9-12: word problems and multi-step calculations
- Make exactly 5 questions, increasing difficulty slightly each question`;

  const raw = await callGrok(system, user, 1000);
  return parseJSON(raw);
}