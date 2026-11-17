import { createContext, useContext } from 'react';

import type { Dispatch, SetStateAction } from 'react';

import type { Client, Vehicle, Appointment, Service } from '../features/client/types';

import type { ServiceOrder } from '../features/orders/types';

export type MockDataContextValue = {
  client: Client;
  setClient: Dispatch<SetStateAction<Client>>;

  vehicles: Vehicle[];
  setVehicles: Dispatch<SetStateAction<Vehicle[]>>;

  appointments: Appointment[];
  setAppointments: Dispatch<SetStateAction<Appointment[]>>;

  services: Service[];
  setServices: Dispatch<SetStateAction<Service[]>>;

  orders: ServiceOrder[];
  setOrders: Dispatch<SetStateAction<ServiceOrder[]>>;
};

export const MockDataContext = createContext<MockDataContextValue | null>(null);

export function useMockData(): MockDataContextValue {
  const context = useContext(MockDataContext);

  if (!context) {
    throw new Error('useMockData должен использоваться внутри MockDataProvider');
  }

  return context;
}
