"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, ShieldCheck, CreditCard, BellRing, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";

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
      <main className="flex-grow pt-24">
        
        {/* Hero Section */}
        <section className="relative overflow-hidden px-6 pt-20 pb-32 text-center md:pt-32 md:pb-40">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-white" />
          
          <div className="container mx-auto max-w-5xl">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              Powered by Nomba & Bridgecard
            </div>
            
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

            {/* Money Leak Animation Graphic */}
            <div className="relative mx-auto mt-20 max-w-3xl animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 h-full w-full" />
              
              <div className="relative rounded-2xl border border-slate-200/60 bg-white/50 backdrop-blur-sm p-4 shadow-2xl flex flex-col items-center">
                
                {/* Floating Bubbles / Ticker simulating leaks */}
                <div className="absolute -top-12 left-1/4 animate-bounce delay-75 opacity-70">
                  <div className="rounded-full bg-red-50 text-red-600 px-3 py-1.5 text-xs font-semibold shadow-sm border border-red-100 flex items-center">
                    - ₦4,500 <span className="text-gray-400 ml-1 text-[10px] font-normal">Netflix</span>
                  </div>
                </div>
                <div className="absolute -top-6 right-1/4 animate-bounce delay-150 opacity-50">
                  <div className="rounded-full bg-red-50 text-red-600 px-3 py-1.5 text-xs font-semibold shadow-sm border border-red-100 flex items-center">
                    - ₦900 <span className="text-gray-400 ml-1 text-[10px] font-normal">Spotify</span>
                  </div>
                </div>
                <div className="absolute top-10 -left-8 animate-bounce delay-300 opacity-60 hidden md:block">
                  <div className="rounded-full bg-red-50 text-red-600 px-3 py-1.5 text-xs font-semibold shadow-sm border border-red-100 flex items-center">
                    - ₦15,000 <span className="text-gray-400 ml-1 text-[10px] font-normal">NEPA</span>
                  </div>
                </div>

                <div className="w-full h-48 bg-gradient-to-b from-slate-50 to-white rounded-xl border border-slate-100 flex items-center justify-center flex-col relative overflow-hidden">
                  <ShieldCheck className="h-12 w-12 text-primary mb-3" />
                  <p className="font-medium text-slate-800">We caught a sneaky charge.</p>
                  <p className="text-sm text-slate-500 mt-1">Awaiting your permission to debit ₦4,500.</p>
                  <Button variant="secondary" size="sm" className="mt-4 rounded-full pointer-events-none">Approve Transaction</Button>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* The Problem Section */}
        <section className="border-t border-slate-100 bg-white py-24">
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
              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 shadow-inner">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-red-100">
                    <span className="text-sm font-semibold text-slate-900">Gym Membership</span>
                    <span className="text-sm font-bold text-red-500">- ₦25,000</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-red-100">
                    <span className="text-sm font-semibold text-slate-900">Forgotten VPN</span>
                    <span className="text-sm font-bold text-red-500">- ₦6,500</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-red-100">
                    <span className="text-sm font-semibold text-slate-900">Cloud Storage</span>
                    <span className="text-sm font-bold text-red-500">- ₦3,200</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="border-t border-slate-100 bg-slate-50 py-24">
          <div className="container mx-auto px-6 max-w-5xl text-center">
            <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
              The SubSync Workflow
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-16">Your Financial Guardian</h2>
            
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div className="p-8 bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 hover:border-primary/30 transition-colors">
                <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
                  <CreditCard className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">1. Centralized Deposit</h3>
                <p className="text-slate-600 leading-relaxed">Fund your SubSync wallet once a month. Stop linking your primary bank cards to dozens of random websites.</p>
              </div>
              <div className="p-8 bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 hover:border-orange-500/30 transition-colors">
                <div className="h-14 w-14 rounded-2xl bg-orange-50 flex items-center justify-center mb-6">
                  <BellRing className="h-7 w-7 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">2. Early Warnings</h3>
                <p className="text-slate-600 leading-relaxed">Three days before any scheduled charge or free-trial conversion, our system sends you an actionable alert.</p>
              </div>
              <div className="p-8 bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 hover:border-green-500/30 transition-colors">
                <div className="h-14 w-14 rounded-2xl bg-green-50 flex items-center justify-center mb-6">
                  <CheckCircle2 className="h-7 w-7 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">3. Absolute Control</h3>
                <p className="text-slate-600 leading-relaxed">Approve the transaction, or block it instantly. No more hunting for cancellation buttons on merchant websites.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Highlights */}
        <section id="features" className="py-24 bg-white">
          <div className="container mx-auto px-6 max-w-5xl">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-16 text-center">Everything you need to stop leaks</h2>
            
            <div className="space-y-20">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1 bg-slate-50 p-8 rounded-3xl border border-slate-100">
                  <div className="space-y-4">
                    <div className="h-2 w-1/3 bg-slate-200 rounded-full"></div>
                    <div className="h-2 w-full bg-slate-200 rounded-full"></div>
                    <div className="h-2 w-4/5 bg-slate-200 rounded-full"></div>
                  </div>
                </div>
                <div className="order-1 md:order-2">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Unified Analytics Dashboard</h3>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    Instantly see your total monthly burn rate and yearly projections. Categorize your spend into Streaming, Utilities, and Savings to know exactly where your money goes.
                  </p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Smart Permission Interception</h3>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    By issuing distinct virtual cards for your merchants, SubSync intercepts charges before they happen. If you don't approve it, the merchant gets nothing.
                  </p>
                </div>
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 flex items-center justify-center">
                   <ShieldCheck className="h-24 w-24 text-primary opacity-50" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="relative overflow-hidden bg-slate-900 py-24 text-center">
          <div className="absolute inset-0 bg-primary/10" />
          <div className="container relative z-10 mx-auto px-6 max-w-3xl">
            <h2 className="font-heading text-4xl font-bold text-white mb-6">Ready to stop losing money?</h2>
            <p className="text-lg text-slate-300 mb-10">Join thousands of users who have taken back control of their financial footprint.</p>
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
          <div className="font-heading font-semibold text-gray-900 mb-4 md:mb-0">SubSync</div>
          <div>&copy; 2026 SubSync. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
