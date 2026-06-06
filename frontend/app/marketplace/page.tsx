"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Bot,
  Download,
  Heart,
  Star,
  Filter,
  TrendingUp,
  Sparkles,
  Copy,
  ExternalLink,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const categories = [
  "All",
  "Development",
  "Writing",
  "Data",
  "Design",
  "DevOps",
  "Education",
];

const marketplaceAgents = [
  {
    id: "1",
    name: "Full-Stack Developer",
    creator: "OwnAI Team",
    model: "gpt-4o",
    description:
      "Expert full-stack developer specializing in React, Node.js, and PostgreSQL. Helps with architecture, debugging, and code reviews.",
    category: "Development",
    clones: 1240,
    likes: 892,
    rating: 4.9,
    featured: true,
  },
  {
    id: "2",
    name: "Technical Writer",
    creator: "docs_expert",
    model: "llama3:8b",
    description:
      "Creates clear, concise technical documentation. Supports API docs, README files, and user guides.",
    category: "Writing",
    clones: 856,
    likes: 623,
    rating: 4.7,
    featured: true,
  },
  {
    id: "3",
    name: "Data Scientist",
    creator: "ml_wizard",
    model: "gpt-4o",
    description:
      "Analyzes datasets, builds ML models, and creates visualizations. Python, pandas, scikit-learn expert.",
    category: "Data",
    clones: 678,
    likes: 445,
    rating: 4.8,
    featured: false,
  },
  {
    id: "4",
    name: "UI/UX Designer",
    creator: "pixel_perfect",
    model: "gpt-4o",
    description:
      "Creates stunning UI designs, wireframes, and design systems. Expert in Figma, Tailwind, and accessibility.",
    category: "Design",
    clones: 534,
    likes: 398,
    rating: 4.6,
    featured: false,
  },
  {
    id: "5",
    name: "DevOps Engineer",
    creator: "cloud_ninja",
    model: "llama3:70b",
    description:
      "Infrastructure as code, CI/CD pipelines, Docker, Kubernetes, and cloud architecture expert.",
    category: "DevOps",
    clones: 421,
    likes: 312,
    rating: 4.7,
    featured: false,
  },
  {
    id: "6",
    name: "Python Tutor",
    creator: "learn_code",
    model: "llama3:8b",
    description:
      "Patient Python tutor for beginners. Explains concepts with examples and exercises.",
    category: "Education",
    clones: 2100,
    likes: 1567,
    rating: 4.9,
    featured: true,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const cardAnim = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = marketplaceAgents.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || a.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={cardAnim}>
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand-900/50 via-brand-800/30 to-surface-0 border border-brand-500/10 p-8">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-brand-400" />
              <Badge variant="default">Community</Badge>
            </div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              AI Marketplace
            </h1>
            <p className="text-text-secondary max-w-lg">
              Discover, clone, and share AI agents built by the community. Like
              HuggingFace, but for custom agents.
            </p>
            <div className="flex items-center gap-6 mt-4 text-sm text-text-muted">
              <span className="flex items-center gap-1.5">
                <Bot className="h-4 w-4" />
                {marketplaceAgents.length} agents
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                2.4K creators
              </span>
              <span className="flex items-center gap-1.5">
                <Download className="h-4 w-4" />
                12.8K clones
              </span>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl" />
        </div>
      </motion.div>

      {/* Search + Filters */}
      <motion.div
        variants={cardAnim}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            placeholder="Search agents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "secondary"}
              size="sm"
              onClick={() => setActiveCategory(cat)}
              className="whitespace-nowrap"
            >
              {cat}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Featured Agents */}
      {activeCategory === "All" && (
        <motion.div variants={cardAnim}>
          <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-brand-400" />
            Featured Agents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filtered
              .filter((a) => a.featured)
              .map((agent) => (
                <Card
                  key={agent.id}
                  glow
                  className="group border-brand-500/10 hover:border-brand-500/30"
                >
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl gradient-brand">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-text-primary">
                          {agent.name}
                        </h3>
                        <span className="text-xs text-text-muted">
                          by {agent.creator}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-text-secondary line-clamp-2 mb-4">
                      {agent.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-text-muted">
                        <span className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          {agent.clones.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {agent.likes.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-amber-400" />
                          {agent.rating}
                        </span>
                      </div>
                      <Button variant="secondary" size="sm" className="text-xs">
                        <Copy className="h-3 w-3" />
                        Clone
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </motion.div>
      )}

      {/* All Agents Grid */}
      <motion.div variants={cardAnim}>
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          {activeCategory === "All" ? "All Agents" : activeCategory}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((agent) => (
            <Card
              key={agent.id}
              glow
              className="group hover:border-brand-500/20"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600/15">
                      <Bot className="h-5 w-5 text-brand-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-text-primary">
                        {agent.name}
                      </h3>
                      <span className="text-xs text-text-muted">
                        by {agent.creator}
                      </span>
                    </div>
                  </div>
                  <Badge variant="outline">{agent.category}</Badge>
                </div>
                <p className="text-xs text-text-secondary line-clamp-2 mb-3">
                  {agent.description}
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="info" className="text-[10px]">
                    {agent.model}
                  </Badge>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-3 text-xs text-text-muted">
                    <span className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      {agent.clones.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {agent.likes.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-amber-400" />
                      {agent.rating}
                    </span>
                  </div>
                  <Button variant="secondary" size="sm" className="text-xs">
                    <Copy className="h-3 w-3" />
                    Clone
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
