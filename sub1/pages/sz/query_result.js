var util = require('../../../utils/util.js');
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
      list:[],
        preffixUrl: '',
        userInfo:'',
        nodata:true//查无数据
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      if (app.globalData.userInfo) {
        this.setData({
          userInfo: app.globalData.userInfo,
          hasUserInfo: true
        })
      }
      if(options.data!=""){
        var list = JSON.parse(options.data);//数据
      }
      
      if (options.nodata=="false"){
        this.setData({
          nodata:false,
        
        })
      }
        this.setData({
            list: list,
            preffixUrl: app.globalData.URL,
            navTop: app.globalData.statusBarTop,
            navHeight: app.globalData.statusBarHeight,
        })
        var pagenum = getCurrentPages()
        this.setData({
            pageFlag: pagenum.length
        })
        if (pagenum.length > 2) {
            //console.log("有返回")
        } else {
            //console.log("到主页")
        }
    },
    prePage() {
        wx.navigateBack();
    },
    indexpage: function () {
        wx.switchTab({
            url: '/pages/shop/index2',
        });
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