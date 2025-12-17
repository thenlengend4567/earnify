
import Link from "next/link";
import { ArrowRight, CheckCircle2, Shield, Zap } from "lucide-react";
import { Navbar } from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Navbar is strictly functional here, but we might want a landing specific one? 
            Currently Navbar component is used in Layout. 
            We'll stick to Layout's Navbar but ensure page structure works with it.
        */}

        {/* Hero Section */}
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 lg:py-32">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--secondary)]/50 border border-[var(--border)] text-xs text-[var(--muted-foreground)] mb-8 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            v1.0 is Live
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 max-w-4xl bg-gradient-to-b from-[var(--foreground)] to-[var(--muted-foreground)] bg-clip-text text-transparent animate-fade-in-up delay-100">
            Earn Real Money Doing <br />
            <span className="text-[var(--primary)]">Simple Digital Tasks</span>
          </h1>

          <p className="text-lg md:text-xl text-[var(--muted-foreground)] max-w-2xl mb-10 animate-fade-in-up delay-200">
            Join thousands of users earning by watching ads, completing offers, and referring friends.
            Fast payouts, secure platform, premium experience.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-300">
            <Link href="/signup" className="btn btn-primary px-8 h-12 text-base shadow-lg shadow-[var(--primary)]/20">
              Start Earning Now <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <Link href="/login" className="btn btn-outline px-8 h-12 text-base bg-[var(--background)]/50 backdrop-blur-sm">
              Log In
            </Link>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-5xl w-full text-left px-4">
            <div className="p-6 rounded-2xl bg-[var(--secondary)]/20 border border-[var(--border)] hover:bg-[var(--secondary)]/40 transition-colors backdrop-blur-sm">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Payouts</h3>
              <p className="text-[var(--muted-foreground)]">Withdraw your earnings instantly to PayPal or Crypto once you hit the minimum.</p>
            </div>
            <div className="p-6 rounded-2xl bg-[var(--secondary)]/20 border border-[var(--border)] hover:bg-[var(--secondary)]/40 transition-colors backdrop-blur-sm">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
              <p className="text-[var(--muted-foreground)]">Your data and earnings are protected with enterprise-grade security protocols.</p>
            </div>
            <div className="p-6 rounded-2xl bg-[var(--secondary)]/20 border border-[var(--border)] hover:bg-[var(--secondary)]/40 transition-colors backdrop-blur-sm">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Tasks</h3>
              <p className="text-[var(--muted-foreground)]">Only legitimate offers from trusted partners. No spam, no scams.</p>
            </div>
          </div>
        </main>

        <footer className="py-8 border-t border-[var(--border)] text-center text-sm text-[var(--muted-foreground)]">
          <p>&copy; 2025 Earnify. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
