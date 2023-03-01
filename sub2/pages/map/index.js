var amapFile = require("../../utils/amap-wx.js");
var config = require("../../utils/config.js");
var util = require("../../utils/util.js");
const app = getApp();
var markersData = [];
var that;
var encr = require("../../utils/encrypt.js"); //国密3段式加密
var aeskey = encr.key; //随机数
var myPerformance = require("../../../utils/performance.js");

Page({
	data: {
		markers: [],
		latitude: "",
		longitude: "",
		textData: {},
		city: "",
		mkData: [],
		param: "",
		scala: 16,
	},
	makertap: function (e) {
		var id = e.markerId;
		that.showMarkerInfo(markersData, id);
		that.changeMarkerColor(markersData, id);
	},
	offline() {
		wx.showToast({
			title: "敬请期待",
			icon: "none",
		});
	},

	onLoad: function (e) {
		that = this;
		this.setData({
			// preffixUrl: "https://wxapp.jsbchina.cn:7080/jsb/"
			preffixUrl: app.globalData.JSB,
		});

		wx.showLoading({
			title: "努力加载数据中...",
			mask: true,
		});

		if (e == null || Object.keys(e).length == 0) {
			wx.getLocation({
				type: "gcj02",
				success: res => { // 定位成功
					that.setData({
						longitude: res.longitude,
						latitude: res.latitude,
					});
					that.initMap();
				},
				fail: res => { // 定位失败

				},
			});
		} else { // 城市选择
			this.setData({
				longitude: Number(e.longitude),
				latitude: Number(e.latitude),
				markers: JSON.parse(e.data),
				textData: JSON.parse(e.textData),
				scala: 17,
				mkData: JSON.parse(e.mkData),
				param: e.mkData,
			});
			wx.hideLoading();
		}
	},
	bindInput: function (e) {
		var url = "../inputtips/input?page=3&data=" + this.data.param;
		wx.navigateTo({
			url: url,
		});
	},
	showMarkerInfo: function (data, i) {
		wx.showLoading({
			title: "网点信息加载中...",
		});
		var tempMarkers = that.data.mkData;
		var m = [];
		var tempMarker = {};
		for (var index in tempMarkers) {
			if (tempMarkers[i].ORG_FULL_NAME == "江苏银行股份有限公司") {
				continue;
			}
			if (i != tempMarkers[index].ID) {
				m.push({
					iconPath: "../../static/img/ico_loc_uncheck.png",
					id: tempMarkers[index].ID,
					latitude: tempMarkers[index].LOCATION_LAT_NAVI,
					longitude: tempMarkers[index].LOCATION_LONG_NAVI,
					width: 20,
					height: 25,
					title: tempMarkers[index].ORG_FULL_NAME,
				});
			} else {
				tempMarker = tempMarkers[index];
				m.push({
					iconPath: "../../static/img/ico_loc_checked.png",
					id: tempMarkers[index].ID,
					latitude: tempMarkers[index].LOCATION_LAT_NAVI,
					longitude: tempMarkers[index].LOCATION_LONG_NAVI,
					width: 35,
					height: 40,
					title: tempMarkers[index].ORG_FULL_NAME,
				});
			}
		}
		var p_am = util.string(tempMarker.P_AM);
		var p_pm = util.string(tempMarker.P_PM);
		var c_am = util.string(tempMarker.C_AM);
		var c_pm = util.string(tempMarker.C_PM);
		that.setData({
			markers: m,
			"textData.long": tempMarker.LOCATION_LONG_NAVI,
			"textData.lat": tempMarker.LOCATION_LAT_NAVI,
			"textData.name": tempMarker.ORG_FULL_NAME,
			"textData.desc": tempMarker.ORG_ADDRESS,
			"textData.telp": tempMarker.TELE_PERSONAL,
			"textData.telc": tempMarker.TELE_COMPANY,
			"textData.bizTime1": "上午" + p_am + ",下午" + p_pm,
			"textData.bizTime2": "上午" + c_am + ",下午" + c_pm,
			"textData.distance": util.calcDistance(
				this.data.longitude,
				this.data.latitude,
				tempMarker.LOCATION_LONG_NAVI,
				tempMarker.LOCATION_LAT_NAVI
			),
		});
		wx.hideLoading();
	},
	changeMarkerColor: function (data, i) {},
	chosePhone() {
		var cus = that.data.textData.telp; //个人业务
		var com = that.data.textData.telc; //对公业务
		wx.showActionSheet({
			itemList: ["个人业务电话", "对公业务电话"],
			itemColor: "#0066b3",
			success(res) {
				var ind = res.tapIndex;
				if (ind == 0) {
					if (cus != undefined && cus != null && cus != "" && cus != "-") {
						wx.showModal({
							title: "温馨提示",
							content: "即将拨打个人业务电话：" + cus,
							showCancel: true,
							cancelText: "取消",
							confirmText: "立即拨打", //默认是“确定”
							success: function (res) {
								if (res.cancel) {
									//点击取消,默认隐藏弹框
								} else {
									wx.makePhoneCall({
										phoneNumber: cus,
										success: function () {
											//console.log("拨打电话成功！");
										},
										fail: function () {
											//console.log("拨打电话失败！");
										},
									});
								}
							},
							fail: function (res) {}, //接口调用失败的回调函数
							complete: function (res) {}, //接口调用结束的回调函数（调用成功、失败都会执行）
						});
					} else {
						wx.showToast({
							title: "此网点暂无个人业务电话",
							icon: "none",
							mask: true,
							duration: 2000,
						});
					}
				} else if (ind == 1) {
					if (com != undefined && com != null && com != "" && com != "-") {
						wx.showModal({
							title: "温馨提示",
							content: "即将拨打对公业务电话：" + com,
							showCancel: true,
							cancelText: "取消",
							confirmText: "立即拨打", //默认是“确定”
							success: function (res) {
								if (res.cancel) {
									//点击取消,默认隐藏弹框
								} else {
									wx.makePhoneCall({
										phoneNumber: com,
										success: function () {
											//console.log("拨打电话成功！");
										},
										fail: function () {
											//console.log("拨打电话失败！");
										},
									});
								}
							},
							fail: function (res) {}, //接口调用失败的回调函数
							complete: function (res) {}, //接口调用结束的回调函数（调用成功、失败都会执行）
						});
					} else {
						wx.showToast({
							title: "此网点暂无对公业务电话",
							icon: "none",
							mask: true,
							duration: 2000,
						});
					}
				}
			},
			fail(res) {},
		});
	},
	callGetPhone(e) {
		// 号码
		let telPhone = e.currentTarget.dataset.getphone;
		if (telPhone == undefined || telPhone == null || telPhone == "") {
			wx.showToast({
				title: "暂无电话",
				icon: "none",
				mask: true,
				duration: 2000,
			});
			return;
		}
		wx.showModal({
			title: "温馨提示",
			content: "您确定要拨打" + telPhone + "?",
			showCancel: true,
			cancelText: "取消",
			confirmText: "立即拨打", //默认是“确定”
			success: function (res) {
				if (res.cancel) {
					//点击取消,默认隐藏弹框
				} else {
					//点击确定
					that.callPhone(telPhone);
				}
			},
			fail: function (res) {}, //接口调用失败的回调函数
			complete: function (res) {}, //接口调用结束的回调函数（调用成功、失败都会执行）
		});
	},
	callPhone(phoneNumber) {
		wx.makePhoneCall({
			phoneNumber: phoneNumber,
			success: function () {
				//console.log("拨打电话成功！");
			},
			fail: function () {
				//console.log("拨打电话失败！");
			},
		});
	},
	//定位
	localLocation: function () {
		wx.showLoading({
			title: "定位中...",
		});
		this.onLoad();
		this.setData({
			scala: 18,
		});
		wx.hideLoading();
	},
	bookLine() {
		if (that.data.textData.name.indexOf("杭州") != -1 || that.data.textData.name.indexOf("深圳") != -1) {
			wx.navigateTo({
				url:
					"../mine/book?latitude=" +
					that.data.textData.lat +
					"&longitude=" +
					that.data.textData.long +
					"&bankname=" +
					that.data.textData.name +
					"&bankaddress=" +
					that.data.textData.desc +
					"&data=" +
					that.data.param +
					"&org_code=" +
					that.data.textData.org_code +
					"&org_short_name=" +
					that.data.textData.org_short_name,
			});
		} else {
			wx.showToast({
				title: "敬请期待",
				icon: "none",
			});
		}
	},
	getAllList(num) {
		var datas = [];
		var i;
		return new Promise((resolve, reject) => {
			for (i = 2; i < num + 1; i++) {
		
				wx.request({
					url: app.globalData.YTURL + "jsyh/getNetwork.do",
					data: encr.gwRequest(
						encr.jiami(
							JSON.stringify({
								PAGE_SIZE: "300",
								NEXT_KEY: i + "",
                week:new Date().getDay()+''
							}),
							aeskey
						)
					),
					method: "POST",
					success(res) {
						if (encr.aesDecrypt(res.data.body, aeskey).LIST) {
							if (encr.aesDecrypt(res.data.body, aeskey).LIST.length != 0) {
								datas = datas.concat(encr.aesDecrypt(res.data.body, aeskey).LIST);
								if (datas.length + 300 === parseInt(encr.aesDecrypt(res.data.body, aeskey).TOTAL_NUM)) {
									resolve(datas);
								}
							}
						}
					},
				});
			}
		});
	},
	initMap: function () {
		var data = [];
		let dataJson = JSON.stringify({
			PAGE_SIZE: "300",
			NEXT_KEY: "1",
      week:new Date().getDay() + ''
		});
		var custnameTwo = encr.jiami(dataJson, aeskey); //3段加密

		myPerformance.reportBegin(1001,'sub2_map_index');

		wx.request({
			url: app.globalData.YTURL + "jsyh/getNetwork.do",
			data: encr.gwRequest(custnameTwo),
			method: "POST",
			success(res) {
				var jsonData = encr.aesDecrypt(res.data.body, aeskey); //解密返回的报文
				data = jsonData.LIST;
				var s = parseInt(jsonData.TOTAL_NUM);
				var requstNUM = s % 300 == 0 ? parseInt(s / 300) : parseInt(s / 300) + 1;
				that.getAllList(requstNUM).then(res => {

					myPerformance.reportEnd(1001,'sub2_map_index');

					myPerformance.reportBegin(2002,'sub2_map_index');
					
					data = data.concat(res);
					var key = config.Config.key;
					var myAmapFun = new amapFile.AMapWX({
						key: key,
					});
					var m = [];

					var distance = parseInt(10111000, 2).toString(10);
					var index = "";
					for (var i in data) {
						if (data[i].ORG_FULL_NAME == "江苏银行股份有限公司") {
							continue;
						}
						var temp = util.getDistance(
							that.data.latitude,
							that.data.longitude,
							data[i].LOCATION_LAT_NAVI,
							data[i].LOCATION_LONG_NAVI
						);
						if (temp < distance) {
							//最近点
							index = i;
							distance = temp;
						}
						m.push({
							iconPath: "../../static/img/ico_loc_uncheck.png",
							id: data[i].ID,
							latitude: data[i].LOCATION_LAT_NAVI,
							longitude: data[i].LOCATION_LONG_NAVI,
							width: 24,
							height: 30,
							title: data[i].ORG_FULL_NAME,
						});
					}
					//最近的一条修改图标
					m[index].iconPath = "../../static/img/ico_loc_checked.png";
					m[index].width = 32;
					m[index].height = 40;
					m[index].title = data[index].ORG_FULL_NAME;
					m[index].content = data[index].ORG_FULL_NAME;
					var p_am = util.string(data[index].P_AM);
					var p_pm = util.string(data[index].P_PM);
					var c_am = util.string(data[index].C_AM);
					var c_pm = util.string(data[index].C_PM);
          
					that.setData({
						markers: m,
						mkData: data,
						param: JSON.stringify(data),
						"textData.org_code": data[index].ORG_CODE,
						"textData.org_short_name": data[index].ORG_SHORT_NAME,
						"textData.name": data[index].ORG_FULL_NAME,
						"textData.lat": data[index].LOCATION_LAT_NAVI,
						"textData.long": data[index].LOCATION_LONG_NAVI,
						"textData.name": data[index].ORG_FULL_NAME,
						"textData.desc": data[index].ORG_ADDRESS,
						"textData.telp": data[index].TELE_PERSONAL, //对私
						"textData.telc": data[index].TELE_COMPANY, //对公
						"textData.bizTime1": "上午" + p_am + ",下午" + p_pm,
						"textData.bizTime2": "上午" + c_am + ",下午" + c_pm,
						"textData.distance": util.calcDistance(
							that.data.longitude,
							that.data.latitude,
							data[index].LOCATION_LONG_NAVI,
							data[index].LOCATION_LAT_NAVI
						),
					});
					wx.hideLoading();

					myPerformance.reportEnd(2002,'sub2_map_index');
					
				});
			},
			fail(res) {
				wx.hideLoading({
					success: res => {},
				});
				wx.showToast({
					title: "网络异常",
					icon: "none",
				});
			},
		});
	},
	//敬请期待
	waiting() {
		wx.showToast({
			title: "敬请期待！",
			icon: "none",
			mask: true,
			duration: 2000,
		});
	},
	go: function () {
		var city = "";
		var latitude = this.data.textData.lat;
		var longitude = this.data.textData.long;
		var name = this.data.textData.name;
		var desc = this.data.textData.desc;
		wx.showLoading({
			title: "路线规划中...",
		});
		wx.getLocation({
			type: "gcj02",
			success: res => {
				wx.hideLoading();
				//console.log(latitude + "\t" + longitude);
				//console.log(res.latitude + "\t" + res.longitude);
				wx.navigateTo({
					url:
						"/sub2/pages/routes/routes?latitude=" +
						res.latitude +
						"&longitude=" +
						res.longitude +
						"&latitude2=" +
						latitude +
						"&longitude2=" +
						longitude +
						"&city=" +
						city +
						"&name=" +
						name +
						"&desc=" +
						desc,
				});
			},
		});
	},
});
