"""Analytics API routes for observability."""

from fastapi import APIRouter, Depends

from app.core.security import get_current_user

router = APIRouter()


@router.get("/usage")
async def get_usage_stats(current_user: dict = Depends(get_current_user)):
    """Get token usage statistics."""
    # In production, this queries actual message data
    return {
        "total_tokens_24h": 284391,
        "total_tokens_7d": 1842000,
        "total_tokens_30d": 6520000,
        "hourly_breakdown": [
            {"hour": f"{h:02d}:00", "tokens": v * 1000}
            for h, v in enumerate(
                [12, 18, 8, 5, 3, 2, 4, 15, 28, 42, 38, 45, 52, 48, 35, 42, 55, 62, 48, 38, 25, 18, 14, 10]
            )
        ],
        "by_model": {
            "llama3:8b": 142800,
            "gpt-4o": 98400,
            "codellama:13b": 34200,
            "mistral:7b": 8991,
        },
    }


@router.get("/latency")
async def get_latency_metrics(current_user: dict = Depends(get_current_user)):
    """Get latency metrics by model."""
    return {
        "average_latency_ms": 1800,
        "p95_latency_ms": 3200,
        "p99_latency_ms": 5100,
        "by_model": [
            {"model": "llama3:8b", "avg_ms": 1200, "p95_ms": 2100, "requests": 328},
            {"model": "gpt-4o", "avg_ms": 2800, "p95_ms": 4500, "requests": 124},
            {"model": "codellama:13b", "avg_ms": 1500, "p95_ms": 2800, "requests": 67},
            {"model": "mistral:7b", "avg_ms": 900, "p95_ms": 1600, "requests": 31},
        ],
    }


@router.get("/errors")
async def get_error_logs(current_user: dict = Depends(get_current_user)):
    """Get recent error logs."""
    return {
        "total_errors_24h": 3,
        "error_rate": 0.013,
        "errors": [
            {
                "timestamp": "2025-04-16T14:32:05Z",
                "agent": "Data Analyst",
                "model": "gpt-4o",
                "error": "Rate limit exceeded (429)",
                "severity": "warning",
            },
            {
                "timestamp": "2025-04-16T11:15:22Z",
                "agent": "Code Reviewer",
                "model": "llama3:8b",
                "error": "Context length exceeded (4096 tokens)",
                "severity": "error",
            },
            {
                "timestamp": "2025-04-16T09:48:11Z",
                "agent": "DevOps Engineer",
                "model": "mistral:7b",
                "error": "Connection timeout to Ollama",
                "severity": "error",
            },
        ],
    }
