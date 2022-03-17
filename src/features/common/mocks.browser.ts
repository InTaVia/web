import { setupWorker } from 'msw';

import { handlers } from '@/features/common/intavia-api.mocks';

export const worker = setupWorker(...handlers);
