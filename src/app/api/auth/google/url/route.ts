import { NextRequest, NextResponse } from "next/server";
import { getGoogleAuthUrl, getEffectiveRedirectUri } from "@/lib/google/auth";

export async function GET(request: NextRequest) {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      return NextResponse.json(
        {
          configured: false,
          error: "GOOGLE_CLIENT_ID is not configured in .env",
        },
        { status: 400 }
      );
    }

    const redirectUri = getEffectiveRedirectUri(request);
    const authUrl = getGoogleAuthUrl(redirectUri);
    return NextResponse.json({ configured: true, url: authUrl, redirectUri });
  } catch (error) {
    console.error("Failed to generate Google auth URL:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
