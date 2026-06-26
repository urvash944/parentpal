import { callGrok, parseJSON } from "./grokService";

export async function generateShapes(child) {
  const age = child.age;

  const ageInstructions = {
    3:  "identify basic shapes only: circle, square, triangle. Show emoji and ask what shape is this.",
    4:  "identify circle, square, triangle, rectangle. Very simple questions.",
    5:  "identify 5 basic shapes. Count sides. Example: How many sides does a triangle have?",
    6:  "identify shapes, count sides and corners. Introduce oval, diamond, star.",
    7:  "properties of shapes, symmetry basics. Which shape has 4 equal sides?",
    8:  "2D and 3D shapes. Cube, sphere, cylinder. How many faces does a cube have?",
    9:  "area and perimeter concepts. Which shape has the most sides? Introduce polygon.",
    10: "geometry basics. Angles in shapes. Sum of angles in a triangle is 180 degrees.",
    11: "area formulas. Area of rectangle = length × width. Calculate areas.",
    12: "advanced geometry. Pythagoras basics, circle area = πr², complex shape problems.",
  };

  const focus = ageInstructions[age] ?? ageInstructions[6];

  const system = `You are an expert children's geometry and shapes teacher.
Respond ONLY with valid JSON. No markdown, no extra text.`;

  const user = `Create a shapes activity for a ${age}-year-old.

AGE-SPECIFIC REQUIREMENT: ${focus}

Return this exact JSON:
{
  "topic": "Shape Fun",
  "emoji": "🔷",
  "questions": [
    {
      "question": "age-appropriate shapes question for ${age}-year-old",
      "shapeEmoji": "relevant shape emoji like 🔴 🟦 🔺 ⬛ 🟧 ⭐",
      "options": ["option1", "option2", "option3", "option4"],
      "answer": "option1",
      "hint": "helpful hint without giving answer",
      "funFact": "one interesting fact about this shape"
    }
  ]
}

STRICT RULES:
- Age 3-5: ONLY basic shape identification with big emojis
- Age 6-7: identification plus simple properties (sides, corners)
- Age 8-9: 2D and 3D shapes, faces, edges
- Age 10-12: area, perimeter, angles, geometry problems
- answer must EXACTLY match one of the options
- Make exactly 5 questions, getting harder each time`;

  const raw = await callGrok(system, user, 900);
  return parseJSON(raw);
}