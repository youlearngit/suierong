import WxValidate from "../../../../assets/plugins/wx-validate/WxValidate";
var citys = require("../../../../pages/public/city.js");
var util = require("../../../../utils/util.js");
var encr = require('../../../../utils/encrypt/encrypt'); //国密3段式加密
var aeskey = encr.key //随机数
import user from "../../../../utils/user";
const app = getApp();
const date = new Date();
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		imageData: "", //base64A字符串
		imageData2: "", //base64B字符串
		files: [],
		patha: "",
		pathb: "",
		img: {
			renxiang: "",
			guohui: "",
		},
		takephoto: {
			noticeTxt: "", //渲染提示文字
			coverImg: "", //渲染遮罩层图片
			id: "", //
			tempImage: "", //存放拍照数据
		},
		idcard: {
			name: "", //姓名
			number: "", //证件号
			date: "", //证件有效期
			gender: "", //性别
			certificate_type: "", //证件类型
			legality: "", //合法性验证结果
			address: "", //地址
			race: "", //民族
			birthday: "", //生日
			issued_by: "", //签发机关
			number1: "",
		},
		userinfo: {},
		caijiFlag: false,
		reshowFlag: true,
		preffixUrl: "",
		rederect_url: "",
		type: "",
		idnum: "",
		loginFlag: true,
		customer: {},
        action:''  // update更新
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
        //console.log("set2",options)

        if(options.action){
            this.setData({
                action:options.action
            })
        }
		this.setData({
			backSign: options.backSign ? options.backSign : "",
		});

		var that = this;
		user
			.getCustomerInfo()
			.then(res => {
				that.setData({
					customer: {
						name: res.REAL_NAME,
						number: res.ID_CARD,
					},
				});
			})
			.catch(err => {
				//console.log(err);
			});

		if (options.url != undefined && options.url != null) {
			this.setData({
				rederect_url: options.url,
				type: options.type,
			});
		}

		//console.log(options);
		//console.log("订单号" + options.orderNo);
		//console.log("授权人身份" + options.applicantIdcard1);

		if (options.orderNo != undefined && options.orderNo != null) {
			//根据分享的授权跳转到授权的详情页
			this.setData({
				orderNo: options.orderNo,
				name: options.name,
				prowId: options.prowId,
				authorizeStatus: options.authorizeStatus,
				applicantIdcard: options.applicantIdcard1, //接受身份证
				socialCreditCode: options.socialCreditCode,
				enterprise_name1: options.enterprise_name,
				apply_amount1: options.apply_amount,
				orgId1: options.socialCreditCode,
				authorizerType: options.authorizerType,
			});
		}

		this.setData({
			preffixUrl: app.globalData.URL,
			img: {
				renxiang: app.globalData.URL + "/static/wechat/img/temp/mine/s2_ren_bg.jpg",
				guohui: app.globalData.URL + "/static/wechat/img/temp/mine/s2_guo_bg.jpg",
			},
		});
		//console.log(this.data.img);
	},

	/**
	 * 取消
	 */
	logincancel: function () {
		var that = this;
		that.setData({
			loginFlag: true,
		});
	},

	/**
	 * 用户信息授权
	 */



	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		wx.getSetting({
			success: response => {
				//console.log(response);
				if (!response.authSetting["scope.camera"]) {
					wx.authorize({
						scope: "scope.camera",
						success() {
							// 同意摄像头
							//console.log("同意");
						},
						fail() {
							// 不同意摄像头
							//console.log("不同意");
							wx.showModal({
								title: "提示",
								content: "您的相机拍照功能还未授权开启，请您授权开启",
								showCancel: true, //是否显示取消按钮
								confirmText: "授权",
								cancelText: "取消",
								success: function (res) {
									//console.log(res);
									if (res.confirm) {
										//console.log("点击了确定");
										wx.openSetting({
											success: res => {
												//console.log(res);
											},
										});
									} else if (res.cancel) {
										//console.log("用户点击取消");
										// wx.redirectTo({
										//   url: 'identify',
										// })
									}
								},
								fail: function (res) {},
								complete: function (res) {},
							});
						},
					});
				} else {
					//console.log("else");
				}
			},
			fail: res => {},
			complete: res => {},
		});
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {},

	//调取拍照控件或选择图片方法控件
	creatPhoto(e) {
		//选取id号renxiang--人像面，guohui--国徽面
		const c = e.target.id;
		var that = this;
		var cameraF = 0;
		//console.log(c);

		//点击后调取拍照/选已有sheet
		wx.showActionSheet({
			itemList: ["立即拍照", "从手机相册选择"],
			success(res) {
				if (c == "renxiang") {
					that.setData({
						takephoto: {
							coverImg: app.globalData.URL + "/static/wechat/img/temp/mine/camera_box.png",
							noticeTxt: "请将身份证人像面放入框内",
							id: "renxiang",
						},
					});
				} else if (c == "guohui") {
					that.setData({
						takephoto: {
							coverImg: app.globalData.URL + "/static/wechat/img/temp/mine/camera_box_guo.png",
							noticeTxt: "请将身份证国徽面放入框内",
							id: "guohui",
						},
					});
				}

				var _ind = res.tapIndex;
				if (_ind == "0") {
					wx.getSetting({
						success(res) {
							//console.log(res.authSetting);
							for (var key in res.authSetting) {
								//console.log(key);
								if (key == "scope.camera") {
									if (res.authSetting[key] == true) {
										cameraF = 1;
									}
								}
							}

							if (cameraF == 1) {
								//console.log(111);
								that.setData({
									camera_flag: false,
									v: "1",
								});
							} else {
								wx.authorize({
									scope: "scope.camera", // 权限名称

									// 请求权限成功后回调
									success: res => {
										//console.log("scope.camera 权限获取成功");
										//console.log(res);
										// 获取权限成功后的业务
										that.setData({
											camera_flag: false,
											v: "1",
										});
									},

									// 请求权限失败后回调
									fail: () => {
										//console.log("scope.camera 权限获取失败");
										wx.showToast({
											title: "相机权限未开启",
											icon: "none",
											image: "",
											duration: 1500,
											mask: false,
											success: result => {
												setTimeout(() => {
													wx.navigateBack();
												}, 1500);
											},
											fail: () => {},
											complete: () => {},
										});
										//wx.navigateBack({});
									},
								});
							}

							
						},
					});

					//立即拍照
					////console.log("paizhao")
				} else if (_ind == "1") {
					//选择相册
					wx.chooseImage({
						count: 1,
						sizeType: ["compressed"], //compressed压缩图，original原图
						sourceType: ["album"],
						success(res) {
							//console.log(res.tempFilePaths[0]);
							var tempFilePaths = res.tempFilePaths;
							//压缩图片处理
							var size = res.tempFiles[0].size;
							//console.log(size);
							wx.getImageInfo({
								src: tempFilePaths[0],
								success: function (res) {
									//console.log(res);
									var ctx = wx.createCanvasContext("attendCanvasId");
									var ratio = 1;
									var canvasWidth = res.width;
									var canvasHeight = res.height;
									var quality = 1;
									while (canvasWidth > 600) {
										canvasWidth = Math.trunc(res.width / ratio);
										canvasHeight = Math.trunc(res.height / ratio);
										ratio += 0.1;
									}
									quality = (quality + ratio / 10).toFixed(1);
									//console.log(quality);
									if (quality > 1) {
										quality = 0.7;
									}
									that.setData({
										canvasWidth: canvasWidth,
										canvasHeight: canvasHeight,
									});
									ctx.drawImage(tempFilePaths[0], 0, 0, canvasWidth, canvasHeight);
									ctx.draw();
									setTimeout(function () {
										wx.canvasToTempFilePath({
											canvasId: "attendCanvasId",
											width: 0,
											height: 0,
											destWidth: canvasWidth,
											destHeight: canvasHeight,
											fileType: "jpg",
											quality: quality,
											success(res) {
												//这里是将图片上传到服务器中并识别
												if (c == "renxiang") {
													var FSM = wx.getFileSystemManager();
													FSM.readFile({
														filePath: res.tempFilePath,
														encoding: "base64",
														success: function (data) {
															that.setData({
																imageData: data.data,
															});
															//console.log("照片a64" + that.data.imageData);
														},
													});
													that.setData({
														"img.renxiang": res.tempFilePath,
													});
												} else if (c == "guohui") {
													var FSM = wx.getFileSystemManager();
													FSM.readFile({
														filePath: res.tempFilePath,
														encoding: "base64",
														success: function (data) {
															that.setData({
																imageData2: data.data,
															});
															//console.log("照片B64" + that.data.imageData2);
														},
													});
													that.setData({
														"img.guohui": res.tempFilePath,
													});
												}
											},
										});
									}, 600);
								},
							});
						},
						fail(res) {
							wx.showToast({
								title: "请重新选择图片或拍照",
								icon: "none",
								mask: true,
								duration: 1000,
							});
						},
					});
				}
			},
		});
	},
	//重拍按钮
	reTake() {
		this.setData({
			camera_flag: true,
		});
		wx.showToast({
			title: "您已取消拍照",
			icon: "none",
			mask: true,
			duration: 1000,
		});
	},
	//拍照调取原生组件方法
	takePhoto(e) {
		var that = this;
		//选取id号sfz--身份证，yyzz--营业执照
		const c = e.target.id;
		//console.log(c);
		const ctx = wx.createCameraContext();
		ctx.takePhoto({
			quality: "high",
			success: res => {
				var tempImg = res.tempImagePath;
				wx.getImageInfo({
					src: tempImg,
					success: function (res) {
						//console.log(res.path);
						var _w = res.width;
						var _h = res.height;
						//console.log(_h);
						var relW = 700;
						var relH = parseInt((relW * _h) / _w);
						////console.log(relH)
						that.setData({
							canvasHeight2: relH,
							canvasWidth2: relW,
						});
						var ctx = wx.createCanvasContext("attendCanvasId2");
						ctx.drawImage(res.path, 0, 0, relW, relH);
						ctx.draw();

                        setTimeout(function() {
                            wx.canvasToTempFilePath({
                                canvasId: "attendCanvasId2",
                                x: 0,
                                y: 0.3 * relH,
                                width: relW,
                                height: 0.4 * relH,
                                destWidth: 500,
                                destHeight: 350,
                                fileType: "jpg",
                                quality: 0.7,
                                success(res) {
                                    //这里是将图片上传到服务器中并识别
                                    if (c == "renxiang") {
                                        that.setData({
                                            "img.renxiang": res.tempFilePath,
                                        });
                                    } else if (c == "guohui") {
                                        that.setData({
                                            "img.guohui": res.tempFilePath,
                                        });
                                    }
                                    //传值并关闭拍照界面
                                    that.setData({
                                        camera_flag: true, //隐藏拍照界面
                                        v: "0",
                                    });
                                },
                            });
                        }, 600);
                    },
                });
            },
            fail: res => {
                //console.log(res);
            },
        });
    },
    //识别
    reader() {
        var that = this;
        var _rx = that.data.img.renxiang; //去识别
        var _gh = that.data.img.guohui; //去识别
        wx.showLoading({
            title: "智能识别中",
            mask: true,
        });
        if (_rx == this.data.preffixUrl + "/static/wechat/img/temp/mine/s2_ren_bg.jpg") {
            wx.showToast({
                title: "请上传您的身份证人像面",
                icon: "none",
                mask: true,
                duration: 2000,
            });
        } else if (_gh == this.data.preffixUrl + "/static/wechat/img/temp/mine/s2_guo_bg.jpg") {
            wx.showToast({
                title: "请上传您的身份证国徽面",
                icon: "none",
                mask: true,
                duration: 2000,
            });
        } else {
            wx.uploadFile({
                url: app.globalData.URL + "uploadCard", // 仅为示例，非真实的接口地址
                filePath: _rx, //that.data.takephoto.tempImage,
                name: "file",
                formData: {
                    option: "1", //1生产环境
                    // type: 1,
                },
                success: res => {
                    if (res.data) {
                        this.setData({
                            patha: res.data,
                        });
                        wx.uploadFile({
                            url: app.globalData.URL + "uploadCard", // 仅为示例，非真实的接口地址
                            filePath: _gh, //that.data.takephoto.tempImage,
                            name: "file",
                            formData: {
                                option: "2",
                                // type: 1,
                            },
                            success: res => {
                                if (res.data) {
                                    this.setData({
                                        pathb: res.data,
                                    });
                                    wx.request({
                                        url: app.globalData.YTURL + "jsyh/ocrRecognition.do",
                                        data: encr.gwRequest({
                                            "IMAGE_IDCARD_B": that.data.pathb,
                                            "IMAGE_IDCARD_A": that.data.patha,
                                            "IMAGE_MODE": "02"
                                        }),
                                        method: "POST",
                                        success(res) {
                                            console.log('ocrRecognition', res)
                                            wx.hideLoading();
                                            if (res.data.body.TRAN_STATUS != 'COMPLETE') {
                                                wx.showToast({
                                                    title: "身份证OCR照片识别失败",
                                                    icon: "none",
                                                    mask: true,
                                                    duration: 2000,
                                                });
                                            }
                                            if (res.data.body.RE_LEGALITY == '01') {
                                                //识别成功返回识别结果
                                                console.log(res.data.body);
                                                let _result = res.data.body;
                                                if (that.data.customer.number == _result.RE_CUST_ID) {
                                                    that.setData({
                                                        caijiFlag: true,
                                                        reshowFlag: false,
                                                        idcard: {
                                                            name: that.data.customer.name,
                                                            number: _result.RE_CUST_ID,
                                                            date: _result.RE_VALID_DATE,
                                                            gender: _result.RE_GENDER, //性别
                                                            certificate_type: "二代身份证", //证件类型
                                                            legality: _result.RE_LEGALITY, //合法性验证结果
                                                            address: _result.RE_ADDRESS, //地址
                                                            race: _result.RE_RACE, //民族
                                                            birthday: _result.RE_BIRTHDAY, //生日
                                                            issued_by: _result.RE_ISSUED_BY, //签发机关
                                                        },
                                                        idnum: _result.RE_CUST_ID.substring(0, 6) +
                                                            "********" +
                                                            _result.RE_CUST_ID.substring(14, 20),
                                                    });
                                                } else {
                                                    wx.showModal({
                                                        title: "提示",
                                                        content: "请上传本人身份证",
                                                        showCancel: false, //是否显示取消按钮
                                                    });
                                                }
                                            } else if (res.data.body.RE_LEGALITY == '02') {
                                                wx.showToast({
                                                    title: "请拍照上传正常有效身份证原件(不允许拍照身份证复印件,身份证二次拍照",
                                                    icon: "none",
                                                    mask: true,
                                                    duration: 2000,
                                                });
                                            } else {
                                                wx.showToast({
                                                    title: "身份证OCR照片识别失败",
                                                    icon: "none",
                                                    mask: true,
                                                    duration: 2000,
                                                });
                                            }
                                        },
                                    });
                                } else {
                                    wx.showToast({
                                        title: "您上传的国徽面图片太大啦，请您重新上传。",
                                        icon: "none",
                                        mask: true,
                                        duration: 2000,
                                    });
                                }
                            },
                        });
                    } else {
                        wx.showToast({
                            title: "您上传的人像面图片太大啦，请您重新上传。",
                            icon: "none",
                            mask: true,
                            duration: 2000,
                        });
                    }
                },
            });
        }
        //上传并调用识别接口
    },

	//提交
	submitForm(e) {
		//console.log("submit开始");
		var that = this;
		var vals = e.detail.value; //表单信息，提交

		// var user = that.data.userinfo;
		// if (user.REAL_NAME != vals.name || user.ID_CARD != that.data.idcard.number) {
		//   wx.showModal({
		//     title: '提示',
		//     content: "您上传的身份证信息与提交的个人信息不符，请重新上传",
		//     showCancel: false, //是否显示取消按钮
		//     success: function (res) {
		//     },
		//     fail: function (res) { }, //接口调用失败的回调函数
		//     complete: function (res) { }, //接口调用结束的回调函数（调用成功、失败都会执行）
		//   })
		//   return;
		// }
		wx.showLoading({
			title: "请稍候",
		});
       
		var imgs = that.data.img; //图片信息
		let data = JSON.stringify({
			string_name: vals.name, //姓名
			string_gender: that.data.idcard.gender, //性别
			string_certificate_type: that.data.idcard.certificate_type, //证件类型
			string_id_number: that.data.idcard.number, //证件号码
			// string_id_rxm: that.data.patha, //人像面
			// string_id_ghm: that.data.pathb, //国徽面
			string_legality: that.data.idcard.legality, //合法性验证
			string_address: that.data.idcard.address, //地址
			string_race: that.data.idcard.race, //民族
			string_birthday: that.data.idcard.birthday, //生日
			string_issued_by: that.data.idcard.issued_by, //签发机关
			string_valid_date: vals.date, //有效日期
			string_open_id: wx.getStorageSync("openid"),
		});
		//console.log("加密前数据");
		//console.log(data);

        if(this.data.action==='update'){
            
           user.updateIdentityInfo(data).then(res=>{
			wx.hideLoading();
               wx.showModal({
                   content: '证件信息更新成功',
                   showCancel: false,
                   confirmText: '确定',
                   success: (result) => {
                       if(result.confirm){
                        wx.navigateTo({
													url: '/sub3/pages/apply/orc/index?scene='+this.data.action.scene + '&prdCode=' +this.data.action.prdCode
												})
                       }
                   },
                   fail: ()=>{},
                   complete: ()=>{}
               });
           }).catch(err=>{
			wx.hideLoading();
            wx.showToast({
                title: err.message||err,
                icon: 'none',
                image: '',
                duration: 1500,
                mask: false,
            });
           })
            return
        }
		data = util.enct(data) + util.digest(data);
		wx.request({
			url: app.globalData.URL + "insertIdcard", // 仅为示例，并非真实的接口地址
			data: {
				data: data,
			},
			header: {
				"Content-Type": "application/json", // 默认值
				key: Date.parse(new Date()).toString().substring(0, 6),
				sessionId: wx.getStorageSync("sessionid"),
				transNo: "XC016",
			},
			success(res) {
				//console.log("返回值2");
				//console.log(res);
				var result = res;
				wx.hideLoading();
				wx.showModal({
					title: "提示",
					content: result.data.msg,
					showCancel: false, //是否显示取消按钮
					success: function (res) {
						that.upload();
						console.log('------upload-------')
						if (result.data.code == 1) {
							if (
								that.data.rederect_url != undefined &&
								that.data.rederect_url != null &&
								that.data.rederect_url != "" &&
								that.data.type == "2"
							) {
								wx.redirectTo({
									url: that.data.rederect_url,
								});
							} else if (that.data.orderNo != undefined && that.data.orderNo != null) {
								wx.redirectTo({
									url:
										"/pages/mine/auth_det1?orderNo=" +
										that.data.orderNo +
										"&applicantIdcard1=" +
										that.data.applicantIdcard +
										"&name=" +
										that.data.name +
										"&prowId=" +
										that.data.prowId +
										"&authorizeStatus=" +
										that.data.authorizeStatus +
										"&socialCreditCode=" +
										that.data.socialCreditCode +
										"&enterprise_name=" +
										that.data.enterprise_name1 +
										"&apply_amount=" +
										that.data.apply_amount1 +
										"&authorizerType=" +
										that.data.authorizerType,
								});
							} else if (that.data.backSign=="sui") {
								wx.navigateBack({
									delta: 2,
								});
							} else {
								wx.navigateBack({});
							}
						}
					},
					fail: function (res) {
						//console.log("返回失败信息");
						//console.log(res);
					}, //接口调用失败的回调函数
					complete: function (res) {
						//console.log("结束信息");
						//console.log(res);
					}, //接口调用结束的回调函数（调用成功、失败都会执行）
				});
			},
		});
	},

	//返回
	back() {
		var that = this;
		that.setData({
			caijiFlag: false,
			reshowFlag: true,
		});
		wx.navigateBack();
	},
	upload() {
		var that = this;

		var _rx = that.data.img.renxiang;
		var _gh = that.data.img.guohui;
		var _gs = that.data.gsImg;
				
		let promise1 = new Promise(function(resolve, reject) {

			wx.request({
					url: app.globalData.YTURL + 'jsyh/test.do',
					data: encr.gwRequest({
							"imgStr": that.data.patha,
					}),
					method: 'POST',
					success(res) {
							if (res.data.head.H_STATUS != '1') {
									wx.showToast({
											title: '上传影像：' + res.data.head.H_MSG,
											icon: 'none'
									})
									reject();
									return;
							}
							resolve({
									img1: res.data.body.imgFilePath
							})
					}
			})
	})
	let promise2 = new Promise(function(resolve, reject) {

			wx.request({
					url: app.globalData.YTURL + 'jsyh/test.do',
					data: encr.gwRequest({
							"imgStr": that.data.pathb,
					}),
					method: 'POST',
					success(res) {
							if (res.data.head.H_STATUS != '1') {
									wx.showToast({
											title: '上传影像：' + res.data.head.H_MSG,
											icon: 'none'
									})
									reject();
									return;
							}

							resolve({
									img2: res.data.body.imgFilePath
							})
					}
			})


	})

	Promise.all([promise1, promise2])
						.then((pro) => {
								
								let dataJson3 = JSON.stringify({
										"IMAGE_IDCARD_A": pro[0].img1,
										"IMAGE_IDCARD_B": pro[1].img2,
										"RE_CUST_ID": that.data.idcard.number
								})


								let custnameTwo3 = encr.jiami(dataJson3, aeskey) //3段加密

								wx.request({
										url: app.globalData.YTURL + 'electric/addIdCardtoYxpt.do',
										data: encr.gwRequest(custnameTwo3),
										method: 'POST',
										success(res) {
											console.log('electric/addIdCardtoYxpt.do',res)
											let jsonBatch = encr.aesDecrypt(res.data.body, aeskey)
											console.log('jsonBatch',jsonBatch)
											console.log(jsonBatch.BatchID)

											let batch_id = jsonBatch.BatchID;

											let dataJson4 = JSON.stringify({
												"batch_id": batch_id,
												"id_card": that.data.idcard.number
											})
											let custnameTwo4 = encr.jiami(dataJson4, aeskey) //3段加密
											wx.request({
												url: app.globalData.YTURL + 'sui/updateCusInfoBatchid.do',
												data: encr.gwRequest(custnameTwo4),
												method: 'POST',
												success(res) {
													console.log('sui/updateCusInfoBatchid.do',res)
													let datares = encr.aesDecrypt(res.data.body, aeskey)
													console.log('jsonBatch',datares)
												}
											})
											wx.hideLoading()

										}
								})
						})
						.catch((err) => {
							console.log('upload.err',err)
								wx.hideLoading()
								wx.showToast({
										title: '上传影像失败',
										icon: 'none'
								})
						})
	},
});
