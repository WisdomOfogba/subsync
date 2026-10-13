type Guide = { url?: string; steps: string };

// Keys are lower-case subscription names, matched EXACTLY against the name saved in your database
// (after lower-casing and trimming). If your app saves "Netflix Premium", add a key for that too.
// Cancellation screens change often: click through each link yourself before the demo.

const NETFLIX: Guide = {
  // Source: Netflix Help Center, "How to cancel Netflix"
  url: "https://help.netflix.com/en/node/121955",
  steps:
    "1. Sign in at netflix.com and open your Account page.\n" +
    "2. In the Membership section, choose Cancel (Manage your membership).\n" +
    "3. Tap Finish Cancellation to confirm.\n\n" +
    "Signing out or deleting the app does NOT cancel it. If Netflix is billed through a partner (Apple, Google Play or a mobile provider), cancel with them instead. Access normally continues until the end of your billing period.",
};

const SPOTIFY: Guide = {
  // Source: several consistent how-to guides. NOT checked against Spotify's own help page: verify before the demo.
  url: "https://www.spotify.com/account/",
  steps:
    "1. Open Spotify in a web browser (you can't cancel inside the app) and log in.\n" +
    "2. Go to your Account page, then Change plan.\n" +
    "3. Scroll to the Spotify Free card and tap Cancel Premium.\n" +
    "4. Confirm with Yes, cancel.\n\n" +
    "If you pay through Apple, Google Play, PayPal or a phone/broadband provider, cancel with them instead.",
};

const YOUTUBE_PREMIUM: Guide = {
  // Source: Google's YouTube Help, "Cancel YouTube Premium or YouTube Music Premium"
  url: "https://www.youtube.com/paid_memberships",
  steps:
    "1. Open YouTube and tap your profile picture, then Paid memberships.\n" +
    "2. Tap the membership you want to cancel.\n" +
    "3. Tap Continue to cancel.\n" +
    "4. Pick a reason, tap Next, then tap Yes, cancel.\n\n" +
    "If you subscribed through Apple, cancel in your Apple account. If it's billed through Google Play, cancel in Google Play. Your benefits continue until the end of the billing period, and cancelling during a free trial stops it from turning into a paid plan.",
};

const GUIDES: Record<string, Guide> = {
  netflix: NETFLIX,
  spotify: SPOTIFY,
  "spotify premium": SPOTIFY,
  "youtube premium": YOUTUBE_PREMIUM,
  youtube: YOUTUBE_PREMIUM,
  "youtube music premium": YOUTUBE_PREMIUM,
};

export function getCancelGuide(name: string): Guide | null {
  return GUIDES[name.trim().toLowerCase()] ?? null;
}