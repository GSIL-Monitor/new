Page({
  data: {
    permissions: {
      Ads: {
        name: '广告',
        permit: false,
        self: 'Ads'
      },
      Devices: {
        name: '设备',
        permit: false,
        self: 'Devices'
      },
      Coupons: {
        name: '红包',
        permit: false,
        self: 'Coupons'
      },
      Products: {
        name: '商品',
        permit: false,
        self: 'Products'
      }
    },
    get nowTab() {
      for (var i in this.permissions) {
        if (this.permissions[i]) return i
      }
    },
    stopReachBottom: false,
    //设备
    deviceList: [],
    totalCount_d: '',
    page_d: 0,
    MaxResultCount_d: 12,
    //广告
    adList: [],
    totalCount_a: '',
    page_a: 0,
    MaxResultCount_a: 12,
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
    this.setData({
      nowTab: e.currentTarget.dataset.tab
    })
    this.goGetList(this.data.nowTab);
  },
  goGetList(e) { //第一次获取数据
    switch (e) {
      case 'Devices':
        if (!this.data.totalCount_d) this.getDeviceList();
        break;
      case 'Ads':
        if (!this.data.totalCount_a) this.getAdList();
        break;
      case 'Coupons':
        if (!this.data.totalCount_c) this.getCouponList();
        break;
      case 'Products':
        if (!this.data.totalCount_p) this.getProductList();
        break;
      default:
        console.log('没有任何权限,请联系管理员')
    }
  },
  //设备
  getDeviceList(cb) {
    getApp().promise(getApp().req)({
      url: '/s/api/services/app/Device/GetDevices',
      data: {
        // Status: 0,
        // Sorting: 'name',
        MaxResultCount: this.data.MaxResultCount_d,
        SkipCount: this.data.page_d * this.data.MaxResultCount_d
      }
    }).then(res => {
      this.setData({
        deviceList: this.data.deviceList.concat(res.items),
        totalCount_d: res.totalCount
      })
      wx.stopPullDownRefresh();
      this.setData({
        stopReachBottom: false
      })
    })
  },
  goDevice(e) {
    wx.setStorageSync('deviceDetail', e.currentTarget.dataset.device);
    console.log(e.currentTarget.dataset.device)
    wx.navigateTo({
      url: '/pages/device/deviceDetail/deviceDetail',
    })
  },
  //广告
  getAdList(cb) {
    getApp().promise(getApp().req)({
      url: '/s/api/services/app/Ad/GetAds',
      data: {
        // Status: 0,
        // Sorting: 'name',
        MaxResultCount: this.data.MaxResultCount_a,
        SkipCount: this.data.page_a * this.data.MaxResultCount_a
      }
    }).then(res => {
      console.log(res);
      this.setData({
        adList: this.data.adList.concat(res.items),
        totalCount_a: res.totalCount
      })
      wx.stopPullDownRefresh();
      this.setData({
        stopReachBottom: false
      })
    })
  },
  goAd(e) {
    console.log(e);
  },
  //红包
  getCouponList(cb) {
    getApp().promise(getApp().req)({
      url: '/s/api/services/app/Coupon/GetCoupons',
      data: {
        // Status: 0,
        // Sorting: 'name',
        MaxResultCount: this.data.MaxResultCount_c,
        SkipCount: this.data.page_c * this.data.MaxResultCount_c
      }
    }).then(res => {
      console.log(res);
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
  goCoupon(e) {
    console.log(e);
  },
  //商品
  getProductList(cb) {
    getApp().promise(getApp().req)({
      url: '/s/api/services/app/Product/GetProducts',
      data: {
        // Status: 0,
        // Sorting: 'name',
        MaxResultCount: this.data.MaxResultCount_p,
        SkipCount: this.data.page_p * this.data.MaxResultCount_p
      }
    }).then(res => {
      console.log(res)
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
  goProduct(e) {
    console.log(e)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    getApp().promise(getApp().req)({
      url: '/s/AbpUserConfiguration/GetAll'
    }).then(res => {
      console.log(res);
      this.setData({
        'permissions.Ads.permit': res.auth.grantedPermissions['Pages.Tenant.Ads'] == "true" ? true : false,
        'permissions.Devices.permit': res.auth.grantedPermissions['Pages.Tenant.Devices'] == "true" ? true : false,
        'permissions.Coupons.permit': res.auth.grantedPermissions['Pages.Tenant.Coupons'] == "true" ? true : false,
        'permissions.Products.permit': res.auth.grantedPermissions['Pages.Tenant.Products'] == "true" ? true : false,
      })
      this.goGetList(this.data.nowTab);
    })
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
    this.setData({
      stopReachBottom:false,
      totalCount_d: '',
      deviceList: [],
      page_d: 0,
      totalCount_a: '',
      adList: [],
      page_a: 0,
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
      case 'Devices':
        if (this.data.deviceList.length < this.data.totalCount_d) {
          this.setData({
            stopReachBottom: true
          })
          this.data.page_d++;
          this.getDeviceList();
        }
        break;
      case 'Ads':
        if (this.data.adList.length < this.data.totalCount_a) {
          this.setData({
            stopReachBottom: true
          })
          this.data.page_a++;
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