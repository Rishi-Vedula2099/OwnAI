"use client";

import { create } from "zustand";

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  tokens_used?: number;
  latency_ms?: number;
  created_at: string;
}

export interface Conversation {
  id: string;
  title: string;
  agent_id: string;
  agent_name?: string;
  updated_at: string;
}

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Message[];
  isStreaming: boolean;
  streamingContent: string;
  isConnected: boolean;

  setConversations: (conversations: Conversation[]) => void;
  setActiveConversation: (id: string | null) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setIsStreaming: (streaming: boolean) => void;
  appendStreamingContent: (content: string) => void;
  clearStreamingContent: () => void;
  setIsConnected: (connected: boolean) => void;
}

export const useChatStore = create<ChatState>()((set) => ({
  conversations: [],
  activeConversationId: null,
  messages: [],
  isStreaming: false,
  streamingContent: "",
  isConnected: false,

  setConversations: (conversations) => set({ conversations }),
  setActiveConversation: (id) =>
    set({ activeConversationId: id, messages: [], streamingContent: "" }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setIsStreaming: (streaming) => set({ isStreaming: streaming }),
  appendStreamingContent: (content) =>
    set((state) => ({
      streamingContent: state.streamingContent + content,
    })),
  clearStreamingContent: () => set({ streamingContent: "" }),
  setIsConnected: (connected) => set({ isConnected: connected }),
}));
