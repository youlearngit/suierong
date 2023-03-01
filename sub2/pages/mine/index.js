const util = require('../../utils/util')
//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    this.setData({
      preffixUrl: "https://wxapp.jsbchina.cn:7080/jsb/"
    })


    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理

    }
  },
  getUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      //console.log(e.detail.userInfo)
      var res = e.detail.userInfo;
      //console.log(res.nickName)

      this.setData({
       userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      //console.log(res.nickName)
      //console.log(res)
      if ( wx.getStorageSync('openid') != null) {
        //插入登录的用户的相关信息到数据库
        var str = JSON.stringify({
          STRING_OPEN_ID: wx.getStorageSync('openid'),
          STRING_NICK_NAME: res.nickName,
          STRING_COUNTRY: res.country,
          STRING_PROVINCE: res.province,
          STRING_CITY: res.city,
          STRING_GENDER: res.gender
        });
        // var data = util.enct(str) + util.digest(str)
        wx.request({
          url: "https://wxapp.jsbchina.cn:7080/jsb/" + 'addcustomer',
          data: {
            data: str
          },
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded",// 默认值
            "key": (Date.parse(new Date())).toString().substring(0, 6),
            "sessionId": wx.getStorageSync('sessionid'),
            "transNo": "XC006"
          },
          success(res) {
            //console.log(res.data)
          }
        })
      }
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            //console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  }
})
