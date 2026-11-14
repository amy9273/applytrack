import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_OWNER_PIN, OWNER_COOKIE_NAME, createOwnerSessionToken } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  try {
    const { pin } = await request.json();

    if (!pin || pin.trim() !== DEFAULT_OWNER_PIN) {
      return NextResponse.json(
        { error: "Invalid Owner PIN. Visitor mode remains active." },
        { status: 401 }
      );
    }

    const token = createOwnerSessionToken();
    const response = NextResponse.json({
      success: true,
      message: "Owner mode activated! Live database and Gmail sync unlocked.",
      mode: "OWNER",
    });

    response.cookies.set({
      name: OWNER_COOKIE_NAME,
      value: token,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to authenticate" }, { status: 500 });
  }
}
