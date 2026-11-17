import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

import { useMockData } from '../context/MockDataContext';
import type { Service } from '../features/client/types';

import './AdminPage.css';

const serviceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Введите название минимум из 2 символов')
    .max(150, 'Название слишком длинное'),

  description: z
    .string()
    .trim()
    .min(5, 'Описание должно содержать минимум 5 символов')
    .max(1000, 'Описание слишком длинное'),

  price: z
    .string()
    .trim()
    .regex(/^\d+([.,]\d{1,2})?$/, 'Введите корректную цену')
    .refine((value) => {
      const price = Number(value.replace(',', '.'));
      return price > 0 && price <= 10000000;
    }, 'Цена должна быть от 0,01 до 10 000 000 ₽'),

  durationMinutes: z
    .string()
    .trim()
    .regex(/^[1-9]\d*$/, 'Введите целое количество минут')
    .refine((value) => Number(value) <= 1440, 'Продолжительность не должна превышать 1440 минут'),

  isAvailable: z.boolean(),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

type ServiceFormProps = {
  initialService?: Service;
  onSave: (service: Omit<Service, 'id'>) => void;
  onCancel: () => void;
};

function ServiceForm({ initialService, onSave, onCancel }: ServiceFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: initialService?.name ?? '',
      description: initialService?.description ?? '',
      price: initialService ? String(initialService.price) : '',
      durationMinutes: initialService ? String(initialService.durationMinutes) : '60',
      isAvailable: initialService?.isAvailable !== false,
    },
  });

  function onSubmit(data: ServiceFormValues) {
    onSave({
      name: data.name,
      description: data.description,
      price: Number(data.price.replace(',', '.')),
      durationMinutes: Number(data.durationMinutes),
      isAvailable: data.isAvailable,
    });
  }

  return (
    <Card>
      <form className="admin-service-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <h3>{initialService ? 'Редактирование услуги' : 'Добавление услуги'}</h3>

        <div className="admin-form-field">
          <label htmlFor="service-name">Название услуги</label>

          <input
            id="service-name"
            type="text"
            placeholder="Замена воздушного фильтра"
            {...register('name')}
          />

          {errors.name && (
            <p className="admin-field-error" role="alert">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="admin-form-field">
          <label htmlFor="service-description">Описание</label>

          <textarea
            id="service-description"
            rows={3}
            placeholder="Описание выполняемой услуги"
            {...register('description')}
          />

          {errors.description && (
            <p className="admin-field-error" role="alert">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="admin-form-grid">
          <div className="admin-form-field">
            <label htmlFor="service-price">Цена, ₽</label>

            <input
              id="service-price"
              type="text"
              inputMode="decimal"
              placeholder="2500"
              {...register('price')}
            />

            {errors.price && (
              <p className="admin-field-error" role="alert">
                {errors.price.message}
              </p>
            )}
          </div>

          <div className="admin-form-field">
            <label htmlFor="service-duration">Продолжительность, мин.</label>

            <input
              id="service-duration"
              type="number"
              min="1"
              max="1440"
              step="1"
              {...register('durationMinutes')}
            />

            {errors.durationMinutes && (
              <p className="admin-field-error" role="alert">
                {errors.durationMinutes.message}
              </p>
            )}
          </div>
        </div>

        <label className="admin-checkbox">
          <input type="checkbox" {...register('isAvailable')} />

          <span>Услуга доступна для записи</span>
        </label>

        <div className="admin-form-actions">
          <Button type="submit">
            {initialService ? 'Сохранить изменения' : 'Добавить услугу'}
          </Button>

          <Button type="button" variant="secondary" onClick={onCancel}>
            Отмена
          </Button>
        </div>
      </form>
    </Card>
  );
}

type ServiceFilter = 'Все' | 'Доступные' | 'Недоступные';

function AdminPage() {
  const { services, setServices } = useMockData();

  const [formMode, setFormMode] = useState<'create' | number | null>(null);

  const [filter, setFilter] = useState<ServiceFilter>('Все');

  const [notice, setNotice] = useState('');

  const availableCount = services.filter((service) => service.isAvailable !== false).length;

  const unavailableCount = services.length - availableCount;

  const filteredServices = services.filter((service) => {
    if (filter === 'Доступные') {
      return service.isAvailable !== false;
    }

    if (filter === 'Недоступные') {
      return service.isAvailable === false;
    }

    return true;
  });

  const editingService =
    typeof formMode === 'number' ? services.find((service) => service.id === formMode) : undefined;

  function handleSaveService(data: Omit<Service, 'id'>) {
    if (formMode === 'create') {
      setServices((currentServices) => {
        const nextId = Math.max(0, ...currentServices.map((item) => item.id)) + 1;

        return [
          ...currentServices,
          {
            ...data,
            id: nextId,
          },
        ];
      });

      setNotice('Услуга успешно добавлена');
    } else if (typeof formMode === 'number') {
      const serviceId = formMode;

      setServices((currentServices) =>
        currentServices.map((service) =>
          service.id === serviceId
            ? {
                ...service,
                ...data,
              }
            : service,
        ),
      );

      setNotice('Услуга успешно обновлена');
    }

    setFormMode(null);
  }

  function handleToggleAvailability(service: Service) {
    const nextAvailable = service.isAvailable === false;

    setServices((currentServices) =>
      currentServices.map((item) =>
        item.id === service.id
          ? {
              ...item,
              isAvailable: nextAvailable,
            }
          : item,
      ),
    );

    setNotice(
      nextAvailable
        ? `Услуга «${service.name}» теперь доступна`
        : `Услуга «${service.name}» стала недоступна для записи`,
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-heading">
        <h1>Панель администратора</h1>

        <p>Управление каталогом услуг автосервиса</p>
      </div>

      <div className="admin-summary">
        <Card>
          <h3>Всего услуг</h3>

          <div className="admin-summary-number">{services.length}</div>
        </Card>

        <Card>
          <h3>Доступные</h3>

          <div className="admin-summary-number">{availableCount}</div>
        </Card>

        <Card>
          <h3>Недоступные</h3>

          <div className="admin-summary-number">{unavailableCount}</div>
        </Card>
      </div>

      <section className="admin-section">
        <div className="admin-section-heading">
          <h2>Каталог услуг</h2>

          <Button
            onClick={() => {
              setFormMode(formMode === 'create' ? null : 'create');

              setNotice('');
            }}
          >
            {formMode === 'create' ? 'Закрыть форму' : '+ Добавить услугу'}
          </Button>
        </div>

        {formMode !== null && (
          <ServiceForm
            key={formMode}
            initialService={editingService}
            onSave={handleSaveService}
            onCancel={() => setFormMode(null)}
          />
        )}

        {notice && (
          <p className="form-message" role="status">
            {notice}
          </p>
        )}

        <div className="admin-filters">
          {(['Все', 'Доступные', 'Недоступные'] as ServiceFilter[]).map((item) => (
            <Button
              key={item}
              variant={filter === item ? 'primary' : 'secondary'}
              onClick={() => setFilter(item)}
            >
              {item}
            </Button>
          ))}
        </div>

        <div className="admin-services-list">
          {filteredServices.length === 0 ? (
            <Card>
              <p>Услуги с выбранным статусом отсутствуют.</p>
            </Card>
          ) : (
            filteredServices.map((service) => {
              const isAvailable = service.isAvailable !== false;

              return (
                <Card key={service.id}>
                  <div className="admin-service">
                    <div className="admin-service-heading">
                      <div>
                        <h3>{service.name}</h3>

                        <p>{service.description}</p>
                      </div>

                      <span className="admin-service-status" data-available={String(isAvailable)}>
                        {isAvailable ? 'Доступна' : 'Недоступна'}
                      </span>
                    </div>

                    <div className="admin-service-details">
                      <p>
                        <strong>Цена:</strong> {service.price.toLocaleString('ru-RU')} ₽
                      </p>

                      <p>
                        <strong>Продолжительность:</strong> {service.durationMinutes} мин.
                      </p>
                    </div>

                    <div className="admin-service-actions">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setFormMode(service.id);
                          setNotice('');
                        }}
                      >
                        Редактировать
                      </Button>

                      <Button variant="secondary" onClick={() => handleToggleAvailability(service)}>
                        {isAvailable ? 'Сделать недоступной' : 'Сделать доступной'}
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}

export default AdminPage;
