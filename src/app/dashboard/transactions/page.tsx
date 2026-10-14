"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { 
  CreditCard, LayoutDashboard, Settings as SettingsIcon,
  Activity, Menu, X, BarChart3, Loader2, ArrowDownLeft, ArrowUpRight, ShoppingBag
} from "lucide-react";
import Link from "next/link";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";

interface Transaction {
  id: string;
  amount: number;
  type: string;
  description: string;
  status: string;
  createdAt: string;
}

export default function TransactionsPage() {
  const router = useRouter();
  const { user, setUser } = useStore();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    const savedUserStr = localStorage.getItem("subsync_user");
    if (savedUserStr) {
      const savedUser = JSON.parse(savedUserStr);
      setUser(savedUser);
      fetchTransactions(savedUser.id);
    } else {
      router.push("/login");
    }
  }, [router, setUser]);

  const fetchTransactions = async (userId: string) => {
    try {
      const res = await fetch(`/api/transactions?userId=${userId}`);
      const data = await res.json();
      if (data.success) {
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'WALLET_FUND': return <ArrowDownLeft className="h-5 w-5 text-green-600" />;
      case 'CARD_FUND': return <ArrowUpRight className="h-5 w-5 text-blue-600" />;
      case 'MERCHANT_PAYMENT': return <ShoppingBag className="h-5 w-5 text-purple-600" />;
      default: return <Activity className="h-5 w-5 text-slate-600" />;
    }
  };

  const getBgColor = (type: string) => {
    switch(type) {
      case 'WALLET_FUND': return "bg-green-100";
      case 'CARD_FUND': return "bg-blue-100";
      case 'MERCHANT_PAYMENT': return "bg-purple-100";
      default: return "bg-slate-100";
    }
  };

  if (!mounted || !user) return null;

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
            <h1 className="text-lg font-semibold text-slate-900 hidden sm:block">Transaction History</h1>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center p-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <Activity className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900">No Transactions Yet</h3>
                  <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">When you fund your wallet, load a virtual card, or make a payment, it will appear here.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {transactions.map(tx => (
                    <div key={tx.id} className="p-5 hover:bg-slate-50 transition-colors flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${getBgColor(tx.type)}`}>
                          {getIcon(tx.type)}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-slate-900">{tx.description}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{new Date(tx.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${tx.type === 'WALLET_FUND' ? 'text-green-600' : 'text-slate-900'}`}>
                          {tx.type === 'WALLET_FUND' ? '+' : '-'}₦{tx.amount.toLocaleString()}
                        </p>
                        <span className="inline-block mt-1 text-[10px] uppercase tracking-wider font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
            
          </div>
        </div>
      </main>
    </div>
  );
}
