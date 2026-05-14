"""Knowledge Base API routes."""

import os
import uuid
from typing import List

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.config import settings
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.document import Document
from app.schemas.document import DocumentResponse, KnowledgeQuery, KnowledgeQueryResponse

router = APIRouter()


@router.post("/upload", response_model=DocumentResponse, status_code=201)
async def upload_document(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Upload a document to the knowledge base."""
    # Validate file type
    allowed_types = [
        "application/pdf",
        "text/plain",
        "text/markdown",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"File type {file.content_type} not supported. Allowed: PDF, TXT, MD, DOCX",
        )

    # Save file
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    file_id = str(uuid.uuid4())
    file_ext = os.path.splitext(file.filename or "file")[1]
    saved_filename = f"{file_id}{file_ext}"
    file_path = os.path.join(settings.UPLOAD_DIR, saved_filename)

    content = await file.read()
    file_size = len(content)

    if file_size > settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Max: {settings.MAX_UPLOAD_SIZE_MB}MB",
        )

    with open(file_path, "wb") as f:
        f.write(content)

    # Create document record
    doc = Document(
        user_id=current_user["id"],
        title=os.path.splitext(file.filename or "Untitled")[0],
        filename=file.filename or saved_filename,
        content_type=file.content_type or "application/octet-stream",
        file_size=file_size,
        chunk_count=0,
        embedded=False,
    )
    db.add(doc)
    await db.flush()

    # In production: trigger Celery task for chunking + embedding
    # embed_document.delay(str(doc.id), file_path)

    return DocumentResponse(
        id=str(doc.id),
        title=doc.title,
        filename=doc.filename,
        content_type=doc.content_type,
        file_size=doc.file_size,
        chunk_count=doc.chunk_count,
        embedded=doc.embedded,
        created_at=doc.created_at,
    )


@router.get("/documents", response_model=List[DocumentResponse])
async def list_documents(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List all documents for the current user."""
    result = await db.execute(
        select(Document)
        .where(Document.user_id == current_user["id"])
        .order_by(Document.created_at.desc())
    )
    docs = result.scalars().all()
    return [
        DocumentResponse(
            id=str(d.id),
            title=d.title,
            filename=d.filename,
            content_type=d.content_type,
            file_size=d.file_size,
            chunk_count=d.chunk_count,
            embedded=d.embedded,
            created_at=d.created_at,
        )
        for d in docs
    ]


@router.delete("/documents/{document_id}", status_code=204)
async def delete_document(
    document_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a document from the knowledge base."""
    result = await db.execute(
        select(Document).where(
            Document.id == document_id,
            Document.user_id == current_user["id"],
        )
    )
    doc = result.scalar_one_or_none()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    await db.delete(doc)


@router.post("/query", response_model=KnowledgeQueryResponse)
async def query_knowledge(
    data: KnowledgeQuery,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Query the knowledge base using RAG."""
    # Placeholder - in production this uses rag_service
    return KnowledgeQueryResponse(
        answer=f"Based on your knowledge base, here is information related to: '{data.query}'. "
        "This is a placeholder response. Connect the RAG service with FAISS for real retrieval.",
        sources=[
            {
                "document": "api-docs.pdf",
                "chunk": 12,
                "relevance": 0.92,
            }
        ],
    )
