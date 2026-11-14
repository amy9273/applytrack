"use client";

import React from "react";
import { Mail, Briefcase, Calendar, AlertCircle, Inbox } from "lucide-react";

interface MetricsCardsProps {
  totalEmails: number;
  totalApplications: number;
  upcomingActivitiesCount: number;
  needsReviewCount: number;
  accountsCount: number;
  onFilterNeedsReview: () => void;
  onViewApplications: () => void;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({
  totalEmails,
  totalApplications,
  upcomingActivitiesCount,
  needsReviewCount,
  accountsCount,
  onFilterNeedsReview,
  onViewApplications,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {/* 1. Total Recruitment Emails */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-xs font-medium">Recruitment Emails</span>
          <div className="rounded-lg bg-blue-50 p-1.5 text-blue-600">
            <Mail className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-900">{totalEmails}</span>
          <span className="text-[11px] text-slate-400 font-medium">identified</span>
        </div>
        <p className="mt-1 text-[11px] text-slate-500 truncate">Filtered across all inboxes</p>
      </div>

      {/* 2. Applications Tracked */}
      <div
        onClick={onViewApplications}
        className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm hover:border-blue-300 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-xs font-medium group-hover:text-blue-600 transition-colors">Applications Tracked</span>
          <div className="rounded-lg bg-indigo-50 p-1.5 text-indigo-600">
            <Briefcase className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-900">{totalApplications}</span>
          <span className="text-[11px] text-indigo-600 font-medium">clustered</span>
        </div>
        <p className="mt-1 text-[11px] text-slate-500 truncate">Auto-grouped by company & role</p>
      </div>

      {/* 3. Upcoming Activities */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-xs font-medium">Upcoming Events</span>
          <div className="rounded-lg bg-amber-50 p-1.5 text-amber-600">
            <Calendar className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-900">{upcomingActivitiesCount}</span>
          <span className="text-[11px] text-amber-600 font-medium">scheduled</span>
        </div>
        <p className="mt-1 text-[11px] text-slate-500 truncate">Interviews & test deadlines</p>
      </div>

      {/* 4. Attention Required */}
      <div
        onClick={onFilterNeedsReview}
        className={`rounded-xl border p-4 shadow-sm transition-all cursor-pointer ${
          needsReviewCount > 0
            ? "border-rose-200 bg-rose-50/40 hover:bg-rose-50/80"
            : "border-slate-200/80 bg-white hover:border-slate-300"
        }`}
      >
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-xs font-medium">Needs Attention</span>
          <div className={`rounded-lg p-1.5 ${needsReviewCount > 0 ? "bg-rose-100 text-rose-600" : "bg-slate-100 text-slate-500"}`}>
            <AlertCircle className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className={`text-2xl font-bold tracking-tight ${needsReviewCount > 0 ? "text-rose-700" : "text-slate-900"}`}>
            {needsReviewCount}
          </span>
          <span className="text-[11px] text-slate-500 font-medium">records</span>
        </div>
        <p className="mt-1 text-[11px] text-slate-500 truncate">Low confidence or pending MOA</p>
      </div>

      {/* 5. Inboxes Connected */}
      <div className="col-span-2 sm:col-span-1 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-xs font-medium">Connected Accounts</span>
          <div className="rounded-lg bg-emerald-50 p-1.5 text-emerald-600">
            <Inbox className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-900">{accountsCount}</span>
          <span className="text-[11px] text-emerald-600 font-medium">active</span>
        </div>
        <p className="mt-1 text-[11px] text-slate-500 truncate">Multi-account Gmail sync</p>
      </div>
    </div>
  );
};
