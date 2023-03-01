Component({

  /**
   * 组件的属性列表
   */
  properties: {
    //关联集
    tradeTypeList:{
      type: Array
    },
    //组件显示开关
    show:{
      type: Boolean,
      default: 'ture'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    selectId1: '',
    selectId2: '',
    selectId3: '',
    selectId4: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    selectId1C(e) {
      // if (id === this.data.selectId1) {
      //   this.setData({
      //     selectId1: '',
      //     selectId2: '',
      //     selectId3: '',
      //     selectId4: '',
      //   })
      // } else {
      //   this.setData({
      //     selectId1: id
      //   })
      // }
      let id = e.currentTarget.dataset.id;
      let txt = e.currentTarget.dataset.txt;
      if (id === this.data.selectId4) {
        this.setData({
          selectId4: ''
        })
      } else {
        this.setData({
          selectId4: id,
          selectTxt: txt,
        })
      }
      this.triggerEvent('resInfo', {"value":id,"name":txt});
      this.setData({
        show: false
      })
    },
    selectId2C(e) {
      let id = e.currentTarget.dataset.id
  
      if (id === this.data.selectId2) {
        this.setData({
          selectId2: ''
        })
      } else {
        this.setData({
          selectId2: id
        })
      }
    },
    selectId3C(e) {
      let id = e.currentTarget.dataset.id
  
      if (id === this.data.selectId3) {
        this.setData({
          selectId3: ''
        })
      } else {
        this.setData({
          selectId3: id
        })
      }
    },
    selectId4C(e) {
      let id = e.currentTarget.dataset.id;
      let txt = e.currentTarget.dataset.txt;
      if (id === this.data.selectId4) {
        this.setData({
          selectId4: ''
        })
      } else {
        this.setData({
          selectId4: id,
          selectTxt: txt,
        })
      }
      this.triggerEvent('resInfo', {"value":id,"name":txt});
      this.setData({
        show: false
      })
    },
  }
})
