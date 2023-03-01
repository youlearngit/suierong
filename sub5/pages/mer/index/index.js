const App = getApp();

import user from '../../../../utils/user';
import api from '../../../../utils/api';
import Toast from '@vant/weapp/toast/toast';
import { Mer } from '../services/Mer';
import * as mock from '../mock/mock';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cdnMer: App.globalData.CDNURL + '/static/wechat/img/mer/',
    
    wknow_show: '',

    loginFlag: true,

    posters_show: false,
    posters_media: [],
    
    empNo: '', // 员工号

  },

  onChangeCollapse(event) {
    let {detail} = event;
    this.setData({
      wknow_show: detail
    });
    setTimeout(()=>{
      wx.pageScrollTo({
        selector: `#wknow_${detail}`,
      })
    },300)

  },

  async recommend() {
    let res_auth = await user.ifAuthUserInfo();
    if (!res_auth) {
      this.setData({loginFlag:false});
      return;
    }
    wx.navigateTo({
      url: `../recommend/recommend?title=推荐有礼`,
    });

  },

  async share () {
    let res_auth = await user.ifAuthUserInfo();
    if (!res_auth) {
      this.setData({loginFlag:false});
      return;
    }
    this.setData({
      posters_show: true,
    });
  },

  async apply () {
    let openid = Mer.openid();
    let res_info = await Mer.selectMyrInfo(openid);
    if (res_info.msgCode != '0000') {
      wx.navigateTo({
        url: '../idcard/idcard?reurl=/sub5/pages/mer/form/form'
      })
      return;
    }
    let infos = JSON.parse(res_info.myrInfo);
    let info = infos[0];
    if (info.STEP=='2' && !info.IMAGE_ID) {
      wx.navigateTo({
        url: '../license/license?reurl=/sub5/pages/mer/form/form',
      })
      return;
    }
    wx.navigateTo({
      url: '../form/form',
    })
  },

  async initData(options) {
    let empNo = options.empNo ? options.empNo : App.globalData.empNo;
    this.setData({empNo});

    // let qr_page = 'sub5/pages/index';
    let qr_page = 'sub5/pages/mer/index/index'
    let qr_params = '';
    let qr_scene = Mer.openid();
    let qr_img = await api.generateMiniCode(qr_page, qr_params, qr_scene);
    let posters_media = [
      [
        {
          type: 'bg',
          img: App.globalData.CDNURL + '/static/wechat/img/mer/minihb.png',
        }
      ],
      [
        {
          type: 'bg',
          img: App.globalData.CDNURL + '/static/wechat/img/sui/sui_img.png',
        },
        {
          type: 'qr',
          img: qr_img,
          xyr: {x:570, y:1030, r:80},
        }
      ],
      [
        {
          type: 'bg',
          img: App.globalData.CDNURL + '/static/wechat/img/sui/sui_img1.png',
        },
        {
          type: 'qr',
          img: qr_img,
          xyr: {x:570, y:1030, r:80},
        }
      ],
    ]
    this.setData({posters_media});
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.initData(options);
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