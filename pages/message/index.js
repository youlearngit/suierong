// sub1/pages/message/index.js
import requestP from "../../utils/requsetP";
// import skip from "../../../utils/skip";
var encr = require("../../utils/encrypt/encrypt"); //国密3段式加密
var aeskey = encr.key; //随机数
import util from "../../utils/util";
// import api from "../../../utils/api";
// import myCanvas from "../../../utils/canvas";
// import productDesc from "../../../utils/product";
// import wxp from "../../../utils/wxp";
// import MYURLS from "../../../utils/urls";

// var QQMapWX = require("../../../assets/plugins/qqmap-wx-jssdk1.2/qqmap-wx-jssdk.js");
// var qqmapsdk;

import Chat from "../../api/Chat";

var myPerformance = require("../../utils/performance.js");

var that;

const app = getApp();
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		CustomBar: app.globalData.StatusBar,
		loginFlag: true,
		unReadMsg: "",
        CustomBar: app.globalData.CustomBar + 24,
		cndUrl: app.globalData.CDNURL,
        
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		that = this;
		myPerformance.reportBegin(2019,'message_index');
		this.setData({
			preffixUrl: app.globalData.URL,
			currentPage: getCurrentPages().length,
			agentNo: app.globalData.empNo,
		});
		myPerformance.reportEnd(2019,'message_index');
	},

	onShow() {
		const chat = new Chat();
		chat
			.getUnreadNum()
			.then(res => {
				// console.log("getUnreadNum", res);
				that.setData({
					unReadMsg: res.NUM_UNREAD,
				});
			})
			.catch(err => {
				console.log(err);
			});
	},

	developing() {
		wx.showToast({
			title: "敬请期待",
			icon: "none",
			image: "",
			duration: 1500,
			mask: false,
			success: result => {},
			fail: () => {},
			complete: () => {},
		});
	},
	/**
	 * 获取个人实名认证信息
	 */

	contact() {
		var that = this;
		wx.showLoading({
			title: "正在跳转",
			mask: true,
		});
		let chat = new Chat();
		return chat
			.toChatList(that.data.agentNo)
			.then(() => {
				wx.hideLoading();
			})
			.catch(err => {
				if (err === "unLogin") {
					that.setData({
						loginFlag: false,
					});
					wx.hideLoading();
				}
			});
	},
});
