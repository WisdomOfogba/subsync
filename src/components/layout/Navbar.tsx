"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";

export default function Navbar() {
  const { user, setUser } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedUser = localStorage.getItem("subsync_user");
    if (savedUser && !user) {
      setUser(JSON.parse(savedUser));
    }
  }, [user, setUser]);

  return (
    <nav className="fixed top-0 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md z-50">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/Subsync Logo.jpg" alt="SubSync Logo" width={32} height={32} className="rounded-md object-contain" />
          <div className="font-heading font-semibold tracking-tight text-gray-900 text-xl hidden sm:block">SubSync</div>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Features</Link>
          <Link href="#how-it-works" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">How it Works</Link>
          <Link href="/pricing" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Pricing</Link>
        </div>

        <div className="flex items-center gap-4">
          {mounted && user ? (
            <Link href="/dashboard">
              <Button variant="outline" className="rounded-full shadow-sm">Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 hidden sm:block">Log in</Link>
              <Link href="/signup">
                <Button className="rounded-full shadow-sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
