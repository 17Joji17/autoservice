import type { ServiceOrderStatus } from './types';

export const allowedTransitions: Record<ServiceOrderStatus, ServiceOrderStatus[]> = {
  Создан: ['В работе', 'Отменён'],
  'В работе': ['Завершён', 'Отменён'],
  Завершён: [],
  Отменён: [],
};

export function canChangeOrderStatus(
  current: ServiceOrderStatus,
  next: ServiceOrderStatus,
): boolean {
  return allowedTransitions[current].includes(next);
}
