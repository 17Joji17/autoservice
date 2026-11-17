import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

import type { Vehicle } from './types';

import { vehicleSchema, type VehicleFormData } from './vehicleSchema';

type AddVehicleFormProps = {
  onSave: (vehicle: Omit<Vehicle, 'id'>) => void;
  onCancel: () => void;
  initialData?: Omit<Vehicle, 'id'>;
};

function AddVehicleForm({ onSave, onCancel, initialData }: AddVehicleFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    mode: 'onSubmit',
    defaultValues: initialData
      ? {
          brand: initialData.brand,
          model: initialData.model,
          year: String(initialData.year),
          licensePlate: initialData.licensePlate,
        }
      : undefined,
  });

  function onSubmit(data: VehicleFormData) {
    onSave({
      brand: data.brand,
      model: data.model,
      year: Number(data.year),
      licensePlate: data.licensePlate,
    });
  }

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="vehicle-form">
        <h3>{initialData ? 'Редактирование автомобиля' : 'Добавление автомобиля'}</h3>

        <div className="vehicle-form-grid">
          <Input
            label="Марка"
            placeholder="Toyota"
            error={errors.brand?.message}
            {...register('brand')}
          />

          <Input
            label="Модель"
            placeholder="Camry"
            error={errors.model?.message}
            {...register('model')}
          />

          <Input
            label="Год выпуска"
            type="number"
            placeholder="2020"
            error={errors.year?.message}
            {...register('year')}
          />

          <Input
            label="Государственный номер"
            placeholder="А123ВС 78"
            error={errors.licensePlate?.message}
            {...register('licensePlate')}
          />
        </div>

        <div className="vehicle-form-actions">
          <Button type="submit">
            {initialData ? 'Сохранить изменения' : 'Сохранить автомобиль'}
          </Button>

          <Button type="button" variant="secondary" onClick={onCancel}>
            Отмена
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default AddVehicleForm;
