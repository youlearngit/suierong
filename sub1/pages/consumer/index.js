import api from '../../../utils/api';
import requestP from '../../../utils/requsetP';
import requestYT from '../../../api/requestYT';

import user from '../../../utils/user';
import log from '../../../log.js';
import util from '../../../utils/util';
import Emp from '../../../utils/Emp';
var app = getApp();
var myPerformance = require('../../../utils/performance.js');

Page({
  data: {
    preffixUrl: app.globalData.URL,
    cndUrl: app.globalData.CDNURL,
    hasMobile: false,
    loginFlag: true,

    // 海报
    maskHidden: true, //控制遮罩层
    imagePath: '', //海报路径
    hidePoster: true, //隐藏海报
    shareBox: 'shareBox',
    //分享
    empNo: '', //柜台主人号
    channel: '', //渠道号

    show: false, //是否弹出规则
    showPosterBox: false, //弹出海报框
    posterIdselected: -1,
    posterImgs: [
      // {
      // 	img: app.globalData.CDNURL + "/static/wechat/img/sui/sui-1094.png",
      // 	title: "国庆·中秋",
      // 	poster: "",
      // },
      {
        img: app.globalData.CDNURL + '/static/wechat/img/sui/sui-1059-new.png',
        title: '荐者有份',
        poster: '',
      },
      {
        img: app.globalData.CDNURL + '/static/wechat/img/sui/sui-1048-new.png',
        title: '产品名片',
        poster: '',
      },
      {
        img: app.globalData.CDNURL + '/static/wechat/img/sui/sui-thumbnail-1.jpg',
        title: 'e样都能贷',
        poster: '',
      },
      {
        img: app.globalData.CDNURL + '/static/wechat/img/sui/sui-thumbnail-2.jpg',
        title: '购车消费',
        poster: '',
      },
      {
        img: app.globalData.CDNURL + '/static/wechat/img/sui/sui-thumbnail-3.jpg',
        title: '教育消费',
        poster: '',
      },
      {
        img: app.globalData.CDNURL + '/static/wechat/img/sui/sui-thumbnail-4.jpg',

        title: '旅游消费',
        poster: '',
      },
      {
        img: app.globalData.CDNURL + '/static/wechat/img/sui/sui-thumbnail-5.jpg',
        title: '装修消费',
        poster: '',
      },
    ],
    qrcodeUrl: '',
    type: '0',
    customerInfo: {},
    cardInfo: {},
    subCount: 0,//提交防抖标记
  },

  onLoad(options) {
    myPerformance.reportBegin(2003, 'sub1_consumer_index');
    var that = this;
    log.info('globalData', app.globalData);
    this.setData({
      empNo: options.empNo ? options.empNo : app.globalData.empNo,
    });

    if (options.scene) {
      var scene = decodeURIComponent(options.scene).split('a');
      if (scene[0] == '0000') {
      } else {
        this.setData({
          empNo: scene[2],
        });
      }
    }

    if (this.data.empNo) {
      Emp.getCardInfoByEmp(this.data.empNo).then((cardInfo) => {
        that.setData({
          cardInfo,
        });
      });
    }
    myPerformance.reportEnd(2003, 'sub1_consumer_index');
    this.initOnloadData();
  },

  initOnloadData() {
    var that = this;
    api.generateMiniCode('sub1/pages/consumer/index', that.data.empNo).then((res) => {
      //console.log(res);
      if (res) {
        that.setData({
          qrcodeUrl: res,
        });
      }
    });
  },

  async choosePoster(e) {
    var that = this;
    let index = e.currentTarget.dataset.id;
    that.setData({
      posterIdselected: index,
    });
    let posterimg = that.data.posterImgs;
    let poster = posterimg[index].poster;
    if (poster && poster != null && typeof poster != 'undefined') {
      that.setData({
        imagePath: posterimg[index].poster,
      });
    } else {
      that.setData({
        imagePath: '',
      });
      switch (index) {
        case -1:
          await api.getSystemInfo2(750, 1334, 1.3).then((res) => {
            this.setData({
              posterBoxHeight: res.posterBoxHeight,
              posterBoxWidth: res.posterBoxWidth,
              unit: res.unit,
              screenWidth: res.systemInfo.screenWidth,
            });
          });
          await that.generateNationalDayPoster();
          break;
        case 0:
          await api.getSystemInfo2(750, 1225, 1.3).then((res) => {
            this.setData({
              posterBoxHeight: res.posterBoxHeight,
              posterBoxWidth: res.posterBoxWidth,
              unit: res.unit,
              screenWidth: res.systemInfo.screenWidth,
            });
          });
          await that.generateCardPoster9();
          break;
        case 1:
          await api.getSystemInfo2(750, 1215, 1.3).then((res) => {
            this.setData({
              posterBoxHeight: res.posterBoxHeight,
              posterBoxWidth: res.posterBoxWidth,
              unit: res.unit,
              screenWidth: res.systemInfo.screenWidth,
            });
          });
          await that.generateCardPoster2();
          break;
        default:
          that.generatePoster10(index);
          break;
      }
    }
  },

  onShow() {
    var that = this;
    if (wx.getStorageSync('openid') == '') {
      api.getSessionInfo().then(() => {
        that.loadUserInfo();
      });
    } else {
      that.loadUserInfo();
    }
  },

  loadUserInfo() {
    var that = this;
    user.getCustomerInfo().then((res) => {
      that.setData({
        hasMobile: res && res.TEL ? true : false,
        customerInfo: res,
      });
    });
  },

  getPhoneNumber(e) {
    var that = this;
    api
      .getPhoneNumber(e)
      .then((res) => {
        if (res) {
          that.setData({
            hasMobile: true,
          });
          that.apply();
        }
      })
      .catch((err) => {
        if (err.code === '1010' || err.code === '1000' || err.code === '1001') {
          wx.showModal({
            title: '提示',
            content: '手机号已被使用，请先进行身份认证',
            cancelColor: '#000000',
            confirmText: '确定',
            success: (result) => {
              if (result.confirm) {
                wx.navigateTo({
                  url: '/sub1/pages/auth/index',
                  success: (result) => {},
                  fail: () => {},
                  complete: () => {},
                });
              } else {
                //
              }
            },
          });
        } else {
          wx.showToast({
            title: err.msg||err.message||err,
            icon: 'none',
          });
        }
      });
  },

  auth(e) {
    if (e.detail.userInfo) {
      this.apply();
    }
  },

  apply() {
    var that = this;
    that.setData({
      type: '0',
    });
    let data = JSON.stringify({
      id_ID: 'id',
      string_sharer_open_id: app.globalData.share_person, //分享人open_id
      string_open_id: wx.getStorageSync('openid'), //申请人open_id
      string_apply_type: '15',
      string_share_id: app.globalData.shareID,
      string_emp_no: app.globalData.channelNo || app.globalData.sharerEmpNo,
    });
    user
      .ifAuthUserInfo()
      .then((res) => {
        if(that.data.subCount == 1){
          return Promise.reject();
        }
        wx.showLoading({
          title: '正在跳转...',
          mask: true
        })
        if (res) {
          
          that.setData({
            subCount : 1
          })
          return that.addApply(data);
        } else {
          that.setData({
            loginFlag: false,
          });
          return Promise.reject();
        }
      })
      .then((res) => {
        
          let version = wx.getAccountInfoSync().miniProgram.envVersion;
          let skipUrl = '';
          if (version === 'develop') {
            skipUrl = 'https://mbankh5test.jsbchina.cn/mbank/page/indexH5.html#page/76/02/P7602.html?data=' + res;
          } else {
            skipUrl = 'https://mbank5h5.jsbchina.cn/mbank/page/indexH5.html#page/76/02/P7602.html?data=' + res;
          }
        setTimeout(() => {
            that.setData({
              subCount : 0,
            })
            wx.navigateTo({
              url: 'web?skipUrl=' + encodeURIComponent(skipUrl),
            });
           wx.hideLoading();
        }, 3000);
      })
      .catch((err) => {
        wx.hideLoading();
        //console.log(err);
      });
  },

  cancelPoster(e) {
    //console.log(e);
    this.setData({
      showPosterBox: true,
    });
  },

  addApply(data) {
    let _data = {
      url: 'sui/applyXFD.do',
      data: data,
    };
    return requestYT(_data).then((res) => {
      console.log('applyXFD', res);
      log.info('xfd:', res);
      return res.stringData;
    });
  },

  createPoster() {
    var that = this;
    that.onClose();
    that.setData({
      shareBox: 'shareBox on',
      hidePoster: false,
    });
  },

  //点击分享
  showShare: function () {
    var that = this;
    that.setData({
      type: '1',
    });
    user.ifAuthUserInfo().then((res) => {
      if (res) {
        that.setData({
          showPosterBox: true,
        });
      } else {
        that.setData({
          loginFlag: false,
        });
      }
    });
  },

  auth(e) {
    this.setData({
      'customerInfo.NICK_NAME': e.detail.userInfo.nickName,
    });
    if (e.detail.userInfo && this.data.type != '1') {
      this.apply();
    }
  },

  async generatePoster10(index) {
    var that = this;
    await api.getSystemInfo2(576, 1280, 1.3).then((res) => {
      this.setData({
        posterBoxHeight: res.posterBoxHeight,
        posterBoxWidth: res.posterBoxWidth,
        unit: res.unit,
        screenWidth: res.systemInfo.screenWidth,
      });
    });
    that.generateCardPoster10(index);
  },

  /**
   * 生成海报
   */
  generateCardPoster2() {
    var that = this;
    const width = that.data.posterBoxWidth;
    const height = that.data.posterBoxHeight;
    const unit = that.data.unit;

    let img1 = '';
    let img2 = '';

    let promise1 = new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: app.globalData.CDNURL + '/static/wechat/img/sui/sui-1048-new.png',
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
      if (that.data.qrcodeUrl != '') {
        img2 = that.data.qrcodeUrl;
        resolve();
      } else {
        api.generateMiniCode('sub1/pages/consumer/index', that.data.empNo).then((res) => {
          //console.log(res);
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
      }
    });

    Promise.all([promise1, promise2])
      .then(() => {
        let context = wx.createCanvasContext('mycanvas');
        context.drawImage(img1, 0, 0, width, height);
        context.save();

        context.drawImage(img2, 523 * unit, 1006 * unit, 178 * unit, 180 * unit);
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
              success: (a) => {
                //console.timeEnd();
                //console.log(a.tempFilePath);
                let posterImgs = that.data.posterImgs;
                posterImgs[1].poster = a.tempFilePath;
                that.setData({
                  imagePath: a.tempFilePath,
                  posterImgs,
                });
                wx.hideToast();
              },
              fail: (err) => {
                //console.log(err);
                wx.hideToast();
              },
            });
          }, 200);
        });
      })
      .catch((err) => {
        wx.hideToast();
      });
  },

  generateCardPoster9() {
    //console.log("generateCardPoster9s");
    var that = this;
    let width = that.data.posterBoxWidth;
    let height = that.data.posterBoxHeight;
    let unit = that.data.unit;
    let customerInfo = that.data.customerInfo;
    let img1 = '';
    let img2 = '';
    let promise1 = new Promise(function (resolve, reject) {
      let src = app.globalData.CDNURL + '/static/wechat/img/sui/sui-1059-new.png';
      wx.getImageInfo({
        src: src,
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
      api.generateMiniCode('sub1/pages/consumer/activity', that.data.empNo).then((res) => {
        //console.log(res);
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
      .then((res) => {
        //console.log("img1", img1);
        //console.log("img2", img2);

        let context = wx.createCanvasContext('mycanvas');
        context.drawImage(img1, 0, 0, width, height);
        context.save();

        context.drawImage(img2, 291 * unit, 960 * unit, 174 * unit, 174 * unit);
        context.save();

        context.setTextAlign('center');
        context.setFontSize(32 * unit);
        context.setFillStyle('#FFFFFF');
        //console.log(customerInfo);
        let name = customerInfo.REAL_NAME || customerInfo.NICK_NAME;

        if (name.length > 6) {
          name = name.substring(0, 4) + '...';
        }
        context.fillText(name + ' | 向您推荐', unit * 375, unit * 870);
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
              success: (a) => {
                //console.timeEnd();
                //console.log(a.tempFilePath);
                let posterImgs = that.data.posterImgs;
                posterImgs[0].poster = a.tempFilePath;
                that.setData({
                  imagePath: a.tempFilePath,
                  posterImgs,
                });
                wx.hideToast();
              },
              fail: (err) => {
                //console.log(err);
                wx.hideToast();
              },
            });
          }, 200);
        });
      })
      .catch((err) => {
        //console.log(err);
        wx.hideToast();
      });
  },

  generateCardPoster10(index) {
    console.log(index);
    console.log('generateCardPoster10');
    var that = this;
    let width = that.data.posterBoxWidth;
    let height = that.data.posterBoxHeight;
    let unit = that.data.unit;
    let img1 = '';
    let img2 = '';
    //get poster background
    let promise1 = new Promise(function (resolve, reject) {
      if (index == 2) {
        img1 = app.globalData.CDNURL + '/static/wechat/img/sui/sui-poster-1.jpg';
      } else if (index == 3) {
        img1 = app.globalData.CDNURL + '/static/wechat/img/sui/sui-poster-2.jpg';
      } else if (index == 4) {
        img1 = app.globalData.CDNURL + '/static/wechat/img/sui/sui-poster-3.jpg';
      } else if (index == 5) {
        img1 = app.globalData.CDNURL + '/static/wechat/img/sui/sui-poster-4.jpg';
      } else if (index == 6) {
        img1 = app.globalData.CDNURL + '/static/wechat/img/sui/sui-poster-5.jpg';
      }
      wx.getImageInfo({
        src: img1,
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
      if (that.data.qrcodeUrl != '') {
        img2 = that.data.qrcodeUrl;
        resolve();
      } else {
        api.generateMiniCode('sub1/pages/consumer/index', that.data.empNo).then((res) => {
          console.log(res);
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
      }
    });

    Promise.all([promise1, promise2])
      .then(() => {
        //console.time();
        console.log('img1', img1);
        console.log('img2', img2);

        let context = wx.createCanvasContext('mycanvas');
        context.drawImage(img1, 0, 0, width, height);
        context.save();

        context.drawImage(img2, 399 * unit, 1149 * unit, 96 * unit, 96 * unit);
        context.save();

        if (that.data.cardInfo.ORG) {
          context.setTextAlign('left');
          context.setFontSize(35 * unit);
          context.setFillStyle('#545454');
          context.fillText(that.data.cardInfo.USERNAME, unit * 40, unit * 1190);
          context.save();

          if (that.data.cardInfo.USERNAME.length == 4) {
            context.setTextAlign('left');
            context.setFontSize(24 * unit);
            context.setFillStyle('#1677FF');
            context.fillText(that.data.cardInfo.PHONE, unit * 200, unit * 1190);
            context.save();
          } else {
            context.setTextAlign('left');
            context.setFontSize(24 * unit);
            context.setFillStyle('#1677FF');
            context.fillText(that.data.cardInfo.PHONE, unit * 160, unit * 1190);
            context.save();
          }

          context.setTextAlign('left');
          context.setFontSize(25 * unit);
          context.setFillStyle('#545454');
          context.fillText(that.data.cardInfo.ORG, unit * 40, unit * 1235);
          context.save();
        } else {
          if (that.data.customerInfo.TEL) {
            console.log('tel');
            context.setTextAlign('left');
            context.setFontSize(35 * unit);
            context.setFillStyle('#545454');
            context.fillText(
              that.data.customerInfo.REAL_NAME || that.data.customerInfo.NICK_NAME,
              unit * 40,
              unit * 1190,
            );

            if (that.data.customerInfo.REAL_NAME.length == 4 || that.data.customerInfo.NICK_NAME == 4) {
              context.save();
              context.setTextAlign('left');
              context.setFontSize(24 * unit);
              context.setFillStyle('#1677FF');
              context.fillText(that.data.customerInfo.TEL, unit * 200, unit * 1190);
              context.save();
            } else {
              context.save();
              context.setTextAlign('left');
              context.setFontSize(28 * unit);
              context.setFillStyle('#1677FF');
              context.fillText(that.data.customerInfo.TEL, unit * 160, unit * 1190);
              context.save();
            }
          } else {
            console.log('no tel');
            context.setTextAlign('left');
            context.setFontSize(35 * unit);
            context.setFillStyle('#545454');
            context.fillText(
              (that.data.customerInfo.REAL_NAME || that.data.customerInfo.NICK_NAME) + '  向您推荐',
              unit * 40,
              unit * 1190,
            );
          }
        }

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
              success: (a) => {
                //console.timeEnd();
                console.log(a.tempFilePath);
                let posterImgs = that.data.posterImgs;

                posterImgs[index].poster = a.tempFilePath;
                that.setData({
                  imagePath: a.tempFilePath,
                  posterImgs,
                });
                wx.hideToast();
                //console.timeEnd();
              },
              fail: (err) => {
                console.log(err);
                wx.hideToast();
              },
            });
          }, 200);
        });
      })
      .catch((err) => {
        log.info('海报生成错误', err);

        console.log(err);
        wx.hideToast();
      });
  },

  generateNationalDayPoster() {
    var that = this;
    let width = that.data.posterBoxWidth;
    let height = that.data.posterBoxHeight;
    let unit = that.data.unit;
    let customerInfo = that.data.customerInfo;
    let img1 = '';
    let img2 = '';
    let promise1 = new Promise(function (resolve, reject) {
      let src = app.globalData.CDNURL + '/static/wechat/img/sui/sui-1094.png';
      wx.getImageInfo({
        src: src,
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
      if (that.data.qrcodeUrl != '') {
        img2 = that.data.qrcodeUrl;
        resolve();
      } else {
        api.generateMiniCode('sub1/pages/consumer/index', that.data.empNo).then((res) => {
          //console.log(res);
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
      }
    });

    Promise.all([promise1, promise2])
      .then((res) => {
        //console.log("img1", img1);
        //console.log("img2", img2);

        let context = wx.createCanvasContext('mycanvas');
        context.drawImage(img1, 0, 0, width, height);
        context.save();

        context.drawImage(img2, 552 * unit, 1145 * unit, 158 * unit, 158 * unit);
        context.save();

        context.setTextAlign('center');
        context.setFontSize(32 * unit);
        context.setFillStyle('#FFFFFF');
        //console.log(customerInfo);
        let name = customerInfo.REAL_NAME || customerInfo.NICK_NAME;

        if (name.length > 6) {
          name = name.substring(0, 4) + '...';
        }
        context.fillText(name + ' | 为您推荐', unit * 375, unit * 1100);
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
              success: (a) => {
                //console.timeEnd();
                //console.log(a.tempFilePath);
                let posterImgs = that.data.posterImgs;
                posterImgs[0].poster = a.tempFilePath;
                that.setData({
                  imagePath: a.tempFilePath,
                  posterImgs,
                });
                wx.hideToast();
              },
              fail: (err) => {
                //console.log(err);
                wx.hideToast();
              },
            });
          }, 200);
        });
      })
      .catch((err) => {
        //console.log(err);
        wx.hideToast();
      });
  },

  showPopup() {
    this.setData({
      show: true,
    });
  },

  onClose() {
    this.setData({
      show: false,
      showPosterBox: false,
    });
  },

  onShareAppMessage() {
    var that = this;
    let imagePath = that.data.cndUrl + '/static/wechat/img/sui/sui-1004.png';
    let params = '&empNo=' + that.data.empNo + '&intId=' + app.globalData.int_id;
    return api.shareApp(imagePath, params);
  },
});
