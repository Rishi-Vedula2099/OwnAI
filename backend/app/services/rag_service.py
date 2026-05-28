"""RAG Service - Document processing and retrieval."""

import os
from typing import List, Optional

from app.core.config import settings
from app.services.vector_store import vector_store


class RAGService:
    """Handles document chunking, embedding, and retrieval-augmented generation."""

    def __init__(self):
        self.chunk_size = 1000
        self.chunk_overlap = 200

    def chunk_text(self, text: str) -> List[str]:
        """Split text into overlapping chunks."""
        chunks = []
        start = 0
        while start < len(text):
            end = start + self.chunk_size
            chunk = text[start:end]
            chunks.append(chunk)
            start += self.chunk_size - self.chunk_overlap
        return chunks

    def extract_text_from_pdf(self, file_path: str) -> str:
        """Extract text from a PDF file."""
        try:
            from pypdf import PdfReader

            reader = PdfReader(file_path)
            text = ""
            for page in reader.pages:
                text += page.extract_text() or ""
            return text
        except Exception as e:
            print(f"[RAG] PDF extraction error: {e}")
            return ""

    def extract_text(self, file_path: str) -> str:
        """Extract text from any supported file format."""
        ext = os.path.splitext(file_path)[1].lower()

        if ext == ".pdf":
            return self.extract_text_from_pdf(file_path)
        elif ext in [".txt", ".md"]:
            with open(file_path, "r", encoding="utf-8") as f:
                return f.read()
        else:
            return ""

    async def process_document(self, document_id: str, file_path: str) -> int:
        """Process a document: extract text, chunk, embed, store."""
        text = self.extract_text(file_path)
        if not text:
            return 0

        chunks = self.chunk_text(text)

        # Store chunks in vector store
        metadatas = [
            {"document_id": document_id, "chunk_index": i}
            for i in range(len(chunks))
        ]
        vector_store.add_texts(chunks, metadatas)

        return len(chunks)

    async def query(
        self,
        query: str,
        document_ids: Optional[List[str]] = None,
        top_k: int = 5,
    ) -> List[dict]:
        """Query the vector store and return relevant chunks."""
        results = vector_store.similarity_search(query, k=top_k)

        # Filter by document IDs if specified
        if document_ids:
            results = [
                r
                for r in results
                if r.get("metadata", {}).get("document_id") in document_ids
            ]

        return results

    async def augmented_generate(
        self,
        query: str,
        document_ids: Optional[List[str]] = None,
        top_k: int = 5,
    ) -> dict:
        """Full RAG pipeline: retrieve → augment → generate."""
        from app.services.llm_service import llm_service

        # Retrieve relevant chunks
        chunks = await self.query(query, document_ids, top_k)

        if not chunks:
            return {
                "answer": "No relevant information found in the knowledge base.",
                "sources": [],
            }

        # Build context
        context = "\n\n---\n\n".join(
            [c.get("content", "") for c in chunks]
        )

        # Generate answer
        prompt = f"""Based on the following context, answer the question. 
If the context doesn't contain relevant information, say so.

Context:
{context}

Question: {query}

Answer:"""

        answer = await llm_service.generate(prompt)

        return {
            "answer": answer,
            "sources": [
                {
                    "document_id": c.get("metadata", {}).get("document_id"),
                    "chunk_index": c.get("metadata", {}).get("chunk_index"),
                    "relevance": c.get("score", 0),
                }
                for c in chunks
            ],
        }


# Singleton
rag_service = RAGService()
