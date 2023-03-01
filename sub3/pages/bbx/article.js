// sub3/pages/bbx/article.js
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

		bbx_channel: '',

		article: {},
		staffs: [],
		
	},

	getStaffs: async function(code) {
		let {bbx_channel} = this.data;
		let res;
		let list = [];
		
		if (bbx_channel=='320282') {
			list = await talent.tdycStaff();
		} else {
			let codes = [];
			if (!code) {
				let location = await utils.getUserLocation();
				codes = location.codes;
				codes = codes.reverse();
			} else if (code == '000000') {
				codes = [110000, 310000, 320000, 330000, 440000]; // 库中所有省
			} else {
				if (code.substr(2)=='0000') {
					codes = [code];
				} else if (code.substr(4)=='00') {
					codes = [code, code.substr(0,2)+'0000'];
				} else {
					codes = [code, code.substr(0,4)+'00', code.substr(0,2)+'0000'];
				}
			}
			for (let i in codes) {
				res = await talent.selectStaff({ type:2, code:codes[i] });
				list = list.concat(res.LIST || []);
			}
			list = list.filter(x=>x.TYPE=='2');
			list = list.splice(0,1);
		}
		
		return list;
	},

	getData: async function(ID) {
		if (!ID) {
			return;
		}

		let {article,staffs,bbx_channel} = this.data;
		let res;

		wx.showLoading({
		  	title: '加载中',
		})

		bbx_channel = utils.getBBXChannel().channel;
		this.setData({ bbx_channel });
		
		res = await talent.selectDetail(ID);
		if (res.LIST) {
			article = talent.policyDisplay(res.LIST[0]);
		}

		this.setData({ article });

		wx.hideLoading();

		staffs = await this.getStaffs(article.AREA);
		this.setData({ staffs });
		
	},

	phoneCall: function(e) {
		let {phone} = e.currentTarget.dataset;
		if (phone) {
			wx.makePhoneCall({
				phoneNumber: phone,
			})
		}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		utils.loadBBXChannelByOptions(options);

		let {ID} = options;
		this.getData(ID);
	},

	downloadPdf: async function () {
		let that = this;
		let {article} = this.data;

		if (!article.POLICYPDF) {
			return;
		}

		wx.showLoading({
            title: '下载中',
            mask: true,
		});

		let res = await talent.readPdf(article.POLICYPDF);
		let pdf = res.PDF;
		
		let filePath = wx.env.USER_DATA_PATH + '/' + article.NAME + '.pdf';
		let fileData = pdf;

		if (!fileData) {
			wx.hideLoading();
			wx.showToast({
				title: '下载异常',
				icon: 'none'
			});
			return;
		}

		wx.getFileSystemManager().writeFile({
			filePath: filePath,
			data: fileData,
			encoding: 'base64',
			success: res => {
				wx.hideLoading();
				wx.showToast({
					title: '下载成功'+filePath,
					icon: 'none',
					duration: 1500
				});
				
				wx.openDocument({
					filePath: filePath,
					fileType: 'pdf',
					success: function(res) {
					},
					fail: function(err) {
						wx.showToast({
							title: '查看失败'+err,
							icon: 'none'
						});
					},
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
		let {article} = this.data;
		return utils.shareWithBBXChannel({
			params: `&channel=${utils.getBBXChannel().track_channel}&ID=${article.ID}`,
		});
	}

})