// sub2/pages/mine/result.js
const app = getApp();
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
status:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      preffixUrl: app.globalData.URL,
      status:options.status,
      yyh:options.yyh,
      time:options.time
    })  
   
  },
  back(){
    wx.redirectTo({
      url: './list',
    })
  
  },


})