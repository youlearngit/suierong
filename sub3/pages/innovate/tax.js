// sub3/pages/innovate/tax.js
var app = getApp();
import utils from './utils';
import innovation from './innovation';

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		mine: {},
		tax_url: "",

		city_code: "",
		org_code: "",

		wait_inter: false,
		wait_sec: 0,

	},

	async taxInit(e) {
		let {mine,tax_url,city_code} = this.data;
		let res;

		mine = await innovation.getMine();
		this.setData({mine});

		try {
			res = await innovation.taxUrl(mine.OPEN_ID, city_code);
			tax_url = res;
			this.setData({tax_url});
			this.taxInterInit();
		} catch (err) {
			wx.showModal({
				title: "提示",
				content: "小程序异常，请重新打开",
				showCancel: false,
				success: function (res) {},
			});
		}
		
	},

	taxInterClear(e) {
		let {wait_inter} = this.data;
		if (wait_inter) {
			clearInterval(wait_inter);
			this.setData({wait_inter:false});
		}
	},

	taxInterInit(e) {
		let {wait_inter,wait_sec,mine,org_code} = this.data;
		let that = this;
		if (!wait_inter) {
			wait_inter = setInterval(()=>{
				wait_sec++;
				that.setData({wait_sec});
				
				if (wait_sec > 200) { // 200
					wx.navigateBack({
						delta: 1,
					});
					wx.showModal({
						title: "提示",
						content: "页面过期，请重新进入",
						showCancel: false,
						success: function (res) {},
					});
					return;
				}

				if (wait_sec > 5) {
					innovation.taxRes(mine.OPEN_ID,org_code).then(res=>{
						if (res.code != 0) {
							if (res.code == 1) { // 税务验证成功
								app.innovate_tax_callback(res);
							} else { // 税务验证失败
								wx.showModal({
									title: "提示",
									content: res.msg,
									showCancel: false,
									success: function (res) {
										wx.navigateBack({});
									},
								});
							}
						} else {
							// {code: 0, msg: "还未授权"}
						}

						// if (wait_sec>10) { // test@xwl
						// 	app.innovate_tax_callback({code:1,msg:"test"});
						// }
					});
				}

			},1000);
			this.setData({wait_inter});
		}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let {reUrl,areaCode,orgCode} = options;
		let {city_code,org_code} = this.data;
		city_code = areaCode ? areaCode.substr(0,4)+"00" : ""; // 城市码 eg.320100
		org_code = orgCode || ""; // 企业码 eg.91320114580471246H
		if (!city_code || !org_code) {
			wx.showModal({
				title: "提示",
				content: "小程序异常，请重新打开",
				showCancel: false,
				success: function (res) {
					wx.navigateBack({});
				},
			});
			return;
		}
		this.setData({ city_code, org_code });

		this.taxInit(options);

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
		this.taxInterClear();
		if (app.innovate_tax_notify_callback) { app.innovate_tax_notify_callback() }
	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {
		this.taxInterClear();
		if (app.innovate_tax_notify_callback) { app.innovate_tax_notify_callback() }
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