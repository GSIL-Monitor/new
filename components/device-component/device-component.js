// components/device-component/device-component.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    inputList: [{
      name: '设备编号',
      placeholder: '输入设备编号'
    }, {
      name: '硬件序列号',
      placeholder: '输入硬件序列号'
    }, {
      name: '设备名称',
      placeholder: '输入设备名称'
    }, {
      name: '地址',
      placeholder: '输入设备放置位置'
    }, {
      name: 'IP地址',
      placeholder: '输入IP地址'
    }, {
      name: '操作系统',
      placeholder: '输入操作系统'
    }],
    array: [{
      name: '美国',
      id: 11
    }, {
      name: '中国',
      id: 22
    }, {
      name: '法国',
      id: 33
    }, {
      name: '德国',
      id: 44
    }, ],
    get array0(){
      return [1,2,3,4]
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindPickerChange: function(e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        index: e.detail.value
      })
    }
  }
})