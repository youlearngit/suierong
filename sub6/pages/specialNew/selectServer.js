// sub6/pages/specialNew/selectServer.js
// 给后面开发者提示：该页面主要靠js更改样式
import User from '../../../utils/user';
import { getSalaryCode } from '../../../api/salary';
import skip from '../../../utils/skip';
import utils from '../toolkit/utils';
const app = getApp();
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cndUrl: app.globalData.CDNURL,
    showInfo:{}, //展示信息
    show: false, //遮罩层显示标记
    //不同业务设定不同的样式
    urlItemIndex:0,//url集合类型
    introductionImages:[
      {//专业化融资解决方案
        id:0,
        background_image:'introduction-b1.jpg',
        height:'2950rpx',
        apply_height:'2650rpx',
        return_height: '2800rpx',
        padding_top: '960rpx',
        hasApply: true,
        urls:[
          [
            { 
              name: '专精特新贷',
              url:'/sub6/pages/toolkit/specialization',
              type:'ZJTX001'
            },
            {
              name: '卡脖子专顶贷',
              url:'/sub6/pages/toolkit/clipNeck',
              type:'ZJTX002'
            },
            {
              name:'绿色金融贷款',
              url:'/sub2/pages/photovoltaicLoan/index',
              type:'ZJTX003'
            },
          ]
        ]
      },
      { //精细化稳定企保障方案
        id:1,
        background_image:'introduction-b2.jpg',
        height:'2200rpx',
        apply_height:'0rpx',
        return_height: '2050rpx',
        hasApply: false,
      },
      { //特色化增益服务方案
        id:2,
        background_image:'introduction-b3.jpg',
        height:'2600rpx',
        apply_height:'0rpx',
        return_height: '2400rpx',
        hasApply: false,
      },
      { //新颖化价值提升方案
        id:3,
        background_image:'introduction-b4.jpg',
        height:'2600rpx',
        apply_height:'2350rpx',
        apply_height2:'1280rpx',
        return_height: '2480rpx',
        hasApply: true,
        urls:[
          [
            { 
              name: '招才引智',
              url:'/sub3/pages/bbx/home',
              type:'ZJTX004'
            }
          ],
          [
            {
              name:'六大管家',
              url:'../toolkit/steward',
              type:'ZJTX010'
            },
          ],
        ],
      },
      { //政策解读
        id:4,
        background_image:'introduction-b5.jpg',
        height:'2200rpx',
        apply_height:'0rpx',
        return_height: '2050rpx',
        hasApply: false,
      }
      
    ],
    //跳转专员使用
    location_json: '',
    bbx_channel: '',
    location: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    that = this;
    that.setData({
      id:options.id,
      showInfo:that.data.introductionImages[options.id],
    })
    that.locationInit();
  },
  // 选中跳转业务
  selectNavi(e){
  },
  //打开弹窗
  openOverlay(e){
    that.setData({
      urlItemIndex:e.currentTarget.dataset.id
    });
    // 判断只有一个业务则跳转，超过则显示选择列表
    if(that.data.showInfo.urls[that.data.urlItemIndex].length == 1){
      var url = that.data.showInfo.urls[that.data.urlItemIndex][0].url;
      wx.navigateTo({
        url: url,
      })
      reutrn;
    }
    that.setData({
      show: true,
    });
  },
  //关闭弹窗
  onClose(){
    that.setData({
      show:false,
    });
  },
  //选择跳转业务
  toPage(e){
    var detail = e.detail;
    debugger

    app.globalData.channelNo = e.detail.type
    if(e.detail.url == ''){
        wx.showToast({
          title: '尚未开放',
          icon: 'none',
          mask: true,
          duration: 1500,
      })
    }else{
      //跳转到本服务
      wx.navigateTo({
        url: detail.url
    })
    }
  },
  //返回上一层
  returnPage(){
    wx.navigateBack({
      delta: 1,
    })
  },
  locationInit: async function (e) {
    let {
      location,
      location_json,
      bbx_channel
    } = this.data;
    switch (bbx_channel) {
      case '320282': {
        location = await utils.getLocationByAdcode(bbx_channel);
      }
      break;
    case '310000': {
      location = await utils.getLocationByAdcode(bbx_channel);
    }
    break;
    default: {
      location = await utils.getUserLocation();
    }
    break;
    }
    location_json = JSON.stringify(location);

    this.setData({
      location,
      location_json
    });
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})