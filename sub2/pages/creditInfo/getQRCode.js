// pages/creditInfo/getQRCode.js
import http from '../../utils/requsetP.js'
const util = require('../../utils/util');
var that;
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        qrcodeUrl: '',
        avatarUrl: '',
        nickName: '',
        borrow_name: '',
        preffixUrl: '',
        businessid: '',
        authName: '',
        authID: '',
        business_type: '',
        canvasHidden: true, //设置画板的显示与隐藏，画板不隐藏会影响页面正常显示
        shareImgPath: '',
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(e) {
        that = this;
        if (wx.getStorageSync('openid') === '') {
            app
                .getSessionInfo()
                .then(res => {})
        }
        // 查看是否授权
        let authID = e.authID
        let avatarurl = decodeURIComponent(e.avatarurl)
        let imgPath = ''
        console.log(avatarurl)

        var index = avatarurl.lastIndexOf("\/");
        imgPath = avatarurl.substring(index + 1, avatarurl.length);
        console.log(imgPath)

        wx.downloadFile({
            url: app.globalData.URL + "/getqrcode?file=" + imgPath,
            success: function(res) {


                if (res.statusCode === 200) {
                    that.setData({
                        qrcodeUrl: res.tempFilePath
                    })
                } else {}
            },
        });
        let authName = decodeURIComponent(e.authName);

        this.setData({
            preffixUrl: app.globalData.JSBURL,
            authName: authName,
            authID: authID,
            business_type: e.business_type,
            borrwo_name: e.borrwo_name
        })


    },
    // onShareAppMessage() {
    //     return {
    //         title: '',
    //         path: 'pages/authConfirm/index?id=' + that.data.authID + '&business_type=' + that.data.business_type + '&borrwo_name=' + that.data.borrow_name,
    //     }
    // },
    bindGetUserInfo(e) {
        //         wx.redirectTo({ url: '../authConfirm/index?scene='+that.data.authID });
        // return;
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            avatarUrl: app.globalData.userInfo.avatarUrl,

            nickName: app.globalData.userInfo.nickName
        })
        wx.showLoading({
            title: '图片生成中',
            mask: true,
            success() {
                that.saveImg()
            }
        })
    },
    saveImg() {
        let unit = 0;
        let img1 = ''
        let img2 = ''
        let img3 = ''
        let promise1 = new Promise(function(resolve, reject) {
            img2 = that.data.qrcodeUrl
            resolve();


        })

        let promise2 = new Promise(function(resolve, reject) {
            wx.getImageInfo({
                src: that.data.avatarUrl,
                success(res) {
                    img3 = res.path
                    resolve(res);
                },
                fail(res) {
                    reject(res)
                }
            })

        })
        Promise.all([promise1, promise2])
            .then((res) => {
                wx.getSystemInfo({
                    success: function(res) {
                        let windowWidth = res.windowWidth
                        unit = res.screenWidth / windowWidth

                        wx.getImageInfo({
                            src: that.data.preffixUrl + 'static/wechat/credit/code_bg.png',
                            success(res) {
                                that.setData({
                                    canvasHidden: false
                                })

                                img1 = res.path

                                let context = wx.createCanvasContext('share');

                                context.drawImage(img1, 0, unit * 0, unit * 750, unit * 1234) //绘制背景
                                context.drawImage(img2, unit * 470, unit * 985, unit * 190, unit * 190) //绘制二维码
                                context.setFontSize(28) //文字字体
                                context.fillText(that.data.borrwo_name + "向", unit * 50, unit * 1205)
                                context.fillText("申请授权", unit * 290, unit * 1205)
                                context.setFillStyle("#16a8fa")
                                context.fillText(that.data.authName, unit * 200, unit * 1205)
                                context.setFontSize(28)
                                context.setFillStyle("#16a8fa")
                                context.fillText("长按识别小程序", unit * 465, unit * 1205)

                                var avatarurl_width = unit * 140; //绘制的头像宽度
                                var avatarurl_heigth = unit * 140; //绘制的头像高度
                                var avatarurl_x = unit * 140; //绘制的头像在画布上的位置
                                var avatarurl_y = unit * 1005; //绘制的头像在画布上的位置
                                context.arc(avatarurl_width / 2 + avatarurl_x, avatarurl_heigth / 2 + avatarurl_y, avatarurl_width / 2, 0, Math.PI * 2, false);
                                context.clip(); //画圆
                                context.drawImage(img3, avatarurl_x, avatarurl_y, avatarurl_width, avatarurl_heigth); //画圆形头像

                                //把画板内容绘制成图片，并回调画板图片路径
                                var retry = 0;
                                setTimeout(() => {

                                    that.drawImage(context, retry, unit);

                                }, 200)


                            }
                        })


                    },
                })
            }).catch((err) => {
                wx.hideLoading();

                if (err.errMsg == "getImageInfo:fail invalid") {
                    wx.showToast({
                        title: '二维码信息获取异常',
                        icon: 'none',
                        mask: true,
                        duration: 1500,
                    })

                    return;
                }
                wx.showToast({
                    title: "生成图片失败",
                    icon: "none",
                    mask: true,
                    duration: 200,
                });
            })
    },

    drawImage(context, retry, unit) {
        //把画板内容绘制成图片，并回调画板图片路径
        context.draw(false, function() {
            wx.canvasToTempFilePath({
                x: 0,
                y: 0,
                width: unit * 750,
                height: unit * 1234,
                destWidth: unit * 750,
                destHeight: unit * 1234,
                canvasId: 'share',
                quality: 1,
                success: a => {
                    that.setData({
                        shareImgPath: a.tempFilePath, //将绘制的图片地址保存在shareImgPath 中
                        canvasHidden: true //设置画板隐藏，否则影响界面显示
                    })
                    wx.previewImage({ //将图片预览出来
                        urls: [that.data.shareImgPath]
                    })
                    wx.hideLoading() //图片已经绘制出来，隐藏提示框
                },
                fail: err => {

                    retry++;
                    if (retry > 10) {
                        wx.hideLoading({
                            success: (res) => {},
                        })
                        wx.showToast({
                            title: '生成失败',
                            icon: 'none'
                        })
                        return;
                    }
                    setTimeout(() => {
                        that.drawImage(context, retry, unit);
                    }, 200)
                }
            })
        })
    }
})