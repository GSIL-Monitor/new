//获取应用实例
const app = getApp()
const wxCharts = require('../../utils/wxcharts.js')
var columnChart = null;


Page({
  data: {
    // canIUse: wx.canIUse('button.open-type.getUserInfo'),
    topSku: [],
    statisticalData: []
  },
  onShow() {
    app.promise(app.req)({
      method: 'POST',
      url: '/o/api/services/app/Report/TopSkus',
      data: {
        "startTime": app.getTime(0, 0, 0, -30),
        "endTime": app.getTime(),
        "top": 3
      }
    }).then(res => {
      console.log(JSON.parse(res))
      this.setData({
        topSku: JSON.parse(res)
      })
    })

    //商品 广告 软件 红包
    app.promise(app.req)({
      url: '/s/api/services/app/Report/GetCountReport',
    }).then(res => {
      this.setData({
        'statisticalData.product': res[1].id,
        'statisticalData.ads': res[2].id,
        'statisticalData.software': res[4].id,
        'statisticalData.coupon': res[5].id,
      })
    })
    //订单 销量
    app.promise(app.req)({
      method: 'POST',
      url: '/o/api/services/app/Report/OrderCountAndSales',
      data: {
        storeId: null
      }
    }).then(res => {
      this.setData({
        'statisticalData.orderCount': JSON.parse(res)[0].OrderCount,
        'statisticalData.totalSales': JSON.parse(res)[0].TotalSales,
      })
    })
    //会员
    app.promise(app.req)({
      method: 'POST',
      url: '/o/api/services/app/Report/MembersCount',
      data: {
        storeId: null
      }
    }).then(res => {
      this.setData({
        'statisticalData.member': JSON.parse(res)[0].Total
      })
    })

    //报表数据
    app.promise(app.req)({
      method: 'POST',
      url: '/d/api/services/app/Report/GetBehaviorChartReport',
      data: {
        actions: "click,playvideo,enter",
        categories: null,
        endTime: "2018-07-20T23:59:59.999Z",
        startTime: "2018-06-20T00:00:00.000Z",
        type: "dd",
        organizationUnitIds: [30552]
      }
    }).then(res => {
      console.log('报表数据',res)
    })
  },
  onReady: function(e) {
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    columnChart = new wxCharts({
      canvasId: 'myCanvas',
      type: 'line', //饼pie,圆ring,线line,柱column,区域area,雷达radar
      animation: false,
      categories: ['2013', '2014', '2015', '2016', '2017'],
      series: [{
        name: '订单量',
        color: '#188df0',
        data: [23, 28, 35, 54, 95],
        format: function(val, name) {
          return val.toFixed(2) + '万';
        }
      }, {
        name: '人数',
        color: '#aaa',
        data: [2, 3, 4, 5, 9],
        format: function(val, name) {
          return val + '人';
        }
      }],
      yAxis: {
        format: function(val) {
          return val + '万';
        },
        min: 0
      },
      xAxis: {
        disableGrid: false,
        type: 'calibration'
      },
      extra: {
        column: {
          width: 15,
        },
        legendTextColor: '#000000'
      },
      width: windowWidth,
      height: 180,
    });
  },
  onPullDownRefresh: function() {
    // console.log('pulldown')
  },
  onShareAppMessage: function() {
    return {
      title: '自定义转发标题'
    }
  },
  checkCompleted(res) {
    for (var i of res) {
      i.name = app.translate(i.name)
    }
    this.setData({
      statisticalData: res
    })
  }
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