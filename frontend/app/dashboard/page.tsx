"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Bot,
  Zap,
  Activity,
  Server,
  Terminal,
  Cpu,
  ShieldAlert,
  ArrowRight,
  TrendingDown,
  Sparkles,
  SearchCode
} from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0, 0, 0.58, 1] as const } },
};

const stats = [
  {
    label: "Active Agents",
    value: "24",
    change: "+4.1%",
    icon: Bot,
    color: "text-brand-400",
    sparkline: [20, 25, 22, 28, 24, 30, 24],
  },
  {
    label: "Live Sessions",
    value: "142",
    change: "+12%",
    icon: Activity,
    color: "text-emerald-400",
    sparkline: [100, 110, 105, 120, 118, 135, 142],
  },
  {
    label: "Tokens Used",
    value: "2.8M",
    change: "+22%",
    icon: Zap,
    color: "text-violet-400",
    sparkline: [2.1, 2.3, 2.2, 2.5, 2.4, 2.7, 2.8],
  },
];

const healthServices = [
  { name: "Core Model Engine", status: "ok" },
  { name: "RAG Vector Store", status: "ok" },
  { name: "Auth Service", status: "ok" },
  { name: "Agent Supervisor", status: "warning" },
  { name: "Redis Cache", status: "ok" },
  { name: "Memory Service", status: "ok" },
  { name: "Tool Calling API", status: "ok" },
  { name: "Webhooks Worker", status: "error" },
  { name: "Analytics Pipeline", status: "ok" },
];

const suggestions = [
  {
    title: "Optimize System Prompt",
    desc: "'Data Analyst' agent is using high tokens for repetitive outputs.",
    icon: SearchCode,
    action: "Review Prompt",
  },
  {
    title: "Enable Context Caching",
    desc: "Long conversation histories are duplicating token usage.",
    icon: Cpu,
    action: "Cache Settings",
  },
  {
    title: "Rate Limit Warning",
    desc: "Approaching external API limits on OpenAPI worker.",
    icon: ShieldAlert,
    action: "View Logs",
  },
];

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Page Header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Overview</h1>
          <p className="text-sm text-text-secondary mt-1">
            System performance and agent intelligence metrics.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/ai-workshop">
            <Button size="sm" className="gradient-brand text-white shadow-lg shadow-brand-500/20 border-0">
              <Sparkles className="h-4 w-4" />
              New Agent
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Hero Stats Grid (Top Row) */}
      <motion.div
        variants={item}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {stats.map((stat, i) => (
          <Card key={stat.label} className="glass relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardContent className="p-6 relative z-10">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-text-secondary mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold tracking-tight text-text-primary">{stat.value}</p>
                  <div className="flex items-center mt-2 text-xs font-medium text-emerald-400">
                    <TrendingDown className="h-3 w-3 mr-1 rotate-180" />
                    {stat.change} vs last week
                  </div>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-surface-2 border border-border/50 shadow-inner`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              
              {/* CSS Sparkline Mock */}
              <div className="mt-6 h-8 flex items-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                {stat.sparkline.map((val, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ height: 0 }}
                    animate={{ height: `${(val / Math.max(...stat.sparkline)) * 100}%` }}
                    transition={{ delay: 0.2 + idx * 0.1, duration: 0.5 }}
                    className={`flex-1 rounded-t-sm ${i === 0 ? 'bg-brand-500/80' : i === 1 ? 'bg-emerald-500/80' : 'bg-violet-500/80'}`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Main Complex View (12-col layout) */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Left Col (8 cols) - Activity Graph & Map */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          
          {/* AI Activity Graph Mock */}
          <motion.div variants={item} className="flex-1">
            <Card className="glass h-full">
              <CardHeader className="border-b border-border/50 pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm font-medium text-text-secondary flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Realtime Token Activity
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                    </span>
                    <span className="text-xs text-text-muted">Live</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 h-[260px] flex items-center justify-center relative overflow-hidden">
                {/* SVG Curve Mock for smooth line */}
                <div className="absolute inset-0 p-6">
                   <svg viewBox="0 0 800 200" preserveAspectRatio="none" className="w-full h-full drop-shadow-[0_0_8px_rgba(79,124,255,0.8)]">
                     {mounted && (
                       <motion.path
                         initial={{ pathLength: 0, opacity: 0 }}
                         animate={{ pathLength: 1, opacity: 1 }}
                         transition={{ duration: 2, ease: "easeInOut" }}
                         d="M0,150 C100,100 200,180 300,80 C400,-20 500,140 600,60 C700,-20 800,100 800,100"
                         fill="none"
                         stroke="url(#gradient)"
                         strokeWidth="4"
                         strokeLinecap="round"
                         strokeLinejoin="round"
                       />
                     )}
                     <defs>
                       <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                         <stop offset="0%" stopColor="var(--color-accent-primary)" />
                         <stop offset="100%" stopColor="var(--color-accent-secondary)" />
                       </linearGradient>
                     </defs>
                   </svg>
                </div>
                <div className="absolute bottom-6 left-6 right-6 flex justify-between text-[10px] text-text-muted font-mono">
                  <span>10:00</span>
                  <span>10:15</span>
                  <span>10:30</span>
                  <span>10:45</span>
                  <span>11:00</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

        </div>

        {/* Right Col (4 cols) - Suggestion & Health Map */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          
          {/* System Health Map */}
          <motion.div variants={item}>
            <Card className="glass">
              <CardHeader className="border-b border-border/50 pb-4">
                <CardTitle className="text-sm font-medium text-text-secondary flex items-center gap-2">
                  <Server className="h-4 w-4" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="grid grid-cols-3 gap-2">
                  {healthServices.map((service, idx) => (
                    <div 
                      key={idx} 
                      className="group relative flex aspect-square flex-col items-center justify-center rounded-lg bg-surface-2 border border-border/50 hover:bg-surface-3 transition-colors cursor-pointer"
                    >
                      <div className={`absolute top-2 right-2 h-1.5 w-1.5 rounded-full ${
                        service.status === 'ok' ? 'bg-emerald-500 shadow-[0_0_8px_theme(colors.emerald.500)]' :
                        service.status === 'warning' ? 'bg-amber-500 animate-pulse shadow-[0_0_8px_theme(colors.amber.500)]' :
                        'bg-rose-500 animate-pulse shadow-[0_0_8px_theme(colors.rose.500)]'
                      }`} />
                      <Terminal className="h-5 w-5 text-text-muted mb-2 group-hover:text-text-primary transition-colors" />
                      <span className="text-[9px] font-mono text-center px-1 leading-tight text-text-muted group-hover:text-text-secondary">{service.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* AI Suggestions */}
          <motion.div variants={item} className="flex-1">
            <Card className="glass h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-brand-400 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-1 space-y-3">
                {suggestions.map((sug, idx) => (
                  <div key={idx} className="flex gap-3 items-start p-3 rounded-lg bg-surface-1/50 border border-border/30 hover:bg-surface-2 transition-colors">
                    <div className="mt-0.5 p-1.5 rounded-md bg-surface-3">
                      <sug.icon className="h-4 w-4 text-text-secondary" />
                    </div>
                    <div className="flex-x-1 min-w-0">
                      <h4 className="text-xs font-semibold text-text-primary">{sug.title}</h4>
                      <p className="text-[11px] text-text-muted mt-1 leading-snug">{sug.desc}</p>
                      <button className="flex items-center text-[10px] uppercase tracking-wider font-bold text-brand-400 mt-2 hover:text-brand-300">
                        {sug.action} <ArrowRight className="h-3 w-3 ml-1" />
                      </button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}
