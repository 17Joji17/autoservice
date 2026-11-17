import { Outlet } from 'react-router';
import Header from './Header';

function AppLayout() {
  return (
    <div className="app">
      <Header />

      <main className="container main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container">
          <p>Автосервис-АСА © 2026</p>
          <p>Система управления обслуживанием автомобилей</p>
        </div>
      </footer>
    </div>
  );
}

export default AppLayout;
