import { z } from 'zod';

export const vehicleSchema = z.object({
  brand: z.string().trim().min(2, 'Укажите марку автомобиля').max(50, 'Название слишком длинное'),

  model: z.string().trim().min(1, 'Укажите модель автомобиля').max(50, 'Название слишком длинное'),

  year: z
    .string()
    .trim()
    .regex(/^\d{4}$/, 'Введите год из 4 цифр')
    .refine(
      (year) => Number(year) >= 1900 && Number(year) <= new Date().getFullYear() + 1,
      'Укажите корректный год выпуска',
    ),

  licensePlate: z
    .string()
    .trim()
    .min(5, 'Укажите государственный номер')
    .max(20, 'Государственный номер слишком длинный'),
});

export type VehicleFormData = z.infer<typeof vehicleSchema>;
