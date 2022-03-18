import { setupServer } from 'msw/node';

import { handlers } from '@/mocks/intavia-api.mocks';

export const server = setupServer(...handlers);
