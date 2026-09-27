'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import { useQueue } from '@/context/QueueContext';
import { ArrowLeft, Printer, Download, Copy, Check, ExternalLink, Sparkles } from 'lucide-react';

export default function QRCodeGeneratorPage() {
  const { business, services } = useQueue();
  const [selectedServiceId, setSelectedServiceId] = useState<string>('all');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://queueless.app';
  const joinUrl =
    selectedServiceId === 'all'
      ? `${origin}/join/${business.slug}`
      : `${origin}/join/${business.slug}?service=${selectedServiceId}`;

  // Generate QR code data URL
  useEffect(() => {
    QRCode.toDataURL(joinUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR generation error:', err));
  }, [joinUrl]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(joinUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = `${business.slug}-queue-qr.png`;
    link.href = qrDataUrl;
    link.click();
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Header (hidden during print) */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/business/dashboard"
            className="p-2.5 rounded-xl bg-surface-100 hover:bg-surface-50 border border-white/10 text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight font-sans">
              Printable Queue QR Posters
            </h1>
            <p className="text-xs text-white/50 font-mono mt-0.5">
              Place these near your entrance or waiting room desks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface-100 hover:bg-surface-50 border border-white/10 text-white font-mono text-xs transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface-100 hover:bg-surface-50 border border-white/10 text-white font-mono text-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download PNG</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-glow-cyan"
          >
            <Printer className="w-4 h-4" />
            <span>Print Poster</span>
          </button>
        </div>
      </div>

      {/* Target Service Filter (hidden during print) */}
      <div className="print:hidden p-4 rounded-2xl bg-surface-200 border border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono uppercase text-white/50">Target Queue:</span>
          <select
            value={selectedServiceId}
            onChange={(e) => setSelectedServiceId(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-surface-100 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
          >
            <option value="all">Entire Clinic (Customer Selects Service)</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} Only
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs font-mono text-cyan-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>High-Resolution Vector QR</span>
        </div>
      </div>

      {/* Printable Poster Canvas */}
      <div className="bg-white text-black p-10 sm:p-14 rounded-3xl shadow-2xl max-w-lg mx-auto text-center border-4 border-black space-y-6 print:border-none print:shadow-none print:p-0">
        {/* Brand Bar */}
        <div className="flex items-center justify-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center font-mono font-black text-base">
            Q
          </div>
          <span className="font-mono font-black text-xl tracking-wider">QUEUELESS</span>
        </div>

        <div>
          <h2 className="text-3xl font-extrabold font-sans uppercase tracking-tight">
            {business.name}
          </h2>
          <p className="text-sm text-gray-600 font-medium mt-1">
            {selectedServiceId === 'all'
              ? 'Multi-Specialty Care & Diagnostics'
              : services.find((s) => s.id === selectedServiceId)?.name}
          </p>
        </div>

        <div className="py-2">
          <div className="inline-block p-4 bg-white border-2 border-black rounded-3xl shadow-md">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Scan to join queue QR code"
                className="w-64 h-64 mx-auto rounded-xl"
              />
            ) : (
              <div className="w-64 h-64 flex items-center justify-center font-mono text-xs text-gray-400">
                Generating QR...
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="inline-block px-6 py-2 rounded-full bg-black text-white font-mono font-bold text-base tracking-wider uppercase">
            SCAN TO JOIN QUEUE
          </div>
          <p className="text-xs text-gray-500 font-sans max-w-xs mx-auto pt-2">
            No app download required. Open your phone camera, scan this code, and leave the waiting
            room. We'll text your turn on WhatsApp!
          </p>
        </div>

        <div className="pt-6 border-t border-gray-200 text-[11px] font-mono text-gray-400">
          Powered by QUEUELESS Spatial Queue Engine • {joinUrl}
        </div>
      </div>
    </div>
  );
}
