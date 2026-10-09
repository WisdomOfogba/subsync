"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/Button";
import { 
  CreditCard, Plus, ArrowRightLeft, LayoutDashboard, Settings as SettingsIcon,
  Activity, Menu, X, BarChart3, Loader2, Copy, Check
} from "lucide-react";
import Link from "next/link";

interface VirtualCard {
  id: string;
  name: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  balance: number;
}

export default function CardsPage() {
  const router = useRouter();
  const { user, setUser } = useStore();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [cards, setCards] = useState<VirtualCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modals
  const [isCreating, setIsCreating] = useState(false);
  const [newCardName, setNewCardName] = useState("Netflix Card");
  
  const [isFunding, setIsFunding] = useState(false);
  const [fundAmount, setFundAmount] = useState("");
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  // Fake Paystack DVA funding
  const [isAddingToWallet, setIsAddingToWallet] = useState(false);

  const [copiedId, setCopiedId] = useState<string | null>(null);

  // OTP Reveal State
  const [revealedCards, setRevealedCards] = useState<Record<string, boolean>>({});
  const [otpCardId, setOtpCardId] = useState<string | null>(null);
  const [otp, setOtp] = useState("");

  useEffect(() => {
    setMounted(true);
    const savedUserStr = localStorage.getItem("subsync_user");
    if (savedUserStr) {
      const savedUser = JSON.parse(savedUserStr);
      setUser(savedUser);
      fetchCards(savedUser.id);
      
      // Also fetch user to get latest wallet balance
      fetch(`/api/users/${savedUser.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setUser(data.user);
            localStorage.setItem("subsync_user", JSON.stringify(data.user));
          }
        });
    } else {
      router.push("/login");
    }
  }, [router, setUser]);

  const fetchCards = async (userId: string) => {
    try {
      const res = await fetch(`/api/cards?userId=${userId}`);
      const data = await res.json();
      if (data.success) {
        setCards(data.cards);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsCreating(true);
    try {
      const res = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, name: newCardName })
      });
      const data = await res.json();
      if (data.success) {
        setCards([...cards, data.card]);
        setNewCardName("");
        // close modal
        const dialog = document.getElementById('create_card_modal') as HTMLDialogElement;
        dialog?.close();
      }
    } catch (e) {
      console.error(e);
    }
    setIsCreating(false);
  };

  const handleFundCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedCardId || !fundAmount) return;
    setIsFunding(true);
    try {
      const amount = parseFloat(fundAmount);
      const res = await fetch("/api/cards/fund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, cardId: selectedCardId, amount })
      });
      const data = await res.json();
      if (data.success) {
        // Update local state
        setCards(cards.map(c => c.id === selectedCardId ? { ...c, balance: c.balance + amount } : c));
        const updatedUser = { ...user, walletBalance: (user.walletBalance || 0) - amount };
        setUser(updatedUser);
        localStorage.setItem("subsync_user", JSON.stringify(updatedUser));
        
        setFundAmount("");
        const dialog = document.getElementById('fund_card_modal') as HTMLDialogElement;
        dialog?.close();
      } else {
        alert(data.error);
      }
    } catch (e) {
      console.error(e);
    }
    setIsFunding(false);
  };

  const handleFundWallet = async () => {
    if (!user) return;
    setIsAddingToWallet(true);
    try {
      // Add 10000 to wallet
      const res = await fetch("/api/wallet/fund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, amount: 10000 })
      });
      const data = await res.json();
      if (data.success) {
        const updatedUser = { ...user, walletBalance: data.balance };
        setUser(updatedUser);
        localStorage.setItem("subsync_user", JSON.stringify(updatedUser));
      }
    } catch (e) {
      console.error(e);
    }
    setIsAddingToWallet(false);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatCardNumber = (num: string) => {
    return num.replace(/(\d{4})/g, '$1 ').trim();
  };

  const maskCardNumber = (num: string) => {
    return `•••• •••• •••• ${num.slice(-4)}`;
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === "1234" && otpCardId) {
      setRevealedCards({ ...revealedCards, [otpCardId]: true });
      setOtp("");
      const dialog = document.getElementById('otp_modal') as HTMLDialogElement;
      dialog?.close();
    } else {
      alert("Invalid OTP! Try 1234.");
    }
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
            <img src="/Subsynclogo.svg" alt="SubSync Logo" className="h-7 w-7 rounded-sm mr-3 object-contain" />
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
          <Link href="/dashboard/cards" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 bg-slate-50 text-primary rounded-xl font-medium">
            <CreditCard className="h-5 w-5" /> Virtual Cards
          </Link>
          <Link href="/dashboard/transactions" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl font-medium transition-colors">
            <Activity className="h-5 w-5" /> Transactions
          </Link>
          <Link href="/dashboard/analytics" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl font-medium transition-colors">
            <BarChart3 className="h-5 w-5" /> Analytics
          </Link>
          
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3 mt-8">Settings</div>
          <Link href="/settings" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl font-medium transition-colors">
            <SettingsIcon className="h-5 w-5" /> Profile & Alerts
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden text-slate-500 hover:text-slate-900 transition-colors">
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold text-slate-900 hidden sm:block">Virtual Cards</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Button onClick={() => (document.getElementById('create_card_modal') as HTMLDialogElement)?.showModal()} className="h-9 px-4 text-xs">
              <Plus className="h-4 w-4 mr-1.5" /> New Card
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-5xl mx-auto space-y-8">
            
            {/* Wallet Section */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Paystack Virtual Account Balance</p>
                <div className="text-3xl font-heading font-bold text-slate-900">
                  ₦{(user.walletBalance || 0).toLocaleString()}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Paystack DVA: {user.paystackDva || "9928374651"} (Wema Bank)
                </p>
              </div>
              <Button 
                onClick={handleFundWallet} 
                disabled={isAddingToWallet}
                variant="outline" 
                className="h-10 border-primary text-primary hover:bg-primary/5"
              >
                {isAddingToWallet ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ArrowRightLeft className="h-4 w-4 mr-2" />}
                Simulate ₦10,000 Inflow
              </Button>
            </section>

            {/* Cards List */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Your Cards</h2>
              
              {isLoading ? (
                <div className="flex justify-center p-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : cards.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 border-dashed">
                  <CreditCard className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900">No Virtual Cards</h3>
                  <p className="text-sm text-slate-500 mt-1 mb-6">Create a dedicated dollar or naira card for your subscriptions.</p>
                  <Button onClick={() => (document.getElementById('create_card_modal') as HTMLDialogElement)?.showModal()}>
                    Generate First Card
                  </Button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {cards.map(card => {
                    const isRevealed = revealedCards[card.id];
                    return (
                      <div key={card.id} className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl shadow-slate-200 relative overflow-hidden flex flex-col justify-between">
                        <div className="absolute -right-12 -top-12 h-40 w-40 bg-white/5 rounded-full blur-2xl"></div>
                        <div className="absolute -left-12 -bottom-12 h-40 w-40 bg-primary/20 rounded-full blur-2xl"></div>
                        
                        <div className="flex justify-between items-start relative z-10 mb-8">
                          <div>
                            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">{card.name}</p>
                            <div className="text-2xl font-bold">₦{card.balance.toLocaleString()}</div>
                          </div>
                          <div className="h-8 w-12 bg-white/20 rounded-md flex items-center justify-center backdrop-blur-sm">
                            <span className="font-bold italic text-sm">VISA</span>
                          </div>
                        </div>
                        
                        <div className="space-y-4 relative z-10">
                          <div className="flex items-center justify-between group">
                            <div className="font-mono text-lg tracking-widest">
                              {isRevealed ? formatCardNumber(card.cardNumber) : maskCardNumber(card.cardNumber)}
                            </div>
                            {isRevealed && (
                              <button onClick={() => copyToClipboard(card.cardNumber, card.id)} className="p-1.5 hover:bg-white/10 rounded-md transition-colors">
                                {copiedId === card.id ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4 text-slate-300" />}
                              </button>
                            )}
                          </div>
                          
                          <div className="flex justify-between items-end">
                            <div className="flex gap-6">
                              <div>
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Valid Thru</p>
                                <p className="font-mono text-sm">{isRevealed ? card.expiry : "••/••"}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">CVV</p>
                                <p className="font-mono text-sm">{isRevealed ? card.cvv : "•••"}</p>
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              {!isRevealed ? (
                                <Button 
                                  onClick={() => {
                                    setOtpCardId(card.id);
                                    (document.getElementById('otp_modal') as HTMLDialogElement)?.showModal();
                                  }}
                                  variant="secondary" 
                                  className="h-8 text-xs bg-white/10 hover:bg-white/20 text-white border-0"
                                >
                                  Reveal
                                </Button>
                              ) : (
                                <Button 
                                  onClick={() => setRevealedCards({ ...revealedCards, [card.id]: false })}
                                  variant="secondary" 
                                  className="h-8 text-xs bg-white/10 hover:bg-white/20 text-white border-0"
                                >
                                  Hide
                                </Button>
                              )}
                              
                              <Button 
                                onClick={() => {
                                  setSelectedCardId(card.id);
                                  (document.getElementById('fund_card_modal') as HTMLDialogElement)?.showModal();
                                }}
                                variant="secondary" 
                                className="h-8 text-xs bg-white/10 hover:bg-white/20 text-white border-0"
                              >
                                Fund
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
            
            {cards.length > 0 && (
              <div className="text-center mt-12">
                <Link href="/simulation" target="_blank" className="inline-flex items-center text-sm font-medium text-primary hover:text-blue-700 transition-colors">
                  Go to Checkout Simulation Page &rarr;
                </Link>
              </div>
            )}
            
          </div>
        </div>
      </main>

      {/* Create Card Modal */}
      <dialog id="create_card_modal" className="modal backdrop:bg-slate-900/50 backdrop:backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-slate-100 max-w-md w-full mx-auto mt-24">
        <h3 className="font-bold text-xl text-slate-900 mb-2">Create Virtual Card</h3>
        <p className="text-sm text-slate-500 mb-6">Instantly generate a Bridgecard virtual card for your subscriptions.</p>
        
        <form onSubmit={handleCreateCard} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">Card Name (e.g. Netflix)</label>
            <input 
              type="text" 
              value={newCardName}
              onChange={(e) => setNewCardName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              required
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => (document.getElementById('create_card_modal') as HTMLDialogElement)?.close()} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating} className="flex-1">
              {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate Card"}
            </Button>
          </div>
        </form>
      </dialog>

      {/* Fund Card Modal */}
      <dialog id="fund_card_modal" className="modal backdrop:bg-slate-900/50 backdrop:backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-slate-100 max-w-sm w-full mx-auto mt-24">
        <h3 className="font-bold text-xl text-slate-900 mb-2">Fund Card</h3>
        <p className="text-sm text-slate-500 mb-6">Transfer money from your Paystack Wallet to this Virtual Card.</p>
        
        <form onSubmit={handleFundCard} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">Amount (₦)</label>
            <input 
              type="number" 
              value={fundAmount}
              onChange={(e) => setFundAmount(e.target.value)}
              placeholder="e.g. 5000"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              required
              min="100"
            />
            <p className="text-xs text-slate-500 mt-2">Available wallet balance: ₦{(user.walletBalance || 0).toLocaleString()}</p>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => (document.getElementById('fund_card_modal') as HTMLDialogElement)?.close()} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isFunding} className="flex-1">
              {isFunding ? <Loader2 className="h-4 w-4 animate-spin" /> : "Transfer Funds"}
            </Button>
          </div>
        </form>
      </dialog>

      {/* OTP Modal */}
      <dialog id="otp_modal" className="modal backdrop:bg-slate-900/50 backdrop:backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-slate-100 max-w-xs w-full mx-auto mt-32">
        <h3 className="font-bold text-lg text-slate-900 mb-1">Security Check</h3>
        <p className="text-sm text-slate-500 mb-6">Enter your 4-digit PIN (Try 1234) to reveal sensitive card details.</p>
        
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <input 
              type="password" 
              maxLength={4}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="••••"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-center tracking-widest text-xl font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              required
            />
          </div>
          
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => {setOtp(""); (document.getElementById('otp_modal') as HTMLDialogElement)?.close()}} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Verify
            </Button>
          </div>
        </form>
      </dialog>
      
    </div>
  );
}
