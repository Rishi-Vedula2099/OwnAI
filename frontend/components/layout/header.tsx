"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  Bell,
  ChevronRight,
  User,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/store/app-store";

const routeNames: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/ai-workshop": "AI Workshop",
  "/chat": "Chat",
  "/knowledge": "Knowledge Base",
  "/marketplace": "Marketplace",
  "/observability": "Observability",
  "/settings": "Settings",
};

export function Header() {
  const pathname = usePathname();
  const { user, logout, sidebarCollapsed } = useAppStore();

  const segments = pathname.split("/").filter(Boolean);
  const pageTitle = routeNames[`/${segments[0]}`] || "NeuraStack";

  return (
    <motion.header
      initial={false}
      animate={{ marginLeft: sidebarCollapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-surface-0/80 backdrop-blur-xl px-6"
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-text-muted">NeuraStack</span>
        <ChevronRight className="h-3.5 w-3.5 text-text-muted" />
        <span className="font-medium text-text-primary">{pageTitle}</span>
        {segments.length > 1 && (
          <>
            <ChevronRight className="h-3.5 w-3.5 text-text-muted" />
            <span className="text-text-secondary capitalize">
              {segments.slice(1).join(" / ")}
            </span>
          </>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            placeholder="Search... (⌘K)"
            className="w-64 pl-9 bg-surface-1 border-border focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
          />
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon-sm" className="relative hover:bg-surface-2 transition-colors">
          <Bell className="h-4.5 w-4.5 text-text-secondary" />
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-accent-primary animate-pulse" />
        </Button>

        {/* User Menu */}
        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-brand text-white text-xs font-bold shadow-md">
            {user?.name?.charAt(0)?.toUpperCase() || <User className="h-4 w-4" />}
          </div>
          {user && (
            <div className="hidden md:flex flex-col">
              <span className="text-xs font-medium text-text-primary leading-tight">
                {user.name}
              </span>
              <span className="text-[10px] text-text-muted leading-tight">
                {user.email}
              </span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={logout}
            className="text-text-muted hover:text-error"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
