'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQueue } from '@/context/QueueContext';
import { QueueCanvas } from '@/components/3d/QueueCanvas';
import { CustomerQueueScene } from '@/components/3d/CustomerQueueScene';
import { TokenBadge } from '@/components/ui/TokenBadge';
import { StatusPill } from '@/components/ui/StatusPill';
import { Modal } from '@/components/ui/Modal';
import {
  Clock,
  Users,
  MapPin,
  Building2,
  AlertTriangle,
  LogOut,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Star,
  ExternalLink,
  RotateCcw,
  Play,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

export default function CustomerQueuePage() {
  const params = useParams();
  const router = useRouter();
  const {
    tickets,
    business,
    services,
    counters,
    getTicketBySecureToken,
    cancelTicket,
    submitFeedback,
    simulateNext,
    setIsWhatsAppOpen,
  } = useQueue();

  const secureToken = params.secureQueueToken as string;
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Find ticket by secure token
  const ticket = getTicketBySecureToken(secureToken) || tickets.find((t) => t.token_number === 42);

  const service = services.find((s) => s.id === ticket?.service_id) || services[0];
  const counter = counters.find((c) => c.id === ticket?.counter_id) || counters[0];

  // Active tickets for this service
  const activeServiceTickets = tickets.filter(
    (t) =>
      t.service_id === service?.id &&
      (t.status === 'SERVING' || t.status === 'CALLED' || t.status === 'WAITING')
  );

  const currentlyServingTicket = activeServiceTickets.find((t) => t.status === 'SERVING');

  // Compute people ahead
  const ticketIndex = activeServiceTickets.findIndex((t) => t.id === ticket?.id);
  const peopleAhead = Math.max(0, ticketIndex);
  const estimatedWaitMinutes = peopleAhead * (service?.average_duration || 8);

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div className="max-w-md p-8 rounded-3xl bg-surface-200 border border-white/10 space-y-4">
          <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Ticket Not Found</h2>
          <p className="text-xs text-white/50 font-mono">
            The secure queue token `{secureToken}` could not be located or has expired.
          </p>
          <Link
            href="/join/city-care-clinic"
            className="inline-block px-6 py-3 rounded-xl bg-cyan-400 text-black font-mono font-bold text-xs uppercase"
          >
            Join a New Queue
          </Link>
        </div>
      </div>
    );
  }

  const handleConfirmCancel = () => {
    cancelTicket(ticket.id);
    setShowCancelModal(false);
  };

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    submitFeedback(ticket.id, feedbackRating, feedbackComment);
    setFeedbackSubmitted(true);
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header telemetry and Clinic details */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-white/5 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
              Live Queue Tracker
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono text-white/40">Realtime Sync Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-sans mt-0.5">
            {business.name}
          </h1>
          <p className="text-xs text-white/50 font-mono">
            {service?.name} • Desk: {ticket.counter_name || counter.name}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Simulation trigger for demo inspection */}
          <button
            onClick={() => simulateNext(service.id)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface-100 hover:bg-surface-50 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold transition-all shadow-md"
            title="Simulate queue advance"
          >
            <Play className="w-3.5 h-3.5 fill-emerald-300" />
            <span>Simulate Advance</span>
          </button>

          {/* WhatsApp Drawer toggle */}
          <button
            onClick={() => setIsWhatsAppOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] font-mono text-xs font-semibold transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp Feed</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Ticket Metrics + 3D Queue Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Token Card & Status Info */}
        <div className="lg:col-span-4 space-y-6">
          {/* Dominant Token Card */}
          <div className="bg-[#0C1019] border border-white/10 rounded-3xl p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400">
                {ticket.user_name}
              </span>
              <StatusPill status={ticket.status} size="sm" />
            </div>

            <div className="my-3">
              <TokenBadge tokenNumber={ticket.token_number} size="hero" isUser={true} />
            </div>

            <p className="text-xs text-white/50 font-mono mt-3">
              Joined {new Date(ticket.joined_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>

            {/* Quick action buttons */}
            {ticket.status !== 'COMPLETED' && ticket.status !== 'CANCELLED' && (
              <div className="pt-6 border-t border-white/5 mt-6 flex flex-col gap-2">
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="w-full py-2.5 rounded-xl bg-surface-100 hover:bg-red-950/30 border border-white/10 hover:border-red-500/40 text-white/60 hover:text-red-300 font-mono text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>LEAVE QUEUE</span>
                </button>
              </div>
            )}
          </div>

          {/* Telemetry Cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Currently Serving */}
            <div className="p-5 rounded-2xl bg-surface-200 border border-white/10">
              <div className="text-[10px] font-mono uppercase text-white/40 tracking-wider">
                Currently Serving
              </div>
              <div className="text-3xl font-mono font-black text-emerald-400 mt-1">
                {currentlyServingTicket ? `#${currentlyServingTicket.token_number}` : 'None'}
              </div>
              <div className="text-[11px] text-white/50 truncate mt-0.5">
                {currentlyServingTicket ? currentlyServingTicket.user_name.replace(' (You)', '') : 'Desk idle'}
              </div>
            </div>

            {/* People Ahead */}
            <div className="p-5 rounded-2xl bg-surface-200 border border-white/10">
              <div className="text-[10px] font-mono uppercase text-white/40 tracking-wider">
                People Ahead
              </div>
              <div className="text-3xl font-mono font-black text-white mt-1">
                {ticket.status === 'SERVING' ? '0' : peopleAhead}
              </div>
              <div className="text-[11px] text-cyan-400 font-mono mt-0.5">
                {ticket.status === 'SERVING'
                  ? 'At Counter Now'
                  : peopleAhead === 0
                  ? 'You are next!'
                  : `${peopleAhead} ahead`}
              </div>
            </div>

            {/* Estimated Wait */}
            <div className="col-span-2 p-5 rounded-2xl bg-surface-200 border border-white/10 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono uppercase text-white/40 tracking-wider">
                  Estimated Waiting Time
                </div>
                <div className="text-2xl font-mono font-black text-white mt-0.5">
                  {ticket.status === 'SERVING'
                    ? 'Being served'
                    : ticket.status === 'CALLED'
                    ? 'Called to desk'
                    : estimatedWaitMinutes === 0
                    ? 'Under 2 min'
                    : `~${estimatedWaitMinutes} minutes`}
                </div>
                <div className="text-[11px] text-white/50 font-mono">
                  Calculated from average {service.average_duration}m duration
                </div>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Living Queue Environment */}
        <div className="lg:col-span-8 space-y-6">
          <div className="h-[520px] w-full rounded-3xl p-1 bg-gradient-to-b from-white/10 to-transparent shadow-2xl relative">
            <QueueCanvas
              cameraPosition={[0, 4.2, 14]}
              fov={42}
              tickets={activeServiceTickets}
              userTokenNumber={ticket.token_number}
            >
              <CustomerQueueScene
                tickets={activeServiceTickets}
                userTicketId={ticket.id}
                servingToken={currentlyServingTicket?.token_number}
                counterName={ticket.counter_name || counter.name}
              />
            </QueueCanvas>
          </div>

          {/* Customer Journey Status Callout */}
          {ticket.status === 'CALLED' && (
            <div className="p-6 rounded-3xl bg-cyan-950/40 border border-cyan-400 shadow-[0_0_35px_rgba(0,240,255,0.3)] animate-pulse flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-400 text-black flex items-center justify-center font-bold font-mono text-lg">
                  🔔
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Your Token is Being Called!</h3>
                  <p className="text-xs text-cyan-300 font-mono">
                    Please proceed immediately to {ticket.counter_name || 'Counter 1 (Room 101)'}.
                  </p>
                </div>
              </div>
            </div>
          )}

          {ticket.status === 'SERVING' && (
            <div className="p-6 rounded-3xl bg-emerald-950/40 border border-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.3)] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-400 text-black flex items-center justify-center font-bold font-mono text-lg">
                  🩺
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Currently Being Served</h3>
                  <p className="text-xs text-emerald-300 font-mono">
                    Your appointment is active at {ticket.counter_name || 'Counter 1'}.
                  </p>
                </div>
              </div>
            </div>
          )}

          {ticket.status === 'COMPLETED' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-surface-200 border border-emerald-500/40 shadow-2xl space-y-4">
              <div className="flex items-center gap-3 text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
                <h3 className="text-lg font-bold text-white">Service Completed!</h3>
              </div>
              <p className="text-xs text-white/60 font-sans">
                Thank you for visiting {business.name}. How was your visit and queue experience today?
              </p>

              {!feedbackSubmitted ? (
                <form onSubmit={handleSendFeedback} className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-mono uppercase text-white/50 mb-2">
                      Rating
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFeedbackRating(star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-7 h-7 ${
                              star <= feedbackRating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-white/20'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-white/50 mb-2">
                      Comments (Optional)
                    </label>
                    <textarea
                      value={feedbackComment}
                      onChange={(e) => setFeedbackComment(e.target.value)}
                      placeholder="Share your thoughts on the wait time or care..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl bg-surface-100 border border-white/10 text-white text-xs placeholder-white/20 focus:outline-none focus:border-cyan-400 font-sans"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-mono font-bold text-xs uppercase tracking-wider transition-colors shadow-glow-cyan"
                  >
                    Submit Feedback
                  </button>
                </form>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Thank you! Your feedback has been recorded.</span>
                </div>
              )}
            </div>
          )}

          {ticket.status === 'CANCELLED' && (
            <div className="p-6 rounded-3xl bg-red-950/30 border border-red-500/40 text-center space-y-3">
              <h3 className="text-base font-bold text-red-300">Ticket Cancelled</h3>
              <p className="text-xs text-white/60 font-mono">
                You have left the queue for {service.name}.
              </p>
              <Link
                href="/join/city-care-clinic"
                className="inline-block px-5 py-2.5 rounded-xl bg-surface-100 border border-white/10 text-white text-xs font-mono hover:text-cyan-300"
              >
                Rejoin Queue
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal to Leave Queue */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Leave the Queue?"
        subtitle="This will forfeit your token spot in line."
      >
        <div className="space-y-6">
          <p className="text-xs text-white/70 leading-relaxed font-sans">
            Are you sure you want to leave the queue for <span className="text-white font-bold">{service.name}</span>?
            Your ticket #{ticket.token_number} will be cancelled and will not be called.
          </p>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setShowCancelModal(false)}
              className="px-5 py-2.5 rounded-xl bg-surface-100 hover:bg-surface-50 border border-white/10 text-white font-mono text-xs"
            >
              Keep Spot
            </button>
            <button
              onClick={handleConfirmCancel}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs uppercase shadow-lg transition-colors"
            >
              Confirm Leave
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
