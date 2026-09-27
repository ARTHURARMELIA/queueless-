/**
 * Wait-Time Engine for Queueless
 * Computes dynamic wait times based on queue position, service configuration,
 * active counters, and real-time velocity.
 */

export interface WaitTimeParams {
  peopleAhead: number;
  averageServiceDurationMinutes: number;
  activeCountersCount?: number;
  historicalVelocityFactor?: number; // 0.8 to 1.2 depending on time of day
}

export function calculateEstimatedWaitMinutes(params: WaitTimeParams): number {
  const {
    peopleAhead,
    averageServiceDurationMinutes,
    activeCountersCount = 1,
    historicalVelocityFactor = 1.0,
  } = params;

  if (peopleAhead <= 0) {
    return 0;
  }

  const counters = Math.max(1, activeCountersCount);
  const rawMinutes = (peopleAhead * averageServiceDurationMinutes * historicalVelocityFactor) / counters;

  return Math.max(1, Math.round(rawMinutes));
}

export function formatEstimatedWait(minutes: number): string {
  if (minutes <= 0) {
    return 'Your turn now';
  }
  if (minutes === 1) {
    return '~1 minute';
  }
  if (minutes < 60) {
    return `~${minutes} minutes`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `~${hours} hr${hours > 1 ? 's' : ''}`;
  }
  return `~${hours} hr ${remainingMinutes} min`;
}

export function formatElapsedTime(startedAtIso?: string): string {
  if (!startedAtIso) return '00:00';
  const start = new Date(startedAtIso).getTime();
  const now = Date.now();
  const diffSec = Math.max(0, Math.floor((now - start) / 1000));
  const mins = Math.floor(diffSec / 60);
  const secs = diffSec % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
