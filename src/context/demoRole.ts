import { createContext, useContext } from 'react';
import type { Dispatch, SetStateAction } from 'react';

export type DemoRole = 'client' | 'master' | 'mechanic' | 'admin';

export const demoRoles: DemoRole[] = ['client', 'master', 'mechanic', 'admin'];

export const demoRoleInfo: Record<DemoRole, { label: string; homePath: string }> = {
  client: { label: 'Клиент', homePath: '/client' },
  master: { label: 'Мастер-приёмщик', homePath: '/master' },
  mechanic: { label: 'Механик', homePath: '/mechanic' },
  admin: { label: 'Администратор', homePath: '/admin' },
};

export function isDemoRole(value: unknown): value is DemoRole {
  return typeof value === 'string' && demoRoles.some((role) => role === value);
}

type DemoRoleContextValue = {
  role: DemoRole;
  setRole: Dispatch<SetStateAction<DemoRole>>;
};

export const DemoRoleContext = createContext<DemoRoleContextValue | null>(null);

export function useDemoRole(): DemoRoleContextValue {
  const context = useContext(DemoRoleContext);

  if (!context) {
    throw new Error('useDemoRole должен вызываться внутри DemoRoleProvider');
  }

  return context;
}
