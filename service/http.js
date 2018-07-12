const server = {
  all_api: 'https://all.api.troncell.com',
  s_api:'https://s.api.troncell.com/api',
  test:''
}
const Promise = require('../utils/es6-promise')

function httpsPromisify(fn) {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {
        resolve(res)
      }
      obj.fail = function (res) {
        reject(res)
      }
      fn(obj)
    })
  }
}

function req(param){
  let request = {
    url: server[param.server ? param.server : 'all_api'] + param.url,
    data: param.data,
    method: param.method || 'GET',
    header: {},
    success: function (res) {
      if (res.statusCode == 200) {
        param.success(res.data.result);
      }else if(res.statusCode == 401){
        wx.showModal({
          title: '提示',
          content: '登陆已过期，请重新登陆',
          showCancel: false,
          success: function (res) {
            wx.removeStorageSync('tenantId');
            wx.removeStorageSync('accessToken');
            if (res.confirm) {
              wx.redirectTo({ url: '../login/login' });
            }
          }
        })
      }else{
        wx.showToast({
          title: res.data.err.message,
          icon: 'none',
          duration: 3000
        })
      }
    },
    fail: function (res) {
      wx.showToast({
        title: res.errMsg,
        icon: 'none',
        duration: 3000
      })
      param.fail();
    }
  }
  if (wx.getStorageSync('tenantId')){
    request.header['Abp.TenantId'] = wx.getStorageSync('tenantId');
  }
  if (wx.getStorageSync('accessToken')){
    request.header['Authorization'] = wx.getStorageSync('accessToken');
  } 
  wx.request(request);

}


module.exports = {
  req: req,
  promise: httpsPromisify
}