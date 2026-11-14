import { prisma } from "../src/lib/prisma";

async function main() {
  const emails = await prisma.emailMessage.findMany({
    select: {
      sourcePlatform: true,
      category: true,
      companyName: true,
      positionRole: true,
      subject: true,
    },
    orderBy: { dateReceived: "desc" },
  });

  console.log(`=== Verified Recruitment Messages with Platforms (${emails.length}) ===`);
  for (const e of emails) {
    console.log(`[${e.sourcePlatform}] [${e.category}] ${e.companyName} | ${e.positionRole}`);
    console.log(`  Subject: ${e.subject}`);
  }

  await prisma.$disconnect();
}

main().catch(console.error);
