import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    await prisma.activity.deleteMany();
    await prisma.emailMessage.deleteMany();
    await prisma.application.deleteMany();
    await prisma.account.deleteMany();

    return NextResponse.json({
      success: true,
      message: "All simulated demo records cleared. Ready for your live account.",
    });
  } catch (error) {
    console.error("Failed to clear database:", error);
    return NextResponse.json(
      { error: "Failed to clear database" },
      { status: 500 }
    );
  }
}
