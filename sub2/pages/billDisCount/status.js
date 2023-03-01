// sub2/pages/billDisCount/status.js
var app = getApp();
var that;
const util = require("../../utils/util");
const api = require("../../../utils/api");

var encr = require('../../utils/encrypt.js'); //国密3段式加密
var aeskey = encr.key //随机数
Page({

    /**
     * 页面的初始数据
     */
    data: {
        state: 3

    },

    //
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        that = this;
        if (options.id) {
            that.setData({
                id: options.id
            })
            that.notesRecord().then(res => {
                that.setData({
                    state: res[0].state
                })
            })
        }

    },
    notesRecord() {
        return new Promise((resolve, reject) => {

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
                    wx.hideLoading()
                    if (res.data.head.H_STATUS === "1") {
                        var jsonData = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文
                        if (jsonData.flag == '1') {
                            resolve(jsonData.notes)
                            return;
                        }
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
    onPullDownRefresh() {
        wx.showLoading({
            title: '刷新中',
        })

        that.notesRecord().then(res => {
            wx.stopPullDownRefresh()
            wx.hideLoading({
                success: (res) => {},
            })
            that.setData({
                state: res[0].state
            })
        }).catch(err => {
            wx.stopPullDownRefresh()
            wx.hideLoading({
                success: (res) => {},
            })

        });

    },
    update() {
        var dataJson = JSON.stringify({
            id: that.data.id,
            state: '4'
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

                if (res.data.body != undefined && Object.getOwnPropertyNames(res.data.body) != 0 && res.data.head.H_STATUS == '1') {
                    wx.redirectTo({
                        url: './index',
                    })

                } else {
                    wx.showToast({
                        title: res.data.head.H_MSG,
                        icon: 'none',
                        duration: 5000
                    })
                }

            }
        })

    },
    back() {

        wx.redirectTo({
            url: './index',
        })

    }

})