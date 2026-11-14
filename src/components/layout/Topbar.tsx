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

        {/* Sign in with Google */}
        <button
          onClick={onOpenGoogleLogin}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all"
          title="Sign in with your Google account to sync real recruitment emails"
        >
          <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12.24 10.285V13.8h6.887C18.2 16.14 15.645 17.8 12.24 17.8c-3.263 0-5.92-2.657-5.92-5.92s2.657-5.92 5.92-5.92c1.474 0 2.82.543 3.86 1.436l2.673-2.674C17.07 3.197 14.81 2.3 12.24 2.3 6.945 2.3 2.65 6.595 2.65 11.89s4.295 9.59 9.59 9.59c5.534 0 9.207-3.89 9.207-9.37 0-.63-.06-1.24-.173-1.825H12.24z" />
          </svg>
          <span className="hidden sm:inline">Sign In with Google</span>
          <span className="sm:hidden">Google</span>
        </button>

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
