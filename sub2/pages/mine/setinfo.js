import WxValidate from "../../../assets/plugins/wx-validate/WxValidate";
import User from '../../../utils/user';
const app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tel: '',
    name: '',
    gender: '',
    data: '',
    sessionKey: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      preffixUrl: "https://wxapp.jsbchina.cn:7080/jsb/"
    })
    wx.showLoading({
      title: '加载中...',
    })
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: "https://wxapp.jsbchina.cn:7080/jsb/" + "getwechatid",
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
              this.setData({
                sessionKey: res.data.session_key
              })
              
            }
          }
        })
      }
    })
    this.initValidate();

    User.ifAuthUserInfo().then(res=>{
        if(res){
            this.setData({
                name: app.globalData.userInfo.nickName,
                gender: app.globalData.userInfo.gender
              })
        }
    })
 
    wx.request({
      url: "https://wxapp.jsbchina.cn:7080/jsb/" + "getmessagebyopenid",
      data: {
        open_id: wx.getStorageSync('openid'),
      },
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded",// 默认值
            "key": (Date.parse(new Date())).toString().substring(0, 6),
            "sessionId": wx.getStorageSync('sessionid'),
            "transNo": "XC006"
          },
      success: res => {
        if(res.data.data[0]==undefined){
          wx.showToast({
            title: '您还没有授权哦',
            icon: "none",
            mask: true,
            duration: 2000
          })
          setTimeout(() => {
            wx.navigateTo({
              url: "/sub2/pages/mine/index",
            })
          }, 2000); 
        }else if (res.data.data[0] != null) {
          this.setData({
            real_name: res.data.data[0].REAL_NAME,
            id_card: res.data.data[0].ID_CARD,
            tel: res.data.data[0].TEL,
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
      url: "https://wxapp.jsbchina.cn:7080/jsb/" + "decryptdata",
      data: {
        encryptDataB64: e.detail.encryptedData,
        sessionKeyB64: this.data.sessionKey,
        ivB64: e.detail.iv,
      },
      header: {
        "Content-Type": "application/json",// 默认值
        "key": (Date.parse(new Date())).toString().substring(0, 6),
        "sessionId": wx.getStorageSync('sessionid'),
        "transNo": "XC006"
      },
      success: res => {
        //console.log(res.data.phoneNumber)
        this.setData({
          tel: res.data.phoneNumber
        })
        wx.hideLoading();
      }
    })
  },
  submitForm(e) {
    var that = this;
    const params = e.detail.value;
    //console.log(params);
    if (that.data.tel == '' || that.data.tel == null || that.data.tel == undefined) {
      wx.showToast({
        title: '请获取手机号码',
        icon: "none",
        mask: true,
        duration: 2000
      });
      return false;
    }

    // 传入表单数据，调用验证方法
    if (!that.WxValidate.checkForm(params)) {
      const error = that.WxValidate.errorList[0]
      that.showModal(error)
      return false
    }
    if (that.data.tel==''){
      wx.showModal({
        title: '提示',
        content:'请获取手机号码',
        })
      return false;
    }

    wx.showLoading({
      title: '提交中...',
    })
    wx.request({
      url: "https://wxapp.jsbchina.cn:7080/jsb/" + "updateCustomer", // 仅为示例，并非真实的接口地址
      data: {
        real_name:params.name,
        id_card:params.idCard,
        tel:this.data.tel,
        open_id: wx.getStorageSync('openid'),
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",// 默认值
        "key": (Date.parse(new Date())).toString().substring(0, 6),
        "sessionId": wx.getStorageSync('sessionid'),
        "transNo": "XC006"
      },
      success(res) {
        var result = res;
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: res.data.msg,
          showCancel: false,//是否显示取消按钮
          success: function (res) {
          },
          fail: function (res) { },//接口调用失败的回调函数
          complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
        })
        setTimeout(() => {
          wx.navigateTo({
            url: "/sub2/pages/mine/index",
          })
        }, 2000); 
      }
    })
  },
  showModal(error) {
    wx.showToast({
      title: error.msg,
      icon: 'none',
      mask: true,
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
    this.WxValidate = new WxValidate(rules, messages)
  },
  

})