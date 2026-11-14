import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isOwnerSession } from "@/lib/auth/session";
import { VISITOR_EMAILS } from "@/lib/data/visitorShowcase";

export async function GET(request: NextRequest) {
  try {
    const isOwner = isOwnerSession(request);
    const searchParams = request.nextUrl.searchParams;
    const accountId = searchParams.get("accountId");
    const category = searchParams.get("category");
    const company = searchParams.get("company");
    const needsReview = searchParams.get("needsReview");
    const search = searchParams.get("search");
    const platform = searchParams.get("platform");

    // 1. Visitor Mode: Serve sanitized dummy showcase dataset
    if (!isOwner) {
      let emails = [...VISITOR_EMAILS];

      if (accountId && accountId !== "ALL") {
        emails = emails.filter((e) => e.accountId === accountId);
      }
      if (category && category !== "ALL") {
        emails = emails.filter((e) => e.category === category);
      }
      if (company && company !== "ALL") {
        emails = emails.filter((e) => e.companyName === company);
      }
      if (platform && platform !== "ALL") {
        emails = emails.filter((e) => (e.sourcePlatform || "DIRECT") === platform);
      }
      if (needsReview === "true") {
        emails = emails.filter((e) => e.needsReview);
      }
      if (search && search.trim()) {
        const q = search.toLowerCase();
        emails = emails.filter(
          (e) =>
            e.subject.toLowerCase().includes(q) ||
            e.companyName.toLowerCase().includes(q) ||
            e.positionRole.toLowerCase().includes(q) ||
            e.snippet.toLowerCase().includes(q)
        );
      }

      return NextResponse.json({
        emails,
        mode: "VISITOR",
        isOwner: false,
      });
    }

    // 2. Owner Mode: Query live database
    const where: any = {
      isRecruitment: true,
    };

    if (accountId && accountId !== "ALL") {
      where.accountId = accountId;
    }

    if (category && category !== "ALL") {
      where.category = category;
    }

    if (company && company !== "ALL") {
      where.companyName = company;
    }

    if (platform && platform !== "ALL") {
      where.sourcePlatform = platform;
    }

    if (needsReview === "true") {
      where.needsReview = true;
    }

    if (search) {
      where.OR = [
        { subject: { contains: search } },
        { companyName: { contains: search } },
        { positionRole: { contains: search } },
        { snippet: { contains: search } },
      ];
    }

    const emails = await prisma.emailMessage.findMany({
      where,
      include: {
        account: {
          select: {
            id: true,
            email: true,
            name: true,
            avatarUrl: true,
          },
        },
        application: true,
      },
      orderBy: {
        dateReceived: "desc",
      },
    });

    return NextResponse.json({
      emails,
      mode: "OWNER",
      isOwner: true,
    });
  } catch (error) {
    console.error("Failed to fetch emails:", error);
    // Fallback gracefully to visitor dummy dataset
    return NextResponse.json({
      emails: VISITOR_EMAILS,
      mode: "VISITOR",
      isOwner: false,
    });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const isOwner = isOwnerSession(request);
    const body = await request.json();
    const { id, companyName, positionRole, category, extractedStatus, needsReview } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing email id" }, { status: 400 });
    }

    if (!isOwner) {
      // Allow visitor to simulate editing in UI without modifying real DB
      return NextResponse.json({
        success: true,
        email: { id, companyName, positionRole, category, extractedStatus, needsReview },
        simulated: true,
      });
    }

    const updated = await prisma.emailMessage.update({
      where: { id },
      data: {
        companyName: companyName !== undefined ? companyName : undefined,
        positionRole: positionRole !== undefined ? positionRole : undefined,
        category: category !== undefined ? category : undefined,
        extractedStatus: extractedStatus !== undefined ? extractedStatus : undefined,
        needsReview: needsReview !== undefined ? needsReview : undefined,
      },
    });

    return NextResponse.json({ success: true, email: updated });
  } catch (error) {
    console.error("Failed to update email record:", error);
    return NextResponse.json(
      { error: "Failed to update email record" },
      { status: 500 }
    );
  }
}
