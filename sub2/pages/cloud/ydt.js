import http from '../../utils/requsetP.js';
import MYURLS from '../../utils/urls';
import { addPhone, sendCode, checkCode } from '../../../utils/api';
const util = require('../../utils/util');
var app = getApp();
const { $Toast } = require('../../dist/base/index');
Page({
  data: {
    selected: 1,
    preffixUrl: '',
    codeMessage: '发送验证码',
    disabled: '',
    phoneNum: '',
    msgCode: '',
    code: '', //验证码id，
    type: '', // 0修改 1添加
    type2: 0, //判断跨境2还是自贸云1
  },

  navTo() {
    wx.navigateTo({
      url: '../authConfirm/face',
    });
  },

  toCCY() {
    var that = this;
    let phone = that.data.phoneNum;
    let msgCode = that.data.msgCode;
    if (phone == '' || phone == null) {
      $Toast({
        content: '请输入手机号',
        type: 'warning',
      });
      return;
    } else if (msgCode == '' || msgCode == null) {
      $Toast({
        content: '请输入验证码',
        type: 'warning',
      });
      return;
    } else if (!/^1[3456789]\d{9}$/.test(phone)) {
      $Toast({
        content: '请输入11位手机号',
        type: 'warning',
      });
      return;
    }
    //验证二维码

    checkCode(phone, msgCode)
      .then((res) => {
        if (res.result_code == '0000') {
          let str = JSON.stringify({
            name: '',
            company: '',
            idNum: '',
          });
          http
            .requestP({
              url: that.data.preffixUrl + 'toCCY',
              method: 'get',
              data: {
                merchantNo: '2019101100001',
                custNo: phone,
                custType: 'phone',
                time: '',
                transData: str,
              },
            })
            .then((res) => {
              console.log('获取的sign为', res.signedStr);
              that.addPhone();
              var sendStr = {
                merchantNo: '2019101100001', // 商户号
                custNo: phone, // 客户号，此处传手机号
                custType: 'phone', // 客户号类别，此处固定为phone
                time: res.time, // 时间戳
                sign: res.signedStr, // 签名信息
                signType: 'RSA',
                transData: str,
              };
              let url = '';
              if ((that.data.type2 = 1)) {
                sendStr.platFlag = '_ZMYPT';
                //console.log(sendStr);
                url = MYURLS.Urls.zmyPlatformYdt;
              } else {
                url = MYURLS.Urls.zmydt;
              }
              let data = JSON.stringify(sendStr);
              wx.redirectTo({
                url: '../showWeb/showWeb?skipUrl=' + encodeURIComponent(url) + '&sendStr=' + encodeURIComponent(data),
              });
            })
            .catch((err) => {
              $Toast({
                content: err.msg,
                type: 'error',
              });
              console.log('获取数字异常', err);
            });
        } else {
          $Toast({
            content: res.result_msg,
            type: 'error',
          });
        }
      })
      .catch((err) => {
        $Toast({
          content: err.message || err,
          type: 'error',
        });
      });
  },

  //手机号存入数据库
  addPhone2() {
    var that = this;
    let url = '';
    let param = {};
    if (that.data.type == 1) {
      url = that.data.preffixUrl + 'insertIdcard';
      param = {
        string_open_id: wx.getStorageSync('openid'),
        string_cell_phone: that.data.phoneNum,
      };
    } else {
      url = that.data.preffixUrl + 'updateCustomer';
      param = {
        open_id: wx.getStorageSync('openid'),
        cell_phone: that.data.phoneNum,
      };
    }
    let str = JSON.stringify(param);
    let data = util.enct(str) + util.digest(str);
    http
      .requestP({
        url: url,
        method: 'get',
        data: {
          data: data,
        },
        header: {
          'content-type': 'application/json', // 默认值
          key: Date.parse(new Date()).toString().substring(0, 6),
          sessionId: wx.getStorageSync('sessionid'),
          transNo: 'XC016',
        },
      })
      .then((res) => {})
      .catch((err) => {
        //console.log("添加异常", err);
      });
  },

  addPhone() {
    addPhone(this.data.phoneNum);
  },

  getMsgCode() {
    var that = this;
    let phone = that.data.phoneNum;
    if (phone == '' || phone == null) {
      $Toast({
        content: '请输入手机号',
        type: 'warning',
      });
      return;
    } else if (!/^1[3456789]\d{9}$/.test(phone)) {
      $Toast({
        content: '请输入11位手机号',
        type: 'warning',
      });
      return;
    }

    sendCode(phone, 2)
      .then((res) => {
        console.log(res);
        if (res.code == 1) {
          // //console.log('获取的验证码id为', util.dect(res.stringData));

          $Toast({
            content: '验证码发送成功',
            type: 'success',
          });
          that.setData({
            disabled: 'disabled',
          });
          var times = 60;
          var interval = setInterval(() => {
            times--;
            if (times == 0) {
              that.setData({
                disabled: '',
                codeMessage: '获取验证码',
              });
              clearInterval(interval);
            } else {
              that.setData({
                codeMessage: times + 's',
                disabled: 'disabled',
              });
            }
          }, 1000);
        } else {
          $Toast({
            content: res.msg,
            type: 'error',
          });
          return;
        }
      })
      .catch((err) => {
        console.log(err);
        $Toast({
          title: '发送失败',
          icon: 'none',
          duration: 1000,
        });
      });
  },

  onLoad(e) {
    this.setData({
      preffixUrl: app.globalData.JSBURL,
      type: e.type,
      type2: e.type2,
    });
  },

  phoneInput(e) {
    var that = this;
    that.setData({
      phoneNum: e.detail.value,
    });
  },

  msgInput(e) {
    var that = this;
    that.setData({
      msgCode: e.detail.value,
    });
  },
});
