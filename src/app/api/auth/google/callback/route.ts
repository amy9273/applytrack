import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForTokens } from "@/lib/google/auth";
import { fetchRecruitmentEmails } from "@/lib/google/gmail";
import { classifyAndExtractEmail } from "@/lib/ai/classifier";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (error || !code) {
    console.error("OAuth callback error:", error);
    return NextResponse.redirect(`${baseUrl}?auth_error=${encodeURIComponent(error || "missing_code")}`);
  }

  try {
    const { tokens, email, name, picture } = await exchangeCodeForTokens(code);

    if (!email) {
      return NextResponse.redirect(`${baseUrl}?auth_error=no_email_provided`);
    }

    const expiryDate = tokens.expiry_date ? new Date(tokens.expiry_date) : null;

    // Save or update account
    const account = await prisma.account.upsert({
      where: { email },
      update: {
        name: name || undefined,
        avatarUrl: picture || undefined,
        accessToken: tokens.access_token || undefined,
        refreshToken: tokens.refresh_token || undefined,
        tokenExpiry: expiryDate,
        syncStatus: "SYNCING",
      },
      create: {
        email,
        name: name || "Connected Gmail Account",
        avatarUrl: picture,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        tokenExpiry: expiryDate,
        syncStatus: "SYNCING",
      },
    });

    // Execute initial scan if access_token is present
    if (tokens.access_token) {
      try {
        const rawEmails = await fetchRecruitmentEmails(tokens.access_token, tokens.refresh_token, 30);

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
              accountId: account.id,
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
              sourcePlatform: extracted.sourcePlatform,
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
              accountId: account.id,
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
              sourcePlatform: extracted.sourcePlatform,
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

          // Application clustering
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
        }

        await prisma.account.update({
          where: { id: account.id },
          data: {
            syncStatus: "SUCCESS",
            lastSyncAt: new Date(),
          },
        });
      } catch (syncError) {
        console.error("Initial Gmail sync failed:", syncError);
        await prisma.account.update({
          where: { id: account.id },
          data: { syncStatus: "ERROR" },
        });
      }
    }

    return NextResponse.redirect(`${baseUrl}?auth_success=true&account=${encodeURIComponent(email)}`);
  } catch (error) {
    console.error("Failed to complete OAuth callback:", error);
    return NextResponse.redirect(`${baseUrl}?auth_error=exchange_failed`);
  }
}
