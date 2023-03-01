const app = getApp();
import user from '../../utils/user';

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		preffixUrl: app.globalData.URL,

	},

	apli: function () {
		user.getCustomerInfo().then(res => {			
			// let url ='https://wxapptest.jsbchina.cn:9629/account/A08List?id='+res.INT_ID // 测试
			let url = 'https://openservice.jsbchina.cn/account/A08List?id='+res.INT_ID // 生产
			wx.navigateTo({
				url: "/pages/showWeb/showWeb?skipUrl=" + encodeURIComponent(url),
			});
		}).catch(err=>{
			wx.showToast({
				title: '登录失效',
				icon:'none'
			})
		})
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