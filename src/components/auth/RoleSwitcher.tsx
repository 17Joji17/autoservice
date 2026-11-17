import { useNavigate } from 'react-router';

import { demoRoles, demoRoleInfo, isDemoRole, useDemoRole } from '../../context/demoRole';

import './RoleSwitcher.css';

function RoleSwitcher() {
  const { role, setRole } = useDemoRole();
  const navigate = useNavigate();

  return (
    <div className="demo-role-bar">
      <div className="demo-role-bar-inner">
        <div className="demo-role-description">
          <strong>Демонстрационный режим</strong>
          <span>Выберите роль для проверки доступа к кабинету</span>
        </div>

        <div className="demo-role-control">
          <label htmlFor="demo-role-select">Роль</label>
          <select
            id="demo-role-select"
            value={role}
            onChange={(event) => {
              const nextRole = event.target.value;
              if (!isDemoRole(nextRole)) return;

              setRole(nextRole);
              navigate(demoRoleInfo[nextRole].homePath);
            }}
          >
            {demoRoles.map((item) => (
              <option value={item} key={item}>
                {demoRoleInfo[item].label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default RoleSwitcher;
