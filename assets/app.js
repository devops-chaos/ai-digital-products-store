const baseProducts = [
  {
    id: "career-launch-resume-kit",
    name: "Career Launch Resume Kit",
    category: "Resume Packs",
    audience: ["job-seekers", "students"],
    price: 29,
    rating: 4.9,
    format: "DOCX, PDF, ATS guide",
    cover: "resume",
    summary:
      "ATS-friendly resume templates, cover letter scripts, LinkedIn headline formulas, and interview prep sheets.",
    features: ["6 resume layouts", "Cover letter bank", "ATS keyword checklist"],
    tags: ["resume", "career", "job", "linkedin", "interview"],
    featured: 98,
  },
  {
    id: "ai-sales-prompt-library",
    name: "AI Sales Prompt Library",
    category: "Prompt Packs",
    audience: ["freelancers", "founders", "teams"],
    price: 24,
    rating: 4.8,
    format: "Prompt sheets, CRM scripts",
    cover: "prompts",
    summary:
      "Reusable prompts for prospecting, cold email, objection handling, follow-ups, and discovery calls.",
    features: ["120 sales prompts", "Email variations", "Discovery call scripts"],
    tags: ["sales", "email", "clients", "crm", "follow-up"],
    featured: 96,
  },
  {
    id: "freelancer-proposal-vault",
    name: "Freelancer Proposal Vault",
    category: "Business Kits",
    audience: ["freelancers"],
    price: 39,
    rating: 4.9,
    format: "Docs, pricing sheets, email scripts",
    cover: "business",
    summary:
      "Proposal templates, pricing calculators, scope documents, onboarding checklists, and client email flows.",
    features: ["12 proposal templates", "Pricing calculator", "Client onboarding flow"],
    tags: ["proposal", "freelance", "pricing", "clients", "scope"],
    featured: 95,
  },
  {
    id: "founder-operating-system",
    name: "Founder Operating System",
    category: "Notion Systems",
    audience: ["founders", "teams"],
    price: 59,
    rating: 4.7,
    format: "Notion dashboard, SOPs",
    cover: "business",
    summary:
      "A clean command center for tasks, goals, customers, content, finance, SOPs, and weekly planning.",
    features: ["Operating dashboard", "SOP library", "Weekly review system"],
    tags: ["notion", "startup", "business", "operations", "planning"],
    featured: 94,
  },
  {
    id: "canva-social-launch-pack",
    name: "Canva Social Launch Pack",
    category: "Canva Templates",
    audience: ["creators", "founders", "freelancers"],
    price: 34,
    rating: 4.8,
    format: "Canva links, copy prompts",
    cover: "canva",
    summary:
      "Editable Canva templates for product launches, carousels, stories, lead magnets, and offer graphics.",
    features: ["80 Canva templates", "Launch copy prompts", "Brand color guide"],
    tags: ["canva", "social", "content", "launch", "brand"],
    featured: 93,
  },
  {
    id: "small-business-automation-bundle",
    name: "Small Business Automation Bundle",
    category: "Automation Bundles",
    audience: ["founders", "teams"],
    price: 69,
    rating: 4.9,
    format: "Zapier maps, SOPs, prompt flows",
    cover: "automation",
    summary:
      "Automation recipes for leads, invoices, intake forms, customer replies, reporting, and weekly summaries.",
    features: ["25 automation maps", "SOP templates", "AI reply workflows"],
    tags: ["automation", "zapier", "workflow", "leads", "operations"],
    featured: 99,
  },
  {
    id: "student-productivity-suite",
    name: "Student Productivity Suite",
    category: "Notion Systems",
    audience: ["students"],
    price: 19,
    rating: 4.7,
    format: "Notion, study prompts, planner",
    cover: "business",
    summary:
      "Study planner, assignment tracker, research prompts, flashcard generator, and exam review templates.",
    features: ["Study dashboard", "Research prompts", "Exam planner"],
    tags: ["student", "study", "notion", "research", "planner"],
    featured: 88,
  },
  {
    id: "creator-course-builder",
    name: "Creator Course Builder",
    category: "Mini Courses",
    audience: ["creators", "freelancers"],
    price: 49,
    rating: 4.6,
    format: "Course outline, scripts, slides",
    cover: "course",
    summary:
      "Turn your expertise into a mini course with lesson outlines, scripts, workbooks, and launch emails.",
    features: ["Course map", "Lesson scripts", "Launch email sequence"],
    tags: ["course", "creator", "education", "scripts", "launch"],
    featured: 90,
  },
  {
    id: "linkedin-personal-brand-kit",
    name: "LinkedIn Personal Brand Kit",
    category: "Business Kits",
    audience: ["job-seekers", "freelancers", "founders"],
    price: 27,
    rating: 4.8,
    format: "Content calendar, profile scripts",
    cover: "canva",
    summary:
      "Profile rewrite prompts, headline formulas, post templates, carousel ideas, and outreach scripts.",
    features: ["30-day content plan", "Profile rewrite prompts", "DM scripts"],
    tags: ["linkedin", "brand", "content", "career", "networking"],
    featured: 91,
  },
  {
    id: "finance-tracker-notion",
    name: "Finance Tracker Notion",
    category: "Notion Systems",
    audience: ["founders", "freelancers", "students"],
    price: 21,
    rating: 4.6,
    format: "Notion finance dashboard",
    cover: "business",
    summary:
      "Track income, expenses, subscriptions, tax notes, savings goals, and monthly business metrics.",
    features: ["Income dashboard", "Expense tracker", "Monthly review"],
    tags: ["finance", "notion", "budget", "business", "tracker"],
    featured: 84,
  },
  {
    id: "customer-support-ai-macro-pack",
    name: "Customer Support AI Macro Pack",
    category: "Prompt Packs",
    audience: ["teams", "founders"],
    price: 32,
    rating: 4.7,
    format: "Macros, tone guide, QA checklist",
    cover: "prompts",
    summary:
      "Support macros for refunds, onboarding, complaints, retention, feature requests, and escalation notes.",
    features: ["90 support macros", "Tone guide", "Escalation checklist"],
    tags: ["support", "customer", "macros", "service", "team"],
    featured: 86,
  },
  {
    id: "agency-client-onboarding-kit",
    name: "Agency Client Onboarding Kit",
    category: "Business Kits",
    audience: ["freelancers", "teams"],
    price: 44,
    rating: 4.8,
    format: "Docs, forms, SOPs, emails",
    cover: "automation",
    summary:
      "Intake forms, kickoff agendas, welcome packets, reporting templates, and recurring client workflows.",
    features: ["Client intake forms", "Kickoff agenda", "Reporting templates"],
    tags: ["agency", "onboarding", "clients", "workflow", "forms"],
    featured: 89,
  },
];

const state = {
  cart: readStorage("promptlypro-cart", []),
  customProducts: readStorage("promptlypro-custom-products", []),
  purchases: readStorage("promptlypro-purchases", []),
  activeTab: "all",
};

const products = () => [...baseProducts, ...state.customProducts];

const categoryFilter = document.querySelector("#categoryFilter");
const audienceFilter = document.querySelector("#audienceFilter");
const budgetFilter = document.querySelector("#budgetFilter");
const sortFilter = document.querySelector("#sortFilter");
const searchInput = document.querySelector("#searchInput");
const productGrid = document.querySelector("#productGrid");
const catalogTabs = document.querySelector(".catalog-tabs");
const cartDrawer = document.querySelector("#cartDrawer");
const cartItems = document.querySelector("#cartItems");
const overlay = document.querySelector("#overlay");
const adminModal = document.querySelector("#adminModal");
const downloadGrid = document.querySelector("#downloadGrid");
const toast = document.querySelector("#toast");

function readStorage(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2800);
}

function getCategories() {
  return [...new Set(products().map((product) => product.category))];
}

function hydrateFilters() {
  const categories = getCategories();
  categoryFilter.innerHTML = '<option value="all">All categories</option>';
  catalogTabs.innerHTML = '<button class="tab-button active" type="button" data-tab="all">All</button>';

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);

    const button = document.createElement("button");
    button.className = "tab-button";
    button.type = "button";
    button.dataset.tab = category;
    button.textContent = category.replace(" Templates", "").replace(" Bundles", "");
    catalogTabs.appendChild(button);
  });
}

function filteredProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  const audience = audienceFilter.value;
  const budget = Number(budgetFilter.value);
  const tab = state.activeTab;

  let output = products().filter((product) => {
    const queryMatch =
      !query ||
      [product.name, product.category, product.summary, product.format, ...(product.tags || [])]
        .join(" ")
        .toLowerCase()
        .includes(query);
    const categoryMatch = category === "all" || product.category === category;
    const tabMatch = tab === "all" || product.category === tab;
    const audienceMatch = audience === "all" || product.audience.includes(audience);
    const budgetMatch = product.price <= budget;
    return queryMatch && categoryMatch && tabMatch && audienceMatch && budgetMatch;
  });

  const sort = sortFilter.value;
  if (sort === "price-asc") output.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") output.sort((a, b) => b.price - a.price);
  if (sort === "rating") output.sort((a, b) => b.rating - a.rating);
  if (sort === "featured") output.sort((a, b) => b.featured - a.featured);

  return output;
}

function renderProducts() {
  const list = filteredProducts();

  if (!list.length) {
    productGrid.innerHTML = '<p class="empty-state">No products match this filter.</p>';
    return;
  }

  productGrid.innerHTML = list
    .map(
      (product) => `
        <article class="product-card">
          <figure class="product-shot shot-${escapeHtml(product.cover)}"></figure>
          <div class="product-body">
            <div class="meta-row">
              <span class="pill">${escapeHtml(product.category)}</span>
              <span class="rating">${product.rating.toFixed(1)}</span>
            </div>
            <h3>${escapeHtml(product.name)}</h3>
            <p>${escapeHtml(product.summary)}</p>
            <ul class="feature-list">
              ${product.features.map((feature) => `<li>${escapeHtml(feature)}</li>`).join("")}
            </ul>
            <span class="pill">${escapeHtml(product.format)}</span>
          </div>
          <footer class="product-footer">
            <span class="price">${money(product.price)}</span>
            <button class="primary-button" type="button" data-add-product="${escapeHtml(product.id)}">
              Add to Cart
            </button>
          </footer>
        </article>
      `
    )
    .join("");
}

function renderCart() {
  const cartCount = state.cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = state.cart.reduce((total, item) => total + item.price * item.quantity, 0);

  document.querySelector("[data-cart-count]").textContent = cartCount;
  document.querySelector("[data-cart-total]").textContent = money(cartTotal);

  if (!state.cart.length) {
    cartItems.innerHTML = '<p class="empty-state">Your cart is empty.</p>';
    return;
  }

  cartItems.innerHTML = state.cart
    .map(
      (item) => `
        <article class="cart-line">
          <div>
            <h3>${escapeHtml(item.name)}</h3>
            <p>${item.quantity} x ${money(item.price)}</p>
          </div>
          <button class="icon-button" type="button" data-remove-product="${escapeHtml(item.id)}" aria-label="Remove ${escapeHtml(
            item.name
          )}">X</button>
        </article>
      `
    )
    .join("");
}

function renderDownloads() {
  const purchasedIds = new Set(state.purchases.map((purchase) => purchase.id));
  const purchased = products().filter((product) => purchasedIds.has(product.id));
  const locked = products()
    .filter((product) => !purchasedIds.has(product.id))
    .slice(0, Math.max(0, 6 - purchased.length));

  const cards = [
    ...purchased.map((product) => ({ product, locked: false })),
    ...locked.map((product) => ({ product, locked: true })),
  ];

  if (!cards.length) {
    downloadGrid.innerHTML = '<p class="empty-state">Products you checkout will appear here.</p>';
    return;
  }

  downloadGrid.innerHTML = cards
    .map(({ product, locked }) => {
      const action = locked
        ? `<button class="secondary-button" type="button" data-add-product="${escapeHtml(product.id)}">Unlock</button>`
        : `<button class="primary-button" type="button" data-download-product="${escapeHtml(product.id)}">Download Pack</button>`;

      return `
        <article class="download-card ${locked ? "locked" : ""}">
          <span class="pill">${locked ? "Locked" : "Unlocked"}</span>
          <h3>${escapeHtml(product.name)}</h3>
          <p>${escapeHtml(product.format)}</p>
          ${action}
        </article>
      `;
    })
    .join("");
}

function addToCart(productId) {
  const product = products().find((item) => item.id === productId);
  if (!product) return;

  const existing = state.cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      quantity: 1,
    });
  }

  writeStorage("promptlypro-cart", state.cart);
  renderCart();
  showToast(`${product.name} added to cart.`);
}

function removeFromCart(productId) {
  state.cart = state.cart.filter((item) => item.id !== productId);
  writeStorage("promptlypro-cart", state.cart);
  renderCart();
}

function setOverlay(isVisible) {
  overlay.hidden = !isVisible;
}

function openCart() {
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  setOverlay(true);
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  if (!adminModal.classList.contains("open")) setOverlay(false);
}

function openAdmin() {
  adminModal.classList.add("open");
  adminModal.setAttribute("aria-hidden", "false");
  setOverlay(true);
}

function closeAdmin() {
  adminModal.classList.remove("open");
  adminModal.setAttribute("aria-hidden", "true");
  if (!cartDrawer.classList.contains("open")) setOverlay(false);
}

async function checkout() {
  if (!state.cart.length) {
    showToast("Add at least one product first.");
    return;
  }

  try {
    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: state.cart }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
    }
  } catch {
    // Static demo mode continues below until Stripe is configured.
  }

  state.purchases = mergePurchases(state.purchases, state.cart);
  state.cart = [];
  writeStorage("promptlypro-purchases", state.purchases);
  writeStorage("promptlypro-cart", state.cart);
  renderCart();
  renderDownloads();
  closeCart();
  showToast("Demo order complete. Downloads unlocked.");
}

function mergePurchases(existing, cartItemsList) {
  const seen = new Map(existing.map((purchase) => [purchase.id, purchase]));
  cartItemsList.forEach((item) => {
    seen.set(item.id, {
      id: item.id,
      name: item.name,
      purchasedAt: new Date().toISOString(),
    });
  });
  return [...seen.values()];
}

function recommendProducts({ role, goal, budget }) {
  const words = goal.toLowerCase().split(/\W+/).filter(Boolean);
  const wordSet = new Set(words);

  return products()
    .map((product) => {
      let score = product.featured / 2;
      if (product.audience.includes(role)) score += 35;
      if (product.price <= budget) score += 18;
      product.tags.forEach((tag) => {
        if (wordSet.has(tag)) score += 18;
        if (goal.toLowerCase().includes(tag)) score += 10;
      });
      if (product.summary.toLowerCase().includes(role.replace("-", " "))) score += 5;
      return { product, score: Math.min(100, Math.round(score)) };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

function renderRecommendations(matches, goal) {
  const html = matches
    .map(
      ({ product, score }, index) => `
        <article class="recommendation-item">
          <div class="meta-row">
            <div>
              <span class="pill">Match ${index + 1}</span>
              <h3>${escapeHtml(product.name)}</h3>
            </div>
            <strong>${money(product.price)}</strong>
          </div>
          <p>${escapeHtml(product.summary)}</p>
          <div class="score-meter" aria-label="${score}% match">
            <span style="width:${score}%"></span>
          </div>
          <p><strong>Why it fits:</strong> ${escapeHtml(reasonFor(product, goal))}</p>
          <button class="primary-button" type="button" data-add-product="${escapeHtml(product.id)}">Add to Cart</button>
        </article>
      `
    )
    .join("");

  document.querySelector("#finderResults").innerHTML = `<div class="recommendation-list">${html}</div>`;
}

function reasonFor(product, goal) {
  const goalText = goal.toLowerCase();
  if (goalText.includes("client") || goalText.includes("proposal")) {
    return "It supports client acquisition, positioning, and repeatable sales conversations.";
  }
  if (goalText.includes("job") || goalText.includes("resume") || goalText.includes("career")) {
    return "It strengthens your career materials and gives you a clearer application workflow.";
  }
  if (goalText.includes("content") || goalText.includes("brand")) {
    return "It gives you reusable content assets and a faster publishing rhythm.";
  }
  if (goalText.includes("autom") || goalText.includes("time") || goalText.includes("workflow")) {
    return "It helps remove repeated manual work with reusable systems and templates.";
  }
  return `It is a strong ${product.category.toLowerCase()} option for your selected audience.`;
}

function buildPrompt() {
  const task = document.querySelector("#promptTask").value;
  const audience = document.querySelector("#promptAudience").value.trim() || "my target audience";
  const tone = document.querySelector("#promptTone").value;
  const output = document.querySelector("#promptOutput").value;
  const taskMap = {
    sales: "write sales outreach that starts a useful conversation",
    resume: "rewrite a resume section so it is specific, credible, and ATS-friendly",
    content: "build a content calendar with hooks, post ideas, and conversion angles",
    operations: "design a simple automation workflow with triggers, actions, and safeguards",
    course: "outline a mini course with lessons, outcomes, exercises, and launch copy",
    support: "create customer support responses that are empathetic and consistent",
  };

  return `You are an expert AI work assistant.

Goal: ${taskMap[task]}.
Audience: ${audience}.
Tone: ${tone}.
Output format: ${output}.

Context:
- My offer, product, or role is: [fill this in]
- My constraints are: [fill this in]
- My preferred tools are: [fill this in]

Instructions:
1. Ask up to three clarifying questions only if the missing context would change the result.
2. Create the result in practical sections with clear labels.
3. Include examples I can reuse immediately.
4. Add a short quality checklist at the end.
5. Keep the language natural, direct, and ready to publish.`;
}

function matchResume() {
  const role = document.querySelector("#resumeRole").value.trim() || "your target role";
  const level = document.querySelector("#resumeLevel").value;
  const style = document.querySelector("#resumeStyle").value;
  const resumeProduct = products().find((product) => product.id === "career-launch-resume-kit");
  const brandProduct = products().find((product) => product.id === "linkedin-personal-brand-kit");

  const levelAdvice = {
    entry: "Lead with projects, internships, tools, coursework, and measurable learning outcomes.",
    mid: "Lead with role impact, systems owned, process improvements, and quantified delivery.",
    senior: "Lead with leadership scope, architecture decisions, revenue impact, risk reduction, and mentoring.",
    "career-change": "Lead with transferable proof, portfolio projects, target keywords, and a tight career-change summary.",
  };

  const styleAdvice = {
    ats: "Use a single-column layout, simple headings, rich keywords, and measurable bullet points.",
    modern: "Use a clean profile section, selected project links, and a compact visual hierarchy.",
    executive: "Use a leadership summary, signature achievements, and board-level business language.",
    international: "Use region-friendly formatting, concise role summaries, and optional language or relocation details.",
  };

  document.querySelector("#resumeResults").innerHTML = `
    <div class="recommendation-list">
      <article class="recommendation-item">
        <span class="pill">Best match</span>
        <h3>${escapeHtml(resumeProduct.name)}</h3>
        <p><strong>Positioning for ${escapeHtml(role)}:</strong> ${escapeHtml(levelAdvice[level])}</p>
        <p><strong>Format:</strong> ${escapeHtml(styleAdvice[style])}</p>
        <button class="primary-button" type="button" data-add-product="${resumeProduct.id}">Add Resume Kit</button>
      </article>
      <article class="recommendation-item">
        <span class="pill">Add-on</span>
        <h3>${escapeHtml(brandProduct.name)}</h3>
        <p>Pair the resume with LinkedIn profile prompts and outreach scripts for a stronger job search system.</p>
        <button class="secondary-button" type="button" data-add-product="${brandProduct.id}">Add LinkedIn Kit</button>
      </article>
    </div>
  `;
}

function downloadText(filename, text) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function downloadProduct(productId) {
  const product = products().find((item) => item.id === productId);
  if (!product) return;

  const content = `${product.name}
${product.category}
${product.format}

Thank you for purchasing this PromptlyPro digital product.

Included:
${product.features.map((feature) => `- ${feature}`).join("\n")}

Next steps:
- Replace placeholders with your business, role, or brand details.
- Save a working copy before editing.
- Connect the production checkout and AI APIs when keys are available.
`;

  downloadText(`${product.id}-download.txt`, content);
  showToast("Download started.");
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast("Copied.");
  } catch {
    downloadText("prompt-copy.txt", text);
    showToast("Clipboard blocked. Downloaded instead.");
  }
}

function exportProducts() {
  const output = JSON.stringify(products(), null, 2);
  downloadText("promptlypro-products.json", output);
}

function addCustomProduct(event) {
  event.preventDefault();
  const name = document.querySelector("#adminName").value.trim();
  const category = document.querySelector("#adminCategory").value;
  const price = Number(document.querySelector("#adminPrice").value);
  const summary = document.querySelector("#adminSummary").value.trim();

  if (!name || !category || !price || !summary) return;

  const coverMap = {
    "Prompt Packs": "prompts",
    "Business Kits": "business",
    "Resume Packs": "resume",
    "Notion Systems": "business",
    "Canva Templates": "canva",
    "Mini Courses": "course",
    "Automation Bundles": "automation",
  };

  state.customProducts.push({
    id: `custom-${slugify(name)}-${Date.now()}`,
    name,
    category,
    audience: ["founders", "freelancers", "teams"],
    price,
    rating: 4.6,
    format: "Digital files",
    cover: coverMap[category] || "business",
    summary,
    features: ["Editable templates", "AI prompt notes", "Usage checklist"],
    tags: [slugify(name), slugify(category), "custom"],
    featured: 70,
  });

  writeStorage("promptlypro-custom-products", state.customProducts);
  event.target.reset();
  hydrateFilters();
  renderProducts();
  renderDownloads();
  showToast("Product added locally.");
}

function bindEvents() {
  [searchInput, categoryFilter, audienceFilter, budgetFilter, sortFilter].forEach((control) => {
    control.addEventListener("input", renderProducts);
  });

  catalogTabs.addEventListener("click", (event) => {
    const button = event.target.closest("[data-tab]");
    if (!button) return;
    state.activeTab = button.dataset.tab;
    catalogTabs.querySelectorAll(".tab-button").forEach((tab) => tab.classList.remove("active"));
    button.classList.add("active");
    renderProducts();
  });

  document.addEventListener("click", (event) => {
    const addButton = event.target.closest("[data-add-product]");
    const removeButton = event.target.closest("[data-remove-product]");
    const downloadButton = event.target.closest("[data-download-product]");

    if (addButton) addToCart(addButton.dataset.addProduct);
    if (removeButton) removeFromCart(removeButton.dataset.removeProduct);
    if (downloadButton) downloadProduct(downloadButton.dataset.downloadProduct);
  });

  document.querySelector("[data-open-cart]").addEventListener("click", openCart);
  document.querySelector("[data-close-cart]").addEventListener("click", closeCart);
  document.querySelector("[data-open-admin]").addEventListener("click", openAdmin);
  document.querySelector("[data-close-admin]").addEventListener("click", closeAdmin);
  document.querySelector("[data-checkout]").addEventListener("click", checkout);

  overlay.addEventListener("click", () => {
    closeCart();
    closeAdmin();
  });

  document.querySelector("#finderForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const role = document.querySelector("#finderRole").value;
    const goal = document.querySelector("#finderGoal").value.trim();
    const budget = Number(document.querySelector("#finderBudget").value);
    const matches = recommendProducts({ role, goal, budget });
    renderRecommendations(matches, goal);
  });

  document.querySelector("#promptForm").addEventListener("submit", (event) => {
    event.preventDefault();
    document.querySelector("#promptOutputText").value = buildPrompt();
  });

  document.querySelector("[data-copy-prompt]").addEventListener("click", () => {
    copyText(document.querySelector("#promptOutputText").value || buildPrompt());
  });

  document.querySelector("[data-download-prompt]").addEventListener("click", () => {
    downloadText("ai-prompt.txt", document.querySelector("#promptOutputText").value || buildPrompt());
  });

  document.querySelector("#resumeForm").addEventListener("submit", (event) => {
    event.preventDefault();
    matchResume();
  });

  document.querySelector("#adminForm").addEventListener("submit", addCustomProduct);
  document.querySelector("[data-export-products]").addEventListener("click", exportProducts);
  document.querySelector("[data-clear-custom]").addEventListener("click", () => {
    state.customProducts = [];
    writeStorage("promptlypro-custom-products", state.customProducts);
    hydrateFilters();
    renderProducts();
    renderDownloads();
    showToast("Custom products cleared.");
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeCart();
      closeAdmin();
    }
  });
}

function init() {
  hydrateFilters();
  renderProducts();
  renderCart();
  renderDownloads();
  document.querySelector("#promptOutputText").value = buildPrompt();
  bindEvents();
}

init();
