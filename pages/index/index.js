//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    // motto: 'Hello World',
    // userInfo: {},
    // hasUserInfo: false,
    // canIUse: wx.canIUse('button.open-type.getUserInfo'),
    topSku: []
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onShow() {
    getApp().promise(getApp().req)({
      method: 'POST',
      url: '/o/api/services/app/Report/TopSkus',
      data: {
        "startTime": getApp().getTime(0, 0, 0, -7),
        "endTime": getApp().getTime(),
        "top": 3
      }
    }).then(res => {
      this.setData({
        topSku: JSON.parse(res)
      })
    })
    getApp().promise(getApp().req)({
      url: '/s/api/services/app/Report/GetCountReport',
    }).then(res => {
      for (var i of res) { i.name = getApp().translate(i.name) }
      this.setData({
        statisticalData: res
      })
    })
  },
  onPullDownRefresh: function () {
    // console.log('pulldown')
  },
  onShareAppMessage: function () {
    return {
      title: '自定义转发标题'
    }
  },
  // getUserInfo: function(e) {
  //   console.log(e)
  //   app.globalData.userInfo = e.detail.userInfo
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // },
  // onLoad: function () {
  //   if (app.globalData.userInfo) {
  //     this.setData({
  //       userInfo: app.globalData.userInfo,
  //       hasUserInfo: true
  //     })
  //   } else if (this.data.canIUse) {
  //     // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
  //     // 所以此处加入 callback 以防止这种情况
  //     app.userInfoReadyCallback = res => {
  //       this.setData({
  //         userInfo: res.userInfo,
  //         hasUserInfo: true
  //       })
  //     }
  //   } else {
  //     // 在没有 open-type=getUserInfo 版本的兼容处理
  //     wx.getUserInfo({
  //       success: res => {
  //         app.globalData.userInfo = res.userInfo
  //         this.setData({
  //           userInfo: res.userInfo,
  //           hasUserInfo: true
  //         })
  //       }
  //     })
  //   }
  // }
})


