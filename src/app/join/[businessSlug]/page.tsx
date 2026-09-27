'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQueue } from '@/context/QueueContext';
import { Service } from '@/types';
import {
  Clock,
  Users,
  MapPin,
  Phone,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Building2,
  Loader2,
  Lock,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

export default function JoinBusinessPage() {
  const router = useRouter();
  const params = useParams();
  const { business, services, tickets, joinQueue, getQueueForService } = useQueue();

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [step, setStep] = useState<'SELECT_SERVICE' | 'ENTER_DETAILS' | 'VERIFY_OTP'>(
    'SELECT_SERVICE'
  );

  // Form states
  const [fullName, setFullName] = useState('');
  const [phoneCountryCode, setPhoneCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [optInWhatsApp, setOptInWhatsApp] = useState(true);
  const [formErrors, setFormErrors] = useState<{ name?: string; phone?: string; optIn?: string }>({});

  // OTP states
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [otpCooldown, setOtpCooldown] = useState(30);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Default to first service
  useEffect(() => {
    if (services.length > 0 && !selectedService) {
      setSelectedService(services[0]);
    }
  }, [services, selectedService]);

  // Cooldown timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'VERIFY_OTP' && otpCooldown > 0) {
      timer = setInterval(() => {
        setOtpCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, otpCooldown]);

  const validateRegistration = () => {
    const errors: { name?: string; phone?: string; optIn?: string } = {};
    if (!fullName.trim() || fullName.trim().length < 2) {
      errors.name = 'Please enter your full name (minimum 2 characters).';
    }
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 8 || cleanPhone.length > 15) {
      errors.phone = 'Please enter a valid phone number (8-15 digits).';
    }
    if (!optInWhatsApp) {
      errors.optIn = 'You must agree to receive WhatsApp queue milestone notifications.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleContinueToOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRegistration()) return;
    setStep('VERIFY_OTP');
    setOtpCooldown(30);
    setOtpError('');
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    const updated = [...otpValues];
    updated[index] = value;
    setOtpValues(updated);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleQuickFillDemoOtp = () => {
    setOtpValues(['1', '2', '3', '4', '5', '6']);
    setOtpError('');
  };

  const handleVerifyAndJoin = async () => {
    const fullOtp = otpValues.join('');
    if (fullOtp.length < 6) {
      setOtpError('Please enter all 6 digits of the verification code.');
      return;
    }

    // In demo mode, accept any 6 digits or 123456
    setIsSubmitting(true);
    setOtpError('');

    try {
      const serviceId = selectedService?.id || services[0].id;
      const formattedPhone = `${phoneCountryCode} ${phoneNumber.trim()}`;
      const newTicket = await joinQueue(serviceId, fullName.trim(), formattedPhone);

      // Smooth redirect to live tracking page
      router.push(`/queue/${newTicket.secure_token}`);
    } catch (err) {
      setOtpError('Failed to generate queue ticket. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Business Info Header */}
      <div className="bg-[#0C1017] border border-white/10 rounded-3xl p-6 sm:p-8 mb-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white tracking-tight font-sans">
                  {business.name}
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  ● {business.status}
                </span>
              </div>
              <p className="text-xs text-white/50 font-mono mt-0.5">{business.category}</p>
            </div>
          </div>

          <div className="text-xs font-mono text-white/60 space-y-1 sm:text-right">
            <div className="flex items-center sm:justify-end gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>{business.address}</span>
            </div>
            <div className="flex items-center sm:justify-end gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{business.operating_hours}</span>
            </div>
          </div>
        </div>

        {/* Workflow Breadcrumb Indicator */}
        <div className="flex items-center gap-3 pt-6 text-xs font-mono">
          <button
            onClick={() => setStep('SELECT_SERVICE')}
            className={`flex items-center gap-1.5 transition-colors ${
              step === 'SELECT_SERVICE' ? 'text-cyan-400 font-bold' : 'text-white/40'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px]">
              1
            </span>
            <span>Select Service</span>
          </button>

          <span className="text-white/20">→</span>

          <button
            onClick={() => {
              if (selectedService) setStep('ENTER_DETAILS');
            }}
            className={`flex items-center gap-1.5 transition-colors ${
              step === 'ENTER_DETAILS' ? 'text-cyan-400 font-bold' : 'text-white/40'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px]">
              2
            </span>
            <span>Your Information</span>
          </button>

          <span className="text-white/20">→</span>

          <span
            className={`flex items-center gap-1.5 transition-colors ${
              step === 'VERIFY_OTP' ? 'text-cyan-400 font-bold' : 'text-white/40'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px]">
              3
            </span>
            <span>WhatsApp Verification</span>
          </span>
        </div>
      </div>

      {/* STEP 1: SERVICE SELECTION */}
      {step === 'SELECT_SERVICE' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight font-sans">
              Choose a Service
            </h2>
            <p className="text-xs text-white/50 font-mono mt-1">
              Select the care or procedure you would like to queue for today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {services.map((service) => {
              const activeCount = getQueueForService(service.id).length;
              const estWait = activeCount * service.average_duration;
              const isSelected = selectedService?.id === service.id;

              return (
                <div
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  className={`p-6 rounded-3xl border transition-all cursor-pointer relative group flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gradient-to-b from-cyan-950/40 to-surface-100 border-cyan-400 shadow-[0_0_30px_rgba(0,240,255,0.2)]'
                      : 'bg-surface-200 border-white/10 hover:border-white/20'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-4 right-4 text-cyan-400">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight mb-2 font-sans">
                      {service.name}
                    </h3>
                    <p className="text-xs text-white/60 leading-relaxed font-sans mb-6">
                      {service.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5 space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-white/40 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" /> Waiting
                      </span>
                      <span className="font-bold text-white">{activeCount} customers</span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-white/40 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> Est. Wait
                      </span>
                      <span className="font-bold text-cyan-300">
                        {estWait === 0 ? 'No wait' : `~${estWait} min`}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedService(service);
                        setStep('ENTER_DETAILS');
                      }}
                      className={`w-full py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all mt-2 flex items-center justify-center gap-2 ${
                        isSelected
                          ? 'bg-cyan-400 text-black hover:bg-cyan-300 shadow-glow-cyan'
                          : 'bg-surface-100 text-white hover:bg-surface-50 border border-white/10'
                      }`}
                    >
                      <span>JOIN QUEUE</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 2: CUSTOMER REGISTRATION */}
      {step === 'ENTER_DETAILS' && (
        <div className="bg-surface-200 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl animate-in slide-in-from-right-4 duration-300">
          <button
            onClick={() => setStep('SELECT_SERVICE')}
            className="flex items-center gap-1.5 text-xs font-mono text-white/50 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to services</span>
          </button>

          <div className="mb-8">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
              Selected: {selectedService?.name}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1 font-sans">
              Join the queue
            </h2>
            <p className="text-xs text-white/60 font-mono mt-1">
              Enter your details to receive live milestone updates directly via WhatsApp.
            </p>
          </div>

          <form onSubmit={handleContinueToOtp} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-mono uppercase text-white/70 tracking-wider mb-2">
                Full Name <span className="text-cyan-400">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (formErrors.name) setFormErrors((prev) => ({ ...prev, name: undefined }));
                }}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-4 py-3.5 rounded-xl bg-surface-100 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-sans transition-all"
              />
              {formErrors.name && (
                <p className="text-xs text-red-400 flex items-center gap-1.5 mt-2 font-mono">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{formErrors.name}</span>
                </p>
              )}
            </div>

            {/* WhatsApp Number with Country Code */}
            <div>
              <label className="block text-xs font-mono uppercase text-white/70 tracking-wider mb-2">
                WhatsApp Number <span className="text-cyan-400">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  value={phoneCountryCode}
                  onChange={(e) => setPhoneCountryCode(e.target.value)}
                  className="px-3 py-3.5 rounded-xl bg-surface-100 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-cyan-400"
                >
                  <option value="+91">+91 (IN)</option>
                  <option value="+1">+1 (US/CA)</option>
                  <option value="+44">+44 (UK)</option>
                  <option value="+971">+971 (UAE)</option>
                  <option value="+65">+65 (SG)</option>
                  <option value="+61">+61 (AU)</option>
                </select>

                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    if (formErrors.phone) setFormErrors((prev) => ({ ...prev, phone: undefined }));
                  }}
                  placeholder="98765 43210"
                  className="flex-1 px-4 py-3.5 rounded-xl bg-surface-100 border border-white/10 text-white placeholder-white/20 text-sm font-mono focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                />
              </div>
              {formErrors.phone && (
                <p className="text-xs text-red-400 flex items-center gap-1.5 mt-2 font-mono">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{formErrors.phone}</span>
                </p>
              )}
              <p className="text-[11px] text-white/40 font-mono mt-1.5">
                We'll send your secure tracking token and milestone updates to this number.
              </p>
            </div>

            {/* Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={optInWhatsApp}
                  onChange={(e) => {
                    setOptInWhatsApp(e.target.checked);
                    if (formErrors.optIn) setFormErrors((prev) => ({ ...prev, optIn: undefined }));
                  }}
                  className="mt-1 w-4 h-4 rounded bg-surface-100 border-white/20 text-cyan-400 focus:ring-cyan-400"
                />
                <span className="text-xs text-white/70 group-hover:text-white leading-relaxed font-sans">
                  I agree to receive queue-related updates, turn alerts, and service receipts on WhatsApp.
                </span>
              </label>
              {formErrors.optIn && (
                <p className="text-xs text-red-400 flex items-center gap-1.5 mt-2 font-mono">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{formErrors.optIn}</span>
                </p>
              )}
            </div>

            {/* Continue Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-sm uppercase tracking-wider font-mono shadow-[0_0_30px_rgba(0,240,255,0.35)] transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <span>CONTINUE TO VERIFY</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* STEP 3: OTP VERIFICATION MODAL */}
      <Modal
        isOpen={step === 'VERIFY_OTP'}
        onClose={() => setStep('ENTER_DETAILS')}
        title="Verify your WhatsApp"
        subtitle={`We sent a 6-digit verification code to ${phoneCountryCode} ${phoneNumber || '98765 43210'}`}
      >
        <div className="space-y-6">
          <div className="flex justify-between gap-2 max-w-sm mx-auto">
            {otpValues.map((val, idx) => (
              <input
                key={idx}
                id={`otp-input-${idx}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={val}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                className="w-12 h-14 rounded-2xl bg-surface-100 border border-white/15 text-center font-mono font-black text-xl text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all shadow-inner"
              />
            ))}
          </div>

          {otpError && (
            <p className="text-xs text-red-400 text-center font-mono flex items-center justify-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{otpError}</span>
            </p>
          )}

          {/* Quick Demo Fill Helper */}
          <div className="text-center p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs font-mono text-cyan-300">
            <span>Demo Mode: </span>
            <button
              onClick={handleQuickFillDemoOtp}
              className="underline font-bold hover:text-white"
            >
              Click to Auto-fill Code (123456)
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleVerifyAndJoin}
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-sm uppercase tracking-wider font-mono shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>CREATING QUEUE TICKET...</span>
                </>
              ) : (
                <>
                  <span>VERIFY & GET TICKET</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              onClick={() => {
                setOtpCooldown(30);
                setOtpError('');
              }}
              disabled={otpCooldown > 0}
              className="text-xs font-mono text-white/50 hover:text-white transition-colors disabled:opacity-40 py-2"
            >
              {otpCooldown > 0 ? `Resend code in ${otpCooldown}s` : 'Resend code now'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
