const { normalizeProducts, scoreProducts } = require("../lib/commerce-ai");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const payload = req.body || {};
  const fallback = scoreProducts(payload);

  if (!process.env.OPENAI_API_KEY) {
    res.status(200).json(fallback);
    return;
  }

  try {
    const OpenAI = require("openai");
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const products = normalizeProducts(payload.products);

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.5",
      instructions:
        "You are the recommendation engine for a digital products store. Recommend only product IDs from the provided catalog. Return concise JSON only.",
      input: JSON.stringify({
        role: payload.role,
        goal: payload.goal,
        budget: payload.budget,
        priority: payload.priority,
        products,
      }),
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
                minItems: 1,
                maxItems: 3,
              },
              bundleStrategy: { type: "string" },
              confidence: { type: "number", minimum: 0, maximum: 100 },
            },
            required: ["productIds", "reasons", "bundleStrategy", "confidence"],
          },
        },
      },
    });

    const parsed = JSON.parse(response.output_text);
    const allowedIds = new Set(products.map((product) => product.id));
    const productIds = (parsed.productIds || []).filter((id) => allowedIds.has(id)).slice(0, 3);

    if (!productIds.length) {
      res.status(200).json(fallback);
      return;
    }

    res.status(200).json({
      mode: "openai",
      productIds,
      reasons: (parsed.reasons || fallback.reasons).slice(0, 3),
      bundleStrategy: parsed.bundleStrategy || fallback.bundleStrategy,
      confidence: Number(parsed.confidence) || fallback.confidence,
    });
  } catch (error) {
    console.error("AI recommendation fallback", error.message);
    res.status(200).json({
      ...fallback,
      mode: "api-fallback",
      message: "AI service unavailable. Showing rules-based recommendations.",
    });
  }
};
