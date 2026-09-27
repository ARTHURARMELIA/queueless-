'use client';

import React from 'react';
import Link from 'next/link';
import {
  QrCode,
  Smartphone,
  Coffee,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs uppercase font-mono tracking-widest text-cyan-400">
          The Zero-Wait Philosophy
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight font-sans">
          How QUEUELESS works.
        </h1>
        <p className="text-base sm:text-lg text-white/60 font-sans leading-relaxed">
          Physical waiting is an obsolete artifact of the paper ticket era. QUEUELESS replaces crowded
          waiting rooms with a digital queue and live 3D spatial intelligence.
        </p>
      </div>

      {/* The 4-Step Interactive Sequence */}
      <div className="space-y-8">
        {/* Step 1 */}
        <div className="p-8 sm:p-10 rounded-3xl bg-surface-200 border border-white/10 flex flex-col md:flex-row gap-8 items-start">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 font-mono font-black text-xl flex-shrink-0">
            01
          </div>
          <div className="space-y-3 flex-1">
            <div className="text-xs font-mono uppercase text-cyan-400 tracking-wider">
              Step One • Entry
            </div>
            <h3 className="text-2xl font-bold text-white font-sans">Scan the Business QR Code</h3>
            <p className="text-sm text-white/60 leading-relaxed font-sans">
              Every facility displays high-visibility QR posters at their entrance and reception desks.
              Customers open their native smartphone camera to scan the code. No app downloads, no account setup, and no app store delays.
            </p>
            <div className="pt-2">
              <span className="text-xs font-mono text-white/40">
                Direct URL: /join/city-care-clinic
              </span>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="p-8 sm:p-10 rounded-3xl bg-surface-200 border border-white/10 flex flex-col md:flex-row gap-8 items-start">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 font-mono font-black text-xl flex-shrink-0">
            02
          </div>
          <div className="space-y-3 flex-1">
            <div className="text-xs font-mono uppercase text-cyan-400 tracking-wider">
              Step Two • Registration
            </div>
            <h3 className="text-2xl font-bold text-white font-sans">Select Service & Verify WhatsApp</h3>
            <p className="text-sm text-white/60 leading-relaxed font-sans">
              Choose your procedure (e.g. General Consultation, Blood Test) with real-time wait estimates.
              Enter your full name and WhatsApp number. A fast 6-digit OTP verification ensures secure, non-spoofable ticket ownership.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="p-8 sm:p-10 rounded-3xl bg-surface-200 border border-white/10 flex flex-col md:flex-row gap-8 items-start">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 font-mono font-black text-xl flex-shrink-0">
            03
          </div>
          <div className="space-y-3 flex-1">
            <div className="text-xs font-mono uppercase text-cyan-400 tracking-wider">
              Step Three • Freedom
            </div>
            <h3 className="text-2xl font-bold text-white font-sans">Leave the Waiting Area</h3>
            <p className="text-sm text-white/60 leading-relaxed font-sans">
              You receive your unique token (e.g. #42) and an interactive 3D spatial representation of the queue.
              Leave the waiting room to grab coffee, run errands, or relax in your car while monitoring the live queue.
            </p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="p-8 sm:p-10 rounded-3xl bg-surface-200 border border-white/10 flex flex-col md:flex-row gap-8 items-start">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 font-mono font-black text-xl flex-shrink-0">
            04
          </div>
          <div className="space-y-3 flex-1">
            <div className="text-xs font-mono uppercase text-cyan-400 tracking-wider">
              Step Four • Punctual Return
            </div>
            <h3 className="text-2xl font-bold text-white font-sans">Receive WhatsApp Milestone Alerts</h3>
            <p className="text-sm text-white/60 leading-relaxed font-sans">
              Our automated notification engine pings you when you are 5 people away, 2 people away, and NEXT with counter/room designations.
              Return just in time to be served with zero idle time.
            </p>
          </div>
        </div>
      </div>

      {/* Customer Complete Journey Carousel */}
      <div className="p-8 sm:p-10 rounded-3xl bg-[#090D15] border border-white/10 text-center space-y-6">
        <h2 className="text-2xl font-bold text-white font-sans">Complete Patient Lifecycle</h2>
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-xl bg-surface-100 border border-white/10 text-white/80">
            1. SCAN QR
          </span>
          <span className="text-cyan-400">→</span>
          <span className="px-3 py-1.5 rounded-xl bg-surface-100 border border-white/10 text-white/80">
            2. PICK SERVICE
          </span>
          <span className="text-cyan-400">→</span>
          <span className="px-3 py-1.5 rounded-xl bg-surface-100 border border-white/10 text-white/80">
            3. WHATSAPP OTP
          </span>
          <span className="text-cyan-400">→</span>
          <span className="px-3 py-1.5 rounded-xl bg-surface-100 border border-white/10 text-white/80">
            4. TOKEN #42
          </span>
          <span className="text-cyan-400">→</span>
          <span className="px-3 py-1.5 rounded-xl bg-surface-100 border border-white/10 text-white/80">
            5. LEAVE ROOM
          </span>
          <span className="text-cyan-400">→</span>
          <span className="px-3 py-1.5 rounded-xl bg-surface-100 border border-white/10 text-white/80">
            6. "YOU'RE NEXT"
          </span>
          <span className="text-cyan-400">→</span>
          <span className="px-3 py-1.5 rounded-xl bg-surface-100 border border-white/10 text-white/80">
            7. SERVED
          </span>
          <span className="text-cyan-400">→</span>
          <span className="px-3 py-1.5 rounded-xl bg-surface-100 border border-white/10 text-emerald-300">
            8. FEEDBACK
          </span>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-8">
        <Link
          href="/join/city-care-clinic"
          className="inline-flex items-center gap-2 px-9 py-4 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-glow-cyan"
        >
          <span>Try Demo Experience (City Care Clinic)</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
