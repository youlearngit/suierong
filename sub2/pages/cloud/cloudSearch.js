// pages/cloud/cloudSearch.js

const util = require("../../utils/util");
import http from "../../utils/requsetP.js";
import MYURLS from "../../utils/urls";
const { $Toast } = require("../../dist/base/index");
import requestP from "../../../utils/requsetP.js";
import user from "../../../utils/user";
import User from '../../../utils/user';

var app = getApp();
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
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
		//bg: "/static/wechat/img/zmy_poster.png", //图片背景图
		//touxiang: "/pages/public/img/temp/touxiang.jpg",//头像路径
		//maskHidden: true, //控制遮罩层
		imagePath: "", //存放canvas生成的图片
		canvasId: "mycanvas",
		preffixUrl: "",
		path: "",
		newbg: "",
		scene: "",
		unit: 0,
		phoneNumber: "", //18862236710
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		var that = this;
		that.getPhone();
	},

	//不用修改手机号，进入下一个页面
	toSearch(phoneNumber, searchType) {
		//console.log("phoneNumber", phoneNumber);
		var that = this;
		// let str = JSON.stringify({
		//   name: "",
		//   company: "",
		//   idNum: ""
		// });

		let str = JSON.stringify({
			channelUserId: wx.getStorageSync("openid"),
			channelNo: "XCX",
		});
		// let str = JSON.stringify({
		//   name: "陈超",
		//   company: "中建材国际贸易有限公司",
		//   idNum: "32120219911022062X"
		// });

		http
			.requestP({
				url: this.data.preffixUrl + "toCCY",
				method: "get",
				data: {
					merchantNo: "2019101100001", //
					custNo: phoneNumber,
					custType: "phone",
					time: "",
					transData: str,
				},
			})
			.then(res => {
				var sendStr = {
					merchantNo: "2019101100001", // 商户号2019101100001
					custNo: phoneNumber, //客户号，此处传手机号
					custType: "phone", // 客户号类别，此处固定为phone
					time: res.time, // 时间戳
					sign: res.signedStr, // 签名信息
					signType: "RSA",
					transData: str, //床底数据
					platFlag: "_ZMYPT",
				};
				let data = JSON.stringify(sendStr);

				let url = "";
				if (searchType == "jshpj") {
					url = MYURLS.Urls.zmySearchJshpj; //结售汇牌价查询url
				}

				if (searchType == "hrhk") {
					url = MYURLS.Urls.zmySearchHrhk; //汇入汇款查询url
				}

				if (searchType == "hchk") {
					url = MYURLS.Urls.zmySearchHchk; //汇出汇款查询url
				}

				if (searchType == "zhxx") {
					url = MYURLS.Urls.zmySearchZhxx; //账户信息查询url
				}

				if (searchType == "jcykw") {
					url = MYURLS.Urls.zmySearchJckyw; //进出口业务查询url
				}

				wx.navigateTo({
					url: "../cloud/searchResult?skipUrl=" + encodeURIComponent(url) + "&sendStr=" + encodeURIComponent(data),
				});
			})
			.catch(err => {
				//console.log("获取数字异常", err);
			});
	},

	// 获取手机号
	getPhone() {
		var that = this;
		user.getCustomerInfo().then(res => {
			if (res.TEL) {
				that.setData({
					phoneNumber: res.TEL,
				});
			}
			$Toast.hide();
		}).catch(err=>{
				$Toast.hide();
        });
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let that = this;
		this.setData({
			preffixUrl: app.globalData.JSBURL,
		});
		$Toast({
			content: "加载中",
			type: "loading",
			duration: 0,
		});
		if (this.data.phoneNumber != "") {
			this.getPhone();
		}
		//1.获取手机号
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
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		this.setData({
			shareBox: "shareBox on",
		});
		var title = "自贸云平台";
		var path = "pages/cloud/index";
		var imgUrl = this.data.imagePath;
		return {
			title: title,
			path: path,
			imageUrl: imgUrl,
			success: function (res) {},
			fail: function (res) {
				//console.log("用户点击了取消", res);
			},
		};
	},
	//点击分享
	showShare(e) {
		var that = this;
		// 查看是否授权
        User.ifAuthUserInfo().then(res=>{
            if(res){
                app.globalData.userInfo = e.detail.userInfo;

					//昵称
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
                    loginFlag:false
                })
            }
        })
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
		that.createNewImg();
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
		});
	},
	//将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
	createNewImg: function () {
		var that = this;
		let unit = 0;
		let img1 = "";
		let img2 = "";
		let img3 = "";

		// 获取背景信息
		wx.getImageInfo({
			src: that.data.preffixUrl + "/static/wechat/img/zmy_poster.png",
			success(res) {
				// //console.log('img1', res);
				img1 = res.path;
				// 获取二维码信息
				wx.getImageInfo({
					src: that.data.preffixUrl + "/static/wechat/img/zmy_code2.png",
					success(res) {
						// //console.log('img2', res);
						img2 = res.path;
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
								// context.setFillStyle('#fff') //这里是绘制白底，让图片有白色的背景
								context.drawImage(img1, 0, unit * 0, unit * 751, unit * 1465); //绘制背景

								context.setFontSize(28); //文字字体
								context.setFillStyle("#fff");
								context.fillText("@" + that.data.nick + " 向您推荐", unit * 90, unit * 1430);
								context.fillText("长按识别小程序", unit * 450, unit * 1430);
								context.save();
								context.beginPath();
								var avatarurl_width = unit * 140; //绘制的头像宽度
								var avatarurl_heigth = unit * 140; //绘制的头像高度
								var avatarurl_x = unit * 130; //绘制的头像在画布上的位置
								var avatarurl_y = unit * 1235; //绘制的头像在画布上的位置
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

								context.arc(
									(unit * 160) / 2 + unit * 470,
									(unit * 160) / 2 + unit * 1233,
									(unit * 160) / 2,
									0,
									Math.PI * 2,
									false
								);
								context.clip(); //画圆
								context.drawImage(img2, unit * 470, unit * 1233, unit * 160, unit * 160);
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
											// //console.log('imagePath', that.data.imagePath);
											wx.hideToast();
										},
										fail: e => {
											$Toast({
												content: "生成海报失败，请关闭重试",
												type: "warning",
											});
										},
									});
								});
							},
						});
					},
				});
			},
			fail(e) {
				$Toast({
					content: "生成海报失败，请关闭重试",
					type: "warning",
				});
			},
		});
	},

	//点击事件直接触发
	navTo(searchType) {
		var that = this;
		let phoneNumber = that.data.phoneNumber;
		if (phoneNumber != "") {
			that.toSearch(phoneNumber, searchType);
			// wx.showModal({
			//   title: "提示",
			//   content: phoneNumber + "是否是您的手机号码，若否请修改",
			//   cancelText: "修改",
			//   success(res) {
			//     if (res.confirm) {
			//       that.toSearch(phoneNumber, searchType);
			//     }
			//     if (res.cancel) {
			//       wx.navigateTo({
			//         url: "ydt?type=0&type2=" + searchType //0是XIUGAI
			//       });
			//     }
			//   }
			// });
		} else {
			wx.navigateTo({
				url: "ydt?type=1", //1是添加
			});
		}
	},

	searchJshpj() {
		var that = this;
		that.navTo("jshpj");
	},

	searchHrhk() {
		var that = this;
		that.navTo("hrhk");
	},

	searchHchk() {
		var that = this;
		that.navTo("hchk");
	},

	searchZhxx() {
		var that = this;
		that.navTo("zhxx");
	},

	searchJckyw() {
		var that = this;
		that.navTo("jcykw");
	},
});
