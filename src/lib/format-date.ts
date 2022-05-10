export function formatDate(date: Date): string {
  return Intl.DateTimeFormat('en', { dateStyle: 'long' }).format(date);
}
