import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const subscriptions = await prisma.subscription.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, subscriptions });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { userId, name, amount, currency, category, nextChargeDate } = data;

    if (!userId || !name || !amount || !nextChargeDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const subscription = await prisma.subscription.create({
      data: {
        userId,
        name,
        amount: parseFloat(amount),
        currency: currency || "NGN",
        category: category || "General",
        nextChargeDate: new Date(nextChargeDate),
        status: "Pending Approval" // Defaults to pending to match the permission-first flow
      }
    });

    return NextResponse.json({ success: true, subscription });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
