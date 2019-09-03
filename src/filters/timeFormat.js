export default function (time) {
  if (Number.isInteger(time)) {
    const date = new Date(time * 1000)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const formatMonth = (month < 10) ? '0' + month : month
    const formatDay = (day < 10) ? '0' + day : day
    return year + '/' + formatMonth + '/' + formatDay
  } else {
    // 先用 split('-') 用 - 把 Array 分開，
    // 之後再使用 join('/') 把 Array 的每個 index 使用 / 合併成字串
    return time.split('-').join('/')
  }
}
