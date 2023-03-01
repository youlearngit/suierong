// sub1/pages/h5/index.js
var CryptoJS = require("../../../utils/encrypt/AES.js");
const app = getApp();
import api from "../../../utils/api";
var util = require("../../../utils/util.js");
import user from "../../../utils/user"

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		loginFlag: true,
		url: "",
		phone: "",
		preffixUrl: app.globalData.URL,
	},

	
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
	
},
	//aes加密
	Encrypt: function (word, key) {
		return CryptoJS.AES.encrypt(word, key).toString();
	},
	//aes解密
	Decrypt: function (data, key) {
		return CryptoJS.AES.decrypt(data, key).toString(CryptoJS.enc.Utf8);
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {},

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
});
