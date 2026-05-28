"use client";

const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: string;
}

export interface StreamChunk {
  type: "token" | "done" | "error";
  content: string;
  tokens_used?: number;
  latency_ms?: number;
}

export function createChatSocket(
  conversationId: string,
  onMessage: (chunk: StreamChunk) => void,
  onError?: (error: Event) => void,
  onClose?: () => void
): WebSocket {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("ownai_token")
      : null;

  const url = `${WS_BASE_URL}/ws/chat/${conversationId}${
    token ? `?token=${token}` : ""
  }`;

  const ws = new WebSocket(url);

  ws.onmessage = (event) => {
    try {
      const chunk: StreamChunk = JSON.parse(event.data);
      onMessage(chunk);
    } catch {
      onMessage({ type: "token", content: event.data });
    }
  };

  ws.onerror = (event) => {
    console.error("[WebSocket] Error:", event);
    onError?.(event);
  };

  ws.onclose = () => {
    console.log("[WebSocket] Closed");
    onClose?.();
  };

  return ws;
}

export function sendChatMessage(ws: WebSocket, message: string): void {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ content: message }));
  }
}
