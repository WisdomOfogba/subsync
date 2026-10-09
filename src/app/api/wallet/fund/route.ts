import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { userId, amount } = await req.json();
    if (!userId || !amount) {
      return NextResponse.json({ success: false, error: "Invalid parameters" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

    // Mock Paystack inflow
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { walletBalance: user.walletBalance + amount }
    });

    await prisma.transaction.create({
      data: {
        userId,
        amount,
        type: "WALLET_FUND",
        description: "Paystack Topup",
        status: "SUCCESS"
      }
    });

    return NextResponse.json({ success: true, balance: updatedUser.walletBalance });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Error funding wallet" }, { status: 500 });
  }
}
