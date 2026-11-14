import { google } from "googleapis";
import { NextRequest } from "next/server";

const SCOPES = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/gmail.readonly",
];

export function getBaseUrl(request?: NextRequest): string {
  if (request) {
    const proto = request.headers.get("x-forwarded-proto") || "https";
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
    if (host && !host.includes("localhost") && !host.includes("127.0.0.1")) {
      return `${proto}://${host}`;
    }
    if (request.nextUrl.origin && !request.nextUrl.origin.includes("undefined")) {
      return request.nextUrl.origin;
    }
  }
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

export function getEffectiveRedirectUri(request?: NextRequest): string {
  if (process.env.GOOGLE_REDIRECT_URI && !process.env.GOOGLE_REDIRECT_URI.includes("localhost")) {
    return process.env.GOOGLE_REDIRECT_URI;
  }
  const base = getBaseUrl(request);
  return `${base}/api/auth/google/callback`;
}

export function getOAuth2Client(customRedirectUri?: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri =
    customRedirectUri ||
    process.env.GOOGLE_REDIRECT_URI ||
    "http://localhost:3000/api/auth/google/callback";

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

export function getGoogleAuthUrl(customRedirectUri?: string, state?: string): string {
  const oauth2Client = getOAuth2Client(customRedirectUri);
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
    state: state || "applytrack_auth",
  });
}

export async function exchangeCodeForTokens(code: string, customRedirectUri?: string) {
  const oauth2Client = getOAuth2Client(customRedirectUri);
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  // Get user info
  const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
  const userInfo = await oauth2.userinfo.get();

  return {
    tokens,
    email: userInfo.data.email,
    name: userInfo.data.name,
    picture: userInfo.data.picture,
  };
}

export function getAuthenticatedGmailClient(
  accessToken: string,
  refreshToken?: string | null,
  customRedirectUri?: string
) {
  const oauth2Client = getOAuth2Client(customRedirectUri);
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken || undefined,
  });

  return google.gmail({ version: "v1", auth: oauth2Client });
}
