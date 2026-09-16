const { makeTicketId } = require("../lib/commerce-ai");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { email, topic = "General support", message } = req.body || {};
  const normalizedEmail = String(email || "").trim();
  const normalizedMessage = String(message || "").trim();

  if (!normalizedEmail || !normalizedEmail.includes("@") || normalizedMessage.length < 10) {
    res.status(400).json({ error: "Please include a valid email and a message with at least 10 characters." });
    return;
  }

  const ticketId = makeTicketId();

  if (!process.env.EMAIL_API_KEY) {
    res.status(200).json({
      mode: "local-fallback",
      ticketId,
      message: "Support request prepared locally. Add EMAIL_API_KEY and a provider client before launch.",
    });
    return;
  }

  // Provider-specific email or ticketing integration belongs here.
  console.log("Support request ready for provider integration", {
    ticketId,
    email: normalizedEmail,
    topic,
    messageLength: normalizedMessage.length,
  });

  res.status(202).json({
    mode: "integration-placeholder",
    ticketId,
    message: "EMAIL_API_KEY is present. Connect your preferred provider in api/support-request.js.",
  });
};
