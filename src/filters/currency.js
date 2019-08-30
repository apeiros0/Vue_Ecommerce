export default function (num) {
  // 將傳進來的數值加上 千分號 及 $ 字號
  const n = Number(num)
  return `$${n.toFixed(0).replace(/./g, (c, i, a) => {
    const currency = (i && c !== '.' && ((a.length - i) % 3 === 0) ? `, ${c}`.replace(/\s/g, '') : c)
    return currency
  })}`
}
