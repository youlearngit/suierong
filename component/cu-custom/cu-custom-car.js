const app = getApp();
Component({
	/**
	 * 组件的一些选项
	 */
	options: {
		addGlobalClass: true,
		multipleSlots: true,
	},
	/**
	 * 组件的对外属性
	 */
	properties: {
		currentPage: String,
		bgColor: {
			type: String,
			default: "",
		},
		isCustom: {
			type: [Boolean, String],
			default: false,
		},
		isBack: {
			type: [Boolean, String],
			default: false,
		},
		bgImage: {
			type: String,
			default: "",
		},
		backPageSize: {
			type: Number,
			default: 1,
		}
	},
	/**
	 * 组件的初始数据
	 */
	data: {
		StatusBar: app.globalData.StatusBar,
		CustomBar: app.globalData.CustomBar ,
		Custom: app.globalData.Custom,
	},
	/**
	 * 组件的方法列表
	 */
	methods: {
		BackPage() {
			wx.navigateBack({
				delta: this.properties.backPageSize,
			});
		},
		toHome() {
			wx.reLaunch({
				url: "/pages/shop/index2",
			});
		},
	},
	ready() {
		this.setData({
			StatusBar: app.globalData.StatusBar,
			CustomBar: app.globalData.CustomBar,
			Custom: app.globalData.Custom,
		});
	},
});
