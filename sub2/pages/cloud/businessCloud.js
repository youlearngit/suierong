// pages/cloud/index.js
const util = require("../../utils/util");
import api from "../../../utils/api";
import http from "../../utils/requsetP.js";
import MYURLS from "../../utils/urls";
import user from "../../../utils/user"

const { $Toast } = require("../../dist/base/index");
import requestP from "../../../utils/requsetP";
import User from '../../../utils/user';
var app = getApp();
var that;
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
	onLoad: function () {
		that = this;
		//console.log(app.globalData.JSBURL);
		this.setData({
			preffixUrl1: app.globalData.URL,
			preffixUrl: app.globalData.JSBURL,
		});
		api.getSystemInfo(751, 1201, 2.3).then(res => {
			that.setData({
				posterBoxHeight: res.posterBoxHeight,
				posterBoxWidth: res.posterBoxWidth,
				unit: res.unit,
				screenWidth: res.systemInfo.screenWidth,
			});
		});
		$Toast({
			content: "加载中",
			type: "loading",
			duration: 0,
		});
		if (this.data.phoneNumber != "") {
			this.getPhone();
		}
	},
	toExpress() {
		wx.navigateTo({
			url: "/sub2/pages/express/main",
		});
	},

	cc() {
		wx.showModal({
			showCancel: false,
			title: "提示",
			content: "敬请期待...",
			success: function (res) {},
		});
	},
	toCross() {
		wx.navigateTo({
			url: "/sub2/pages/crossBorderE/list",
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
		that.getPhone();
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

	
	getPhone() {
        var that = this;
        user.getIdentityInfo().then(res=>{
            that.setData({
                type: 0,
            });
            if (res.TEL) {
                that.setData({
                    phoneNumber: res.TEL,
                });
            }
				$Toast.hide();

        }).catch(err=>{
				$Toast.hide();
            if(err==="unSelectIdcard"){
                that.setData({
                    type: 1,
                });
            }
        })
	
	},

	toApply() {
		wx.navigateTo({
			url: "apply?page=0", //0是从跨境申请  1是自贸云申请
		});
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		this.setData({
			shareBox: "shareBox on",
		});
		var title = "跨境微服务";
		var path = "/sbu2/pages/cloud/businessCloud";
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
	            	loginFlag: false, //授权提示控制
                })
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
					fail: function (res) {},
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
	//将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
	createNewImg: function () {
		const width = that.data.posterBoxWidth / 2.3;
		const height = that.data.posterBoxHeight / 2.3;
		let unit = 0;
		let img1 = "";
		let img2 = "";
		let img3 = "";

		// 获取背景信息
		wx.getImageInfo({
			// src: app.globalData.URL + "/static/wechat/img/zm/zm_38.jpg",
			src: app.globalData.URL + "/static/wechat/img/zm/5.jpg",
			success(res) {
				img1 = res.path;
				// 获取二维码信息
				wx.getImageInfo({
					src: that.data.preffixUrl + "/static/wechat/img/kj_qrcode.png",
					success(res) {
                        // img2 = res.path;
                        
                        api.generateMiniCode("sub2/pages/cloud/businessCloud").then(res=>{
                            img2 = res;
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
                                    context.setFillStyle("#fff"); //这里是绘制白底，让图片有白色的背景
                                    context.drawImage(img1, 0, 0, width, height); //绘制背景

                                
                                    context.arc(
                                        (unit * 128) / 2 + unit * 86,
                                        (unit * 128) / 2 + unit * 1020,
                                        (unit * 128) / 2,
                                        0,
                                        Math.PI * 2,
                                        false
                                    );
                                    context.clip(); //画圆
                                    context.drawImage(img2, unit * 86, unit * 1020, unit * 128, unit * 128);

                                    //绘制二维码
                                    context.restore();

                                    //把画板内容绘制成图片，并回调画板图片路径
                                    context.draw(false, function () {
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
                                                that.setData({
                                                    imagePath: a.tempFilePath, //将绘制的图片地址保存在shareImgPath 中
                                                    canvasHidden: true, //设置画板隐藏，否则影响界面显示
                                                });
                                                // //console.log('imagePath', that.data.imagePath);
                                                wx.hideToast();
                                            },
                                            fail: e => {
                                                $Toast.hide();
                                                wx.hideToast();
                                                $Toast({
                                                    content: "生成海报失败，请关闭重试",
                                                    type: "warning",
                                                });
                                            },
                                        });
                                    });
                                },
                            });
                        
            
                        })
					},
				});
			},
			fail(e) {
				$Toast.hide();
				wx.hideToast();
				$Toast({
					content: "生成海报失败，请关闭重试",
					type: "warning",
				});
			},
		});
	},
});
