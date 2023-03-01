// pages/dian/submit_suc.js
const app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    preffixUrl: '',
    orderID:"",
    orgId:'',
    date: '',
    amount: '',
    term: '',
    nianlvli:'',

    idcard: '',//身份证号码
    phone1: '',
    no: '',
    nick_name: '',
    real_name: '',
    tel: '',
    //money:"",
    //times:"",
    //date:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    function setMoney(num) {
      var reg = /\d{1,3}(?=(\d{3})+$)/g;
      return (num + '').replace(reg, '$&,');  
    }
    
    var jine = options.amount * 10000;

    this.setData({
      preffixUrl: app.globalData.URL,
      date:options.date,
      amount: setMoney(jine),
      term: options.term,
      nianlvli: options.nianlvli
      //orgId: options.orgId
    })
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 20000
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
    wx.hideToast();
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },


  indexpage: function () {
    wx.switchTab({
      url: "/pages/shop/index2"
    })
  },
  toDetail: function(){
    wx.navigateTo({
      url: '/pages/mine/mine_applicate?orderNo=' + this.data.orderID,
    })
  },
  copyText: function (e) {
    //console.log(e)
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },
})