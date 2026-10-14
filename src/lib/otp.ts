import crypto from "crypto";

const SECRET = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || "subsync_otp_secret_key_2026";

export interface OtpPayload {
  userId: string;
  phone: string;
  code: string;
  exp: number; // timestamp in ms
}

export function generateOtpToken(userId: string, phone: string, code: string): string {
  const exp = Date.now() + 10 * 60 * 1000; // 10 minutes
  const payload: OtpPayload = { userId, phone, code, exp };
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", SECRET).update(payloadStr).digest("base64url");
  return `${payloadStr}.${signature}`;
}

export function verifyOtpToken(token: string, userId: string, phone: string, inputCode: string): { valid: boolean; error?: string } {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) {
      return { valid: false, error: "Invalid verification token format" };
    }
    const [payloadStr, signature] = parts;
    const expectedSig = crypto.createHmac("sha256", SECRET).update(payloadStr).digest("base64url");
    
    if (signature.length !== expectedSig.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      return { valid: false, error: "Invalid token signature" };
    }
    
    const payload: OtpPayload = JSON.parse(Buffer.from(payloadStr, "base64url").toString());
    
    if (Date.now() > payload.exp) {
      return { valid: false, error: "Verification code has expired. Please request a new code." };
    }
    if (payload.userId !== userId) {
      return { valid: false, error: "User session mismatch" };
    }
    const cleanPhone = phone.replace(/\D/g, "");
    const expectedPhone = payload.phone.replace(/\D/g, "");
    if (cleanPhone !== expectedPhone) {
      return { valid: false, error: "Phone number mismatch" };
    }
    if (payload.code.trim() !== inputCode.trim()) {
      return { valid: false, error: "Incorrect verification code. Please check and try again." };
    }
    return { valid: true };
  } catch (err: any) {
    return { valid: false, error: err.message || "Failed to verify token" };
  }
}
