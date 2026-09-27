'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useQueue } from '@/context/QueueContext';
import { Sparkles, Menu, X, ArrowRight, MessageSquare, Shield, Activity } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { notifications, setIsWhatsAppOpen, lastSimulatedEvent } = useQueue();

  const isBusinessRoute = pathname?.startsWith('/business');
  const isKiosk = pathname === '/business/queue';

  // Do not show full navbar on TV kiosk mode
  if (isKiosk) return null;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#08090C]/80 border-b border-white/5 transition-all">
      {/* Live system tick ticker banner if active */}
      {lastSimulatedEvent && (
        <div className="bg-gradient-to-r from-cyan-950/40 via-surface-100 to-cyan-950/40 border-b border-cyan-500/20 py-1 px-4 text-center">
          <p className="text-[11px] font-mono text-cyan-300 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-semibold uppercase tracking-wider">LIVE EVENT:</span>
            <span>{lastSimulatedEvent}</span>
          </p>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.4)] group-hover:scale-105 transition-transform">
            <span className="font-mono font-black text-black text-base">Q</span>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg tracking-wider text-white group-hover:text-cyan-300 transition-colors font-mono">
              QUEUELESS
            </span>
            <span className="text-[9px] uppercase tracking-widest text-white/40 -mt-1 font-mono">
              Dynamic 3D Queues
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
          <Link
            href="/how-it-works"
            className={`hover:text-cyan-300 transition-colors ${
              pathname === '/how-it-works' ? 'text-cyan-300 font-semibold' : ''
            }`}
          >
            How It Works
          </Link>
          <Link
            href="/business"
            className={`hover:text-cyan-300 transition-colors ${
              pathname === '/business' ? 'text-cyan-300 font-semibold' : ''
            }`}
          >
            For Businesses
          </Link>
          <Link
            href="/business/dashboard"
            className={`flex items-center gap-1.5 hover:text-cyan-300 transition-colors ${
              pathname?.startsWith('/business/dashboard') ? 'text-cyan-300 font-semibold' : ''
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Staff Console</span>
          </Link>
          <Link
            href="/business/login"
            className="hover:text-white transition-colors text-xs font-mono text-white/50"
          >
            Sign In
          </Link>
        </nav>

        {/* Action CTAs */}
        <div className="hidden md:flex items-center gap-4">
          {/* Quick WhatsApp Simulator Trigger */}
          <button
            onClick={() => setIsWhatsAppOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-100 hover:bg-surface-50 border border-white/10 text-xs font-mono text-white/80 hover:text-cyan-300 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
            <span>WhatsApp Feed</span>
            {notifications.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#25D366] text-black text-[10px] font-bold flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>

          {/* Primary CTA */}
          <Link
            href="/join/city-care-clinic"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-bold text-xs uppercase tracking-wider font-mono shadow-[0_0_25px_rgba(0,240,255,0.3)] hover:shadow-[0_0_35px_rgba(0,240,255,0.5)] transition-all hover:scale-105 active:scale-95"
          >
            <span>JOIN A QUEUE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setIsWhatsAppOpen(true)}
            className="p-2 rounded-lg bg-surface-100 border border-white/10 text-[#25D366]"
            aria-label="WhatsApp updates"
          >
            <MessageSquare className="w-5 h-5" />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-surface-100 border border-white/10 text-white/80 hover:text-white"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0D14] border-b border-white/10 px-6 py-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <Link
            href="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-white/80 hover:text-cyan-300"
          >
            How It Works
          </Link>
          <Link
            href="/business"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-white/80 hover:text-cyan-300"
          >
            For Businesses
          </Link>
          <Link
            href="/business/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-white/80 hover:text-cyan-300"
          >
            Staff Console (Live Queue)
          </Link>
          <Link
            href="/business/login"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-mono text-white/50 hover:text-white"
          >
            Sign In to Business Portal
          </Link>

          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            <Link
              href="/join/city-care-clinic"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-xl bg-cyan-400 text-black font-bold text-center text-xs uppercase tracking-wider font-mono shadow-glow-cyan"
            >
              JOIN A QUEUE (DEMO CLINIC)
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
