import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.message && body.message.text) {
      const chatId = body.message.chat.id.toString();
      const text = body.message.text.trim();
      const firstName = body.message.from?.first_name || "there";

      let replyMessage = "";

      // Check if it's a deep link (e.g., /start uuid-1234)
      if (text.startsWith('/start')) {
        const payload = text.split(' ')[1]; // Extract the user ID from the deep link

        if (payload) {
          try {
            // Update the user's telegramChatId in the database instantly
            const user = await prisma.user.update({
              where: { id: payload },
              data: { telegramChatId: chatId }
            });
            replyMessage = `✅ Awesome, ${firstName}! Your Telegram has been successfully linked to your SubSync account (${user.email}).\n\nYou will now receive instant alerts 3 days before any subscription charges!`;
          } catch (e) {
            replyMessage = `❌ Oh no! I couldn't link your account. The link might be invalid or expired.`;
          }
        } else {
          replyMessage = `👋 Welcome to SubSync, ${firstName}!\n\nTo connect your account, please click the "Connect Telegram" button inside your SubSync dashboard settings.`;
        }
      } else if (text === '/help') {
        replyMessage = "To connect your account, please go to your SubSync dashboard settings and click the Connect button.";
      } else if (!text.startsWith('/')) {
        // AI CHATBOT LOGIC
        const user = await prisma.user.findFirst({
          where: { telegramChatId: chatId },
          include: { subscriptions: true }
        });

        if (!user) {
          replyMessage = "I don't recognize this account. Please connect your Telegram via the SubSync settings page first.";
        } else {
          // Prepare context
          const subsContext = user.subscriptions.map(s => `- ${s.name}: ₦${s.amount.toLocaleString()} (${s.category}, next billing: ${new Date(s.nextChargeDate).toDateString()})`).join('\n');
          
          const prompt = `You are SubSync AI, a helpful and concise financial assistant on Telegram.
The user asked: "${text}"

Here is their current subscription data:
${subsContext || "No active subscriptions."}

Current date: ${new Date().toDateString()}

Answer the user's question precisely based on the data. If they ask a general question, answer it. Keep it conversational, short, and use markdown for formatting. DO NOT answer questions completely unrelated to finance/subscriptions.`;

          const geminiApiKey = process.env.GEMINI_API_KEY;
          if (geminiApiKey) {
            try {
              const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  contents: [{ parts: [{ text: prompt }] }]
                })
              });
              const aiData = await aiRes.json();
              if (aiData.candidates && aiData.candidates[0]?.content?.parts[0]?.text) {
                replyMessage = aiData.candidates[0].content.parts[0].text;
              } else {
                replyMessage = "Sorry, my AI brain is experiencing a temporary glitch!";
              }
            } catch (e) {
              replyMessage = "Sorry, I couldn't connect to my AI server right now.";
            }
          } else {
             replyMessage = "I am not fully awake yet. The developer needs to add the GEMINI_API_KEY to the environment variables.";
          }
        }
      } else {
        replyMessage = "I didn't understand that command. Try asking me about your subscriptions!";
      }

      const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
      if (telegramToken) {
        await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: replyMessage,
            parse_mode: 'Markdown'
          })
        });
      }
    }

    // Always return 200 OK to Telegram so it doesn't retry
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Telegram Webhook Error:", error);
    return NextResponse.json({ ok: true }); // Still return 200 to prevent retries
  }
}
