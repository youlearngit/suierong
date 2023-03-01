var app = getApp();
var that
const util = require("../../utils/util");
var encr = require('../../utils/encrypt.js'); //国密3段式加密
var aeskey = encr.key //随机数
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        current: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        that = this;
        that.setData({
            preffixUrl: app.globalData.URL,
            navTop: app.globalData.statusBarTop + 10,
            navHeight: app.globalData.statusBarHeight,
            navTxtHeight: app.globalData.statusBarTop + app.globalData.statusBarHeight + 10
        });
        that.getData();
        that.initFont();
    },
    initFont() {

        wx.loadFontFace({
            family: 'FZFYSJW--GB1-0',
            source: 'url(' + app.globalData.URL + 'static/wechat/img/zm/FZFYSJW--GB1-0.ttf' + ')',
            success: (res) => {
                //console.log(res)
            },
            fail: (err) => {
                //console.log(err)
            }
        })

        wx.loadFontFace({
            family: 'YouSheBiaoTiHei',
            source: 'url(' + app.globalData.URL + 'static/wechat/img/zm/YouSheBiaoTiHei.ttf' + ')',
            success: (res) => { //console.log(res.status) 
            },
            fail: (err) => {
                //console.log(err.status)
            },
            complete: (res) => {
                //console.log(res)
            }
        })
    },
    back() {
        wx.navigateBack({
            delta: 1,
        })
    },
    cardSwiper(e) {
        that.setData({
            current: e.detail.current
        })
    },
    todo(e) {
        wx.navigateTo({
            url: '/sub2/pages/tenderInfo/index?productNo=' + e.currentTarget.dataset.po,
        })
    },
    getData() {
        let dataJson = JSON.stringify({});
        var custnameTwo = encr.jiami(dataJson, aeskey) //3段加密

        wx.request({
            url: app.globalData.YTURL + 'product/select.do',
            data: encr.gwRequest(custnameTwo),
            method: 'POST',
            success(res) {
                //console.log(res)

                var jsonData = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文
                //console.log('解密select返回的报文==11')
                //console.log(jsonData)
                let list = jsonData.LIST;
                list.forEach(a => {
                    a.endTime = a.endTime.substr(0, 10)
                })
                that.setData({
                    list: list
                })
            },
            complete(res) {
                //console.log('select')

                //console.log(res)

            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})