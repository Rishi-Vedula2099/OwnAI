"""AI Agent CRUD API routes."""

import uuid
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.agent import Agent
from app.schemas.agent import AgentCreate, AgentUpdate, AgentResponse

router = APIRouter()


@router.get("", response_model=List[AgentResponse])
async def list_agents(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List all agents for the current user."""
    result = await db.execute(
        select(Agent)
        .where(Agent.user_id == current_user["id"])
        .order_by(Agent.updated_at.desc())
    )
    agents = result.scalars().all()
    return [
        AgentResponse(
            id=str(a.id),
            name=a.name,
            model=a.model,
            system_prompt=a.system_prompt,
            temperature=a.temperature,
            max_tokens=a.max_tokens,
            tools=a.tools or [],
            config=a.config or {},
            is_public=a.is_public,
            created_at=a.created_at,
            updated_at=a.updated_at,
        )
        for a in agents
    ]


@router.post("", response_model=AgentResponse, status_code=201)
async def create_agent(
    data: AgentCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new AI agent."""
    agent = Agent(
        user_id=current_user["id"],
        name=data.name,
        model=data.model,
        system_prompt=data.system_prompt,
        temperature=data.temperature,
        max_tokens=data.max_tokens,
        tools=data.tools,
        config=data.config,
    )
    db.add(agent)
    await db.flush()

    return AgentResponse(
        id=str(agent.id),
        name=agent.name,
        model=agent.model,
        system_prompt=agent.system_prompt,
        temperature=agent.temperature,
        max_tokens=agent.max_tokens,
        tools=agent.tools or [],
        config=agent.config or {},
        is_public=agent.is_public,
        created_at=agent.created_at,
        updated_at=agent.updated_at,
    )


@router.get("/{agent_id}", response_model=AgentResponse)
async def get_agent(
    agent_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get a specific agent by ID."""
    result = await db.execute(
        select(Agent).where(
            Agent.id == agent_id, Agent.user_id == current_user["id"]
        )
    )
    agent = result.scalar_one_or_none()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    return AgentResponse(
        id=str(agent.id),
        name=agent.name,
        model=agent.model,
        system_prompt=agent.system_prompt,
        temperature=agent.temperature,
        max_tokens=agent.max_tokens,
        tools=agent.tools or [],
        config=agent.config or {},
        is_public=agent.is_public,
        created_at=agent.created_at,
        updated_at=agent.updated_at,
    )


@router.put("/{agent_id}", response_model=AgentResponse)
async def update_agent(
    agent_id: str,
    data: AgentUpdate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update an existing agent."""
    result = await db.execute(
        select(Agent).where(
            Agent.id == agent_id, Agent.user_id == current_user["id"]
        )
    )
    agent = result.scalar_one_or_none()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(agent, key, value)

    await db.flush()

    return AgentResponse(
        id=str(agent.id),
        name=agent.name,
        model=agent.model,
        system_prompt=agent.system_prompt,
        temperature=agent.temperature,
        max_tokens=agent.max_tokens,
        tools=agent.tools or [],
        config=agent.config or {},
        is_public=agent.is_public,
        created_at=agent.created_at,
        updated_at=agent.updated_at,
    )


@router.delete("/{agent_id}", status_code=204)
async def delete_agent(
    agent_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete an agent."""
    result = await db.execute(
        select(Agent).where(
            Agent.id == agent_id, Agent.user_id == current_user["id"]
        )
    )
    agent = result.scalar_one_or_none()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    await db.delete(agent)


@router.post("/{agent_id}/duplicate", response_model=AgentResponse, status_code=201)
async def duplicate_agent(
    agent_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Duplicate an existing agent."""
    result = await db.execute(
        select(Agent).where(
            Agent.id == agent_id, Agent.user_id == current_user["id"]
        )
    )
    original = result.scalar_one_or_none()
    if not original:
        raise HTTPException(status_code=404, detail="Agent not found")

    clone = Agent(
        user_id=current_user["id"],
        name=f"{original.name} (Copy)",
        model=original.model,
        system_prompt=original.system_prompt,
        temperature=original.temperature,
        max_tokens=original.max_tokens,
        tools=original.tools,
        config=original.config,
    )
    db.add(clone)
    await db.flush()

    return AgentResponse(
        id=str(clone.id),
        name=clone.name,
        model=clone.model,
        system_prompt=clone.system_prompt,
        temperature=clone.temperature,
        max_tokens=clone.max_tokens,
        tools=clone.tools or [],
        config=clone.config or {},
        is_public=clone.is_public,
        created_at=clone.created_at,
        updated_at=clone.updated_at,
    )
