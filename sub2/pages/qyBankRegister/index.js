// sub2/pages/qyBankRegister/index.js
const util = require('../../utils/util');
const app = getApp();
const api = require('../../../utils/api');
import user from "../../../utils/user";
var encr = require('../../utils/encrypt.js'); //国密3段式加密
var aeskey = encr.key //随机数
var that;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        loginFlag: true,
        cdnUrl: app.globalData.CDNURL,
        navTop: app.globalData.statusBarTop,
        navHeight: app.globalData.statusBarHeight,
        preffixUrl: app.globalData.URL,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        userInfo: {},
        shareBox: "shareBox",
        submit: true,
        maskHidden: true,
        nick: '', //授权昵称
        avatar: '', //授权头像
        wechat: "", //本详情页二维码
        bg: "/static/wechat/img/zm/zm_100.png", //图片背景图
        maskHidden: true, //控制遮罩层
        imagePath: "", //存放canvas生成的图片
        customer: {},
        empNo: '',
        shareEmpNo: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        that = this;
        if (options.empNo) {
            that.setData({
                empNo: options.empNo
            })
        }
        if (options.scene) {
            var scene = decodeURIComponent(options.scene).split("a");
            that.setData({
                empNo: scene[2]
            });
        }
        var pagenum = getCurrentPages()
        that.setData({
            pageFlag: pagenum.length
        })
        that.getPhone()
        user.getCustomerInfo().then(res => {
            if (res.USERID) {
                that.setData({
                    shareEmpNo: res.USERID
                })
            }
        })
    },
    home() {
        wx.switchTab({
            url: '/pages/shop/index2',
        })
    },
    load() {
        let url= 'https://mbank5ws.jsbchina.cn/mbank/page/indexJsb.html#page/01/0110/01/P011001.html'//生产
        // let url = 'https://mbankh5test.jsbchina.cn/mbank/page/indexJsb.html#page/01/0110/01/P011001.html'
        wx.showLoading({
            title: '正在加载中',
            mask: true
        })
        that.rsaEncrypt().then(res => {
            if (res.msg == 1) {
                url = url + '?a=' + res.data
            }
            wx.navigateTo({
                url: "/pages/showWeb/showWeb?skipUrl=" + encodeURIComponent(url)
            })
        })

    },
    prePage() {
        wx.navigateBack();
    },

    //点击分享
    showShare: function() {
       
        wx.showLoading({
          title: '正在生成海报',
        })
        that.showCreat();

    },
    rsaEncrypt() {
        return new Promise((resolve, reject) => {

            var dataJson = JSON.stringify({
                mobile: that.data.customer.TEL == undefined ? '' : that.data.customer.TEL,
                openid: wx.getStorageSync('openid'),
                recOpenid: app.globalData.share_person,
                plaEmpno: that.data.empNo,
                shareId: app.globalData.shareID,
            })
            var custnameTwo = encr.jiami(dataJson, aeskey)
            wx.request({
                url: app.globalData.YTURL + 'sui/mobileApply.do',
                data: encr.gwRequest(custnameTwo),
                method: 'POST',
                header: {
                    'content-type': 'application/json', // 默认值
                },
                success: function(res) {
                    if (res.data.body != undefined && Object.getOwnPropertyNames(res.data.body) != 0 && res.data.head.H_STATUS == '1') {
                        var jsonData = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文
                        wx.hideLoading()
                        if (jsonData.code == '1') {
                            resolve({ msg: 1, data: jsonData.stringData })
                        } else {
                            wx.showToast({
                                title: jsonData.msg,
                                icon: 'none',
                                duration: 5000
                            })
                        }
                    } else {
                        wx.hideLoading()
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

    getPhone() {

        user.getCustomerInfo().then(res => {
            let customer = res;
            that.setData({
                customer
            });

        }).catch(err => {

        })
    },
    //取消分享
    showHide: function() {
        that.setData({
            shareBox: "shareBox",
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
                        newbg: res.path
                    })
                    api.generateMiniCode("sub2/pages/qyBankRegister/index", that.data.shareEmpNo).then(res => {
                        that.setData({
                            wechat: res, //赋值本地的二维码图片给data.wechat
                        });
                        that.createNewImg();
                    }).catch(err=>{
                        wx.hideLoading({
                            success: (res) => {},
                          })
                          wx.showToast({
                            title: '生成失败,请重试',
                          })
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
        context.fillRect(0, 0, 750, 1215);
        var path = that.data.newbg;
        context.drawImage(path, 0, 0, 750, 1215); //背景绘制
        context.drawImage(that.data.wechat, 550, 1035, 150, 150); //小程序码

        context.stroke();
        context.draw();
        wx.hideLoading({
          success: (res) => {},
        })
        that.setData({
            shareBox: "shareBox on",
        })
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
                fail: function(res) {}
            });
        }, 300);
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        let imgPath = that.data.cdnUrl + "/static/wechat/img/zm/zm_109.png"
        let params = "&empNo=" + that.data.shareEmpNo + "&intId=" + app.globalData.int_id;
        return api.shareApp(imgPath, params);
    }
})