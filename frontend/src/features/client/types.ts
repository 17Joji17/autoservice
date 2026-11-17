export type Vehicle = {
  id: number;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
};

export type AppointmentStatus = 'Создана' | 'Подтверждена' | 'Отменена';

export type Appointment = {
  id: number;
  vehicleId: number;
  serviceName: string;
  problemDescription: string;
  date: string;
  time: string;
  status: AppointmentStatus;
};

export type Client = {
  id: number;
  name: string;
  email: string;
  phone: string;
};

export type Service = {
  id: number;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  isAvailable?: boolean;
};
