import { NextResponse } from "next/server";
import { verifyOtpToken } from "@/lib/otp";
import { sendWhatsAppText } from "@/lib/whatsapp";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId, phone, code, verificationToken } = await req.json();

    if (!userId || !phone || !code || !verificationToken) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (userId, phone, code, verificationToken)" },
        { status: 400 }
      );
    }

    const verification = verifyOtpToken(verificationToken, userId, phone, code);
    if (!verification.valid) {
      return NextResponse.json(
        { success: false, error: verification.error || "Invalid verification code" },
        { status: 400 }
      );
    }

    const cleanPhone = String(phone).replace(/\D/g, "");

    // Link phone to user account in database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        whatsappPhone: cleanPhone,
      },
    });

    // Fire-and-forget welcome/confirmation text on WhatsApp
    sendWhatsAppText(
      cleanPhone,
      `✅ *WhatsApp Connected!*\n\nYour WhatsApp number is now connected to SubSync (${updatedUser.email}).\n\nYou will receive renewal alerts and can manage your subscriptions directly here.`
    ).catch((e) => console.warn("Confirmation message note:", e?.message || e));

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: "WhatsApp connected successfully!",
    });
  } catch (error: any) {
    console.error("POST /api/whatsapp/verify/confirm error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to confirm verification code" },
      { status: 500 }
    );
  }
}
