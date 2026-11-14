import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");

    const where: any = {};
    if (status && status !== "ALL") {
      where.currentStatus = status;
    }

    const applications = await prisma.application.findMany({
      where,
      include: {
        emails: {
          select: {
            id: true,
            subject: true,
            category: true,
            dateReceived: true,
            extractedStatus: true,
            account: {
              select: { email: true, name: true },
            },
          },
          orderBy: { dateReceived: "desc" },
        },
        activities: {
          orderBy: { scheduledAt: "asc" },
        },
      },
      orderBy: { lastActivityAt: "desc" },
    });

    return NextResponse.json({ applications });
  } catch (error) {
    console.error("Failed to fetch applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, currentStatus, notes, positionRole } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing application id" }, { status: 400 });
    }

    const updated = await prisma.application.update({
      where: { id },
      data: {
        currentStatus: currentStatus !== undefined ? currentStatus : undefined,
        notes: notes !== undefined ? notes : undefined,
        positionRole: positionRole !== undefined ? positionRole : undefined,
      },
    });

    return NextResponse.json({ success: true, application: updated });
  } catch (error) {
    console.error("Failed to update application:", error);
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 }
    );
  }
}
