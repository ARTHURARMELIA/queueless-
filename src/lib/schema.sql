-- =========================================================================
-- QUEUELESS PostgreSQL / Supabase Database Schema
-- Entities: Users, Businesses, Services, Staff, Counters, Queues,
--           QueueTickets, QueueEvents, Notifications, Feedback
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL UNIQUE,
  whatsapp_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BUSINESSES TABLE
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  logo TEXT,
  description TEXT,
  operating_hours TEXT,
  status TEXT DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CLOSED', 'BUSY')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SERVICES TABLE
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  average_duration INTEGER NOT NULL DEFAULT 8, -- minutes
  max_queue_size INTEGER NOT NULL DEFAULT 50,
  online_joining BOOLEAN DEFAULT TRUE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. COUNTERS TABLE
CREATE TABLE IF NOT EXISTS counters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. STAFF TABLE
CREATE TABLE IF NOT EXISTS staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'STAFF' CHECK (role IN ('ADMIN', 'STAFF')),
  counter_id UUID REFERENCES counters(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'ON_BREAK', 'OFFLINE')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. QUEUES TABLE
CREATE TABLE IF NOT EXISTS queues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  current_token INTEGER DEFAULT 0,
  status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'PAUSED', 'CLOSED')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. QUEUE TICKETS TABLE
CREATE TABLE IF NOT EXISTS queue_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  queue_id UUID REFERENCES queues(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  token_number INTEGER NOT NULL,
  secure_token TEXT NOT NULL UNIQUE,
  counter_id UUID REFERENCES counters(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'WAITING' CHECK (status IN ('WAITING', 'CALLED', 'SERVING', 'COMPLETED', 'SKIPPED', 'RECALLED', 'CANCELLED', 'NO_SHOW')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  called_at TIMESTAMPTZ,
  service_started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  skipped_at TIMESTAMPTZ,
  feedback_rating INTEGER CHECK (feedback_rating BETWEEN 1 AND 5),
  feedback_comment TEXT
);

-- 8. QUEUE EVENTS (Audit Trail)
CREATE TABLE IF NOT EXISTS queue_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID REFERENCES queue_tickets(id) ON DELETE CASCADE,
  token_number INTEGER NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'ticket_created', 'ticket_called', 'ticket_serving', 'ticket_completed',
    'ticket_skipped', 'ticket_recalled', 'ticket_cancelled', 'ticket_no_show'
  )),
  details JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 9. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID REFERENCES queue_tickets(id) ON DELETE CASCADE,
  channel TEXT DEFAULT 'WHATSAPP' CHECK (channel IN ('WHATSAPP', 'SMS')),
  type TEXT NOT NULL CHECK (type IN (
    'JOINED', 'TEN_AWAY', 'FIVE_AWAY', 'TWO_AWAY', 'NEXT', 'CALLED', 'CANCELLED', 'COMPLETED', 'SKIPPED', 'RECALLED'
  )),
  status TEXT DEFAULT 'DELIVERED',
  message TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Indexes for fast real-time queries
CREATE INDEX IF NOT EXISTS idx_tickets_secure_token ON queue_tickets(secure_token);
CREATE INDEX IF NOT EXISTS idx_tickets_service_status ON queue_tickets(service_id, status);
CREATE INDEX IF NOT EXISTS idx_tickets_queue_status ON queue_tickets(queue_id, status);

-- Enable Supabase Realtime Replication for Live Subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE queue_tickets;
ALTER PUBLICATION supabase_realtime ADD TABLE queues;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
