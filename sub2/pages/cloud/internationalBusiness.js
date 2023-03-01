// pages/cloud/index.js
const util = require("../../utils/util");
const { $Toast } = require("../../dist/base/index");
var app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        preffixUrl: "",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
        this.setData({
            preffixUrl: app.globalData.JSBURL,
        });
    },

    onShareAppMessage: (res) => {
        return {
            title: "",
            path: "/sub2/pages/cloud/internationalBusiness",
            imageUrl: "",
        };
    },
});
