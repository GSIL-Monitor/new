const app = getApp()
Page({
  data: {
    deviceId: '',
    stopReachBottom: false,
    productList: [],
    totalCount_p: '',
    page_p: 0,
    MaxResultCount_p: 12,
    filter: '',
    historyArray: [],
    showList: false
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
  //商品
  getProductList() {
    app.promise(app.req)({
      url: '/s/api/services/app/Device/GetProductsByDeviceId',
      data: {
        DeviceId: this.data.deviceId,
        AuditStatus: 'Online',
        Filter: this.data.filter,
        MaxResultCount: this.data.MaxResultCount_p,
        SkipCount: this.data.page_p * this.data.MaxResultCount_p
      }
    }).then(res => {
      console.log(res)
      // res.items = app.changeFileUrl(res.items, 'picUrl');
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
  bindconfirm(e) {
    var value = e.detail.value ? e.detail.value : e.currentTarget.dataset.detail;
    console.log(e,value)
    this.setData({
      filter: value,
      showList: true,
      totalCount_p: '',
      productList: [],
      page_p: 0
    })
    if (value) {
      if (this.data.historyArray.indexOf(value) < 0) { //新的
        if (this.data.historyArray.length == 20) {
          this.data.historyArray.length = 19;
        }
        this.data.historyArray.unshift(value);
      } else { //旧的
        this.data.historyArray.unshift(this.data.historyArray.splice(this.data.historyArray.indexOf(value), 1)[0])
      }
      this.setData({
        historyArray: this.data.historyArray
      })
      wx.setStorageSync('historyArray', this.data.historyArray);
    }
    this.getProductList();
  },
  showHistory() {
    this.setData({
      showList: false
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
      deviceId: wx.getStorageSync('deviceId'),
      historyArray: wx.getStorageSync('historyArray') ? wx.getStorageSync('historyArray') : []
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
      stopReachBottom: false,
      totalCount_p: '',
      productList: [],
      page_p: 0,
      filter: '',
      showList: false
    })
    this.getProductList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.stopReachBottom) return
    if (this.data.productList.length < this.data.totalCount_p) {
      this.setData({
        stopReachBottom: true
      })
      this.data.page_p++;
      this.getProductList();
    }
  }
})