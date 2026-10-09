"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { CreditCard, Loader2, Lock, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

export default function SimulationPage() {
  const [formData, setFormData] = useState({ cardNumber: "", expiry: "", cvv: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "failed">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    
    try {
      const res = await fetch("/api/simulation/charge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, amount: 4500, merchant: "Netflix" })
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        setStatus("success");
        setMessage("Payment successful! ₦4,500 was deducted from your virtual card.");
      } else {
        setStatus("failed");
        setMessage(data.error || "Payment declined.");
      }
    } catch (error) {
      setStatus("failed");
      setMessage("Network error occurred.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <Link href="/dashboard" className="absolute top-8 left-8 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
        &larr; Back to Dashboard
      </Link>
      
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="bg-slate-900 p-6 text-center">
          <div className="h-12 w-12 bg-red-600 rounded-xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-red-600/30">
            <span className="text-white font-black text-xl tracking-tighter">N</span>
          </div>
          <h2 className="text-white font-medium text-lg">Netflix Subscription</h2>
          <p className="text-slate-400 text-sm mt-1">Monthly Premium Plan</p>
          <div className="text-3xl font-bold text-white mt-4">₦4,500<span className="text-sm font-normal text-slate-400">/mo</span></div>
        </div>
        
        <div className="p-6 sm:p-8">
          {status === "success" ? (
            <div className="text-center py-6 animate-in zoom-in-95 duration-300">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-6">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Payment Successful!</h3>
              <p className="text-sm text-slate-500 mb-8">{message}</p>
              <Button onClick={() => { setStatus("idle"); setFormData({cardNumber: "", expiry: "", cvv: ""}) }} className="w-full">
                Simulate Another Payment
              </Button>
            </div>
          ) : status === "failed" ? (
            <div className="text-center py-6 animate-in zoom-in-95 duration-300">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-6">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Payment Failed</h3>
              <p className="text-sm text-red-500 mb-8">{message}</p>
              <Button onClick={() => setStatus("idle")} variant="outline" className="w-full">
                Try Again
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-slate-900">Payment Details</h3>
                <div className="flex items-center text-xs text-slate-500 font-medium">
                  <Lock className="h-3 w-3 mr-1" /> Secure Checkout
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Card Number</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input 
                    type="text" 
                    required
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({...formData, cardNumber: e.target.value.replace(/\D/g, '').slice(0, 16)})}
                    placeholder="0000 0000 0000 0000" 
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Expiry</label>
                  <input 
                    type="text" 
                    required
                    value={formData.expiry}
                    onChange={(e) => setFormData({...formData, expiry: e.target.value})}
                    placeholder="MM/YY" 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">CVV</label>
                  <input 
                    type="text" 
                    required
                    value={formData.cvv}
                    onChange={(e) => setFormData({...formData, cvv: e.target.value.replace(/\D/g, '').slice(0, 3)})}
                    placeholder="123" 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
              </div>
              
              <Button type="submit" className="w-full mt-6 h-11 text-base shadow-lg shadow-primary/25" disabled={status === "loading"}>
                {status === "loading" ? <Loader2 className="h-5 w-5 animate-spin" /> : "Pay ₦4,500"}
              </Button>
              
              <p className="text-[10px] text-center text-slate-400 mt-4">
                This is a simulation page for SubSync virtual cards. Enter a valid virtual card generated from your dashboard to test.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
