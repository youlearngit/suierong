// sub1/component/poster/index.js
import api from "../../../utils/api";
var app = getApp();

Component({
	/**
	 * Component properties
	 */
	properties: {
		shareBox: {
			type: String,
			value: "shareBox",
		},
		hidePoster: {
			type: [Boolean, String],
			default: true,
		},
		imagePath: {
			type: String,
			value: "",
		},
		imageTop: {
			type: String,
			value: "0rpx",
        },
        top:{
            type: String,
			value: "10vh",
        },
        height:{
            type: String,
			value: "75vh",
        }
	},

	/**
	 * Component initial data
	 */
	data: {
		shareBox: "shareBox",
		hidePoster: true,
		imagePath: "",
		preffixUrl: app.globalData.URL,
	},

	pageLifetimes: {
		// 组件所在页面的生命周期函数
		show: function () {
			wx.getSystemInfo({
				success: res => {
					//console.log(res);
					this.setData({
						imageTop: res.windowHeight - 610 + "rpx",
					});
				},
				fail: () => {},
				complete: () => {},
			});
		},
		hide: function () {},
		resize: function () {},
	},

	lifetimes: {
		attached: function () {
			// 在组件实例进入页面节点树时执行
		},
		detached: function () {
			// 在组件实例被从页面节点树移除时执行
		},
	},

	/**
	 * Component methods
	 */
	methods: {
		previewPoster() {
			var that = this;
			wx.previewImage({
				current: that.data.imagePath, // 当前显示图片的http链接
				urls: [that.data.imagePath], // 需要预览的图片http链接列表
			});
		},

		//取消分享
		showHide: function () {
			var that = this;
			that.setData({
				shareBox: "shareBox",
				hidePoster: true,
			});

			that.triggerEvent("cancel", "cancel");
		},

		/**
		 * 点击保存到相册
		 */
		baocun() {
			var that = this;
			api
				.saveImage(that.data.imagePath)
				.then(res => {
					that.setData({
						shareBox: "shareBox",
						hidePoster: true,
					});
				})
				.catch(err => {
					console.error(err);
				});
		},
	},
});
