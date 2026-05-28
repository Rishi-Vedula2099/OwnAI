"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { useAppStore } from "@/store/app-store";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed } = useAppStore();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-col min-h-screen">
        <Header />
        <motion.main
          initial={false}
          animate={{
            marginLeft: sidebarCollapsed ? 72 : 260,
          }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="flex-1 p-6"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
