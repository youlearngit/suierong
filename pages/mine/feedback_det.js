var util = require('../../utils/util.js');
const app = getApp();
// pages/mine/feedback_det.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    feed_type: '',
    opinion: '',
    feed_picture: [],
    id: '',
    reply: '',
    preffixUrl: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      preffixUrl: app.globalData.URL
    })
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 20000
    })
    //显示列表页面
    var that = this;
    wx.request({
      url: app.globalData.URL + 'messagebyid',
      //url: 'http://192.168.43.253:80/messagebyid',
      data: { id: that.options.id },
      header: {
        'content-type': 'application/json', // 默认值
        "key": (Date.parse(new Date())).toString().substring(0, 6),
        "sessionId": wx.getStorageSync('sessionid'),
        "transNo": 'XC012'
      },
      success(res) {
        let data1 = util.dect(res.data.stringData);
        var feedlist = JSON.parse(data1)
        var feed_picture = '';

        if (feedlist[0].FEED_PICTURE != null && feedlist[0].FEED_PICTURE != '') {
          var dateList = feedlist[0].FEED_PICTURE.split(",");
          var arr = []
          for (var i = 0;i < dateList.length;i++) {
            arr = arr.concat(that.data.preffixUrl+dateList[i]);
            //console.log(arr)
          }
        }
        for (var x in feedlist) {
          if (feedlist[x].feed_picture != null && cardlist[x].feed_picture != undefined) {
            for (var i = 0; i <= feedlist[x].feed_picture.length; i++) {
              if (feedlist[x].feed_picture[i] != null && feedlist[x].feed_picture[i] != undefined) {
                var feed_picture = feedlist[x].feed_picture[i]
              }
            }
          }
        }
        if (feed_picture == null) {
          var toastTest = '获取数据失败';
          wx.showToast({
            title: toastText,
            icon: '',
            duration: 2000
          })
        } else {
          that.setData({
            feedlist:feedlist,
            feed_picture: feed_picture,
            arr: arr
          });
        }
      }
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
  //点击预览图片
  ylimg: function (e) {
    //console.log(e)
    let that = this;
    let img = e.currentTarget.dataset.image;
    wx.previewImage({
      current: img,
      urls: that.data.arr
    })
  },
})