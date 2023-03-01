// sub1/pages/express/main.js
const app = getApp();
var encr = require('../../utils/encrypt.js');//国密3段式加密
var aeskey = encr.key //随机数
var util = require('../../../utils/util.js');
//var url ='http://66.2.41.46:8090/wxgatewaysit/';//电脑测试
//var url = 'https://wxapptest.jsbchina.cn:9629/wxgatewaysit/'; //手机测试环境
//var url = 'https://wxapptest.jsbchina.cn:9629/wxgatewayuat/'; //手机验证环境
 var url = 'https://appservice.jsbchina.cn/wxgatewayuat/';//手机生产环境
//var url = 'https：//88.1.46.187:9080/wxgatewayuat/'

Page({

  /*
   * 页面的初始数据
   */
  data: {
    custname: '',

    sndaddress: {
      //cust_id: '',
      cust_name: '', //企业名称
      real_name: '', //寄件人姓名
      province: '', //省
      city: '', //市
      county: '', //区
      address: '', //详细地址
      tel: '', //联系电话
      id_card: '', //身份证号
      is_default: '', //默认
    },
    custList: [], //收件人信息
    form: {
      bustypeIndex: '', //业务类型
      timerangeIndex: '' //上门时间
    },
    bustype: ['其他'],
    timerange: ['1小时内', '2小时内', '3小时内', '4小时内'],
    addressList: {},
  },

  bindbustypeChange(e) {
    const value = e.detail.value
    this.setData({
      'form.bustypeIndex': value
    })
  },

  bindtimerangeChange(e) {
    const value = e.detail.value
    this.setData({
      'form.timerangeIndex': value
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  
   
    // //console.log(custname)
    // wx.request({
    //   url: app.globalData.URL + 'miwen', // 仅为示例，并非真实的接口地址
    //   data: {
    //     custname: custname
      
    //   },
    //   header: {
    //     'content-type': 'application/json', // 默认值
    //   },
    //   success(res) {
    //      //console.log(res)
    //   }
    // })

    if (options.list != undefined) {
      if(options.list!='undefined'){
        var list = JSON.parse(options.list)
        this.setData({
          custname: list.CUST_NAME,
          "sndaddress.cust_name": list.CUST_NAME,
          "sndaddress.real_name": list.REAL_NAME,
          "sndaddress.tel": list.TEL,
          "sndaddress.province": list.PROVINCE,
          "sndaddress.city": list.CITY,
          "sndaddress.county": list.COUNTY,
          "sndaddress.id_card": list.ID_CARD,
          "sndaddress.is_default": list.IS_DEFALUT,
          "sndaddress.address": list.ADDRESS

        })
      }
     

    }


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  //跳转 寄件人地址薄
  tolist(e) {
    if (this.data.custname == "") {
      wx.showToast({
        title: '请输入公司名称',
        icon: 'none',
        duration: 2000
      })
    }
    // if (this.data.sndaddress.cust_name != "") {
    //   var custname = JSON.stringify(this.data.sndaddress.cust_name); //公司名称
    //   wx.navigateTo({
    //     url: '/sub1/pages/express/list?custname=' + custname,
    //   })
    // }else{
      var custname= JSON.stringify(this.data.custname); //公司名称
      wx.navigateTo({
        url: '/sub2/pages/express/list?custname=' + custname,
      })
    // }
    // else {
    //   wx.showToast({
    //     title: '请输入正确公司名称',
    //     icon: 'none',
    //     duration: 2000
    //   })
    // }

  },
 
  //输入公司名称调用默认地址
  cutname: function(e) {
    var that = this;
     if (that.data.custname == "") {
      wx.showToast({
        title: '请输入公司名称',
        icon: 'none',
        duration: 2000
      })
    }
    var aa = e.detail.value //公司名称
    var dataJson = JSON.stringify({custname:aa})  
    var custname = encr.jiami(dataJson, aeskey) //3段加密
    
   
    that.setData({
      custname: aa,
      "sndaddress.real_name": '',
      "sndaddress.tel": '',
      "sndaddress.province": '',
      "sndaddress.city": '',
      "sndaddress.county": '',
      "sndaddress.id_card": '',
      "sndaddress.is_default": '',
      "sndaddress.address": '',
    })
   
   
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: url + 'express/defaultQuery.do',
      data: encr.gwRequest(custname),
      method: 'POST',
      header: {
         'content-type': 'application/json', // 默认值
      },
      success: function(res) {
      
        if (res.data.body != undefined) {
          var jsonData = encr.aesDecrypt(res.data.body,aeskey)//解密返回的报文
          res.data.body = jsonData;
          if(res.data.body.CUST_NAME!=""){
            that.setData({
              "sndaddress.cust_name": aa,
              "sndaddress.real_name": res.data.body.REAL_NAME,
              "sndaddress.tel": res.data.body.TEL,
              "sndaddress.province": res.data.body.PROVINCE,
              "sndaddress.city": res.data.body.CITY,
              "sndaddress.county": res.data.body.COUNTY,
              "sndaddress.id_card": res.data.body.ID_CARD,
              "sndaddress.is_default": res.data.body.IS_DEFALUT,
              "sndaddress.address": res.data.body.ADDRESS

            })
            wx.hideLoading();
          }       
          wx.hideLoading();
        }

      }

    })

   
  },
  //点击获取收件人信息
  receipt: function(e) {
    //console.log("收件人信息")
    var that = this
    if (that.data.custname == "" || that.data.custname == undefined) {
      wx.showToast({
        title: '请输入公司名称',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.showLoading({
        title: '加载中...',
      })
      var dataJson = JSON.stringify({
        CUST_ID: "1",
        CUST_NAME: that.data.custname,
        STAFF_ID: '19180009',
        POSTN_ID: '2D79565711624CEEE053B5590058620F',
        FIRST_NO: "1",
        RESULT_SIZE: "10",
        RESERVE1: "1",
        RESERVE2: "1",
        RESERVE3: "1"
      })
      var custnameTwo = encr.jiami(dataJson, aeskey) //3段加密
      wx.request({
        url: url + 'express/EMW0002.do',
        data: encr.gwRequest(custnameTwo),
        method: 'POST',
        header: {
          'content-type': 'application/json', // 默认值x
        },
        success: function(res) {
          var jsonData = encr.aesDecrypt(res.data.body, aeskey)//解密返回的报文
          res.data.body = jsonData;
          if (res.data.body.IW_CUST_LIST != undefined) {
            that.setData({
              custList: res.data.body.IW_CUST_LIST[0]
            })
            //console.log(that.data.custList)
            wx.hideLoading();
          } else {
            wx.showToast({
              title: '没有此公司收件人信息',
              icon: 'none',
              duration: 2000
            })
          }

        }

      })
    }
  },
  submitForm(e) {

    const params = e.detail.value;



  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    if(that.data.addressList!=undefined){
      if (Object.keys(that.data.addressList).length != 0) {
        //console.log("update")
        var list = that.data.addressList;
        this.setData({
          custname: list.CUST_NAME,
          "sndaddress.cust_name": list.CUST_NAME,
          "sndaddress.real_name": list.REAL_NAME,
          "sndaddress.tel": list.TEL,
          "sndaddress.province": list.PROVINCE,
          "sndaddress.city": list.CITY,
          "sndaddress.county": list.COUNTY,
          "sndaddress.id_card": list.ID_CARD,
          "sndaddress.is_default": list.IS_DEFALUT,
          "sndaddress.address": list.ADDRESS,
        });
      }
    }
 

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    var that = this
    that.setData({
      addressList: {}
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
  

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})