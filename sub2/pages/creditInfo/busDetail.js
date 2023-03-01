import http from "../../utils/requsetP.js";
import wxp from "../../../utils/wxp";
const util = require("../../utils/util");
var app = getApp();
var encr = require('../../utils/encrypt.js'); //国密3段式加密
var aeskey = encr.key //随机数
var that;
// const { $Toast } = require("../../dist/base/index");
Page({
    data: {
        typeData: '',
        authType: '',// 1.个人征信授权 、 2.对公政信授权
        business_type: 0, //业务类型
        is_same_person: 0, //授权人与借款人是否同一人
        is_have_guarantor: 0, //是否有担保人,
        business_id: "", //当前业务ID
        busData: {},
        authData: [],
        preffixUrl: app.globalData.JSBURL,
        borrow_cert_type_array: [
            "身份证",
            "户口薄",
            " 护照",
            "军官证 ",
            "士兵证 ",
            "港澳居民来往内地通行证 ",
            "台湾同胞来往内地通行证  ",
            " 临时身份证",
            " 外国人居留证",
            " 警官证",
            "香港身份证 ",
            "澳门身份证 ",
            "台湾身份证",
            " 其他证件",
        ],
        // auth_enterprise_type_array: [
        //     '借款企业法定代表人',
        //     '高管 / 自然人股东',
        //     '实际控制人',
        //     '个人连带责任保证人/抵押人/质押人',
        //     '高管配偶/自然人股东配偶/实际控制人配偶',
        //     '担保企业法定代表人/高管/自然人股东/实际控制人',
        //     '担保企业法定代表人配偶/高管配偶/自然人股东配偶/实际控制人配偶',
        // ],
        // auth_type_array: ["本人", "借款人配偶", "担保人", "担保人配偶", "共有人", "共有人配偶"],
        // auth_type_array2: [
        //     '借款人',
        //     '借款人配偶',
        //     '担保人',
        //     '担保人配偶(不承担担保责任)',
        //     '实体企业法定代表人、高管、股东', //校验借款人企业
        //     '实体企业其他相关人员及配偶'
        // ],
        auth_type_array: [
            '借款人',
            '借款人配偶（不提供担保）',
            '担保人',
        ],
        auth_type_array2: [
            '借款人',
            '担保人',
            '实体企业法定代表人、高管、股东',
            '授信业务其他相关自然人',
        ],
        auth_enterprise_type_array: [
            '借款企业法定代表人（不提供担保）',
            '高管/自然人股东（不提供担保）',
            '实际控制人（不提供担保）' ,
           '个人连带责任保证人/抵押人/质押人',
            '授信业务其他相关自然人',
        ],
        busStatus: ["未授权 ", "已OCR验证", "已银行卡验证", "已短信验证", "已人脸识别", "授权通过"],
        show: '1'
    },

    onLoad(e) {

        that = this;
        that.setData({typeData : e.typeData});
        if (wx.getStorageSync('openid') === '') {
            app
                .getSessionInfo()
                .then(res => {})
        }

        var data = JSON.parse(e.data);
        this.setData({
            busData: data,
            business_type: data.BUSINESS_TYPE,
            business_id: data.ID,
            checked: e.checked,
            authType: e.authType
        });
        // data.BUSINESS_TYPE == '3' &&
        that.setData({
            show: e.checked
        })

        wx.showLoading({
            title: "加载中",
            mask: true,
        })
        this.getAuthList(data.ID);

    },
    toChange() {
        wx.showModal({
            title: '提示',
            content: '确认将该记录失效处理吗',
            success(res) {
                if (res.confirm) {
                    var dataJsons = JSON.stringify({
                        data: JSON.stringify({
                            id: that.data.business_id,
                            is_push: '1'
                        })
                    })
                    var custnameTwos = encr.jiami(dataJsons, aeskey) //3段加密
                    wx.request({
                        url: app.globalData.creditUrl + 'updataPerson.do',
                        data: encr.gwRequest(custnameTwos),
                        method: 'POST',
                        header: {
                            'content-type': 'application/json', // 默认值
                        },
                        success(res) {
                            if (res.data.head.H_STATUS === "1") {

                                wx.showModal({
                                    title: '提示',
                                    content: '失效处理成功',
                                    showCancel: false,
                                    success(res) {
                                        if (res.confirm) {
                                            wx.navigateBack({
                                                delta: 1,
                                            })
                                        }
                                    }
                                })
                            }
                        }
                    })
                }
            }
        })
    },
    //生成二维码
    getQRCode() {
        var reqData = {
          bizId: that.data.authData[0].BUSINESS_ID,
          page: "sub2/pages/authConfirm/index"
        }
        if( that.data.authType == '2' || that.data.authType == '3' ){
          reqData.type = 1;
        }
        var dataJson = JSON.stringify(reqData);
        var custnameTwo = encr.jiami(dataJson, aeskey)
        wx.request({
            url: app.globalData.creditUrl + 'createERcode.do',
            data: encr.gwRequest(custnameTwo),
            method: 'POST',
            header: {
                'content-type': 'application/json',
            },
            success(res) {
                if (res.data.head.H_STATUS === "1") {
                  
                    let jsonData = encr.aesDecrypt(res.data.body, aeskey)

                    wx.showToast({
                        title: "获取成功",
                        duration: 5000
                    });
                    that.getAuthList(that.data.business_id);
                } else {
                    wx.showToast({
                        title: "授权二维码申请失败",
                        icon: "none"
                    });
                }
            }
        })

    },
    del() {
        if (that.data.business_type == 2) {
            that.toChange()
            return;
        }
        wx.showModal({
            title: '提示',
            content: '确认删除该记录吗',
            success(res) {
                if (res.confirm) {
                    wx.showLoading({
                            title: '正在删除',
                            mask: true
                        })
                        // deleteBusiness
                    var dataJson = JSON.stringify({
                        "id": that.data.business_id
                    })
                    var custnameTwo = encr.jiami(dataJson, aeskey) //3段加密

                    wx.request({
                        url: app.globalData.YTURL + 'jsyh/delAuth.do',
                        method: 'POST',
                        header: {
                            'content-type': 'application/json', // 默认值
                        },
                        data: encr.gwRequest(custnameTwo),
                        success(res) {
                            if (res.data.head.H_STATUS == '1') {

                                wx.hideLoading({
                                    success: (res) => {},
                                })
                                wx.showModal({
                                    title: '提示',
                                    content: '删除成功',
                                    showCancel: false,
                                    success(res) {
                                        if (res.confirm) {
                                            wx.navigateBack({
                                                delta: 1,
                                            })
                                        }
                                    }
                                })
                            } else {
                                wx.hideLoading({
                                    success: (res) => {},
                                })
                                wx.showToast({
                                    title: res.data.head.H_MSG,
                                    icon: 'none'
                                })
                            }
                        },
                        fail(err) {
                            wx.hideLoading({
                                success: (res) => {},
                            })
                        }
                    });
                } else if (res.cancel) {}
            }
        })

    },
    /**
     * 获取授权人列表
     * @param {*} business_id
     */
    getAuthList(business_id) {

        var dataJson = JSON.stringify({
            id: business_id,
            type: that.data.authType !=1  ? 1 : ''
        })
        var custnameTwo = encr.jiami(dataJson, aeskey) //3段加密

        wx.request({
            url: app.globalData.creditUrl + 'findAuthInfoById.do',
            method: 'POST',
            header: {
                'content-type': 'application/json', // 默认值
            },
            data: encr.gwRequest(custnameTwo),
            success(res) {
                if (res.data.head.H_STATUS == '1') {
                    var jsonData = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文
                    

                    that.setData({
                        authData: jsonData.LIST,
                    });
                    wx.hideLoading({
                        success: (res) => {},
                    })
                } else {
                    wx.hideLoading({
                        success: (res) => {},
                    })
                }
            },
            fail(err) {
                console.error(err);
                wx.hideLoading({
                    success: (res) => {},
                })
            }
        });
    },

    getCode(e) {
        if (e.currentTarget.dataset.push == '1') {
            wx.showToast({
                title: '该授权人已删除',
                icon: 'none'
            })
            return;
        }
        let authID = e.currentTarget.dataset.authid;
        let avatarurl = e.currentTarget.dataset.avatarurl;
        let createtime = e.currentTarget.dataset.createtime;
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let timeNow = year.toString() + month.toString() + day.toString();
        let interval = timeNow - createtime;
        if (avatarurl == "") {
            wx.showModal({
                title: "提示",
                content: "暂未生成二维码，请重新生成",
                confirmText: "去生成",
                success(res) {
                    if (res.confirm) {
                        that.getQRCode()

                    }
                    if (res.cancel) {}
                },
            });

            return;
        }
        if (interval > 90) {
            wx.showModal({
                title: "提示",
                content: "授权码已过期",
                showCancel: false,
                success(res) {
                    if (res.confirm) {}
                    if (res.cancel) {}
                },
            });
            return;
        }
        let business_type = this.data.business_type;

        let authName = e.currentTarget.dataset.authname;
        if(that.data.typeData == '1' && that.data.authType == '1'){
            wx.navigateTo({
                url: "../creditInfo/getQRCode?avatarurl=" +
                    avatarurl +
                    "&authName=" +
                    authName +
                    "&authID=" +
                    authID +
                    "&business_type=" +
                    business_type +
                    authID +
                    "&business_type=" +
                    business_type +
                    "&borrwo_name=" +
                    this.data.busData.BORROW_NAME 
            });
     
        }else{
            wx.navigateTo({
                url: "../creditInfo/getQRCode2?avatarurl=" + avatarurl +
                    "&authName=" + authName + //授权人姓名 
                    "&authID=" + authID +
                    "&business_type=" + business_type + authID +
                    "&business_type=" + business_type +
                    "&borrwo_name=" + this.data.busData.BORROW_NAME + //个人经营贷借款人姓名
                    "&business_name=" + this.data.busData.ENTERPRISE_NAME + //企业名称
                    "&auth_enterprise_type=" + this.data.auth_enterprise_type_array[this.data.authData[0].AUTH_ENTERPRISE_TYPE] + //授权主体类型
                    "&auth_type=" + this.data.auth_type_array2[this.data.authData[0].AUTH_TYPE]+ //授权人类型
                    "&auth_enter_name=" + this.data.authData[0].AUTH_ENTER_NAME + //授权公司名称
                    "&type=" + that.data.authType,//区分1.个人、2.对公、3.个人对公
            });
        }
    },
});