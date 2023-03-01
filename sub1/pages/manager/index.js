
var util = require("../../../utils/util.js");
import requestP from "../../../utils/requsetP";
import Chat from "../../../api/Chat";


var that;
const chat = new Chat();
var app = getApp();

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		select: 0,
		multiArray: [
			["江苏省", "北京市", "上海市", "广东省", "浙江省"],
			["南京", "无锡", "徐州", "常州", "苏州", "南通", "连云港", "淮安", "盐城", "扬州", "镇江", "泰州", "宿迁"],
			[],
		],
		multiIndex: [0, 0, 0],
		multiInfo: [], //下拉列表详细信息
		list: [],
		loginFlag: true,
        textData: { name: "获取位置中..." },
        cndUrl: app.globalData.CDNURL,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		that = this;
		if (wx.getStorageSync("openid") === "") {
			app.getSessionInfo().then(() => {});
		}
		that.getChat();
		this.setData({
			preffixUrl: app.globalData.URL,
			preffixUrl1: app.globalData.JSBURL,
        });

		wx.showLoading({
			title: "加载中",
		});

		wx.getLocation({
			type: "gcj02",
			success: res => {
				console.log("定位成功");
				that.setData({
					latitude: res.latitude,
					longitude: res.longitude,
				});
				that.initMap();
			},
			fail: res => {
				console.log("定位失败");
				wx.hideLoading({
					success: res => {},
				});
				wx.showToast({
					title: "定位失败",
					icon: "none",
				});
				console.log(res);
			},
		});
	},

	initMap: function () {
		let mulCity = [];
		var reg = new RegExp("江苏银行", "g");
		var reg1 = new RegExp("股份有限公司", "g");
		let info = [];
		wx.request({
			url: app.globalData.JSB + "getnetwork",
			method: "POST",
			success: res => {
				console.log("getnetwork", res);
				var data = res.data.data;
				var distance = parseInt(10111000, 2).toString(10);
				var index = "";
				if (res.data.code == 0) {
					for (var i in data) {
						data[i].ORG_FULL_NAME = data[i].ORG_FULL_NAME.replace(reg1, "");
						//南京3201
						if (data[i].CITY) {
							if (data[i].CITY.substring(0, 4) == "3201") {
								if (data[i].ORG_FULL_NAME == "江苏银行") {
									data[i].ORG_FULL_NAME = data[i].ORG_FULL_NAME + "总部";
								}
								mulCity.push(data[i].ORG_FULL_NAME.replace(reg, ""));
								info.push(data[i]);
							}
						}
						if (data[i].ORG_FULL_NAME == "江苏银行") {
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
					}
					wx.hideLoading({
						success: res => {},
					});
					if (that.data.select == 1) {
						console.log("data[index].ID" + data[index].ID);
						that.getOrgCode(data[index].ID);
					}

					this.setData({
						"multiArray[2]": mulCity,
						multiInfo: info,
						mkData: data,
						"textData.ID": data[index].ID,
						"textData.name": data[index].ORG_FULL_NAME,
						"textData.lat": data[index].LOCATION_LAT_NAVI,
						"textData.long": data[index].LOCATION_LONG_NAVI,
						"textData.name": data[index].ORG_FULL_NAME,
						"textData.desc": data[index].ORG_ADDRESS,
						"textData.distance": util.calcDistance(
							this.data.longitude,
							this.data.latitude,
							data[index].LOCATION_LONG_NAVI,
							data[index].LOCATION_LAT_NAVI
						),
					});
				} else {
					wx.hideLoading({
						success: res => {},
					});
					wx.showToast({
						title: "网络异常",
						icon: "none",
						duration: 20000,
					});
				}
			},
			fail: err => {
				wx.hideLoading({
					success: res => {},
				});
			},
		});
	},

	select(e) {
		let id = e.currentTarget.dataset.id;
		if (id == 1) {
			wx.showLoading({
				title: "加载中",
			});
			wx.getLocation({
				type: "gcj02",
				success: res => {
					console.log("定位成功");
					that.setData({
						latitude: res.latitude,
						longitude: res.longitude,
					});
					that.initMap();
				},
				fail: res => {
					wx.hideLoading({
						success: res => {},
					});
					console.log("定位失败");

					console.log(res);
				},
			});
		} else if (id == 0) {
			that.setData({
				list: [],
			});
			that.getChat();
		}
		this.setData({
			select: id,
		});
	},
	bindMultiPickerChange: function (e) {
		console.log("picker发送选择改变，携带值为", e.detail.value);
		let item = that.data.multiInfo[e.detail.value[2]];
		that.setData({
			multiIndex: e.detail.value,
			"textData.distance": util.calcDistance(
				that.data.longitude,
				that.data.latitude,
				item.LOCATION_LONG_NAVI,
				item.LOCATION_LAT_NAVI
			),
		});
		console.log(that.data.multiInfo[e.detail.value[2]].ORG_FULL_NAME);

		that.getOrgCode(that.data.multiInfo[e.detail.value[2]].ID);
	},
	getMltiData(citycode) {
		var data = that.data.mkData;
		var mulCity = [];
		let info = [];
		var reg = new RegExp("江苏银行", "g");

		if (citycode) {
			for (var i in data) {
				if (data[i].CITY) {
					if (data[i].CITY.substring(0, 4) == citycode) {
						mulCity.push(data[i].ORG_FULL_NAME.replace(reg, ""));
						info.push(data[i]);
					}
				}
			}
			this.setData({
				"multiArray[2]": mulCity,
				multiInfo: info,
			});
		}
	},

	/**
	 * 搜索栏模糊查询员工
	 * @param {*} name
	 */
	getEmpByName(name) {
		return requestP({
			url: app.globalData.URL + "adviser/getEmpByName",
			data: {
				name: name,
			},
		})
			.then(async res => {
				console.log(res);
				if (res.length == 0) {
					wx.showToast({
						title: "查找失败，暂无对应客户经理",
						icon: "none",
					});
                }
                await res.forEach(e => {
                    e.TAGS = e.TAG.split("_")
                });
                
				that.setData({
					list: res,
				});
			})
			.catch(err => {
				console.log(err);
			});
	},

	bindinput(e) {
		let value = e.detail.value;
		that.setData({
			inputVal: e.detail.value,
		});
		if (value.length > 1) {
			that.getEmpByName(value);
		}
	},

	getOrgCode(id) {
		wx.showLoading({
			title: "正在加载",
		});
		requestP({
			url: app.globalData.JSBURL + "getManager",
			method: "GET",
			data: {
				id: id,
			},
			header: {
				"content-type": "application/json", // 默认值
				key: Date.parse(new Date()).toString().substring(0, 6),
				sessionId: wx.getStorageSync("sessionid"),
				transNo: "XC012",
			},
		})
			.then(async res => {
				wx.hideLoading({
					success: res => {},
				});
				console.log("result /getManager:", res);
				console.log(util.dect(res.stringData));
				if (res.code === 1) {
					let data = JSON.parse(util.dect(res.stringData));
					console.log("result /data:", data);
					if (data.length == 0) {
						wx.showToast({
							title: "您的附近暂无客户经理",
							icon: "none",
						});
                    }
                    await data.forEach(e => {
                        e.TAGS = e.TAG.split("_")
                    });
					that.setData({
						list: data,
					});
				} else {
					that.setData({
						list: [],
					});
					wx.showToast({
						title: "暂无数据",
						icon: "none",
					});
				}
			})
			.catch(err => {
				wx.hideLoading({
					success: res => {},
				});
				console.log(err);
				wx.showToast({
					title: "网络异常",
					icon: "none",
				});
			});
	},

	getChat() {
		wx.showLoading({
			title: "加载中",
		});
		chat
			.getRecentContact()
			.then(async res => {
                console.log("recente", res);
                await res.LIST.forEach(e => {
                    e.TAGS = e.TAG.split("_")
                });
				that.setData({
					list: res.LIST,
				});
				wx.hideLoading();
			})
			.catch(err => {
                console.error(err)
				wx.hideLoading();
				wx.showToast({
					title: "暂无推荐的客户经理",
					icon: "none",
				});
			});

	},
	bindMultiPickerColumnChange: function (e) {
		console.log("picker发送选择改变，携带值为", e.detail.value);
		console.log("您已选择" + this.data.multiArray[e.detail.value[2]] + this.data.multiInfo[e.detail.value[2]].CITY);

		this.setData({
			multiIndex: e.detail.value,
		});
	},
	bindMultiPickerColumnChange: function (e) {
		console.log("修改的列为", e.detail.column, "，值为", e.detail.value);
		var data = {
			multiArray: this.data.multiArray,
			multiIndex: this.data.multiIndex,
		};
		let citycode = "";
		data.multiIndex[e.detail.column] = e.detail.value;
		switch (e.detail.column) {
			case 0:
				switch (data.multiIndex[0]) {
					case 0:
						data.multiArray[1] = [
							"南京",
							"无锡",
							"徐州",
							"常州",
							"苏州",
							"南通",
							"连云港",
							"淮安",
							"盐城",
							"扬州",
							"镇江",
							"泰州",
							"宿迁",
						];
						that.getMltiData("3201");
						break;
					case 1:
						data.multiArray[1] = ["北京"];
						that.getMltiData("1101");

						break;
					case 2:
						data.multiArray[1] = ["上海"];
						that.getMltiData("3101");

						break;
					case 3:
						data.multiArray[1] = ["深圳"];
						that.getMltiData("4403");

						break;
					case 4:
						data.multiArray[1] = ["杭州"];
						that.getMltiData("3301");

						break;
				}
				data.multiIndex[1] = 0;
				data.multiIndex[2] = 0;
				break;
			case 1:
				if (data.multiIndex[0] === 0) {
					citycode = "32" + (data.multiIndex[1] + 1 < 10 ? "0" + (data.multiIndex[1] + 1) : data.multiIndex[1] + 1);
					that.getMltiData(citycode);
				}

				data.multiIndex[2] = 0;
				break;
		}
		console.log(data.multiIndex);
		this.setData(data);
    },
    
	contact(e) {
		that.setData({
            agentNo: e.currentTarget.dataset.emp,
			// agentNo: "01011041",
        });
        return chat
			.contact(that.data.agentNo)
			.then(() => {
				wx.hideLoading();
			})
			.catch(err => {
				if (err === "unLogin") {
					that.setData({
						loginFlag: false,
					});
				}
			});  
	},
});
