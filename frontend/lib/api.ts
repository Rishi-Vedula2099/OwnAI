import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: attach JWT token
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("ownai_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor: handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("ownai_token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// API helper functions
export const apiClient = {
  // Auth
  login: (email: string, password: string) =>
    api.post("/api/auth/login", { email, password }),
  register: (name: string, email: string, password: string) =>
    api.post("/api/auth/register", { name, email, password }),
  getMe: () => api.get("/api/auth/me"),

  // Agents
  getAgents: () => api.get("/api/agents"),
  getAgent: (id: string) => api.get(`/api/agents/${id}`),
  createAgent: (data: Record<string, unknown>) =>
    api.post("/api/agents", data),
  updateAgent: (id: string, data: Record<string, unknown>) =>
    api.put(`/api/agents/${id}`, data),
  deleteAgent: (id: string) => api.delete(`/api/agents/${id}`),
  duplicateAgent: (id: string) => api.post(`/api/agents/${id}/duplicate`),

  // Conversations
  getConversations: () => api.get("/api/conversations"),
  createConversation: (agentId: string, title?: string) =>
    api.post("/api/conversations", { agent_id: agentId, title }),
  getMessages: (conversationId: string) =>
    api.get(`/api/conversations/${conversationId}/messages`),

  // Knowledge
  uploadDocument: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/api/knowledge/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  getDocuments: () => api.get("/api/knowledge/documents"),
  deleteDocument: (id: string) => api.delete(`/api/knowledge/documents/${id}`),
  queryKnowledge: (query: string, documentIds?: string[]) =>
    api.post("/api/knowledge/query", { query, document_ids: documentIds }),

  // Marketplace
  getMarketplace: (params?: Record<string, string>) =>
    api.get("/api/marketplace", { params }),
  publishAgent: (agentId: string, description: string) =>
    api.post("/api/marketplace/publish", {
      agent_id: agentId,
      description,
    }),
  cloneAgent: (listingId: string) =>
    api.post(`/api/marketplace/clone/${listingId}`),

  // Analytics
  getUsageStats: () => api.get("/api/analytics/usage"),
  getLatencyMetrics: () => api.get("/api/analytics/latency"),
  getErrorLogs: () => api.get("/api/analytics/errors"),
};
