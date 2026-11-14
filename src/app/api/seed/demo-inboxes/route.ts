import { NextResponse } from "next/server";
import { seedDemoInboxes } from "@/lib/demo/seed-data";

export async function POST() {
  try {
    const result = await seedDemoInboxes();
    return NextResponse.json({
      success: true,
      message: "Successfully seeded 3 demo inboxes and extracted recruitment records",
      ...result,
    });
  } catch (error) {
    console.error("Failed to seed demo inboxes:", error);
    return NextResponse.json(
      { error: "Failed to seed demo inboxes" },
      { status: 500 }
    );
  }
}
