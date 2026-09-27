'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQueue } from '@/context/QueueContext';
import { ArrowLeft, Plus, Clock, Users, CheckCircle2, Shield, Settings } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

export default function ServicesManagementPage() {
  const { business, services, addService } = useQueue();
  const [showAddModal, setShowAddModal] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [averageDuration, setAverageDuration] = useState(8);
  const [maxQueueSize, setMaxQueueSize] = useState(50);
  const [onlineJoining, setOnlineJoining] = useState(true);

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addService({
      name: name.trim(),
      description: description.trim() || 'Standard business service',
      average_duration: Number(averageDuration) || 8,
      max_queue_size: Number(maxQueueSize) || 50,
      online_joining: onlineJoining,
      active: true,
    });

    setName('');
    setDescription('');
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-white/10 gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/business/dashboard"
            className="p-2.5 rounded-xl bg-surface-100 hover:bg-surface-50 border border-white/10 text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight font-sans">
              Services & Queue Configuration
            </h1>
            <p className="text-xs text-white/50 font-mono mt-0.5">
              {business.name} • Define service durations and capacity limits
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-glow-cyan"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="p-6 rounded-3xl bg-surface-200 border border-white/10 hover:border-cyan-400/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase">
                  ● ACTIVE
                </span>
                <span className="text-xs font-mono text-cyan-400">
                  Max: {service.max_queue_size}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white tracking-tight font-sans mb-2">
                {service.name}
              </h3>
              <p className="text-xs text-white/60 leading-relaxed font-sans mb-6">
                {service.description}
              </p>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-white/60">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" /> Avg Duration
                </span>
                <span className="font-bold text-white">{service.average_duration} minutes</span>
              </div>

              <div className="flex items-center justify-between text-white/60">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-cyan-400" /> Online Joining
                </span>
                <span className="text-emerald-400 font-bold">
                  {service.online_joining ? 'Enabled (QR + Web)' : 'In-Person Only'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Service Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Create New Service"
        subtitle="Configure queue parameters and duration estimates"
      >
        <form onSubmit={handleCreateService} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
              Service Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dental Cleaning, Oil Change"
              className="w-full px-4 py-3 rounded-xl bg-surface-100 border border-white/10 text-white text-xs font-sans focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief explanation shown on customer service card..."
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-100 border border-white/10 text-white text-xs font-sans focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
                Avg Duration (Minutes)
              </label>
              <input
                type="number"
                min={1}
                max={180}
                value={averageDuration}
                onChange={(e) => setAverageDuration(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-100 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
                Max Queue Size
              </label>
              <input
                type="number"
                min={5}
                max={200}
                value={maxQueueSize}
                onChange={(e) => setMaxQueueSize(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-100 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={onlineJoining}
                onChange={(e) => setOnlineJoining(e.target.checked)}
                className="rounded bg-surface-100 border-white/20 text-cyan-400"
              />
              <span className="text-xs text-white/80 font-sans">
                Allow customers to join this service remotely via QR code
              </span>
            </label>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-5 py-2.5 rounded-xl bg-surface-100 text-white text-xs font-mono hover:bg-surface-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-cyan-400 text-black text-xs font-mono font-bold uppercase shadow-glow-cyan"
            >
              Create Service
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
