// sub1/pages/crossBorderE/listInfo.js
// pages/cloud/index.js
const util = require("../../../utils/util");
import http from "../../../utils/requsetP.js";
import MYURLS from "../../../utils/urls";
import requestP from "../../../utils/requsetP";
var that;
var app = getApp();
import api from "../../../utils/api"
import User from '../../../utils/user.js';
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		index: 31,
		imgUrl: "static/wechat/img/zm/zm_31.jpg",
		loginFlag: true, //授权提示控制
		canIUse: wx.canIUse("button.open-type.getUserInfo"),
		userInfo: {},
		number: 2000000,
		timer: "",
		shareBox: "shareBox",
		submit: true,
		maskHidden: true,
		nick: "", //授权昵称
		avatar: "", //授权头像
		wechat: "", //本详情页二维码
		bg: "/static/wechat/img/zmy_poster.png", //图片背景图
		//touxiang: "/pages/public/img/temp/touxiang.jpg",//头像路径
		maskHidden: true, //控制遮罩层
		imagePath: "", //存放canvas生成的图片
		canvasId: "mycanvas",
		preffixUrl: "",
		path: "",
		newbg: "",
		scene: "",
		unit: 0,
		phoneNumber: "",
		type: "",
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		that = this;
		this.setData({
			preffixUrl1: app.globalData.URL,
			preffixUrl: app.globalData.JSBURL,
			navTop: app.globalData.statusBarTop,
			navHeight: app.globalData.statusBarHeight,
		});

		if (options.id != undefined) {
			let url = "static/wechat/img/zm/zm_" + options.id + ".jpg";
			that.setData({
				imgUrl: url,
				index: options.id,
			});
		}

		if (options.scene != undefined && options.scene.length == "2") {
			let url = "static/wechat/img/zm/zm_" + options.scene + ".jpg";
			that.setData({
				imgUrl: url,
				index: options.scene,
			});
		}
		// if (this.data.phoneNumber != "") {
		//     this.getPhone();
		// }
	},

	cc() {
		wx.showModal({
			showCancel: false,
			title: "提示",
			content: "敬请期待...",
			success: function (res) {},
		});
	},
	indexpage() {
		wx.switchTab({
			url: "/pages/shop/scheme",
		});
	},
	prePage() {
		wx.navigateBack({
			delta: 0,
		});
	},
	toCross() {
		wx.navigateTo({
			url: "/sub1/pages/crossBorderE/list",
		});
	},
	toCCY(phoneNumber) {
		var that = this;
		let str = JSON.stringify({
			channelUserId: wx.getStorageSync("openid"),
			channelNo: "XCX",
		});
		http
			.requestP({
				url: this.data.preffixUrl + "toCCY",
				method: "get",
				data: {
					merchantNo: "2019101100001",
					custNo: phoneNumber,
					custType: "phone",
					time: "",
					transData: str,
				},
			})
			.then(res => {
				// //console.log("获取的sign为", res.signedStr)
				var sendStr = {
					merchantNo: "2019101100001", // 商户号
					custNo: phoneNumber, // 客户号，此处传手机号
					custType: "phone", // 客户号类别，此处固定为phone
					time: res.time, // 时间戳
					sign: res.signedStr, // 签名信息
					signType: "RSA",
					transData: str, //床底数据
				};
				let data = JSON.stringify(sendStr);
				let url = MYURLS.Urls.zmydt;
				wx.navigateTo({
					url: "../showWeb/showWeb?skipUrl=" + encodeURIComponent(url) + "&sendStr=" + encodeURIComponent(data),
				});
			})
			.catch(err => {
				//console.log("获取验签数据异常", err);
			});
	},

	onShow() {
		var that = this;
	},

	navTo() {
		var that = this;
		let phoneNumber = that.data.phoneNumber;
		if (phoneNumber != "") {
			wx.showModal({
				title: "提示",
				content: phoneNumber + "是否是您的手机号码，若否请修改",
				cancelText: "修改",
				success(res) {
					if (res.confirm) {
						that.toCCY(phoneNumber);
					}
					if (res.cancel) {
						wx.navigateTo({
							url: "ydt?type=" + that.data.type + "&type2=2", //0是XIUGAI
						});
					}
				},
			});
		} else {
			wx.navigateTo({
				url: "ydt?type=" + that.data.type + "&type2=2", //0是XIUGAI
			});
		}
	},

	

	

	toApply() {
		wx.navigateTo({
			url: "register",
		});
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		this.setData({
			shareBox: "shareBox on",
		});
		// var title = "跨境e点通";
		// var path = "/sbu2/pages/cloud/businessCloud";
		// var imgUrl = this.data.imagePath;
		// return {
		//     title: title,
		//     path: path,
		//     imageUrl: imgUrl,
		//     success: function (res) {},
		//     fail: function (res) {
		//         //console.log("用户点击了取消", res);
		//     },
		// };
	},

	//点击分享
	showShare(e) {
		var that = this;
		// 查看是否授权
            User.ifAuthUserInfo().then(res=>{
            if(res){
                that.setData({
                    nick: app.globalData.userInfo.nickName, //授权昵称
                    avatar: app.globalData.userInfo.avatarUrl,
                });

                var isCreat = that.data.imagePath;
                that.setData({
                    shareBox: "shareBox on",
                });
                if (isCreat != "") {
                    wx.hideToast();
                } else {
                    wx.showToast({
                        title: "海报绘制中...",
                        icon: "loading",
                        mask: true,
                        duration: 20000,
                    });
                    that.showCreat();
                }
            }else{
                that.setData({
                    loginFlag: false,
                });
            }
        })
	},
	cloudSearch() {
		var that = this;
		let phoneNumber = that.data.phoneNumber;
		if (phoneNumber != "") {
			wx.showModal({
				title: "提示",
				content: phoneNumber + "是否是您的手机号码，若否请修改",
				cancelText: "修改",
				success(res) {
					if (res.confirm) {
						wx.navigateTo({
							url: "internationalSearch?phoneNumber=" + phoneNumber,
						});
					}
					if (res.cancel) {
						wx.navigateTo({
							url: "ydt?type=0&type2=1", //0是XIUGAI
						});
					}
				},
			});
		} else {
			wx.navigateTo({
				url: "ydt?type=1", //1是添加
			});
		}
	},
	//取消分享
	showHide: function () {
		var that = this;
		that.setData({
			shareBox: "shareBox",
		});
	},
	//点击生成海报按钮function
	showCreat: function (e) {
		var that = this;
		// that.createNewImg();
		that.generateCardPoster();
	},
	//点击保存到相册
	baocun: function () {
		var that = this;
		////console.log(that.data.imagePath)
		wx.saveImageToPhotosAlbum({
			filePath: that.data.imagePath,
			success(res) {
				wx.showModal({
					content: "图片已保存到相册，赶紧晒一下吧~",
					showCancel: false,
					confirmText: "好的",
					confirmColor: "#333",
					success: function (res) {
						if (res.confirm) {
							// //console.log('用户点击确定');
							that.setData({
								maskHidden: true,
								shareBox: "shareBox",
							});
						}
					},
					fail: function (res) {
						// //console.log(res);
					},
				});
			},
			fail(res) {
				if (
					res.errMsg === "saveImageToPhotosAlbum:fail auth deny" ||
					res.errMsg === "saveImageToPhotosAlbum:fail:auth denied" ||
					res.errMsg === "saveImageToPhotosAlbum:fail authorize no response"
				) {
					wx.showModal({
						title: "提示",
						content: "需要您授权保存相册",
						showCancel: false,
						success: modalSuccess => {
							wx.openSetting({
								success(settingdata) {
									if (settingdata.authSetting["scope.address.writePhotoAlbum"]) {
										//console.log("获取权限成功");
									} else {
										console.error("获取权限失败");
									}
								},
							});
						},
					});
				}
			},
		});
	},

	/**
	 * 使用生成名片海报
	 */
	generateCardPoster() {
		var that = this;
		const width = that.data.posterBoxWidth / 2.3;
		const height = that.data.posterBoxHeight / 2.3;
		let unit = that.data.unit;
		let img1 = "";
		let img2 = "";
		let img3 = "";
		let token = "";
		//get poster background
		let promise1 = new Promise(function (resolve, reject) {
			wx.getImageInfo({
				src: app.globalData.URL + that.data.imgUrl,
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
				api.generateMiniCode("sub2/pages/crossBorderE/listInfo").then(res => {
					//console.log(res);
					if (res) {
						img2 = res;
						resolve();
					} else {
						reject();
					}
				});
		});
		

		Promise.all([promise1, promise2])
			.then(res => {
				// //console.log("img1", img1); //头像
				// //console.log("img2", img2); //黑色底

				// 获取用户头像信息
				wx.getImageInfo({
					src: that.data.avatar,
					success(res) {
						// //console.log('"img3",', res);
						img3 = res.path;
						// unit = 1;
						wx.getSystemInfo({
							success: function (res) {
								// //console.log('sysinfo', res);
								if (res.system.indexOf("Android") >= 0) {
									unit = res.screenWidth / 411;
								} else {
									unit = res.screenWidth / 375;
								}
								// //console.log('unit', unit);
							},
						});

						let context = wx.createCanvasContext("mycanvas");

						context.drawImage(img1, 0, unit * 0, unit * 751, unit * 1465); //绘制背景

						context.setFontSize(24); //文字字体
						context.setFillStyle("#fff");
						context.fillText("@" + that.data.nick + " 向您推荐", unit * 90, unit * 1450);
						context.fillText("长按识别小程序", unit * 478, unit * 1450);
						context.save();
						context.beginPath();
						var avatarurl_width = unit * 125; //绘制的头像宽度
						var avatarurl_heigth = unit * 125; //绘制的头像高度
						var avatarurl_x = unit * 130; //绘制的头像在画布上的位置
						var avatarurl_y = unit * 1275; //绘制的头像在画布上的位置
						// 头像原来是方行 进行圆形处理
						context.arc(
							avatarurl_width / 2 + avatarurl_x,
							avatarurl_heigth / 2 + avatarurl_y,
							avatarurl_width / 2,
							0,
							Math.PI * 2,
							false
						);
						context.clip(); //画圆
						context.drawImage(img3, avatarurl_x, avatarurl_y, avatarurl_width, avatarurl_heigth); //画圆形头像
						context.restore();
						context.beginPath();
						//#fff背景
						context.arc(
							(unit * 140) / 2 + unit * 485,
							(unit * 140) / 2 + unit * 1270,
							(unit * 140) / 2,
							0,
							Math.PI * 2,
							false
						);
						context.setFillStyle("#fff");
						context.fill();
						context.restore();
						context.beginPath();

						context.arc(
							(unit * 140) / 2 + unit * 485,
							(unit * 140) / 2 + unit * 1270,
							(unit * 140) / 2,
							0,
							Math.PI * 2,
							false
						);
						context.clip(); //画圆
						context.drawImage(img2, unit * 485, unit * 1270, unit * 140, unit * 140);
						//绘制二维码
						context.restore();

						//把画板内容绘制成图片，并回调画板图片路径
						context.draw(false, function () {
							wx.canvasToTempFilePath({
								x: 0,
								y: 0,
								width: unit * 751,
								height: unit * 1465,
								destWidth: unit * 751,
								destHeight: unit * 1465,
								canvasId: "mycanvas",
								quality: 0.7,
								success: a => {
									that.setData({
										imagePath: a.tempFilePath, //将绘制的图片地址保存在shareImgPath 中
										canvasHidden: true, //设置画板隐藏，否则影响界面显示
									});
									wx.hideToast();
								},
								fail: e => {
									wx.hideToast();
									wx.showToast({
										title: "生成失败",
										icon: "none",
									});
								},
							});
						});
					},
				});
				//-------------end ----------

				// const context = wx.createCanvasContext("mycanvas");
				// context.setFillStyle("#fff");
				// context.drawImage(img1, 0, 0, width, height);
				// context.save();
				// // context.beginPath();

				// context.arc(
				//    (unit * 128) / 2 + unit * 70,
				// (unit * 128) / 2 + unit * 1050,
				// (unit * 128) / 2,
				// 0,
				// Math.PI * 2,
				// false)
				// context.setFillStyle('#fff')
				// context.fill()
				// context.restore();

				// context.arc(
				//   (unit * 128) / 2 + unit * 70,
				//   (unit * 128) / 2 + unit * 1055,
				//   (unit * 128) / 2,
				//   0,
				//   Math.PI * 2,
				//   false
				// );
				// context.clip(); //画圆
				// context.drawImage(
				//   img2,
				//   unit * 70,
				//   unit * 1055,
				//   unit * 128,
				//   unit * 128
				// );

				// context.restore();

				// context.draw(false, function () {
				//   setTimeout(() => {
				//     wx.canvasToTempFilePath({
				//       canvasId: "mycanvas",
				//       x: 0,
				//       y: 0,
				//       width: width,
				//       height: height,
				//       destWidth: width,
				//       destHeight: height,
				//       quality: 1,
				//       success: (a) => {
				//         // //console.log(a.tempFilePath);
				//         that.setData({
				//           imagePath: a.tempFilePath,
				//           canvasHidden: false,
				//         });
				//         wx.hideLoading();
				//         wx.hideToast();
				//       },
				//       fail: (err) => {

				//         wx.hideLoading();
				//         wx.showToast({
				//           title: "生成海报失败，请打开重试",
				//           icon: "none",
				//           mask: true,
				//           duration: 200,
				//         });
				//         wx.hideToast();
				//         //console.log(err);
				//         that.setData({
				//           hidePoster: true,
				//         });
				//       },
				//     });
				//   }, 800);
				// });
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
});
