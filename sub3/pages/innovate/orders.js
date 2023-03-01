// sub3/pages/innovate/orders.js
var app = getApp();
import utils from './utils';
import innovation from './innovation';

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		preffixUrl: utils.preffixUrl(),
		
		mine: {},
		orders: false,

		popup_howuse: {show:false}, // 如何使用

	},

	popupEvent(e) {
		let {event,action} = e.currentTarget.dataset;

		switch(action) {
			default:{
				this.setData({ [event+'.show']: !this.data[event].show });
			}break;
		}

	},

	async dataInit(e) {
		let {mine,orders} = this.data;
		let res;
		mine = await innovation.getMine();
		res = await innovation.selectOrder({OPENID:mine.OPEN_ID});
		orders = res.LIST || [];
		if (orders.length>0) {
			orders = orders.filter(x=>x.STATUS!="0");
			orders = orders.map(x=>{
				x.remark1s = JSON.parse(x.REMARK1);
				return x;
			})
		}
		this.setData({mine,orders});
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.dataInit();
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
		this.dataInit().then(res=>{
			wx.stopPullDownRefresh();
		});
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