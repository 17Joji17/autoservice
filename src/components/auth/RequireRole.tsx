import type { ReactNode } from 'react';
import { Link } from 'react-router';

import { demoRoleInfo, useDemoRole } from '../../context/demoRole';
import type { DemoRole } from '../../context/demoRole';

import './RoleSwitcher.css';

type RequireRoleProps = {
  allowedRoles: DemoRole[];
  children: ReactNode;
};

function RequireRole({ allowedRoles, children }: RequireRoleProps) {
  const { role } = useDemoRole();

  if (allowedRoles.includes(role)) {
    return <>{children}</>;
  }

  return (
    <section className="demo-access-denied" role="alert">
      <h1>Доступ к странице ограничен</h1>
      <p>Сейчас выбрана роль «{demoRoleInfo[role].label}». Для неё этот кабинет недоступен.</p>
      <p>
        Чтобы проверить другой кабинет, переключите роль в панели демонстрационного режима выше.
      </p>
      <Link to={demoRoleInfo[role].homePath}>Перейти в свой кабинет</Link>
    </section>
  );
}

export default RequireRole;
