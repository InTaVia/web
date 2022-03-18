import { setupWorker } from 'msw';

import { handlers } from '@/mocks/intavia-api.mocks';

export const worker = setupWorker(...handlers);

// @ts-expect-error Provide worker to cypress tests.
window.msw = { worker };
