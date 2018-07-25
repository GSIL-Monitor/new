//时间格式
const formatTime = (s = 0, m = 0, h = 0, d = 0) => {
  const timestamp = Date.parse(new Date()) + 1000 * (s + m * 60 + h * 60 * 60 + d * 60 * 60 * 24)
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + 'T' + [hour, minute, second].map(formatNumber).join(':')
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//翻译
const languageList = {
  store: '店铺',
  product: '商品',
  ads: '广告',
  device: '设备'
}
const translate = n => {
  return languageList[n] ? languageList[n] : n
}

//检测权限
const checkPermission = name => {
  return wx.getStorageSync('permission')&&wx.getStorageSync('permission').indexOf(name) > 0 ? true : false;
}

module.exports = {
  getTime: formatTime,
  translate: translate,
  checkPermission: checkPermission
}