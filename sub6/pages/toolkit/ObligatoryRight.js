// sub6/pages/toolkit/ObligatoryRight.js
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
        array: [
            {
                name: '苏科贷',
                url:'/pages/suke/index?channel=KJZQ0001',
                type:'KJZQ0001'
            },
            {
                name: '人才贷',
                url:'/pages/rencai/index?channel=KJZQ0002',
                type:'KJZQ0002'
            },
            {
                name: '高企贷',
                url:'/sub3/pages/hightech/index?channel=KJZQ0003',
                type:'KJZQ0003'
            },
            {
                name: '专精特新贷',
                url:'/sub6/pages/toolkit/specialization',
                type:'KJZQ0004'
            },
            {
                name: '卡脖子专顶贷',
                url:'/sub6/pages/toolkit/clipNeck',
                type:'KJZQ0005'
            },
            {
                name: '科技防疫贷',
                url:'/sub1/pages/sui/index?channel=KJZQ0006',
                type:'KJZQ0006'
            },
        ],
        agreementShow:false
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
    getAgreement() {
        console.log(1111);
        this.setData({
            agreementShow: true
        })
        console.log(this.data.agreementShow);

    },
    onCloseAgreement() {
        this.setData({
            agreementShow: false
        })
    },
    toAgreement(add) {
        console.log(add.currentTarget.dataset.type);
        app.globalData.channelNo = add.currentTarget.dataset.type.type
        wx.navigateTo({
            url: add.currentTarget.dataset.type.url
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

    }
})