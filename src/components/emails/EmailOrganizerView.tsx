"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Video,
  Clock,
  ExternalLink,
  Inbox,
  AlertTriangle,
  ChevronRight,
  Building,
  CheckCircle2,
  Calendar,
  Sparkles,
  Mail,
} from "lucide-react";
import { EmailItem } from "../dashboard/EmailStream";

interface AccountItem {
  id: string;
  email: string;
  name: string | null;
}

interface EmailOrganizerViewProps {
  emails: EmailItem[];
  accounts: AccountItem[];
  onSelectEmail: (email: EmailItem) => void;
  isLoading: boolean;
  globalSearch: string;
}

export const EmailOrganizerView: React.FC<EmailOrganizerViewProps> = ({
  emails,
  accounts,
  onSelectEmail,
  isLoading,
  globalSearch,
}) => {
  const [selectedAccountId, setSelectedAccountId] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedCompany, setSelectedCompany] = useState<string>("ALL");
  const [localSearch, setLocalSearch] = useState<string>("");

  const effectiveSearch = localSearch || globalSearch;

  // Derive unique companies
  const uniqueCompanies = useMemo(() => {
    const set = new Set<string>();
    emails.forEach((e) => {
      if (e.companyName) set.add(e.companyName);
    });
    return Array.from(set).sort();
  }, [emails]);

  // Map account to readable friendly name / alias
  const getAccountLabel = (email: string, name?: string | null) => {
    if (email.includes("dlsl.edu.ph")) {
      return { label: "DLSL OJT", color: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    }
    if (email.includes("angelamaya") || email.includes("work")) {
      return { label: "Work / Primary", color: "bg-blue-50 text-blue-700 border-blue-200" };
    }
    if (email.includes("dev") || email.includes("amy9273")) {
      return { label: "Personal / Dev", color: "bg-purple-50 text-purple-700 border-purple-200" };
    }
    return { label: email.split("@")[0], color: "bg-slate-50 text-slate-700 border-slate-200" };
  };

  const getCategoryBadgeClass = (category: string | null) => {
    if (!category) return "bg-slate-100 text-slate-700 border-slate-200";
    if (category.includes("Interview")) return "bg-blue-50 text-blue-700 border-blue-200";
    if (category.includes("Assessment")) return "bg-amber-50 text-amber-800 border-amber-200";
    if (category.includes("Acceptance") || category.includes("Offer"))
      return "bg-emerald-50 text-emerald-800 border-emerald-200";
    if (category.includes("Rejection")) return "bg-rose-50 text-rose-800 border-rose-200";
    if (category.includes("OJT") || category.includes("MOA"))
      return "bg-purple-50 text-purple-800 border-purple-200";
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  // Filter emails
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
      if (effectiveSearch.trim()) {
        const q = effectiveSearch.toLowerCase();
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
  }, [emails, selectedAccountId, selectedCategory, selectedCompany, effectiveSearch]);

  const categories = [
    "All Categories",
    "Application Confirmation",
    "Interview Invitation",
    "Assessment Invitation",
    "OJT / MOA Requirements",
    "Application Update",
    "Acceptance",
    "Rejection",
  ];

  return (
    <div className="space-y-4">
      {/* 1. Sleek Account Inbox Segmented Bar (Fixing awkward truncation) */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-3 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <Inbox className="h-4 w-4 text-blue-600" />
            <span>Connected Inboxes:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedAccountId("ALL")}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                selectedAccountId === "ALL"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              All Inboxes ({emails.length})
            </button>

            {accounts.map((acc) => {
              const count = emails.filter((e) => e.accountId === acc.id).length;
              const meta = getAccountLabel(acc.email, acc.name);
              const isSelected = selectedAccountId === acc.id;
              return (
                <button
                  key={acc.id}
                  onClick={() => setSelectedAccountId(acc.id)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all flex items-center gap-2 border ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200"
                  }`}
                  title={acc.email}
                >
                  <span className="flex items-center gap-1.5">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        meta.label.includes("Work")
                          ? "bg-blue-400"
                          : meta.label.includes("DLSL")
                          ? "bg-emerald-400"
                          : "bg-purple-400"
                      }`}
                    />
                    <span>{meta.label}</span>
                  </span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                      isSelected ? "bg-blue-700 text-blue-100" : "bg-white text-slate-600 border border-slate-200"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Filters & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search within recruitment emails..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white pl-8 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:outline-none shadow-sm"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat === "All Categories" ? "ALL" : cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Company Dropdown */}
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:outline-none shadow-sm"
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

      {/* 3. Recruitment Emails Stream */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mb-3" />
            <p className="text-sm font-semibold text-slate-700">Scanning recruitment messages...</p>
            <p className="text-xs text-slate-400 mt-1">Filtering and classifying emails across your inboxes</p>
          </div>
        ) : filteredEmails.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <Mail className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-800">No recruitment emails found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Try adjusting your category or company filters, or click &quot;Load Angel&apos;s Inboxes&quot; to populate.
            </p>
          </div>
        ) : (
          filteredEmails.map((email) => {
            const accMeta = getAccountLabel(email.account.email);
            return (
              <div
                key={email.id}
                onClick={() => onSelectEmail(email)}
                className="group relative rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm hover:border-blue-500/70 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  {/* Left: Company & Role */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white font-bold text-xs uppercase shadow-sm">
                      {(email.companyName || "C").slice(0, 2)}
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {email.companyName || "Unknown Company"}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs font-semibold text-slate-600">
                          {email.positionRole || "Internship Role"}
                        </span>
                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-bold border ${getCategoryBadgeClass(
                            email.category
                          )}`}
                        >
                          {email.category}
                        </span>

                        {email.needsReview && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200">
                            <AlertTriangle className="h-3 w-3" /> Needs Review
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs font-semibold text-slate-800 line-clamp-1">
                        {email.subject}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-1">{email.snippet}</p>

                      {/* Smart Highlights: Google Meet / Deadline / MOA */}
                      {(email.meetingLink || email.deadlineDate || email.eventDate) && (
                        <div className="pt-1.5 flex flex-wrap items-center gap-2 text-xs">
                          {email.meetingLink && (
                            <div className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1 text-blue-700 font-bold border border-blue-200/80">
                              <Video className="h-3.5 w-3.5 text-blue-600" />
                              <span>Virtual Interview Detected</span>
                            </div>
                          )}

                          {email.eventDate && (
                            <div className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1 text-amber-900 font-semibold border border-amber-200/80">
                              <Calendar className="h-3.5 w-3.5 text-amber-600" />
                              <span>
                                {email.eventTime ? `${email.eventTime} • ` : ""}
                                {new Date(email.eventDate).toLocaleDateString("en-PH", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                          )}

                          {email.deadlineDate && (
                            <div className="inline-flex items-center gap-1.5 rounded-lg bg-orange-50 px-2.5 py-1 text-orange-900 font-semibold border border-orange-200/80">
                              <Clock className="h-3.5 w-3.5 text-orange-600" />
                              <span>
                                Complete by:{" "}
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
                  </div>

                  {/* Right: Inbox Tag & Date */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1.5 shrink-0 text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-semibold border ${accMeta.color}`}
                    >
                      {accMeta.label}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">
                      {new Date(email.dateReceived).toLocaleDateString("en-PH", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className="text-xs font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
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
