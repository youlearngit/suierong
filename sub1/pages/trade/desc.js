// sub1/pages/trade/desc.js
import api from "../../../utils/api";
import util from "../../../utils/util";

const app = getApp();
Page({
	/**
	 * Page initial data
	 */
	data: {
		productId: "",
		maskHidden: true, //控制遮罩层
		imagePath: "", //海报路径
		hidePoster: true, //隐藏海报
	},

	/**
	 * Lifecycle function--Called when page load
	 */
	onLoad: function (options) {
		var that = this;
		that.setData({
			preffixUrl: app.globalData.URL,
		});
		if (options.productId != null && options.productId != undefined) {
			that.setData({
				productId: options.productId,
			});
		}

		api.getSystemInfo(751, 1201, 2.3).then(res => {
			this.setData({
				posterBoxHeight: res.posterBoxHeight,
				posterBoxWidth: res.posterBoxWidth,
				unit: res.unit,
				screenWidth: res.systemInfo.screenWidth,
			});
		});
	},

	//点击分享
	showShare: function () {
		var that = this;
		var isCreat = that.data.imagePath;
		that.setData({
			shareBox: "shareBox on",
		});
		if (isCreat != "") {
			wx.hideToast();
			that.setData({
				hidePoster: false,
			});
		} else {
			wx.showToast({
				title: "海报绘制中...",
				icon: "loading",
				mask: true,
				duration: 20000,
			});
			that.generateCardPoster();
		}
	},

	//取消分享
	showHide: function () {
		var that = this;
		that.setData({
			shareBox: "shareBox",
			hidePoster: true,
		});
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

	/**
	 * 使用生成名片海报
	 */
	generateCardPoster() {
		var that = this;
		const width = that.data.posterBoxWidth / 2.3;
		const height = that.data.posterBoxHeight / 2.3;
		const unit = that.data.unit;
		let img1 = "";
		let img2 = "";

		//get poster background
		let promise1 = new Promise(function (resolve, reject) {
			wx.getImageInfo({
				src: that.data.preffixUrl + "/static/wechat/img/zm/zm_14.png",
				success: function (res) {
					img1 = res.path;
					resolve(res);
				},
				fail: function (res) {
					reject(res);
				},
			});
		});

        // get minicode
        let promise2 = new Promise(function (resolve, reject) {
			if (that.data.qrcodeUrl != "") {
				img2 = that.data.qrcodeUrl;
				resolve();
			} else {
				api.generateMiniCode("sub1/pages/trade/platform", that.data.empNo).then(res => {
					//console.log(res);
					if (res) {
						img2 = res;
						resolve();
					} else {
						reject();
					}
				});
			}
		});
	

		Promise.all([promise1, promise2])
			.then(res => {
				// //console.log("img1", img1); //头像
				// //console.log("img2", img2); //黑色底

				let context = wx.createCanvasContext("mycanvas");

				context.drawImage(img1, 0, 0, width, height);
				context.save();

				context.drawImage(img2, unit * 70, unit * 1050, unit * 128, unit * 128);
				context.save();

				context.draw(false, function () {
					setTimeout(() => {
						wx.canvasToTempFilePath({
							canvasId: "mycanvas",
							x: 0,
							y: 0,
							width: width,
							height: height,
							destWidth: width,
							destHeight: height,
							quality: 1,
							success: a => {
								// //console.log(a.tempFilePath);
								that.setData({
									imagePath: a.tempFilePath,
									hidePoster: false,
								});
								wx.hideLoading();
								wx.hideToast();
							},
							fail: err => {
								wx.hideLoading();
								wx.showToast({
									title: "生成海报失败，请打开重试",
									icon: "none",
									mask: true,
									duration: 200,
								});
								wx.hideToast();
								//console.log(err);
								that.setData({
									hidePoster: true,
								});
							},
						});
					}, 800);
				});
			})
			.catch(err => {
				wx.hideLoading();
				wx.showToast({
					title: "生成海报失败，请打开重试",
					icon: "none",
					mask: true,
					duration: 200,
				});
				//console.log(err);
			});
	},

	viewRules(e) {
		var that = this;
		//console.log(e.currentTarget.dataset.id);
		let id = e.currentTarget.dataset.id;
		let docName = "";
		switch (id) {
			case "sh1":
				docName = "sh1.doc";
				break;
			case "sh2":
				docName = "sh2.docx";
				break;
			case "sh3":
				docName = "sh3.docx";
				break;
			case "js1":
				docName = "js1.doc";
				break;
			case "js2":
				docName = "js2.doc";
				break;
			case "js3":
				docName = "js3.doc";
				break;
			case "ga1":
				docName = "ga1.docx";
				break;
			case "ga2":
				docName = "gy2.doc";
				break;
			default:
				break;
        }
       wx.showToast({
           title: '加载中',
           icon: 'loading',
           image: '',
           duration: 5000,
           mask: true,
           success: (result)=>{
               
           },
           fail: ()=>{},
           complete: ()=>{}
       });
		wx.downloadFile({
			// 示例 url，并非真实存在
			url: app.globalData.URL + "/static/wechat/doc/" + docName,
			success: function (res) {
				//console.log(res);
				const filePath = res.tempFilePath;
				wx.openDocument({
					filePath: filePath,
					success: function (res) {
                        //console.log("打开文档成功");
                        wx.hideToast()
					},
				});
			},
		});
	},

	register() {
		wx.navigateTo({
			url: "regist",
			success: function (res) {},
			fail: function (res) {},
			complete: function (res) {},
		});
	},
});
