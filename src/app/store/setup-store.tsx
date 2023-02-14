import { useSearchEventKindsQuery, useSearchRelationRolesQuery } from '@/api/intavia.service';

export function SetupStore(): null {
  useSearchEventKindsQuery({ q: '', limit: 400 });
  useSearchRelationRolesQuery({ q: '', limit: 400 });

  return null;
}
