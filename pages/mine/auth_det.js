var util = require('../../utils/util.js');
import user from '../../utils/user';
import Order from '../../api/Order';

const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list1: [],
    preffixUrl: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    orderNo: '', //订单号
    enterprise_name: '', //企业名称
    apply_amount: '', //申请金额
    apply_term: '', //申请期限
    vouch_type: '', //住宅抵押
    purpose: '', //借款用途
    applicantName: '', //姓名
    applicantImg: '',
    applicantIdcard: '', //身份证号
    authorizeExpiration: '', //授权有效期
    authorizerType: '', //授权人类型
    num: 0,
    sum: 0, //总申请
    authman_flag: true,
    applicantIdcard1: '',
    agree_flag: true,
    name: '',
    prowId: '',
    socialCreditCode: '',
    applyDate: '',
    apply: '',
    resvFld1: '', //订单类型 1企业 2个人
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    this.setData({
      preffixUrl: app.globalData.URL,
      orderNo: options.orderNo,
      authorizeExpiration: options.authorizeExpiration,
    });
    var that = this;
    that.userInfo();

    Order.getOrderInfoByOrderNo(that.data.orderNo).then((res) => {
      that.setData({
        apply: res,
        applyDate: res.APPLY_DATE,
      });
    });
    user.getCustomerInfo().then((res) => {
      that.setData({
        applicantImg: res.PHOTO,
        applicantName: res.REAL_NAME,
        applicantIdcard: res.ID_CARD.substring(0, 4) + '****' + res.ID_CARD.substring(14, 18),
      });
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;

    Order.getOrderInfoByOrderNoWithinWD(that.data.orderNo).then((res) => {
      //console.log(res);
    //   res[0].resvFld1 = '1';
      if (!res[0].resvFld1) {
        wx.showModal({
          title: '提示',
          content: '订单类型为空',
          showCancel: false,
          confirmText: '确定',
          success: (result) => {
            if (result.confirm) {
              wx.navigateBack({
                delta: 1,
              });
            }
          },
          fail: () => {},
          complete: () => {},
        });
        return;
      }
      var arrs = [];
      var num = 0;
      var sum = 0;
      that.setData({
        enterprise_name: res[0].companyName,
        apply_amount: res[0].applyAmount,
        apply_term: res[0].applyTerms,
        vouch_type: res[0].guaranteeType,
        purpose: res[0].loanUsage,
        authorizerType: res[0].authorizerType,
        resvFld1: res[0].resvFld1,
      });
      if (res != null && res != '' && res != undefined) {
        for (let i = 0; i < res.length; i++) {
          arrs.push({
            authorizerName: res[i].authorizerName,
            authorizeExpiration: res[i].authorizeExpiration,
            authorizerType: res[i].authorizerType,
            authorizeStatus: res[i].authorizeStatus,
            authorizerCard: res[i].authorizerCard,
            prowId: res[i].prowId,
            photo: res[i].PHOTO.replace(/"/g, ''),
            authorizeTime: res[i].authorizeTime,
            socialCreditCode: res[i].socialCreditCode,
          });
          num = i;
          if (res[i].authorizeStatus == 1) {
            sum += 1;
          }
          that.setData({
            list1: arrs,
            num: num + 1,
            sum: sum,
          });
        }
      } else {
        that.setData({
          num: num,
        });
      }
    });

    if (wx.getStorageSync('openid') == null || wx.getStorageSync('openid') == '') {
      wx.login({
        success: (res) => {
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
              success: (res) => {
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

  shareTo: function () {},
  onShareAppMessage: function (res) {
    var that = this;
    //console.log(that.data.list1);
    for (var i in that.data.list1) {
      if (that.data.list1[i].authorizerCard == res.target.dataset.id) {
        //console.log(that.data.list1[i].socialCreditCode);
        that.setData({
          name: that.data.list1[i].authorizerName,
          prowId: that.data.list1[i].prowId,
          authorizeStatus: that.data.list1[i].authorizeStatus,
          applicantIdcard1: that.data.list1[i].authorizerCard,
          //  socialCreditCode: that.data.list1[i].socialCreditCode == undefined ? '' : that.data.list1[i].socialCreditCod
          socialCreditCode: that.data.list1[i].socialCreditCode,
        });

        break;
      }
    }
    //console.log(res.from);
    if (res.from === 'button') {
      //console.log(that.data.socialCreditCode + "sssssssssssssssssssssss");
      // 来自页面内转发按钮
      //console.log(res.target);
      //console.log(that.data.applicantIdcard1);
    }
    return {
      title: '您好' + that.data.name + ', 请您确认授权。',
      path:
        '/pages/mine/auth_det1?orderNo=' +
        that.data.orderNo +
        '&socialCreditCode=' +
        that.data.socialCreditCode +
        '&enterprise_name=' +
        that.data.enterprise_name +
        '&apply_amount=' +
        that.data.apply_amount,
      imageUrl: that.data.preffixUrl + '/static/wechat/img/temp/share_auth.jpg',
    };
  },
  userInfo: function () {},
});
