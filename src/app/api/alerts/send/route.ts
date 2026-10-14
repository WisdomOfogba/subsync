import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { wantsChannel } from '@/lib/assistant';
import { sendWhatsAppReminder, sendWhatsAppAlert } from '@/lib/whatsapp';


export async function POST(req: Request) {
  try {
    const { userEmail, userName, telegramChatId, whatsappPhone, alertPreference, subscriptionId, subscriptionName, amountDue, daysLeft } = await req.json();

    const brevoApiKey = process.env.BREVO_API_KEY;
    const telegramToken = process.env.TELEGRAM_BOT_TOKEN;

    let emailSent = false;
    let telegramSent = false;
    let whatsappSent = false;
    let errors = [];

    // Check DB for latest user phone/chatId if missing from payload
    let resolvedWhatsAppPhone = whatsappPhone;
    let resolvedTelegramChatId = telegramChatId;
    let resolvedAlertPreference = alertPreference;
    if ((!resolvedWhatsAppPhone || !resolvedTelegramChatId) && userEmail) {
      try {
        const dbUser = await prisma.user.findUnique({ where: { email: userEmail } });
        if (dbUser) {
          if (!resolvedWhatsAppPhone && dbUser.whatsappPhone) resolvedWhatsAppPhone = dbUser.whatsappPhone;
          if (!resolvedTelegramChatId && dbUser.telegramChatId) resolvedTelegramChatId = dbUser.telegramChatId;
          if (!resolvedAlertPreference) resolvedAlertPreference = dbUser.alertPreference;
        }
      } catch (err) {
        console.error("Failed to query DB user for alerts:", err);
      }
    }

    const sendEmail = wantsChannel(resolvedAlertPreference, "email");
    const sendTelegram = wantsChannel(resolvedAlertPreference, "telegram") && resolvedTelegramChatId;
    const sendWhatsApp = wantsChannel(resolvedAlertPreference, "whatsapp") && resolvedWhatsAppPhone;
    console.log("alert debug:", { 
      alertPreference: resolvedAlertPreference, 
      whatsappPhone: resolvedWhatsAppPhone, 
      telegramChatId: resolvedTelegramChatId,
      sendWhatsApp: Boolean(sendWhatsApp) 
    });

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
                <a href="https://sub-sync-ng.vercel.app/dashboard" style="display: inline-block; background-color: #4ab8f9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Review in Dashboard</a>
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
            chat_id: resolvedTelegramChatId,
            text: message,
            parse_mode: 'Markdown'
          })
        });
        if (response.ok) {
          telegramSent = true;
        } else {
          // If markdown fails, retry plain text
          const plainRes = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: resolvedTelegramChatId,
              text: message.replace(/[*_]/g, '')
            })
          });
          if (plainRes.ok) telegramSent = true;
          else errors.push(await plainRes.text());
        }
      } catch (e: any) {
        errors.push("Telegram error: " + e.message);
      }
    }

    // Send WhatsApp
    if (sendWhatsApp) {
      try {
        try {
          if (!subscriptionId) throw new Error("no subscriptionId");
          await sendWhatsAppReminder(resolvedWhatsAppPhone, {
            subscriptionId,
            subscriptionName,
            amountText: `₦${amountDue.toLocaleString()}`,
            daysLeft,
          });
          await prisma.subscription.update({
            where: { id: subscriptionId },
            data: { reminderSentAt: new Date() },
          });
        } catch {
          // Fall back to template or text alert
          await sendWhatsAppAlert(resolvedWhatsAppPhone, { userName, subscriptionName, amountDue, daysLeft });
        }
        whatsappSent = true;
      } catch (e: any) {
        console.error("WhatsApp send alert failure:", e);
        errors.push("WhatsApp error: " + e.message);
      }
    }

    if (!emailSent && !telegramSent && !whatsappSent && errors.length > 0) {
      return NextResponse.json({ success: false, error: errors.join(" | ") }, { status: 500 });
    }

    console.log("alert result:", { emailSent, telegramSent, whatsappSent, errors });
    return NextResponse.json({ 
      success: true, 
      message: `Alert sent! Email: ${emailSent}, Telegram: ${telegramSent}, WhatsApp: ${whatsappSent}` 
    });

  } catch (error: any) {
    console.error("Unified Alert Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
