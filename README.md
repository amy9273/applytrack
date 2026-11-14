# ApplyTrack 🎯
> **AI-Powered Internship Application Organizer**  
> Automatically collect, identify, classify, and organize recruitment communications across multiple Gmail accounts.

---

## 💡 The Problem
Applying for software engineering internships and OJT placements often involves:
- Managing **3 or more separate Gmail inboxes** (e.g. personal, university, professional work).
- Sifting through hundreds of general emails to find critical interview invitations, HackerRank/Codility assessment deadlines, and HR endorsement/MOA paperwork.
- Losing track of which company sent which update to which inbox.
- Manually maintaining a spreadsheet tracker, which quickly falls out of sync.

**ApplyTrack solves this by bringing your recruitment inboxes into a single AI-assisted hub without manual encoding.**

---

## ⚡ Core Features (MVP)

1. **Multi-Gmail Inbox Connectivity**:
   - Google OAuth 2.0 with minimal **read-only** permissions (`gmail.readonly`).
   - Supports 3+ concurrent Gmail accounts.
   - Targeted queries retrieve only recruitment emails, preserving personal email privacy.

2. **Automated 12-Category Classification**:
   - *Application Confirmation*, *Application Update*
   - *Interview Invitation*, *Interview Confirmation*, *Final Interview*
   - *Assessment Invitation*, *Assessment Instructions*, *Assessment Confirmation*
   - *Acceptance / Offer*, *Rejection*
   - *OJT / MOA Requirements*
   - *Other Recruitment Communication*

3. **Structured Entity Extraction**:
   - Company name & position role detection.
   - Schedules, timezones (`Asia/Manila` default), and video meeting rooms (Google Meet, Zoom, Teams).
   - Technical assessment platforms and deadlines (HackerRank, Codility).
   - Recruiter / HR contact person and recommended next steps.
   - Inline manual correction support.

4. **Centralized Recruitment Hub**:
   - Unified dashboard with multi-account inbox filter pills.
   - Category and company filters with instant search.
   - Split-view drawer inspecting AI-extracted entities alongside the raw email text.

5. **Automatic Application Pipeline**:
   - Emails automatically cluster into application records by Company + Position.
   - Activity schedule tracking (interviews, deadlines).
   - Eliminates redundant manual data entry.

6. **Instant 3-Inbox Demo Mode**:
   - Includes a one-click simulation with 3 student accounts and 10 realistic Philippine recruitment email threads (Citco, StellarPH, GlobalTransco, Maya, Canva).

---

## 🛠️ Tech Stack
- **Framework**: Next.js 15 (App Router, Route Handlers) + React 19 + TypeScript
- **Styling**: Tailwind CSS + Lucide React
- **Database**: Prisma ORM with SQLite (zero-setup local, ready for Supabase / PostgreSQL)
- **APIs**: Google OAuth 2.0 & Gmail API (`googleapis`), Gemini AI / Deterministic NLP Fallback

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(Optional: add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` if using live Google OAuth, or `GEMINI_API_KEY` for live AI generation. If not provided, ApplyTrack runs smoothly with built-in instant demo inboxes and rule-based extraction!)*

### 3. Initialize Database
```bash
npx prisma db push
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing the 2-Minute Demo Flow

1. Open `http://localhost:3000`.
2. Click **"Load 3 Demo Student Inboxes"** in the top navigation or hero banner.
3. Observe the metrics update: 3 Inboxes, 10 Recruitment Emails, 6 Applications Tracked, and Upcoming Events.
4. Filter by inbox (e.g. `angel.balion.work@gmail.com` vs `angel.balion.up@gmail.com`).
5. Click any email card (such as **Citco Interview Invitation** or **Maya Assessment**) to inspect the extracted video meeting link, scheduled time, and original email body.
6. Switch to the **My Applications** tab to view the automatically clustered pipelines.
