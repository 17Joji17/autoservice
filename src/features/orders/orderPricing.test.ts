import { describe, expect, it } from 'vitest';
import { calculateOrderPricing } from './orderPricing';
import type { ServiceOrder } from './types';

const order = (overrides: Partial<ServiceOrder> = {}): ServiceOrder => ({
  id: 1,
  appointmentId: 1,
  status: 'Создан',
  createdAt: '2026-11-17T12:00:00.000Z',
  estimatedServicePrice: 2500,
  works: [],
  parts: [],
  attachments: [],
  ...overrides,
});

describe('расчёт стоимости заказа (FR-23, FR-24)', () => {
  it('использует цену каталога, когда работы ещё не добавлены', () => {
    expect(calculateOrderPricing(order()).preliminaryTotal).toBe(2500);
  });

  it('не складывает дважды каталог и работы', () => {
    const result = calculateOrderPricing(
      order({
        works: [{ id: 1, name: 'Замена масла', quantity: 2, unitPrice: 2500 }],
      }),
    );
    expect(result.preliminaryTotal).toBe(5000);
    expect(result.actualTotal).toBe(5000);
  });

  it('считает количество и стоимость работ и запчастей', () => {
    const result = calculateOrderPricing(
      order({
        works: [{ id: 1, name: 'Работа', quantity: 2, unitPrice: 2500 }],
        parts: [
          { id: 1, name: 'Фильтр', quantity: 1, unitPrice: 800 },
          { id: 2, name: 'Масло', quantity: 4, unitPrice: 600 },
        ],
      }),
    );
    expect(result.worksTotal).toBe(5000);
    expect(result.partsTotal).toBe(3200);
    expect(result.actualTotal).toBe(8200);
  });
});
