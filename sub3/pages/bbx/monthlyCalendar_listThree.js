import utils from './utils';
Page({
  data: {
    preffixUrl: utils.preffixUrl(),
  },
  phoneCall: function (e) {
    wx.makePhoneCall({
      phoneNumber: '68788219',
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