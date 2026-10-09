"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/Button";
import { 
  Loader2, Save, User as UserIcon, Bell, Smartphone, 
  LayoutDashboard, CreditCard, Activity, Settings as SettingsIcon, Search, Menu, X
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
    baseCurrency: "NGN",
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [showQRModal, setShowQRModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        baseCurrency: savedUser.baseCurrency || "NGN",
      });
    } else {
      router.push("/login");
    }
  }, [router, setUser]);

  // Poll for telegram connection when modal is open
  useEffect(() => {
    if (!showQRModal || !user) return;
    
    const intervalId = setInterval(async () => {
      try {
        const res = await fetch(`/api/users/${user.id}`);
        const data = await res.json();
        if (data.success && data.user.telegramChatId) {
          // Success! They connected.
          setUser(data.user);
          localStorage.setItem("subsync_user", JSON.stringify(data.user));
          setFormData(prev => ({ ...prev, telegramChatId: data.user.telegramChatId }));
          setShowQRModal(false); // Close the modal automatically
        }
      } catch (error) {
        console.error("Polling error", error);
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [showQRModal, user, setUser]);

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
          telegramChatId: formData.telegramChatId,
          baseCurrency: formData.baseCurrency
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
            <img src="/Subsync Logo.jpg" alt="SubSync Logo" className="h-7 w-7 rounded-sm mr-3 object-contain" />
            <span className="font-heading font-bold text-slate-900 text-lg tracking-tight">SubSync</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">Overview</div>
          <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl font-medium transition-colors">
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </Link>
          <Link href="/dashboard/cards" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl font-medium transition-colors">
            <CreditCard className="h-5 w-5" /> Virtual Cards
          </Link>
          <Link href="/dashboard/transactions" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl font-medium transition-colors">
            <Activity className="h-5 w-5" /> Transactions
          </Link>
          
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3 mt-8">Settings</div>
          <Link href="/settings" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 bg-slate-50 text-primary rounded-xl font-medium">
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
            <div className="hidden sm:flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 w-64 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all opacity-50">
              <Search className="h-4 w-4 text-slate-400 mr-2" />
              <input type="text" placeholder="Search..." disabled className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400" />
            </div>
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
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Preferred Base Currency</label>
                <select 
                  value={formData.baseCurrency}
                  onChange={(e) => setFormData({...formData, baseCurrency: e.target.value})}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-white"
                >
                  <option value="NGN">NGN (₦)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
                <p className="text-xs text-gray-400 mt-1">Your dashboard totals will be displayed in this currency.</p>
              </div>
                </div>
              </section>

              {/* Alert Integrations */}
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                  <div className="h-8 w-8 rounded-lg bg-orange-50 flex items-center justify-center">
                    <Bell className="h-4 w-4 text-orange-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900">Alert Integrations</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="max-w-md space-y-1.5 mb-8">
                    <label className="text-sm font-medium text-slate-700">Primary Channel</label>
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

                  <div className="grid lg:grid-cols-2 gap-6">
                    {/* Telegram Integration Card */}
                    <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-[#229ED9]/10 flex items-center justify-center">
                              <svg className="h-5 w-5 text-[#229ED9]" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.188-2.85 5.18-4.686c.223-.198-.054-.31-.346-.11l-6.4 4.02-2.76-.89c-.6-.188-.612-.6.126-.89l10.814-4.17c.5-.188.94.113.806.871z"/>
                              </svg>
                            </div>
                            <h4 className="font-semibold text-slate-900">Telegram Bot</h4>
                          </div>
                          {user.telegramChatId ? (
                            <span className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold bg-green-100 text-green-700 rounded-full">Connected</span>
                          ) : (
                            <span className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold bg-slate-100 text-slate-500 rounded-full">Not Connected</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                          Receive instant push notifications 3 days before any subscription charge. Approve or block directly from your chat.
                        </p>
                      </div>
                      
                      {user.telegramChatId ? (
                        <div className="pt-4 border-t border-slate-100">
                          <p className="text-xs text-slate-400 font-medium">Chat ID: •••••{user.telegramChatId.slice(-4)}</p>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                          <a 
                            href={`https://t.me/${process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'subsy_nc_bot'}?start=${user.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-8 items-center justify-center rounded-lg bg-[#229ED9] px-4 text-xs font-medium text-white shadow-sm hover:bg-[#1f8cc0] transition-colors"
                          >
                            Connect App
                          </a>
                          <button 
                            type="button"
                            onClick={() => setShowQRModal(true)}
                            className="text-[10px] text-slate-400 font-bold tracking-wider hover:text-slate-600 transition-colors uppercase"
                          >
                            OR SCAN QR
                          </button>
                        </div>
                      )}
                    </div>

                    {/* WhatsApp Integration Card */}
                    <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 shadow-sm flex flex-col justify-between opacity-75">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-[#25D366]/10 flex items-center justify-center grayscale">
                              <svg className="h-5 w-5 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                              </svg>
                            </div>
                            <h4 className="font-semibold text-slate-500">WhatsApp</h4>
                          </div>
                          <span className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold bg-amber-100 text-amber-700 rounded-full">Coming Soon</span>
                        </div>
                        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                          Get alerts and manage your subscriptions directly through WhatsApp using our official Business API.
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                        <button disabled className="inline-flex h-8 items-center justify-center rounded-lg bg-slate-200 px-4 text-xs font-medium text-slate-400 cursor-not-allowed">
                          Connect App
                        </button>
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

      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 text-center">
            <h2 className="text-xl font-heading font-bold text-slate-900 mb-2">Connect Telegram</h2>
            <p className="text-sm text-slate-500 mb-6">Scan this QR code with your phone's camera to instantly link your account.</p>
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 inline-block mb-6">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`https://t.me/${process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'subsy_nc_bot'}?start=${user.id}`)}`} 
                alt="Scan to connect Telegram" 
                className="h-48 w-48 mx-auto mix-blend-multiply"
              />
            </div>
            
            <Button onClick={() => setShowQRModal(false)} variant="outline" className="w-full rounded-lg h-11">
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
