// sub3/pages/innovate/result.js
var app = getApp();
import utils from './utils';
import innovation from './innovation';

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		preffixUrl: utils.preffixUrl(),

		success: true,
		title: '',
		tip: '',
		btn_title: '',

	},

	btnConfirm(e) {
		let {success} = this.data;
		if (success) {
			wx.redirectTo({
				url: '/sub3/pages/innovate/home',
		  })
		} else {
			wx.navigateBack({});
		}
	},

	initData(e) {
		let {success} = this.data;
		if (success) {
			this.setData({
				title: '申请成功',
				tip: '恭喜你的创新券申请成功',
				btn_title: '完成',
			})
		} else {
			this.setData({
				title: '申请失败',
				tip: '抱歉，你的创新券申请失败',
				btn_title: '返回',
			})
		}

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let {type} = options;
		let {success} = this.data;	
		if (type=="fail") {
			success = false;
		} else {
			success = true;
		}
		this.setData({success})
		this.initData();
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