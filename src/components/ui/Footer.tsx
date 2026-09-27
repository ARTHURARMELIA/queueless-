'use client';

import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/5 bg-[#050608] py-16 text-white/50 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-cyan-400 flex items-center justify-center font-mono font-black text-black text-sm">
              Q
            </div>
            <span className="font-mono font-bold text-white tracking-widest text-base">
              QUEUELESS
            </span>
          </div>
          <p className="text-white/60 leading-relaxed font-sans">
            Your time shouldn't be spent waiting. Digital queues with live spatial 3D visualization and real-time WhatsApp updates.
          </p>
          <div className="text-[11px] font-mono text-cyan-400/80">
            Powered by WebGL 3D Engine & Realtime Sync
          </div>
        </div>

        {/* Product */}
        <div className="space-y-3">
          <h4 className="font-mono uppercase text-white tracking-wider text-[11px] font-semibold">
            Product
          </h4>
          <ul className="space-y-2 font-sans">
            <li>
              <Link href="/how-it-works" className="hover:text-cyan-300 transition-colors">
                How It Works
              </Link>
            </li>
            <li>
              <Link href="/join/city-care-clinic" className="hover:text-cyan-300 transition-colors">
                Customer Experience
              </Link>
            </li>
            <li>
              <Link href="/queue/q-tk-42-rahul-you-a1b2" className="hover:text-cyan-300 transition-colors">
                Live 3D Ticket Tracking
              </Link>
            </li>
            <li>
              <Link href="/business/queue" className="hover:text-cyan-300 transition-colors">
                Waiting Room TV Display
              </Link>
            </li>
          </ul>
        </div>

        {/* Business Platform */}
        <div className="space-y-3">
          <h4 className="font-mono uppercase text-white tracking-wider text-[11px] font-semibold">
            Businesses
          </h4>
          <ul className="space-y-2 font-sans">
            <li>
              <Link href="/business" className="hover:text-cyan-300 transition-colors">
                Overview & Features
              </Link>
            </li>
            <li>
              <Link href="/business/dashboard" className="hover:text-cyan-300 transition-colors">
                Staff Queue Console
              </Link>
            </li>
            <li>
              <Link href="/business/analytics" className="hover:text-cyan-300 transition-colors">
                3D Queue Analytics
              </Link>
            </li>
            <li>
              <Link href="/business/qr" className="hover:text-cyan-300 transition-colors">
                QR Code Generator
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal & Status */}
        <div className="space-y-3">
          <h4 className="font-mono uppercase text-white tracking-wider text-[11px] font-semibold">
            System
          </h4>
          <ul className="space-y-2 font-sans">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
              <span className="text-white/80">All Services Operational</span>
            </li>
            <li>
              <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
            </li>
            <li>
              <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
            </li>
            <li>
              <span className="hover:text-white transition-colors cursor-pointer">Security Standards</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-white/30 text-[11px] font-mono">
        <p>© {new Date().getFullYear()} QUEUELESS Inc. All rights reserved.</p>
        <p className="mt-2 sm:mt-0">Designed for zero-wait physical operations.</p>
      </div>
    </footer>
  );
};
