const app = getApp()
Page({
  data: {
    focus:0,
    hidden:true,
    nowFoucs:0
  },
  formSubmit(e){
    if (!(e.detail.value.tenant&&e.detail.value.account&&e.detail.value.password)){
      wx.showModal({
        title: '提示',
        content: '请输入完整的租户，账号和密码',
        showCancel: false
      })
      return
    }

    app.promise(app.req)({
      method: 'POST',
      url: '/s/api/services/app/Account/IsTenantAvailable',
      data: { tenancyName: e.detail.value.tenant }
    }).then(res=>{
      if(res.state==1){
        wx.setStorageSync('tenantId', res.tenantId);
        app.promise(app.req)({
          method: 'POST',
          url: '/s/api/TokenAuth/Authenticate',
          data: { 
            password: e.detail.value.password, 
            userNameOrEmailAddress: e.detail.value.account,
            rememberClient: false,
            singleSignIn: false
            }
        }).then(res => {
            console.log(res);
            wx.showToast({
              title: '登陆成功',
              icon: 'success',
              duration: 1000
            })
            wx.setStorageSync('accessToken', 'Bearer '+res.accessToken);
            wx.setStorageSync('userId', res.userId);
            wx.switchTab({
              url: '../index/index'
            })
        })
      } else {
        wx.showToast({
          title:'该租户不存在或已被锁定',
          icon:'none',
          duration:2000
        })
      }
    })
  },
  bindconfirm(e){//下一个
    this.setData({
      'focus': e.target.dataset.index
    })
  },
  bindfocus(e){
    this.setData({
      nowFoucs: e.target.dataset.index
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if (wx.getStorageSync('accessToken')) {
      wx.switchTab({
        url: '../index/index'
      })
    }else{
      this.setData({hidden : false});
    }
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
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})