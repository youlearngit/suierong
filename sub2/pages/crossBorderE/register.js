// sub1/pages/crossBorderE/register.js
var that;
var util = require("../../../utils/util.js");
import requestP from "../../../utils/requsetP";
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showNum: 0,
    current:'coName',
    form: {
      coName: '',
      contact: '',
      phone: '',
      address: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.setData({
      preffixUrl: app.globalData.CDNURL
    });
 
  },
  register(){
    var data = that.data.form;
    if(data.coName==''||data.contact==''||data.phone==''||data.address==''){
      wx.showToast({
        title: '请补全信息',
        icon:'none'
      })
    }else{
   
			var address = data.address;
			var companyName = data.coName;
			var tel = data.phone;
			var userName = data.contact;
			var text1 = "1";
			var data = JSON.stringify({
				address: address, 
				companyName: companyName, 
				tel: tel, 
				userName: userName, 
				text1: text1,
				openId: wx.getStorageSync("openid"),
			});
			//console.log("加密前data", data);
			data = util.enct(data) + util.digest(data);
			wx.request({
				url: app.globalData.URL + "applyZmy",
				data: {
					data: data,
				},
				method: "POST",
				header: {
					"content-type": "application/x-www-form-urlencoded",
					key: Date.parse(new Date()).toString().substring(0, 6),
					sessionId: wx.getStorageSync("sessionid"),
					transNo: "XC016",
				},
				success: res => {
					//console.log(res);
					if (res.data.code == "1") {
						wx.showModal({
							title: "提示",
							content: "预约成功",
							showCancel: false,
							confirmText: "确定",
							success: result => {
								if (result.confirm) {
									wx.navigateBack({
										delta: 1,
									});
								}
							},
						});
					} else {
						wx.showModal({
							title: "提示",
							content: "注册失败,请重试",
							showCancel: false,
							confirmText: "确定",
							success: result => {
								if (result.confirm) {
								}
							},
						});
					}
				},
			});
    }
  },
  getSessionKey() {
		var that = this;
		return new Promise((resolve, reject) => {
			wx.login({
				success: res => {
					// 发送 res.code 到后台换取 openId, sessionKey, unionId
					wx.request({
						url: app.globalData.URL + "getwechatid",
						data: {
							js_code: res.code,
							isProxy: false,
						},
						header: {
							"Content-Type": "application/x-www-form-urlencoded", // 默认值
							key: Date.parse(new Date()).toString().substring(0, 6),
						},
						success: res => {
							if (res.data != undefined) {
								wx.setStorageSync("openid", res.data.openid);
								wx.setStorageSync("key", res.data.key);
								wx.setStorageSync("sessionid", res.data.session_key);
							}
							resolve();
						},
					});
				},
				fail: err => {
					reject(err);
				},
			});
		});
	},
  blur(e){
    // e.currentTarget.id
    // e.detail.value
    var value=e.detail.value;
    // var showNum = that.data.showNum;

    switch (e.currentTarget.id) {
      case 'coName':
        that.setData({
          "form.coName":value,
        })
        break;
        case 'contact':
          that.setData({
            "form.contact":value,
          })
          break;
          case 'phone':
            that.setData({
              "form.phone":value,
            })
            break;
            case 'address':
              that.setData({
                "form.address":value,
              })
              break;
      
      }
      
   
        var showNum=0;
      if(that.data.form.coName!=''){
      showNum=showNum+25;
      }
      if(that.data.form.phone!=''){
        showNum=showNum+25;
      } if(that.data.form.address!=''){
        showNum=showNum+25;
      } if(that.data.form.contact!=''){
        showNum=showNum+25;
      }
        that.setData({
          showNum:showNum
        })
  
     
   
  }
,
decryptdata(encryptedData, iv) {
  var that = this;
  requestP({
    url: "https://wxapp.jsbchina.cn:7080/jsb/decryptdata",
    data: {
      encryptDataB64: encryptedData,
      sessionKeyB64: wx.getStorageSync("sessionid").substring(4),
      ivB64: iv,
    },
    header: {
      "Content-Type": "application/json", // 默认值
      key: Date.parse(new Date()).toString().substring(0, 6),
    },
  })
    .then(res => {
      ////console.log("解密手机号信息成功", res);
      var num = res.phoneNumber;
      var showNum=that.data.showNum;
      if(showNum<100&&that.data.form.phone==""){
        showNum=showNum+25;
        that.setData({
          showNum:showNum
        })
      }
            that.setData({
              "form.phone": num
            });
     
    })
    .catch(err => {
      wx.showToast({
        title: '手机解析失败',
        icon:'none'
      })
      console.error("解密手机号信息失败:", err);
    });
},	getPhoneNumber3(e) {
  var that = this;
  wx.showLoading({
    title: "获取中...",
  });
  that.getSessionKey().then(() => {
    that.decryptdata(e.detail.encryptedData, e.detail.iv);
  });

  wx.hideLoading();
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