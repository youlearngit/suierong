// sub6/pages/agriculture/propertyRight.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cndUrl: app.globalData.CDNURL,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  getImage(e) {
    console.log(e.currentTarget.dataset.image);
    wx.previewImage({
      current: e.currentTarget.dataset.image, // 当前显示图片的 http 链接
      urls:[ e.currentTarget.dataset.image] // 需要预览的图片 http 链接列表
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})