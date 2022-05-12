import { useRoute } from '@/lib/use-route';

export function usePathname(): string {
  const route = useRoute();

  return route.pathname;
}
