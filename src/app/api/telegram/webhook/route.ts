import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Check if there is a message with text
    if (body.message && body.message.text) {
      const chatId = body.message.chat.id;
      const text = body.message.text.trim();
      const firstName = body.message.from?.first_name || "there";

      let replyMessage = "";

      if (text === '/start') {
        replyMessage = `👋 Welcome to SubSync, ${firstName}!\n\nTo connect your account, copy your unique Chat ID below and paste it into your SubSync Settings page:\n\n\`${chatId}\`\n\nOnce connected, I'll alert you 3 days before any subscription charges!`;
      } else if (text === '/help') {
        replyMessage = "Need help? Just paste your Chat ID into the SubSync dashboard settings to start receiving alerts.";
      } else {
        replyMessage = "I only understand /start and /help right now! 🤖";
      }

      // Send the reply back to the user
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
