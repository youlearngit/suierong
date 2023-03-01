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
	 * 用户点击右上角分享
	 */
	// onShareAppMessage: function() {
	//   var that = this;
	//   // let params = "&empNo="+;
	//   let imagePath =
	//     that.data.preffixUrl + "/static/wechat/img/sui/sui_325.png";

	//   // 获取加载的页面
	//   let pages = getCurrentPages();
	//   // 获取当前页面的对象
	//   let currentPage = pages[pages.length - 1];
	//   // 当前页面url
	//   let url = currentPage.route;
	//   let share_id = wx.getStorageSync("openid");
	//   var path =
	//     "pages/shop/index2" +
	//     "?open_id=" +
	//     share_id +
	//     "&share_date=" +
	//     util.formatTime(new Date())
	//   return {
	//     path: path,
	//     imageUrl: imagePath,
	//   };

	// },
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var that = this;

        user.getCustomerInfo().then(res=>{
            var phone = res.TEL; //res.data.data[0].TEL   //18066119858 测试数据
						var word = phone;
						var key = "qybankjscryptxcx123123";
						var jiami = that.Encrypt(word, key);
						//console.log("手机号加密后" + jiami);
						var jiemi = that.Decrypt(jiami, key);
						//console.log("手机号解密后" + jiemi);
						that.setData({
							url: "https://qybank.jsbchina.cn/qybankA/page/index.html#page/99/01/P9901.html",
							// url: "https://qybanktest.jsbchina.cn/qybanksit/page/index.html#page/99/01/P9901.html",
							phone: jiami,
						});
        }).catch(err=>{
            wx.showToast({
                title: "暂无数据",
                icon: "none",
                duration: 2000,
            });
        })
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
