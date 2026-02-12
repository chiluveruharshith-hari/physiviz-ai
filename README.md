# 🚀 PhysiViz AI

### Natural Language Powered Physics Simulation Engine

---

## 📌 Project Overview

**PhysiViz AI** is an intelligent physics visualization platform that transforms natural language descriptions into real-time, mathematically accurate simulations.

Users can simply type:

> “Throw a ball at 20 m/s at 45 degrees”
> “Drop a stone from 50 meters”
> “Slide a box down a 30° incline”

The system interprets the request using an LLM, converts it into structured parameters, computes motion using deterministic physics equations, and renders smooth animations in the browser.

---

## 🧠 Core Concept

We deliberately separate responsibilities:

| Layer                 | Responsibility                      |
| --------------------- | ----------------------------------- |
| **AI Layer (Gemini)** | Interprets natural language         |
| **Physics Engine**    | Performs deterministic calculations |
| **Rendering Engine**  | Visualizes motion frame-by-frame    |

> ✅ AI understands the problem
> ✅ Physics guarantees numerical accuracy
> ✅ Graphics bring it to life

This architecture ensures reliability, explainability, and precision.

---

## ✨ Key Features

* Natural language simulation input
* Real-time browser-based animation
* Deterministic classical mechanics engine
* Modular backend architecture
* AI + fallback parser for robustness
* Clean and scalable codebase

---

## 🧪 Supported Simulations

* Projectile Motion
* Free Fall
* Inclined Plane

(Currently modeled under standard Earth gravity.)

---

## 🏗️ System Architecture

```
User Input
   ↓
LLM (Parameter Extraction)
   ↓
Structured JSON
   ↓
Physics Dispatcher
   ↓
Equation Engine
   ↓
Time-Step Motion Data
   ↓
Canvas Rendering
```

> Design Principle: Probabilistic reasoning + Deterministic computation.

---

## 🛠️ Tech Stack

### Frontend

* React.js
* HTML5 Canvas API
* Tailwind CSS

### Backend

* FastAPI (Python)
* Custom Modular Physics Engine
* Dispatcher-Based Architecture

### AI Layer

* Google Gemini API
* Structured Prompt Engineering
* Regex Fallback Parsing

---

## 📂 Project Structure

```
physiviz-ai/
│
├── backend/
│   ├── engine/
│   │   ├── projectile.py
│   │   ├── freefall.py
│   │   └── incline.py
│   ├── services/
│   │   └── gemini_service.py
│   ├── dispatcher.py
│   └── main.py
│
├── frontend/
│   ├── components/
│   ├── Simulator.tsx
│   └── ...
│
└── README.md
```

---

## ▶️ How to Run the Project

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/physiviz-ai.git
cd physiviz-ai
```

---

### 2️⃣ Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file:

```
GEMINI_API_KEY=your_api_key_here
```

Run the backend:

```bash
uvicorn main:app --reload
```

Backend runs at:

```
http://127.0.0.1:8000
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open:

```
http://localhost:5173
```

---

## 📦 Dependencies

### Backend

* fastapi
* uvicorn
* python-dotenv
* google-generativeai
* pydantic

### Frontend

* react
* vite
* tailwindcss

---

## 🎥 Demo (MVP)

📹 Add demo video link here:

```
https://your-demo-video-link.com
```

---

## 🖼️ Demo Images



```markdown
![Projectile Simulation](demo-images/projectile.png)
![Free Fall Simulation](demo-images/freefall.png)
![Inclined Plane](demo-images/incline.png)
```

---

## ⚠️ Important Notes

* Start the backend before the frontend.
* Ensure the Gemini API key is valid.
* AI is used strictly for interpretation — all physics calculations are deterministic.
* Fallback parsing ensures demo reliability in case of AI failure.

---

## 🏆 Hackathon Pitch (30 Seconds)

> PhysiViz AI is a natural-language-driven physics engine that converts conversational input into mathematically accurate, real-time simulations by combining LLM-based understanding with deterministic classical mechanics.

---

## 🔮 Future Improvements

* Air resistance modeling
* Collision detection
* Multi-body dynamics
* 3D visualization upgrade
* Voice-based simulation input
* Educational problem-solving mode

---

## 📄 License

MIT License

---

## ⭐ Vision

To redefine how people interact with physics — not by memorizing equations, but by experiencing motion in real time.

---

If you find this project useful, consider giving it a ⭐.
