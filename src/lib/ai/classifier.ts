export const RECRUITMENT_CATEGORIES = [
  "Application Confirmation",
  "Application Update",
  "Interview Invitation",
  "Interview Confirmation",
  "Assessment Invitation",
  "Assessment Instructions",
  "Assessment Confirmation",
  "Final Interview",
  "Rejection",
  "Acceptance",
  "OJT / MOA Requirements",
  "Other Recruitment Communication",
] as const;

export type RecruitmentCategory = (typeof RECRUITMENT_CATEGORIES)[number];

export interface ExtractedEmailData {
  isRecruitment: boolean;
  category: RecruitmentCategory | "Other Recruitment Communication" | null;
  confidenceScore: number;
  needsReview: boolean;
  companyName: string | null;
  positionRole: string | null;
  extractedStatus: "APPLIED" | "UNDER_REVIEW" | "ASSESSMENT" | "INTERVIEW" | "OFFERED" | "REJECTED" | "OJT_PROCESSING";
  sourcePlatform: "DIRECT" | "LINKEDIN" | "JOBSTREET" | "INDEED";
  eventDate: Date | null;
  eventTime: string | null;
  timezone: string;
  meetingLink: string | null;
  location: string | null;
  deadlineDate: Date | null;
  hrContact: string | null;
  nextSteps: string | null;
  instructions: string | null;
}

/**
 * High-precision deterministic NLP extractor.
 * Supports direct emails and job platform notifications (JobStreet, LinkedIn, Indeed).
 */
export function ruleBasedClassifyAndExtract(
  subject: string,
  body: string,
  senderName?: string,
  senderEmail?: string
): ExtractedEmailData {
  const text = `${subject}\n${body}`.toLowerCase();
  const senderLower = (senderEmail || "").toLowerCase();
  const senderNameLower = (senderName || "").toLowerCase();

  // 1. Detect Source Platform (JobStreet, LinkedIn, Indeed, Direct)
  let sourcePlatform: "DIRECT" | "LINKEDIN" | "JOBSTREET" | "INDEED" = "DIRECT";
  if (
    senderLower.includes("linkedin.com") ||
    senderNameLower.includes("linkedin") ||
    text.includes("via linkedin") ||
    text.includes("linkedin job") ||
    text.includes("applied on linkedin")
  ) {
    sourcePlatform = "LINKEDIN";
  } else if (
    senderLower.includes("jobstreet.com") ||
    senderNameLower.includes("jobstreet") ||
    text.includes("via jobstreet") ||
    text.includes("jobstreet.com") ||
    text.includes("jobstreet application")
  ) {
    sourcePlatform = "JOBSTREET";
  } else if (
    senderLower.includes("indeed.com") ||
    senderNameLower.includes("indeed") ||
    text.includes("via indeed") ||
    text.includes("indeed apply") ||
    text.includes("indeed application")
  ) {
    sourcePlatform = "INDEED";
  }

  // Check if recruitment related
  const recruitmentSignals = [
    "internship", "intern", "ojt", "application", "applicant", "career",
    "recruitment", "interview", "assessment", "hackerrank", "codility",
    "offer letter", "candidate", "job", "position", "moa",
    "jobstreet", "linkedin", "indeed", "indeed apply", "application sent",
    "application was delivered", "viewed your application", "application submitted"
  ];
  const isRecruitment = recruitmentSignals.some((signal) => text.includes(signal));

  if (!isRecruitment) {
    return {
      isRecruitment: false,
      category: null,
      confidenceScore: 0.1,
      needsReview: false,
      companyName: null,
      positionRole: null,
      extractedStatus: "APPLIED",
      sourcePlatform,
      eventDate: null,
      eventTime: null,
      timezone: "Asia/Manila",
      meetingLink: null,
      location: null,
      deadlineDate: null,
      hrContact: null,
      nextSteps: null,
      instructions: null,
    };
  }

  // 2. Determine Category & Status
  let category: RecruitmentCategory = "Other Recruitment Communication";
  let extractedStatus: ExtractedEmailData["extractedStatus"] = "APPLIED";
  let confidenceScore = 0.88;

  if (
    text.includes("regret to inform") ||
    text.includes("not moving forward") ||
    text.includes("pursue other candidates") ||
    text.includes("unfortunately") ||
    text.includes("will not be moving forward")
  ) {
    category = "Rejection";
    extractedStatus = "REJECTED";
  } else if (
    text.includes("pleased to offer") ||
    text.includes("job offer") ||
    text.includes("offer of internship") ||
    text.includes("congratulations! we are pleased")
  ) {
    category = "Acceptance";
    extractedStatus = "OFFERED";
  } else if (text.includes("final interview") || text.includes("final round") || text.includes("executive interview")) {
    category = "Final Interview";
    extractedStatus = "INTERVIEW";
  } else if (
    text.includes("interview invitation") ||
    text.includes("invite you for an interview") ||
    text.includes("schedule an interview") ||
    text.includes("interview schedule") ||
    text.includes("technical chat")
  ) {
    category = "Interview Invitation";
    extractedStatus = "INTERVIEW";
  } else if (
    text.includes("interview confirmed") ||
    text.includes("interview confirmation") ||
    text.includes("your interview is confirmed")
  ) {
    category = "Interview Confirmation";
    extractedStatus = "INTERVIEW";
  } else if (
    text.includes("assessment invitation") ||
    text.includes("coding test") ||
    text.includes("hackerrank") ||
    text.includes("codility") ||
    text.includes("technical assessment") ||
    text.includes("online exam") ||
    text.includes("online assessment")
  ) {
    category = "Assessment Invitation";
    extractedStatus = "ASSESSMENT";
  } else if (text.includes("assessment instructions") || text.includes("test guidelines") || text.includes("exam guidelines")) {
    category = "Assessment Instructions";
    extractedStatus = "ASSESSMENT";
  } else if (
    text.includes("assessment received") ||
    text.includes("assessment completed") ||
    text.includes("test submission confirmed")
  ) {
    category = "Assessment Confirmation";
    extractedStatus = "ASSESSMENT";
  } else if (
    text.includes("moa") ||
    text.includes("memorandum of agreement") ||
    text.includes("endorsement letter") ||
    text.includes("ojt requirement") ||
    text.includes("university compliance")
  ) {
    category = "OJT / MOA Requirements";
    extractedStatus = "OJT_PROCESSING";
  } else if (
    text.includes("thank you for applying") ||
    text.includes("application received") ||
    text.includes("application confirmation") ||
    text.includes("we have received your application") ||
    text.includes("application was sent") ||
    text.includes("application was delivered") ||
    text.includes("application submitted") ||
    text.includes("indeed application") ||
    text.includes("jobstreet application")
  ) {
    category = "Application Confirmation";
    extractedStatus = "APPLIED";
  } else if (
    text.includes("status update") ||
    text.includes("update on your application") ||
    text.includes("under review") ||
    text.includes("viewed your application")
  ) {
    category = "Application Update";
    extractedStatus = "UNDER_REVIEW";
  }

  // 3. Extract Underlying Target Company (Handling JobStreet, LinkedIn, Indeed)
  let companyName: string | null = null;

  if (sourcePlatform === "LINKEDIN") {
    // Examples: "Your application was sent to Citco for Software Engineer Intern"
    // "Maya viewed your application for Frontend Developer Intern"
    const sentMatch = subject.match(/(?:sent to|delivered to)\s+([A-Za-z0-9\s&.-]+?)(?:\s+for|\s+via|\s*$)/i);
    const viewMatch = subject.match(/^([A-Za-z0-9\s&.-]+?)\s+viewed your application/i);
    if (sentMatch) companyName = sentMatch[1].trim();
    else if (viewMatch) companyName = viewMatch[1].trim();
  } else if (sourcePlatform === "JOBSTREET") {
    // Examples: "Your application for Software Development & QA Intern was delivered to Global Transco"
    // "Application received: Full Stack Web Intern at Global Transco"
    const deliveredMatch = subject.match(/(?:delivered to|sent to)\s+([A-Za-z0-9\s&.-]+)/i);
    const atMatch = subject.match(/\bat\s+([A-Za-z0-9\s&.-]+)/i);
    if (deliveredMatch) companyName = deliveredMatch[1].trim();
    else if (atMatch) companyName = atMatch[1].trim();
  } else if (sourcePlatform === "INDEED") {
    // Examples: "Indeed Application: Venture Building Intern – Tech at StellarPH"
    // "Your application was submitted to StellarPH"
    const atMatch = subject.match(/\bat\s+([A-Za-z0-9\s&.-]+)/i);
    const subMatch = subject.match(/(?:submitted to|sent to)\s+([A-Za-z0-9\s&.-]+)/i);
    if (atMatch) companyName = atMatch[1].trim();
    else if (subMatch) companyName = subMatch[1].trim();
  }

  // Bracket extraction: "[Citco] ...", "[StellarPH] ..."
  if (!companyName) {
    const bracketCompany = subject.match(/\[([A-Za-z0-9\s&.-]{2,25})\]/);
    if (bracketCompany && !["linkedin", "indeed", "jobstreet"].includes(bracketCompany[1].toLowerCase())) {
      companyName = bracketCompany[1].trim();
    }
  }

  // Check sender name if direct email
  if (!companyName && sourcePlatform === "DIRECT" && senderName) {
    const cleanSender = senderName.replace(/(careers|recruitment|team|hr|talent|people|hiring)/gi, "").trim();
    if (cleanSender.length >= 2 && !cleanSender.toLowerCase().includes("no-reply") && !cleanSender.toLowerCase().includes("notifications")) {
      companyName = cleanSender;
    }
  }

  // Check known actual targets
  const knownCompanies = [
    "Citco", "StellarPH", "Global Transco", "GlobalTransco", "Maya",
    "Canva", "Thinking Machines", "Shopee", "GCash", "Accenture", "Aura"
  ];
  for (const c of knownCompanies) {
    if (new RegExp(`\\b${c}\\b`, "i").test(subject) || new RegExp(`\\b${c}\\b`, "i").test(body)) {
      companyName = c === "GlobalTransco" ? "Global Transco" : c;
      break;
    }
  }

  // 4. Extract Position / Role
  let positionRole: string | null = null;
  const roleMatch = text.match(
    /(software engineer(?:ing)? intern(?:ship)?|software development & qa intern|venture building intern(?: – tech|- tech)?|frontend developer intern|backend developer intern|full stack(?: web)? intern|data analyst intern|product design(?: \/ engineering)? intern|qa intern|quality assurance intern|it intern(?:ship)?|ojt software engineer)/i
  );
  if (roleMatch) {
    positionRole = roleMatch[0].replace(/\b\w/g, (l) => l.toUpperCase());
  } else {
    const subjRole = subject.match(/(?:for|as|position:?)\s+([A-Za-z\s/–-]{3,35}(?:Intern|Trainee|OJT|Associate|Engineer|Developer))/i);
    if (subjRole) {
      positionRole = subjRole[1].trim();
    }
  }

  // 5. Meeting Link
  let meetingLink: string | null = null;
  const meetMatch = body.match(
    /https:\/\/(?:meet\.google\.com\/[a-z]{3}-[a-z]{4}-[a-z]{3}|[a-zA-Z0-9-]+\.zoom\.us\/j\/\d+|teams\.microsoft\.com\/l\/meetup-join\/[^\s<>"]+)/i
  );
  if (meetMatch) {
    meetingLink = meetMatch[0];
  }

  // 6. Date & Time
  let eventDate: Date | null = null;
  let eventTime: string | null = null;
  const timeMatch = body.match(/(\b\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)(?:\s*(?:-|to)\s*\d{1,2}:\d{2}\s*(?:AM|PM|am|pm))?)/);
  if (timeMatch) {
    eventTime = timeMatch[1].toUpperCase();
  }

  const dateMatch = body.match(
    /(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)?,?\s*(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{1,2})(?:st|nd|rd|th)?,?\s*(\d{4})?/i
  );
  if (dateMatch) {
    const month = dateMatch[1];
    const day = dateMatch[2];
    const year = dateMatch[3] || new Date().getFullYear().toString();
    const parsed = new Date(`${month} ${day}, ${year}`);
    if (!isNaN(parsed.getTime())) {
      eventDate = parsed;
    }
  }

  // 7. Deadline
  let deadlineDate: Date | null = null;
  if (category.includes("Assessment")) {
    const ddlMatch = body.match(
      /(?:deadline|complete by|submit before|expires on|due date):?\s*(?:Monday|Tuesday|Wednesday|Thursday|Friday)?,?\s*(Jan[a-z]*|Feb[a-z]*|Mar[a-z]*|Apr[a-z]*|May|Jun[a-z]*|Jul[a-z]*|Aug[a-z]*|Sep[a-z]*|Oct[a-z]*|Nov[a-z]*|Dec[a-z]*)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s*(\d{4})?/i
    );
    if (ddlMatch) {
      const month = ddlMatch[1];
      const day = ddlMatch[2];
      const year = ddlMatch[3] || new Date().getFullYear().toString();
      const parsed = new Date(`${month} ${day}, ${year}`);
      if (!isNaN(parsed.getTime())) {
        deadlineDate = parsed;
      }
    } else if (eventDate) {
      deadlineDate = eventDate;
    }
  }

  // 8. Next steps & HR
  let nextSteps: string | null = null;
  if (sourcePlatform === "LINKEDIN") {
    nextSteps = "Application submitted via LinkedIn Job Application";
  } else if (sourcePlatform === "JOBSTREET") {
    nextSteps = "Application delivered to employer via JobStreet";
  } else if (sourcePlatform === "INDEED") {
    nextSteps = "Application submitted via Indeed Apply";
  } else if (category === "Interview Invitation") {
    nextSteps = meetingLink ? `Join virtual interview: ${meetingLink}` : "Confirm interview attendance with HR";
  } else if (category === "Assessment Invitation") {
    nextSteps = deadlineDate ? `Complete technical coding test before deadline` : "Review technical exam instructions";
  } else if (category === "OJT / MOA Requirements") {
    nextSteps = "Submit De La Salle Lipa Endorsement Letter & signed MOA";
  }

  const hrMatch = body.match(/(?:Best regards|Regards|Sincerely|HR Team|Contact):\s*\n*([A-Za-z\s]+(?:Recruiter|HR|Talent Acquisition|[A-Z][a-z]+))/i);
  const hrContact = hrMatch ? hrMatch[1].trim() : senderName || null;

  const needsReview = !companyName || !positionRole || confidenceScore < 0.7;

  return {
    isRecruitment: true,
    category,
    confidenceScore,
    needsReview,
    companyName: companyName || "Unknown Company",
    positionRole: positionRole || "Internship Applicant",
    extractedStatus,
    sourcePlatform,
    eventDate,
    eventTime,
    timezone: "Asia/Manila",
    meetingLink,
    location: meetingLink ? "Online (Video Call)" : null,
    deadlineDate,
    hrContact,
    nextSteps,
    instructions: null,
  };
}

export async function classifyAndExtractEmail(
  subject: string,
  body: string,
  senderName?: string,
  senderEmail?: string
): Promise<ExtractedEmailData> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return ruleBasedClassifyAndExtract(subject, body, senderName, senderEmail);
  }

  try {
    const prompt = `You are an AI for ApplyTrack, an internship application organizer. Analyze this email header and body.
Extract structured recruitment information strictly in JSON format.
Detect if the application came directly or through a job board platform: "DIRECT", "LINKEDIN", "JOBSTREET", or "INDEED".

Sender Name: ${senderName || "Unknown"}
Sender Email: ${senderEmail || "Unknown"}
Subject: ${subject}
Body:
${body.slice(0, 3000)}

Output JSON format matching this TypeScript schema:
{
  "isRecruitment": boolean,
  "category": string,
  "confidenceScore": number,
  "needsReview": boolean,
  "companyName": string | null,
  "positionRole": string | null,
  "extractedStatus": "APPLIED" | "UNDER_REVIEW" | "ASSESSMENT" | "INTERVIEW" | "OFFERED" | "REJECTED" | "OJT_PROCESSING",
  "sourcePlatform": "DIRECT" | "LINKEDIN" | "JOBSTREET" | "INDEED",
  "eventDate": string | null,
  "eventTime": string | null,
  "timezone": "Asia/Manila",
  "meetingLink": string | null,
  "location": string | null,
  "deadlineDate": string | null,
  "hrContact": string | null,
  "nextSteps": string | null
}`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { response_mime_type: "application/json" },
        }),
      }
    );

    if (!res.ok) {
      return ruleBasedClassifyAndExtract(subject, body, senderName, senderEmail);
    }

    const data = await res.json();
    const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawJson) {
      return ruleBasedClassifyAndExtract(subject, body, senderName, senderEmail);
    }

    const parsed = JSON.parse(rawJson);
    return {
      isRecruitment: Boolean(parsed.isRecruitment),
      category: parsed.category || "Other Recruitment Communication",
      confidenceScore: typeof parsed.confidenceScore === "number" ? parsed.confidenceScore : 0.9,
      needsReview: Boolean(parsed.needsReview),
      companyName: parsed.companyName || "Unknown Company",
      positionRole: parsed.positionRole || "Internship Applicant",
      extractedStatus: parsed.extractedStatus || "APPLIED",
      sourcePlatform: parsed.sourcePlatform || "DIRECT",
      eventDate: parsed.eventDate ? new Date(parsed.eventDate) : null,
      eventTime: parsed.eventTime || null,
      timezone: parsed.timezone || "Asia/Manila",
      meetingLink: parsed.meetingLink || null,
      location: parsed.location || null,
      deadlineDate: parsed.deadlineDate ? new Date(parsed.deadlineDate) : null,
      hrContact: parsed.hrContact || null,
      nextSteps: parsed.nextSteps || null,
      instructions: null,
    };
  } catch (error) {
    console.error("Error in AI extraction, falling back to rule-based parser:", error);
    return ruleBasedClassifyAndExtract(subject, body, senderName, senderEmail);
  }
}
