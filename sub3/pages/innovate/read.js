// sub3/pages/innovate/read.js
var app = getApp();
import utils from './utils';
import innovation from './innovation';

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		preffixUrl: utils.preffixUrl(),

		read_inter: false,
		read_sec: 5,

		time_now: Date.DateFormat(new Date(),'yyyy年MM月dd日'),

	},

	async pdfLoad(e) {
		wx.showLoading({
            title: "加载中",
            mask: true,
		});

		// let filename = "47c537c822a74120850d5865b5b27f27.pdf";

		// let res = await innovation.readPdf(filename);
		// let pdf = res.PDF;
		
		// let filePath = wx.env.USER_DATA_PATH + '/' + filename;
		// let fileData = pdf;

		// if (!fileData) {
		// 	wx.hideLoading();
		// 	wx.showToast({
		// 		title: '下载异常',
		// 		icon: 'none'
		// 	});
		// 	return;
		// }

		// wx.getFileSystemManager().writeFile({
		// 	filePath: filePath,
		// 	data: fileData,
		// 	encoding: 'base64',
		// 	success: res => {
		// 		wx.hideLoading();
				
		// 		wx.openDocument({
		// 			filePath: filePath,
		// 			fileType: 'pdf',
		// 			success: function(res) {
		// 			},
		// 			fail: function(err) {
		// 				wx.showToast({
		// 					title: '查看失败'+err,
		// 					icon: 'none'
		// 				});
		// 			},
		// 		})
		// 	},
		// 	fail: err => {
		// 		wx.hideLoading();
		// 		wx.showToast({
		// 			title: '下载失败',
		// 			icon: 'none'
		// 		});
		// 	}
		// })
	},

	readSec(e) {
		let {read_inter,read_sec} = this.data;
		let that = this;
		if (!read_inter) {
			read_inter = setInterval(()=>{
				read_sec--;
				that.setData({read_sec});
				if (read_sec<=0) {
					clearInterval(read_inter);
				}
			},1000)
			this.setData({read_inter});
		}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		// this.pdfLoad();
		this.readSec();
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

	}
})