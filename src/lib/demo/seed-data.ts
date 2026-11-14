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
    dateOffsetHours: number; // how many hours ago
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
        gmailMessageId: "real-msg-citco-1",
        sender: "careers-ph@citco.com",
        senderName: "Citco Group Careers",
        subject: "[Citco] Application Received: Software Engineer Intern (Makati / Alabang)",
        dateOffsetHours: 72,
        snippet: "Dear Angel, thank you for applying for the Software Engineer Intern opening at Citco Group Philippines. We have received your CV...",
        body: `Dear Angel Amaya B. Balion,

Thank you for your interest in joining Citco International Support Services Limited / The Citco Group! We have successfully received your application and resume for the Software Engineer Intern role in our Technology & Development division in Manila (One Ayala / Alabang).

Our Talent Acquisition and Engineering hiring managers are currently reviewing your credentials and programming background. If your qualifications match our team requirements, we will reach out with details regarding the technical assessment.

Applicant: Angel Amaya B. Balion
School: De La Salle Lipa (BS Information Technology)
Position: Software Engineer Intern
Location: One Ayala Avenue, Makati City / Alabang, Muntinlupa (Hybrid)
Reference ID: CITCO-2026-ENG-491

Best regards,
Talent Acquisition & Technology Hiring Team
Citco International Support Services Limited`,
      },
      {
        gmailMessageId: "real-msg-citco-2",
        sender: "tech-recruitment@citco.com",
        senderName: "Citco Technical Hiring",
        subject: "[Citco] Technical Assessment Invitation: Software Engineer Intern Coding Challenge",
        dateOffsetHours: 48,
        snippet: "Congratulations! Following the initial review of your application, you have been shortlisted to complete our technical assessment on HackerRank...",
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
        gmailMessageId: "real-msg-maya-1",
        sender: "talent@maya.ph",
        senderName: "Maya Careers",
        subject: "Maya Careers: Online Assessment Invitation for Frontend Developer Intern",
        dateOffsetHours: 36,
        snippet: "Thank you for applying to Maya Philippines. You are invited to take the Maya Codility Assessment for Frontend Developer Intern...",
        body: `Hello Angel,

Thank you for your application for the Frontend Developer Intern role at Maya Philippines!

As the next step in our recruitment process, please complete the online technical assessment on Codility.

Test: Frontend Developer Intern Challenge (React / TypeScript / CSS)
Duration: 75 minutes
Deadline: Sunday, November 21, 2026 at 6:00 PM (Asia/Manila)

Link to test: https://app.codility.com/c/run/maya-fe-intern-2026

Good luck!
Maya Talent Acquisition Team`,
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
        gmailMessageId: "real-msg-gt-1",
        sender: "careers@globaltranscoict.com",
        senderName: "Global Transco ICT Solutions",
        subject: "GlobalTransco Application Received: Software Development & QA Intern",
        dateOffsetHours: 96,
        snippet: "Dear Angel, thank you for applying for the Software Development & QA Intern position at Global Transco ICT Solutions...",
        body: `Dear Angel Amaya B. Balion,

Thank you for applying for the Software Development & QA Intern opening at Global Transco ICT Solutions (EDSA, Makati City).

We have received your resume and cover letter. Our recruitment team is evaluating applications for our upcoming 2026 practicum cohort.

We will keep you informed of your application status over the next few business days.

Warm regards,
Hiring & Talent Acquisition Team
Global Transco ICT Solutions
careers@globaltranscoict.com`,
      },
      {
        gmailMessageId: "real-msg-gt-2",
        sender: "careers@globaltranscoict.com",
        senderName: "GlobalTransco OJT Coordinator",
        subject: "GlobalTransco: OJT / MOA Requirements and Endorsement Letter Request",
        dateOffsetHours: 18,
        snippet: "Hi Angel, to proceed with your onboarding, please submit your De La Salle Lipa Endorsement Letter and signed MOA...",
        body: `Hi Angel,

We are pleased to inform you that we are advancing your profile for the Software Development & QA Intern position!

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
        gmailMessageId: "real-msg-tm-1",
        sender: "hiring@thinkingmachin.es",
        senderName: "Thinking Machines Hiring",
        subject: "Application Update: Data Analyst Intern at Thinking Machines",
        dateOffsetHours: 60,
        snippet: "Hi Angel, thank you for your patience while we review candidates for the Data Analyst Intern position...",
        body: `Hi Angel,

Thank you for your patience while we review candidates for the Data Analyst Intern position.

Our engineering and data teams are currently finalizing the shortlist for round 1 interviews. We will provide a definitive update by the end of next week.

Thank you for your interest in Thinking Machines Data Science!

Best,
The Thinking Machines Team`,
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
        gmailMessageId: "real-msg-stellar-1",
        sender: "careers@stellarph.io",
        senderName: "StellarPH Careers",
        subject: "[StellarPH] Application Received: Venture Building Intern – Tech",
        dateOffsetHours: 80,
        snippet: "Hi Angel, thank you for applying to StellarPH for the Venture Building Intern – Tech position in BGC Taguig...",
        body: `Hi Angel Amaya,

Thank you for applying to StellarPH for the Venture Building Intern – Tech role.

We build modern SaaS and cloud applications, and we love seeing passion for technology and software architecture in our applicants. Your resume and GitHub profile (amy9273) have been submitted to our venture tech leads.

We will contact you shortly if your profile aligns with our current openings.

Best,
Hiring Team
StellarPH (BGC, Taguig)`,
      },
      {
        gmailMessageId: "real-msg-stellar-2",
        sender: "tech-lead@stellarph.io",
        senderName: "David Santos (StellarPH)",
        subject: "[StellarPH] Interview Invitation: Venture Building Tech Chat & Architecture",
        dateOffsetHours: 8,
        snippet: "Hi Angel, I would love to chat with you about your background, APIs, and our open Venture Building Intern role on Zoom...",
        body: `Hi Angel,

I had the chance to review your resume, full-stack projects, and GitHub repositories, and I would love to chat with you about your technical background and our open Venture Building Intern – Tech position.

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
