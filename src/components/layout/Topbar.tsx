"use client";

import React from "react";
import { Search, RefreshCw, Menu, Eye, Crown, KeyRound, LogOut } from "lucide-react";
import { NavSection } from "./Sidebar";

interface TopbarProps {
  currentSection: NavSection;
  onOpenMobileMenu: () => void;
  globalSearch: string;
  setGlobalSearch: (q: string) => void;
  onSyncAll: () => void;
  isSyncing: boolean;
  accountsCount: number;
  onOpenAccounts: () => void;
  onOpenGoogleLogin: () => void;
  isOwner: boolean;
  onOpenOwnerLogin: () => void;
  onLogoutOwner: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  currentSection,
  onOpenMobileMenu,
  globalSearch,
  setGlobalSearch,
  onSyncAll,
  isSyncing,
  accountsCount,
  onOpenAccounts,
  onOpenGoogleLogin,
  isOwner,
  onOpenOwnerLogin,
  onLogoutOwner,
}) => {
  const getSectionTitle = (section: NavSection) => {
    switch (section) {
      case "dashboard":
        return "Dashboard";
      case "emails":
        return "Recruitment Emails";
      case "applications":
        return "Applications";
      case "calendar":
        return "Calendar";
      case "tasks":
        return "Tasks & MOA";
      case "settings":
        return "Settings";
    }
  };

  return (
    <header className="sticky top-0 z-20 flex h-14 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md sm:px-6">
      {/* Left: Mobile Menu & Clean Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <h1 className="text-base font-bold tracking-tight text-slate-900">
          {getSectionTitle(currentSection)}
        </h1>
      </div>

      {/* Center: Clean Search Bar */}
      <div className="relative hidden md:block w-64 lg:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search company, role, keywords..."
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-12 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
        />
        <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
          ⌘K
        </kbd>
      </div>

      {/* Right Actions: Mode Badge & Clean Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Mode Indicator: Visitor vs Owner */}
        {isOwner ? (
          <div className="flex items-center gap-1.5">
            <span
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-bold text-emerald-800"
              title="You are in live owner mode with access to your real Gmail inboxes."
            >
              <Crown className="h-3.5 w-3.5 text-emerald-600" />
              <span>Owner Mode</span>
            </span>
            <button
              onClick={onLogoutOwner}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600 transition-all shadow-sm"
              title="Switch back to visitor demo view to see what recruiters and guests see"
            >
              <Eye className="h-3 w-3 text-slate-400" />
              <span className="hidden sm:inline">Visitor View</span>
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenOwnerLogin}
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 text-xs font-bold text-amber-900 transition-all shadow-sm"
            title="Viewing sanitized dummy showcase data. Click to unlock Owner Mode."
          >
            <Eye className="h-3.5 w-3.5 text-amber-600" />
            <span>Visitor Demo</span>
            <span className="hidden sm:inline font-normal text-amber-700 text-[11px]">
              • Unlock
            </span>
          </button>
        )}

        {/* Sync Button */}
        <button
          onClick={onSyncAll}
          disabled={isSyncing}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-all shadow-sm disabled:opacity-40"
          title="Scan and synchronize recruitment emails"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 text-slate-500 ${
              isSyncing ? "animate-spin text-blue-600" : ""
            }`}
          />
          <span className="hidden sm:inline">{isSyncing ? "Scanning..." : "Sync"}</span>
        </button>

        {/* Inboxes Indicator */}
        <button
          onClick={onOpenAccounts}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition-all"
          title="Manage connected inboxes"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>
            {accountsCount} {accountsCount === 1 ? "Inbox" : "Inboxes"}
          </span>
        </button>
      </div>
    </header>
  );
};
