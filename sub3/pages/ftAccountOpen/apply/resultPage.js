const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    accountType:'',
    preffixUrl: '',
    yywd:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      preffixUrl: app.globalData.CDNURL,
      accountType: options.accountType,
      yywd: options.yywd,
      yybh:options.yybh,
    });
  },

  submit: function(e){
    let pages = getCurrentPages();
    let prevPage = pages[getCurrentPages().length-6];//上一页面
    prevPage.setData({
      applyToListFlag: true,
    });
    wx.navigateBack({
      delta:  1,
    });
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
    let pages = getCurrentPages();
    let prevPage = pages[getCurrentPages().length-6];//上一页面
    prevPage.setData({
      applyToListFlag: true,
    });
    wx.navigateBack({
      delta:  5,
    });
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