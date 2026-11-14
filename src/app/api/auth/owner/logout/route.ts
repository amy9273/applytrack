import { NextRequest, NextResponse } from "next/server";
import { OWNER_COOKIE_NAME } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  const response = NextResponse.json({
    success: true,
    message: "Reverted to Visitor Demo Mode. Your private emails are protected.",
    mode: "VISITOR",
  });

  response.cookies.delete(OWNER_COOKIE_NAME);
  return response;
}
