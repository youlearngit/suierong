const App = getApp();
Component({
  data: {
    // 这里是一些组件内部数据
    watermarkText: '测试的水印代码',
    preffixUrl:'',
  },
  attached() {
    this.setData({
      watermarkText: '江苏银行',
      preffixUrl: App.globalData.URL
    })
  }
})