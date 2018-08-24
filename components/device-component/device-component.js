// components/device-component/device-component.js
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    deviceId: String,
    detail: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    deviceDetail: {},
    disabled: true,
    inputList: [{
      name: '设备编号',
      placeholder: '输入设备编号',
      inputName: 'outerId'
    }, {
      name: '硬件序列号',
      placeholder: '输入硬件序列号',
      inputName: 'hardwareCode'
    }, {
      name: '设备名称',
      placeholder: '输入设备名称',
      inputName: 'name'
    }, {
      name: '地址',
      placeholder: '输入设备放置位置',
      inputName: 'address'
    }, {
      name: 'IP地址',
      placeholder: '输入IP地址',
      inputName: 'intranetIP'
    }, {
      name: 'MAC',
      placeholder: 'MAC',
      inputName: 'mac'
    }, {
      name: '操作系统',
      placeholder: '输入操作系统',
      inputName: 'os'
    }, {
      name: '分辨率(宽)',
      placeholder: '分辨率(宽)',
      inputName: 'resolution_Width'
    }, {
      name: '分辨率(高)',
      placeholder: '分辨率(高)',
      inputName: 'resolution_Height'
    }],
    inputList2: [{
      name: '硬件序列号',
      placeholder: '输入硬件序列号',
      inputName: 'hardwareCode'
    }, {
      name: '设备名称',
      placeholder: '输入设备名称',
      inputName: 'name'
    }, {
      name: 'IP地址',
      placeholder: '输入IP地址',
      inputName: 'intranetIP'
    }, {
      name: 'MAC',
      placeholder: 'MAC',
      inputName: 'mac'
    }, {
      name: '操作系统',
      placeholder: '输入操作系统',
      inputName: 'os'
    }, {
      name: '分辨率(宽)',
      placeholder: '分辨率(宽)',
      inputName: 'resolution_Width'
    }, {
      name: '分辨率(高)',
      placeholder: '分辨率(高)',
      inputName: 'resolution_Height'
    }],
    deviceTypeArray: [],
    peripheralArray: [],
    peripheralsValueArr: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindPickerChange: function(e) {
      var index = e.detail.value;
      for (var i = 0; i < this.data.peripheralsValueArr.length; i++) {
        if (this.data.peripheralsValueArr[i].id == this.data.peripheralArray[index].selectKey) {
          var repeatIndex = i
        }
      }
      if (repeatIndex) {
        this.data.peripheralsValueArr.splice(repeatIndex, 1)
      } else {
        this.data.peripheralsValueArr.unshift({
          name: this.data.peripheralArray[index].selectValue,
          id: this.data.peripheralArray[index].selectKey
        })
      }
      this.setData({
        peripheralsValueArr: this.data.peripheralsValueArr,
        index
      })
    },
    bindTypeChange: function(e) {
      this.setData({
        typeIndex: e.detail.value
      })
    },
    bindTimeChange: function(e) {
      this.setData({
        'deviceDetail.shutdownTime': e.detail.value
      })
    },
    goEdit() {
      console.log(this.data.deviceId)
      wx.showLoading({
        title: '处理中,请稍候',
        mask: true,
      })
      var apiCount = 0;
      app.promise(app.req)({
        url: '/s/api/services/app/DeviceType/GetDeviceTypeSelect',
      }).then(res => {
        apiCount++;
        if (apiCount == 2) {
          wx.hideLoading()
          this.setData({
            disabled: false
          })
        }
        var deviceTypeRange = res.items.map(function(a) {
          return a.name
        })
        this.setData({
          deviceTypeArray: res.items,
          deviceTypeRange,
          typeIndex: deviceTypeRange.indexOf(this.data.deviceDetail.deviceType.name)
        })
      })
      app.promise(app.req)({
        method: 'POST',
        url: '/s/api/services/app/Peripheral/SelectPeriperal',
      }).then(res => {
        apiCount++;
        if (apiCount == 2) {
          wx.hideLoading()
          this.setData({
            disabled: false
          })
        }
        var peripheralRange = res.map(function(a) {
          return a.selectValue
        })
        this.setData({
          peripheralArray: res,
          peripheralRange
        })
      })

    },
    goSave(e) {
      var submitObj = Object.assign({}, e.detail.value);
      if(!submitObj.name){
        wx.showToast({
          icon:'none',
          title: '请填写设备名称',
          duration: 1000
        })
        return 
      }
      if (this.data.deviceId) {
        if (submitObj.peripheralIds) {
          submitObj.peripheralIds = submitObj.peripheralIds.map((item) => {
            return item.id
          })
        }
        if (submitObj.shutdownTime) {
          submitObj.shutdownTime = '2017-12-31T' + submitObj.shutdownTime + ':00'
        }
        submitObj.id = this.data.deviceId;
        wx.showLoading({
          title: '处理中,请稍候',
          mask: true
        })
        app.promise(app.req)({
          method: 'PUT',
          url: '/s/api/services/app/Device/UpdateDevice',
          data: submitObj
        }).then(res => {
          wx.hideLoading()
          wx.showToast({
            title: '保存成功',
            duration: 1000
          })
          this.setData({
            initDeviceDetail: Object.assign({}, this.data.deviceDetail),
            disabled: true,
            initPeripheralsValueArr: this.data.peripheralsValueArr.concat()
          })
        })
      } else {//通过扫码添加设备
        console.log(submitObj)
        wx.showLoading({
          title: '处理中,请稍候',
          mask: true
        })
        app.promise(app.req)({
          method: 'POST',
          url: '/s/api/services/app/Device/CreateDeviceFromScanCode',
          data: submitObj
        }).then(res => {
          wx.hideLoading()
          wx.showToast({
            title: '添加成功',
            duration: 1000
          })
          wx.navigateBack();
        })
      }

    },
    cancelEdit() {
      this.setData({
        deviceDetail: Object.assign({}, this.data.initDeviceDetail),
        disabled: true,
        peripheralsValueArr: this.data.initPeripheralsValueArr.concat()
      })
    }
  },
  ready() {
    if (!this.data.deviceId) {
      this.setData({
        deviceDetail: JSON.parse(this.data.detail)
      })
      console.log(this.data.deviceDetail)
    } else {
      wx.showLoading({
        title: '加载中,请稍候',
        mask: true,
      })
      app.promise(app.req)({
        url: '/s/api/services/app/Device/GetDeviceById',
        data: {
          Id: this.data.deviceId
        }
      }).then(res => {
        wx.hideLoading()
        var peripheralsValueArr = [];
        for (var i = 0; i < res.peripherals.length; i++) {
          peripheralsValueArr.push({
            name: res.peripherals[i].peripheral.name,
            id: res.peripherals[i].peripheralId
          })
        }
        console.log(res.shutdownTime)
        if (res.shutdownTime) {
          res.shutdownTime = res.shutdownTime.slice(11, 16)
        } else {
          res.shutdownTime = ''
        }
        this.setData({
          deviceDetail: Object.assign({}, res),
          initDeviceDetail: Object.assign({}, res),
          peripheralsValueArr,
          initPeripheralsValueArr: peripheralsValueArr.concat()
        })

      })
    }

  }
})