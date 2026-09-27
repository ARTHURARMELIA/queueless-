'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  Business,
  Service,
  Counter,
  Staff,
  QueueTicket,
  WhatsAppNotification,
  HourlyAnalytics,
  NotificationType,
} from '@/types';
import {
  DEMO_BUSINESS,
  DEMO_SERVICES,
  DEMO_COUNTERS,
  DEMO_STAFF,
  INITIAL_DEMO_TICKETS,
  DEMO_HOURLY_ANALYTICS,
} from '@/lib/demoData';
import { createNotificationRecord } from '@/lib/notificationService';
import { calculateEstimatedWaitMinutes, formatEstimatedWait } from '@/lib/waitTimeEngine';

interface QueueContextType {
  business: Business;
  services: Service[];
  counters: Counter[];
  staff: Staff[];
  tickets: QueueTicket[];
  notifications: WhatsAppNotification[];
  hourlyAnalytics: HourlyAnalytics[];
  userTicket: QueueTicket | null;
  isWhatsAppOpen: boolean;
  setIsWhatsAppOpen: (open: boolean) => void;
  lastSimulatedEvent: string | null;

  // Actions
  joinQueue: (serviceId: string, userName: string, whatsappNumber: string) => Promise<QueueTicket>;
  callNext: (serviceId: string, counterId: string) => void;
  startServing: (ticketId: string) => void;
  completeService: (ticketId: string) => void;
  skipCustomer: (ticketId: string) => void;
  recallCustomer: (ticketId: string) => void;
  cancelTicket: (ticketId: string) => void;
  submitFeedback: (ticketId: string, rating: number, comment?: string) => void;
  simulateNext: (serviceId?: string) => void;
  resetDemoData: () => void;
  setUserTicketBySecureToken: (token: string) => void;
  markNotificationsRead: () => void;

  // Selectors
  getTicketBySecureToken: (token: string) => QueueTicket | undefined;
  getQueueForService: (serviceId: string) => QueueTicket[];
  getServingTicket: (serviceId?: string, counterId?: string) => QueueTicket | undefined;
  getPeopleAhead: (ticketId: string) => number;
  getEstimatedWaitText: (ticketId: string) => string;
  addService: (newService: Omit<Service, 'id' | 'business_id' | 'created_at'>) => void;
  addStaff: (newStaff: Omit<Staff, 'id' | 'business_id' | 'created_at'>) => void;
  addCounter: (newCounter: Omit<Counter, 'id' | 'business_id' | 'created_at'>) => void;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

const STORAGE_KEY = 'queueless_state_v1';

export function QueueProvider({ children }: { children: React.ReactNode }) {
  const [business, setBusiness] = useState<Business>(DEMO_BUSINESS);
  const [services, setServices] = useState<Service[]>(DEMO_SERVICES);
  const [counters, setCounters] = useState<Counter[]>(DEMO_COUNTERS);
  const [staff, setStaff] = useState<Staff[]>(DEMO_STAFF);
  const [tickets, setTickets] = useState<QueueTicket[]>(INITIAL_DEMO_TICKETS);
  const [notifications, setNotifications] = useState<WhatsAppNotification[]>([]);
  const [hourlyAnalytics, setHourlyAnalytics] = useState<HourlyAnalytics[]>(DEMO_HOURLY_ANALYTICS);
  const [userTicketId, setUserTicketId] = useState<string>('tkt-42');
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [lastSimulatedEvent, setLastSimulatedEvent] = useState<string | null>(null);

  // Initialize and load from localStorage if present
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.tickets) setTickets(parsed.tickets);
        if (parsed.services) setServices(parsed.services);
        if (parsed.counters) setCounters(parsed.counters);
        if (parsed.notifications) setNotifications(parsed.notifications);
        if (parsed.userTicketId) setUserTicketId(parsed.userTicketId);
      } else {
        // Create initial notification for Demo Rahul Sharma (#42)
        const demoTicket = INITIAL_DEMO_TICKETS.find((t) => t.id === 'tkt-42');
        const demoService = DEMO_SERVICES.find((s) => s.id === 'srv-gen-consult');
        if (demoTicket && demoService) {
          const initNotif = createNotificationRecord(
            'JOINED',
            demoTicket,
            demoService,
            DEMO_BUSINESS,
            5,
            '~28 minutes'
          );
          setNotifications([initNotif]);
        }
      }
    } catch (e) {
      console.error('Error loading state from localStorage:', e);
    }
  }, []);

  // Save to localStorage on state changes
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          tickets,
          services,
          counters,
          notifications,
          userTicketId,
        })
      );
    } catch (e) {
      console.error('Error saving state:', e);
    }
  }, [tickets, services, counters, notifications, userTicketId]);

  const userTicket = useMemo(() => {
    return tickets.find((t) => t.id === userTicketId) || null;
  }, [tickets, userTicketId]);

  const setUserTicketBySecureToken = useCallback(
    (token: string) => {
      const found = tickets.find((t) => t.secure_token === token);
      if (found) {
        setUserTicketId(found.id);
      }
    },
    [tickets]
  );

  const getTicketBySecureToken = useCallback(
    (token: string) => {
      return tickets.find((t) => t.secure_token === token);
    },
    [tickets]
  );

  const getQueueForService = useCallback(
    (serviceId: string) => {
      return tickets.filter(
        (t) =>
          t.service_id === serviceId &&
          (t.status === 'WAITING' || t.status === 'CALLED' || t.status === 'SERVING')
      );
    },
    [tickets]
  );

  const getServingTicket = useCallback(
    (serviceId?: string, counterId?: string) => {
      return tickets.find((t) => {
        if (t.status !== 'SERVING') return false;
        if (counterId && t.counter_id !== counterId) return false;
        if (serviceId && t.service_id !== serviceId) return false;
        return true;
      });
    },
    [tickets]
  );

  const getPeopleAhead = useCallback(
    (ticketId: string) => {
      const ticket = tickets.find((t) => t.id === ticketId);
      if (!ticket || ticket.status === 'COMPLETED' || ticket.status === 'CANCELLED') return 0;
      if (ticket.status === 'SERVING') return 0;

      // Filter active tickets in same service ahead in queue
      const activeTickets = tickets.filter(
        (t) =>
          t.service_id === ticket.service_id &&
          (t.status === 'WAITING' || t.status === 'CALLED' || t.status === 'SERVING')
      );

      const targetIndex = activeTickets.findIndex((t) => t.id === ticketId);
      if (targetIndex === -1) return 0;

      // Count only those strictly ahead
      return targetIndex;
    },
    [tickets]
  );

  const getEstimatedWaitText = useCallback(
    (ticketId: string) => {
      const ticket = tickets.find((t) => t.id === ticketId);
      if (!ticket) return '~0 min';
      if (ticket.status === 'SERVING') return 'Being served now';
      if (ticket.status === 'CALLED') return 'Called to counter';

      const peopleAhead = getPeopleAhead(ticketId);
      const service = services.find((s) => s.id === ticket.service_id);
      const avgDuration = service?.average_duration || 8;
      const activeCounters = counters.filter(
        (c) => c.active && (!c.service_id || c.service_id === ticket.service_id)
      ).length;

      const minutes = calculateEstimatedWaitMinutes({
        peopleAhead,
        averageServiceDurationMinutes: avgDuration,
        activeCountersCount: activeCounters || 1,
      });

      return formatEstimatedWait(minutes);
    },
    [tickets, services, counters, getPeopleAhead]
  );

  const checkAndSendMilestoneNotifications = useCallback(
    (updatedTickets: QueueTicket[], affectedServiceId: string) => {
      const service = services.find((s) => s.id === affectedServiceId) || services[0];
      const activeQueue = updatedTickets.filter(
        (t) =>
          t.service_id === affectedServiceId &&
          (t.status === 'WAITING' || t.status === 'CALLED')
      );

      const newNotifs: WhatsAppNotification[] = [];

      activeQueue.forEach((ticket, idx) => {
        const peopleAhead = idx;
        const estWait = formatEstimatedWait(peopleAhead * (service?.average_duration || 8));

        // Check milestones
        let milestoneType: NotificationType | null = null;
        if (ticket.status === 'CALLED') {
          milestoneType = 'CALLED';
        } else if (peopleAhead === 0) {
          milestoneType = 'NEXT';
        } else if (peopleAhead === 2) {
          milestoneType = 'TWO_AWAY';
        } else if (peopleAhead === 5) {
          milestoneType = 'FIVE_AWAY';
        } else if (peopleAhead === 10) {
          milestoneType = 'TEN_AWAY';
        }

        if (milestoneType) {
          // Check if we already sent this notification recently to avoid duplicates
          const alreadySent = notifications.some(
            (n) => n.ticket_id === ticket.id && n.type === milestoneType
          );
          if (!alreadySent) {
            newNotifs.push(
              createNotificationRecord(
                milestoneType,
                ticket,
                service,
                business,
                peopleAhead,
                estWait,
                ticket.counter_name
              )
            );
          }
        }
      });

      if (newNotifs.length > 0) {
        setNotifications((prev) => [...newNotifs, ...prev]);
      }
    },
    [services, business, notifications]
  );

  const joinQueue = useCallback(
    async (serviceId: string, userName: string, whatsappNumber: string): Promise<QueueTicket> => {
      const service = services.find((s) => s.id === serviceId) || services[0];
      const maxToken = tickets.reduce((max, t) => Math.max(max, t.token_number), 35);
      const nextTokenNumber = maxToken + 1;
      const cleanSlug = userName.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10);
      const secureToken = `q-tk-${nextTokenNumber}-${cleanSlug}-${Math.random().toString(36).substring(2, 6)}`;

      const newTicket: QueueTicket = {
        id: `tkt-${nextTokenNumber}-${Date.now().toString(36)}`,
        queue_id: `q-${service.id}`,
        service_id: service.id,
        business_id: business.id,
        user_name: `${userName} (You)`,
        whatsapp_number: whatsappNumber,
        token_number: nextTokenNumber,
        secure_token: secureToken,
        status: 'WAITING',
        joined_at: new Date().toISOString(),
      };

      const updated = [...tickets, newTicket];
      setTickets(updated);
      setUserTicketId(newTicket.id);

      // Count ahead
      const ahead = updated.filter(
        (t) =>
          t.service_id === service.id &&
          (t.status === 'WAITING' || t.status === 'CALLED' || t.status === 'SERVING')
      ).length - 1;

      const waitText = formatEstimatedWait(ahead * (service.average_duration || 8));

      // Create JOINED notification
      const notif = createNotificationRecord(
        'JOINED',
        newTicket,
        service,
        business,
        ahead,
        waitText
      );
      setNotifications((prev) => [notif, ...prev]);
      setLastSimulatedEvent(`Ticket #${nextTokenNumber} joined the queue`);

      return newTicket;
    },
    [tickets, services, business]
  );

  const callNext = useCallback(
    (serviceId: string, counterId: string) => {
      const counter = counters.find((c) => c.id === counterId) || counters[0];
      let updated = [...tickets];

      // Mark any currently serving at this counter as completed
      const currentServing = updated.find(
        (t) => t.counter_id === counterId && t.status === 'SERVING'
      );
      if (currentServing) {
        currentServing.status = 'COMPLETED';
        currentServing.completed_at = new Date().toISOString();
      }

      // Find next WAITING ticket for this service
      const nextTicket = updated.find(
        (t) => t.service_id === serviceId && t.status === 'WAITING'
      );

      if (nextTicket) {
        nextTicket.status = 'CALLED';
        nextTicket.counter_id = counterId;
        nextTicket.counter_name = counter.name;
        nextTicket.called_at = new Date().toISOString();

        setLastSimulatedEvent(`Called Token #${nextTicket.token_number} to ${counter.name}`);

        const service = services.find((s) => s.id === serviceId) || services[0];
        const callNotif = createNotificationRecord(
          'CALLED',
          nextTicket,
          service,
          business,
          0,
          'Your turn now',
          counter.name
        );
        setNotifications((prev) => [callNotif, ...prev]);
      } else {
        setLastSimulatedEvent(`No customers waiting in queue for ${serviceId}`);
      }

      setTickets(updated);
      checkAndSendMilestoneNotifications(updated, serviceId);
    },
    [counters, tickets, services, business, checkAndSendMilestoneNotifications]
  );

  const startServing = useCallback(
    (ticketId: string) => {
      setTickets((prev) =>
        prev.map((t) => {
          if (t.id === ticketId) {
            return {
              ...t,
              status: 'SERVING',
              service_started_at: new Date().toISOString(),
            };
          }
          return t;
        })
      );
    },
    []
  );

  const completeService = useCallback(
    (ticketId: string) => {
      const ticket = tickets.find((t) => t.id === ticketId);
      if (!ticket) return;

      const service = services.find((s) => s.id === ticket.service_id) || services[0];
      const updated = tickets.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: 'COMPLETED' as const,
            completed_at: new Date().toISOString(),
          };
        }
        return t;
      });

      setTickets(updated);
      setLastSimulatedEvent(`Completed service for Token #${ticket.token_number}`);

      const notif = createNotificationRecord(
        'COMPLETED',
        ticket,
        service,
        business,
        0,
        'Finished'
      );
      setNotifications((prev) => [notif, ...prev]);

      // Update hourly analytics customersServed
      setHourlyAnalytics((prev) =>
        prev.map((item, idx) => (idx === 8 ? { ...item, customersServed: item.customersServed + 1 } : item))
      );

      checkAndSendMilestoneNotifications(updated, ticket.service_id);
    },
    [tickets, services, business, checkAndSendMilestoneNotifications]
  );

  const skipCustomer = useCallback(
    (ticketId: string) => {
      const ticket = tickets.find((t) => t.id === ticketId);
      if (!ticket) return;

      const service = services.find((s) => s.id === ticket.service_id) || services[0];
      const updated = tickets.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: 'SKIPPED' as const,
            skipped_at: new Date().toISOString(),
          };
        }
        return t;
      });

      setTickets(updated);
      setLastSimulatedEvent(`Skipped customer Token #${ticket.token_number}`);

      const notif = createNotificationRecord(
        'SKIPPED',
        ticket,
        service,
        business,
        0,
        'Skipped',
        ticket.counter_name
      );
      setNotifications((prev) => [notif, ...prev]);
    },
    [tickets, services, business]
  );

  const recallCustomer = useCallback(
    (ticketId: string) => {
      const ticket = tickets.find((t) => t.id === ticketId);
      if (!ticket) return;

      const service = services.find((s) => s.id === ticket.service_id) || services[0];
      const updated = tickets.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: 'CALLED' as const,
            called_at: new Date().toISOString(),
          };
        }
        return t;
      });

      setTickets(updated);
      setLastSimulatedEvent(`Recalled customer Token #${ticket.token_number}`);

      const notif = createNotificationRecord(
        'RECALLED',
        ticket,
        service,
        business,
        0,
        'Recalled',
        ticket.counter_name || 'Counter 1'
      );
      setNotifications((prev) => [notif, ...prev]);
    },
    [tickets, services, business]
  );

  const cancelTicket = useCallback(
    (ticketId: string) => {
      const ticket = tickets.find((t) => t.id === ticketId);
      if (!ticket) return;

      const service = services.find((s) => s.id === ticket.service_id) || services[0];
      const updated = tickets.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: 'CANCELLED' as const,
            cancelled_at: new Date().toISOString(),
          };
        }
        return t;
      });

      setTickets(updated);
      setLastSimulatedEvent(`Ticket #${ticket.token_number} cancelled by customer`);

      const notif = createNotificationRecord(
        'CANCELLED',
        ticket,
        service,
        business,
        0,
        'Cancelled'
      );
      setNotifications((prev) => [notif, ...prev]);
      checkAndSendMilestoneNotifications(updated, ticket.service_id);
    },
    [tickets, services, business, checkAndSendMilestoneNotifications]
  );

  const submitFeedback = useCallback((ticketId: string, rating: number, comment?: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            feedback_rating: rating,
            feedback_comment: comment,
          };
        }
        return t;
      })
    );
  }, []);

  /**
   * Main demo simulation function:
   * Advances the queue by completing currently serving or called ticket,
   * shifting the next customer into SERVING, and updating remaining tokens.
   */
  const simulateNext = useCallback(
    (targetServiceId?: string) => {
      const serviceId = targetServiceId || services[0]?.id || 'srv-gen-consult';
      const service = services.find((s) => s.id === serviceId) || services[0];
      const activeTickets = tickets.filter(
        (t) =>
          t.service_id === serviceId &&
          (t.status === 'SERVING' || t.status === 'CALLED' || t.status === 'WAITING')
      );

      if (activeTickets.length === 0) {
        setLastSimulatedEvent('Queue is empty. Join as a new customer to test.');
        return;
      }

      const currentServing = activeTickets.find((t) => t.status === 'SERVING');
      const currentCalled = activeTickets.find((t) => t.status === 'CALLED');
      const nextWaiting = activeTickets.find((t) => t.status === 'WAITING');

      let updated = [...tickets];

      if (currentServing) {
        // Complete current serving customer
        const completedIndex = updated.findIndex((t) => t.id === currentServing.id);
        if (completedIndex !== -1) {
          updated[completedIndex] = {
            ...updated[completedIndex],
            status: 'COMPLETED',
            completed_at: new Date().toISOString(),
          };
        }

        // If there was a called customer, move them to SERVING
        if (currentCalled) {
          const calledIndex = updated.findIndex((t) => t.id === currentCalled.id);
          if (calledIndex !== -1) {
            updated[calledIndex] = {
              ...updated[calledIndex],
              status: 'SERVING',
              counter_id: 'cnt-01',
              counter_name: 'Counter 1 (Room 101)',
              service_started_at: new Date().toISOString(),
            };
          }
        } else if (nextWaiting) {
          // No called customer, advance next waiting straight to SERVING
          const nextIndex = updated.findIndex((t) => t.id === nextWaiting.id);
          if (nextIndex !== -1) {
            updated[nextIndex] = {
              ...updated[nextIndex],
              status: 'SERVING',
              counter_id: 'cnt-01',
              counter_name: 'Counter 1 (Room 101)',
              called_at: new Date().toISOString(),
              service_started_at: new Date().toISOString(),
            };
          }
        }
      } else if (currentCalled) {
        // Move called to serving
        const calledIndex = updated.findIndex((t) => t.id === currentCalled.id);
        if (calledIndex !== -1) {
          updated[calledIndex] = {
            ...updated[calledIndex],
            status: 'SERVING',
            service_started_at: new Date().toISOString(),
          };
        }
      } else if (nextWaiting) {
        // Call next waiting
        const nextIndex = updated.findIndex((t) => t.id === nextWaiting.id);
        if (nextIndex !== -1) {
          updated[nextIndex] = {
            ...updated[nextIndex],
            status: 'SERVING',
            counter_id: 'cnt-01',
            counter_name: 'Counter 1 (Room 101)',
            called_at: new Date().toISOString(),
            service_started_at: new Date().toISOString(),
          };
        }
      }

      setTickets(updated);

      // Find who is now serving for event notification
      const nowServing = updated.find((t) => t.service_id === serviceId && t.status === 'SERVING');
      if (nowServing) {
        setLastSimulatedEvent(
          `Queue Advanced → Now Serving Token #${nowServing.token_number} (${nowServing.user_name.replace(' (You)', '')})`
        );
      }

      checkAndSendMilestoneNotifications(updated, serviceId);
    },
    [services, tickets, checkAndSendMilestoneNotifications]
  );

  const resetDemoData = useCallback(() => {
    setTickets(INITIAL_DEMO_TICKETS);
    setServices(DEMO_SERVICES);
    setCounters(DEMO_COUNTERS);
    setStaff(DEMO_STAFF);
    setUserTicketId('tkt-42');

    const demoTicket = INITIAL_DEMO_TICKETS.find((t) => t.id === 'tkt-42')!;
    const demoService = DEMO_SERVICES[0];
    const initNotif = createNotificationRecord(
      'JOINED',
      demoTicket,
      demoService,
      DEMO_BUSINESS,
      5,
      '~28 minutes'
    );
    setNotifications([initNotif]);
    setLastSimulatedEvent('Demo state reset to initial setup (#36 to #42).');
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const markNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const addService = useCallback(
    (newService: Omit<Service, 'id' | 'business_id' | 'created_at'>) => {
      const created: Service = {
        ...newService,
        id: `srv-${Date.now().toString(36)}`,
        business_id: business.id,
        created_at: new Date().toISOString(),
      };
      setServices((prev) => [...prev, created]);
    },
    [business.id]
  );

  const addStaff = useCallback(
    (newStaff: Omit<Staff, 'id' | 'business_id' | 'created_at'>) => {
      const created: Staff = {
        ...newStaff,
        id: `stf-${Date.now().toString(36)}`,
        business_id: business.id,
        created_at: new Date().toISOString(),
      };
      setStaff((prev) => [...prev, created]);
    },
    [business.id]
  );

  const addCounter = useCallback(
    (newCounter: Omit<Counter, 'id' | 'business_id' | 'created_at'>) => {
      const created: Counter = {
        ...newCounter,
        id: `cnt-${Date.now().toString(36)}`,
        business_id: business.id,
        created_at: new Date().toISOString(),
      };
      setCounters((prev) => [...prev, created]);
    },
    [business.id]
  );

  return (
    <QueueContext.Provider
      value={{
        business,
        services,
        counters,
        staff,
        tickets,
        notifications,
        hourlyAnalytics,
        userTicket,
        isWhatsAppOpen,
        setIsWhatsAppOpen,
        lastSimulatedEvent,
        joinQueue,
        callNext,
        startServing,
        completeService,
        skipCustomer,
        recallCustomer,
        cancelTicket,
        submitFeedback,
        simulateNext,
        resetDemoData,
        setUserTicketBySecureToken,
        markNotificationsRead,
        getTicketBySecureToken,
        getQueueForService,
        getServingTicket,
        getPeopleAhead,
        getEstimatedWaitText,
        addService,
        addStaff,
        addCounter,
      }}
    >
      {children}
    </QueueContext.Provider>
  );
}

export function useQueue() {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
}
