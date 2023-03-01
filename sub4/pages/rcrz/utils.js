import api from '../../../utils/api';

var app = getApp();

var dateTransfer = function (fmt) {
	var o = {
		"M+": this.getMonth() + 1,
		"d+": this.getDate(),
		"h+": this.getHours(),
		"m+": this.getMinutes(),
		"s+": this.getSeconds(),
		"q+": Math.floor((this.getMonth() + 3) / 3),
		S: this.getMilliseconds(),
	};
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(
		RegExp.$1,
		(this.getFullYear() + "").substr(4 - RegExp.$1.length)
		);
	}
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(fmt)) {
		fmt = fmt.replace(
			RegExp.$1,
			RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
		);
		}
	}
	return fmt;
}

Date.DateFormat = function (timeSpan, fmt, formatDateNullValue) {
	if (!timeSpan) {
		if (formatDateNullValue) {
		return formatDateNullValue;
		}
		return "null";
	}
	var date = new Date(timeSpan);
	return dateTransfer.call(date, fmt);
}

function preffixUrl() {
	// @199: /home/rhedt-interface-1_1_1-PROD_war.ear/rhedt-interface-1.1.1-DEV.war/WEB-INF/classes/static/wechat/img/rcrz
	return app.globalData.CDNURL +'/static/wechat/img/rcrz/';
}

function getGlobalData(key) {
	if (!app.globalData.rcrz) {
		app.globalData.rcrz = {}
	}
	return app.globalData.rcrz[key];
}

function setGlobalData(key,val) {
	if (!app.globalData.rcrz) {
		app.globalData.rcrz = {}
	}
	app.globalData.rcrz[key] = val;
}

function scopeUserLocation() {
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

function getUserLocation(type='gcj02',cache=true) {
	return new Promise(function(resolve,reject){
		if (cache) {
			let loc = getGlobalData('getUserLocation');
			if (loc) {
				if (loc._invalid && loc._invalid>Date.parse(new Date())) {
					return resolve(loc);
				}
			}
		}
		scopeUserLocation().then(res=>{
			getLocation(type).then(res=>{
				let {latitude,longitude} = res;
				reverseGeocoder(latitude,longitude).then(res=>{
					res._invalid = Date.parse(new Date())+5*60*1000;
					setGlobalData('getUserLocation',res);
					return resolve(res);
				})
			})
		})
	})

// 	let res = await scopeUserLocation();
// 	res = await getLocation(type);
// 	let {latitude,longitude} = res;
// 	res = await reverseGeocoder(latitude,longitude);
// // latitude: 32.05838, longitude: 118.79647, province: "江苏省", city: "南京市", district: "玄武区", adcode: "320102", codes: [], values: []
// 	return res;
}

function getLocation(type='gcj02') {
	return new Promise(function(resolve,reject){
		wx.getLocation({
			type: type, //gcj02 wgs84
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

function reverseGeocoder(latitude,longitude) {
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

function pdfReadBase64(base64,name="") {
	name = name || Date.DateFormat(new Date(),'yyyyMMddhhmmss');
	let filePath = wx.env.USER_DATA_PATH + '/' + name + '.pdf';
	let fileData = base64;
	wx.showLoading({
		title: '加载中',
		mask: true,
	});
	wx.getFileSystemManager().writeFile({
		filePath: filePath,
		data: fileData,
		encoding: 'base64',
		success: res => {
			wx.showToast({
				title: '下载成功'+filePath,
				icon: 'none',
				duration: 1500
			});
			
			wx.openDocument({
				filePath: filePath,
				fileType: 'pdf',
				success: (res)=>{
				},
				fail: (err)=>{
					wx.showToast({
						title: '查看失败'+err,
						icon: 'none'
					});
				},
				complete: (res)=>{
					wx.hideLoading();
				}
			})
		},
		fail: err => {
			wx.hideLoading();
			wx.showToast({
				title: '下载失败',
				icon: 'none'
			});
		}
	})
}

module.exports = {
	preffixUrl : preffixUrl,
	getGlobalData: getGlobalData,
	setGlobalData: setGlobalData,
	scopeUserLocation : scopeUserLocation,
	getUserLocation : getUserLocation,
	getLocation : getLocation,
	reverseGeocoder : reverseGeocoder,
	pdfReadBase64 : pdfReadBase64,

}