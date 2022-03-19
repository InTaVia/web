import type { EmotionCache } from '@emotion/cache';
import createCache from '@emotion/cache';

export function createEmotionCache(): EmotionCache {
  return createCache({ key: 'css', prepend: true });
}
