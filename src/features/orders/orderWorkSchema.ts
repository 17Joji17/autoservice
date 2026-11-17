import { z } from 'zod';

export const orderWorkSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Название должно содержать минимум 2 символа')
    .max(150, 'Название слишком длинное'),

  quantity: z
    .string()
    .regex(/^[1-9]\d*$/, 'Введите целое количество больше нуля')
    .refine((value) => Number(value) <= 1000, 'Количество не должно превышать 1000'),

  unitPrice: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Введите корректную цену')
    .refine(
      (value) => Number(value) > 0 && Number(value) <= 10000000,
      'Цена должна быть больше нуля и не превышать 10 000 000',
    ),
});

export type OrderWorkFormData = z.infer<typeof orderWorkSchema>;
