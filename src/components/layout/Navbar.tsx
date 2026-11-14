"use client";

import React from "react";
import { Mail, RefreshCw, Layers, Sparkles, CheckCircle2 } from "lucide-react";

interface NavbarProps {
  activeTab: "overview" | "emails" | "applications";
  setActiveTab: (tab: "overview" | "emails" | "applications") => void;
  accountsCount: number;
  onOpenAccounts: () => void;
  onSyncAll: () => void;
  isSyncing: boolean;
  onSeedDemo: () => void;
  isSeeding: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  accountsCount,
  onOpenAccounts,
  onSyncAll,
  isSyncing,
  onSeedDemo,
  isSeeding,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 tracking-tight text-lg">ApplyTrack</span>
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 border border-blue-200/60">
                  AI MVP
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">Multi-Gmail Internship Organizer</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                activeTab === "overview"
                  ? "bg-slate-100 text-slate-900 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("emails")}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                activeTab === "emails"
                  ? "bg-slate-100 text-slate-900 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              Recruitment Emails
            </button>
            <button
              onClick={() => setActiveTab("applications")}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                activeTab === "applications"
                  ? "bg-slate-100 text-slate-900 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              My Applications
            </button>
          </nav>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Quick Demo Seed Button */}
          <button
            onClick={onSeedDemo}
            disabled={isSeeding || isSyncing}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-purple-200 bg-purple-50/70 px-3 py-1.5 text-xs font-medium text-purple-700 hover:bg-purple-100 transition-all disabled:opacity-50"
            title="Load 3 simulated student inboxes with Citco, StellarPH, GlobalTransco, Maya, Canva"
          >
            <Sparkles className="h-3.5 w-3.5 text-purple-600" />
            {isSeeding ? "Seeding Inboxes..." : "Load 3 Demo Inboxes"}
          </button>

          {/* Sync Button */}
          <button
            onClick={onSyncAll}
            disabled={isSyncing || accountsCount === 0}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-slate-500 ${isSyncing ? "animate-spin text-blue-600" : ""}`} />
            <span className="hidden sm:inline">{isSyncing ? "Scanning..." : "Sync Gmail"}</span>
          </button>

          {/* Connected Accounts Manager */}
          <button
            onClick={onOpenAccounts}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 transition-all shadow-sm"
          >
            <Layers className="h-3.5 w-3.5" />
            <span>
              {accountsCount} {accountsCount === 1 ? "Inbox" : "Inboxes"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
