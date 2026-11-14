"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { MetricsCards } from "@/components/dashboard/MetricsCards";
import { EmailStream, EmailItem } from "@/components/dashboard/EmailStream";
import { EmailDetailModal } from "@/components/dashboard/EmailDetailModal";
import { ApplicationsView, ApplicationItem } from "@/components/dashboard/ApplicationsView";
import { AccountManagerModal } from "@/components/dashboard/AccountManagerModal";
import { CheckCircle2, AlertCircle, Sparkles, Inbox } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"overview" | "emails" | "applications">("overview");
  const [accounts, setAccounts] = useState<any[]>([]);
  const [emails, setEmails] = useState<EmailItem[]>([]);
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<EmailItem | null>(null);
  const [isAccountsModalOpen, setIsAccountsModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [banner, setBanner] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);

  // Fetch all core data
  const loadData = useCallback(async () => {
    try {
      const [accRes, emailRes, appRes] = await Promise.all([
        fetch("/api/accounts"),
        fetch("/api/emails"),
        fetch("/api/applications"),
      ]);

      const accData = await accRes.json();
      const emailData = await emailRes.json();
      const appData = await appRes.json();

      setAccounts(accData.accounts || []);
      setEmails(emailData.emails || []);
      setApplications(appData.applications || []);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();

    // Check OAuth return params
    const params = new URLSearchParams(window.location.search);
    if (params.get("auth_success")) {
      const accountEmail = params.get("account") || "Gmail account";
      setBanner({
        type: "success",
        message: `Successfully connected ${accountEmail} and synchronized recruitment emails!`,
      });
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (params.get("auth_error")) {
      setBanner({
        type: "error",
        message: `Google Authentication error: ${params.get("auth_error")}`,
      });
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [loadData]);

  // Sync all inboxes
  const handleSyncAll = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/sync/gmail", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setBanner({
          type: "success",
          message: `Sync complete! Scanned and updated ${data.syncedEmails ?? 0} emails.`,
        });
        await loadData();
      } else {
        setBanner({
          type: "error",
          message: data.error || "Failed to sync Gmail accounts",
        });
      }
    } catch (err) {
      setBanner({
        type: "error",
        message: "Failed to connect to sync service",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Seed demo inboxes
  const handleSeedDemo = async () => {
    setIsSeeding(true);
    try {
      const res = await fetch("/api/seed/demo-inboxes", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setBanner({
          type: "success",
          message: `Loaded ${data.accountsCount} simulated student inboxes with ${data.emailsCount} recruitment emails (Citco, StellarPH, GlobalTransco, Maya, Canva)!`,
        });
        await loadData();
        setIsAccountsModalOpen(false);
      } else {
        setBanner({
          type: "error",
          message: "Failed to seed demo inboxes",
        });
      }
    } catch (err) {
      setBanner({
        type: "error",
        message: "Network error while loading demo data",
      });
    } finally {
      setIsSeeding(false);
    }
  };

  // Disconnect account
  const handleDisconnectAccount = async (id: string) => {
    try {
      const res = await fetch(`/api/accounts?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        await loadData();
      }
    } catch (err) {
      console.error("Failed to disconnect account:", err);
    }
  };

  // Update application status
  const handleApplicationStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, currentStatus: newStatus }),
      });
      if (res.ok) {
        await loadData();
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // Compute stats
  const upcomingActivitiesCount = applications.reduce(
    (acc, app) => acc + (app.activities ? app.activities.length : 0),
    0
  );
  const needsReviewCount = emails.filter((e) => e.needsReview).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        accountsCount={accounts.length}
        onOpenAccounts={() => setIsAccountsModalOpen(true)}
        onSyncAll={handleSyncAll}
        isSyncing={isSyncing}
        onSeedDemo={handleSeedDemo}
        isSeeding={isSeeding}
      />

      {/* Main Container */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Banner Notification */}
        {banner && (
          <div
            className={`rounded-xl border p-4 flex items-center justify-between shadow-sm transition-all ${
              banner.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : banner.type === "error"
                ? "bg-rose-50 border-rose-200 text-rose-900"
                : "bg-blue-50 border-blue-200 text-blue-900"
            }`}
          >
            <div className="flex items-center gap-3 text-xs sm:text-sm font-medium">
              {banner.type === "success" ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
              )}
              <span>{banner.message}</span>
            </div>
            <button
              onClick={() => setBanner(null)}
              className="text-xs font-semibold underline ml-4 hover:opacity-75"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Hero Welcome banner for 0 accounts */}
        {accounts.length === 0 && !isLoading && (
          <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-600 to-indigo-600 p-6 sm:p-8 text-white shadow-lg">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-xs font-medium text-white border border-white/20">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Solve the 3-Gmail Inbox Chaos</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome to ApplyTrack
              </h1>
              <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
                Automatically gather, classify, and extract internship application details across your personal, university,
                and professional Gmail accounts. No more spreadsheets or manual copy-pasting.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={handleSeedDemo}
                  disabled={isSeeding}
                  className="rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-blue-700 shadow-md hover:bg-blue-50 transition-all flex items-center gap-2"
                >
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  {isSeeding ? "Loading Demo Inboxes..." : "Load 3 Demo Student Inboxes (Instant Demo)"}
                </button>

                <button
                  onClick={() => setIsAccountsModalOpen(true)}
                  className="rounded-xl bg-blue-700/80 hover:bg-blue-700 px-4 py-2.5 text-xs font-semibold text-white border border-white/20 transition-all flex items-center gap-2"
                >
                  <Inbox className="h-4 w-4" />
                  Connect Google Account
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Metrics Row */}
        <MetricsCards
          totalEmails={emails.length}
          totalApplications={applications.length}
          upcomingActivitiesCount={upcomingActivitiesCount}
          needsReviewCount={needsReviewCount}
          accountsCount={accounts.length}
          onFilterNeedsReview={() => {
            setActiveTab("emails");
          }}
          onViewApplications={() => setActiveTab("applications")}
        />

        {/* Tab Views */}
        {activeTab === "overview" || activeTab === "emails" ? (
          <div className="space-y-4">
            <EmailStream
              emails={emails}
              accounts={accounts}
              selectedEmail={selectedEmail}
              onSelectEmail={(email) => setSelectedEmail(email)}
              isLoading={isLoading}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <ApplicationsView
              applications={applications}
              onStatusChange={handleApplicationStatusChange}
              isLoading={isLoading}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      <EmailDetailModal
        email={selectedEmail}
        onClose={() => setSelectedEmail(null)}
        onEmailUpdated={(updated) => {
          setEmails((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
          setSelectedEmail(updated);
          loadData();
        }}
      />

      <AccountManagerModal
        isOpen={isAccountsModalOpen}
        onClose={() => setIsAccountsModalOpen(false)}
        accounts={accounts}
        onDisconnectAccount={handleDisconnectAccount}
        onSeedDemo={handleSeedDemo}
        isSeeding={isSeeding}
        onSyncAccount={async (id) => {
          setIsSyncing(true);
          try {
            await fetch("/api/sync/gmail", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ accountId: id }),
            });
            await loadData();
          } finally {
            setIsSyncing(false);
          }
        }}
        isSyncing={isSyncing}
      />
    </div>
  );
}
