// pages/creditInfo/index.js
import requestP from "../../utils/requsetP";
import util from "../../utils/util";
var encr = require('../../utils/encrypt.js'); //国密3段式加密
var myPerformance = require("../../../utils/performance.js");
var aeskey = encr.key //随机数
var app = getApp();
var that;
Page({
    data: {
        preffixUrl: "",
    },

    onLoad: function() {
       
        that = this;
        myPerformance.reportBegin(2011,'sub2_creditInfo_index');
        this.setData({
            preffixUrl: app.globalData.JSBURL,
        });
        myPerformance.reportEnd(2011,'sub2_creditInfo_index');
        if (wx.getStorageSync('openid') === '') {
            app
                .getSessionInfo()
                .then(res => {

                })
        }


    },

    findGoingApply() {
        var that = this;

        var dataJson = JSON.stringify({
            openid: wx.getStorageSync("openid"),
            status: "1"
        })
        var custnameTwo = encr.jiami(dataJson, aeskey)
        wx.request({
            url: app.globalData.creditUrl + 'getBizVo.do',
            data: encr.gwRequest(custnameTwo),
            method: 'POST',
            header: {
                'content-type': 'application/json',
            },
            success(res) {
                if (res.data.head.H_STATUS === "1") {
                    var jsonData = encr.aesDecrypt(res.data.body, aeskey)
                    return jsonData;
                }
            }
        })

    },

    //跳转到查询列表
    apply() {
        var that = this;
        wx.navigateTo({
            url: "../creditInfo/opt",
        });

    },
});