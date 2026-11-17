import { Link, NavLink } from 'react-router';

const navigation = [
  { path: '/', name: 'Главная' },
  { path: '/login', name: 'Вход' },
  { path: '/register', name: 'Регистрация' },
  { path: '/client', name: 'Клиент' },
  { path: '/master', name: 'Мастер' },
  { path: '/mechanic', name: 'Механик' },
  { path: '/admin', name: 'Администратор' },
];

function Header() {
  return (
    <header className="header">
      <div className="container header-content">
        <Link to="/" className="brand">
          Автосервис-АСА
        </Link>

        <span>Система управления автосервисом</span>
      </div>

      <nav className="container nav" aria-label="Основная навигация">
        {navigation.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

export default Header;
