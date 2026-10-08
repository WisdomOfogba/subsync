"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/Button";
import { 
  CreditCard, Plus, ChevronLeft, Calendar, 
  BellRing, Loader2, ArrowRight, ShieldCheck, Mail, Trash2
} from "lucide-react";

const PRESET_SUBS = [
  "Netflix", "Spotify", "Apple Music", "DSTV", "MTN Router", "AWS", "ChatGPT Plus", "Cursor Pro"
];

export default function Dashboard() {
  const router = useRouter();
  const { 
    user, subscriptions, loading, 
    setUser, setSubscriptions, addSubscription, updateSubscriptionStatus, deleteSubscription, setLoading 
  } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSub, setNewSub] = useState({ name: "Netflix", customName: "", amount: "", date: "", category: "Streaming" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAlertTesting, setIsAlertTesting] = useState<string | null>(null); // holds the ID of the sub being tested

  useEffect(() => {
    const savedUserStr = localStorage.getItem("subsync_user");
    if (savedUserStr) {
      const savedUser = JSON.parse(savedUserStr);
      setUser(savedUser);
      // Fetch actual subscriptions
      fetch(`/api/subscriptions?userId=${savedUser.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setSubscriptions(data.subscriptions);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      router.push("/login");
    }
  }, [router, setUser, setSubscriptions, setLoading]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50/50">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const activeSubs = subscriptions.filter(s => s.status === 'Active');
  const pendingSubs = subscriptions.filter(s => s.status === 'Pending Approval');
  const totalMonthly = activeSubs.reduce((sum, sub) => sum + sub.amount, 0);
  const totalYearly = totalMonthly * 12;

  const handleAddCommitment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSub.amount || !newSub.date || !user?.id) return;
    
    const finalName = newSub.name === "Custom" ? newSub.customName : newSub.name;
    if (!finalName) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          name: finalName,
          amount: newSub.amount,
          category: newSub.category,
          nextChargeDate: newSub.date
        })
      });
      const data = await res.json();
      if (data.success) {
        addSubscription(data.subscription);
        setIsModalOpen(false);
        setNewSub({ name: "Netflix", customName: "", amount: "", date: "", category: "Streaming" });
      }
    } catch (error) {
      console.error("Failed to add commitment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const approvePending = async (id: string) => {
    try {
      const res = await fetch(`/api/subscriptions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Active' })
      });
      if (res.ok) {
        updateSubscriptionStatus(id, 'Active');
      }
    } catch (error) {
      console.error("Failed to approve");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/subscriptions/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        deleteSubscription(id);
      }
    } catch (error) {
      console.error("Failed to delete");
    }
  };

  const handleTestAlert = async (sub: any) => {
    if (!user?.email) return alert("User email is missing");
    setIsAlertTesting(sub.id);
    try {
      const res = await fetch('/api/alerts/brevo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: user.email,
          userName: user.name || "User",
          subscriptionName: sub.name,
          amountDue: sub.amount,
          daysLeft: 3
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Alert sent successfully to " + user.email + "!");
      } else {
        alert("Failed: " + data.error);
      }
    } catch (error) {
      alert("Network error while sending alert.");
    } finally {
      setIsAlertTesting(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Sleek Minimalist Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push("/")} className="text-gray-400 hover:text-gray-900 transition-colors">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3">
              <img src="/Subsync Logo.jpg" alt="SubSync Logo" className="h-8 w-8 rounded-md object-contain" />
              <div className="font-heading font-semibold tracking-tight text-gray-900 text-lg hidden sm:block">SubSync</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col text-right mr-2">
              <span className="text-sm font-medium text-gray-900">{user?.name}</span>
              <span className="text-xs text-gray-500">{user?.email}</span>
            </div>
            <button onClick={() => router.push("/settings")} className="h-9 w-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center border border-gray-200 transition-colors cursor-pointer" title="Settings">
              <span className="text-sm font-medium text-gray-600">{user?.name?.charAt(0) || 'U'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-6xl flex-grow p-6 py-10 space-y-12">
        
        {/* Top Insights Section */}
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-sm font-medium text-gray-500">Monthly Burn Rate</h3>
              <CreditCard className="h-4 w-4 text-gray-400" />
            </div>
            <div>
              <div className="text-4xl font-heading font-semibold tracking-tight text-gray-900">₦{totalMonthly.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-green-500" /> Safe & Tracked
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-sm font-medium text-gray-500">Yearly Projection</h3>
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
            <div>
              <div className="text-4xl font-heading font-semibold tracking-tight text-gray-900">₦{totalYearly.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-2">Total cost if nothing is cancelled</p>
            </div>
          </div>

          {/* Pending Approvals Card (Crucial for Pitch) */}
          <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-white p-6 shadow-[0_2px_10px_-4px_rgba(250,145,49,0.1)] flex flex-col sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-sm font-medium text-orange-900">Pending Approvals</h3>
              <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
            </div>
            
            {pendingSubs.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
                <ShieldCheck className="h-8 w-8 text-orange-200 mb-2" />
                <p className="text-sm text-orange-800 font-medium">All clear!</p>
                <p className="text-xs text-orange-600/70">No pending charges</p>
              </div>
            ) : (
              <div className="mt-2 space-y-3 max-h-[140px] overflow-y-auto pr-1">
                {pendingSubs.map(sub => (
                  <div key={sub.id} className="p-3 bg-white border border-orange-200 rounded-xl flex items-center justify-between group transition-all hover:shadow-sm">
                    <div className="overflow-hidden mr-2">
                      <p className="text-sm font-semibold text-gray-900 truncate">{sub.name}</p>
                      <p className="text-xs text-orange-600 font-medium">₦{sub.amount.toLocaleString()}</p>
                    </div>
                    <Button onClick={() => approvePending(sub.id)} size="sm" className="h-8 text-xs bg-secondary hover:bg-secondary/90 text-white rounded-lg shrink-0">
                      Approve
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Subscriptions Table */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-heading font-semibold text-gray-900">Active Commitments</h2>
              <p className="text-sm text-gray-500 mt-1">Manage and monitor your recurring expenses.</p>
            </div>
            <Button onClick={() => setIsModalOpen(true)} className="rounded-full shadow-sm">
              <Plus className="mr-2 h-4 w-4" /> Add
            </Button>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50/50 text-gray-500 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 font-medium">Service</th>
                    <th className="px-6 py-4 font-medium">Category</th>
                    <th className="px-6 py-4 font-medium">Amount</th>
                    <th className="px-6 py-4 font-medium">Next Charge</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {subscriptions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        No commitments found. Add one to get started.
                      </td>
                    </tr>
                  ) : (
                    subscriptions.map(sub => (
                      <tr key={sub.id} className="hover:bg-gray-50/30 transition-colors group">
                        <td className="px-6 py-4">
                          <span className="font-semibold text-gray-900">{sub.name}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                            {sub.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">₦{sub.amount.toLocaleString()}</td>
                        <td className="px-6 py-4 text-gray-500">
                          {new Date(sub.nextChargeDate).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleTestAlert(sub)}
                            disabled={isAlertTesting === sub.id}
                            className="inline-flex items-center justify-center h-8 px-3 rounded-md border border-gray-200 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                            title="Send test email alert for this subscription"
                          >
                            {isAlertTesting === sub.id ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Mail className="h-3 w-3 mr-1" />}
                            Alert
                          </button>
                          
                          <button onClick={() => handleDelete(sub.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-md hover:bg-red-50" title="Delete">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      {/* Add Commitment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm px-4 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="mb-6">
              <h2 className="text-2xl font-heading font-semibold text-gray-900">Add Commitment</h2>
              <p className="text-sm text-gray-500 mt-1">Track a new subscription or recurring bill.</p>
            </div>
            
            <form onSubmit={handleAddCommitment} className="space-y-5">
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Service Name</label>
                <select 
                  required
                  value={newSub.name}
                  onChange={(e) => setNewSub({...newSub, name: e.target.value})}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-white"
                >
                  {PRESET_SUBS.map(s => <option key={s} value={s}>{s}</option>)}
                  <option value="Custom">Other (Custom)...</option>
                </select>
              </div>

              {newSub.name === "Custom" && (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1">
                  <label className="text-sm font-medium text-gray-700">Custom Name</label>
                  <input 
                    type="text" required
                    value={newSub.customName}
                    onChange={(e) => setNewSub({...newSub, customName: e.target.value})}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="e.g. Gym Membership"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Amount (₦)</label>
                <input 
                  type="number" required
                  value={newSub.amount}
                  onChange={(e) => setNewSub({...newSub, amount: e.target.value})}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="4500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Next Charge Date</label>
                <input 
                  type="date" required
                  value={newSub.date}
                  onChange={(e) => setNewSub({...newSub, date: e.target.value})}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Category</label>
                <select 
                  value={newSub.category}
                  onChange={(e) => setNewSub({...newSub, category: e.target.value})}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-white"
                >
                  <option>Streaming</option>
                  <option>Utilities</option>
                  <option>Software</option>
                  <option>Savings</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsModalOpen(false)} 
                  className="w-full rounded-xl"
                >
                  Cancel
                </Button>
                <Button type="submit" className="w-full rounded-xl" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
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
