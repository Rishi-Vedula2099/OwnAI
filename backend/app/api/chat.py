"""Chat API routes with WebSocket streaming."""

import json
import time
import uuid
from typing import List

from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import get_current_user, decode_access_token
from app.models.conversation import Conversation
from app.models.message import Message
from app.models.agent import Agent
from app.schemas.chat import ConversationCreate, ConversationResponse, MessageResponse

router = APIRouter()


# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, WebSocket] = {}

    async def connect(self, conversation_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[conversation_id] = websocket

    def disconnect(self, conversation_id: str):
        self.active_connections.pop(conversation_id, None)

    async def send_json(self, conversation_id: str, data: dict):
        ws = self.active_connections.get(conversation_id)
        if ws:
            await ws.send_json(data)


manager = ConnectionManager()


@router.get("/conversations", response_model=List[ConversationResponse])
async def list_conversations(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List all conversations for the current user."""
    result = await db.execute(
        select(Conversation)
        .where(Conversation.user_id == current_user["id"])
        .order_by(Conversation.updated_at.desc())
    )
    conversations = result.scalars().all()
    return [
        ConversationResponse(
            id=str(c.id),
            agent_id=str(c.agent_id),
            title=c.title,
            created_at=c.created_at,
            updated_at=c.updated_at,
        )
        for c in conversations
    ]


@router.post("/conversations", response_model=ConversationResponse, status_code=201)
async def create_conversation(
    data: ConversationCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new conversation."""
    # Verify agent exists
    result = await db.execute(select(Agent).where(Agent.id == data.agent_id))
    agent = result.scalar_one_or_none()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    conversation = Conversation(
        user_id=current_user["id"],
        agent_id=data.agent_id,
        title=data.title or f"Chat with {agent.name}",
    )
    db.add(conversation)
    await db.flush()

    return ConversationResponse(
        id=str(conversation.id),
        agent_id=str(conversation.agent_id),
        title=conversation.title,
        created_at=conversation.created_at,
        updated_at=conversation.updated_at,
    )


@router.get(
    "/conversations/{conversation_id}/messages",
    response_model=List[MessageResponse],
)
async def get_messages(
    conversation_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get all messages in a conversation."""
    # Verify ownership
    result = await db.execute(
        select(Conversation).where(
            Conversation.id == conversation_id,
            Conversation.user_id == current_user["id"],
        )
    )
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Conversation not found")

    result = await db.execute(
        select(Message)
        .where(Message.conversation_id == conversation_id)
        .order_by(Message.created_at)
    )
    messages = result.scalars().all()
    return [
        MessageResponse(
            id=str(m.id),
            conversation_id=str(m.conversation_id),
            role=m.role,
            content=m.content,
            tokens_used=m.tokens_used,
            latency_ms=m.latency_ms,
            created_at=m.created_at,
        )
        for m in messages
    ]


@router.websocket("/ws/chat/{conversation_id}")
async def websocket_chat(
    websocket: WebSocket,
    conversation_id: str,
):
    """WebSocket endpoint for real-time streaming chat."""
    # Authenticate via query param
    token = websocket.query_params.get("token", "")
    try:
        user_data = decode_access_token(token) if token else None
    except Exception:
        await websocket.close(code=4001)
        return

    await manager.connect(conversation_id, websocket)

    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            user_content = message_data.get("content", "")

            if not user_content:
                continue

            start_time = time.time()

            # Echo back a simulated streaming response
            # In production, this calls llm_service for actual model inference
            response_text = f"I received your message: '{user_content}'. This is a placeholder response. Connect Ollama or OpenAI for real AI responses."

            # Stream token by token
            words = response_text.split(" ")
            for i, word in enumerate(words):
                chunk = word + (" " if i < len(words) - 1 else "")
                await websocket.send_json(
                    {"type": "token", "content": chunk}
                )

            latency = (time.time() - start_time) * 1000
            await websocket.send_json(
                {
                    "type": "done",
                    "content": "",
                    "tokens_used": len(response_text.split()),
                    "latency_ms": round(latency, 1),
                }
            )

    except WebSocketDisconnect:
        manager.disconnect(conversation_id)
    except Exception as e:
        manager.disconnect(conversation_id)
        print(f"WebSocket error: {e}")
