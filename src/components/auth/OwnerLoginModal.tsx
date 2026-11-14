"use client";

import React, { useState } from "react";
import { X, Lock, AlertCircle } from "lucide-react";

interface OwnerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onOpenGoogleOAuth: () => void;
}

export const OwnerLoginModal: React.FC<OwnerLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onOpenGoogleOAuth,
}) => {
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/owner/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: pin.trim() }),
      });

      const data = await res.json();
      if (res.ok) {
        setPin("");
        onSuccess();
        onClose();
      } else {
        setError(data.error || "Incorrect passcode.");
      }
    } catch {
      setError("Failed to verify passcode.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-sm rounded-2xl bg-white shadow-xl border border-slate-200 overflow-hidden">
        {/* Simple Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-slate-700" />
            <h3 className="text-sm font-bold text-slate-900">Owner Access</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 p-2.5 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Enter Passcode
            </label>
            <input
              type="password"
              required
              autoFocus
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 tracking-widest"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !pin.trim()}
            className="w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors disabled:opacity-40 shadow-sm"
          >
            {isLoading ? "Unlocking..." : "Unlock"}
          </button>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400 text-[10px] font-semibold">Or</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenGoogleOAuth();
            }}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 py-2 text-xs font-semibold text-slate-700 transition-colors shadow-sm"
          >
            <svg className="h-3.5 w-3.5 fill-current text-blue-600" viewBox="0 0 24 24">
              <path d="M12.24 10.285V13.8h6.887C18.2 16.14 15.645 17.8 12.24 17.8c-3.263 0-5.92-2.657-5.92-5.92s2.657-5.92 5.92-5.92c1.474 0 2.82.543 3.86 1.436l2.673-2.674C17.07 3.197 14.81 2.3 12.24 2.3 6.945 2.3 2.65 6.595 2.65 11.89s4.295 9.59 9.59 9.59c5.534 0 9.207-3.89 9.207-9.37 0-.63-.06-1.24-.173-1.825H12.24z" />
            </svg>
            <span>Sign In with Google</span>
          </button>
        </form>
      </div>
    </div>
  );
};
