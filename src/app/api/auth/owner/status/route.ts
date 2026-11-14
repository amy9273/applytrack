import { NextRequest, NextResponse } from "next/server";
import { isOwnerSession, OWNER_COOKIE_NAME } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  const isOwner = isOwnerSession(request);
  let ownerName = null;
  let ownerEmail = null;

  if (isOwner) {
    const cookie = request.cookies.get(OWNER_COOKIE_NAME);
    if (cookie?.value) {
      try {
        const decoded = JSON.parse(Buffer.from(cookie.value, "base64").toString("utf-8"));
        ownerName = decoded.name;
        ownerEmail = decoded.email;
      } catch {}
    }
  }

  return NextResponse.json({
    isOwner,
    ownerName: ownerName || (isOwner ? "Angel Amaya Balion" : null),
    ownerEmail: ownerEmail || (isOwner ? "angelamaya.balion@gmail.com" : null),
    mode: isOwner ? "OWNER" : "VISITOR",
  });
}
