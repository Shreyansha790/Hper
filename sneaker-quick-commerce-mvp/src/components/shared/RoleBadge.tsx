import type { Role } from '@/types';

export function RoleBadge({ role }: { role: Role }) {
  return <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">{role}</span>;
}
