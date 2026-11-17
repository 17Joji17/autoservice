import { useState } from 'react';
import { Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

import { registerSchema, type RegisterFormData } from '../features/auth/registerSchema';

function RegisterPage() {
  const [message, setMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onSubmit',
  });

  function onSubmit(_data: RegisterFormData) {
    setMessage('Данные прошли проверку. Регистрация на сервере пока не подключена.');
  }

  return (
    <div className="register-page">
      <Card>
        <h1>Регистрация</h1>

        <p className="login-description">
          Создайте учётную запись для записи автомобиля на обслуживание
        </p>

        <form
          noValidate
          onChange={() => setMessage('')}
          onSubmit={handleSubmit(onSubmit, () => setMessage(''))}
          className="login-form"
        >
          <Input
            label="Имя"
            placeholder="Введите имя"
            autoComplete="name"
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Телефон"
            type="tel"
            placeholder="+7 999 123-45-67"
            autoComplete="tel"
            error={errors.phone?.message}
            {...register('phone')}
          />

          <Input
            label="Электронная почта"
            type="email"
            placeholder="example@mail.ru"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Пароль"
            type="password"
            placeholder="Придумайте пароль"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register('password')}
          />

          <Input
            label="Подтверждение пароля"
            type="password"
            placeholder="Повторите пароль"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <Button type="submit">Зарегистрироваться</Button>

          {message && (
            <p className="form-message" role="status">
              {message}
            </p>
          )}
        </form>

        <p className="auth-footer">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </Card>
    </div>
  );
}

export default RegisterPage;
