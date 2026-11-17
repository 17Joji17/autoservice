import { useState } from 'react';
import type { ReactNode } from 'react';

import { MockDataContext } from './MockDataContext';

import type { Client, Vehicle, Appointment, Service } from '../features/client/types';

import type { ServiceOrder } from '../features/orders/types';

import {
  mockClient,
  mockVehicles,
  mockAppointments,
  mockServices,
} from '../features/client/mockData';

type MockDataProviderProps = {
  children: ReactNode;
};

function MockDataProvider({ children }: MockDataProviderProps) {
  const [client, setClient] = useState<Client>(mockClient);

  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);

  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);

  const [services, setServices] = useState<Service[]>(mockServices);

  const [orders, setOrders] = useState<ServiceOrder[]>([]);

  return (
    <MockDataContext.Provider
      value={{
        client,
        setClient,
        vehicles,
        setVehicles,
        appointments,
        setAppointments,
        services,
        setServices,
        orders,
        setOrders,
      }}
    >
      {children}
    </MockDataContext.Provider>
  );
}

export default MockDataProvider;
