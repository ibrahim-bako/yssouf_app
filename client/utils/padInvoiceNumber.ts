export default function (num: number) {
  let size = 8
  let _num = num.toString()
  while (_num.length < size) _num = "0" + _num
  return _num
}
