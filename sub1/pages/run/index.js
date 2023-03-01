import api from "../../../utils/api";
import util from "../../../utils/util";

var app = getApp();

Page({
	/**
	 * Page initial data
	 */
	data: {
		cdnurl: app.globalData.CDNURL,
		status: false,
		loading: true,
		num: 3,
		errMsg: "",
	},

	onLoad: function (options) {
		var that = this;
	},

	onShow() {
		var that = this;
		if (wx.getStorageSync("openid")==="") {
			console.log("noopendi");
			api.getSessionInfo().then(() => {
				that.getSteps();
			});
		} else {
			that.getSteps();
		}
	},

	getSteps() {
        var that= this
		wx.getWeRunData({
			success(res) {
				console.log("canOpenApp", app.globalData.canOpenApp);
				that.setData({
					showBackApp: app.globalData.canOpenApp,
				});
				let c = setInterval(() => {
					let num = that.data.num;

					if (num === 1) {
						that.setData({
							loading: false,
							num: 3,
						});
						clearInterval(c);
					} else {
						that.setData({
							num: num - 1,
						});
					}
				}, 1000);
				// console.log("enc",res.encryptedData);
				// console.log("iv",res.iv);
				api
					.decryptData(res.encryptedData, res.iv)
					.then(res => {
						console.log(2, res);
						that.setData({
							status: true,
						});
						let todayStepInfo = res.stepInfoList[res.stepInfoList.length - 1];
						console.log(util.formatTime(new Date(parseInt(todayStepInfo.timestamp) * 1000)), todayStepInfo.step);
						that.setData({
							steps: todayStepInfo.step,
						});
					})
					.catch(err => {
						console.log(1, err);
						that.setData({
							status: false,
						});
					});
			},
			fail(err) {
				console.log(err);
				if (err.errMsg === "getWeRunData:fail auth deny" || err.errMsg === "getWeRunData:fail:auth denied" || err.errMsg === "getWeRunData:fail:auth deny" || err.err_code=== "-12006" ) {
					wx.showModal({
						title: "提示",
						content: "您点击了拒绝授权，将无法同步数据",
						showCancel: false,
						confirmText: "返回授权",
						success: function (res) {
							console.log(res);
							if (res.confirm) {
								wx.openSetting({
									success(res) {
										console.log(res.authSetting);
									},
								});
							}
						},
					});
				}
			},
		});
	},

	launchAppError(e) {
		console.log(2);

		console.log(e.detail.errMsg);
	},
	launchAppSuccess(e) {
		console.log(1);
		console.log(e);
	},
});
