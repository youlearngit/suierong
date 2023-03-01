// sub1/pages/cloud/regist.js
const app = getApp();
var util = require("../../../utils/util.js");
import requestP from "../../../utils/requsetP";
import WxValidate from "../../../assets/plugins/wx-validate/WxValidate";

Page({
	/**
	 * Page initial data
	 */
	data: {
		preffixUrl: "",
		phone: "",
	},

	/**
	 * Lifecycle function--Called when page load
	 */
	onLoad: function (options) {
		var that = this;
		that.setData({
			preffixUrl: app.globalData.URL,
		});
		this.initValidate();
	},

	/**
	 * Lifecycle function--Called when page is initially rendered
	 */
	onReady: function () {},

	/**
	 * Lifecycle function--Called when page show
	 */
	onShow: function () {},

	/**
	 * Lifecycle function--Called when page hide
	 */
	onHide: function () {},

	/**
	 * Lifecycle function--Called when page unload
	 */
	onUnload: function () {},

	/**
	 * Page event handler function--Called when user drop down
	 */
	onPullDownRefresh: function () {},

	/**
	 * Called when page reach bottom
	 */
	onReachBottom: function () {},

	/**
	 * Called when user click on the top right corner to share
	 */
	onShareAppMessage: function () {},

	register(e) {
        const params = e.detail.value;
		if (!this.WxValidate.checkForm(params)) {
            const error = this.WxValidate.errorList[0].msg;
            //console.log(error)
			wx.showToast({
				title: error,
				icon: "none",
				image: "",
				duration: 1500,
				mask: true,
			});
			return false;
		} else {
			var that = this;
			//console.log(e);
			var vals = e.detail.value;
			var address = vals.address;
			var companyName = vals.companyName;
			var tel = vals.tel;
			var userName = vals.userName;
			var text1 = "1";
			var data = JSON.stringify({
				address: address, //
				companyName: companyName, //
				tel: tel, //
				userName: userName, //
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
							content: "注册成功",
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

	initValidate() {
		const rules = {
			companyName: {
				required: true,
				orgName: true,
			},
			userName: {
				required: true,
				name: true,
			},
			tel: {
				required: true,
				tel: true,
			},
			address: {
				required: true,
			},
		};

		// 验证字段的提示信息，若不传则调用默认的信息
		const messages = {
			companyName: {
				required: "请输入公司名称",
			},
			userName: {
				required: "请输入姓名",
			},
			tel: {
				required: "请输入手机号",
			},
			address: {
				required: "请输入办公地址",
			},
		};

		// 创建实例对象
		this.WxValidate = new WxValidate(rules, messages);
	},
	getPhoneNumber3(e) {
		var that = this;
		wx.showLoading({
			title: "获取中...",
		});
		that.getSessionKey().then(() => {
			that.decryptdata(e.detail.encryptedData, e.detail.iv);
		});
		wx.hideLoading();
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
				//console.log("解密手机号信息成功", res);
				var num = res.phoneNumber;
				that.setData({
					phone: num,
				});
			})
			.catch(err => {
				console.error("解密手机号信息失败:", err);
			});
	},
});
