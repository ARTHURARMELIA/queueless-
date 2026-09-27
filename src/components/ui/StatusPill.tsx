'use client';

import React from 'react';
import { QueueStatus } from '@/types';

interface StatusPillProps {
  status: QueueStatus;
  size?: 'sm' | 'md';
}

export const StatusPill: React.FC<StatusPillProps> = ({ status, size = 'md' }) => {
  const styles: Record<QueueStatus, { bg: string; text: string; dot: string; label: string }> = {
    WAITING: {
      bg: 'bg-white/5 border-white/10',
      text: 'text-white/70',
      dot: 'bg-white/40',
      label: 'WAITING IN LINE',
    },
    CALLED: {
      bg: 'bg-cyan-500/10 border-cyan-400/40 shadow-[0_0_15px_rgba(0,240,255,0.2)]',
      text: 'text-cyan-300 font-bold',
      dot: 'bg-cyan-400 animate-ping',
      label: 'CALLED TO DESK',
    },
    SERVING: {
      bg: 'bg-emerald-500/15 border-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.25)]',
      text: 'text-emerald-300 font-bold',
      dot: 'bg-emerald-400 animate-pulse',
      label: 'NOW SERVING',
    },
    COMPLETED: {
      bg: 'bg-white/5 border-white/10',
      text: 'text-white/40',
      dot: 'bg-emerald-500/40',
      label: 'COMPLETED',
    },
    SKIPPED: {
      bg: 'bg-amber-500/10 border-amber-400/40',
      text: 'text-amber-300 font-semibold',
      dot: 'bg-amber-400',
      label: 'MISSED / SKIPPED',
    },
    RECALLED: {
      bg: 'bg-cyan-500/10 border-cyan-400/40',
      text: 'text-cyan-300 font-bold',
      dot: 'bg-cyan-400 animate-pulse',
      label: 'RECALLED',
    },
    CANCELLED: {
      bg: 'bg-red-500/10 border-red-400/30',
      text: 'text-red-300 font-semibold',
      dot: 'bg-red-400',
      label: 'CANCELLED',
    },
    NO_SHOW: {
      bg: 'bg-red-500/10 border-red-400/30',
      text: 'text-red-300 font-semibold',
      dot: 'bg-red-400',
      label: 'NO SHOW',
    },
  };

  const current = styles[status] || styles.WAITING;
  const padding = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-mono tracking-wider uppercase ${current.bg} ${current.text} ${padding}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
      <span>{current.label}</span>
    </span>
  );
};
