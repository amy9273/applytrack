"use client";

import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  Video,
  Clock,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Building,
  Check,
  X,
} from "lucide-react";
import { ApplicationItem } from "../dashboard/ApplicationsView";

interface CalendarViewProps {
  applications: ApplicationItem[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ applications }) => {
  const [viewMode, setViewMode] = useState<"agenda" | "month">("agenda");

  // Flatten and sort activities
  const activities = applications
    .flatMap((app) =>
      app.activities.map((act) => ({
        ...act,
        companyName: app.companyName,
        positionRole: app.positionRole,
      }))
    )
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-slate-900">Recruitment Calendar & Deadlines</h2>
          <p className="text-xs text-slate-500">
            All detected interviews, practical exams, and submission deadlines • Timezone: <strong>Asia/Manila</strong>
          </p>
        </div>

        <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200">
          <button
            onClick={() => setViewMode("agenda")}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
              viewMode === "agenda" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Chronological Agenda
          </button>
          <button
            onClick={() => setViewMode("month")}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
              viewMode === "month" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Schedule List
          </button>
        </div>
      </div>

      {/* Agenda Stream */}
      <div className="space-y-3">
        {activities.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <CalendarIcon className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-800">No scheduled activities yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              When recruitment emails with interview links or assessment deadlines are identified, they will appear here.
            </p>
          </div>
        ) : (
          activities.map((act) => {
            const isInterview = act.type === "INTERVIEW";
            return (
              <div
                key={act.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-300 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{act.companyName}</span>
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          isInterview
                            ? "bg-blue-100 text-blue-800 border border-blue-200"
                            : "bg-amber-100 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {act.type}
                      </span>
                      <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                        {act.status}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-800">{act.title}</h4>
                    <p className="text-xs text-slate-500 font-medium">{act.positionRole}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {act.meetingLink && (
                      <a
                        href={act.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-700 shadow-sm transition-colors"
                      >
                        <Video className="h-3.5 w-3.5" /> Launch Video Meeting
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-2 border-t border-slate-100 font-medium">
                  <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span>
                      {new Date(act.scheduledAt).toLocaleDateString("en-PH", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      (Asia/Manila)
                    </span>
                  </div>

                  {act.meetingLink && (
                    <div className="flex items-center gap-1 text-slate-500 truncate max-w-xs">
                      <span>Room:</span>
                      <code className="text-[11px] bg-slate-100 px-1 rounded truncate">
                        {act.meetingLink}
                      </code>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
