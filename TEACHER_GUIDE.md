# CampusBet Teacher Guide

This file is a short explanation sheet for presenting the project.

## 1. What the project is

CampusBet is a frontend-first React application for campus gaming.

Users can:
- sign up with a college email
- create and join lobbies
- host and join tournaments
- submit match results
- view wallet history, profile stats, and leaderboard standings

The app uses **virtual campus credits**, not real money.

## 2. Main tech stack

- **React** for UI
- **Vite** for development/build
- **Tailwind CSS** for styling
- **Zustand** for state management
- **Supabase** for authentication and database

## 3. High-level architecture

The project does **not** use a separate Node/Express backend.

Instead:
- React handles UI and page logic
- Zustand stores manage app state and actions
- Supabase stores users, lobbies, tournaments, and match data

So the flow is:

1. User interacts with a React page
2. The page calls a Zustand store or hook
3. The store talks to Supabase
4. Supabase returns data
5. React re-renders with updated state

## 4. Important folders

- `client/src/pages`
  Route-level screens like Dashboard, Profile, CreateLobby, CreateTournament

- `client/src/components`
  Reusable UI parts like Navbar, Button, LobbyCard, TournamentCard

- `client/src/store`
  Main app logic for auth, lobbies, and tournaments

- `client/src/hooks`
  Reusable data logic like auth access and match history

- `client/src/lib/supabase.js`
  Shared Supabase client setup

- `client/src/utils`
  Helper functions and constants

## 5. Key frontend files

- `client/src/App.jsx`
  Main router and page setup

- `client/src/store/authStore.js`
  Login, signup, logout, load current user

- `client/src/store/lobbyStore.js`
  Fetch lobbies, create lobby, join lobby, submit results

- `client/src/store/tournamentStore.js`
  Fetch tournaments, create tournament, register for tournament

- `client/src/hooks/useMyMatches.js`
  Builds the user’s match history from completed lobbies

## 6. What happens in the main features

### Auth
- User signs up or logs in
- Supabase authenticates the user
- User profile is loaded from the `profiles` table
- Zustand stores the logged-in user in frontend state

### Lobbies
- A host creates a lobby using the form page
- The lobby is saved in Supabase
- Players join through the lobby list or detail page
- When the lobby fills up, it moves to `in-progress`
- After the match, a result is submitted
- Stats and credits are updated

### Tournaments
- A host creates a tournament with title, game, fees, dates, and rules
- The tournament is saved in Supabase
- Players register if it is still open
- The tournament detail page shows overview, bracket, and participants

### Leaderboard
- Completed lobbies are read from Supabase
- Wins and matches are counted on the frontend
- Players are ranked by total wins

### Wallet
- Match history is converted into credit transactions
- Wins show positive credit change
- Losses show negative credit change

## 7. Why the repo language says JavaScript

React is the framework, but the actual files are mostly `.js` and `.jsx`.

GitHub counts file languages, so it shows:
- JavaScript
- CSS
- HTML

That is normal for a React project.

## 8. What was improved in this version

- removed dead placeholder pages
- added a real Create Tournament page
- cleaned broken or misleading frontend behavior
- made leaderboard filters actually work from completed match data
- made lobby state transitions more consistent
- kept code simple enough to explain in class

## 9. One-line summary for presentation

CampusBet is a React + Supabase campus gaming app where users can create matches and tournaments, track virtual credits, and view rankings, all through a frontend-first architecture.
