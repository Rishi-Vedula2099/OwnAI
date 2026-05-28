"""Chat & Conversation schemas."""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel


class ConversationCreate(BaseModel):
    agent_id: str
    title: Optional[str] = "New Conversation"


class ConversationResponse(BaseModel):
    id: str
    agent_id: str
    title: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class MessageResponse(BaseModel):
    id: str
    conversation_id: str
    role: str
    content: str
    tokens_used: int
    latency_ms: float
    created_at: datetime

    class Config:
        from_attributes = True


class ChatMessage(BaseModel):
    content: str
