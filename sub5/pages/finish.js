// sub4/pages/finish.js
const App = getApp();
import {
    maoeronSubmit,
    getQyName,
    getGsxx,
    selApplyResult ,
    submitTowd
} from '../../api/mer'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        start:1,
        money:5000000,
        preffixUrl:'',
        openId: '', // 每一个用户的独有id
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this
        this.setData({
            preffixUrl: App.globalData.CDNURL,
            openId:  wx.getStorageSync('openid'),
        })
        const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
        this.setData({
          navHeight: App.globalData.StatusBar + 44,
          menutop: menuButtonInfo.top + (menuButtonInfo.height / 2) - 10, //胶囊按钮与顶部的距离
        })
        // if (options.type && options.type == 1) {
           
        //         that.getsubmitTowd()
        // } else {
            this.getselApplyResult()
        // }
    },
    getHome() {
        wx.reLaunch({
          url: '/pages/shop/index2',
        })
    },
    getsubmitTowd(){
        let data = {
            openId :this.data.openId
        }
        submitTowd(data).then(res =>{
            if (res.resultCode == '0000') {
                this.setData({
                    start:1
                })
            } else {
                wx.showToast({
                    title: res.resultMsg,
                    icon: "none",
                    mask: true,
                    duration: 5000,
                });
               
              
            }
        }).catch(err => {

            this.setData({
                start:0
            })
            wx.showToast({
                title: err,
                icon: "none",
                mask: true,
                duration: 5000,
            });
        })
    },
    getselApplyResult() {
        let data = {
            openId :this.data.openId
        }
        selApplyResult(data).then(res => {
            if (res.msgCode == '0000') {
                this.setData({
                    start:2
                })
            } else if (res.msgCode == '3333') {
                this.setData({
                    start:3
                })
            } else {
                this.setData({
                    start:1
                })
            }
        }).catch(err => {

            this.setData({
                start:1
            })
           
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})