"use client";

import React from "react";
import {
  Briefcase,
  Calendar,
  AlertCircle,
  Video,
  Clock,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Inbox,
  Sparkles,
  FileText,
  UserCheck,
} from "lucide-react";
import { EmailItem } from "./EmailStream";
import { ApplicationItem } from "./ApplicationsView";

interface DashboardOverviewProps {
  emails: EmailItem[];
  applications: ApplicationItem[];
  onSelectEmail: (email: EmailItem) => void;
  onNavigateToEmails: () => void;
  onNavigateToApplications: () => void;
  onNavigateToCalendar: () => void;
  onNavigateToTasks: () => void;
  onSync: () => void;
  isSyncing: boolean;
  isOwner?: boolean;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  emails,
  applications,
  onSelectEmail,
  onNavigateToEmails,
  onNavigateToApplications,
  onNavigateToCalendar,
  onNavigateToTasks,
  onSync,
  isSyncing,
  isOwner = false,
}) => {
  // Derive counts
  const totalApps = applications.length;
  const inProgressApps = applications.filter(
    (a) => a.currentStatus !== "OFFERED" && a.currentStatus !== "REJECTED" && a.currentStatus !== "WITHDRAWN"
  ).length;

  const upcomingInterviewsCount = applications.reduce((count, app) => {
    return (
      count +
      app.activities.filter(
        (act) => act.type === "INTERVIEW" && act.status === "SCHEDULED"
      ).length
    );
  }, 0);

  const needsAttentionEmails = emails.filter(
    (e) => e.needsReview || e.category === "OJT / MOA Requirements" || e.deadlineDate
  );

  // Recent 5 updates
  const recentEmails = emails.slice(0, 5);

  // Flatten upcoming activities
  const allActivities = applications
    .flatMap((app) =>
      app.activities.map((act) => ({
        ...act,
        companyName: app.companyName,
        positionRole: app.positionRole,
      }))
    )
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

  return (
    <div className="space-y-6">
      {/* 1. Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200/90 bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300 border border-blue-400/20">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            <span>{isOwner ? "Owner Workspace • Asia/Manila" : "Visitor Mode • Sample Data"}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            {isOwner ? "Good day, Angel Amaya" : "Visitor Mode"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            {isOwner ? (
              <>
                You have <strong className="text-white font-semibold">{totalApps} active applications</strong> organized across your connected inboxes.
                {upcomingInterviewsCount > 0
                  ? " Upcoming interview and assessment activities detected."
                  : " All your emails are up to date."}
              </>
            ) : (
              <>
                Displaying <strong className="text-white font-semibold">{totalApps} sample applications</strong> automatically categorized by AI across multi-channel recruitment inboxes.
              </>
            )}
          </p>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Inboxes Synced</span>
          </div>
          <button
            onClick={onSync}
            disabled={isSyncing}
            className="rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-3.5 py-1.5 text-xs font-semibold text-white transition-all disabled:opacity-50"
          >
            {isSyncing ? "Scanning inboxes..." : "Sync Emails Now"}
          </button>
        </div>
      </div>

      {/* 2. Four Main Summary Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Total Applications */}
        <div
          onClick={onNavigateToApplications}
          className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Applications
            </span>
            <div className="rounded-xl bg-slate-100 p-2 text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
              <Briefcase className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900 tabular-nums">
              {totalApps}
            </span>
            <span className="text-xs font-semibold text-slate-400">companies</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Clustered from recruitment emails</p>
        </div>

        {/* In Progress */}
        <div
          onClick={onNavigateToApplications}
          className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              In Progress
            </span>
            <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-blue-700 tabular-nums">
              {inProgressApps}
            </span>
            <span className="text-xs font-semibold text-blue-600">active</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Currently in hiring evaluation</p>
        </div>

        {/* Interviews */}
        <div
          onClick={onNavigateToCalendar}
          className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-amber-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Interviews
            </span>
            <div className="rounded-xl bg-amber-50 p-2 text-amber-600">
              <Video className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-amber-700 tabular-nums">
              {upcomingInterviewsCount}
            </span>
            <span className="text-xs font-semibold text-amber-600">scheduled</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Google Meet & Zoom calls</p>
        </div>

        {/* Action Required */}
        <div
          onClick={onNavigateToTasks}
          className="group rounded-2xl border border-rose-200/90 bg-rose-50/30 p-5 shadow-sm hover:bg-rose-50/70 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-800">
              Action Required
            </span>
            <div className="rounded-xl bg-rose-100 p-2 text-rose-700">
              <AlertCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-rose-700 tabular-nums">
              {needsAttentionEmails.length}
            </span>
            <span className="text-xs font-semibold text-rose-600">pending</span>
          </div>
          <p className="mt-1 text-xs text-rose-700">MOA documents & test deadlines</p>
        </div>
      </div>

      {/* 3. Two-Column Middle Grid: Upcoming Activities & Needs Attention */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Upcoming Activities (Interviews & Assessments) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Upcoming Schedules & Calls</h3>
            </div>
            <button
              onClick={onNavigateToCalendar}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Full Calendar <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="space-y-3">
            {allActivities.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No upcoming activities scheduled.</p>
            ) : (
              allActivities.map((act) => (
                <div
                  key={act.id}
                  className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-3.5 hover:bg-white hover:border-blue-300 transition-all space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{act.companyName}</span>
                        <span className="rounded-md bg-blue-100 px-1.5 py-0.2 text-[10px] font-semibold text-blue-800">
                          {act.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium mt-0.5">{act.title}</p>
                    </div>

                    {act.meetingLink && (
                      <a
                        href={act.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-blue-700 shadow-sm transition-colors shrink-0"
                      >
                        <Video className="h-3 w-3" /> Join Call
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-slate-400" />
                      {new Date(act.scheduledAt).toLocaleDateString("en-PH", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      (Asia/Manila)
                    </span>
                    <span>•</span>
                    <span className="text-emerald-700 font-semibold">{act.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Needs Attention & Action Items */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-rose-600" />
              <h3 className="text-sm font-bold text-slate-900">Needs Attention</h3>
            </div>
            <button
              onClick={onNavigateToTasks}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
            >
              View Tasks <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="space-y-3">
            {needsAttentionEmails.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">All set! No pending tasks need attention.</p>
            ) : (
              needsAttentionEmails.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectEmail(item)}
                  className="rounded-xl border border-rose-200/70 bg-rose-50/20 p-3.5 hover:bg-rose-50/60 transition-all cursor-pointer space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{item.companyName}</span>
                    <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200">
                      {item.category === "OJT / MOA Requirements" ? "Document Request" : "Action Item"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 font-medium line-clamp-1">{item.subject}</p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span className="text-blue-700 font-medium">
                      {item.nextSteps || "Click to inspect details & requirements"}
                    </span>
                    <span className="text-slate-400">
                      {new Date(item.dateReceived).toLocaleDateString("en-PH", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 4. Recent Recruitment Updates Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Recruitment Updates</h3>
            <p className="text-xs text-slate-500">Most recently detected communications across your Gmail accounts</p>
          </div>
          <button
            onClick={onNavigateToEmails}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            All Recruitment Emails ({emails.length}) <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Company</th>
                <th className="py-2.5 px-3">Position</th>
                <th className="py-2.5 px-3">Recruitment Update</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Inbox</th>
                <th className="py-2.5 px-3 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {recentEmails.map((email) => (
                <tr
                  key={email.id}
                  onClick={() => onSelectEmail(email)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-3 font-bold text-slate-900 group-hover:text-blue-600">
                    {email.companyName || "Unknown"}
                  </td>
                  <td className="py-3 px-3 text-slate-600">{email.positionRole || "Internship"}</td>
                  <td className="py-3 px-3 text-slate-800 max-w-xs truncate">{email.subject}</td>
                  <td className="py-3 px-3">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                      {email.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500 truncate max-w-[140px]">
                    {email.account.email}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-400 whitespace-nowrap">
                    {new Date(email.dateReceived).toLocaleDateString("en-PH", {
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
