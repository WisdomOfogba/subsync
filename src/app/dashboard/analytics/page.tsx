"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, CreditCard, Activity, Settings, LogOut, BarChart3, Menu, ChevronDown, Monitor, Cpu, Home as HomeIcon, Zap, Music } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

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
  const totalSpend = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);
  
  const categoryData = subscriptions.reduce((acc: any, sub) => {
    const existing = acc.find((item: any) => item.name === sub.category);
    if (existing) {
      existing.value += sub.amount;
    } else {
      acc.push({ name: sub.category, value: sub.amount });
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
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col md:flex-row text-slate-900 font-sans">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <img src="/Subsynclogo.svg" alt="SubSync Logo" className="h-6 w-6 rounded-sm object-contain" />
          <span className="font-heading font-bold text-lg text-slate-900">SubSync</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-500">
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r border-slate-200 flex flex-col
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}>
        <div className="p-6 flex items-center gap-2">
          <img src="/Subsynclogo.svg" alt="SubSync Logo" className="h-7 w-7 rounded-sm mr-3 object-contain" />
          <span className="font-heading font-bold text-xl text-slate-900">SubSync</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">Overview</div>
          <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl font-medium transition-colors">
            <Home className="h-5 w-5" /> Dashboard
          </Link>
          <Link href="/dashboard/cards" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl font-medium transition-colors">
            <CreditCard className="h-5 w-5" /> Virtual Cards
          </Link>
          <Link href="/dashboard/transactions" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl font-medium transition-colors">
            <Activity className="h-5 w-5" /> Transactions
          </Link>
          <Link href="/dashboard/analytics" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 bg-slate-100 text-slate-900 rounded-xl font-semibold">
            <BarChart3 className="h-5 w-5" /> Analytics
          </Link>
          
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3 mt-8">Settings</div>
          <Link href="/settings" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl font-medium transition-colors">
            <Settings className="h-5 w-5" /> Account Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors w-full text-left">
            <LogOut className="h-5 w-5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content - Mobile App Style */}
      <main className="flex-1 w-full max-w-md mx-auto bg-white min-h-screen md:max-w-xl lg:max-w-3xl md:border-x border-slate-100 shadow-sm relative">
        
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
              {getCurrencySymbol(user.baseCurrency || 'NGN')}{totalSpend.toLocaleString()}
            </h1>
          </div>

          {/* Donut Chart */}
          <div className="relative h-72 w-full flex justify-center items-center mb-12">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={90}
                    outerRadius={120}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={6}
                  >
                    {categoryData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => `${getCurrencySymbol(user.baseCurrency || 'NGN')}${value.toLocaleString()}`}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
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
                    {getCurrencySymbol(user.baseCurrency || 'NGN')}{cat.value.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
