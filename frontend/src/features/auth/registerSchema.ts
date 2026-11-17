import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, 'Имя должно содержать минимум 2 символа'),

    phone: z
      .string()
      .trim()
      .regex(/^[+0-9()\s-]+$/, 'Телефон содержит недопустимые символы')
      .refine((value) => {
        const digits = value.replace(/\D/g, '');
        return digits.length >= 10 && digits.length <= 15;
      }, 'Телефон должен содержать от 10 до 15 цифр'),

    email: z.email('Введите корректную электронную почту'),

    password: z.string().min(8, 'Пароль должен содержать минимум 8 символов'),

    confirmPassword: z.string().min(1, 'Подтвердите пароль'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
