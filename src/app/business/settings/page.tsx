'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQueue } from '@/context/QueueContext';
import { ArrowLeft, Save, Building2, Clock, Phone, MapPin, CheckCircle2, Shield } from 'lucide-react';

export default function BusinessSettingsPage() {
  const { business } = useQueue();

  const [name, setName] = useState(business.name);
  const [category, setCategory] = useState(business.category);
  const [address, setAddress] = useState(business.address);
  const [phone, setPhone] = useState(business.phone);
  const [operatingHours, setOperatingHours] = useState(business.operating_hours);
  const [description, setDescription] = useState(business.description);
  const [status, setStatus] = useState(business.status);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/business/dashboard"
            className="p-2.5 rounded-xl bg-surface-100 hover:bg-surface-50 border border-white/10 text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight font-sans">
              Business Profile & Configuration
            </h1>
            <p className="text-xs text-white/50 font-mono mt-0.5">
              Operating status, location details, and WhatsApp webhook triggers
            </p>
          </div>
        </div>

        {saved && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono text-xs border border-emerald-500/30">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Saved!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Operating Status Selector */}
        <div className="p-6 rounded-3xl bg-surface-200 border border-white/10 space-y-4">
          <label className="block text-xs font-mono uppercase text-white/70">
            Live Operating Status
          </label>
          <div className="grid grid-cols-3 gap-4">
            {(['OPEN', 'BUSY', 'CLOSED'] as const).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setStatus(opt)}
                className={`py-3 rounded-2xl font-mono text-xs font-bold uppercase transition-all ${
                  status === opt
                    ? opt === 'OPEN'
                      ? 'bg-emerald-500 text-black shadow-lg'
                      : opt === 'BUSY'
                      ? 'bg-amber-500 text-black shadow-lg'
                      : 'bg-red-500 text-white shadow-lg'
                    : 'bg-surface-100 text-white/60 hover:bg-surface-50 border border-white/10'
                }`}
              >
                ● {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Business Info */}
        <div className="p-6 sm:p-8 rounded-3xl bg-surface-200 border border-white/10 space-y-4">
          <h2 className="text-lg font-bold text-white font-sans">Clinic Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
                Business Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-100 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
                Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-100 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
              Physical Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-100 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
                Contact Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-100 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
                Operating Hours
              </label>
              <input
                type="text"
                value={operatingHours}
                onChange={(e) => setOperatingHours(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-100 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-100 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* WhatsApp Notification Milestones Configuration */}
        <div className="p-6 sm:p-8 rounded-3xl bg-surface-200 border border-white/10 space-y-4">
          <h2 className="text-lg font-bold text-white font-sans">
            WhatsApp Automated Milestone Triggers
          </h2>
          <p className="text-xs text-white/50 font-mono">
            Control which automated notifications are dispatched to waiting patients.
          </p>

          <div className="space-y-3 pt-2">
            {[
              { label: 'Immediate Confirmation (Token Issued + Live 3D Link)', default: true },
              { label: '10 People Away Milestone Ping', default: true },
              { label: '5 People Away Milestone Alert', default: true },
              { label: '2 People Away Urgent Recall Alert', default: true },
              { label: 'Now Called to Desk / Room Notification', default: true },
              { label: 'Completion & Patient Rating Survey', default: true },
            ].map((trigger, i) => (
              <label key={i} className="flex items-center gap-3 p-3 rounded-xl bg-surface-100 border border-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={trigger.default}
                  className="rounded bg-surface-200 border-white/20 text-cyan-400 focus:ring-cyan-400"
                />
                <span className="text-xs text-white/80 font-mono">{trigger.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-glow-cyan"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
