"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, ShieldCheck, CreditCard, BellRing, CheckCircle2, Lock, Zap, RefreshCw } from "lucide-react";

export default function LandingPage() {
  const { user, setUser } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedUser = localStorage.getItem("subsync_user");
    if (savedUser && !user) {
      setUser(JSON.parse(savedUser));
    }
  }, [user, setUser]);

  return (
    <div className="flex min-h-screen flex-col bg-white selection:bg-primary/20">
      <Navbar />
      <main className="flex-grow pt-24">
        
        {/* 1. Hero Section */}
        <section className="relative overflow-hidden px-6 pt-20 pb-24 text-center md:pt-32 md:pb-32 border-b border-slate-100">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-white" />
          <div className="container mx-auto max-w-5xl">
            <h1 className="font-heading text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-1000">
              Stop Subscription Leaks.<br />
              <span className="text-primary relative inline-block mt-2">
                Take Back Control.
                <svg className="absolute -bottom-2 w-full h-3 text-secondary/40" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="transparent"/></svg>
              </span>
            </h1>
            <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
              Make one deposit into your SubSync wallet. We auto-allocate your commitments and ask for your permission before any transaction is permitted.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
              {mounted && user ? (
                <Link href="/dashboard">
                  <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg shadow-primary/25 group">
                    Go to Dashboard <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              ) : (
                <Link href="/signup">
                  <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg shadow-primary/25 group">
                    Get Started for Free <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* 2. Social Proof / Metrics Section */}
        <section className="bg-white py-12 border-b border-slate-100">
          <div className="container mx-auto px-6 max-w-5xl text-center">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-8">The Financial Guardian Trusted By Innovators</p>
            <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-60 grayscale">
              {/* Abstract placeholders for trust markers */}
              <div className="flex items-center gap-2"><ShieldCheck className="h-6 w-6"/> <span className="font-heading font-bold text-lg">SecureTech</span></div>
              <div className="flex items-center gap-2"><Lock className="h-6 w-6"/> <span className="font-heading font-bold text-lg">FinGuard</span></div>
              <div className="flex items-center gap-2"><Zap className="h-6 w-6"/> <span className="font-heading font-bold text-lg">FastPay</span></div>
            </div>
          </div>
        </section>

        {/* 3. The Problem Section */}
        <section className="bg-slate-50 py-24 border-b border-slate-100">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-heading font-bold text-slate-900 mb-6">The System is Designed Against You</h2>
                <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                  Companies rely on you forgetting. They make signing up frictionless but hide the cancellation button behind dark patterns and endless phone menus. 
                </p>
                <p className="text-lg text-slate-600 leading-relaxed">
                  When your payments are scattered across different cards and apps, it's incredibly easy to lose track of how much money is quietly leaking from your accounts every month.
                </p>
              </div>
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-red-100">
                    <span className="text-sm font-semibold text-slate-900">Gym Membership</span>
                    <span className="text-sm font-bold text-red-500">- ₦25,000</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-red-100">
                    <span className="text-sm font-semibold text-slate-900">Forgotten VPN</span>
                    <span className="text-sm font-bold text-red-500">- ₦6,500</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-red-100">
                    <span className="text-sm font-semibold text-slate-900">Cloud Storage</span>
                    <span className="text-sm font-bold text-red-500">- ₦3,200</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. The Solution Section */}
        <section className="bg-white py-24 border-b border-slate-100">
          <div className="container mx-auto px-6 max-w-5xl text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-6">A Single Wallet. Total Protection.</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-16 leading-relaxed">
              Instead of exposing your primary bank account to dozens of merchants, fund your SubSync wallet once. We issue unique, isolated virtual cards for every service, locking them down until you say so.
            </p>
            <div className="max-w-3xl mx-auto bg-slate-50 rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
               <div className="flex justify-center mb-6">
                 <ShieldCheck className="h-16 w-16 text-primary" />
               </div>
               <h3 className="text-2xl font-bold text-slate-900 mb-2">Permission-First Infrastructure</h3>
               <p className="text-slate-600">No merchant can pull money from your account without an active, explicit approval token generated by your dashboard.</p>
            </div>
          </div>
        </section>

        {/* 5. How it Works (3 Steps) */}
        <section id="how-it-works" className="bg-slate-900 py-24 border-b border-slate-800 text-white">
          <div className="container mx-auto px-6 max-w-5xl text-center">
            <div className="inline-flex items-center rounded-full bg-primary/20 px-3 py-1 text-sm font-medium text-primary-300 mb-6 border border-primary/30">
              The SubSync Workflow
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-16">Three Steps to Financial Peace</h2>
            
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div className="p-8 bg-slate-800 rounded-3xl border border-slate-700">
                <div className="h-14 w-14 rounded-2xl bg-slate-700 flex items-center justify-center mb-6">
                  <CreditCard className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">1. One Deposit</h3>
                <p className="text-slate-400 leading-relaxed">Fund your SubSync wallet once a month. Stop linking your primary bank cards to dozens of random websites.</p>
              </div>
              <div className="p-8 bg-slate-800 rounded-3xl border border-slate-700">
                <div className="h-14 w-14 rounded-2xl bg-slate-700 flex items-center justify-center mb-6">
                  <BellRing className="h-7 w-7 text-orange-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">2. Early Warnings</h3>
                <p className="text-slate-400 leading-relaxed">Three days before any scheduled charge or free-trial conversion, our system sends you an actionable alert.</p>
              </div>
              <div className="p-8 bg-slate-800 rounded-3xl border border-slate-700">
                <div className="h-14 w-14 rounded-2xl bg-slate-700 flex items-center justify-center mb-6">
                  <CheckCircle2 className="h-7 w-7 text-green-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">3. Absolute Control</h3>
                <p className="text-slate-400 leading-relaxed">Approve the transaction, or block it instantly. No more hunting for cancellation buttons on merchant websites.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Feature Deep Dive: Unified Analytics */}
        <section id="features" className="bg-white py-24">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="order-2 md:order-1 bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-sm">
                 <div className="space-y-4">
                    <div className="h-3 w-1/3 bg-primary/20 rounded-full"></div>
                    <div className="h-3 w-full bg-slate-200 rounded-full"></div>
                    <div className="h-3 w-4/5 bg-slate-200 rounded-full"></div>
                    <div className="h-3 w-2/3 bg-slate-200 rounded-full"></div>
                  </div>
              </div>
              <div className="order-1 md:order-2">
                <h2 className="text-3xl font-heading font-bold text-slate-900 mb-6">Unified Analytics Dashboard</h2>
                <p className="text-lg text-slate-600 leading-relaxed mb-6">
                  Instantly see your total monthly burn rate and yearly projections. Categorize your spend into Streaming, Utilities, and Software to know exactly where your money goes.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-slate-700 font-medium"><CheckCircle2 className="h-5 w-5 text-primary mr-3" /> Real-time spend tracking</li>
                  <li className="flex items-center text-slate-700 font-medium"><CheckCircle2 className="h-5 w-5 text-primary mr-3" /> Categorized visual breakdowns</li>
                  <li className="flex items-center text-slate-700 font-medium"><CheckCircle2 className="h-5 w-5 text-primary mr-3" /> Yearly cost projections</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Feature Deep Dive: Telegram Integrations */}
        <section className="bg-slate-50 py-24 border-t border-slate-100">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-heading font-bold text-slate-900 mb-6">Instant Alerts Anywhere</h2>
                <p className="text-lg text-slate-600 leading-relaxed mb-6">
                  Don't want another app cluttering your phone? We deliver critical alerts exactly where you already are.
                </p>
                <p className="text-lg text-slate-600 leading-relaxed mb-6">
                  Connect your SubSync account to our official Telegram bot to receive real-time push notifications 3 days before any subscription is due for renewal.
                </p>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl flex items-center justify-center">
                 <div className="text-center">
                   <div className="inline-flex items-center justify-center h-16 w-16 bg-blue-50 text-blue-500 rounded-full mb-4">
                     <BellRing className="h-8 w-8" />
                   </div>
                   <p className="font-bold text-slate-900 text-lg">Action Required</p>
                   <p className="text-slate-500 text-sm mt-2">Netflix renews in 3 days for ₦4,500.</p>
                   <div className="mt-4 flex justify-center gap-2">
                     <span className="px-4 py-1.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full border border-slate-200">Approve</span>
                     <span className="px-4 py-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded-full border border-red-100">Block</span>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Use Cases */}
        <section className="bg-white py-24 border-t border-slate-100">
          <div className="container mx-auto px-6 max-w-5xl text-center">
            <h2 className="text-3xl font-heading font-bold text-slate-900 mb-12">Who is this for?</h2>
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <h4 className="font-bold text-lg mb-2">The Free-Trial Hunter</h4>
                <p className="text-slate-600">Sign up for 7-day free trials without the anxiety. If you forget to cancel, SubSync simply blocks the charge when the trial ends.</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <h4 className="font-bold text-lg mb-2">The SaaS Entrepreneur</h4>
                <p className="text-slate-600">Keep AWS, Vercel, and OpenAI APIs on one dedicated virtual card, tightly scoped with budget limits so a rogue script doesn't drain your bank account.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 9. Pricing */}
        <section id="pricing" className="bg-slate-900 py-24 text-white">
          <div className="container mx-auto px-6 max-w-5xl text-center">
            <h2 className="text-3xl font-heading font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-slate-400 mb-12 max-w-xl mx-auto">Get a dedicated USD virtual card that shields you from FX fluctuations. Pay for Netflix in dollars using today's rate, safely.</p>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
              <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700 flex flex-col">
                <h3 className="text-xl font-bold mb-2">Basic</h3>
                <p className="text-slate-400 text-sm mb-6">Perfect for managing local subscriptions.</p>
                <div className="text-4xl font-bold mb-6">Free<span className="text-lg font-normal text-slate-400">/forever</span></div>
                
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-center text-slate-300 text-sm"><CheckCircle2 className="h-4 w-4 mr-3 text-primary" /> 1 Naira Virtual Card</li>
                  <li className="flex items-center text-slate-300 text-sm"><CheckCircle2 className="h-4 w-4 mr-3 text-primary" /> Telegram alerts</li>
                  <li className="flex items-center text-slate-300 text-sm"><CheckCircle2 className="h-4 w-4 mr-3 text-primary" /> Basic Analytics</li>
                </ul>
                <Button className="w-full bg-slate-700 hover:bg-slate-600 text-white" variant="outline">Get Started</Button>
              </div>

              <div className="bg-white rounded-3xl p-8 border-4 border-primary flex flex-col relative transform md:-translate-y-4 shadow-2xl shadow-primary/20">
                <div className="absolute top-0 right-8 transform -translate-y-1/2">
                  <span className="bg-primary text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">Most Popular</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Pro</h3>
                <p className="text-slate-500 text-sm mb-6">For the ultimate SaaS and streaming power user.</p>
                <div className="text-4xl font-bold text-slate-900 mb-6">₦2,500<span className="text-lg font-normal text-slate-500">/month</span></div>
                
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-center text-slate-700 text-sm"><CheckCircle2 className="h-4 w-4 mr-3 text-primary" /> <strong className="ml-1 mr-1">Unlimited</strong> USD Virtual Cards</li>
                  <li className="flex items-center text-slate-700 text-sm"><CheckCircle2 className="h-4 w-4 mr-3 text-primary" /> Lock-in FX rates for subscriptions</li>
                  <li className="flex items-center text-slate-700 text-sm"><CheckCircle2 className="h-4 w-4 mr-3 text-primary" /> WhatsApp & Telegram AI Assistant</li>
                  <li className="flex items-center text-slate-700 text-sm"><CheckCircle2 className="h-4 w-4 mr-3 text-primary" /> 1-Click Subscription Cancellation</li>
                </ul>
                <Button className="w-full shadow-lg shadow-primary/30">Start 14-Day Trial</Button>
              </div>
            </div>
          </div>
        </section>

        {/* 10. FAQs */}
        <section className="bg-slate-50 py-24 border-t border-slate-100">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-3xl font-heading font-bold text-slate-900 mb-12 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 mb-2">How do I fund my wallet?</h4>
                <p className="text-slate-600 text-sm">We provide a dedicated virtual account. You simply do a bank transfer from any Nigerian bank, and your wallet balance updates instantly.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 mb-2">What happens if I block a charge?</h4>
                <p className="text-slate-600 text-sm">The merchant will receive an "Insufficient Funds" or "Declined" response. They will usually email you asking to update your payment method, giving you the power to officially cancel on your own terms.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 mb-2">How do the Telegram alerts work?</h4>
                <p className="text-slate-600 text-sm">Just connect your Telegram Chat ID in the Settings page. Our bot will push a message to your phone 3 days before any subscription is due.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 10. Bottom CTA */}
        <section className="relative overflow-hidden bg-white py-32 text-center border-t border-slate-100">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5" />
          <div className="container relative z-10 mx-auto px-6 max-w-3xl">
            <h2 className="font-heading text-4xl font-bold text-slate-900 mb-6">Ready to stop losing money?</h2>
            <p className="text-lg text-slate-600 mb-10">Join thousands of users who have taken back control of their financial footprint.</p>
            {mounted && user ? (
              <Link href="/dashboard">
                <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg bg-primary hover:bg-primary/90 text-white border-0">
                  Enter Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/signup">
                <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg bg-primary hover:bg-primary/90 text-white border-0">
                  Create your free account
                </Button>
              </Link>
            )}
          </div>
        </section>
      </main>
      
      <footer className="border-t border-gray-100 bg-white py-12">
        <div className="container mx-auto px-6 max-w-5xl flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <img src="/Subsynclogo.svg" alt="SubSync Logo" className="h-6 w-6 rounded-sm object-contain" />
            <div className="font-heading font-semibold text-gray-900">SubSync</div>
          </div>
          <div>&copy; 2026 SubSync. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
