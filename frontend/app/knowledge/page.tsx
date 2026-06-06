"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  FileText,
  Search,
  Trash2,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Database,
  ArrowRight,
  Sparkles,
  File,
  X,
  Layers,
  Cpu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Document {
  id: string;
  title: string;
  filename: string;
  size: string;
  chunks: number;
  status: "embedded" | "processing" | "failed";
  created_at: string;
}

const sampleDocs: Document[] = [
  {
    id: "1",
    title: "API Documentation",
    filename: "api-docs.pdf",
    size: "2.4 MB",
    chunks: 48,
    status: "embedded",
    created_at: "Apr 15, 2025",
  },
  {
    id: "2",
    title: "React Best Practices",
    filename: "react-guide.pdf",
    size: "1.8 MB",
    chunks: 32,
    status: "embedded",
    created_at: "Apr 14, 2025",
  },
  {
    id: "3",
    title: "Company Handbook",
    filename: "handbook-2025.pdf",
    size: "5.1 MB",
    chunks: 96,
    status: "processing",
    created_at: "Apr 16, 2025",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function KnowledgePage() {
  const [isDragging, setIsDragging] = useState(false);
  const [query, setQuery] = useState("");
  const [queryResult, setQueryResult] = useState("");
  const [isQuerying, setIsQuerying] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent, entering: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(entering);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // In production, upload files via API
    const files = Array.from(e.dataTransfer.files);
    console.log("Dropped files:", files);
  }, []);

  const handleQuery = () => {
    if (!query.trim()) return;
    setIsQuerying(true);
    setTimeout(() => {
      setQueryResult(
        "Based on the API documentation, the `/api/users` endpoint supports the following methods:\n\n" +
          "- **GET** `/api/users` — Returns a paginated list of users\n" +
          "- **POST** `/api/users` — Creates a new user (requires `name`, `email`)\n" +
          "- **GET** `/api/users/:id` — Returns a specific user by ID\n\n" +
          "Authentication is required via Bearer token in the Authorization header.\n\n" +
          "*Source: api-docs.pdf (chunks 12-14)*"
      );
      setIsQuerying(false);
    }, 1500);
  };

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
            Knowledge Base
          </h1>
          <p className="text-sm text-text-muted mt-2 max-w-lg leading-relaxed">
            Upload text documents or URLs. They will be chunked, embedded, and indexed into the vector store for agent retrieval.
          </p>
        </div>
        <div className="flex items-center gap-4">
           {/* Stat Badges */}
           <div className="bg-surface-1 border border-border/50 rounded-xl px-4 py-2 flex items-center gap-3">
             <div className="p-1.5 bg-brand-500/20 rounded-md">
               <Database className="h-4 w-4 text-brand-400" />
             </div>
             <div>
               <p className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Vector Store</p>
               <p className="text-sm font-semibold text-text-primary">FAISS DB</p>
             </div>
           </div>
           <div className="bg-surface-1 border border-border/50 rounded-xl px-4 py-2 flex items-center gap-3">
             <div className="p-1.5 bg-emerald-500/20 rounded-md">
               <Layers className="h-4 w-4 text-emerald-400" />
             </div>
             <div>
               <p className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Chunks</p>
               <p className="text-sm font-semibold text-text-primary">176 Indexed</p>
             </div>
           </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Upload + Documents */}
        <div className="lg:col-span-3 space-y-8">
          {/* Upload Zone */}
          <motion.div variants={item}>
            <div
              onDragEnter={(e) => handleDrag(e, true)}
              onDragOver={(e) => handleDrag(e, true)}
              onDragLeave={(e) => handleDrag(e, false)}
              onDrop={handleDrop}
              className={cn(
                "relative rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300 overflow-hidden",
                isDragging
                  ? "border-brand-400 bg-brand-500/10 scale-[1.02] shadow-[0_0_30px_rgba(79,124,255,0.2)]"
                  : "border-border/60 hover:border-brand-500/50 bg-surface-0 hover:bg-surface-1/50"
              )}
            >
              {isDragging && (
                <div className="absolute inset-0 bg-gradient-to-b from-brand-500/5 to-transparent pointer-events-none" />
              )}
              <div className="flex flex-col items-center gap-4 relative z-10">
                <div
                  className={cn(
                    "flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 shadow-xl",
                    isDragging ? "bg-brand-500 text-white shadow-brand-500/30 scale-110" : "bg-surface-3 text-text-muted"
                  )}
                >
                  <Upload className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-base font-semibold text-text-primary">
                    Drag and drop files here, or{" "}
                    <button className="text-brand-400 hover:text-brand-300 underline underline-offset-4 decoration-brand-500/30 transition-colors">
                      browse computer
                    </button>
                  </p>
                  <p className="text-xs text-text-muted mt-2 font-mono">
                    Supported: PDF, TXT, MD, CSV, JSON (Max 50MB)
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Document List */}
          <motion.div variants={item}>
            <Card className="glass border-border/50">
              <CardHeader className="border-b border-border/50 bg-surface-1/50 py-4">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <FileText className="h-4 w-4 text-brand-400" />
                  Indexed Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  {sampleDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center gap-4 p-4 hover:bg-surface-1/50 transition-colors group"
                    >
                      <div
                        className={cn(
                          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border",
                          doc.status === "embedded"
                            ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                            : doc.status === "processing"
                            ? "bg-amber-500/5 border-amber-500/20 text-amber-400"
                            : "bg-red-500/5 border-red-500/20 text-red-400"
                        )}
                      >
                        {doc.status === "processing" ? (
                           <Cpu className="h-6 w-6 animate-pulse" />
                        ) : (
                           <File className="h-6 w-6" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-text-primary truncate">
                          {doc.title}
                        </h4>
                        <div className="flex items-center gap-3 text-[11px] text-text-muted mt-1 font-mono">
                          <span>{doc.filename}</span>
                          <span className="w-1 h-1 rounded-full bg-border" />
                          <span>{doc.size}</span>
                          {doc.chunks > 0 && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-border" />
                              <span className="text-brand-300">{doc.chunks} chunks</span>
                            </>
                          )}
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] uppercase font-bold tracking-wider",
                          doc.status === "embedded" && "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
                          doc.status === "processing" && "border-amber-500/30 text-amber-400 bg-amber-500/10",
                          doc.status === "failed" && "border-red-500/30 text-red-400 bg-red-500/10"
                        )}
                      >
                        {doc.status === "embedded" && (
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                        )}
                        {doc.status === "processing" && (
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        )}
                        {doc.status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-white hover:bg-red-500 transition-all rounded-lg ml-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right: Query Panel */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card className="glass sticky top-24 border-brand-500/20 shadow-[0_10px_40px_rgba(79,124,255,0.05)] overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 gradient-brand" />
            <CardHeader className="border-b border-border/50 bg-surface-1/50">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-brand-400" />
                Semantic Search Test
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
               <p className="text-xs text-text-muted leading-relaxed">
                 Test your vector index by running a semantic query. The RAG engine will retrieve the most relevant chunks.
               </p>
              
              <div className="space-y-3">
                <div className="relative">
                  <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g. What are the authentication methods for the API?"
                    rows={4}
                    className="w-full rounded-xl border border-border/50 bg-surface-0 px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 shadow-inner resize-none transition-all"
                  />
                  <Button
                    onClick={handleQuery}
                    disabled={!query.trim() || isQuerying}
                    size="icon"
                    className="absolute bottom-3 right-3 h-8 w-8 rounded-lg gradient-brand shadow-md border-0 hover:brightness-110 transition-all z-10"
                  >
                    {isQuerying ? (
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                    ) : (
                      <ArrowRight className="h-4 w-4 text-white" />
                    )}
                  </Button>
                </div>
              </div>

              {queryResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="rounded-xl border border-brand-500/30 bg-surface-1 p-5 shadow-inner"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-6 w-6 rounded-md bg-brand-500/20 flex items-center justify-center">
                      <Sparkles className="h-3.5 w-3.5 text-brand-400" />
                    </div>
                    <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
                      Synthesized Response
                    </span>
                  </div>
                  <div className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap [&_code]:bg-surface-3 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:font-mono [&_code]:text-brand-300">
                    {queryResult}
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
