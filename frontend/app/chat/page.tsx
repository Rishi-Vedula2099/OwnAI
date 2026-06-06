"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Plus,
  Bot,
  User,
  Search,
  MoreVertical,
  Trash2,
  Copy,
  Clock,
  Zap,
  Sparkles,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  tokens?: number;
  latency?: number;
  created_at: string;
}

interface Conversation {
  id: string;
  title: string;
  agent: string;
  model: string;
  updated_at: string;
  preview: string;
}

const sampleConversations: Conversation[] = [
  {
    id: "1",
    title: "React Performance Optimization",
    agent: "Code Reviewer",
    model: "llama3:8b",
    updated_at: "5 min ago",
    preview: "Let me analyze your React component for performance issues...",
  },
  {
    id: "2",
    title: "Landing Page Design",
    agent: "Design Assistant",
    model: "gpt-4o",
    updated_at: "1 hr ago",
    preview: "Here are some modern design patterns for your landing page...",
  },
];

const sampleMessages: Message[] = [
  {
    id: "1",
    role: "user",
    content: "Can you review this React component for performance issues?\n\n```tsx\nfunction UserList({ users }) {\n  const sorted = users.sort((a, b) => a.name.localeCompare(b.name));\n  return (\n    <div>\n      {sorted.map(user => (\n        <UserCard key={user.id} user={user} onClick={() => handleClick(user)} />\n      ))}\n    </div>\n  );\n}\n```",
    created_at: "10:30 AM",
  },
  {
    id: "2",
    role: "assistant",
    content: `I found several performance issues in your component:

**1. Mutating Sort** ⚠️
\`Array.sort()\` mutates the original array. Use \`[...users].sort()\` or \`toSorted()\` instead.

**2. Inline Arrow Functions** 🔄
\`onClick={() => handleClick(user)}\` creates a new function on every render. Use \`useCallback\` or pass user ID:

\`\`\`tsx
const handleUserClick = useCallback((userId: string) => {
  // handle click
}, []);
\`\`\`

**3. Missing Memoization** 💡
The sorting happens on every render. Wrap it in \`useMemo\`:

\`\`\`tsx
const sorted = useMemo(
  () => [...users].sort((a, b) => a.name.localeCompare(b.name)),
  [users]
);
\`\`\`

**4. Consider Virtualization** 📋
For large lists (100+ items), use \`react-window\` or \`@tanstack/virtual\` to only render visible items.`,
    tokens: 342,
    latency: 1.2,
    created_at: "10:30 AM",
  },
];

export default function ChatPage() {
  const [activeConvo, setActiveConvo] = useState("1");
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [searchConvo, setSearchConvo] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sampleMessages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setInput("");
    setIsStreaming(true);
    setTimeout(() => setIsStreaming(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const filteredConvos = sampleConversations.filter((c) =>
    c.title.toLowerCase().includes(searchConvo.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-7rem)] gap-4 -m-6">
      {/* Conversation Sidebar */}
      <div className="w-80 shrink-0 border-r border-border/50 bg-bg-primary flex flex-col">
        <div className="p-4 border-b border-border/50">
          <Button className="w-full gradient-brand shadow-lg border-0" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
            <Input
              placeholder="Search conversations..."
              value={searchConvo}
              onChange={(e) => setSearchConvo(e.target.value)}
              className="pl-8 h-9 text-xs bg-surface-1 border-border/50 rounded-lg focus:border-brand-500"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1 custom-scrollbar">
          {filteredConvos.map((convo) => (
            <motion.button
              key={convo.id}
              onClick={() => setActiveConvo(convo.id)}
              className={cn(
                "w-full text-left rounded-xl px-3 py-3 transition-all duration-300 cursor-pointer overflow-hidden relative",
                activeConvo === convo.id
                  ? "bg-brand-500/10 border-brand-500/30"
                  : "hover:bg-surface-2 border-transparent"
              )}
              whileTap={{ scale: 0.98 }}
            >
              {activeConvo === convo.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-400 shadow-[0_0_10px_rgba(79,124,255,0.8)]" />
              )}
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-semibold text-text-primary truncate pr-2">
                  {convo.title}
                </h4>
                <span className="text-[10px] text-text-muted whitespace-nowrap">
                  {convo.updated_at}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mb-2">
                <Bot className="h-3.5 w-3.5 text-brand-400" />
                <span className="text-[11px] text-brand-300 font-medium">
                  {convo.agent}
                </span>
                <span className="text-[10px] text-text-muted">
                  · <span className="font-mono">{convo.model}</span>
                </span>
              </div>
              <p className="text-[11px] text-text-muted truncate leading-relaxed">{convo.preview}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-surface-0 shadow-inner">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-8 py-4 border-b border-border/50 glass-light">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 border border-brand-500/20 shadow-inner">
              <Bot className="h-5 w-5 text-brand-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-text-primary">
                Code Reviewer
              </h3>
              <div className="flex items-center gap-2 text-xs text-text-muted mt-0.5">
                <span className="font-mono bg-surface-2 px-1.5 py-0.5 rounded text-[10px]">llama3:8b</span>
                <span>·</span>
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_theme(colors.emerald.400)]" />
                  Ready
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border-brand-500/30 text-brand-300 bg-brand-500/10 font-mono">
              <Zap className="h-3 w-3 mr-1.5" />
              860 tokens
            </Badge>
            <Button variant="ghost" size="icon-sm" className="hover:bg-surface-2">
              <MoreVertical className="h-4 w-4 text-text-muted" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8 custom-scrollbar">
          {sampleMessages.map((msg, i) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className={cn(
                "flex gap-4",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {msg.role === "assistant" && (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl gradient-brand shadow-[0_0_15px_rgba(79,124,255,0.4)] mt-1">
                  <Bot className="h-5 w-5 text-white" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[75%] px-5 py-4 text-sm leading-relaxed",
                  msg.role === "user"
                    ? "bg-surface-2 text-text-primary rounded-2xl rounded-tr-sm border border-border/50"
                    : "glass relative rounded-2xl rounded-tl-sm text-text-primary"
                )}
              >
                {/* Visual border glow for AI */}
                {msg.role === "assistant" && (
                   <div className="absolute inset-0 rounded-2xl rounded-tl-sm border border-brand-400/30 pointer-events-none" />
                )}
                
                <div className="whitespace-pre-wrap break-words [&_code]:bg-surface-3 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:text-[12px] [&_code]:font-mono [&_code]:text-brand-300 [&_pre]:bg-[#0d1017] [&_pre]:border [&_pre]:border-border/50 [&_pre]:rounded-xl [&_pre]:p-4 [&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre_code]:bg-transparent [&_pre_code]:text-text-primary [&_pre_code]:p-0">
                  {msg.content}
                </div>
                {msg.role === "assistant" && (msg.tokens || msg.latency) && (
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border/40">
                    {msg.tokens && (
                      <span className="text-[10px] text-text-muted font-mono flex items-center gap-1.5">
                        <Zap className="h-3 w-3 text-brand-500" />
                        {msg.tokens} tokens
                      </span>
                    )}
                    {msg.latency && (
                      <span className="text-[10px] text-text-muted font-mono flex items-center gap-1.5">
                        <Clock className="h-3 w-3 text-brand-500" />
                        {msg.latency}s
                      </span>
                    )}
                    <button className="text-[10px] uppercase font-bold tracking-wider text-text-muted hover:text-brand-400 transition-colors flex items-center gap-1 ml-auto">
                      <Copy className="h-3 w-3" />
                      Copy
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {/* Streaming Indicator */}
          <AnimatePresence>
            {isStreaming && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex gap-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl gradient-brand shadow-[0_0_15px_rgba(79,124,255,0.4)] mt-1">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div className="glass border border-brand-400/30 rounded-2xl rounded-tl-sm px-5 py-4">
                   {/* Typing animation Mock */}
                   <div className="flex items-center gap-1.5 h-5">
                     <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.4 }} className="w-1.5 h-1.5 bg-brand-400 rounded-full" />
                     <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0.2 }} className="w-1.5 h-1.5 bg-brand-400 rounded-full" />
                     <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0.4 }} className="w-1.5 h-1.5 bg-brand-400 rounded-full" />
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="px-8 py-6 bg-surface-0 border-t border-border/50">
          <div className="flex items-end gap-3 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message Code Reviewer... (⌘Enter)"
                rows={1}
                className="w-full resize-none rounded-xl border border-border/50 bg-surface-1 px-5 py-3.5 pr-12 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 shadow-inner transition-all max-h-32"
                style={{
                  height: "auto",
                  minHeight: "50px",
                }}
              />
            </div>
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isStreaming}
              size="icon"
              className="shrink-0 rounded-xl h-[50px] w-[50px] gradient-brand shadow-lg border-0 hover:brightness-110 disabled:opacity-50 transition-all font-mono"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex items-center justify-center mt-3 text-[10px] text-text-muted tracking-wide max-w-4xl mx-auto font-mono">
            <span>Powered by <span className="text-brand-400">NeuraStack</span> Engine</span>
          </div>
        </div>
      </div>
    </div>
  );
}
