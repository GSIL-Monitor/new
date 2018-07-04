// pages/deviceManagement/deviceManagement.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceList:[],
    totalCount:undefined,
    page:0,
    MaxResultCount:10
  },
  getDeviceList(){
    getApp().promise(getApp().req)({
      url: '/Device/GetDevices',
      data: {
        // Status: 0,
        // Sorting: 'name',
        MaxResultCount: this.data.MaxResultCount,
        SkipCount: this.data.page*this.data.MaxResultCount 
      }
    }).then(res => {
      console.log(res);
      this.setData({
        deviceList: this.data.deviceList.concat(res.items),
        totalCount: res.totalCount
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    // wx.showLoading({
    //   title: 'loadddd',
    // })
    this.getDeviceList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // console.log('pulldown')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.deviceList.length<this.data.totalCount){
      this.data.page++;
      this.getDeviceList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})