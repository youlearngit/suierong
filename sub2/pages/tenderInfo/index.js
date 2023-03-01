// sub2/pages/tenderInfo/index.js
var app = getApp();
var that;
const util = require("../../utils/util");
const api = require("../../../utils/api");

var encr = require("../../utils/encrypt.js"); //国密3段式加密
var CryptoJS = require("../../utils/AES.js");
import requestP from "../../../utils/requsetP";
import user from "../../../utils/user";

var aeskey = encr.key; //随机数
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		a: {},
		s: true,
		loginFlag: true,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		that = this;
		that.setData({
			preffixUrl: app.globalData.URL,
		});
		if (options.productNo) {
			that.getData(options.productNo);
			that.setData({
				productNo: options.productNo,
			});
		}
	},
	getData(params) {
		let dataJson = JSON.stringify({
			productNo: params,
		});
		var custnameTwo = encr.jiami(dataJson, aeskey); //3段加密

		wx.request({
			url: app.globalData.YTURL + "product/selectDetail.do",
			data: encr.gwRequest(custnameTwo),
			method: "POST",
			success(res) {
				var jsonData = encr.aesDecrypt(res.data.body, aeskey); //解密返回的报文

				let data = jsonData;

				data.issueDate = data.issueDate.substr(0, 10);
				data.maturityDate = data.maturityDate.substr(0, 10);
				data.effectTimeMin = data.effectTimeMin.substr(0, 10);
				data.effectTimeMax = data.effectTimeMax.substr(0, 10);

				that.setData({
					a: data,
				});
			},
		});
	},
	back() {
		wx.navigateBack({
			delta: 1,
		});
	},
	change() {
		let status = that.data.s;
		that.setData({
			s: !status,
		});
	},
	//aes加密
	Encrypt: function (word, key) {
		return CryptoJS.AES.encrypt(word, key).toString();
	},

	formSubmit: function (e) {
		if (wx.getStorageSync("openid") === "") {
			api.getSessionInfo().then(() => {
				that.todo();
			});
		} else {
			that.todo();
		}
	},
	todo() {
		// let url = "https://qybanktest.jsbchina.cn/qybanksit/page/index.html#page/99/02/P9902.html"测试
		// let url = "https://qybanktest.jsbchina.cn/qybankuat/page/index.html#page/99/02/P9902.html" //验证

		let url = "https://qybank.jsbchina.cn/qybankA/page/index.html#page/99/02/P9902.html"; //生产
		let params = "";
		if (wx.getStorageSync("openid") === "") {
			wx.showToast({
				title: "获取个人信息失败,请重试",
				icon: "none",
				duration: 2000,
			});
			api.getSessionInfo().then(() => {});
			return;
		}
		user.getCustomerInfo().then(res => {
			if (ares.TEL != "" && res.TEL != undefined) {
				wx.requestSubscribeMessage({
					tmplIds: ["PrerGmNfOOQBahQ3PfmvGPE4vxoZD13p5jq5ix9Nk8Q"],
					success(a) {
						if (a.PrerGmNfOOQBahQ3PfmvGPE4vxoZD13p5jq5ix9Nk8Q === "accept") {
							var phone = res.TEL;
							var word = phone;
							var key = "qybankjscryptxcx123123";

							var jiami1 = that.Encrypt(wx.getStorageSync("openid"), key);
							var jiami2 = that.Encrypt(word, key);
							var jiami3 = that.Encrypt(that.data.productNo, key);
							let params = "?openid=" + jiami1 + "&phone=" + jiami2 + "&productNo=" + jiami3;
							url = url + params;
							wx.navigateTo({
								url: "/pages/showWeb/showWeb?skipUrl=" + encodeURIComponent(url),
							});
						} else {
							wx.showToast({
								title: "请允许通知订阅通知",
								icon: "none",
								duration: 2000,
							});
						}
					},
					fail(res) {},
				});
			} else {
				that.setData({
					loginFlag: false,
				});
			}
		});
	},
	/**
	 * 取消
	 */
	logincancel: function () {
		that.setData({
			loginFlag: true,
		});
	},

	/**
	 * 登陆授权
	 * @param {}} e
	 */
	bindgetphonenumber(e) {
		api.getPhoneNumber(e);
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {},
});
