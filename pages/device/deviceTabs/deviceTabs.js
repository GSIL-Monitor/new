const app = getApp()
Page({
  data: {
    permissions: {
      Ads: {
        name: '广告',
        permit: true,
        self: 'Ads'
      },
      Apps: {
        name: '应用',
        permit: true,
        self: 'Apps'
      },
      Products: {
        name: '商品',
        permit: true,
        self: 'Products'
      },
      Coupons: {
        name: '红包',
        permit: true,
        self: 'Coupons'
      }
    },
    get nowTab() {
      for (var i in this.permissions) {
        if (this.permissions[i]) return i
      }
    },
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
    this.setData({
      nowTab: e.currentTarget.dataset.tab
    })
    this.goGetList(this.data.nowTab);
  },
  goGetList(e) { //第一次获取数据
    switch (e) {
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
      default:
        console.log('没有任何权限,请联系管理员')
    }
  },
  //应用
  getAppList(cb) {
    app.promise(app.req)({
      url: '/s/api/services/app/Device/GetDevices',
      data: {
        // Status: 0,
        // Sorting: 'name',
        MaxResultCount: this.data.MaxResultCount_ap,
        SkipCount: this.data.page_ap * this.data.MaxResultCount_ap
      }
    }).then(res => {
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
      url: '/s/api/services/app/Ad/GetAds',
      data: {
        // Status: 0,
        // Sorting: 'name',
        MaxResultCount: this.data.MaxResultCount_ad,
        SkipCount: this.data.page_ad * this.data.MaxResultCount_ad
      }
    }).then(res => {
      console.log(res);
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
  //红包
  getCouponList(cb) {
    app.promise(app.req)({
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
  //商品
  getProductList(cb) {
    app.promise(app.req)({
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // app.promise(app.req)({
    //   url: '/s/AbpUserConfiguration/GetAll'
    // }).then(res => {
    //   console.log(res);
    //   this.setData({
    //     'permissions.Ads.permit': res.auth.grantedPermissions['Pages.Tenant.Ads'] == "true" ? true : false,
    //     'permissions.Apps.permit': res.auth.grantedPermissions['Pages.Tenant.Apps'] == "true" ? true : false,
    //     'permissions.Coupons.permit': res.auth.grantedPermissions['Pages.Tenant.Coupons'] == "true" ? true : false,
    //     'permissions.Products.permit': res.auth.grantedPermissions['Pages.Tenant.Products'] == "true" ? true : false,
    //   })
    //   this.goGetList(this.data.nowTab);
    // })
    this.goGetList(this.data.nowTab);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({ deviceDetail: wx.getStorageSync('deviceDetail') })
    console.log(this.data.deviceDetail)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.removeStorageSync('deviceDetail')
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
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
  onReachBottom: function () {
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
  onShareAppMessage: function () {
    return {
      title: '自定义转发标题'
    }
  }
})