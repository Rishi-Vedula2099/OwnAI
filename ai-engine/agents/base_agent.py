"""Base agent class for OwnAI agents."""

from typing import Optional, List, Dict, Any


class BaseAgent:
    """Base class for all OwnAI agents."""

    def __init__(self, config: Dict[str, Any]):
        self.name = config.get("name", "Agent")
        self.model = config.get("model", "llama3:8b")
        self.system_prompt = config.get("system_prompt", "")
        self.temperature = config.get("temperature", 0.7)
        self.max_tokens = config.get("max_tokens", 2048)
        self.tools = config.get("tools", [])
        self.memory_config = config.get("memory", {})
        self.conversation_history: List[Dict[str, str]] = []

    def add_message(self, role: str, content: str):
        """Add a message to conversation history."""
        self.conversation_history.append(
            {"role": role, "content": content}
        )

        # Trim history if exceeding max
        max_messages = self.memory_config.get("max_messages", 50)
        if len(self.conversation_history) > max_messages:
            # Keep system prompt + recent messages
            self.conversation_history = self.conversation_history[-max_messages:]

    def get_history(self) -> List[Dict[str, str]]:
        """Get conversation history for LLM context."""
        return self.conversation_history.copy()

    def clear_history(self):
        """Clear conversation history."""
        self.conversation_history = []

    def to_config(self) -> Dict[str, Any]:
        """Export agent as a config dict (JSON-serializable)."""
        return {
            "name": self.name,
            "model": self.model,
            "system_prompt": self.system_prompt,
            "temperature": self.temperature,
            "max_tokens": self.max_tokens,
            "tools": self.tools,
            "memory": self.memory_config,
        }

    @classmethod
    def from_config(cls, config: Dict[str, Any]) -> "BaseAgent":
        """Create an agent from a config dict."""
        return cls(config)
