"use client";

import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useStore } from "@/store/useStore";
import {
  LayoutDashboard,
  CreditCard,
  Activity,
  BarChart3,
  Settings as SettingsIcon,
  LogOut,
  X,
} from "lucide-react";

interface DashboardSidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export function DashboardSidebar({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: DashboardSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser } = useStore();

  const handleLogout = () => {
    localStorage.removeItem("subsync_user");
    setUser(null);
    router.push("/login");
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Virtual Cards", href: "/dashboard/cards", icon: CreditCard },
    { name: "Transactions", href: "/dashboard/transactions", icon: Activity },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Unified SaaS Sidebar */}
      <aside
        className={`w-64 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 md:relative md:translate-x-0 shrink-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
          <Link href="/dashboard" className="flex items-center">
            <img
              src="/Subsynclogo.svg"
              alt="SubSync Logo"
              className="h-7 w-7 rounded-sm mr-3 object-contain"
            />
            <span className="font-heading font-bold text-slate-900 text-lg tracking-tight">
              SubSync
            </span>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">
            Overview
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-colors ${
                  isActive
                    ? "bg-slate-50 text-primary font-semibold"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-primary" : "text-slate-500"}`} />
                {item.name}
              </Link>
            );
          })}

          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3 mt-8">
            Settings
          </div>
          <Link
            href="/settings"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-colors ${
              pathname === "/settings"
                ? "bg-slate-50 text-primary font-semibold"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <SettingsIcon
              className={`h-5 w-5 ${
                pathname === "/settings" ? "text-primary" : "text-slate-500"
              }`}
            />
            Profile & Alerts
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-100 flex flex-col gap-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors w-full text-left"
          >
            <LogOut className="h-5 w-5" />
            Log out
          </button>
          <div className="flex items-center gap-3 pt-1">
            <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200 shrink-0">
              <span className="text-sm font-bold text-blue-700">
                {user?.name?.charAt(0) || "U"}
              </span>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-slate-900 truncate">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {user?.email || ""}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
