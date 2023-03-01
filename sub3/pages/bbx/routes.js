// sub3/pages/bbx/routes.js
var app = getApp();
import utils from './utils';
import talent from './talent';
var util = require("../../../utils/util.js");
let amap = require("./amap/amap");
import api from '../../../utils/api';

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		preffixUrl: utils.preffixUrl(),

		city: '',
		desc: '',
		latitude: '',
		longitude: '',
		latitude2: '',
		longitude2: '',
		name: '',

		distance: '',
		cost: '',
		transits: [],
		polyline: [],
		markers: [],
		points: [],
		center: {},
		cindex: "0",

	},

	changeType: function(e) {
		let {id} = e.target.dataset;
		let {cindex} = this.data;
		if (id == cindex) { return; }
		this.setData({ cindex: id });
		this.getRoute();
	},

	nav() {
		let { latitude2, longitude2, name, desc } = this.data;
		wx.openLocation({
			latitude: +latitude2,
			longitude: +longitude2,
			name,
			address: desc
		});
	},

	setRouteData: function(route, type) {
		if (type != "getTransitRoute") {
			let points = [];
			if (route.paths && route.paths[0] && route.paths[0].steps) {
				let steps = route.paths[0].steps;
				wx.setStorageSync("steps", steps);
				steps.forEach(item1 => {
					let poLen = item1.polyline.split(';');
					poLen.forEach(item2 => {
						let obj = {
							longitude: parseFloat(item2.split(',')[0]),
							latitude: parseFloat(item2.split(',')[1])
						}
						points.push(obj);
					})
				})
			}
			this.setData({
				polyline: [{
					points: points,
					color: "#0091ff",
					width: 6
				}]
			});
		} else {
			if (route && route.transits) {
				let transits = route.transits;
				transits.forEach(item1 => {
					let { segments } = item1;
					item1.transport = [];
					segments.forEach((item2, j) => {
						if (item2.bus && item2.bus.buslines && item2.bus.buslines[0] && item2.bus.buslines[0].name) {
							let name = item2.bus.buslines[0].name;
							if (j !== 0) {
								name = '--' + name;
							}
							item1.transport.push(name);
						}
					})
				})
				this.setData({ transits });
			}
		}
		if (type == "getDrivingRoute") {
			if (route.paths[0] && route.paths[0].distance) {
				this.setData({
					distance: route.paths[0].distance + '米'
				});
			}
			if (route.taxi_cost) {
				this.setData({
					cost: '打车约' + parseInt(route.taxi_cost) + '元'
				});
			}
		  } else if (type == "getWalkingRoute" || type == "getRidingRoute") {
				if (route.paths[0] && route.paths[0].distance) {
					this.setData({
						distance: route.paths[0].distance + '米'
					});
				}
				if (route.paths[0] && route.paths[0].duration) {
					this.setData({
						cost: parseInt(route.paths[0].duration / 60) + '分钟'
					});
				}
		  } else if (type == "getRidingRoute") {
	  
		  }
	},

	getRoute: function(e) {
		let { city, latitude, longitude, latitude2, longitude2, cindex } = this.data;
		let types = ["getDrivingRoute", "getWalkingRoute", "getTransitRoute", "getRidingRoute"];
		let type = types[cindex];
		let origin = `${longitude},${latitude}`;
		let destination = `${longitude2},${latitude2}`;
		amap.getRoute(origin, destination, type, city).then(res => {
			this.setRouteData(res, type);
		})
	},

	initMarkers: function(e) {
		let {latitude,longitude,latitude2,longitude2,markers,points,center,preffixUrl} = this.data;
		
		markers = [
			{
				iconPath: preffixUrl+"/mapicon_navi_s.png",
				id: 0,
				latitude,
				longitude,
				width: 23,
				height: 33
			}, {
				iconPath: preffixUrl+"/mapicon_navi_e.png",
				id: 1,
				latitude: latitude2,
				longitude: longitude2,
				width: 24,
				height: 34
			}
		];

		points = [
			{
				latitude,
				longitude,
			},{
				latitude: latitude2,
				longitude: longitude2,
			}
		];

		center = {
			latitude: (latitude + latitude2)/2,
			longitude: (longitude + longitude2)/2,
		}

		this.setData({markers,points,center})
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		utils.loadBBXChannelByOptions(options);
		
		let {city,desc,latitude,longitude,latitude2,longitude2,name} = options;
		this.setData({city,desc,latitude,longitude,latitude2,longitude2,name});
		this.initMarkers();
		this.getRoute();
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