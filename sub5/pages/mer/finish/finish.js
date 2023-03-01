const App = getApp();
import { Mer } from '../services/Mer';
import * as mock from '../mock/mock';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cdnMer: App.globalData.CDNURL + '/static/wechat/img/mer/',
    
    type: -1,
    
  },

  home(e) {
    wx.reLaunch({
      url: '/pages/shop/index2',
    })
  },

  async initData(options) {
    let openid = Mer.openid();
    try {
      if (options.type) {
        this.setData({type:options.type});
        return;
      }
      let res_apply = await Mer.selApplyResult(openid)
      if (res_apply.msgCode == '3333') {
          this.setData({ type:3 })
      } else if (res_apply.msgCode == '0000') {
          this.setData({ type:2 })
      } else {
          this.setData({ type:1 })
      }
    } catch(err) {
      this.setData({ type:1 })
    }
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