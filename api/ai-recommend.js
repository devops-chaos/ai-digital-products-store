const OpenAI = require("openai");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!process.env.OPENAI_API_KEY) {
    res.status(200).json({
      mode: "demo",
      message: "OPENAI_API_KEY is blank. The frontend local recommender will be used.",
    });
    return;
  }

  const { role, goal, products } = req.body || {};
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const response = await client.responses.create({
    model: "gpt-5.2",
    input: [
      {
        role: "system",
        content:
          "You recommend digital products. Return concise JSON with productIds, reasons, and a one sentence bundle strategy.",
      },
      {
        role: "user",
        content: JSON.stringify({ role, goal, products }),
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "recommendation",
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            productIds: {
              type: "array",
              items: { type: "string" },
              minItems: 1,
              maxItems: 3,
            },
            reasons: {
              type: "array",
              items: { type: "string" },
            },
            bundleStrategy: { type: "string" },
          },
          required: ["productIds", "reasons", "bundleStrategy"],
        },
      },
    },
  });

  res.status(200).json(JSON.parse(response.output_text));
};
