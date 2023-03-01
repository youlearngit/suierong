// sub3/pages/reservedAccChg/result.js
var app = getApp();
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    preffixUrl: app.globalData.CDNURL,
    checked: true,
    info: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    if (options.data) {
      // let res =JSON.parse(options.data)
      // res.yyh=JSON.parse(res.yyh).join(',')
      that.setData({
        info: JSON.parse(options.data)
      })
    }

    this.setData({
      wdInfo: JSON.parse(wx.getStorageSync('wdInfo'))
    })
  },
  exit() {
    wx.navigateBack({
      delta: 5,
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})