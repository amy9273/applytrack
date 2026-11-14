"use client";

import React from "react";
import {
  LayoutDashboard,
  Mail,
  Briefcase,
  Calendar,
  CheckSquare,
  Settings,
  Sparkles,
  Layers,
  Inbox,
  ShieldCheck,
} from "lucide-react";

export type NavSection =
  | "dashboard"
  | "emails"
  | "applications"
  | "calendar"
  | "tasks"
  | "settings";

interface SidebarProps {
  currentSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  accountsCount: number;
  totalEmailsCount: number;
  totalApplicationsCount: number;
  needsReviewCount: number;
  onOpenAccounts: () => void;
  isOwner?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onSelectSection,
  accountsCount,
  totalEmailsCount,
  totalApplicationsCount,
  needsReviewCount,
  onOpenAccounts,
  isOwner = false,
}) => {
  const navItems = [
    {
      id: "dashboard" as NavSection,
      label: "Dashboard",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: "emails" as NavSection,
      label: "Recruitment Emails",
      icon: Mail,
      badge: totalEmailsCount > 0 ? totalEmailsCount : null,
      badgeColor: "bg-blue-100 text-blue-700",
    },
    {
      id: "applications" as NavSection,
      label: "Applications",
      icon: Briefcase,
      badge: totalApplicationsCount > 0 ? totalApplicationsCount : null,
      badgeColor: "bg-emerald-100 text-emerald-700",
    },
    {
      id: "calendar" as NavSection,
      label: "Calendar & Deadlines",
      icon: Calendar,
      badge: null,
    },
    {
      id: "tasks" as NavSection,
      label: "Tasks & Action Items",
      icon: CheckSquare,
      badge: null,
    },
    {
      id: "settings" as NavSection,
      label: isOwner ? "Connected Accounts" : "System & Settings",
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-3 border-b border-slate-100 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/30">
          <Mail className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold tracking-tight text-slate-900 text-base">ApplyTrack</span>
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600 border border-blue-200/60">
              AI
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Internship Organizer</p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Workspace
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectSection(item.id)}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                isActive
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    isActive ? "bg-white/20 text-white" : item.badgeColor
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Connected Accounts Status Card (Visible only in Owner Mode) */}
      {isOwner && (
        <div className="p-3 border-t border-slate-100">
          <div
            onClick={onOpenAccounts}
            className="rounded-xl border border-slate-200/90 bg-slate-50/70 p-3 hover:bg-slate-100/80 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
                <Inbox className="h-3.5 w-3.5 text-blue-600" /> Inboxes Active
              </span>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
            </div>
            <div className="text-xs font-bold text-slate-900">
              {accountsCount} {accountsCount === 1 ? "Gmail Account" : "Gmail Accounts"}
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5 group-hover:text-blue-600 transition-colors">
              Click to manage or add accounts &rarr;
            </p>
          </div>
        </div>
      )}

      {/* User Profile Card */}
      <div className="border-t border-slate-100 p-4">
        {isOwner ? (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white text-xs font-bold shadow-sm">
              AB
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-bold text-slate-900">Angel Amaya Balion</div>
              <div className="truncate text-[11px] text-slate-400 font-medium">De La Salle Lipa • BS IT</div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold">
              👁️
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-bold text-slate-800">Visitor Mode</div>
              <div className="truncate text-[11px] text-slate-400 font-medium">Public Showcase View</div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
