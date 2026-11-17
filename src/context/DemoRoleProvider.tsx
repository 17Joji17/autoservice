import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

import { DemoRoleContext, isDemoRole } from './demoRole';
import type { DemoRole } from './demoRole';

const STORAGE_KEY = 'autoservice-demo-role';

function readInitialRole(): DemoRole {
  try {
    const storedRole = sessionStorage.getItem(STORAGE_KEY);
    return isDemoRole(storedRole) ? storedRole : 'client';
  } catch {
    return 'client';
  }
}

function DemoRoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<DemoRole>(readInitialRole);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, role);
    } catch {
      // Если хранилище браузера недоступно, выбор роли всё равно работает.
    }
  }, [role]);

  return <DemoRoleContext.Provider value={{ role, setRole }}>{children}</DemoRoleContext.Provider>;
}

export default DemoRoleProvider;
