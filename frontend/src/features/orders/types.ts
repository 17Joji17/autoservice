export type ServiceOrderStatus = 'Создан' | 'В работе' | 'Завершён' | 'Отменён';

export type OrderWork = {
  id: number;
  name: string;
  quantity: number;
  unitPrice: number;
  mechanicId?: number | null;
};

export type OrderPart = {
  id: number;
  name: string;
  quantity: number;
  unitPrice: number;
};

// В mock-версии сохраняем сам File в памяти React.
// В backend-версии вместо него будет идентификатор или URL вложения.
export type OrderAttachment = {
  id: number;
  name: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
  file: File;
};

export type ServiceOrder = {
  id: number;
  appointmentId: number;
  status: ServiceOrderStatus;
  createdAt: string;
  works: OrderWork[];
  parts: OrderPart[];
  estimatedServicePrice?: number;
  attachments: OrderAttachment[];
};
