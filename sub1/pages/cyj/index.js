const util = require('../../../utils/util');
const app = getApp();
import api from '../../../utils/api';
import user from '../../../utils/user';

Page({
  data: {
    loginFlag: true, //授权提示控制
    shareBox: 'shareBox',
    nick: '', //授权昵称
    avatar: '', //授权头像
    wechat: '', //本详情页二维码
    bg: '/static/wechat/img/cyj_poster.jpg', //图片背景图
    imagePath: '',
    newbg: '',
    entrepreneurUrl: {
      testUrl: 'https://weixintest.jsbchina.cn/wxcm/openCredit/creditIndex.do?cnl=0179&organ=9902&cardNo=0070&mobile=',
      finalUrl: 'https://vbank.jsbchina.cn/wxcm/openCredit/creditIndex.do?cnl=0146&organ=9902&cardNo=0070&mobile=',
    },
    preffixUrl: app.globalData.URL,
    currentPage: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;

    this.setData({
      currentPage: getCurrentPages().length,
      preffixUrl: app.globalData.URL,
    });

    //把背景图片保存到本地
    wx.getImageInfo({
      src: this.data.preffixUrl + this.data.bg,
      success: (res) => {
        console.log(res);
        that.setData({
          newbg: res.path,
        });
      },
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    let imagePath = '';
    if (that.data.imagePath) {
      imagePath = that.data.imagePath;
    }
    return api.shareApp(imagePath);
  },
  //点击分享
  showShare: function () {
    let that = this;
    user
      .ifAuthUserInfo()
      .then((res) => {
        if (res) {
          that.setData({
            shareBox: 'shareBox on',
            hidePoster: false,
          });
          if (that.data.imagePath) {
            console.log(1);
            that.setData({
              imagePath: that.data.imagePath,
            });
          } else {
            wx.showToast({
              title: '海报绘制中...',
              icon: 'loading',
              mask: true,
              duration: 20000,
            });
            that.createNewImg();
          }
        } else {
          that.setData({
            loginFlag: false,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },

  createNewImg: function () {
    var that = this;
    var context = wx.createCanvasContext('mycanvas');

    let promise1 = api.generateMiniCode('sub1/pages/cyj/index').then((res) => {
      that.setData({
        wechat: res, //赋值本地的二维码图片给data.wechat
      });
    });
    let promise2 = new Promise((resolve, rej) => {
      that.setData({
        nick: app.globalData.userInfo.nickName, //授权昵称
      });
      wx.downloadFile({
        url: app.globalData.userInfo.avatarUrl,
        success: function (res) {
          if (res.statusCode === 200) {
            that.setData({
              avatar: res.tempFilePath, //授权头像
            });
            resolve();
          }
        },
      });
    });

    Promise.all([promise1, promise2]).then(() => {
      context.setFillStyle('white');
      context.fillRect(0, 0, 750, 1216);
      var path = that.data.newbg;
      context.drawImage(path, 0, 0, 750, 1216); //背景绘制
      context.drawImage(that.data.wechat, 550, 995, 150, 150); //小程序码

      var touxiang = that.data.avatar;
      //绘制昵称
      var nickname = '@' + that.data.nick + ' 向您推荐';
      context.setFillStyle('#333');
      context.setFontSize(28);
      context.setTextAlign('left');
      context.fillText(nickname, 50, 1166); //昵称绘制
      context.stroke();
      context.setFontSize(22);
      context.fillText('长按立即申请', 560, 1166); //提示绘制
      //绘制头像
      context.setStrokeStyle('#fff');
      context.setLineWidth(0);
      context.arc(160, 1065, 70, 0, 2 * Math.PI, false); //画一个圆形裁剪区域
      context.clip();
      context.drawImage(touxiang, 90, 995, 140, 140); //头像绘制
      context.stroke();
      context.draw();
      //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
      setTimeout(function () {
        wx.canvasToTempFilePath({
          canvasId: 'mycanvas',
          fileType: 'jpg',
          quality: 0.7,
          success: function (res) {
            wx.hideToast();
            var tempFilePath = res.tempFilePath;
            that.setData({
              imagePath: tempFilePath,
            });
          },
        });
      }, 300);
    });
  },

  apli() {
    var that = this;
    user.ifAuthUserInfo().then(async (res) => {
      if (res) {
        let telOrEmpNo = '',
          skipUrl = that.data.entrepreneurUrl.finalUrl;
        if (app.globalData.share_person) {
          await user.getCustomerInfo(app.globalData.share_person).then((res) => {
            telOrEmpNo = res.USERID || res.TEL || '';
            skipUrl += telOrEmpNo;
          });
        }
        wx.navigateTo({
          url: '/pages/showWeb/showWeb?skipUrl=' + encodeURIComponent(skipUrl),
        });
      } else {
        that.setData({
          loginFlag: false,
        });
      }
    });
  },
});
