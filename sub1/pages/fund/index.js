var util = require('../../../utils/util.js');

import user from '../../../utils/user';
import api from '../../../utils/api';
import log from '../../../log.js';
import Config from '../../../api/Config';
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    cndUrl: app.globalData.CDNURL,
    preffixUrl: app.globalData.URL,
    imagePath: '', //海报路径
    hidePoster: true, //隐藏海报
    shareBox: 'shareBox',
    loginFlag: true,
    posterBoxHeight: '',
    posterBoxWidth: '',
    unit: '',
    posterStatus: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // this.showShare();

    Config.getFundConfig()
      .then(async fundConfig => {
        this.setData({
          fundConfig,
        });
        await api.getSystemInfo2(750, (fundConfig.LENGTH / fundConfig.WIDTH) * 750, 1.3).then(res => {
          this.setData({
            posterBoxHeight: res.posterBoxHeight,
            posterBoxWidth: res.posterBoxWidth,
            unit: res.unit,
          });
        });
        this.generateCardPoster();
      })
      .catch(err => {});
  },

  toWeb() {
    if (this.data.fundConfig && this.data.fundConfig.PRODUCT_CODE) {
      let url =
        'https://mbank5h5.jsbchina.cn/mbank/page/indexJsb.html#page/19/00/01/P190001.html?prdCode=' +
        this.data.fundConfig.PRODUCT_CODE;
      wx.navigateTo({
        url: '/pages/showWeb/showWeb?skipUrl=' + encodeURIComponent(url),
        success: result => {},
        fail: () => {},
        complete: () => {},
      });
    } else {
      wx.showModal({
        title: '提示',
        content: '未找到产品信息,请重试',
        showCancel: false,
        confirmText: '确定',
        success: result => {
          if (result.confirm) {
            wx.navigateBack({
              delta: 1,
            });
          }
        },
        fail: () => {},
        complete: () => {},
      });
    }
  },

  showShare() {
    var that = this;
    user.ifAuthUserInfo().then(async res => {
      if (res) {
        if (that.data.imagePath) {
          that.setData({
            shareBox: 'shareBox on',
            hidePoster: false,
          });
        } else {
          wx.showLoading({
            title: '海报生成中',
            mask: true,
          });
          that.setData({
            shareBox: 'shareBox on',
            hidePoster: false,
          });
        }
      } else {
        that.setData({
          loginFlag: false,
        });
      }
    });
  },

  generateCardPoster() {
    var that = this;
    let width = that.data.posterBoxWidth;
    let height = that.data.posterBoxHeight;
    let unit = that.data.unit;
    let img1 = '';
    let img2 = '';
    //get poster background
    let promise1 = new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: app.globalData.CDNURL + '/static/wechat/img/fund/' + that.data.fundConfig.MOMENTS_URL,
        success: function (res) {
          img1 = res.path;
          resolve(res);
        },
        fail: function (res) {
          reject(res);
        },
      });
    });

    let promise2 = new Promise(function (resolve, reject) {
      api.generateMiniCode('sub1/pages/fund/index', that.data.empNo).then(res => {
        if (res) {
          img2 = res;
          that.setData({
            qrcodeUrl: img2,
          });
          resolve();
        } else {
          reject();
        }
      });
    });

    Promise.all([promise1, promise2])
      .then(() => {
        console.log('img1', img1);
        console.log('img2', img2);

        let context = wx.createCanvasContext('mycanvas');
        context.drawImage(img1, 0, 0, width, height);
        context.save();

        context.drawImage(img2, 285 * unit, 947 * unit, 180 * unit, 180 * unit);
        context.save();

        context.draw(false, function () {
          setTimeout(() => {
            wx.canvasToTempFilePath({
              canvasId: 'mycanvas',
              x: 0,
              y: 0,
              width: width,
              height: height,
              destWidth: width,
              destHeight: height,
              quality: 1,
              success: a => {
                console.log(a.tempFilePath);
                that.setData({
                  imagePath: a.tempFilePath,
                });
              },
              fail: err => {
                console.log(err);
                wx.hideToast();
              },
              complete() {
                wx.hideLoading();
              },
            });
          }, 200);
        });
      })
      .catch(err => {
        log.info('海报生成错误', err);

        console.log(err);
        wx.hideLoading();
      });
  },

  onShareAppMessage() {
    var that = this;
    return api.shareApp(that.data.imagePath);
  },
});
