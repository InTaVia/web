export function toPositiveInteger(value: number): number | undefined {
  if (!Number.isInteger(value) || value < 0) return undefined;
  return value;
}
