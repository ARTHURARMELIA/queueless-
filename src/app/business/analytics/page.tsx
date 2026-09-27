'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQueue } from '@/context/QueueContext';
import { QueueCanvas } from '@/components/3d/QueueCanvas';
import { Analytics3DChart } from '@/components/3d/Analytics3DChart';
import { ArrowLeft, TrendingUp, Users, Clock, AlertTriangle, CheckCircle2, BarChart2 } from 'lucide-react';
import { HourlyAnalytics } from '@/types';

export default function BusinessAnalyticsPage() {
  const { business, hourlyAnalytics, tickets } = useQueue();
  const [selectedHour, setSelectedHour] = useState<HourlyAnalytics | null>(hourlyAnalytics[9]); // 6 PM default

  // Calculate aggregates
  const totalServed = hourlyAnalytics.reduce((acc, h) => acc + h.customersServed, 0);
  const avgWait = Math.round(
    hourlyAnalytics.reduce((acc, h) => acc + h.avgWaitMinutes, 0) / hourlyAnalytics.length
  );
  const avgServiceTime = Math.round(
    hourlyAnalytics.reduce((acc, h) => acc + h.avgServiceMinutes, 0) / hourlyAnalytics.length
  );
  const cancellationsCount = tickets.filter((t) => t.status === 'CANCELLED').length;
  const skippedCount = tickets.filter((t) => t.status === 'SKIPPED').length;

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
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
              Operational Queue Analytics
            </h1>
            <p className="text-xs text-white/50 font-mono mt-0.5">
              {business.name} • Wait durations, throughput, and bottleneck diagnostics
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-500/20 px-3.5 py-1.5 rounded-xl">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>Real-time Telemetry Engine</span>
        </div>
      </div>

      {/* Top Level Metric KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl bg-surface-200 border border-white/10">
          <div className="text-[10px] font-mono uppercase text-white/50">Total Served Today</div>
          <div className="text-3xl font-mono font-black text-white mt-2">{totalServed}</div>
          <div className="text-xs text-emerald-400 font-mono mt-1">+14% vs yesterday</div>
        </div>

        <div className="p-6 rounded-2xl bg-surface-200 border border-white/10">
          <div className="text-[10px] font-mono uppercase text-white/50">Avg Waiting Time</div>
          <div className="text-3xl font-mono font-black text-cyan-300 mt-2">~{avgWait} min</div>
          <div className="text-xs text-white/50 font-mono mt-1">Goal: &lt; 25 mins</div>
        </div>

        <div className="p-6 rounded-2xl bg-surface-200 border border-white/10">
          <div className="text-[10px] font-mono uppercase text-white/50">Avg Service Time</div>
          <div className="text-3xl font-mono font-black text-white mt-2">~{avgServiceTime} min</div>
          <div className="text-xs text-white/50 font-mono mt-1">Per consultation</div>
        </div>

        <div className="p-6 rounded-2xl bg-surface-200 border border-white/10">
          <div className="text-[10px] font-mono uppercase text-white/50">Abandonment / Skips</div>
          <div className="text-3xl font-mono font-black text-amber-300 mt-2">
            {cancellationsCount + skippedCount}
          </div>
          <div className="text-xs text-white/50 font-mono mt-1">
            {cancellationsCount} cancelled • {skippedCount} skipped
          </div>
        </div>
      </div>

      {/* 3D Hourly Volume Visualizer Section */}
      <div className="bg-surface-200 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono uppercase text-cyan-400 tracking-wider">
              3D Spatial Volume Inspector
            </div>
            <h2 className="text-xl font-bold text-white font-sans mt-0.5">
              Hourly Customer Flow
            </h2>
            <p className="text-xs text-white/50 font-mono">
              Hover or click any 3D column to inspect exact hour metrics
            </p>
          </div>

          {selectedHour && (
            <div className="p-3.5 rounded-2xl bg-surface-100 border border-cyan-400/40 flex items-center gap-6">
              <div>
                <div className="text-[9px] font-mono uppercase text-cyan-400">Hour</div>
                <div className="text-lg font-mono font-bold text-white">{selectedHour.hour}</div>
              </div>
              <div className="h-6 w-px bg-white/10" />
              <div>
                <div className="text-[9px] font-mono uppercase text-white/50">Customers</div>
                <div className="text-lg font-mono font-bold text-white">{selectedHour.customersServed}</div>
              </div>
              <div className="h-6 w-px bg-white/10" />
              <div>
                <div className="text-[9px] font-mono uppercase text-white/50">Avg Wait</div>
                <div className="text-lg font-mono font-bold text-white">~{selectedHour.avgWaitMinutes}m</div>
              </div>
              <div className="h-6 w-px bg-white/10" />
              <div>
                <div className="text-[9px] font-mono uppercase text-white/50">Peak Queue</div>
                <div className="text-lg font-mono font-bold text-cyan-300">{selectedHour.peakQueueLength}</div>
              </div>
            </div>
          )}
        </div>

        {/* 3D Canvas */}
        <div className="h-[380px] w-full rounded-2xl overflow-hidden bg-[#0A0D15] border border-white/5">
          <QueueCanvas
            cameraPosition={[0, 4, 12]}
            fov={45}
            showModeToggle={false}
            enableOrbit={false}
          >
            <Analytics3DChart
              data={hourlyAnalytics}
              selectedHour={selectedHour}
              onSelectHour={(h) => setSelectedHour(h)}
            />
          </QueueCanvas>
        </div>
      </div>

      {/* 2D Peak Hours Breakdown & Distribution Table */}
      <div className="bg-surface-200 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white font-sans">
            Hourly Peak Analysis & Capacity Ratios
          </h3>
          <p className="text-xs text-white/50 font-mono mt-0.5">
            Detailed breakdown by hour of operation
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 text-white/40 uppercase">
                <th className="py-3 px-4">Hour</th>
                <th className="py-3 px-4">Customers</th>
                <th className="py-3 px-4">Avg Wait</th>
                <th className="py-3 px-4">Avg Service</th>
                <th className="py-3 px-4">Peak Queue</th>
                <th className="py-3 px-4">Capacity Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/80">
              {hourlyAnalytics.map((row) => {
                const isPeak = row.customersServed >= 35;
                const isSelected = selectedHour?.hour === row.hour;

                return (
                  <tr
                    key={row.hour}
                    onClick={() => setSelectedHour(row)}
                    className={`hover:bg-white/5 cursor-pointer transition-colors ${
                      isSelected ? 'bg-cyan-950/20 text-cyan-300' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-bold">{row.hour}</td>
                    <td className="py-3 px-4">{row.customersServed}</td>
                    <td className="py-3 px-4">~{row.avgWaitMinutes} min</td>
                    <td className="py-3 px-4">~{row.avgServiceMinutes} min</td>
                    <td className="py-3 px-4">{row.peakQueueLength} people</td>
                    <td className="py-3 px-4">
                      {isPeak ? (
                        <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-bold">
                          HIGH PEAK
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                          OPTIMAL
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
