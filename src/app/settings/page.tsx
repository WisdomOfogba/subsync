"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/Button";
import { 
  Loader2, Save, User as UserIcon, Bell, Smartphone, 
  LayoutDashboard, CreditCard, Activity, Settings as SettingsIcon, Search
} from "lucide-react";
import Link from "next/link";

export default function Settings() {
  const router = useRouter();
  const { user, setUser } = useStore();
  const [mounted, setMounted] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    telegramChatId: "",
    alertPreference: "Email & Telegram",
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    setMounted(true);
    const savedUserStr = localStorage.getItem("subsync_user");
    if (savedUserStr) {
      const savedUser = JSON.parse(savedUserStr);
      setUser(savedUser);
      setFormData({
        name: savedUser.name || "",
        telegramChatId: savedUser.telegramChatId || "",
        alertPreference: "Email & Telegram", // sensible default
      });
    } else {
      router.push("/login");
    }
  }, [router, setUser]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSaving(true);
    setSaveMessage("");
    
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          telegramChatId: formData.telegramChatId
        })
      });
      
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem("subsync_user", JSON.stringify(data.user));
        setSaveMessage("Settings saved successfully.");
      } else {
        setSaveMessage("Failed to save settings.");
      }
    } catch (error) {
      setSaveMessage("Network error occurred.");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("subsync_user");
    setUser(null);
    router.push("/login");
  };

  if (!mounted || !user) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      
      {/* SaaS Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <img src="/Subsync Logo.jpg" alt="SubSync Logo" className="h-7 w-7 rounded-sm mr-3 object-contain" />
          <span className="font-heading font-bold text-slate-900 text-lg tracking-tight">SubSync</span>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">Overview</div>
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl font-medium transition-colors">
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </Link>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl font-medium transition-colors">
            <CreditCard className="h-5 w-5" /> Virtual Cards <span className="ml-auto text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">Soon</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl font-medium transition-colors">
            <Activity className="h-5 w-5" /> Transactions
          </a>
          
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3 mt-8">Settings</div>
          <Link href="/settings" className="flex items-center gap-3 px-3 py-2 bg-slate-50 text-primary rounded-xl font-medium">
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
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 w-64 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all opacity-50">
            <Search className="h-4 w-4 text-slate-400 mr-2" />
            <input type="text" placeholder="Search..." disabled className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400" />
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Settings Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-3xl">
            <div className="mb-8">
              <h1 className="text-2xl font-heading font-bold text-slate-900">Profile & Preferences</h1>
              <p className="text-sm text-slate-500 mt-1">Manage your account details and notification channels.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
              {/* Profile Section */}
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                  <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <UserIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900">Personal Info</h2>
                </div>
                
                <div className="space-y-5 max-w-md">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Full Name</label>
                    <input 
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Email Address</label>
                    <input 
                      type="email"
                      value={user.email}
                      readOnly
                      className="w-full rounded-lg border border-slate-100 px-3 py-2.5 text-sm text-slate-500 bg-slate-50 cursor-not-allowed"
                    />
                  </div>
                </div>
              </section>

              {/* Alerts & Notifications */}
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                  <div className="h-8 w-8 rounded-lg bg-orange-50 flex items-center justify-center">
                    <Bell className="h-4 w-4 text-orange-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900">Notification Channels</h2>
                </div>
                
                <div className="space-y-6 max-w-md">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Where should we send alerts?</label>
                    <select 
                      value={formData.alertPreference}
                      onChange={(e) => setFormData({...formData, alertPreference: e.target.value})}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-white"
                    >
                      <option>Email Only (Default)</option>
                      <option>Telegram Only</option>
                      <option>Email & Telegram</option>
                    </select>
                  </div>

                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-start gap-4">
                      <Smartphone className="h-5 w-5 text-slate-400 mt-0.5 shrink-0" />
                      <div className="space-y-4 w-full">
                        <div>
                          <h4 className="text-sm font-semibold text-slate-900">Connect Telegram Bot</h4>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                            Click the button below or scan the QR code with your phone to instantly link your account.
                          </p>
                        </div>
                        {user.telegramChatId ? (
                          <div className="inline-flex items-center px-3 py-1.5 rounded-md bg-green-50 text-green-700 text-xs font-semibold border border-green-100">
                            ✓ Connected
                          </div>
                        ) : (
                          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                            <a 
                              href={`https://t.me/${process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'subsy_nc_bot'}?start=${user.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex h-9 items-center justify-center rounded-lg bg-[#229ED9] px-4 text-sm font-medium text-white shadow-sm hover:bg-[#1f8cc0] transition-colors"
                            >
                              Connect via Telegram
                            </a>
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-[10px] text-slate-400 font-bold tracking-wider">OR SCAN</span>
                              <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(`https://t.me/${process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'subsy_nc_bot'}?start=${user.id}`)}`} 
                                alt="Scan to connect Telegram" 
                                className="h-24 w-24 rounded border border-slate-200 shadow-sm"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <div className="flex items-center gap-4 pt-2">
                <Button type="submit" className="h-10 px-6 rounded-lg shadow-sm" disabled={isSaving}>
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Preferences
                </Button>
                {saveMessage && (
                  <span className="text-sm font-medium text-green-600 animate-in fade-in slide-in-from-left-2">
                    {saveMessage}
                  </span>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
