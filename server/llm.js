const axios = require("axios");

async function askLLM(question) {
  const prompt = `
You are an expert SQL generator.

Tables:
orders(id, customer_id)
customers(id, name)
deliveries(id)
payments(id, customer_id)

Rules:
- Only return SQL
- No explanation

Question:
${question}
`;

  const res = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }]
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`
      }
    }
  );

  return res.data.choices[0].message.content;
}

module.exports = askLLM;