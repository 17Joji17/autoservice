import { useState } from 'react';

import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import AddVehicleForm from '../features/client/AddVehicleForm';
import AppointmentForm from '../features/client/AppointmentForm';
import RescheduleAppointmentForm from '../features/client/RescheduleAppointmentForm';
import EditClientForm from '../features/client/EditClientForm';
import ClientOrdersSection from '../features/orders/ClientOrdersSection';

import { useMockData } from '../context/MockDataContext';

import type { Vehicle, Appointment, Client } from '../features/client/types';

import './ClientPage.css';

function ClientPage() {
  const {
    client,
    setClient,
    vehicles,
    setVehicles,
    appointments,
    setAppointments,
    services,
    orders,
    setOrders,
  } = useMockData();

  const availableServices = services.filter((service) => service.isAvailable !== false);

  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState<number | null>(null);

  const [isAppointmentFormOpen, setIsAppointmentFormOpen] = useState(false);

  const [reschedulingAppointmentId, setReschedulingAppointmentId] = useState<number | null>(null);

  const [notice, setNotice] = useState('');
  const [appointmentNotice, setAppointmentNotice] = useState('');

  const [isClientEditOpen, setIsClientEditOpen] = useState(false);
  const [clientNotice, setClientNotice] = useState('');

  const editingVehicle = vehicles.find((vehicle) => vehicle.id === editingVehicleId);

  const reschedulingAppointment = appointments.find(
    (appointment) => appointment.id === reschedulingAppointmentId,
  );

  function handleSaveVehicle(vehicle: Omit<Vehicle, 'id'>) {
    if (editingVehicleId !== null) {
      setVehicles((currentVehicles) =>
        currentVehicles.map((item) =>
          item.id === editingVehicleId ? { ...vehicle, id: item.id } : item,
        ),
      );

      setNotice('Данные автомобиля успешно обновлены');
    } else {
      setVehicles((currentVehicles) => {
        const nextId = Math.max(0, ...currentVehicles.map((item) => item.id)) + 1;

        return [...currentVehicles, { ...vehicle, id: nextId }];
      });

      setNotice('Автомобиль успешно добавлен в список');
    }

    setIsAddFormOpen(false);
    setEditingVehicleId(null);
  }

  function handleCancelForm() {
    setIsAddFormOpen(false);
    setEditingVehicleId(null);
  }

  function handleSaveAppointment(appointment: Omit<Appointment, 'id' | 'status'>) {
    setAppointments((currentAppointments) => {
      const nextId = Math.max(0, ...currentAppointments.map((item) => item.id)) + 1;

      return [
        ...currentAppointments,
        {
          ...appointment,
          id: nextId,
          status: 'Создана',
        },
      ];
    });

    setIsAppointmentFormOpen(false);
    setAppointmentNotice('Запись успешно создана');
  }

  function handleCancelAppointment() {
    setIsAppointmentFormOpen(false);
  }

  function handleCancelBooking(appointmentId: number) {
    const appointment = appointments.find((item) => item.id === appointmentId);
    const linkedOrder = orders.find((order) => order.appointmentId === appointmentId);
    const isFutureAppointment = appointment
      ? new Date(`${appointment.date}T${appointment.time}`).getTime() > Date.now()
      : false;

    if (
      !appointment ||
      appointment.status === 'Отменена' ||
      !isFutureAppointment ||
      (linkedOrder && linkedOrder.status !== 'Создан')
    ) {
      setAppointmentNotice('Отменить запись уже нельзя');
      return;
    }

    if (linkedOrder && !window.confirm(`Отменить запись и связанный заказ №${linkedOrder.id}?`)) {
      return;
    }

    setAppointments((currentAppointments) =>
      currentAppointments.map((item) =>
        item.id === appointmentId ? { ...item, status: 'Отменена' } : item,
      ),
    );

    if (linkedOrder) {
      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === linkedOrder.id && order.status === 'Создан'
            ? { ...order, status: 'Отменён' }
            : order,
        ),
      );
    }

    if (reschedulingAppointmentId === appointmentId) {
      setReschedulingAppointmentId(null);
    }

    setAppointmentNotice('Запись отменена');
  }

  function handleRescheduleAppointment(date: string, time: string) {
    if (reschedulingAppointmentId === null) {
      return;
    }

    const linkedOrder = orders.find((order) => order.appointmentId === reschedulingAppointmentId);
    if (linkedOrder && linkedOrder.status !== 'Создан') {
      setReschedulingAppointmentId(null);
      setAppointmentNotice('Перенос недоступен: обслуживание уже началось или заказ закрыт');
      return;
    }

    setAppointments((currentAppointments) =>
      currentAppointments.map((appointment) =>
        appointment.id === reschedulingAppointmentId &&
        appointment.status !== 'Отменена' &&
        new Date(`${appointment.date}T${appointment.time}`).getTime() > Date.now()
          ? {
              ...appointment,
              date,
              time,
            }
          : appointment,
      ),
    );

    setReschedulingAppointmentId(null);
    setAppointmentNotice('Запись успешно перенесена');
  }

  function handleSaveClient(data: Omit<Client, 'id'>) {
    setClient((currentClient) => ({
      ...currentClient,
      ...data,
    }));

    setIsClientEditOpen(false);
    setClientNotice('Личные данные успешно обновлены');
  }

  return (
    <div className="client-page">
      <div className="client-heading">
        <div>
          <h1>Личный кабинет</h1>
          <p>Добро пожаловать, {client.name}!</p>
        </div>
      </div>

      <div className="client-summary">
        <Card>
          <h3>Мои автомобили</h3>

          <div className="summary-number">{vehicles.length}</div>

          <p>Добавлено автомобилей</p>
        </Card>

        <Card>
          <h3>Мои записи</h3>

          <div className="summary-number">{appointments.length}</div>

          <p>Всего записей</p>
        </Card>
      </div>

      <section className="client-section">
        <div className="client-section-title">
          <h2>Личные данные</h2>

          <Button
            variant="secondary"
            onClick={() => {
              setIsClientEditOpen((value) => !value);
              setClientNotice('');
            }}
          >
            {isClientEditOpen ? 'Закрыть форму' : 'Редактировать'}
          </Button>
        </div>

        {isClientEditOpen ? (
          <div className="vehicle-add-form">
            <EditClientForm
              client={client}
              onSave={handleSaveClient}
              onCancel={() => setIsClientEditOpen(false)}
            />
          </div>
        ) : (
          <Card>
            <div className="client-info">
              <p>
                <strong>Имя:</strong> {client.name}
              </p>
              <p>
                <strong>Email:</strong> {client.email}
              </p>
              <p>
                <strong>Телефон:</strong> {client.phone}
              </p>
            </div>
          </Card>
        )}

        {clientNotice && (
          <p className="form-message" role="status">
            {clientNotice}
          </p>
        )}
      </section>

      <section className="client-section">
        <div className="client-section-title">
          <h2>Мои автомобили</h2>

          <Button
            onClick={() => {
              setIsAddFormOpen((value) => !value);
              setEditingVehicleId(null);
              setNotice('');
            }}
          >
            {isAddFormOpen ? 'Закрыть форму' : '+ Добавить автомобиль'}
          </Button>
        </div>

        {(isAddFormOpen || editingVehicle) && (
          <div className="vehicle-add-form">
            <AddVehicleForm
              key={editingVehicleId ?? 'new'}
              initialData={editingVehicle}
              onSave={handleSaveVehicle}
              onCancel={handleCancelForm}
            />
          </div>
        )}

        {notice && (
          <p className="form-message" role="status">
            {notice}
          </p>
        )}

        <div className="client-grid">
          {vehicles.map((vehicle) => (
            <Card key={vehicle.id}>
              <div className="vehicle-card">
                <h3>
                  {vehicle.brand} {vehicle.model}
                </h3>

                <p>Год выпуска: {vehicle.year}</p>
                <p>Госномер: {vehicle.licensePlate}</p>

                <div className="vehicle-card-actions">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setEditingVehicleId(vehicle.id);
                      setIsAddFormOpen(false);
                      setNotice('');
                    }}
                  >
                    Редактировать
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="client-section">
        <h2>Каталог услуг</h2>

        {availableServices.length === 0 && <p>Сейчас нет доступных услуг для записи.</p>}

        <div className="client-grid">
          {availableServices.map((service) => (
            <Card key={service.id}>
              <div className="service-card">
                <h3>{service.name}</h3>

                <p>{service.description}</p>

                <div className="service-details">
                  <span>{service.price.toLocaleString('ru-RU')} ₽</span>

                  <span>{service.durationMinutes} мин.</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="client-section">
        <div className="client-section-title">
          <h2>Записи на обслуживание</h2>

          {vehicles.length > 0 && availableServices.length > 0 && (
            <Button
              onClick={() => {
                setIsAppointmentFormOpen((value) => !value);
                setReschedulingAppointmentId(null);
                setAppointmentNotice('');
              }}
            >
              {isAppointmentFormOpen ? 'Закрыть форму' : '+ Записаться'}
            </Button>
          )}
        </div>

        {vehicles.length === 0 && <p>Чтобы создать запись, сначала добавьте автомобиль.</p>}

        {vehicles.length > 0 && availableServices.length === 0 && (
          <p>Новые записи временно недоступны: нет доступных услуг.</p>
        )}

        {isAppointmentFormOpen && vehicles.length > 0 && availableServices.length > 0 && (
          <div className="vehicle-add-form">
            <AppointmentForm
              vehicles={vehicles}
              services={availableServices}
              appointments={appointments}
              onSave={handleSaveAppointment}
              onCancel={handleCancelAppointment}
            />
          </div>
        )}

        {reschedulingAppointment && (
          <div className="vehicle-add-form">
            <RescheduleAppointmentForm
              key={reschedulingAppointment.id}
              appointment={reschedulingAppointment}
              appointments={appointments}
              services={services}
              onSave={handleRescheduleAppointment}
              onCancel={() => {
                setReschedulingAppointmentId(null);
              }}
            />
          </div>
        )}

        {appointmentNotice && (
          <p className="form-message" role="status">
            {appointmentNotice}
          </p>
        )}

        <div className="appointments-list">
          {appointments.map((appointment) => {
            const vehicle = vehicles.find((item) => item.id === appointment.vehicleId);

            const isFutureAppointment =
              new Date(`${appointment.date}T${appointment.time}`).getTime() > Date.now();

            const linkedOrder = orders.find((order) => order.appointmentId === appointment.id);

            const canManageAppointment =
              appointment.status !== 'Отменена' &&
              isFutureAppointment &&
              (!linkedOrder || linkedOrder.status === 'Создан');

            return (
              <Card key={appointment.id}>
                <div className="appointment-card">
                  <div>
                    <h3>{appointment.serviceName}</h3>

                    <p>Автомобиль: {vehicle ? `${vehicle.brand} ${vehicle.model}` : 'Не найден'}</p>

                    <p>
                      <strong>Описание проблемы:</strong> {appointment.problemDescription}
                    </p>

                    <p>Дата: {appointment.date}</p>
                    <p>Время: {appointment.time}</p>
                  </div>

                  <div className="appointment-actions">
                    <span className="appointment-status">{appointment.status}</span>

                    {canManageAppointment && (
                      <>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setReschedulingAppointmentId(appointment.id);
                            setIsAppointmentFormOpen(false);
                            setAppointmentNotice('');
                          }}
                        >
                          Перенести
                        </Button>

                        <Button
                          variant="secondary"
                          onClick={() => handleCancelBooking(appointment.id)}
                        >
                          Отменить запись
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      <ClientOrdersSection />
    </div>
  );
}

export default ClientPage;
