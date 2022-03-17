import '@testing-library/jest-dom';

import fetch, { Blob, Headers, Request, Response } from 'node-fetch';

if (!('fetch' in globalThis)) {
  Object.assign(globalThis, { fetch, Headers, Request, Response, Blob });
}
