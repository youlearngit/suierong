// sub1/pages/share/list.js
import user from "../../../utils/user";
import util from "../../../utils/util";
import requestP from "../../../utils/requsetP";
import Order from "../../../api/Order";
var app = getApp();

Page({
	/**
	 * Page initial data
	 */
	data: {
		preffixUrl: app.globalData.URL,
		cndUrl: app.globalData.CDNURL,
		totalPage: "",
		currentPage1: "0",
		shareList: {},
		defaultAvatar: app.globalData.URL + "/static/wechat/img/no_avator.png",
	},

	/**
	 * Lifecycle function--Called when page load
	 */
	onLoad: function (options) {
		var that = this;
		Order.getShareRecord("0", "13", "share14").then(res => {
            that.setData({
				totalPage: res.totalNum,
			});

			that.readLists2(res.value);
		});
	},

	readLists2(list) {
		var that = this;
		var data = "";

		list.forEach(e => {
			e.CLICK_PHOTO =
				e.CLICK_PHOTO && e.CLICK_PHOTO != "0" ? e.CLICK_PHOTO.replace(/[\r\n]/g, "") : that.data.defaultAvatar;
			let d1 = e.CLICK_TIME;
			data = new Date(
				d1.substring(0, 4),
				d1.substring(4, 6) - 1,
				d1.substring(6, 8),
				d1.substring(8, 10),
				d1.substring(10, 12),
				d1.substring(12, 14)
			);
			e.APPLYTIME = that.beautify_time(data.getTime());
			e.CREATE_DATE = d1.substring(0, 4) + "." + d1.substring(4, 6) + "." + d1.substring(6, 8);
		});
		that.setData({
			shareList: list,
		});
	},

	beautify_time(timestamp) {
		var mistiming = Math.round(new Date() / 1000) - timestamp / 1000;
		var postfix = mistiming > 0 ? "前" : "后";
		mistiming = Math.abs(mistiming);
		var arrr = ["天", "小时", "分钟", "秒"];
		var arrn = [86400, 3600, 60, 1];
		for (var i = 0; i < arrr.length; i++) {
			var inm = Math.floor(mistiming / arrn[i]);
			if (inm != 0) {
				if (i == 0 && inm > 6) {
					return "";
				} else {
					return inm + arrr[i] + postfix;
				}
			}
		}
	},

	onShareAppMessage: function () {},
});
