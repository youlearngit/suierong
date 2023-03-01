var app = getApp();

Page({
	data: {
		orderNo: "",
		result: "",
        preffixUrl: app.globalData.URL,
        cndUrl:app.globalData.CDNURL,
	},

	onLoad: function (options) {
		this.setData({
			orderNo: options.orderNo,
			result: options.result ? options.result : "",
		});
	},

	reminder() {
		wx.showToast({
			title: "抱歉暂时无法联系客服",
			icon: "none",
			duration: 1500,
			mask: false,
		});
	},
});
