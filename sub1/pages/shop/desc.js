// sub1/pages/shop/describe.js
import productDesc from "../../../utils/product";
import util from "../../../utils/util";
import requestP from "../../../utils/requsetP";
import api from "../../../utils/api";
import emp from "../../../utils/Emp";

var app = getApp();
Page({
	data: {
		productDesc: {},
		title: "",
		empNo: "",
		cndUrl: app.globalData.CDNURL,
	},

	onLoad: function (e) {
		//console.log("传递的参数", e);

		this.setData({
			index: e.index,
			empNo: e.empNo,
		});
		let productDesc2 = productDesc[e.index];
		let title = "";
		switch (productDesc2.name) {
			case "电e盈":
				title = "业务优势";
				break;
			case "手机银行":
				title = "开通流程";
				break;
			default:
				title = "客户所需提供材料";
				break;
		}
		this.setData({
			title,
			productDesc: productDesc2,
			preffixUrl: app.globalData.URL,
		});
	},

	talk() {
		wx.showToast({
			title: "敬请期待！",
			icon: "none",
			mask: true,
			duration: 1000,
		});
	},

	apli() {
		wx.showToast({
			title: "敬请期待！",
			icon: "none",
			mask: true,
			duration: 1000,
		});
	},

	/**
	 * 致电
	 */
	openPhoneDialog() {
		var that = this;
		if (that.data.empNo === "") {
			emp.getCardInfoByEmp(that.data.empNo).then(res => {
				if (res) {
					if (res.TEXT5 != "0") {
						api.call(res.PHONE, res.USERNAME);
					} else {
						wx.showToast({
							title: "敬请期待！",
							icon: "none",
							mask: true,
							duration: 1000,
						});
					}
				} else {
					wx.showToast({
						title: "敬请期待！",
						icon: "none",
						mask: true,
						duration: 1000,
					});
				}
			});
		} else {
			wx.showToast({
				title: "敬请期待！",
				icon: "none",
				mask: true,
				duration: 1000,
			});
		}
	},

	/**
	 * Called when user click on the top right corner to share
	 */
	onShareAppMessage() {
		let params = "&index=" + that.data.index + "&empNo=" + that.data.empNo + "&intId=" + app.globalData.int_id;
		return api.shareApp("", params);
	},
});
