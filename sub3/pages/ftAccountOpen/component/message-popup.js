const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showTip:{
      type:Boolean,
      default:false,
    },
    message:{
      type:String,
      default:"",
    },
  },
options: function(e){debugger},
  /**
   * 组件的初始数据
   */
  data: {
    showTip:false,
    preffixUrl:app.globalData.CDNURL,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    close(){
      this.setData({
        showTip : false
      });
    }
  },
  ready() {
  },
})
