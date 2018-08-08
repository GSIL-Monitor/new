//获取应用实例
const app = getApp()
const wxCharts = require('../../utils/wxcharts.js')
var columnChart = null;

Page({
  data: {
    title: wx.getStorageSync('ouStore').name != '暂无' ? wx.getStorageSync('ouStore').name : wx.getStorageSync('userName'),
    topSku: [],
    statisticalData: [],
    startDate: app.getTime(0, 0, 0, -30).substr(0, 10),
    endDate: app.getTime().substr(0, 10),
    selectedTab: 'day',
    get adsPermit() {
      return app.checkPermission('Pages.Tenant.Ads')
    },
    get softwarePermit() {
      return app.checkPermission('Pages.Softwares')
    },
    get productsPermit() {
      return app.checkPermission('Pages.Tenant.Products')
    },
    get couponsPermit() {
      return app.checkPermission('Pages.Tenant.Coupons')
    },
    get dashboardPermit() {
      return app.checkPermission('Pages.Tenant.Dashboard')
    }
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
      console.log(res)
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

  },
  onReady: function(e) {
    this.drawCanvas();
  },
  onPullDownRefresh: function() {
    // console.log('pulldown')
  },
  onShareAppMessage: function() {
    return {
      title: '自定义转发标题'
    }
  },
  drawCanvas() {
    var startTime, endTime, type
    if (this.data.selectedTab == "day") {
      startTime = this.data.startDate + "T00:00:00.000Z";
      endTime = this.data.endDate + "T23:59:59.999Z";
      type: 'dd';
    } else if (this.data.selectedTab == "month") {
      startTime = this.data.startDate + "T00:00:00.000Z";
      endTime = this.data.endDate + "T23:59:59.999Z";
      type: 'mm';
    } else if (this.data.selectedTab == "hour") {
      startTime = app.getTime().substr(0, 11) + this.data.startDate + ":00.000Z";
      endTime = app.getTime().substr(0, 11) + this.data.endDate + ":59.999Z";
      type: 'hh'
    }

    //报表数据
    app.promise(app.req)({
      method: 'POST',
      url: '/d/api/services/app/Report/GetBehaviorChartReport',
      data: {
        actions: "click,playvideo,enter",
        categories: null,
        startTime,
        endTime,
        type,
        organizationUnitIds: [Number(wx.getStorageSync('ouStore').id)]
        // organizationUnitIds: [40615, 40616]
      }
    }).then(res => {
      console.log('报表数据', res)
    })

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
      animation: true,
      categories: ['2013', '2014', '2015', '2016', '2017'],
      dataPointShape: true,
      series: [{
        name: '点击次数',
        color: '#ff1744',
        data: [23, 28, 35, 54, 95],
        format: function(val, name) {
          return val.toFixed(2);
        }
      }, {
        name: '感应人数',
        color: '#188df0',
        data: [2, 3, 4, 5, 9],
        format: function(val, name) {
          return val;
        }
      }],
      yAxis: {
        format: function(val) {
          return val;
        },
        min: 0
      },
      xAxis: {
        disableGrid: true,
        type: 'calibration'
      },
      extra: {
        // lineStyle: 'curve',
        // legendTextColor: '#000000'
      },
      width: windowWidth,
      height: 180,
    });
  },
  changeTab(e) {
    var i = e.currentTarget.dataset.type,
      startDate, endDate;
    if (i == 'day') {
      startDate = app.getTime(0, 0, 0, -30).substr(0, 10)
      endDate = app.getTime().substr(0, 10)
    } else if (i == 'month')  {
      startDate = app.getTime(0, 0, 0, -365).substr(0, 10)
      endDate = app.getTime().substr(0, 10)
    } else if (i == 'hour') {
      startDate = '00:00'
      endDate = app.getTime().substr(11, 5)
    }
    this.setData({
      selectedTab: i,
      reportType: i.substr(0, 1) + i.substr(0, 1),
      startDate,
      endDate
    })
    // this.drawCanvas();
  },
  bindDateStart(e) {
    console.log(e.detail.value)
    this.setData({
      startDate: e.detail.value
    })
  },
  bindDateEnd(e) {
    console.log(e.detail.value)
    this.setData({
      endDate: e.detail.value
    })
  }
})