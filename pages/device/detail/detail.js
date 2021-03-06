// pages/device/detail/detail.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: true,
    get type() {
      return wx.getStorageSync('detailData').type
    },
    get detail() {
      return wx.getStorageSync('detailData').detail
    },
    get deviceId() {
      return wx.getStorageSync('deviceId')
    }
  },
  goBack() {
    wx.navigateBack();
  },
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
        deviceId: this.data.deviceId,
        appId: this.data.detail.softwareId
      }
    }).then(res => {
      wx.hideLoading();
      if (res === true) {
        wx.showToast({
          title: '切换成功',
          icon: 'success',
          duration: 1500
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    console.log(this.data.type, this.data.detail)
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
    wx.removeStorageSync('detailData');
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})