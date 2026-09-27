'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useQueue } from '@/context/QueueContext';
import { TokenBadge } from '@/components/ui/TokenBadge';
import { StatusPill } from '@/components/ui/StatusPill';
import { formatElapsedTime } from '@/lib/waitTimeEngine';
import {
  Users,
  Clock,
  Play,
  CheckCircle2,
  SkipForward,
  RotateCcw,
  Plus,
  Tv,
  Settings,
  BarChart3,
  QrCode,
  UserCheck,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export default function StaffDashboardPage() {
  const {
    business,
    services,
    counters,
    staff,
    tickets,
    callNext,
    startServing,
    completeService,
    skipCustomer,
    recallCustomer,
    joinQueue,
  } = useQueue();

  const [selectedServiceId, setSelectedServiceId] = useState<string>(services[0]?.id || 'srv-gen-consult');
  const [selectedCounterId, setSelectedCounterId] = useState<string>(counters[0]?.id || 'cnt-01');
  const [elapsedTime, setElapsedTime] = useState('00:00');

  const selectedService = services.find((s) => s.id === selectedServiceId) || services[0];
  const selectedCounter = counters.find((c) => c.id === selectedCounterId) || counters[0];

  // Active tickets for this service
  const serviceTickets = tickets.filter((t) => t.service_id === selectedServiceId);
  const servingCustomer = serviceTickets.find((t) => t.status === 'SERVING');
  const calledCustomer = serviceTickets.find((t) => t.status === 'CALLED');
  const waitingCustomers = serviceTickets.filter((t) => t.status === 'WAITING');
  const skippedCustomers = serviceTickets.filter((t) => t.status === 'SKIPPED');
  const completedToday = serviceTickets.filter((t) => t.status === 'COMPLETED');

  // Elapsed stopwatch timer for current serving customer
  useEffect(() => {
    const timer = setInterval(() => {
      if (servingCustomer?.service_started_at) {
        setElapsedTime(formatElapsedTime(servingCustomer.service_started_at));
      } else {
        setElapsedTime('00:00');
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [servingCustomer]);

  const handleCallNext = () => {
    callNext(selectedServiceId, selectedCounterId);
  };

  const handleSimulateNewCustomer = () => {
    const randomNames = ['Arjun Nair', 'Kavita Rao', 'Manish Gupta', 'Meera Iyer', 'Rohan Sen'];
    const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
    const randomPhone = `+91 98${Math.floor(10000000 + Math.random() * 90000000)}`;
    joinQueue(selectedServiceId, randomName, randomPhone);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Business Header & Sub-Nav */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-white/10 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
              Live Queue Console
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-sans mt-0.5">
            {business.name}
          </h1>
          <p className="text-xs text-white/50 font-mono">
            Desk: {selectedCounter.name} • Assigned: Dr. Shah
          </p>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/business/queue"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-100 hover:bg-surface-50 border border-white/10 text-xs font-mono text-white/80 hover:text-cyan-300 transition-colors"
          >
            <Tv className="w-3.5 h-3.5 text-cyan-400" />
            <span>TV Kiosk Display</span>
          </Link>
          <Link
            href="/business/analytics"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-100 hover:bg-surface-50 border border-white/10 text-xs font-mono text-white/80 hover:text-cyan-300 transition-colors"
          >
            <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Analytics</span>
          </Link>
          <Link
            href="/business/services"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-100 hover:bg-surface-50 border border-white/10 text-xs font-mono text-white/80 hover:text-cyan-300 transition-colors"
          >
            <span>Services</span>
          </Link>
          <Link
            href="/business/staff"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-100 hover:bg-surface-50 border border-white/10 text-xs font-mono text-white/80 hover:text-cyan-300 transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Staff</span>
          </Link>
          <Link
            href="/business/qr"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-100 hover:bg-surface-50 border border-white/10 text-xs font-mono text-white/80 hover:text-cyan-300 transition-colors"
          >
            <QrCode className="w-3.5 h-3.5 text-cyan-400" />
            <span>QR Code</span>
          </Link>
          <Link
            href="/business/settings"
            className="p-2 rounded-xl bg-surface-100 hover:bg-surface-50 border border-white/10 text-white/60 hover:text-white transition-colors"
            title="Business Settings"
          >
            <Settings className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Selectors Bar: Service & Counter Pickers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-surface-200 border border-white/10 mb-8">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-white/40 uppercase">Service:</span>
            <select
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-surface-100 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
            >
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.average_duration}m avg)
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-white/40 uppercase">Desk:</span>
            <select
              value={selectedCounterId}
              onChange={(e) => setSelectedCounterId(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-surface-100 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
            >
              {counters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleSimulateNewCustomer}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 text-cyan-300 font-mono text-xs transition-colors"
          title="Add a simulated customer to the queue"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Simulate Customer Join</span>
        </button>
      </div>

      {/* Main Queue Console Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Now Serving Spotlight & Action Triggers */}
        <div className="lg:col-span-6 space-y-6">
          {/* NOW SERVING CARD */}
          <div className="bg-[#0C111C] border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                NOW SERVING AT {selectedCounter.name.toUpperCase()}
              </span>
              <span className="text-xs font-mono text-white/50">{selectedService.name}</span>
            </div>

            {servingCustomer ? (
              <div className="py-6 space-y-6">
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-5xl font-mono font-black text-white">
                      #{servingCustomer.token_number}
                    </div>
                    <div className="text-lg font-bold text-white mt-1">
                      {servingCustomer.user_name.replace(' (You)', '')}
                    </div>
                    <div className="text-xs font-mono text-white/50">
                      WhatsApp: {servingCustomer.whatsapp_number}
                    </div>
                  </div>

                  {/* Stopwatch */}
                  <div className="text-right">
                    <div className="text-xs font-mono text-white/40 uppercase">Elapsed Time</div>
                    <div className="text-3xl font-mono font-black text-emerald-400 mt-1">
                      {elapsedTime}
                    </div>
                    <div className="text-[10px] font-mono text-white/40">
                      Started: {new Date(servingCustomer.service_started_at || servingCustomer.joined_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
                  <button
                    onClick={() => completeService(servingCustomer.id)}
                    className="py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>COMPLETE</span>
                  </button>

                  <button
                    onClick={() => skipCustomer(servingCustomer.id)}
                    className="py-3.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 font-mono font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                  >
                    <SkipForward className="w-4 h-4" />
                    <span>SKIP</span>
                  </button>

                  <button
                    onClick={handleCallNext}
                    className="py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-glow-cyan flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-4 h-4 fill-black" />
                    <span>NEXT</span>
                  </button>
                </div>
              </div>
            ) : calledCustomer ? (
              <div className="py-8 text-center space-y-4">
                <div className="text-xs font-mono uppercase text-cyan-400">Customer Called to Desk</div>
                <div className="text-5xl font-mono font-black text-cyan-300">
                  #{calledCustomer.token_number}
                </div>
                <div className="text-sm font-bold text-white">
                  {calledCustomer.user_name.replace(' (You)', '')}
                </div>
                <p className="text-xs text-white/50 font-mono">
                  WhatsApp call notification dispatched. Waiting for arrival at {selectedCounter.name}.
                </p>

                <div className="flex gap-3 justify-center pt-2">
                  <button
                    onClick={() => startServing(calledCustomer.id)}
                    className="px-6 py-3 rounded-xl bg-emerald-500 text-black font-mono font-bold text-xs uppercase hover:bg-emerald-400 transition-colors shadow-lg"
                  >
                    Start Service Now
                  </button>
                  <button
                    onClick={() => skipCustomer(calledCustomer.id)}
                    className="px-6 py-3 rounded-xl bg-surface-100 border border-white/10 text-white font-mono text-xs hover:bg-surface-50"
                  >
                    Skip (No Show)
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-surface-100 border border-white/10 flex items-center justify-center mx-auto text-white/30">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="text-sm font-bold text-white">Counter is currently idle</div>
                <p className="text-xs text-white/40 font-mono max-w-xs mx-auto">
                  {waitingCustomers.length > 0
                    ? `${waitingCustomers.length} customers are waiting in queue.`
                    : 'No customers are currently waiting for this service.'}
                </p>

                {waitingCustomers.length > 0 && (
                  <button
                    onClick={handleCallNext}
                    className="px-8 py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-mono font-extrabold text-xs uppercase tracking-wider transition-all shadow-glow-cyan"
                  >
                    CALL NEXT CUSTOMER (#{waitingCustomers[0].token_number})
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Skipped Customers section with 1-click RECALL */}
          {skippedCustomers.length > 0 && (
            <div className="bg-surface-200 border border-amber-500/30 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Missed / Skipped Customers ({skippedCustomers.length})
                </span>
                <span className="text-[10px] text-white/40 font-mono">Available for recall</span>
              </div>

              <div className="space-y-2">
                {skippedCustomers.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-100 border border-white/5"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-amber-300">
                          #{ticket.token_number}
                        </span>
                        <span className="text-xs text-white font-medium">
                          {ticket.user_name.replace(' (You)', '')}
                        </span>
                      </div>
                      <div className="text-[10px] text-white/40 font-mono mt-0.5">
                        Skipped at {new Date(ticket.skipped_at || ticket.joined_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>

                    <button
                      onClick={() => recallCustomer(ticket.id)}
                      className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-mono font-bold text-xs uppercase tracking-wider transition-colors shadow-sm flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>RECALL</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: UP NEXT Waiting Queue List */}
        <div className="lg:col-span-6 bg-surface-200 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-white/5">
            <div>
              <h2 className="text-lg font-bold text-white font-sans">
                Up Next in Line ({waitingCustomers.length})
              </h2>
              <p className="text-xs text-white/50 font-mono mt-0.5">
                Waiting room queue ordered by arrival sequence
              </p>
            </div>
            <div className="text-xs font-mono text-cyan-400">
              Completed Today: {completedToday.length}
            </div>
          </div>

          {waitingCustomers.length === 0 ? (
            <div className="text-center py-16">
              <Users className="w-8 h-8 text-white/20 mx-auto mb-2" />
              <div className="text-sm font-medium text-white/60">No customers waiting</div>
              <p className="text-xs text-white/40 font-mono mt-1">
                Queue is completely clear for {selectedService.name}.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {waitingCustomers.map((ticket, index) => {
                const isNext = index === 0;
                const estWait = (index + 1) * selectedService.average_duration;

                return (
                  <div
                    key={ticket.id}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                      isNext
                        ? 'bg-cyan-950/20 border-cyan-400/50 shadow-md'
                        : 'bg-surface-100 border-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl font-mono font-bold flex items-center justify-center text-sm ${
                          isNext
                            ? 'bg-cyan-400 text-black shadow-glow-cyan'
                            : 'bg-white/10 text-white'
                        }`}
                      >
                        #{ticket.token_number}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white">
                            {ticket.user_name.replace(' (You)', '')}
                          </span>
                          {isNext && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-400/20 text-cyan-300 font-bold uppercase">
                              NEXT
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-white/40 font-mono mt-0.5">
                          {ticket.whatsapp_number} • Pos: {index + 1}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-white">~{estWait} min</div>
                      <div className="text-[10px] font-mono text-white/40">Est. wait</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
