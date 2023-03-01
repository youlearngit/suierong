import api from "../utils/api";
import productDesc from "../utils/product";
import base64 from "../utils/base64";
import url from "../utils/urls";
import requestP from "../utils/requsetP";
import user from "../utils/user";
var app = getApp();

export default class Skip {
	static skipProduct(code) {
		//console.log(code);
		let result = Skip.hasProduct(code);
		//console.log(result);
		if (result == "-1") {
			console.error("js未配置该产品");
		} else {
			let skipType = productDesc[result].skipType;
			// 1-描述页面 //2-小程序页面 //3-h5  //0 期待
			switch (skipType) {
				case "1":
					wx.navigateTo({
						url: "/sub1/pages/shop/desc?index=" + result,
					});
					break;
				case "2":
                    if (productDesc[result].id == "HP001") {
						user.getCustomerInfo().then(res => {
							if (res.USERID) {
								wx.navigateTo({
									url: productDesc[result].page,
								});
							} else {
								wx.showToast({
									title: "非本行员工，暂无权限",
									icon: "none",
									duration: 2000,
								});
							}
						});
						return;
					}
					wx.navigateTo({
						url: productDesc[result].page,
					});
					break;
				case "3":
					let skipUrl = productDesc[result].h5;

					if (code == "EO001") {
						Skip.toEPay();
					} else if (code == "GR001") {
						Skip.toETC();
					} else if (code == "CO002") { // 综合签约 CO002
						user.getCustomerInfo().then(res => {
							if (res.INT_ID) {
								skipUrl = skipUrl.replace('${id}',res.INT_ID); //?id=1100093041
								api.skipToWebView(skipUrl);
							}
						});
					} else {
						api.skipToWebView(skipUrl);
					}
					break;
				case "0":
					wx.showToast({
						title: "敬请期待",
						icon: "none",
						mask: true,
						duration: 1000,
					});
					break;
				default:
					break;
			}
		}
	}

	static hasProduct(code) {
		for (let i = 0; i < productDesc.length; i++) {
			if (code == productDesc[i].id) {
				return i;
			}
		}
		return "-1";
	}

	static toEPay() {
		let openId = wx.getStorageSync("openid");
		let skipUrl = "";
		//console.log("share_person", app.globalData.share_person);
		if (app.globalData.share_person != "") {
			//console.log("查找分享者手机号");
			user
				.getCustomerInfo(app.globalData.share_person)
				.then(res => {
					if (res.USERID) {
						skipUrl = url.ePay + "?openId=" + openId + "&regChannelNo=2&jsyhUserId=" + res.USERID;
					} else {
						skipUrl = url.ePay + "?openId=" + openId + "&regChannelNo=2";
					}
					wx.navigateTo({
						url: "/pages/showWeb/showWeb?skipUrl=" + encodeURIComponent(skipUrl),
					});
				})
				.catch(err => {
					skipUrl = url.ePay + "?openId=" + openId + "&regChannelNo=2";
					wx.navigateTo({
						url: "/pages/showWeb/showWeb?skipUrl=" + encodeURIComponent(skipUrl),
					});
				});
		} else {
			skipUrl = url.ePay + "?openId=" + openId + "&regChannelNo=2";
			wx.navigateTo({
				url: "/pages/showWeb/showWeb?skipUrl=" + encodeURIComponent(skipUrl),
			});
		}
	}

	static toETC() {
		let skipUrl = "";
		let mobile = "";
		console.log(app.globalData.share_person);
		if (app.globalData.share_person != "") {
			user
				.getCustomerInfo(app.globalData.share_person)
				.then(res => {
					mobile = res.TEL ? base64.encode64(res.TEL) : "";
					skipUrl = url.etc + mobile;
					wx.navigateTo({
						url: "/pages/showWeb/showWeb?skipUrl=" + encodeURIComponent(skipUrl),
					});
				})
				.catch(err => {
					wx.showToast({
						title: err,
						icon: "none",
						duration: 1500,
						mask: false,
					});
				});
		} else {
			skipUrl = url.etc;
			wx.navigateTo({
				url: "/pages/showWeb/showWeb?skipUrl=" + encodeURIComponent(skipUrl),
			});
		}
	}
}
