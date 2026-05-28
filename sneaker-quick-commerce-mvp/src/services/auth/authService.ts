import type { Role, User } from '@/types';
import { mockUsers } from '@/lib/mock';

export const roleRoutes: Record<Role, string> = {
  customer: '/',
  storekeeper: '/storekeeper',
  admin: '/admin',
};

export const authService = {
  login: async (email: string, role: Role): Promise<User | null> => {
    await new Promise((r) => setTimeout(r, 500));
    const user = mockUsers.find((u) => u.email === email && u.role === role) ?? null;
    return user;
  },
};
