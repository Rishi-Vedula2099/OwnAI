"""Marketplace API routes."""

from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.agent import Agent
from app.models.marketplace import MarketplaceListing

router = APIRouter()


@router.get("")
async def browse_marketplace(
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    """Browse published agents in the marketplace."""
    query = select(MarketplaceListing, Agent).join(
        Agent, MarketplaceListing.agent_id == Agent.id
    )

    if category:
        query = query.where(MarketplaceListing.category == category)

    if search:
        query = query.where(Agent.name.ilike(f"%{search}%"))

    query = query.order_by(MarketplaceListing.clone_count.desc())

    result = await db.execute(query)
    listings = result.all()

    return [
        {
            "id": str(listing.id),
            "agent_name": agent.name,
            "model": agent.model,
            "description": listing.description,
            "category": listing.category,
            "system_prompt_preview": agent.system_prompt[:200],
            "clone_count": listing.clone_count,
            "like_count": listing.like_count,
            "published_at": listing.published_at.isoformat(),
        }
        for listing, agent in listings
    ]


@router.post("/publish", status_code=201)
async def publish_agent(
    agent_id: str,
    description: str = "",
    category: str = "General",
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Publish an agent to the marketplace."""
    # Verify agent ownership
    result = await db.execute(
        select(Agent).where(
            Agent.id == agent_id, Agent.user_id == current_user["id"]
        )
    )
    agent = result.scalar_one_or_none()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    # Check if already published
    result = await db.execute(
        select(MarketplaceListing).where(
            MarketplaceListing.agent_id == agent_id
        )
    )
    if result.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Agent already published")

    # Make agent public
    agent.is_public = True

    listing = MarketplaceListing(
        agent_id=agent_id,
        creator_id=current_user["id"],
        description=description,
        category=category,
    )
    db.add(listing)
    await db.flush()

    return {
        "id": str(listing.id),
        "agent_id": str(agent_id),
        "message": "Agent published successfully",
    }


@router.post("/clone/{listing_id}", status_code=201)
async def clone_agent(
    listing_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Clone an agent from the marketplace."""
    result = await db.execute(
        select(MarketplaceListing, Agent)
        .join(Agent, MarketplaceListing.agent_id == Agent.id)
        .where(MarketplaceListing.id == listing_id)
    )
    row = result.one_or_none()
    if not row:
        raise HTTPException(status_code=404, detail="Listing not found")

    listing, original = row

    # Create clone
    clone = Agent(
        user_id=current_user["id"],
        name=f"{original.name} (Cloned)",
        model=original.model,
        system_prompt=original.system_prompt,
        temperature=original.temperature,
        max_tokens=original.max_tokens,
        tools=original.tools,
        config=original.config,
    )
    db.add(clone)

    # Increment clone count
    listing.clone_count += 1
    await db.flush()

    return {
        "id": str(clone.id),
        "name": clone.name,
        "message": "Agent cloned successfully",
    }
