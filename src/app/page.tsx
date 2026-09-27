'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQueue } from '@/context/QueueContext';
import { QueueCanvas } from '@/components/3d/QueueCanvas';
import { HeroQueueScene } from '@/components/3d/HeroQueueScene';
import { Analytics3DChart } from '@/components/3d/Analytics3DChart';
import { TokenBadge } from '@/components/ui/TokenBadge';
import { StatusPill } from '@/components/ui/StatusPill';
import {
  ArrowRight,
  Sparkles,
  QrCode,
  Smartphone,
  Coffee,
  CheckCircle2,
  Clock,
  Users,
  ShieldCheck,
  TrendingUp,
  RotateCcw,
  Zap,
  Play,
  Layers,
  Building2,
  MessageSquare,
  BarChart3,
} from 'lucide-react';
import { HourlyAnalytics } from '@/types';

export default function HomePage() {
  const {
    tickets,
    getServingTicket,
    simulateNext,
    resetDemoData,
    hourlyAnalytics,
    setIsWhatsAppOpen,
  } = useQueue();

  const [selectedAnalyticsHour, setSelectedAnalyticsHour] = useState<HourlyAnalytics | null>(
    hourlyAnalytics[9] // 6 PM default
  );

  const servingTicket = getServingTicket();
  const userTicket = tickets.find((t) => t.token_number === 42) || tickets[tickets.length - 1];

  // Calculate people ahead of user ticket #42
  const activeTickets = tickets.filter(
    (t) => t.status === 'WAITING' || t.status === 'CALLED' || t.status === 'SERVING'
  );
  const userIndex = activeTickets.findIndex((t) => t.id === userTicket?.id);
  const peopleAhead = Math.max(0, userIndex);

  return (
    <div className="flex flex-col min-h-screen">
      {/* =========================================================================
          1. HERO SECTION
         ========================================================================= */}
      <section className="relative pt-12 pb-24 overflow-hidden border-b border-white/5">
        {/* Subtle radial ambient gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-cyan-500/10 via-blue-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-100 border border-white/10 text-cyan-300 text-xs font-mono tracking-wider shadow-inner">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>THE FIRST 3D SPATIAL QUEUE PLATFORM</span>
            </div>

            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white leading-[1.08] font-sans">
              Your time shouldn't be spent{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-white">
                waiting.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-white/60 font-normal leading-relaxed max-w-2xl mx-auto font-sans">
              Join a queue digitally, leave the waiting room, and return when it's actually your turn.
              Track your real-time 3D position and get milestone alerts on WhatsApp.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/join/city-care-clinic"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-sm uppercase tracking-wider font-mono shadow-[0_0_35px_rgba(0,240,255,0.4)] hover:shadow-[0_0_50px_rgba(0,240,255,0.6)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <span>JOIN A QUEUE</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="#how-it-works"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-surface-100 hover:bg-surface-50 border border-white/10 hover:border-white/20 text-white font-mono text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <span>SEE HOW IT WORKS</span>
              </Link>
            </div>
          </div>

          {/* 3D Dynamic Hero Environment */}
          <div className="mt-14 max-w-5xl mx-auto">
            <div className="h-[460px] sm:h-[540px] w-full rounded-3xl p-1 bg-gradient-to-b from-white/10 to-transparent shadow-2xl relative">
              <QueueCanvas tickets={tickets} userTokenNumber={42} cameraPosition={[0, 4.2, 14]} fov={40}>
                <HeroQueueScene
                  tickets={tickets}
                  servingToken={servingTicket?.token_number}
                />
              </QueueCanvas>
            </div>

            <div className="flex items-center justify-between text-xs text-white/40 font-mono px-4 mt-3">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Live 3D WebGL Mesh • Mouse Interactive
              </span>
              <span>Tokens #36 to #42 in line</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. LIVE DEMO SECTION ("See the queue move")
         ========================================================================= */}
      <section className="py-20 bg-[#0A0D14] border-b border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-cyan-400">
                Interactive Simulation
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight mt-2 font-sans">
                See the queue move.
              </h2>
              <p className="text-white/60 text-base mt-2 max-w-xl font-sans">
                Advance the simulated queue to witness smooth 3D token migration, real-time ETA recalculation,
                and instant WhatsApp milestone triggers.
              </p>
            </div>

            {/* Simulation Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => simulateNext()}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold text-xs uppercase tracking-wider font-mono shadow-[0_0_30px_rgba(16,185,129,0.35)] transition-all hover:scale-105 active:scale-95"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>SIMULATE NEXT CUSTOMER</span>
              </button>

              <button
                onClick={resetDemoData}
                className="p-3.5 rounded-xl bg-surface-100 hover:bg-surface-50 border border-white/10 text-white/70 hover:text-white transition-colors"
                title="Reset Demo Data"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Live Simulated Telemetry Dashboard Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {/* Currently Serving */}
            <div className="p-6 rounded-2xl bg-surface-100 border border-emerald-500/30 relative overflow-hidden">
              <div className="text-xs font-mono uppercase text-emerald-400 tracking-wider">
                Currently Serving
              </div>
              <div className="text-4xl font-mono font-black text-white mt-2">
                {servingTicket ? `#${servingTicket.token_number}` : 'None'}
              </div>
              <div className="text-xs text-white/50 mt-1 truncate">
                {servingTicket ? servingTicket.user_name.replace(' (You)', '') : 'Desk idle'}
              </div>
            </div>

            {/* Your Position */}
            <div className="p-6 rounded-2xl bg-surface-100 border border-amber-500/30 relative overflow-hidden">
              <div className="text-xs font-mono uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                <span>Your Token</span>
                <span className="text-[10px] px-1 rounded bg-amber-400/20 text-amber-300 font-bold">
                  YOU
                </span>
              </div>
              <div className="text-4xl font-mono font-black text-amber-300 mt-2">
                #{userTicket?.token_number || 42}
              </div>
              <div className="text-xs text-white/50 mt-1">Rahul Sharma</div>
            </div>

            {/* People Ahead */}
            <div className="p-6 rounded-2xl bg-surface-100 border border-white/10">
              <div className="text-xs font-mono uppercase text-white/50 tracking-wider">
                People Ahead
              </div>
              <div className="text-4xl font-mono font-black text-white mt-2">
                {peopleAhead}
              </div>
              <div className="text-xs text-cyan-400 font-mono mt-1">
                {peopleAhead === 0 ? 'Your turn next!' : `${peopleAhead} ahead in line`}
              </div>
            </div>

            {/* Estimated Wait */}
            <div className="p-6 rounded-2xl bg-surface-100 border border-white/10">
              <div className="text-xs font-mono uppercase text-white/50 tracking-wider">
                Estimated Wait
              </div>
              <div className="text-4xl font-mono font-black text-white mt-2">
                ~{peopleAhead * 8} min
              </div>
              <div className="text-xs text-white/50 font-mono mt-1">
                Avg 8m / consultation
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. HOW IT WORKS (4 steps)
         ========================================================================= */}
      <section id="how-it-works" className="py-24 border-b border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase font-mono tracking-widest text-cyan-400">
              Frictionless Workflow
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight mt-2 font-sans">
              How it works.
            </h2>
            <p className="text-white/60 text-base mt-3 font-sans">
              No native apps. No paper tickets. Just a QR code, your browser, and WhatsApp.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Step 01 */}
            <div className="p-8 rounded-3xl bg-surface-200 border border-white/10 hover:border-cyan-400/40 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-3xl font-black text-white/20 group-hover:text-cyan-400 transition-colors">
                  01
                </span>
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
                  <QrCode className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 font-sans uppercase">SCAN</h3>
              <p className="text-white/60 text-sm leading-relaxed font-sans">
                Scan the business QR code with your phone camera or visit their custom link.
              </p>
            </div>

            {/* Step 02 */}
            <div className="p-8 rounded-3xl bg-surface-200 border border-white/10 hover:border-cyan-400/40 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-3xl font-black text-white/20 group-hover:text-cyan-400 transition-colors">
                  02
                </span>
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
                  <Smartphone className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 font-sans uppercase">JOIN</h3>
              <p className="text-white/60 text-sm leading-relaxed font-sans">
                Select your service, enter your name and WhatsApp number, and verify with a 6-digit code.
              </p>
            </div>

            {/* Step 03 */}
            <div className="p-8 rounded-3xl bg-surface-200 border border-white/10 hover:border-cyan-400/40 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-3xl font-black text-white/20 group-hover:text-cyan-400 transition-colors">
                  03
                </span>
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
                  <Coffee className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 font-sans uppercase">LEAVE</h3>
              <p className="text-white/60 text-sm leading-relaxed font-sans">
                Leave the congested waiting room. Grab coffee or run errands while tracking the 3D queue remotely.
              </p>
            </div>

            {/* Step 04 */}
            <div className="p-8 rounded-3xl bg-surface-200 border border-white/10 hover:border-cyan-400/40 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-3xl font-black text-white/20 group-hover:text-cyan-400 transition-colors">
                  04
                </span>
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 font-sans uppercase">RETURN</h3>
              <p className="text-white/60 text-sm leading-relaxed font-sans">
                Receive proactive WhatsApp milestone notifications at 5 away, 2 away, and NEXT to return just in time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. CUSTOMER EXPERIENCE SECTION
         ========================================================================= */}
      <section className="py-24 bg-[#0A0D14] border-b border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <span className="text-xs uppercase font-mono tracking-widest text-cyan-400">
                Customer Experience
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight font-sans">
                The queue moves. You don't have to.
              </h2>
              <p className="text-white/60 text-base leading-relaxed font-sans">
                Physical waiting rooms are noisy, crowded, and stressful. QUEUELESS frees your customers to spend their waiting time wherever they want.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mt-1 flex-shrink-0">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm font-sans">No App Download Needed</h4>
                    <p className="text-white/50 text-xs">Works instantly inside mobile Safari, Chrome, Edge, and Android browsers.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mt-1 flex-shrink-0">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm font-sans">Spatial 3D Queue Track</h4>
                    <p className="text-white/50 text-xs">A living 3D environment shows your position gliding toward the service desk in real time.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mt-1 flex-shrink-0">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm font-sans">Dynamic Wait Time Engine</h4>
                    <p className="text-white/50 text-xs">Accurate calculated estimates based on active desks and historical service velocities.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/queue/q-tk-42-rahul-you-a1b2"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-100 hover:bg-surface-50 border border-white/10 hover:border-cyan-400/50 text-cyan-300 font-mono text-xs uppercase tracking-wider transition-all"
                >
                  <span>Preview Live Customer Ticket #42</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Interactive Preview Mockup Card */}
            <div className="relative">
              <div className="w-full bg-[#0D111A] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
                  <div>
                    <div className="text-xs text-white/50 font-mono">CITY CARE CLINIC</div>
                    <div className="text-lg font-bold text-white">General Consultation</div>
                  </div>
                  <StatusPill status="WAITING" />
                </div>

                <div className="text-center py-4">
                  <div className="text-xs uppercase tracking-widest text-amber-400 font-mono mb-2">
                    YOUR TICKET
                  </div>
                  <TokenBadge tokenNumber={42} size="hero" isUser={true} />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10">
                  <div className="text-center">
                    <div className="text-xs text-white/40 font-mono">CURRENTLY SERVING</div>
                    <div className="text-2xl font-mono font-bold text-emerald-400 mt-1">
                      {servingTicket ? `#${servingTicket.token_number}` : '#36'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-white/40 font-mono">PEOPLE AHEAD</div>
                    <div className="text-2xl font-mono font-bold text-white mt-1">
                      {peopleAhead}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. BUSINESS EXPERIENCE SECTION
         ========================================================================= */}
      <section className="py-24 border-b border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Visual Showcase Card */}
            <div className="order-2 lg:order-1 bg-surface-200 border border-white/10 rounded-3xl p-6 sm:p-8">
              <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="font-mono text-xs uppercase text-white/60">
                    Live Staff Console • Counter 1
                  </span>
                </div>
                <span className="text-xs font-mono text-emerald-400">Dr. Shah (Active)</span>
              </div>

              {/* Now Serving Spotlight */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/30 to-surface-100 border border-emerald-500/40 mb-6">
                <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-400">
                  Now Serving Customer
                </div>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-3xl font-mono font-black text-white">
                    {servingTicket ? `#${servingTicket.token_number}` : '#36'}
                  </span>
                  <span className="text-xs font-mono text-white/50">Started: 6 mins ago</span>
                </div>
                <div className="text-sm text-white/80 font-medium mt-1">
                  {servingTicket?.user_name.replace(' (You)', '') || 'Ananya Verma'}
                </div>
              </div>

              {/* Action Buttons Mock */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  onClick={() => simulateNext()}
                  className="py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs uppercase tracking-wider transition-colors shadow-lg"
                >
                  Call Next Customer
                </button>
                <Link
                  href="/business/dashboard"
                  className="py-3 px-4 rounded-xl bg-surface-100 hover:bg-surface-50 border border-white/10 text-white font-mono text-xs uppercase tracking-wider text-center transition-colors"
                >
                  Full Console
                </Link>
              </div>

              {/* Up Next Mini List */}
              <div className="space-y-2">
                <div className="text-[11px] font-mono text-white/40 uppercase">Queue Lineup</div>
                {activeTickets.slice(1, 4).map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-surface-100 border border-white/5 text-xs font-mono"
                  >
                    <span className="font-bold text-white">#{ticket.token_number}</span>
                    <span className="text-white/60">{ticket.user_name.replace(' (You)', '')}</span>
                    <span className="text-[10px] text-white/40">{ticket.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="order-1 lg:order-2 space-y-6">
              <span className="text-xs uppercase font-mono tracking-widest text-cyan-400">
                Staff & Operations
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight font-sans">
                Built for real-world waiting.
              </h2>
              <p className="text-white/60 text-base leading-relaxed font-sans">
                Clinics, diagnostic labs, salons, and repair centers use QUEUELESS to eliminate crowd tension and give staff full command over daily customer flow.
              </p>

              <div className="grid grid-cols-2 gap-6 pt-2">
                <div className="space-y-1">
                  <div className="text-2xl font-mono font-bold text-cyan-400">40%</div>
                  <div className="text-xs text-white/80 font-semibold">Reduced Congestion</div>
                  <div className="text-[11px] text-white/40">Waiting rooms stay calm and empty.</div>
                </div>

                <div className="space-y-1">
                  <div className="text-2xl font-mono font-bold text-cyan-400">0%</div>
                  <div className="text-xs text-white/80 font-semibold">App Friction</div>
                  <div className="text-[11px] text-white/40">100% web browser and QR based.</div>
                </div>

                <div className="space-y-1">
                  <div className="text-2xl font-mono font-bold text-cyan-400">Multi</div>
                  <div className="text-xs text-white/80 font-semibold">Counter Support</div>
                  <div className="text-[11px] text-white/40">Distribute queues across rooms and desks.</div>
                </div>

                <div className="space-y-1">
                  <div className="text-2xl font-mono font-bold text-cyan-400">Auto</div>
                  <div className="text-xs text-white/80 font-semibold">WhatsApp Milestones</div>
                  <div className="text-[11px] text-white/40">Automated reminder pings keep queue fluid.</div>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <Link
                  href="/business/dashboard"
                  className="px-6 py-3 rounded-xl bg-cyan-400 text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-cyan-300 transition-colors shadow-glow-cyan"
                >
                  Explore Staff Console
                </Link>
                <Link
                  href="/business/qr"
                  className="px-6 py-3 rounded-xl bg-surface-100 border border-white/10 hover:border-white/20 text-white font-mono text-xs uppercase tracking-wider transition-colors"
                >
                  Printable QR
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. WHATSAPP NOTIFICATIONS SHOWCASE
         ========================================================================= */}
      <section className="py-24 bg-[#0A0D14] border-b border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase font-mono tracking-widest text-[#25D366]">
              Milestone Alerts
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight mt-2 font-sans">
              Know when to come back.
            </h2>
            <p className="text-white/60 text-base mt-3 font-sans">
              No spam. No notifications on every advance. Only high-value milestone updates that tell you exactly when to make your way back.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Joined Milestone */}
            <div className="p-6 rounded-3xl bg-surface-200 border border-white/10 relative">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                  Milestone 01 • JOINED
                </span>
                <span className="text-[10px] text-white/40 font-mono">10:30 AM</span>
              </div>
              <div className="bg-[#1F2C34] rounded-2xl p-4 text-xs font-mono text-white/90 space-y-2 border border-white/5">
                <div className="text-[#25D366] font-bold">QUEUELESS | City Care Clinic</div>
                <p>Hi Rahul 👋 Your ticket is active.</p>
                <div className="text-cyan-300">🎟 Token: #42</div>
                <div>👥 5 people ahead • ⏱ ~28 mins</div>
                <div className="text-[10px] text-white/50 pt-2 border-t border-white/10">
                  👉 Tap tracking link to follow live 3D line
                </div>
              </div>
            </div>

            {/* 2 Away Milestone */}
            <div className="p-6 rounded-3xl bg-surface-200 border border-amber-500/30 relative">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">
                  Milestone 02 • 2 PEOPLE AWAY
                </span>
                <span className="text-[10px] text-white/40 font-mono">10:52 AM</span>
              </div>
              <div className="bg-[#1F2C34] rounded-2xl p-4 text-xs font-mono text-white/90 space-y-2 border border-white/5">
                <div className="text-[#25D366] font-bold">QUEUELESS | City Care Clinic</div>
                <p className="text-amber-300 font-semibold">⚠️ Please start making your way back.</p>
                <div>Only 2 people ahead for General Consultation.</div>
                <div className="text-[10px] text-white/50 pt-2 border-t border-white/10">
                  👉 Head to Counter 1 (Room 101)
                </div>
              </div>
            </div>

            {/* Called Milestone */}
            <div className="p-6 rounded-3xl bg-surface-200 border border-emerald-500/40 relative">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
                  Milestone 03 • NOW CALLED
                </span>
                <span className="text-[10px] text-white/40 font-mono">11:04 AM</span>
              </div>
              <div className="bg-[#1F2C34] rounded-2xl p-4 text-xs font-mono text-white/90 space-y-2 border border-white/5">
                <div className="text-[#25D366] font-bold">QUEUELESS | City Care Clinic</div>
                <p className="text-emerald-300 font-bold">🔔 Your token #42 is being called now!</p>
                <div>Please proceed immediately to Counter 1.</div>
                <div className="text-[10px] text-white/50 pt-2 border-t border-white/10">
                  👉 View desk directions & instructions
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <button
              onClick={() => setIsWhatsAppOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] font-mono text-xs uppercase tracking-wider hover:bg-[#25D366]/30 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Open Simulated WhatsApp Phone Drawer</span>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. 3D ANALYTICS SECTION (#48: 3D hourly columns)
         ========================================================================= */}
      <section className="py-24 border-b border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-cyan-400">
                Data Intelligence
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight mt-2 font-sans">
                Every queue has a pattern.
              </h2>
              <p className="text-white/60 text-base mt-2 max-w-xl font-sans">
                Inspect 3D hourly volume bars. Tap or hover over any pillar to analyze customer counts, wait durations, and peak bottlenecks.
              </p>
            </div>

            {selectedAnalyticsHour && (
              <div className="p-4 rounded-2xl bg-surface-100 border border-cyan-500/30 flex items-center gap-6">
                <div>
                  <div className="text-[10px] font-mono text-cyan-400 uppercase">Selected Hour</div>
                  <div className="text-xl font-mono font-bold text-white">
                    {selectedAnalyticsHour.hour}
                  </div>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div>
                  <div className="text-[10px] font-mono text-white/50 uppercase">Served</div>
                  <div className="text-xl font-mono font-bold text-white">
                    {selectedAnalyticsHour.customersServed}
                  </div>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div>
                  <div className="text-[10px] font-mono text-white/50 uppercase">Avg Wait</div>
                  <div className="text-xl font-mono font-bold text-white">
                    ~{selectedAnalyticsHour.avgWaitMinutes}m
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3D Analytics Canvas */}
          <div className="h-[400px] w-full rounded-3xl p-1 bg-gradient-to-b from-white/10 to-transparent shadow-2xl relative">
            <QueueCanvas
              cameraPosition={[0, 4, 12]}
              fov={45}
              showModeToggle={false}
              enableOrbit={false}
            >
              <Analytics3DChart
                data={hourlyAnalytics}
                selectedHour={selectedAnalyticsHour}
                onSelectHour={(hour) => setSelectedAnalyticsHour(hour)}
              />
            </QueueCanvas>
          </div>

          <div className="flex items-center justify-between text-xs text-white/40 font-mono px-4 mt-3">
            <span>Hover or click 3D columns to view hourly queue metrics</span>
            <Link
              href="/business/analytics"
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
            >
              <span>View Full Business Analytics</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. FINAL CALL TO ACTION (CTA)
         ========================================================================= */}
      <section className="py-28 relative overflow-hidden text-center">
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/20 via-[#08090C] to-[#08090C] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <span className="text-xs uppercase font-mono tracking-widest text-cyan-400">
            ZERO WAITING REVOLUTION
          </span>

          <h2 className="text-4xl sm:text-7xl font-extrabold text-white tracking-tight leading-tight font-sans">
            Stop making people wait.
          </h2>

          <p className="text-lg sm:text-2xl text-white/70 font-light font-sans max-w-2xl mx-auto">
            Give your customers back their time. Elevate your physical location into a modern spatial experience.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link
              href="/join/city-care-clinic"
              className="w-full sm:w-auto px-9 py-4 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-sm uppercase tracking-wider font-mono shadow-[0_0_40px_rgba(0,240,255,0.4)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <span>JOIN A QUEUE (DEMO)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/business"
              className="w-full sm:w-auto px-9 py-4 rounded-2xl bg-surface-100 hover:bg-surface-50 border border-white/10 hover:border-white/20 text-white font-mono text-sm uppercase tracking-wider transition-all"
            >
              FOR BUSINESSES
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
