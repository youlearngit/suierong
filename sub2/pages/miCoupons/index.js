// sub1/pages/miCoupons/index.js
var that;

var app = getApp();
const {
  $Toast
} = require('../../dist/base/index');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    change: false,
    img: '/static/wechat/img/zm/zm_55.jpg'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    let RATE = wx.getSystemInfoSync().screenHeight /wx.getSystemInfoSync().screenWidth;
    
    wx.getSystemInfo({
      success: function (res) {
        //model中包含设备信息
        var model = res.model

        if (model.search('iPhone X') != -1) {
          that.setData({
            autoHeight:'top:'+RATE*315+'rpx',
            img: "/static/wechat/img/zm/zm_56.jpg"
          })
        } else {
          that.setData({
            autoHeight:'top:'+RATE*327+'rpx',
            img: "/static/wechat/img/zm/zm_55.jpg"
          })
        }
      }
    })
    this.setData({
      preffixUrl: app.globalData.URL,
      navTop: app.globalData.statusBarTop,
      navHeight: app.globalData.statusBarHeight
    });
  },
  getCoupons(e) {
    var openid = wx.getStorageSync('openid')
    wx.showLoading({
      title: '领取中',
      mask: true
    })
    wx.request({
      url: "https://marketing.sdpay.mipay.com/gateway/wechat/couponsMini",
      method: "POST",
      data: {
        "stockId": e.currentTarget.dataset.id,
        "appId": "wx49af818df3d44d95",
        "openId": openid
      },
      header: {
        "content-type": "application/json", // 默认值
      },
      success(res) {
        //console.log('couponsMini==========================')

        //console.log(res)
        if (res.data.coupon_id) {
          wx.hideLoading({
            success: (res) => {},
          })
         
          $Toast({
            content: '已领取成功！请至微信卡包查看！',
            type: 'success',
            duration: 3,
          });
          
        } else if (res.statusCode != 200) {
          wx.showToast({
            title: '服务异常',
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }

      },
      fail() {
        wx.hideLoading({
          success: (res) => {},
        })
      }
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