const app = getApp()
Page({
  data: {
    stopReachBottom: false,
    tenantList: [],
    totalCount: '',
    filter: '',
    page: 0,
    MaxResultCount: 12,
    title: '',
    get tenantPermit() {
      return app.checkPermission('Pages.Tenants')
    },
    get isHost() {
      return !wx.getStorageSync('tenantId')
    },
    get ouPermit() {
      return app.checkPermission('Pages.Administration.OrganizationUnits')
    }
  },
  getOu() {

  },
  bindconfirm(e) {
    console.log(e)
    this.setData({
      filter: e.detail.value,
      stopReachBottom: false,
      tenantList: [],
      page: 0
    })
    this.getTenant();
  },
  getTenant(cb) {
    app.promise(app.req)({
      url: '/s/api/services/app/Tenant/GetTenants',
      data: {
        Sorting: 'creationTime DESC',
        Filter: this.data.filter,
        MaxResultCount: this.data.MaxResultCount,
        SkipCount: this.data.page * this.data.MaxResultCount,
        EditionIdSpecified: false
      }
    }).then(res => {
      console.log(res)
      // res.items = app.changeFileUrl(res.items, 'deviceType', 'iconUrl');
      this.setData({
        tenantList: this.data.tenantList.concat(res.items),
        totalCount: res.totalCount
      })
      wx.stopPullDownRefresh();
      this.setData({
        stopReachBottom: false
      })
    })
  },

  goTenant(e) {
    wx.navigateTo({
      url: '/pages/ou/ouDetail/ouDetail?id=' + e.currentTarget.dataset.tenantid,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function(options) {
    this.setData({
      title: wx.getStorageSync('ouStore').name != '暂无' ? wx.getStorageSync('ouStore').name : wx.getStorageSync('userName')
    })
    if (this.data.isHost && this.data.tenantPermit) {
      this.getTenant();
    } else if (!this.data.isHost && !this.data.ouPermit) {
      this.getOu();
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    if (this.data.isHost && this.data.tenantPermit) {
      this.setData({
        stopReachBottom: false,
        filter: '',
        tenantList: [],
        page: 0
      })
      this.getTenant();
    } else {
      wx.stopPullDownRefresh();
    }

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.stopReachBottom) return
    if (this.data.tenantList.length < this.data.totalCount) {
      this.setData({
        stopReachBottom: true
      })
      this.data.page++;
      this.getTenant();
    }
  }
})