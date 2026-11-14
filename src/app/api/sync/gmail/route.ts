import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchRecruitmentEmails } from "@/lib/google/gmail";
import { classifyAndExtractEmail } from "@/lib/ai/classifier";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const accountId = body.accountId;
    const daysRange = body.daysRange === 15 ? 15 : body.daysRange === 60 ? 60 : body.daysRange === "ALL" ? "ALL" : 30;

    const accounts = accountId
      ? await prisma.account.findMany({ where: { id: accountId } })
      : await prisma.account.findMany();

    if (accounts.length === 0) {
      return NextResponse.json(
        { error: "No connected accounts found to sync" },
        { status: 404 }
      );
    }

    let syncedCount = 0;

    for (const acc of accounts) {
      if (!acc.accessToken) continue;

      await prisma.account.update({
        where: { id: acc.id },
        data: { syncStatus: "SYNCING" },
      });

      try {
        const rawEmails = await fetchRecruitmentEmails(acc.accessToken, acc.refreshToken, 40, daysRange);

        for (const item of rawEmails) {
          const extracted = await classifyAndExtractEmail(
            item.subject,
            item.bodyContent,
            item.senderName,
            item.sender
          );

          if (!extracted.isRecruitment) continue;

          const emailRecord = await prisma.emailMessage.upsert({
            where: { gmailMessageId: item.gmailMessageId },
            update: {
              accountId: acc.id,
              sender: item.sender,
              senderName: item.senderName,
              recipient: item.recipient,
              subject: item.subject,
              dateReceived: item.dateReceived,
              snippet: item.snippet,
              bodyContent: item.bodyContent,
              isRecruitment: true,
              category: extracted.category,
              confidenceScore: extracted.confidenceScore,
              needsReview: extracted.needsReview,
              companyName: extracted.companyName,
              positionRole: extracted.positionRole,
              extractedStatus: extracted.extractedStatus,
              eventDate: extracted.eventDate,
              eventTime: extracted.eventTime,
              timezone: extracted.timezone,
              meetingLink: extracted.meetingLink,
              location: extracted.location,
              deadlineDate: extracted.deadlineDate,
              hrContact: extracted.hrContact,
              nextSteps: extracted.nextSteps,
            },
            create: {
              accountId: acc.id,
              gmailMessageId: item.gmailMessageId,
              gmailThreadId: item.gmailThreadId,
              sender: item.sender,
              senderName: item.senderName,
              recipient: item.recipient,
              subject: item.subject,
              dateReceived: item.dateReceived,
              snippet: item.snippet,
              bodyContent: item.bodyContent,
              isRecruitment: true,
              category: extracted.category,
              confidenceScore: extracted.confidenceScore,
              needsReview: extracted.needsReview,
              companyName: extracted.companyName,
              positionRole: extracted.positionRole,
              extractedStatus: extracted.extractedStatus,
              eventDate: extracted.eventDate,
              eventTime: extracted.eventTime,
              timezone: extracted.timezone,
              meetingLink: extracted.meetingLink,
              location: extracted.location,
              deadlineDate: extracted.deadlineDate,
              hrContact: extracted.hrContact,
              nextSteps: extracted.nextSteps,
            },
          });

          if (extracted.companyName && extracted.positionRole) {
            const app = await prisma.application.upsert({
              where: {
                companyName_positionRole: {
                  companyName: extracted.companyName,
                  positionRole: extracted.positionRole,
                },
              },
              update: {
                currentStatus: extracted.extractedStatus,
                lastActivityAt: item.dateReceived,
              },
              create: {
                companyName: extracted.companyName,
                positionRole: extracted.positionRole,
                currentStatus: extracted.extractedStatus,
                appliedDate: item.dateReceived,
                lastActivityAt: item.dateReceived,
              },
            });

            await prisma.emailMessage.update({
              where: { id: emailRecord.id },
              data: { applicationId: app.id },
            });
          }

          syncedCount++;
        }

        await prisma.account.update({
          where: { id: acc.id },
          data: {
            syncStatus: "SUCCESS",
            lastSyncAt: new Date(),
          },
        });
      } catch (err) {
        console.error(`Sync failed for account ${acc.email}:`, err);
        await prisma.account.update({
          where: { id: acc.id },
          data: { syncStatus: "ERROR" },
        });
      }
    }

    return NextResponse.json({
      success: true,
      syncedEmails: syncedCount,
      accountsSynced: accounts.length,
      daysRange,
    });
  } catch (error) {
    console.error("Sync API error:", error);
    return NextResponse.json(
      { error: "Internal server error while syncing" },
      { status: 500 }
    );
  }
}
