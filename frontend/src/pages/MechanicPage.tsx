import { useState } from 'react';

import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

import { useMockData } from '../context/MockDataContext';
import { mockMechanics } from '../features/orders/mockMechanics';
import OrderAttachmentList from '../features/orders/OrderAttachmentList';
import type { ServiceOrderStatus } from '../features/orders/types';

import './MechanicPage.css';

type OrderStatusFilter = 'Все' | ServiceOrderStatus;

const statusFilters: OrderStatusFilter[] = ['Все', 'Создан', 'В работе', 'Завершён', 'Отменён'];

function MechanicPage() {
  const { client, vehicles, appointments, orders } = useMockData();

  const [selectedMechanicId, setSelectedMechanicId] = useState<number>(mockMechanics[0]?.id ?? 0);
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>('Все');

  const selectedMechanic = mockMechanics.find((mechanic) => mechanic.id === selectedMechanicId);

  const assignedOrders = orders
    .map((order) => ({
      order,
      assignedWorks: order.works.filter((work) => work.mechanicId === selectedMechanicId),
    }))
    .filter(({ assignedWorks }) => assignedWorks.length > 0);

  const filteredOrders = assignedOrders.filter(
    ({ order }) => statusFilter === 'Все' || order.status === statusFilter,
  );

  const totalAssignedWorks = assignedOrders.reduce(
    (sum, { assignedWorks }) => sum + assignedWorks.length,
    0,
  );
  const activeOrdersCount = assignedOrders.filter(
    ({ order }) => order.status === 'В работе',
  ).length;
  const completedOrdersCount = assignedOrders.filter(
    ({ order }) => order.status === 'Завершён',
  ).length;

  return (
    <div className="mechanic-page">
      <div className="mechanic-heading">
        <h1>Кабинет механика</h1>
        <p>Просмотр назначенных работ и заказов на обслуживание</p>
      </div>

      <Card>
        <div className="mechanic-selector">
          <div>
            <h2>Выбор сотрудника</h2>
            <p>Временный выбор механика для проверки работы интерфейса</p>
          </div>

          <div className="mechanic-selector-field">
            <label htmlFor="mechanic-select">Механик</label>
            <select
              id="mechanic-select"
              className="appointment-select"
              value={selectedMechanicId}
              onChange={(event) => {
                setSelectedMechanicId(Number(event.target.value));
                setStatusFilter('Все');
              }}
            >
              {mockMechanics.map((mechanic) => (
                <option key={mechanic.id} value={mechanic.id}>
                  {mechanic.name}
                </option>
              ))}
            </select>
          </div>

          {selectedMechanic && (
            <div className="mechanic-specialization">
              <strong>Специализация:</strong> {selectedMechanic.specialization}
            </div>
          )}
        </div>
      </Card>

      <div className="mechanic-summary">
        <Card>
          <h3>Мои заказы</h3>
          <div className="mechanic-summary-number">{assignedOrders.length}</div>
          <p>Заказы с назначенными работами</p>
        </Card>
        <Card>
          <h3>Назначенные работы</h3>
          <div className="mechanic-summary-number">{totalAssignedWorks}</div>
          <p>Всего работ</p>
        </Card>
        <Card>
          <h3>В работе</h3>
          <div className="mechanic-summary-number">{activeOrdersCount}</div>
          <p>Активные заказы</p>
        </Card>
        <Card>
          <h3>Завершённые</h3>
          <div className="mechanic-summary-number">{completedOrdersCount}</div>
          <p>Завершённые заказы</p>
        </Card>
      </div>

      <section className="mechanic-section">
        <h2>Мои заказы и работы</h2>
        <div className="mechanic-filters">
          {statusFilters.map((filter) => (
            <Button
              key={filter}
              variant={statusFilter === filter ? 'primary' : 'secondary'}
              onClick={() => setStatusFilter(filter)}
            >
              {filter}
            </Button>
          ))}
        </div>

        <div className="mechanic-orders">
          {filteredOrders.length === 0 ? (
            <Card>
              <div className="mechanic-empty">
                <h3>Заказы не найдены</h3>
                <p>
                  {assignedOrders.length === 0
                    ? 'Для выбранного механика пока нет назначенных работ.'
                    : 'Заказы с выбранным статусом отсутствуют.'}
                </p>
              </div>
            </Card>
          ) : (
            filteredOrders.map(({ order, assignedWorks }) => {
              const appointment = appointments.find((item) => item.id === order.appointmentId);
              const vehicle = vehicles.find((item) => item.id === appointment?.vehicleId);
              const assignedWorksTotal = assignedWorks.reduce(
                (sum, work) => sum + work.quantity * work.unitPrice,
                0,
              );

              return (
                <Card key={order.id}>
                  <div className="mechanic-order">
                    <div className="mechanic-order-heading">
                      <div>
                        <h3>Заказ №{order.id}</h3>
                        <p>Запись №{order.appointmentId}</p>
                      </div>
                      <span className="mechanic-order-status" data-status={order.status}>
                        {order.status}
                      </span>
                    </div>

                    <div className="mechanic-order-info">
                      <p>
                        <strong>Клиент:</strong> {client.name}
                      </p>
                      <p>
                        <strong>Телефон:</strong> {client.phone}
                      </p>
                      <p>
                        <strong>Автомобиль:</strong>{' '}
                        {vehicle ? `${vehicle.brand} ${vehicle.model}` : 'Не найден'}
                      </p>
                      <p>
                        <strong>Госномер:</strong> {vehicle?.licensePlate ?? 'Не указан'}
                      </p>
                      <p>
                        <strong>Услуга:</strong> {appointment?.serviceName ?? 'Не найдена'}
                      </p>
                      <p>
                        <strong>Дата записи:</strong> {appointment?.date ?? 'Не указана'}
                      </p>
                      <p>
                        <strong>Время записи:</strong> {appointment?.time ?? 'Не указано'}
                      </p>
                      <p>
                        <strong>Дата создания заказа:</strong>{' '}
                        {new Date(order.createdAt).toLocaleString('ru-RU')}
                      </p>
                    </div>

                    <div className="mechanic-problem">
                      <h4>Описание проблемы</h4>
                      <p>{appointment?.problemDescription || 'Описание отсутствует'}</p>
                    </div>

                    <div className="mechanic-work-section">
                      <h4>Назначенные мне работы</h4>
                      <div className="mechanic-work-list">
                        {assignedWorks.map((work) => (
                          <div className="mechanic-work-item" key={work.id}>
                            <div>
                              <strong>{work.name}</strong>
                              <p>Количество: {work.quantity}</p>
                              <p>Цена за единицу: {work.unitPrice.toLocaleString('ru-RU')} ₽</p>
                            </div>
                            <strong>
                              {(work.quantity * work.unitPrice).toLocaleString('ru-RU')} ₽
                            </strong>
                          </div>
                        ))}
                      </div>
                      <div className="mechanic-work-total">
                        <strong>Стоимость назначенных работ:</strong>
                        <strong>{assignedWorksTotal.toLocaleString('ru-RU')} ₽</strong>
                      </div>
                    </div>

                    <div className="mechanic-work-section">
                      <h4>Фотографии и документы</h4>
                      <OrderAttachmentList attachments={order.attachments ?? []} />
                    </div>

                    <div className="mechanic-status-info">
                      {order.status === 'Создан' && (
                        <p>Заказ создан. Ожидается начало обслуживания.</p>
                      )}
                      {order.status === 'В работе' && <p>Заказ находится в работе.</p>}
                      {order.status === 'Завершён' && <p>Обслуживание завершено.</p>}
                      {order.status === 'Отменён' && <p>Заказ отменён.</p>}
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}

export default MechanicPage;
