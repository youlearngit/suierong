const app = getApp();
// pages/mine/feedback_suc.js
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
      preffixUrl: app.globalData.URL
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
})