import { prisma } from "../src/lib/prisma";
import { seedDemoInboxes } from "../src/lib/demo/seed-data";

async function cleanAndSeed() {
  console.log("Cleaning old test database records...");
  await prisma.activity.deleteMany();
  await prisma.emailMessage.deleteMany();
  await prisma.application.deleteMany();
  await prisma.account.deleteMany();

  console.log("Seeding with Angel Amaya Balion's real accounts and target companies...");
  const result = await seedDemoInboxes();
  console.log("Seeded:", result);

  const accounts = await prisma.account.findMany();
  console.log("Active Inboxes:", accounts.map((a) => `${a.email} (${a.name})`));

  const apps = await prisma.application.findMany();
  console.log("Clustered Applications:", apps.map((a) => `${a.companyName} - ${a.positionRole} [${a.currentStatus}]`));

  await prisma.$disconnect();
}

cleanAndSeed().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
