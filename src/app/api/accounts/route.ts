import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isOwnerSession } from "@/lib/auth/session";
import { VISITOR_ACCOUNTS } from "@/lib/data/visitorShowcase";

export async function GET(request: NextRequest) {
  try {
    const isOwner = isOwnerSession(request);

    // If unauthenticated or visitor, strictly return sanitized dummy inboxes
    if (!isOwner) {
      return NextResponse.json({
        accounts: VISITOR_ACCOUNTS,
        mode: "VISITOR",
        isOwner: false,
      });
    }

    // Owner mode: query real connected inboxes
    const accounts = await prisma.account.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        lastSyncAt: true,
        syncStatus: true,
        _count: {
          select: { emails: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({
      accounts,
      mode: "OWNER",
      isOwner: true,
    });
  } catch (error) {
    console.error("Failed to fetch accounts:", error);
    // Graceful fallback to visitor accounts if DB is unavailable on Vercel
    return NextResponse.json({
      accounts: VISITOR_ACCOUNTS,
      mode: "VISITOR",
      isOwner: false,
    });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const isOwner = isOwnerSession(request);
    if (!isOwner) {
      return NextResponse.json({
        success: true,
        message: "Visitor mode: Account deletion is simulated.",
      });
    }

    const searchParams = request.nextUrl.searchParams;
    const accountId = searchParams.get("id");

    if (!accountId) {
      return NextResponse.json({ error: "Missing account ID" }, { status: 400 });
    }

    await prisma.account.delete({
      where: { id: accountId },
    });

    return NextResponse.json({ success: true, message: "Account disconnected" });
  } catch (error) {
    console.error("Failed to delete account:", error);
    return NextResponse.json(
      { error: "Failed to disconnect account" },
      { status: 500 }
    );
  }
}
