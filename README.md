# Human Or Bot Test 🤖👤

A real-time, cross-platform Turing Test application designed to challenge human perception. Players are matched in 1v1 chat sessions where they must interrogate their opponent to determine if they are interacting with a human or an AI.

## 🚀 Technical Stack

- **Frontend:** Angular 19+, Ionic/Capacitor (for Android/Mobile)
- **Middleware:** Node.js, Socket.io (Real-time communication)
- **Backend:** Python (FastAPI/Flask) for core game logic and AI integration
- **Infrastructure:** Render (Hosting), Vercel (Frontend Deployment)

## ✨ Key Features

- **Matchmaking Radar:** A custom-built UI that scans for global opponents in real-time.
- **State Management:** Uses Angular's `NgZone` and specialized services to handle asynchronous socket events without UI lag.
- **Mobile-Native Experience:** Built with Capacitor for a high-performance Android experience, including hardware safe-area support.
- **Live Heartbeat:** Implemented external health-check monitoring to maintain 24/7 uptime on Render's free tier.

## 🛠️ Installation & Setup

### Prerequisites
- Node.js v20+
- Python 3.12+
- Android Studio (for mobile builds)

### Frontend Setup
1. Clone the repo.
2. Run `npm install`.
3. Build the project: `npm run build`.
4. Sync with Android: `npx cap sync android`.

### Backend Setup
1. Navigate to the `/backend` directory.
2. Install dependencies: `pip install -r requirements.txt`.
3. Start the server: `uvicorn main:app --reload`.

## 🌐 Deployment Logic

The application uses a distributed architecture:
- **Client:** Hosted on Vercel for fast global delivery.
- **WebSocket Middleware:** Hosted on Render (Node.js) to manage active game states.
- **AI Core:** Python-based service on Render, kept awake via automated health-pings to prevent cold starts.

---
Created with ❤️ by Saumya
