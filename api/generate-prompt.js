const OpenAI = require("openai");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!process.env.OPENAI_API_KEY) {
    res.status(200).json({
      mode: "demo",
      message: "OPENAI_API_KEY is blank. The frontend template generator will be used.",
    });
    return;
  }

  const { task, audience, tone, output } = req.body || {};
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const response = await client.responses.create({
    model: "gpt-5.2",
    input: `Create a reusable AI prompt for this digital-product customer.
Task: ${task}
Audience: ${audience}
Tone: ${tone}
Output: ${output}

Return only the prompt text.`,
  });

  res.status(200).json({ prompt: response.output_text });
};
