import { setupServer } from 'msw/node';

import { handlers } from '@/features/common/intavia-api.mocks';

export const server = setupServer(...handlers);
