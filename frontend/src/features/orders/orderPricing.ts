import type { ServiceOrder } from './types';

export function calculateOrderPricing(order: ServiceOrder) {
  const baseServicePrice = order.estimatedServicePrice ?? 0;
  const worksTotal = order.works.reduce((sum, work) => sum + work.quantity * work.unitPrice, 0);
  const partsTotal = order.parts.reduce((sum, part) => sum + part.quantity * part.unitPrice, 0);
  const preliminaryTotal = order.works.length > 0 ? worksTotal : baseServicePrice;

  return {
    baseServicePrice,
    worksTotal,
    partsTotal,
    preliminaryTotal,
    actualTotal: worksTotal + partsTotal,
  };
}
