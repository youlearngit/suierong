import User from '../../../utils/user.js';
import http from '../../utils/requsetP.js';
const util = require('../../utils/util');
var encr = require('../../utils/encrypt.js'); //国密3段式加密
var aeskey = encr.key //随机数
var app = getApp();
const api = require('../../../utils/api');

var that;
Page({
    data: {
        cdnUrl: app.globalData.CDNURL,
        preffixUrl: '',
        preffixUrl1: '',
        authorInfo: {},
        yyzz: {},
        selectId: "",
        fr: true,
        pdfPath: '',
        isCheck: false,
        platform: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        userInfo: {},
        shareBox: "shareBox",
        submit: true,
        maskHidden: true,
        nick: '', //授权昵称
        avatar: '', //授权头像
        wechat: "", //本详情页二维码
        // bg: "/static/wechat/img/zm/zm_85.jpg", //图片背景图
        bg: "/static/wechat/img/zm/remoteAuth.jpg", //图片背景图
        //touxiang: "/pages/public/img/temp/touxiang.jpg",//头像路径
        maskHidden: true, //控制遮罩层
        imagePath: "", //存放canvas生成的图片
        canvasId: 'mycanvas',
        preffixUrl: '',
        path: '',
        newbg: '',
        scene: '',
        callGetPhone: '',
        navto: true,
        id: '',
        state: '2',
        success: false,
        upInParam: ''
    },
    radioChange: function(e) {},
    handleChange(e) {
        that.setData({
            isCheck: e.detail.value.length == 0 ? false : true
        })
    },

    //点击分享
    showShare: function() {
        that.getState(that.data.upInParam).then(res => {
            that.setData({
                    navto: false
                })
                // 查看是否授权

            User.ifAuthUserInfo().then(res=>{

                if(res){
                    that.setData({
                        nick: app.globalData.userInfo.nickName, //授权昵称
                    })
                    wx.getImageInfo({
                        src: app.globalData.userInfo.avatarUrl,
                        success: function(res) {
    
                            that.setData({
                                shareBox: "shareBox on",
                            });
                            that.setData({
                                avatar: res.path //授权头像
                            })
                            that.showCreat();
    
                        },
                        fail: function(err) {
    
                        }
                    })
                }else{
                    that.setData({
                        loginFlag: false,
                    })
                }
              
            })
        })


    },
    //取消分享
    showHide: function() {
        that.setData({
            shareBox: "shareBox",
        })
    },
    //提交信息
    upInfomation(data) {
        return new Promise((resolve, reject) => {
            let a = data;
            a.orgCode = data.creditCode
            var dataJson = JSON.stringify(a)
            var custname = encr.jiami(dataJson, aeskey) //3段加密
            wx.request({
                url: app.globalData.YTURL + 'electric/upInformation.do',
                data: encr.gwRequest(custname),
                method: 'POST',
                header: {
                    'content-type': 'application/json', // 默认值
                },
                success: function(res) {
                    wx.hideLoading({
                        success: (res) => {},
                    })
                    if (res.data.body != undefined && Object.getOwnPropertyNames(res.data.body) != 0 && res.data.head.H_STATUS == '1') {
                        var jsonData = encr.aesDecrypt(res.data.body, aeskey)
                            /**
                             * @param RET_CODE
                             *  1002 内部错误
                                1001 验证失败
                                1004 订单不存在
                                1029 调用接口异常
                                0000 成功
                             */
                        if (jsonData.RET_CODE === '0000') {
                            resolve()
                        } else {
                            reject();
                            wx.showToast({
                                title: jsonData.RET_MSG,
                                icon: 'none',
                                duration: 2000
                            })
                        }
                    } else {
                        reject();
                        wx.showToast({
                            title: res.data.head.H_MSG,
                            icon: 'none',
                            duration: 5000
                        })
                    }
                }
            })
        })

    },

    //点击生成海报按钮function
    showCreat: function(e) {
        if (that.data.submit) {
            that.setData({
                submit: false
            })
            wx.getImageInfo({
                src: that.data.cdnUrl + that.data.bg,
                success(res) {
                    that.setData({
                            newbg: res.path //授权头像
                        })
                        // that.createNewImg();
                    
                    api.generateMiniCode("sub2/pages/billDisCount/confirm",'',(that.data.id)).then(res => {
                        console.log(res);
                        that.setData({
                            wechat: res, //赋值本地的二维码图片给data.wechat
                        });
                        that.createNewImg();
                    })
                },
                fail(res) {}
            })

        }
    },
    //点击保存到相册
    baocun: function() {
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 5000
        })
        wx.saveImageToPhotosAlbum({
            filePath: that.data.imagePath,
            success(res) {
                wx.hideToast();
                wx.showModal({
                    content: '图片已保存到相册，赶紧晒一下吧~',
                    showCancel: false,
                    confirmText: '好的',
                    confirmColor: '#333',
                    success: function(res) {
                        if (res.confirm) {
                            that.setData({
                                maskHidden: true,
                                shareBox: "shareBox",
                            })
                        }
                    },
                    fail: function(res) {
                        wx.hideToast();
                    }
                })
            }
        })
    },
    //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
    createNewImg: function() {

        var context = wx.createCanvasContext('mycanvas');
        context.setFillStyle("white");
        context.fillRect(0, 0, 750, 600);
        var path = that.data.newbg;
        context.drawImage(path, 0, 0, 750, 400); //背景绘制
        context.drawImage(that.data.wechat, 550, 435, 150, 150); //小程序码

        var touxiang = that.data.avatar;
        //context.drawImage(touxiang, 100, 1040, 100, 100);//头像绘制
        //绘制昵称
        var nickname = '@' + that.data.nick + ' 向您推荐';
        context.setFillStyle('#333');
        context.setFontSize(28);
        context.setTextAlign('left');
        context.fillText(nickname, 40, 590); //昵称绘制
        context.stroke();
        context.setFontSize(20);
        // context.fillText("长按立即申请", 565, 1156); //提示绘制
        //绘制头像
        context.setStrokeStyle('#fff');
        context.setLineWidth(0);
        context.arc(120, 495, 70, 0, 2 * Math.PI, false) //画一个圆形裁剪区域
        context.clip();
        context.drawImage(touxiang, 50, 425, 140, 140); //头像绘制
        context.stroke();
        context.draw();
        //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
        var _time = setTimeout(function() {
            wx.canvasToTempFilePath({
                canvasId: 'mycanvas',
                fileType: "jpg",
                quality: 0.7,
                success: function(res) {
                    wx.hideToast();
                    var tempFilePath = res.tempFilePath;
                    that.setData({
                        imagePath: tempFilePath,
                        canvasHidden: true
                    });
                },
                fail: function(res) {
                    //console.log(res);
                }
            });
        }, 300);
    },
    getPdf() {
        return new Promise((resolve, reject) => {

            var date = new Date()
            var dataJson = JSON.stringify({
                sqname: that.data.upInParam.partyName,
                photo1path: '1',
                photo2path: '1',
                frName: that.data.upInParam.frName,
                frIdCard: that.data.upInParam.frIdCard,
                companyAddr: that.data.upInParam.companyAddr,
                creditCode: that.data.upInParam.creditCode,
                applyTimeBegin: date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日',
                applyTimeEnd: (date.getFullYear() + 1) + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日',
                BatchID: that.data.upInParam.BatchID
            })
            var custnameTwo = encr.jiami(dataJson, aeskey)
            wx.request({
                url: app.globalData.YTURL + 'electric/negotiate.do',
                data: encr.gwRequest(custnameTwo),
                method: 'POST',
                header: {
                    'content-type': 'application/json',
                },
                success(res) {

                    if (res.data.head.H_STATUS === "1") {
                        var jsonData = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文
                        that.setData({
                            pdfPathOri: jsonData.pdfPath
                        })
                        wx.getFileSystemManager().writeFile({
                            filePath: wx.env.USER_DATA_PATH + jsonData.pdfPath.split("electric")[1], //创建一个临时文件名
                            data: jsonData.PDF, //写入的文本或二进制数据
                            encoding: 'base64', //写入当前文件的字符编码
                            success: res => {
                                that.setData({
                                    pdfPath: wx.env.USER_DATA_PATH + jsonData.pdfPath.split("electric")[1],
                                })
                                resolve()

                            },
                            fail: err => {
                                reject()
                                console.log(err)
                            }
                        })
                    } else {
                        reject();
                    }
                }
            })
        })
    },
    getPdfBase64(pdfPath) {
        return new Promise((resolve, reject) => {
            if (pdfPath == '') {
                wx.showToast({
                    title: '协议生成失败',
                    icon: 'none',
                    duration: 5000
                })
                return;
            }
            var dataJson = JSON.stringify({
                pdfPath: pdfPath
            })
            var custnameTwo = encr.jiami(dataJson, aeskey)
            wx.request({
                url: app.globalData.YTURL + 'electric/getPdfBase64.do',
                data: encr.gwRequest(custnameTwo),
                method: 'POST',
                header: {
                    'content-type': 'application/json',
                },
                success(res) {
                    if (res.data.head.H_STATUS === "1") {
                        var jsonData = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文
                        wx.getFileSystemManager().writeFile({
                            filePath: wx.env.USER_DATA_PATH + pdfPath.split("electric")[1], //创建一个临时文件名
                            data: jsonData.PDF, //写入的文本或二进制数据
                            encoding: 'base64', //写入当前文件的字符编码
                            success: res => {
                                resolve()
                                that.setData({
                                    pdfPath: wx.env.USER_DATA_PATH + pdfPath.split("electric")[1],
                                })
                            },
                            fail: err => {
                                reject();
                                console.log(err)
                            }
                        })

                    } else {
                        wx.showToast({
                            title: res.data.head.H_MSG,
                            icon: 'none',
                            duration: 5000
                        })
                        reject();
                    }
                }
            })
        })
    },
    notesRecord() {
        return new Promise((resolve, reject) => {
            if (that.data.id == '') {
                resolve()
                return;
            }
            var dataJson = JSON.stringify({
                id: that.data.id
            })
            var custnameTwo = encr.jiami(dataJson, aeskey)
            wx.request({
                url: app.globalData.YTURL + 'electric/notesRecord.do',
                data: encr.gwRequest(custnameTwo),
                method: 'POST',
                header: {
                    'content-type': 'application/json',
                },
                success(res) {
                    if (res.data.head.H_STATUS === "1") {
                        var jsonData = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文
                        console.log('notesRecord')

                        console.log(jsonData)
                        if (jsonData.flag == '1') {
                            resolve(jsonData.notes[0])
                            return;
                        }
                        wx.showModal({
                            title: '提示',
                            content: '该订单已失效',
                            success(res) {

                            }
                        })
                        reject();
                    } else {
                        wx.showToast({
                            title: res.data.head.H_MSG,
                            icon: 'none',
                            duration: 5000
                        })
                        reject();
                    }
                }
            })
        })
    },
    navTo() {
        console.log(that.data.id)
        console.log(that.data.selectId)

        if (that.data.selectId != that.data.id && !that.data.fr) {
            wx.showToast({
                title: '该订单已失效',
                icon: 'none',
                duration: 5000
            })
            return;
        }
        if (!this.data.isCheck) {
            wx.showToast({
                title: '请勾选已阅读协议',
                icon: 'none',
                duration: 3000
            })
            return;
        }
        if (that.data.pdfPath == '') {
            wx.showLoading({
                title: '重新生成协议书',
                mask: true
            })
            that.getPdf().then(res => {
                wx.hideLoading({
                    success: (res) => {},
                })
                wx.showToast({
                    title: '协议书生成成功',
                    icon: 'none'
                })
                that.setData({
                    success: true
                })
            }).catch(err => {
                wx.hideLoading({
                    success: (res) => {},
                })
                wx.showToast({
                    title: '协议书生成失败',
                    icon: 'none'
                })
            })
            return;
        }
        that.getState(that.data.upInParam).then(res => {
            this.baseLib();
            wx.checkIsSupportFacialRecognition({
                success(res) {
                    wx.startFacialRecognitionVerify({
                        name: that.data.upInParam.frName,
                        idCardNumber: that.data.upInParam.frIdCard,
                        checkAliveType: 2,
                        success(res) {
                            if (res.errCode == 0) {
                                wx.showLoading({
                                    title: '上传数据中', //提示的内容,
                                    mask: true //显示透明蒙层，防止触摸穿透,
                                });
                                that.notesRecord().then(data => {
                                    that.upInfomation(data).then(res => {
                                        that.update('3').then(res => {
                                            wx.showToast({
                                                title: '上传成功',
                                                duration: 3000
                                            })
                                            wx.navigateTo({
                                                url: './status',
                                            })
                                        })
                                    })
                                })
                            } else {
                                wx.showModal({
                                    title: '提示',
                                    content: '人脸识别错误，请重试',
                                    success(res) {
                                        if (res.confirm) {} else if (res.cancel) {}
                                    },
                                });
                            }
                        },
                        fail(err) {
                            wx.showModal({
                                title: '提示',
                                content: '人脸识别失败',
                                success(res) {
                                    if (res.confirm) {} else if (res.cancel) {}
                                },
                            });
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
        })


    }, //基库版本判断
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
    selectNotes(openid, creditCode) {
        return new Promise((resolve, reject) => {
            var dataJson = JSON.stringify({
                openId: openid,
                creditCode: creditCode
            })
            var custnameTwo = encr.jiami(dataJson, aeskey) //3段加密
            wx.request({
                url: app.globalData.YTURL + 'electric/selectNotes.do',
                data: encr.gwRequest(custnameTwo),
                method: 'POST',
                header: {
                    'content-type': 'application/json', // 默认值
                },
                success(res) {
                    if (res.data.head.H_STATUS === "1") {
                        var jsonData = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文
                        console.log('selectNotes')

                        console.log(jsonData)
                        if (jsonData.flag == '1') {
                            let list = jsonData.notes
                            if (list[0].state == '4') {
                                reject()
                                return;
                            }
                            resolve(list[0].id)
                            return;
                        }
                        reject();
                    } else {
                        reject();
                        wx.showToast({
                            title: res.data.head.H_MSG,
                            icon: 'none',
                            duration: 5000
                        })
                    }
                }

            })
        })
    },
    onLoad(e) {
        that = this;
        try {
            const res = wx.getSystemInfoSync()
            if (res.platform == 'ios' || res.platform == 'android') {
                that.setData({
                    platform: true
                });
            } else {
                that.setData({
                    platform: false
                });
            }

        } catch (e) {

        }
        if (e.id) {
            that.setData({
                id: e.id
            });
        }

        if (e.scene) {

            if(e.scene.indexOf('@')==-1){
                that.setData({
                    id: e.scene,
                    fr: false
                });  
                return; 
            }
            
            let id = e.scene.split("@")
            that.setData({
                id: id[1],
                fr: false
            });
        }

        
        wx.loadFontFace({
            family: 'FZFYSJW--GB1-0',
            source: 'url(' + app.globalData.URL + 'static/wechat/img/zm/FZFYSJW--GB1-0.ttf' + ')',
            success: (res) => {},
            fail: (err) => {}
        })

        this.setData({
            preffixUrl: app.globalData.JSBURL,
            preffixUrl1: app.globalData.URL
        });

        that.notesRecord().then(note => {
            that.setData({
                upInParam: note
            })
            if (that.data.id != '') {
                that.selectNotes(note.openId, note.creditCode).then(id => {
                    that.setData({
                        selectId: id
                    })
                    if (that.data.selectId != that.data.id && !that.data.fr) {
                        wx.hideLoading({
                            success: (res) => {},
                        })
                        wx.showModal({
                            title: '提示',
                            content: '该订单已失效',
                            success(res) {

                            }
                        })
                        return;
                    }

                })

            }
            wx.showLoading({
                title: '正在生成协议书',
                mask: true
            })
            if (note.remark8 != undefined && note.remark8 != '') {
                that.getPdfBase64(note.remark8).then(res => {
                    wx.hideLoading({
                        success: (res) => {},
                    })
                    wx.showToast({
                        title: '协议书生成成功',
                        icon: 'none'
                    })
                    that.getState(note)

                }).catch(err => {
                    wx.hideLoading({
                        success: (res) => {},
                    })
                    wx.showToast({
                        title: '协议书生成失败',
                        icon: 'none'
                    })
                })
                return;
            }
            that.getPdf().then(res => {
                    that.update('2').then(res => {

                    })
                    wx.hideLoading({
                        success: (res) => {},
                    })
                    wx.showToast({
                        title: '协议书生成成功',
                        icon: 'none'
                    })
                    that.setData({
                        success: true
                    })
                    that.getState(note)


                }).catch(err => {
                    wx.hideLoading({
                        success: (res) => {},
                    })
                    wx.showToast({
                        title: '协议书生成失败',
                        icon: 'none'
                    })
                })
                // that.getCustomers().then(auth => {
                //     if (auth.ID_CARD != that.data.upInParam.frIdCard && !that.data.fr) {
                //         wx.showModal({
                //             title: '提示',
                //             content: '认证信息与法人信息不一致',
                //             showCancel: false,
                //             success(res) {
                //                 if (res.confirm) {
                //                     wx.redirectTo({
                //                         url: './index',
                //                     })
                //                 }
                //             }
                //         })
                //         return;
                //     }
                // })
        })
    },
    getCustomers() {
        return new Promise((resolve, reject) => {
            if (wx.getStorageSync('openid') === '') {
                wx.showToast({
                    title: '登录失效',
                    icon: 'none',
                    duration: 5000
                })
                reject()
                return;
            }
            var dataJson = JSON.stringify({ openId: wx.getStorageSync('openid') })
            var custname = encr.jiami(dataJson, aeskey) //3段加密

            wx.request({
                url: app.globalData.YTURL + 'jsyh/getCustomers.do',
                data: encr.gwRequest(custname),
                method: 'POST',
                header: {
                    'content-type': 'application/json', // 默认值
                },
                success: function(res) {

                    if (res.data.body != undefined && Object.getOwnPropertyNames(res.data.body) != 0) {
                        var jsonData = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文
                        if (jsonData.LIST == undefined || jsonData.LIST[0].ID_CARD === '' ||
                            jsonData.LIST[0].ID_CARD == undefined || jsonData.LIST[0].REAL_NAME === '' ||
                            jsonData.LIST[0].REAL_NAME == undefined) {
                            reject()
                            wx.showModal({
                                title: '提示',
                                content: '身份信息未认证，去认证',
                                showCancel: false,
                                success(res) {
                                    if (res.confirm) {
                                        wx.navigateTo({ url: '/sub1/pages/info/identify' })
                                    } else if (res.cancel) {}
                                }
                            })
                        } else {
                            resolve(jsonData.LIST[0])
                        }
                    } else {
                        reject()
                        wx.showToast({
                            title: res.data.head.H_MSG,
                            icon: 'none',
                            duration: 5000
                        })
                    }
                },
                fail: function(res) {
                    reject()
                    wx.showToast({
                        title: '网络错误',
                        icon: 'none',
                        duration: 5000
                    })

                }
            })
        })
    },
    showDetail(e) {
        if (that.data.pdfPath === '') {
            wx.showLoading({
                title: '重新生成协议书',
                mask: true
            })
            that.getPdf().then(res => {
                wx.hideLoading({
                    success: (res) => {},
                })
                wx.showToast({
                    title: '协议书生成成功',
                    icon: 'none'
                })


            }).catch(err => {
                wx.hideLoading({
                    success: (res) => {},
                })
                wx.showToast({
                    title: '协议书生成失败',
                    icon: 'none'
                })
            })
            return;
        }
        wx.openDocument({
            filePath: that.data.pdfPath,
            success: function(res) {
                console.log('打开文档成功')
            },
            fail: function(res) {
                console.log('打开文档失败')
            },
        })
    },
    update(state) {
        return new Promise((resolve, reject) => {
            var dataJson = JSON.stringify({
                id: that.data.id,
                state: state,
                remark8: that.data.pdfPathOri //pdf路径
            })
            var custnameTwo = encr.jiami(dataJson, aeskey)
            wx.request({
                url: app.globalData.YTURL + 'electric/updateNotes.do',
                data: encr.gwRequest(custnameTwo),
                method: 'POST',
                header: {
                    'content-type': 'application/json', // 默认值
                },
                success: function(res) {
                    wx.hideLoading({
                        success: (res) => {},
                    })
                    if (res.data.body != undefined && Object.getOwnPropertyNames(res.data.body) != 0 && res.data.head.H_STATUS == '1') {
                        resolve()

                    } else {
                        reject()
                        wx.showToast({
                            title: res.data.head.H_MSG,
                            icon: 'none',
                            duration: 5000
                        })
                    }

                }
            })
        })

    },
    getState(res) {
        return new Promise((resolve, reject) => {
            that.notesRecord().then(data => {
                wx.hideLoading()
                if (res.state == '3') {
                    reject()
                    wx.showModal({
                        content: '申请订单状态变化，请前往查看！',
                        confirmText: '好的',
                        confirmColor: '#333',
                        success: function(res) {
                            if (res.confirm) {
                                wx.redirectTo({
                                    url: './status?id=' +
                                        res.id,
                                })
                            }
                        },
                        fail: function(res) {}
                    })
                    return;
                }

                if (res.state == '4') {
                    reject()
                    wx.showModal({
                        content: '申请订单已完成！',
                        confirmText: '好的',
                        showCancel: false,
                        confirmColor: '#333',
                        success: function(res) {
                            if (res.confirm) {
                                wx.redirectTo({
                                    url: './index',
                                })
                            }
                        },
                        fail: function(res) {}
                    })
                    return;
                }
                resolve()

            }).catch(err => {
                reject()

            });
        })
    },
    onPullDownRefresh() {
        wx.showLoading({
            title: '刷新中',
        })
        that.notesRecord().then(data => {
            wx.stopPullDownRefresh()
            wx.hideLoading()

            if (data.state != that.data.state) {
                wx.showModal({
                    content: '申请订单状态变化，请前往查看！',
                    confirmText: '好的',
                    confirmColor: '#333',
                    success: function(res) {
                        if (res.confirm) {
                            wx.redirectTo({
                                url: './status?id=' +
                                    data.id,
                            })
                        }
                    },
                    fail: function(res) {
                        wx.hideToast();
                    }
                })
            } else {
                wx.showToast({
                    title: '请联系法人进行相关操作',
                    icon: 'none',
                    duration: 5000
                })
            }
        }).catch(err => {
            wx.stopPullDownRefresh()
            wx.hideLoading({
                success: (res) => {},
            })

        });

    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        let pages = getCurrentPages(); //获取加载的页面
        let currentPage = pages[pages.length - 1]; //获取当前页面的对象
        let url = currentPage.route; //当前页面url
        var path = "sub2/pages/billDisCount/confirm" + "?scene=@" + that.data.id;
        return {
            path: path,
            imageUrl: that.data.cdnUrl + "/static/wechat/img/zm/remoteAuth.jpg"
        }
    },
});