// sub2/pages/bindCardSms/error.js
var app = getApp();
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cdnurl: app.globalData.CDNURL,
    tip: '',
    isIPhoneX: false,
    ios: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    const isIPhoneX = () => {
      let screenHeight = wx.getSystemInfoSync().screenHeight
      let bottom = wx.getSystemInfoSync().safeArea.bottom
      return screenHeight !== bottom
    }
    this.setData({
      isIPhoneX: isIPhoneX()
    })

    let tipBottom = '';
    if (isIPhoneX()) {
      // tipBottom = 'bottom:260rpx;'
      tipBottom='bottom:130px;'
    } else {
      tipBottom='bottom:96px;'

      // tipBottom = 'bottom:192rpx;'
    }
    wx.getSystemInfo({
      success(res) {
        if (res.system.includes("iOS")) {
          that.setData({
            tip: 'font-family: PingFangSC-Medium;' + tipBottom,
            ios: true
          })
        } else {
          that.setData({
            tip: 'font-weight: 400;text-stroke: 0.02em;-webkit-text-stroke: 0.02em;' + tipBottom,
            ios: false
          })
        }
      }
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
    wx.hideHomeButton()

  }

})