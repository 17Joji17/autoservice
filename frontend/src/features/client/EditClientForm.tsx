import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

import type { Client } from './types';

import { clientSchema, type ClientFormData } from './clientSchema';

type EditClientFormProps = {
  client: Client;
  onSave: (data: ClientFormData) => void;
  onCancel: () => void;
};

function EditClientForm({ client, onSave, onCancel }: EditClientFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    mode: 'onSubmit',
    defaultValues: {
      name: client.name,
      email: client.email,
      phone: client.phone,
    },
  });

  return (
    <Card>
      <form className="vehicle-form" noValidate onSubmit={handleSubmit(onSave)}>
        <h3>Редактирование личных данных</h3>

        <div className="vehicle-form-grid">
          <Input
            label="Имя"
            placeholder="Иван Иванов"
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Электронная почта"
            type="email"
            placeholder="ivan@example.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Телефон"
            type="tel"
            placeholder="+7 999 123-45-67"
            error={errors.phone?.message}
            {...register('phone')}
          />
        </div>

        <div className="vehicle-form-actions">
          <Button type="submit">Сохранить изменения</Button>

          <Button type="button" variant="secondary" onClick={onCancel}>
            Отмена
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default EditClientForm;
