const STORAGE_KEYS = {
  cart: "promptlypro-cart-v2",
  purchases: "promptlypro-purchases-v2",
  customProducts: "promptlypro-custom-products-v2",
};

const state = {
  cart: readStorage(STORAGE_KEYS.cart, []),
  purchases: readStorage(STORAGE_KEYS.purchases, []),
  customProducts: readStorage(STORAGE_KEYS.customProducts, []),
};

const FINDER_KEYWORD_ALIASES = {
  automation: ["automation", "automate", "automated", "workflow", "zapier"],
  leads: ["lead", "leads", "prospect", "prospects"],
  templates: ["template", "templates"],
  prompts: ["prompt", "prompts"],
  clients: ["client", "clients"],
  sales: ["sale", "sales", "sell", "selling"],
  resume: ["resume", "cv"],
  operations: ["operation", "operations", "ops"],
};

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

function allProducts() {
  return [...window.PROMPTLY_PRODUCTS, ...state.customProducts];
}

function productById(id) {
  return allProducts().find((product) => product.id === id);
}

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

function rootPath() {
  return window.location.pathname.includes("/products/") ? "../" : "";
}

function imagePath(product) {
  return `${rootPath()}assets/img/${product.image || "product-default.png"}`;
}

function productUrl(product) {
  return `${rootPath()}product.html?id=${encodeURIComponent(product.id)}`;
}

async function postJson(endpoint, payload) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function finderGoalMatchesTag(tag, goalText, goalWords) {
  const candidates = FINDER_KEYWORD_ALIASES[tag] || [tag];
  return candidates.some((candidate) => goalWords.has(candidate) || goalText.includes(candidate));
}

function setActiveNavigation() {
  const page = document.body.dataset.page || "home";
  document.querySelectorAll("[data-nav]").forEach((link) => {
    link.classList.toggle("active", link.dataset.nav === page);
  });
}

function renderCartCount() {
  const count = state.cart.reduce((total, item) => total + item.quantity, 0);
  document.querySelectorAll("[data-cart-count]").forEach((node) => {
    node.textContent = String(count);
  });
}

function addToCart(productId, quantity = 1) {
  const product = productById(productId);
  if (!product) return;

  const existing = state.cart.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    state.cart.push({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      quantity,
    });
  }

  writeStorage(STORAGE_KEYS.cart, state.cart);
  renderCartCount();
  showToast(`${product.name} added to cart.`);
}

function removeFromCart(productId) {
  state.cart = state.cart.filter((item) => item.id !== productId);
  writeStorage(STORAGE_KEYS.cart, state.cart);
  renderCartCount();
  renderCartPage();
}

function updateCartQuantity(productId, quantity) {
  const item = state.cart.find((entry) => entry.id === productId);
  if (!item) return;
  item.quantity = Math.max(1, Number(quantity) || 1);
  writeStorage(STORAGE_KEYS.cart, state.cart);
  renderCartCount();
  renderCartPage();
}

function cartTotal() {
  return state.cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

function showToast(message) {
  let toast = document.querySelector("[data-toast]");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    toast.dataset.toast = "";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

function productCard(product, options = {}) {
  const aiScore = Math.min(99, Math.round(product.featured * 0.7 + product.rating * 6));
  const action = options.compact
    ? ""
    : `<button class="button primary" type="button" data-add-product="${escapeHtml(product.id)}">Add to Cart</button>`;

  return `
    <article class="product-card">
      <a class="product-media" href="${productUrl(product)}" aria-label="View ${escapeHtml(product.name)}">
        <img src="${imagePath(product)}" alt="${escapeHtml(product.name)} product preview" loading="lazy" />
        <span class="badge">${escapeHtml(product.badge)}</span>
      </a>
      <div class="product-content">
        <div class="meta-row">
          <span class="category-pill">${escapeHtml(product.category)}</span>
          <span class="rating">${product.rating.toFixed(1)}/5</span>
        </div>
        <h3><a href="${productUrl(product)}">${escapeHtml(product.name)}</a></h3>
        <p>${escapeHtml(product.summary)}</p>
        <div class="product-signal">
          <span>AI fit</span>
          <strong>${aiScore}%</strong>
        </div>
        <ul class="feature-list">
          ${product.features.slice(0, 3).map((feature) => `<li>${escapeHtml(feature)}</li>`).join("")}
        </ul>
      </div>
      <footer class="product-footer">
        <strong>${money(product.price)}</strong>
        ${action}
      </footer>
    </article>
  `;
}

function renderFeaturedProducts() {
  const target = document.querySelector("[data-featured-products]");
  if (!target) return;
  target.innerHTML = allProducts()
    .sort((a, b) => b.featured - a.featured)
    .slice(0, 4)
    .map((product) => productCard(product))
    .join("");
}

function renderCategoryBlocks() {
  const target = document.querySelector("[data-category-grid]");
  if (!target) return;

  const categories = Object.entries(window.PROMPTLY_CATEGORY_COPY);
  target.innerHTML = categories
    .map(([category, copy]) => {
      const count = allProducts().filter((product) => product.category === category).length;
      return `
        <a class="category-card" href="${rootPath()}store.html?category=${encodeURIComponent(category)}">
          <span>${escapeHtml(category)}</span>
          <strong>${count} products</strong>
          <p>${escapeHtml(copy)}</p>
        </a>
      `;
    })
    .join("");
}

function renderCatalogPage() {
  const target = document.querySelector("[data-product-grid]");
  if (!target) return;

  const categorySelect = document.querySelector("#categoryFilter");
  const audienceSelect = document.querySelector("#audienceFilter");
  const budgetSelect = document.querySelector("#budgetFilter");
  const sortSelect = document.querySelector("#sortFilter");
  const searchInput = document.querySelector("#searchInput");
  const tabs = document.querySelector("[data-category-tabs]");
  const countNode = document.querySelector("[data-result-count]");

  const categories = Object.keys(window.PROMPTLY_CATEGORY_COPY);
  categorySelect.innerHTML = '<option value="all">All categories</option>';
  categories.forEach((category) => {
    categorySelect.insertAdjacentHTML(
      "beforeend",
      `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`
    );
  });

  tabs.innerHTML = `
    <button class="chip active" type="button" data-category-tab="all">All</button>
    ${categories
      .map((category) => `<button class="chip" type="button" data-category-tab="${escapeHtml(category)}">${escapeHtml(category)}</button>`)
      .join("")}
  `;

  const urlCategory = new URLSearchParams(window.location.search).get("category");
  if (urlCategory && categories.includes(urlCategory)) {
    categorySelect.value = urlCategory;
    tabs.querySelectorAll(".chip").forEach((button) => {
      button.classList.toggle("active", button.dataset.categoryTab === urlCategory);
    });
  }

  function filters() {
    const query = searchInput.value.trim().toLowerCase();
    const category = categorySelect.value;
    const audience = audienceSelect.value;
    const budget = Number(budgetSelect.value);

    let output = allProducts().filter((product) => {
      const haystack = [product.name, product.category, product.summary, product.details, product.format, ...product.tags]
        .join(" ")
        .toLowerCase();
      const queryMatch = !query || haystack.includes(query);
      const categoryMatch = category === "all" || product.category === category;
      const audienceMatch = audience === "all" || product.audience.includes(audience);
      const budgetMatch = product.price <= budget;
      return queryMatch && categoryMatch && audienceMatch && budgetMatch;
    });

    const sort = sortSelect.value;
    if (sort === "price-asc") output.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") output.sort((a, b) => b.price - a.price);
    if (sort === "rating") output.sort((a, b) => b.rating - a.rating);
    if (sort === "featured") output.sort((a, b) => b.featured - a.featured);
    return output;
  }

  function draw() {
    const list = filters();
    countNode.textContent = `${list.length} product${list.length === 1 ? "" : "s"}`;
    target.innerHTML = list.length
      ? list.map((product) => productCard(product)).join("")
      : '<p class="empty-state">No products match these filters.</p>';
  }

  [categorySelect, audienceSelect, budgetSelect, sortSelect, searchInput].forEach((control) => {
    control.addEventListener("input", draw);
  });

  tabs.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category-tab]");
    if (!button) return;
    categorySelect.value = button.dataset.categoryTab;
    tabs.querySelectorAll(".chip").forEach((chip) => chip.classList.remove("active"));
    button.classList.add("active");
    draw();
  });

  draw();
}

function renderProductDetail() {
  const target = document.querySelector("[data-product-detail]");
  if (!target) return;

  const id = new URLSearchParams(window.location.search).get("id");
  const product = productById(id) || allProducts()[0];
  document.title = `${product.name} | PromptlyPro`;

  const related = allProducts()
    .filter((entry) => entry.id !== product.id && (entry.category === product.category || entry.audience.some((role) => product.audience.includes(role))))
    .slice(0, 3);

  target.innerHTML = `
    <section class="product-detail-layout">
      <div class="product-detail-media">
        <img src="${imagePath(product)}" alt="${escapeHtml(product.name)} product preview" />
        <div class="detail-media-strip">
          <div><strong>${product.rating.toFixed(1)}/5</strong><span>buyer signal</span></div>
          <div><strong>${product.features.length}</strong><span>included assets</span></div>
          <div><strong>Instant</strong><span>delivery</span></div>
        </div>
      </div>
      <div class="product-detail-copy">
        <span class="category-pill">${escapeHtml(product.category)}</span>
        <h1>${escapeHtml(product.name)}</h1>
        <p>${escapeHtml(product.details)}</p>
        <div class="product-fit-panel">
          <span>AI buying note</span>
          <p>This product is strongest for ${product.audience.map((item) => escapeHtml(item.replace("-", " "))).join(", ")} who need ${product.outcomes.map((item) => escapeHtml(item.toLowerCase())).join(", ")}.</p>
        </div>
        <div class="price-row">
          <strong>${money(product.price)}</strong>
          <span>${product.rating.toFixed(1)} rating</span>
        </div>
        <div class="purchase-panel">
          <button class="button primary" type="button" data-add-product="${escapeHtml(product.id)}">Add to Cart</button>
          <a class="button secondary" href="${rootPath()}cart.html">Go to Checkout</a>
        </div>
        <dl class="spec-list">
          <div><dt>Format</dt><dd>${escapeHtml(product.format)}</dd></div>
          <div><dt>Audience</dt><dd>${product.audience.map((item) => escapeHtml(item.replace("-", " "))).join(", ")}</dd></div>
          <div><dt>Delivery</dt><dd>Instant digital download after checkout</dd></div>
        </dl>
      </div>
    </section>
    <section class="section">
      <div class="section-heading narrow">
        <span class="eyebrow">Inside the pack</span>
        <h2>Everything Included</h2>
      </div>
      <div class="feature-grid">
        ${product.features.map((feature, index) => `<div class="feature-card numbered"><span>${String(index + 1).padStart(2, "0")}</span><strong>${escapeHtml(feature)}</strong><p>Editable, reusable, and built for practical delivery.</p></div>`).join("")}
      </div>
    </section>
    <section class="section">
      <div class="section-heading narrow">
        <span class="eyebrow">Outcomes</span>
        <h2>What Buyers Can Do Faster</h2>
      </div>
      <div class="outcome-row">
        ${product.outcomes.map((outcome) => `<span>${escapeHtml(outcome)}</span>`).join("")}
      </div>
    </section>
    <section class="section">
      <div class="section-heading">
        <div>
          <span class="eyebrow">Related products</span>
          <h2>Build a Better Bundle</h2>
        </div>
        <a class="text-link" href="${rootPath()}store.html">View all products</a>
      </div>
      <div class="product-grid three">
        ${related.map((entry) => productCard(entry, { compact: true })).join("")}
      </div>
    </section>
  `;
}

function renderCartPage() {
  const target = document.querySelector("[data-cart-page]");
  if (!target) return;

  if (!state.cart.length) {
    target.innerHTML = `
      <div class="empty-panel">
        <h2>Your cart is empty</h2>
        <p>Add a few digital products and return here to complete checkout.</p>
        <a class="button primary" href="${rootPath()}store.html">Browse Store</a>
      </div>
    `;
    return;
  }

  target.innerHTML = `
    <div class="cart-layout">
      <section class="cart-list">
        ${state.cart
          .map((item) => {
            const product = productById(item.id);
            return `
              <article class="cart-item">
                <img src="${imagePath(product || item)}" alt="${escapeHtml(item.name)} preview" />
                <div>
                  <span class="category-pill">${escapeHtml(item.category)}</span>
                  <h3>${escapeHtml(item.name)}</h3>
                  <p>${money(item.price)} each</p>
                </div>
                <label>
                  <span>Qty</span>
                  <input type="number" min="1" value="${item.quantity}" data-update-quantity="${escapeHtml(item.id)}" />
                </label>
                <strong>${money(item.price * item.quantity)}</strong>
                <button class="button ghost" type="button" data-remove-product="${escapeHtml(item.id)}">Remove</button>
              </article>
            `;
          })
          .join("")}
      </section>
      <aside class="checkout-summary">
        <span class="eyebrow">Order summary</span>
        <div><span>Subtotal</span><strong>${money(cartTotal())}</strong></div>
        <div><span>Delivery</span><strong>Instant</strong></div>
        <div><span>Tax</span><strong>Calculated by Stripe</strong></div>
        <div><span>Access</span><strong>Download vault</strong></div>
        <button class="button primary full" type="button" data-checkout>Complete Checkout</button>
        <p>Your products unlock instantly after checkout. Payment processing can connect to Stripe when production keys are added.</p>
      </aside>
    </div>
  `;
}

async function checkout() {
  if (!state.cart.length) {
    showToast("Add a product first.");
    return;
  }

  let unlockLocally = false;

  try {
    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: state.cart }),
    });
    const data = await response.json().catch(() => ({}));

    if (response.ok) {
      if (data.url) {
        window.location.href = data.url;
        return;
      }

      if (data.unlockLocally) unlockLocally = true;
    } else {
      showToast(data.error || "Checkout service is unavailable.");
      return;
    }
  } catch {
    unlockLocally = true;
  }

  if (!unlockLocally) return;

  const existing = new Map(state.purchases.map((purchase) => [purchase.id, purchase]));
  state.cart.forEach((item) => {
    existing.set(item.id, { id: item.id, name: item.name, purchasedAt: new Date().toISOString() });
  });
  state.purchases = [...existing.values()];
  state.cart = [];
  writeStorage(STORAGE_KEYS.purchases, state.purchases);
  writeStorage(STORAGE_KEYS.cart, state.cart);
  renderCartCount();
  showToast("Checkout complete. Downloads unlocked.");
  window.setTimeout(() => {
    window.location.href = `${rootPath()}downloads.html`;
  }, 700);
}

function renderDownloadsPage() {
  const target = document.querySelector("[data-downloads-page]");
  if (!target) return;

  const purchasedIds = new Set(state.purchases.map((purchase) => purchase.id));
  const purchased = allProducts().filter((product) => purchasedIds.has(product.id));
  const suggestions = allProducts().filter((product) => !purchasedIds.has(product.id)).slice(0, 4);

  if (!purchased.length) {
    target.innerHTML = `
      <div class="empty-panel">
        <h2>No downloads yet</h2>
        <p>Complete checkout and your product files will appear here.</p>
        <a class="button primary" href="${rootPath()}store.html">Shop Products</a>
      </div>
      <div class="section-heading vault-suggestions">
        <div>
          <span class="eyebrow">Suggested next</span>
          <h2>Start with a Curated Product</h2>
        </div>
      </div>
      <div class="product-grid four">${suggestions.map((product) => productCard(product, { compact: true })).join("")}</div>
    `;
    return;
  }

  target.innerHTML = `
    <div class="download-grid">
      ${purchased
        .map(
          (product) => `
            <article class="download-card">
              <img src="${imagePath(product)}" alt="${escapeHtml(product.name)} preview" />
              <div>
                <span class="category-pill">Unlocked</span>
                <h3>${escapeHtml(product.name)}</h3>
                <p>${escapeHtml(product.format)}</p>
              </div>
              <div class="download-meta"><span>License</span><strong>Internal use</strong></div>
              <button class="button primary" type="button" data-download-product="${escapeHtml(product.id)}">Download Files</button>
            </article>
          `
        )
        .join("")}
    </div>
  `;
}

function downloadProduct(productId) {
  const product = productById(productId);
  if (!product) return;

  const body = `${product.name}
${product.category}
${product.format}

Included:
${product.features.map((feature) => `- ${feature}`).join("\n")}

Implementation notes:
- Replace fill-in lines with your business, role, or brand details.
- Keep a working copy before editing.
- Connect Stripe webhook fulfillment before selling real customer downloads.
`;

  downloadText(`${product.id}-download.txt`, body);
  showToast("Download started.");
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

function renderFinderPage() {
  const form = document.querySelector("[data-finder-form]");
  if (!form) return;

  const result = document.querySelector("[data-finder-results]");
  const priorityTags = {
    speed: ["automation", "workflow", "templates", "planner", "prompts"],
    revenue: ["sales", "clients", "proposal", "launch", "outreach"],
    quality: ["support", "sop", "brand", "workflow", "operations"],
    career: ["resume", "linkedin", "career", "interview", "profile"],
  };

  function localMatches({ role, goal, budget, priority }) {
    const words = new Set(goal.toLowerCase().split(/\W+/).filter(Boolean));
    return allProducts()
      .map((product) => {
        let score = product.featured / 2;
        if (product.audience.includes(role)) score += 34;
        if (product.price <= budget) score += 16;
        (priorityTags[priority] || []).forEach((tag) => {
          if (product.tags.includes(tag) || product.summary.toLowerCase().includes(tag)) score += 8;
        });
        product.tags.forEach((tag) => {
          if (finderGoalMatchesTag(tag, goal.toLowerCase(), words)) score += 12;
        });
        return { product, rawScore: score, score: Math.min(100, Math.round(score)) };
      })
      .sort((a, b) => b.rawScore - a.rawScore)
      .slice(0, 3);
  }

  function drawMatches(matches, data = {}) {
    result.innerHTML = `
      <div class="recommendation-summary">
        <div>
          <span class="eyebrow">${data.mode === "openai" ? "AI recommendation" : "Smart recommendation"}</span>
          <h2>${data.confidence || matches[0]?.score || 92}% confidence match</h2>
        </div>
        <p>${escapeHtml(data.bundleStrategy || "Start with the closest-fit product, then add one workflow asset that supports the same outcome.")}</p>
      </div>
      ${matches
        .map(({ product, score }, index) => {
          const reason =
            (Array.isArray(data.reasons) && data.reasons[index]) ||
            `Recommended because it aligns with your buyer role, budget, and selected priority.`;

          return `
            <article class="recommendation">
              <div>
                <span class="category-pill">Match ${index + 1}</span>
                <h3>${escapeHtml(product.name)}</h3>
                <p>${escapeHtml(product.summary)}</p>
              </div>
              <div class="recommendation-meta">
                <div><span>Fit score</span><strong>${score}%</strong></div>
                <div><span>Best for</span><strong>${escapeHtml((product.audience.includes(data.role) ? data.role : product.audience[0]).replace("-", " "))}</strong></div>
              </div>
              <div class="score-bar"><span style="width:${score}%"></span></div>
              <p class="recommendation-note">${escapeHtml(reason)}</p>
              <div class="recommendation-actions">
                <a class="button secondary" href="${productUrl(product)}">View Details</a>
                <button class="button primary" type="button" data-add-product="${escapeHtml(product.id)}">Add to Cart</button>
              </div>
            </article>
          `;
        })
        .join("")}
    `;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const role = document.querySelector("#finderRole").value;
    const goal = document.querySelector("#finderGoal").value.trim();
    const budget = Number(document.querySelector("#finderBudget").value);
    const priority = document.querySelector("#finderPriority")?.value || "speed";
    const payload = { role, goal, budget, priority, products: allProducts() };
    const fallbackMatches = localMatches(payload);

    result.innerHTML = `
      <div class="assistant-empty">
        <span class="eyebrow">AI finder</span>
        <h3>Analyzing buyer intent...</h3>
        <p>Matching your role, budget, goal, and launch priority against the product catalog.</p>
      </div>
    `;

    try {
      const data = await postJson("/api/ai-recommend", payload);
      const matches = (data.productIds || [])
        .map((id, index) => {
          const product = productById(id);
          if (!product) return null;
          const localScore = fallbackMatches.find((match) => match.product.id === id)?.score;
          return { product, score: localScore || Math.max(82, Number(data.confidence || 90) - index * 4) };
        })
        .filter(Boolean);

      drawMatches(matches.length ? matches : fallbackMatches, { ...data, role });
    } catch {
      drawMatches(fallbackMatches, {
        mode: "browser-fallback",
        role,
        bundleStrategy:
          "The live API is offline, so the browser matched products by audience, budget, priority, and catalog tags.",
      });
    }
  });
}

function renderPromptStudio() {
  const form = document.querySelector("[data-prompt-form]");
  if (!form) return;

  const output = document.querySelector("#promptOutputText");

  function promptPayload() {
    const task = document.querySelector("#promptTask").value;
    const audience = document.querySelector("#promptAudience").value.trim() || "my target audience";
    const context = document.querySelector("#promptContext")?.value.trim() || "my current project";
    const tone = document.querySelector("#promptTone").value;
    const format = document.querySelector("#promptFormat").value;
    return { task, audience, context, tone, output: format };
  }

  function buildPrompt() {
    const { task, audience, context, tone, output: format } = promptPayload();
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
Context: ${context}.
Tone: ${tone}.
Output format: ${format}.

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

  output.value = buildPrompt();
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    output.value = "Generating a production-ready AI prompt...";

    try {
      const data = await postJson("/api/generate-prompt", promptPayload());
      output.value = data.prompt || buildPrompt();
      showToast(data.mode === "openai" ? "AI prompt generated." : "Prompt generated in local mode.");
    } catch {
      output.value = buildPrompt();
      showToast("Prompt generated with browser fallback.");
    }
  });

  document.querySelector("[data-copy-prompt]").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(output.value);
      showToast("Prompt copied.");
    } catch {
      downloadText("ai-prompt.txt", output.value);
      showToast("Clipboard blocked. Downloaded prompt.");
    }
  });

  document.querySelector("[data-download-prompt]").addEventListener("click", () => {
    downloadText("ai-prompt.txt", output.value);
  });
}

function renderResumePicker() {
  const form = document.querySelector("[data-resume-form]");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const role = document.querySelector("#resumeRole").value.trim() || "your target role";
    const industry = document.querySelector("#resumeIndustry")?.value || "technology";
    const level = document.querySelector("#resumeLevel").value;
    const style = document.querySelector("#resumeStyle").value;
    const result = document.querySelector("[data-resume-results]");
    const resume = productById("career-launch-resume-kit");
    const linkedin = productById("linkedin-personal-brand-kit");

    const levelAdvice = {
      entry: "Lead with projects, internships, tools, coursework, and measurable learning outcomes.",
      mid: "Lead with role impact, systems owned, process improvements, and quantified delivery.",
      senior: "Lead with leadership scope, architecture decisions, revenue impact, risk reduction, and mentoring.",
      "career-change": "Lead with transferable proof, portfolio projects, target keywords, and a tight transition summary.",
    };

    const styleAdvice = {
      ats: "Use a single-column layout, simple headings, rich keywords, and measurable bullet points.",
      modern: "Use a clean profile section, selected project links, and compact visual hierarchy.",
      executive: "Use a leadership summary, signature achievements, and business-level impact language.",
      international: "Use region-friendly formatting, concise role summaries, and optional language or relocation details.",
    };
    const industryAdvice = {
      technology: "Show tools, systems, uptime, delivery impact, architecture, and automation proof.",
      operations: "Show process improvement, coordination, cost control, quality, and execution rhythm.",
      sales: "Show pipeline movement, revenue influence, conversion, retention, and customer proof.",
      finance: "Show accuracy, reporting, controls, reconciliation, forecasting, and stakeholder clarity.",
      creative: "Show campaign outcomes, portfolio proof, content systems, brand consistency, and audience growth.",
    };

    result.innerHTML = `
      <article class="recommendation">
        <span class="category-pill">Best match</span>
        <h3>${escapeHtml(resume.name)}</h3>
        <p><strong>Positioning for ${escapeHtml(role)}:</strong> ${escapeHtml(levelAdvice[level])}</p>
        <p><strong>Industry angle:</strong> ${escapeHtml(industryAdvice[industry])}</p>
        <p><strong>Format:</strong> ${escapeHtml(styleAdvice[style])}</p>
        <div class="recommendation-meta">
          <div><span>Template fit</span><strong>96%</strong></div>
          <div><span>Add-on fit</span><strong>LinkedIn</strong></div>
        </div>
        <div class="recommendation-actions">
          <a class="button secondary" href="${productUrl(resume)}">View Details</a>
          <button class="button primary" type="button" data-add-product="${resume.id}">Add Resume Kit</button>
        </div>
      </article>
      <article class="recommendation">
        <span class="category-pill">Recommended add-on</span>
        <h3>${escapeHtml(linkedin.name)}</h3>
        <p>Pair the resume with LinkedIn profile prompts and outreach scripts for a stronger job search system.</p>
        <div class="recommendation-actions">
          <a class="button secondary" href="${productUrl(linkedin)}">View Details</a>
          <button class="button primary" type="button" data-add-product="${linkedin.id}">Add LinkedIn Kit</button>
        </div>
      </article>
    `;
  });
}

function renderAdminPage() {
  const form = document.querySelector("[data-admin-form]");
  if (!form) return;

  const table = document.querySelector("[data-admin-products]");
  const countNode = document.querySelector("[data-admin-count]");
  const customNode = document.querySelector("[data-admin-custom]");

  function drawTable() {
    const products = allProducts();
    if (countNode) countNode.textContent = String(products.length);
    if (customNode) customNode.textContent = String(state.customProducts.length);
    table.innerHTML = products
      .map(
        (product) => `
          <tr>
            <td>${escapeHtml(product.name)}</td>
            <td>${escapeHtml(product.category)}</td>
            <td>${money(product.price)}</td>
            <td>${product.rating.toFixed(1)}</td>
          </tr>
        `
      )
      .join("");
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.querySelector("#adminName").value.trim();
    const category = document.querySelector("#adminCategory").value;
    const price = Number(document.querySelector("#adminPrice").value);
    const summary = document.querySelector("#adminSummary").value.trim();

    if (!name || !price || !summary) return;

    state.customProducts.push({
      id: `custom-${slugify(name)}-${Date.now()}`,
      name,
      category,
      audience: ["founders", "freelancers", "teams"],
      price,
      rating: 4.6,
      badge: "Custom",
      format: "Digital files",
      image: "product-default.png",
      summary,
      details: summary,
      features: ["Editable templates", "AI prompt notes", "Usage checklist", "Delivery notes"],
      outcomes: ["Faster setup", "Reusable workflow", "Cleaner delivery"],
      tags: [slugify(name), slugify(category), "custom"],
      featured: 70,
    });

    writeStorage(STORAGE_KEYS.customProducts, state.customProducts);
    form.reset();
    drawTable();
    showToast("Product added locally.");
  });

  document.querySelector("[data-export-products]").addEventListener("click", () => {
    downloadText("promptlypro-products.json", JSON.stringify(allProducts(), null, 2));
  });

  document.querySelector("[data-clear-custom]").addEventListener("click", () => {
    state.customProducts = [];
    writeStorage(STORAGE_KEYS.customProducts, state.customProducts);
    drawTable();
    showToast("Custom products cleared.");
  });

  drawTable();
}

function renderSupportPage() {
  const form = document.querySelector("[data-support-form]");
  if (!form) return;

  function supportText({ email, topic, message, ticketId = "local" }) {
    return `PromptlyPro support request

Ticket: ${ticketId}
Email: ${email}
Topic: ${topic}

Message:
${message}

Production note:
Connect EMAIL_API_KEY, SUPPORT_EMAIL, and a ticketing provider before launch.`;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.querySelector("#supportEmail").value.trim();
    const topic = document.querySelector("#supportTopic").value;
    const message = document.querySelector("#supportMessage").value.trim();
    if (!email || !message) return;

    const button = form.querySelector("button[type='submit']");
    button.disabled = true;

    try {
      const data = await postJson("/api/support-request", { email, topic, message });
      if (data.mode === "local-fallback") {
        downloadText(`promptlypro-support-${data.ticketId}.txt`, supportText({ email, topic, message, ticketId: data.ticketId }));
      }
      form.reset();
      showToast(`Support ticket ${data.ticketId || "prepared"}.`);
    } catch {
      downloadText("promptlypro-support-request.txt", supportText({ email, topic, message }));
      showToast("Support request downloaded for local use.");
    } finally {
      button.disabled = false;
    }
  });
}

function enhanceMotion() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.prepend(progress);

  const revealTargets = document.querySelectorAll(
    [
      ".hero-copy",
      ".hero-showcase",
      ".page-hero",
      ".section-heading",
      ".product-card",
      ".category-card",
      ".feature-card",
      ".intelligence-card",
      ".commerce-status",
      ".module-intro",
      ".module-band",
      ".workflow-panel",
      ".workflow-steps > div",
      ".quality-grid > div",
      ".tool-panel",
      ".result-panel",
      ".recommendation",
      ".download-card",
      ".support-card",
      ".support-form",
      ".policy-nav",
      ".policy-copy",
      ".table-panel",
      ".cart-item",
      ".checkout-summary",
      ".empty-panel",
    ].join(",")
  );

  revealTargets.forEach((element, index) => {
    element.classList.add("reveal");
    element.style.setProperty("--reveal-delay", `${Math.min((index % 8) * 45, 280)}ms`);
  });

  if (reduceMotion) {
    revealTargets.forEach((element) => element.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.04, rootMargin: "0px 0px 16% 0px" }
    );
    revealTargets.forEach((element) => observer.observe(element));
  }

  const header = document.querySelector(".site-header");
  const syncScroll = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progressValue = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
    header?.classList.toggle("is-scrolled", window.scrollY > 12);
    progress.style.transform = `scaleX(${progressValue})`;
  };
  syncScroll();
  window.addEventListener("scroll", syncScroll, { passive: true });

  renderAiHeroCanvas(reduceMotion);
}

function renderAiHeroCanvas(reduceMotion) {
  const canvas = document.querySelector("#aiHeroCanvas");
  if (!canvas) return;

  const context = canvas.getContext("2d");
  const stage = canvas.closest(".hero-showcase");
  const colors = {
    grid: "rgba(255,255,255,0.065)",
    line: "rgba(113, 214, 188, 0.42)",
    lineWarm: "rgba(255, 183, 86, 0.26)",
    point: "rgba(255,255,255,0.78)",
    glow: "rgba(70, 190, 160, 0.18)",
  };

  let width = 0;
  let height = 0;
  let nodes = [];

  function resize() {
    const rect = stage.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, Math.floor(rect.width));
    height = Math.max(1, Math.floor(rect.height));
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    nodes = Array.from({ length: Math.max(26, Math.floor(width / 16)) }, (_, index) => ({
      x: ((index * 91) % width) + 12,
      y: ((index * 57) % height) + 12,
      vx: (index % 2 ? 0.18 : -0.16) * (0.7 + (index % 5) / 8),
      vy: (index % 3 ? -0.13 : 0.17) * (0.7 + (index % 7) / 9),
      r: 1.4 + (index % 4) * 0.45,
    }));
  }

  function draw(time = 0) {
    context.clearRect(0, 0, width, height);
    context.fillStyle = "#111614";
    context.fillRect(0, 0, width, height);

    context.strokeStyle = colors.grid;
    context.lineWidth = 1;
    for (let x = 0; x < width; x += 42) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, height);
      context.stroke();
    }
    for (let y = 0; y < height; y += 42) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(width, y);
      context.stroke();
    }

    nodes.forEach((node) => {
      if (!reduceMotion) {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < -20) node.x = width + 20;
        if (node.x > width + 20) node.x = -20;
        if (node.y < -20) node.y = height + 20;
        if (node.y > height + 20) node.y = -20;
      }
    });

    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const a = nodes[i];
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 142) {
          context.strokeStyle = i % 4 === 0 ? colors.lineWarm : colors.line;
          context.globalAlpha = (142 - distance) / 142;
          context.beginPath();
          context.moveTo(a.x, a.y);
          context.lineTo(b.x, b.y);
          context.stroke();
        }
      }
    }

    context.globalAlpha = 1;
    nodes.forEach((node, index) => {
      const pulse = reduceMotion ? 0 : Math.sin(time / 650 + index) * 0.55;
      context.beginPath();
      context.fillStyle = colors.glow;
      context.arc(node.x, node.y, node.r * 5 + pulse, 0, Math.PI * 2);
      context.fill();
      context.beginPath();
      context.fillStyle = colors.point;
      context.arc(node.x, node.y, node.r, 0, Math.PI * 2);
      context.fill();
    });

    if (!reduceMotion) requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener("resize", () => {
    resize();
    draw();
  });
}

function bindGlobalClicks() {
  document.addEventListener("click", (event) => {
    const addButton = event.target.closest("[data-add-product]");
    const removeButton = event.target.closest("[data-remove-product]");
    const downloadButton = event.target.closest("[data-download-product]");
    const checkoutButton = event.target.closest("[data-checkout]");

    if (addButton) addToCart(addButton.dataset.addProduct);
    if (removeButton) removeFromCart(removeButton.dataset.removeProduct);
    if (downloadButton) downloadProduct(downloadButton.dataset.downloadProduct);
    if (checkoutButton) checkout();
  });

  document.addEventListener("input", (event) => {
    const quantityInput = event.target.closest("[data-update-quantity]");
    if (quantityInput) updateCartQuantity(quantityInput.dataset.updateQuantity, quantityInput.value);
  });
}

function init() {
  setActiveNavigation();
  renderCartCount();
  bindGlobalClicks();
  renderFeaturedProducts();
  renderCategoryBlocks();
  renderCatalogPage();
  renderProductDetail();
  renderCartPage();
  renderDownloadsPage();
  renderFinderPage();
  renderPromptStudio();
  renderResumePicker();
  renderAdminPage();
  renderSupportPage();
  enhanceMotion();
}

init();
