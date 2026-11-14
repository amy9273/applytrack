import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getGoogleAuthUrl, getEffectiveRedirectUri } from "@/lib/google/auth";

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID || "";
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
  const redirectUri = getEffectiveRedirectUri(request);

  return NextResponse.json({
    configured: Boolean(clientId && clientSecret),
    clientId: clientId ? `${clientId.slice(0, 12)}...apps.googleusercontent.com` : "",
    redirectUri,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientId, clientSecret } = body;

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: "Both Client ID and Client Secret are required" },
        { status: 400 }
      );
    }

    const trimmedClientId = clientId.trim();
    const trimmedSecret = clientSecret.trim();

    // Set in memory for immediate use
    process.env.GOOGLE_CLIENT_ID = trimmedClientId;
    process.env.GOOGLE_CLIENT_SECRET = trimmedSecret;

    // Persist to .env file
    const envPath = path.join(process.cwd(), ".env");
    let envContent = "";
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, "utf-8");
    }

    const updateOrAddEnv = (key: string, val: string) => {
      const regex = new RegExp(`^${key}=.*$`, "m");
      if (regex.test(envContent)) {
        envContent = envContent.replace(regex, `${key}="${val}"`);
      } else {
        envContent += `\n${key}="${val}"`;
      }
    };

    updateOrAddEnv("GOOGLE_CLIENT_ID", trimmedClientId);
    updateOrAddEnv("GOOGLE_CLIENT_SECRET", trimmedSecret);
    fs.writeFileSync(envPath, envContent.trim() + "\n", "utf-8");

    // Generate OAuth URL
    const redirectUri = getEffectiveRedirectUri(request);
    const authUrl = getGoogleAuthUrl(redirectUri);

    return NextResponse.json({
      success: true,
      url: authUrl,
    });
  } catch (error) {
    console.error("Failed to configure Google OAuth:", error);
    return NextResponse.json(
      { error: "Failed to configure Google OAuth credentials" },
      { status: 500 }
    );
  }
}
