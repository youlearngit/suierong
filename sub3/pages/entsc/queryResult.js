const app =getApp()

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		cndUrl: app.globalData.CDNURL,
		type:'',
		num: '',
		numOrder:'',
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({
			type:options.enterpriseScale,
			num:options.sum,
			numOrder:options.sumOrder,
		})
	},

	onshow(){
		if(getCurrentPages().length>=10){
			wx.redirectTo({
				url: '/sub3/pages/entsc/discountQuery?enterpriseScale='+this.data.type,
			})
		}else{
			wx.navigateTo({
				url: '/sub3/pages/entsc/discountQuery?enterpriseScale='+this.data.type,
			})
		}
	},

	buttonRight(){
		if(getCurrentPages().length>=10){
			wx.redirectTo({
				url: '/sub3/pages/entsc/calculate?enterpriseScale='+this.data.type,
			})
		}else{
			wx.navigateTo({
				url: '/sub3/pages/entsc/calculate?enterpriseScale='+this.data.type,
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