// sub2/pages/billDisCount/apply.js
var encr = require('../../utils/encrypt.js'); //国密3段式加密
var aeskey = encr.key //随机数
const app = getApp();
var that;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isCheck: false,
        scene: '',
        cdnUrl: app.globalData.CDNURL,

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        that = this;

        if (options.scene) {
            var scene = decodeURIComponent(options.scene);
            this.setData({
                scene: scene,
            });
            wx.setStorageSync('billScene', scene)
        }
        this.setData({
            preffixUrl: app.globalData.JSBURL,
            preffixUrl1: app.globalData.URL
        });
        this.getCustomers()

    },

    handleChange(e) {
        that.setData({
            isCheck: e.detail.value.length == 0 ? false : true
        })
    },

    getCustomers() {
        return new Promise((resolve, reject) => {

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
                        if (jsonData.LIST == undefined || jsonData.LIST[0].TEL === '' ||
                            jsonData.LIST[0].TEL == undefined) {
                            reject()
                            wx.showModal({
                                title: '提示',
                                content: '手机号未注册，去注册',
                                success(res) {
                                    if (res.confirm) {
                                        wx.navigateTo({ url: '/sub1/pages/auth/index' })
                                    } else if (res.cancel) {}
                                }
                            })

                        } else if (jsonData.LIST[0].ID_CARD === '' ||
                            jsonData.LIST[0].ID_CARD == undefined || jsonData.LIST[0].REAL_NAME === '' ||
                            jsonData.LIST[0].REAL_NAME == undefined) {
                            reject()
                            wx.showModal({
                                title: '提示',
                                content: '身份信息未认证，去认证',
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
    into() {
        if (!this.data.isCheck) {
            wx.showToast({
                title: '请勾选已阅读',
                icon: 'none',
                duration: 3000
            })
            return;
        }
        if (wx.getStorageSync('openid') === '') {
            app.getSessionInfo().then(res => {
                if (wx.getStorageSync('openid') != '') {
                    that.getCustomers().then(res => {
                        wx.redirectTo({
                            url: './applyOcr',
                        })
                    })
                    return;
                }
                wx.showToast({
                    title: '登录失效，请重试',
                    icon: 'none',
                    duration: 5000
                })
            })
            return;
        }
        that.getCustomers().then(res => {
            wx.redirectTo({
                url: './applyOcr',
            })
        })

    },
    navback() {
        wx.navigateBack({
            delta: 1,
        })
    },

})