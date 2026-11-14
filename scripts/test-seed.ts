import { seedDemoInboxes } from "../src/lib/demo/seed-data";
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Seeding demo inboxes...");
  const result = await seedDemoInboxes();
  console.log("Seeding summary:", result);

  const accounts = await prisma.account.findMany();
  console.log(`\nConnected Inboxes (${accounts.length}):`);
  for (const acc of accounts) {
    console.log(` - ${acc.email} (${acc.name})`);
  }

  const emails = await prisma.emailMessage.findMany({
    select: {
      category: true,
      companyName: true,
      positionRole: true,
      extractedStatus: true,
      meetingLink: true,
      eventDate: true,
      deadlineDate: true,
    },
  });
  console.log(`\nIdentified Recruitment Emails (${emails.length}):`);
  for (const e of emails) {
    console.log(` - [${e.category}] ${e.companyName} | ${e.positionRole} (${e.extractedStatus})`);
    if (e.meetingLink) console.log(`   Meeting Link: ${e.meetingLink}`);
    if (e.eventDate) console.log(`   Schedule Date: ${e.eventDate.toISOString()}`);
    if (e.deadlineDate) console.log(`   Assessment Deadline: ${e.deadlineDate.toISOString()}`);
  }

  const applications = await prisma.application.findMany({
    include: {
      emails: true,
      activities: true,
    },
  });
  console.log(`\nAuto-Clustered Applications (${applications.length}):`);
  for (const app of applications) {
    console.log(` * ${app.companyName} - ${app.positionRole} [${app.currentStatus}] (${app.emails.length} emails, ${app.activities.length} activities)`);
  }

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
