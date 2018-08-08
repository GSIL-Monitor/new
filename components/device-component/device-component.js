// components/device-component/device-component.js
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    deviceId: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    deviceDetail: [],
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
    peripheralsValueArr:[],
    time: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindPickerChange: function(e) {
      var index = e.detail.value;
      for (var i = 0; i < this.data.peripheralsValueArr.length;i++){
        if(this.data.peripheralsValueArr[i].id == this.data.peripheralArray[index].selectKey){
          var repeatIndex = i
        }
      }
      if(repeatIndex){
        this.data.peripheralsValueArr.splice(repeatIndex, 1)
      }else{
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
        time: e.detail.value
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
    goSave() {
      console.log('保存')
    },
    cancelEdit() {
      this.setData({
        deviceId: wx.getStorageSync('deviceId'),
        disabled: true
      })
    }
  },
  ready() {
    wx.showLoading({
      mask: true,
    })
    app.promise(app.req)({
      url: '/s/api/services/app/Device/GetDeviceById',
      data: {
        Id: this.data.deviceId
      }
    }).then(res => {
      console.log(res)
      var peripheralsValueArr = [];
      for (var i = 0; i < res.peripherals.length; i++) {
        peripheralsValueArr.push({ name: res.peripherals[i].peripheral.name, id: res.peripherals[i].peripheralId})
      }
      wx.hideLoading()
      this.setData({
        deviceDetail: res,
        peripheralsValueArr
      })
    })
  }
})