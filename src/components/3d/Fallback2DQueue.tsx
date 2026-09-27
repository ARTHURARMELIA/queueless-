'use client';

import React from 'react';
import { QueueTicket } from '@/types';
import { CheckCircle2, User, ArrowRight, Sparkles } from 'lucide-react';

interface Fallback2DQueueProps {
  tickets: QueueTicket[];
  userTokenNumber?: number;
  onSelectToken?: (ticket: QueueTicket) => void;
}

export const Fallback2DQueue: React.FC<Fallback2DQueueProps> = ({
  tickets,
  userTokenNumber,
  onSelectToken,
}) => {
  const activeTickets = tickets.filter(
    (t) => t.status === 'SERVING' || t.status === 'CALLED' || t.status === 'WAITING'
  );

  return (
    <div className="w-full bg-[#0D0F14] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-white/5 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs uppercase tracking-widest text-white/50 font-mono">
            2D Linear Queue Track
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-white/60">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" /> Serving
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" /> Next / Called
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> You
          </div>
        </div>
      </div>

      {/* Queue Track Flow */}
      <div className="flex flex-col gap-6">
        {/* Service Counter Desk Station */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-surface-200 to-surface-200 border border-cyan-500/30">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 font-bold">
            01
          </div>
          <div>
            <div className="text-xs text-cyan-400 font-mono uppercase tracking-wider">
              Service Station
            </div>
            <div className="text-white font-semibold text-sm">Counter 1 • Room 101</div>
          </div>
          <div className="ml-auto flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs border border-cyan-500/20 font-mono">
            Active Desk
          </div>
        </div>

        {/* Tokens Track */}
        <div className="flex items-center gap-3 overflow-x-auto py-4 px-2 scrollbar-thin scrollbar-thumb-white/10">
          {activeTickets.length === 0 ? (
            <div className="text-center py-8 w-full text-white/40 text-sm">
              The queue is currently empty.
            </div>
          ) : (
            activeTickets.map((ticket, index) => {
              const isUser = ticket.token_number === userTokenNumber;
              const isServing = ticket.status === 'SERVING';
              const isCalled = ticket.status === 'CALLED';

              let borderColor = 'border-white/10';
              let bgColor = 'bg-surface-100';
              let badgeColor = 'bg-white/10 text-white/70';

              if (isUser) {
                borderColor = 'border-amber-400/80 shadow-[0_0_20px_rgba(251,191,36,0.3)]';
                bgColor = 'bg-amber-950/30';
                badgeColor = 'bg-amber-400 text-black font-bold';
              } else if (isServing) {
                borderColor = 'border-emerald-500/80 shadow-[0_0_20px_rgba(16,185,129,0.3)]';
                bgColor = 'bg-emerald-950/30';
                badgeColor = 'bg-emerald-400 text-black font-bold';
              } else if (isCalled) {
                borderColor = 'border-cyan-400/80 shadow-[0_0_20px_rgba(6,182,212,0.3)]';
                bgColor = 'bg-cyan-950/30';
                badgeColor = 'bg-cyan-400 text-black font-bold';
              }

              return (
                <React.Fragment key={ticket.id}>
                  <div
                    onClick={() => onSelectToken && onSelectToken(ticket)}
                    className={`flex-shrink-0 w-36 p-3 rounded-xl border ${borderColor} ${bgColor} transition-all duration-300 hover:scale-105 cursor-pointer relative group`}
                  >
                    {isUser && (
                      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-amber-400 text-black text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                        <Sparkles className="w-2.5 h-2.5" /> YOU
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl font-mono font-bold tracking-tight text-white">
                        #{ticket.token_number}
                      </span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${badgeColor}`}>
                        {ticket.status}
                      </span>
                    </div>

                    <div className="text-xs text-white/90 font-medium truncate">
                      {ticket.user_name.replace(' (You)', '')}
                    </div>

                    <div className="text-[10px] text-white/40 mt-1 font-mono">
                      Pos: {index === 0 ? 'Front' : `+${index}`}
                    </div>
                  </div>

                  {index < activeTickets.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-white/20 flex-shrink-0" />
                  )}
                </React.Fragment>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
