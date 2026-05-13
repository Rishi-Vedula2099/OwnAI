"""RAG Pipeline - End-to-end retrieval-augmented generation."""

from typing import Optional, List, Dict, Any


class RAGPipeline:
    """End-to-end RAG pipeline: query → retrieve → augment → generate."""

    def __init__(self, rag_service=None, llm_service=None):
        self.rag_service = rag_service
        self.llm_service = llm_service

    async def run(
        self,
        query: str,
        document_ids: Optional[List[str]] = None,
        top_k: int = 5,
        system_prompt: str = "",
        model: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Execute the full RAG pipeline."""

        # Step 1: Retrieve relevant chunks
        chunks = await self.rag_service.query(query, document_ids, top_k)

        if not chunks:
            return {
                "answer": "No relevant information found in the knowledge base.",
                "sources": [],
                "chunks_retrieved": 0,
            }

        # Step 2: Build augmented context
        context = self._build_context(chunks)

        # Step 3: Generate answer
        prompt = self._build_prompt(query, context)

        answer = await self.llm_service.generate(
            prompt=prompt,
            model=model,
            system_prompt=system_prompt
            or "Answer questions based on the provided context. Be accurate and cite sources.",
        )

        return {
            "answer": answer,
            "sources": [
                {
                    "document_id": c.get("metadata", {}).get("document_id"),
                    "chunk_index": c.get("metadata", {}).get("chunk_index"),
                    "relevance_score": c.get("score", 0),
                    "preview": c.get("content", "")[:200],
                }
                for c in chunks
            ],
            "chunks_retrieved": len(chunks),
        }

    def _build_context(self, chunks: List[dict]) -> str:
        """Build context string from retrieved chunks."""
        parts = []
        for i, chunk in enumerate(chunks):
            content = chunk.get("content", "")
            doc_id = chunk.get("metadata", {}).get("document_id", "unknown")
            parts.append(f"[Source {i+1} - Doc: {doc_id}]\n{content}")
        return "\n\n---\n\n".join(parts)

    def _build_prompt(self, query: str, context: str) -> str:
        """Build the augmented prompt."""
        return f"""Use the following context to answer the question. If the answer is not in the context, say so.

Context:
{context}

Question: {query}

Provide a clear, accurate answer with references to the source documents."""
