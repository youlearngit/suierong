// sub1/pages/account/index.js
var app = getApp();

Page({
	/**
	 * Page initial data
	 */
	data: {
		cdnUrl: app.globalData.CDNURL,
		arr: [
			"企业法人",
			"法人企业分支机构",
			"非法人企业",
			"个体工商户",
			"事业单位",
			"社会团体",
			"党政机关",
			"金融机构",
			"其他",
		],
		arr2: ["基本存款账户", "一般存款账户", "临时存款账户（注册验资）", "临时存款账户（其他）", "专用存款账户"],
		showTips1: false,
		showTips2: false,
		selectedItems: {
			item1: -1,
			item2: -1,
			item3: 1,
			item4: 1,
			item5: 1,
			item6: 1,
			item7: 1,
		},
	},

	onLoad: function (options) {},

	showTips(e) {
	
		let type = e.currentTarget.dataset.type;
		this.setData({
			showTips1: type === "1" ? true : this.data.showTips1,
			showTips2: type === "2" ? true : this.data.showTips2,
		});
	},
	choose(e) {
		let item = "selectedItems.item" + e.currentTarget.dataset.item;
		this.setData({
			[item]: parseInt(e.detail.value, 10),
		});
	},

	toDetail() {
		if (this.data.selectedItems.item1 === -1) {
			wx.showToast({
				title: "请选择客户类型",
				icon: "none",
				duration: 1500,
			});
			return;
		}
		if (this.data.selectedItems.item2 === -1) {
			wx.showToast({
				title: "请选择账户性质",
				icon: "none",
				duration: 1500,
			});
			return;
		}

		wx.navigateTo({
			url: "result?data=" + JSON.stringify(this.data.selectedItems),
		});
	},

	/**
	 * Called when user click on the top right corner to share
	 */
	onShareAppMessage: function () {},
});
