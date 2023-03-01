// sub1/pages/info/company_detail.js
import Order from '../../../api/Order';
import WxValidate from '../../../assets/plugins/wx-validate/WxValidate';
import user from '../../../utils/user';
var citys = require('../../../pages/public/city.js');
var util = require('../../../utils/util.js');
import requestYT from '../../../api/requestYT';

const app = getApp();
const date = new Date();

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		cndUrl: app.globalData.CDNURL,
		preffixUrl: app.globalData.URL,

		options: {},

		talent: {},
		talentJson: '', // 传递给其他页面的参数集
		talent_levels: {'1':'国家级','2':'省级','3':'市级','4':'区县'},
        btnShow: false,
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
    onLoad: function(options) {
        this.setData({ options });
        wx.showLoading({
            title: '加载中...',
        });
        this.initData();
    },

	call() {
		wx.makePhoneCall({
			phoneNumber: this.data.empInfo.phone,
		});
	},

    getStaff: async function(bbx_channel) {
        let res;
        // wx.showLoading({
        //     title: '加载中...',
        // });
        let selectStaff = async function({ type, code, adcode_type }) {
            // code: adcode(adcode_type:1|2|4) 机构号(adcode_type:3)
            // type: 1,2-金融服务专员&政策服务专员 3-创业导师 4-特殊(宜兴-陶都英才) 5-总行专员 6-特殊(上海-海聚英才)
            // adcode_type: 1-区xxxxxx 2-市xxxx00 3-支行机构 4-省xx0000
            type = type + '';
            let data = { type };
            if (code) {
                code = code + '';
                data.code = code;
            }
            if (!adcode_type && code) {
                adcode_type = '1'
                if (code.substr(4) == '00') {
                    adcode_type = '2';
                }
                if (code.substr(2) == '0000') {
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
            let res = await selectStaff({ type: 6 });
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
    console.log('staff',staff)
		let {empInfo,preffixUrl} = this.data;
		empInfo = {
			avatar: staff.HEAD || app.globalData.CDNURL+'/static/wechat/img/bbx/avatar_default.png',
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

	async initData(e) {
		let {options,identity,talent} = this.data;
		let res;
		identity = await user.getIdentityInfo();
		this.setData({identity});
		talent.getway = [];
	
	    try {
			res = await user.getTalentInfo2(identity.ID_NUMBER); // sui/suiZHYQ0019.do
       //res = await this.ZHYQ0019({zjhm:identity.ID_NUMBER}); // zhyq/getRecordByECIFNo.do
       console.log('ZHYQ0019',res);
		   talent['ZHYQ0019'] = res;
		   if (res.rcxm) { talent.getway.push('ZHYQ00191'); }
	   } catch (err) {
		   talent['ZHYQ0019'] = {};
	   }

	   try { // /sui/getRcrz.do
			res = await user.getRencai(identity.ID_NUMBER, '小企业金融部', '120025');
			talent['getRcrz'] = res.basic;
			if (res.basic.talentname) { talent.getway.push('getRcrz'); }
		} catch (err) {
			talent['getRcrz'] = {};
		}
		talent.plancity = talent['ZHYQ0019'].pddq || talent['getRcrz'].talentplancity; // 地区
		talent.planlevel = talent['ZHYQ0019'].rcdj || talent['getRcrz'].talentlevel; // 人才计划等级
		talent.planname = talent['ZHYQ0019'].rclbmc || talent['getRcrz'].talentplanname; // 人才计划名称
		talent.plandate = talent['ZHYQ0019'].pdnf || talent['getRcrz'].talentplandate; // 年份
		talent.plantype = talent['ZHYQ0019'].rcdl || ''; // 人才大类
        talent.name = talent['ZHYQ0019'].rcxm || talent['getRcrz'].talentname; // 姓名
		if(Number(talent.planlevel) > 4 ||(talent.planlevel && talent.planlevel.indexOf('\N') > -1)){
			talent.planlevel = "";
		} 
		if(talent.planname && talent.planname.indexOf('\N') > -1) {
			talent.planname = "";
		}
		this.setData({
			talent,
			talentJson: JSON.stringify({
				talentplancity: talent.plancity,
				talentlevel: talent.planlevel,
				talentplanname: talent.planname,
				talentplandate: talent.plandate,
            }),
            btnShow: true,
        });

		let {channel,bbx_channel} = options;
		this.getStaff(bbx_channel);
	},

	async ZHYQ0019({zjhm}) {
		let options = {
			url: 'zhyq/getRecordByECIFNo.do',
			data: {
				zjhm,
				mark: '1', // 1-查询 2-更新
			},
		};
		let res = await requestYT(options);
		if (res.STATUS === '1') {
			return Promise.resolve(res);
		}
		return Promise.reject(new Error(res.msg));
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
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

	set_rencai: function () {
		var that = this;
		wx.request({
			url: app.globalData.URL + 'saveRcrz',
			data: {
				companyName: '', // 公司名称
				openId: wx.getStorageSync('openid'),
			},
			header: {
				'Content-Type': 'application/x-www-form-urlencoded',
				key: Date.parse(new Date()).toString().substring(0, 6),
			},
			method: 'POST',
			success(res) {},
			error(res) {},
		});
	},

});
