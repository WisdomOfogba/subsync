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
      } else {
        replyMessage = "I only understand /start and /help right now! 🤖";
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
