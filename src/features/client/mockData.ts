import type { Client, Vehicle, Appointment, Service } from './types';

export const mockClient: Client = {
  id: 1,
  name: 'Иван Иванов',
  email: 'ivan@example.com',
  phone: '+7 999 123-45-67',
};

export const mockVehicles: Vehicle[] = [
  {
    id: 1,
    brand: 'Toyota',
    model: 'Camry',
    year: 2020,
    licensePlate: 'А123ВС 78',
  },
  {
    id: 2,
    brand: 'Kia',
    model: 'Rio',
    year: 2018,
    licensePlate: 'М456ОР 78',
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: 1,
    vehicleId: 1,
    serviceName: 'Замена моторного масла',
    problemDescription: 'Плановая замена моторного масла',
    date: '2026-11-20',
    time: '12:00',
    status: 'Подтверждена',
  },
  {
    id: 2,
    vehicleId: 2,
    serviceName: 'Диагностика подвески',
    problemDescription: 'Посторонний шум в области передней подвески',
    date: '2026-11-23',
    time: '15:30',
    status: 'Создана',
  },
];

export const mockServices: Service[] = [
  {
    id: 1,
    name: 'Замена моторного масла',
    description: 'Замена масла и масляного фильтра',
    price: 2500,
    durationMinutes: 60,
  },
  {
    id: 2,
    name: 'Диагностика подвески',
    description: 'Проверка состояния элементов подвески',
    price: 1800,
    durationMinutes: 45,
  },
  {
    id: 3,
    name: 'Комплексная диагностика',
    description: 'Общая проверка основных систем автомобиля',
    price: 3500,
    durationMinutes: 90,
  },
  {
    id: 4,
    name: 'Замена тормозных колодок',
    description: 'Замена тормозных колодок',
    price: 3000,
    durationMinutes: 60,
  },
];
