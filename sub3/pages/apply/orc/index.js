var util = require('../../../../utils/util.js');
import user from '../../../../utils/user';
import api from '../../../../utils/api';
import log from '../../../../log.js';

const app = getApp();
var myPerformance = require('../../../../utils/performance.js');
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
    scene:"", //车贷渠道商编号
    prdCode:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      scene: options.scene,
      prdCode: options.prdCode
    });
    that.setData({
      preffixUrl: app.globalData.CDNURL,
      url: options.url == undefined || options.url == null ? '' : options.url,
      type: options.type == undefined ? '' : options.type,
    });
    myPerformance.reportEnd(2009, 'sub1_identity_index');
  },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        var that = this;
        that.userInfo();
        wx.showLoading({
            title: '请稍候',
        });
        // 获取个人信息
        user.getCustomerInfo().then((r) => {
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
        }).catch((err) => {
            //console.log(err);
        });
        //获取面部识别校验
        user.getFaceVerify().then((res) => {
            that.setData({
                showNon3: true,
            });
            wx.hideLoading();
        }).catch((err) => {
            wx.hideLoading();
            if ('faceUnVerified' === err) {
                that.setData({
                    facialType: 'bank',
                });
            }
        });
        //证件拍照
        user.getIdentityInfo().then((res) => {
            var shengfe = res;
            console.log('shengfe', shengfe)
            if (Object.keys(shengfe).length) {
                that.setData({
                    identity: shengfe,
                    showNon2: true,
                });
            } else {
                that.setData({
                    identity: shengfe,
                    showNon2: false,
                });
            }
            if (that.data.page == 'sui') {
                wx.redirectTo({
                    url: '/sub3/pages/apply/index',
                });
            }
        });
    },
    toApplyLoanPage() {
        if (this.data.showNon2 == true &&
            this.data.showNon3 == true && this.data.showNon4 == true) {
            //基础信息都有，则跳转到个人信息页面
            wx.navigateTo({
                url: '/sub3/pages/apply/loan/index?scene=' + this.data.scene + '&prdCode=' + this.data.prdCode,
            })
        } else {
            wx.showToast({
                title: '请补充身份信息',
                icon: 'none',
            });
        }
    },

  //获取个人信息
  toUserinfo() {
    var that = this;
    if (that.data.showNon4) {
      wx.navigateTo({
        url: '/sub3/pages/apply/orc/user_info?type=1&custinfo=' + that.data.customerInfo2 + '&dept=120026',
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

    //获取手机号
    getPhoneNumber(e) {
        var that = this;
        api.getPhoneNumber(e).then((res) => {
            if (res) {
                let customerInfo = JSON.parse(that.data.customerInfo2);
                customerInfo.TEL = res;
                that.setData({
                    showNon4: true,
                    mobile: res.substring(0, 3) + '****' + res.substring(7, 11),
                    customerInfo2: JSON.stringify(customerInfo),
                });
            }
        }).catch((err) => {
            console.log('手机解密', err);
            if (err.code === '1010') {
                let userInfo = JSON.parse(err.stringData);
                wx.checkIsSupportFacialRecognition({
                    success() {
                        wx.startFacialRecognitionVerifyAndUploadVideo({
                            name: userInfo[0].REAL_NAME, //身份证名称
                            idCardNumber: userInfo[0].ID_CARD, //身份证号码
                            checkAliveType: 2,
                            success: function(res) {
                                console.log('人脸success', res);
                            },
                            fail: function(err) {
                                console.log('人脸fail', err);
                            },
                            complete: (res) => {  
                                api.getWeChatFaceResult(res.verifyResult).then(res => {               
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
                                }).catch(err => {

                                                      })
                                return;
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

  userInfo: function () {},

    set_1: function() {
        wx.navigateTo({
            url: 'set_1?url=' + this.data.url + '&type=' + this.data.type + '&dept=120026',
        });
    },
    set_2: function() {
        var that = this;
        if (!this.data.showNon3) {
            wx.showToast({
                title: '请您先完成人脸识别',
                icon: 'none',
                duration: 2000,
            });
        } else {
            wx.navigateTo({
                url: 'set_2?url=' +
                    this.data.url +
                    '&type=' +
                    this.data.type +
                    '&name=' +
                    that.data.customerInfo.REAL_NAME +
                    '&idcard=' +
                    that.data.customerInfo.ID_CARD +
                    '&backSign=sui' +
                    '&scene=' + this.data.scene +
                    '&prdCode=' + this.data.prdCode,
            });
        }
    },
    set_3: function() {
        var that = this;
        log.setFilterMsg(that.data.customerInfo.REAL_NAME);
        wx.checkIsSupportFacialRecognition({
            success() {
                wx.startFacialRecognitionVerifyAndUploadVideo({
                    name: that.data.customerInfo.REAL_NAME, //身份证名称
                    idCardNumber: that.data.customerInfo.ID_CARD, //身份证号码
                    checkAliveType: 2,
                    success: function(res) {
                        console.log('人脸success', res);
                    },
                    fail: function(err) {
                        console.log('人脸fail', err);
                    },
                    complete: (res) => {
                        console.log('complete', res);
                        log.info('人脸识别结果' + JSON.stringify(res));

                          
                        api.getWeChatFaceResult(res.verifyResult).then(ress => {              
                            user.addFaceInfo('0', res.errCode + res.errMsg).then((res) => {
                                that.setData({
                                    showNon3: true,
                                });
                            });    
                        }).catch(err => {
                            that.setData({
                                facialType: 'bank',
                            });
                            user.addFaceInfo('1', res.errCode + res.errMsg).then((res) => {});                  
                        })
                        return;
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
            },
        });
    },

  identifyDetail: function () {
    wx.navigateTo({
      url: 'set_2_show',
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {}
})