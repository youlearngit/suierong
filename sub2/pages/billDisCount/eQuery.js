// sub2/pages/billDisCount/eQuery.js
const app = getApp();
var encr = require('../../utils/encrypt.js'); //国密3段式加密
const api = require("../../../utils/api");
const util = require("../../utils/util");

var aeskey = encr.key //随机数
var that;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        a: {},
        preffixUrl: app.globalData.URL
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        that = this;
        console.log('openid' + wx.getStorageSync('openid'))
        wx.showLoading({
            title: '加载中',
        })
        that.getEnterprise();

    },
    getCompanyInfo() {
        return new Promise((resolve, reject) => {
            wx.request({
                url: app.globalData.URL + "getuseCard",
                data: {
                    userId: wx.getStorageSync("openid"),
                },
                header: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    key: Date.parse(new Date()).toString().substring(0, 6),
                    sessionId: wx.getStorageSync("sessionid"),
                    transNo: "XC008",
                },
                method: "POST",
                success(res) {
                    console.log(res)
                    var cardlist = res.data.stringData;
                    var cardlist1 = JSON.parse(util.dect(cardlist));
                    resolve(cardlist1)
                },
                fail: function(res) {
                    reject()
                }
            })
        })
    },

    getEnterprise() {
        that.getCompanyInfo().then((cardlist1) => {
            if (cardlist1.length == 0) {
                wx.hideLoading({
                    success: (res) => {},
                })
                wx.showModal({
                    title: '提示',
                    showCancel: false,
                    content: '暂无关联企业数据',
                    success(res) {
                        if (res.confirm) {
                            wx.navigateBack({
                                delta: 1,
                            })
                        }
                    }
                })
                return;
            }
            let orgList = []
            let partyList = []
            cardlist1.forEach((item, index) => {
                orgList.push(item.ORG_CODE)
                partyList.push(item.ORG_NAME)
            })
            let dataJson = JSON.stringify({
                orgCode: orgList,
                partyName: partyList
            });
            var custnameTwo = encr.jiami(dataJson, aeskey) //3段加密
            wx.request({
                url: app.globalData.YTURL + 'electric/checkOrder.do',
                data: encr.gwRequest(custnameTwo),
                method: 'POST',
                success(res) {
                    if (res.data.body != undefined && Object.getOwnPropertyNames(res.data.body) != 0 && res.data.head.H_STATUS == '1') {
                        var jsonData = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文
                        if (jsonData.list == undefined) {
                            wx.hideLoading({
                                success: (res) => {},
                            })
                            wx.showModal({
                                title: '提示',
                                showCancel: false,
                                content: '暂无申请的企业信息',
                                success(res) {
                                    if (res.confirm) {
                                        wx.navigateBack({
                                            delta: 1,
                                        })
                                    }
                                }
                            })
                            return;
                        }
                        let list = jsonData.list;
                        if (list.length == 0) {
                            wx.hideLoading({
                                success: (res) => {},
                            })
                            wx.showModal({
                                title: '提示',
                                showCancel: false,
                                content: '暂无数据',
                                success(res) {
                                    if (res.confirm) {
                                        wx.navigateBack({
                                            delta: 1,
                                        })
                                    }
                                }
                            })
                            return;
                        }
                        that.setData({
                            a: []
                        })
                        let yy = [];
                        list.forEach((item, index) => {
                            let kk = item;
                            if (yy.indexOf(item.creditCode) != -1) {
                                return;
                            }
                            yy.push(item.creditCode)
                            kk.orgCode = item.creditCode;
                            that.getData(kk).then(res => {
                                let ll = that.data.a;
                                let data = res;
                                data.partyName = item.partyName;
                                ll.push(data)
                                that.setData({
                                    a: ll
                                })
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
                                    content: err.errMsg,
                                    success(res) {
                                        if (res.confirm) {
                                            wx.navigateBack({
                                                delta: 1,
                                            })
                                        }
                                    }
                                })
                            })
                        });

                    } else {
                        wx.hideLoading({
                            success: (res) => {},
                        })
                        wx.showModal({
                            title: '提示',
                            showCancel: false,
                            content: res.data.head.H_MSG,
                            success(res) {
                                if (res.confirm) {
                                    wx.navigateBack({
                                        delta: 1,
                                    })
                                }
                            }
                        })
                    }
                },
                fail: function(res) {
                    wx.hideLoading({
                        success: (res) => {},
                    })
                    wx.showToast({
                        title: '网络异常',
                        icon: 'none',
                        mask: true,
                        duration: 3000,
                    });
                }
            })
        }).catch(err => {
            wx.hideLoading({
                success: (res) => {},
            })
            wx.showToast({
                title: '网络异常',
                icon: 'none',
                mask: true,
                duration: 5000,
            });
        })
    },
    getData(params) {
        return new Promise((resolve, reject) => {
            let dataJson = JSON.stringify(params);
            var custname = encr.jiami(dataJson, aeskey) //3段加密

            wx.request({
                url: app.globalData.YTURL + 'electric/ticket.do',
                data: encr.gwRequest(custname),
                method: 'POST',
                header: {
                    'content-type': 'application/json', // 默认值
                },
                success: function(res) {

                    if (res.data.body != undefined && Object.getOwnPropertyNames(res.data.body) != 0 && res.data.head.H_STATUS == '1') {
                        var jsonData = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文

                        if (jsonData.maturityDate != '') {
                            jsonData.maturityDate = jsonData.maturityDate.substring(0, 10)
                        }
                        resolve(jsonData)


                    } else {
                        reject({ errMsg: res.data.head.H_MSG })

                    }

                }

            })
        })

    }
})