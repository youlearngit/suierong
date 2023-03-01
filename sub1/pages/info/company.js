// sub1/pages/info/company_detail.js
import WxValidate from "../../../assets/plugins/wx-validate/WxValidate";
var QQMapWX = require("../../../assets/plugins/qqmap-wx-jssdk1.2/qqmap-wx-jssdk.js");
var qqmapsdk;
var citys = require("../../../pages/public/city.js");
var util = require("../../../utils/util.js");

const App = getApp();
const date = new Date();

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		companyName: "", //公司名称
		companyCode: "", //统一码
		companyAddress: "", //公司地址
		companyAddressCode: "", //公司地址
		name: "", //法人姓名
		photo: "", //营业执照照片
		status: "", //状态
		isNJ: false,
		region: ["广东省", "广州市", "海珠区"],
		array: [],
		index: null,
		page: "",
		citys: [
			"南京市",
			"无锡市",
			"徐州市",
			"常州市",
			"苏州市",
			"南通市",
			"连云港市",
			"淮安市",
			"盐城市",
			"扬州市",
			"镇江市",
			"泰州市",
			"宿迁市",
		],
		cityCodes: ["3201", "3202", "3203", "3204", "3205", "3206", "3207", "3208", "3209", "3210", "3211", "3212", "3213"],
		types: [
			"有限责任公司",
			"一人有限责任公司",
			"有限合伙企业",
			"其他有限责任公司",
			"全民所有制",
			"其他股份有限公司",
			"普通合伙企业",
			"内资企业法人",
			"集体所有制",
			"股份制",
			"个人独资企业",
			"股份合作制",
			"股份有限公司",
			"个体",
		],
		type: "", //企业类型
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var that = this;
		if (options.page) {
			this.setData({
				page: options.page,
			});
		}
		qqmapsdk = new QQMapWX({
			key: "2RIBZ-UTLC2-AWQUY-C7I2T-3YKN5-AIF4D",
		});

		var array1 = citys.multiArray[1];
		//array1.push('请选择')
		that.setData({
			preffixUrl: App.globalData.URL,
			objectMultiArray: citys.citys,
			array: array1,
			org_cities: citys.org_cities,
			navTop: App.globalData.statusBarTop,
			navHeight: App.globalData.statusBarHeight,
		});
		that.setData({
			type: options.type,
			status: options.status,
		});
		if (options.companyName != undefined && options.companyName != "undefined" && options.companyName != null) {
			that.setData({
				companyName: options.companyName,
			});
		}
		if (options.companyCode != "undefined" && options.companyCode != undefined && options.companyCode != null) {
			that.setData({
				companyCode: options.companyCode,
			});
		}
		// if (options.companyAddress != 'undefined' &&options.companyAddress != undefined && options.companyAddress != null) {
		//   that.setData({
		//     companyAddress: options.companyAddress,
		//   })
		// }else{
		var address = options.companyCode.substring(2, 6);
		if (address == "3200") {
			address == "3201";
		}
		that.setData({
			companyAddressCode: address,
		});
		var prov = options.companyCode.substring(2, 4);
		var citylist = citys.citys2;
		var prov1 = prov + "0000";
		var address1 = address + "00";
		//console.log(prov1);
		// if (address == "3200") {
		//   address == null;
		// }

		// //调用获取城市列表接口
		// qqmapsdk.getCityList({
		//   success: function (res) {//成功后的回调
		//     //console.log(res);
		//     //console.log('省份数据：', res.result[0])
		//     var city = res.result[0];

		//     for (let i = 0; i < city.length; i++) {
		//       if (prov1 == city[i].id) {

		//       }
		//     }

		//   },
		//   fail: function (error) {
		//     console.error(error);
		//   },
		//   complete: function (res) {
		//     //console.log(res);
		//   }
		// });

		//根据对应接口getCityList返回数据的Id获取区县数据（以北京为例）
		qqmapsdk.getDistrictByCityId({
			// 传入对应省份ID获得城市数据，传入城市ID获得区县数据,依次类推
			id: prov1, //对应接口getCityList返回数据的Id，如：北京是'110000'
			success: function (res) {
				//成功后的回调
				//console.log(121212);
				//console.log(res);
				//console.log("对应城市ID下的区县数据(以北京为例)：", res.result[0]);
				var cityName = res.result[0];
				for (let i = 0; i < cityName.length; i++) {
					if (address1 == cityName[i].id) {
						that.setData({
							companyAddress: cityName[i].name,
							// companyAddressCode:that.data.cityCodes[i]
						});
					}
				}
			},
			fail: function (error) {
				console.error(error);
			},
			complete: function (res) {
				//console.log(res);
			},
		});

		// for (let i = 0; i < citylist.length; i++) {
		//   if (address == citylist[i].regid){
		//     this.setData({
		//       companyAddress: citylist[i].regname,
		//     })
		//   }
		// }

		// }
		if (options.name != "undefined" && options.name != undefined && options.name != null) {
			that.setData({
				name: options.name,
			});
		}
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
		//console.log("show");
		//console.log(that.data);
		var code = that.data.companyCode;
		//console.log("show");
		//console.log(code.substring(2, 6));
		if ("3200" == code.substring(2, 6)) {
			that.setData({
				isNJ: true,
			});
		}
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
	onShareAppMessage: function () {},
	bindPickerChange: function (e) {
		var that = this;
		//console.log(e);
		//console.log("picker发送选择改变，携带值为", e.detail.value);
		that.setData({
			index: e.detail.value,
		});
		that.setData({
			companyAddress: that.data.array[that.data.index],
			companyAddressCode: that.data.cityCodes[that.data.index],
		});
		//console.log(that.data.companyAddress);
		//console.log(that.data.companyAddressCode);
	},
	addCompany() {
		var that = this;

		if (that.data.index == null && that.data.isNJ == true) {
			wx.showModal({
				title: "提示",
				content: "请选择企业所在地",
				showCancel: false, //是否显示取消按钮
				success: function (res) {},
				fail: function (res) {}, //接口调用失败的回调函数
				complete: function (res) {}, //接口调用结束的回调函数（调用成功、失败都会执行）
			});
			return;
		}

		var typeNum = 0;
		for (let ti = 0; ti < that.data.types.length; ti++) {
			if (that.data.type.indexOf(that.data.types[ti]) > -1) {
				if (that.data.type.indexOf("分公司") < 0 && that.data.type.indexOf("分支机构") < 0) {
					typeNum = 1;
				}
			}
		}

		if (typeNum == 0) {
			wx.showToast({
				title: "机构类型不符",
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
			return;
		}

		if (
			that.data.status.indexOf("存续") > -1 ||
			that.data.status.indexOf("在营") > -1 ||
			that.data.status.indexOf("开业") > -1
		) {
		} else {
			wx.showToast({
				title: "经营状态不正常",
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
			return;
		}
		wx.request({
			url: App.globalData.URL + "getuseCard14",
			data: { userId: wx.getStorageSync("openid") },
			header: {
				"Content-Type": "application/x-www-form-urlencoded",
				key: Date.parse(new Date()).toString().substring(0, 6),
				sessionId: wx.getStorageSync("sessionid"),
				transNo: "XC008",
			},
			method: "POST",
			success(res) {
				//console.log(res);
				//console.log(11111);
				var cardlist = res.data.stringData;
				var cardlist1 = JSON.parse(util.dect(cardlist));
				var taggs = "";
				//console.log(cardlist1);
				//console.log(cardlist1.length);
				// if (res.data.stringData!=undefined){
				var flag = 0;
				for (var x in cardlist1) {
					// if(cardlist1[x].ORG_TAGS=="14"){
					//     if (cardlist1[x].ORG_CODE == that.data.companyCode) {
					//         flag = 1;
					//           break;
					//       }
					// }else{
					//     continue
					// }
					if (cardlist1[x].ORG_CODE == that.data.companyCode) {
						flag = 1;
						break;
					}
				}
				if (flag == 1) {
					//已经存在相同的企业名片不新增

					wx.showToast({
						title: "该企业信息已添加，请勿重复添加",
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
				} else {
					//企业名片
					let str = JSON.stringify({
						id_org_id: "id",
						string_org_name: that.data.companyName, //企业名称
						string_org_code: that.data.companyCode, //统一吗
						string_org_address: that.data.companyAddressCode, //企业地址
						string_artificial_name: that.data.name, //法人姓名
						string_org_tel: "", //申请人电话
						string_user_id: wx.getStorageSync("openid"),
					});
					//console.log(str);
					str = util.toCDB(
						str.replace(/\(/g, "-括号").replace(/\（/g, "-括号").replace(/\)/g, "括号-").replace(/\）/g, "括号-")
					);
					var data = util.enct(str) + util.digest(str);
					wx.request({
						url: App.globalData.URL + "add/card2", // 仅为示例，并非真实的接口地址
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
							//console.log(11111);
							//console.log(res);
							if (res.data.msg == "success") {
								wx.showToast({
									title: "企业信息添加成功",
									icon: "none",
									duration: 2000,
									complete: function () {
										if (that.data.page == "sui") {
											const pages = getCurrentPages();
											const prevPage = pages[pages.length - 3]; // 上一页
											// 调用上一个页面的setData 方法，将数据存储
											prevPage.setData({
												backData: that.data.companyCode,
											});

											wx.navigateBack({
												delta: 2,
											});
										} else {
											setTimeout(function () {
												//要延时执行的代码
												wx.navigateBack({
													delta: 2,
												});
											}, 2000);
										}
									},
								});
							}
							// wx.navigateBack({})
						},
					});
				}
			},
		});
	},
});
