export interface VisitorAccount {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  lastSyncAt: string;
  syncStatus: string;
  _count: {
    emails: number;
  };
}

export interface VisitorEmail {
  id: string;
  accountId: string;
  account: {
    id: string;
    email: string;
    name: string | null;
  };
  gmailMessageId: string;
  sender: string;
  senderName: string;
  recipient: string;
  subject: string;
  dateReceived: string;
  snippet: string;
  bodyContent: string;
  isRecruitment: boolean;
  category: string;
  confidenceScore: number;
  needsReview: boolean;
  companyName: string;
  positionRole: string;
  extractedStatus: string;
  sourcePlatform: "DIRECT" | "LINKEDIN" | "JOBSTREET" | "INDEED";
  eventDate?: string | null;
  eventTime?: string | null;
  timezone?: string;
  meetingLink?: string | null;
  location?: string | null;
  deadlineDate?: string | null;
  hrContact?: string | null;
  nextSteps?: string | null;
  instructions?: string | null;
}

export interface VisitorApplication {
  id: string;
  companyName: string;
  positionRole: string;
  currentStatus: "APPLIED" | "ASSESSMENT" | "INTERVIEW" | "OFFERED" | "REJECTED";
  sourcePlatform: "DIRECT" | "LINKEDIN" | "JOBSTREET" | "INDEED";
  appliedDate: string;
  lastActivityAt: string;
  notes?: string;
  _count: {
    emails: number;
    activities: number;
  };
  activities: Array<{
    id: string;
    type: string;
    title: string;
    scheduledAt: string;
    meetingLink?: string | null;
    status: string;
  }>;
}

export const VISITOR_ACCOUNTS: VisitorAccount[] = [
  {
    id: "acc_demo_work",
    email: "candidate.work@gmail.com",
    name: "Alex Santos (Primary / Work)",
    avatarUrl: null,
    lastSyncAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    syncStatus: "SUCCESS",
    _count: { emails: 5 },
  },
  {
    id: "acc_demo_univ",
    email: "alex.santos@university.edu.ph",
    name: "Alex Santos (University OJT)",
    avatarUrl: null,
    lastSyncAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    syncStatus: "SUCCESS",
    _count: { emails: 4 },
  },
  {
    id: "acc_demo_dev",
    email: "alex.tech.dev@gmail.com",
    name: "Alex Santos (Personal / Dev)",
    avatarUrl: null,
    lastSyncAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    syncStatus: "SUCCESS",
    _count: { emails: 3 },
  },
];

export const VISITOR_EMAILS: VisitorEmail[] = [
  {
    id: "v_email_01",
    accountId: "acc_demo_work",
    account: { id: "acc_demo_work", email: "candidate.work@gmail.com", name: "Alex Santos" },
    gmailMessageId: "msg_v_01",
    sender: "Canva University Talent <recruitment-sea@canva.com>",
    senderName: "Canva University Recruiting",
    recipient: "candidate.work@gmail.com",
    subject: "Invitation to Technical Interview: Frontend Engineering Intern (Canva Philippines)",
    dateReceived: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
    snippet: "Hi Alex, we were impressed by your technical assessment score and would like to invite you for a 45-minute technical discussion...",
    bodyContent: `Hi Alex,

Congratulations on passing the HackerRank coding challenge! We were thoroughly impressed by your problem-solving approach and component design.

We would like to invite you to a 45-minute Technical Interview with our Senior Engineering Leads.

Date: November 20, 2026
Time: 2:00 PM - 2:45 PM (Asia/Manila)
Google Meet Link: https://meet.google.com/cnv-tech-demo

What to expect:
- Deep dive into React state management & browser performance
- Brief walkthrough of one of your featured projects
- Q&A with the team

Please confirm your availability by responding to this email.

Best regards,
Canva University Talent Team`,
    isRecruitment: true,
    category: "Interview Invitation",
    confidenceScore: 0.98,
    needsReview: false,
    companyName: "Canva",
    positionRole: "Frontend Engineering Intern",
    extractedStatus: "INTERVIEW",
    sourcePlatform: "DIRECT",
    eventDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6).toISOString(),
    eventTime: "2:00 PM - 2:45 PM",
    timezone: "Asia/Manila",
    meetingLink: "https://meet.google.com/cnv-tech-demo",
    location: "Google Meet",
    hrContact: "recruitment-sea@canva.com",
    nextSteps: "Review React component rendering and state optimization before the interview.",
  },
  {
    id: "v_email_02",
    accountId: "acc_demo_dev",
    account: { id: "acc_demo_dev", email: "alex.tech.dev@gmail.com", name: "Alex Santos" },
    gmailMessageId: "msg_v_02",
    sender: "Thinking Machines People Team <careers@thinkingmachin.es>",
    senderName: "Thinking Machines",
    recipient: "alex.tech.dev@gmail.com",
    subject: "Thinking Machines: AI / ML Engineer Intern - Technical Take-Home Challenge",
    dateReceived: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    snippet: "Hi Alex, thank you for applying to the AI / ML Engineer Internship role via LinkedIn. The next step is a practical coding challenge...",
    bodyContent: `Hi Alex,

Thank you for your application via LinkedIn for the AI/ML Engineer Intern position at Thinking Machines Data Science!

As our next step, we would like to invite you to complete our technical take-home challenge:
Challenge Link: https://assessment.hackerrank.com/thinkingmachines-intern-eval

Deadline: November 24, 2026, 11:59 PM (Asia/Manila)
Estimated duration: 90 - 120 minutes

The evaluation covers data preprocessing, Python pipeline design, and basic model evaluation.

Feel free to reply if you encounter any technical difficulties.

Best,
The People Team @ Thinking Machines`,
    isRecruitment: true,
    category: "Assessment Invitation",
    confidenceScore: 0.97,
    needsReview: false,
    companyName: "Thinking Machines",
    positionRole: "AI / ML Engineer Intern",
    extractedStatus: "ASSESSMENT",
    sourcePlatform: "LINKEDIN",
    deadlineDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString(),
    meetingLink: "https://assessment.hackerrank.com/thinkingmachines-intern-eval",
    hrContact: "careers@thinkingmachin.es",
    instructions: "Complete the HackerRank challenge before November 24.",
  },
  {
    id: "v_email_03",
    accountId: "acc_demo_univ",
    account: { id: "acc_demo_univ", email: "alex.santos@university.edu.ph", name: "Alex Santos" },
    gmailMessageId: "msg_v_03",
    sender: "StellarPH Talent Acquisition <internships@stellarph.com>",
    senderName: "StellarPH Recruitment",
    recipient: "alex.santos@university.edu.ph",
    subject: "StellarPH: Software Development & QA Intern - OJT Endorsement & MOA Notice",
    dateReceived: new Date(Date.now() - 1000 * 60 * 60 * 40).toISOString(),
    snippet: "Hi Alex, we received your application via JobStreet and are pleased to advance your candidacy. Please provide your university endorsement...",
    bodyContent: `Hi Alex,

We received your application via JobStreet for our Software Development & QA Internship program!

To proceed with contract drafting and practicum endorsement for your required 480 hours, please prepare and return:
1. University Endorsement Letter signed by your College Dean or Practicum Coordinator
2. Duly signed Memorandum of Agreement (MOA) between your University and StellarPH Solutions
3. Valid Student ID and Certificate of Registration

Please submit these requirements to internships@stellarph.com on or before November 28, 2026.

Warm regards,
StellarPH Talent Acquisition Team`,
    isRecruitment: true,
    category: "OJT / MOA Requirements",
    confidenceScore: 0.99,
    needsReview: false,
    companyName: "StellarPH",
    positionRole: "Software Development & QA Intern",
    extractedStatus: "APPLIED",
    sourcePlatform: "JOBSTREET",
    deadlineDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
    hrContact: "internships@stellarph.com",
    nextSteps: "Request university endorsement letter and MOA template from Practicum Coordinator.",
  },
  {
    id: "v_email_04",
    accountId: "acc_demo_work",
    account: { id: "acc_demo_work", email: "candidate.work@gmail.com", name: "Alex Santos" },
    gmailMessageId: "msg_v_04",
    sender: "Maya Early Careers <talent-ops@maya.ph>",
    senderName: "Maya Philippines",
    recipient: "candidate.work@gmail.com",
    subject: "Application Confirmation: Backend Developer Intern (Fintech & Cloud) - Maya",
    dateReceived: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
    snippet: "Thank you for applying to Maya! We have received your application for Backend Developer Intern and our engineering team is reviewing it...",
    bodyContent: `Hello Alex,

Thank you for your interest in joining Maya as a Backend Developer Intern!

We have successfully received your application submitted through our careers portal. Our engineering recruitment team is reviewing your profile and GitHub projects. If your background matches our upcoming intern cohort, we will reach out with the next steps.

Application ID: MAYA-INTERN-2026-8942
Position: Backend Developer Intern
Location: Mandaluyong / Hybrid

Regards,
Maya Early Careers Team`,
    isRecruitment: true,
    category: "Application Confirmation",
    confidenceScore: 0.95,
    needsReview: false,
    companyName: "Maya",
    positionRole: "Backend Developer Intern",
    extractedStatus: "APPLIED",
    sourcePlatform: "DIRECT",
    hrContact: "talent-ops@maya.ph",
  },
  {
    id: "v_email_05",
    accountId: "acc_demo_work",
    account: { id: "acc_demo_work", email: "candidate.work@gmail.com", name: "Alex Santos" },
    gmailMessageId: "msg_v_05",
    sender: "Citco Group Talent Acquisition <careers-ph@citco.com>",
    senderName: "Citco Group",
    recipient: "candidate.work@gmail.com",
    subject: "Citco Group: Final Interview Invitation - Data & Application Systems Intern",
    dateReceived: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    snippet: "Dear Alex, following your successful technical discussion, we would like to invite you for a Final Culture & Team Interview...",
    bodyContent: `Dear Alex,

Following your successful technical interview last week, we are delighted to invite you to the Final Round Interview for the Data & Application Systems Intern role at Citco Group Philippines.

Meeting Details:
Date: November 22, 2026
Time: 10:00 AM - 10:45 AM (Asia/Manila)
Platform: Zoom Meeting
Join Link: https://citco.zoom.us/j/84920194821

You will be speaking with our APAC Systems Director.

Best regards,
Citco Talent Acquisition APAC`,
    isRecruitment: true,
    category: "Final Interview",
    confidenceScore: 0.99,
    needsReview: false,
    companyName: "Citco Group",
    positionRole: "Data & Application Systems Intern",
    extractedStatus: "INTERVIEW",
    sourcePlatform: "INDEED",
    eventDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 8).toISOString(),
    eventTime: "10:00 AM - 10:45 AM",
    timezone: "Asia/Manila",
    meetingLink: "https://citco.zoom.us/j/84920194821",
    location: "Zoom",
    hrContact: "careers-ph@citco.com",
  },
  {
    id: "v_email_06",
    accountId: "acc_demo_univ",
    account: { id: "acc_demo_univ", email: "alex.santos@university.edu.ph", name: "Alex Santos" },
    gmailMessageId: "msg_v_06",
    sender: "Global Transco ICT Solutions <ojt@globaltransco.com>",
    senderName: "Global Transco ICT",
    recipient: "alex.santos@university.edu.ph",
    subject: "Offer of Internship: Full Stack Development Intern - Global Transco ICT",
    dateReceived: new Date(Date.now() - 1000 * 60 * 60 * 70).toISOString(),
    snippet: "Dear Alex, on behalf of Global Transco ICT Solutions, we are delighted to offer you the Full Stack Development Internship role...",
    bodyContent: `Dear Alex,

On behalf of Global Transco ICT Solutions, we are thrilled to offer you the Full Stack Development Internship position for the upcoming term!

Details:
Allowance: Php 8,000 / month stipend
Work Setup: Hybrid (Makati Office / Remote)
Target Start: December 1, 2026

Please sign and return the training agreement within 5 working days.

Sincerely,
Global Transco HR Team`,
    isRecruitment: true,
    category: "Acceptance",
    confidenceScore: 0.99,
    needsReview: false,
    companyName: "Global Transco ICT",
    positionRole: "Full Stack Development Intern",
    extractedStatus: "OFFERED",
    sourcePlatform: "DIRECT",
    deadlineDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4).toISOString(),
    hrContact: "ojt@globaltransco.com",
  },
  {
    id: "v_email_07",
    accountId: "acc_demo_work",
    account: { id: "acc_demo_work", email: "candidate.work@gmail.com", name: "Alex Santos" },
    gmailMessageId: "msg_v_07",
    sender: "LinkedIn Job Alerts <jobalerts-noreply@linkedin.com>",
    senderName: "LinkedIn Talent Insights",
    recipient: "candidate.work@gmail.com",
    subject: "Application Viewed: Thinking Machines Data Science viewed your application",
    dateReceived: new Date(Date.now() - 1000 * 60 * 60 * 35).toISOString(),
    snippet: "Thinking Machines Data Science viewed your application for AI / ML Engineer Intern on LinkedIn...",
    bodyContent: `Hi Alex,

Great news! The hiring manager at Thinking Machines Data Science viewed your application for AI / ML Engineer Intern.

Your profile has been advanced to the skills screening stage.

Best,
The LinkedIn Team`,
    isRecruitment: true,
    category: "Application Update",
    confidenceScore: 0.92,
    needsReview: false,
    companyName: "Thinking Machines",
    positionRole: "AI / ML Engineer Intern",
    extractedStatus: "ASSESSMENT",
    sourcePlatform: "LINKEDIN",
  },
  {
    id: "v_email_08",
    accountId: "acc_demo_univ",
    account: { id: "acc_demo_univ", email: "alex.santos@university.edu.ph", name: "Alex Santos" },
    gmailMessageId: "msg_v_08",
    sender: "JobStreet Application Bot <no-reply@jobstreet.com>",
    senderName: "JobStreet",
    recipient: "alex.santos@university.edu.ph",
    subject: "Your application for Software Development & QA Intern was forwarded to StellarPH",
    dateReceived: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    snippet: "Your JobStreet application has been forwarded to StellarPH hiring team...",
    bodyContent: `Dear Alex,

Your application for Software Development & QA Intern was successfully forwarded to StellarPH.

Employer: StellarPH Solutions
Application Status: Under Review by Recruiter

Regards,
JobStreet Team`,
    isRecruitment: true,
    category: "Application Confirmation",
    confidenceScore: 0.94,
    needsReview: false,
    companyName: "StellarPH",
    positionRole: "Software Development & QA Intern",
    extractedStatus: "APPLIED",
    sourcePlatform: "JOBSTREET",
  },
];

export const VISITOR_APPLICATIONS: VisitorApplication[] = [
  {
    id: "v_app_01",
    companyName: "Canva",
    positionRole: "Frontend Engineering Intern",
    currentStatus: "INTERVIEW",
    sourcePlatform: "DIRECT",
    appliedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    lastActivityAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
    notes: "Passed technical coding test. Upcoming 45-minute technical discussion scheduled on Google Meet.",
    _count: { emails: 2, activities: 1 },
    activities: [
      {
        id: "v_act_01",
        type: "INTERVIEW",
        title: "Technical Interview - Frontend Engineering Leads",
        scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6).toISOString(),
        meetingLink: "https://meet.google.com/cnv-tech-demo",
        status: "SCHEDULED",
      },
    ],
  },
  {
    id: "v_app_02",
    companyName: "Citco Group",
    positionRole: "Data & Application Systems Intern",
    currentStatus: "INTERVIEW",
    sourcePlatform: "INDEED",
    appliedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 16).toISOString(),
    lastActivityAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    notes: "Final stage interview with APAC Systems Director on Zoom.",
    _count: { emails: 3, activities: 1 },
    activities: [
      {
        id: "v_act_02",
        type: "INTERVIEW",
        title: "Final Interview - APAC Systems Director",
        scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 8).toISOString(),
        meetingLink: "https://citco.zoom.us/j/84920194821",
        status: "SCHEDULED",
      },
    ],
  },
  {
    id: "v_app_03",
    companyName: "Thinking Machines",
    positionRole: "AI / ML Engineer Intern",
    currentStatus: "ASSESSMENT",
    sourcePlatform: "LINKEDIN",
    appliedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    lastActivityAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    notes: "Technical take-home challenge on HackerRank due November 24.",
    _count: { emails: 2, activities: 1 },
    activities: [
      {
        id: "v_act_03",
        type: "ASSESSMENT",
        title: "Take-Home Coding Challenge (HackerRank)",
        scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString(),
        meetingLink: "https://assessment.hackerrank.com/thinkingmachines-intern-eval",
        status: "SCHEDULED",
      },
    ],
  },
  {
    id: "v_app_04",
    companyName: "Global Transco ICT",
    positionRole: "Full Stack Development Intern",
    currentStatus: "OFFERED",
    sourcePlatform: "DIRECT",
    appliedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
    lastActivityAt: new Date(Date.now() - 1000 * 60 * 60 * 70).toISOString(),
    notes: "Received official internship offer! Hybrid setup, Php 8,000 monthly allowance.",
    _count: { emails: 2, activities: 0 },
    activities: [],
  },
  {
    id: "v_app_05",
    companyName: "StellarPH",
    positionRole: "Software Development & QA Intern",
    currentStatus: "APPLIED",
    sourcePlatform: "JOBSTREET",
    appliedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    lastActivityAt: new Date(Date.now() - 1000 * 60 * 60 * 40).toISOString(),
    notes: "MOA and university endorsement letter required for 480 hours practicum.",
    _count: { emails: 2, activities: 0 },
    activities: [],
  },
  {
    id: "v_app_06",
    companyName: "Maya",
    positionRole: "Backend Developer Intern",
    currentStatus: "APPLIED",
    sourcePlatform: "DIRECT",
    appliedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    lastActivityAt: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
    notes: "Application confirmed. Under review by engineering hiring team.",
    _count: { emails: 1, activities: 0 },
    activities: [],
  },
];
