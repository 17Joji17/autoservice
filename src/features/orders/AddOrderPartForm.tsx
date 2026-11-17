import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

import type { OrderPart } from './types';

import { orderPartSchema, type OrderPartFormData } from './orderPartSchema';

type AddOrderPartFormProps = {
  onSave: (part: Omit<OrderPart, 'id'>) => void;
  onCancel: () => void;
};

function AddOrderPartForm({ onSave, onCancel }: AddOrderPartFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderPartFormData>({
    resolver: zodResolver(orderPartSchema),
    mode: 'onSubmit',
    defaultValues: {
      name: '',
      quantity: '1',
      unitPrice: '',
    },
  });

  function onSubmit(data: OrderPartFormData) {
    onSave({
      name: data.name,
      quantity: Number(data.quantity),
      unitPrice: Number(data.unitPrice),
    });
  }

  return (
    <Card>
      <form className="vehicle-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <h3>Добавление запчасти</h3>

        <div className="vehicle-form-grid">
          <Input
            label="Название запчасти"
            placeholder="Масляный фильтр"
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Количество"
            type="number"
            min="1"
            step="1"
            error={errors.quantity?.message}
            {...register('quantity')}
          />

          <Input
            label="Цена за единицу, ₽"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="800"
            error={errors.unitPrice?.message}
            {...register('unitPrice')}
          />
        </div>

        <div className="vehicle-form-actions">
          <Button type="submit">Добавить запчасть</Button>

          <Button type="button" variant="secondary" onClick={onCancel}>
            Отмена
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default AddOrderPartForm;
