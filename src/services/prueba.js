/* // test-openrouter.js
let fetch;
try {
  fetch = global.fetch || require("node-fetch");
} catch {
  fetch = require("node-fetch");
}

async function testFetch() {
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization:
          "Bearer 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",
        "HTTP-Referer": "http://localhost:4000", // 👈 tu backend o dominio
        "X-Title": "Financitas Backend",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat-v3.1:free",
        messages: [
          {
            role: "user",
            content: "What is the meaning of life?",
          },
        ],
      }),
    }
  );

  const data = await response.json();
  console.log("✅ Respuesta completa:");
  console.log(JSON.stringify(data, null, 2));
}

testFetch().catch(console.error);
 */

// archivo: test-openrouter.js

// Ejemplo para probar un modelo gratuito en OpenRouter
// Requiere Node.js 18+ o el paquete node-fetch instalado

// prueba.js
const fetch = require("node-fetch");

const API_KEY =
  "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";

async function run() {
  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          // Estos headers son opcionales, podés reactivarlos si querés
          // "HTTP-Referer": "http://localhost:4000",
          // "X-Title": "Financitas Backend",
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-exp:free",
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            {
              role: "user",
              content: "Hola, ¿cuál es el significado de la vida?",
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      console.error("❌ Error de API:", data.error);
      return;
    }

    console.log("✅ Respuesta del modelo:");
    console.log(
      data.choices?.[0]?.message?.content || "No hay respuesta del modelo"
    );
  } catch (error) {
    console.error("❌ Error general:", error);
  }
}

run();
