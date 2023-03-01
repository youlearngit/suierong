// pages/creditInfo/authList.js
import http from "../../utils/requsetP.js";
import requestP from "../../../utils/requsetP";
var that;
const util = require("../../../utils/util");
var app = getApp();
const {
    $Toast
} = require("../../dist/base/index");
var encr = require('../../utils/encrypt.js'); //国密3段式加密
var aeskey = encr.key //随机数
var myPerformance = require("../../../utils/performance.js");
Page({
    /**
     * 页面的初始数据
     */
    data: {
        isSubmit: false,
        //, "担保人配偶", "共有人", "共有人配偶"
        // auth_enterprise_type_array: [
        //     '借款企业法定代表人',
        //     '高管 / 自然人股东',
        //     '实际控制人',
        //     '个人连带责任保证人/抵押人/质押人',
        //     '高管配偶/自然人股东配偶/实际控制人配偶',
        //     '担保企业法定代表人/高管/自然人股东/实际控制人',
        //     '担保企业法定代表人配偶/高管配偶/自然人股东配偶/实际控制人配偶',
        // ],
        // auth_type_array: ["本人", "借款人配偶", "担保人"],
        // auth_type_array2: [
        //     '借款人',
        //     '借款人配偶',
        //     '担保人',
        //     '担保人配偶(不承担担保责任)',
        //     '实体企业法定代表人、高管、股东',
        //     '实体企业其他相关人员及配偶'
        // ],
        //20210602修改
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
        auth_cert_type_array: [
            "身份证",
            // "户口薄",
            // "护照",
            // "军官证",
            // "士兵证",
            // "港澳居民来往内地通行证",
            // "台湾同胞来往内地通行证",
            // "临时身份证",
            // "外国人居留证",
            // "警官证",
            // "香港身份证",
            // "澳门身份证",
            // "台湾身份证",
            // "其他证件",
        ],
        type: 0, //区分对公、对个人值为'0'，对公值为 '1'
        business_type: 0, //业务类型 表现显示
        business_id: "", //业务id
        authData: [], //授权人信息，
        borrowData: {}, //借款人信息
        preffixUrl: app.globalData.JSBURL,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(e) {
        $Toast({
            content: "加载中",
            type: "loading",
        });
        that = this;
        if (wx.getStorageSync('openid') === '') {
            app
                .getSessionInfo()
                .then(res => {

                })
        }
        myPerformance.reportBegin(2016,'sub2_creditInfo_authList');
        that.setData({
            type : e.type ?  parseInt(e.type) : 0,
            business_type: e.business_type,
            business_id: e.business_id,
            credit_code: e.credit_code,
        });
        myPerformance.reportEnd(2016,'sub2_creditInfo_authList');
        //页面加载授权人信息
        this.getAuthList(e.business_id);
        this.getBorrowInfo(e.business_id);
    },

    //添加授权人
    addAuth() {
        wx.navigateTo({
            url: "../creditInfo/auth?business_type=" + that.data.business_type + "&page=1&business_id=" + that.data.business_id + '&credit_code=' + that.data.credit_code, //page 判断是1添加  还是查看详情
        });
    },

    //跳转到详情/修改页面
    getDetail(e) {
        if(that.data.type==0){
          wx.navigateTo({//跳转个人
              url: "../creditInfo/auth?business_type=" +
                  that.data.business_type +
                  "&page=0&data=" +
                  JSON.stringify(that.data.authData[e.currentTarget.id]) +
                  "&business_id=" +
                  that.data.business_id +
                  '&credit_code=' + that.data.credit_code,
          });
        }else if(that.data.type==1){//跳转对公
          wx.navigateTo({
            url: "../creditInfo/companyAuth?business_type=" +
                that.data.business_type +
                "&page=0&data=" +
                JSON.stringify(that.data.authData[e.currentTarget.id]) +
                "&business_id=" +
                that.data.business_id +
                '&credit_code=' + that.data.credit_code,
          });
        }else if(that.data.type==2){//跳转个人对公
            wx.navigateTo({
              url: "../creditInfo/smallCompanyAuth?business_type=" +
                  that.data.business_type +
                  "&page=0&data=" +
                  JSON.stringify(that.data.authData[e.currentTarget.id]) +
                  "&business_id=" +
                  that.data.business_id +
                  '&credit_code=' + that.data.credit_code,
            });
        }
        
    },

    //信息填写完成，生成二维码
    navTo() {
        var that = this
        if (that.data.authData.length === 0) {
            $Toast({
                content: "请添加授权人",
                type: "warning",
            });

        } else {
            if (that.data.business_type == 2 && !that.data.isSubmit && (that.data.type ==0 )) {
                $Toast({
                    content: "请添加有效的授权人",
                    type: "warning",
                });
                return;
            }
            that.getQRCode();

        }
    },

    getBorrowInfo(id) {

        var dataJsons = JSON.stringify({
            id: id,
        })
        var custnameTwos = encr.jiami(dataJsons, aeskey) //3段加密
        wx.request({
            url: app.globalData.creditUrl + 'getBizVoById.do',
            data: encr.gwRequest(custnameTwos),
            method: 'POST',
            success: (res => {
                if (res.data.head.H_STATUS === "1") {
                    let jsonData = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文
                    var data2 = jsonData.LIST;

                    that.setData({
                        borrowData: data2[0],
                    });


                } else {
                    wx.showToast({
                        title: '请检查网络',
                        icon: 'none'
                    })
                }
            })
        })
    },

    //获取授权人信息
    getAuthList(business_id) {
        var dataJsons = JSON.stringify({
            bizId: business_id,
            type: that.data.type == '1' || that.data.type == '2' ? 1 : 0
        })
        var custnameTwos = encr.jiami(dataJsons, aeskey) //3段加密
        wx.request({
            url: app.globalData.creditUrl + 'getAuthList.do',
            data: encr.gwRequest(custnameTwos),
            method: 'POST',
            success: (res => {
                $Toast.hide();

                if (res.data.head.H_STATUS === "1") {
                    let jsonData = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文
                    var data = jsonData.LIST==undefined?[]:jsonData.LIST;
                    that.setData({
                        authData: data,
                    });
                    let isSubmit = false
                    data.forEach((item, index) => {
                        if (item.IS_PUSH == '0') {
                            isSubmit = true
                        }
                    });
                    that.setData({
                        isSubmit: isSubmit
                    })
                } else {
                    $Toast({
                        content: '请检查网络',
                        type: 'warning',
                        duration: 1,
                    });
                }

            })
        })
    },

    //生成二维码
    getQRCode() {
        $Toast({
            content: "保存中",
            type: "loading",
            mask: true,
        });

        var dataJson = JSON.stringify({
            bizId: that.data.business_id,
            page: "sub2/pages/authConfirm/index"
        })
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
                    $Toast.hide();
                    var jsonData = encr.aesDecrypt(res.data.body, aeskey)
                    wx.showToast({
                        title: "授权申请成功",
                        icon: "success",
                        duration: 1000,
                        success: res => {
                            setTimeout(function() {
                                wx.reLaunch({
                                    url: "../creditInfo/index",
                                });
                            }, 1000); //延迟时间
                        },
                    });
                } else {
                    $Toast.hide();
                    wx.showToast({
                        title: "授权二维码申请失败",
                        icon: "none"
                    });
                }
            }
        })

    },
});