// sub3/pages/innovate/empower_res.js
var app = getApp();
import utils from './utils';
import innovation from './innovation';

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		preffixUrl: utils.preffixUrl(),

		img_type: "suc",
		title: "授权成功",
		tip: "你的创新券相关协议已授权成功",
		btn_title: "完成",

		re_url: "",

	},

	btnConfirm(e) {
		let {re_url} = this.data;
		if (re_url) {
			wx.redirectTo({ url: re_url });
		} else {
			wx.navigateBack({});
		}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let {type,reUrl} = options;

		if (reUrl) {
			this.setData({re_url:reUrl});
		}
		
		if (type=="fail") {
			this.setData({
				img_type: "fail",
				title: "授权失败",
				tip: "你的创新券相关协议授权失败",
				btn_title: "返回",
			})
		}

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