import { useState } from 'react';
import { Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

import { loginSchema, type LoginFormData } from '../features/auth/loginSchema';

function LoginPage() {
  const [message, setMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onSubmit',
  });

  function onSubmit(_data: LoginFormData) {
    setMessage('Данные прошли проверку. Авторизация на сервере пока не подключена.');
  }

  return (
    <div className="login-page">
      <Card>
        <h1>Вход в систему</h1>

        <p className="login-description">Введите данные вашей учётной записи</p>

        <form
          noValidate
          onChange={() => setMessage('')}
          onSubmit={handleSubmit(onSubmit, () => setMessage(''))}
          className="login-form"
        >
          <Input
            label="Электронная почта"
            type="email"
            placeholder="example@mail.ru"
            autoComplete="username"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Пароль"
            type="password"
            placeholder="Введите пароль"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password')}
          />

          <Button type="submit">Войти</Button>

          {message && (
            <p className="form-message" role="status">
              {message}
            </p>
          )}
        </form>

        <p className="auth-footer">
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </p>
      </Card>
    </div>
  );
}

export default LoginPage;
