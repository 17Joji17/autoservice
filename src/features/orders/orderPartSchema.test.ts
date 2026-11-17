import { describe, expect, it } from 'vitest';
import { orderPartSchema } from './orderPartSchema';

describe('форма запчастей (FR-18)', () => {
  it('принимает корректную позицию', () => {
    expect(
      orderPartSchema.safeParse({ name: 'Масляный фильтр', quantity: '2', unitPrice: '800' })
        .success,
    ).toBe(true);
  });
  it('отклоняет нулевое количество и отрицательную цену', () => {
    expect(
      orderPartSchema.safeParse({ name: 'Масляный фильтр', quantity: '0', unitPrice: '800' })
        .success,
    ).toBe(false);
    expect(
      orderPartSchema.safeParse({ name: 'Масляный фильтр', quantity: '2', unitPrice: '-50' })
        .success,
    ).toBe(false);
  });
});
