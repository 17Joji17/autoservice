import type { ServiceOrder } from './types';
import { calculateOrderPricing } from './orderPricing';
import './OrderPricingSummary.css';

type OrderPricingSummaryProps = {
  order: ServiceOrder;
};

const formatPrice = (value: number): string =>
  `${value.toLocaleString('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })} ₽`;

function OrderPricingSummary({ order }: OrderPricingSummaryProps) {
  const { baseServicePrice, worksTotal, partsTotal, preliminaryTotal, actualTotal } =
    calculateOrderPricing(order);

  const isCompleted = order.status === 'Завершён';
  const isCancelled = order.status === 'Отменён';

  return (
    <div className="order-pricing">
      <h4>Расчёт стоимости заказа</h4>

      <div className="order-pricing-block">
        <h5>Предварительная стоимость</h5>

        <div className="order-pricing-row">
          <span>Цена услуги по каталогу:</span>
          <strong>{formatPrice(baseServicePrice)}</strong>
        </div>

        <div className="order-pricing-row">
          <span>Запланированные работы:</span>
          <strong>{formatPrice(worksTotal)}</strong>
        </div>

        <div className="order-pricing-total">
          <strong>Предварительная оценка:</strong>
          <strong>{formatPrice(preliminaryTotal)}</strong>
        </div>

        <p className="order-pricing-note">
          {order.works.length > 0
            ? 'Предварительная оценка рассчитана по перечню работ и заменяет базовую цену услуги.'
            : 'Предварительная оценка рассчитана по цене услуги из каталога.'}
        </p>
      </div>

      <div className="order-pricing-block">
        <h5>{isCompleted ? 'Итоговая стоимость' : 'Текущий расчёт работ и запчастей'}</h5>

        <div className="order-pricing-row">
          <span>Стоимость работ:</span>
          <strong>{formatPrice(worksTotal)}</strong>
        </div>

        <div className="order-pricing-row">
          <span>Стоимость запчастей:</span>
          <strong>{formatPrice(partsTotal)}</strong>
        </div>

        {isCompleted ? (
          <div className="order-pricing-total order-pricing-final">
            <strong>Итоговая стоимость:</strong>
            <strong>{formatPrice(actualTotal)}</strong>
          </div>
        ) : (
          <>
            <div className="order-pricing-total">
              <strong>Сумма учтённых позиций:</strong>
              <strong>{formatPrice(actualTotal)}</strong>
            </div>
            <p className="order-pricing-note">
              {isCancelled
                ? 'Заказ отменён. Указанная сумма не является суммой к оплате.'
                : 'Итоговая стоимость будет зафиксирована после завершения заказа.'}
            </p>
          </>
        )}
      </div>

      {isCompleted && (
        <p className="order-pricing-completed">
          Заказ завершён. Итоговая стоимость рассчитана по зафиксированным работам и запчастям.
        </p>
      )}
    </div>
  );
}

export default OrderPricingSummary;
