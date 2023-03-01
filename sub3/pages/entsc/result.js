
const App = getApp();

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		cndUrl: App.globalData.CDNURL,
		result_start:0,
		result_end:0,
		enterpriseScale:'',
		count:'',
		countOrder:'',
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({
			result_start:Math.round(options.result_start*100)/100,
			result_end:Math.round(options.result_end*100)/100,
			enterpriseScale:options.enterpriseScale,
			count:options.count,
			countOrder:options.countOrder,
		})
	},

	confirmBtn(){
	
		 wx.removeStorageSync('a');
		 wx.removeStorageSync('b');
		 wx.removeStorageSync('c');
		 wx.removeStorageSync('d');
		 wx.removeStorageSync('e');
		 wx.removeStorageSync('f');
		 wx.removeStorageSync('g');
		 wx.removeStorageSync('h');
		 wx.removeStorageSync('i');
		 wx.removeStorageSync('j');
		 wx.removeStorageSync('k');
		 wx.removeStorageSync('l');
		 wx.removeStorageSync('m');

		wx.redirectTo({
			url: '/sub3/pages/entsc/homepage',
		})
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