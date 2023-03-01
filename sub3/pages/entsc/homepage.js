const App = getApp();

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		cndUrl: App.globalData.CDNURL,
		calculate:true
	},

	test(){
		wx.navigateTo({
			url: '/sub3/pages/entsc/video',
		})
	},

	First(){
		if(getCurrentPages().length>=10){
			wx.redirectTo({
				url: '/sub3/pages/entsc/typeQuery',
			})
		}else{
			wx.navigateTo({
				url: '/sub3/pages/entsc/typeQuery',
			})
		}
	},

	Second(){
		if(getCurrentPages().length>=10){
			wx.redirectTo({
				url: '/sub3/pages/entsc/discountQuery',
			})
		}else{
			wx.navigateTo({
				url: '/sub3/pages/entsc/discountQuery',
			})
		}
	},

	Third(){
		if(getCurrentPages().length>=10){
			wx.redirectTo({
				url: '/sub3/pages/entsc/select?calculate='+this.data.calculate,
			})
		}else{
			wx.navigateTo({
				url: '/sub3/pages/entsc/select?calculate='+this.data.calculate,
			})
		}
		
	},
	
	Four() {
		if(getCurrentPages().length>=10){
			wx.redirectTo({
				url: '/sub3/pages/entsc/video',
			})
		}else{
			wx.navigateTo({
				url: '/sub3/pages/entsc/video',
			})
		}

	},
	
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		// console.log('历史记录',getCurrentPages().length);
	//	wx.hideHomeButton();

		
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
		wx.hideHomeButton();
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