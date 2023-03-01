import requestYT from "../../../api/requestYT";
var encr = require('../../../utils/encrypt/encrypt'); //国密3段式加密
var aeskey = encr.key //随机数
const App = getApp();
Page({
	data: {
		url: "",
		distory: true,
		times: 0,
		apply: "",
		uid: "",
		formId: "",
		ifSendMsg: true,
		sendMeaage: true,
		orderNo: "",
	},

	onLoad: function (options) {
		//console.log(options);
		var that = this;
		if (options.proCode != undefined && options.cityCode != undefined) {
			that.setData({
				reurl: options.reurl,
				phone: options.phone,
				orderNo: options.orderNo,
				creditCode: options.creditCode,
			});
			console.log('options',options)
			if('310000' == options.proCode){
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
					console.log('suiTaxSh res',res);
					if (res.result_code == '0000') {
						that.setData({
							url: res.h5_homepage,
							apply: options.str,
							uid: res.request_id,
						});
						 that.timmerSh(options.creditCode);
					} else {
						var res2 = JSON.parse(res.res);
						console.log(res2.msg)
						
							wx.showModal({
								title: "提示",
								content: res2.msg ||"小程序异常，请重新打开",
								showCancel: false,
								success: function (res) {},
							});
						}
				})
			}else{
				wx.request({
					url: App.globalData.URL + "tax",
					data: {
						proCode: options.proCode,
						cityCode: options.cityCode,
						id: wx.getStorageSync("openid"),
						formId: options.formId,
					},
					success: res => {
						//console.log(res.data);
						if (res.data != undefined && res.data != null && res.data != "") {
							that.setData({
								url: res.data,
								apply: options.str,
								uid: options.uid,
							});
							that.timmer(options.creditCode);
						} else {
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
			url: "phoneMsg/sendSuiMsg.do",
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
							if (res.data.code != 0) {
								//没有记录到数据库
								if (res.data.code == 1) {
									that.setData({
										ifSendMsg: false,
									});
									if (that.data.reurl == "../sui/confirm" || "../auth/index") {
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
						request_id: that.data.creditCode
				})
				let l = encr.jiami(m, aeskey)

					wx.request({
						url: App.globalData.YTURL + 'sui/taxresultSh.do',
						data: encr.gwRequest(l),
						method: 'POST',
						success(res) {
								var jsonData = encr.aesDecrypt(res.data.body, aeskey)
								console.log('jsonData',jsonData)

								if(jsonData.result_code != '2012'){
									if(jsonData.result_code == '0000'){
										that.setData({
											ifSendMsg: false,
										});
										if (that.data.reurl == "../sui/confirm" || "../auth/index") {
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
});
