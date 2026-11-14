"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Plus,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Inbox,
  Sparkles,
} from "lucide-react";

interface Account {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  lastSyncAt: string | null;
  syncStatus: string;
  _count?: {
    emails: number;
  };
}

interface SettingsViewProps {
  accounts: Account[];
  onDisconnectAccount: (id: string) => Promise<void>;
  onSeedDemo: () => Promise<void>;
  isSeeding: boolean;
  onSyncAccount: (id: string) => Promise<void>;
  isSyncing: boolean;
  scanDays: number | "ALL";
  setScanDays: (days: number | "ALL") => void;
  onOpenGoogleLogin: () => void;
  isOwner?: boolean;
  onOpenOwnerLogin?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  accounts,
  onDisconnectAccount,
  onSeedDemo,
  isSeeding,
  onSyncAccount,
  isSyncing,
  scanDays,
  setScanDays,
  onOpenGoogleLogin,
  isOwner = false,
  onOpenOwnerLogin,
}) => {
  const [oauthError, setOauthError] = useState<string | null>(null);

  const handleConnectGoogle = async () => {
    setOauthError(null);
    try {
      const res = await fetch("/api/auth/google/url");
      const data = await res.json();
      if (data.configured && data.url) {
        window.location.href = data.url;
      } else {
        setOauthError(
          "Google OAuth credentials (GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET) are not configured in .env. You can use the 'Load Angel's Inboxes' button to test with 3 live simulated inboxes."
        );
      }
    } catch {
      setOauthError("Failed to initiate Google OAuth.");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Vercel Deployment & Visitor Shield Status */}
      <div className={`rounded-2xl border p-5 shadow-sm space-y-2.5 ${
        isOwner
          ? "border-emerald-200 bg-emerald-50/60"
          : "border-amber-200 bg-amber-50/60"
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">{isOwner ? "👑" : "🛡️"}</span>
            <h3 className="text-sm font-bold text-slate-900">
              {isOwner ? "Owner Mode: Live Account Access" : "Visitor Privacy Shield: Active"}
            </h3>
          </div>
          {!isOwner && onOpenOwnerLogin && (
            <button
              onClick={onOpenOwnerLogin}
              className="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors shadow-sm"
            >
              Unlock Owner Mode
            </button>
          )}
        </div>
        <p className="text-xs text-slate-700 leading-relaxed">
          {isOwner ? (
            <>
              You are currently authenticated as the owner. Your connected Gmail accounts and synchronized recruitment emails are active.
              When recruiters or guests visit your deployed Vercel URL without your PIN, they will automatically see a pure dummy database to keep your personal data 100% private.
            </>
          ) : (
            <>
              Public visitors and recruiters currently see a sanitized showcase database (Canva, Thinking Machines, Citco, Maya).
              Your real Gmail inboxes and personal emails are completely locked and hidden from view.
            </>
          )}
        </p>
      </div>

      {/* Privacy Guarantee Card */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-5 space-y-2">
        <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
          <ShieldCheck className="h-5 w-5 text-blue-600" />
          <span>Strict Read-Only Privacy Guarantee</span>
        </div>
        <p className="text-xs text-blue-800 leading-relaxed">
          ApplyTrack requests only <code>https://www.googleapis.com/auth/gmail.readonly</code>. It can never send,
          delete, or modify your emails. It scans exclusively for recruitment keywords (such as &quot;internship&quot;,
          &quot;interview&quot;, &quot;assessment&quot;, &quot;MOA&quot;) to protect your personal privacy.
        </p>
      </div>

      {/* Sync Preferences */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Email Scan Frequency & Window</h3>
          <p className="text-xs text-slate-500">Choose how far back ApplyTrack scans your connected Gmail accounts</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div
            onClick={() => setScanDays(15)}
            className={`rounded-xl border p-4 cursor-pointer transition-all ${
              scanDays === 15 ? "border-blue-600 bg-blue-50/40" : "border-slate-200 bg-slate-50 hover:bg-white"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-900">Last 15 Days</span>
              {scanDays === 15 && <CheckCircle2 className="h-4 w-4 text-blue-600" />}
            </div>
            <p className="text-[11px] text-slate-500">Fastest scan. Prioritizes active recent communications.</p>
          </div>

          <div
            onClick={() => setScanDays(30)}
            className={`rounded-xl border p-4 cursor-pointer transition-all ${
              scanDays === 30 ? "border-blue-600 bg-blue-50/40" : "border-slate-200 bg-slate-50 hover:bg-white"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-900">Last 30 Days (Recommended)</span>
              {scanDays === 30 && <CheckCircle2 className="h-4 w-4 text-blue-600" />}
            </div>
            <p className="text-[11px] text-slate-500">Balanced scan covering recent offers, interviews, and coding tests.</p>
          </div>

          <div
            onClick={() => setScanDays("ALL")}
            className={`rounded-xl border p-4 cursor-pointer transition-all ${
              scanDays === "ALL" ? "border-blue-600 bg-blue-50/40" : "border-slate-200 bg-slate-50 hover:bg-white"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-900">All Historical</span>
              {scanDays === "ALL" && <CheckCircle2 className="h-4 w-4 text-blue-600" />}
            </div>
            <p className="text-[11px] text-slate-500">Full archive scan. Ingests all past internship applications.</p>
          </div>
        </div>
      </div>

      {/* Connected Accounts Manager */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Connected Gmail Accounts</h3>
            <p className="text-xs text-slate-500">Manage connected personal, university, and work inboxes</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenGoogleLogin}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" /> Sign In with Google
            </button>

            <button
              onClick={onSeedDemo}
              disabled={isSeeding || isSyncing}
              className="inline-flex items-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50 px-3.5 py-2 text-xs font-bold text-purple-700 hover:bg-purple-100 transition-colors disabled:opacity-50"
            >
              <Sparkles className="h-3.5 w-3.5 text-purple-600" />
              {isSeeding ? "Syncing..." : "Load Angel's Inboxes"}
            </button>
          </div>
        </div>

        {oauthError && (
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
            <span>{oauthError}</span>
          </div>
        )}

        <div className="space-y-3">
          {accounts.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No Gmail accounts connected yet.</p>
          ) : (
            accounts.map((acc) => (
              <div
                key={acc.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-4 shadow-sm"
              >
                <div className="flex items-center gap-3.5">
                  <div className="h-9 w-9 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center uppercase">
                    {acc.email.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{acc.email}</span>
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.2 rounded">
                        <CheckCircle2 className="h-3 w-3" /> Active
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {acc.name || "Angel Amaya Balion"} • {acc._count?.emails ?? 0} recruitment emails identified
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSyncAccount(acc.id)}
                    disabled={isSyncing}
                    className="rounded-lg p-2 text-slate-500 hover:bg-slate-200 transition-colors"
                    title="Sync this account now"
                  >
                    <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin text-blue-600" : ""}`} />
                  </button>
                  <button
                    onClick={() => onDisconnectAccount(acc.id)}
                    className="rounded-lg p-2 text-rose-500 hover:bg-rose-100 transition-colors"
                    title="Disconnect account"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
