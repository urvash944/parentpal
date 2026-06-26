// Grok API (xAI) — base service
// All learning content is generated here dynamically
// VITE_GROK_API_KEY must be set in your .env file

const GROK_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROK_MODEL = "llama-3.3-70b-versatile";

export async function callGrok(systemPrompt, userPrompt, maxTokens = 800)
 {

  const apiKey = import.meta.env.VITE_GROK_API_KEY;
    console.log("URL:", GROK_API_URL);
  console.log("MODEL:", GROK_MODEL);
  console.log("KEY EXISTS:", !!apiKey);


  if (!apiKey) {
    throw new Error("VITE_GROK_API_KEY is not set in your .env file");
  }

  const response = await fetch(GROK_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROK_MODEL,
      max_tokens: maxTokens,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
  const text = await response.text();
  console.error("FULL RESPONSE:", text);
  throw new Error(text);
}

  const data = await response.json();
  return data.choices[0].message.content;
}

// Parse JSON safely from Grok responses
export function parseJSON(text) {
  try {
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch {
    console.error("JSON parse failed:", text);
    return null;
  }
}