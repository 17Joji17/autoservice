import { useEffect, useState } from 'react';
import type { OrderAttachment } from './types';

import './OrderAttachmentList.css';

type OrderAttachmentListProps = {
  attachments: OrderAttachment[];
  onDelete?: (attachmentId: number) => void;
};

type AttachmentItemProps = {
  attachment: OrderAttachment;
  onDelete?: (attachmentId: number) => void;
};

const formatFileSize = (bytes: number): string =>
  bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} КБ`
    : `${(bytes / (1024 * 1024)).toLocaleString('ru-RU', {
        maximumFractionDigits: 1,
      })} МБ`;

const canPreviewFile = (fileName: string): boolean => /\.(jpe?g|png|pdf)$/i.test(fileName);

function AttachmentItem({ attachment, onDelete }: AttachmentItemProps) {
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(attachment.file);
    setFileUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [attachment.file]);

  return (
    <li className="order-file-item">
      <div className="order-file-info">
        <strong className="order-file-name" title={attachment.name}>
          {attachment.name}
        </strong>
        <span className="order-file-meta">
          {formatFileSize(attachment.size)} ·{' '}
          {new Date(attachment.uploadedAt).toLocaleString('ru-RU')}
        </span>
      </div>

      <div className="order-file-actions">
        {fileUrl && canPreviewFile(attachment.name) && (
          <a className="order-file-action" href={fileUrl} target="_blank" rel="noopener noreferrer">
            Просмотреть
          </a>
        )}

        {fileUrl && (
          <a className="order-file-action" href={fileUrl} download={attachment.name}>
            Скачать
          </a>
        )}

        {onDelete && (
          <button
            type="button"
            className="order-file-action order-file-delete"
            onClick={() => onDelete(attachment.id)}
            aria-label={`Удалить файл ${attachment.name}`}
          >
            Удалить
          </button>
        )}
      </div>
    </li>
  );
}

function OrderAttachmentList({ attachments, onDelete }: OrderAttachmentListProps) {
  if (attachments.length === 0) {
    return <p className="order-file-empty">Вложения пока не добавлены.</p>;
  }

  return (
    <div className="order-file-content">
      <ul className="order-file-list">
        {attachments.map((attachment) => (
          <AttachmentItem key={attachment.id} attachment={attachment} onDelete={onDelete} />
        ))}
      </ul>
      {attachments.some((attachment) => !canPreviewFile(attachment.name)) && (
        <p className="order-file-note">Файл этого формата доступен только для скачивания.</p>
      )}
    </div>
  );
}

export default OrderAttachmentList;
