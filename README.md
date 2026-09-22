# Sight Seers WhatsApp Agent

An AI concierge for **Sight Seers Caribbean Adventures** that answers guest
questions on WhatsApp, recommends tours, captures trip leads, and flags
anything that needs Daine personally — built on the Meta WhatsApp Cloud API
and Claude.

What it does:
- Answers questions about tours, transfers, yacht charters, villas, group
  travel, the MBA Experience, Leaders in Jamaica, passport renewal, pricing,
  booking process and the refund/cancellation policy — grounded in
  `src/knowledge.js`, not invented.
- Recommends specific experiences based on what the guest describes.
- Captures leads (name, destination, dates, party size, budget) as the
  conversation develops and WhatsApp-messages you (the owner) a summary.
- Recognizes when a human is needed — complaints, disputes, custom
  itineraries, or a guest asking for a real person — and pings you instead
  of trying to handle it.

---

## 1. One-time Meta setup (WhatsApp Cloud API)

You said you already have Meta Cloud API credentials — here's where to find
each value this project needs, in case anything needs re-checking:

1. Go to [developers.facebook.com](https://developers.facebook.com/) →
   **My Apps** → your app → **WhatsApp** → **API Setup**.
2. Copy the **Phone number ID** → this is `WHATSAPP_PHONE_NUMBER_ID`.
3. Copy the **Temporary access token** (or generate a permanent one under
   **System Users** for production use) → this is `WHATSAPP_ACCESS_TOKEN`.
   - Temporary tokens expire in 24 hours — fine for testing, not for
     production. For a permanent token: **Business Settings → System Users
     → Add** a system user, assign it your WhatsApp app with `whatsapp_business_messaging`
     permission, then generate a token with no expiry.
4. Pick any secret string yourself for `WHATSAPP_VERIFY_TOKEN` — you'll
   enter this exact value into the Meta webhook screen in step 4 below. It's
   just a shared secret proving the verification request is really from
   Meta.

You won't set the **webhook URL** in Meta until the server is deployed and
you have a public URL — that's step 4.

---

## 2. Get an Anthropic API key

1. Go to [console.anthropic.com](https://console.anthropic.com/) → **API
   Keys** → **Create Key**.
2. Copy it → this is `ANTHROPIC_API_KEY`. Anthropic API usage is billed
   separately from any Claude.ai subscription; a new console account
   typically starts with a small free credit grant.

---

## 3. Deploy for free on Render

[Render](https://render.com) has a free web service tier that's enough to
run this bot (it sleeps after 15 minutes of inactivity and wakes on the next
request — fine for WhatsApp traffic, since the first message after a sleep
just takes a few extra seconds).

1. Push this folder to a **GitHub repo** (Render deploys from a repo — see
   the git commands below if you're starting from this zip).
   ```bash
   cd sightseers-whatsapp-agent
   git init
   git add .
   git commit -m "Initial commit: Sight Seers WhatsApp agent"
   # create a new empty repo on GitHub first, then:
   git remote add origin https://github.com/<you>/sightseers-whatsapp-agent.git
   git push -u origin main
   ```
2. In Render: **New +** → **Web Service** → connect the repo.
3. Settings:
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free
4. Under **Environment**, add these variables (values from steps 1–2):
   - `ANTHROPIC_API_KEY`
   - `WHATSAPP_PHONE_NUMBER_ID`
   - `WHATSAPP_ACCESS_TOKEN`
   - `WHATSAPP_VERIFY_TOKEN`
   - `OWNER_WHATSAPP_NUMBER` — your own WhatsApp number, digits only with
     country code, e.g. `18764650630` (no `+`, no spaces). This is where
     lead and handoff notifications get sent.
5. Click **Create Web Service** and wait for the first deploy to finish.
   Render gives you a public URL like `https://sightseers-whatsapp-agent.onrender.com`.

### Point Meta's webhook at your deployed URL

1. Back in **developers.facebook.com** → your app → **WhatsApp** →
   **Configuration**.
2. Under **Webhook**, click **Edit**:
   - **Callback URL**: `https://<your-render-url>/webhook`
   - **Verify Token**: the exact same string you set as
     `WHATSAPP_VERIFY_TOKEN`.
3. Click **Verify and Save** — Render will log
   `[webhook] Verified successfully.` if it worked.
4. Under **Webhook fields**, subscribe to **messages**.

At this point, messaging your WhatsApp Business number should trigger a
reply from the bot within a few seconds.

> **Free tier note:** Render's free web services spin down after 15 minutes
> idle. The first message after a quiet spell may take 30–50 seconds to get
> a reply while the service wakes up. If that's a problem once you're live,
> Render's cheapest paid tier ($7/mo) removes the sleep — or a free uptime
> pinger (e.g. UptimeRobot hitting `/` every 10 minutes) keeps it warm.

---

## 4. Test locally (optional, before deploying)

```bash
cd sightseers-whatsapp-agent
npm install
cp .env.example .env
# fill in .env with your real values
npm start
```

The server listens on `http://localhost:3000`. To receive real WhatsApp
webhooks locally you'd need a tunnel (e.g. `ngrok http 3000`) and to point
Meta's webhook at the ngrok URL temporarily — usually not worth it once
Render is set up, since redeploys are just a `git push`.

Useful local checks:
- `GET /` → health check, should say the agent is running.
- `GET /leads` → JSON list of leads captured so far (in-memory only —
  resets on restart/redeploy, see note below).

---

## 5. Keeping it accurate over time

- **Update prices, tours, or policy**: edit `src/knowledge.js`. It's plain
  structured data — no need to touch the prompt or server logic. Redeploy
  (push to GitHub; Render auto-deploys) for changes to take effect.
- **Adjust the bot's tone or behavior**: edit `src/systemPrompt.js`.
- **Leads and conversation history are in-memory only** — they reset on
  every restart/redeploy, and won't be shared across multiple server
  instances. This is fine for getting started and for low volume. Once
  you're relying on this for real lead flow, the natural upgrade is to swap
  `src/store.js` for a small database (e.g. a free tier of Postgres on
  Render or Supabase) — everything that touches storage lives in that one
  file, so it's a contained change. I'm happy to build that out when you're
  ready.

---

## Project structure

```
server.js              Express app: webhook verification + incoming message handling
src/agent.js            Core conversation loop — calls Claude, runs lead-capture/handoff tools
src/systemPrompt.js      Builds the system prompt from the knowledge base
src/knowledge.js         Structured facts: tours, pricing, policies, contact info, FAQ
src/whatsapp.js          Sends messages via the Meta Graph API, notifies the owner
src/store.js             In-memory conversation history + captured leads
.env.example             All required environment variables, documented
```
