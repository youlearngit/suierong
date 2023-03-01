const App = getApp();
// pages/dian/dian_det.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    preffixUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      preffixUrl: App.globalData.URL,
      navTop: App.globalData.statusBarTop,
      navHeight: App.globalData.statusBarHeight,
    })
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 20000
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.hideToast();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  
  // onShareAppMessage: function () {
  //   let open_id1 = wx.getStorageSync('openid')
  //   //console.log(open_id1)
  //   var title = '江苏银行融惠e点通';
  //   var path = 'pages/shop/index2?open_id1=' + open_id1;
  //   return {
  //     title: title,
  //     path: path,
  //     success: function (res) {
  //       res.data
  //     },
  //     fail: function (res) {
  //     }
  //   }
  // },
  indexpage: function () {
    wx.switchTab({
      url: "/pages/shop/index2"
    })
  },
  prePage() {
    wx.navigateBack();
  }
})