"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Plus,
  Settings2,
  Terminal,
  Save,
  Play,
  Cpu,
  BrainCircuit,
  MessageSquare,
  Wrench,
  Wand2,
  Share2,
  ArrowRight
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const agentsList = [
  { id: 1, name: "Data Analyst", model: "llama3:8b", status: "active", icon: BrainCircuit },
  { id: 2, name: "Code Reviewer", model: "gpt-4o", status: "editing", icon: Terminal },
  { id: 3, name: "Customer Support", model: "claude-3-haiku", status: "idle", icon: MessageSquare },
];

const availableTools = [
  { id: "web_search", name: "Web Search", description: "Access live internet data" },
  { id: "code_interpreter", name: "Code Interpreter", description: "Run python locally" },
  { id: "read_pdf", name: "PDF Reader", description: "Extract text from PDFs" },
];

export default function AIWorkshopPage() {
  const [selectedTools, setSelectedTools] = useState<string[]>(['web_search']);
  
  const toggleTool = (id: string) => {
    setSelectedTools(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6 overflow-hidden">
      
      {/* LEFT COLUMN: AI List */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-1/4 flex flex-col gap-4 h-full"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-text-primary tracking-tight flex items-center gap-2">
            <Bot className="h-5 w-5 text-brand-400" />
            My Agents
          </h2>
          <Button size="icon-sm" className="gradient-brand text-white shadow-lg rounded-full h-8 w-8 hover:brightness-110">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {agentsList.map((agent, i) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                agent.status === 'editing' 
                  ? 'bg-surface-2 border-brand-500/50 shadow-[0_0_15px_rgba(79,124,255,0.1)]' 
                  : 'bg-surface-1 border-border/50 hover:bg-surface-2 hover:border-brand-500/30'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${agent.status === 'editing' ? 'bg-brand-500/20 text-brand-300' : 'bg-surface-3 text-text-muted'}`}>
                    <agent.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary">{agent.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-text-muted font-mono bg-surface-3 px-1.5 py-0.5 rounded">{agent.model}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CENTER COLUMN: Config Panel */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="w-1/2 flex flex-col h-full"
      >
        <Card className="glass flex-1 flex flex-col overflow-hidden border-brand-500/20">
          <CardHeader className="border-b border-border/50 bg-surface-1/50 px-6 py-4 flex flex-row items-center justify-between sticky top-0 z-10">
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Settings2 className="h-5 w-5 text-brand-400" />
                Configuration
              </CardTitle>
              <p className="text-xs text-text-muted mt-1">Fine-tune the behavior of 'Code Reviewer'</p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="h-8 text-xs bg-surface-2 border-border/50 hover:text-text-primary transition-colors">
                <Share2 className="h-3.5 w-3.5 mr-1" /> Publish
              </Button>
              <Button size="sm" className="h-8 text-xs gradient-brand shadow-lg border-0 hover:brightness-110">
                <Save className="h-3.5 w-3.5 mr-1" /> Save
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Model Selection */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider flex items-center gap-2">
                <Cpu className="h-3.5 w-3.5" /> Base Model
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['gpt-4o', 'claude-3-opus', 'llama-3-70b'].map(m => (
                  <div key={m} className={`p-3 rounded-lg border text-sm font-mono text-center cursor-pointer transition-all ${
                    m === 'gpt-4o' ? 'border-brand-400 bg-brand-500/10 text-brand-300 shadow-[0_0_10px_rgba(79,124,255,0.2)]' : 'border-border/50 bg-surface-2 text-text-muted hover:border-brand-500/30'
                  }`}>
                    {m}
                  </div>
                ))}
              </div>
            </div>

            {/* System Prompt */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider flex items-center gap-2">
                  <Terminal className="h-3.5 w-3.5" /> System Prompt
                </label>
                <Button variant="ghost" size="sm" className="h-6 text-[10px] text-brand-400 p-0 hover:bg-transparent">
                  <Wand2 className="h-3 w-3 mr-1" /> Auto-Optimize
                </Button>
              </div>
              <textarea 
                className="w-full h-40 bg-surface-1 border border-border/50 rounded-xl p-4 text-sm font-mono text-text-primary focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all resize-none shadow-inner"
                defaultValue={"You are an expert Code Reviewer.\n\nYour task is to review the user's code for potential bugs, inefficiencies, and security vulnerabilities.\n\nAlways enforce clean code principles."}
              />
            </div>

            {/* Hyperparameters */}
            <div className="space-y-3">
               <div className="flex justify-between">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Temperature (0.7)</label>
               </div>
               <div className="relative h-2 bg-surface-3 rounded-full overflow-hidden">
                 <div className="absolute top-0 left-0 h-full w-[70%] gradient-brand rounded-full" />
                 <div className="absolute top-1/2 left-[70%] -translate-y-1/2 -translate-x-1/2 h-4 w-4 bg-white rounded-full shadow border-2 border-brand-500 cursor-pointer" />
               </div>
               <div className="flex justify-between text-[10px] text-text-muted uppercase">
                 <span>Precise</span>
                 <span>Creative</span>
               </div>
            </div>

            {/* Tools */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider flex items-center gap-2">
                <Wrench className="h-3.5 w-3.5" /> Attached Tools
              </label>
              <div className="grid gap-2">
                {availableTools.map(tool => (
                  <div key={tool.id} onClick={() => toggleTool(tool.id)} className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedTools.includes(tool.id) ? 'bg-surface-2 border-brand-500/50' : 'bg-surface-1 border-border/30 opacity-60'
                  }`}>
                    <div>
                      <p className={`text-sm font-medium ${selectedTools.includes(tool.id) ? 'text-brand-300' : 'text-text-secondary'}`}>{tool.name}</p>
                      <p className="text-xs text-text-muted">{tool.description}</p>
                    </div>
                    <div className={`w-10 h-5 rounded-full p-0.5 transition-colors ${selectedTools.includes(tool.id) ? 'bg-brand-500' : 'bg-surface-3'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${selectedTools.includes(tool.id) ? 'translate-x-5' : 'translate-x-0'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </CardContent>
        </Card>
      </motion.div>

      {/* RIGHT COLUMN: Live Preview */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="w-1/4 flex flex-col h-full"
      >
        <Card className="glass flex-1 flex flex-col overflow-hidden">
          <CardHeader className="bg-surface-2/80 border-b border-border/50 px-4 py-3 shrink-0">
            <CardTitle className="text-sm font-semibold flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Play className="h-4 w-4 text-emerald-400" />
                Live Preview
              </span>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 text-[10px] border-emerald-500/20">Ready</Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 p-4 flex flex-col gap-4 overflow-hidden bg-surface-0/50">
            {/* Dummy Chat */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar flex flex-col">
              <div className="flex justify-center mt-2">
                <span className="text-[10px] text-text-muted bg-surface-2 px-2 py-1 rounded-full uppercase tracking-wider font-semibold">Session started</span>
              </div>
              <div className="flex items-start gap-2 max-w-[90%] mt-4">
                <div className="h-7 w-7 rounded-full bg-brand-500/20 flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-brand-400" />
                </div>
                <div className="bg-surface-2 border border-brand-500/10 p-3 rounded-xl rounded-tl-sm text-sm text-text-primary shadow-[0_0_10px_rgba(79,124,255,0.05)] text-left">
                  Hi, I'm ready to review your code. Paste it below!
                </div>
              </div>
            </div>

            {/* Input */}
            <div className="relative shrink-0 mt-auto">
              <Input 
                className="w-full bg-surface-1 border-border/50 pr-10 rounded-xl focus:border-brand-500 transition-all text-sm h-11"
                placeholder="Test the agent..."
              />
              <Button size="icon-sm" className="absolute right-1.5 top-1.5 bottom-1.5 h-8 w-8 text-text-muted hover:text-white bg-surface-2 hover:bg-brand-500 rounded-lg transition-all">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

    </div>
  );
}
