import { useState } from 'react';

import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

import AddOrderWorkForm from '../features/orders/AddOrderWorkForm';
import AddOrderPartForm from '../features/orders/AddOrderPartForm';
import AssignWorkExecutor from '../features/orders/AssignWorkExecutor';
import OrderPricingSummary from '../features/orders/OrderPricingSummary';
import OrderAttachmentsPanel from '../features/orders/OrderAttachmentsPanel';
import { mockMechanics } from '../features/orders/mockMechanics';
import { allowedTransitions } from '../features/orders/orderTransitions';

import { useMockData } from '../context/MockDataContext';

import type { Appointment } from '../features/client/types';
import type {
  ServiceOrder,
  ServiceOrderStatus,
  OrderWork,
  OrderPart,
  OrderAttachment,
} from '../features/orders/types';

import './ReceptionPage.css';

type StatusFilter = 'Все' | Appointment['status'];
type OrderStatusFilter = 'Все' | ServiceOrderStatus;
type MechanicFilter = string;

const statusFilters: StatusFilter[] = ['Все', 'Создана', 'Подтверждена', 'Отменена'];

const orderStatusOptions: OrderStatusFilter[] = [
  'Все',
  'Создан',
  'В работе',
  'Завершён',
  'Отменён',
];

function ReceptionPage() {
  const { client, vehicles, appointments, services, orders, setOrders } = useMockData();

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('Все');
  const [appointmentDateFilter, setAppointmentDateFilter] = useState('');
  const [appointmentMechanicFilter, setAppointmentMechanicFilter] = useState<MechanicFilter>('all');

  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<OrderStatusFilter>('Все');
  const [orderDateFilter, setOrderDateFilter] = useState('');
  const [orderMechanicFilter, setOrderMechanicFilter] = useState<MechanicFilter>('all');

  const [orderNotice, setOrderNotice] = useState('');
  const [addingWorkOrderId, setAddingWorkOrderId] = useState<number | null>(null);
  const [addingPartOrderId, setAddingPartOrderId] = useState<number | null>(null);

  function matchesMechanic(
    order: ServiceOrder | undefined,
    mechanicFilter: MechanicFilter,
  ): boolean {
    if (mechanicFilter === 'all') {
      return true;
    }

    if (mechanicFilter === 'unassigned') {
      return !order || order.works.every((work) => work.mechanicId == null);
    }

    return order?.works.some((work) => String(work.mechanicId) === mechanicFilter) ?? false;
  }

  const filteredAppointments = appointments.filter((appointment) => {
    if (statusFilter !== 'Все' && appointment.status !== statusFilter) {
      return false;
    }

    if (appointmentDateFilter && appointment.date !== appointmentDateFilter) {
      return false;
    }

    const relatedOrder = orders.find((order) => order.appointmentId === appointment.id);

    return matchesMechanic(relatedOrder, appointmentMechanicFilter);
  });

  const normalizedOrderSearch = orderSearchQuery.trim().toLocaleLowerCase('ru-RU');

  const filteredOrders = orders.filter((order) => {
    if (orderStatusFilter !== 'Все' && order.status !== orderStatusFilter) {
      return false;
    }

    const appointment = appointments.find((item) => item.id === order.appointmentId);

    if (orderDateFilter && appointment?.date !== orderDateFilter) {
      return false;
    }

    if (!matchesMechanic(order, orderMechanicFilter)) {
      return false;
    }

    if (!normalizedOrderSearch) {
      return true;
    }

    const vehicle = vehicles.find((item) => item.id === appointment?.vehicleId);

    const searchableValues = [
      String(order.id),
      `Заказ №${order.id}`,
      client.name,
      client.email,
      client.phone,
      vehicle?.brand,
      vehicle?.model,
      vehicle?.licensePlate,
      `${vehicle?.brand ?? ''} ${vehicle?.model ?? ''}`,
    ];

    return searchableValues.some((value) =>
      (value ?? '').toLocaleLowerCase('ru-RU').includes(normalizedOrderSearch),
    );
  });

  const createdCount = appointments.filter(
    (appointment) => appointment.status === 'Создана',
  ).length;

  const confirmedCount = appointments.filter(
    (appointment) => appointment.status === 'Подтверждена',
  ).length;

  function handleCreateOrder(appointmentId: number) {
    const appointment = appointments.find((item) => item.id === appointmentId);

    if (!appointment || appointment.status === 'Отменена') {
      return;
    }

    if (orders.some((order) => order.appointmentId === appointmentId)) {
      return;
    }

    const nextId = Math.max(0, ...orders.map((order) => order.id)) + 1;

    const selectedService = services.find((service) => service.name === appointment.serviceName);

    const newOrder: ServiceOrder = {
      id: nextId,
      appointmentId,
      status: 'Создан',
      createdAt: new Date().toISOString(),
      works: [],
      parts: [],
      attachments: [],
      estimatedServicePrice: selectedService?.price ?? 0,
    };

    setOrders((currentOrders) => [...currentOrders, newOrder]);
    setOrderNotice(`Заказ №${nextId} успешно создан`);
  }

  function handleAddWork(orderId: number, work: Omit<OrderWork, 'id'>) {
    const currentOrder = orders.find((order) => order.id === orderId);
    if (!currentOrder || currentOrder.status !== 'Создан') {
      return;
    }

    setOrders((currentOrders) =>
      currentOrders.map((order) => {
        if (order.id !== orderId || order.status !== 'Создан') {
          return order;
        }

        const nextWorkId = Math.max(0, ...order.works.map((item) => item.id)) + 1;

        return {
          ...order,
          works: [...order.works, { ...work, id: nextWorkId, mechanicId: null }],
        };
      }),
    );

    setAddingWorkOrderId(null);
    setOrderNotice(`Работа добавлена в заказ №${orderId}`);
  }

  function handleAddPart(orderId: number, part: Omit<OrderPart, 'id'>) {
    const currentOrder = orders.find((order) => order.id === orderId);
    if (!currentOrder || currentOrder.status !== 'Создан') {
      return;
    }

    setOrders((currentOrders) =>
      currentOrders.map((order) => {
        if (order.id !== orderId || order.status !== 'Создан') {
          return order;
        }

        const nextPartId = Math.max(0, ...order.parts.map((item) => item.id)) + 1;

        return {
          ...order,
          parts: [...order.parts, { ...part, id: nextPartId }],
        };
      }),
    );

    setAddingPartOrderId(null);
    setOrderNotice(`Запчасть добавлена в заказ №${orderId}`);
  }

  function handleAddAttachments(orderId: number, files: File[]) {
    if (files.length === 0) return;

    const currentOrder = orders.find((order) => order.id === orderId);
    if (!currentOrder || currentOrder.status === 'Завершён' || currentOrder.status === 'Отменён') {
      return;
    }

    setOrders((currentOrders) =>
      currentOrders.map((order) => {
        if (order.id !== orderId || order.status === 'Завершён' || order.status === 'Отменён') {
          return order;
        }

        const existing = order.attachments ?? [];
        const freeSlots = Math.max(0, 10 - existing.length);
        const nextId = Math.max(0, ...existing.map((item) => item.id)) + 1;
        const uploadedAt = new Date().toISOString();
        const added: OrderAttachment[] = files.slice(0, freeSlots).map((file, index) => ({
          id: nextId + index,
          name: file.name,
          mimeType: file.type || 'application/octet-stream',
          size: file.size,
          uploadedAt,
          file,
        }));

        return { ...order, attachments: [...existing, ...added] };
      }),
    );
    setOrderNotice(`Файлы добавлены к заказу №${orderId}`);
  }

  function handleDeleteAttachment(orderId: number, attachmentId: number) {
    const currentOrder = orders.find((order) => order.id === orderId);
    if (!currentOrder || currentOrder.status === 'Завершён' || currentOrder.status === 'Отменён') {
      return;
    }

    const attachment = currentOrder.attachments.find((item) => item.id === attachmentId);
    if (!attachment) return;

    if (!window.confirm(`Удалить файл «${attachment.name}» из заказа №${orderId}?`)) {
      return;
    }

    setOrders((currentOrders) =>
      currentOrders.map((order) => {
        if (order.id !== orderId || order.status === 'Завершён' || order.status === 'Отменён') {
          return order;
        }

        return {
          ...order,
          attachments: order.attachments.filter((item) => item.id !== attachmentId),
        };
      }),
    );
    setOrderNotice(`Файл «${attachment.name}» удалён из заказа №${orderId}`);
  }

  function handleAssignMechanic(orderId: number, workId: number, mechanicId: number | null) {
    const currentOrder = orders.find((order) => order.id === orderId);
    if (!currentOrder || currentOrder.status === 'Завершён' || currentOrder.status === 'Отменён') {
      return;
    }

    setOrders((currentOrders) =>
      currentOrders.map((order) => {
        if (order.id !== orderId || order.status === 'Завершён' || order.status === 'Отменён') {
          return order;
        }

        return {
          ...order,
          works: order.works.map((work) => (work.id === workId ? { ...work, mechanicId } : work)),
        };
      }),
    );

    setOrderNotice(
      mechanicId === null ? 'Назначение исполнителя снято' : 'Исполнитель успешно назначен',
    );
  }

  function handleChangeOrderStatus(orderId: number, newStatus: ServiceOrderStatus) {
    const currentOrder = orders.find((order) => order.id === orderId);
    if (!currentOrder || !allowedTransitions[currentOrder.status].includes(newStatus)) {
      return;
    }

    if (newStatus === 'Отменён' && !window.confirm(`Отменить заказ №${orderId}?`)) {
      return;
    }

    setOrders((currentOrders) =>
      currentOrders.map((order) => {
        if (order.id !== orderId || !allowedTransitions[order.status].includes(newStatus)) {
          return order;
        }

        return { ...order, status: newStatus };
      }),
    );

    setAddingWorkOrderId(null);
    setAddingPartOrderId(null);
    setOrderNotice(`Статус заказа №${orderId} изменён на «${newStatus}»`);
  }

  return (
    <div className="reception-page">
      <div className="reception-heading">
        <h1>Кабинет мастера-приёмщика</h1>
        <p>Управление клиентскими записями и заказами на обслуживание</p>
      </div>

      <div className="reception-summary">
        <Card>
          <h3>Всего записей</h3>
          <div className="reception-summary-number">{appointments.length}</div>
        </Card>

        <Card>
          <h3>Новые записи</h3>
          <div className="reception-summary-number">{createdCount}</div>
        </Card>

        <Card>
          <h3>Подтверждённые</h3>
          <div className="reception-summary-number">{confirmedCount}</div>
        </Card>

        <Card>
          <h3>Заказы</h3>
          <div className="reception-summary-number">{orders.length}</div>
        </Card>
      </div>

      <section className="reception-section">
        <h2>Записи клиентов</h2>

        <div className="reception-filters">
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

        <div className="reception-filter-fields">
          <div className="reception-filter-field">
            <label htmlFor="appointment-date-filter">Дата записи</label>
            <input
              id="appointment-date-filter"
              type="date"
              value={appointmentDateFilter}
              onChange={(event) => setAppointmentDateFilter(event.target.value)}
            />
          </div>

          <div className="reception-filter-field">
            <label htmlFor="appointment-mechanic-filter">Исполнитель</label>
            <select
              id="appointment-mechanic-filter"
              value={appointmentMechanicFilter}
              onChange={(event) => setAppointmentMechanicFilter(event.target.value)}
            >
              <option value="all">Все исполнители</option>
              <option value="unassigned">Не назначен</option>
              {mockMechanics.map((mechanic) => (
                <option key={mechanic.id} value={String(mechanic.id)}>
                  {mechanic.name}
                </option>
              ))}
            </select>
          </div>

          <Button
            variant="secondary"
            onClick={() => {
              setStatusFilter('Все');
              setAppointmentDateFilter('');
              setAppointmentMechanicFilter('all');
            }}
          >
            Сбросить фильтры
          </Button>
        </div>

        <p className="reception-filter-summary">Найдено записей: {filteredAppointments.length}</p>

        {orderNotice && (
          <p className="form-message" role="status">
            {orderNotice}
          </p>
        )}

        <div className="reception-appointments">
          {filteredAppointments.length === 0 ? (
            <Card>
              <p>Записи с выбранными параметрами не найдены.</p>
            </Card>
          ) : (
            filteredAppointments.map((appointment) => {
              const vehicle = vehicles.find((item) => item.id === appointment.vehicleId);
              const existingOrder = orders.find((order) => order.appointmentId === appointment.id);
              const canCreateOrder = appointment.status !== 'Отменена' && !existingOrder;

              return (
                <Card key={appointment.id}>
                  <div className="reception-appointment">
                    <div className="reception-appointment-heading">
                      <div>
                        <h3>Запись №{appointment.id}</h3>
                        <p>{appointment.serviceName}</p>
                      </div>
                      <span className="appointment-status">{appointment.status}</span>
                    </div>

                    <div className="reception-appointment-info">
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
                        <strong>Дата:</strong> {appointment.date}
                      </p>
                      <p>
                        <strong>Время:</strong> {appointment.time}
                      </p>
                    </div>

                    <div className="reception-problem">
                      <strong>Описание проблемы</strong>
                      <p>{appointment.problemDescription || 'Описание отсутствует'}</p>
                    </div>

                    <div className="reception-order-actions">
                      {canCreateOrder && (
                        <Button onClick={() => handleCreateOrder(appointment.id)}>
                          Создать заказ
                        </Button>
                      )}
                      {existingOrder && (
                        <p>
                          <strong>Заказ №{existingOrder.id} создан</strong>
                        </p>
                      )}
                      {appointment.status === 'Отменена' && <p>Создание заказа недоступно</p>}
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </section>

      <section className="reception-section">
        <h2>Заказы на обслуживание</h2>

        <div className="reception-search">
          <label htmlFor="reception-order-search">Поиск заказов</label>
          <div className="reception-search-row">
            <input
              id="reception-order-search"
              className="reception-search-input"
              type="search"
              placeholder="Номер заказа, клиент, марка или госномер"
              value={orderSearchQuery}
              onChange={(event) => setOrderSearchQuery(event.target.value)}
            />
            {orderSearchQuery && (
              <Button variant="secondary" onClick={() => setOrderSearchQuery('')}>
                Сбросить
              </Button>
            )}
          </div>

          <div className="reception-filter-fields">
            <div className="reception-filter-field">
              <label htmlFor="order-status-filter">Статус заказа</label>
              <select
                id="order-status-filter"
                value={orderStatusFilter}
                onChange={(event) => setOrderStatusFilter(event.target.value as OrderStatusFilter)}
              >
                {orderStatusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="reception-filter-field">
              <label htmlFor="order-date-filter">Дата записи</label>
              <input
                id="order-date-filter"
                type="date"
                value={orderDateFilter}
                onChange={(event) => setOrderDateFilter(event.target.value)}
              />
            </div>

            <div className="reception-filter-field">
              <label htmlFor="order-mechanic-filter">Исполнитель</label>
              <select
                id="order-mechanic-filter"
                value={orderMechanicFilter}
                onChange={(event) => setOrderMechanicFilter(event.target.value)}
              >
                <option value="all">Все исполнители</option>
                <option value="unassigned">Не назначен</option>
                {mockMechanics.map((mechanic) => (
                  <option key={mechanic.id} value={String(mechanic.id)}>
                    {mechanic.name}
                  </option>
                ))}
              </select>
            </div>

            <Button
              variant="secondary"
              onClick={() => {
                setOrderSearchQuery('');
                setOrderStatusFilter('Все');
                setOrderDateFilter('');
                setOrderMechanicFilter('all');
              }}
            >
              Сбросить всё
            </Button>
          </div>

          <p className="reception-search-result">Найдено заказов: {filteredOrders.length}</p>
        </div>

        <div className="reception-appointments">
          {orders.length === 0 ? (
            <Card>
              <p>Заказы пока не созданы.</p>
            </Card>
          ) : filteredOrders.length === 0 ? (
            <Card>
              <p>По вашему запросу или выбранным фильтрам заказы не найдены.</p>
            </Card>
          ) : (
            filteredOrders.map((order) => {
              const appointment = appointments.find((item) => item.id === order.appointmentId);
              const vehicle = vehicles.find((item) => item.id === appointment?.vehicleId);
              const worksTotal = order.works.reduce(
                (sum, work) => sum + work.quantity * work.unitPrice,
                0,
              );

              return (
                <Card key={order.id}>
                  <div className="reception-appointment">
                    <div className="reception-appointment-heading">
                      <div>
                        <h3>Заказ №{order.id}</h3>
                        <p>На основании записи №{order.appointmentId}</p>
                      </div>
                      <span className="appointment-status">{order.status}</span>
                    </div>

                    <div className="reception-status-controls">
                      <h4>Управление статусом</h4>
                      <div className="reception-status-buttons">
                        {order.status === 'Создан' && (
                          <Button onClick={() => handleChangeOrderStatus(order.id, 'В работе')}>
                            Начать работу
                          </Button>
                        )}
                        {order.status === 'В работе' && (
                          <Button onClick={() => handleChangeOrderStatus(order.id, 'Завершён')}>
                            Завершить заказ
                          </Button>
                        )}
                        {(order.status === 'Создан' || order.status === 'В работе') && (
                          <Button
                            variant="secondary"
                            onClick={() => handleChangeOrderStatus(order.id, 'Отменён')}
                          >
                            Отменить заказ
                          </Button>
                        )}
                      </div>
                      {order.status === 'Завершён' && (
                        <p>Заказ завершён. Изменение статуса недоступно.</p>
                      )}
                      {order.status === 'Отменён' && (
                        <p>Заказ отменён. Изменение статуса недоступно.</p>
                      )}
                    </div>

                    <div className="reception-appointment-info">
                      <p>
                        <strong>Клиент:</strong> {client.name}
                      </p>
                      <p>
                        <strong>Автомобиль:</strong>{' '}
                        {vehicle ? `${vehicle.brand} ${vehicle.model}` : 'Не найден'}
                      </p>
                      <p>
                        <strong>Услуга:</strong> {appointment?.serviceName ?? 'Не найдена'}
                      </p>
                      <p>
                        <strong>Дата создания:</strong>{' '}
                        {new Date(order.createdAt).toLocaleString('ru-RU')}
                      </p>
                    </div>

                    <div className="reception-order-works">
                      <h4>Выполняемые работы</h4>
                      {order.works.length === 0 ? (
                        <p>Работы ещё не добавлены.</p>
                      ) : (
                        <>
                          <div className="reception-works-list">
                            {order.works.map((work) => (
                              <div className="reception-work-item" key={work.id}>
                                <div className="reception-work-content">
                                  <strong>{work.name}</strong>
                                  <p>
                                    {work.quantity} шт. × {work.unitPrice.toLocaleString('ru-RU')} ₽
                                  </p>
                                  <AssignWorkExecutor
                                    orderId={order.id}
                                    work={work}
                                    onAssign={(mechanicId) =>
                                      handleAssignMechanic(order.id, work.id, mechanicId)
                                    }
                                    disabled={
                                      order.status === 'Завершён' || order.status === 'Отменён'
                                    }
                                  />
                                </div>
                                <strong>
                                  {(work.quantity * work.unitPrice).toLocaleString('ru-RU')} ₽
                                </strong>
                              </div>
                            ))}
                          </div>
                          <div className="reception-works-total">
                            <strong>Стоимость работ:</strong>
                            <strong>{worksTotal.toLocaleString('ru-RU')} ₽</strong>
                          </div>
                        </>
                      )}

                      {order.status === 'Создан' && (
                        <Button
                          variant="secondary"
                          onClick={() =>
                            setAddingWorkOrderId(addingWorkOrderId === order.id ? null : order.id)
                          }
                        >
                          {addingWorkOrderId === order.id ? 'Закрыть форму' : '+ Добавить работу'}
                        </Button>
                      )}

                      {addingWorkOrderId === order.id && order.status === 'Создан' && (
                        <AddOrderWorkForm
                          onSave={(work) => handleAddWork(order.id, work)}
                          onCancel={() => setAddingWorkOrderId(null)}
                        />
                      )}
                    </div>

                    <div className="reception-order-works">
                      <h4>Используемые запчасти</h4>
                      {order.parts.length === 0 ? (
                        <p>Запчасти ещё не добавлены.</p>
                      ) : (
                        <div className="reception-works-list">
                          {order.parts.map((part) => (
                            <div className="reception-work-item" key={part.id}>
                              <div>
                                <strong>{part.name}</strong>
                                <p>
                                  {part.quantity} шт. × {part.unitPrice.toLocaleString('ru-RU')} ₽
                                </p>
                              </div>
                              <strong>
                                {(part.quantity * part.unitPrice).toLocaleString('ru-RU')} ₽
                              </strong>
                            </div>
                          ))}
                        </div>
                      )}

                      {order.status === 'Создан' && (
                        <Button
                          variant="secondary"
                          onClick={() =>
                            setAddingPartOrderId(addingPartOrderId === order.id ? null : order.id)
                          }
                        >
                          {addingPartOrderId === order.id ? 'Закрыть форму' : '+ Добавить запчасть'}
                        </Button>
                      )}

                      {addingPartOrderId === order.id && order.status === 'Создан' && (
                        <AddOrderPartForm
                          onSave={(part) => handleAddPart(order.id, part)}
                          onCancel={() => setAddingPartOrderId(null)}
                        />
                      )}
                    </div>

                    <OrderAttachmentsPanel
                      order={order}
                      onAddFiles={handleAddAttachments}
                      onDeleteFile={handleDeleteAttachment}
                    />

                    <OrderPricingSummary order={order} />
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

export default ReceptionPage;
