"""FAISS Vector Store for document embeddings."""

import os
from typing import List, Optional

from app.core.config import settings


class VectorStore:
    """FAISS-based vector store for document embeddings."""

    def __init__(self):
        self.index_path = settings.FAISS_INDEX_PATH
        self.index = None
        self.documents: List[dict] = []
        self._initialized = False

    def _ensure_initialized(self):
        """Lazy initialization of FAISS index."""
        if self._initialized:
            return

        try:
            import faiss
            import numpy as np

            # Create a simple L2 index (384 dimensions for all-MiniLM-L6-v2)
            self.dimension = 384
            self.index = faiss.IndexFlatL2(self.dimension)
            self._initialized = True

            # Try to load existing index
            if os.path.exists(f"{self.index_path}/index.faiss"):
                self.index = faiss.read_index(f"{self.index_path}/index.faiss")
                print(f"[VectorStore] Loaded index with {self.index.ntotal} vectors")

        except ImportError:
            print("[VectorStore] FAISS not available. Vector search disabled.")
            self._initialized = True

    def _embed_texts(self, texts: List[str]) -> "np.ndarray":
        """Generate embeddings for texts using a simple model."""
        import numpy as np

        # Placeholder: random embeddings
        # In production, use sentence-transformers or OpenAI embeddings
        return np.random.randn(len(texts), self.dimension).astype("float32")

    def add_texts(
        self,
        texts: List[str],
        metadatas: Optional[List[dict]] = None,
    ):
        """Add texts to the vector store."""
        self._ensure_initialized()

        if self.index is None:
            print("[VectorStore] Index not available")
            return

        embeddings = self._embed_texts(texts)
        self.index.add(embeddings)

        # Store document data
        for i, text in enumerate(texts):
            self.documents.append(
                {
                    "content": text,
                    "metadata": metadatas[i] if metadatas else {},
                }
            )

    def similarity_search(self, query: str, k: int = 5) -> List[dict]:
        """Search for similar documents."""
        self._ensure_initialized()

        if self.index is None or self.index.ntotal == 0:
            return []

        import numpy as np

        query_embedding = self._embed_texts([query])
        distances, indices = self.index.search(query_embedding, min(k, self.index.ntotal))

        results = []
        for dist, idx in zip(distances[0], indices[0]):
            if idx < len(self.documents):
                doc = self.documents[idx].copy()
                doc["score"] = float(1 / (1 + dist))
                results.append(doc)

        return results

    def save(self):
        """Save the index to disk."""
        self._ensure_initialized()

        if self.index is None:
            return

        import faiss

        os.makedirs(self.index_path, exist_ok=True)
        faiss.write_index(self.index, f"{self.index_path}/index.faiss")
        print(f"[VectorStore] Saved index with {self.index.ntotal} vectors")

    def clear(self):
        """Clear the index."""
        import faiss

        self.index = faiss.IndexFlatL2(self.dimension)
        self.documents = []


# Singleton
vector_store = VectorStore()
