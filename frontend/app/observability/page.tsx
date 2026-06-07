"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Zap,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Bot,
  BarChart3,
  Cpu,
  CheckCircle2,
  XCircle,
  Terminal,
  RefreshCcw,
  Network
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const stats = [
  {
    label: "Total Tokens (24h)",
    value: "284,391",
    change: "+12.4%",
    trend: "up",
    icon: Zap,
    color: "text-brand-400",
    bg: "bg-brand-500/10",
    border: "border-brand-500/30",
  },
  {
    label: "Avg Latency",
    value: "1.8s",
    change: "-0.3s",
    trend: "down",
    icon: Clock,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
  },
  {
    label: "Success Rate",
    value: "98.7%",
    change: "+0.2%",
    trend: "up",
    icon: Activity,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/30",
  },
  {
    label: "Errors (24h)",
    value: "3",
    change: "-2",
    trend: "down",
    icon: AlertTriangle,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
  },
];

const modelUsage = [
  {
    model: "llama3:8b",
    tokens: 142800,
    requests: 328,
    avgLatency: "1.2s",
    status: "healthy",
  },
  {
    model: "gpt-4o",
    tokens: 98400,
    requests: 124,
    avgLatency: "2.8s",
    status: "healthy",
  },
  {
    model: "codellama:13b",
    tokens: 34200,
    requests: 67,
    avgLatency: "1.5s",
    status: "healthy",
  },
  {
    model: "mistral:7b",
    tokens: 8991,
    requests: 31,
    avgLatency: "0.9s",
    status: "degraded",
  },
];

const liveLogs = [
  { time: "14:32:05.102", level: "WARN", service: "Gateway", msg: "Rate limit exceeded for user_id=482" },
  { time: "14:32:04.981", level: "INFO", service: "LLM-Router", msg: "Routed query to llama3:8b (latency=1.2s)" },
  { time: "14:31:58.210", level: "INFO", service: "Vector-DB", msg: "Upserted 48 chunks to index=knowledge_base" },
  { time: "14:31:45.002", level: "ERROR", service: "LLM-Node", msg: "Connection timeout to Ollama host" },
  { time: "14:31:44.891", level: "INFO", service: "Auth", msg: "Token validation successful for session_id=x891" },
  { time: "14:31:30.442", level: "INFO", service: "LLM-Router", msg: "Stream completed (tokens=482, tps=42.1)" },
];

const hourlyTokens = [
  12, 18, 8, 5, 3, 2, 4, 15, 28, 42, 38, 45, 52, 48, 35, 42, 55, 62, 48, 38,
  25, 18, 14, 10,
];

export default function ObservabilityPage() {
  const maxToken = Math.max(...hourlyTokens);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={item} className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-black text-text-primary tracking-tight">
            Observability Fleet
          </h1>
          <p className="text-sm text-text-muted mt-2 max-w-lg leading-relaxed">
            Real-time telemetry, model health, and system logs across your entire AI infrastructure.
          </p>
        </div>
        <div className="flex items-center gap-4">
           <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 px-3 py-1.5 flex items-center gap-2">
             <div className="relative flex h-2 w-2">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
             </div>
             Systems Operational
           </Badge>
           <button className="flex items-center justify-center p-2 rounded-lg bg-surface-2 hover:bg-surface-3 transition-colors text-text-muted hover:text-brand-400">
             <RefreshCcw className="h-4 w-4" />
           </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={item}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, i) => (
          <Card key={stat.label} className={cn("glass overflow-hidden relative group", stat.border)}>
            {/* Subtle Gradient Backglow */}
            <div className={cn("absolute -inset-1 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 pointer-events-none", stat.bg)} />
            
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={cn("flex h-12 w-12 items-center justify-center rounded-xl", stat.bg)}
                >
                  <stat.icon className={cn("h-6 w-6", stat.color)} />
                </div>
                <div
                  className={cn(
                    "flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2 py-1 rounded-md",
                    stat.trend === "up" && stat.label !== "Errors (24h)"
                      ? "text-emerald-400 bg-emerald-500/10"
                      : stat.trend === "down" && stat.label === "Errors (24h)"
                      ? "text-emerald-400 bg-emerald-500/10"
                      : stat.trend === "down" &&
                        stat.label !== "Errors (24h)"
                      ? "text-emerald-400 bg-emerald-500/10"
                      : "text-red-400 bg-red-500/10"
                  )}
                >
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {stat.change}
                </div>
              </div>
              <div className="text-3xl font-black text-text-primary mb-1">
                {stat.value}
              </div>
              <div className="flex items-center gap-2">
                 <div className={cn("w-2 h-0.5 rounded-full", stat.bg.replace('/10', ''))} />
                 <div className="text-xs text-text-muted font-medium">{stat.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Token Usage Heatmap */}
        <motion.div variants={item} className="xl:col-span-2">
          <Card className="glass h-full border-border/50 overflow-hidden">
            <CardHeader className="border-b border-border/50 bg-surface-1/50 py-4 px-6 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Activity className="h-4 w-4 text-brand-400" />
                Network Traffic & Token Topology (24h)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-end gap-[4px] h-[220px] pt-8">
                {hourlyTokens.map((val, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max((val / maxToken) * 100, 5)}%` }}
                    transition={{ delay: i * 0.03, duration: 0.8, type: "spring" }}
                    className="flex-1 rounded-t-sm w-full bg-gradient-to-t from-brand-500/10 to-brand-400/80 hover:to-brand-300 transition-colors cursor-pointer relative group"
                  >
                    {/* Tooltip */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-surface-2 border border-border/50 text-text-primary text-[10px] px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 flex flex-col items-center">
                      <span className="font-mono text-brand-300">{(val * 1000).toLocaleString()}</span>
                      <span className="text-[9px] text-text-muted uppercase">Tokens</span>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="flex justify-between mt-4 text-[10px] font-mono text-text-muted uppercase tracking-wider">
                <span>00:00 UTC</span>
                <span>06:00 UTC</span>
                <span>12:00 UTC</span>
                <span>18:00 UTC</span>
                <span>23:00 UTC</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Model Breakdown */}
        <motion.div variants={item}>
          <Card className="glass h-full border-border/50">
            <CardHeader className="border-b border-border/50 bg-surface-1/50 py-4 px-6">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Network className="h-4 w-4 text-brand-400" />
                Model Inference Nodes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {modelUsage.map((m) => (
                <div
                  key={m.model}
                  className={cn(
                     "rounded-xl border p-4 transition-all duration-300 hover:bg-surface-1/50",
                     m.status === "healthy" ? "border-emerald-500/20" : "border-amber-500/20 bg-amber-500/5"
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-mono font-bold text-text-primary flex items-center gap-2">
                       <Cpu className="h-4 w-4 text-text-muted" />
                      {m.model}
                    </span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[9px] uppercase font-bold tracking-widest",
                        m.status === "healthy" ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10" : "border-amber-500/30 text-amber-400 bg-amber-500/10"
                      )}
                    >
                      {m.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[10px] text-text-muted uppercase font-bold tracking-wider">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-mono text-text-primary">
                        {(m.tokens / 1000).toFixed(1)}K
                      </span>
                      Tokens
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-mono text-text-primary">
                        {m.requests}
                      </span>
                      Reqs
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-mono text-text-primary">
                        {m.avgLatency}
                      </span>
                      Latency
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Terminal Live Logs */}
      <motion.div variants={item}>
        <Card className="border-border/50 overflow-hidden bg-[#0a0a0f] shadow-2xl relative">
           <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" />
          <CardHeader className="border-b border-white/5 bg-white/5 py-3 px-6 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-white/90">
              <Terminal className="h-4 w-4 text-brand-400" />
              Live Terminal Stream
            </CardTitle>
            <div className="flex gap-1.5">
               <div className="w-3 h-3 rounded-full bg-red-500/80" />
               <div className="w-3 h-3 rounded-full bg-amber-500/80" />
               <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-6 font-mono text-[11px] leading-relaxed overflow-x-auto custom-scrollbar h-[250px] space-y-1">
              {liveLogs.map((log, i) => (
                <div key={i} className="flex gap-3 hover:bg-white/5 px-2 py-0.5 rounded transition-colors group">
                  <span className="text-text-muted/50 shrink-0 select-none">[{log.time}]</span>
                  <span className={cn(
                    "shrink-0 w-12 font-bold",
                    log.level === "INFO" && "text-brand-400",
                    log.level === "WARN" && "text-amber-400",
                    log.level === "ERROR" && "text-red-400"
                  )}>
                    {log.level}
                  </span>
                  <span className="text-violet-400 shrink-0 w-24">({log.service})</span>
                  <span className="text-white/80 whitespace-nowrap group-hover:text-white transition-colors">
                     {log.msg}
                  </span>
                </div>
              ))}
              <div className="flex gap-3 px-2 py-0.5 mt-2 animate-pulse">
                  <span className="text-brand-400">_</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
