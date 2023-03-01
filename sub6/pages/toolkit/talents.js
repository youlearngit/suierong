// sub6/pages/toolkit/talents.js
const app = getApp();
import utils from './utils';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        cndUrl:app.globalData.CDNURL,
        preffixUrl: utils.preffixUrl(),
        location_json:'',
        bbx_channel:'',
        location:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    locationInit: async function (e) {
      let {location,location_json,bbx_channel} = this.data;
  
      switch (bbx_channel) {
        case '320282':{
          location = await utils.getLocationByAdcode(bbx_channel);
        }break;
        case '310000':{
          location = await utils.getLocationByAdcode(bbx_channel);
        }break;
        default:{
          location = await utils.getUserLocation();
        }break;
      }
      location_json = JSON.stringify(location);
  
      this.setData({ location, location_json });
    },
    getBace(){
        wx.navigateBack({ delta: 1})
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