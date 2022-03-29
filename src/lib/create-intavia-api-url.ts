import type { CreateUrlArgs } from '@/lib/create-url';
import { createUrl } from '@/lib/create-url';
import { baseUrl } from '~/config/intavia.config';

export function createIntaviaApiUrl(args: Omit<CreateUrlArgs, 'baseUrl'>): URL {
  return createUrl({ ...args, baseUrl });
}
