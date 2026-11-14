import { getAuthenticatedGmailClient } from "./auth";

export interface RawGmailEmail {
  gmailMessageId: string;
  gmailThreadId?: string;
  sender: string;
  senderName?: string;
  recipient: string;
  subject: string;
  dateReceived: Date;
  snippet: string;
  bodyContent: string;
}

export const RECRUITMENT_SEARCH_QUERY =
  'internship OR "application received" OR "application status" OR "interview invitation" OR "technical assessment" OR "online assessment" OR "coding test" OR "HackerRank" OR "Codility" OR "OJT" OR "MOA" OR "regret to inform" OR "offer letter" OR "HR" OR "recruiter"';

export async function fetchRecruitmentEmails(
  accessToken: string,
  refreshToken?: string | null,
  maxResults = 35
): Promise<RawGmailEmail[]> {
  const gmail = getAuthenticatedGmailClient(accessToken, refreshToken);

  const listResponse = await gmail.users.messages.list({
    userId: "me",
    q: RECRUITMENT_SEARCH_QUERY,
    maxResults,
  });

  const messages = listResponse.data.messages || [];
  const results: RawGmailEmail[] = [];

  for (const item of messages) {
    if (!item.id) continue;
    try {
      const msg = await gmail.users.messages.get({
        userId: "me",
        id: item.id,
        format: "full",
      });

      const payload = msg.data.payload;
      if (!payload) continue;

      const headers = payload.headers || [];
      const getHeader = (name: string) =>
        headers.find((h) => h.name?.toLowerCase() === name.toLowerCase())?.value || "";

      const fromHeader = getHeader("From");
      const subject = getHeader("Subject") || "No Subject";
      const dateHeader = getHeader("Date");
      const toHeader = getHeader("To") || "";

      // Parse sender name and email
      let senderName = "";
      let senderEmail = fromHeader;
      const match = fromHeader.match(/^(.*?)\s*<(.+?)>$/);
      if (match) {
        senderName = match[1].replace(/["']/g, "").trim();
        senderEmail = match[2].trim();
      }

      // Extract body text
      let bodyContent = "";
      if (payload.parts && payload.parts.length > 0) {
        for (const part of payload.parts) {
          if (part.mimeType === "text/plain" && part.body?.data) {
            bodyContent += Buffer.from(part.body.data, "base64").toString("utf-8");
          }
        }
      } else if (payload.body?.data) {
        bodyContent = Buffer.from(payload.body.data, "base64").toString("utf-8");
      }

      if (!bodyContent) {
        bodyContent = msg.data.snippet || "";
      }

      const dateReceived = dateHeader ? new Date(dateHeader) : new Date();

      results.push({
        gmailMessageId: item.id,
        gmailThreadId: item.threadId || undefined,
        sender: senderEmail,
        senderName: senderName || undefined,
        recipient: toHeader,
        subject,
        dateReceived: isNaN(dateReceived.getTime()) ? new Date() : dateReceived,
        snippet: msg.data.snippet || "",
        bodyContent: bodyContent.trim(),
      });
    } catch (err) {
      console.error(`Failed to fetch Gmail message ${item.id}:`, err);
    }
  }

  return results;
}
