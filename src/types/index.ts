export type QueueStatus =
  | 'WAITING'
  | 'CALLED'
  | 'SERVING'
  | 'COMPLETED'
  | 'SKIPPED'
  | 'RECALLED'
  | 'CANCELLED'
  | 'NO_SHOW';

export type StaffRole = 'ADMIN' | 'STAFF';

export type NotificationType =
  | 'JOINED'
  | 'TEN_AWAY'
  | 'FIVE_AWAY'
  | 'TWO_AWAY'
  | 'NEXT'
  | 'CALLED'
  | 'COMPLETED'
  | 'SKIPPED'
  | 'RECALLED'
  | 'CANCELLED';

export interface User {
  id: string;
  name: string;
  whatsapp_number: string;
  whatsapp_verified: boolean;
  created_at: string;
}

export interface Business {
  id: string;
  name: string;
  slug: string;
  category: string;
  address: string;
  phone: string;
  logo?: string;
  description: string;
  operating_hours: string;
  status: 'OPEN' | 'CLOSED' | 'BUSY';
  created_at: string;
}

export interface Service {
  id: string;
  business_id: string;
  name: string;
  description: string;
  average_duration: number; // in minutes
  max_queue_size: number;
  online_joining: boolean;
  active: boolean;
  created_at: string;
}

export interface Counter {
  id: string;
  business_id: string;
  name: string;
  service_id?: string;
  active: boolean;
  current_ticket_id?: string;
  created_at: string;
}

export interface Staff {
  id: string;
  business_id: string;
  name: string;
  email: string;
  role: StaffRole;
  counter_id?: string;
  service_id?: string;
  status: 'ACTIVE' | 'ON_BREAK' | 'OFFLINE';
  created_at: string;
}

export interface Queue {
  id: string;
  service_id: string;
  business_id: string;
  current_token: number;
  status: 'ACTIVE' | 'PAUSED' | 'CLOSED';
  created_at: string;
}

export interface QueueTicket {
  id: string;
  queue_id: string;
  service_id: string;
  business_id: string;
  user_name: string;
  whatsapp_number: string;
  token_number: number;
  secure_token: string;
  counter_id?: string;
  counter_name?: string;
  status: QueueStatus;
  joined_at: string;
  called_at?: string;
  service_started_at?: string;
  completed_at?: string;
  cancelled_at?: string;
  skipped_at?: string;
  feedback_rating?: number;
  feedback_comment?: string;
}

export interface QueueEvent {
  id: string;
  ticket_id: string;
  token_number: number;
  event_type:
    | 'ticket_created'
    | 'ticket_called'
    | 'ticket_serving'
    | 'ticket_completed'
    | 'ticket_skipped'
    | 'ticket_recalled'
    | 'ticket_cancelled'
    | 'ticket_no_show';
  timestamp: string;
  details?: string;
}

export interface WhatsAppNotification {
  id: string;
  ticket_id: string;
  user_name: string;
  whatsapp_number: string;
  token_number: number;
  service_name: string;
  business_name: string;
  type: NotificationType;
  message: string;
  tracking_url: string;
  sent_at: string;
  read: boolean;
}

export interface HourlyAnalytics {
  hour: string; // e.g. "9 AM", "10 AM"
  hourNum: number;
  customersServed: number;
  avgWaitMinutes: number;
  avgServiceMinutes: number;
  peakQueueLength: number;
}
