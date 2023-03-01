var app = getApp()
import WxValidate from "../../../assets/plugins/wx-validate/WxValidate";
const util = require('../../utils/util');
import http from '../../utils/requsetP.js'
var encr = require('../../utils/encrypt.js'); //国密3段式加密
var aeskey = encr.key //随机数
const {
    $Toast
} = require('../../dist/base/index');
var that;
Page({

    data: {
        idcard: {},
        authInfo: {},
        preffixUrl: '',
        authType:'',
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

        let authInfo = this.data.authInfo;
        let idcard = this.data.idcard;

        if (authInfo.AUTH_NAME == idcard.name && authInfo.AUTH_CERT_NO.toUpperCase() == idcard.number.toUpperCase()) {
            // 更改状态//
            var dataJsons = JSON.stringify({
                id: authInfo.ID,
                status: '1',
                auth_time: that.getNowTime()
            })
            var custnameTwos = encr.jiami(dataJsons, aeskey) //3段加密
            wx.request({
                url: app.globalData.creditUrl + 'updateAuthStatus.do',
                data: encr.gwRequest(custnameTwos),
                method: 'POST',
                success(res) {
                    that.faceVerify();
                }
            })

        } else {
            wx.showModal({
                title: '提示',
                content: '个人信息与当前授权人信息不符，无法进行授权，请重新进行身份证OCR识别',
                showCancel: false,
                success(res) {
                    wx.navigateBack({
                        url: 'authocr'
                    })
                },
            })
        }
    },

    onLoad(e) {
        that = this;
        if (e.business_type) {
            that.setData({
                business_type: e.business_type,
                authType: e.type
            });
        }
        let data = JSON.parse(decodeURIComponent(e.idcard));
        console.log('data', data)
        data.name2 =
            data.name.substring(0, 1) + this.formateStar(data.name.length - 1);
        data.number2 =
            data.number.substring(0, 2) +
            this.formateStar(12) +
            data.number.substring(data.number.length - 4, data.number.length);
        that.setData({
            preffixUrl: app.globalData.URL,
            idcard: data,
            authInfo: JSON.parse(decodeURIComponent(e.authInfo))
        })
    },

    formateStar(num) {
        let str = '';
        for (let i = 0; i < num; i++) {
            str += '*';
        }
        return str;
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

                                            let authInfo = that.data.authInfo;
                                            let dataJson3 = JSON.stringify({
                                                "IMAGE_IDCARD_A": json.imgFilePath,
                                                "RE_CUST_ID": authInfo.AUTH_CERT_NO
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
                                                        // wx.setStorageSync('faceImgBatchNo', json1.BatchID)
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
    updateRemark3(param) {
        var dataJsons = JSON.stringify({
            data: JSON.stringify({
                id: that.data.authInfo.ID,
                remark3: param,
                type: that.data.authType != '1' ? '1' : 0,
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
    faceVerify() {
        that.baseLib();
        wx.checkIsSupportFacialRecognition({
            success(res) {
                let authInfo = that.data.authInfo;
                wx.hideLoading({
                    success: (res) => {},
                })
                wx.startFacialRecognitionVerify({
                    name: authInfo.AUTH_NAME,
                    idCardNumber: authInfo.AUTH_CERT_NO,
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
                                    id: authInfo.ID,
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
                                        if (that.data.business_type == 1 && that.data.authType == '1') {
                                            wx.redirectTo({
                                                url: './confirm?authInfo=' + JSON.stringify(authInfo) + "&type=" + that.data.authType
                                            });
                                            return;
                                        }
                                        wx.redirectTo({
                                            url: './msgcode?id=' + that.data.authInfo.ID + "&type=" + that.data.authType
                                        });
                                    },
                                });
                            }).catch(err => {
                                wx.hideLoading({
                                    success: (res) => {},
                                })
                                wx.showModal({
                                    title: '提示',
                                    content: '当前人脸识别图像异常',
                                    showCancel: true,
                                });
                            })

                        } else {
                            wx.hideLoading({
                                success: (res) => {},
                            })
                            console.log(res);
                        }
                    },
                    fail(err) {

                    },
                });
            },
            fail(err) {
                wx.hideLoading({
                    success: (res) => {},
                })
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

    //基库版本判断
    baseLib: function() {
        wx.getSystemInfo({
            success: function(res) {
                var version = res.SDKVersion;
                version = version.replace(/\./g, '');
                if (parseInt(version) < 193) {
                    wx.hideLoading({
                        success: (res) => {},
                    })
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

})