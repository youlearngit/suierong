// pages/mine/set_1_show.js
const app = getApp();
import requestP from '../../../utils/requsetP';
import user from '../../../utils/user';

import api from '../../../utils/api';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    preffixUrl: '',
    form: {
      tel: '',
      idCard: '',
      name: '',
    },
    edit: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    });
    var that = this;
    that.setData({
      preffixUrl: app.globalData.URL,
    });

    if (options.edit == 1) {
      that.setData({
        edit: false,
      });
    }
    user
      .getCustomerInfo()
      .then((res) => {
        var customer = res;
        if (customer.TEL) {
          that.setData({
            form: {
              tel: customer.TEL,
            },
          });
        }
        wx.hideLoading();
      })
      .catch((err) => {
        wx.hideLoading();
        wx.showToast({
          title: '网络异常',
          icon: 'none',
          duration: 2000,
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
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  back: function () {
    wx.navigateBack({});
  },

  editNun: function () {
    wx.navigateTo({
      //url: 'set_2?url=' + this.data.url + '&type=' + this.data.type,
      url: '../info/set_1_reset', //?talentname=' + e.currentTarget.dataset.name,
    });
  },

  getPhoneNumber3(e) {
    var that = this;
    wx.showLoading({
      title: '获取中...',
    });
    api
      .getPhoneNumber(e)
      .then((phone) => {
        //console.log(phone)
        if (phone && phone != null) {
          wx.showToast({
            title: '更新成功',
            icon: 'none',
            image: '',
            duration: 1500,
            mask: false,
            success: (result) => {},
            fail: () => {},
            complete: () => {},
          });
          that.setData({
            'form.tel': phone,
            showNon2: true,
          });
        }
      })
      .catch((err) => {

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
                  console.log('complete', res);

                  if (res.errCode === 0) {
                    user
                      .addCustomer(
                        userInfo[0].REAL_NAME,
                        userInfo[0].ID_CARD,
                        userInfo[0].TEL,
                        err.code,
                        this.data.dept,
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

    wx.hideLoading();
  },

  getSessionKey() {
    var that = this;
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          wx.request({
            url: app.globalData.URL + 'getwechatid',
            data: {
              js_code: res.code,
              isProxy: false,
            },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded', // 默认值
              key: Date.parse(new Date()).toString().substring(0, 6),
            },
            success: (res) => {
              if (res.data != undefined) {
                wx.setStorageSync('openid', res.data.openid);
                wx.setStorageSync('key', res.data.key);
                wx.setStorageSync('sessionid', res.data.session_key);
              }
              resolve();
            },
          });
        },
        fail: (err) => {
          reject(err);
        },
      });
    });
  },
});
