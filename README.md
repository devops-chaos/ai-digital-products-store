# PromptlyPro

AI-powered digital products marketplace for resume kits, prompt packs, business systems, Notion dashboards, Canva launch packs, mini courses, and automation bundles.

## What is included

- Responsive storefront with product search, category tabs, audience filters, budget filters, and sorting.
- Cart, demo checkout, and local download vault.
- AI product recommendation flow with local fallback logic.
- Prompt generator for sales, resumes, content, operations, mini courses, and support.
- Resume template matcher.
- Admin-style product creator with local storage and JSON export.
- OpenAI and Stripe serverless API placeholders.
- Blank `.env.example` for production keys.

## Run locally

Open `index.html` directly in a browser, or run a simple static server:

```bash
npm start
```

Then visit:

```text
http://localhost:4173
```

## API keys

Copy `.env.example` to `.env` and fill values when you are ready:

```env
OPENAI_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
APP_BASE_URL=
EMAIL_API_KEY=
DATABASE_URL=
```

The storefront works without keys in demo mode. OpenAI and Stripe production calls are prepared in the `api/` folder.

## Deploy

For a static storefront, GitHub Pages can serve the root files.

For live OpenAI and Stripe endpoints, deploy to a serverless host such as Vercel, add the environment variables, and install dependencies during deployment.

## Production checklist

- Add real Stripe product or price IDs.
- Replace demo checkout unlocks with verified webhook-based fulfillment.
- Store purchases in a database instead of browser local storage.
- Add user accounts before delivering real customer downloads.
- Add real downloadable template files.
- Add OpenAI usage limits, moderation, and logging.
- Add privacy policy, refund policy, and terms pages.
