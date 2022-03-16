/** Intavia api base url. */
export const baseUrl = new URL(
  process.env['NEXT_PUBLIC_INTAVIA_API_BASE_URL'] ?? 'http://localhost:5000',
);
