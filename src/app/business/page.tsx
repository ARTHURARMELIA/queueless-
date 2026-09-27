'use client';

import React from 'react';
import Link from 'next/link';
import {
  Shield,
  Layers,
  Smartphone,
  QrCode,
  TrendingUp,
  Clock,
  Users,
  CheckCircle2,
  ArrowRight,
  Tv,
  MessageSquare,
  Activity,
} from 'lucide-react';

export default function BusinessOverviewPage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-6 mb-20">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-100 border border-white/10 text-cyan-400 text-xs font-mono">
          <span>OPERATIONAL EXCELLENCE FOR PHYSICAL VENUES</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight font-sans">
          Eliminate waiting room chaos with spatial intelligence.
        </h1>
        <p className="text-lg text-white/60 font-sans leading-relaxed">
          From multi-specialty clinics to salons and service centers, QUEUELESS empowers your team
          to streamline customer intake, cut perceived wait times, and deliver transparent updates via WhatsApp.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/business/login"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-glow-cyan"
          >
            Launch Staff Console
          </Link>
          <Link
            href="/business/qr"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-surface-100 hover:bg-surface-50 border border-white/10 text-white font-mono text-xs uppercase tracking-wider transition-colors"
          >
            Generate QR Posters
          </Link>
        </div>
      </div>

      {/* Feature Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="p-8 rounded-3xl bg-surface-200 border border-white/10 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
            <Smartphone className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white font-sans">Zero App Installation</h3>
          <p className="text-xs text-white/60 leading-relaxed font-sans">
            Customers simply scan a QR code at your door or counter with their default smartphone camera. No App Store or Play Store friction.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-surface-200 border border-white/10 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white font-sans">WhatsApp Milestone Pings</h3>
          <p className="text-xs text-white/60 leading-relaxed font-sans">
            Automatically dispatch personalized WhatsApp alerts when customers are 5 away, 2 away, and NEXT to arrive right on schedule.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-surface-200 border border-white/10 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
            <Tv className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white font-sans">Waiting Room TV Mode</h3>
          <p className="text-xs text-white/60 leading-relaxed font-sans">
            Broadcast a crisp, full-screen live kiosk queue on your waiting area monitors with high-contrast token numbers and counter rooms.
          </p>
        </div>
      </div>

      {/* Target Industries */}
      <div className="p-10 rounded-3xl bg-[#0B0F17] border border-white/10 mb-20">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl font-bold text-white font-sans">Built For Physical Operations</h2>
          <p className="text-xs text-white/50 font-mono mt-1">Wherever people wait in line, QUEUELESS brings order.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          <div className="p-5 rounded-2xl bg-surface-100 border border-white/5">
            <div className="text-2xl mb-2">🏥</div>
            <div className="text-sm font-bold text-white">Clinics & Labs</div>
            <div className="text-[11px] text-white/40 mt-1">OPD, Blood Tests</div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-100 border border-white/5">
            <div className="text-2xl mb-2">💇</div>
            <div className="text-sm font-bold text-white">Salons & Spas</div>
            <div className="text-[11px] text-white/40 mt-1">Stylists & Chairs</div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-100 border border-white/5">
            <div className="text-2xl mb-2">🔧</div>
            <div className="text-sm font-bold text-white">Service Centers</div>
            <div className="text-[11px] text-white/40 mt-1">Repairs & Devices</div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-100 border border-white/5">
            <div className="text-2xl mb-2">🏛️</div>
            <div className="text-sm font-bold text-white">Civic & Banking</div>
            <div className="text-[11px] text-white/40 mt-1">Counters & Tellers</div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold text-white">Ready to deploy QUEUELESS in your facility?</h3>
        <p className="text-xs text-white/50 font-mono">Test our live demo clinic with pre-populated queues and multiple counters.</p>
        <div className="pt-2">
          <Link
            href="/business/dashboard"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-cyan-400 text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-cyan-300 transition-colors shadow-glow-cyan"
          >
            <span>Open Staff Console</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
