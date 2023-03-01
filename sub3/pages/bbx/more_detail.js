// sub3/pages/bbx/more_detail.js
var app = getApp();
import utils from './utils';
import talent from './talent';
import requestYT from '../../../api/requestYT';
import api from '../../../utils/api';
var util = require('../../../utils/util.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		preffixUrl: utils.preffixUrl(),
    preffixUrls: app.globalData.CDNURL,
		code: '0',
    pic: '',
    lxfsList:[
			{
				"branch":"无锡分行",
				"contacts":"费经理",
				"phone":"15052227552",
			},
			{
				"branch":"苏州分行",
				"contacts":"毛经理",
				"phone":"15006210031",
			},
			{
				"branch":"南通分行",
				"contacts":"韩经理",
				"phone":"15951318080",
			},
			{
				"branch":"常州分行",
				"contacts":"严经理",
				"phone":"13706118143",
			},
			{
				"branch":"淮安分行",
				"contacts":"沈经理",
				"phone":"18052380357",
			},
			{
				"branch":"徐州分行",
				"contacts":"刘经理",
				"phone":"18852166603",
			},
			{
				"branch":"扬州分行",
				"contacts":"陈经理",
				"phone":"15161818568",
			},
			{
				"branch":"镇江分行",
				"contacts":"朱经理",
				"phone":"15252900906",
			},
			{
				"branch":"盐城分行",
				"contacts":"姜经理",
				"phone":"18662071870",
			},
			{
				"branch":"连云港分行",
				"contacts":"尚经理",
				"phone":"18961309607",
			},
			{
				"branch":"宿迁分行",
				"contacts":"陈经理",
				"phone":"13951453900",
			},
			{
				"branch":"泰州分行",
				"contacts":"缪经理",
				"phone":"15152627043",
			},
			{
				"branch":"南京分行",
				"contacts":"沈经理",
				"phone":"15951035058",
			},
			{
				"branch":"北京分行",
				"contacts":" 郭经理",
				"phone":"15313090826",
			},
			{
				"branch":"深圳分行",
				"contacts":"张经理",
				"phone":"13699862880",
			},
			{
				"branch":"上海分行",
				"contacts":"杨经理",
				"phone":"18516319952",
			},
			{
				"branch":"杭州分行",
				"contacts":"张经理",
				"phone":"13646845953",
			}
    ],
    empInfo:{ // 人才专员
			avatar: app.globalData.CDNURL +'/static/wechat/img/bbx/' + 'avatar_default.png',
			name: '', // eg. '钱海涛'
			org:'', // eg. '江苏银行无锡宜兴支行'
			position: '', // eg. '普惠金融部经理'
			tags: [], // eg. ['科技金融', '人才金融', '普惠金融']
			phone: '', // eg. '18352590101'
			desc: '', // eg. '江苏银行支持人才创新创业'
			type: '', // eg. '金融'
		}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		utils.loadBBXChannelByOptions(options);
		this.getStaff("");
		let {code,pic} = options;
		this.setData({
			code: code,
			pic: pic,
		});
	},
  call() {
		wx.makePhoneCall({
			phoneNumber: this.data.empInfo.phone,
		});
  },
  getStaff: async function(bbx_channel){
		let res;
		let selectStaff = async function({type,code,adcode_type}) {
			// code: adcode(adcode_type:1|2|4) 机构号(adcode_type:3)
			// type: 1,2-金融服务专员&政策服务专员 3-创业导师 4-特殊(宜兴-陶都英才) 5-总行专员 6-特殊(上海-海聚英才)
			// adcode_type: 1-区xxxxxx 2-市xxxx00 3-支行机构 4-省xx0000
			type = type+'';
			let data = { type };
			if (code) {
				code = code+'';
				data.code = code;
			}
			if (!adcode_type && code) { 
				adcode_type = '1'
				if (code.substr(4)=='00') {
					adcode_type = '2';
				}
				if (code.substr(2)=='0000') {
					adcode_type = '4';
				}
			}
			if (adcode_type) {
				data.adcode_type = adcode_type;
			}
	
			let options = {
				url: 'talent/selectStaff.do',
				data: data,
			};
			let res = await requestYT(options);
		
			if (res.STATUS === '1') {
				return res;
			}
			return Promise.reject(new Error(res.result_msg));
		}
		let hjycStaff = async function() {
            let res = await selectStaff({type:6});
            let staffs = res.LIST || [];
            if (staffs.length>0) {
                for (let i in staffs) {
                    staffs[i].TYPE = staffs[i].ID.split('_')[0]; // 特殊处理: ID=`${TYPE}_${ID}`
                }
            }
            return staffs;
        }
        let tdycStaff = async function() {
            let res = await selectStaff({type:4});
            let staffs = res.LIST || [];
            if (staffs.length>0) {
                for (let i in staffs) {
                    staffs[i].TYPE = staffs[i].ID.split('_')[0]; // 特殊处理: ID=`${TYPE}_${ID}`
                }
            }
            return staffs;
        }
		let scopeUserLocation = async function () {
		return new Promise(function(resolve,reject){
			wx.getSetting({
			success: (res) => {
				if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] == false) {
				wx.showModal({
					title: '请求授权当前位置',
					content: '需要获取您的地理位置，请确认授权',
					success: function (res) {
					if (res.cancel) {
						wx.showToast({
						title: '拒绝授权',
						icon: 'none',
						duration: 1000,
						});
						return reject('拒绝授权');
					} else if (res.confirm) {
						wx.openSetting({
						success: function (dataAu) {
							if (dataAu.authSetting['scope.userLocation'] == true) {
							wx.showToast({
								title: '授权成功',
								icon: 'success',
								duration: 1000,
							});
							return resolve();
							} else {
							wx.showToast({
								title: '授权失败',
								icon: 'none',
								duration: 1000,
							});
							return reject('授权失败');
							}
						},
						});
					}
					},
				});
				} else if (res.authSetting['scope.userLocation'] == undefined) {
				return resolve();
				} else {
				return resolve();
				}
			},
			});
		});
		}
		let getLocation = async function() {
		return new Promise(function(resolve,reject){
			wx.getLocation({
			type: 'wgs84', //gcj02
			success: function (res) {
				// let latitude = res.latitude;
				// let longitude = res.longitude;
				return resolve(res);
			},
			fail: function (err) {
				return reject(err)
			},
			});
		});
		}
		let reverseGeocoder = async function(latitude,longitude) {
		return new Promise(function(resolve,reject){
			let QQMapWX = require('../../../assets/plugins/qqmap-wx-jssdk1.2/qqmap-wx-jssdk.js');
			let qqmapsdk = new QQMapWX({
			key: '2RIBZ-UTLC2-AWQUY-C7I2T-3YKN5-AIF4D',
			});
			qqmapsdk.reverseGeocoder({
			location: {
				latitude: latitude,
				longitude: longitude,
			},
			success: function (res) {
				let province = res.result.ad_info.province;
				let city = res.result.ad_info.city;
				let district = res.result.ad_info.district;
				let adcode = res.result.ad_info.adcode;
				return resolve({
				latitude: latitude,
				longitude: longitude,
				province: province,
				city: city,
				district: district,
				adcode: adcode,
				codes: [adcode.substr(0,2)+'0000', adcode.substr(0,4)+'00', adcode],
				values: [province, city, district],
				});
			},
			fail: function (err) {
				return reject(err);
			},
			complete: function (res) {
				
			},
			});
		});
		}
		let getUserLocation = async function() {
		let res = await scopeUserLocation();
		res = await getLocation();
		let {latitude,longitude} = res;
		res = await reverseGeocoder(latitude,longitude);
		// latitude: 32.05838, longitude: 118.79647, province: "江苏省", city: "南京市", adcode: "320102"
		return res;
		}
		let getNetwork = async function(page,limit) {
		let options = {
			url: 'jsyh/getNetwork.do',
			data: JSON.stringify({
			PAGE_SIZE: limit?limit+"":"300",
			NEXT_KEY: page?page+"":"1",
			week: new Date().getDay() + ''
			}),
		};
		let res = await requestYT(options);
		// res.NEXT_KEY:2 res.PAGE_NUM:300 res.TOTAL_NUM:566
		// res.LIST[0]: 
		// CITY: "320100000000"
		// C_AM: "8:30-12:00"
		// C_PM: "14:00-17:00"
		// ID: "304"
		// LOCATION_LAT_NAVI: "32.0554449"
		// LOCATION_LONG_NAVI: "118.78470211"
		// ORG_ADDRESS: "南京市中山路338号"
		// ORG_CODE: "3111"
		// ORG_FULL_NAME: "江苏银行股份有限公司南京鼓楼支行"
		// ORG_SHORT_NAME: "南京鼓楼支行"
		// P_AM: "8:30-12:00"
		// P_PM: "12:00-17:00"
		// TELE_COMPANY: "025-58588499"
		// TELE_PERSONAL: "025-58588498"
		if (res.STATUS === '1') {
			return res;
		}
		return Promise.reject(new Error(res.result_msg));
		}

		let location = await getUserLocation();

		let mkData = [];
		let locData;
		for (let page=1;page<3;page++) {
			let res = await getNetwork(page);
			if (res.LIST) {
				mkData = mkData.concat(res.LIST)
			}
			if (!res.NEXT_KEY) {
				break;
			}
		}
		for (let i in mkData) {
			mkData[i].ORG_FULL_NAME = mkData[i].ORG_FULL_NAME.replace(/股份有限公司/g,'');

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
		}
		mkData.sort(function(x,y){
			return x.distance_km - y.distance_km;
		});
		locData = mkData.find(x=>x.distance_km);

		let staffs = [];
		if (bbx_channel=='320282') {
			staffs = await tdycStaff();

			if (staffs.length>0) {
				staffs.sort(function(x,y){
					return y.TYPE - x.TYPE;
				});
			}
		} else if (bbx_channel=='310000') {
			staffs = await hjycStaff();
			if (staffs.length>0) {
				staffs.sort(function(x,y){
					return y.TYPE - x.TYPE;
				});
			}
		} else {
			res = await selectStaff({ type:1, code:locData.ORG_CODE, adcode_type:'3' }); // 支行专员
			if (!res.LIST) {
			res = await selectStaff({ type:1, code:location.codes[2] }); // 区专员
			}
			if (!res.LIST) {
			res = await selectStaff({ type:1, code:location.codes[1] }); // 市专员
			}
			if (!res.LIST) {
			res = await selectStaff({ type:4 }); // 总行专员
			}
			staffs = res.LIST || [];
		}

		if (staffs.length>0) {
			staffs = staffs.filter(x=>x.AGENCYNO&&x.TYPE=='1');

			for (let i in staffs) {
				staffs[i].distance_km = 0;
				let mk = mkData.find(x=>x.ORG_CODE==staffs[i].AGENCYNO);
				if (mk) {
					staffs[i].mk = mk;
					staffs[i].distance = mk.distance;
					staffs[i].distance_km = mk.distance_km;
				}
			}

			staffs.sort(function(x,y){
				return x.distance_km - y.distance_km;
			});
		}

		let staff = staffs[0] || {};
		let {empInfo,preffixUrls} = this.data;
		empInfo = {
			avatar: staff.HEAD || preffixUrls+'/static/wechat/img/bbx/avatar_default.png',
			name: staff.STAFFNAME,
			position: staff.WORKUNIT + (staff.JOB ? '丨' + staff.JOB : ''),
			tags: [staff.LABEL1, staff.LABEL2, staff.LABEL3].filter(x=>x),
			phone: staff.TEL,
			desc: staff.RESUME,
			type: staff.TYPE==1?'金融':'政策',
		},
		this.setData({ empInfo });
		wx.hideLoading();
		return staff;    
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