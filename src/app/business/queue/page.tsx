'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useQueue } from '@/context/QueueContext';
import { QueueCanvas } from '@/components/3d/QueueCanvas';
import { HeroQueueScene } from '@/components/3d/HeroQueueScene';
import { ArrowLeft, Maximize2, Sparkles, Volume2, Clock } from 'lucide-react';

export default function WaitingRoomKioskPage() {
  const { business, services, counters, tickets, getServingTicket } = useQueue();
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeTickets = tickets.filter(
    (t) => t.status === 'SERVING' || t.status === 'CALLED' || t.status === 'WAITING'
  );
  const servingTicket = getServingTicket();
  const upNextTickets = activeTickets.filter((t) => t.status === 'WAITING').slice(0, 5);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#06080C] text-white flex flex-col p-6 sm:p-10 select-none overflow-hidden">
      {/* Top Telemetry Bar */}
      <div className="flex items-center justify-between pb-6 border-b border-white/10">
        <div className="flex items-center gap-4">
          <Link
            href="/business/dashboard"
            className="p-2.5 rounded-xl bg-surface-100 hover:bg-surface-50 border border-white/10 text-white/50 hover:text-white transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h1 className="text-xl sm:text-2xl font-black font-sans uppercase tracking-tight">
                {business.name}
              </h1>
            </div>
            <p className="text-xs font-mono text-cyan-400 mt-0.5">
              Live Waiting Room Kiosk Display
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-wider">
              {currentTime}
            </div>
            <div className="text-[11px] font-mono text-white/40">
              {new Date().toLocaleDateString(undefined, {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
              })}
            </div>
          </div>

          <button
            onClick={toggleFullScreen}
            className="p-3 rounded-2xl bg-surface-100 hover:bg-surface-50 border border-white/10 text-white/70 hover:text-white transition-colors"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Kiosk Layout: Counters Grid + 3D Canvas + Up Next */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 my-6 items-stretch">
        {/* Left Side: Counter Stations Now Serving */}
        <div className="lg:col-span-5 flex flex-col gap-6 justify-center">
          {counters.map((cnt, idx) => {
            const isCounter1 = idx === 0;
            const currentTokenNumber = isCounter1 && servingTicket ? servingTicket.token_number : 37;
            const currentCustomerName = isCounter1 && servingTicket
              ? servingTicket.user_name.replace(' (You)', '')
              : 'Vikram Sengupta';

            return (
              <div
                key={cnt.id}
                className="p-8 rounded-3xl bg-gradient-to-r from-surface-200 via-surface-100 to-surface-200 border-2 border-cyan-400/40 shadow-2xl relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                    <span className="font-mono text-xs uppercase tracking-widest text-cyan-300 font-bold">
                      {cnt.name}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-white/50">General Consultation</span>
                </div>

                <div className="flex items-baseline justify-between mt-2">
                  <div className="text-xs font-mono uppercase text-white/40">Token Number</div>
                  <div className="text-xs font-mono uppercase text-emerald-400">Please Proceed</div>
                </div>

                <div className="text-7xl sm:text-8xl font-mono font-black text-white tracking-tighter my-2 drop-shadow-[0_0_35px_rgba(0,240,255,0.4)]">
                  #{currentTokenNumber}
                </div>

                <div className="text-base text-white/80 font-medium truncate">
                  {currentCustomerName}
                </div>
              </div>
            );
          })}
        </div>

        {/* Center/Right: 3D Queue Visualizer & Up Next Lineup */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* 3D Living Queue */}
          <div className="flex-1 rounded-3xl overflow-hidden p-1 bg-gradient-to-b from-white/10 to-transparent shadow-2xl relative min-h-[300px]">
            <QueueCanvas
              cameraPosition={[0, 4.5, 14]}
              fov={42}
              tickets={activeTickets}
              showModeToggle={false}
            >
              <HeroQueueScene
                tickets={activeTickets}
                servingToken={servingTicket?.token_number}
              />
            </QueueCanvas>
          </div>

          {/* Up Next Bar */}
          <div className="p-5 rounded-2xl bg-surface-200 border border-white/10 flex items-center justify-between">
            <div className="text-xs font-mono uppercase tracking-widest text-white/50 mr-4">
              UP NEXT:
            </div>
            <div className="flex items-center gap-4 overflow-x-auto">
              {upNextTickets.map((t, i) => (
                <div
                  key={t.id}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-100 border border-white/10 font-mono"
                >
                  <span className="text-cyan-400 font-bold">#{t.token_number}</span>
                  <span className="text-xs text-white/70">{t.user_name.replace(' (You)', '')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Instructions Footer */}
      <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/40">
        <div className="flex items-center gap-3">
          <span className="text-cyan-400 font-bold">SCAN TO JOIN:</span>
          <span>Point your phone camera at the QR poster by the door or visit queueless.app</span>
        </div>
        <div>SMS & WhatsApp Turn Alerts Active</div>
      </div>
    </div>
  );
}
