// sub2/pages/billDisCount/sQuery.js
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
        a: {},
        preffixUrl: app.globalData.URL,
        notes: {}

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        that = this;
        console.log('openid' + wx.getStorageSync('openid'))

        wx.showLoading({
            title: '加载中',
        })
        that.getEnterprise().then(res => {
            wx.hideLoading({
                success: (res) => {},
            })
        }).catch(err => {
            wx.hideLoading({
                success: (res) => {},
            })
            wx.showModal({
                title: '提示',
                showCancel: false,
                content: err.errMsg != '' ?
                    err.errMsg : '获取数据失败',
                success(res) {

                }
            })
        });
    },
    getEnterprise(e) {

        return new Promise((resolve, reject) => {
            let dataJson = JSON.stringify({
                openId: wx.getStorageSync('openid')
            });
            var custnameTwo = encr.jiami(dataJson, aeskey) //3段加密
            wx.request({
                url: app.globalData.YTURL + 'electric/checkByOpenid.do',
                data: encr.gwRequest(custnameTwo),
                method: 'POST',
                success(res) {
                    if (res.data.body != undefined && Object.getOwnPropertyNames(res.data.body) != 0 && res.data.head.H_STATUS == '1') {
                        var jsonData = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文
                        if (jsonData.list == undefined) {
                            reject({
                                errMsg: '暂无申请的企业信息'
                            })

                            return;
                        }
                        let list = jsonData.list;
                        if (list.length == 0) {
                            reject({
                                errMsg: '查无数据'
                            })
                            return;
                        }
                        that.setData({
                            a: []
                        })
                        let data = {};
                        list.forEach((item, index) => {
                            that.getData(item).then(res => {
                                resolve()
                                let list = that.data.a;
                                data = res;
                                data.partyName = item.partyName;
                                data.BATCHID = item.BATCHID;
                                data.PARAM = item.PARAM;
                                that.selectNotes(JSON.parse(item.PARAM).creditCode)
                                list.push(data)
                                that.setData({
                                    a: list,
                                })
                            }).catch(err => {
                                reject({
                                    errMsg: err.errMsg
                                })
                            })
                        });

                    } else {
                        reject({
                            errMsg: res.data.head.H_MSG
                        })
                    }
                },
                fail: function (res) {
                    reject({
                        errMsg: '网络异常'
                    })

                }
            })
        })

    },
    onPullDownRefresh() {
        wx.showLoading({
            title: '努力加载中',
        })
        if (wx.getStorageSync('openid') == '') {
            api.getSessionInfo().then(res => {
                if (wx.getStorageSync('openid') == '') {
                    wx.hideLoading()
                    wx.showToast({
                        title: '登录状态失效,请刷新',
                        icon: 'none',
                        duration: 3000
                    });
                    return;
                }
                that.getEnterprise().then(res => {
                    wx.stopPullDownRefresh()
                    wx.hideLoading({
                        success: (res) => {},
                    })
                }).catch(err => {
                    wx.stopPullDownRefresh()
                    wx.hideLoading({
                        success: (res) => {},
                    })
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: err.errMsg != '' ?
                            err.errMsg : '获取数据失败',
                        success(res) {

                        }
                    })
                });

            })
            return;
        }
        that.getEnterprise().then(res => {
            wx.stopPullDownRefresh()
            wx.hideLoading({
                success: (res) => {},
            })
        }).catch(err => {
            wx.stopPullDownRefresh()
            wx.hideLoading({
                success: (res) => {},
            })
            wx.showModal({
                title: '提示',
                showCancel: false,
                content: err.errMsg != '' ?
                    err.errMsg : '获取数据失败',
                success(res) {

                }
            })
        });

    },
    selectNotes(creditCode) {
        return new Promise((resolve, reject) => {
            var dataJson = JSON.stringify({
                openId: wx.getStorageSync('openid'),
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

                        console.log(jsonData)
                        if (jsonData.flag == '1') {
                            let list = jsonData.notes
                            if (list[0].state == '4') {
                                reject()
                                return;
                            }
                            resolve(list[0])
                            that.setData({
                                notes: list[0]
                            })
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
    getData(params) {
        return new Promise((resolve, reject) => {
            let dataJson = JSON.stringify(params);
            var custnameTwo = encr.jiami(dataJson, aeskey)

            wx.request({
                url: app.globalData.YTURL + 'electric/amountApplyRate.do',
                data: encr.gwRequest(custnameTwo),
                method: 'POST',
                success(res) {
                    if (res.data.body != undefined && Object.getOwnPropertyNames(res.data.body) != 0 && res.data.head.H_STATUS == '1') {

                        var jsonData = encr.aesDecrypt(res.data.body, aeskey)
                        let approvalResultTxt = ''
                        if (jsonData.RET_CODE != '0000') {
                            jsonData.approvalResultTxt = ''
                            wx.showModal({
                                title: '提示',
                                showCancel: false,
                                content: params.partyName + '--' + jsonData.RET_MSG,
                                success(res) {
                                    if (res.confirm) {

                                    }
                                }
                            })
                            resolve(jsonData)
                            return;
                        }
                        switch (jsonData.approvalResult) {
                            case '0':
                                approvalResultTxt = '审批成功'
                                break;
                            case '1':
                                approvalResultTxt = '退回修改'
                                break;
                            case '2':
                                approvalResultTxt = '订单驳回'
                                break;
                            case '3':
                                approvalResultTxt = '审批中'
                                break;
                            default:
                                approvalResultTxt = '审批成功'
                                break;
                        }
                        jsonData.approvalResultTxt = approvalResultTxt

                        resolve(jsonData)

                    } else {
                        reject({
                            errMsg: params.partyName + '--' +
                                res.data.head.H_MSG
                        })

                    }
                }
            })
        })

    },
    add(e) {
        let BATCHID = that.data.a[e.target.dataset.index].BATCHID
        wx.setStorageSync('upParam', that.data.a[e.target.dataset.index].PARAM);
        if (that.data.notes.id == undefined||that.data.notes.id == '') {
            wx.showToast({
                title: '订单查询失败，请退出重试',
                icon: 'none'
            })
            return;
        }
        wx.redirectTo({
            url: './applyExtra?batch=' + BATCHID + '&id=' + that.data.notes.id
        })
    },

})