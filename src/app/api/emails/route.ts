import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const accountId = searchParams.get("accountId");
    const category = searchParams.get("category");
    const company = searchParams.get("company");
    const needsReview = searchParams.get("needsReview");
    const search = searchParams.get("search");

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

    return NextResponse.json({ emails });
  } catch (error) {
    console.error("Failed to fetch emails:", error);
    return NextResponse.json(
      { error: "Failed to fetch recruitment emails" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, companyName, positionRole, category, extractedStatus, needsReview } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing email id" }, { status: 400 });
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
