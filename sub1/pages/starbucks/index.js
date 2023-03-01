// sub1/pages/wg/index.js
import requestYT from '../../../api/requestYT';
import api from '../../../utils/api';

var app = getApp();
Page({
  /**
   * Page initial data
   */
  data: {
    cndUrl: app.globalData.CDNURL,
    preffixUrl: app.globalData.URL,
    couponNum: [],
    showPopUp: false,
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    if (wx.getStorageSync('openid') === '') {
      console.log('noopenid');
      api.getSessionInfo().then(() => {
        this.searchCoupon();
      });
    } else {
      this.searchCoupon();
    }
  },

  showCoupon() {
    if (this.data.couponNum.length === 0) {
      wx.showToast({
        title: '请先领取优惠券',
        icon: 'none',
      });
    } else {
      this.setData({
        showPopUp: true,
      });
    }
  },

  copyCoupon(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.code,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功',
            });
          },
        });
      },
    });
  },

  getCoupon() {
    var that = this;
    if (that.data.couponNum.length >= 1) {
    //   that.setData({
    //     showPopUp: true,
    //   });
      return;
    }

    wx.showLoading({
      title: '获取中',
      mask: true,
      success: (result) => {},
      fail: () => {},
      complete: () => {},
    });

    let options = {
      url: 'coupon/getCoupon.do',
      data: JSON.stringify({
        openId: wx.getStorageSync('openid'),
        TYPE: '3',
      }),
    };
    return requestYT(options)
      .then((res) => {
        console.log(res);
        if (res.RET_CODE === '1') {
          wx.showToast({
            title: '领取成功',
            icon: 'none',
          });
          let cc = that.data.couponNum;
          cc.push({
            CODE: res.code,
          });
          that.setData({
            couponNum: cc,
            showPopUp: true,
          });
        } else {
          wx.showModal({
            title: '温馨提示',
            content: res.RET_MSG,
            showCancel: false,
            confirmText: '确定',
          });
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally((res) => {
        wx.hideLoading();
      });
  },

  searchCoupon() {
    var that = this;
    let options = {
      url: 'coupon/selectCoupon.do',
      data: JSON.stringify({
        openId: wx.getStorageSync('openid'),
        TYPE: '3',
      }),
    };
    return requestYT(options)
      .then((res) => {
        console.log(res);
        if (res.STATUS === '1' && res.codes) {
          that.setData({
            couponNum: res.codes,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },

  closePopUp() {
    this.setData({
      showPopUp: false,
    });
  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {},
});
