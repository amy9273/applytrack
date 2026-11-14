"use client";

import React from "react";
import {
  Search,
  RefreshCw,
  Sparkles,
  Clock,
  Menu,
  ShieldCheck,
  Bell,
  Inbox,
} from "lucide-react";
import { NavSection } from "./Sidebar";

interface TopbarProps {
  currentSection: NavSection;
  onOpenMobileMenu: () => void;
  globalSearch: string;
  setGlobalSearch: (q: string) => void;
  scanDays: number | "ALL";
  setScanDays: (days: number | "ALL") => void;
  onSyncAll: () => void;
  isSyncing: boolean;
  onSeedDemo: () => void;
  isSeeding: boolean;
  accountsCount: number;
  onOpenAccounts: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  currentSection,
  onOpenMobileMenu,
  globalSearch,
  setGlobalSearch,
  scanDays,
  setScanDays,
  onSyncAll,
  isSyncing,
  onSeedDemo,
  isSeeding,
  accountsCount,
  onOpenAccounts,
}) => {
  const getSectionTitle = (section: NavSection) => {
    switch (section) {
      case "dashboard":
        return { title: "Overview Dashboard", desc: "Internship applications, schedules, and active alerts" };
      case "emails":
        return { title: "Recruitment Email Inbox", desc: "Consolidated recruitment messages from all connected Gmail accounts" };
      case "applications":
        return { title: "Applications Pipeline", desc: "Track every company application, interview stage, and MOA status" };
      case "calendar":
        return { title: "Recruitment Calendar", desc: "Upcoming technical exams, interview calls, and deadlines (Asia/Manila)" };
      case "tasks":
        return { title: "Tasks & School Requirements", desc: "Pending action items, MOA documents, and recruiter follow-ups" };
      case "settings":
        return { title: "Connected Accounts & Settings", desc: "Manage multi-account Gmail connections and sync frequency" };
    }
  };

  const info = getSectionTitle(currentSection);

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-200/90 bg-white/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
            {info.title}
          </h1>
          <p className="text-[11px] text-slate-500 hidden sm:block">{info.desc}</p>
        </div>
      </div>

      {/* Center & Right: Search, Scan Range, Sync & Quick Seed */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Global Search */}
        <div className="relative hidden md:block w-48 lg:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search company, role..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>

        {/* Scan Window Selector */}
        <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-0.5 text-xs">
          <span className="hidden xl:flex items-center gap-1 px-2 text-[10px] font-semibold text-slate-400">
            <Clock className="h-3 w-3" /> Scan:
          </span>
          <button
            onClick={() => setScanDays(15)}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
              scanDays === 15 ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
            title="Scan recruitment emails from the last 15 days"
          >
            15d
          </button>
          <button
            onClick={() => setScanDays(30)}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
              scanDays === 30 ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
            title="Scan recruitment emails from the last 30 days"
          >
            30d
          </button>
          <button
            onClick={() => setScanDays("ALL")}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
              scanDays === "ALL" ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
            title="Scan all historical recruitment emails"
          >
            All
          </button>
        </div>

        {/* Instant Demo Seed Button */}
        <button
          onClick={onSeedDemo}
          disabled={isSeeding || isSyncing}
          className="inline-flex items-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50/80 px-3 py-1.5 text-xs font-semibold text-purple-700 hover:bg-purple-100 transition-all disabled:opacity-50 shadow-sm"
          title="Instant 1-click test fixture with Angel Balion's 3 inboxes (Citco, StellarPH, GlobalTransco, Maya, Canva)"
        >
          <Sparkles className="h-3.5 w-3.5 text-purple-600" />
          <span className="hidden sm:inline">{isSeeding ? "Syncing..." : "Load Angel's Inboxes"}</span>
          <span className="sm:hidden">{isSeeding ? "..." : "Demo"}</span>
        </button>

        {/* Sync Button */}
        <button
          onClick={onSyncAll}
          disabled={isSyncing || accountsCount === 0}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 text-slate-500 ${isSyncing ? "animate-spin text-blue-600" : ""}`} />
          <span className="hidden lg:inline">{isSyncing ? "Scanning..." : "Sync Gmail"}</span>
        </button>

        {/* Accounts trigger */}
        <button
          onClick={onOpenAccounts}
          className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 transition-all shadow-sm"
          title="Manage connected Gmail inboxes"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="hidden sm:inline">{accountsCount} Inboxes</span>
        </button>
      </div>
    </header>
  );
};
