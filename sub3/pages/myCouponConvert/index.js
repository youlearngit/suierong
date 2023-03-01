// sub3/pages/myCouponConvert/index.js
var app = getApp();

var encr = require('../../../utils/encrypt/encrypt'); //国密3段式加密
var aeskey = encr.key //随机数
var that;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        preffixUrl: app.globalData.URL,
        select: 'AC2020092100000021'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        that = this;
    },
    check(e) {
        this.setData({
            select: e.currentTarget.dataset.ac
        })
    },
    convert() {
        if (wx.getStorageSync('openid') === '') {
            if (wx.getStorageSync('openid') === '') {
                wx.showToast({
                    title: '登录失效，请重新操作',
                    icon: 'none',
                    duration: 3000
                })
                return;
            }
            app
                .getSessionInfo()
                .then(res => {
                    that.toDo();
                })
        } else {
            that.toDo();
        }
    },
    toDo() {
        wx.showLoading({
            title: '兑换中',
            mask: true
        })
        that.getCustomers().then(res => {
            that.queryEcif(res.ID_CARD).then(q => {
                that.setData({
                    CUS_ID: q.ECIF_CUST_NO
                })
                that.dhCard(res).then(a => {
                    wx.hideLoading({
                        success: (res) => {},
                    })
                    wx.showToast({
                        title: '兑换优惠券成功',
                        duration: 2000
                    })
                    wx.redirectTo({
                        url: '../myCouponStatus/index',
                    })
                }).catch(err => {
                    wx.hideLoading({
                        success: (res) => {},
                    })
                    if (err.err == 1) {
                        wx.showToast({
                            title: err.FAIL_MSG,
                            icon: 'none',
                            duration: 5000
                        })
                        return;
                    }
                    wx.showToast({
                        title: '兑换优惠券失败',
                        icon: 'none'
                    })

                })
            }).catch(qr => {
                if (qr.err == 1) {
                    that.addQzkh(res).then(qzkh => {
                        wx.hideLoading({
                            success: (res) => {},
                        })
                        that.setData({
                            CUS_ID: qzkh.CUSTOMER_ID
                        })
                        that.dhCard(res).then(a => {
                            wx.hideLoading({
                                success: (res) => {},
                            })
                            wx.showToast({
                                title: '兑换优惠券成功',
                                duration: 2000
                            })
                            wx.redirectTo({
                                url: '../myCouponStatus/index',
                            })
                        }).catch(err => {
                            wx.hideLoading({
                                success: (res) => {},
                            })
                            if (err.err == 1) {
                                wx.showToast({
                                    title: err.FAIL_MSG,
                                    icon: 'none',
                                    duration: 5000
                                })
                                return;
                            }
                            wx.showToast({
                                title: '兑换优惠券失败',
                                icon: 'none'
                            })
                        })
                    }).catch(err => {
                        wx.hideLoading({
                            success: (res) => {},
                        })
                        wx.showToast({
                            title: '查询优惠券失败',
                            icon: 'none'
                        })
                    })
                } else {
                    wx.hideLoading({
                        success: (res) => {},
                    })
                }
            })

        }).catch(err => {
            wx.hideLoading({
                success: (res) => {},
            })
            if (err.err == 1) {
                wx.showModal({
                    content: '请认证手机号和身份信息',
                    showCancel: false,
                    success: function(res) {
                        if (res.confirm) {
                            wx.navigateTo({
                                url: 'sub1/pages/auth/index',
                            })
                        } else {
                            wx.navigateBack({
                                delta: 1,
                            })
                        }
                    }
                })
            }

        })
    },
    queryEcif(cert) {
        return new Promise((resolve, reject) => {
            let dataJson = JSON.stringify({
                "CERT_NO": cert
            })

            let custnameTwo = encr.jiami(dataJson, aeskey) //3段加密

            wx.request({
                url: app.globalData.YTURL + 'jsyh/queryEcif.do',
                data: encr.gwRequest(custnameTwo),
                method: 'POST',
                success(res) {
                    if (res.data.head.H_STATUS != '1') {
                        if (res.data.head.H_STATUS == '9999') {
                            reject({ err: 1 })

                        } else {
                            wx.showToast({
                                title: res.data.head.H_MSG,
                                icon: 'none'
                            })
                            reject({ err: 0 });
                        }
                        return;

                    }
                    let json = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文

                    if (json.STATUS === '1' && json.GRP_CUST_A_LIST.length != 0) {
                        let k = []
                        k = json.GRP_CUST_A_LIST.filter(res => {
                            return cert == res.CERT_NO
                        })

                        if (k.length != 0) {
                            resolve(k[0])
                        }
                        reject({ err: 1 })

                    } else {
                        reject({ err: 1 })
                    }

                }
            })
        })
    },
    addQzkh(auth) {
        return new Promise((resolve, reject) => {
            let dataJson = JSON.stringify({
                "CERT_NO": auth.ID_CARD,
                "CUST_NAME": auth.REAL_NAME,
                "TELEPHONE": auth.TEL
            })
            let custnameTwo = encr.jiami(dataJson, aeskey) //3段加密

            wx.request({
                url: app.globalData.YTURL + 'jsyh/addQzkh.do',
                data: encr.gwRequest(custnameTwo),
                method: 'POST',
                success(res) {
                    if (res.data.head.H_STATUS != '1') {
                        wx.showToast({
                            title: res.data.head.H_MSG,
                            icon: 'none'
                        })
                        reject();
                        return;
                    }
                    let json = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文

                    if (json.STATUS === '1') {
                        resolve(json)
                    } else {
                        reject()
                    }

                }
            })
        })
    },
    getCustomers() {
        return new Promise((resolve, reject) => {
            let dataJson = JSON.stringify({
                "openId": wx.getStorageSync('openid')
            })
            let custnameTwo = encr.jiami(dataJson, aeskey) //3段加密

            wx.request({
                url: app.globalData.YTURL + 'jsyh/getCustomers.do',
                data: encr.gwRequest(custnameTwo),
                method: 'POST',
                success(res) {
                    if (res.data.head.H_STATUS != '1') {
                        wx.showToast({
                            title: res.data.head.H_MSG,
                            icon: 'none'
                        })
                        reject({ err: 0 });
                        return;
                    }
                    let json = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文

                    if (json.LIST == undefined) {
                        reject({ err: 1 });
                    } else {
                        if (json.LIST[0].ID_CARD === '' || json.LIST[0].TEL === '') {
                            reject({ err: 1 });
                        } else {
                            resolve(json.LIST[0])
                        }
                    }

                }
            })
        })
    },
    dhCard(auth) {
        return new Promise((resolve, reject) => {
            let dataJson = JSON.stringify({
                "openid": wx.getStorageSync('openid'),
                "APP_CHANNEL": '8229',
                "ACTIVITY_NO": that.data.select,
                "CUS_NAME": auth.REAL_NAME,
                "CUS_ID": that.data.CUS_ID,
                "CERT_TYPE": '1',
                "CERT_CODE": auth.ID_CARD,
                "ACTIVITY_END_DATE": ''

            })
            let custnameTwo = encr.jiami(dataJson, aeskey) //3段加密

            wx.request({
                url: app.globalData.YTURL + 'jsyh/dhCard.do',
                data: encr.gwRequest(custnameTwo),
                method: 'POST',
                success(res) {

                    if (res.data.head.H_STATUS != '1') {


                        reject({ err: 1, FAIL_MSG: res.data.head.H_MSG });
                        return;

                    }
                    let json = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文

                    if (json.TRAN_STATUS === 'COMPLETE' && json.FAIL_MSG === '') {
                        resolve()
                    } else {
                        reject({ err: 1, FAIL_MSG: json.FAIL_MSG })
                    }

                }
            })
        })
    },

})