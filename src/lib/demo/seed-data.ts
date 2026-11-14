import { prisma } from "../prisma";
import { classifyAndExtractEmail } from "../ai/classifier";

export interface DemoAccountFixture {
  email: string;
  name: string;
  avatarUrl: string;
  emails: {
    gmailMessageId: string;
    sender: string;
    senderName: string;
    subject: string;
    dateOffsetHours: number; // how many hours ago
    snippet: string;
    body: string;
  }[];
}

export const DEMO_ACCOUNTS: DemoAccountFixture[] = [
  {
    email: "angel.balion.work@gmail.com",
    name: "Angel Amaya Balion (Work)",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Work",
    emails: [
      {
        gmailMessageId: "demo-msg-citco-1",
        sender: "careers-ph@citco.com",
        senderName: "Citco Group Careers",
        subject: "[Citco] Application Received: Software Engineer Intern",
        dateOffsetHours: 72,
        snippet: "Thank you for applying for the Software Engineer Intern role at Citco Group Philippines. We have received your application...",
        body: `Dear Angel,

Thank you for your interest in joining Citco Group Philippines! We have successfully received your application for the Software Engineer Intern position in our Technology & Development team in Manila.

Our Talent Acquisition team is currently reviewing your resume and credentials. If your profile matches our requirements, we will reach out with the next steps regarding the technical evaluation.

Position: Software Engineer Intern
Location: BGC, Taguig City (Hybrid)
Reference ID: CITCO-2026-ENG-491

Best regards,
Citco Talent Acquisition Team`,
      },
      {
        gmailMessageId: "demo-msg-citco-2",
        sender: "technical-recruitment@citco.com",
        senderName: "Citco Tech Recruitment",
        subject: "[Citco] Assessment Invitation: Software Engineer Intern Coding Challenge",
        dateOffsetHours: 48,
        snippet: "Congratulations! You have been shortlisted to take the Citco Technical Assessment on HackerRank...",
        body: `Hi Angel,

Congratulations! Following the initial review of your application for the Software Engineer Intern role at Citco, we are pleased to invite you to complete our technical assessment.

Assessment Details:
Platform: HackerRank
Sections: Algorithms, Data Structures, and REST API Fundamentals
Duration: 90 minutes
Deadline: Complete by Friday, November 20, 2026 at 11:59 PM (Asia/Manila)

Assessment link: https://www.hackerrank.com/tests/citco-swe-intern-2026

Please ensure you have a stable internet connection before beginning. Late submissions will not be considered.

Best regards,
Citco Technical Hiring Team`,
      },
      {
        gmailMessageId: "demo-msg-citco-3",
        sender: "m.reyes@citco.com",
        senderName: "Maria Reyes (Citco HR)",
        subject: "[Citco] Interview Invitation: Software Engineer Intern Technical Round",
        dateOffsetHours: 12,
        snippet: "We would like to invite you for a virtual technical interview on November 22, 2026 at 2:00 PM...",
        body: `Dear Angel,

Great job on passing the technical coding challenge! We were impressed with your problem-solving approaches.

We would like to invite you for the Technical Interview with our Senior Engineering Leads.

Date: Monday, November 22, 2026
Time: 2:00 PM - 3:00 PM (Asia/Manila)
Format: Virtual via Google Meet
Meeting Link: https://meet.google.com/vqm-xkjr-wzb

The interview will cover your software engineering background, project experience, and an interactive system design discussion. Please reply to this email to confirm your attendance.

Best regards,
Maria Reyes
Senior Technical Recruiter | Citco Philippines`,
      },
      {
        gmailMessageId: "demo-msg-maya-1",
        sender: "talent@maya.ph",
        senderName: "Maya Careers",
        subject: "Maya Careers: Online Assessment Invitation for Frontend Developer Intern",
        dateOffsetHours: 36,
        snippet: "Thank you for applying to Maya. You are invited to take the Maya Codility Assessment...",
        body: `Hello Angel,

Thank you for your application for the Frontend Developer Intern role at Maya!

As the next step in our recruitment process, please complete the online technical test on Codility.

Test: Frontend Developer Intern Challenge (React / TypeScript / CSS)
Duration: 75 minutes
Deadline: Sunday, November 21, 2026 at 6:00 PM (Asia/Manila)

Link to test: https://app.codility.com/c/run/maya-fe-intern-2026

Good luck!
Maya Talent Acquisition`,
      },
    ],
  },
  {
    email: "angel.balion.up@gmail.com",
    name: "Angel Amaya Balion (University)",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=University",
    emails: [
      {
        gmailMessageId: "demo-msg-gt-1",
        sender: "internships@globaltransco.com",
        senderName: "GlobalTransco HR",
        subject: "GlobalTransco Application Received: Full Stack Web Intern",
        dateOffsetHours: 96,
        snippet: "Thank you for applying to GlobalTransco. We have received your CV and cover letter...",
        body: `Dear Angel,

Thank you for applying for the Full Stack Web Intern opening at GlobalTransco.

We have received your application and resume. Our recruitment team is evaluating applications for our upcoming 2026 internship cohort.

We will keep you informed of your application status over the next few business days.

Warm regards,
GlobalTransco People & Culture`,
      },
      {
        gmailMessageId: "demo-msg-gt-2",
        sender: "hr-ojt@globaltransco.com",
        senderName: "GlobalTransco OJT Coordinator",
        subject: "GlobalTransco: OJT / MOA Requirements and Endorsement Letter Request",
        dateOffsetHours: 18,
        snippet: "Please submit your University Endorsement Letter and signed Memorandum of Agreement (MOA)...",
        body: `Hi Angel,

We are currently advancing your profile for the Full Stack Web Intern role!

To proceed with your formal onboarding and internship contract preparation, please submit the following university compliance documents:

1. Formal Endorsement Letter signed by your College Dean or OJT Practicum Coordinator
2. Duly signed Memorandum of Agreement (MOA) between your university and GlobalTransco Inc.
3. Medical clearance certificate

Please submit these documents by November 25, 2026 so we can issue your official training agreement.

Best regards,
Karla Gomez
OJT & University Relations Specialist
GlobalTransco Inc.`,
      },
      {
        gmailMessageId: "demo-msg-tm-1",
        sender: "hiring@thinkingmachin.es",
        senderName: "Thinking Machines Hiring",
        subject: "Application Update: Data Analyst Intern at Thinking Machines",
        dateOffsetHours: 60,
        snippet: "We wanted to share a brief update on your Data Analyst Intern application...",
        body: `Hi Angel,

Thank you for your patience while we review candidates for the Data Analyst Intern position.

Our engineering and data teams are currently finalizing the shortlist for round 1 interviews. We will provide a definitive update by the end of next week.

Thank you for your interest in Thinking Machines!

Best,
The Thinking Machines Team`,
      },
    ],
  },
  {
    email: "angel.personal.tech@gmail.com",
    name: "Angel Amaya Balion (Personal)",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Personal",
    emails: [
      {
        gmailMessageId: "demo-msg-stellar-1",
        sender: "careers@stellarph.io",
        senderName: "StellarPH Careers",
        subject: "[StellarPH] Software Engineer Intern - Application Received",
        dateOffsetHours: 80,
        snippet: "We received your application for Software Engineer Intern at StellarPH. Thank you for your interest...",
        body: `Hi Angel,

Thank you for applying to StellarPH for the Software Engineer Intern role.

We build modern SaaS and cloud applications, and we love seeing passion for technology in our applicants. Your resume has been submitted to the engineering leads.

We will contact you shortly if your profile aligns with our current openings.

Best,
StellarPH Talent Team`,
      },
      {
        gmailMessageId: "demo-msg-stellar-2",
        sender: "tech-lead@stellarph.io",
        senderName: "David Santos (StellarPH)",
        subject: "[StellarPH] Interview Invitation: Software Engineer Intern Technical Chat",
        dateOffsetHours: 8,
        snippet: "We would like to invite you to an online technical interview on Friday, November 19, 2026 at 10:30 AM...",
        body: `Hi Angel,

I had the chance to review your resume and projects, and I would love to chat with you about your background and our open Software Engineer Intern position.

Interview Details:
Date: Friday, November 19, 2026
Time: 10:30 AM - 11:15 AM (Asia/Manila)
Link: https://us02web.zoom.us/j/84920491823

Looking forward to meeting you!

Best regards,
David Santos
Lead Architect | StellarPH`,
      },
      {
        gmailMessageId: "demo-msg-canva-1",
        sender: "recruitment-ph@canva.com",
        senderName: "Canva Philippines Recruiting",
        subject: "Application Update: Product Design Intern at Canva",
        dateOffsetHours: 120,
        snippet: "Thank you for taking the time to apply to Canva Philippines...",
        body: `Hi Angel,

Thank you for taking the time to apply for the Product Design Intern position at Canva Philippines.

After careful review of your application alongside many strong portfolios, we regret to inform you that we will not be moving forward with your candidacy for this specific role at this time.

We truly appreciate your interest in Canva and encourage you to keep an eye on our careers page for future software engineering and design openings.

We wish you all the best in your internship search!

Warm regards,
Canva Philippines Recruiting Team`,
      },
    ],
  },
];

/**
 * Seeds or re-seeds the 3 demo inboxes and executes classification & entity extraction
 */
export async function seedDemoInboxes(): Promise<{
  accountsCount: number;
  emailsCount: number;
  applicationsCount: number;
}> {
  const now = new Date();

  let totalEmails = 0;

  for (const fixture of DEMO_ACCOUNTS) {
    // Upsert Account
    const account = await prisma.account.upsert({
      where: { email: fixture.email },
      update: {
        name: fixture.name,
        avatarUrl: fixture.avatarUrl,
        lastSyncAt: now,
        syncStatus: "SUCCESS",
      },
      create: {
        email: fixture.email,
        name: fixture.name,
        avatarUrl: fixture.avatarUrl,
        lastSyncAt: now,
        syncStatus: "SUCCESS",
      },
    });

    for (const emailItem of fixture.emails) {
      const emailDate = new Date(now.getTime() - emailItem.dateOffsetHours * 3600 * 1000);

      // Perform extraction
      const extracted = await classifyAndExtractEmail(
        emailItem.subject,
        emailItem.body,
        emailItem.senderName,
        emailItem.sender
      );

      // Upsert EmailMessage
      const emailRecord = await prisma.emailMessage.upsert({
        where: { gmailMessageId: emailItem.gmailMessageId },
        update: {
          accountId: account.id,
          sender: emailItem.sender,
          senderName: emailItem.senderName,
          recipient: fixture.email,
          subject: emailItem.subject,
          dateReceived: emailDate,
          snippet: emailItem.snippet,
          bodyContent: emailItem.body,
          isRecruitment: extracted.isRecruitment,
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
          accountId: account.id,
          gmailMessageId: emailItem.gmailMessageId,
          sender: emailItem.sender,
          senderName: emailItem.senderName,
          recipient: fixture.email,
          subject: emailItem.subject,
          dateReceived: emailDate,
          snippet: emailItem.snippet,
          bodyContent: emailItem.body,
          isRecruitment: extracted.isRecruitment,
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

      // Automatically cluster into Application record
      if (extracted.isRecruitment && extracted.companyName && extracted.positionRole) {
        const app = await prisma.application.upsert({
          where: {
            companyName_positionRole: {
              companyName: extracted.companyName,
              positionRole: extracted.positionRole,
            },
          },
          update: {
            currentStatus: extracted.extractedStatus,
            lastActivityAt: emailDate,
          },
          create: {
            companyName: extracted.companyName,
            positionRole: extracted.positionRole,
            currentStatus: extracted.extractedStatus,
            appliedDate: emailDate,
            lastActivityAt: emailDate,
          },
        });

        // Link email to application
        await prisma.emailMessage.update({
          where: { id: emailRecord.id },
          data: { applicationId: app.id },
        });

        // If email has scheduled event or deadline, create activity
        if (extracted.eventDate || extracted.deadlineDate) {
          const scheduledAt = extracted.eventDate || extracted.deadlineDate!;
          const activityType = extracted.category?.includes("Interview")
            ? "INTERVIEW"
            : extracted.category?.includes("Assessment")
            ? "ASSESSMENT"
            : "DEADLINE";

          const existingAct = await prisma.activity.findFirst({
            where: {
              applicationId: app.id,
              sourceEmailId: emailRecord.id,
            },
          });

          if (!existingAct) {
            await prisma.activity.create({
              data: {
                applicationId: app.id,
                type: activityType,
                title: `${extracted.category}: ${extracted.companyName}`,
                scheduledAt,
                timezone: extracted.timezone,
                meetingLink: extracted.meetingLink,
                status: "SCHEDULED",
                sourceEmailId: emailRecord.id,
              },
            });
          }
        }
      }

      totalEmails++;
    }
  }

  const appCount = await prisma.application.count();

  return {
    accountsCount: DEMO_ACCOUNTS.length,
    emailsCount: totalEmails,
    applicationsCount: appCount,
  };
}
