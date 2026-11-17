import Card from '../../components/ui/Card';
import { useMockData } from '../../context/MockDataContext';
import OrderPricingSummary from './OrderPricingSummary';
import OrderAttachmentList from './OrderAttachmentList';

import './ClientOrdersSection.css';

const formatPrice = (price: number) => `${price.toLocaleString('ru-RU')} ₽`;

function ClientOrdersSection() {
  const { orders, appointments, vehicles } = useMockData();

  const clientOrders = orders.filter((order) =>
    appointments.some((appointment) => appointment.id === order.appointmentId),
  );

  return (
    <section className="client-section">
      <div className="client-section-title">
        <h2>Мои заказы</h2>
      </div>

      {clientOrders.length === 0 ? (
        <Card>
          <p>У вас пока нет заказов на обслуживание.</p>
          <p className="client-order-muted">
            Заказ появится здесь после его создания мастером-приёмщиком.
          </p>
        </Card>
      ) : (
        <div className="client-orders-list">
          {clientOrders.map((order) => {
            const appointment = appointments.find((item) => item.id === order.appointmentId);
            const vehicle = vehicles.find((item) => item.id === appointment?.vehicleId);

            return (
              <Card key={order.id}>
                <div className="client-order">
                  <div className="client-order-heading">
                    <div>
                      <h3>Заказ №{order.id}</h3>
                      <p className="client-order-muted">Запись №{order.appointmentId}</p>
                    </div>
                    <span className="client-order-status" data-status={order.status}>
                      {order.status}
                    </span>
                  </div>

                  <div className="client-order-info">
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

                  <div className="client-order-status-description">
                    {order.status === 'Создан' && (
                      <p>Заказ создан. Обслуживание ещё не началось.</p>
                    )}
                    {order.status === 'В работе' && (
                      <p>Ваш автомобиль находится на обслуживании.</p>
                    )}
                    {order.status === 'Завершён' && <p>Обслуживание автомобиля завершено.</p>}
                    {order.status === 'Отменён' && <p>Заказ был отменён.</p>}
                  </div>

                  <div className="client-order-section">
                    <h4>Работы</h4>
                    {order.works.length === 0 ? (
                      <p className="client-order-muted">Работы пока не добавлены.</p>
                    ) : (
                      <div className="client-order-items">
                        {order.works.map((work) => (
                          <div className="client-order-item" key={work.id}>
                            <div>
                              <strong>{work.name}</strong>
                              <p>
                                {work.quantity} шт. × {formatPrice(work.unitPrice)}
                              </p>
                            </div>
                            <strong>{formatPrice(work.quantity * work.unitPrice)}</strong>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="client-order-section">
                    <h4>Запчасти</h4>
                    {order.parts.length === 0 ? (
                      <p className="client-order-muted">Запчасти пока не добавлены.</p>
                    ) : (
                      <div className="client-order-items">
                        {order.parts.map((part) => (
                          <div className="client-order-item" key={part.id}>
                            <div>
                              <strong>{part.name}</strong>
                              <p>
                                {part.quantity} шт. × {formatPrice(part.unitPrice)}
                              </p>
                            </div>
                            <strong>{formatPrice(part.quantity * part.unitPrice)}</strong>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* FR-29: клиент может просмотреть или скачать вложения своего заказа */}
                  <div className="client-order-section">
                    <h4>Фотографии и документы</h4>
                    <OrderAttachmentList attachments={order.attachments ?? []} />
                  </div>

                  {/* FR-23 / FR-24: такой же расчёт, как у мастера */}
                  <OrderPricingSummary order={order} />
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default ClientOrdersSection;
