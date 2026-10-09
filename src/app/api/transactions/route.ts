import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json({ success: false, error: "Missing userId" }, { status: 400 });

    const transactions = await prisma.transaction.findMany({ 
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    return NextResponse.json({ success: true, transactions });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Error fetching transactions" }, { status: 500 });
  }
}
