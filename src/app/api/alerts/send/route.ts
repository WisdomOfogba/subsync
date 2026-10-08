import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { userEmail, userName, telegramChatId, alertPreference, subscriptionName, amountDue, daysLeft } = await req.json();

    const brevoApiKey = process.env.BREVO_API_KEY;
    const telegramToken = process.env.TELEGRAM_BOT_TOKEN;

    let emailSent = false;
    let telegramSent = false;
    let errors = [];

    const sendEmail = alertPreference === 'Email Only' || alertPreference === 'Email & Telegram' || !alertPreference;
    const sendTelegram = (alertPreference === 'Telegram Only' || alertPreference === 'Email & Telegram') && telegramChatId;

    // Send Email via Brevo
    if (sendEmail && brevoApiKey) {
      try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'api-key': brevoApiKey
          },
          body: JSON.stringify({
            sender: {
              name: process.env.BREVO_SENDER_NAME || "SubSync Guardian",
              email: process.env.BREVO_SENDER_EMAIL || "alerts@subsync.app"
            },
            to: [{ email: userEmail, name: userName }],
            subject: `Action Required: ${subscriptionName} Renews in ${daysLeft} Days`,
            htmlContent: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
                <h2 style="color: #0f172a;">SubSync Alert 🛡️</h2>
                <p>Hello ${userName},</p>
                <p>Your subscription to <strong>${subscriptionName}</strong> is renewing soon.</p>
                <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <p style="margin: 0;"><strong>Amount:</strong> ₦${amountDue.toLocaleString()}</p>
                  <p style="margin: 0;"><strong>Time left:</strong> ${daysLeft} days</p>
                </div>
                <p>We are waiting for your permission to process this charge. If you no longer use this service, you can cancel it now to stop the leak.</p>
                <a href="http://localhost:3000/dashboard" style="display: inline-block; background-color: #4ab8f9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Review in Dashboard</a>
              </div>
            `
          })
        });
        if (response.ok) emailSent = true;
        else errors.push(await response.text());
      } catch (e: any) {
        errors.push("Email error: " + e.message);
      }
    }

    // Send Telegram
    if (sendTelegram && telegramToken) {
      try {
        const message = `🛡️ *SubSync Alert*\n\nHello ${userName},\nYour subscription to *${subscriptionName}* is renewing in ${daysLeft} days.\n\n💰 *Amount:* ₦${amountDue.toLocaleString()}\n\nPlease approve or block this transaction in your dashboard.`;
        
        const response = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text: message,
            parse_mode: 'Markdown'
          })
        });
        if (response.ok) telegramSent = true;
        else errors.push(await response.text());
      } catch (e: any) {
        errors.push("Telegram error: " + e.message);
      }
    }

    if (!emailSent && !telegramSent && errors.length > 0) {
      return NextResponse.json({ success: false, error: errors.join(" | ") }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Alert sent! Email: ${emailSent}, Telegram: ${telegramSent}` 
    });

  } catch (error: any) {
    console.error("Unified Alert Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
