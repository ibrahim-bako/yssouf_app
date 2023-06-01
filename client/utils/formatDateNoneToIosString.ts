export default function (_date: string | Date | number) {
  const date = new Date(_date)
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0).toISOString()
}
