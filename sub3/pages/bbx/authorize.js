// sub3/pages/bbx/authorize.js
var app = getApp();
import utils from './utils';
import talent from './talent';
import user from '../../../utils/user';
import api from '../../../utils/api';

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		preffixUrl: utils.preffixUrl(),

	},

	cancel(e) {
		wx.switchTab({
			url: "/pages/shop/index2", // 小程序首页
		})
	},

	async phoneGet(e) {
		wx.showLoading({
		  	title: '授权中...',
		});

		let phone = await talent.phoneDecrypt(e);
		if (!phone) {
			wx.showToast({
				title: '请授权手机号',
				icon: 'none',
				duration: 2000,
			});
			return;
		}

		wx.hideLoading();
		wx.navigateBack();
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

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