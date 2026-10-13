const GRAPH_URL = "https://graph.facebook.com/v25.0";

export function whatsappConnectUrl(userId: string) {
  const number = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, "");
  const text = encodeURIComponent(`CONNECT ${userId}`);
  return number ? `https://wa.me/${number}?text=${text}` : "";
}

export async function sendWhatsAppText(to: string, body: string) {
  const phoneNumberId = process.env.WA_PHONE_ID;
  const token = process.env.WA_ACCESS_TOKEN;
  if (!phoneNumberId || !token) {
    throw new Error("WhatsApp is not configured. Add WA_PHONE_ID and WA_ACCESS_TOKEN.");
  }

  const response = await fetch(`${GRAPH_URL}/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: to.replace(/\D/g, ""),
      type: "text",
      text: { preview_url: false, body },
    }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }
}

export async function sendWhatsAppAlert(to: string, payload: {
  userName: string;
  subscriptionName: string;
  amountDue: number;
  daysLeft: number;
}) {
  const template = process.env.WHATSAPP_ALERT_TEMPLATE;
  const phoneNumberId = process.env.WA_PHONE_ID;
  const token = process.env.WA_ACCESS_TOKEN;
  if (!phoneNumberId || !token) {
    throw new Error("WhatsApp is not configured. Add WA_PHONE_ID and WA_ACCESS_TOKEN.");
  }

  const body = template
    ? {
        messaging_product: "whatsapp",
        to: to.replace(/\D/g, ""),
        type: "template",
        template: {
          name: template,
          language: { code: process.env.WHATSAPP_ALERT_TEMPLATE_LANG || "en" },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: payload.userName },
                { type: "text", text: payload.subscriptionName },
                { type: "text", text: `₦${payload.amountDue.toLocaleString()}` },
                { type: "text", text: String(payload.daysLeft) },
              ],
            },
          ],
        },
      }
    : {
        messaging_product: "whatsapp",
        to: to.replace(/\D/g, ""),
        type: "text",
        text: {
          preview_url: false,
          body: `🛡️ SubSync Alert\n\nHello ${payload.userName},\nYour subscription to ${payload.subscriptionName} is renewing in ${payload.daysLeft} days.\n\nAmount: ₦${payload.amountDue.toLocaleString()}\n\nPlease approve or block this in your dashboard.`,
        },
      };

  const response = await fetch(`${GRAPH_URL}/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }
}


export async function sendWhatsAppReminder(
  to: string,
  p: { subscriptionId: string; subscriptionName: string; amountText: string; daysLeft: number }
) {
  const phoneNumberId = process.env.WA_PHONE_ID;
  const token = process.env.WA_ACCESS_TOKEN;
  if (!phoneNumberId || !token) {
    throw new Error("WhatsApp is not configured. Add WA_PHONE_ID and WA_ACCESS_TOKEN.");
  }
 
  const when = p.daysLeft <= 0 ? "today" : `in ${p.daysLeft} day${p.daysLeft === 1 ? "" : "s"}`;
 
  const response = await fetch(`${GRAPH_URL}/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: to.replace(/\D/g, ""),
      type: "interactive",
      interactive: {
        type: "button",
        body: {
          text: `🛡️ SubSync Alert\n\n${p.subscriptionName} renews ${when} for ${p.amountText}.\n\nKeep it or cancel it?`,
        },
        action: {
          buttons: [
            { type: "reply", reply: { id: `keep:${p.subscriptionId}`, title: "Keep" } },
            { type: "reply", reply: { id: `cancel:${p.subscriptionId}`, title: "Cancel it" } },
          ],
        },
      },
    }),
  });
 
  if (!response.ok) {
    throw new Error(await response.text());
  }
}
 
export function verifyWhatsAppSignature(rawBody: string, signatureHeader: string | null): boolean {
  const secret = process.env.WHATSAPP_APP_SECRET;
  if (!secret) return true;
  if (!signatureHeader) return false;
  const expected = "sha256=" + crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(signatureHeader);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}