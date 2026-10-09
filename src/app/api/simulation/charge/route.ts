import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { cardNumber, expiry, cvv, amount, merchant } = await req.json();

    if (!cardNumber || !expiry || !cvv || !amount) {
      return NextResponse.json({ success: false, error: "Missing payment details." }, { status: 400 });
    }

    // Find the virtual card
    const card = await prisma.virtualCard.findUnique({
      where: { cardNumber }
    });

    if (!card || card.expiry !== expiry || card.cvv !== cvv) {
      return NextResponse.json({ success: false, error: "Invalid card details." }, { status: 400 });
    }

    if (card.balance < amount) {
      return NextResponse.json({ success: false, error: "Insufficient funds on virtual card." }, { status: 400 });
    }

    // Deduct balance from card
    await prisma.$transaction([
      prisma.virtualCard.update({
        where: { id: card.id },
        data: { balance: card.balance - amount }
      }),
      prisma.transaction.create({
        data: {
          userId: card.userId,
          amount,
          type: "MERCHANT_PAYMENT",
          description: `Payment to ${merchant}`,
          status: "SUCCESS"
        }
      })
    ]);

    return NextResponse.json({ success: true, message: `Successfully charged ${amount} for ${merchant}` });

  } catch (error) {
    console.error("Simulation Charge Error:", error);
    return NextResponse.json({ success: false, error: "Internal server error." }, { status: 500 });
  }
}
