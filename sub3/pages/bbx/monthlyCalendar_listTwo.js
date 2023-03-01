import utils from './utils';
Page({
  data: {
    preffixUrl: utils.preffixUrl(),
  },
  phoneCall: function (e) {
    wx.makePhoneCall({
      phoneNumber: '0512-69820119',
    })
  },
  onLoad(options) {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },
})