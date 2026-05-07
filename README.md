<div align="center">

# ⚡ CampusBet

**Frontend-first campus gaming platform — create lobbies, host tournaments, track virtual credits, and view a live leaderboard with Supabase data.**

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel&logoColor=white)](https://campus-bet.vercel.app)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

</div>

---

## What is CampusBet?

CampusBet is a campus-exclusive competitive gaming platform where students challenge each other to skill-based matches and stake **virtual campus credits** (no real money involved). A college email is required to sign up, keeping the community within your campus.

**Core features:**
- 🎮 **Lobbies** — create or join 1v1 / 2v2 / squad match rooms with a credit bid
- 🏆 **Tournaments** — browse, host, and join single-elimination events
- 📊 **Leaderboard** — live rankings sorted by wins across all players
- 💳 **Wallet** — real-time credit balance and full match transaction history
- 👤 **Profile** — editable display name, college, and lifetime stats

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8, Tailwind CSS 3 |
| State Management | Zustand (with localStorage persistence) |
| Database & Auth | Supabase (PostgreSQL + Row-Level Security) |
| Animations | Framer Motion |
| Forms | React Hook Form |
| Deployment | Vercel |

**Architecture:** Pure frontend SPA — no custom backend server. The app calls Supabase directly from the browser via the Supabase JS client. The frontend handles page state, form flows, and display logic, while Supabase stores auth and app data.

---

## Project Structure

```
CampusBet/
└── client/                    # React + Vite application
    ├── public/                # Static assets (favicon, etc.)
    └── src/
        ├── lib/
        │   └── supabase.js    # Supabase client (single shared instance)
        ├── store/
        │   ├── authStore.js   # Zustand: login, signup, session persistence
        │   ├── lobbyStore.js  # Zustand: lobby CRUD + join/leave actions
        │   └── tournamentStore.js  # Zustand: tournament CRUD + registration
        ├── hooks/
        │   ├── useAuth.js     # Thin wrapper around authStore
        │   ├── useMyMatches.js # Fetches current user's completed match history
        │   └── useLobbies.js  # Convenience hook for lobby store selectors
        ├── pages/             # One file per route
        ├── components/        # Shared UI components (Button, Modal, Navbar…)
        └── utils/
            ├── constants.js   # App-wide constants (game list, routes, etc.)
            └── formatters.js  # Credit formatting, time helpers, win-rate calc
```

---

## Database Schema (Supabase)

```
profiles            → one row per user (extends Supabase auth.users)
lobbies             → match rooms (game, bid_amount, status, winner_id)
lobby_players       → join table: users ↔ lobbies
tournaments         → tournament events (format, prize_pool, start/end date)
tournament_participants → join table: users ↔ tournaments
```

A Supabase database trigger automatically creates a `profiles` row whenever a new user signs up via `supabase.auth.signUp()`.

---

## Getting Started (Local Development)

**Prerequisites:** Node.js 18+, a free [Supabase](https://supabase.com) project.

```bash
# 1. Clone the repo
git clone https://github.com/sps-exe/CampusBet.git
cd CampusBet/client

# 2. Set up environment variables
cp .env.example .env.local
# Edit .env.local and fill in your Supabase URL and anon key

# 3. Install dependencies and run
npm install
npm run dev
# App runs at http://localhost:5173
```

### Environment variables

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Both values are found in your Supabase dashboard under **Project Settings → API**.

---

## Deployment

The project is deployed on [Vercel](https://vercel.com). The `client/vercel.json` configures the SPA rewrite so direct URL navigation works correctly.

To deploy your own instance:
1. Fork this repo
2. Import the `client/` folder into Vercel
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables in the Vercel dashboard
4. Deploy — Vercel auto-detects Vite

---

## Key Design Decisions

**Why Supabase directly (no Express backend)?**
Supabase provides auth and database storage out of the box. For a student project, this keeps the app easier to understand because the main logic stays inside the React frontend instead of being split across frontend and backend services.

**Why Zustand instead of Redux or Context?**
Zustand is minimal — no boilerplate, no providers. The `persist` middleware handles localStorage session persistence in two lines. It scales well for a project of this size.

**Why virtual credits (no real money)?**
Compliance. Real-money wagering between students would require gaming licenses. Campus credits are a virtual unit of score with no monetary value, making this a social skill-game platform.

---

## Notes

- This repo is intentionally frontend-first and classroom-friendly.
- Most app behavior lives in React pages, hooks, and Zustand stores.
- GitHub shows the language as JavaScript because React components here are written in `.js` / `.jsx` files.
