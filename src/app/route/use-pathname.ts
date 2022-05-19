import { useRoute } from '@/app/route/use-route';

export function usePathname(): string {
  const route = useRoute();

  return route.pathname;
}
