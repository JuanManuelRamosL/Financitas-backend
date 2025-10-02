const OpenRouter = require("openrouter").default;

const client = new OpenRouter({ apiKey: process.env.OPENROUTER_API_KEY });

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

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  // OpenRouter devuelve un array de choices
  const text = response.choices[0].message.content;

  // Limpiar posibles ```json ... ```
  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}

module.exports = { normalizeMessage };
