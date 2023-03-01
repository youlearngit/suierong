// sub3/pages/reservedAccChg/dAccount.js
var app = getApp();
var that;
import user from '../../../utils/user';

var encr = require('../../../utils/encrypt/encrypt'); //国密3段式加密
var aeskey = encr.key //随机数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    preffixUrl: app.globalData.CDNURL,
    checked: true,
    info:{},e015:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this;
    if(options.data){

      that.setData({
        info:JSON.parse(options.data)
      })
      }
      if(options.e015!="{}"){
        that.setData({
          e015:JSON.parse(options.e015)
        })
        let info = that.data.info;
        let e015 = that.data.e015;
        info.dzlxrCode=e015.dzdzyb;
        info.dzlxrAddress=e015.dzdz;
        info.dzlxrPhone=e015.dzlxdh;
        info.dzlxrName=e015.dzlxr;
        that.setData({
          info
        })
      }
  },
  submitForm(e){
    const params = e.detail.value;
    let info = that.data.info
    console.log(that.data.info);
    wx.showLoading({
      title: '提交中',
      mask: true
    })

    user
    .getCustomerInfo()
    .then(res => {

      let empNo = res.USERID ? res.USERID : "";
      let int_id = res.INT_ID ? res.INT_ID : "";
      info.intId= int_id+''
      var obj = Object.assign(info, params);
      console.log(obj)
      let dataJson = JSON.stringify(obj)
      console.log(dataJson)
      let custnameTwo = encr.jiami(dataJson, aeskey) //3段加密
      console.log(custnameTwo);
      wx.request({
        url: app.globalData.YTURL + 'judge/wxpubadd.do',
        data: encr.gwRequest(custnameTwo),
        method: 'POST',
        success(res) {
          wx.hideLoading({
            success: (res) => {},
          })
          if (res.data.head.H_STATUS != '1') {
            wx.showToast({
              title: res.data.head.H_MSG,
              icon: 'none'
            })
         
            return;
          }
          let json = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文4
          if(json.msgCode!='0000'){
            wx.showToast({
              title: json.msg,
              icon: 'none'
            })
            return;
          }
          info.yyh=json.yyh
          wx.navigateTo({
            url: './result?data='+JSON.stringify(info),
          })
      
        
        },fail(err){
        }
      })
    })
    .catch(err => {
      wx.hideLoading({
        success: (res) => {},
      })
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