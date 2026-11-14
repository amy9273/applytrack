import { prisma } from "../prisma";
import { classifyAndExtractEmail } from "../ai/classifier";

export interface DemoAccountFixture {
  email: string;
  name: string;
  tag: string;
  avatarUrl: string;
  emails: {
    gmailMessageId: string;
    sender: string;
    senderName: string;
    subject: string;
    dateOffsetHours: number;
    snippet: string;
    body: string;
  }[];
}

export const REAL_ACCOUNTS_FIXTURE: DemoAccountFixture[] = [
  {
    email: "angelamaya.balion@gmail.com",
    name: "Angel Amaya Balion",
    tag: "Work / Primary",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Work",
    emails: [
      {
        gmailMessageId: "real-msg-citco-linkedin-1",
        sender: "jobs-listings@linkedin.com",
        senderName: "LinkedIn Job Applications",
        subject: "Your application was sent to Citco for Software Engineer Intern",
        dateOffsetHours: 72,
        snippet: "Your application for Software Engineer Intern at Citco was sent on LinkedIn with your resume attached...",
        body: `Hi Angel,

Your application for Software Engineer Intern at Citco International Support Services was submitted via LinkedIn Easy Apply.

Position: Software Engineer Intern
Company: Citco International Support Services Limited
Location: One Ayala Avenue, Makati City / Alabang, Muntinlupa
Submitted: November 11, 2026

Citco's talent acquisition team has received your profile and resume. You can track this application in your LinkedIn Jobs dashboard.

Best regards,
The LinkedIn Team`,
      },
      {
        gmailMessageId: "real-msg-citco-2",
        sender: "tech-recruitment@citco.com",
        senderName: "Citco Technical Hiring",
        subject: "[Citco] Technical Assessment Invitation: Software Engineer Intern Coding Challenge",
        dateOffsetHours: 48,
        snippet: "Congratulations! Following the initial review of your LinkedIn application, you have been shortlisted to complete our technical assessment on HackerRank...",
        body: `Hi Angel,

Congratulations! Following the review of your credentials for the Software Engineer Intern position at Citco, we are pleased to invite you to complete our technical assessment.

Assessment Details:
Platform: HackerRank
Sections: Algorithms, Data Structures, and REST API Fundamentals
Duration: 90 minutes
Deadline: Complete by Friday, November 20, 2026 at 11:59 PM (Asia/Manila)

Assessment link: https://www.hackerrank.com/tests/citco-swe-intern-2026

Please ensure you have a quiet environment and stable internet connection before beginning. Late submissions cannot be accommodated.

Best regards,
Citco Technical Hiring Team
The Citco Group Limited`,
      },
      {
        gmailMessageId: "real-msg-citco-3",
        sender: "m.reyes@citco.com",
        senderName: "Maria Reyes (Citco Senior Recruiter)",
        subject: "[Citco] Interview Invitation: Software Engineer Intern Technical Round",
        dateOffsetHours: 14,
        snippet: "We would like to invite you for a virtual technical interview with our Senior Engineering Leads on Monday, November 22, 2026 at 2:00 PM...",
        body: `Dear Angel,

Great job on passing the technical coding challenge on HackerRank! We were impressed with your clean code structure and algorithmic problem-solving.

We would like to invite you for the Technical Interview with our Senior Engineering Leads.

Date: Monday, November 22, 2026
Time: 2:00 PM - 3:00 PM (Asia/Manila)
Format: Virtual via Google Meet
Meeting Link: https://meet.google.com/vqm-xkjr-wzb

The interview will cover your software engineering background, project experience in REST APIs and backend development, and an interactive system design discussion. Please reply to this email to confirm your attendance.

Best regards,
Maria Reyes
Senior Technical Recruiter | Technology & Development
The Citco Group Limited / Citco Philippines`,
      },
      {
        gmailMessageId: "real-msg-maya-linkedin-1",
        sender: "jobs-noreply@linkedin.com",
        senderName: "LinkedIn Notifications",
        subject: "Maya viewed your application for Frontend Developer Intern",
        dateOffsetHours: 36,
        snippet: "Good news! Maya viewed your application for Frontend Developer Intern submitted via LinkedIn...",
        body: `Hi Angel,

Maya Philippines recently viewed your application for Frontend Developer Intern.

Company: Maya
Role: Frontend Developer Intern (React / TypeScript)
Status: Under Review by Recruiter

Keep an eye on your inbox for upcoming assessment invitations or technical interview requests.

Best regards,
LinkedIn Jobs`,
      },
    ],
  },
  {
    email: "angel_balion@dlsl.edu.ph",
    name: "Angel Amaya Balion",
    tag: "DLSL OJT",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=DLSL",
    emails: [
      {
        gmailMessageId: "real-msg-gt-jobstreet-1",
        sender: "notifications@jobstreet.com",
        senderName: "JobStreet by SEEK",
        subject: "Your application for Software Development & QA Intern was delivered to Global Transco",
        dateOffsetHours: 96,
        snippet: "Your JobStreet application has been successfully delivered to Global Transco ICT Solutions...",
        body: `Hi Angel Amaya B. Balion,

Your JobStreet application for Software Development & QA Intern was successfully delivered to Global Transco ICT Solutions.

Employer: Global Transco ICT Solutions (EDSA, Makati City)
Role: Software Development & QA Intern
Application ID: JS-PH-2026-94810

The employer will contact you directly via your De La Salle Lipa university email regarding the next steps in their practicum screening.

Thank you for using JobStreet!
JobStreet Team`,
      },
      {
        gmailMessageId: "real-msg-gt-2",
        sender: "careers@globaltranscoict.com",
        senderName: "GlobalTransco OJT Coordinator",
        subject: "GlobalTransco: OJT / MOA Requirements and Endorsement Letter Request",
        dateOffsetHours: 18,
        snippet: "Hi Angel, following your JobStreet submission, please submit your De La Salle Lipa Endorsement Letter and signed MOA...",
        body: `Hi Angel,

We received your application via JobStreet and are pleased to advance your profile for the Software Development & QA Intern opening!

To proceed with formal onboarding and contract preparation for your practicum hours, please submit the following university compliance documents:

1. Formal Endorsement Letter signed by your College Dean or OJT Practicum Coordinator at De La Salle Lipa
2. Duly signed Memorandum of Agreement (MOA) between De La Salle Lipa and Global Transco ICT Solutions
3. Medical clearance certificate

Please submit these documents by Wednesday, November 25, 2026 so we can issue your official training agreement.

Best regards,
Karla Gomez
OJT & University Relations Specialist
Global Transco ICT Solutions`,
      },
      {
        gmailMessageId: "real-msg-tm-indeed-1",
        sender: "indeedapply@indeed.com",
        senderName: "Indeed Apply",
        subject: "Indeed Application: Data Analyst Intern at Thinking Machines",
        dateOffsetHours: 60,
        snippet: "Your application was submitted to Thinking Machines Data Science on Indeed...",
        body: `Hi Angel,

You applied for Data Analyst Intern at Thinking Machines Data Science through Indeed.

Application Summary:
Company: Thinking Machines Data Science
Position: Data Analyst Intern
Date: November 11, 2026
Resume: Angel_Amaya_Balion_Resume.pdf

Thinking Machines is currently reviewing candidates for their 2026 intern cohort. We will notify you when the employer takes action.

Best,
The Indeed Team`,
      },
    ],
  },
  {
    email: "amy9273.dev@gmail.com",
    name: "Angel Amaya Balion",
    tag: "Personal / Dev",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Dev",
    emails: [
      {
        gmailMessageId: "real-msg-stellar-indeed-1",
        sender: "indeedapply@indeed.com",
        senderName: "Indeed Apply",
        subject: "Indeed Application: Venture Building Intern – Tech at StellarPH",
        dateOffsetHours: 80,
        snippet: "Your application for Venture Building Intern – Tech at StellarPH was successfully submitted...",
        body: `Hi Angel,

Your application for Venture Building Intern – Tech at StellarPH (BGC, Taguig) has been submitted via Indeed.

Company: StellarPH
Position: Venture Building Intern – Tech
Portfolio: GitHub (amy9273)

The hiring team at StellarPH will review your technical projects and reach out directly.

Best,
The Indeed Team`,
      },
      {
        gmailMessageId: "real-msg-stellar-2",
        sender: "tech-lead@stellarph.io",
        senderName: "David Santos (StellarPH)",
        subject: "[StellarPH] Interview Invitation: Venture Building Tech Chat & Architecture",
        dateOffsetHours: 8,
        snippet: "Hi Angel, I saw your Indeed application and GitHub (amy9273), and would love to chat with you on Zoom...",
        body: `Hi Angel,

I had the chance to review your resume, full-stack projects, and GitHub repositories from your Indeed application. I would love to chat with you about your technical background and our open Venture Building Intern – Tech position.

Interview Details:
Date: Friday, November 19, 2026
Time: 10:30 AM - 11:15 AM (Asia/Manila)
Meeting Link: https://us02web.zoom.us/j/84920491823

Looking forward to meeting you!

Best regards,
David Santos
Lead Architect | StellarPH`,
      },
      {
        gmailMessageId: "real-msg-canva-1",
        sender: "recruitment-ph@canva.com",
        senderName: "Canva Philippines Recruiting",
        subject: "Application Update: Product Design / Engineering Intern at Canva",
        dateOffsetHours: 120,
        snippet: "Thank you for taking the time to apply to Canva Philippines. We wanted to share an update...",
        body: `Hi Angel,

Thank you for taking the time to apply for the Product Design Intern position at Canva Philippines.

After careful review of your application alongside many strong portfolios, we regret to inform you that we will not be moving forward with your candidacy for this specific role at this time.

We truly appreciate your interest in Canva and encourage you to keep an eye on our careers page for future software engineering openings.

We wish you all the best in your internship search!

Warm regards,
Canva Philippines Recruiting Team`,
      },
    ],
  },
];

export async function seedDemoInboxes(): Promise<{
  accountsCount: number;
  emailsCount: number;
  applicationsCount: number;
}> {
  const now = new Date();
  let totalEmails = 0;

  for (const fixture of REAL_ACCOUNTS_FIXTURE) {
    const account = await prisma.account.upsert({
      where: { email: fixture.email },
      update: {
        name: `${fixture.name} (${fixture.tag})`,
        avatarUrl: fixture.avatarUrl,
        lastSyncAt: now,
        syncStatus: "SUCCESS",
      },
      create: {
        email: fixture.email,
        name: `${fixture.name} (${fixture.tag})`,
        avatarUrl: fixture.avatarUrl,
        lastSyncAt: now,
        syncStatus: "SUCCESS",
      },
    });

    for (const emailItem of fixture.emails) {
      const emailDate = new Date(now.getTime() - emailItem.dateOffsetHours * 3600 * 1000);

      const extracted = await classifyAndExtractEmail(
        emailItem.subject,
        emailItem.body,
        emailItem.senderName,
        emailItem.sender
      );

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
            sourcePlatform: extracted.sourcePlatform,
            lastActivityAt: emailDate,
          },
          create: {
            companyName: extracted.companyName,
            positionRole: extracted.positionRole,
            currentStatus: extracted.extractedStatus,
            sourcePlatform: extracted.sourcePlatform,
            appliedDate: emailDate,
            lastActivityAt: emailDate,
          },
        });

        await prisma.emailMessage.update({
          where: { id: emailRecord.id },
          data: { applicationId: app.id },
        });

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
    accountsCount: REAL_ACCOUNTS_FIXTURE.length,
    emailsCount: totalEmails,
    applicationsCount: appCount,
  };
}
