import { describe, expect, it } from 'vitest';
import { canChangeOrderStatus } from './orderTransitions';

describe('допустимые переходы статуса заказа (FR-20)', () => {
  it('разрешает переходы по процессу', () => {
    expect(canChangeOrderStatus('Создан', 'В работе')).toBe(true);
    expect(canChangeOrderStatus('Создан', 'Отменён')).toBe(true);
    expect(canChangeOrderStatus('В работе', 'Завершён')).toBe(true);
    expect(canChangeOrderStatus('В работе', 'Отменён')).toBe(true);
  });

  it('не позволяет менять закрытые заказы и перескакивать статусы', () => {
    expect(canChangeOrderStatus('Создан', 'Завершён')).toBe(false);
    expect(canChangeOrderStatus('Завершён', 'В работе')).toBe(false);
    expect(canChangeOrderStatus('Отменён', 'Создан')).toBe(false);
  });
});
