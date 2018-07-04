
Page({

  data: {
    focus:0,
    hidden:true
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

    getApp().promise(getApp().req)({
      method: 'POST',
      url: '/Account/IsTenantAvailable',
      data: { tenancyName: e.detail.value.tenant }
    }).then(res=>{
      if(res.state==1){
        wx.setStorageSync('tenantId', res.tenantId);
        console.log(266)
        getApp().promise(getApp().req)({
          method: 'POST',
          server: 's_api',
          url: '/TokenAuth/Authenticate',
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
    console.log(e.target.dataset.index)
    this.setData({
      'focus': e.target.dataset.index
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