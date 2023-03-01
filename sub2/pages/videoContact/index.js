// sub2/pages/videoContact/index.js
var app = getApp();
var that;

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		navUrl: 'https://direct.jsbchina.cn/direct/page/index.html?TerminalType=h5#page/100/999/26/01/P9992601.html'
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({
			preffixUrl: app.globalData.URL,
		});
		that = this;
		let RATE = wx.getSystemInfoSync().screenHeight / wx.getSystemInfoSync().screenWidth;
		if (options.type) {
			switch (options.type) {
				case '1':
					that.setData({
						navUrl: 'https://direct.jsbchina.cn/direct/page/index.html?TerminalType=h5#page/100/999/26/01/P9992601.html?id=1'
					})
					break;
				case '2':
					that.setData({
						navUrl: 'https://direct.jsbchina.cn/direct/page/index.html?TerminalType=h5#page/100/999/26/01/P9992601.html?id=2'
					})
					break;
				case '3':
					that.setData({
						navUrl: 'https://direct.jsbchina.cn/direct/page/index.html?TerminalType=h5#page/100/999/26/01/P9992601.html?id=3'
					})
					break;
				default:
					that.setData({
						navUrl: 'https://direct.jsbchina.cn/direct/page/index.html?TerminalType=h5#page/100/999/26/01/P9992601.html'
					})
					break;
			}
		}
		wx.getSystemInfo({
			success: function (res) {
				//model中包含设备信息
				var model = res.model;

				if (model.search("iPhone X") != -1) {
					that.setData({
						autoHeight: "top:" + (RATE * 620 - 68) + "rpx",
						img: "/static/wechat/img/zm/meituan1.jpg",
					});
				} else {
					that.setData({
						autoHeight: "top:" + RATE * 600 + "rpx",
						img: "/static/wechat/img/zm/meituan.jpg",
					});
				}
			},
		});
		this.setData({
			preffixUrl: app.globalData.URL,
			navTop: app.globalData.statusBarTop,
			navHeight: app.globalData.statusBarHeight,
    });
    this.t1()
	},
	t1() {
		wx.navigateTo({
			url: "/pages/showWeb/showWeb?skipUrl=" +
				encodeURIComponent(that.data.navUrl),
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