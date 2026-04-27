# 🎓 CampusBet
**Skill-Based Campus Gaming & Prediction Platform**

*Type:* WAP Capstone Project  
*Audience:* College Students  

---

## 01 · Problem Statement
College campuses are full of informal gaming competitions — console gaming, card tournaments, mobile game battles — but there is no structured way to make these events meaningful or rewarding. Students challenge each other with nothing on the line, tournaments die out because there's no stakes, and there's no central place to find opponents, track records, or put your confidence in your own skills to the test.

Additionally, students lack a campus-exclusive social layer around gaming — something scoped to their own institution, their own peers, their own community.

## 02 · Product Vision
**CampusBet** is a college-exclusive, skill-based competitive gaming platform where students can create game lobbies, challenge peers, place bids on match outcomes using campus credits, and climb a college-wide leaderboard.

**The core thesis:** if you're confident in your skill, you should be able to put something on it. This is not blind gambling — you are the player. You are the variable. The outcome is determined entirely by who plays better.

---

## 03 · Target Users

*   🎮 **The Competitive Player:** Wants their wins to mean something. Plays Smash, FIFA, Mario Kart daily but has no platform to prove dominance.
    *   *Pain:* No structured competition on campus.
*   👀 **The Spectator:** Loves watching friends compete. Wants to back someone they believe in with credits, even if they don't play.
    *   *Pain:* No way to engage beyond watching.
*   🏆 **The Tournament Host:** Gaming club leader or hostel rep who wants to organize college-level tournaments with real stakes.
    *   *Pain:* Manual org, WhatsApp chaos, no prize system.
*   🎲 **The Casual Bettor:** Not a serious player but enjoys predicting outcomes and engaging with the campus gaming scene socially.
    *   *Pain:* No college-specific platform to participate.

---

## 04 · Core Features

### P1 · Must Have
*   **College-Gated Authentication:** Only students with a valid institutional email can register. All activity is scoped within that institution.
*   **Player Profile & Stats Dashboard:** Shows game history, win/loss record per game, total credits earned, current rank, and reputation score.
*   **Game Lobby Creation & Discovery:** Create or join match lobbies for supported games, set bid amounts, and choose formats.
*   **Pre-Match Bidding System:** Both players (or supporters) place bids using campus credits held in escrow until the match concludes.
*   **Campus Credits Wallet:** Virtual wallet with campus credits (non-monetary). Earned by winning matches, completing challenges, or receiving from the platform.
*   **Match Result Submission & Dispute Flow:** Winner submits result with proof. Peer-review or admin resolves disputes if they occur.

### P2 · Should Have
*   **Live College Leaderboard:** Real-time ranked leaderboard showing top players, filterable by game type, time period, and department.
*   **Tournament Mode:** Bracket-style tournaments with entry fees and automated prize pool distribution.
*   **Spectator Bidding (Side Betting):** Non-players can place bids on live or upcoming matches.
*   **Notifications & Match Alerts:** Alerts for challenges, lobby statuses, tournaments, and bid resolutions.

### P3 · Nice to Have
*   **Match Chat & Trash Talk Room:** Scoped chat room for players and spectators per match lobby.
*   **Achievement Badges & Titles:** Profile badges for milestones (e.g., "Campus Champion", "Undefeated").
*   **Admin / Moderator Panel:** Backend dashboard for campus admins to monitor disputes, manage credits, and oversee tournaments.

---

## 05 · Core User Journey
1.  **Sign Up with College Email:** Register using institutional email for domain verification and college assignment.
2.  **Receive Starter Credits:** Get fixed starter campus credits to join initial matches.
3.  **Browse or Create a Lobby:** Find an open match or create a new one with a specific game and bid amount.
4.  **Lock Bids & Play the Match:** Bids are confirmed and held in escrow. Match is played offline/online. Spectators can place side bids.
5.  **Submit Result & Collect Credits:** Winner submits proof. Credits are distributed automatically upon opponent confirmation.

---

## 06 · Scope Definition

| Area | In Scope | Out of Scope |
| :--- | :--- | :--- |
| **Currency** | Virtual campus credits only | Real money, UPI, payments of any kind |
| **College Access** | Single-college scoped MVP | Cross-college matchmaking (Phase 2) |
| **Games** | Manually listed games with self-reported results | API-based score auto-detection (Phase 2) |
| **Platform** | Web app (desktop + mobile browser) | Native iOS / Android app |
| **Moderation** | Dispute flagging + basic admin panel | AI-based fraud detection |

---

## 07 · Supported Games (MVP)
*   Super Smash Bros
*   Mario Kart
*   FIFA / EA FC
*   Chess
*   Valorant
*   BGMI / PUBG Mobile
*   Carrom
*   Table Tennis
*   *Custom (host defines)*

---

## 08 · Success Metrics
*   **DAU:** Daily active users
*   **Matches / day:** Lobbies created & completed
*   **Dispute rate:** % matches disputed (target <5%)
*   **Retention:** Week-2 return rate
*   **Spectator ratio:** Non-players placing bids

---

## 09 · Constraints & Assumptions
*   **No real money:** Campus credits are a fictional, in-platform currency with no monetary value to keep the platform legal and appropriate.
*   **Self-reported results:** MVP relies on players submitting match results themselves in good faith, backed by a dispute resolution mechanism.
*   **College-gated only:** Every target user must have an institutional email. General public access is restricted.
*   **Offline matches:** Most games are played in-person or through existing platforms. CampusBet serves as the meta-layer around the match, not hosting the game itself.
*   **Trust & community standards:** The platform relies on identifiable peers within a closed community to disincentivize cheating.
