"""Document & Knowledge schemas."""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel


class DocumentResponse(BaseModel):
    id: str
    title: str
    filename: str
    content_type: str
    file_size: int
    chunk_count: int
    embedded: bool
    created_at: datetime

    class Config:
        from_attributes = True


class KnowledgeQuery(BaseModel):
    query: str
    document_ids: Optional[List[str]] = None
    top_k: int = 5


class KnowledgeQueryResponse(BaseModel):
    answer: str
    sources: List[dict]
