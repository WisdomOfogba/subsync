import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        <Link href="/" className="flex items-center">
          <img 
            src="/Subsync Logo and Text.jpg" 
            alt="SubSync" 
            className="h-10 w-auto object-contain"
          />
        </Link>
        
        <nav className="hidden md:flex gap-6">
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">Home</Link>
          <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground">Pricing</Link>
          <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground">Features</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="hidden sm:inline-flex text-slate-600 hover:text-slate-900">Sign In</Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-primary text-white hover:bg-primary/90">Get Started</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
