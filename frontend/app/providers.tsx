"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";

const authRoutes = ["/login", "/register"];

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = authRoutes.includes(pathname);

  if (isAuthPage) {
    return <>{children}</>;
  }

  return <AppShell>{children}</AppShell>;
}
