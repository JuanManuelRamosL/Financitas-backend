// Node.js v22+ soporta fetch global, pero para compatibilidad universal:
let fetch;
try {
  fetch = global.fetch || require("node-fetch");
} catch {
  fetch = require("node-fetch");
}

// HARDCODEAR LA API KEY PARA PRUEBA
const OPENROUTER_API_KEY =
  "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";
console.log("API KEY OpenRouter:", OPENROUTER_API_KEY);

async function normalizeMessage(message) {
  const prompt = `
Extrae información de gasto o ingreso de este mensaje y devuélvelo en JSON válido.
Ejemplo: 
Entrada: "300 en uber"
Salida: {"type":"expense","amount":300,"category":"transporte","description":"uber"}

Entrada: "Me pagaron 5000 del trabajo"
Salida: {"type":"income","amount":5000,"source":"trabajo"}

Ahora procesa: "${message}"
`;

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "X-Title": "Financitas Backend",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat-v3.1:free",
        messages: [{ role: "user", content: prompt }],
      }),
    }
  );

  const data = await response.json();
  console.log("Respuesta OpenRouter:", JSON.stringify(data, null, 2));

  if (
    !data.choices ||
    !data.choices[0] ||
    !data.choices[0].message ||
    !data.choices[0].message.content
  ) {
    throw new Error("No se recibió respuesta válida del modelo AI");
  }

  const text = data.choices[0].message.content;
  const cleaned = text.replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    throw new Error("La respuesta del modelo no es un JSON válido: " + cleaned);
  }
}

module.exports = { normalizeMessage };
