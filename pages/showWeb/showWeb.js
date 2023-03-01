var app = getApp();
import requestP from "../../utils/requsetP";
import base64 from "../../utils/base64";
import url from "../../utils/urls";
import user from "../../utils/user";

Page({
	data: {
		skipUrl: "",
		empNo: "",
		mode: "0",
	},
	onLoad(options) {
		//console.log("options", options);
		let skipUrl = decodeURIComponent(options.skipUrl);
		var that = this;
		if (options.sendStr) {
			let data = JSON.parse(decodeURIComponent(options.sendStr));
			if (data.platFlag) {
				this.setData({
					skipUrl:
						skipUrl +
						"?custno=" +
						data.custNo +
						"&custtype=" +
						data.custType +
						"&merchantno=" +
						data.merchantNo +
						"&platFlag=" +
						data.platFlag +
						"&sign=" +
						encodeURIComponent(data.sign) +
						"&signType=" +
						data.signType +
						"&time=" +
						data.time +
						"&transData=" +
						data.transData,
				});
			} else {
				this.setData({
					skipUrl:
						skipUrl +
						"?custno=" +
						data.custNo +
						"&custtype=" +
						data.custType +
						"&merchantno=" +
						data.merchantNo +
						"&sign=" +
						encodeURIComponent(data.sign) +
						"&signType=" +
						data.signType +
						"&time=" +
						data.time +
						"&transData=" +
						data.transData,
				});
			}
			// //console.log(this.data.skipUrl);
		} else if (options.scene) {
			var urlParam = base64.baseDecode(options.scene);
			let params = urlParam.split("&");
			//开放银行跳转
			if (params[0] == "t=othe") {
				let data = "";
				for (let i = 1; i < params.length; i++) {
					data = data + "&" + params[i];
				}
				data = data.substring(1);
				skipUrl = MYURLS.Urls.openBank + options.scene;

				this.setData({
					skipUrl: decodeURIComponent(skipUrl),
				});
				//console.log(this.data.skipUrl);
			} else {
				wx.switchTab({
					url: "/pages/shop/index2",
					success: result => {},
					fail: () => {},
					complete: () => {},
				});
			}
		} else {
			//普通跳转
			//console.log("skipUrl", skipUrl);
			if (options.type) {
				if (skipUrl.indexOf("epcs/eMerchant") > -1) {
					if (options.empNo) {
						skipUrl = skipUrl + "&jsyhUserId=" + options.empNo;
						//console.log("skipUrl2", skipUrl);
					}
					let index1 = skipUrl.indexOf("?openId");
					let index2 = skipUrl.indexOf("&");
					//console.log("index1", index1);
					//console.log("index2", index2);
					if (wx.getStorageSync("openid") == "") {
						that.getSessionInfo().then(() => {
							let openId = wx.getStorageSync("openid");
							skipUrl = skipUrl.substring(0, index1) + "?openId=" + openId + skipUrl.substring(index2);
							//console.log("skipUrl3", skipUrl);
							that.setData({
								skipUrl: decodeURIComponent(skipUrl),
							});
						});
					} else {
						let openId = wx.getStorageSync("openid");
						skipUrl = skipUrl.substring(0, index1) + "?openId=" + openId + skipUrl.substring(index2);
						//console.log("skipUrl3", skipUrl);
						that.setData({
							skipUrl: decodeURIComponent(skipUrl),
						});
					}
				} else if (skipUrl.indexOf("etcMain.do") > -1) {
					user.getCustomerInfo(res => {
						let mobile = res.TEL ? base64.encode64(res.TEL) : "";
						//console.log("mobile", mobile);
						skipUrl = url.etc + mobile;
						//console.log("ETC", skipUrl);
						that.setData({
							skipUrl: decodeURIComponent(skipUrl),
						});
					});
				} else {
					that.setData({
						skipUrl: decodeURIComponent(skipUrl),
					});
				}
			} else {
				this.setData({
					skipUrl: decodeURIComponent(skipUrl),
				});
			}
		}
	},

	getSessionInfo() {
		var that = this;
		return new Promise((resolve, reject) => {
			wx.login({
				timeout: 10000,
				success: res => {
					wx.request({
						url: that.globalData.URL + "getwechatid",
						data: {
							js_code: res.code,
							isProxy: false,
						},
						header: {
							"content-type": "application/json", // 默认值
							key: Date.parse(new Date()).toString().substring(0, 6),
						},
						success(res) {
							if (typeof res.data != "undefined") {
								wx.setStorageSync("openid", res.data.openid);
								wx.setStorageSync("key", res.data.key); //加解密
								wx.setStorageSync("sessionid", res.data.session_key);
								resolve();
							} else {
								resolve();
							}
						},
					});
				},
				fail: err => {
					reject(err);
				},
			});
		});
	},

	onShareAppMessage: options => {
		//console.log("ddd", app.globalData.empNo);
		let return_url = encodeURIComponent(options.webViewUrl); //分享的当前页面的路径
		//console.log("return_url", return_url);
		let share_id = wx.getStorageSync("openid");
		var path =
			"/pages/showWeb/showWeb?open_id=" +
			share_id +
			"&skipUrl=" +
			return_url +
			"&empNo=" +
			app.globalData.empNo +
			"&type=card"; //小程序存放分享页面的内嵌网页路径
		return {
			title: "",
			path: path,
		};
	},
});
