// sub1/pages/list/list.js

const app = getApp();
import requestP from "../../../utils/requsetP";
import skip from "../../../utils/skip";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
			// {
			// 	name: "北京",
			// 	code: "17",
			// },
			// {
			// 	name: "深圳",
			// 	code: "16",
			// },
			// {
			// 	name: "上海",
			// 	code: "15",
			// },
			{
				name: "杭州",
				code: "18",
			},
			{
				name: "南京",
				code: "19",
			},
			{
				name: "无锡",
				code: "02",
			},
			{
				name: "苏州",
				code: "03",
			},
			{
				name: "南通",
				code: "04",
			},
			{
				name: "常州",
				code: "05",
			},
			{
				name: "淮安",
				code: "06",
			},
			// {
			// 	name: "徐州",
			// 	code: "07",
			// },
			// {
			// 	name: "扬州",
			// 	code: "08",
			// },
			// {
			// 	name: "盐城",
			// 	code: "09",
			// },
			{
				name: "镇江",
				code: "10",
			},
			// {
			// 	name: "连云港",
			// 	code: "11",
			// },
			{
				name: "宿迁",
				code: "12",
			},
			{
				name: "泰州",
				code: "13",
			},
		],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
			preffixUrl: app.globalData.URL,
    });
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