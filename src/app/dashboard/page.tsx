"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/Button";
import { 
  Plus, Trash2, Loader2, Mail, CreditCard, LayoutDashboard, 
  Settings as SettingsIcon, Bell, Search, Activity, Menu, X
} from "lucide-react";
import { convertCurrency } from "@/lib/utils";
import Link from "next/link";

const PRESET_SUBS = ["Netflix", "Spotify", "Apple Music", "Showmax", "DSTV", "MTN Data", "AWS", "Vercel"];

export default function Dashboard() {
  const router = useRouter();
  const { user, subscriptions, setSubscriptions, addSubscription, deleteSubscription, markAsUsed, setUser } = useStore();
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAlertTesting, setIsAlertTesting] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [newSub, setNewSub] = useState({ name: "Netflix", customName: "", amount: "", currency: "NGN", date: "", category: "Streaming" });

  useEffect(() => {
    setMounted(true);
    const savedUserStr = localStorage.getItem("subsync_user");
    if (!savedUserStr) {
      router.push("/login");
      return;
    }
    const savedUser = JSON.parse(savedUserStr);
    setUser(savedUser);
    fetchSubscriptions(savedUser.id);
  }, [router, setUser, setSubscriptions]);

  const fetchSubscriptions = async (userId: string) => {
    try {
      const res = await fetch(`/api/subscriptions?userId=${userId}&t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        setSubscriptions(data.subscriptions);
      }
    } catch (error) {
      console.error("Failed to fetch subscriptions", error);
    }
  };

  const handleAddCommitment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    try {
      const finalName = newSub.name === "Custom" ? newSub.customName : newSub.name;
      const res = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: finalName,
          amount: parseFloat(newSub.amount),
          currency: newSub.currency,
          category: newSub.category,
          nextChargeDate: new Date(newSub.date).toISOString(),
          userId: user.id
        })
      });
      if (res.ok) {
        const data = await res.json();
        addSubscription(data.subscription);
        setIsModalOpen(false);
        setNewSub({ name: "Netflix", customName: "", amount: "", currency: "NGN", date: "", category: "Streaming" });
      }
    } catch (error) {
      console.error("Failed to add commitment", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this commitment?")) return;
    try {
      const res = await fetch(`/api/subscriptions/${id}`, { method: 'DELETE' });
      if (res.ok) deleteSubscription(id);
    } catch (error) {
      console.error("Failed to delete", error);
    }
  };

  const handleMarkUsed = async (id: string) => {
    try {
      const res = await fetch(`/api/subscriptions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark_used' })
      });
      if (res.ok) {
        markAsUsed(id);
      }
    } catch (error) {
      console.error("Failed to mark as used");
    }
  };

  const handleTestAlert = async (sub: any) => {
    if (!user?.email) return alert("User email is missing");
    setIsAlertTesting(sub.id);
    try {
      const nextDate = new Date(sub.nextChargeDate);
      const today = new Date();
      const diffTime = nextDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const daysLeft = diffDays > 0 ? diffDays : 0;

      const res = await fetch('/api/alerts/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: user.email,
          userName: user.name || "User",
          telegramChatId: user.telegramChatId || "",
          alertPreference: user.telegramChatId ? "Email & Telegram" : "Email Only",
          subscriptionName: sub.name,
          amountDue: sub.amount,
          daysLeft: daysLeft
        })
      });
      const data = await res.json();
      if (res.ok) alert(data.message);
      else alert("Failed: " + data.error);
    } catch (error) {
      alert("Network error while sending alert.");
    } finally {
      setIsAlertTesting(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("subsync_user");
    setUser(null);
    router.push("/login");
  };

  if (!mounted || !user) return null;

  const totalMonthly = subscriptions.reduce((acc, sub) => acc + sub.amount, 0);
  const totalYearly = totalMonthly * 12;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SaaS Sidebar */}
      <aside className={`w-64 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
          <div className="flex items-center">
            <img src="/Subsynclogo.svg" alt="SubSync Logo" className="h-7 w-7 rounded-sm mr-3 object-contain" />
            <span className="font-heading font-bold text-slate-900 text-lg tracking-tight">SubSync</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">Overview</div>
          <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 bg-slate-50 text-primary rounded-xl font-medium">
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </Link>
          <Link href="/dashboard/cards" className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl font-medium transition-colors">
            <CreditCard className="h-5 w-5" /> Virtual Cards
          </Link>
          <Link href="/dashboard/transactions" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl font-medium transition-colors">
            <Activity className="h-5 w-5" /> Transactions
          </Link>
          
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3 mt-8">Settings</div>
          <Link href="/settings" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl font-medium transition-colors">
            <SettingsIcon className="h-5 w-5" /> Profile & Alerts
          </Link>
        </nav>
        
        <div className="p-4 border-t border-slate-100 flex flex-col gap-3">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors w-full text-left">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Log out
          </button>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200 shrink-0">
              <span className="text-sm font-bold text-blue-700">{user?.name?.charAt(0) || 'U'}</span>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden text-slate-500 hover:text-slate-900 transition-colors">
              <Menu className="h-6 w-6" />
            </button>
            <div className="hidden sm:flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 w-64 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
              <Search className="h-4 w-4 text-slate-400 mr-2" />
              <input type="text" placeholder="Search subscriptions..." className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400" />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-heading font-bold text-slate-900">Welcome back, {user?.name?.split(' ')[0]}</h1>
              <p className="text-sm text-slate-500 mt-1">Here is your financial footprint for the month.</p>
            </div>
            <Button onClick={() => setIsModalOpen(true)} className="rounded-lg shadow-md h-10 px-5">
              <Plus className="mr-2 h-4 w-4" /> New Commitment
            </Button>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <p className="text-sm font-medium text-slate-500">Total Monthly Burn</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900">₦{totalMonthly.toLocaleString()}</span>
                <span className="text-xs font-medium text-red-500 bg-red-50 px-1.5 py-0.5 rounded">Active</span>
              </div>
              <p className="text-xs text-slate-400 mt-2 border-t border-slate-50 pt-2">
                Projected Yearly: <strong className="text-slate-600">₦{totalYearly.toLocaleString()}</strong>
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <p className="text-sm font-medium text-slate-500">Active Subscriptions</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900">{subscriptions.length}</span>
                <span className="text-xs font-medium text-slate-400">Total tracked</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-primary to-blue-600 p-6 rounded-2xl border border-blue-500 shadow-md shadow-blue-500/20 text-white flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -right-6 -top-6 h-24 w-24 bg-white/10 rounded-full blur-xl"></div>
              <p className="text-sm font-medium text-blue-100 relative z-10">AI Financial Assistant</p>
              <div className="mt-2 relative z-10">
                <p className="text-sm leading-tight text-white mb-3">Ask your Telegram bot questions like "When is Netflix due?" or "How many subs do I have?"</p>
                <Link href="/settings" className="text-xs font-semibold bg-white text-primary px-3 py-1.5 rounded-full hover:bg-blue-50 transition-colors inline-block">
                  Connect Bot &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-semibold text-slate-900">Active Commitments</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-white text-slate-500 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3 font-medium">Service</th>
                    <th className="px-6 py-3 font-medium">Category</th>
                    <th className="px-6 py-3 font-medium">Amount</th>
                    <th className="px-6 py-3 font-medium">Next Charge</th>
                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {subscriptions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                        No commitments found. Click "New Commitment" to get started.
                      </td>
                    </tr>
                  ) : (
                    subscriptions.map(sub => (
                      <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-medium text-slate-900 mr-2">{sub.name}</span>
                          {sub.paymentMethod === 'VIRTUAL_CARD' && (
                            <span className="inline-flex items-center rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 mr-2">
                              💳 CARD
                            </span>
                          )}
                          {sub.lastInteractedAt && (Date.now() - new Date(sub.lastInteractedAt).getTime() > 90 * 24 * 60 * 60 * 1000) && (
                            <span className="inline-flex items-center rounded-md bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-700">Zombie?</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 border border-slate-200">
                            {sub.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-900">
                          {sub.currency === 'USD' ? '$' : sub.currency === 'EUR' ? '€' : sub.currency === 'GBP' ? '£' : '₦'}
                          {sub.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {new Date(sub.nextChargeDate).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                          {sub.lastInteractedAt && (Date.now() - new Date(sub.lastInteractedAt).getTime() > 90 * 24 * 60 * 60 * 1000) && (
                            <button onClick={() => handleMarkUsed(sub.id)} className="text-xs text-blue-600 hover:underline mr-2">Mark Used</button>
                          )}
                            <button 
                              onClick={() => handleTestAlert(sub)}
                              disabled={isAlertTesting === sub.id}
                              className="inline-flex items-center justify-center h-7 px-2.5 rounded border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors disabled:opacity-50"
                            >
                              {isAlertTesting === sub.id ? <Loader2 className="h-3 w-3 animate-spin mr-1.5" /> : <Mail className="h-3 w-3 mr-1.5" />}
                              Test Alert
                            </button>
                            <button onClick={() => handleDelete(sub.id)} className="p-1.5 text-slate-400 hover:text-red-600 transition-colors rounded hover:bg-red-50">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Add Commitment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="mb-6">
              <h2 className="text-xl font-heading font-bold text-slate-900">Add Commitment</h2>
              <p className="text-sm text-slate-500 mt-1">Track a new subscription manually.</p>
            </div>
            
            <form onSubmit={handleAddCommitment} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Service Name</label>
                <select 
                  required
                  value={newSub.name}
                  onChange={(e) => setNewSub({...newSub, name: e.target.value})}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-white"
                >
                  {PRESET_SUBS.map(s => <option key={s} value={s}>{s}</option>)}
                  <option value="Custom">Other (Custom)...</option>
                </select>
              </div>

              {newSub.name === "Custom" && (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1">
                  <label className="text-sm font-medium text-slate-700">Custom Name</label>
                  <input 
                    type="text" required
                    value={newSub.customName}
                    onChange={(e) => setNewSub({...newSub, customName: e.target.value})}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="e.g. Gym Membership"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Amount (₦)</label>
                <input 
                  type="number" required
                  value={newSub.amount}
                  onChange={(e) => setNewSub({...newSub, amount: e.target.value})}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="4500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Currency</label>
                <select 
                  value={newSub.currency}
                  onChange={(e) => setNewSub({...newSub, currency: e.target.value})}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
                >
                  <option value="NGN">NGN (₦)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Currency</label>
                <select 
                  value={newSub.currency}
                  onChange={(e) => setNewSub({...newSub, currency: e.target.value})}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
                >
                  <option value="NGN">NGN (₦)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Next Charge Date</label>
                <input 
                  type="date" required
                  value={newSub.date}
                  onChange={(e) => setNewSub({...newSub, date: e.target.value})}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Category</label>
                <select 
                  value={newSub.category}
                  onChange={(e) => setNewSub({...newSub, category: e.target.value})}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-white"
                >
                  <option>Streaming</option>
                  <option>Utilities</option>
                  <option>Software</option>
                  <option>Savings</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="w-full rounded-lg">Cancel</Button>
                <Button type="submit" className="w-full rounded-lg" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Save
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
