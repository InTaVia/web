import { useSearchEventKindsQuery, useSearchRelationRolesQuery } from '@/api/intavia.service';

export default function SetupStore(): JSX.Element {
  void useSearchEventKindsQuery({ q: '', limit: 400 });
  void useSearchRelationRolesQuery({ q: '', limit: 400 });
  return <></>;
}
