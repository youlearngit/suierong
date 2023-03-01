// sub1/pages/sui/apply.js
import WxValidate from '../../../assets/plugins/wx-validate/WxValidate';
import util from '../../../utils/util';
import requestP from '../../../utils/requsetP';
import wxp from '../../../utils/wxp';
import api from '../../../utils/api';
import User from '../../../utils/user';

const log = require('../../../log.js');
var app = getApp();
Page({
  /**
   * Page initial data
   */
  data: {
    preffixUrl: app.globalData.URL,
    readonly: false,
    customer: {},
    currentCustomer: {},
    dept: '',
    type: '', //0显示 1修改 2认证
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    console.log('页面传递参数', options);
    this.setData({
      readonly: options.type === '0' ? true : false,
      type: options.type,
      dept: options.dept || '',
    });
    let customer = options.custinfo ? JSON.parse(options.custinfo) : {};
    customer.ID_CARD = customer.ID_CARD && options.type !== '2' ? api.formateIdCard(customer.ID_CARD) : '';
    customer.REAL_NAME = customer.REAL_NAME && options.type !== '2' ? api.formateName(customer.REAL_NAME) : '';
    customer.TEL = customer.TEL || '';
    //console.log(customer);
    this.setData({
      customer: customer,
      currentCustomer: options.type !== '2' ? customer : {},
    });
    this.initValidate();
  },

  editCustomerInfo() {
    let customer = {
      TEL: this.data.customer.TEL,
    };
    this.setData({
      readonly: false,
      customer,
      type: '1',
    });
  },

  submit(e) {
    var that = this;
    let params = e.detail.value;
    //console.log(e);

    if (
      params.idCard === this.data.currentCustomer.ID_CARD &&
      params.userName === this.data.currentCustomer.REAL_NAME
    ) {
      wx.showModal({
        title: '提示',
        content: '修改数据与当前数据一致',
        showCancel: false,
        confirmText: '确定',
        success: (result) => {
          if (result.confirm) {
          }
        },
      });
      return;
    }

    if (!that.WxValidate.checkForm(params)) {
      const error = that.WxValidate.errorList[0];
      wx.showToast({
        icon: 'none',
        title: error.msg,
        duration: 1500,
        mask: false,
      });
      return;
    } else {
      if (this.data.type === '2') {
        wx.checkIsSupportFacialRecognition({
          success() {
            wx.startFacialRecognitionVerifyAndUploadVideo({
              name: params.userName, //身份证名称
              idCardNumber: params.idCard, //身份证号码
              checkAliveType: 2,
              complete: (res) => {
                console.log('complete', res);
                if (res.errCode === 0) {
                  console.log('*********开始调用******');
                  that.addCustomer(params, '1000');
                }
              },
            });
          },
          fail(res) {
            console.log(res);
            wx.showToast({
              title: '您的微信版本暂不支持人脸识别，请您先升级。',
              icon: 'none',
            });
          },
        });
      } else {
        that.addCustomer(params, '0000');
      }
    }
  },

  updateCustomer(params, code) {
    User.updateCustomer('', '', params.userName, params.idCard, this.data.customer.TEL, code, this.data.dept)
      .then((res) => {
        console.log(res);
        app.globalData.int_id = res.int_id || app.globalData.int_id;
        wx.navigateBack({
          delta: 1,
        });
      })
      .catch((err) => {
        wx.showModal({
          title: '提示',
          content: err.message,
          showCancel: false,
          confirmText: '确定',
          success: (result) => {
            if (result.confirm) {
            }
          },
          fail: () => {},
          complete: () => {},
        });
      });
  },

  addCustomer(params, code) {
    var that = this;
    User.addCustomer(params.userName, params.idCard, this.data.customer.TEL, code, this.data.dept)
      .then((res) => {
        console.log(res);
        app.globalData.int_id = res.int_id || app.globalData.int_id;
        switch (res.result_code) {
          case '0000':
            wx.navigateBack({
              delta: 1,
            });
            break;
          case '0011':
            wx.navigateBack({
              delta: 1,
            });
            break;
          case '0010':
            wx.showModal({
              title: '提示',
              content: '您的手机号已被注册，是否解除绑定',
              showCancel: true,
              cancelText: '放弃',
              cancelColor: '#000000',
              confirmText: '确定',
              //   confirmColor: '#3CC51F',
              success: (result) => {
                if (result.confirm) {
                  this.updateCustomer(params, res.result_code);
                } else {
                }
              },
              fail: () => {},
              complete: () => {},
            });
            break;
          case '0001':
            wx.checkIsSupportFacialRecognition({
              success() {
                wx.startFacialRecognitionVerifyAndUploadVideo({
                  name: params.userName, //身份证名称
                  idCardNumber: params.idCard, //身份证号码
                  checkAliveType: 2,
                  complete: (res) => {
                    console.log('complete', res);
                    if (res.errCode === 0) {
                      wx.showModal({
                        title: '提示',
                        content: '您的身份信息已被注册，是否解除绑定',
                        showCancel: true,
                        cancelText: '放弃',
                        cancelColor: '#000000',
                        confirmText: '确定',
                        success: (result) => {
                          if (result.confirm) {
                            that.updateCustomer(params, '0001');
                          } else {
                          }
                        },
                        fail: () => {},
                        complete: () => {},
                      });
                    }
                  },
                });
              },
              fail(res) {
                console.log(res);
                wx.showToast({
                  title: '您的微信版本暂不支持人脸识别，请您先升级。',
                  icon: 'none',
                });
              },
            });

            break;
          case '0100':
            wx.showModal({
              title: '提示',
              content: '注册信息已被其他微信用户注册，是否解除绑定',
              showCancel: true,
              cancelText: '放弃',
              cancelColor: '#000000',
              confirmText: '确定',
              //   confirmColor: '#3CC51F',
              success: (result) => {
                if (result.confirm) {
                  this.updateCustomer(params, res.result_code);
                } else {
                }
              },
              fail: () => {},
              complete: () => {},
            });
            break;
          default:
            //1010 1011 1100
            wx.showModal({
              title: '提示',
              content: res.result_code + ': 验证失败，' + res.result_msg,
              showCancel: false,
              confirmText: '确定',
              success: (result) => {
                if (result.confirm) {
                }
              },
              fail: () => {},
              complete: () => {},
            });
            break;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },

  initValidate() {
    // 验证字段的规则
    var that = this;
    const rules = {
      userName: {
        required: true,
        name: true,
      },
      idCard: {
        required: true,
        idcard: true,
      },
    };

    // 验证字段的提示信息，若不传则调用默认的信息
    const messages = {
      userName: {
        required: '请输入用户名称',
      },
      idCard: {
        required: '请输入身份证号码',
      },
    };

    // 创建实例对象
    that.WxValidate = new WxValidate(rules, messages);
  },
});
