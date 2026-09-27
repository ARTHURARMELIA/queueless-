'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Lock, Mail, ArrowRight, UserCheck, Sparkles } from 'lucide-react';

export default function BusinessLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('dr.shah@citycare.com');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate successful Supabase login
    router.push('/business/dashboard');
  };

  const handleQuickFill = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen py-16 px-4 flex items-center justify-center">
      <div className="w-full max-w-md bg-surface-200 border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-mono font-black text-black text-xl mx-auto mb-4 shadow-[0_0_20px_rgba(0,240,255,0.4)]">
            Q
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight font-sans">
            Business & Staff Portal
          </h1>
          <p className="text-xs text-white/50 font-mono mt-1">
            Access live queue console, counters & analytics
          </p>
        </div>

        {/* Demo Quick Fill Badges */}
        <div className="p-3 rounded-2xl bg-surface-100 border border-white/5 mb-6 space-y-2">
          <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Quick Demo Login (Click to Fill)
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('dr.shah@citycare.com')}
              className="flex-1 py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-mono text-white/80 transition-colors text-left"
            >
              👨‍⚕️ Dr. Shah (Staff)
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('admin@citycare.com')}
              className="flex-1 py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-mono text-white/80 transition-colors text-left"
            >
              🛡️ Admin Desk
            </button>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-mono uppercase text-white/70 mb-2">
              Staff Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-white/30 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@clinic.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-100 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-cyan-400 transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono uppercase text-white/70">Password</label>
              <span className="text-[11px] font-mono text-cyan-400/80 hover:text-cyan-300 cursor-pointer">
                Forgot?
              </span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-white/30 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-100 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-cyan-400 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-white/60">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded bg-surface-100 border-white/20 text-cyan-400"
              />
              <span>Remember this session</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-glow-cyan flex items-center justify-center gap-2"
          >
            <span>Sign In to Console</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
