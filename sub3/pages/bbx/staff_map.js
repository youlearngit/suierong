// sub3/pages/bbx/staff_map.js
var app = getApp();
import utils from './utils';
import talent from './talent';
var util = require("../../../utils/util.js");
import api from '../../../utils/api';

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		preffixUrl: utils.preffixUrl(),
		preUrl: app.globalData.URL,
		cndUrl: app.globalData.CDNURL,
		jsbUrl: app.globalData.JSB,

		location: {},
		location_json: '',
		locData: { name: "获取位置中..." },
		mkData: [],
		staffs: [],

		scala: 16,
		markers: [],
		point: {},

		search_mk: {},
		search_list: [],
		search_city: {code:'',value:''},

		citys: {
			'江苏省': ['南京', '无锡', '徐州', '常州', '苏州', '南通', '连云港', '淮安', '盐城', '扬州', '镇江', '泰州', '宿迁'],
			'北京市': ['北京'],
			'上海市': ['上海'],
			'广东省': ['深圳'],
			'浙江省': ['杭州'],
		},
		city_codes: {
			'南京': {code:'320100',value:'南京市'}, 
			'无锡': {code:'320200',value:'无锡市'}, 
			'徐州': {code:'320300',value:'徐州市'}, 
			'常州': {code:'320400',value:'常州市'},
			'苏州': {code:'320500',value:'苏州市'},
			'南通': {code:'320600',value:'南通市'}, 
			'连云港': {code:'320700',value:'连云港市'}, 
			'淮安': {code:'320800',value:'淮安市'}, 
			'盐城': {code:'320900',value:'盐城市'}, 
			'扬州': {code:'321000',value:'扬州市'}, 
			'镇江': {code:'321100',value:'镇江市'}, 
			'泰州': {code:'321200',value:'泰州市'}, 
			'宿迁': {code:'321300',value:'宿迁市'}, 
			'北京': {code:'110100',value:'北京市'}, 
			'上海': {code:'310100',value:'上海市'}, 
			'深圳': {code:'440300',value:'深圳市'}, 
			'杭州': {code:'330100',value:'杭州市'},
		},
		city_multi: [
			['江苏省', '北京市', '上海市', '广东省', '浙江省'], 
			['南京', '无锡', '徐州', '常州', '苏州', '南通', '连云港', '淮安', '盐城', '扬州', '镇江', '泰州', '宿迁'],
		],
		city_multi_idx: [0, 0],

	},

	phoneCall: function(e) {
		let {phone} = e.currentTarget.dataset;
		if (phone) {
			wx.makePhoneCall({
				phoneNumber: phone,
			})
		}
	},

	routes: function(e) {
		let {location,locData} = this.data;
		wx.navigateTo({
			url:
				"/sub3/pages/bbx/routes" +
				"?latitude=" + location.latitude +
				"&longitude=" + location.longitude +
				"&latitude2=" +	locData.LOCATION_LAT_NAVI +
				"&longitude2=" + locData.LOCATION_LONG_NAVI +
				"&city=" + '' +
				"&name=" + locData.ORG_FULL_NAME +
				"&desc=" + locData.ORG_ADDRESS,
		});
	},

	cityPickerChange: async function(e) {
		let {value} = e.detail;
		let {citys,city_codes,city_multi,search_city} = this.data;

		let province = city_multi[0][value[0]];
		let city = citys[province][value[1]];
		search_city = city_codes[city];

		this.setData({ 
			city_multi_idx: value,
			search_city
		});

		await this.initMarkers();

		let {markers} = this.data;
		this.makerShow(markers[0].id);

	},

	cityPickerColumnChange: function(e) {
		let {city_multi,citys} = this.data;

		let {column,value} = e.detail;
		switch(column) {
			case 0:{
				let province = city_multi[column][value];
				city_multi[1] = citys[province];
			}break;
			default:{}break;
		}
		this.setData({city_multi});
	},

	mapSearch: function(e) {
		let {value} = e.detail;
		let {search_list,search_city,mkData} = this.data;

		search_list = [];
		if (value) {
			search_list = mkData.filter(x=>x.CITY.substr(0,6)==search_city.code);
			search_list = search_list.filter(x=>x.ORG_FULL_NAME.indexOf(value)>-1);
		}

		this.setData({search_list});
	},

	makerShow: function(markerId) {
		let {mkData,locData,search_mk,search_list} = this.data;

		search_mk = mkData.find(x=>x.ID==markerId);
		search_list = [];
		this.setData({search_mk,search_list});

		let mpCtx = wx.createMapContext("map");

		locData = mkData.find(x=>x.ID==markerId+"");
		if (locData) {
			this.setData({locData});
			this.initMarkers(markerId);
			this.staffList();
			mpCtx.moveToLocation({
				latitude: parseFloat(locData.LOCATION_LAT_NAVI),
				longitude: parseFloat(locData.LOCATION_LONG_NAVI),
			});
		}
	},

	mapSearchTap: function(e) {
		let {id} = e.currentTarget.dataset;
		this.makerShow(id);
	},

	makerTap: function(e) {
		let {markerId} = e.detail;
		this.makerShow(markerId);
	},

	initMarkers: function(markerId) {
		let {location,search_city,mkData,markers,point,preffixUrl} = this.data;
		let mpCtx = wx.createMapContext("map");

		markers = [];
		for (let i in mkData) {
			if (['江苏银行股份有限公司','江苏银行'].indexOf(mkData[i].ORG_FULL_NAME)>-1) {
				continue;
			}
			// if (mkData[i].CITY.substr(0,6) != search_city.code) {
			// 	continue;
			// }
			let marker = {
				iconPath: preffixUrl+"/ico_loc_uncheck.png",
				id: parseInt(mkData[i].ID),
				latitude: mkData[i].LOCATION_LAT_NAVI,
				longitude: mkData[i].LOCATION_LONG_NAVI,
				width: 24,
				height: 30,
				title: mkData[i].ORG_FULL_NAME,
			}
			if (markerId) {
				if (markerId==mkData[i].ID+"") {
					marker.iconPath = preffixUrl+"/ico_loc_checked.png";
					marker.width = 32;
					marker.height = 40;
				}
			} else {
				if (markers.length==0) {
					marker.iconPath = preffixUrl+"/ico_loc_checked.png";
					marker.width = 32;
					marker.height = 40; 
				}
			}
			markers.push(marker);
		}
		this.setData({markers});

		if (!point.latitude) {
			point = {
				latitude: markers[0].latitude,
				longitude: markers[0].longitude,
			};
			this.setData({point});
		}
		
	},

	initData: async function(options) {
		let {location,location_json,locData,mkData,search_city} = this.data;

		wx.showLoading({
            title: '努力加载数据',
            mask: true,
		});

		// location_json = options.location;
		// location = location_json?JSON.parse(location_json):{};
		// if (!location.adcode) {
			location = await utils.getUserLocation();
			location_json = JSON.stringify(location);
		// }

		search_city = {
			code: location.codes[1].substr(0,6),
			value: location.values[1],
		}
		this.setData({search_city});

		for (let page=1;page<3;page++) {
			let res = await talent.getNetwork(page);
			if (res.LIST) {
				mkData = mkData.concat(res.LIST);
			}
			if (!res.NEXT_KEY) {
				break;
			}
		}
		for (let i in mkData) {
			mkData[i].ORG_FULL_NAME = mkData[i].ORG_FULL_NAME.replace(/股份有限公司/g,'');
			if (['江苏银行股份有限公司','江苏银行'].indexOf(mkData[i].ORG_FULL_NAME)>-1) {
				continue;
			}
		
			if (!mkData[i].LOCATION_LONG_NAVI || !mkData[i].LOCATION_LAT_NAVI) {
				continue;
			}
			mkData[i].distance_km = util.getDistance(
				location.latitude,
				location.longitude,
				mkData[i].LOCATION_LAT_NAVI,
				mkData[i].LOCATION_LONG_NAVI
			);
			mkData[i].distance = util.calcDistance(
				location.longitude,
				location.latitude,
				mkData[i].LOCATION_LONG_NAVI,
				mkData[i].LOCATION_LAT_NAVI
			);
			if (mkData[i].distance_km < 1) {
				mkData[i].distance = parseInt(mkData[i].distance_km*1000) + 'm';
			}
		}
		mkData.sort(function(x,y){
			return x.distance_km - y.distance_km;
		});
		locData = mkData.find(x=>x.distance_km);

		this.setData({location, location_json, mkData, locData})

		await this.initMarkers(locData.ID);
		await this.staffList();

		wx.hideLoading();
	},

	staffList: async function() {
		let {staffs,locData,location} = this.data;
		let res;
		
		let {LOCATION_LAT_NAVI,LOCATION_LONG_NAVI} = locData;
		let loc = await utils.reverseGeocoder(parseFloat(LOCATION_LAT_NAVI),parseFloat(LOCATION_LONG_NAVI));

		// 顺序: 支行专员 > 区专员 > 市专员 > 省专员
		res = await talent.selectStaff({ type:1, code:locData.ORG_CODE, adcode_type:'3' }); // 支行专员
		if (!res.LIST) {
			res = await talent.selectStaff({ type:1, code:loc.codes[2] }); // 区专员
		}
		if (!res.LIST) {
			res = await talent.selectStaff({ type:1, code:loc.codes[1] }); // 市专员
		}
		if (!res.LIST) {
			res = await talent.selectStaff({ type:1, code:loc.codes[0] }); // 省专员
		}
		staffs = res.LIST || [];

		if (staffs.length>0) {
			staffs = staffs.filter(x=>x.TYPE=='1');
			staffs = staffs.splice(0,1);
		}

		this.setData({staffs});
	},

	locationMe: async function() {
		let {scala} = this.data;
		let mpCtx = wx.createMapContext("map");
		mpCtx.moveToLocation();
		scala = 16;
		this.setData({scala});
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		utils.loadBBXChannelByOptions(options);
		
		this.initData(options);

	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		return utils.shareWithBBXChannel({});
	}
})