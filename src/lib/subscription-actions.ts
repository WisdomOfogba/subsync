import prisma from "@/lib/prisma";
import { getCancelGuide } from "@/lib/cancel-guides";

export type Decision = "keep" | "cancel" | "done";

export const money = (amount: number, currency: string) =>
  `${currency === "NGN" ? "₦" : currency + " "}${amount.toLocaleString()}`;

function cycleWord(billingCycle: string) {
  const c = billingCycle.toUpperCase();
  if (c.startsWith("Y") || c.includes("ANNUAL")) return "year";
  if (c.startsWith("W")) return "week";
  return "month";
}

// Applies the user's choice and returns the message to send back on WhatsApp.
// userId must come from the verified WhatsApp-number-to-user link, never from message text.
export async function applyDecision(userId: string, action: Decision, subscriptionId?: string): Promise<string> {
  if (action === "done") {
    const sub = await prisma.subscription.findFirst({
      where: { userId, status: "CANCEL_PENDING", ...(subscriptionId ? { id: subscriptionId } : {}) },
      orderBy: { lastInteractedAt: { sort: "desc", nulls: "last" } },
    });
    if (!sub) return "Nothing is waiting to be cancelled.";
    await prisma.subscription.update({
      where: { id: sub.id },
      data: { status: "CANCELLED", lastInteractedAt: new Date() },
    });
    return `🎉 ${sub.name} archived. You're saving ${money(sub.amount, sub.currency)} per ${cycleWord(sub.billingCycle)}.`;
  }

  // keep / cancel: use the exact subscription from the button, or the most recent reminded one.
  const sub = await prisma.subscription.findFirst({
    where: subscriptionId
      ? { id: subscriptionId, userId }
      : { userId, status: "ACTIVE", reminderSentAt: { not: null } },
    orderBy: { reminderSentAt: { sort: "desc", nulls: "last" } },
  });
  if (!sub) return "I couldn't find a pending reminder for you.";

  if (action === "keep") {
    await prisma.subscription.update({
      where: { id: sub.id },
      data: { decision: "KEEP", lastInteractedAt: new Date() },
    });
    return `👍 Keeping ${sub.name}. I'll remind you again before the next charge.`;
  }

  // cancel
  await prisma.subscription.update({
    where: { id: sub.id },
    data: { status: "CANCEL_PENDING", decision: "CANCEL", lastInteractedAt: new Date() },
  });
  const guide = getCancelGuide(sub.name);
  if (!guide) {
    return `I don't have a cancel guide for ${sub.name} yet. Look for "Manage subscription" in the service's account settings, then reply DONE when you've cancelled.`;
  }
  return `Here's how to cancel ${sub.name}:\n\n${guide.steps}${guide.url ? `\n\n${guide.url}` : ""}\n\nReply DONE once you've cancelled and I'll update your savings.`;
}