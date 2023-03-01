import WxValidate from "../../../assets/plugins/wx-validate/WxValidate";
const app = getApp();
var util = require('../../utils/util.js');
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    poi:"",
    form:{
      typeIndex:0,//业务类型：0-个人；1-对公
      idCard:'',//身份证
      name:'',//姓名
      phone:'',//手机号,获取微信绑定手机号，赋值到此
    },
    mkData:"",
    list:{},
    types: ['个人业务', '对公业务'],
    suc_flag:false,//提交成功的图片  
    submit: true,
    real_name:'',
    id_card:'',
    tel:'',
    sessionKey: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options){
    that = this;
    that.setData({
      // preffixUrl: "https://wxapp.jsbchina.cn:7080/jsb/"
      preffixUrl:app.globalData.JSB    
    })
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    //console.log(options)
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: that.data.preffixUrl+ "getwechatid",
          data: {
            js_code: res.code,
            isProxy: false
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded",// 默认值
            "key": (Date.parse(new Date())).toString().substring(0, 6)
          },
          success: res => {
            if (res.data != undefined) {
              that.setData({
                sessionKey: res.data.session_key
              })
            }
          }
        })
      }
    })
    that.setData({
      mkData:options.data,
      'poi.latitude': options.latitude,
      'poi.longitude': options.longitude,
      'poi.bankname': options.bankname,
      'poi.bankaddress': options.bankaddress,
    }),

    that.initValidate();
    // 获取用户信息

    wx.request({
      url:that.data.preffixUrl + "getmessagebyopenid",
      data: {
        open_id: wx.getStorageSync('openid'),
      },
      method:"POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",// 默认值
        "key": (Date.parse(new Date())).toString().substring(0, 6),
        "sessionId": wx.getStorageSync('sessionid'),
        "transNo": "XC006" 
      },
      success: function (res) {  
        //console.log(res)  
        if (res.data.data[0] != '' && res.data.data[0] != null&&res.data.data[0] !=undefined){
          that.setData({
            real_name: res.data.data[0].REAL_NAME,
            tel: res.data.data[0].TEL,
            id_card: res.data.data[0].ID_CARD,
          })
        }
        wx.hideLoading();
      }
    })
  },
  //获取手机号
  getPhoneNumber(e) {
    wx.showLoading({
      title: '获取中...',
    })
    wx.request({
      url: that.data.preffixUrl+ "decryptdata",
      data: {
        encryptDataB64: e.detail.encryptedData,
        sessionKeyB64: that.data.sessionKey,
        ivB64: e.detail.iv,
      },
      header: {
        "Content-Type": "application/json",// 默认值
        "key": (Date.parse(new Date())).toString().substring(0, 6),
      },
      success: res => {
        //console.log(res.data.phoneNumber)
        that.setData({
          tel: res.data.phoneNumber
        })
        wx.hideLoading();
      }
    })
  },
  submitForm:function(e) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    const params = e.detail.value;
    //console.log(params);
   
    // 传入表单数据，调用验证方法
    if (!that.WxValidate.checkForm(params)) {
      const error = that.WxValidate.errorList[0]
      that.showModal(error)
      return false
    }
    //console.log(params.idCard)
    //console.log(that.data.poi.bankname)
    //console.log(that.data.poi.bankaddress)
    //console.log(that.data.poi.latitude)//纬度
    if (that.data.submit) {
      that.setData({
        submit: false
      })
      //console.log(that.data.tel)
      // if (that.data.real_name == '' && that.data.real_name == null && that.data.real_name==undefined){}
    let data = JSON.stringify({
       id_LINE_ID: "id",
       string_STATUS:"0",
       string_BANK_ADDERSS: that.data.poi.bankaddress,
       string_BANK_NAME: that.data.poi.bankname,
       string_LOCATION_LAT_NAVI: that.data.poi.latitude,
       string_LOCATION_LONG_NAVI: that.data.poi.longitude,
       string_BUSINESS_TYPE:params.types,
       string_REAL_NAME: params.name,
       string_ID_CARD: params.idCard,
       string_TEL: that.data.tel,
       string_OPEN_ID: wx.getStorageSync('openid'),
       string_CUSTOMER_STATUS:"0",
       string_LINE_NUMBER:'',
    });
      //console.log(data)
    wx.request({
      url: that.data.preffixUrl + "addLine",
      data:({
        data:data
      }),
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",// 默认值
        "key": (Date.parse(new Date())).toString().substring(0, 6),
        "sessionId": wx.getStorageSync('sessionid'),
        "transNo": "XC006"
      },
      success(res) {
        //console.log(res)
        wx.hideLoading();
        setTimeout(function () {
          if (res.data.code != -1) {
            that.setData({
              suc_flag: false
            })
          } else {
            that.setData({
              submit: true,
            })
          }
        }, 100)
        if (res.data.code = 1) {

          wx.navigateTo({
            url: "/sub2/pages/mine/list",
          })
        }
      }    
    })
    } else {
      wx.showToast({
        title: '您已提交过了',
        icon: 'none',
        duration: 2000
      })
    }
  },
  showModal(error) {
    wx.showToast({
      title: error.msg,
      icon: 'none',
      mask:true,
      duration: 2000
    })
  },
  initValidate() {
    // 验证字段的规则
    const rules = {
      name: {
        required: true,
        name: true,
      },
      idCard: {
        required: true,
        idcard: true,
      },
    }
    // 验证字段的提示信息，若不传则调用默认的信息
    const messages = {
      name: {
        required: '请输入中文姓名',
        name: '姓名仅支持汉字',
      },
      idCard: {
        required: '请输入身份证号码',
        idcard: '请输入正确的身份证号码',
      },
    }
    // 创建实例对象
    that.WxValidate = new WxValidate(rules, messages)
  },
  //期限选择
  typeChange(e) {
    const value = e.detail.value
    that.setData({
      'form.typeIndex': value,
    })
  },
 

})