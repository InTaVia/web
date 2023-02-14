export function isNotNullable<T>(value: Nullable<T>): value is T {
  return value != null;
}
