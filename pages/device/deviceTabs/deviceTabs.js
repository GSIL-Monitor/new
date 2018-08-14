const app = getApp()
Page({
  data: {
    currentIndex: 0,
    deviceId: {},
    permissions: {
      Detail: {
        name: '详情',
        permit: true,
        self: 'Detail',
        index: 0
      },
      Ads: {
        name: '广告',
        permit: false,
        self: 'Ads',
        index: 1
      },
      Apps: {
        name: '应用',
        permit: false,
        self: 'Apps',
        index: 2
      },
      Products: {
        name: '商品',
        permit: false,
        self: 'Products',
        index: 3
      },
      Coupons: {
        name: '红包',
        permit: false,
        self: 'Coupons',
        index: 4
      },
      Control: {
        name: '控制',
        permit: false,
        self: 'Control',
        index: 5
      }
    },
    nowTab: 'Detail',
    stopReachBottom: false,
    //应用
    appList: [],
    totalCount_ap: '',
    page_ap: 0,
    MaxResultCount_ap: 12,
    //广告
    adList: [],
    totalCount_ad: '',
    page_ad: 0,
    MaxResultCount_ad: 12,
    //红包
    couponList: [],
    totalCount_c: '',
    page_c: 0,
    MaxResultCount_c: 12,
    //商品
    productList: [],
    totalCount_p: '',
    page_p: 0,
    MaxResultCount_p: 12
  },
  changeTab(e) {
    var i = e.currentTarget.dataset.index;
    var newIndex = 0;
    if (i == 3) {
      newIndex = 1
    } else if (i > 3) {
      newIndex = 2
    }
    this.setData({
      nowTab: e.currentTarget.dataset.tab,
      currentIndex: newIndex
    })
    this.goGetList(this.data.nowTab);
  },
  goGetList(e) {
    switch (e) {
      case 'Detail':
        console.log('显示详情');
        break;
      case 'Apps':
        if (!this.data.totalCount_ap) this.getAppList();
        break;
      case 'Ads':
        if (!this.data.totalCount_ad) this.getAdList();
        break;
      case 'Coupons':
        if (!this.data.totalCount_c) this.getCouponList();
        break;
      case 'Products':
        if (!this.data.totalCount_p) this.getProductList();
        break;
        // default:
        // console.log('没有任何权限,请联系管理员')
    }
  },
  goDetailPage(e) {
    wx.setStorageSync('detailData', {
      type: e.currentTarget.dataset.type,
      detail: e.currentTarget.dataset.item
    });
    wx.navigateTo({
      url: '/pages/device/detail/detail'
    })
  },
  //应用
  getAppList(cb) {
    app.promise(app.req)({
      url: '/s/api/services/app/Device/GetSoftwaresByDeviceId',
      data: {
        DeviceId: this.data.deviceId,
        AuditStatus: 'Online',
        MaxResultCount: this.data.MaxResultCount_ap,
        SkipCount: this.data.page_ap * this.data.MaxResultCount_ap
      }
    }).then(res => {
      console.log(res)
      res.items = app.changeFileUrl(res.items, 'largeImageUrl');
      for (var item of res.items) {
        item.endTime = app.formatTime(item.endTime)
      }
      this.setData({
        appList: this.data.appList.concat(res.items),
        totalCount_ap: res.totalCount
      })
      wx.stopPullDownRefresh();
      this.setData({
        stopReachBottom: false
      })
    })
  },
  //广告
  getAdList(cb) {
    app.promise(app.req)({
      url: '/s/api/services/app/Device/GetAdsByDeviceId',
      data: {
        DeviceId: this.data.deviceId,
        AuditStatus: 'Online',
        MaxResultCount: this.data.MaxResultCount_ad,
        SkipCount: this.data.page_ad * this.data.MaxResultCount_ad
      }
    }).then(res => {
      res.items.map((item) => {
        if (!item.ageScope) {
          item.ageScope = '-'
        }
      })
      res.items = app.changeFileUrl(res.items, 'fileUrl');
      for (var item of res.items) {
        item.creationTime = app.formatTime(item.creationTime)
      }
      console.log(res.items)
      this.setData({
        adList: this.data.adList.concat(res.items),
        totalCount_ad: res.totalCount
      })
      wx.stopPullDownRefresh();
      this.setData({
        stopReachBottom: false
      })
    })
  },
  //商品
  getProductList(cb) {
    app.promise(app.req)({
      url: '/s/api/services/app/Device/GetProductsByDeviceId',
      data: {
        DeviceId: this.data.deviceId,
        AuditStatus: 'Online',
        MaxResultCount: this.data.MaxResultCount_p,
        SkipCount: this.data.page_p * this.data.MaxResultCount_p
      }
    }).then(res => {
      console.log(res)
      res.items = app.changeFileUrl(res.items, 'picUrl');
      for (var item of res.items) {
        item.creationTime = app.formatTime(item.creationTime)
      }
      this.setData({
        productList: this.data.productList.concat(res.items),
        totalCount_p: res.totalCount
      })
      wx.stopPullDownRefresh();
      this.setData({
        stopReachBottom: false
      })
    })
  },
  goSearch() {
    wx.navigateTo({
      url: '/pages/device/search/search?type='+this.data.nowTab
    })
  },
  //红包
  getCouponList(cb) {
    app.promise(app.req)({
      url: '/s/api/services/app/Device/GetCouponsByDeviceId',
      data: {
        DeviceId: this.data.deviceId,
        AuditStatus: 'Online',
        MaxResultCount: this.data.MaxResultCount_c,
        SkipCount: this.data.page_c * this.data.MaxResultCount_c
      }
    }).then(res => {
      console.log(res);
      res.items = app.changeFileUrl(res.items, 'pictures');
      for (var item of res.items) {
        item.creationTime = app.formatTime(item.creationTime)
        item.start_time = app.formatTime(item.start_time)
        item.end_time = app.formatTime(item.end_time)
      }
      this.setData({
        couponList: this.data.couponList.concat(res.items),
        totalCount_c: res.totalCount
      })
      wx.stopPullDownRefresh();
      this.setData({
        stopReachBottom: false
      })
    })
  },
  //控制
  publishEvent(e) {
    wx.showLoading({
      title: '处理中,请稍候',
      mask: true,
    })
    app.promise(app.req)({
      method: 'POST',
      url: '/s/api/services/app/DeviceAction/PublishEvent',
      data: {
        actionName: e.currentTarget.dataset.actionname,
        deviceId: this.data.deviceId
      }
    }).then(res => {
      wx.hideLoading();
      if (res === true) {
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 1500
        })
      }
    })
  },
  goBack() {
    wx.navigateBack();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      deviceId: wx.getStorageSync('deviceId')
    })
    // app.promise(app.req)({
    //   url: '/s/AbpUserConfiguration/GetAll'
    // }).then(res => {
    //   console.log(res);
    //   this.setData({
    //     'permissions.Ads.permit': res.auth.grantedPermissions['Pages.Tenant.Ads'] == "true" ? true : false,
    //     'permissions.Apps.permit': res.auth.grantedPermissions['Pages.Softwares'] == "true" ? true : false,
    //     'permissions.Coupons.permit': res.auth.grantedPermissions['Pages.Tenant.Coupons'] == "true" ? true : false,
    //     'permissions.Products.permit': res.auth.grantedPermissions['Pages.Tenant.Products'] == "true" ? true : false,
    //     'permissions.Control.permit': res.auth.grantedPermissions['Pages.Tenant.Devices.Control'] == "true" ? true : false,
    //   })
    //   this.goGetList(this.data.nowTab);
    // })
    this.setData({
      'permissions.Ads.permit': app.checkPermission('Pages.Tenant.Ads'),
      'permissions.Apps.permit': app.checkPermission('Pages.Softwares'),
      'permissions.Coupons.permit': app.checkPermission('Pages.Tenant.Coupons'),
      'permissions.Products.permit': app.checkPermission('Pages.Tenant.Products'),
      'permissions.Control.permit': app.checkPermission('Pages.Tenant.Devices.Control')
    })
    this.goGetList(this.data.nowTab);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    if (this.data.nowTab == "Detail" || this.data.nowTab == "Control") {
      wx.stopPullDownRefresh();
      return
    }
    this.setData({
      stopReachBottom: false,
      totalCount_ap: '',
      appList: [],
      page_ap: 0,
      totalCount_ad: '',
      adList: [],
      page_ad: 0,
      totalCount_c: '',
      couponList: [],
      page_c: 0,
      totalCount_p: '',
      productList: [],
      page_p: 0
    })
    this.goGetList(this.data.nowTab);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.stopReachBottom) return
    console.log(this.data.nowTab)
    switch (this.data.nowTab) {
      case 'Apps':
        if (this.data.appList.length < this.data.totalCount_ap) {
          this.setData({
            stopReachBottom: true
          })
          this.data.page_ap++;
          this.getAppList();
        }
        break;
      case 'Ads':
        if (this.data.adList.length < this.data.totalCount_ad) {
          this.setData({
            stopReachBottom: true
          })
          this.data.page_ad++;
          this.getAdList();
        }
        break;
      case 'Coupons':
        if (this.data.couponList.length < this.data.totalCount_c) {
          this.setData({
            stopReachBottom: true
          })
          this.data.page_c++;
          this.getCouponList();
        }
        break;
      case 'Products':
        if (this.data.productList.length < this.data.totalCount_p) {
          this.setData({
            stopReachBottom: true
          })
          this.data.page_p++;
          this.getProductList();
        }
        break;
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