import MYURLS from '../../utils/urls';
Page({
  data: {
    skipUrl: '',
  },
  onLoad(options) {
    let skipUrl = decodeURIComponent(options.skipUrl);
    this.setData({
      skipUrl: skipUrl,
    });
    wx.setStorageSync('skipUrl', skipUrl)
  },

  /**
   * 长按跳转
   */
  longTap() {
    var skipUrl = MYURLS.Urls.ccy
    wx.showModal({
      title: '提示',
      content: '是否跳转页面...',
      success: function(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../showWeb/showWeb?skipUrl=' + encodeURIComponent(skipUrl),
          });
        }
      },
    });
  },

  onShareAppMessage: options => {
    let return_url = encodeURIComponent(wx.getStorageSync('skipUrl')) //分享的当前页面的路径
    var path = '/pages/showImg/showImg?skipUrl=' + return_url //小程序存放分享页面的内嵌网页路径
    return {
      title: '',
      path: path,
    }
  },
});