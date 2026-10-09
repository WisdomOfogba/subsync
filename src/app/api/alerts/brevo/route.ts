import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { userEmail, userName, subscriptionName, amountDue, daysLeft } = await req.json();

    const brevoApiKey = process.env.BREVO_API_KEY;
    if (!brevoApiKey) {
      return NextResponse.json({ error: "Missing BREVO_API_KEY in .env" }, { status: 500 });
    }

    // Call Brevo's SMTP Transactional Email API
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
        to: [
          {
            email: userEmail,
            name: userName
          }
        ],
        subject: `Action Required: ${subscriptionName} Renews in ${daysLeft} Days`,
        htmlContent: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
            <h2 style="color: #0f172a;">SubSync Alert 🔔</h2>
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

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to send email via Brevo');
    }

    return NextResponse.json({ success: true, message: 'Alert email sent successfully!' });

  } catch (error: any) {
    console.error("Brevo API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
