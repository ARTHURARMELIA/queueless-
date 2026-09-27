import { NotificationType, WhatsAppNotification, QueueTicket, Service, Business } from '@/types';

/**
 * Generates official formatted WhatsApp notification text matching the product spec:
 * Concise, professional, milestone-driven, with live tracking URL.
 */
export function buildWhatsAppMessage(
  type: NotificationType,
  data: {
    userName: string;
    tokenNumber: number;
    serviceName: string;
    businessName: string;
    peopleAhead: number;
    estimatedWaitText: string;
    trackingUrl: string;
    counterName?: string;
  }
): string {
  const {
    userName,
    tokenNumber,
    serviceName,
    businessName,
    peopleAhead,
    estimatedWaitText,
    trackingUrl,
    counterName,
  } = data;

  switch (type) {
    case 'JOINED':
      return `*QUEUELESS* | ${businessName}\n\nHi ${userName} 👋\n\nYour queue ticket is active.\n\n🎟 *Token:* #${tokenNumber}\n🩺 *Service:* ${serviceName}\n👥 *People ahead:* ${peopleAhead}\n⏱ *Estimated wait:* ${estimatedWaitText}\n\nWe'll notify you as your turn approaches. You can leave the waiting area.\n\n👉 *View Live Queue:* ${trackingUrl}`;

    case 'TEN_AWAY':
      return `*QUEUELESS* | ${businessName}\n\nHi ${userName},\n\nYou are approximately *10 people away* (Token #${tokenNumber}).\n⏱ *Estimated wait:* ${estimatedWaitText}.\n\n👉 *View Live Queue:* ${trackingUrl}`;

    case 'FIVE_AWAY':
      return `*QUEUELESS* | ${businessName}\n\nHi ${userName},\n\nYou're getting close! *5 people ahead* (Token #${tokenNumber}).\n⏱ *Estimated wait:* ${estimatedWaitText}.\n\nPlease start heading toward ${businessName}.\n\n👉 *View Live Queue:* ${trackingUrl}`;

    case 'TWO_AWAY':
      return `*QUEUELESS* | ${businessName}\n\nHi ${userName},\n\n⚠️ *Please start making your way back.*\nOnly *2 people ahead* for ${serviceName} (Token #${tokenNumber}).\n\n👉 *View Live Queue:* ${trackingUrl}`;

    case 'NEXT':
      return `*QUEUELESS* | ${businessName}\n\n⚡ *You're NEXT!* (Token #${tokenNumber})\n\nPlease be ready at ${counterName || 'the service desk'}.\n\n👉 *View Live Queue:* ${trackingUrl}`;

    case 'CALLED':
      return `*QUEUELESS* | ${businessName}\n\n🔔 *Your token #${tokenNumber} is being called right now!*\n\nPlease proceed immediately to: *${counterName || 'Counter 1'}*.\n\n👉 *View Live Queue:* ${trackingUrl}`;

    case 'COMPLETED':
      return `*QUEUELESS* | ${businessName}\n\n✅ *Service Completed for Token #${tokenNumber}.*\n\nThank you for choosing ${businessName}!\nHow was your experience today? Rate your visit here:\n${trackingUrl}`;

    case 'SKIPPED':
      return `*QUEUELESS* | ${businessName}\n\n⚠️ *Token #${tokenNumber} was missed.*\n\nWe couldn't reach you when your token was called at ${counterName || 'the desk'}. Tap below to view status or request a recall.\n\n👉 *View Live Queue:* ${trackingUrl}`;

    case 'RECALLED':
      return `*QUEUELESS* | ${businessName}\n\n🔄 *Token #${tokenNumber} Recalled!*\n\nYour spot has been reactivated. Please proceed to ${counterName || 'the counter'}.\n\n👉 *View Live Queue:* ${trackingUrl}`;

    case 'CANCELLED':
      return `*QUEUELESS* | ${businessName}\n\n❌ *Queue ticket #${tokenNumber} cancelled.*\n\nYou have left the queue for ${serviceName}. Thank you for using QUEUELESS.`;

    default:
      return `*QUEUELESS* | ${businessName}\nUpdate on Token #${tokenNumber}: ${trackingUrl}`;
  }
}

/**
 * Creates a notification object with unique ID and timestamp.
 */
export function createNotificationRecord(
  type: NotificationType,
  ticket: QueueTicket,
  service: Service,
  business: Business,
  peopleAhead: number,
  estimatedWaitText: string,
  counterName?: string
): WhatsAppNotification {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://queueless.app';
  const trackingUrl = `${origin}/queue/${ticket.secure_token}`;

  const message = buildWhatsAppMessage(type, {
    userName: ticket.user_name.replace(' (You)', ''),
    tokenNumber: ticket.token_number,
    serviceName: service.name,
    businessName: business.name,
    peopleAhead,
    estimatedWaitText,
    trackingUrl,
    counterName: counterName || ticket.counter_name,
  });

  return {
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    ticket_id: ticket.id,
    user_name: ticket.user_name,
    whatsapp_number: ticket.whatsapp_number,
    token_number: ticket.token_number,
    service_name: service.name,
    business_name: business.name,
    type,
    message,
    tracking_url: trackingUrl,
    sent_at: new Date().toISOString(),
    read: false,
  };
}
