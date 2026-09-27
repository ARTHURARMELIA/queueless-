'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQueue } from '@/context/QueueContext';
import { ArrowLeft, Plus, UserCheck, Shield, Building2, Mail } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { StaffRole } from '@/types';

export default function StaffManagementPage() {
  const { business, staff, counters, services, addStaff, addCounter } = useQueue();
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showAddCounterModal, setShowAddCounterModal] = useState(false);

  // Add staff form state
  const [staffName, setStaffName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffRole, setStaffRole] = useState<StaffRole>('STAFF');
  const [counterId, setCounterId] = useState<string>('cnt-01');

  // Add counter form state
  const [counterName, setCounterName] = useState('');

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName.trim() || !staffEmail.trim()) return;

    addStaff({
      name: staffName.trim(),
      email: staffEmail.trim(),
      role: staffRole,
      counter_id: counterId,
      status: 'ACTIVE',
    });

    setStaffName('');
    setStaffEmail('');
    setShowAddStaffModal(false);
  };

  const handleCreateCounter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!counterName.trim()) return;

    addCounter({
      name: counterName.trim(),
      active: true,
    });

    setCounterName('');
    setShowAddCounterModal(false);
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
              Staff & Counter Operations
            </h1>
            <p className="text-xs text-white/50 font-mono mt-0.5">
              {business.name} • Manage team permissions and counter stations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddCounterModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface-100 hover:bg-surface-50 border border-white/10 text-white font-mono text-xs font-bold uppercase transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Counter</span>
          </button>

          <button
            onClick={() => setShowAddStaffModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-glow-cyan"
          >
            <Plus className="w-4 h-4" />
            <span>Add Staff Member</span>
          </button>
        </div>
      </div>

      {/* Grid: Staff Members & Counter Desks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Staff Members List */}
        <div className="lg:col-span-8 space-y-4">
          <h2 className="text-lg font-bold text-white font-sans mb-4">
            Team Members ({staff.length})
          </h2>

          <div className="space-y-3">
            {staff.map((member) => {
              const assignedCounter = counters.find((c) => c.id === member.counter_id);

              return (
                <div
                  key={member.id}
                  className="p-5 rounded-2xl bg-surface-200 border border-white/10 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-surface-100 border border-white/10 flex items-center justify-center font-bold text-cyan-400 font-mono text-sm">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{member.name}</span>
                        <span
                          className={`text-[9px] font-mono px-2 py-0.5 rounded-full uppercase font-bold ${
                            member.role === 'ADMIN'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                              : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          }`}
                        >
                          {member.role}
                        </span>
                      </div>
                      <div className="text-xs text-white/50 font-mono mt-0.5 flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        <span>{member.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-mono text-white/80">
                      {assignedCounter ? assignedCounter.name : 'Unassigned Desk'}
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase">
                      ● {member.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Service Desks */}
        <div className="lg:col-span-4 bg-surface-200 border border-white/10 rounded-3xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white font-sans">Active Counters ({counters.length})</h2>
          <p className="text-xs text-white/50 font-mono">
            Physical stations where staff serve customers.
          </p>

          <div className="space-y-3 pt-2">
            {counters.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-2xl bg-surface-100 border border-white/5 flex items-center justify-between"
              >
                <div>
                  <div className="text-sm font-bold text-white">{c.name}</div>
                  <div className="text-[10px] font-mono text-cyan-400 mt-0.5">
                    {c.active ? '● Station Online' : '○ Station Offline'}
                  </div>
                </div>
                <div className="text-xs font-mono text-white/40">Room Assigned</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Staff Modal */}
      <Modal
        isOpen={showAddStaffModal}
        onClose={() => setShowAddStaffModal(false)}
        title="Add Staff Member"
        subtitle="Invite a healthcare provider or queue operator"
      >
        <form onSubmit={handleCreateStaff} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              value={staffName}
              onChange={(e) => setStaffName(e.target.value)}
              placeholder="e.g. Dr. Roy"
              className="w-full px-4 py-2.5 rounded-xl bg-surface-100 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
              Work Email
            </label>
            <input
              type="email"
              required
              value={staffEmail}
              onChange={(e) => setStaffEmail(e.target.value)}
              placeholder="roy@citycare.com"
              className="w-full px-4 py-2.5 rounded-xl bg-surface-100 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">Role</label>
              <select
                value={staffRole}
                onChange={(e) => setStaffRole(e.target.value as StaffRole)}
                className="w-full px-3 py-2.5 rounded-xl bg-surface-100 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
              >
                <option value="STAFF">STAFF (Queue Operator)</option>
                <option value="ADMIN">ADMIN (Full Manager)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
                Assign Counter
              </label>
              <select
                value={counterId}
                onChange={(e) => setCounterId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-surface-100 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
              >
                {counters.map((cnt) => (
                  <option key={cnt.id} value={cnt.id}>
                    {cnt.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowAddStaffModal(false)}
              className="px-5 py-2.5 rounded-xl bg-surface-100 text-white text-xs font-mono hover:bg-surface-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-cyan-400 text-black text-xs font-mono font-bold uppercase shadow-glow-cyan"
            >
              Add Staff Member
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Counter Modal */}
      <Modal
        isOpen={showAddCounterModal}
        onClose={() => setShowAddCounterModal(false)}
        title="Add Counter Station"
        subtitle="Create a new physical desk or consultation room"
      >
        <form onSubmit={handleCreateCounter} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
              Counter / Room Name
            </label>
            <input
              type="text"
              required
              value={counterName}
              onChange={(e) => setCounterName(e.target.value)}
              placeholder="e.g. Counter 3 (Room 103)"
              className="w-full px-4 py-2.5 rounded-xl bg-surface-100 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowAddCounterModal(false)}
              className="px-5 py-2.5 rounded-xl bg-surface-100 text-white text-xs font-mono hover:bg-surface-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-cyan-400 text-black text-xs font-mono font-bold uppercase shadow-glow-cyan"
            >
              Create Counter
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
