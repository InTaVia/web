import { useSearchEventKindsQuery } from '@/api/intavia.service';

export default function SetupStore(): JSX.Element {
  void useSearchEventKindsQuery({ q: '' });
  return <></>;
}
