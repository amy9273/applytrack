"use client";

import React, { useState } from "react";
import {
  Briefcase,
  Building,
  Calendar,
  Clock,
  Video,
  CheckCircle2,
  Mail,
  ChevronDown,
  ChevronUp,
  Plus,
  ArrowRight,
  FileText,
  User,
} from "lucide-react";
import { ApplicationItem } from "../dashboard/ApplicationsView";

interface ApplicationsListViewProps {
  applications: ApplicationItem[];
  onStatusChange: (id: string, newStatus: string) => Promise<void>;
  onOpenNewApplicationModal: () => void;
  isLoading: boolean;
}

export const ApplicationsListView: React.FC<ApplicationsListViewProps> = ({
  applications,
  onStatusChange,
  onOpenNewApplicationModal,
  isLoading,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [stageFilter, setStageFilter] = useState<string>("ALL");

  const STAGES = [
    "ALL",
    "APPLIED",
    "UNDER_REVIEW",
    "ASSESSMENT",
    "INTERVIEW",
    "OJT_PROCESSING",
    "OFFERED",
    "REJECTED",
  ];

  const getStageBadge = (status: string) => {
    switch (status) {
      case "OFFERED":
        return <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-200">Offered / Accepted</span>;
      case "INTERVIEW":
        return <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800 border border-blue-200">Interview Stage</span>;
      case "ASSESSMENT":
        return <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800 border border-amber-200">Technical Assessment</span>;
      case "OJT_PROCESSING":
        return <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-bold text-purple-800 border border-purple-200">OJT / MOA Processing</span>;
      case "REJECTED":
        return <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-800 border border-rose-200">Not Moving Forward</span>;
      default:
        return <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-800 border border-slate-200">Applied</span>;
    }
  };

  const filteredApps = applications.filter((app) => {
    if (stageFilter !== "ALL" && app.currentStatus !== stageFilter) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header bar with Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-slate-900">Internship Application Pipelines</h2>
          <p className="text-xs text-slate-500">
            Automatically created and grouped from your recruitment emails.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Stage filter */}
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:outline-none"
          >
            <option value="ALL">All Stages ({applications.length})</option>
            <option value="APPLIED">Applied</option>
            <option value="ASSESSMENT">Assessment</option>
            <option value="INTERVIEW">Interview</option>
            <option value="OJT_PROCESSING">OJT / MOA</option>
            <option value="OFFERED">Offered</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <button
            onClick={onOpenNewApplicationModal}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-700 shadow-sm transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Application Manually
          </button>
        </div>
      </div>

      {/* Applications Cards */}
      <div className="space-y-3">
        {filteredApps.map((app) => {
          const isExpanded = expandedId === app.id;
          return (
            <div
              key={app.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300 transition-all space-y-3"
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-base font-extrabold text-slate-900">{app.companyName}</span>
                    {getStageBadge(app.currentStatus)}
                  </div>
                  <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500 font-medium">
                    <span className="text-slate-800 font-semibold">{app.positionRole}</span>
                    <span>•</span>
                    <span>
                      Applied: {new Date(app.appliedDate).toLocaleDateString("en-PH", { month: "short", day: "numeric" })}
                    </span>
                    <span>•</span>
                    <span className="text-blue-700 font-semibold">
                      {(app.emails?.length ?? app._count?.emails ?? 0)} {(app.emails?.length ?? app._count?.emails ?? 0) === 1 ? "email communication" : "email communications"}
                    </span>
                  </div>
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">Stage:</span>
                  <select
                    value={app.currentStatus}
                    onChange={(e) => onStatusChange(app.id, e.target.value)}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none shadow-sm"
                  >
                    <option value="APPLIED">Applied</option>
                    <option value="UNDER_REVIEW">Under Review</option>
                    <option value="ASSESSMENT">Technical Assessment</option>
                    <option value="INTERVIEW">Interview Round</option>
                    <option value="OJT_PROCESSING">OJT / MOA Processing</option>
                    <option value="OFFERED">Offered / Accepted</option>
                    <option value="REJECTED">Rejected</option>
                  </select>

                  <button
                    onClick={() => setExpandedId(isExpanded ? null : app.id)}
                    className="rounded-xl border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100 transition-colors"
                    title={isExpanded ? "Collapse Timeline" : "Expand Recruitment Timeline"}
                  >
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Scheduled Activities Preview */}
              {(app.activities && app.activities.length > 0) && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                  {app.activities.map((act) => (
                    <div
                      key={act.id}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50/80 border border-blue-200 px-3 py-1 text-xs text-blue-900 font-medium"
                    >
                      {act.type === "INTERVIEW" ? (
                        <Video className="h-3.5 w-3.5 text-blue-600" />
                      ) : (
                        <Clock className="h-3.5 w-3.5 text-amber-600" />
                      )}
                      <strong>{act.title}:</strong>
                      <span>
                        {new Date(act.scheduledAt).toLocaleDateString("en-PH", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {act.meetingLink && (
                        <a
                          href={act.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="ml-1 text-[11px] underline font-bold text-blue-700 hover:text-blue-900"
                        >
                          Join Call
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Expanded Section: Chronological Timeline & Email Thread History */}
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Recruitment Timeline & Linked Emails
                    </span>
                    <span className="text-[11px] text-slate-400">Chronological Order</span>
                  </div>

                  {(app.emails && app.emails.length > 0) ? (
                    <div className="relative border-l-2 border-blue-200 ml-3 pl-4 space-y-3">
                      {app.emails.map((email, idx) => (
                        <div key={email.id} className="relative space-y-0.5">
                          <span className="absolute -left-[23px] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-blue-600 shadow-sm" />
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">{email.category}</span>
                            <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] text-slate-500 font-medium">
                              {email.account?.email || "Connected Inbox"}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {new Date(email.dateReceived).toLocaleDateString("en-PH", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 font-medium">{email.subject}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic pl-3">No email communications linked yet.</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
