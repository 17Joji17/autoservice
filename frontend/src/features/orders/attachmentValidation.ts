export const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024;
export const MAX_ATTACHMENTS_PER_ORDER = 10;

const ALLOWED_MIME_BY_EXTENSION: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.pdf': 'application/pdf',
};

export function validateAttachmentFile(file: Pick<File, 'name' | 'size' | 'type'>): string | null {
  const dot = file.name.lastIndexOf('.');
  const extension = dot >= 0 ? file.name.slice(dot).toLowerCase() : '';
  const expectedMime = ALLOWED_MIME_BY_EXTENSION[extension];

  if (!expectedMime) {
    return 'Поддерживаются только JPEG, PNG и PDF';
  }

  if (file.type && file.type.toLowerCase() !== expectedMime) {
    return 'Тип файла не соответствует его расширению';
  }

  if (file.size <= 0 || file.size > MAX_ATTACHMENT_SIZE) {
    return 'Размер файла должен быть от 1 байта до 10 МБ';
  }

  return null;
}
