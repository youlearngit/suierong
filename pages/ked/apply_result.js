var util = require("../../utils/util.js");
import user from "../../utils/user";
import Order from "../../api/Order";

const app = getApp();
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		preffixUrl: "", //图片接口
		orderNo: "", //网贷返回的订单号
		amount: "", //申请金额
		term: "", //申请金额
		date: "", //申请金额
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({
			preffixUrl: app.globalData.URL,
		});
		if (options.data != undefined && options.data != null) {
			var data = JSON.parse(options.data);
			this.setData({
				orderNo: data.orderNo,
				amount: data.amount + "万元",
				term: data.term + "个月",
				date: data.date,
			});
		}
		//企业名片制作
		wx.request({
			url: app.globalData.URL + "getuseCard",
			data: { userId: wx.getStorageSync("openid") },
			header: {
				"Content-Type": "application/x-www-form-urlencoded",
				key: Date.parse(new Date()).toString().substring(0, 6),
				sessionId: wx.getStorageSync("sessionid"),
				transNo: "XC008",
			},
			method: "POST",
			success(res) {
				var cardlist = res.data.stringData;
				var cardlist1 = JSON.parse(util.dect(cardlist));
				var taggs = "";
				//console.log("ssssssssssssssssss")
				//console.log(cardlist1)
				//console.log(cardlist1.length)
				for (var x in cardlist1) {
					//console.log(cardlist1[x].ORG_CODE + "ssssssssssssssssss")
					if (cardlist1[x].ORG_CODE == options.orgID) {
						var falg = "1";
						break;
					}
				}
				if (falg == "1") {
					//已经存在相同的企业名片不新增
					//console.log("存在")
				} else {
					//企业名片
					let str = JSON.stringify({
						id_org_id: "id",
						string_org_name: options.orgName, //企业名称
						string_org_code: options.orgID, //统一吗
						string_org_address: options.officeAdd, //企业地址
						string_artificial_name: options.name, //法人姓名
						string_org_tel: options.applicantTel, //申请人电话
						string_zcode: options.loadCardNo,
						string_user_id: wx.getStorageSync("openid"),
					});
					var data = util.enct(str) + util.digest(str);
					wx.request({
						url: app.globalData.URL + "add/card", // 仅为示例，并非真实的接口地址
						data: {
							data: data,
						},
						method: "POST",
						header: {
							"Content-Type": "application/x-www-form-urlencoded",
							key: Date.parse(new Date()).toString().substring(0, 6),
							sessionId: wx.getStorageSync("sessionid"),
							transNo: "XC007",
						},
						success(res) {
							//console.log(res)
						},
					});
				}
			},
		});

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
						string_apply_type: "6",
					});
					Order.addApplyShareInfo(data);
				});
			});
		}
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
	toDetail: function () {
		wx.navigateTo({
			url: "/pages/mine/mine_applicate?orderNo=" + this.data.orderNo + "&type=10",
		});
	},
	backTo: function () {
		this.setData({
			hidden: true,
		});
	},
	// copyText: function (e) {
	//   //console.log(e)
	//   wx.setClipboardData({
	//     data: e.currentTarget.dataset.text,
	//     success: function (res) {
	//       wx.getClipboardData({
	//         success: function (res) {
	//           wx.showToast({
	//             title: '复制成功'
	//           })
	//         }
	//       })
	//     }
	//   })
	// },
});
