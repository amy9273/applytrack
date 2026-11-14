import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
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

    return NextResponse.json({ accounts });
  } catch (error) {
    console.error("Failed to fetch accounts:", error);
    return NextResponse.json(
      { error: "Failed to fetch connected accounts" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
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
