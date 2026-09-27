'use client';

import React from 'react';

interface TokenBadgeProps {
  tokenNumber: number;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  isUser?: boolean;
  status?: string;
  className?: string;
}

export const TokenBadge: React.FC<TokenBadgeProps> = ({
  tokenNumber,
  size = 'md',
  isUser = false,
  status,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-lg px-2.5 py-1',
    md: 'text-2xl px-4 py-1.5',
    lg: 'text-4xl sm:text-5xl px-6 py-3',
    hero: 'text-6xl sm:text-8xl px-8 py-5',
  };

  return (
    <div
      className={`inline-flex flex-col items-center justify-center font-mono font-black tracking-tight rounded-2xl border transition-all ${
        isUser
          ? 'bg-gradient-to-b from-amber-500/20 to-amber-950/40 border-amber-400 text-amber-300 shadow-[0_0_35px_rgba(245,158,11,0.35)]'
          : status === 'SERVING'
          ? 'bg-gradient-to-b from-emerald-500/20 to-emerald-950/40 border-emerald-400 text-emerald-300 shadow-[0_0_35px_rgba(16,185,129,0.35)]'
          : status === 'CALLED'
          ? 'bg-gradient-to-b from-cyan-500/20 to-cyan-950/40 border-cyan-400 text-cyan-300 shadow-[0_0_35px_rgba(0,240,255,0.35)]'
          : 'bg-[#121622] border-white/15 text-white shadow-inner'
      } ${sizeClasses[size]} ${className}`}
    >
      <span>#{tokenNumber}</span>
      {isUser && (
        <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-amber-400 uppercase -mt-1">
          YOU
        </span>
      )}
    </div>
  );
};
