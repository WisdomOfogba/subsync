import { NextResponse, after } from "next/server";
import prisma from "@/lib/prisma";
import { answerSubscriptionQuestion } from "@/lib/assistant";
import { sendWhatsAppText, verifyWhatsAppSignature } from "@/lib/whatsapp";
import { applyDecision, type Decision } from "@/lib/subscription-actions";

const UUID_RE = /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i;
const DECISIONS = ["keep", "cancel", "done"];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WA_VERIFY_TOKEN && challenge) {
    return new NextResponse(challenge, { status: 200, headers: { "Content-Type": "text/plain" } });
  }

  return NextResponse.json({ error: "Verification failed" }, { status: 403 });
}

export async function POST(req: Request) {
  console.log("WA webhook hit:", new Date().toISOString());
  const raw = await req.text();
  if (!verifyWhatsAppSignature(raw, req.headers.get("x-hub-signature-256"))) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  after(async () => {
    try {
      await processInbound(raw);
    } catch (error) {
      console.error("WhatsApp Webhook Error:", error);
    }
  });
 
  return NextResponse.json({ ok: true });
}
  
async function processInbound(raw: string) {
  const body = JSON.parse(raw);
  const inbound = body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  const from: string | undefined = inbound?.from;
  if (!inbound || !from) return; // delivery/read status updates have no message
 
  if (inbound.type === "interactive") {
    const id: string = inbound.interactive?.button_reply?.id ?? "";
    const [action, subscriptionId] = id.split(":");
    if (!DECISIONS.includes(action)) return;
    return sendWhatsAppText(from, await decide(from, action as Decision, subscriptionId));
  }
 
  const text: string | undefined = inbound.text?.body?.trim();
  if (!text) return;
 
  // 2) Account linking: "CONNECT <user id>"
  const connectMatch = text.match(new RegExp(`(?:connect|/start)\\s+(${UUID_RE.source})`, "i"));
  const uuid = connectMatch?.[1] || null;
  if (uuid) {
    let replyMessage: string;
    try {
      await prisma.user.updateMany({
        where: { whatsappPhone: from },
        data: { whatsappPhone: null },
      });
      const user = await prisma.user.update({
        where: { id: uuid },
        data: { whatsappPhone: from },
      });
      replyMessage = `Linked! This WhatsApp is now connected to your SubSync account (${user.email}).\n\nYou will get alerts before subscription charges. Ask me anything about your subscriptions.`;
    } catch {
      replyMessage = "I couldn't link that account. Open Settings in SubSync and tap Connect App again.";
    }
    return sendWhatsAppText(from, replyMessage);
  }``
 
  // 3) Typed KEEP / CANCEL / DONE
  const word = text.toLowerCase();
  if (DECISIONS.includes(word)) {
    return sendWhatsAppText(from, await decide(from, word as Decision));
  }
 
  // 4) Anything else: the AI assistant
  const user = await prisma.user.findFirst({
    where: { whatsappPhone: from },
    include: { subscriptions: true },
  });
  const replyMessage = user
    ? await answerSubscriptionQuestion(user, text, "WhatsApp")
    : "Welcome to SubSync.\n\nTo connect this chat, open Settings in your dashboard and tap Connect App on the WhatsApp card.";
  return sendWhatsAppText(from, replyMessage);
}
 
async function decide(from: string, action: Decision, subscriptionId?: string) {
  const user = await prisma.user.findFirst({ where: { whatsappPhone: from } });
  if (!user) {
    return "I don't recognise this number yet. Open Settings in SubSync and tap Connect App on the WhatsApp card.";
  }
  return applyDecision(user.id, action, subscriptionId);
}