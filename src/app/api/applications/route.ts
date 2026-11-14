import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isOwnerSession } from "@/lib/auth/session";
import { VISITOR_APPLICATIONS, VISITOR_EMAILS } from "@/lib/data/visitorShowcase";

export async function GET(request: NextRequest) {
  try {
    const isOwner = isOwnerSession(request);
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");

    // 1. Visitor Mode: Serve sanitized dummy applications with linked emails
    if (!isOwner) {
      let applications = VISITOR_APPLICATIONS.map((app) => ({
        ...app,
        emails: VISITOR_EMAILS.filter((e) => e.companyName.toLowerCase() === app.companyName.toLowerCase()).map((e) => ({
          id: e.id,
          subject: e.subject,
          category: e.category,
          dateReceived: e.dateReceived,
          extractedStatus: e.extractedStatus,
          account: {
            email: e.account.email,
            name: e.account.name,
          },
        })),
      }));

      if (status && status !== "ALL") {
        applications = applications.filter((a) => a.currentStatus === status);
      }
      return NextResponse.json({
        applications,
        mode: "VISITOR",
        isOwner: false,
      });
    }

    // 2. Owner Mode: Query real database
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

    return NextResponse.json({
      applications,
      mode: "OWNER",
      isOwner: true,
    });
  } catch (error) {
    console.error("Failed to fetch applications:", error);
    // Graceful fallback to visitor showcase data
    return NextResponse.json({
      applications: VISITOR_APPLICATIONS,
      mode: "VISITOR",
      isOwner: false,
    });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const isOwner = isOwnerSession(request);
    const body = await request.json();
    const { id, currentStatus, notes, positionRole } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing application id" }, { status: 400 });
    }

    if (!isOwner) {
      // Simulate status change in UI for visitor without affecting real DB
      return NextResponse.json({
        success: true,
        application: { id, currentStatus, notes, positionRole },
        simulated: true,
      });
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

export async function POST(request: NextRequest) {
  try {
    const isOwner = isOwnerSession(request);
    const body = await request.json();
    const { companyName, positionRole, currentStatus, sourcePlatform, notes } = body;

    if (!companyName || !positionRole) {
      return NextResponse.json(
        { error: "Company name and position role are required" },
        { status: 400 }
      );
    }

    if (!isOwner) {
      return NextResponse.json({
        success: true,
        application: {
          id: `demo_${Date.now()}`,
          companyName,
          positionRole,
          currentStatus: currentStatus || "APPLIED",
          sourcePlatform: sourcePlatform || "DIRECT",
          notes,
          appliedDate: new Date().toISOString(),
          lastActivityAt: new Date().toISOString(),
          _count: { emails: 0, activities: 0 },
          activities: [],
        },
        simulated: true,
      });
    }

    const application = await prisma.application.create({
      data: {
        companyName,
        positionRole,
        currentStatus: currentStatus || "APPLIED",
        sourcePlatform: sourcePlatform || "DIRECT",
        notes,
      },
    });

    return NextResponse.json({ success: true, application });
  } catch (error) {
    console.error("Failed to create application:", error);
    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 }
    );
  }
}
