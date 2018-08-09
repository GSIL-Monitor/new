const app = getApp()
Page({
  data: {
    focus: 0,
    hidden: true,
    nowFoucs: 0
  },
  formSubmit(e) {
    if (!(e.detail.value.tenant && e.detail.value.account && e.detail.value.password)) {
      wx.showModal({
        title: '提示',
        content: '请输入完整的租户，账号和密码',
        showCancel: false
      })
      return
    }
    wx.showLoading({
      title: '验证中,请稍候',
      mask: true,
    })
    app.promise(app.req)({
      method: 'POST',
      url: '/s/api/services/app/Account/IsTenantAvailable',
      data: {
        tenancyName: e.detail.value.tenant
      }
    }).then(res => {
      if (res.state == 1) {
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
          wx.setStorageSync('accessToken', 'Bearer ' + res.accessToken);
          wx.setStorageSync('userId', res.userId);
          this.getPermission(true);
        })
      } else {
        wx.hideLoading()
        wx.showToast({
          title: '该租户不存在或已被锁定',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  bindconfirm(e) { //下一个
    this.setData({
      'focus': e.target.dataset.index
    })
  },
  bindfocus(e) {
    this.setData({
      nowFoucs: e.target.dataset.index
    })
  },
  getPermission(needUserInfo) {
    app.promise(app.req)({
      url: '/s/api/services/app/User/GetUserPermissionsForEdit',
      data: {
        id: wx.getStorageSync('userId')
      }
    }).then(res => {
      wx.setStorageSync('permission', res.grantedPermissionNames);
      if (needUserInfo){
        this.getUserInfo();
      }else{
        wx.hideLoading()
        wx.switchTab({
          url: '../index/index'
        })
      }
    })
  },
  getUserInfo() {
    app.promise(app.req)({
      url: '/s/api/services/app/User/GetUserForEdit',
      data: {
        Id: wx.getStorageSync('userId')
      }
    }).then(res => {
      console.log(res);
      if (res.profilePictureId) {
        app.promise(app.req)({
          url: '/s/api/services/app/Profile/GetProfilePictureById',
          data: {
            profilePictureId: res.profilePictureId
          }
        }).then(picData => {
          wx.setStorageSync('headPic', 'data:image/png;base64,' + picData.profilePicture)
        })
      }else{
        wx.removeStorageSync('headPic');
      }
      app.promise(app.req)({
        url: '/s/api/services/app/OrganizationUnit/GetCurrentUserOrganizationUnits'
      }).then(ou => {
        wx.hideLoading()
        wx.setStorageSync('ouStore', { name: ou.items[0] ? ou.items[0].name : '暂无', id: ou.items[0] ? ou.items[0].value : ''})
        wx.setStorageSync('userName', res.user.name)
        wx.switchTab({
          url: '../index/index'
        })
      })
    })
  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.showTip) { //来自注销或过期
      wx.removeStorageSync('tenantId');
      wx.removeStorageSync('accessToken');
      wx.showModal({
        title: '提示',
        content: '登陆已过期，请重新登陆',
        showCancel: false
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    if (wx.getStorageSync('accessToken')) {
      this.getPermission(false);
    } else {
      this.setData({
        hidden: false
      });
    }
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