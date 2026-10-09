"use client";

import React from 'react';
import Link from 'next/link';
import { Home, CreditCard, Activity, Settings, LogOut, BarChart3, TrendingUp, PieChart, ArrowUpRight, ArrowDownRight, DollarSign, Menu } from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function AnalyticsPage() {
  const { user } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200">
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
          <Link href="/dashboard/analytics" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 bg-slate-50 text-primary rounded-xl font-medium">
            <BarChart3 className="h-5 w-5" /> Analytics
          </Link>
          
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3 mt-8">Settings</div>
          <Link href="/settings" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl font-medium transition-colors">
            <Settings className="h-5 w-5" /> Account Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors w-full text-left">
            <LogOut className="h-5 w-5" /> Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 lg:p-8 w-full max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold text-slate-900">Analytics</h1>
            <p className="text-sm text-slate-500 mt-1">Deep dive into your subscription spending habits.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 text-slate-500 mb-2">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">Total Monthly Spend</span>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-2">₦45,200</div>
            <div className="text-xs text-green-600 flex items-center gap-1 font-medium bg-green-50 w-max px-2 py-1 rounded">
              <ArrowDownRight className="h-3 w-3" /> 12% vs last month
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 text-slate-500 mb-2">
              <PieChart className="h-4 w-4" />
              <span className="text-sm font-medium">Top Category</span>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-2">Streaming</div>
            <div className="text-xs text-slate-500 font-medium">Accounts for 65% of your spend</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 text-slate-500 mb-2">
              <DollarSign className="h-4 w-4" />
              <span className="text-sm font-medium">Saved via Virtual Cards</span>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-2">₦12,500</div>
            <div className="text-xs text-blue-600 flex items-center gap-1 font-medium bg-blue-50 w-max px-2 py-1 rounded">
              <ArrowUpRight className="h-3 w-3" /> FX Hedge savings
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 h-[400px] flex flex-col justify-center items-center">
            <BarChart3 className="h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-1">Spend Over Time</h3>
            <p className="text-sm text-slate-500 max-w-sm text-center">Interactive charts will be rendered here showing your MoM subscription cost growth.</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 h-[400px] flex flex-col justify-center items-center">
            <PieChart className="h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-1">Category Breakdown</h3>
            <p className="text-sm text-slate-500 max-w-sm text-center">A donut chart showing Streaming vs Software vs Entertainment.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
