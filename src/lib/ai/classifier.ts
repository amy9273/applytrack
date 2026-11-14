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
 * Serves as instantaneous offline extractor and robust fallback for AI API.
 */
export function ruleBasedClassifyAndExtract(
  subject: string,
  body: string,
  senderName?: string,
  senderEmail?: string
): ExtractedEmailData {
  const text = `${subject}\n${body}`.toLowerCase();

  // Check if recruitment related
  const recruitmentSignals = [
    "internship", "intern", "ojt", "application", "applicant", "career",
    "recruitment", "interview", "assessment", "hackerrank", "codility",
    "offer letter", "candidate", "job", "position", "moa"
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

  // 1. Determine Category & Status
  let category: RecruitmentCategory = "Other Recruitment Communication";
  let extractedStatus: ExtractedEmailData["extractedStatus"] = "APPLIED";
  let confidenceScore = 0.85;

  if (text.includes("regret to inform") || text.includes("not moving forward") || text.includes("pursue other candidates") || text.includes("unfortunately")) {
    category = "Rejection";
    extractedStatus = "REJECTED";
  } else if (text.includes("pleased to offer") || text.includes("job offer") || text.includes("offer of internship") || text.includes("congratulations! we are pleased")) {
    category = "Acceptance";
    extractedStatus = "OFFERED";
  } else if (text.includes("final interview") || text.includes("final round") || text.includes("executive interview")) {
    category = "Final Interview";
    extractedStatus = "INTERVIEW";
  } else if (text.includes("interview invitation") || text.includes("invite you for an interview") || text.includes("schedule an interview") || text.includes("interview schedule")) {
    category = "Interview Invitation";
    extractedStatus = "INTERVIEW";
  } else if (text.includes("interview confirmed") || text.includes("interview confirmation") || text.includes("your interview is confirmed")) {
    category = "Interview Confirmation";
    extractedStatus = "INTERVIEW";
  } else if (text.includes("assessment invitation") || text.includes("coding test") || text.includes("hackerrank") || text.includes("codility") || text.includes("technical assessment") || text.includes("online exam")) {
    category = "Assessment Invitation";
    extractedStatus = "ASSESSMENT";
  } else if (text.includes("assessment instructions") || text.includes("test guidelines") || text.includes("exam guidelines")) {
    category = "Assessment Instructions";
    extractedStatus = "ASSESSMENT";
  } else if (text.includes("assessment received") || text.includes("assessment completed") || text.includes("test submission confirmed")) {
    category = "Assessment Confirmation";
    extractedStatus = "ASSESSMENT";
  } else if (text.includes("moa") || text.includes("memorandum of agreement") || text.includes("endorsement letter") || text.includes("ojt requirement")) {
    category = "OJT / MOA Requirements";
    extractedStatus = "OJT_PROCESSING";
  } else if (text.includes("thank you for applying") || text.includes("application received") || text.includes("application confirmation") || text.includes("we have received your application")) {
    category = "Application Confirmation";
    extractedStatus = "APPLIED";
  } else if (text.includes("status update") || text.includes("update on your application") || text.includes("under review")) {
    category = "Application Update";
    extractedStatus = "UNDER_REVIEW";
  }

  // 2. Extract Company Name
  let companyName: string | null = null;
  // Try pattern from subject like "[Citco] ...", "StellarPH Careers", "at Maya", "Canva Team"
  const bracketCompany = subject.match(/\[([A-Za-z0-9\s&.-]{2,25})\]/);
  if (bracketCompany) {
    companyName = bracketCompany[1].trim();
  }

  if (!companyName && senderName) {
    const cleanSender = senderName.replace(/(careers|recruitment|team|hr|talent|people|hiring)/gi, "").trim();
    if (cleanSender.length >= 2 && !cleanSender.toLowerCase().includes("no-reply") && !cleanSender.toLowerCase().includes("notifications")) {
      companyName = cleanSender;
    }
  }

  if (!companyName && senderEmail) {
    const domainMatch = senderEmail.match(/@(?:[a-zA-Z0-9-]+\.)*([a-zA-Z0-9-]+)\.[a-zA-Z]{2,}/);
    if (domainMatch && !["gmail", "yahoo", "outlook", "hotmail", "up", "edu"].includes(domainMatch[1])) {
      companyName = domainMatch[1].charAt(0).toUpperCase() + domainMatch[1].slice(1);
    }
  }

  // Fallback known common targets
  const knownCompanies = ["Citco", "StellarPH", "GlobalTransco", "Canva", "Maya", "GCash", "Shopee", "Accenture", "Aura", "Thinking Machines"];
  for (const c of knownCompanies) {
    if (new RegExp(`\\b${c}\\b`, "i").test(subject) || new RegExp(`\\b${c}\\b`, "i").test(body)) {
      companyName = c;
      break;
    }
  }

  // 3. Extract Position / Role
  let positionRole: string | null = null;
  const roleMatch = text.match(/(software engineer(?:ing)? intern(?:ship)?|frontend developer intern|backend developer intern|full stack(?: web)? intern|data analyst intern|qa intern|quality assurance intern|product intern|ui\/ux intern|it intern(?:ship)?|ojt software engineer)/i);
  if (roleMatch) {
    positionRole = roleMatch[0].replace(/\b\w/g, (l) => l.toUpperCase());
  } else {
    // Check subject for position clues
    const subjRole = subject.match(/(?:for|as|position:?)\s+([A-Za-z\s/]{3,30}(?:Intern|Trainee|OJT|Associate|Engineer|Developer))/i);
    if (subjRole) {
      positionRole = subjRole[1].trim();
    }
  }

  // 4. Meeting Link (Google Meet, Zoom, MS Teams)
  let meetingLink: string | null = null;
  const meetMatch = body.match(/https:\/\/(?:meet\.google\.com\/[a-z]{3}-[a-z]{4}-[a-z]{3}|[a-zA-Z0-9-]+\.zoom\.us\/j\/\d+|teams\.microsoft\.com\/l\/meetup-join\/[^\s<>"]+)/i);
  if (meetMatch) {
    meetingLink = meetMatch[0];
  }

  // 5. Date & Time Detection
  let eventDate: Date | null = null;
  let eventTime: string | null = null;
  const timeMatch = body.match(/(\b\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)(?:\s*(?:-|to)\s*\d{1,2}:\d{2}\s*(?:AM|PM|am|pm))?)/);
  if (timeMatch) {
    eventTime = timeMatch[1].toUpperCase();
  }

  // Look for date pattern like "November 20, 2026" or "Nov 18, 2026" or "18 Nov 2026"
  const dateMatch = body.match(/(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)?,?\s*(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{1,2})(?:st|nd|rd|th)?,?\s*(\d{4})?/i);
  if (dateMatch) {
    const month = dateMatch[1];
    const day = dateMatch[2];
    const year = dateMatch[3] || new Date().getFullYear().toString();
    const parsed = new Date(`${month} ${day}, ${year}`);
    if (!isNaN(parsed.getTime())) {
      eventDate = parsed;
    }
  }

  // 6. Deadline detection for assessments
  let deadlineDate: Date | null = null;
  if (category.includes("Assessment")) {
    const ddlMatch = body.match(/(?:deadline|complete by|submit before|expires on|due date):?\s*(?:Monday|Tuesday|Wednesday|Thursday|Friday)?,?\s*(Jan[a-z]*|Feb[a-z]*|Mar[a-z]*|Apr[a-z]*|May|Jun[a-z]*|Jul[a-z]*|Aug[a-z]*|Sep[a-z]*|Oct[a-z]*|Nov[a-z]*|Dec[a-z]*)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s*(\d{4})?/i);
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

  // 7. Next Steps & HR Contact
  let nextSteps: string | null = null;
  if (category === "Interview Invitation") {
    nextSteps = meetingLink ? `Join interview via Google Meet: ${meetingLink}` : "Confirm attendance with HR";
  } else if (category === "Assessment Invitation") {
    nextSteps = deadlineDate ? `Complete technical assessment before deadline` : "Review exam instructions";
  } else if (category === "OJT / MOA Requirements") {
    nextSteps = "Submit signed Memorandum of Agreement (MOA) from university";
  } else if (category === "Acceptance") {
    nextSteps = "Review offer letter and sign acceptance form";
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

/**
 * Main classification & extraction dispatcher.
 * Uses Gemini AI if GEMINI_API_KEY is available; otherwise falls back gracefully to rule-based engine.
 */
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

Recruitment categories:
- Application Confirmation
- Application Update
- Interview Invitation
- Interview Confirmation
- Assessment Invitation
- Assessment Instructions
- Assessment Confirmation
- Final Interview
- Rejection
- Acceptance
- OJT / MOA Requirements
- Other Recruitment Communication

Sender Name: ${senderName || "Unknown"}
Sender Email: ${senderEmail || "Unknown"}
Subject: ${subject}
Body:
${body.slice(0, 3000)}

Output JSON format matching this TypeScript schema:
{
  "isRecruitment": boolean,
  "category": string, // One of the 12 categories or null
  "confidenceScore": number, // 0.0 to 1.0
  "needsReview": boolean,
  "companyName": string | null,
  "positionRole": string | null,
  "extractedStatus": "APPLIED" | "UNDER_REVIEW" | "ASSESSMENT" | "INTERVIEW" | "OFFERED" | "REJECTED" | "OJT_PROCESSING",
  "eventDate": string | null, // ISO-8601 YYYY-MM-DD
  "eventTime": string | null, // e.g. "2:00 PM - 3:00 PM"
  "timezone": "Asia/Manila",
  "meetingLink": string | null,
  "location": string | null,
  "deadlineDate": string | null, // ISO-8601 YYYY-MM-DD
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
      console.warn("Gemini API call failed, falling back to rule-based parser:", res.statusText);
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
