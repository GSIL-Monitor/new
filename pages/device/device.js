const app = getApp()
Page({
  data: {
    stopReachBottom: false,
    deviceList: [],
    totalCount: '',
    onlineCount: '',
    filter: '',
    page: 0,
    MaxResultCount: 12
  },
  bindconfirm(e) {
    console.log(e)
    this.setData({
      filter: e.detail.value,
      stopReachBottom: false,
      deviceList: [],
      page: 0
    })
    this.getDeviceList();
  },
  getDeviceList(cb) {
    app.promise(app.req)({
      url: '/s/api/services/app/Device/GetDevices',
      data: {
        // Status: 0,
        Sorting: 'name',
        Filter: this.data.filter,
        MaxResultCount: this.data.MaxResultCount,
        SkipCount: this.data.page * this.data.MaxResultCount
      }
    }).then(res => {
      // console.log(res)
      res.items = app.changeFileUrl(res.items, 'deviceType', 'iconUrl');
      console.log(res)
      this.setData({
        deviceList: this.data.deviceList.concat(res.items),
        totalCount: res.totalCount
      })
      wx.stopPullDownRefresh();
      this.setData({
        stopReachBottom: false
      })
    })
  },
  getOnlineDeviceCount() {
    app.promise(app.req)({
      url: '/s/api/services/app/Device/GetDevices',
      data: {
        Status: 1,
        // Sorting: 'name',
        MaxResultCount: 1,
        SkipCount: 0
      }
    }).then(res => {
      this.setData({
        onlineCount: res.totalCount
      })
    })
  },
  scan() {
    wx.scanCode({
      scanType: ['qrCode'],
      success: (res) => {
        wx.showModal({
          title: '提示',
          content: res.result,
          showCancel: false
        })
      }
    })
  },
  goDevice(e) {
    wx.setStorageSync('deviceId', e.currentTarget.dataset.deviceid);
    wx.navigateTo({
      url: '/pages/device/deviceTabs/deviceTabs',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // app.promise(app.req)({
    //   url: '/s/AbpUserConfiguration/GetAll'
    // }).then(res => {
    //   console.log(res);
    //   if (res.auth.grantedPermissions['Pages.Tenant.Devices'] == "true") {
    //     this.getDeviceList();
    //   } else {
    //     console.log('没有权限');
    //   }
    // })

    if (app.checkPermission('Pages.Tenant.Devices')) {
      this.getDeviceList();
      this.getOnlineDeviceCount();
    } else {
      console.log('没有权限');
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.setData({
      stopReachBottom: false,
      onlineCount: '',
      filter: '',
      deviceList: [],
      page: 0
    })
    this.getDeviceList();
    this.getOnlineDeviceCount();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.stopReachBottom) return
    if (this.data.deviceList.length < this.data.totalCount) {
      this.setData({
        stopReachBottom: true
      })
      this.data.page++;
      this.getDeviceList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '自定义转发标题'
    }
  }
})