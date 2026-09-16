function cleanItems(items) {
  if (!Array.isArray(items)) return [];

  return items
    .filter((item) => item && item.id && item.name)
    .slice(0, 20)
    .map((item) => ({
      id: String(item.id),
      name: String(item.name).slice(0, 120),
      category: String(item.category || "Digital Product").slice(0, 80),
      price: Math.max(1, Number(item.price) || 0),
      quantity: Math.min(20, Math.max(1, Number(item.quantity) || 1)),
    }));
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const items = cleanItems((req.body || {}).items);

  if (!items.length) {
    res.status(400).json({ error: "Checkout requires at least one valid product." });
    return;
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    res.status(200).json({
      mode: "local-fallback",
      unlockLocally: true,
      message: "STRIPE_SECRET_KEY is blank. Local checkout fallback is enabled for development.",
    });
    return;
  }

  try {
    const Stripe = require("stripe");
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const baseUrl = process.env.APP_BASE_URL || "http://localhost:4173";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${baseUrl}/downloads.html?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart.html?checkout=cancelled`,
      line_items: items.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(item.price * 100),
          product_data: {
            name: item.name,
            metadata: {
              productId: item.id,
              category: item.category,
            },
          },
        },
      })),
      metadata: {
        fulfillment: "digital-download",
        productIds: items.map((item) => item.id).join(","),
      },
    });

    res.status(200).json({ mode: "stripe", url: session.url });
  } catch (error) {
    console.error("Stripe checkout error", error.message);
    res.status(502).json({ error: "Checkout service unavailable. Please try again shortly." });
  }
};
