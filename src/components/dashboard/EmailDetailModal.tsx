"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Sparkles,
  Mail,
  Video,
  Calendar,
  Clock,
  User,
  ExternalLink,
  CheckCircle,
  Save,
  AlertCircle,
  Building,
  Briefcase,
} from "lucide-react";
import { EmailItem } from "./EmailStream";

interface EmailDetailModalProps {
  email: EmailItem | null;
  onClose: () => void;
  onEmailUpdated: (updatedEmail: EmailItem) => void;
}

export const EmailDetailModal: React.FC<EmailDetailModalProps> = ({
  email,
  onClose,
  onEmailUpdated,
}) => {
  const [activeView, setActiveView] = useState<"both" | "extracted" | "raw">("both");
  const [companyName, setCompanyName] = useState("");
  const [positionRole, setPositionRole] = useState("");
  const [category, setCategory] = useState("");
  const [extractedStatus, setExtractedStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (email) {
      setCompanyName(email.companyName || "");
      setPositionRole(email.positionRole || "");
      setCategory(email.category || "Application Confirmation");
      setExtractedStatus(email.extractedStatus || "APPLIED");
      setSaveSuccess(false);
    }
  }, [email]);

  if (!email) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/emails", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: email.id,
          companyName,
          positionRole,
          category,
          extractedStatus,
          needsReview: false,
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        onEmailUpdated({
          ...email,
          companyName,
          positionRole,
          category,
          extractedStatus,
          needsReview: false,
        });
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    } catch (err) {
      console.error("Failed to save corrections:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2 text-blue-700">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Email Analysis & Extraction</h2>
              <p className="text-xs text-slate-500">
                Source: {email.account.email} • ID: {email.gmailMessageId}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs">
              <button
                onClick={() => setActiveView("both")}
                className={`rounded px-2.5 py-1 ${activeView === "both" ? "bg-slate-900 text-white" : "text-slate-600"}`}
              >
                Split View
              </button>
              <button
                onClick={() => setActiveView("extracted")}
                className={`rounded px-2.5 py-1 ${activeView === "extracted" ? "bg-slate-900 text-white" : "text-slate-600"}`}
              >
                Extracted Data
              </button>
              <button
                onClick={() => setActiveView("raw")}
                className={`rounded px-2.5 py-1 ${activeView === "raw" ? "bg-slate-900 text-white" : "text-slate-600"}`}
              >
                Raw Email
              </button>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 overflow-y-auto flex-1">
          {/* Left Column: Structured AI Extraction Card */}
          {(activeView === "both" || activeView === "extracted") && (
            <div className="p-6 space-y-5 bg-white">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                  Extracted Internship Entities
                </span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                  {Math.round((email.confidenceScore || 0.9) * 100)}% Confidence
                </span>
              </div>

              {/* Editable Fields: Company & Role */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1 flex items-center gap-1.5">
                    <Building className="h-3.5 w-3.5 text-slate-400" /> Company Name
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Citco, StellarPH"
                    className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-900 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1 flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5 text-slate-400" /> Position / Internship Role
                  </label>
                  <input
                    type="text"
                    value={positionRole}
                    onChange={(e) => setPositionRole(e.target.value)}
                    placeholder="e.g. Software Engineer Intern"
                    className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-900 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Email Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Application Confirmation">Application Confirmation</option>
                    <option value="Application Update">Application Update</option>
                    <option value="Interview Invitation">Interview Invitation</option>
                    <option value="Interview Confirmation">Interview Confirmation</option>
                    <option value="Assessment Invitation">Assessment Invitation</option>
                    <option value="Assessment Instructions">Assessment Instructions</option>
                    <option value="Final Interview">Final Interview</option>
                    <option value="Acceptance">Acceptance / Offer</option>
                    <option value="Rejection">Rejection</option>
                    <option value="OJT / MOA Requirements">OJT / MOA Requirements</option>
                    <option value="Other Recruitment Communication">Other Recruitment Communication</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Application Stage</label>
                  <select
                    value={extractedStatus}
                    onChange={(e) => setExtractedStatus(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="APPLIED">Applied</option>
                    <option value="UNDER_REVIEW">Under Review</option>
                    <option value="ASSESSMENT">Assessment / Exam</option>
                    <option value="INTERVIEW">Interview Round</option>
                    <option value="OJT_PROCESSING">OJT / MOA Processing</option>
                    <option value="OFFERED">Offered / Accepted</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Event / Meeting Link */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-2.5 text-xs">
                <span className="font-semibold text-slate-700 block">Identified Schedules & Activities</span>

                {email.meetingLink ? (
                  <div className="flex items-center justify-between rounded-lg bg-white p-2.5 border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-slate-900">Virtual Meeting Room</span>
                    </div>
                    <a
                      href={email.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded bg-blue-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-blue-700 transition-colors"
                    >
                      Join Call <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                ) : (
                  <p className="text-slate-400 italic">No video meeting link detected</p>
                )}

                <div className="grid grid-cols-2 gap-2 text-slate-600 pt-1">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Scheduled Date / Time:</span>
                    <span className="font-medium text-slate-800">
                      {email.eventDate
                        ? `${new Date(email.eventDate).toLocaleDateString("en-PH", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })} ${email.eventTime ? `at ${email.eventTime}` : ""}`
                        : "None detected"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 block">Assessment Deadline:</span>
                    <span className="font-medium text-slate-800">
                      {email.deadlineDate
                        ? new Date(email.deadlineDate).toLocaleDateString("en-PH", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "None"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Next steps and HR Contact */}
              <div className="space-y-2 text-xs">
                {email.nextSteps && (
                  <div className="rounded-lg bg-blue-50/60 border border-blue-200 p-2.5">
                    <span className="font-semibold text-blue-900 block mb-0.5">Recommended Next Action:</span>
                    <p className="text-blue-800">{email.nextSteps}</p>
                  </div>
                )}

                {email.hrContact && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <User className="h-3.5 w-3.5 text-slate-400" />
                    <span>HR / Recruiter: <strong className="text-slate-800">{email.hrContact}</strong></span>
                  </div>
                )}
              </div>

              {/* Save Correction Action */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
                >
                  <Save className="h-3.5 w-3.5" />
                  {isSaving ? "Saving..." : "Save Corrections"}
                </button>

                {saveSuccess && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                    <CheckCircle className="h-3.5 w-3.5" /> Updated successfully!
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Right Column: Original Email Content */}
          {(activeView === "both" || activeView === "raw") && (
            <div className="p-6 space-y-4 bg-slate-50/40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                  Original Email Content
                </span>
                <span className="text-[11px] text-slate-500">
                  {new Date(email.dateReceived).toLocaleString("en-PH")}
                </span>
              </div>

              {/* Header Box */}
              <div className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-1.5 text-xs text-slate-600">
                <div>
                  <strong className="text-slate-800">From:</strong> {email.senderName || email.sender} &lt;
                  {email.sender}&gt;
                </div>
                <div>
                  <strong className="text-slate-800">Subject:</strong> {email.subject}
                </div>
                <div>
                  <strong className="text-slate-800">To Account:</strong> {email.account.email}
                </div>
              </div>

              {/* Body Text */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 font-mono text-xs leading-relaxed text-slate-700 whitespace-pre-wrap max-h-[380px] overflow-y-auto">
                {email.bodyContent || email.snippet}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
