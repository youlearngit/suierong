// sub2/pages/billDisCount/index.js
var app = getApp();
var that;
var encr = require('../../utils/encrypt.js'); //国密3段式加密
var aeskey = encr.key //随机数

Page({

    /**
     * 页面的初始数据
     */
    data: {
        preffixUrl: app.globalData.URL,

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        that = this
        wx.loadFontFace({
            family: 'FZFYSJW--GB1-0',
            source: 'url(' + app.globalData.URL + 'static/wechat/img/zm/FZFYSJW--GB1-0.ttf' + ')',
            success: (res) => {
                //console.log(res)
            },
            fail: (err) => {
                //console.log(err)
            }
        })
    },
    into(e) {
        if (wx.getStorageSync('openid') === '') {
            that.getOpenid().then(res => {
                if (wx.getStorageSync('openid') === '') {
                    wx.showToast({
                        title: '登录失效，请重试',
                        icon: 'none',
                        duration: 2000
                    })
                }
            }).catch(err => {
                wx.showToast({
                    title: '登录失效，请重试',
                    icon: 'none',
                    duration: 2000
                })
            })
            return;
        }
        let id = e.currentTarget.dataset.id
        let page = ""

        switch (id) {
            case '1':
                page = "apply"
                break;
            case '2':
                page = "sQuery"
                break;
            case '3':
                page = "eQuery"
                break;
            default:
                page = "apply"
                break;
        }

        wx.navigateTo({
            url: './' + page,
        })

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


    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})