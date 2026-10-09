import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { userId, cardId, amount } = await req.json();
    if (!userId || !cardId || !amount || amount <= 0) {
      return NextResponse.json({ success: false, error: "Invalid parameters" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

    if (user.walletBalance < amount) {
      return NextResponse.json({ success: false, error: "Insufficient wallet balance" }, { status: 400 });
    }

    const card = await prisma.virtualCard.findUnique({ where: { id: cardId } });
    if (!card || card.userId !== userId) {
      return NextResponse.json({ success: false, error: "Card not found" }, { status: 404 });
    }

    // Perform the transfer transaction
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { walletBalance: user.walletBalance - amount }
      }),
      prisma.virtualCard.update({
        where: { id: cardId },
        data: { balance: card.balance + amount }
      }),
      prisma.transaction.create({
        data: {
          userId,
          amount,
          type: "CARD_FUND",
          description: `Funded ${card.name}`,
          status: "SUCCESS"
        }
      })
    ]);

    return NextResponse.json({ success: true, message: "Card funded successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Error funding card" }, { status: 500 });
  }
}
