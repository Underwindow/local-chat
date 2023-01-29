export default function dateFormat(date: Date): string {
  return date.toLocaleString('ru-RU', { hour: 'numeric', minute: 'numeric', hour12: false });
}