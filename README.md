<div align="center">

# CampusArena

**Skill-based campus gaming — 1v1 lobbies, tournaments, live leaderboard, and a virtual credit economy.**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vitejs&logoColor=white)](https://vitejs.dev)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel&logoColor=white)](https://campusarena.vercel.app)

**🔗 Live Demo → [campusarena.vercel.app](https://campusarena.vercel.app)**

</div>

---

CampusArena is a college-exclusive competitive gaming platform. Students challenge each other to skill-based matches, stake **virtual campus credits** (no real money), and climb the leaderboard — all with a college email.

## Features

| | |
|---|---|
| 🎮 **Lobbies** | Create or join 1v1/squad match rooms with a credit bid |
| 🏆 **Tournaments** | Host and register for single-elimination brackets |
| 📊 **Leaderboard** | Live rankings sorted by wins, filterable by game |
| 💳 **Wallet** | Real-time credit balance + full match transaction history |
| 👤 **Profile** | Edit name, college, view lifetime stats |

## Stack

`React 19` · `Vite` · `Tailwind CSS` · `Zustand` · `Supabase (Auth + PostgreSQL)` · `Framer Motion` · `React Hook Form`

**Architecture:** Pure frontend SPA — no custom server. The browser talks directly to Supabase. All data access rules are enforced via Row-Level Security policies on the database.

## Quick Start

```bash
git clone https://github.com/sps-exe/CampusArena.git
cd CampusArena/client
npm install
```

Create `client/.env.local`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

```bash
npm run dev 
npm run build
```

## Database Tables

```
profiles              → user info and stats
lobbies               → match rooms
lobby_players         → users ↔ lobbies
tournaments           → tournament events
tournament_participants → users ↔ tournaments
```

A Supabase trigger auto-creates a `profiles` row on every new signup.

## Deploy

Import `client/` into Vercel, add the two env vars, done. The `vercel.json` already handles SPA routing.

---

**Contributors:** Shaurya Pratap Singh · Aujasya Rajput · Aryan Singh Damara
