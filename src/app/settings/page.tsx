"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/Button";
import { 
  Loader2, Save, User as UserIcon, Bell, Smartphone, 
  Search, Menu, CheckCircle2, ShieldCheck, RefreshCw, X
} from "lucide-react";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";

export default function Settings() {
  const router = useRouter();
  const { user, setUser } = useStore();
  const [mounted, setMounted] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    telegramChatId: "",
    whatsappPhone: "",
    alertPreference: "Email Only",
    baseCurrency: "NGN",
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [showQRModal, setShowQRModal] = useState<"telegram" | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // WhatsApp OTP Verification state
  const [whatsappNumberInput, setWhatsappNumberInput] = useState("");
  const [otpStep, setOtpStep] = useState<"idle" | "code_sent">("idle");
  const [otpCode, setOtpCode] = useState("");
  const [verificationToken, setVerificationToken] = useState("");
  const [otpStatusMsg, setOtpStatusMsg] = useState("");
  const [otpStatusType, setOtpStatusType] = useState<"info" | "error" | "success">("info");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedUserStr = localStorage.getItem("subsync_user");
    if (savedUserStr) {
      const savedUser = JSON.parse(savedUserStr);
      setUser(savedUser);
      setFormData({
        name: savedUser.name || "",
        telegramChatId: savedUser.telegramChatId || "",
        whatsappPhone: savedUser.whatsappPhone || "",
        alertPreference: savedUser.alertPreference || "Email Only",
        baseCurrency: savedUser.baseCurrency || "NGN",
      });
      setWhatsappNumberInput(savedUser.whatsappPhone || "");

      // Fetch latest user state to sync DB updates (like Telegram linking or balance changes)
      fetch(`/api/users/${savedUser.id}?t=${Date.now()}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.user) {
            setUser(data.user);
            localStorage.setItem("subsync_user", JSON.stringify(data.user));
            setFormData(prev => ({
              ...prev,
              telegramChatId: data.user.telegramChatId || prev.telegramChatId,
              whatsappPhone: data.user.whatsappPhone || prev.whatsappPhone,
              alertPreference: data.user.alertPreference || prev.alertPreference,
              name: data.user.name || prev.name,
              baseCurrency: data.user.baseCurrency || prev.baseCurrency,
            }));
            setWhatsappNumberInput(data.user.whatsappPhone || "");
          }
        })
        .catch(err => console.error("Failed to fetch latest user data", err));

    } else {
      router.push("/login");
    }
  }, [router, setUser]);

  // Poll for chat connection when Telegram QR modal is open
  useEffect(() => {
    if (!showQRModal || !user) return;
    
    const intervalId = setInterval(async () => {
      try {
        const res = await fetch(`/api/users/${user.id}?t=${Date.now()}`);
        const data = await res.json();
        if (!data.success || !data.user) return;
        if (data.user.telegramChatId) {
          setUser(data.user);
          localStorage.setItem("subsync_user", JSON.stringify(data.user));
          setFormData(prev => ({
            ...prev,
            telegramChatId: data.user.telegramChatId,
          }));
          setShowQRModal(null);
        }
      } catch (error) {
        console.error("Polling error", error);
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [showQRModal, user, setUser]);

  const handleSendOtp = async () => {
    if (!user) return;
    const clean = whatsappNumberInput.replace(/\D/g, "");
    if (clean.length < 10) {
      setOtpStatusMsg("Please enter a valid phone number with country code (e.g. 234816367363)");
      setOtpStatusType("error");
      return;
    }

    setIsSendingOtp(true);
    setOtpStatusMsg("");
    try {
      const res = await fetch("/api/whatsapp/verify/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, phone: clean }),
      });
      const data = await res.json();
      if (data.success && data.verificationToken) {
        setVerificationToken(data.verificationToken);
        setOtpStep("code_sent");
        setOtpStatusMsg(data.message || "Verification code sent to your WhatsApp!");
        setOtpStatusType("info");
      } else {
        setOtpStatusMsg(data.error || "Failed to send code. Please try again.");
        setOtpStatusType("error");
      }
    } catch (err: any) {
      setOtpStatusMsg("Network error sending code. Please try again.");
      setOtpStatusType("error");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!user || !verificationToken) return;
    if (!otpCode || otpCode.trim().length !== 6) {
      setOtpStatusMsg("Please enter the 6-digit verification code.");
      setOtpStatusType("error");
      return;
    }

    setIsVerifyingOtp(true);
    setOtpStatusMsg("");
    try {
      const res = await fetch("/api/whatsapp/verify/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          phone: whatsappNumberInput,
          code: otpCode.trim(),
          verificationToken,
        }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem("subsync_user", JSON.stringify(data.user));
        setFormData(prev => ({
          ...prev,
          whatsappPhone: data.user.whatsappPhone,
        }));
        setOtpStep("idle");
        setOtpCode("");
        setVerificationToken("");
        setIsEditingPhone(false);
        setOtpStatusMsg("WhatsApp connected successfully!");
        setOtpStatusType("success");
        setTimeout(() => setOtpStatusMsg(""), 5000);
      } else {
        setOtpStatusMsg(data.error || "Incorrect or expired code. Please try again.");
        setOtpStatusType("error");
      }
    } catch (err: any) {
      setOtpStatusMsg("Network error verifying code.");
      setOtpStatusType("error");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleDisconnectWhatsApp = async () => {
    if (!user) return;
    if (!confirm("Are you sure you want to disconnect WhatsApp alerts?")) return;
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ whatsappPhone: null }),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem("subsync_user", JSON.stringify(data.user));
        setFormData(prev => ({ ...prev, whatsappPhone: "" }));
        setWhatsappNumberInput("");
        setOtpStep("idle");
        setOtpCode("");
        setVerificationToken("");
        setIsEditingPhone(false);
        setOtpStatusMsg("WhatsApp disconnected.");
        setOtpStatusType("info");
        setTimeout(() => setOtpStatusMsg(""), 3000);
      }
    } catch (err) {
      console.error("Disconnect error", err);
    }
  };

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
          whatsappPhone: formData.whatsappPhone,
          alertPreference: formData.alertPreference,
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

  if (!mounted || !user) return null;

  const telegramLink = `https://t.me/${process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || "subsy_nc_bot"}?start=${user.id}`;
  const isWhatsAppConnected = Boolean(user.whatsappPhone && !isEditingPhone);

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
                      <option value="Email Only">Email Only (Default)</option>
                      <option value="Telegram Only">Telegram Only</option>
                      <option value="WhatsApp Only">WhatsApp Only</option>
                      <option value="Email & Telegram">Email & Telegram</option>
                      <option value="Email & WhatsApp">Email & WhatsApp</option>
                      <option value="All Channels">Email, Telegram & WhatsApp</option>
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
                            <span className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" /> Connected
                            </span>
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
                            href={telegramLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-8 items-center justify-center rounded-lg bg-[#229ED9] px-4 text-xs font-medium text-white shadow-sm hover:bg-[#1f8cc0] transition-colors"
                          >
                            Connect App
                          </a>
                          <button 
                            type="button"
                            onClick={() => setShowQRModal("telegram")}
                            className="text-[10px] text-slate-400 font-bold tracking-wider hover:text-slate-600 transition-colors uppercase"
                          >
                            OR SCAN QR
                          </button>
                        </div>
                      )}
                    </div>

                    {/* WhatsApp Integration Card with OTP Verification */}
                    <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-[#25D366]/10 flex items-center justify-center">
                              <svg className="h-5 w-5 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                              </svg>
                            </div>
                            <h4 className="font-semibold text-slate-900">WhatsApp</h4>
                          </div>
                          {isWhatsAppConnected ? (
                            <span className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" /> Connected
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold bg-slate-100 text-slate-500 rounded-full">Not Connected</span>
                          )}
                        </div>

                        {/* Connected State View */}
                        {isWhatsAppConnected ? (
                          <div className="space-y-4">
                            <p className="text-xs text-slate-500 leading-relaxed">
                              Your WhatsApp is verified to receive renewal alerts, interact with our AI, and approve or cancel charges directly in chat.
                            </p>
                            <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-100 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                                <span className="text-xs font-semibold text-emerald-900">+{user.whatsappPhone}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setIsEditingPhone(true)}
                                  className="text-[11px] font-medium text-emerald-700 hover:text-emerald-900 transition-colors"
                                >
                                  Change
                                </button>
                                <span className="text-emerald-300">|</span>
                                <button
                                  type="button"
                                  onClick={handleDisconnectWhatsApp}
                                  className="text-[11px] font-medium text-rose-600 hover:text-rose-800 transition-colors"
                                >
                                  Disconnect
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* Verification Flow: Input Phone -> Send Code -> Enter OTP */
                          <div className="space-y-3">
                            <p className="text-xs text-slate-500 leading-relaxed">
                              Enter your phone number to receive a verification code on WhatsApp. No app switching or manual messages required.
                            </p>

                            <div className="space-y-1">
                              <label className="text-[11px] font-medium text-slate-600">WhatsApp Phone Number</label>
                              <div className="flex gap-2">
                                <input 
                                  type="tel"
                                  placeholder="e.g. 234816367363"
                                  value={whatsappNumberInput}
                                  disabled={otpStep === "code_sent"}
                                  onChange={(e) => setWhatsappNumberInput(e.target.value)}
                                  className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-white disabled:bg-slate-100 disabled:text-slate-500"
                                />
                                {otpStep === "idle" && (
                                  <button
                                    type="button"
                                    onClick={handleSendOtp}
                                    disabled={isSendingOtp || !whatsappNumberInput}
                                    className="inline-flex h-8 items-center justify-center rounded-lg bg-[#25D366] px-3 text-xs font-medium text-white shadow-sm hover:bg-[#1fb855] disabled:opacity-50 transition-colors shrink-0"
                                  >
                                    {isSendingOtp ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : null}
                                    Send Code
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* OTP Entry Step */}
                            {otpStep === "code_sent" && (
                              <div className="space-y-2 p-3 bg-slate-50 rounded-lg border border-slate-200 animate-in fade-in duration-200">
                                <div className="flex items-center justify-between">
                                  <label className="text-[11px] font-semibold text-slate-700">Enter 6-Digit Code</label>
                                  <button
                                    type="button"
                                    onClick={() => { setOtpStep("idle"); setOtpCode(""); }}
                                    className="text-[10px] text-slate-400 hover:text-slate-600"
                                  >
                                    Change number
                                  </button>
                                </div>
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    maxLength={6}
                                    placeholder="••••••"
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                                    className="w-32 tracking-widest text-center font-mono font-bold text-sm rounded-lg border border-slate-300 px-2 py-1.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white"
                                  />
                                  <button
                                    type="button"
                                    onClick={handleVerifyOtp}
                                    disabled={isVerifyingOtp || otpCode.length !== 6}
                                    className="inline-flex h-8 items-center justify-center rounded-lg bg-primary px-3 text-xs font-medium text-white shadow-sm hover:bg-primary/90 disabled:opacity-50 transition-colors"
                                  >
                                    {isVerifyingOtp ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : null}
                                    Verify & Connect
                                  </button>
                                  <button
                                    type="button"
                                    onClick={handleSendOtp}
                                    disabled={isSendingOtp}
                                    className="text-xs text-slate-500 hover:text-slate-800 p-1"
                                    title="Resend code"
                                  >
                                    <RefreshCw className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Status Message */}
                            {otpStatusMsg && (
                              <p className={`text-[11px] font-medium ${
                                otpStatusType === "error" 
                                  ? "text-rose-600" 
                                  : otpStatusType === "success" 
                                    ? "text-emerald-600" 
                                    : "text-blue-600"
                              }`}>
                                {otpStatusMsg}
                              </p>
                            )}

                            {isEditingPhone && (
                              <button
                                type="button"
                                onClick={() => { setIsEditingPhone(false); setOtpStep("idle"); }}
                                className="text-[11px] text-slate-400 hover:text-slate-600 underline"
                              >
                                Cancel edit
                              </button>
                            )}
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

      {/* Telegram QR Code Modal */}
      {showQRModal === "telegram" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 text-center">
            <h2 className="text-xl font-heading font-bold text-slate-900 mb-2">
              Connect Telegram
            </h2>
            <p className="text-sm text-slate-500 mb-6">Scan this QR code with your phone&apos;s camera to instantly link your account.</p>
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 inline-block mb-6">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(telegramLink)}`} 
                alt="Scan to connect Telegram" 
                className="h-48 w-48 mx-auto mix-blend-multiply"
              />
            </div>
            
            <Button onClick={() => setShowQRModal(null)} variant="outline" className="w-full rounded-lg h-11">
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
