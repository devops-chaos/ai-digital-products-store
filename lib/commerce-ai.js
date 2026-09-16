const TASK_MAP = {
  sales: "write sales outreach that starts a useful conversation",
  resume: "rewrite a resume section so it is specific, credible, and ATS-friendly",
  content: "build a content calendar with hooks, post ideas, and conversion angles",
  operations: "design a simple automation workflow with triggers, actions, and safeguards",
  course: "outline a mini course with lessons, outcomes, exercises, and launch copy",
  support: "create customer support responses that are empathetic and consistent",
};

const PRIORITY_TAGS = {
  speed: ["automation", "workflow", "templates", "planner", "prompts"],
  revenue: ["sales", "clients", "proposal", "launch", "outreach"],
  quality: ["support", "sop", "brand", "workflow", "operations"],
  career: ["resume", "linkedin", "career", "interview", "profile"],
};

const KEYWORD_ALIASES = {
  automation: ["automation", "automate", "automated", "workflow", "zapier"],
  leads: ["lead", "leads", "prospect", "prospects"],
  templates: ["template", "templates"],
  prompts: ["prompt", "prompts"],
  clients: ["client", "clients"],
  sales: ["sale", "sales", "sell", "selling"],
  resume: ["resume", "cv"],
  operations: ["operation", "operations", "ops"],
};

function asText(value, fallback = "") {
  const text = String(value ?? "").trim();
  return text || fallback;
}

function asNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function wordsFrom(value) {
  return new Set(
    String(value ?? "")
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(Boolean)
  );
}

function goalMatchesTag(tag, goalText, goalWords) {
  const candidates = KEYWORD_ALIASES[tag] || [tag];
  return candidates.some((candidate) => goalWords.has(candidate) || goalText.includes(candidate));
}

function normalizeProducts(products) {
  if (!Array.isArray(products)) return [];

  return products
    .filter((product) => product && product.id && product.name)
    .slice(0, 60)
    .map((product) => ({
      id: asText(product.id),
      name: asText(product.name),
      category: asText(product.category, "Digital Product"),
      audience: Array.isArray(product.audience) ? product.audience.map((item) => asText(item)).filter(Boolean) : [],
      price: asNumber(product.price, 0),
      rating: asNumber(product.rating, 4.5),
      summary: asText(product.summary),
      details: asText(product.details),
      tags: Array.isArray(product.tags) ? product.tags.map((item) => asText(item).toLowerCase()).filter(Boolean) : [],
      featured: asNumber(product.featured, 70),
    }));
}

function scoreProducts(payload = {}) {
  const role = asText(payload.role, "founders");
  const goal = asText(payload.goal, "launch faster with practical AI assets");
  const budget = asNumber(payload.budget, 999);
  const priority = asText(payload.priority, "speed");
  const products = normalizeProducts(payload.products);
  const goalText = goal.toLowerCase();
  const goalWords = wordsFrom(goal);
  const priorityTags = PRIORITY_TAGS[priority] || PRIORITY_TAGS.speed;

  const scored = products
    .map((product) => {
      const matchedTags = [];
      let score = Math.min(50, product.featured / 2);

      if (product.audience.includes(role)) score += 34;
      if (product.price <= budget) {
        score += 16;
      } else {
        score -= Math.min(18, (product.price - budget) / 4);
      }

      priorityTags.forEach((tag) => {
        if (product.tags.includes(tag) || product.summary.toLowerCase().includes(tag)) {
          score += 8;
          matchedTags.push(tag);
        }
      });

      product.tags.forEach((tag) => {
        if (goalMatchesTag(tag, goalText, goalWords)) {
          score += 12;
          matchedTags.push(tag);
        }
      });

      return {
        product,
        matchedTags: [...new Set(matchedTags)].slice(0, 3),
        rawScore: score,
        score: Math.max(30, Math.min(100, Math.round(score))),
      };
    })
    .sort((a, b) => b.rawScore - a.rawScore)
    .slice(0, 3);

  const productIds = scored.map(({ product }) => product.id);
  const reasons = scored.map(({ product, score, matchedTags }) => {
    const tags = matchedTags.length ? ` and matches ${matchedTags.join(", ")}` : "";
    return `${product.name} is a ${score}% fit for ${role.replace(/-/g, " ")}${tags}.`;
  });
  const confidence = scored.length
    ? Math.round(scored.reduce((total, item) => total + item.score, 0) / scored.length)
    : 0;

  return {
    mode: "local-fallback",
    productIds,
    reasons,
    bundleStrategy:
      "Start with the highest-fit product, add one execution template, then add one automation or brand asset only when it supports the same buyer goal.",
    confidence,
  };
}

function buildPrompt(payload = {}) {
  const task = asText(payload.task, "sales");
  const audience = asText(payload.audience, "my target audience");
  const context = asText(payload.context, "my current project");
  const tone = asText(payload.tone, "clear, useful, and professional");
  const output = asText(payload.output || payload.format, "a practical, ready-to-use output");

  return `You are an expert AI work assistant.

Goal: ${TASK_MAP[task] || TASK_MAP.sales}.
Audience: ${audience}.
Context: ${context}.
Tone: ${tone}.
Output format: ${output}.

Context:
- My offer, product, or role is: [fill this in]
- My constraints, budget, or deadline are: [fill this in]
- My preferred tools, platforms, or file format are: [fill this in]

Instructions:
1. Ask up to three clarifying questions only if missing context would change the result.
2. Create practical sections with clear labels.
3. Include examples I can reuse immediately.
4. Add a short quality checklist.
5. Add one risk or assumption to review before publishing.
6. Keep the language natural, direct, and ready to publish.`;
}

function makeTicketId(prefix = "PP") {
  return `${prefix}-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random()
    .toString(36)
    .slice(2, 8)
    .toUpperCase()}`;
}

module.exports = {
  buildPrompt,
  makeTicketId,
  normalizeProducts,
  scoreProducts,
};
