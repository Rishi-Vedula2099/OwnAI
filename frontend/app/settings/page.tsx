"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  User,
  Key,
  Bell,
  Palette,
  Database,
  Shield,
  Globe,
  Save,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 },
};

export default function SettingsPage() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-4xl space-y-6"
    >
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
        <p className="text-sm text-text-secondary mt-1">
          Manage your account, preferences, and integrations
        </p>
      </motion.div>

      {/* Profile */}
      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4 text-brand-400" />
              Profile
            </CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">
                  Name
                </label>
                <Input defaultValue="Rishi Vedula" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">
                  Email
                </label>
                <Input defaultValue="rishi@ownai.dev" type="email" />
              </div>
            </div>
            <Button size="sm">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* API Keys */}
      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Key className="h-4 w-4 text-brand-400" />
              API Keys
            </CardTitle>
            <CardDescription>
              Configure your LLM provider API keys
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary flex items-center gap-2">
                OpenAI API Key
                <Badge variant="outline">Fallback</Badge>
              </label>
              <Input
                type="password"
                placeholder="sk-..."
                defaultValue=""
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary flex items-center gap-2">
                Groq API Key
                <Badge variant="outline">Optional</Badge>
              </label>
              <Input
                type="password"
                placeholder="gsk_..."
                defaultValue=""
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary flex items-center gap-2">
                Ollama URL
                <Badge variant="success">Primary</Badge>
              </label>
              <Input defaultValue="http://localhost:11434" />
            </div>
            <Button size="sm">
              <Save className="h-4 w-4" />
              Save Keys
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Appearance */}
      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Palette className="h-4 w-4 text-brand-400" />
              Appearance
            </CardTitle>
            <CardDescription>Customize the look and feel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-lg border-2 border-brand-500 bg-surface-2 px-4 py-3 cursor-pointer">
                <div className="h-4 w-4 rounded-full bg-gray-900" />
                <span className="text-sm font-medium text-text-primary">
                  Dark
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-1 px-4 py-3 cursor-pointer opacity-50">
                <div className="h-4 w-4 rounded-full bg-white border border-gray-300" />
                <span className="text-sm font-medium text-text-secondary">
                  Light
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-1 px-4 py-3 cursor-pointer opacity-50">
                <div className="h-4 w-4 rounded-full bg-gradient-to-r from-gray-900 to-white" />
                <span className="text-sm font-medium text-text-secondary">
                  System
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Data & Storage */}
      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Database className="h-4 w-4 text-brand-400" />
              Data & Storage
            </CardTitle>
            <CardDescription>
              Manage your data and storage settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-medium text-text-primary">
                  Vector Database
                </p>
                <p className="text-xs text-text-muted">
                  FAISS local index — 176 vectors
                </p>
              </div>
              <Badge variant="success">Active</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-medium text-text-primary">
                  Uploaded Documents
                </p>
                <p className="text-xs text-text-muted">
                  4 documents — 9.3 MB total
                </p>
              </div>
              <Button variant="destructive" size="sm">
                Clear All
              </Button>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-medium text-text-primary">
                  Chat History
                </p>
                <p className="text-xs text-text-muted">
                  248 conversations — 860 messages
                </p>
              </div>
              <Button variant="destructive" size="sm">
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Security */}
      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-brand-400" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">
                Change Password
              </label>
              <div className="grid grid-cols-2 gap-4">
                <Input type="password" placeholder="Current password" />
                <Input type="password" placeholder="New password" />
              </div>
            </div>
            <Button size="sm">
              <Key className="h-4 w-4" />
              Update Password
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Danger Zone */}
      <motion.div variants={item}>
        <Card className="border-error/20">
          <CardHeader>
            <CardTitle className="text-base text-error">
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-primary">
                  Delete Account
                </p>
                <p className="text-xs text-text-muted">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <Button variant="destructive" size="sm">
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
