//获取应用实例
const app = getApp()
const wxCharts = require('../../utils/wxcharts.js')

Page({
  data: {
    title: wx.getStorageSync('ouStore').name != '暂无' ? wx.getStorageSync('ouStore').name : wx.getStorageSync('userName'),
    topSku: [],
    statisticalData: [],
    startDate: app.getTime(0, 0, 0, -10).substr(0, 10),
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
    this.drawCanvas([], [], []);
    this.getChartReport();
  },
  onPullDownRefresh: function() {
    wx.reLaunch({
      url: '../index/index',
    })
  },
  onShareAppMessage: function() {
    return {
      title: '自定义转发标题'
    }
  },
  getChartReport() {
    if (this.data.loadingCanvas) return
    var startTime, endTime, type;
    if (this.data.selectedTab == "day") {
      startTime = this.data.startDate + "T00:00:00.000Z";
      endTime = this.data.endDate + "T23:59:59.999Z";
      type = 'dd';
    } else if (this.data.selectedTab == "month") {
      startTime = this.data.startDate + "T00:00:00.000Z";
      endTime = this.data.endDate + "T23:59:59.999Z";
      type = 'mm';
    } else if (this.data.selectedTab == "hour") {
      startTime = app.getTime().substr(0, 11) + this.data.startDate + ":00.000Z";
      endTime = app.getTime().substr(0, 11) + this.data.endDate + ":59.999Z";
      type = 'hh';
    }
    this.setData({
      loadingCanvas: true
    })
    //报表数据
    app.promise(app.req)({
      method: 'POST',
      url: '/d/api/services/app/Report/GetBehaviorChartReport',
      data: {
        actions: "click,enter",
        categories: null,
        startTime,
        endTime,
        type,
        organizationUnitIds: [Number(wx.getStorageSync('ouStore').id)]
        // organizationUnitIds: [30552, 30564, 40580, 40583, 30560, 10058, 30558, 10054, 30550, 30551, 30561, 30559, 10057, 10055, 10053, 10056, 10052]
      }
    }).then(res => {
      this.setData({
        loadingCanvas: false
      })
      console.log('报表数据', res)
      var categories = res[0].chartItems.map((item) => {
        return item.date
      })
      var clickData = res[0].chartItems.map((item) => {
        return item.value
      })
      var enterData = res[1].chartItems.map((item) => {
        return item.value
      })
      this.drawCanvas(categories, clickData, enterData)
    })

  },
  drawCanvas(categories, clickData, enterData) {
    var windowWidth = wx.getSystemInfoSync().windowWidth;
    var columnChart = new wxCharts({
      canvasId: 'myCanvas',
      type: 'line', //饼pie,圆ring,线line,柱column,区域area,雷达radar
      animation: false,
      categories,
      dataPointShape: true,
      series: [{
        name: '点击次数',
        color: '#ff1744',
        data: clickData,
        format: function(val, name) {
          return val;
        }
      }, {
        name: '感应人数',
        color: '#188df0',
        data: enterData,
        format: function(val, name) {
          return val;
        }
      }],
      yAxis: {
        format: function(val) {
          return val;
        },
        min: 0,
        max: 10
      },
      xAxis: {
        disableGrid: true,
        type: 'calibration'
      },
      extra: {
        lineStyle: 'curve',
        // legendTextColor: 'red'
      },
      width: windowWidth,
      height: windowWidth * 2 / 3,
    });
  },
  changeTab(e) {
    var i = e.currentTarget.dataset.type,
      startDate, endDate;
    if (i == 'day') {
      startDate = app.getTime(0, 0, 0, -10).substr(0, 10)
      endDate = app.getTime().substr(0, 10)
    } else if (i == 'month') {
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
    // this.drawCanvas([],[],[])
    this.getChartReport()
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