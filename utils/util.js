const formatTime = date => {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const hour = date.getHours();
	const minute = date.getMinutes();
	const second = date.getSeconds();

	// return [year, month, day].map(formatNumber).join('-') +'/'+ [hour, minute, second].map(formatNumber).join(':')
	return [year, month, day].map(formatNumber).join("-");
};

const formatTime2 = date => {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const hour = date.getHours();
	const minute = date.getMinutes();
	const second = date.getSeconds();
	return [year, month, day].map(formatNumber).join("-") + "  " + [hour, minute, second].map(formatNumber).join(":");
};

const formatTime3 = date => {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	// return [year, month, day].map(formatNumber).join('-') +'/'+ [hour, minute, second].map(formatNumber).join(':')
	return [year, month, day].map(formatNumber).join(".");
};


const formatTime4 = date => {
	const month = date.getMonth() + 1;
	const day = date.getDate();
	// return [year, month, day].map(formatNumber).join('-') +'/'+ [hour, minute, second].map(formatNumber).join(':')
	return [month, day].map(formatNumber).join("");
};

const formatTimeWithSymbol = (date,symbol) => {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	// return [year, month, day].map(formatNumber).join('-') +'/'+ [hour, minute, second].map(formatNumber).join(':')
	return [year, month, day].map(formatNumber).join(symbol);
};


//坐标距离计算
function getDistance(lat1, lng1, lat2, lng2) {
	var radLat1 = (lat1 * Math.PI) / 180.0;
	var radLat2 = (lat2 * Math.PI) / 180.0;
	var a = radLat1 - radLat2;
	var b = (lng1 * Math.PI) / 180.0 - (lng2 * Math.PI) / 180.0;
	var s =
		2 *
		Math.asin(
			Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2))
		);
	s = s * 6378.137; // EARTH_RADIUS;
	s = Math.round(s * 10000) / 10000;
	return s;
}

const formatNumber = n => {
	n = n.toString();
	return n[1] ? n : "0" + n;
};
//加密
const enct = data => {
	//具体目录以你的设置为准
	const sm2 = require("../miniprogram_npm/miniprogram-sm-crypto/index").sm2;
	let keypair = sm2.generateKeyPairHex();
	let publicKey = keypair.publicKey; // 公钥
	let privateKey = keypair.privateKey; // 私钥
	let key = wx.getStorageSync("key");
	publicKey = key.split("&")[1];
	let encryptData = sm2.doEncrypt(data, publicKey, 1); // 加密结果
	return encryptData;
};

//解密
const dect = data => {
	//具体目录以你的设置为准
	const sm2 = require("../miniprogram_npm/miniprogram-sm-crypto/index").sm2;
	let keypair = sm2.generateKeyPairHex();
	let publicKey = keypair.publicKey; // 公钥
	let privateKey = keypair.privateKey; // 私钥
	let key = wx.getStorageSync("key");
	privateKey = key.split("&")[0];
	let decryptData = sm2.doDecrypt(data, privateKey, 1); // 解密结果
	return decryptData;
};

const digest = data => {
	const sm3 = require("../miniprogram_npm/miniprogram-sm-crypto/index").sm3;
	let hashData = sm3(encodeURIComponent(data)); // 杂凑
	return hashData;
};

const toCDB = str => {
	var tmp = "";
	for (var i = 0; i < str.length; i++) {
		if (str.charCodeAt(i) == 12288) {
			tmp += String.fromCharCode(str.charCodeAt(i) - 12256);
			continue;
		}
		if (str.charCodeAt(i) > 65280 && str.charCodeAt(i) < 65375) {
			tmp += String.fromCharCode(str.charCodeAt(i) - 65248);
		} else {
			tmp += String.fromCharCode(str.charCodeAt(i));
		}
	}
	return tmp;
};

function openid(code, url) {
	wx.request({
		url: url + "getwechatid",
		data: {
			js_code: code,
			isProxy: false,
		},
		header: {
			"content-type": "application/json", // 默认值
			key: Date.parse(new Date()).toString().substring(0, 6),
		},
		success(res) {
			if (res.data != undefined) {
				wx.setStorageSync("openid", res.data.openid);
				wx.setStorageSync("key", res.data.key);
				wx.setStorageSync("sessionid", res.data.session_key);
			}
		},
		fail() {
			wx.showToast({
				title: "网络异常",
				icon: "none",
				duration: 2000,
			});
		},
	});
}

function addmyred(data, url) {
	wx.request({
		url: url + "addmyred",
		data: {
			data: data,
		},
		header: {
			"content-type": "application/json", // 默认值
			key: Date.parse(new Date()).toString().substring(0, 6),
		},
		success(res) {
			//console.log(res.data)
		},
		fail() {
			wx.showToast({
				title: "网络异常",
				icon: "none",
				duration: 2000,
			});
		},
	});
}

function addcard(url, open_id, str, orgID) {
	wx.request({
		url: url + "getuseCard",
		data: {
			userId: open_id,
		},
		header: {
			"Content-Type": "application/x-www-form-urlencoded",
			key: Date.parse(new Date()).toString().substring(0, 6),
			sessionId: wx.getStorageSync("sessionid"),
			transNo: "XC008",
		},
		method: "POST",
		success(res) {
			var cardlist = res.data.stringData;
			var cardlist1 = JSON.parse(dect(cardlist));
			var taggs = "";
			//console.log(cardlist1)
			//console.log(cardlist1.length)
			// if (res.data.stringData!=undefined){
			for (var x in cardlist1) {
				//console.log(cardlist1[x].ORG_CODE + "ssssssssssssssssss")
				if (cardlist1[x].ORG_CODE == orgID) {
					var falg = "1";
					break;
				}
			}
			if (falg == "1") {
				//已经存在相同的企业名片不新增
				//console.log("存在")
			} else {
				//企业名片
				var data = enct(str) + digest(str);
				wx.request({
					url: url + "add/card", // 仅为示例，并非真实的接口地址
					data: {
						data: data,
					},
					method: "POST",
					header: {
						"Content-Type": "application/x-www-form-urlencoded",
						key: Date.parse(new Date()).toString().substring(0, 6),
						sessionId: wx.getStorageSync("sessionid"),
						transNo: "XC007",
					},
					success(res) {
						//console.log(res)
					},
				});
			}
		},
	});
}

//照片选择
function createPhoto(c, that, url) {
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
						noticeTxt: "请将营业执照放入框内",
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
								//console.log(quality)
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
											//console.log(res.tempFilePath)
											////console.log(res)
											that.setData({
												"takephoto.tempImage": res.tempFilePath,
											});
											if (c == "sfz_take") {
												wx.showToast({
													title: "智能识别中...",
													icon: "loading",
													mask: true,
													duration: 20000,
												});
												wx.uploadFile({
													url: url + "upload", // 仅为示例，非真实的接口地址
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
														//console.log(res)
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
													mask: true,
													duration: 20000,
												});
												wx.uploadFile({
													url: url + "upload", // 仅为示例，非真实的接口地址
													filePath: that.data.takephoto.tempImage,
													name: "file",
													formData: {
														option: "2",
														// img: that.data.imageData  //图片地址64
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
															var province = that.data.org_cities[provinceID];
															var city = that.data.org_cities[cityID];
															that.setData({
																flag_org_diy: false,
																flag_org_ocr: true,
																"form.orgID": result.rE_REGISTER_ID,
																"form.orgName": result.rE_COMPANY_NAME,
																"form.province": province,
																"form.city": city,
																"form.provinceCode": result.rE_REGISTER_ID.substring(2, 4),
																"form.cityCode": result.rE_REGISTER_ID.substring(2, 6),
																provinceName: province,
																cityName: city,
																// "form.address": result.rE_ADDRESS
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
}
//照片拍照
function takePhoto(c, ctx, url, that) {
	ctx.takePhoto({
		quality: "high",
		success: res => {
			var tempImg = res.tempImagePath;
			wx.getImageInfo({
				src: tempImg,
				success: function (res) {
					//console.log(res.path)
					var _w = res.width;
					var _h = res.height;
					var relW = 900;
					var relH = parseInt((relW * _h) / _w);
					//console.log("宽" + relW + "高" + relH)
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
								//console.log(res.tempFilePath)
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
										mask: true,
										duration: 20000,
									});
									wx.uploadFile({
										url: url + "upload", // 仅为示例，非真实的接口地址
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
										mask: true,
										duration: 20000,
									});

									wx.uploadFile({
										url: url + "upload", // 仅为示例，非真实的接口地址
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
												var province = that.data.org_cities[provinceID];
												var city = that.data.org_cities[cityID];
												that.setData({
													flag_org_diy: false,
													flag_org_ocr: true,
													"form.orgID": result.rE_REGISTER_ID,
													"form.orgName": result.rE_COMPANY_NAME,
													"form.province": province,
													"form.city": city,
													"form.provinceCode": result.rE_REGISTER_ID.substring(2, 4),
													"form.cityCode": result.rE_REGISTER_ID.substring(2, 6),
													provinceName: province,
													cityName: city,
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
}

function calcDistance(start_long, start_lat, end_long, end_lat) {
	var d1 = 0.01745329251994329;
	var d2 = start_long;
	var d3 = start_lat;
	var d4 = end_long;
	var d5 = end_lat;
	d2 *= d1;
	d3 *= d1;
	d4 *= d1;
	d5 *= d1;
	var d6 = Math.sin(d2);
	var d7 = Math.sin(d3);
	var d8 = Math.cos(d2);
	var d9 = Math.cos(d3);
	var d10 = Math.sin(d4);
	var d11 = Math.sin(d5);
	var d12 = Math.cos(d4);
	var d13 = Math.cos(d5);
	var arrayOfDouble1 = [];
	var arrayOfDouble2 = [];
	arrayOfDouble1.push(d9 * d8);
	arrayOfDouble1.push(d9 * d6);
	arrayOfDouble1.push(d7);
	arrayOfDouble2.push(d13 * d12);
	arrayOfDouble2.push(d13 * d10);
	arrayOfDouble2.push(d11);
	var d14 = Math.sqrt(
		(arrayOfDouble1[0] - arrayOfDouble2[0]) * (arrayOfDouble1[0] - arrayOfDouble2[0]) +
			(arrayOfDouble1[1] - arrayOfDouble2[1]) * (arrayOfDouble1[1] - arrayOfDouble2[1]) +
			(arrayOfDouble1[2] - arrayOfDouble2[2]) * (arrayOfDouble1[2] - arrayOfDouble2[2])
	);
	var result = Math.round(Math.asin(d14 / 2.0) * 12742001.579854401);
	return Math.floor(result / 1000).toFixed(1) + "km";
}

module.exports = {
	formatTime: formatTime,
	enct: enct,
	dect: dect,
	digest: digest,
	toCDB: toCDB,
	openid: openid,
	addcard: addcard,
	getDistance: getDistance,
	formatTime2: formatTime2,
	formatTime3: formatTime3,
	formatTime4: formatTime4,
	formatNumber,
	createPhoto: createPhoto,
	takePhoto: takePhoto,
	calcDistance,
    formatTimeWithSymbol
};
