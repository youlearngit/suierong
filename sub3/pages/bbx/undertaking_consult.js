var app = getApp();
import utils from './utils';
import talent from './talent';
import api from '../../../utils/api';

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		preffixUrl: utils.preffixUrl(),
		location: {},

		list: [],
		list_other: [],

	},

	phoneCall: function(e) {
		let {phone} = e.currentTarget.dataset;
		if (phone) {
			wx.makePhoneCall({
				phoneNumber: phone,
			})
		}
	},
	
	getData: async function () {
		let {location} = this.data;
		if (!location.adcode) {
			location = await utils.getUserLocation();
			this.setData({ location });
		}
		let {adcode} = location;

		let list = [];
		let list_other = [];

		let all = [];
		let adcode_city = adcode.substr(0,4)+'00';
		let res = await talent.selectStaff({ type:3, code:adcode_city })
		if (res.LIST) {
			all = res.LIST;
			list = all.filter(x=>x.CITY);
			list_other = all.filter(x=>!x.CITY);
		}

		this.setData({list,list_other});
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		utils.loadBBXChannelByOptions(options);
		
		let {location} = options;
		location = location?JSON.parse(location):{};

		this.getData();
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