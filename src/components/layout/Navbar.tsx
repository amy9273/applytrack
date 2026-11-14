"use client";

import React from "react";
import { Mail, RefreshCw, Layers, Sparkles, Clock, CheckCircle2 } from "lucide-react";

interface NavbarProps {
  activeTab: "overview" | "emails" | "applications";
  setActiveTab: (tab: "overview" | "emails" | "applications") => void;
  accountsCount: number;
  onOpenAccounts: () => void;
  onSyncAll: () => void;
  isSyncing: boolean;
  onSeedDemo: () => void;
  isSeeding: boolean;
  scanDays: number | "ALL";
  setScanDays: (days: number | "ALL") => void;
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
  scanDays,
  setScanDays,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 bg-white/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand & Tabs */}
        <div className="flex items-center gap-6 sm:gap-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/25">
              <Mail className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 tracking-tight text-base sm:text-lg">
                  ApplyTrack
                </span>
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 border border-blue-200/60">
                  v1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                AI Internship Organizer • Angel Amaya Balion
              </p>
            </div>
          </div>

          {/* Segmented Navigation */}
          <nav className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200/80">
            <button
              onClick={() => setActiveTab("overview")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeTab === "overview" || activeTab === "emails"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Inboxes & Emails
            </button>
            <button
              onClick={() => setActiveTab("applications")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeTab === "applications"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Pipeline Tracker
            </button>
          </nav>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Scan Range Selector (15d / 30d / All) */}
          <div className="hidden md:flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs">
            <span className="px-2 text-[11px] font-medium text-slate-400 flex items-center gap-1">
              <Clock className="h-3 w-3" /> Scan:
            </span>
            <button
              onClick={() => setScanDays(15)}
              className={`rounded px-2 py-1 text-[11px] font-medium transition-all ${
                scanDays === 15 ? "bg-white text-blue-700 shadow-sm font-semibold" : "text-slate-600 hover:text-slate-900"
              }`}
              title="Scan emails from the last 15 days"
            >
              15d
            </button>
            <button
              onClick={() => setScanDays(30)}
              className={`rounded px-2 py-1 text-[11px] font-medium transition-all ${
                scanDays === 30 ? "bg-white text-blue-700 shadow-sm font-semibold" : "text-slate-600 hover:text-slate-900"
              }`}
              title="Scan emails from the last 30 days"
            >
              30d
            </button>
            <button
              onClick={() => setScanDays("ALL")}
              className={`rounded px-2 py-1 text-[11px] font-medium transition-all ${
                scanDays === "ALL" ? "bg-white text-blue-700 shadow-sm font-semibold" : "text-slate-600 hover:text-slate-900"
              }`}
              title="Scan all historical recruitment emails"
            >
              All
            </button>
          </div>

          {/* Quick Demo Seed Button */}
          <button
            onClick={onSeedDemo}
            disabled={isSeeding || isSyncing}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-purple-200 bg-purple-50/70 px-3 py-1.5 text-xs font-semibold text-purple-700 hover:bg-purple-100 transition-all disabled:opacity-50"
            title="Load Angel Balion's 3 inboxes (Citco, StellarPH, GlobalTransco, Maya, Canva)"
          >
            <Sparkles className="h-3.5 w-3.5 text-purple-600" />
            {isSeeding ? "Syncing..." : "Load Angel's Inboxes"}
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

          {/* Connected Accounts Pill */}
          <button
            onClick={onOpenAccounts}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 transition-all shadow-sm"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              {accountsCount} {accountsCount === 1 ? "Inbox" : "Inboxes"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
