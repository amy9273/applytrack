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
  FileText,
} from "lucide-react";

export interface ApplicationItem {
  id: string;
  companyName: string;
  positionRole: string;
  currentStatus: string;
  appliedDate: string;
  lastActivityAt: string;
  notes: string | null;
  emails?: {
    id: string;
    subject: string;
    category: string | null;
    dateReceived: string;
    extractedStatus: string | null;
    account: {
      email: string;
      name: string | null;
    };
  }[];
  _count?: {
    emails?: number;
    activities?: number;
  };
  activities?: {
    id: string;
    type: string;
    title: string;
    scheduledAt: string;
    meetingLink: string | null;
    status: string;
  }[];
}

interface ApplicationsViewProps {
  applications: ApplicationItem[];
  onStatusChange: (id: string, newStatus: string) => Promise<void>;
  isLoading: boolean;
}

export const ApplicationsView: React.FC<ApplicationsViewProps> = ({
  applications,
  onStatusChange,
  isLoading,
}) => {
  const [expandedAppId, setExpandedAppId] = useState<string | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OFFERED":
        return <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-200">Offered / Accepted</span>;
      case "INTERVIEW":
        return <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 border border-blue-200">Interviewing</span>;
      case "ASSESSMENT":
        return <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800 border border-amber-200">Assessment / Exam</span>;
      case "OJT_PROCESSING":
        return <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-800 border border-purple-200">OJT / MOA Processing</span>;
      case "REJECTED":
        return <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-800 border border-rose-200">Not Moving Forward</span>;
      default:
        return <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-800 border border-slate-200">Applied</span>;
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedAppId((curr) => (curr === id ? null : id));
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mb-3" />
        <p className="text-sm font-medium text-slate-600">Loading clustered applications...</p>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
        <Briefcase className="h-10 w-10 text-slate-300 mx-auto mb-3" />
        <h4 className="text-sm font-semibold text-slate-700">No applications tracked yet</h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
          Applications are automatically clustered when recruitment emails are identified and processed.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-base font-bold text-slate-900">Internship Application Pipeline</h2>
          <p className="text-xs text-slate-500">
            Automatically grouped across all connected Gmail accounts without manual entry.
          </p>
        </div>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-200">
          {applications.length} Active {applications.length === 1 ? "Application" : "Applications"}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {applications.map((app) => {
          const isExpanded = expandedAppId === app.id;
          return (
            <div
              key={app.id}
              className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm hover:border-slate-300 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-slate-900">{app.companyName}</span>
                    {getStatusBadge(app.currentStatus)}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="font-medium text-slate-700 flex items-center gap-1">
                      <Briefcase className="h-3.5 w-3.5 text-slate-400" /> {app.positionRole}
                    </span>
                    <span>•</span>
                    <span>
                      Applied: {new Date(app.appliedDate).toLocaleDateString("en-PH", { month: "short", day: "numeric" })}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-blue-600 font-medium">
                      <Mail className="h-3.5 w-3.5" /> {(app.emails?.length ?? app._count?.emails ?? 0)} {(app.emails?.length ?? app._count?.emails ?? 0) === 1 ? "email" : "emails"}
                    </span>
                  </div>
                </div>

                {/* Right controls: Change status & Expand */}
                <div className="flex items-center gap-2">
                  <select
                    value={app.currentStatus}
                    onChange={(e) => onStatusChange(app.id, e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 focus:border-blue-500 focus:outline-none shadow-sm"
                  >
                    <option value="APPLIED">Applied</option>
                    <option value="UNDER_REVIEW">Under Review</option>
                    <option value="ASSESSMENT">Assessment</option>
                    <option value="INTERVIEW">Interview</option>
                    <option value="OJT_PROCESSING">OJT / MOA</option>
                    <option value="OFFERED">Offered</option>
                    <option value="REJECTED">Rejected</option>
                  </select>

                  <button
                    onClick={() => toggleExpand(app.id)}
                    className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Activities Preview Bar */}
              {(app.activities && app.activities.length > 0) && (
                <div className="mt-3 flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                  {app.activities.map((act) => (
                    <div
                      key={act.id}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50/70 border border-blue-200/70 px-2.5 py-1 text-xs text-blue-800"
                    >
                      {act.type === "INTERVIEW" ? (
                        <Video className="h-3.5 w-3.5 text-blue-600" />
                      ) : (
                        <Clock className="h-3.5 w-3.5 text-amber-600" />
                      )}
                      <span className="font-semibold">{act.title}:</span>
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
                          className="ml-1 text-[11px] underline text-blue-700 hover:text-blue-900"
                        >
                          Meeting Link
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Expanded Email History Thread */}
              {isExpanded && (
                <div className="mt-4 pt-3 border-t border-slate-200 space-y-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                    Linked Email Communications ({(app.emails?.length ?? app._count?.emails ?? 0)})
                  </span>
                  {(app.emails && app.emails.length > 0) ? (
                    <div className="space-y-1.5">
                      {app.emails.map((e) => (
                        <div
                          key={e.id}
                          className="flex items-center justify-between rounded-lg bg-slate-50 p-2.5 text-xs text-slate-700 border border-slate-150"
                        >
                          <div className="flex items-center gap-2">
                            <span className="rounded bg-white px-1.5 py-0.5 text-[10px] font-medium border border-slate-200 text-slate-500">
                              {e.account?.email || "Connected Inbox"}
                            </span>
                            <span className="font-semibold text-slate-900">{e.category || "Email"}:</span>
                            <span className="text-slate-600 truncate max-w-md">{e.subject}</span>
                          </div>
                          <span className="text-[11px] text-slate-400">
                            {new Date(e.dateReceived).toLocaleDateString("en-PH", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No emails linked yet.</p>
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
