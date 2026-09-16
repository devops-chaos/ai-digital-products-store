module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  res.status(200).json({
    ok: true,
    service: "PromptlyPro API",
    integrations: {
      openai: Boolean(process.env.OPENAI_API_KEY),
      stripe: Boolean(process.env.STRIPE_SECRET_KEY),
      stripeWebhook: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
      email: Boolean(process.env.EMAIL_API_KEY),
      database: Boolean(process.env.DATABASE_URL),
    },
  });
};
