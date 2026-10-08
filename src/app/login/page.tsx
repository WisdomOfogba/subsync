"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email) {
      // Create a mock user if one doesn't exist just so login works for demo
      const existing = localStorage.getItem("subsync_user");
      if (!existing) {
        localStorage.setItem("subsync_user", JSON.stringify({ 
          name: "Demo User", 
          email: formData.email,
          walletBalance: 125000 
        }));
      }
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex justify-center mb-8">
          <img src="/Subsync Logo.jpg" alt="SubSync" className="h-16 w-auto" />
        </div>
        <h1 className="text-2xl font-heading font-bold text-center text-slate-900 mb-2">Welcome back</h1>
        <p className="text-muted-foreground text-center mb-8 text-sm">Enter your credentials to access your SubSync dashboard.</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <span className="text-xs text-primary cursor-pointer hover:underline">Forgot password?</span>
            </div>
            <input 
              type="password" 
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="••••••••"
              required
            />
          </div>
          
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white mt-6">
            Sign In
          </Button>
        </form>
        
        <p className="text-center text-sm text-slate-500 mt-6">
          Don't have an account? <Link href="/signup" className="text-primary font-medium hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
