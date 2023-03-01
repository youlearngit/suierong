// pages/carLoans/order/InformationPage/resultPage.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        preffixUrl: app.globalData.CDNURL,
        status: '',
        errorMsg: '',
        backPageSize: 1,
        title: '',
        title1: '',
        title2: '',
        title3: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        that.setData({
            preffixUrl: app.globalData.CDNURL,
            status: options.status,
            errorMsg: options.status == "1" ? '' : options.errorMsg,
            title: options.type ? '个人汽车消费贷款' : '个人房屋类贷款',
            title1: '线上申请',
            title2: options.type ? '快速审批' : '快速响应',
            title3: options.type ? '还款便捷' : '专属服务',
            bgurl: options.type ? `${app.globalData.CDNURL}/static/wechat/img/carloans/confirm_loan_background.png` : `${app.globalData.CDNURL}/static/wechat/img/carloans/confirm_home_background.png`,
            backPageSize: getCurrentPages().length - (wx.getStorageSync('carPageIndex') + 1),
        });
    },
    toOrdersPage() {
        wx.navigateBack({
            delta: this.data.backPageSize,
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
    onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

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