import type { Appointment, Service } from './types';

const OPENING_TIME = 9 * 60;
const CLOSING_TIME = 18 * 60;
const SLOT_STEP = 30;

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

function getTodayDate(): string {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function getAvailableTimeSlots(
  date: string,
  service: Service | undefined,
  appointments: Appointment[],
  services: Service[],
): string[] {
  if (!date || !service || date < getTodayDate()) {
    return [];
  }

  const availableSlots: string[] = [];

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (
    let start = OPENING_TIME;
    start + service.durationMinutes <= CLOSING_TIME;
    start += SLOT_STEP
  ) {
    const end = start + service.durationMinutes;

    if (date === getTodayDate() && start <= currentMinutes) {
      continue;
    }

    const hasConflict = appointments.some((appointment) => {
      if (appointment.date !== date || appointment.status === 'Отменена') {
        return false;
      }

      const existingService = services.find((item) => item.name === appointment.serviceName);

      const existingStart = timeToMinutes(appointment.time);
      const existingEnd = existingStart + (existingService?.durationMinutes ?? 60);

      return start < existingEnd && end > existingStart;
    });

    if (!hasConflict) {
      availableSlots.push(minutesToTime(start));
    }
  }

  return availableSlots;
}
