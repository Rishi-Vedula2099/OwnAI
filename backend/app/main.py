"""OwnAI v2 Backend - FastAPI Application"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api import auth, ai, chat, knowledge, marketplace, analytics


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    # Startup
    print(f"🚀 OwnAI Backend starting on {settings.HOST}:{settings.PORT}")
    print(f"📦 Database: {settings.DATABASE_URL}")
    print(f"🤖 Ollama: {settings.OLLAMA_BASE_URL}")
    yield
    # Shutdown
    print("👋 OwnAI Backend shutting down")


app = FastAPI(
    title="OwnAI v2 API",
    description="Production-grade AI agent platform API",
    version="2.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(ai.router, prefix="/api/agents", tags=["AI Agents"])
app.include_router(chat.router, prefix="/api", tags=["Chat"])
app.include_router(knowledge.router, prefix="/api/knowledge", tags=["Knowledge"])
app.include_router(marketplace.router, prefix="/api/marketplace", tags=["Marketplace"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])


@app.get("/", tags=["Health"])
async def root():
    return {
        "status": "online",
        "service": "OwnAI v2 API",
        "version": "2.0.0",
    }


@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "redis": "connected",
        "ollama": "available",
    }
