import requestYT from '../../../api/requestYT.js';
import http from '../../utils/requsetP.js';
const util = require('../../utils/util');
var app = getApp();
const api = require("../../../utils/api");

const {
    $Toast
} = require('../../dist/base/index');
var that;
var encr = require('../../utils/encrypt.js'); //国密3段式加密
var aeskey = encr.key //随机数
Page({
    data: {
        authorInfo: {},
        borrowerInfo: {},
        phoneInput: '',
        authId: '',
        auth_cert_type_array: [
            '身份证',
            // '户口薄',
            // ' 护照',
            // '军官证 ',
            // '士兵证 ',
            // '港澳居民来往内地通行证 ',
            // '台湾同胞来往内地通行证  ',
            // ' 临时身份证',
            // ' 外国人居留证',
            // ' 警官证',
            // '香港身份证 ',
            // '澳门身份证 ',
            // '台湾身份证',
            // ' 其他证件',
        ],
        // auth_type_array: [
        //     '本人',
        //     '借款人配偶',
        //     '担保人',
        //     '担保人配偶',
        //     '共有人',
        //     '共有人配偶',
        // ],
        // auth_type_array2: [
        //     '借款人',
        //     '借款人配偶',
        //     '担保人',
        //     '担保人配偶(不承担担保责任)',
        //     '实体企业法定代表人、高管、股东', //校验借款人企业
        //     '实体企业其他相关人员及配偶'
        // ],
        // auth_enterprise_type_array: [
        //     '借款企业法定代表人',
        //     '高管 / 自然人股东',
        //     '实际控制人',
        //     '个人连带责任保证人/抵押人/质押人',
        //     '高管配偶/自然人股东配偶/实际控制人配偶',
        //     '担保企业法定代表人/高管/自然人股东/实际控制人',
        //     '担保企业法定代表人配偶/高管配偶/自然人股东配偶/实际控制人配偶',
        // ],
        auth_type_array: [
            '借款人',
            '借款人配偶（不提供担保）',
            '担保人',
        ],
        auth_type_array2: [
            '借款人',
            '担保人',
            '实体企业法定代表人、高管、股东',
            '授信业务其他相关自然人',
        ],
        auth_enterprise_type_array: [
            '借款企业法定代表人（不提供担保）',
            '高管/自然人股东（不提供担保）',
            '实际控制人（不提供担保）' ,
           '个人连带责任保证人/抵押人/质押人',
            '授信业务其他相关自然人',
        ],
        business_id: '',
        authType: '', //业务类型 '':个人,1:对公
        quid: '', //登录令牌标识
        quinfo: '', //登录令牌内容
        BatchID: '', //authType 为 1 时使用
        resultAuthInfo: {}, //授权信息 authType 为 1 时使用
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
    navTo() {
      if(that.data.authType != '1'){  //对公授权
        wx.showLoading({
          title: '获取授权中',
          mask: true
        })
        if(that.data.quid == ''){ //无令牌id，从获取令牌接口进入
          that.enterpriseLoginAuthorizationJump().then(res=>{
             //第一次登陆获取到令牌，跳转中数服务小程序
             that.jumpWXAPP('即将前往授权页面');
          });
        }else if(that.data.quid != '' && !that.data.resultAuthInfo.BASIC){ //有令牌id，直接获取信息
          that.getAuthorizedLoginResult().then(res=>{
            wx.hideLoading({success: (res) => {
              if(that.data.authType == '2'){ //对公企业授权校验实名认证手机号
                that.validInfopersonal().then(res=>{
                  that.toDo();
                }).catch(err=>{});
              }else{//对公个人授权不校验
                that.toDo();
              }
            }})
          }).catch(err=>{wx.hideLoading()});
        }else if(!that.data.resultAuthInfo.BASIC && that.data.BatchID == ''){ //已获取所有信息，重新上传影像平台后，进入参数对比
          that.addBusinessImg(that.data.BatchID).then(res=>{
            wx.hideLoading({success: (res) => {
              if(that.data.authType == '2'){ //对公企业授权校验实名认证手机号
                that.validInfopersonal().then(res=>{
                  that.toDo();
                }).catch(err=>{});;
              }else{//对公个人授权不校验
                that.toDo();
              }
            }});
          });
        }else{//已授权并且营业执照已上传影像平台
          wx.hideLoading({success: (res) => { 
            if(that.data.authType == '2'){ //对公企业授权校验实名认证手机号
              that.validInfopersonal().then(res=>{
                that.toDo();
              }).catch(err=>{});;
            }else{//对公个人授权不校验
              that.toDo();
            }
          }});
        }
      }else if(that.data.authType == '1'){ //个人征信授权
        //仅限个人征信授权-对公授信业务调用手机验证
        if(that.data.business_type == '3'){
          that.validInfopersonal().then(res=>{
            that.toDo();
          }).catch(err=>{});//封装方法中处理过了，所以这里不用写
        }else{
          that.toDo();
        }
      }
    },
    //对个人校验
    validInfopersonal(){
      return new Promise((resolve, reject) => {
        //经营贷、零售唯一校验
        if(that.data.authType == '1'){
          if (that.data.business_type == 3 && that.data.authorInfo.STATUS == '0' && that.data.authorInfo.AUTH_PHONE == '') {
            if (that.data.phoneInput == '') {
              wx.showToast({
                  title: '请填写手机号',
                  icon: 'none'
              })
              reject();
            }else if (that.data.phoneInput.length!=11) {
                wx.showToast({
                    title: '请填写11位格式手机号',
                    icon: 'none'
                })
                reject();
            }else{
              that.phoneCheck().then(res => {
                resolve();
              }).catch(err => {});
            }
          }else{
             //个人类型不进行手机号校验
            resolve();
          }
        }else if(that.data.authType == 2){ //对公授权，手机号使用ed0035校验
          if (that.data.phoneInput == '') {
            wx.showToast({
                title: '请填写手机号',
                icon: 'none'
            })
            reject();
          }else if (that.data.phoneInput.length!=11) {
              wx.showToast({
                  title: '请填写11位格式手机号',
                  icon: 'none'
              })
              reject();
          }else{
            that.phoneCheck().then(res => {
              resolve();
            }).catch(err => {});
          }
        }else{ //对公个人授权不进行手机校验
          resolve();
        }
      });
    },
    toDo() {
        var dataJsons = JSON.stringify({
            data: JSON.stringify({
                id: that.data.authorInfo.ID,
                auth_phone: that.data.phoneInput,
                type: that.data.authType != 1 ? '1' : 0,
                busBatchNo: that.data.BatchID
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
                    var statue = that.data.authorInfo.STATUS;
                    let page = '';
                    if(that.data.authType == 1){//个人征信授权
                        // 状态 0-未授权 1-已OCR验证 2-已银行卡验证 3-已短信验证 4-已人脸识别 5-授权通过
                        if (statue == '1' ) {
                          that.faceVerify();
                          return;
                        } else if (statue == '3') {
                          page = 'confirm?id=' + that.data.authId + '&authInfo=' + JSON.stringify(that.data.authorInfo)+'&type=1';
                        } else if (statue == '4') {
                          if (that.data.business_type == 1) {
                              page = 'confirm?id=' + that.data.authId + '&authInfo=' + JSON.stringify(that.data.authorInfo)+'&type=1';
                          } else {
                              page = 'msgcode?id=' + that.data.authId+'&type=1';
                          }
                        } else if (statue == '5') {
                          wx.showModal({
                              title: '无需重复授权',
                              showCancel: true,
                              success(res) {
                                  if (res.confirm) {
                                      wx.switchTab({
                                          url: '/pages/shop/index2',
                                      })
                                  } else if (res.cancel) {}
                              },
                          });
                          return;
                        } else {
                          page = 'authocr?business_type=' + that.data.business_type + '&id=' + that.data.authId+'&type=1';
                        }
                        if (that.data.business_type == 1) {
                          wx.hideLoading()
                        }
                    }else{ //对公征信授权
                      //步骤:1.ocr识别,2.人脸识别,3.手机短信识别
                      //对公审批流程与个人不同 : 状态 0-未授权 1-已OCR验证 2-已银行卡验证 3-已短信验证 4-已人脸识别 5-授权通过
                        if (statue == '1' ) {
                            that.faceVerify();
                            return;
                        } else if (statue == '3') {
                            page = 'confirm?id=' + that.data.authId + '&authInfo=' + JSON.stringify(that.data.authorInfo) + '&type=' + that.data.authType;;
                        } else if (statue == '4') {
                          page = 'msgcode?id=' + that.data.authId + '&type=' + that.data.authType;
                        } else if (statue == '5') {
                            wx.showModal({
                                title: '无需重复授权',
                                showCancel: true,
                                success(res) {
                                    if (res.confirm) {
                                        wx.switchTab({
                                            url: '/pages/shop/index2',
                                        })
                                    } else if (res.cancel) {}
                                },
                            });
                            return;
                        } else {
                            page = 'authocr?business_type=' + that.data.business_type + '&id=' + that.data.authId + '&type=' + that.data.authType;
                        }
                        if (that.data.business_type == 1) {
                            wx.hideLoading()
                        }
                    }
                    wx.redirectTo({
                        url: '../authConfirm/' + page,
                    });

                }
            }
        })
    },  
    /**
     * 获取授权登录令牌
     * credit/getLoginToken.do
     * 
     * 请求参数：
     *  tradeType 授权事项编码详见[授权事项码表]
     *  productNo 产品编号
     *  deptName 部门名称
     * 
     * 响应参数：
     *  result_msg 返回信息
     *  result_code 0000成功，1111失败
     * msg内容：
     *  valId 验证标识
     *  quid 登录令牌标识
     *  quinfo 登录令牌内容
     * 
     * 
     */
    enterpriseLoginAuthorizationJump(){
      return new Promise((resolve, reject) => {
        let options = {
          url: 'credit/getLoginToken.do',
          data: JSON.stringify({
            tradeType: '101100', //授权事项码: 101100-企业信用报告查询
            productNo: '090014',
            deptName: '风险管理部',
            valId: app.globalData.int_id+'',
          }),
        };
        requestYT(options).then(res=>{
          if(res.STATUS === "1" && res.result_code === "0000"){
            that.setData({ 
              quid:res.quid,
              quinfo:res.quinfo
            });
            resolve();
          }else{
            wx.showToast({
              title: res.result_msg,
              icon: 'none',
              success(res) {
                wx.switchTab({
                  url: '/pages/shop/index2',
                })
              }
            })
            reject();
          }
        }).catch(err=>{
          wx.showToast({
            title: err,
            icon: 'none'
          })
          reject();
        })
      });
    },

     /**
     * 获取授权登录结果
     * credit/getLoginQrCode.do
     * 
     * 请求参数：
     *  productNo 产品编号
     *  deptName 部门名称
     *  valId 验证标识
     *  imageDPI 电子营业执照影印件分辨率，默认80，建议100-200
     *  mask 企业信息数据掩码
     * 
     * 响应参数：
     *  resultInfo 返回json
     *  result_msg 返回信息
     *  result_code 0000成功，1111失败
     * 
     * 处理流程，获取电子营业执照影印件上传「影像平台」
     */
    getAuthorizedLoginResult(){
      return new Promise((resolve, reject) => {
        let options = {
          url: 'credit/getLoginQrCode.do',
          data: JSON.stringify({
            productNo: '090014',
            deptName: '风险管理部',
            valId: app.globalData.int_id + ''
          }),
        };
        requestYT(options).then(res=>{
          if(res.STATUS === "1" && res.result_code === "0000"){
            var resultInfo = res.resultInfo;
            var info = JSON.parse(resultInfo).DATA;
            console.log("中数返回信息：\n" + resultInfo);
            var end=new Date(info.BASIC.OPTO.replace(/-/g,"/"));
            var now=new Date();
            //返回授权人姓名与授权人不匹配重新获取令牌
            if(info.BASIC.FRNAME != that.data.authorInfo.AUTH_NAME || //比对授权人姓名
              info.BASIC.ENTNAME != that.data.authorInfo.AUTH_ENTER_NAME || //比对授权企业名称
              info.BASIC.CREDITCODE !=  that.data.authorInfo.AUTH_ENTER_CODE || //社会统一信用码
              info.BASIC.ORGCODES != that.data.authorInfo.AUTH_ENTER_ORGNO ||  //组织机构代码 
              info.BASIC.REGNO != that.data.authorInfo.AUTH_ENTER_NO //工商注册号
              ){
                wx.hideLoading({
                  success: (res) => {
                    that.enterpriseLoginAuthorizationJump().then(res=>{
                      //第一次登陆获取到令牌，跳转中数服务小程序
                     that.jumpWXAPP('营业执照信息与授权企业法人信息不匹配！');
                    }).catch(err=>{
                      wx.showLoading({
                        title: '获取授权失败，请重试！',
                        mask: true
                      })
                      setTimeout(function () {wx.hideLoading()}, 2000)
                    });
                  },
                })
              }else if (info.BASIC.ENTSTATUSCODE != '1' ){
                wx.showModal({
                  title: '提示',
                  showCancel: false,
                  content: '经营状态异常！',
                  success(res) {
                    that.closeWX();
                  }
                })
              } else if( info.BASIC.OPTO != '长期' && (end-now < 0)){
                  wx.showModal({
                    title: '提示',
                    showCancel: false,
                    content: '营业执照过期！',
                    success(res) {
                      that.closeWX();
                    }
                  })
              }else if (info.RESULT.OPER != that.data.authorInfo.AUTH_NAME || info.RESULT.OPERTYPE != '0'){
                wx.showModal({
                  title: '提示',
                  showCancel: false,
                  content: '企业征信在线授权仅支持法人进行授权操作！',
                  success(res) {
                    that.closeWX();
                  }
                })
              }else{
                //获取信息后，上传将返回的图片信息上传影像平台
                that.setData({
                  resultAuthInfo : info,
                });
                console.log("授权成功，返回信息为：\n" + JSON.stringify(info));
                that.addBusinessImg(info.IMAGE).then(res=>{
                  resolve();
                });
              }
          }else{
            wx.hideLoading({
              success: (res) => {
                //重新获取令牌
                that.enterpriseLoginAuthorizationJump().then(res=>{
                  that.jumpWXAPP('获取授权信息失败，即将前往授权页面');
                  reject();
                })
              },
            });
          }
        }).catch(err=>{
          wx.hideLoading({
            success: (res) => {
              //重新获取令牌
              that.enterpriseLoginAuthorizationJump().then(res=>{
                that.jumpWXAPP('获取授权信息失败，即将前往授权页面');
                reject();
              })
            },
          })
        });
      });
    },
    phoneCheck() {
        return new Promise((resolve, reject) => {
            //运营商三要素接口认证ED0035auth
            let dept = '';
            let productNo = '';
            if ((that.data.business_type == 1 || that.data.business_type == 2 ) && that.data.authType == '1') {
                resolve()
                dept = '零售业务部'
                productNo = '170018'
                return;
            }

            if (that.data.business_type == 3 || that.data.authType != '1') {
                dept = '风险管理部'
                productNo = '090014'
            }
            var dataJsons = JSON.stringify({
                name: that.data.authorInfo.AUTH_NAME,
                cid: that.data.authorInfo.AUTH_CERT_NO,
                phone: that.data.phoneInput,
                dept: dept,
                productNo: productNo
            })
            var custnameTwos = encr.jiami(dataJsons, aeskey) //3段加密
            wx.request({
                url: app.globalData.creditUrl + 'getYshMessage.do',
                data: encr.gwRequest(custnameTwos),
                method: 'POST',
                header: {
                    'content-type': 'application/json', // 默认值
                },
                success(res) {
                  
                    if (res.data.head.H_STATUS === "1") {
                      resolve();
                    } else {
                        wx.hideLoading();
                        $Toast({
                            content: '手机号实名认证失败，请重新输入！',
                            type: 'error',
                            duration: 3,
                        });
                        reject()
                    }
                }
            })
        })

    },
    updateRemark3(param) {
        var dataJsons = JSON.stringify({
            data: JSON.stringify({
                id: that.data.authId,
                remark3: param,
                type: that.data.authType != 1 ? 1 : 0,
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

                }
            }
        })
    },

    onLoad(e) {
        wx.removeStorageSync('book1')
        wx.removeStorageSync('book2')
        wx.removeStorageSync('flags')
        that = this;
        
        that.setData({
            preffixUrl: app.globalData.JSBURL,
        });
        if (e.scene !=undefined && e.scene !='') {
            that.setData({
                authId: e.scene,
            });
        } else {
            that.setData({
                authId: e.id
            });
        }
        wx.showLoading({
            title: '加载中',
            mask: true,
        });

        if (wx.getStorageSync('openid') === '') {
            that.getOpenid().then(res => {
                if (e.scene !=undefined) {
                    that.getAuthInfo(e.scene);
                } else {
                    that.getAuthInfo(e.id);
                }
            }).catch(err => {
                that.getOpenid().then(res => {
                    if (e.scene !=undefined) {
                        that.getAuthInfo(e.scene);
                    } else {
                        that.getAuthInfo(e.id);
                    }
                }).catch(err => {
                    wx.hideLoading()
                    $Toast({
                        content: '登录失效,请重新登录',
                        type: 'warning',
                        duration: 1,
                    });
                })
            })
        } else {
            if (e.scene !=undefined) {
                that.getAuthInfo(e.scene);
            } else {
                that.getAuthInfo(e.id);
            }
        }
    },
    getOpenid() {
        return new Promise((resolve, reject) => {
            wx.login({
                timeout: 10000,
                success: res => {
                    wx.request({
                        url: app.globalData.URL + "getwechatid",
                        data: {
                            js_code: res.code,
                            isProxy: false,
                        },
                        header: {
                            "content-type": "application/json", // 默认值
                            key: Date.parse(new Date()).toString().substring(0, 6),
                        },
                        success(res) {
                            console.log("getWechatid")
                            if (typeof res.data != "undefined" && res.data != "") {
                                wx.setStorageSync("openid", res.data.openid);
                                wx.setStorageSync("key", res.data.key); //加解密
                                wx.setStorageSync("sessionid", res.data.session_key);
                                resolve();
                            } else {
                                reject();
                            }
                        },
                    });
                },

            });
        })
    },

    //  转化成星星
    formateStar(num) {
        let str = '';
        for (let i = 0; i < num; i++) {
            str += '*';
        }
        return str;
    },

    getAuthInfo(id) {
        if(id==''){
            wx.hideLoading({
              success: (res) => {},
            })
            wx.showModal({
                title: '提示',
                showCancel: false,
                content: '获取信息失败,请扫码重试',
                success(res) {
                    wx.switchTab({
                        url: '/pages/shop/index2',
                    })
                }
            })
            return;
        }
        var dataJsons = JSON.stringify({
            id: id,
            type: ''
        })
        var custnameTwos = encr.jiami(dataJsons, aeskey) //3段加密
        wx.request({
            url: app.globalData.creditUrl + 'findAuthInfoById.do',
            data: encr.gwRequest(custnameTwos),
            method: 'POST',
            success: (res => {
                if (res.data.head.H_STATUS === "1") {
                    let jsonData = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文
                    if(jsonData.LIST==undefined||jsonData.LIST.length==0){
                    //针对对公授权处理
                    var dataJsons = JSON.stringify({
                        id: id,
                        type: 1
                    })
                    var custnameTwos = encr.jiami(dataJsons, aeskey) //3段加密
                    wx.request({
                        url: app.globalData.creditUrl + 'findAuthInfoById.do',
                        data: encr.gwRequest(custnameTwos),
                        method: 'POST',
                        success: (res => {
                          let jsonData = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文
                            if(jsonData.LIST==undefined||jsonData.LIST.length==0){
                              wx.showModal({
                                title: '提示',
                                content: '授权信息已失效，请联系客户经理',
                                showCancel: true,
                                success(res) {
                                    if (res.confirm) {
                                        wx.switchTab({
                                            url: '/pages/shop/index2'
                                        })
                                    } 
                                },
                            });
                            return;
                          }else{
                            var data = jsonData.LIST[0];
                            that.setData({
                              authType : '1'
                            });
                            if(data.SERIAL_NO != ''){
                              wx.hideLoading();
                              wx.showModal({
                                title: '提示',
                                showCancel: false,
                                content: '该二维码已使用，请联系客户经理重新获取授权二维码！',
                                success(res) {
                                  that.closeWX();
                                }
                              })
                              return;
                            }
                              data.AUTH_PHONE2 = "";
                              data.AUTH_NAME2 = data.BOR_PER_NAME;
                              data.AUTH_CERT_NO2 = data.BOR_PER_CODE.substring(0, 2) + that.formateStar(data.BOR_PER_CODE.length - 6) +
                              data.BOR_PER_CODE.substring( data.BOR_PER_CODE.length - 4, data.BOR_PER_CODE.length);
                              data.AUTH_NAME = data.BOR_PER_NAME;
                              data.AUTH_CERT_NO = data.BOR_PER_CODE;
                              data.AUTH_CERT_TYPE = data.BOR_PER_TYPE;
                              that.setData({
                                authorInfo: data,
                                phoneInput: data.AUTH_PHONE == undefined ? '' : data.AUTH_PHONE,
                                business_id: data.BUSINESS_ID,
                              });
                              if(that.data.authId==''){
                                  that.setData({
                                      authId: that.data.authorInfo.ID
                                  });
                              }
                              that.getBorrowInfo(data.BUSINESS_ID);
                              return new Promise(function(resolve, reject) {
                                  resolve(data.BUSINESS_ID);
                              });
                          }
                        })
                      });
                    }else{
                      var data = jsonData.LIST[0];
                      if (data.AUTH_PHONE == undefined || data.AUTH_PHONE == "") {
                        data.AUTH_PHONE2 = ""
                      } else {
                          data.AUTH_PHONE2 =data.AUTH_PHONE.substring(0, 4) + that.formateStar(4) + data.AUTH_PHONE.substring(7, 11);
                      }
                      data.AUTH_NAME2 = data.AUTH_NAME.substring(0, 1) + that.formateStar(data.AUTH_NAME.length - 1);
                      data.AUTH_CERT_NO2 = data.AUTH_CERT_NO.substring(0, 2) + that.formateStar(data.AUTH_CERT_NO.length - 6) +
                          data.AUTH_CERT_NO.substring( data.AUTH_CERT_NO.length - 4, data.AUTH_CERT_NO.length);
                      that.setData({
                        authorInfo: data,
                        phoneInput: data.AUTH_PHONE == undefined ? '' : data.AUTH_PHONE,
                        business_id: data.BUSINESS_ID,
                      });
                      if(that.data.authId==''){
                          that.setData({
                              authId: that.data.authorInfo.ID
                          });
                      }
                    that.getBorrowInfo(data.BUSINESS_ID);
                      return new Promise(function(resolve, reject) {
                          resolve(data.BUSINESS_ID);
                      });
                    }
                    
                } else {
                    wx.hideLoading()
                    $Toast({
                        content: '请检查网络',
                        type: 'warning',
                        duration: 1,
                    });
                }

            })
        })
    },
    //获取授权信息
    getBorrowInfo(id) {
        if (id == undefined) {
            return;
        }
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
                        authType: data2[0].AUTH_TYPE,
                        borrowerInfo: data2[0],
                        business_type: data2[0].BUSINESS_TYPE
                    });
                    let cont = '';
                    let name = data2[0].ENTERPRISE_NAME;
                    let business_type = data2[0].BUSINESS_TYPE;
                    if(data2[0].AUTH_TYPE == '1'){//个人
                      if (business_type == 1) {
                        cont = '个人零售贷款';
                        name = data2[0].BORROW_NAME;
                      } else if (business_type == 2) {
                          name = data2[0].BORROW_NAME; 
                          cont = '个人经营性贷款';
                      } else if (business_type == 3) {
                          cont = '授信业务';
                      }
                    }else{//对公
                      if (business_type == 1) {
                        cont = '您的';
                      } else if (business_type == 2) {
                          cont = '担保企业';
                      } else if (business_type == 3) {
                          cont = '关联企业';
                      }
                    }
                    wx.hideLoading();
                    let content = '';
                    if(that.data.authType == '1'){ //个人
                      content = name + '正向江苏银行申请' + cont + '，将获取您的征信授权';
                    }else if (that.data.authType == '2'){ //对公
                      content = data2[0].ENTERPRISE_NAME + '正向江苏银行申请企业贷款，将获取' + that.data.authorInfo.AUTH_ENTER_NAME + '征信授权';
                    }else{
                      content = data2[0].BORROW_NAME+ '正向江苏银行申请个人经营贷，将获取' + that.data.authorInfo.AUTH_ENTER_NAME + '征信授权';
                    }
                    wx.showModal({
                        title: '提示',
                        showCancel: true,
                        content: content,
                        success(res) {
                            if (res.confirm) {
                                if ( that.data.authType == '1') {
                                  if(that.data.business_type == 1){
                                    wx.showLoading({
                                      title: '跳转中',
                                      mask: true
                                  })
                                  that.toDo();
                                  }
                                }else{
                                  //获取授权登录令牌
                                  that.enterpriseLoginAuthorizationJump().then(res=>{
                                    //第一次登陆获取到令牌，跳转中数服务小程序
                                   that.jumpWXAPP('即将前往授权页面');
                                  }).catch(err=>{
                                    wx.showLoading({
                                      title: '获取授权失败，请重试',
                                      mask: true
                                    })
                                    setTimeout(function () {wx.hideLoading()}, 2000)
                                  });
                                }
                            } else if (res.cancel) {
                                //关闭小程序
                               
                                that.closeWX();
                            }
                        }
                    });
                }
            })
        })
    },
    // 跳转app
    jumpWXAPP(promptMessage){
      wx.hideLoading();
      wx.showModal({
        title: '提示',
        showCancel: true,
        content: promptMessage,
        confirmText:'去授权',
        success(res) {
            if (res.confirm) {//去授权
              var quinfo = JSON.parse(that.data.quinfo.replaceAll('\\','').replace(/^["|'](.*)["|']$/g,"$1"));
              console.log('去授权');
              var version = wx.getAccountInfoSync().miniProgram.envVersion;
              wx.navigateToMiniProgram({
                //appId: version!='release'?'wx5717b61a0ff3274a':'wx63a9813a3b8601d2',  //appid 测试环境小程序
                appId: 'wx63a9813a3b8601d2',  //appid 生产环境小程序
                path: 'pages/mini/sacnLogin/qrlogin',
                extraData: {  //参数 
                  qrinfo : quinfo
                },
                envVersion: 'release', //开发版develop 开发版 trial   体验版 release 正式版 
                success(res) {
                  console.log('APP跳转成功')
                }
              })
            }else{}
        }
      });
    },
    //关闭微信小程序
    closeWX(){
      wx.exitMiniProgram({
        success: function() {
        },
        fail: function() {
        }
      })
    },
    //获取当前时间，转换格式
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
    addFaceImg(verifyResult) {
        return new Promise((resolve, reject) => {

            wx.request({
                url: app.globalData.URL + "getqrcode1",
                data: {
                    verify_result: verifyResult
                },
                header: {
                    "content-type": "application/json", // 默认值
                    key: Date.parse(new Date()).toString().substring(0, 6),
                },
                success(res) {

                    wx.downloadFile({
                        url: app.globalData.URL + "/getqrcode?file=" + res.data,
                        success(res) {
                            wx.getFileSystemManager().readFile({
                                filePath: res.tempFilePath, //选择图片返回的相对路径
                                encoding: 'base64', //编码格式
                                success: res => { //成功的回调
                                    wx.request({
                                        url: app.globalData.creditUrl + 'test.do',
                                        data: encr.gwRequest({
                                            "imgStr": res.data,
                                        }),
                                        method: 'POST',
                                        success(res) {
                                            let json = res.data.body;
                                            let dataJson3 = JSON.stringify({
                                                "IMAGE_IDCARD_A": json.imgFilePath,
                                                "RE_CUST_ID": that.data.authorInfo.AUTH_CERT_NO
                                            })
                                            console.log(dataJson3)
                                            let custnameTwo3 = encr.jiami(dataJson3, aeskey) //3段加密
                                            wx.request({
                                                url: app.globalData.creditUrl + 'addIdcardToYxOp.do',
                                                data: encr.gwRequest(custnameTwo3),
                                                method: 'POST',
                                                success(b) {
                                                    let json1 = encr.aesDecrypt(b.data.body, aeskey) //解密返回的报文
                                                    that.updateRemark3(JSON.stringify({ faceImgBatchNo: json1.BatchID }))
                                                    resolve()
                                                }
                                            })
                                        }
                                    })

                                }
                            })
                        }
                    })

                },
            });
        })
    },
    //人脸识别
    faceVerify() {
        that.baseLib();
        wx.checkIsSupportFacialRecognition({
            success(res) {
                let authorInfo = that.data.authorInfo
                wx.startFacialRecognitionVerify({
                    name: authorInfo.AUTH_NAME,
                    idCardNumber: authorInfo.AUTH_CERT_NO,

                    checkAliveType: 2,
                    success(res) {
                        wx.showLoading({
                            title: '正在上传数据',
                            mask: true
                        })
                        
                        if (res.errCode == 0) {
                            if (res.verifyResult == '' || res.verifyResult == undefined) {
                                wx.hideLoading({
                                    success: (res) => {},
                                })
                                wx.showModal({
                                    title: '提示',
                                    content: '当前人脸识别图像异常',
                                    showCancel: true,
                                });
                                return;
                            }

                            that.addFaceImg(res.verifyResult).then(res => {
                                var dataJsons = JSON.stringify({
                                    id: authorInfo.ID,
                                    status: '4',
                                    auth_time: that.getNowTime(),
                                    type: that.data.authType != 1 ? '1' : 0,
                                })
                                var custnameTwos = encr.jiami(dataJsons, aeskey) //3段加密
                                wx.request({
                                    url: app.globalData.creditUrl + 'updateAuthStatus.do',
                                    data: encr.gwRequest(custnameTwos),
                                    method: 'POST',
                                    success(res) {
                                        wx.hideLoading({
                                            success: (res) => {},
                                        })
                                        if (that.data.business_type == 1 && that.data.authType ==1) {
                                            wx.redirectTo({
                                                url: '../authConfirm/confirm?authInfo=' + JSON.stringify(that.data.authorInfo)+ '&type=' + that.data.authType
                                            });
                                            return;
                                        }
                                        wx.redirectTo({
                                            url: './msgcode?id=' + that.data.authId + '&type=' + that.data.authType,
                                        });
                                    },
                                });
                            }).catch(err => {
                                wx.hideLoading({
                                    success: (res) => {},
                                })
                                wx.showModal({
                                    title: '提示',
                                    content: '获取人脸识别图像异常',
                                    showCancel: true,
                                });
                            })
                        } else {
                            wx.hideLoading({
                                success: (res) => {},
                            })
                        }
                    },
                    fail(err) {
                        console.log('err');
                    },
                });
            },
            fail(err) {
                wx.showModal({
                    title: '提示',
                    content: '您的设备不支持人脸识别！',
                    success(res) {
                        if (res.confirm) {} else if (res.cancel) {}
                    },
                });
            },
        });

    },
    //上传营业执照图片到影像平台
    addBusinessImg(image){
      return new Promise((resolve, reject) => {
        wx.request({
          url: app.globalData.YTURL + 'jsyh/test.do', //base64 转 图片地址
          data: encr.gwRequest({"imgStr": image}),
          method: 'POST',
          success(res) {
            if (res.data.head.H_STATUS != '1') {
              wx.showToast({
                  title: '上传影像：' + res.data.head.H_MSG,
                  icon: 'none'
              })
            }else{
              let dataJson4 = JSON.stringify({
                "IMAGE_BIZLICENSE_URL": res.data.body.imgFilePath,
                "RE_REGISTER_ID": '1',
                "RE_CUST_ID":String(app.globalData.int_id)//身份证号
              })
              let custnameTwo4 = encr.jiami(dataJson4, aeskey) //3段加密
              wx.request({
                url: app.globalData.YTURL + 'electric/addBizLicenseOcr.do', //图片地址 转 batchID
                data: encr.gwRequest(custnameTwo4),
                method: 'POST',
                success(res) {
                  let jsonBatch = encr.aesDecrypt(res.data.body, aeskey);//3段加密
                  console.log("营业执照上传获取映像批次号："+jsonBatch.BatchID);
                  that.setData({BatchID : jsonBatch.BatchID});
                  resolve();
                },
                catch(err){
                  $Toast({
                    content: '上传影像平台失败！请重新点击确认！',
                    type: 'warning',
                    duration: 1,
                  });
                  wx.hideLoading();
                  reject();
                }
              });
            }
          }
         });
      });
    },
    //基库版本判断
    baseLib: function() {
        wx.getSystemInfo({
            success: function(res) {
                var version = res.SDKVersion;
                version = version.replace(/\./g, '');
                if (parseInt(version) < 193) {
                    // 小于1.9.3的版本不支持
                    wx.showModal({
                        title: '提示',
                        content: '当前微信版本不支持人脸识别功能，请升级微信',
                        showCancel: true,
                    });
                    return;
                } else {
                    that.setData({
                        baseLib: true,
                    });
                }
            },
        });
    },
    phoneInput(e) {
        that.setData({
            phoneInput: e.detail.value
        })
    },
});