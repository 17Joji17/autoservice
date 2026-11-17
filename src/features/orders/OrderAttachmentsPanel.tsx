import { useState } from 'react';

import type { ChangeEvent } from 'react';
import type { ServiceOrder } from './types';
import OrderAttachmentList from './OrderAttachmentList';
import { MAX_ATTACHMENTS_PER_ORDER, validateAttachmentFile } from './attachmentValidation';
import './OrderAttachmentsPanel.css';

type OrderAttachmentsPanelProps = {
  order: ServiceOrder;
  onAddFiles: (orderId: number, files: File[]) => void;
  onDeleteFile: (orderId: number, attachmentId: number) => void;
};

function OrderAttachmentsPanel({ order, onAddFiles, onDeleteFile }: OrderAttachmentsPanelProps) {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const attachments = order.attachments ?? [];
  const isEditable = order.status === 'Создан' || order.status === 'В работе';
  const canAttach = isEditable && attachments.length < MAX_ATTACHMENTS_PER_ORDER;

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    setMessage('');
    setError('');

    if (!canAttach || files.length === 0) return;

    const availableSlots = MAX_ATTACHMENTS_PER_ORDER - attachments.length;
    const accepted: File[] = [];
    const errors: string[] = [];

    for (const file of files) {
      if (accepted.length >= availableSlots) {
        errors.push(`«${file.name}»: превышен лимит ${MAX_ATTACHMENTS_PER_ORDER} файлов на заказ`);
        continue;
      }

      const validationError = validateAttachmentFile(file);
      if (validationError) {
        errors.push(`«${file.name}»: ${validationError}`);
        continue;
      }

      const duplicated = [...attachments.map((item) => item.file), ...accepted].some(
        (item) =>
          item.name === file.name &&
          item.size === file.size &&
          item.lastModified === file.lastModified,
      );
      if (duplicated) {
        errors.push(`«${file.name}»: файл уже прикреплён`);
        continue;
      }

      accepted.push(file);
    }

    if (accepted.length > 0) {
      onAddFiles(order.id, accepted);
      setMessage(`Прикреплено файлов: ${accepted.length}`);
    }
    if (errors.length > 0) setError(errors.join('. '));
  }

  return (
    <section className="order-attachments-panel">
      <div className="order-attachments-heading">
        <h4>Фотографии и документы</h4>
        <span>
          Прикреплено: {attachments.length}/{MAX_ATTACHMENTS_PER_ORDER}
        </span>
      </div>

      <OrderAttachmentList
        attachments={attachments}
        onDelete={isEditable ? (attachmentId) => onDeleteFile(order.id, attachmentId) : undefined}
      />

      {canAttach && (
        <div className="order-attachments-upload">
          <label htmlFor={`order-attachments-input-${order.id}`}>Прикрепить файлы</label>
          <input
            id={`order-attachments-input-${order.id}`}
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
            onChange={handleFileChange}
          />
          <p className="order-attachments-muted">
            JPEG, PNG, PDF. До 10 МБ на файл, не больше 10 файлов в заказе.
          </p>
        </div>
      )}

      {!isEditable && (
        <p className="order-attachments-muted">
          Для завершённых и отменённых заказов добавление вложений закрыто.
        </p>
      )}

      {isEditable && !canAttach && (
        <p className="order-attachments-muted">Достигнут лимит вложений.</p>
      )}

      {message && (
        <p role="status" className="order-attachments-success">
          {message}
        </p>
      )}
      {error && (
        <p role="alert" className="order-attachments-error">
          {error}
        </p>
      )}
    </section>
  );
}

export default OrderAttachmentsPanel;
