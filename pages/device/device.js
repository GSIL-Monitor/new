const app = getApp()
Page({
  data: {
    stopReachBottom: false,
    //设备
    deviceList: [],
    totalCount: '',
    page: 0,
    MaxResultCount: 12,
  },
  //设备
  getDeviceList(cb) {
    app.promise(app.req)({
      url: '/s/api/services/app/Device/GetDevices',
      data: {
        // Status: 0,
        // Sorting: 'name',
        MaxResultCount: this.data.MaxResultCount,
        SkipCount: this.data.page * this.data.MaxResultCount
      }
    }).then(res => {
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
  goDevice(e) {
    wx.setStorageSync('deviceDetail', e.currentTarget.dataset.device);
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
    app.promise(app.req)({
      url: '/s/api/services/app/User/GetUserPermissionsForEdit',
      data:{
        id: wx.getStorageSync('userId')
      }
    }).then(res => {
      wx.setStorageSync('permission', res.grantedPermissionNames);
      if (app.checkPermission('Pages.Tenant.Devices')) {
        this.getDeviceList();
      } else {
        console.log('没有权限');
      }
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.setData({
      stopReachBottom: false,
      totalCount: '',
      deviceList: [],
      page: 0
    })
    this.getDeviceList();
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