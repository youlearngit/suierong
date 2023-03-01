import WxValidate from "../../../assets/plugins/wx-validate/WxValidate";
var citys = require("../../../pages/public/city.js");
var util = require("../../../utils/util.js");
const app = getApp();
import Order from "../../../api/Order";

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		list: [],
		coverBgray: true,
		flag_org_diy: true,
		flag_org_ocr: false,
		pagescroll: ".page",
		preffixUrl: "",
		camera_flag: true,
		takephoto: {
			noticeTxt: "", //渲染提示文字
			coverImg: "", //渲染遮罩层图片
			id: "", //
			tempImage: "", //存放拍照数据
		},
		form: {
			orgID: "", //企业统一信用代码
			orgName: "", //q企业姓名
			province: "", //省
			city: "", //市
		},
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.initValidate();
		this.setData({
			preffixUrl: app.globalData.URL,
			navTop: app.globalData.statusBarTop,
			navHeight: app.globalData.statusBarHeight,
		});
		var pagenum = getCurrentPages();
		this.setData({
			pageFlag: pagenum.length,
		});
		if (pagenum.length > 2) {
			//console.log("有返回");
		} else {
			//console.log("到主页");
		}
	},
	prePage() {
		wx.navigateBack();
	},
	indexpage: function () {
		wx.switchTab({
			url: "/pages/shop/index2",
		});
	},
	blur(e) {
		let idname = e.target.id;
		if (idname == "orgID") {
			this.setData({
				"form.orgID": e.detail.value,
			});
		} else if (idname == "orgName") {
			this.setData({
				"form.orgName": e.detail.value,
			});
		}
	},
	initValidate() {
		// 验证字段的规则
		const rules = {
			orgID: {
				required: true,
				orgID: true,
			},
		};
		const messages = {
			orgID: {
				required: "请输入企业统一社会信用代码",
				orgID: "请输入正确的统一社会信用代码",
			},
		};
		// 创建实例对象
		this.WxValidate = new WxValidate(rules, messages);
	},
	showModal(error) {
		wx.showToast({
			title: error.msg,
			icon: "none",
			duration: 2000,
		});
	},
	submitForm1(e) {
		let that = this;
		const params = e.detail.value;
		if (that.data.form.orgID == "" && that.data.form.orgName == "") {
			wx.showToast({
				title: "请输入企业信息",
				icon: "none",
				duration: 2000,
			});
			return;
		}
		if (!this.WxValidate.checkForm(params)) {
			const error = this.WxValidate.errorList[0];
			that.showModal(error);
			return false;
		}

		if (that.data.form.orgID == "") {
			wx.showToast({
				title: "请输入统一信用代码",
				icon: "none",
				duration: 2000,
			});
			return;
		}
		if (that.data.form.orgName == "") {
			wx.showToast({
				title: "请输入企业名称",
				icon: "none",
				duration: 2000,
			});
			return;
		}

		Order.getOrderInfoByEnterprise(e.detail.value.orgID, e.detail.value.orgName).then(res => {
			if (res&&res.resultCode === "0000") {
				let list = JSON.stringify(res.szZxdCompanyDataList);
				wx.navigateTo({
					url: "query_result?data=" + list + "&nodata=false",
				});
			} else {
				wx.navigateTo({
					url: "query_result?data=" + "&nodata=true",
				});
			}
		});
		// wx.request({
		//   url: app.globalData.URL + 'selectOrderInfo', // 仅为示例，并非真实的接口地址
		//   data: {
		//     creditCode: e.detail.value.orgID, //"91320506582255512R",
		//     enterpriseName: e.detail.value.orgName //"苏州市群进精密机械科技有限公司"
		//   },
		//   header: {
		//     'content-type': 'application/json', // 默认值
		//     "key": (Date.parse(new Date())).toString().substring(0, 6)
		//   },
		//   success(res) {
		//       //console.log(res)
		//     var all = [];
		//     if (res.data.szZxdCompanyDataList != undefined && res.data.szZxdCompanyDataList != null && res.data.szZxdCompanyDataList.length>0) {

		//       // for (var i = 0; i < res.data.szZxdCompanyDataList.length; i++) {
		//       //   if (res.data.szZxdCompanyDataList[i].orderStatus != "1004") {
		//       //     all.push(res.data.szZxdCompanyDataList[i])
		//       //   }
		//       // }
		//       var list = JSON.stringify(res.data.szZxdCompanyDataList);
		//       //console.log(all)
		//       wx.navigateTo({
		//         url: 'query_result?data=' + list + '&nodata=false'
		//       })

		//     } else {
		//       wx.navigateTo({
		//         url: 'query_result?data=' + '&nodata=true'
		//       })
		//     }
		//   }
		// })
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {},

	//切换企业执照手动录入
	change_org() {
		this.setData({
			flag_org_diy: false,
			flag_org_ocr: true,
		});
	},
	//切换企业执照OCR
	change_org_ocr() {
		this.setData({
			flag_org_diy: true,
			flag_org_ocr: false,
		});
	},

	//调取拍照控件或选择图片方法控件
	creatPhoto(e) {
		//选取id号sfz--身份证，yyzz--营业执照
		const c = e.target.id;
		var that = this;
		//点击后调取拍照/选已有sheet
		wx.showActionSheet({
			itemList: ["立即拍照", "从手机相册选择"],
			success(res) {
				//身份证提示
				if (c == "sfz") {
					that.setData({
						takephoto: {
							coverImg: "img/camera_box.png",
							noticeTxt: "请将身份证人像面放入框内",
							id: "sfz_take",
						},
					});
				} else if (c == "yyzz") {
					//营业执照提示
					that.setData({
						takephoto: {
							coverImg: "img/camera_box_org.png",
							// noticeTxt: "请将营业执照（竖版）放入框内",
							id: "yyzz_take",
						},
					});
				}
				var _ind = res.tapIndex;
				//拍照界面弹出方法0--立即拍照调取takephoto；1选取已有
				if (_ind == "0") {
					that.setData({
						camera_flag: false,
						v: "1",
					});
				} else if (_ind == "1") {
					const c = that.data.takephoto.id;
					wx.chooseImage({
						count: 1,
						sizeType: ["compressed"], //compressed压缩图，original原图
						sourceType: ["album"],
						success(res) {
							// tempFilePath可以作为 img标签的src属性显示图片
							var tempFilePaths = res.tempFilePaths;
							//压缩图片处理
							var size = res.tempFiles[0].size;
							wx.getImageInfo({
								src: tempFilePaths[0],
								success: function (res) {
									var ctx = wx.createCanvasContext("attendCanvasId");
									var ratio = 1;
									var canvasWidth = res.width;
									var canvasHeight = res.height;
									var quality = 1;
									while (canvasWidth > 1000) {
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
												//console.log(res.tempFilePath);
												////console.log(res)
												that.setData({
													"takephoto.tempImage": res.tempFilePath,
												});
												if (c == "sfz_take") {
													wx.showToast({
														title: "智能识别中...",
														icon: "loading",
														duration: 20000,
													});
													wx.uploadFile({
														url: app.globalData.URL + "upload", // 仅为示例，非真实的接口地址
														filePath: that.data.takephoto.tempImage,
														name: "file",
														formData: {
															option: "1",
														},
														header: {
															key: Date.parse(new Date()).toString().substring(0, 6),
															sessionId: wx.getStorageSync("sessionid"),
														},
														success: res => {
															wx.hideToast();
                                                            if(res.data){
                                                                const result = JSON.parse(res.data)
                                                                if(result.rE_LEGALITY==="IdPhoto"){
                                                                    that.setData({
                                                                        flag_self_diy: false,
                                                                        flag_self_ocr: true,
                                                                        'form.name': result.rE_CUST_NAME,
                                                                        'form.idCard': result.rE_CUST_ID,
                                                                        'form.address': result.rE_ADDRESS
                                                                      })
                                                                }else{
                                                                    wx.showToast({
                                                                        title: "请上传正常有效的身份证原件（不允许拍照身份证复印件，身份证二次拍照）",
                                                                        icon: 'none',
                                                                        mask: true,
                                                                        duration: 2000
                                                                      })
                                                                }
                                                              }else{
                                                                wx.showToast({
                                                                    title: res.errMsg,
                                                                    icon: 'none',
                                                                    mask: true,
                                                                    duration: 2000
                                                                  })
                                                              } 
														},
													});
												} else if (c == "yyzz_take") {
													wx.showToast({
														title: "智能识别中...",
														icon: "loading",
														duration: 20000,
													});
													wx.uploadFile({
														url: app.globalData.URL + "upload", // 仅为示例，非真实的接口地址
														filePath: that.data.takephoto.tempImage,
														name: "file",
														formData: {
															option: "2",
														},
														header: {
															key: Date.parse(new Date()).toString().substring(0, 6),
															sessionId: wx.getStorageSync("sessionid"),
														},
														success: res => {
															wx.hideToast();
															if (res.data != "") {
																var result = JSON.parse(res.data);
																var provinceID = result.rE_REGISTER_ID.substring(2, 4);
																var cityID = result.rE_REGISTER_ID.substring(2, 6);
																// var province = that.data.org_cities[provinceID];
																// var city = that.data.org_cities[cityID];
																that.setData({
																	flag_org_diy: false,
																	flag_org_ocr: true,
																	"form.orgID": result.rE_REGISTER_ID,
																	"form.orgName": result.rE_COMPANY_NAME,
																	// "form.province": province,
																	// "form.city": city,
																	// 'form.provinceCode': result.rE_REGISTER_ID.substring(2, 4),
																	// 'form.cityCode': result.rE_REGISTER_ID.substring(2, 6),
																	// "provinceName": province,
																	// "cityName": city
																});
															} else {
																wx.showToast({
																	title: "您上传的图片太大啦，请您重新上传。",
																	icon: "none",
																	mask: true,
																	duration: 2000,
																});
															}
														},
													});
												}
											},
											fail(e) {
												wx.hideLoading();
												wx.showToast({
													title: "上传失败",
													icon: "success",
													duration: 2000,
												});
											},
										});
									}, 1000);
								},
							});
							//压缩结束
						},
						fail(res) {
							wx.showToast({
								title: "请拍照上传",
								icon: "none",
								duration: 1000,
							});
						},
					});
				}
			},
			fail(res) {},
		});
	},
	//拍照调取原生组件方法
	takePhoto(e) {
		var that = this;
		//选取id号sfz--身份证，yyzz--营业执照
		const c = e.target.id;
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
						var relW = 900;
						var relH = parseInt((relW * _h) / _w);
						////console.log(relH)
						that.setData({
							canvasHeight2: 0.75 * relH,
							canvasWidth2: relW,
						});
						var ctx = wx.createCanvasContext("attendCanvasId2");
						ctx.drawImage(res.path, 0, 0, relW, relH);
						ctx.draw();

						setTimeout(function () {
							var yzai = 0;
							if (c == "sfz_take") {
								yzai = 0.2 * relH;
							}
							wx.canvasToTempFilePath({
								canvasId: "attendCanvasId2",
								x: 0,
								y: yzai,
								width: relW,
								height: 0.6 * relH,
								destWidth: 600, //最终图片大小
								destHeight: parseInt((360 * relH) / relW),
								fileType: "jpg",
								quality: 0.7,
								success(res) {
									//这里是将图片上传到服务器中并识别
									//console.log(res.tempFilePath);

									//传值并关闭拍照界面
									that.setData({
										"takephoto.tempImage": res.tempFilePath,
										camera_flag: true, //隐藏拍照界面
										v: "0",
									});
									//判断调用身份证还是营业执照
									if (c == "sfz_take") {
										wx.showToast({
											title: "智能识别中...",
											icon: "loading",
											duration: 20000,
										});
										wx.uploadFile({
											url: app.globalData.URL + "upload", // 仅为示例，非真实的接口地址
											filePath: that.data.takephoto.tempImage,
											name: "file",
											formData: {
												option: "1",
											},
											header: {
												key: Date.parse(new Date()).toString().substring(0, 6),
												sessionId: wx.getStorageSync("sessionid"),
											},
											success: res => {
												wx.hideToast();
                                                if(res.data){
                                                    const result = JSON.parse(res.data)
                                                    if(result.rE_LEGALITY==="IdPhoto"){
                                                        that.setData({
                                                            flag_self_diy: false,
                                                            flag_self_ocr: true,
                                                            'form.name': result.rE_CUST_NAME,
                                                            'form.idCard': result.rE_CUST_ID,
                                                            'form.address': result.rE_ADDRESS
                                                          })
                                                    }else{
                                                        wx.showToast({
                                                            title: "请上传正常有效的身份证原件（不允许拍照身份证复印件，身份证二次拍照）",
                                                            icon: 'none',
                                                            mask: true,
                                                            duration: 2000
                                                          })
                                                    }
                                                  }else{
                                                    wx.showToast({
                                                        title: res.errMsg,
                                                        icon: 'none',
                                                        mask: true,
                                                        duration: 2000
                                                      })
                                                  } 
											},
										});
									} else if (c == "yyzz_take") {
										wx.showToast({
											title: "智能识别中...",
											icon: "loading",
											duration: 20000,
										});
										wx.uploadFile({
											url: app.globalData.URL + "upload", // 仅为示例，非真实的接口地址
											filePath: that.data.takephoto.tempImage,
											name: "file",
											formData: {
												option: "2",
											},
											header: {
												key: Date.parse(new Date()).toString().substring(0, 6),
												sessionId: wx.getStorageSync("sessionid"),
											},
											success: res => {
												wx.hideToast();
												if (res.data != "") {
													var result = JSON.parse(res.data);
													var provinceID = result.rE_REGISTER_ID.substring(2, 4);
													var cityID = result.rE_REGISTER_ID.substring(2, 6);
													// var province = that.data.org_cities[provinceID];
													// var city = that.data.org_cities[cityID];
													that.setData({
														flag_org_diy: false,
														flag_org_ocr: true,
														"form.orgID": result.rE_REGISTER_ID,
														"form.orgName": result.rE_COMPANY_NAME,
														// "form.province": province,
														// "form.city": city,
														// 'form.provinceCode': result.rE_REGISTER_ID.substring(2, 4),
														// 'form.cityCode': result.rE_REGISTER_ID.substring(2, 6),
														// "provinceName": province,
														// "cityName": city
													});
												} else {
													wx.showToast({
														title: "您上传的图片太大啦，请您重新上传。",
														icon: "none",
														mask: true,
														duration: 2000,
													});
												}
											},
										});
									}
								},
							});
						}, 1000);
					},
				});
			},
			fail: res => {
				////console.log(res)
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
			duration: 2000,
		});
	},
	//确定按钮
	chose() {
		this.setData({
			flag_self_ocr: false,
			preview_flag: true,
			v: "0",
		});
	},
	error(e) {
		////console.log(e.detail)
	},
});
