var util = require('../../utils/util.js');
const app = getApp();
import Order from '../../api/Order';
import user from '../../utils/user';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    list1: [],
    list: [],
    pageList: [],
    preffixUrl: '',
    showNon: false,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    applicantIdCard: '',
    languages: [],
    companyName: '',
    orderNo: '',
    authorizeExpiration: '',
    page: 1,
    pageSize: 10,
    pageTips: '暂无数据',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      preffixUrl: app.globalData.URL,
    });
    var that = this;
    that.getApply();
    that.userInfo();
    wx.showLoading({
      title: '加载中',
    });

    user.getIdentityInfo().then(res => {
      that.setData({
        applicantIdCard: res.ID_NUMBER,
      });
    }).catch(err => {
      this.setData({
        list1: false,
        pageList: false,
        pageTips: '已无更多数据',
      });
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  onReachBottom: function () {
    if (this.data.pageTips == '暂无数据') {
      return;
    }
    wx.showLoading({
      title: '加载中...',
    });
    wx.showNavigationBarLoading();
    this.getApply();
    wx.hideNavigationBarLoading();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (wx.getStorageSync('openid') == null || wx.getStorageSync('openid') == '') {
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          util.openid(res.code, app.globalData.URL);
        },
      });
    } else {
      //判断数据库了里是否存在密钥
      wx.request({
        url: app.globalData.URL + 'existkey',
        data: {
          sessionId: wx.getStorageSync('sessionid'),
        },
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          key: Date.parse(new Date()).toString().substring(0, 6),
        },
        success(res) {
          if (res.data == undefined || res.data != true) {
            wx.login({
              success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                util.openid(res.code, app.globalData.URL);
              },
            });
          }
        },
        fail() {
          wx.showToast({
            title: '网络异常',
            icon: 'none',
            duration: 2000,
          });
        },
      });
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},


  userInfo: function () {

  },

  fun() {},

  getApply: function () {
    var that = this;
    let params = {
      openid: wx.getStorageSync('openid'),
      page: that.data.page,
      pageSize: that.data.pageSize,
      typeQuery: '1',
      types: '2,5,7,8,9,3,11,12,14',
    };
    Order.getApplyList(params).then(res => {
      var apply = that.data.list;
      var result = res;
      var pageTips = '上拉加载';
      var index = 0;

      for (let i = 0; i < result.length; i++) {
        if (i >= 0) {
          if (result[i].QUERY_RESULT != undefined || result[i].QUERY_RESULT != null) {
            result[i].companyName = JSON.parse(result[i].QUERY_RESULT).customerName;
          }
          if (result[i].APPLY_AMOUNT) {
            if (result[i].APPLY_TYPE == 21) {
              result[i].APPLY_AMOUNT = Number(result[i].APPLY_AMOUNT) / 10000
            }
            result[i].APPLY_AMOUNT = result[i].APPLY_AMOUNT + ''
            if(result[i].APPLY_AMOUNT.indexOf('.')!='-1'){
              result[i].APPLY_AMOUNT = result[i].APPLY_AMOUNT.substring(0,result[i].APPLY_AMOUNT.indexOf('.'))
            }
          }
          apply.push(result[i]);
          index += 1;
        }
      }
      that.setData({
        list: apply,
        pageTips: pageTips,
      });
      if (index < 10) {
        that.setData({
          pageTips: '已无更多数据',
        });
      }
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();
      var page = that.data.page + 1;
      that.setData({
        page: page,
      });
      wx.hideLoading();
    }).catch(res => {
      that.setData({
        pageTips: '已无更多数据',
      });
      wx.hideLoading();
      wx.showToast({
        title: '网络异常',
        icon: 'none',
        duration: 2000,
      });
    });
  },
  
});
