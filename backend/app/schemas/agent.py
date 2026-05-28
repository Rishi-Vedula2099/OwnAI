"""Agent schemas for request/response validation."""

from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel


class AgentCreate(BaseModel):
    name: str
    model: str = "llama3:8b"
    system_prompt: str = ""
    temperature: float = 0.7
    max_tokens: int = 2048
    tools: List[str] = []
    config: Dict[str, Any] = {}


class AgentUpdate(BaseModel):
    name: Optional[str] = None
    model: Optional[str] = None
    system_prompt: Optional[str] = None
    temperature: Optional[float] = None
    max_tokens: Optional[int] = None
    tools: Optional[List[str]] = None
    config: Optional[Dict[str, Any]] = None
    is_public: Optional[bool] = None


class AgentResponse(BaseModel):
    id: str
    name: str
    model: str
    system_prompt: str
    temperature: float
    max_tokens: int
    tools: List[str]
    config: Dict[str, Any]
    is_public: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
