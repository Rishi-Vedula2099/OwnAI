# OwnAI v2 — Build Your Own AI Agents

> A production-grade full-stack platform for creating, managing, and interacting with custom AI agents.

![OwnAI](https://img.shields.io/badge/OwnAI-v2.0-6366f1?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge)

## ✨ Features

- **🤖 AI Workshop** — Create, configure, and manage custom AI agents with JSON-based config
- **💬 Real-time Chat** — WebSocket streaming chat with multi-session history
- **📚 Knowledge Base (RAG)** — Upload PDFs/text, chunk, embed with FAISS, and query via retrieval
- **🏪 AI Marketplace** — Share, browse, and clone AI agents from the community
- **📊 Observability** — Monitor token usage, latency, error rates, and model performance
- **🔐 Authentication** — JWT + bcrypt secure auth with protected routes

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router), Tailwind v4, Zustand, Framer Motion |
| Backend | FastAPI, SQLAlchemy (async), WebSockets |
| Database | PostgreSQL |
| Vector DB | FAISS (local) |
| AI | Ollama (local) + OpenAI/Groq fallback |
| Queue | Celery + Redis |
| DevOps | Docker, Nginx, GitHub Actions |

## 📂 Project Structure

```
own-ai/
├── frontend/           # Next.js 16 App
│   ├── app/            # App Router pages
│   │   ├── dashboard/  # Overview & stats
│   │   ├── ai-workshop/# Agent CRUD
│   │   ├── chat/       # Real-time chat
│   │   ├── knowledge/  # RAG document management
│   │   ├── marketplace/# Community agents
│   │   └── observability/ # Monitoring
│   ├── components/
│   │   ├── ui/         # Button, Card, Input, Badge
│   │   └── layout/     # Sidebar, Header, AppShell
│   ├── store/          # Zustand stores
│   └── lib/            # API client, WebSocket, utils
│
├── backend/            # FastAPI Backend
│   └── app/
│       ├── api/        # Route handlers
│       ├── core/       # Config, security, database
│       ├── models/     # SQLAlchemy ORM models
│       ├── schemas/    # Pydantic validation
│       ├── services/   # LLM, RAG, Vector store
│       └── workers/    # Celery background tasks
│
├── ai-engine/          # AI Components
│   ├── aifiles/        # Agent config files
│   ├── prompts/        # System prompt templates
│   ├── agents/         # Agent base classes
│   └── pipelines/      # RAG pipeline
│
├── infra/              # Infrastructure
│   ├── docker/         # Dockerfiles + Compose
│   └── nginx/          # Reverse proxy config
│
└── .env.example        # Environment template
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Python 3.12+
- PostgreSQL 16+
- Redis 7+
- Ollama (optional, for local LLMs)

### Frontend

```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
cp ../.env.example .env  # Edit with your settings
uvicorn app.main:app --reload
# → http://localhost:8000
# → http://localhost:8000/docs (Swagger)
```

### Docker (All Services)

```bash
cd infra/docker
docker compose up -d
# → Frontend: http://localhost:3000
# → Backend:  http://localhost:8000
# → Docs:     http://localhost:8000/docs
```

## 📡 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login → JWT token |
| `GET` | `/api/auth/me` | Current user info |
| `GET` | `/api/agents` | List user's agents |
| `POST` | `/api/agents` | Create agent |
| `PUT` | `/api/agents/{id}` | Update agent |
| `DELETE` | `/api/agents/{id}` | Delete agent |
| `WS` | `/ws/chat/{id}` | WebSocket streaming |
| `POST` | `/api/knowledge/upload` | Upload document |
| `POST` | `/api/knowledge/query` | RAG query |
| `GET` | `/api/marketplace` | Browse agents |
| `GET` | `/api/analytics/usage` | Token usage stats |

## 📄 License

MIT
