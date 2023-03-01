// pages/mine/det.js
const util = require('../../utils/util.js');
const app = getApp();
var encr = require('../../utils/encrypt.js'); //国密3段式加密
var aeskey = encr.key //随机数
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: '',
    line_id: '',
    bank_adderss: '',
    bank_name: '',
    book_date: '',
    line_number: '',
    line_id: '',
    longitude: '',
    latitude: '',
    longitude1: '', //当前位置
    latitude1: '', //当前位置
    distance: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    this.setData({
      preffixUrl: "https://wxapp.jsbchina.cn:7080/jsb/",
      param: JSON.parse(options.param),
      index: options.index,
      api: JSON.parse(options.param)[options.index]
    })
    this.setData({
      line_id: this.options.id
    })
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    this.location();
 
  },
  location: function () {
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: res => {
        wx.hideLoading();
        //console.log('local:' + res.latitude + '\t' + res.longitude)
        this.setData({
          latitude1: res.latitude, //维度
          longitude1: res.longitude, //经度
        })
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

 


  getDateStr(dayCount,format) {
    if (null == dayCount) {
      dayCount = 0;
    }
    // var format = 'yyyyMMdd';
    var dd = new Date();
    dd.setDate(dd.getDate() + dayCount); //设置日期
    format = format.replace(/yyyy|YYYY/, dd.getFullYear());
    format = format.replace(/MM/, (dd.getMonth() + 1) > 9 ? (dd.getMonth() + 1).toString() : '0' + (dd.getMonth() + 1));
    format = format.replace(/dd|DD/, dd.getDate() > 9 ? dd.getDate().toString() : '0' + dd.getDate());
    return format;
  },
  // 取消排队、预约操作
  cancel: function (e) {
  
  
    let hour = new Date().getHours()

    if (hour > 15 ||hour == 15) {
      var endTime1 = that.getDateStr(1,'yyyy-MM-dd')
      var endTime = that.getDateStr(1,'yyyyMMdd');

      var date = new Date(Date.parse(endTime1.replace(/-/g, "/"))).getDay();
      if (date == 6) {
        endTime = that.getDateStr(3,'yyyyMMdd')

      } else if (date == 0) {
        endTime = that.getDateStr(2,'yyyyMMdd')
      }
      if (endTime == that.data.api.qkrq) {
        // 请在取款前一个工作日15：00前取消预约
        wx.showModal({
          title: '提示',
          content: '请在取款前一个工作日15：00前取消预约',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              wx.navigateBack({
                delta: 1,
              })
            } else if (res.cancel) {
              wx.navigateBack({
                delta: 1,
              })
            }
          }
        })
        return;
      }
    }
   
    if(that.data.api.sjzt==0||that.data.api.sjzt==3){
    
    wx.showModal({
      title: '提示',
      content: '您确定取消该预约吗？',
      success: res => {
        if (res.confirm) {
          var a = that.data.api
          a.ywbh = that.data.api.yyh
          a.remark1 = that.getDateStr(0,'yyyyMMdd')
          a.sjzt = "1"
          a.remark2 = ""
          let dataJson = JSON.stringify(a)
          //console.log(dataJson)
          var custnameTwo = encr.jiami(dataJson, aeskey) //3段加密
          wx.request({
            url: app.globalData.YTURL + 'jsyh/updateMaxmoney.do',
            data: encr.gwRequest(custnameTwo),
            method: 'POST',
            header: {
              'content-type': 'application/json', // 默认值
            },
            success(res) {
              var jsonData = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文
              //console.log('解密updateMaxmoney返回的报文==')
              //console.log(jsonData)
              if (jsonData.TRAN_STATUS == "COMPLETE") {
                wx.showToast({
                  title: '取消成功',
                  icon: "success",
                  mask: true,
                  duration: 2000
                })
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 1
                  })
                  wx.setStorageSync('isRefresh', 1)
           
                }, 2000)

              }

              // }
            },
            fail(err) {}
          })
          
        } else if (res.cancel) {
        }
      }
    })}else{
      wx.showToast({
        title: '该单号已过期',
        icon:'none'
      })
      return;
    
    }
  },
  go: function () {
    var latitude = this.data.latitude;
    var longitude = this.data.longitude;
    var latitude2 = this.data.latitude1;
    var longitude2 = this.data.longitude1;
    var city = '';
    var name = this.data.bank_name;
    var desc = this.data.bank_adderss;
    wx.navigateTo({
      url: '/sub2/pages/routes/routes?latitude=' + latitude2 + '&longitude=' + longitude2 + '&latitude2=' + latitude + '&longitude2=' + longitude + '&city=' + city + '&name=' + name + '&desc=' + desc,
    })
  }
})