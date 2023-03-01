// pages/dian/submit_suc.js
import Order from "../../api/Order";
import user from "../../utils/user";

const app = getApp();
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		preffixUrl: "",
		orderID: "",
		orgId: "",
		date: "",
		amount: "",
		term: "",
		nianlvli: "",

		idcard: "", //身份证号码
		phone1: "",
		no: "",
		nick_name: "",
		real_name: "",
		tel: "",
		//money:"",
		//times:"",
		//date:""
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		if (
			app.globalData.share_person != undefined &&
			app.globalData.share_person != null &&
			app.globalData.share_person != ""
		) {
			user.getCustomerInfo(app.globalData.share_person).then(res => {
				this.setData({
					idcard: res.ID_CARD ? res.ID_CARD : "",
					nick_name: res.NICK_NAME ? res.NICK_NAME : "",
					real_name: res.REAL_NAME ? res.REAL_NAME : "",
					tel: res.TEL ? res.TEL : "",
				});
				Order.getLatestApplyID().then(res => {
					let data = JSON.stringify({
						id_ID: "id",
						string_sharer_open_id: app.globalData.share_person, //分享人open_id
						string_sharer_nice_name: this.data.nick_name, //分享人昵称
						string_sharer_name: this.data.real_name, //分享人真实姓名
						string_sharer_id_card_no: this.data.id_card, //分享人身份证号码
						string_sharer_phone_number: this.data.tel, //分享人手机号码
						string_open_id: wx.getStorageSync("openid"), //申请人open_id
						string_apply_id: res[0].A_ID, //产品编号
						string_apply_type: "2",
					});
					Order.addApplyShareInfo(data);
				});
			});
		}

		function setMoney(num) {
			var reg = /\d{1,3}(?=(\d{3})+$)/g;
			return (num + "").replace(reg, "$&,");
		}
		var jine = options.amount * 10000;
		this.setData({
			preffixUrl: app.globalData.URL,
			date: options.date,
			amount: setMoney(jine),
			term: options.term,
			nianlvli: options.nianlvli,
			//orgId: options.orgId
		});
		wx.showToast({
			title: "加载中...",
			icon: "loading",
			duration: 20000,
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
		wx.hideToast();
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {},

	indexpage: function () {
		wx.switchTab({
			url: "/pages/shop/index2",
		});
	},
	toDetail: function () {
		wx.navigateTo({
			url: "/pages/mine/mine_applicate?orderNo=" + this.data.orderID,
		});
	},
	copyText: function (e) {
		//console.log(e)
		wx.setClipboardData({
			data: e.currentTarget.dataset.text,
			success: function (res) {
				wx.getClipboardData({
					success: function (res) {
						wx.showToast({
							title: "复制成功",
						});
					},
				});
			},
		});
	},
});
