// pages/deviceManagement/deviceManagement.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    permissions:{
      Device:3,
      Ads:1,
      Devices:2
    },
    get nowTab(){
      for (var i of [1,2,3]){
        console.log(i)
      }
      return this.MaxResultCount_d
    },
    Ads:false,
    Devices:false,
    deviceList: [],
    totalCount_d: '',
    page_d: 0,
    MaxResultCount_d: 12
  },
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
      console.log(res);
      this.setData({
        deviceList: this.data.deviceList.concat(res.items),
        totalCount_d: res.totalCount
      })
      wx.stopPullDownRefresh();
    })
  },
  goDevice(e){
    wx.setStorageSync('deviceDetail', e.currentTarget.dataset.device);
    console.log(e.currentTarget.dataset.device)
    wx.navigateTo({
      url: '/pages/device/deviceDetail/deviceDetail',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getDeviceList();
    
    getApp().promise(getApp().req)({
      url: '/s/AbpUserConfiguration/GetAll'
    }).then(res => {
      console.log(res)
      this.setData({
        Ads: res.auth.grantedPermissions['Pages.Tenant.Ads']=="true"?true:false,
        Devices: res.auth.grantedPermissions['Pages.Tenant.Devices'] == "true" ? true : false
      })
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
    // console.log('pulldown')
    this.setData({
      totalCount_d: '',
      deviceList: [],
      page_d:0
    })
    this.getDeviceList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.deviceList.length < this.data.totalCount_d) {
      this.data.page_d++;
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