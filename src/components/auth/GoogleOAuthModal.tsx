"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  ShieldCheck,
  ExternalLink,
  Copy,
  Check,
  AlertCircle,
  Sparkles,
  Trash2,
  Lock,
} from "lucide-react";

interface GoogleOAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClearedDemoData: () => void;
}

export const GoogleOAuthModal: React.FC<GoogleOAuthModalProps> = ({
  isOpen,
  onClose,
  onClearedDemoData,
}) => {
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [redirectUri, setRedirectUri] = useState("http://localhost:3000/api/auth/google/callback");
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetch("/api/auth/google/configure")
        .then((res) => res.json())
        .then((data) => {
          if (data.redirectUri) setRedirectUri(data.redirectUri);
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(redirectUri);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId.trim() || !clientSecret.trim()) {
      setError("Please paste both your Google Client ID and Client Secret.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/google/configure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId: clientId.trim(), clientSecret: clientSecret.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.url) {
        // Redirect directly to Google OAuth sign-in screen
        window.location.href = data.url;
      } else {
        setError(data.error || "Failed to configure Google OAuth.");
        setIsSubmitting(false);
      }
    } catch {
      setError("Network error configuring Google OAuth.");
      setIsSubmitting(false);
    }
  };

  const handleClearDemoData = async () => {
    if (!confirm("Are you sure you want to delete all simulated demo emails and applications?")) return;
    setIsClearing(true);
    try {
      const res = await fetch("/api/seed/clear", { method: "POST" });
      if (res.ok) {
        onClearedDemoData();
        alert("All simulated demo data has been cleared! Connect your Google account below to scan your real emails.");
      }
    } catch {
      alert("Failed to clear demo data.");
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-bold shadow-sm">
              G
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Sign in with your Real Google Account</h2>
              <p className="text-xs text-slate-500">Live Gmail read-only recruitment synchronization</p>
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
        <div className="p-6 space-y-5">
          {/* Privacy Note */}
          <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-3.5 flex items-start gap-2.5 text-xs text-blue-900">
            <ShieldCheck className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <strong>100% Read-Only Security: </strong>
              ApplyTrack never asks for permissions to send, modify, or delete emails. It only retrieves messages matching
              recruitment queries (e.g. <em>internship, interview, assessment</em>) to protect your personal privacy.
            </div>
          </div>

          {/* Quick 2-Minute Google Cloud Credentials Instructions */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-2.5 text-xs text-slate-700">
            <span className="font-bold text-slate-900 block text-xs">
              Need OAuth credentials? (Takes 2 minutes):
            </span>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-600 leading-relaxed">
              <li>
                Open{" "}
                <a
                  href="https://console.cloud.google.com/apis/credentials"
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-blue-600 underline inline-flex items-center gap-0.5"
                >
                  Google Cloud Console &rarr; Credentials <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                Click <strong>Create Credentials &rarr; OAuth 2.0 Client ID</strong> (Application type: <em>Web application</em>).
              </li>
              <li>
                Under <strong>Authorized redirect URIs</strong>, add this exact URL:
                <div className="mt-1 flex items-center justify-between gap-2 rounded-lg bg-white border border-slate-200 px-2.5 py-1.5 font-mono text-[11px] text-slate-800">
                  <span className="truncate">{redirectUri}</span>
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="inline-flex items-center gap-1 rounded bg-slate-100 hover:bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700 transition-colors shrink-0"
                  >
                    {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </li>
              <li>Enable the <strong>Gmail API</strong> in your Google Cloud project (APIs & Services &rarr; Enable APIs).</li>
            </ol>
          </div>

          {error && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-rose-600 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleConnect} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Google Client ID *
              </label>
              <input
                type="text"
                required
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="e.g. 1234567890-abcdefgh.apps.googleusercontent.com"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Google Client Secret *
              </label>
              <input
                type="password"
                required
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
                placeholder="e.g. GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxx"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
              >
                <Lock className="h-4 w-4" />
                {isSubmitting ? "Connecting to Google..." : "Save Credentials & Sign In with Google"}
              </button>
            </div>
          </form>

          {/* Wipe Simulated Data Option */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Want a fresh workspace without simulated data?</span>
            <button
              type="button"
              onClick={handleClearDemoData}
              disabled={isClearing}
              className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-700 hover:bg-rose-100 transition-colors disabled:opacity-50"
            >
              <Trash2 className="h-3 w-3" />
              <span>{isClearing ? "Clearing..." : "Wipe All Simulated Emails"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
