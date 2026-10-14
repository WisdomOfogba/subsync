"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, CreditCard, Activity, Settings, LogOut, BarChart3, Menu, ChevronDown, Monitor, Cpu, Home as HomeIcon, Zap, Music } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import { convertCurrency, toMonthlyAmount } from '@/lib/utils';
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";

const COLORS = ['#8b5cf6', '#3b82f6', '#f59e0b', '#ec4899', '#10b981'];

const CATEGORY_ICONS: any = {
  'Software': <Monitor className="h-5 w-5 text-purple-500" />,
  'Streaming': <Music className="h-5 w-5 text-blue-500" />,
  'Utilities': <Zap className="h-5 w-5 text-yellow-500" />,
  'Housing': <HomeIcon className="h-5 w-5 text-pink-500" />,
  'Other': <Activity className="h-5 w-5 text-emerald-500" />
};

export default function AnalyticsPage() {
  const router = useRouter();
  const { user, setUser, subscriptions, setSubscriptions } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedUserStr = localStorage.getItem("subsync_user");
    if (savedUserStr) {
      const savedUser = JSON.parse(savedUserStr);
      setUser(savedUser);
      
      fetch(`/api/subscriptions?userId=${savedUser.id}&t=${Date.now()}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setSubscriptions(data.subscriptions);
          }
        });
    } else {
      router.push("/login");
    }
  }, [router, setUser, setSubscriptions]);

  if (!mounted || !user) return null;

  // Process data for charts
  const baseCurrency = user.baseCurrency || 'NGN';
  const totalSpend = subscriptions.reduce((sum, sub) => {
    return sum + toMonthlyAmount(convertCurrency(sub.amount, sub.currency || 'NGN', baseCurrency), sub.billingCycle);
  }, 0);
  
  const categoryData = subscriptions.reduce((acc: any, sub) => {
    const converted = toMonthlyAmount(convertCurrency(sub.amount, sub.currency || 'NGN', baseCurrency), sub.billingCycle);
    const existing = acc.find((item: any) => item.name === sub.category);
    if (existing) {
      existing.value += converted;
    } else {
      acc.push({ name: sub.category, value: converted });
    }
    return acc;
  }, []).sort((a: any, b: any) => b.value - a.value);

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      default: return '₦';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("subsync_user");
    router.push("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* SaaS Sidebar */}
      <DashboardSidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden text-slate-500 hover:text-slate-900 transition-colors">
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold text-slate-900">Spending Analytics</h1>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="w-full max-w-xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Top Navigation Pills */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-md z-30 pt-6 pb-4 px-6 border-b border-slate-100">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button className="px-5 py-2 rounded-full bg-slate-900 text-white text-sm font-semibold whitespace-nowrap">By category</button>
            <button className="px-5 py-2 rounded-full bg-slate-100 text-slate-600 text-sm font-medium whitespace-nowrap hover:bg-slate-200 transition-colors">Trends</button>
            <button className="px-5 py-2 rounded-full bg-slate-100 text-slate-600 text-sm font-medium whitespace-nowrap hover:bg-slate-200 transition-colors">Net income</button>
            <button className="px-5 py-2 rounded-full bg-slate-100 text-slate-600 text-sm font-medium whitespace-nowrap hover:bg-slate-200 transition-colors">Balance</button>
          </div>
          
          {/* Dropdown Filters */}
          <div className="flex gap-2 mt-4 overflow-x-auto scrollbar-hide">
            <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-slate-200 bg-white text-slate-700 text-sm font-medium shadow-sm">
              This month <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-slate-200 bg-white text-slate-700 text-sm font-medium shadow-sm">
              All accounts <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-slate-200 bg-white text-slate-700 text-sm font-medium shadow-sm">
              Expenses <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="px-6 py-10">
          {/* Header */}
          <div className="text-center mb-10">
            <p className="text-slate-500 font-semibold mb-2">Total spending</p>
            <h1 className="text-5xl font-bold text-slate-900 tracking-tight">
              {getCurrencySymbol(user.baseCurrency || 'NGN')}{Math.round(totalSpend).toLocaleString()}
            </h1>
          </div>

          {/* Donut Chart */}
          <div className="relative h-72 w-full flex justify-center items-center mb-12">
            {categoryData.length > 0 ? (
              <div 
                className="w-56 h-56 rounded-full relative flex justify-center items-center"
                style={{
                  background: `conic-gradient(${categoryData.reduce((acc: any, cat: any, i: number) => {
                    const prevPercent = acc.totalPercent;
                    const percent = (cat.value / totalSpend) * 100;
                    acc.totalPercent += percent;
                    acc.stops.push(`${COLORS[i % COLORS.length]} ${prevPercent}% ${acc.totalPercent}%`);
                    return acc;
                  }, { stops: [], totalPercent: 0 }).stops.join(', ')})`
                }}
              >
                {/* Inner circle to make it a donut */}
                <div className="w-40 h-40 bg-white rounded-full absolute"></div>
              </div>
            ) : (
              <div className="w-48 h-48 rounded-full border-8 border-slate-100 flex items-center justify-center">
                <p className="text-slate-400 font-medium">No data</p>
              </div>
            )}
            
            {/* Center Label */}
            {categoryData.length > 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="flex items-center gap-2 mb-1">
                  {CATEGORY_ICONS[categoryData[0].name] || CATEGORY_ICONS['Other']}
                  <span className="font-bold text-slate-900">{categoryData[0].name}</span>
                </div>
                <span className="text-3xl font-bold text-slate-900">
                  {Math.round((categoryData[0].value / totalSpend) * 100)}%
                </span>
              </div>
            )}
          </div>

          {/* List items */}
          <div className="space-y-6">
            {categoryData.map((cat: any, index: number) => {
              const percentage = Math.round((cat.value / totalSpend) * 100);
              return (
                <div key={cat.name} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl" style={{ backgroundColor: `${COLORS[index % COLORS.length]}15` }}>
                      {React.cloneElement(CATEGORY_ICONS[cat.name] || CATEGORY_ICONS['Other'], {
                        style: { color: COLORS[index % COLORS.length] }
                      })}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg group-hover:text-slate-700 transition-colors">{cat.name}</h4>
                      <p className="text-slate-400 font-medium text-sm">{percentage}%</p>
                    </div>
                  </div>
                  <div className="font-bold text-slate-900 text-lg">
                    {getCurrencySymbol(user.baseCurrency || 'NGN')}{Math.round(cat.value).toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
          </div>
        </div>
      </div>
    </main>
  </div>
  );
}
