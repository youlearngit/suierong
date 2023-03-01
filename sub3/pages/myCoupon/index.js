// sub3/pages/myCoupon/index.js
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
        couponList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        that = this;
        wx.showLoading({
            title: '加载数据中',

        })
        if (wx.getStorageSync('openid') === '') {
            app
                .getSessionInfo()
                .then(res => {
                    that.getData().then(res => {
                        wx.hideLoading({
                            success: (res) => {},
                        })
                    }).catch(err => {
                        wx.hideLoading({
                            success: (res) => {},
                        })
                    })
                })
        } else {
            that.getData().then(res => {
                //console.log("cc",res)
                that.queryEcif(res.ID_CARD).then(q => {
                    that.setData({
                        CUS_ID: q.ECIF_CUST_NO
                    })
                    that.queryCard().then(data => {
                        wx.hideLoading({
                            success: (res) => {},
                        })
                        that.setData({ couponList: data })
                    }).catch(err => {
                        wx.hideLoading({
                            success: (res) => {},
                        })
                    })
                }).catch(qr => {
                    wx.hideLoading({
                        success: (res) => {},
                    })
                    if (qr.err == 1) {
                        that.addQzkh(res).then(qzkh => {
                            that.setData({
                                CUS_ID: qzkh.CUSTOMER_ID,
                                couponList: []
                            })
                            wx.showToast({
                                title: 'ECIF号已创建，请于明天查询',
                                icon: 'none',
                                duration: 3000
                            })
                        }).catch(err => {

                            wx.showToast({
                                title: '查询优惠券失败',
                                icon: 'none'
                            })
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
                                wx.redirectTo({
                                    url: '/sub1/pages/auth/index',
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
        }
    },

    click(e) {
        let index = e.currentTarget.dataset.index;

        wx.navigateTo({
            url: '../myCouponInfo/index?data=' + JSON.stringify(that.data.couponList[index])
        });
    },
    getData() {
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
                        resolve(json.GRP_CUST_A_LIST[0])
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
    queryCard() {
        return new Promise((resolve, reject) => {
            let dataJson = JSON.stringify({
                "CUS_ID": that.data.CUS_ID,
                "STATUS":"00"
            })
            let custnameTwo = encr.jiami(dataJson, aeskey) //3段加密

            wx.request({
                url: app.globalData.YTURL + 'jsyh/queryCard.do',
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
                        if (json.entNamesList1 == undefined) {

                            reject()
                            return;
                        }
                        let datas = json.entNamesList1;
                        datas.forEach((item, index) => {
                            // "COUPON_TYPPE" desc="优惠券类型:1、抵扣券2、折扣券3、固定优惠券4、免息券
                            //  STATUS优惠券状态: 00、 未使用10、 已使用20、 已失效AAA、 所有
                            item.COUPON_TYPPE_txt = '抵扣券'
                            switch (item.COUPON_TYPPE) {
                                case '1':
                                    item.COUPON_TYPPE_txt = '抵扣券'
                                    break;
                                case '2':
                                    item.COUPON_TYPPE_txt = '折扣券'
                                    break;
                                case '3':
                                    item.COUPON_TYPPE_txt = '固定优惠券'
                                    break;
                                case '4':
                                    item.COUPON_TYPPE_txt = '免息券'
                                    break;
                                default:
                                    item.COUPON_TYPPE_txt = '抵扣券'
                                    break;
                            }
                            item.STATUS_txt = '未使用'
                            switch (item.STATUS) {
                                case '00':
                                    item.STATUS_txt = '未使用'
                                    break;
                                case '10':
                                    item.STATUS_txt = '已使用'
                                    break;
                                case '20':
                                    item.STATUS_txt = '已失效'
                                    break;
                                default:
                                    item.STATUS_txt = '未使用'
                                    break;
                            }
                        })
                        resolve(datas)
                    } else {
                        reject()
                    }

                }
            })
        })
    },

})