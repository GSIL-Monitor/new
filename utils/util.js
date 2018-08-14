//对当前时间的操作,并转换为api所需格式
const getTime = (s = 0, m = 0, h = 0, d = 0) => {
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


//对后端传来的时间进行处理,变为所需展示或处理的时间
const formatTime = t => {
  return t.substr(0, 19).replace('T', ' ')
}

//检测权限
const checkPermission = name => {
  return wx.getStorageSync('permission') && wx.getStorageSync('permission').indexOf(name) > 0 ? true : false;
}


const changeFileUrl = (array, attrName, attrName2) => {
  // const httpHead = 'https://s.api.troncell.com:443/';
  const httpHead = 'https://s.api.troncell.com/';
  return array.map(function(item) {
    if (attrName2 && item[attrName] && item[attrName][attrName2]) {
      if (item[attrName][attrName2].indexOf('http') < 0) {
        item[attrName][attrName2] = (httpHead + item[attrName][attrName2]).replace(/\\/g, '/');
      }else{
        item[attrName][attrName2] = (item[attrName][attrName2]).replace(/\\/g, '/');
      }
    } else if (item[attrName]) {
      if (item[attrName].indexOf('http') < 0) {
        item[attrName] = (httpHead + item[attrName]).replace(/\\/g, '/');
      }else{
        item[attrName] = (item[attrName]).replace(/\\/g, '/');
      }
    }
    return item
  })
}

module.exports = {
  getTime,
  formatTime,
  checkPermission,
  changeFileUrl
}