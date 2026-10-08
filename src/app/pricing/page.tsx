import { Button } from "@/components/ui/Button";
import { CheckCircle2, ShieldCheck, X } from "lucide-react";
import Link from "next/link";

export default function Pricing() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="flex-grow pt-32 pb-24 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-gray-900 tracking-tight">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            Stop losing money to hidden subscriptions. Pay a small fee to save thousands.
          </p>

          <div className="mt-16 grid md:grid-cols-2 gap-8 max-w-3xl mx-auto text-left">
            
            {/* Free Tier */}
            <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-200"></div>
              <h3 className="text-xl font-heading font-bold text-gray-900">Basic Tracker</h3>
              <div className="mt-4 flex items-baseline text-5xl font-extrabold tracking-tight text-gray-900">
                ₦0
                <span className="ml-1 text-xl font-medium text-gray-500">/mo</span>
              </div>
              <p className="mt-4 text-sm text-gray-500">Perfect for manually tracking your expenses.</p>
              
              <ul className="mt-8 space-y-4 flex-1">
                <li className="flex items-center gap-3 text-sm text-gray-700">
                  <CheckCircle2 className="h-5 w-5 text-gray-400" /> Track up to 5 subscriptions
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-700">
                  <CheckCircle2 className="h-5 w-5 text-gray-400" /> Basic email alerts
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-400 opacity-60">
                  <X className="h-5 w-5" /> No Virtual Cards
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-400 opacity-60">
                  <X className="h-5 w-5" /> No Auto-Allocation
                </li>
              </ul>
              
              <Link href="/signup" className="mt-8 block w-full">
                <Button variant="outline" className="w-full h-12 rounded-xl text-base">Get Started</Button>
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="rounded-3xl border border-primary/20 bg-primary/5 p-8 shadow-[0_8px_30px_rgb(74,184,249,0.12)] flex flex-col relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-primary"></div>
              <div className="absolute top-6 right-8">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                  Most Popular
                </span>
              </div>
              <h3 className="text-xl font-heading font-bold text-gray-900">SubSync Pro</h3>
              <div className="mt-4 flex items-baseline text-5xl font-extrabold tracking-tight text-gray-900">
                ₦1,500
                <span className="ml-1 text-xl font-medium text-gray-500">/mo</span>
              </div>
              <p className="mt-4 text-sm text-gray-700">The full financial guardian experience.</p>
              
              <ul className="mt-8 space-y-4 flex-1">
                <li className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                  <ShieldCheck className="h-5 w-5 text-primary" /> Unlimited Subscriptions
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                  <ShieldCheck className="h-5 w-5 text-primary" /> SubSync Wallet & Auto-Allocation
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                  <ShieldCheck className="h-5 w-5 text-primary" /> Virtual Cards powered by Bridgecard
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                  <ShieldCheck className="h-5 w-5 text-primary" /> Permission-First Debit Interception
                </li>
              </ul>
              
              <Link href="/signup" className="mt-8 block w-full">
                <Button className="w-full h-12 rounded-xl text-base shadow-lg shadow-primary/25">Upgrade to Pro</Button>
              </Link>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
