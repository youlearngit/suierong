import http from '../../utils/requsetP.js';
const util = require('../../utils/util');
var app = getApp();
const { $Toast } = require('../../dist/base/index');
var encr = require('../../utils/encrypt.js'); //国密3段式加密
var aeskey = encr.key //随机数
var that;
import api from "../../../utils/api";

Page({
    data: {
        preffixUrl: '',
        codeMessage: '发送验证码',
        disabled: '',
        authInfo: {},
        codeId: '',
        msgCode: '',
        authType: '', //业务类型 1:个人,2:对公,3对公个人
        phoneInput: '', //输入手机号接收参数
    },

    getNowTime: function() {
        let dateTime
        let yy = new Date().getFullYear()
        let mm = new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1
        let dd = new Date().getDate() < 10 ? ('0' + new Date().getDate()) : new Date().getDate()
        let hh = new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours()
        let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() :
            new Date().getMinutes()
        let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() :
            new Date().getSeconds()
        dateTime = yy + '/' + mm + '/' + dd + ' ' + hh + ':' + mf + ':' + ss
        return dateTime
    },
    navTo() {
        let msgCode = that.data.msgCode;
        if (msgCode == '') {
            $Toast({
                content: '请输入验证码',
                type: 'error',
            });
            return;
        }
        let phone = that.data.authInfo.AUTH_PHONE;

        api.checkCode(phone, msgCode)
        .then((res) => {
          if (res.result_code == '0000') {
            // 仅对于：个人征信授权-个人零售、个人经营性，企业授权-个人经营性业务展示输入框 
            if((that.data.business_type == 2 && that.data.authType == '1') || that.data.authType == '3'){
              // 修改手机号信息
              var dataJsons = JSON.stringify({
                data: JSON.stringify({
                    id: that.data.ID,
                    auth_phone: that.data.phoneInput,
                    type: that.data.authType != 1 ? '1' : 0
                })
            })
            var custnameTwos = encr.jiami(dataJsons, aeskey) //3段加密
            wx.request({
                url: app.globalData.creditUrl + 'updataPerson.do',
                data: encr.gwRequest(custnameTwos),
                method: 'POST',
                header: {
                    'content-type': 'application/json', // 默认值
                },
                success(res) {
                    if (res.data.head.H_STATUS === "1") {
                        // 修改状态
                        that.updateStatus();
                      }
                  }
              })
            }else{
               that.updateStatus();
            }
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

return;
        var dataJson = JSON.stringify({
            uuid: wx.getStorageSync('openid'),
            code: that.data.msgCode,
        })
        var custnameTwo = encr.jiami(dataJson, aeskey) //3段加密


        //验证二维码
        http
            .requestP({
                url: app.globalData.creditUrl + 'compareCode.do',
                method: 'POST',
                data: encr.gwRequest(custnameTwo),

            })
            .then(res => {
                if (res.head.H_STATUS != "1") {
                    $Toast({
                        content: '验证码错误',
                        type: 'error',
                    });
                    return;
                }


                let json = encr.aesDecrypt(res.body, aeskey) //解密返回的报文
                if (json.STATUS != "1") {
                    $Toast({
                        content: '验证失败',
                        type: 'error',
                    });

                } else {
                    var dataJsons = JSON.stringify({
                        id: that.data.authInfo.ID,
                        status: '3',
                        auth_time: that.getNowTime(),
                        type: that.data.authType
                    })
                    var custnameTwos = encr.jiami(dataJsons, aeskey) //3段加密
                    wx.request({
                        url: app.globalData.creditUrl + 'updateAuthStatus.do',
                        data: encr.gwRequest(custnameTwos),
                        method: 'POST',
                        success(res) {
                            wx.navigateTo({
                                url: '../authConfirm/confirm?authInfo=' + JSON.stringify(that.data.authInfo) + "&type=" + that.data.authType,
                            });
                        },
                    });
                }
            })
            .catch(err => {
                $Toast({
                    content: '验证码错误',
                    type: 'error',
                });
            });
    },
    updateStatus(){
      var dataJsons = JSON.stringify({
        id: that.data.authInfo.ID,
        status: '3',
        auth_time: that.getNowTime(),
        type: that.data.authType != 1 ? '1' : 0,
          
      })
      var custnameTwos = encr.jiami(dataJsons, aeskey) //3段加密
      wx.request({
          url: app.globalData.creditUrl + 'updateAuthStatus.do',
          data: encr.gwRequest(custnameTwos),
          method: 'POST',
          success(res) {
              wx.navigateTo({
                  url: '../authConfirm/confirm?authInfo=' + JSON.stringify(that.data.authInfo) + "&type=" + that.data.authType,
              });
          },
      });
    },
    msgInput(e) {
        that.setData({
            msgCode: e.detail.value,
        });
    },
    getMsgCodeBefore(){
        //个人征信授权-个人零售、个人经营性，企业授权-个人经营性业务，校验手机号码
        if((that.data.business_type == 2 && that.data.authType == '1') || that.data.authType == '3'){
            if (that.data.phoneInput == '') {
              wx.showToast({
                  title: '请填写手机号',
                  icon: 'none'
              })
              return;
            }
            if (that.data.phoneInput.length!=11) {
                wx.showToast({
                    title: '请填写11位格式手机号',
                    icon: 'none'
                })
              return;
            }else{
              let {authInfo} = that.data;
              authInfo.AUTH_PHONE = that.data.phoneInput;
              that.setData(authInfo);
              that.getMsgCode();        
            }  
        }else{
          that.getMsgCode();
        }
    },
    getMsgCode() {
        let phone = that.data.authInfo.AUTH_PHONE;
        api.sendCode(phone,21).then(res=>{
            console.log(res)
            if (res.code === 1) {
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
              wx.showToast({
                title: res.msg,
                icon: 'none',
                duration: 2000
              })
            } else {
              wx.showToast({
                title: res.msg,
                icon: 'none',
                duration: 2000
              })
           
            }
        }).catch(err=>{
          wx.showToast({
              title: '发送失败',
              icon: 'none',
              duration: 1000
            })
            this.setData({
              disabled: false
            })
        })




return;
        var code = "";
        var num = "";
        for (var i = 0; i < 6; i++) {
            num = Math.floor(Math.random() * 10);
            code += num;
        }
        var dataJsons = JSON.stringify({
            "PRD_ID": "10069",
            "GROUP_SND_LIST": [{
                "OPENID": wx.getStorageSync("openid"),
                "CHL_ID": "1",
                "GROUP_NO": "1",
                "SIGN_ARR_ID": "",
                "SIGN_TYPE": "",
                "SEND_NO": phone,
                "CHLSEND_TAG_ID": "",
                "SEND_CONTENT": "验证码:" + code + "有效期5分钟。您正在进行线上征信授权操作，请勿泄露验证码，谨防诈骗。【江苏银行】",
                "MSG_EXP_FLAG": "2"
            }]
        })
        var custnameTwos = encr.jiami(dataJsons, aeskey) //3段加密
        http
            .requestP({
                url: app.globalData.creditUrl + 'sendMsg.do',
                method: "POST",
                data: encr.gwRequest(custnameTwos),
            })
            .then(res => {

                let json = encr.aesDecrypt(res.body, aeskey) //解密返回的报文
                console.log(json);
                if (json.TRAN_STATUS == "COMPLETE") {

                    that.setData({
                        codeId: json.uuid,
                    });
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
            .catch(err => {
                console.log('获取数字异常');
                wx.showModal({
                    title: '提示',
                    showCancel: true,
                    content: err.msg,
                });
            });
    },

    onLoad(e) {
        that = this;
        wx.showLoading({
            title: '数据获取中',
            mask: true
        })
        that.setData({authType: e.type });
        that.getAuthInfo(e.id,e.type)

    },
    getAuthInfo(id,type) {
        var dataJsons = JSON.stringify({
            id: id,
            type: that.data.authType != '1' ? 1: ''
        })
        var custnameTwos = encr.jiami(dataJsons, aeskey) //3段加密
        wx.request({
            url: app.globalData.creditUrl + 'findAuthInfoById.do',
            data: encr.gwRequest(custnameTwos),
            method: 'POST',
            success: (res => {
                if (res.data.head.H_STATUS === "1") {
                    let jsonData = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文
                    var data = jsonData.LIST[0];
                    if(type != '1'){
                      data.AUTH_NAME = data.BOR_PER_NAME;
                      data.AUTH_CERT_NO = data.BOR_PER_CODE;
                      data.AUTH_CERT_TYPE = data.BOR_PER_TYPE;
                    }
                    that.setData({
                        authInfo: data
                    });
                    that.getBorrowInfo(data.BUSINESS_ID);
                    wx.hideLoading({
                        success: (res) => {},
                    })
                } else {
                    wx.hideLoading({
                        success: (res) => {},
                    })
                    wx.showModal({
                        title: '提示',
                        content: '当前网络异常',
                        showCancel: true,
                    });
                }

            })
        })
    },

    //获取授权信息
    getBorrowInfo(id) {
      var dataJsons = JSON.stringify({
          id: id,
      })
      var custnameTwos = encr.jiami(dataJsons, aeskey) //3段加密
      wx.request({
          url: app.globalData.creditUrl + 'getBizVoById.do',
          data: encr.gwRequest(custnameTwos),
          method: 'POST',
          success: (res => {
              if (res.data.head.H_STATUS === "1") {
                  let jsonData = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文
                  var data2 = jsonData.LIST;
                  that.setData({
                      business_type: data2[0].BUSINESS_TYPE
                  });
              }
          })
      })
    },
    phoneInput(e) {
      that.setData({
          phoneInput: e.detail.value
      })
    },
    comparePhone() {
      return new Promise((resolve, reject) => {
          let dataJsons = JSON.stringify({
              phone: that.data.phoneInput
          })
          let custnameTwos = encr.jiami(dataJsons, aeskey) //3段加密
          wx.request({
              url: app.globalData.creditUrl + 'comparePhone.do',
              data: encr.gwRequest(custnameTwos),
              method: 'POST',
              header: {
                  'content-type': 'application/json', // 默认值
              },
              success(res) {
                  if (res.data.head.H_STATUS === "1") {
                      let jsonData = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文

                      if (jsonData.code == '1') {
                          resolve()
                      } else {
                          reject({ err: 1 })
                      }

                  } else {
                      reject({ err: 2, msg: res.data.head.H_MSG })
                  }
              }
          })
      })
    },
   
});