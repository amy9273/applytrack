# Vercel Deployment & Visitor Privacy Guide

ApplyTrack is engineered to be **100% production-ready for deployment on Vercel** while ensuring that your personal privacy is completely protected when recruiters, professors, or visitors browse your live deployed site.

---

## 🛡️ Dual-Mode Privacy Architecture

ApplyTrack features an automated **Visitor Privacy Shield**:

| User Role | What They See | Permissions |
|---|---|---|
| **Public Visitors & Recruiters** *(Default)* | **Pure Dummy Showcase Database** (Alex Santos / Canva, Thinking Machines, Citco, Maya, StellarPH) | Read-only showcase. Zero access to your real Gmail tokens, personal emails, or database records. |
| **Owner (Angel Balion)** | **Live Inboxes & Real Gmail Sync** (Work, DLSL University OJT, Dev accounts) | Full read-only sync, live Gmail API retrieval, application status management. |

### How Visitor Mode Works:
- When any visitor opens your Vercel URL, the app **automatically serves the sanitized showcase database**.
- **No database connection is required for visitors** — the showcase dataset is served in-memory and statically optimized, ensuring your Vercel deployment will **never crash on cold start** or throw database errors to recruiters!
- If a visitor clicks buttons (Sync, Edit, Status changes), the UI responds smoothly in simulated mode without modifying any real data.

### How Owner Mode Works:
- Click the **"Visitor Demo • Unlock"** button in the top navigation or banner.
- Enter your **Master Owner PIN** (default: `applytrack2026`, configurable in `.env` via `OWNER_PIN`).
- You can also sign in directly with Google OAuth.
- Once authenticated, an HTTP-only secure cookie unlocks your live inboxes.
- When you are done, click **"Visitor View"** to immediately re-lock the site to the public dummy dataset.

---

## 🚀 Deploying to Vercel (Step-by-Step)

### Step 1: Push Code to GitHub
Your code is already connected to `https://github.com/amy9273/applytrack.git`.
```bash
git add .
git commit -m "feat: visitor privacy shield and dual-mode architecture"
git push origin main
```

### Step 2: Import into Vercel
1. Go to [vercel.com/new](https://vercel.com/new).
2. Connect your GitHub account and import `amy9273/applytrack`.
3. Vercel automatically detects **Next.js**.

### Step 3: Configure Environment Variables in Vercel
In the Vercel project deployment settings, add the following under **Environment Variables**:

| Variable | Recommended Value | Description |
|---|---|---|
| `OWNER_PIN` | `your_secret_pin_here` | Secret master PIN to unlock your real inboxes on the deployed site |
| `NEXT_PUBLIC_APP_URL` | `https://your-project.vercel.app` | Your Vercel production URL |
| `GOOGLE_CLIENT_ID` | `your-client-id.apps.googleusercontent.com` | (Optional) For live Google OAuth |
| `GOOGLE_CLIENT_SECRET` | `your-client-secret` | (Optional) For live Google OAuth |
| `GOOGLE_REDIRECT_URI` | `https://your-project.vercel.app/api/auth/google/callback` | Google OAuth callback |
| `GEMINI_API_KEY` | `your-gemini-key` | (Optional) For multimodal AI classification |

> [!TIP]
> **Zero Database Setup for Recruiters**: If you deploy without setting up an external database, visitors will immediately see the full dummy portfolio data without any configuration!
> If you want persistent cloud storage for your own live Gmail scans on Vercel, you can click **Integrations &rarr; Neon (Postgres)** in Vercel in 1 click.

### Step 4: Click Deploy!
Vercel will build and deploy ApplyTrack in under 60 seconds.
