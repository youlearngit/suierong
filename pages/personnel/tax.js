const base64 = require('../../utils/base64.js')
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:'',
    distory: true,
    times:0,
    apply:'',
    uid:'',
    formId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options.proCode != undefined && options.cityCode != undefined){
      // wx.showLoading({
      //   title: '加载中...',
      // })
      wx.request({
        url: App.globalData.URL + 'tax',
        data: {
          proCode: options.proCode,
          cityCode: options.cityCode,
          id: wx.getStorageSync('openid'),
          formId: options.formId
        },
        success: res => {
          //console.log(res.data)
          //wx.hideLoading();
          if (res.data != undefined && res.data != null && res.data != '') {
            that.setData({
              url: res.data,
              apply: options.str,
              uid: options.uid,
            })
            that.timmer(options.creditCode);
          }else{
            wx.showModal({
              title: '提示',
              content: "小程序异常，请重新打开",
              showCancel: false,//是否显示取消按钮
              success: function (res) {
              },
              fail: function (res) { },//接口调用失败的回调函数
              complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
            })
          }
        }
      })
    }else{
      wx.showModal({
        title: '提示',
        content: "小程序异常，请重新打开",
        showCancel: false,//是否显示取消按钮
        success: function (res) {
        },
        fail: function (res) { },//接口调用失败的回调函数
        complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
      })
    }
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
    this.setData({
      distory:false,
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({
      distory: false
    })
  },
  timmer:function(e){
    var that = this;
    //2m秒请求一次
    setInterval(function () {
      if (that.data.distory) {
        that.setData({
          times: that.data.times+1
        })
        if (that.data.times > 200){
          wx.navigateBack({ //申请失败后返回
            delta: 1
          })
          wx.hideToast();
          wx.showModal({
            title: '提示',
            content: '页面过期，请重新进入',
            showCancel: false,//是否显示取消按钮
            success: function (res) {

            },
            fail: function (res) { },//接口调用失败的回调函数
            complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
          })
        }
        if (that.data.times > 5){
          wx.request({
            url: App.globalData.URL + 'gettaxresult',
            data: {
              data: e,
              openid: wx.getStorageSync("openid"),
            },
            success: res => {             
              if (res.data.code != 0) { //没有记录到数据库
                if (res.data.code == 1) {//成功
                  wx.navigateTo({
                    url: 'apli?apply=' + that.data.apply + '&uid=' + that.data.uid +'&formId='+that.data.formId
                  })
                } else {//
                  wx.showModal({
                    title: '提示',
                    content: res.data.msg,
                    showCancel: false,//是否显示取消按钮
                    success: function (res) {
                    },
                    fail: function (res) { },//接口调用失败的回调函数
                    complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
                  })
                  wx.navigateBack({})
                }
              }
            }
          })
        }
      }
    }, 1000);
  }
})