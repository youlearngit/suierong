const App = getApp();
import { Mer } from '../services/Mer';
import Dialog from '@vant/weapp/dialog/dialog';
import Toast from '@vant/weapp/toast/toast';
import * as mock from '../mock/mock';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: '',
    timer_sh: false,
    timeout: 2000,
    send_msg: true,

    pro_code: '',
    city_code: '',
    org_code: '',
    order_no: '',
    phone: '',

  },

  timerTax() {
    let {timer_sh} = this.data;
    if (timer_sh) { return }
    timer_sh = setInterval(async () => {
      let {timeout} = this.data;
      timeout--;
      this.setData({timeout})
      if (timeout<=0) {
        this.clear()
        wx.showModal({
          title: '提示',
          content: '页面过期，请重新进入',
          showCancel: false,
          success: (res) => {
            wx.navigateBack();
          },
        });
        return;
      }
      let {pro_code,org_code} = this.data;
      let openid = wx.getStorageSync('openid');
      const eventChannel = this.getOpenerEventChannel();
      if (pro_code == '310000') {
        let res_rlt = await Mer.taxresultSh(org_code);
        if (res_rlt.result_code == '2012') {
          this.clear();
          wx.showModal({
            title: '提示',
            content: res_rlt.result_msg,
            showCancel: false,
            success: (res) => {
              wx.navigateBack();
            },
          });
          return;
        }
        if (res_rlt.result_code == '0000') {
          this.setData({send_msg:false});
          this.clear();
          eventChannel.emit('taxRltEvent', '1');
          wx.navigateBack();
          return;
        }
        if (res_rlt.result_code == '1111') {
          this.clear();
          eventChannel.emit('taxWaitEvent', true);
          wx.navigateBack();
          return;
        }
      } else {
        let res_rlt = await Mer.gettaxresult2(org_code,openid);
        if (res_rlt.code == 0) {
          return;
        }
        if (res_rlt.code == 1) {
          this.setData({send_msg:false});
          this.clear();
          eventChannel.emit('taxRltEvent', '1');
          wx.navigateBack();
          return;
        } else {
          this.clear();
          wx.showModal({
            title: '提示',
            content: res_rlt.msg,
            showCancel: false,
            success: (res) => {
              wx.navigateBack();
            },
          });
          return;
        }
      }
    },1000)
    this.setData({timer_sh});
  },

  async initData() {
    Toast.loading({
      message: '正在跳转税务请稍等。。。',
      forbidClick: true,
      duration: 0,
    });
    try {
      await this.getUrl();
      this.timerTax();
      Toast.clear();
    } catch (err) {
      Toast.clear();
      if (err) {
        wx.showModal({
          title: '提示',
          content: err,
          showCancel: false,
          success: (res) => {
            wx.navigateBack();
          },
        });
      } else {
        wx.navigateBack();
      }
      
    }
  },

  async getUrl() {
    let {pro_code,city_code,org_code} = this.data;
    let openid = wx.getStorageSync('openid');
    const eventChannel = this.getOpenerEventChannel()
    if (pro_code == '310000') {
      let res_sh = await Mer.suiTaxSh(org_code, openid);
      if (res_sh.result_code=='1111') {
        eventChannel.emit('taxWaitEvent', true);
        return Promise.reject('');
      }
      if (res_sh.result_code=='0000') {
        this.setData({ url: res_sh.h5_homepage });
      } else {
        return Promise.reject('小程序异常，请重新打开'); // JSON.parse(res_sh.res).msg
      }
    } else {
      let res_tax = await Mer.tax(pro_code,city_code,openid);
      if (!res_tax.data) {
        return Promise.reject('小程序异常，请重新打开')
      }
      this.setData({ url: res_tax.data })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (!options.proCode || !options.cityCode || !options.creditCode || !options.orderNo || !options.phone) {
      Toast.fail('小程序异常，请重新打开');
      return;
    }
    this.setData({
      pro_code: options.proCode,
      city_code: options.cityCode,
      org_code: options.creditCode,
      order_no: options.orderNo,
      phone: options.phone,
    })
    this.initData();
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

  clear() {
    let {timer_sh} = this.data;
    if (timer_sh) {
      clearInterval(timer_sh);
    }
    let {send_msg,phone,order_no} = this.data;
		if (send_msg && phone) {
      Mer.sendMsg(phone,order_no);
		}
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    this.clear();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    this.clear();
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