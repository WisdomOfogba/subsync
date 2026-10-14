import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUpcomingChargeDate } from '@/lib/utils';

const ALLOWED_CYCLES = new Set(["WEEKLY", "MONTHLY", "QUARTERLY", "YEARLY"]);

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

    const rolled = await Promise.all(subscriptions.map(async (sub) => {
      try {
        const upcoming = getUpcomingChargeDate(sub.nextChargeDate, sub.billingCycle);
        const stored = new Date(sub.nextChargeDate);
        stored.setHours(0, 0, 0, 0);
        if (upcoming.getTime() === stored.getTime()) {
          return sub;
        }
        return await prisma.subscription.update({
          where: { id: sub.id },
          data: { nextChargeDate: upcoming }
        });
      } catch (updateErr) {
        console.warn(`Rollover skip for subscription ${sub.id}:`, updateErr);
        return sub;
      }
    }));

    return NextResponse.json({ success: true, subscriptions: rolled });
  } catch (error: any) {
    console.error("GET /api/subscriptions error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { userId, name, amount, currency, category, nextChargeDate, billingCycle } = data;

    if (!userId || !name || !amount || !nextChargeDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const cycle = ALLOWED_CYCLES.has(billingCycle) ? billingCycle : "MONTHLY";
    const upcoming = getUpcomingChargeDate(nextChargeDate, cycle);

    const subscription = await prisma.subscription.create({
      data: {
        userId,
        name,
        amount: parseFloat(amount),
        currency: currency || "NGN",
        category: category || "General",
        billingCycle: cycle,
        nextChargeDate: upcoming,
        status: "Pending Approval" // Defaults to pending to match the permission-first flow
      }
    });

    return NextResponse.json({ success: true, subscription });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
