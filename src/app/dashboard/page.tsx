"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Plus, CreditCard, ArrowUpRight, ArrowDownRight, Wallet, ChevronLeft, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState({ name: "Builder", email: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subscriptions, setSubscriptions] = useState([
    { id: 1, name: "Netflix", amount: 4500, nextDate: "2026-10-15", category: "Streaming", status: "Active" },
    { id: 2, name: "NEPA Bill", amount: 15000, nextDate: "2026-10-20", category: "Utilities", status: "Pending Approval" },
    { id: 3, name: "Ajo Contribution", amount: 50000, nextDate: "2026-10-30", category: "Savings", status: "Active" },
    { id: 4, name: "Spotify", amount: 900, nextDate: "2026-11-02", category: "Streaming", status: "Active" },
  ]);

  useEffect(() => {
    const savedUser = localStorage.getItem("subsync_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      router.push("/login");
    }
  }, [router]);

  const [newSub, setNewSub] = useState({ name: "", amount: "", date: "", category: "Utilities" });

  const totalObligation = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);

  const handleAddCommitment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSub.name || !newSub.amount || !newSub.date) return;
    
    setSubscriptions([...subscriptions, {
      id: Date.now(),
      name: newSub.name,
      amount: parseInt(newSub.amount),
      nextDate: newSub.date,
      category: newSub.category,
      status: "Active"
    }]);
    
    setIsModalOpen(false);
    setNewSub({ name: "", amount: "", date: "", category: "Utilities" });
  };

  const approvePending = (id: number) => {
    setSubscriptions(subscriptions.map(sub => 
      sub.id === id ? { ...sub, status: "Active" } : sub
    ));
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-white px-6 shadow-sm">
        <Link href="/" className="flex items-center">
          <img 
            src="/Subsync Logo and Text.jpg" 
            alt="SubSync" 
            className="h-10 w-auto object-contain"
          />
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="hidden sm:flex text-muted-foreground">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </Link>
          <div className="flex flex-col text-right hidden sm:flex">
            <span className="text-sm font-medium">Hello, {user.name.split(' ')[0]}</span>
            <span className="text-xs text-muted-foreground">SubSync User</span>
          </div>
          <div className="h-9 w-9 rounded-full bg-secondary text-white flex items-center justify-center font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 sm:p-8 max-w-5xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your subscriptions and recurring payments.</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-primary/90 text-white rounded-full px-6">
            <Plus className="mr-2 h-4 w-4" />
            Add Commitment
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Total Monthly Obligation</h3>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-3xl font-heading font-bold mt-2">₦{totalObligation.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-2">Calculated from all active commitments</p>
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 shadow-sm relative overflow-hidden">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/10" />
            <div className="flex items-center justify-between space-y-0 pb-2 relative z-10">
              <h3 className="tracking-tight text-sm font-medium text-primary">SubSync Wallet Balance</h3>
              <Wallet className="h-4 w-4 text-primary" />
            </div>
            <div className="text-3xl font-heading font-bold text-slate-900 mt-2 relative z-10">₦125,000</div>
            <div className="flex gap-2 mt-4 relative z-10">
              <Button size="sm" variant="secondary" className="w-full text-xs h-8">
                <ArrowDownRight className="mr-1 h-3 w-3" /> Top up
              </Button>
              <Button size="sm" variant="outline" className="w-full text-xs h-8 border-primary/30 text-primary hover:bg-primary/10">
                <ArrowUpRight className="mr-1 h-3 w-3" /> Transfer
              </Button>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Pending Approvals</h3>
              <div className="h-2 w-2 rounded-full bg-secondary" />
            </div>
            <div className="text-3xl font-heading font-bold mt-2">
              {subscriptions.filter(s => s.status === 'Pending Approval').length}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Awaiting your permission to debit</p>
            
            {subscriptions.filter(s => s.status === 'Pending Approval').map(sub => (
              <div key={sub.id} className="mt-4 p-3 bg-orange-50 border border-orange-100 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-900">{sub.name}</p>
                  <p className="text-xs text-orange-700">₦{sub.amount.toLocaleString()} due soon</p>
                </div>
                <Button onClick={() => approvePending(sub.id)} size="sm" className="h-7 text-xs bg-secondary hover:bg-secondary/90 text-white border-0">Approve</Button>
              </div>
            ))}
          </div>
        </div>

        {/* Subscriptions List */}
        <h2 className="font-heading text-xl font-bold tracking-tight mb-4">Your Commitments</h2>
        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 font-medium">Service</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Next Due</th>
                  <th className="px-6 py-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {subscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium">{sub.name}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                        {sub.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">₦{sub.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-muted-foreground">{new Date(sub.nextDate).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td className="px-6 py-4 text-right">
                      {sub.status === 'Active' ? (
                        <span className="inline-flex items-center text-xs font-medium text-green-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-600 mr-1.5"></span>
                          Auto-pay Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-xs font-medium text-secondary">
                          <span className="h-1.5 w-1.5 rounded-full bg-secondary mr-1.5 animate-pulse"></span>
                          Needs Approval
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add Commitment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-heading font-bold text-slate-900">Add New Commitment</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-slate-900">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddCommitment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Service Name</label>
                <input 
                  type="text" 
                  value={newSub.name}
                  onChange={e => setNewSub({...newSub, name: e.target.value})}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="e.g. House Rent, Ajo, DStv"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Amount (₦)</label>
                <input 
                  type="number" 
                  value={newSub.amount}
                  onChange={e => setNewSub({...newSub, amount: e.target.value})}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="e.g. 15000"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <select 
                    value={newSub.category}
                    onChange={e => setNewSub({...newSub, category: e.target.value})}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white"
                  >
                    <option>Utilities</option>
                    <option>Streaming</option>
                    <option>Savings</option>
                    <option>Rent</option>
                    <option>Family Support</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Next Due Date</label>
                  <input 
                    type="date" 
                    value={newSub.date}
                    onChange={e => setNewSub({...newSub, date: e.target.value})}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white">
                  Save Commitment
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
