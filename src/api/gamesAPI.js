import { callGrok, parseJSON } from "./grokService";

export async function generateAnimalCountingGame(child) {
  const system = `You are a children's game designer.
Respond ONLY with valid JSON. No markdown, no extra text.`;

  const user = `Create an animal counting game for a ${child.age}-year-old.

Return this exact JSON:
{
  "rounds": [
    {
      "animalEmoji": "single animal emoji e.g. 🐶",
      "count": 3,
      "displayString": "repeated emoji string matching count e.g. 🐶🐶🐶",
      "options": ["2","3","4","5"],
      "answer": "3"
    }
  ]
}

Make exactly 6 rounds with varying counts between 1 and 10. Use different animals each round. Options must include the correct answer and 3 close distractors.`;

  const raw = await callGrok(system, user, 700);
  return parseJSON(raw);
}

export async function generateShapeMatchGame(child) {
  const system = `You are a children's game designer.
Respond ONLY with valid JSON. No markdown, no extra text.`;

  const user = `Create a shape matching game for a ${child.age}-year-old.

Return this exact JSON:
{
  "rounds": [
    {
      "shapeEmoji": "shape emoji e.g. 🔴 🟦 🔺 ⬛ 🟧 ⭐ ❤️",
      "correctName": "Circle",
      "options": ["Circle","Square","Triangle","Star"]
    }
  ]
}

Make exactly 6 rounds with different shapes. Options always include 4 choices with correctName included, in random order.`;

  const raw = await callGrok(system, user, 600);
  return parseJSON(raw);
}

export async function generateWordBuilderGame(child) {
  const levelLabel = child.level?.label ?? "Beginner";
  const system = `You are a children's vocabulary game designer.
Respond ONLY with valid JSON. No markdown, no extra text.`;

  const user = `Create a "missing letter" word builder game for a ${child.age}-year-old at ${levelLabel} level.

Return this exact JSON:
{
  "rounds": [
    {
      "word": "APPLE",
      "displayWord": "A_PLE",
      "missingLetter": "P",
      "emoji": "🍎",
      "options": ["P","B","D","R"]
    }
  ]
}

Make exactly 6 rounds with different words appropriate for the age. Each word should have exactly ONE letter replaced with underscore. Options include the correct letter plus 3 plausible distractors, in random order. Use a relevant emoji for each word.`;

  const raw = await callGrok(system, user, 700);
  return parseJSON(raw);
}

export async function generateMemoryMatchGame(child) {
  const system = `You are a children's memory game designer.
Respond ONLY with valid JSON. No markdown, no extra text.`;

  const user = `Create a memory match game theme for a ${child.age}-year-old.

Return this exact JSON:
{
  "theme": "Animals|Fruits|Shapes|Vehicles",
  "emojis": ["🐶","🐱","🐰","🦊","🐻","🐼","🦁","🐯"]
}

Provide exactly 8 unique emojis matching the theme, age-appropriate and visually distinct.`;

  const raw = await callGrok(system, user, 400);
  return parseJSON(raw);
}

export async function generateColorMatchGame(child) {
  const system = `You are a children's color recognition game designer.
Respond ONLY with valid JSON. No markdown, no extra text.`;

  const user = `Create a color matching game for a ${child.age}-year-old.

Return this exact JSON:
{
  "rounds": [
    {
      "colorName": "Red",
      "colorHex": "#FF6B6B",
      "options": ["Red","Blue","Green","Yellow"]
    }
  ]
}

Make exactly 6 rounds with different colors. colorHex must be a valid friendly hex code. Options include correctName + 3 distractors in random order.`;

  const raw = await callGrok(system, user, 600);
  return parseJSON(raw);
}