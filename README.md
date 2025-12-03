The backend powering the Oussama AI Agent, providing real-time conversation, WebSocket streaming, session management, and voice synthesis (Arabic & English).

Built with Node.js, Express, OpenAI Realtime API, and WebSockets.

# ⭐ Features

🔥 OpenAI Realtime API integration (text + voice)

🔄 Realtime WebSocket streaming

🔑 Secure session generation for frontend

🧠 Custom personality system (Oussama persona)

🗣️ Male AI voice output (Arabic + English)

🛡️ CORS protected for production

🧩 Simple and clean endpoints

🏎️ Lightweight & fast (no heavy dependencies)   
  Installation
1️⃣ Clone the repo
git clone https://github.com/oussamatght/oussama-ai-agent-backend.git
cd oussama-ai-agent-backend

2️⃣ Install dependencies
npm install

3️⃣ Start development mode
npm run dev

4️⃣ Start production mode
npm start

🔌 API Endpoints
🔹 POST /session

Creates a realtime OpenAI session token for the frontend.

Request
{
  "userId": "optional"
}

Response
{
  "token": "ws-session-token",
  "client_secret": "stream-secret"
}

🔹 GET /

Health check

{ "status": "Backend running" }
Contributing

Pull requests welcome
Issues welcome
Feel free to fork and build your own version

🧑‍💻 Author

Oussama T.
Full-stack developer — Algeria

Instagram: @oussama_soul_

GitHub: oussamatght

Gmail: oussamatght6@gmail.com
