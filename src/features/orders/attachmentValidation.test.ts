import { describe, expect, it } from 'vitest';
import { validateAttachmentFile, MAX_ATTACHMENT_SIZE } from './attachmentValidation';

const file = (name: string, type: string, size: number) => ({ name, type, size });

describe('проверка файлов для заказа (NFR-16)', () => {
  it('разрешает JPEG, PNG и PDF', () => {
    expect(validateAttachmentFile(file('photo.jpg', 'image/jpeg', 100))).toBeNull();
    expect(validateAttachmentFile(file('photo.PNG', 'image/png', 500))).toBeNull();
    expect(
      validateAttachmentFile(file('document.pdf', 'application/pdf', MAX_ATTACHMENT_SIZE)),
    ).toBeNull();
  });

  it('отклоняет другие форматы и несоответствие MIME', () => {
    expect(validateAttachmentFile(file('photo.webp', 'image/webp', 100))).not.toBeNull();
    expect(
      validateAttachmentFile(file('document.docx', 'application/octet-stream', 100)),
    ).not.toBeNull();
    expect(validateAttachmentFile(file('photo.png', 'application/pdf', 100))).not.toBeNull();
  });

  it('отклоняет пустые и слишком большие файлы', () => {
    expect(validateAttachmentFile(file('photo.jpg', 'image/jpeg', 0))).not.toBeNull();
    expect(
      validateAttachmentFile(file('photo.jpg', 'image/jpeg', MAX_ATTACHMENT_SIZE + 1)),
    ).not.toBeNull();
  });
});
