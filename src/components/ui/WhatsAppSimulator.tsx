'use client';

import React from 'react';
import { useQueue } from '@/context/QueueContext';
import { MessageSquare, X, ExternalLink, CheckCheck, Bell, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export const WhatsAppSimulator: React.FC = () => {
  const {
    notifications,
    isWhatsAppOpen,
    setIsWhatsAppOpen,
    markNotificationsRead,
    business,
  } = useQueue();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleToggle = () => {
    if (!isWhatsAppOpen) {
      markNotificationsRead();
    }
    setIsWhatsAppOpen(!isWhatsAppOpen);
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center">
        <button
          onClick={handleToggle}
          className="relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-black font-semibold shadow-[0_10px_30px_rgba(37,211,102,0.4)] hover:scale-105 active:scale-95 transition-all duration-300"
          aria-label="Open WhatsApp Notification Preview"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 fill-black text-black" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-600 text-white text-[11px] font-bold flex items-center justify-center border-2 border-black animate-bounce">
                {unreadCount}
              </span>
            )}
          </div>
          <span className="text-xs font-bold uppercase tracking-wider font-mono">
            WhatsApp Live ({notifications.length})
          </span>
        </button>
      </div>

      {/* Phone Simulator Modal / Slide-over */}
      {isWhatsAppOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end p-0 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full sm:w-[400px] h-[90vh] sm:h-[680px] max-h-[800px] bg-[#111B21] rounded-t-3xl sm:rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
            {/* Phone Header / WhatsApp Top Bar */}
            <div className="bg-[#202C33] px-4 py-3 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center text-black font-black text-sm">
                    Q
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#25D366] border-2 border-[#202C33] flex items-center justify-center">
                    <ShieldCheck className="w-2.5 h-2.5 text-black" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-white text-sm font-semibold tracking-tight">
                      QUEUELESS Updates
                    </h3>
                    <span className="text-[10px] text-[#25D366] font-mono px-1 py-0.2 rounded bg-[#25D366]/10">
                      VERIFIED
                    </span>
                  </div>
                  <p className="text-[11px] text-white/50">{business.name} • Official Channel</p>
                </div>
              </div>

              <button
                onClick={() => setIsWhatsAppOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                aria-label="Close WhatsApp simulator"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated Chat Encrypted Banner */}
            <div className="bg-[#182229] py-1.5 px-3 text-center border-b border-white/5">
              <span className="text-[10px] text-[#FFD279] font-mono flex items-center justify-center gap-1">
                🔒 Messages are end-to-end simulated via QUEUELESS Event Hub
              </span>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0B141A] bg-opacity-95">
              {notifications.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <Bell className="w-8 h-8 text-white/20 mx-auto mb-3" />
                  <p className="text-white/60 text-sm font-medium">No queue alerts yet.</p>
                  <p className="text-white/30 text-xs mt-1">
                    Join a queue or advance the live demo to trigger instant WhatsApp milestone alerts!
                  </p>
                </div>
              ) : (
                notifications.map((notif) => {
                  const time = new Date(notif.sent_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <div
                      key={notif.id}
                      className="bg-[#202C33] text-white/90 rounded-2xl rounded-tl-sm p-3.5 border border-white/5 shadow-md space-y-3 relative group"
                    >
                      {/* Message Content with Markdown Formatting */}
                      <div className="text-xs whitespace-pre-line leading-relaxed font-sans">
                        {notif.message.split('\n\n👉 *View Live Queue:*')[0]}
                      </div>

                      {/* Interactive Button in WhatsApp Card */}
                      <div className="pt-2 border-t border-white/10">
                        <Link
                          href={notif.tracking_url.replace(
                            typeof window !== 'undefined' ? window.location.origin : '',
                            ''
                          )}
                          onClick={() => setIsWhatsAppOpen(false)}
                          className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-[#00A884] hover:bg-[#029071] text-black font-bold text-xs uppercase tracking-wider font-mono transition-colors shadow-sm"
                        >
                          <span>VIEW LIVE 3D QUEUE</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>

                      {/* Meta Footer */}
                      <div className="flex items-center justify-between pt-1 text-[10px] text-white/40 font-mono">
                        <span className="uppercase tracking-wider">{notif.type}</span>
                        <div className="flex items-center gap-1 text-[#53BDEB]">
                          <span>{time}</span>
                          <CheckCheck className="w-3.5 h-3.5 inline" />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom Input Preview (Mock) */}
            <div className="bg-[#202C33] p-3 border-t border-white/5 flex items-center gap-3">
              <div className="flex-1 bg-[#2A3942] rounded-full px-4 py-2 text-xs text-white/40 font-mono">
                Reply to business desk...
              </div>
              <div className="w-9 h-9 rounded-full bg-[#00A884] flex items-center justify-center text-black">
                <MessageSquare className="w-4 h-4 fill-black" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
