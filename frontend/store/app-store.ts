"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AppState {
  // Sidebar
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // User
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;

  // UI
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Sidebar
      sidebarOpen: true,
      sidebarCollapsed: false,
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarCollapsed: (collapsed) =>
        set({ sidebarCollapsed: collapsed }),

      // User
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token) => {
        if (token) {
          localStorage.setItem("ownai_token", token);
        } else {
          localStorage.removeItem("ownai_token");
        }
        set({ token });
      },
      logout: () => {
        localStorage.removeItem("ownai_token");
        set({ user: null, token: null });
      },

      // UI
      commandPaletteOpen: false,
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
    }),
    {
      name: "ownai-app",
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        token: state.token,
      }),
    }
  )
);
