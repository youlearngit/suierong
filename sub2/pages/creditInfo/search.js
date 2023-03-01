// pages/creditInfo/authList.js
var app = getApp();
import wxp from "../../../utils/wxp";
const util = require("../../utils/util");
const api = require("../../../utils/api");

var encr = require('../../utils/encrypt.js'); //国密3段式加密
var myPerformance = require("../../../utils/performance.js");
var aeskey = encr.key //随机数
var that;
Page({
    /**
     * 页面的初始数据
     */
    data: {
        preffixUrl: app.globalData.JSBURL,
        businessList: [],
        businessListEND: [],
        businessListElse: [],
        businessListAlready: [],
        typeData: '',
        checked: '3',
        authTypeChecked:'1',
        business_type_arr: ["", "个人零售贷", "个人经营贷款", "对公授信"],
        business_type_arr2: ["", "借款企业", "担保企业", "关联企业"],
        business_type_arr3: ["", "经营实体", "担保企业", "关联企业"],
        yewulxtype_array: [{
                'id': '01',
                'name': '个人商用房贷款'
            }, {
                'id': '02',
                'name': '个人住房贷款'
            },
            {
                'id': '03',
                'name': '个人消费贷款'
            }, {
                'id': '05',
                'name': '其他'
            }
        ],
        page1: 1,
        page2: 1,
        page3: 1,
        hasList1: true,
        hasList2: true,
        hasList3: true,
        isLoad: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        that = this;



    },
    onShow() {
        that.setData({
            page1: 1,
            page2: 1,
            page3: 1,
            hasList1: true,
            hasList2: true,
            hasList3: true,
            businessList: [],
            businessListEND: [],
            businessListElse: [],
            businessListAlready: []
        })

        that.getBusList();
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
                                console.log(res)
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
    getBusList() {
        if (that.data.isLoad) {
            return;
        }
        wx.showLoading({
            title: '加载中',
            mask: true,
        })
        that.setData({
            isLoad: true
        })

        // if (that.data.checked == '1' && !that.data.hasList1) {
        //     wx.hideLoading({
        //         success: (res) => {},
        //     })
        //     wx.showToast({
        //         title: '暂无更多数据',
        //         icon: 'none'
        //     })
        //     that.setData({
        //         isLoad: false
        //     });
        //     return;
        // }

        // if (that.data.checked == '3' && !that.data.hasList3) {
        //     wx.hideLoading({
        //         success: (res) => {},
        //     })
        //     wx.showToast({
        //         title: '暂无更多数据',
        //         icon: 'none'
        //     })
        //     that.setData({
        //         isLoad: false
        //     });
        //     return;
        // }

        // if (that.data.checked == '2' && !that.data.hasList2) {
        //     wx.hideLoading({
        //         success: (res) => {},
        //     })
        //     wx.showToast({
        //         title: '暂无更多数据',
        //         icon: 'none'
        //     })
        //     that.setData({
        //         isLoad: false
        //     });
        //     return;
        // }
        let next_key;
        if (that.data.checked == '1') {
            next_key = that.data.page1
        } else if (that.data.checked == '3') {
            next_key = that.data.page3

        } else {
            next_key = that.data.page2
        }
        //状态 0-未授权 1-已OCR验证  3-已短信验证 4-已人脸识别 5-授权通过
        let dataJson = JSON.stringify({
            openId: wx.getStorageSync('openid'),
            limit: '20',
            page: next_key + '',
            type: that.data.checked,
            businessType:that.data.authTypeChecked, //1-个人征信授权查询、2-对公政信授权查询
        })
        console.log(dataJson)
        let custnameTwo = encr.jiami(dataJson, aeskey) //3段加密
        wx.request({
            url: app.globalData.creditUrl + 'ComGetAuthList.do',
            method: 'POST',
            header: {
                'content-type': 'application/json', // 默认值
            },
            data: encr.gwRequest(custnameTwo),
            success(res) {
                myPerformance.reportBegin(2010, 'sub2_creditInfo_search');
                if (res.data.head.H_STATUS == '1') {
                    console.log(encr.aesDecrypt(res.data.body, aeskey))
                    var data = encr.aesDecrypt(res.data.body, aeskey).entityList || [] //解密返回的报文
                    if (data.length != 20) {
                        if (that.data.checked == '1') {
                            that.setData({
                                hasList1: false
                            })
                        } else if (that.data.checked == '3') {
                            that.setData({
                                hasList3: false
                            })
                        } else {
                            that.setData({
                                hasList2: false
                            })
                        }
                    }
                    let pagesize = 1
                    if (that.data.checked == '1') {
                        pagesize = that.data.page1
                    } else if (that.data.checked == '3') {
                        pagesize = that.data.page3

                    } else {
                        pagesize = that.data.page2
                    }
                    pagesize++;
                    that.setData({
                        ['page' + that.data.checked]: pagesize
                    })
                    wx.hideLoading({
                        success: (res) => {},
                    })
                    Date.prototype.Format = function (fmt) {
                        var o = {
                            "M+": this.getMonth() + 1,
                            "d+": this.getDate(),
                            "h+": this.getHours(),
                            "m+": this.getMinutes(),
                            "s+": this.getSeconds(),
                            "q+": Math.floor((this.getMonth() + 3) / 3),
                            "S+": this.getMilliseconds(),

                        }
                        if (/(y+)/.test(fmt))
                            fmt = fmt.replace(RegExp.$1, this.getFullYear() + "");
                        for (var k in o)
                            if (new RegExp("(" + k + ")").test(fmt))
                                fmt = fmt.replace(RegExp.$1,
                                    (RegExp.$1.length == 1) ? (o[k]) :
                                    (("00" + o[k])
                                        .substr(("" + o[k]).length)));
                        return fmt;
                    }
                    //AUTH_STATUS
                    let dataAlready = []
                    let dataElse = []
                    let dataEND = []
                    data.forEach(a => {
                        a.CREATED_TIME = a.CREATED_TIME.substr(0, 11)
                        if (a.BUSINESS_TYPE == 1) {
                            if (a.BORROW_TYPE == '01') {
                                a.name = that.data.yewulxtype_array[0].name
                            } else if (a.BORROW_TYPE == '02') {
                                a.name = that.data.yewulxtype_array[1].name
                            } else if (a.BORROW_TYPE == '03') {
                                a.name = that.data.yewulxtype_array[2].name
                            } else if (a.BORROW_TYPE.indexOf('05') != -1) {
                                a.name =
                                    a.BORROW_TYPE.substr(2)
                            }
                        }
                    })


                    if (that.data.checked == '1') {
                        // type 1
                        dataAlready = that.data.businessListAlready.concat(data)
                        that.setData({
                            businessListAlready: dataAlready,

                            businessList: dataAlready,
                        })
                    } else if (that.data.checked == '3') {
                        // type 3

                        dataElse = that.data.businessListElse.concat(data)

                        that.setData({
                            businessListElse: dataElse,

                            businessList: dataElse
                        })
                    } else {
                        // type 2

                        dataEND = that.data.businessListEND.concat(data)

                        that.setData({
                            businessList: dataEND,
                            businessListEND: dataEND,

                        })
                    }

                    that.setData({

                        isLoad: false
                    });

                } else {
                    wx.hideLoading({
                        success: (res) => {},
                    })
                    that.setData({

                        isLoad: false
                    });
                    wx.showToast({
                        title: res.data.head.H_MSG,
                        icon: "none",
                        duration: 3000
                    });

                }
                myPerformance.reportEnd(2010, 'sub2_creditInfo_search');
            },
            fail(err) {
                console.error(err);
                wx.hideLoading({
                    success: (res) => {},
                })
            }
        });
    },

    radioChange(e) {
        console.log('radio发生change事件，携带value值为：', e.detail.value)
        that.setData({
            checked: e.detail.value,
        })
        that.getBusList();
       


    },
    authTypeRadioChange(e) {
      console.log('radio发生change事件，携带value值为：', e.detail.value)
      that.setData({
          authTypeChecked: e.detail.value,
          checked: '3',
          businessListEND: [],
          businessListElse: [],
          businessListAlready: [],
          page1: 1,
          page2: 1,
          page3: 1,
          hasList1: true,
          hasList2: true,
          hasList3: true,
      })
      that.getBusList()
  },

    /**
     * 查看详细信息
     */
    getDetail(e) {
        console.log(e.currentTarget.dataset.setr,'点击');
        var x = e.currentTarget.dataset.setr;
        this.setData({typeData:x});
        wx.navigateTo({
            url: "../creditInfo/busDetail?data=" + JSON.stringify(this.data.businessList[e.currentTarget.dataset.id]) +'&typeData='+this.data.typeData+ '&checked=' + that.data.checked + "&authType="+that.data.authTypeChecked,
        });
    },
});