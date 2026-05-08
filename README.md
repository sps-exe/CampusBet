<div align="center">

# CampusArena

**A frontend-first campus gaming platform for lobbies, tournaments, virtual credits, and leaderboard tracking.**

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel&logoColor=white)](https://campusarena.vercel.app)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vitejs&logoColor=white)](https://vitejs.dev)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

</div>

## Overview

CampusArena is a college-focused competitive gaming platform where students can:

- create and join game lobbies
- host and register for tournaments
- track virtual campus credits
- view leaderboard standings based on match results
- manage their profile and match activity

The project is intentionally **frontend-first** and built to be easy to understand, explain, and demo.

## Core Features

### 1. Lobbies
- Create match rooms for games like Valorant, Chess, FIFA, BGMI, and more
- Support for 1v1, 2v2, and squad-style setups
- Join open lobbies and move them into active play when full
- Submit results to update stats and credits

### 2. Tournaments
- Browse available tournaments
- Host new tournaments through a dedicated React form flow
- Register participants for upcoming tournaments
- View tournament overview, bracket placeholder, and participant list

### 3. Wallet
- Track virtual credit balance
- View credit gains and losses from completed matches
- Keep match-based transaction history in one place

### 4. Leaderboard
- Rank players using completed match data
- Filter standings by time period and game
- Show podium and full ranking table

### 5. Profile
- Edit display name and college
- View account information and match history
- Track wins, matches played, and win rate

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8 |
| Styling | Tailwind CSS 3 |
| State Management | Zustand |
| Forms | React Hook Form |
| Database & Auth | Supabase |
| Animations | Framer Motion |
| Deployment | Vercel |

## Architecture

CampusArena uses a **pure frontend SPA architecture**.

- React handles routing and UI rendering
- Zustand stores manage state and app actions
- Supabase provides authentication and persistent data storage
- The browser communicates directly with Supabase

This keeps the codebase simple for learning, presentations, and fast iteration.

## Project Structure

```bash
CampusArena/
├── README.md
├── TEACHER_GUIDE.md
└── client/
    ├── public/
    └── src/
        ├── components/
        ├── hooks/
        ├── lib/
        ├── pages/
        ├── store/
        └── utils/
```

## Important Frontend Modules

- `client/src/App.jsx`
  Main route setup and lazy-loaded page wiring

- `client/src/store/authStore.js`
  Authentication flow, user loading, and session persistence

- `client/src/store/lobbyStore.js`
  Lobby fetching, creation, join flow, and result submission

- `client/src/store/tournamentStore.js`
  Tournament fetching, creation, and registration

- `client/src/hooks/useMyMatches.js`
  Builds user match history from completed lobbies

- `client/src/pages/CreateLobby.jsx`
  Multi-step lobby creation flow

- `client/src/pages/CreateTournament.jsx`
  Tournament host flow

## Database Model

The frontend expects these main Supabase tables:

```text
profiles
lobbies
lobby_players
tournaments
tournament_participants
```

Typical usage:

- `profiles` stores user information and stats
- `lobbies` stores match rooms
- `lobby_players` links users to lobbies
- `tournaments` stores tournament metadata
- `tournament_participants` links users to tournaments

## Local Development

### Prerequisites

- Node.js 18+
- npm
- A Supabase project

### Setup

```bash
git clone https://github.com/sps-exe/CampusArena.git
cd CampusArena/client
npm install
```

Create a `.env.local` file in `client/`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Lint the frontend:

```bash
npm run lint
```

## Deployment

The project is configured for deployment on Vercel.

Live production URL:

- [https://campusarena.vercel.app](https://campusarena.vercel.app)

To deploy:

1. Import the `client/` app into Vercel
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
3. Deploy normally as a Vite project

## Notes

- CampusArena uses **virtual credits only**
- No real money is involved
- GitHub shows the main language as **JavaScript** because React components are written in `.js` and `.jsx` files

## Contributors

- **Shaurya Pratap Singh** — primary frontend development, architecture, and project integration
- **Aujasya Rajput** — project contribution and collaboration
- **Aryan Singh Damara** — code contributions present in repository history
