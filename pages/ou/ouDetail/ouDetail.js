// pages/ou/ouDetail/ouDetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tenantId: '',
    tenantDetail: {},
    editionName: ''
  },
  reLogin: function() {
    //找到userList,取其中admin的一个
    app.promise(app.req)({
      url: '/s/api/services/app/CommonLookup/FindUsers',
      method: 'POST',
      data: {
        Id: this.data.tenantId,
        filter: "admin",
        maxResultCount: "10",
        skipCount: 0,
      }
    }).then(res => {
      console.log(res.items[0].value)
      //使用目标租户Id和userId获取impersonationToken
      app.promise(app.req)({
        url: '/s/api/services/app/Account/Impersonate',
        method: 'POST',
        data: {
          userId: res.items[0].value,
          tenantId: this.data.tenantId
        }
      }).then(res => {
        console.log(res)

        wx.setStorageSync('tenantId', this.data.tenantId);
        wx.removeStorageSync('accessToken')

        //使用impersonationToken获取新的accessToken并进行登录
        app.promise(app.req)({
          url: '/s/api/TokenAuth/ImpersonatedAuthenticate',
          method: 'POST',
          data: {
            impersonationToken: res.impersonationToken
          }
        }).then(res => {
          console.log(res)
          // res.accessToken
          wx.setStorageSync('accessToken', 'Bearer ' + res.accessToken);
          wx.redirectTo({ url: '../login/login' });
        })
      })

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('路由参数', options)
    this.setData({
      tenantId: options.id
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
    app.promise(app.req)({
      url: '/s/api/services/app/Tenant/GetTenantForEdit',
      data: {
        Id: this.data.tenantId
      }
    }).then(res => {
      console.log(res)
      this.setData({
        tenantDetail: res
      })
      app.promise(app.req)({
        url: '/s/api/services/app/CommonLookup/GetEditionsForCombobox',
        data: {
          onlyFreeItems: false
        }
      }).then(res => {
        console.log(res.items)
        for (var i = 0; i < res.items.length; i++) {
          if (this.data.tenantDetail.editionId == res.items[i].value) {
            this.setData({
              editionName: res.items[i].displayText
            })
          }
        }
      })

    })


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