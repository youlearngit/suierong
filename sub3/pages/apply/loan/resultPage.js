// pages/carLoans/apply/loan/resultPage.js
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
        bgUrl: '',
        title: '',
        title1: '',
        title2: '',
        title3: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        that.setData({
            preffixUrl: app.globalData.CDNURL,
            status: options.status,
            title: options.type ? '个人房屋类贷款' : '个人汽车消费贷款',
            title1: '线上申请',
            title2: options.type ? '快速响应' : '快速审批',
            title3: options.type ? '专属服务' : '还款便捷',
            bgUrl: options.type ? `${app.globalData.CDNURL}/static/wechat/img/carloans/confirm_home_background.png` : `${app.globalData.CDNURL}/static/wechat/img/carloans/confirm_loan_background.png`,
            errorMsg: options.status == '1' ? '' : options.errorMsg,
            backPageSize: getCurrentPages().length - 1
        });
    },

  toResultPage(){
    let pages = getCurrentPages();
    let prevPage = pages[wx.getStorageSync('carPageIndex')-1];//上一页面
    prevPage.setData({//直接给上移页面赋值
      type: 'applyResult',
    });
    wx.navigateBack({
      delta:  getCurrentPages().length  - wx.getStorageSync('carPageIndex'),
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