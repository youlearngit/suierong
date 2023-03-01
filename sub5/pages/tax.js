import requestYT from "../../api/requestYT";
var encr = require('../../utils/encrypt/encrypt'); //国密3段式加密
var aeskey = encr.key //随机数

const App = getApp();
Page({
	data: {
    TimeID: -1,
		url: "",  
		distory: true,
    times: 0,
    typeSH:false,
		apply: "",
		uid: "",
		formId: "",
		ifSendMsg: true,
		sendMeaage: true,
		orderNo: "",
	},

	onLoad: function (options) {
		console.log(options);
		var that = this;
		wx.showLoading({
			title: '正在跳转税务请稍等。。。',
			mask: true
		})
		if (options.proCode != undefined && options.cityCode != undefined) {
			that.setData({
				reurl: options.reurl,
				phone: options.phone,
				orderNo: options.orderNo,
			});
			if ('310000' == options.proCode) {
        that.timmerSh(options.creditCode);
				console.log("上海地区税务授权", options.creditCode);
				let options2 = {
					url: "sui/suiTaxSh.do",
					data: JSON.stringify({
						tyshxydm: options.creditCode,
						openid: wx.getStorageSync("openid"),
					}),
				};

				requestYT(options2)
					.then((res) => {
						console.log('suiTaxSh res', res);
						if (res.result_code == '0000') {
							wx.hideLoading();
							that.setData({
								url: res.h5_homepage,
								apply: options.str,
								uid: res.request_id,
							});
							
						} else if (res.result_code == '1111') {
              const pages = getCurrentPages();
              const prevPage = pages[pages.length - 2]; // 上一页
              // 调用上一个页面的setData 方法，将数据存储
              prevPage.setData({
                typeSH: false,
              });

              wx.navigateBack({});
            } else {

							var res2 = JSON.parse(res.res);
							console.log(res2.msg)
							wx.hideLoading();
							wx.showModal({
								title: "提示",
								content: res2.msg || "小程序异常，请重新打开",
								showCancel: false,
								success: function (res) {},
							});
						}
					})
			} else {
				console.log(App.globalData.URL + "tax",options.proCode,options.cityCode);
				wx.request({
					url: App.globalData.URL + "tax",
					data: {
						proCode: options.proCode,
						cityCode: options.cityCode,
						id: wx.getStorageSync("openid"),
						formId: options.formId,
					},
					success: res => {
						console.log('res.data', res.data);
						if (res.data != undefined && res.data != null && res.data != "") {
							wx.hideLoading();
							that.setData({
								url: res.data,
								apply: options.str,
								uid: options.uid,
							});
							that.timmer(options.creditCode);
						} else {
							wx.hideLoading();
							wx.showModal({
								title: "提示",
								content: "小程序异常，请重新打开",
								showCancel: false,
								success: function (res) {},
							});
						}
					},
				});
			}
		} else {
			wx.showModal({
				title: "提示",
				content: "小程序异常，请重新打开",
				showCancel: false,
				success: function (res) {},
			});
		}
	},
	timmerSh: function (e) {
		//console.log("timmer");
		var that = this;
		setInterval(function () {
			if (that.data.distory) {
				//console.log(that.data.times);
				that.setData({
					times: that.data.times + 1,
				});
				if (that.data.times > 2000) {
					wx.navigateBack({
						delta: 1,
					});
					wx.showModal({
						title: "提示",
						content: "页面过期，请重新进入",
						showCancel: false,
						success: function (res) {},
					});
				}

				if (that.data.times > 2) {

					let m = JSON.stringify({
						request_id: e
          })
          console.log(e);
					let l = encr.jiami(m, aeskey)

					wx.request({
						url: App.globalData.YTURL + 'sui/taxresultSh.do',
						data: encr.gwRequest(l),
						method: 'POST',
						success(res) {
							var jsonData = encr.aesDecrypt(res.data.body, aeskey)
							console.log('jsonData', jsonData)

							if (jsonData.result_code != '2012') {
								if (jsonData.result_code == '0000') {
									that.setData({
										ifSendMsg: false,
									});
									if (that.data.reurl == "./fillInInformation") {
										//console.log("1~~~~~~~~~~~~~~~~");
										const pages = getCurrentPages();
										const prevPage = pages[pages.length - 2]; // 上一页
										// 调用上一个页面的setData 方法，将数据存储
										prevPage.setData({
											taxflag: true,
										});

										wx.navigateBack({});
									} else {
										wx.redirectTo({
											url: that.data.reurl,
										});
									}
								} else if (jsonData.result_code == '1111') {
                  const pages = getCurrentPages();
                  const prevPage = pages[pages.length - 2]; // 上一页
                  // 调用上一个页面的setData 方法，将数据存储
                  prevPage.setData({
                    typeSH: false,
                  });

                  wx.navigateBack({});
                 
                  
                } 
							} else {
								wx.showModal({
									title: "提示",
									content: jsonData.result_msg,
									showCancel: false, //是否显示取消按钮
									success: function (res) {
										wx.navigateBack({});
									},
								});
							}

						}
					})

				}
			}
		}, 1000);
	},
	onHide: function () {
		var that = this;
		this.setData({
			distory: false,
		});
		if (that.data.ifSendMsg && that.data.phone) {
			that.sendMeaage(that.data.phone);
		}
	},

	onUnload: function () {
		var that = this;
		this.setData({
			distory: false,
		});

		if (that.data.ifSendMsg && that.data.phone) {
			that.sendMeaage(that.data.phone);
		}
	},

	sendMeaage(phone) {
		var that = this;
		console.log("发送提示短信", phone);
		let options = {
			url: "myr/sendMsg.do",
			data: JSON.stringify({
				phone: phone,
				orderNum: that.data.orderNo,
			}),
		};
		return requestYT(options).then(res => {
			if (res.STATUS === "1") {
				// console.log("phoneMsg/sendSuiMsg.do", res);
				// return res.resultVo[0].OPEN_ID;
			} else {
				return Promise.reject("unGetOpenIdByID");
			}
		});
	},

	timmer: function (e) {
		//console.log("timmer");
		var that = this;
		setInterval(function () {
			if (that.data.distory) {
				//console.log(that.data.times);
				that.setData({
					times: that.data.times + 1,
				});
				if (that.data.times > 200) {
					wx.navigateBack({
						delta: 1,
					});
					wx.showModal({
						title: "提示",
						content: "页面过期，请重新进入",
						showCancel: false,
						success: function (res) {},
					});
				}

				if (that.data.times > 5) {
					wx.request({
						url: App.globalData.URL + "gettaxresult2",
						data: {
							data: e,
							openid: wx.getStorageSync("openid"),
						},
						success: res => {
							console.log(res);
							if (res.data.code != 0) {
								//没有记录到数据库
								if (res.data.code != 1) {
									wx.navigateBack({});
									return
								}
								if (res.data.code == 1) {
									that.setData({
										ifSendMsg: false,
									});
									if (that.data.reurl == "./fillInInformation") {
										//console.log("1~~~~~~~~~~~~~~~~");
										const pages = getCurrentPages();
										const prevPage = pages[pages.length - 2]; // 上一页
										// 调用上一个页面的setData 方法，将数据存储
										prevPage.setData({
											taxflag: true,
										});

										wx.navigateBack({});
									} else {
										wx.redirectTo({
											url: that.data.reurl,
										});
									}
								} else {
									wx.showModal({
										title: "提示",
										content: res.data.msg,
										showCancel: false, //是否显示取消按钮
										success: function (res) {
											wx.navigateBack({});
										},
									});
								}
							}
						},
					});
				}
			}
		}, 1000);
	},
});