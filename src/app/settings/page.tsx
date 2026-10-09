"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, Bell, Smartphone, Loader2, Save, User as UserIcon } from "lucide-react";

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

  if (!mounted || !user) return null;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Sleek Minimalist Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push("/dashboard")} className="text-gray-400 hover:text-gray-900 transition-colors">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3">
              <img src="/Subsync Logo.jpg" alt="SubSync Logo" className="h-8 w-8 rounded-md object-contain" />
              <div className="font-heading font-semibold tracking-tight text-gray-900 text-lg hidden sm:block">Settings</div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-3xl flex-grow p-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-gray-900">Profile & Preferences</h1>
          <p className="text-sm text-gray-500 mt-2">Manage your account details and notification preferences.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          {/* Profile Section */}
          <section className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <UserIcon className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Personal Info</h2>
            </div>
            
            <div className="space-y-5 max-w-md">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <input 
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-gray-50/50 focus:bg-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Email Address (Read-only)</label>
                <input 
                  type="email"
                  value={user.email}
                  readOnly
                  className="w-full rounded-xl border border-gray-100 px-4 py-3 text-sm text-gray-500 bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>
          </section>

          {/* Alerts & Notifications */}
          <section className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center">
                <Bell className="h-5 w-5 text-orange-500" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
            </div>
            
            <div className="space-y-6 max-w-md">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Where should we send alerts?</label>
                <select 
                  value={formData.alertPreference}
                  onChange={(e) => setFormData({...formData, alertPreference: e.target.value})}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-white"
                >
                  <option>Email Only (Default)</option>
                  <option>Telegram Only</option>
                  <option>Email & Telegram</option>
                </select>
                <p className="text-xs text-gray-400 mt-1">We alert you 3 days before any deduction.</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-start gap-4">
                  <Smartphone className="h-5 w-5 text-slate-400 mt-0.5 shrink-0" />
                  <div className="space-y-3 w-full">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">Connect Telegram</h4>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        Click the button below to open Telegram. Just press "Start" and your account will be linked instantly!
                      </p>
                    </div>
                    {user.telegramChatId ? (
                      <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-sm font-semibold border border-green-100">
                        ✓ Connected
                      </div>
                    ) : (
                      <a 
                        href={`https://t.me/${process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'subsy_nc_bot'}?start=${user.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-10 items-center justify-center rounded-xl bg-[#229ED9] px-6 text-sm font-medium text-white shadow-sm hover:bg-[#1f8cc0] transition-colors"
                      >
                        Connect via Telegram
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="flex items-center gap-4 pt-2">
            <Button type="submit" className="h-12 px-8 rounded-xl shadow-lg shadow-primary/25" disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
              Save Preferences
            </Button>
            {saveMessage && (
              <span className="text-sm font-medium text-green-600 animate-in fade-in slide-in-from-left-2">
                {saveMessage}
              </span>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}
