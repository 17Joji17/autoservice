import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

import type { Appointment, Service } from './types';

import { appointmentSchema, type AppointmentFormData } from './appointmentSchema';

import { getAvailableTimeSlots } from './appointmentSlots';

const rescheduleSchema = appointmentSchema.pick({
  date: true,
  time: true,
});

type RescheduleFormData = Pick<AppointmentFormData, 'date' | 'time'>;

type RescheduleAppointmentFormProps = {
  appointment: Appointment;
  appointments: Appointment[];
  services: Service[];
  onSave: (date: string, time: string) => void;
  onCancel: () => void;
};

function RescheduleAppointmentForm({
  appointment,
  appointments,
  services,
  onSave,
  onCancel,
}: RescheduleAppointmentFormProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    formState: { errors },
  } = useForm<RescheduleFormData>({
    resolver: zodResolver(rescheduleSchema),
    mode: 'onSubmit',
    defaultValues: {
      date: appointment.date,
      time: appointment.time,
    },
  });

  const selectedDate = useWatch({
    control,
    name: 'date',
  });

  const selectedService = services.find((service) => service.name === appointment.serviceName);

  const otherAppointments = appointments.filter((item) => item.id !== appointment.id);

  const availableSlots = getAvailableTimeSlots(
    selectedDate ?? '',
    selectedService,
    otherAppointments,
    services,
  );

  function onSubmit(data: RescheduleFormData) {
    if (!selectedService) {
      setError('time', {
        type: 'manual',
        message: 'Услуга не найдена',
      });
      return;
    }

    const currentAvailableSlots = getAvailableTimeSlots(
      data.date,
      selectedService,
      otherAppointments,
      services,
    );

    if (!currentAvailableSlots.includes(data.time)) {
      setError('time', {
        type: 'manual',
        message: 'Выбранное время недоступно',
      });
      return;
    }

    onSave(data.date, data.time);
  }

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="vehicle-form">
        <h3>Перенос записи</h3>

        <p>
          <strong>Услуга:</strong> {appointment.serviceName}
        </p>

        <p>
          <strong>Текущая дата и время:</strong> {appointment.date} в {appointment.time}
        </p>

        <div className="vehicle-form-grid">
          <Input
            label="Новая дата"
            type="date"
            error={errors.date?.message}
            {...register('date', {
              onChange: () => {
                setValue('time', '');
              },
            })}
          />

          <div className="appointment-form-field">
            <label htmlFor="reschedule-time">Свободное время</label>

            <select
              id="reschedule-time"
              className="appointment-select"
              disabled={!selectedService || !selectedDate || availableSlots.length === 0}
              {...register('time')}
            >
              <option value="">Выберите время</option>

              {availableSlots.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>

            {errors.time?.message && (
              <span className="appointment-field-error">{errors.time.message}</span>
            )}

            {selectedDate && selectedService && availableSlots.length === 0 && (
              <span className="appointment-field-error">
                На выбранную дату нет свободных интервалов
              </span>
            )}
          </div>
        </div>

        <div className="vehicle-form-actions">
          <Button type="submit">Сохранить перенос</Button>

          <Button type="button" variant="secondary" onClick={onCancel}>
            Отмена
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default RescheduleAppointmentForm;
