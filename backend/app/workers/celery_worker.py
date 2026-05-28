"""Celery worker for async background tasks."""

from celery import Celery

from app.core.config import settings

# Initialize Celery
celery_app = Celery(
    "ownai_worker",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=600,  # 10 minutes max
    worker_prefetch_multiplier=1,
)


@celery_app.task(name="embed_document")
def embed_document(document_id: str, file_path: str):
    """Background task to process and embed a document."""
    import asyncio
    from app.services.rag_service import rag_service

    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    try:
        chunk_count = loop.run_until_complete(
            rag_service.process_document(document_id, file_path)
        )
        print(f"[Celery] Embedded document {document_id}: {chunk_count} chunks")
        return {"document_id": document_id, "chunk_count": chunk_count}
    except Exception as e:
        print(f"[Celery] Error embedding document {document_id}: {e}")
        raise
    finally:
        loop.close()


@celery_app.task(name="process_chat_analytics")
def process_chat_analytics(conversation_id: str):
    """Background task to process chat analytics."""
    print(f"[Celery] Processing analytics for conversation {conversation_id}")
    return {"conversation_id": conversation_id, "status": "processed"}
