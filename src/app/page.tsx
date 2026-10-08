import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowRight, ShieldCheck, CreditCard, BellRing, Lock, Search, Smartphone, UserX, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1">
        {/* Section 1: Hero */}
        <section className="relative px-4 pt-32 pb-24 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-white to-white"></div>
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              Powered by Nomba & Bridgecard
            </div>
            <h1 className="font-heading text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
              Stop Subscription Leaks.<br />
              <span className="text-primary relative">
                Take Back Control.
                <svg className="absolute -bottom-2 w-full h-3 text-secondary/40" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="transparent"/></svg>
              </span>
            </h1>
            <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Make one deposit into your SubSync wallet. We auto-allocate your commitments and ask for your permission before any transaction is permitted.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white rounded-full px-8 h-14 text-base shadow-lg shadow-primary/25 transition-transform hover:-translate-y-1">
                  Get Started for Free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-8 h-14 text-base border-slate-200 hover:bg-slate-50">
                  Login to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Section 2: Logo Cloud / Social Proof */}
        <section className="py-10 border-y border-slate-100 bg-slate-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm font-medium text-slate-400 mb-6 uppercase tracking-widest">Manage everything from one place</p>
            <div className="flex justify-center items-center gap-12 opacity-50 grayscale flex-wrap">
              <span className="text-xl font-bold font-heading text-slate-800">Netflix</span>
              <span className="text-xl font-bold font-heading text-slate-800">Spotify</span>
              <span className="text-xl font-bold font-heading text-slate-800">AWS</span>
              <span className="text-xl font-bold font-heading text-slate-800">Apple</span>
              <span className="text-xl font-bold font-heading text-slate-800">DStv</span>
            </div>
          </div>
        </section>

        {/* Section 3: The Problem */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-6">
                Payments are scattered. Money is leaking.
              </h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                It is easy to lose track of how much money is quietly leaking into services no longer used, or to forget about free trials before they automatically charge a card.
              </p>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                When people finally try to cancel unwanted services, companies make the process frustrating and difficult. Existing apps either force users to share sensitive bank login details or require boring manual tracking that people quickly quit.
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-secondary/20 to-primary/20 rounded-3xl transform rotate-3"></div>
              <div className="bg-white border shadow-xl rounded-3xl p-8 relative transform -rotate-1">
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-red-50/50 border border-red-100">
                      <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                        <span className="text-red-600 font-bold">-₦</span>
                      </div>
                      <div className="flex-1">
                        <div className="h-4 w-24 bg-slate-200 rounded animate-pulse mb-2"></div>
                        <div className="h-3 w-16 bg-slate-100 rounded animate-pulse"></div>
                      </div>
                      <span className="text-red-500 font-medium">Failed to track</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: The Solution */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 text-white">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight mb-6">
              Absolute Control Over Your Financial Footprint
            </h2>
            <p className="text-xl text-slate-400">
              Subsync is a centralized, privacy-first subscription management platform. Instead of forcing risky bank account scraping, Subsync allows you to log subscriptions effortlessly.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center mb-6">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-bold mb-3">Unified Dashboard</h3>
              <p className="text-slate-400">Display total burn rate across disparate payment sources in one single beautiful layout.</p>
            </div>
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="h-12 w-12 rounded-xl bg-secondary/20 flex items-center justify-center mb-6">
                <BellRing className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-heading text-xl font-bold mb-3">Timely Alerts</h3>
              <p className="text-slate-400">Stop the "free trial trap" before cards are charged with push notifications 3 days before renewal.</p>
            </div>
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="h-12 w-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-6">
                <Lock className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="font-heading text-xl font-bold mb-3">Privacy First</h3>
              <p className="text-slate-400">No required banking credentials or Plaid data-scraping required for base use.</p>
            </div>
          </div>
        </section>

        {/* Section 5: Step by Step Journey (How it Works) */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-slate-900">How SubSync Works</h2>
            <p className="mt-4 text-lg text-slate-600">A seamless end-to-end user flow designed for simplicity.</p>
          </div>

          <div className="space-y-24">
            {/* Step 1 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 bg-slate-50 p-8 rounded-3xl border border-slate-100 flex items-center justify-center aspect-square">
                <div className="relative">
                  <Smartphone className="w-48 h-48 text-slate-200" strokeWidth={1} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <UserX className="w-16 h-16 text-primary" />
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold mb-6">1</div>
                <h3 className="font-heading text-2xl font-bold text-slate-900 mb-4">Onboarding & Authentication</h3>
                <p className="text-slate-600 text-lg">Sign up securely via Email or Social Logins. A brief 3-step onboarding asks for your primary currency and initial major subscriptions to populate the baseline.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="h-10 w-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold mb-6">2</div>
                <h3 className="font-heading text-2xl font-bold text-slate-900 mb-4">Add Your Subscriptions</h3>
                <p className="text-slate-600 text-lg">Tap the "+" button on the dashboard. Choose a preset service from a searchable global directory or create a custom entry. Input the billing cycle, cost, and renewal date.</p>
              </div>
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 flex items-center justify-center aspect-square relative">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-2xl rounded-2xl p-6 w-64 border border-slate-100">
                  <div className="flex justify-between items-center mb-4">
                    <div className="font-bold text-slate-900">Add Service</div>
                    <Search className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-10 bg-slate-50 rounded-lg flex items-center px-3 text-sm text-slate-500">Netflix...</div>
                    <div className="h-10 bg-slate-50 rounded-lg flex items-center px-3 text-sm text-slate-500">₦4,500</div>
                  </div>
                  <Button className="w-full mt-4 bg-primary text-white h-8 text-xs">Save</Button>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 bg-slate-50 p-8 rounded-3xl border border-slate-100 flex items-center justify-center aspect-square">
                 <div className="bg-white shadow-2xl rounded-2xl p-6 w-72 border border-slate-100">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center"><BellRing className="w-5 h-5 text-secondary" /></div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">Trial Ending Soon</div>
                        <div className="text-xs text-slate-500">Adobe Creative Cloud</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="w-full h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50">Cancel</Button>
                      <Button className="w-full h-8 text-xs bg-slate-900 text-white">Keep</Button>
                    </div>
                 </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="h-10 w-10 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center font-bold mb-6">3</div>
                <h3 className="font-heading text-2xl font-bold text-slate-900 mb-4">Managing Alerts & Trials</h3>
                <p className="text-slate-600 text-lg">3 days before a renewal or free trial conversion, the app triggers a push notification. You choose either "Keep" or "Cancel" before your card is ever charged.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Cancellation Workflow */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 border-y border-slate-100">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-6">
              The Ultimate Cancellation Playbook
            </h2>
            <p className="text-xl text-slate-600 mb-10">
              Selecting "Cancel" opens an actionable cancellation playbook providing a direct web link or step-by-step instructions to bypass hidden menus.
            </p>
            <div className="inline-flex items-center justify-center p-1 bg-white rounded-2xl shadow-sm border border-slate-200">
              <div className="px-6 py-4 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
                <span className="font-medium text-slate-800">Vendor dark patterns bypassed instantly.</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 7: Future Roadmap */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl font-bold tracking-tight text-slate-900">What's Coming Next</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="p-6 border rounded-2xl bg-white shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">"Zombie" Subscription Detection</h4>
              <p className="text-slate-600 text-sm">Smart identification flags based on user-logged activity or lack of recent updates.</p>
            </div>
            <div className="p-6 border rounded-2xl bg-white shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">Virtual Burner Cards</h4>
              <p className="text-slate-600 text-sm">Integrated single-use digital cards for risk-free free trials.</p>
            </div>
            <div className="p-6 border rounded-2xl bg-white shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">Multi-Currency Support</h4>
              <p className="text-slate-600 text-sm">Automatic currency conversion for global users tracking services in different currencies.</p>
            </div>
            <div className="p-6 border rounded-2xl bg-white shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">Cancellation Playbooks Database</h4>
              <p className="text-slate-600 text-sm">Curated step-by-step guides and direct links to bypass vendor cancellation barriers.</p>
            </div>
          </div>
        </section>

        {/* Section 8: Call To Action */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-primary text-white text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading text-4xl font-bold tracking-tight mb-6">Ready to stop the leaks?</h2>
            <p className="text-xl text-primary-foreground/80 mb-10">
              Join the future of financial management and keep your hard-earned money where it belongs.
            </p>
            <Link href="/signup">
              <Button size="lg" className="bg-white text-primary hover:bg-slate-100 rounded-full px-10 h-14 text-lg shadow-xl">
                Create Free Account
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-900">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-4">
            <img 
              src="/Subsync Logo white on black background.jpg" 
              alt="SubSync Logo Dark" 
              className="h-14 w-auto object-contain rounded-lg"
            />
            <p className="text-slate-400 text-sm max-w-xs text-center md:text-left">
              Simplify your commitments and take control of your financial freedom. Built for InnovateX Africa.
            </p>
          </div>
          
          <div className="flex gap-8 text-sm text-slate-400">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-slate-900 text-center text-sm text-slate-500">
          &copy; 2026 SubSync. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
