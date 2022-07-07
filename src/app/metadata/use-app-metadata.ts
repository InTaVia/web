import { useLocale } from '@/app/route/use-locale';
import type { AppMetadata } from '~/config/metadata.config';
import { metadata } from '~/config/metadata.config';

export function useAppMetadata(): AppMetadata {
  const { locale } = useLocale();

  const appMetadata = metadata[locale];

  return appMetadata;
}
