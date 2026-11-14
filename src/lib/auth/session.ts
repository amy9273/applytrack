import { NextRequest, NextResponse } from "next/server";

export const OWNER_COOKIE_NAME = "applytrack_owner_session";

// Default Owner PIN if not overridden by env variable
export const DEFAULT_OWNER_PIN = process.env.OWNER_PIN || "applytrack2026";

export interface OwnerSession {
  isOwner: boolean;
  email?: string;
  name?: string;
  authenticatedAt: string;
}

/**
 * Checks if the incoming request is authenticated as the portfolio owner.
 * Any unauthenticated user is strictly classified as a Visitor (seeing only sanitized mock data).
 */
export function isOwnerSession(request: NextRequest): boolean {
  // 1. Check HTTP-only cookie
  const cookie = request.cookies.get(OWNER_COOKIE_NAME);
  if (cookie?.value) {
    try {
      const decoded = JSON.parse(Buffer.from(cookie.value, "base64").toString("utf-8"));
      if (decoded && decoded.isOwner === true) {
        return true;
      }
    } catch {
      // Invalid cookie
    }
  }

  // 2. Check Authorization or custom header (for programmatic or API tests)
  const authHeader = request.headers.get("x-applytrack-owner-key");
  if (authHeader && authHeader === DEFAULT_OWNER_PIN) {
    return true;
  }

  return false;
}

/**
 * Creates an encrypted/base64 owner session cookie payload
 */
export function createOwnerSessionToken(email?: string, name?: string): string {
  const payload: OwnerSession = {
    isOwner: true,
    email: email || "angelamaya.balion@gmail.com",
    name: name || "Angel Amaya Balion",
    authenticatedAt: new Date().toISOString(),
  };
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}
