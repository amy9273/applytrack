"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar, NavSection } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { EmailOrganizerView } from "@/components/emails/EmailOrganizerView";
import { ApplicationsListView } from "@/components/applications/ApplicationsListView";
import { CalendarView } from "@/components/calendar/CalendarView";
import { TasksView } from "@/components/tasks/TasksView";
import { SettingsView } from "@/components/settings/SettingsView";
import { EmailDetailModal } from "@/components/dashboard/EmailDetailModal";
import { AccountManagerModal } from "@/components/dashboard/AccountManagerModal";
import { NewApplicationModal } from "@/components/applications/NewApplicationModal";
import { EmailItem } from "@/components/dashboard/EmailStream";
import { ApplicationItem } from "@/components/dashboard/ApplicationsView";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

export default function Home() {
  const [currentSection, setCurrentSection] = useState<NavSection>("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [accounts, setAccounts] = useState<any[]>([]);
  const [emails, setEmails] = useState<EmailItem[]>([]);
  const [applications, setApplications] = useState<ApplicationItem[]>([]);

  const [selectedEmail, setSelectedEmail] = useState<EmailItem | null>(null);
  const [isAccountsModalOpen, setIsAccountsModalOpen] = useState(false);
  const [isNewAppModalOpen, setIsNewAppModalOpen] = useState(false);

  const [globalSearch, setGlobalSearch] = useState("");
  const [scanDays, setScanDays] = useState<number | "ALL">(30);

  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [banner, setBanner] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);

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

  const handleSyncAll = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/sync/gmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ daysRange: scanDays }),
      });
      const data = await res.json();
      if (res.ok) {
        setBanner({
          type: "success",
          message: `Sync complete (${scanDays === "ALL" ? "All Time" : `${scanDays} Days`})! Scanned and updated ${data.syncedEmails ?? 0} emails.`,
        });
        await loadData();
      } else {
        setBanner({
          type: "error",
          message: data.error || "Failed to sync Gmail accounts",
        });
      }
    } catch {
      setBanner({
        type: "error",
        message: "Failed to connect to sync service",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSeedDemo = async () => {
    setIsSeeding(true);
    try {
      const res = await fetch("/api/seed/demo-inboxes", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setBanner({
          type: "success",
          message: `Loaded Angel Balion's 3 inboxes with ${data.emailsCount} recruitment emails (Citco, StellarPH, GlobalTransco, Maya, Canva)!`,
        });
        await loadData();
        setIsAccountsModalOpen(false);
      } else {
        setBanner({
          type: "error",
          message: "Failed to seed inboxes",
        });
      }
    } catch {
      setBanner({
        type: "error",
        message: "Network error while loading demo data",
      });
    } finally {
      setIsSeeding(false);
    }
  };

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

  const needsReviewCount = emails.filter((e) => e.needsReview).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* 1. Desktop Left Sidebar */}
      <Sidebar
        currentSection={currentSection}
        onSelectSection={(sec) => {
          setCurrentSection(sec);
          setIsMobileMenuOpen(false);
        }}
        accountsCount={accounts.length}
        totalEmailsCount={emails.length}
        totalApplicationsCount={applications.length}
        needsReviewCount={needsReviewCount}
        onOpenAccounts={() => setIsAccountsModalOpen(true)}
      />

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative flex w-64 flex-col bg-white shadow-2xl z-10">
            <div className="flex h-16 items-center justify-between px-6 border-b border-slate-100">
              <span className="font-bold text-slate-900">ApplyTrack</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              <Sidebar
                currentSection={currentSection}
                onSelectSection={(sec) => {
                  setCurrentSection(sec);
                  setIsMobileMenuOpen(false);
                }}
                accountsCount={accounts.length}
                totalEmailsCount={emails.length}
                totalApplicationsCount={applications.length}
                needsReviewCount={needsReviewCount}
                onOpenAccounts={() => {
                  setIsAccountsModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 2. Main Content Layout (Offset by sidebar width on desktop) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header */}
        <Topbar
          currentSection={currentSection}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          globalSearch={globalSearch}
          setGlobalSearch={setGlobalSearch}
          scanDays={scanDays}
          setScanDays={setScanDays}
          onSyncAll={handleSyncAll}
          isSyncing={isSyncing}
          onSeedDemo={handleSeedDemo}
          isSeeding={isSeeding}
          accountsCount={accounts.length}
          onOpenAccounts={() => setIsAccountsModalOpen(true)}
        />

        {/* Workspace Body */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-7xl w-full mx-auto">
          {/* Notification Banner */}
          {banner && (
            <div
              className={`rounded-2xl border p-4 flex items-center justify-between shadow-sm transition-all ${
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

          {/* Section Router */}
          {currentSection === "dashboard" && (
            <DashboardOverview
              emails={emails}
              applications={applications}
              onSelectEmail={(e) => setSelectedEmail(e)}
              onNavigateToEmails={() => setCurrentSection("emails")}
              onNavigateToApplications={() => setCurrentSection("applications")}
              onNavigateToCalendar={() => setCurrentSection("calendar")}
              onNavigateToTasks={() => setCurrentSection("tasks")}
              onSync={handleSyncAll}
              isSyncing={isSyncing}
            />
          )}

          {currentSection === "emails" && (
            <EmailOrganizerView
              emails={emails}
              accounts={accounts}
              onSelectEmail={(e) => setSelectedEmail(e)}
              isLoading={isLoading}
              globalSearch={globalSearch}
            />
          )}

          {currentSection === "applications" && (
            <ApplicationsListView
              applications={applications}
              onStatusChange={handleApplicationStatusChange}
              onOpenNewApplicationModal={() => setIsNewAppModalOpen(true)}
              isLoading={isLoading}
            />
          )}

          {currentSection === "calendar" && (
            <CalendarView applications={applications} />
          )}

          {currentSection === "tasks" && (
            <TasksView />
          )}

          {currentSection === "settings" && (
            <SettingsView
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
                    body: JSON.stringify({ accountId: id, daysRange: scanDays }),
                  });
                  await loadData();
                } finally {
                  setIsSyncing(false);
                }
              }}
              isSyncing={isSyncing}
              scanDays={scanDays}
              setScanDays={setScanDays}
            />
          )}
        </main>
      </div>

      {/* Modals & Slide-Overs */}
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
              body: JSON.stringify({ accountId: id, daysRange: scanDays }),
            });
            await loadData();
          } finally {
            setIsSyncing(false);
          }
        }}
        isSyncing={isSyncing}
      />

      <NewApplicationModal
        isOpen={isNewAppModalOpen}
        onClose={() => setIsNewAppModalOpen(false)}
        onApplicationCreated={loadData}
      />
    </div>
  );
}
