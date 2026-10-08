import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { Check } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stop losing money to forgotten subscriptions. Choose a plan that fits your lifestyle.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className="rounded-3xl bg-white p-8 border shadow-sm">
            <h3 className="font-heading text-2xl font-bold text-slate-900 mb-2">Basic</h3>
            <p className="text-muted-foreground mb-6">Perfect for managing everyday bills and avoiding late fees.</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-slate-900">Free</span>
              <span className="text-muted-foreground">/forever</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-slate-700">
                <Check className="h-5 w-5 text-primary mr-3 shrink-0" />
                Up to 5 active commitments (Subscriptions/Bills)
              </li>
              <li className="flex items-center text-slate-700">
                <Check className="h-5 w-5 text-primary mr-3 shrink-0" />
                Paystack & Bridgecard Integration
              </li>
              <li className="flex items-center text-slate-700">
                <Check className="h-5 w-5 text-primary mr-3 shrink-0" />
                Basic WhatsApp/Telegram Reminders
              </li>
              <li className="flex items-center text-slate-700">
                <Check className="h-5 w-5 text-primary mr-3 shrink-0" />
                "Ask for Permission" intercept feature
              </li>
            </ul>
            <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white" size="lg">
              Get Started for Free
            </Button>
          </div>

          {/* Premium Tier */}
          <div className="rounded-3xl bg-primary/5 p-8 border border-primary/20 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
              RECOMMENDED
            </div>
            <h3 className="font-heading text-2xl font-bold text-primary mb-2">Pro</h3>
            <p className="text-muted-foreground mb-6">For power users with multiple streaming services, Ajo, and rents.</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-slate-900">₦1,500</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-slate-700">
                <Check className="h-5 w-5 text-primary mr-3 shrink-0" />
                Unlimited commitments
              </li>
              <li className="flex items-center text-slate-700">
                <Check className="h-5 w-5 text-primary mr-3 shrink-0" />
                Advanced analytics (Where your money goes)
              </li>
              <li className="flex items-center text-slate-700">
                <Check className="h-5 w-5 text-primary mr-3 shrink-0" />
                Interactive Chatbot Approvals via WhatsApp
              </li>
              <li className="flex items-center text-slate-700">
                <Check className="h-5 w-5 text-primary mr-3 shrink-0" />
                Priority Support
              </li>
            </ul>
            <Button className="w-full bg-primary hover:bg-primary/90 text-white" size="lg">
              Upgrade to Pro
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
