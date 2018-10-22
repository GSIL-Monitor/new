const app = getApp()
Page({
  data: {
    stopReachBottom: false,
    deviceList: [],
    totalCount: '',
    onlineCount: '',
    filter: '',
    page: 0,
    MaxResultCount: 12,
    devicesPermit: false,
    title: '',
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
      console.log(res)
      res.items = app.changeFileUrl(res.items, 'deviceType', 'iconUrl');
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
        var arr = res.result.split(';')
        if (arr.length == 8 && arr[0] == 'tron' && arr[7] == 'cell') {
          // console.log('符合标准')
          // app.promise(app.req)({
          //   method: 'POST',
          //   url: '/s/api/services/app/Device/CreateDevice',
          //   data: {
          //     name: '新增设备',
          //     mac: arr[1],
          //     os: arr[2],
          //     resolution_Width: arr[3],
          //     resolution_Height: arr[4],
          //     intranetIP: arr[5],
          //     hardwareCode: arr[6]
          //   }
          // }).then(res => {
          //   console.log(res.id)
          //   wx.setStorageSync('deviceId', res.id);
          //   wx.navigateTo({
          //     url: '/pages/device/deviceTabs/deviceTabs',
          //   })
          // })
          var data = {
            mac: arr[1],
            os: arr[2],
            resolution_Width: arr[3],
            resolution_Height: arr[4],
            intranetIP: arr[5],
            hardwareCode: arr[6]
          }
          wx.navigateTo({
            url: '/pages/device/addDevice/addDevice?data=' + JSON.stringify(data),
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '二维码格式不符,请重新扫描',
            showCancel: false
          })
        }
      },
      fail: (res) => {
        wx.showModal({
          title: '提示',
          content: '未找到二维码,请重新扫描',
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
  onShow: function(options) {
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
    this.setData({
      devicesPermit: app.checkPermission('Pages.Tenant.Devices'),
      title: wx.getStorageSync('ouStore').name != '暂无' ? wx.getStorageSync('ouStore').name : wx.getStorageSync('userName')
    })
    if (this.data.devicesPermit) {
      this.setData({ //每次调用wx.scanCode都会重新触发onShow,因此需要重置
        deviceList: [],
        page: 0
      })
      this.getDeviceList();
      this.getOnlineDeviceCount();
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    if (this.data.devicesPermit) {
      this.setData({
        stopReachBottom: false,
        onlineCount: '',
        filter: '',
        deviceList: [],
        page: 0
      })
      this.getDeviceList();
      this.getOnlineDeviceCount();
    } else {
      wx.stopPullDownRefresh();
    }

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