
Route · TS
import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { sendWhatsAppReminder } from "@/lib/whatsapp";
import { getUpcomingChargeDate } from "@/lib/utils";
import { wantsChannel } from "@/lib/assistant";
import { money } from "@/lib/subscription-actions";
 
const DAY = 864e5;
 
type SubWithUser = Prisma.SubscriptionGetPayload<{ include: { user: true } }>;
 
async function remindOne(sub: SubWithUser): Promise<boolean> {
  const phone = sub.user.whatsappPhone;
  if (!phone) return false;
 
  const next = getUpcomingChargeDate(sub.nextChargeDate, sub.billingCycle);
  const daysLeft = Math.max(0, Math.ceil((next.getTime() - Date.now()) / DAY));
 
  await sendWhatsAppReminder(phone, {
    subscriptionId: sub.id,
    subscriptionName: sub.name,
    amountText: money(sub.amount, sub.currency),
    daysLeft,
  });
  await prisma.subscription.update({
    where: { id: sub.id },
    data: { reminderSentAt: new Date() },
  });
  return true;
}
 

export async function POST(req: Request) {
  if (!process.env.REMINDER_ADMIN_KEY || req.headers.get("x-admin-key") !== process.env.REMINDER_ADMIN_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
 
  const { subscriptionId } = (await req.json().catch(() => ({}))) as { subscriptionId?: string };
 
  // One specific subscription (ignores the date window and alert preference: handy for demos).
  if (subscriptionId) {
    const sub = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: { user: true },
    });
    if (!sub) return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    try {
      return NextResponse.json({ sent: (await remindOne(sub)) ? 1 : 0 });
    } catch (error) {
      console.error("Reminder error:", error);
      return NextResponse.json({ sent: 0, error: "WhatsApp send failed. Check the server logs." }, { status: 502 });
    }
  }
 
  // Everything charging within 3 days that hasn't been reminded in the last 7 days.
  const subs = await prisma.subscription.findMany({
    where: { status: "ACTIVE", user: { whatsappPhone: { not: null } } },
    include: { user: true },
  });
 
  let sent = 0;
  for (const sub of subs) {
    if (!wantsChannel(sub.user.alertPreference, "whatsapp")) continue;
    const next = getUpcomingChargeDate(sub.nextChargeDate, sub.billingCycle);
    const daysLeft = (next.getTime() - Date.now()) / DAY;
    const recentlyReminded = sub.reminderSentAt && Date.now() - sub.reminderSentAt.getTime() < 7 * DAY;
    if (daysLeft < 0 || daysLeft > 3 || recentlyReminded) continue;
    try {
      if (await remindOne(sub)) sent++;
    } catch (error) {
      console.error("Reminder error:", error);
    }
  }
  return NextResponse.json({ sent });
}
 
Claude finished the response
