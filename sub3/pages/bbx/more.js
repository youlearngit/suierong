// sub1/pages/product/index.js

const app = getApp();
import api from "../../../utils/api";
import utils from './utils';
import talent from './talent';
var that;

Page({

	data: {
		preffixUrl: utils.preffixUrl(),
		cndUrl: app.globalData.CDNURL,
		TabCur: 0,
		// code 1-描述图 2-小程序页面 3-h5 0-期待
		// code2-page code3-h5
		products: [ 
			[
				{
					NAME: "人才信用卡",
					URL: utils.preffixUrl()+'talent_card_apply3.png',
					code: '2',
					page: '/sub1/pages/talent/index',
					tracking: 6,
				},{
					NAME: "人才专享理财",
					URL: utils.preffixUrl()+'talent_finance3.png',
					code: '2',
					page: '/sub3/pages/bbx/talent_finance',
					tracking: 7,
				},{
					NAME: "人才消费贷",
					URL: utils.preffixUrl()+'talent_consumption_loan3.png',
					code: '2',
					page: '/sub1/pages/consumer/index',
					tracking: 8,
				},{
					NAME: "人才经营贷",
					URL: utils.preffixUrl()+'talent_sui_loan3.png',
					code: '2',
					page: '/sub1/pages/sui/index',
					tracking: 9,
				},{
					NAME: "人才投",
					URL: utils.preffixUrl()+'talent_tou.png',
					code: '2',
					page: '/sub3/pages/bbx/more_detail?code=1&pic='+utils.preffixUrl()+'talent_tou_0806.png',
					tracking: 10,
				},{
					NAME: "人才租",
					URL: utils.preffixUrl()+'talent_zu.png',
					code: '2',
					page: '/sub3/pages/bbx/more_detail?code=1&pic='+utils.preffixUrl()+'talent_zu_0811.jpg',
					tracking: 11,
				}
			],[
				{
					NAME: "房贷计算器",
					URL: utils.preffixUrl()+'mortgage_calculation3.png',
					code: '2',
					page: '/pages/showWeb/showWeb?skipUrl=https://csh.jsbchina.cn/eHomeLife/calculator/monthLimitCalculator.do',
					tracking: 12,
				},
				{
					NAME: "房产评估",
					URL: utils.preffixUrl()+'house_assessment3.png',
					code: '2',
					page: '/pages/house/house',
					tracking: 13,
				},{
					NAME: "创业咨询",
					URL: utils.preffixUrl()+'undertaking_consult.png',
					code: '2',
					page: '/sub3/pages/bbx/undertaking_consult?location=',
					tracking: 14,
				},{
					NAME: "结汇购汇",
					URL: utils.preffixUrl()+'foreign_rate3.png',
					code: '2',
					page: '/sub3/pages/bbx/foreign_rate',
					tracking: 15,
				},{
					NAME: "附近网点",
					URL: utils.preffixUrl()+'icon_80_monopoly_org.png',
					code: '2',
					page: '/sub3/pages/bbx/staff_map?location=',
					tracking: 16,
				}
			]
		],
		showProducts: true, //先加载 在展示
		CustomBar: app.globalData.StatusBar,
		tpyeArray: [
			"金融服务",
			"增值服务",
		],
		location: {},
		location_json: '',

	},

	initData: async function(options) {
		let {products} = this.data;
		let location_json = options.location;
		let location = location_json?JSON.parse(location_json):{};
		if (!location.adcode) {
			location = await utils.getUserLocation();
			location_json = JSON.stringify(location);
		}
		for (let i in products) {
			for (let n in products[i]) {
				if (['创业咨询','附近网点'].indexOf(products[i][n].NAME)>-1) {
					products[i][n].page += location_json;
				}
			}
		}
		this.setData({location,location_json,products})
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.initData(options);

		this.setData({
			currentPage: getCurrentPages().length,
			TabCur: options.id ? parseInt(options.id) : 0,
		});
		that = this;
	},

	skip(e) {
		let i = e.currentTarget.dataset.i;
		let skipType = that.data.products[that.data.TabCur][i].code;
		let tracking = that.data.products[that.data.TabCur][i].tracking;
		talent.tracking(tracking)
		// 1-描述图 2-小程序页面 3-h5 0-期待
		switch (skipType) {
			case '1':{
				let pic = that.data.products[that.data.TabCur][i].pic;
				wx.navigateTo({
					url: '/sub3/pages/bbx/more_detail?code=1&pic='+pic,
				});
			}break;
			case '2':{
				wx.navigateTo({
					url: that.data.products[that.data.TabCur][i].page,
				});
			}break;
			case '3':{
				let skipUrl = that.data.products[that.data.TabCur][i].h5;
				wx.navigateTo({
					url: '/pages/showWeb/showWeb?skipUrl=' + encodeURIComponent(skipUrl),
				});
			}break;
			case '0':{
				wx.showToast({
					title: "敬请期待",
					icon: "none",
					mask: true,
					duration: 1000,
				});
			}break;
			default:{
			}break;
		}
	},

	tabSelect(e) {
		this.setData({
			TabCur: e.currentTarget.dataset.id,
		});
	},


});