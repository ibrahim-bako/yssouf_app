export default function (num: number): string {
  return new Intl.NumberFormat("en-US").format(num)
}
