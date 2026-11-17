import { BrowserRouter, Route, Routes } from 'react-router';

import MockDataProvider from './context/MockDataProvider';
import DemoRoleProvider from './context/DemoRoleProvider';

import RoleSwitcher from './components/auth/RoleSwitcher';
import RequireRole from './components/auth/RequireRole';
import AppLayout from './components/layout/AppLayout';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ClientPage from './pages/ClientPage';
import ReceptionPage from './pages/ReceptionPage';
import MechanicPage from './pages/MechanicPage';
import AdminPage from './pages/AdminPage';
import PlaceholderPage from './pages/PlaceholderPage';

import './components/ui/ui.css';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <MockDataProvider>
        <DemoRoleProvider>
          <RoleSwitcher />

          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              <Route
                path="/client"
                element={
                  <RequireRole allowedRoles={['client']}>
                    <ClientPage />
                  </RequireRole>
                }
              />

              <Route
                path="/master"
                element={
                  <RequireRole allowedRoles={['master']}>
                    <ReceptionPage />
                  </RequireRole>
                }
              />

              <Route
                path="/mechanic"
                element={
                  <RequireRole allowedRoles={['mechanic']}>
                    <MechanicPage />
                  </RequireRole>
                }
              />

              <Route
                path="/admin"
                element={
                  <RequireRole allowedRoles={['admin']}>
                    <AdminPage />
                  </RequireRole>
                }
              />

              <Route
                path="*"
                element={
                  <PlaceholderPage
                    title="404 — Страница не найдена"
                    description="Такой страницы не существует"
                  />
                }
              />
            </Route>
          </Routes>
        </DemoRoleProvider>
      </MockDataProvider>
    </BrowserRouter>
  );
}

export default App;
