import { z } from 'zod';

function getTodayDate() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export const appointmentSchema = z.object({
  vehicleId: z.string().min(1, 'Выберите автомобиль'),

  serviceId: z.string().min(1, 'Выберите услугу'),

  date: z
    .string()
    .min(1, 'Укажите дату')
    .refine((value) => !value || value >= getTodayDate(), 'Дата не может быть в прошлом'),

  time: z.string().min(1, 'Укажите время'),

  problemDescription: z
    .string()
    .trim()
    .min(10, 'Опишите проблему (минимум 10 символов)')
    .max(500, 'Описание не должно превышать 500 символов'),
});

export type AppointmentFormData = z.infer<typeof appointmentSchema>;
