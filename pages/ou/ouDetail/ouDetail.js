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
  reLogin:function(){
    
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