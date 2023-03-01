// sub2/pages/ecCalculator/index.js
var app = getApp();
const util = require("../../utils/util");

var encr = require('../../utils/encrypt.js'); //国密3段式加密
var aeskey = encr.key //随机数
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag: 1,
    array: ['英镑', '港币', '美元', '瑞郎', '日元', '加元', '澳元', '新元', '欧元'],
    curRisk: '',
    preffixUrl: app.globalData.CDNURL,
    selectIc: 'USDCNY',
    selectTxt: '美元',
    risk: '',
    risk2: '',
    risk3: '',
    Foreign: '',
    CNY: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    this.getData()
    this.getTime()
  },
  select(e) {
    let i = e.currentTarget.dataset.i
    this.setData({
      flag: i,
      Foreign: '',
      CNY: ''
    })
    if (this.data.flag == '2') {
      this.setData({
        curRisk: that.data.risk2
      })
    } else if (this.data.flag == '3') {
      this.setData({
        curRisk: that.data.risk3
      })
    } else {
      this.setData({
        curRisk: that.data.risk
      })
    }

  },
  inpu1(e) {
    //输入外币兑换人民币
    let pri = parseInt(e.detail.value)
    let cny = pri * that.data.risk
    if (this.data.flag == '2') {
      cny = pri * that.data.risk2
    } else if (this.data.flag == '3') {
      cny = pri * that.data.risk3
    }
    cny = parseFloat(cny.toFixed(2))
    this.setData({
      CNY: cny
    })
  },
  inpu2(e) {
    //输入人民币兑换外币
    let pri = parseInt(e.detail.value)
    let foreign = pri / that.data.risk
    if (this.data.flag == '2') {
      foreign = pri / that.data.risk2
    } else if (this.data.flag == '3') {
      foreign = pri / that.data.risk3
    }
    foreign = parseFloat(foreign.toFixed(2))
    this.setData({
      Foreign: foreign
    })
  },
  bindPickerChange: function (e) {
    // array: ['英镑', '港币', '美元', '瑞郎', '日元', '加元', '澳元', '新元', '欧元'],
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let list = that.data.riskList
    let list1 = []

    switch (e.detail.value) {
      
      case '0':
        list1 = list.filter((item) => {
          return item.rateCode == 'GBPCNY';
        });
        that.setData({
          selectIc: 'GBPCNY',
          selectTxt: '英镑',
          risk: list1[0].exchAsk,
          risk2: list1[0].exchBid,
          risk3: list1[0].cashBid,
        })
        break;

      case '1':
        list1 = list.filter((item) => {
          return item.rateCode == 'HKDCNY';
        });
        that.setData({
          selectIc: 'HKDCNY',
          selectTxt: '港币',
          risk: list1[0].exchAsk,
          risk2: list1[0].exchBid,
          risk3: list1[0].cashBid,
        })
        break;
      case '2':
        list1 = list.filter((item) => {
          return item.rateCode == 'USDCNY';
        });
        that.setData({
          selectIc: 'USDCNY',
          selectTxt: '美元',
          risk: list1[0].exchAsk,
          risk2: list1[0].exchBid,
          risk3: list1[0].cashBid,
        })
        break;
      case '3':
        list1 = list.filter((item) => {
          return item.rateCode == 'CHFCNY';
        });
        that.setData({
          selectIc: 'CHFCNY',
          selectTxt: '瑞郎',
          risk: list1[0].exchAsk,
          risk2: list1[0].exchBid,
          risk3: list1[0].cashBid,
        })
        break;
      case '4':
        list1 = list.filter((item) => {
          return item.rateCode == 'JPYCNY';
        });
        that.setData({
          selectIc: 'JPYCNY',
          selectTxt: '日元',
          risk: list1[0].exchAsk,
          risk2: list1[0].exchBid,
          risk3: list1[0].cashBid,
        })
        break;
      case '5':
        list1 = list.filter((item) => {
          return item.rateCode == 'CADCNY';
        });
        that.setData({
          selectIc: 'CADCNY',
          selectTxt: '加元',
          risk: list1[0].exchAsk,
          risk2: list1[0].exchBid,
          risk3: list1[0].cashBid,
        })
        break;
      case '6':
        list1 = list.filter((item) => {
          return item.rateCode == 'AUDCNY';
        });
        that.setData({
          selectIc: 'AUDCNY',
          selectTxt: '澳元',
          risk: list1[0].exchAsk,
          risk2: list1[0].exchBid,
          risk3: list1[0].cashBid,
        })
        break;
      case '7':
        list1 = list.filter((item) => {
          return item.rateCode == 'SGDCNY';
        });
        that.setData({
          selectIc: 'SGDCNY',
          selectTxt: '新元',
          risk: list1[0].exchAsk,
          risk2: list1[0].exchBid,
          risk3: list1[0].cashBid,
        })
        break;
      case '8':
        list1 = list.filter((item) => {
          return item.rateCode == 'EURCNY';
        });
        that.setData({
          selectIc: 'EURCNY',
          selectTxt: '欧元',
          risk: list1[0].exchAsk,
          risk2: list1[0].exchBid,
          risk3: list1[0].cashBid,
        })
        break;

      default:
        break;
    }
    this.setData({
      curRisk:that.data.risk,
      index: e.detail.value,
      Foreign: '',
      CNY: '',
      flag: 1,
    })
  },
  getTime() {
    var date = new Date();
    var year = date.getFullYear();
    var mon = date.getMonth() + 1;
    var da = date.getDate(); //获取当前日

    var day = date.getDay();
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
    var submitTime = "";
    submitTime += year + "-";
    if (mon >= 10) {
      // submitTime += mon + "-";
    } else {
      mon = "0" + mon;
    }
    if (da >= 10) {
      // submitTime += day;
    } else {
      da = "0" + da;
    }
    submitTime += " ";
    if (h >= 10) {
      // submitTime += h + ":";
    } else {
      h = "0" + h + ":";
    }
    if (m >= 10) {
      // submitTime += m;
    } else {
      m = "0" + m;
    }
    if (s < 10) {
      s = "0" + s;
    }

    let datess = year + "-" + mon + "-" + da + "  " + h + ":" + m + ":" + s
    this.setData({
      date: datess
    })
  },
  getData() {

    let dataJson = JSON.stringify({
      rateCode: '',
      startSerialNo: '1',
      queryCounts: '30',
    })
    console.log(dataJson)
    let custnameTwo = encr.jiami(dataJson, aeskey) //3段加密
    wx.request({
      url: app.globalData.YTURL + 'talent/XP5001.do',
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
      },
      data: encr.gwRequest(custnameTwo),
      success(res) {
        if (res.data.head.H_STATUS == '1') {

          let data = encr.aesDecrypt(res.data.body, aeskey)
          console.log(data)
          that.setData({
            riskList: data.GetPricesList
          })
          let list = data.GetPricesList
          let list1 = []
          list1 = list.filter((item) => {
            return item.rateCode == 'USDCNY';
          });
          that.setData({
            selectIc: 'USDCNY',
            selectTxt: '美元',
            risk: list1[0].exchAsk,
            risk2: list1[0].exchBid,
            risk3: list1[0].cashBid,
            curRisk: list1[0].exchAsk
          })
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.head.H_MSG,
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1,
                })
              }
            }
          })

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