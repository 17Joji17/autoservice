import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

import type { Vehicle, Service, Appointment } from './types';

import { appointmentSchema, type AppointmentFormData } from './appointmentSchema';

import { getAvailableTimeSlots } from './appointmentSlots';

type AppointmentFormProps = {
  vehicles: Vehicle[];
  services: Service[];
  appointments: Appointment[];
  onSave: (appointment: Omit<Appointment, 'id' | 'status'>) => void;
  onCancel: () => void;
};

function AppointmentForm({
  vehicles,
  services,
  appointments,
  onSave,
  onCancel,
}: AppointmentFormProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    mode: 'onSubmit',
    defaultValues: {
      vehicleId: vehicles.length > 0 ? String(vehicles[0].id) : '',
      serviceId: '',
      date: '',
      time: '',
      problemDescription: '',
    },
  });

  const selectedServiceId = useWatch({
    control,
    name: 'serviceId',
  });

  const selectedDate = useWatch({
    control,
    name: 'date',
  });

  const selectedService = services.find((service) => service.id === Number(selectedServiceId));

  const availableSlots = getAvailableTimeSlots(
    selectedDate ?? '',
    selectedService,
    appointments,
    services,
  );

  useEffect(() => {
    setValue('time', '');
  }, [selectedServiceId, selectedDate, setValue]);

  function onSubmit(data: AppointmentFormData) {
    const selectedVehicle = vehicles.find((vehicle) => vehicle.id === Number(data.vehicleId));

    const service = services.find((item) => item.id === Number(data.serviceId));

    if (!selectedVehicle || !service) {
      return;
    }

    const currentAvailableSlots = getAvailableTimeSlots(data.date, service, appointments, services);

    if (!currentAvailableSlots.includes(data.time)) {
      setError('time', {
        type: 'manual',
        message: 'Выбранное время больше недоступно',
      });
      return;
    }

    onSave({
      vehicleId: selectedVehicle.id,
      serviceName: service.name,
      problemDescription: data.problemDescription,
      date: data.date,
      time: data.time,
    });
  }

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="vehicle-form">
        <h3>Новая запись на обслуживание</h3>

        <div className="vehicle-form-grid">
          <div className="appointment-form-field">
            <label htmlFor="appointment-vehicle">Автомобиль</label>

            <select
              id="appointment-vehicle"
              className="appointment-select"
              {...register('vehicleId')}
            >
              <option value="">Выберите автомобиль</option>

              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.brand} {vehicle.model} — {vehicle.licensePlate}
                </option>
              ))}
            </select>

            {errors.vehicleId?.message && (
              <span className="appointment-field-error">{errors.vehicleId.message}</span>
            )}
          </div>

          <div className="appointment-form-field">
            <label htmlFor="appointment-service">Услуга</label>

            <select
              id="appointment-service"
              className="appointment-select"
              {...register('serviceId')}
            >
              <option value="">Выберите услугу</option>

              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} — {service.durationMinutes} мин.
                </option>
              ))}
            </select>

            {errors.serviceId?.message && (
              <span className="appointment-field-error">{errors.serviceId.message}</span>
            )}
          </div>

          <Input
            label="Дата обслуживания"
            type="date"
            error={errors.date?.message}
            {...register('date')}
          />

          <div className="appointment-form-field">
            <label htmlFor="appointment-time">Свободное время</label>

            <select
              id="appointment-time"
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

            {selectedService && selectedDate && availableSlots.length === 0 && (
              <span className="appointment-field-error">
                На выбранную дату нет свободных интервалов
              </span>
            )}
          </div>

          <div className="appointment-form-field appointment-form-field--full">
            <label htmlFor="appointment-problem">Описание проблемы</label>

            <textarea
              id="appointment-problem"
              rows={4}
              placeholder="Например, появился посторонний шум при движении..."
              {...register('problemDescription')}
            />

            {errors.problemDescription?.message && (
              <span className="appointment-field-error">{errors.problemDescription.message}</span>
            )}
          </div>
        </div>

        <div className="vehicle-form-actions">
          <Button type="submit">Создать запись</Button>

          <Button type="button" variant="secondary" onClick={onCancel}>
            Отмена
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default AppointmentForm;
