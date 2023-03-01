// sub1/pages/message/index.js
// import requestP from "../../../utils/requsetP";
// import skip from "../../../utils/skip";

// import util from "../../../utils/util";
// import api from "../../../utils/api";
// import myCanvas from "../../../utils/canvas";
// import productDesc from "../../../utils/product";
// import wxp from "../../../utils/wxp";
// import MYURLS from "../../../utils/urls";

// var QQMapWX = require("../../../assets/plugins/qqmap-wx-jssdk1.2/qqmap-wx-jssdk.js");
// var qqmapsdk;
const app = getApp();
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		CustomBar: app.globalData.StatusBar,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({
			preffixUrl: app.globalData.URL,
			currentPage: getCurrentPages().length,
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
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {},
});
