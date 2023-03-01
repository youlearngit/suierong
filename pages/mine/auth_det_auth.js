var util = require("../../utils/util.js");
import user from "../../utils/user";
const app = getApp();
import Order from "../../api/Order";

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		preffixUrl: "",
		userInfo: {},
		hasUserInfo: false,
		canIUse: wx.canIUse("button.open-type.getUserInfo"),
		apply_amount: "", //金额
		enterprise_name: "", //名称
		vouch_type: "", //抵押方式
		purpose: "", //用途
		order_state: "", //订单编号
		apply_term: "", //贷款时长
		enterprise_name1: "", //h
		apply_amount1: "", //h
		applicantName: "",
		applicantIdcard: "",
		applicantIdcard1: "",
		authorizeStatus: "",
		socialCreditCode: "",
		prowId: "",
		pageShow: false,
		authorTime: "",
		authorType: "",
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		//console.log(options);
		this.setData({
			preffixUrl: app.globalData.URL,
			order_state: options.order_state,
			authorizeStatus: options.authorizeStatus == undefined ? "" : options.authorizeStatus,
			socialCreditCode: options.socialCreditCode,
			prowId: options.prowId,
			authorTime: options.authDate,
			enterprise_name1: options.enterpriseName,
			apply_amount1: options.applyAmount,
		});
		var that = this;
		// that.userInfo();
		wx.showLoading({
			title: "加载中...",
			mask: true,
		});
		user.getCustomerInfo().then(res => {
			var customer = res;
			if (customer.REAL_NAME != null && customer.ID_CARD != null) {
				that.setData({
					applicantName: customer.REAL_NAME,
					applicantIdcard: customer.ID_CARD.substring(0, 4) + "****" + customer.ID_CARD.substring(14, 18),
					applicantIdcard1: customer.ID_CARD,
				});

				Order.getOrderInfoByOrderNoWithinWD(that.data.order_state)
					.then(res => {
						wx.hideLoading();
						//console.log(res);
						let autors = res;
						that.setData({
							enterprise_name: autors[0].companyName,
							apply_amount: autors[0].applyAmount,
							apply_term: autors[0].applyTerms,
							vouch_type: autors[0].guaranteeType,
							purpose: autors[0].loanUsage,
						});
						for (let i in autors) {
							if (that.data.applicantIdcard1 == autors[i].authorizerCard) {
								let a = autors[i].authorizerType;
								var aName = "";
								switch (a) {
									case "0":
										aName = "法定代表人";
										break;
									case "1":
										aName = "法人配偶";
										break;
									case "2":
										aName = "企业股东";
										break;
									case "3":
										aName = "其他";
										break;
									case "4":
										aName = "实际控制人";
										break;
									case "5":
										aName = "实际控制人配偶";
										break;
									case "6":
										aName = "企业股东配偶";
										break;
									case "7":
										aName = "第三方抵押人";
										break;
								}
								that.setData({
									authorType: aName,
								});
							}
						}
					})
					.catch(err => {
						//console.log(err);
					});
			}
		});
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		if (wx.getStorageSync("openid") == null || wx.getStorageSync("openid") == "") {
			wx.login({
				success: res => {
					// 发送 res.code 到后台换取 openId, sessionKey, unionId
					util.openid(res.code, app.globalData.URL);
				},
			});
		} else {
			//判断数据库了里是否存在密钥
			wx.request({
				url: app.globalData.URL + "existkey",
				data: {
					sessionId: wx.getStorageSync("sessionid"),
				},
				method: "POST",
				header: {
					"Content-Type": "application/x-www-form-urlencoded",
					key: Date.parse(new Date()).toString().substring(0, 6),
				},
				success(res) {
					if (res.data == undefined || res.data != true) {
						wx.login({
							success: res => {
								// 发送 res.code 到后台换取 openId, sessionKey, unionId
								util.openid(res.code, app.globalData.URL);
							},
						});
					}
				},
				fail() {
					wx.showToast({
						title: "网络异常",
						icon: "none",
						duration: 2000,
					});
				},
			});
		}
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {},

	
	shareTo: function () {},
	userInfo: function () {
		//console.log(app.globalData.userInfo);
		if (app.globalData.userInfo) {
			this.setData({
				userInfo: app.globalData.userInfo,
				hasUserInfo: true,
			});
		} else if (this.data.canIUse) {
			// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
			// 所以此处加入 callback 以防止这种情况
			app.userInfoReadyCallback = res => {
				this.setData({
					userInfo: res.userInfo,
					hasUserInfo: true,
				});
			};
		} else {
			// 在没有 open-type=getUserInfo 版本的兼容处理
		}
	},
	goAuthor: function () {
		//console.log("go");
		var that = this;
		wx.redirectTo({
			url:
				"/pages/mine/auth_det1?orderNo=" +
				that.data.order_state +
				"&applicantIdcard1=" +
				that.data.applicantIdcard1 +
				"&name=" +
				that.data.applicantName +
				"&prowId=" +
				that.data.prowId +
				"&authorizeStatus=" +
				that.data.authorizeStatus +
				"&socialCreditCode=" +
				that.data.socialCreditCode,
		});
	},
});
