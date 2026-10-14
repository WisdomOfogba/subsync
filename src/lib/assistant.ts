import { billingCycleLabel, getUpcomingChargeDate } from "@/lib/utils";

type AssistantUser = {
  email: string;
  subscriptions: {
    name: string;
    amount: number;
    category: string;
    billingCycle: string;
    nextChargeDate: Date;
  }[];
};

export async function answerSubscriptionQuestion(user: AssistantUser, text: string, channel: "Telegram" | "WhatsApp") {
  const subsContext = user.subscriptions.map((s) => {
    const next = getUpcomingChargeDate(s.nextChargeDate, s.billingCycle);
    return `- ${s.name}: ₦${s.amount.toLocaleString()} (${s.category}, ${billingCycleLabel(s.billingCycle)}, next billing: ${next.toDateString()})`;
  }).join("\n");

  const prompt = `You are SubSync AI, a helpful and concise financial assistant on ${channel}.
The user asked: "${text}"

Here is their current subscription data:
${subsContext || "No active subscriptions."}

Current date: ${new Date().toDateString()}

Answer the user's question precisely based on the data. If they ask a general question, answer it. Keep it conversational, short, and use markdown for formatting. DO NOT answer questions completely unrelated to finance/subscriptions.`;

  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    return "I am not fully awake yet. The developer needs to add the GEMINI_API_KEY to the environment variables.";
  }


  const model = process.env.GEMINI_MODEL || "gemini-3.8-flash";
  try {
    const aiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": geminiApiKey },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );
    const aiData = await aiRes.json();
    if (!aiRes.ok) {
      console.error("Gemini error:", aiRes.status, JSON.stringify(aiData?.error ?? aiData));
      return "Sorry, my AI brain is experiencing a temporary glitch!";
    }
    const parts = aiData.candidates?.[0]?.content?.parts || [];
    const answer = parts
      .filter((p: { text?: string; thought?: boolean }) => !p.thought && p.text)
      .map((p: { text?: string }) => p.text)
      .join("") || parts.map((p: { text?: string }) => p.text || "").join("");

    if (answer?.trim()) return answer.trim();
  } catch (error) {
    console.error("Gemini request exception:", error);
  }
  return "Sorry, my AI brain is experiencing a temporary glitch!";
}

export function wantsChannel(alertPreference: string | undefined, channel: "email" | "telegram" | "whatsapp") {
  const pref = (alertPreference || "Email Only").toLowerCase();
  if (pref.includes("all")) return true;
  if (channel === "email") {
    return pref.includes("email") || pref === "email only (default)" || !alertPreference;
  }
  if (channel === "telegram") return pref.includes("telegram");
  return pref.includes("whatsapp");
}
