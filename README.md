<div align="center">
  <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2940&auto=format&fit=crop" alt="CampusBet Banner" width="100%" height="300" style="object-fit: cover; border-radius: 12px; margin-bottom: 20px" />
  
  <h1>🎓 CampusBet</h1>
  <p><b>The Ultimate Skill-Based Campus Gaming & Esports Economy</b></p>

  [![Deploy Status](https://img.shields.io/badge/Deployed_on-Vercel-black?style=for-the-badge&logo=vercel)](https://campusbet.vercel.app)
  [![Tech Stack](https://img.shields.io/badge/Stack-React_|_Supabase-blue?style=for-the-badge&logo=react)](https://campusbet.vercel.app)
  
  <h3><a href="https://campusbet.vercel.app">🎮 Play The Live Demo Here 🎮</a></h3>
</div>

---

## ⚡ The Pitch
College campuses are full of informal gaming competitions—Smash Bros in the dorms, FIFA in the lounge, Valorant online. But there's a problem: **there are no stakes.** Tournaments fizzle out, bragging rights mean nothing, and there's no central place to prove you're the best on campus. 

**CampusBet** changes that. 

It's a college-exclusive, skill-based competitive platform where students can create game lobbies, challenge peers, and put their **Campus Credits** on the line. This is not blind gambling—you are the player, and the outcome is determined entirely by who plays better.

---

## 🚀 Key Features

- 🏫 **College-Gated Ecosystem:** Safe, isolated leaderboards and lobbies restricted to your specific university.
- 💰 **Campus Credit Economy:** A high-stakes virtual economy. Win matches to steal your opponents' credits and climb the ranks. (Zero real-money gambling).
- 🎮 **Instant Matchmaking Lobbies:** Create a lobby for *Smash Bros*, *FIFA*, *Valorant*, or *Chess*. Set the buy-in, and wait for a challenger.
- 🏆 **Dynamic Tournaments:** Join massive bracket-style tournaments with huge prize pools.
- 📊 **Real-time Leaderboards:** Prove you're the best. Track your win/loss ratio and total earnings against the entire campus.

---

## 🛠️ The Tech Stack
CampusBet is built to scale, utilizing modern, highly-responsive web technologies:

* **Frontend:** React.js, Vite, Tailwind CSS, Zustand (State Management)
* **Backend:** Supabase (PostgreSQL, Row Level Security, Triggers)
* **Authentication:** Supabase Auth (Email/Password)
* **Deployment:** Vercel (Frontend), Supabase Cloud (Database)
* **Icons & UI:** Lucide React, Framer Motion (Animations)

---

## 💻 Local Development Setup

Want to run CampusBet on your own machine? It's simple.

### 1. Clone & Install
```bash
git clone https://github.com/your-username/CampusBet.git
cd CampusBet/client
npm install
```

### 2. Configure Supabase
Create a `.env.local` file in the `client` directory and add your Supabase keys:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run the Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🗺️ Product Roadmap (Phase 2)
What's next for CampusBet?
- **[ ] Real-time Lobby Chat:** Trash talk your opponents before the match starts using Supabase Realtime WebSockets.
- **[ ] Spectator Betting:** Let bystanders wager their own Campus Credits on who they think will win the match.
- **[ ] API Integrations:** Auto-fetch match results directly from Riot Games (Valorant) and Chess.com APIs to prevent manual score disputes.

---

<div align="center">
  <i>Built with ❤️ for the Hackathon. Put your credits where your controller is.</i>
</div>
