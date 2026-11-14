"use client";

import React, { useState } from "react";
import {
  X,
  Mail,
  Plus,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  ShieldCheck,
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

interface AccountManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Account[];
  onDisconnectAccount: (id: string) => Promise<void>;
  onSeedDemo: () => Promise<void>;
  isSeeding: boolean;
  onSyncAccount: (id: string) => Promise<void>;
  isSyncing: boolean;
}

export const AccountManagerModal: React.FC<AccountManagerModalProps> = ({
  isOpen,
  onClose,
  accounts,
  onDisconnectAccount,
  onSeedDemo,
  isSeeding,
  onSyncAccount,
  isSyncing,
}) => {
  const [isConnectingGoogle, setIsConnectingGoogle] = useState(false);
  const [oauthError, setOauthError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConnectGoogle = async () => {
    setIsConnectingGoogle(true);
    setOauthError(null);
    try {
      const res = await fetch("/api/auth/google/url");
      const data = await res.json();
      if (data.configured && data.url) {
        window.location.href = data.url;
      } else {
        setOauthError(
          "Google OAuth credentials are not set in .env.local. You can test immediately using the 'Load 3 Demo Inboxes' option below!"
        );
      }
    } catch (err) {
      setOauthError("Failed to initiate Google OAuth. Please check server configuration.");
    } finally {
      setIsConnectingGoogle(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-blue-100 p-2 text-blue-700">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Connected Gmail Accounts</h2>
              <p className="text-xs text-slate-500">
                Manage your inboxes for recruitment scanning
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Security Notice */}
          <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-3 flex items-start gap-2.5 text-xs text-blue-800">
            <ShieldCheck className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <span className="font-semibold text-blue-900">Strict Read-Only Privacy: </span>
              ApplyTrack never asks for permissions to send, edit, or delete emails. We query only recruitment and
              internship communications.
            </div>
          </div>

          {/* Action to connect or seed */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={handleConnectGoogle}
              disabled={isConnectingGoogle}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition-all shadow-sm disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              {isConnectingGoogle ? "Redirecting to Google..." : "Connect Google Account"}
            </button>

            <button
              onClick={onSeedDemo}
              disabled={isSeeding || isSyncing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-purple-200 bg-purple-50 px-4 py-2.5 text-xs font-semibold text-purple-700 hover:bg-purple-100 transition-all disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4 text-purple-600" />
              {isSeeding ? "Seeding..." : "Load 3 Demo Inboxes"}
            </button>
          </div>

          {oauthError && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
              <div>{oauthError}</div>
            </div>
          )}

          {/* List of Connected Accounts */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Active Accounts ({accounts.length})
            </h3>

            {accounts.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-xs text-slate-500">
                No Gmail accounts connected yet. Connect an account or load the 3 demo inboxes above to get started.
              </div>
            ) : (
              accounts.map((acc) => (
                <div
                  key={acc.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-xs uppercase">
                      {acc.email.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 text-xs">{acc.email}</span>
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                          <CheckCircle2 className="h-3 w-3" /> Connected
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {acc._count?.emails ?? 0} recruitment emails identified • Last synced:{" "}
                        {acc.lastSyncAt ? new Date(acc.lastSyncAt).toLocaleTimeString("en-PH") : "Never"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onSyncAccount(acc.id)}
                      disabled={isSyncing}
                      className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 transition-colors"
                      title="Sync this account"
                    >
                      <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin text-blue-600" : ""}`} />
                    </button>
                    <button
                      onClick={() => onDisconnectAccount(acc.id)}
                      className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 transition-colors"
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

        {/* Footer */}
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-3 text-right">
          <button
            onClick={onClose}
            className="rounded-lg bg-white border border-slate-200 px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
