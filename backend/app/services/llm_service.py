"""LLM Service - Ollama + OpenAI fallback integration."""

import json
from typing import AsyncGenerator, Optional

import httpx

from app.core.config import settings


class LLMService:
    """Manages LLM inference via Ollama (local) with OpenAI fallback."""

    def __init__(self):
        self.ollama_url = settings.OLLAMA_BASE_URL
        self.openai_key = settings.OPENAI_API_KEY
        self.default_model = settings.DEFAULT_MODEL

    async def list_models(self) -> list[dict]:
        """List available models from Ollama."""
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                response = await client.get(f"{self.ollama_url}/api/tags")
                if response.status_code == 200:
                    data = response.json()
                    return [
                        {
                            "name": m["name"],
                            "size": m.get("size", 0),
                            "modified": m.get("modified_at", ""),
                        }
                        for m in data.get("models", [])
                    ]
        except Exception as e:
            print(f"[LLM] Ollama unavailable: {e}")
        return []

    async def generate(
        self,
        prompt: str,
        model: Optional[str] = None,
        system_prompt: str = "",
        temperature: float = 0.7,
        max_tokens: int = 2048,
    ) -> str:
        """Generate a complete response (non-streaming)."""
        model = model or self.default_model

        # Try Ollama first
        try:
            return await self._ollama_generate(
                prompt, model, system_prompt, temperature, max_tokens
            )
        except Exception as e:
            print(f"[LLM] Ollama failed: {e}")

        # Fallback to OpenAI
        if self.openai_key:
            try:
                return await self._openai_generate(
                    prompt, system_prompt, temperature, max_tokens
                )
            except Exception as e:
                print(f"[LLM] OpenAI fallback failed: {e}")

        return "Error: No LLM provider available. Please check Ollama connection or provide an OpenAI API key."

    async def stream(
        self,
        prompt: str,
        model: Optional[str] = None,
        system_prompt: str = "",
        temperature: float = 0.7,
        max_tokens: int = 2048,
        history: list[dict] = None,
    ) -> AsyncGenerator[str, None]:
        """Stream response tokens from the LLM."""
        model = model or self.default_model

        # Build messages
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        if history:
            messages.extend(history)
        messages.append({"role": "user", "content": prompt})

        # Try Ollama streaming
        try:
            async for token in self._ollama_stream(
                messages, model, temperature, max_tokens
            ):
                yield token
            return
        except Exception as e:
            print(f"[LLM] Ollama stream failed: {e}")

        # Fallback: yield error message
        yield "Error: LLM provider unavailable."

    async def _ollama_generate(
        self,
        prompt: str,
        model: str,
        system_prompt: str,
        temperature: float,
        max_tokens: int,
    ) -> str:
        """Generate via Ollama API."""
        async with httpx.AsyncClient(timeout=120) as client:
            payload = {
                "model": model,
                "prompt": prompt,
                "system": system_prompt,
                "stream": False,
                "options": {
                    "temperature": temperature,
                    "num_predict": max_tokens,
                },
            }
            response = await client.post(
                f"{self.ollama_url}/api/generate", json=payload
            )
            response.raise_for_status()
            return response.json().get("response", "")

    async def _ollama_stream(
        self,
        messages: list[dict],
        model: str,
        temperature: float,
        max_tokens: int,
    ) -> AsyncGenerator[str, None]:
        """Stream from Ollama chat API."""
        async with httpx.AsyncClient(timeout=120) as client:
            payload = {
                "model": model,
                "messages": messages,
                "stream": True,
                "options": {
                    "temperature": temperature,
                    "num_predict": max_tokens,
                },
            }
            async with client.stream(
                "POST", f"{self.ollama_url}/api/chat", json=payload
            ) as response:
                response.raise_for_status()
                async for line in response.aiter_lines():
                    if line:
                        data = json.loads(line)
                        content = data.get("message", {}).get("content", "")
                        if content:
                            yield content
                        if data.get("done", False):
                            return

    async def _openai_generate(
        self,
        prompt: str,
        system_prompt: str,
        temperature: float,
        max_tokens: int,
    ) -> str:
        """Generate via OpenAI API."""
        async with httpx.AsyncClient(timeout=60) as client:
            headers = {
                "Authorization": f"Bearer {self.openai_key}",
                "Content-Type": "application/json",
            }
            payload = {
                "model": settings.OPENAI_MODEL,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt},
                ],
                "temperature": temperature,
                "max_tokens": max_tokens,
            }
            response = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers=headers,
                json=payload,
            )
            response.raise_for_status()
            return response.json()["choices"][0]["message"]["content"]


# Singleton
llm_service = LLMService()
