// components/dialog/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showDialog: {
      type: Boolean,
      value: false,
      observer(newData, oldData) {
        if (newData) {
          setTimeout(() => {
            this.setData({
              isOpen: newData
            })
          }, 20)
        } else {
          this.setData({
            isOpen: false
          })
        }
      }
    },
    showClose: {
      type:Boolean,
      value: true
    },
    bodyBg: {
      type: String,
      value: 'transparent'
    },
    width: {
      type: String,
      value: '60%'
    },
    top: {
      type: String,
      value: '20%'
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    isOpen: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleClose() {
      this.triggerEvent('close')
    }
  }
})



