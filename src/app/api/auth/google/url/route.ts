import { NextResponse } from "next/server";
import { getGoogleAuthUrl } from "@/lib/google/auth";

export async function GET() {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      return NextResponse.json(
        {
          configured: false,
          error: "GOOGLE_CLIENT_ID is not configured in .env.local",
        },
        { status: 400 }
      );
    }

    const authUrl = getGoogleAuthUrl();
    return NextResponse.json({ configured: true, url: authUrl });
  } catch (error) {
    console.error("Failed to generate Google auth URL:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
