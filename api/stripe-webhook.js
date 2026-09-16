const Stripe = require("stripe");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    res.status(200).json({
      mode: "local-fallback",
      message: "Stripe keys are blank. Add keys before using webhook fulfillment.",
    });
    return;
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const signature = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    res.status(400).send(`Webhook Error: ${error.message}`);
    return;
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // Production step:
    // 1. Read purchased line items from Stripe.
    // 2. Store entitlement records in DATABASE_URL.
    // 3. Send download links through EMAIL_API_KEY.
    console.log("Fulfill digital order", session.id);
  }

  res.status(200).json({ received: true });
};
