"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Calendar,
  Video,
  Clock,
  ExternalLink,
  Sparkles,
  Inbox,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";

export interface EmailItem {
  id: string;
  accountId: string;
  account: {
    id: string;
    email: string;
    name: string | null;
    avatarUrl: string | null;
  };
  gmailMessageId: string;
  sender: string;
  senderName: string | null;
  subject: string;
  dateReceived: string;
  snippet: string;
  bodyContent: string | null;
  isRecruitment: boolean;
  category: string | null;
  confidenceScore: number | null;
  needsReview: boolean;
  companyName: string | null;
  positionRole: string | null;
  extractedStatus: string | null;
  eventDate: string | null;
  eventTime: string | null;
  timezone: string | null;
  meetingLink: string | null;
  location: string | null;
  deadlineDate: string | null;
  hrContact: string | null;
  nextSteps: string | null;
}

interface AccountItem {
  id: string;
  email: string;
  name: string | null;
}

interface EmailStreamProps {
  emails: EmailItem[];
  accounts: AccountItem[];
  selectedEmail: EmailItem | null;
  onSelectEmail: (email: EmailItem) => void;
  isLoading: boolean;
}

export const EmailStream: React.FC<EmailStreamProps> = ({
  emails,
  accounts,
  onSelectEmail,
  isLoading,
}) => {
  const [selectedAccountId, setSelectedAccountId] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedCompany, setSelectedCompany] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Extract unique companies for filter
  const uniqueCompanies = useMemo(() => {
    const set = new Set<string>();
    emails.forEach((e) => {
      if (e.companyName) set.add(e.companyName);
    });
    return Array.from(set).sort();
  }, [emails]);

  // Filtered emails
  const filteredEmails = useMemo(() => {
    return emails.filter((item) => {
      if (selectedAccountId !== "ALL" && item.accountId !== selectedAccountId) {
        return false;
      }
      if (selectedCategory !== "ALL" && item.category !== selectedCategory) {
        return false;
      }
      if (selectedCompany !== "ALL" && item.companyName !== selectedCompany) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesSubject = item.subject.toLowerCase().includes(q);
        const matchesCompany = (item.companyName || "").toLowerCase().includes(q);
        const matchesRole = (item.positionRole || "").toLowerCase().includes(q);
        const matchesSnippet = item.snippet.toLowerCase().includes(q);
        if (!matchesSubject && !matchesCompany && !matchesRole && !matchesSnippet) {
          return false;
        }
      }
      return true;
    });
  }, [emails, selectedAccountId, selectedCategory, selectedCompany, searchQuery]);

  const getCategoryBadgeClass = (category: string | null) => {
    if (!category) return "bg-slate-100 text-slate-700 border-slate-200";
    if (category.includes("Interview")) return "bg-blue-50 text-blue-700 border-blue-200/60";
    if (category.includes("Assessment")) return "bg-amber-50 text-amber-700 border-amber-200/60";
    if (category.includes("Acceptance")) return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
    if (category.includes("Rejection")) return "bg-rose-50 text-rose-700 border-rose-200/60";
    if (category.includes("OJT") || category.includes("MOA")) return "bg-purple-50 text-purple-700 border-purple-200/60";
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-PH", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Account Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5 pb-1 border-b border-slate-200/80">
        <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1">
          <Inbox className="h-3.5 w-3.5" /> Inbox:
        </span>
        <button
          onClick={() => setSelectedAccountId("ALL")}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
            selectedAccountId === "ALL"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          All Inboxes ({emails.length})
        </button>

        {accounts.map((acc) => {
          const count = emails.filter((e) => e.accountId === acc.id).length;
          return (
            <button
              key={acc.id}
              onClick={() => setSelectedAccountId(acc.id)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all flex items-center gap-1.5 ${
                selectedAccountId === acc.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <span className="truncate max-w-[150px]">{acc.email}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                  selectedAccountId === acc.id ? "bg-blue-700 text-blue-100" : "bg-slate-100 text-slate-600"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Controls & Search Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search company, position, subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:border-blue-500 focus:outline-none shadow-sm"
          >
            <option value="ALL">All Categories</option>
            <option value="Application Confirmation">Application Confirmation</option>
            <option value="Application Update">Application Update</option>
            <option value="Interview Invitation">Interview Invitation</option>
            <option value="Interview Confirmation">Interview Confirmation</option>
            <option value="Assessment Invitation">Assessment Invitation</option>
            <option value="Final Interview">Final Interview</option>
            <option value="Acceptance">Acceptance / Offer</option>
            <option value="Rejection">Rejection</option>
            <option value="OJT / MOA Requirements">OJT / MOA Requirements</option>
          </select>

          {/* Company Dropdown */}
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:border-blue-500 focus:outline-none shadow-sm"
          >
            <option value="ALL">All Companies ({uniqueCompanies.length})</option>
            {uniqueCompanies.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. Email Stream List */}
      <div className="space-y-2.5">
        {isLoading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mb-3" />
            <p className="text-sm font-medium text-slate-600">Scanning recruitment messages...</p>
            <p className="text-xs text-slate-400 mt-1">Filtering and running AI extraction across your inboxes</p>
          </div>
        ) : filteredEmails.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <Inbox className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-semibold text-slate-700">No recruitment emails found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Connect your Gmail account or click &quot;Load 3 Demo Inboxes&quot; in the navigation bar to see the AI organizer in action.
            </p>
          </div>
        ) : (
          filteredEmails.map((email) => {
            return (
              <div
                key={email.id}
                onClick={() => onSelectEmail(email)}
                className="group relative rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    {/* Header line: badges */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                      {/* Account origin */}
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 border border-slate-200">
                        {email.account.email}
                      </span>

                      {/* Category Badge */}
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-semibold border ${getCategoryBadgeClass(
                          email.category
                        )}`}
                      >
                        {email.category || "Recruitment Email"}
                      </span>

                      {/* Needs Review Flag */}
                      {email.needsReview && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-medium text-rose-700 border border-rose-200">
                          <AlertTriangle className="h-3 w-3" /> Needs Review
                        </span>
                      )}

                      {/* Company & Role Tag */}
                      {email.companyName && (
                        <span className="rounded-md bg-slate-900 px-2 py-0.5 text-[10px] font-semibold text-white">
                          {email.companyName}
                        </span>
                      )}
                      {email.positionRole && (
                        <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700 border border-blue-200">
                          {email.positionRole}
                        </span>
                      )}
                    </div>

                    {/* Subject */}
                    <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {email.subject}
                    </h3>

                    {/* Snippet */}
                    <p className="mt-1 text-xs text-slate-500 line-clamp-2">{email.snippet}</p>

                    {/* Smart highlights: meeting link / deadline */}
                    {(email.meetingLink || email.deadlineDate || email.eventDate) && (
                      <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
                        {email.meetingLink && (
                          <div className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1 text-blue-700 font-medium border border-blue-200/60">
                            <Video className="h-3.5 w-3.5 text-blue-600" />
                            <span>Interview Video Call Detected</span>
                          </div>
                        )}

                        {email.eventDate && (
                          <div className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1 text-amber-800 font-medium border border-amber-200/60">
                            <Calendar className="h-3.5 w-3.5 text-amber-600" />
                            <span>
                              {email.eventTime ? `${email.eventTime} — ` : ""}
                              {new Date(email.eventDate).toLocaleDateString("en-PH", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        )}

                        {email.deadlineDate && (
                          <div className="inline-flex items-center gap-1.5 rounded-lg bg-orange-50 px-2.5 py-1 text-orange-800 font-medium border border-orange-200/60">
                            <Clock className="h-3.5 w-3.5 text-orange-600" />
                            <span>
                              Deadline:{" "}
                              {new Date(email.deadlineDate).toLocaleDateString("en-PH", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right side: Date and Action */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 text-right">
                    <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap">
                      {formatDate(email.dateReceived)}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 group-hover:translate-x-0.5 transition-transform">
                      Inspect AI <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
