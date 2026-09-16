const { buildPrompt } = require("../lib/commerce-ai");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const payload = req.body || {};
  const fallbackPrompt = buildPrompt(payload);

  if (!process.env.OPENAI_API_KEY) {
    res.status(200).json({
      mode: "local-fallback",
      prompt: fallbackPrompt,
    });
    return;
  }

  try {
    const OpenAI = require("openai");
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const { task, audience, context, tone, output } = payload;

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.5",
      instructions:
        "Create premium reusable prompts for business buyers. Return only the finished prompt text, with fill-in blanks where useful.",
      input: `Create a reusable AI prompt for this digital-product customer.
Task: ${task}
Audience: ${audience}
Context: ${context}
Tone: ${tone}
Output: ${output}

Return only the prompt text.`,
    });

    res.status(200).json({ mode: "openai", prompt: response.output_text.trim() || fallbackPrompt });
  } catch (error) {
    console.error("Prompt generation fallback", error.message);
    res.status(200).json({
      mode: "api-fallback",
      prompt: fallbackPrompt,
      message: "AI service unavailable. Showing a professional fallback prompt.",
    });
  }
};
