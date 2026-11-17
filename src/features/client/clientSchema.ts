import { z } from 'zod';

export const clientSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Имя должно содержать минимум 2 символа')
    .max(100, 'Имя слишком длинное'),

  email: z.string().trim().email('Введите корректный email'),

  phone: z
    .string()
    .trim()
    .min(10, 'Введите корректный номер телефона')
    .max(25, 'Номер телефона слишком длинный')
    .regex(/^[+\d\s()\-]+$/, 'Номер содержит недопустимые символы')
    .refine(
      (value) => value.replace(/\D/g, '').length >= 10,
      'Номер должен содержать минимум 10 цифр',
    ),
});

export type ClientFormData = z.infer<typeof clientSchema>;
