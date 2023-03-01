const app = getApp();
var util = require("../../../utils/util.js");
import user from "../../../utils/user";
import requestYT from "../../../api/requestYT";

var ctx = null;
Page({
	data: {
		preffixUrl: app.globalData.URL,
		cndUrl: app.globalData.CDNURL,
		startTime: "",
		endTime: "",
		duration: 8,
		setInter: "",
		videoSrc: "",
		flag_face: true,
		flag_tip: false,
		time_sec: 0,
		sub_flag: true,
		touch_flag: true,
		customer: {},
		ltDura: true,
	},

	onLoad: function (options) {
		var that = this;
		ctx = wx.createCameraContext();

		that.animation = wx.createAnimation({
			duration: 500,
			timingFunction: "ease-in-out",
		});

		user.getIdentityInfo().then(res => {
			that.setData({
				customer: res,
			});
		});
	},

	//touch start
	touchStart: function (e) {
		var that = this;
		that.setData({
			startTime: e.timeStamp,
			ltDura: true,
			sub_flag: true,
			touch_flag: true,
		});
		console.log("startTime = " + e.timeStamp);
		that.animation.scale(1.8).step();
		that.setData({
			animation: that.animation.export(),
		});
	},

	//touch end
	touchEnd: function (e) {
		console.log("endTime = " + e.timeStamp);
		var that = this;
		that.setData({
			endTime: e.timeStamp,
			flag_tip: false,
			flag_face: true,
			ltDura: false,
			time_sec: 100,
		});
		console.log("ltDura 1 = " + that.data.ltDura);
		//按钮恢复
		that.animation.scale(1).step();
		that.setData({
			animation: that.animation.export(),
		});

		var dura = that.data.endTime - that.data.startTime;
		//清除循环计时
		clearInterval(that.data.setInter);
    //结束录像
    debugger
		console.log("111111");

		if (dura < 2500) {
			console.log("<2500");
			//离开图形
			that.setData({
				flag_tip: false,
				flag_face: true,
			});
			if (ctx._isRecording) {
				ctx.stopRecord();
			}
			return;
		} else if (dura >= 2500 && dura < (that.data.duration + 1) * 5000) {
			that.stopcamera();
			console.log("22222");
			//离开图形
			that.setData({
				flag_tip: true,
				flag_face: false,
			});
			//request 上传视屏返回结果
		} else {
			that.stopcamera();
			console.log("22222");
			//离开图形
			that.setData({
				flag_tip: true,
				flag_face: false,
			});
			//离开图形
			that.setData({
				time_sec: 100,
			});
			//按钮恢复
			that.animation.scale(1).step();
			that.setData({
				animation: that.animation.export(),
			});
		}
	},

	shortClick: function (e) {
		var that = this;
		if (that.data.endTime - that.data.startTime < 350) {
			wx.showToast({
				title: "请您长按识别",
				icon: "none",
				mask: true,
				duration: 2000,
			});
			that.setData({
				flag_tip: false,
				flag_face: true,
				videoSrc: "",
			});
		}
	},

	//长按
	longPress: function (e) {
		var that = this;

		var sec = 0;
		//语音提示
		// that.aud.play();
		console.log("longrepps", ctx);
		setTimeout(function () {
			// console.log("ltDura 2 = " + that.data.ltDura);
			if (that.data.ltDura) {
				// console.log("ltDura 3 = " + that.data.ltDura);
				that.setData({
					flag_tip: true,
					flag_face: false,
				});
				//倒计时提示
				that.timer();
				if (!ctx._isRecording) {
					console.log(1);
					ctx.startRecord({
						success(res) {
							console.log(res);
							console.log("startRecord");
						},
						fail(err) {
							console.log(err);
						},
					});
				} else {
					console.log(2);

					//已经在录制先关闭摄像机再打开
					ctx.stopRecord({
						success(res) {
							ctx.startRecord({
								success(res) {
									console.log("startRecord");
								},
							});
						},
					});
				}
			}
		}, 500);
	},

	timer: function () {
		var that = this;
		var sec = 0;
		that.data.setInter = setInterval(function () {
			if (sec <= that.data.duration) {
				sec++;
				that.setData({
					time_sec: sec,
				});
			} else {
				clearInterval(that.data.setInter);
				that.setData({
					flag_tip: false,
					flag_face: true,
					time_sec: 100,
					videoSrc: "",
				});
				//结束录像
				that.stopcamera();
			}
		}, 1000);
	},
	error_camera: function (res) {
		console.log(res);
	},

	stopcamera: function () {
		console.log("xxxxxx1x");
		var that = this;
		console.log(that.data.sub_flag);
		console.log(ctx);
		if (!that.data.sub_flag) {
			that.setData({
				sub_flag: true,
			});
			return;
		} else {
			that.setData({
				sub_flag: true,
			});
		}
		console.log(ctx);
		console.log(ctx._isRecording);
		if (!ctx._isRecording) {
			console.log("12");
			that.setData({
				sub_flag: false,
			});
			return;
		}
		wx.showLoading({
			title: "智能识别中",
			mask: true,
		});
		if (ctx.stopRecord) {
			console.log("yes");
			ctx.stopRecord({
				success: res => {
					console.log(res);
					that.setData({
						videoSrc: res.tempVideoPath,
					});
					wx.uploadFile({
						url: app.globalData.URL + "uploadvideo",
						filePath: res.tempVideoPath,
						name: "file",
						formData: {
							idCard: that.data.customer.ID_NUMBER,
						},
						success(res) {
							console.log("uploadvideo", res);
							if (res.data != undefined && res.data != null) {
								that.submit(res.data);
							} else {
								wx.showModal({
									title: "提示",
									content: "录制失败,请稍后重试",
									showCancel: false, //是否显示取消按钮
									success: function (res) {
										wx.navigateBack({});
										that.setData({
											sub_flag: true,
										});
									},
									fail: function (res) {}, //接口调用失败的回调函数
									complete: function (res) {}, //接口调用结束的回调函数（调用成功、失败都会执行）
								});
							}
						},
					});
				},
				fail(res) {
					console.log(res);
					wx.showToast({
						title: "人脸数据获取失败，请重试。",
						duration: 2000,
						mask: true,
					});
					wx.hideLoading();
				},
				complete(res) {
					console.log(res);
				},
			});
		} else {
			console.log("no");
		}
	},
	submit: function (path) {
		var that = this;
		var cust = this.data.customer;
		let _data = JSON.stringify({
			BUSICODE: "5",
			CUST_NAME: cust.NAME,
			CUST_ID: cust.ID_NUMBER,
			CUST_ADDR: cust.ADDRESS,
			CUST_SEX: cust.GENDER,
			NATION: cust.RACE,
			BIRTHDAY: cust.ID_NUMBER.substring(6, 14),
			INDATE: cust.VALID_DATE.split(".").join(""),
			RE_ORG: cust.ISSUED_BY,
			IS_AGENT: "0",
			AGENT_ID: "",
			AGENT_NAME: "",
			AUTH_METHOD: "01",
			APP_SCENE: "",
			OBJ_NAME: "SYS001_BIZ02",
			VIDEO_DOC_ID: "",
			UPDATE_DOC: "",
			LIVENESS_VIDEO: "",
			videoName: path,
			OPENID: wx.getStorageSync("openid"),
		});
		let options = {
			url: "face/faceVerify.do",
			data: _data,
		};
		requestYT(options)
			.then(res => {
				if (res.STATUS === "1") {
					console.log("face/faceVerify.do", res);
					if (res.STATUS === "1" && res.AUTH_RESULT === "00") {
						wx.hideLoading();
						return user.addFaceInfo("2", "行内人脸成功");
					} else {
						return Promise.reject("faceVerifyFail");
					}
				}
			})
			.catch(err => {
				console.log(err);
				user.addFaceInfo("3", err || "行内人脸失败");
				wx.hideLoading();
				if (typeof err == "string") {
					wx.showToast({
						title: err,
						icon: "none",
						image: "",
						duration: 2000,
						mask: false,
					});
				} else {
					wx.showToast({
						title: "识别出错，请重新识别",
						icon: "none",
						image: "",
						duration: 2000,
						mask: false,
					});
				}

				that.setData({
					sub_flag: true,
					flag_tip: false,
					flag_face: true,
				});
			});
	},
});
