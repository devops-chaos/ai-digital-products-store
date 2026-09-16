const Stripe = require("stripe");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    res.status(200).json({
      mode: "local-fallback",
      message: "STRIPE_SECRET_KEY is blank. The frontend checkout fallback will unlock downloads.",
    });
    return;
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const { items = [] } = req.body || {};
  const baseUrl = process.env.APP_BASE_URL || "http://localhost:4173";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${baseUrl}/?checkout=success`,
    cancel_url: `${baseUrl}/?checkout=cancelled`,
    line_items: items.map((item) => ({
      quantity: item.quantity || 1,
      price_data: {
        currency: "usd",
        unit_amount: Math.round(Number(item.price) * 100),
        product_data: {
          name: item.name,
          metadata: {
            productId: item.id,
            category: item.category || "Digital Product",
          },
        },
      },
    })),
    metadata: {
      fulfillment: "digital-download",
    },
  });

  res.status(200).json({ url: session.url });
};
