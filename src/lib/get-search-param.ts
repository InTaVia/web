export function getSearchParam(searchParams: URLSearchParams, key: string): string | undefined {
  const value = searchParams.get(key)?.trim();
  if (value == null || value.length === 0) return undefined;
  return value;
}
