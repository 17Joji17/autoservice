import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Введите корректную электронную почту'),

  password: z.string().min(1, 'Введите пароль'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
