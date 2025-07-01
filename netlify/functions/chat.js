const fetch = require('node-fetch');
const { messages } = require('./syndesis.agent.js');

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const msg = body.message;

    if (!msg) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing prompt/message" })
      };
    }

    const apiKey = process.env.OPENAI_API_KEY;

    console.log("🧠 SYNDESIS Messages:", messages);

    const chatRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          ...messages,
          { role: "user", content: msg }
        ]
      })
    });

    const data = await chatRes.json();
    const reply = data.choices?.[0]?.message?.content || "…";

    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };

  } catch (e) {
    console.error("SYNDESIS GPT ERROR:", e);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "SYNDESIS internal error" })
    };
  }
};
