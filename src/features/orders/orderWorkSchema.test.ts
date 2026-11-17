import { describe, expect, it } from 'vitest';
import { orderWorkSchema } from './orderWorkSchema';

describe('форма работ (FR-17)', () => {
  it('принимает корректную работу', () => {
    expect(
      orderWorkSchema.safeParse({ name: 'Замена масла', quantity: '1', unitPrice: '2500' }).success,
    ).toBe(true);
  });
  it('отклоняет нулевую цену и дробное количество', () => {
    expect(
      orderWorkSchema.safeParse({ name: 'Замена масла', quantity: '1', unitPrice: '0' }).success,
    ).toBe(false);
    expect(
      orderWorkSchema.safeParse({ name: 'Замена масла', quantity: '1.5', unitPrice: '2500' })
        .success,
    ).toBe(false);
  });
});
