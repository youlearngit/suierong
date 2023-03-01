
var myPerformance = require("../../../utils/performance.js");

Page({
	data: {
		skipUrl: "",
	},
	onLoad(options) {
    wx.showLoading({
      title: '跳转中...',
      mask: true
    });
		myPerformance.reportBegin(2002,'sub1_consumer_web');
		this.setData({
			skipUrl: decodeURIComponent(options.skipUrl),
		});
    myPerformance.reportEnd(2002,'sub1_consumer_web');
    wx.hideLoading();
	},
});
