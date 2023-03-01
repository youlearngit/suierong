var util = require('../../../utils/util.js');

import user from '../../../utils/user';
import api from '../../../utils/api';
import log from '../../../log.js';

const app = getApp();
var myPerformance = require('../../../utils/performance.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    verifyResult: '', //认证返回值
    apply: [],
    preffixUrl: '',
    showNon1: '',
    showNon2: '',
    showNon3: '',
    showNon4: '',
    userInfo: {},
    identity: {}, //身份信息
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    url: '',
    type: '',
    page: '', //随额贷首页跳转,
    cndUrl: app.globalData.CDNURL,
    facialType: '',
    dept: '120026',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log("传递的参数", options);
    var that = this;
    myPerformance.reportBegin(2009, 'sub1_identity_index');
    that.setData({
      page: options.page,
    });

    that.setData({
      preffixUrl: app.globalData.URL,
      url: options.url == undefined || options.url == null ? '' : options.url,
      type: options.type == undefined ? '' : options.type,
    });
    myPerformance.reportEnd(2009, 'sub1_identity_index');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.userInfo();
    wx.showLoading({
      title: '加载中...',
    });

    // 个人信息
    user
      .getCustomerInfo()
      .then((r) => {
        let customerInfo = {};
        customerInfo.REAL_NAME = r.REAL_NAME ? r.REAL_NAME : '';
        customerInfo.ID_CARD = r.ID_CARD ? r.ID_CARD : '';
        customerInfo.TEL = r.TEL ? r.TEL : '';
        that.setData({
          showNon1: r.REAL_NAME ? true : false,
          customerInfo: r,
          customerInfo2: JSON.stringify(customerInfo),
        });

        that.setData({
          showNon4: r.TEL ? true : false,
          mobile: r.TEL ? r.TEL.substring(0, 3) + '****' + r.TEL.substring(7, 11) : '',
        });
      })
      .catch((err) => {
        //console.log(err);
      });

    user
      .getFaceVerify()
      .then((res) => {
        that.setData({
          showNon3: true,
        });
        wx.hideLoading();
      })
      .catch((err) => {
        wx.hideLoading();
        if ('faceUnVerified' === err) {
          that.setData({
            facialType: 'bank',
          });
        }
      });

        //证件拍照
        user.getIdentityInfo().then((res) => {
            // that.setData({
            //   identity: res,
            //   showNon2: true,
            // });
            console.log('sub1/pages/identity/index getIdentifyInfo', res)
            if (res) {
                that.setData({
                    identity: res,
                    showNon2: true,
                });
            } else {
                that.setData({
                    identity: res,
                    showNon2: false,
                });
            }

      if (that.data.page == 'sui') {
        wx.redirectTo({
          url: '/sub1/pages/sui/apply',
        });
      }
    });
  },

  toUserinfo() {
    var that = this;
    if (that.data.showNon4) {
      wx.navigateTo({
        url: '../info/user_info?type=1&custinfo=' + that.data.customerInfo2 + '&dept=120026',
      });
    } else {
      wx.showToast({
        title: '请先录入手机号',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
      });
    }
  },

  getPhoneNumber(e) {
    var that = this;
    api
      .getPhoneNumber(e)
      .then((res) => {
        //console.log(res);
        if (res) {
          //console.log("手机号", res);
          let customerInfo = JSON.parse(that.data.customerInfo2);
          customerInfo.TEL = res;
          that.setData({
            showNon4: true,
            mobile: res.substring(0, 3) + '****' + res.substring(7, 11),
            customerInfo2: JSON.stringify(customerInfo),
          });
        }
      })
      .catch((err) => {
        console.log('手机解密', err);

        if (err.code === '1010') {
          let userInfo = JSON.parse(err.stringData);
          wx.checkIsSupportFacialRecognition({
            success() {
              wx.startFacialRecognitionVerifyAndUploadVideo({
                name: userInfo[0].REAL_NAME, //身份证名称
                idCardNumber: userInfo[0].ID_CARD, //身份证号码
                checkAliveType: 2,
                success: function (res) {
                  console.log('人脸success', res);
                },
                fail: function (err) {
                  console.log('人脸fail', err);
                },
                complete: (res) => {
                  if (res.errCode === 0) {
                    user
                      .addCustomer(
                        userInfo[0].REAL_NAME,
                        userInfo[0].ID_CARD,
                        userInfo[0].TEL,
                        err.code,
                        that.data.dept,
                      )
                      .then((res) => {
                        console.log(res);
                        app.globalData.int_id = res.int_id || app.globalData.int_id;
                        that.setData({
                          showNon4: true,
                          mobile: api.formatePhone(userInfo[0].TEL),
                        });
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  } else {
                    console.log('msg', res.errCode + res.errMsg);
                  }
                },
              });
            },
            fail(res) {
              console.log(res);
              log.info('人脸识别结果' + JSON.stringify(res));
              wx.showToast({
                title: '您的微信版本暂不支持人脸识别，请您先升级。',
                icon: 'none',
              });
            },
          });
        } else if (err.code === '1000' || err.code === '1001') {
          wx.showModal({
            title: '提示',
            content: '手机号已被使用，是否进行身份认证',
            showCancel: true,
            cancelText: '放弃',
            cancelColor: '#000000',
            confirmText: '确定',
            //   confirmColor: '#3CC51F',
            success: (result) => {
              if (result.confirm) {
                const confilctUserInfo = JSON.parse(err.stringData);
                console.log(confilctUserInfo);
                wx.navigateTo({
                  url: `/sub1/pages/info/user_info?custinfo=${JSON.stringify(confilctUserInfo[0])}&type=2&dept=${
                    this.data.dept
                  }`,
                });
              } else {
                //
              }
            },
            fail: () => {},
            complete: () => {},
          });
        } else {
          wx.showToast({
            title: err.msg||err.message||err,
            icon: 'none',
          });
        }
      });
  },

  userInfo: function () {
    ////console.log(app.globalData.userInfo)
  },
  set_1: function () {
    wx.navigateTo({
      url: 'set_1?url=' + this.data.url + '&type=' + this.data.type + '&dept=120026',
    });
  },
  set_2: function () {
    var that = this;
    //console.log("url=" + this.data.url + "&type=" + this.data.type);
    //url  set_2?url=/pages/shui/apli&type=3
    if (!this.data.showNon1) {
      wx.showToast({
        title: '请您先录入个人信息',
        icon: 'none',
        duration: 2000,
      });
    } else if (!this.data.showNon3) {
      wx.showToast({
        title: '请您先完成人脸识别',
        icon: 'none',
        duration: 2000,
      });
    } else {
      wx.navigateTo({
        url:
          '../info/set_2?url=' +
          this.data.url +
          '&type=' +
          this.data.type +
          '&name=' +
          that.data.customerInfo.REAL_NAME +
          '&idcard=' +
          that.data.customerInfo.ID_CARD +
          '&backSign=sui',
      });
    }
  },

  set_3: function () {
    if (!this.data.showNon1) {
      wx.showToast({
        title: '请您先录入个人信息',
        icon: 'none',
        duration: 2000,
      });
    } else {
      var that = this;

      // if (that.data.facialType === "bank") {
      // 	wx.navigateTo({
      // 		url: "/sub1/pages/info/set_3",
      // 	});
      // 	return;
      // }
      log.setFilterMsg(that.data.customerInfo.REAL_NAME);
      wx.checkIsSupportFacialRecognition({
        success() {
          wx.startFacialRecognitionVerifyAndUploadVideo({
            name: that.data.customerInfo.REAL_NAME, //身份证名称
            idCardNumber: that.data.customerInfo.ID_CARD, //身份证号码
            checkAliveType: 2,
            success: function (res) {
              console.log('人脸success', res);
            },
            fail: function (err) {
              console.log('人脸fail', err);
            },
            complete: (res) => {
              console.log('complete', res);
              log.info('人脸识别结果' + JSON.stringify(res));
              // if (res.errCode === 90100) {
              // 	return;
              // }
              if (res.errCode === 0) {
                user.addFaceInfo('0', res.errCode + res.errMsg).then((res) => {
                  that.setData({
                    showNon3: true,
                  });
                });
              } else {
                console.log('msg', res.errCode + res.errMsg);
                that.setData({
                  facialType: 'bank',
                });
                user.addFaceInfo('1', res.errCode + res.errMsg).then((res) => {});
              }
            },
          });
        },
        fail(res) {
          user.addFaceInfo('1', '设备不支持人脸').then((res) => {});
          that.setData({
            facialType: 'bank',
          });
          console.log(res);
          log.info('人脸识别结果' + JSON.stringify(res));
          wx.showToast({
            title: '您的微信版本暂不支持人脸识别，请您先升级。',
            icon: 'none',
          });
          // wx.navigateTo({
          // 	url: "sub1/pages/info/set_3",
          // });
        },
      });
    }
  },

  identifyDetail: function () {
    wx.navigateTo({
      url: '../info/set_2_show',
    });
  },
});
