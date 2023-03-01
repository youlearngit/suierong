import api from '../../../utils/api';
import requestP from '../../../utils/requsetP';
import myCanvas from '../../../utils/canvas';
import user from '../../../utils/user';
import emp from '../../../utils/Emp';
import encr from '../../../utils/encrypt/encrypt.js'; //国密3段式加密
import Order from '../../../api/Order';
import Chat from '../../../api/Chat';
import requestYT from '../../../api/requestYT';
const chat = new Chat();
const log = require('../../../log.js');
var aeskey = encr.key;
var app = getApp();
var myPerformance = require('../../../utils/performance.js');

Page({
  data: {
    customerInfo: {},
    enterpriseInfo: {},
    cardInfo: {}, //名片信息
    sedId: '',
    orderNo: '',
    empNo: '', //柜台主人号
    showComplain: false,
    imagePath: '',
    loginFlag: true,
    hidePoster: true, //隐藏海报
    maskHidden: true, //控制遮罩层
    ifSelf: false, //是否是本人
    show: false,
    isEmp: false,
    showCanvas2: false,
    showTips: false,
    hasPoster: false,
    canSubmit: true,
    preffixUrl: app.globalData.URL,
    cndUrl: app.globalData.CDNURL,
    posterIdselected: -1,
    showPosterBox: false,
    qrcodeUrl: '',
    posterImgs: [
      {
        img: app.globalData.CDNURL + '/static/wechat/img/sui/poster_1212.png',
        title: '双十二',
        poster: '',
      },
      {
        // img: app.globalData.CDNURL + '/static/wechat/img/sui/sui-1069.png',
        img: app.globalData.CDNURL + '/static/wechat/img/sui/tjyf.png',
        title: '荐者有份',
        poster: '',
      },
      {
        img: app.globalData.CDNURL + '/static/wechat/img/sui/sui-1068.png',
        title: '产品名片',
        poster: '',
      },
    ],
    showApply: true,
    productCode: '',
    channelNo: '',
  },

  onLoad: function (options) {
    console.log(options);
    this.setData({
      empNo: this.data.empNo ? this.data.empNo : app.globalData.empNo,
      productCode: options.productCode || '',
      channelNo: options.channel || '',
      channelNo2: options.channel2 || '',
    });
    this.getfxinfos();
    myPerformance.reportBegin(2005, 'sub1_sui_index');
    if (options.scene) {
      var scene = decodeURIComponent(options.scene).split('a');
      this.setData({
        productCode: scene[scene.length - 1],
      });
      if (scene[0] == '0000') {
      } else {
        this.setData({
          empNo: scene[2],
        });
      }
    }

    this.setData({
      showApply: !(options.type && options.type === 'share'),
    });

    if (options.empNo) {
      this.setData({
        empNo: options.empNo,
      });
    }

    myPerformance.reportEnd(2005, 'sub1_sui_index');
    if (this.data.empNo != '') {
      this.getEmpInfo(this.data.empNo);
    }

    api.getSystemInfo2(750, 1667, 1.3).then((res) => {
      this.setData({
        posterBoxHeight: res.posterBoxHeight,
        posterBoxWidth: res.posterBoxWidth,
        unit: res.unit,
        screenWidth: res.systemInfo.screenWidth,
      });
    });

    this.initData();
  },

  showComplain(e) {
    user.ifAuthUserInfo().then((res) => {
      if (res) {
        this.setData({
          showComplain: true,
        });
      } else {
        this.setData({
          loginFlag: false,
        });
      }
    });
  },

  complain(e) {
    console.log(e);
    const type = e.currentTarget.dataset.type;
    if (type === 'call') {
      wx.makePhoneCall({
        phoneNumber: '025-58587992',
      });
      return;
    }
    wx.showLoading({
      title: '加载中',
      mask: true,
    });
    chat
      .contact('02100141')
      .then(() => {
        wx.hideLoading();
      })
      .catch((err) => {
        console.log(err);
        if (err === 'unLogin') {
          this.setData({
            loginFlag: false,
          });
          return;
        }
        wx.showModal({
          title: '提示',
          content: error.message || error,
          showCancel: false,
          confirmText: '确定',
        });
      })
      .finally(wx.hideLoading());
  },
  getfxinfos() {
    let options = {
      url: 'poster/select.do',
      data: JSON.stringify({}),
    };
    return requestYT(options)
      .then((res) => {
        if (res.STATUS === '1' && res.flag === '1') {
          var LIST = res.LIST;
          for (let i = 0; i < LIST.length; i++) {
            var imagesinfo = this.data.posterImgs;
            var that = this;
            var json = {};
            json.title = LIST[i].POSTER_NAME;
            json.img = app.globalData.CDNURL + '/static/wechat/img/poster/' + LIST[i].POSTER_URL;
            json.poster = '';
            imagesinfo.push(json);
            that.setData({
              posterImgs: imagesinfo,
            });
          }
        } else {
          return Promise.reject(res.MSG);
        }
      })
      .catch((err) => {
        //console.log(err);
      });
  },

  createPoster() {
    var that = this;
    that.closePopUp();
    that.setData({
      shareBox: 'shareBox on',
      hidePoster: false,
    });
  },

  async getEmpInfo(empNo) {
    var that = this;
    let promise1 = '';
    let promise2 = '';
    if (wx.getStorageSync('openid') === '') {
      await api.getSessionInfo();
    }
    promise1 = that.getCardInfo(empNo);
    promise2 = that.ifEmp(empNo);

    Promise.all([promise1, promise2])
      .then(() => {
        that.initPosterImgs();
      })
      .catch((err) => {});
  },

  initPosterImgs() {
    var that = this;
    let cardInfo = that.data.cardInfo;
    let img1 = '';
    let img2 = '';
    let img3 = '';
    let img4 = '';
    let img5 = '';
    let img6 = '';
    let img7 = '';

    if (cardInfo.TEXT2 == 1) {
      let promise3 = new Promise(function (resolve, reject) {
        wx.getImageInfo({
          src: that.data.cndUrl + '/static/wechat/img/sui/sui_6002.png',
          success: function (res) {
            img3 = res.path;
            resolve(res);
          },
          fail: function (res) {
            reject(res);
          },
        });
      });

      let promise4 = new Promise(function (resolve, reject) {
        if (that.data.ifSelf) {
          img4 = '/static/wechat/img/sui/sui_6005.png';
        } else {
          img4 = '/static/wechat/img/sui/sui_6004.png';
        }
        wx.getImageInfo({
          src: that.data.cndUrl + img4,
          success: function (res) {
            img4 = res.path;
            resolve(res);
          },
          fail: function (res) {
            reject(res);
          },
        });
      });

      let promise5 = new Promise(function (resolve, reject) {
        wx.getImageInfo({
          src: that.data.cndUrl + '/static/wechat/img/sui/sui_6003.png',
          success: function (res) {
            img5 = res.path;
            resolve(res);
          },
          fail: function (res) {
            reject(res);
          },
        });
      });

      Promise.all([promise3, promise4, promise5])
        .then(() => {
          that.setData({
            img1,
            img2,
            img3,
            img4,
            img5,
            img6,
          });
        })
        .catch((err) => {});
    } else {
      let avatarName = '';
      if (cardInfo.GENDER == '男') {
        avatarName = 'sui_502.png';
      } else if (cardInfo.GENDER == '女') {
        avatarName = 'sui_503.png';
      } else {
        avatarName = 'sui_501.png';
      }

      let promise1 = new Promise(function (resolve, reject) {
        wx.getImageInfo({
          src: that.data.cndUrl + '/static/wechat/img/sui/' + avatarName,
          success: function (res) {
            img1 = res.path;
            resolve(res);
          },
          fail: function (res) {
            reject(res);
          },
        });
      });

      let promise4 = new Promise(function (resolve, reject) {
        img4 = '/static/wechat/img/sui/sui-1056.png';
        wx.getImageInfo({
          src: that.data.cndUrl + img4,
          success: function (res) {
            img4 = res.path;
            resolve(res);
          },
          fail: function (res) {
            reject(res);
          },
        });
      });

      let promise7 = new Promise(function (resolve, reject) {
        if (that.data.ifSelf) {
          img7 = '/static/wechat/img/sui/sui_6006.png';
        } else {
          img7 = '/static/wechat/img/sui/sui_6007.png';
        }
        wx.getImageInfo({
          src: that.data.cndUrl + img7,
          success: function (res) {
            img7 = res.path;
            resolve(res);
          },
          fail: function (res) {
            reject(res);
          },
        });
      });

      Promise.all([promise1, promise4, promise7])
        .then(() => {
          that.setData({
            img1,
            img2,
            img3,
            img4,
            img5,
            img6,
            img7,
          });
        })
        .catch((err) => {});
    }
  },

  async choosePoster(e) {
    var that = this;
    let index = e.currentTarget.dataset.id;
    that.setData({
      posterIdselected: e.currentTarget.dataset.id,
    });
    let templateType = that.data.cardInfo.TEXT2;
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
        case 0:
          await api.getSystemInfo2(1080, 1920, 1.3).then((res) => {
            this.setData({
              posterBoxHeight: res.posterBoxHeight,
              posterBoxWidth: res.posterBoxWidth,
            });
          });
          that.generateNationalDayPoster();
          break;
        case 1:
          await api.getSystemInfo2(750, 1225, 1.3).then((res) => {
            this.setData({
              posterBoxHeight: res.posterBoxHeight,
              posterBoxWidth: res.posterBoxWidth,
            });
          });
          //   that.generateCardPoster9();
          that.generateCardPosterActivity();
          break;
        case 2:
          if (that.data.empNo != '') {
            await api.getSystemInfo2(750, 1334, 1.3).then((res) => {
              this.setData({
                posterBoxHeight: res.posterBoxHeight,
                posterBoxWidth: res.posterBoxWidth,
              });
            });
            if (templateType == 1) {
              that.generateCardPoster3();
            } else {
              that.generateCardPoster4();
            }
          } else {
            await api.getSystemInfo2(750, 1215, 1.3).then((res) => {
              this.setData({
                posterBoxHeight: res.posterBoxHeight,
                posterBoxWidth: res.posterBoxWidth,
              });
            });
            that.generateCardPoster();
          }
          break;
        default:
          await api.getSystemInfo2(1080, 1920, 1.3).then((res) => {
            this.setData({
              posterBoxHeight: res.posterBoxHeight,
              posterBoxWidth: res.posterBoxWidth,
            });
          });
          that.generateCardPoster10(index);
          break;
      }
    }
  },

  initData() {
    var that = this;
    user
      .getCustomerInfo()
      .then((res) => {
        that.setData({
          customerInfo: res,
        });
      })
      .catch((err) => {});
  },

  ifEmp(empNo) {
    var that = this;
    return user.getCustomerInfo().then((res) => {
      that.setData({
        isEmp: res.USERID ? true : false,
        ifSelf: res.USERID && res.USERID === empNo ? true : false,
      });
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
    });
  },
  closePopUp() {
    this.setData({
      showPosterBox: false,
      showComplain: false,
    });
  },

  /**
   * 点击申请跳转
   */
  getAmount() {
    var that = this;
    if (that.data.canSubmit) {
      that.setData({
        canSubmit: false,
      });

      setTimeout(() => {
        that.setData({
          canSubmit: true,
        });
      }, 3000);
      user
        .ifAuthUserInfo()
        .then((res) => {
          if (res) {
            this.setData({
              showTips: true,
            });
          } else {
            that.setData({
              loginFlag: false,
            });
            return Promise.reject('未授权登陆');
          }
        })
        .catch((err) => {});
    } else {
    }
  },

  getCardInfo(empNo) {
    var that = this;
    return emp.getCardInfoByEmp(empNo).then((res) => {
      let cardInfo = res;
      let posterImgs = that.data.posterImgs;
      that.setData({
        cardInfo,
      });
      if (cardInfo.PHOTO && cardInfo.TEXT2 && cardInfo.TEXT2 == '1') {
        posterImgs[2].img = app.globalData.CDNURL + '/static/wechat/img/sui/sui-1060.png';
        that.setData({
          posterImgs,
        });
        api.downloadFile(cardInfo.PHOTO).then((res) => {
          cardInfo.PHOTO2 = res;
          wx.getImageInfo({
            src: res,
            success(res2) {
              let empPhotoHeight = (res2.height / res2.width) * 750;
              that.setData({
                empPhotoHeight,
              });
            },
          });
          that.setData({
            cardInfo,
          });
        });
      } else {
        let avatarName = '';
        if (cardInfo.GENDER == '男') {
          avatarName = 'sui_502.png';
        } else if (cardInfo.GENDER == '女') {
          avatarName = 'sui_503.png';
        } else {
          avatarName = 'sui_501.png';
        }
        cardInfo.PHOTO2 = app.globalData.CDNURL + '/static/wechat/img/sui/' + avatarName;
        posterImgs[2].img = app.globalData.CDNURL + '/static/wechat/img/sui/sui-1064.png';
        that.setData({
          posterImgs,
          cardInfo,
        });
      }
      return;
    });
  },

  //点击分享
  showShare: function () {
    var that = this;
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

  getApplyInfo() {
    this.setData({
      showTips: false,
    });
    let url = this.data.channelNo === '5001HH' ? '/sub1/pages/hw/index' : '';
    if(this.data.channelNo2 === 'cz'){
      url = '/sub1/pages/cz/index2'
    }

    Order.getUnfinishedOrder(url);
  },

  onShareAppMessage() {
    var that = this;
    let imagePath = that.data.cndUrl + '/static/wechat/img/sui/sui-1021.png';
    if (that.data.imagePath) {
      imagePath = that.data.imagePath;
    }
    if (this.data.productCode === 'A') {
      imagePath = '';
    }
    let params =
      '&empNo=' + that.data.empNo + '&intId=' + app.globalData.int_id + '&productCode=' + this.data.productCode;
    return api.shareApp(imagePath, params);
  },

  generateCardPoster() {
    var that = this;

    const width = that.data.posterBoxWidth;
    const height = that.data.posterBoxHeight;
    const unit = that.data.unit;

    let img1 = ''; //海报背景
    let img2 = ''; //头像

    //get poster background
    let promise1 = new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: that.data.cndUrl + '/static/wechat/img/sui/sui-1020.png',
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
        api.generateMiniCode('sub1/pages/sui/index', that.data.empNo + 'a' + that.data.productCode).then((res) => {
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

        context.drawImage(img1, 0, 0, width, height); //背景绘制
        context.drawImage(img2, 523 * unit, 1006 * unit, 180 * unit, 180 * unit); //小程序码

        context.setTextAlign('center');
        context.setFontSize(26 * unit);
        context.setFillStyle('#365DA7');
        context.fillText('年利率低至4.35%, 借款1万元每日还息1.2元', unit * 378, unit * 600);
        context.save();

        context.setTextAlign('center');
        context.setFontSize(24 * unit);
        context.setFillStyle('#365DA7');
        context.fillText('线上申请', unit * 158, unit * 801.8);
        context.save();
        context.setTextAlign('center');
        context.setFontSize(24 * unit);
        context.setFillStyle('#365DA7');
        context.fillText('秒速审批', unit * 304, unit * 801.8);
        context.save();
        context.setTextAlign('center');
        context.setFontSize(24 * unit);
        context.setFillStyle('#365DA7');
        context.fillText('循环额度', unit * 450, unit * 801.8);
        context.save();
        context.setTextAlign('center');
        context.setFontSize(24 * unit);
        context.setFillStyle('#365DA7');
        context.fillText('随借随还', unit * 596, unit * 801.8);
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
                let posterImgs = that.data.posterImgs;
                posterImgs[2].poster = a.tempFilePath;
                that.setData({
                  imagePath: a.tempFilePath,
                  posterImgs,
                });
                wx.hideToast();
              },
              fail: (err) => {
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

  generateCardPoster10(index) {
    var that = this;
    const width = that.data.posterBoxWidth;
    const height = that.data.posterBoxHeight;
    const unit = that.data.unit;
    let img1 = ''; //海报背景
    let img2 = ''; //头像

    let promise1 = new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: that.data.posterImgs[index].img,
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
        api.generateMiniCode('sub1/pages/sui/index', that.data.empNo + 'a' + that.data.productCode).then((res) => {
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

        context.drawImage(img1, 0, 0, width, height); //背景绘制
        context.save();
        context.drawImage(img2, 652 * unit, 1729 * unit, 180 * unit, 180 * unit); //小程序码
        context.save();

        context.setTextAlign('center');
        context.setFontSize(26 * unit);
        context.setFillStyle('#365DA7');
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
                let posterImgs = that.data.posterImgs;
                posterImgs[index].poster = a.tempFilePath;
                that.setData({
                  imagePath: a.tempFilePath,
                  posterImgs,
                });
                wx.hideToast();
              },
              fail: (err) => {
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

  generateCardPoster3() {
    var that = this;
    let cardInfo = that.data.cardInfo;
    const width = that.data.posterBoxWidth;
    const height = that.data.posterBoxHeight;
    const unit = that.data.unit;

    let { img1, img2, img3, img4, img5, img6 } = that.data;
    img1 = that.data.cardInfo.PHOTO2;

    let promise2 = new Promise(function (resolve, reject) {
      if (that.data.qrcodeUrl != '') {
        img2 = that.data.qrcodeUrl;
        resolve();
      } else {
        api.generateMiniCode('sub1/pages/sui/index', that.data.empNo + 'a' + that.data.productCode).then((res) => {
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
    let promise6 = new Promise(function (resolve, reject) {
      img6 = '/static/wechat/img/sui/sui-1056.png';
      wx.getImageInfo({
        src: that.data.cndUrl + img6,
        success: function (res) {
          img6 = res.path;
          resolve(res);
        },
        fail: function (res) {
          reject(res);
        },
      });
    });

    Promise.all([promise2, promise6])
      .then(() => {
        let context = wx.createCanvasContext('mycanvas');

        myCanvas.roundRectColor(context, '#FFFFFF', 0, 0, width, height, 0);
        context.save();

        context.drawImage(img1, unit * 0, unit * 0, unit * 750, that.data.empPhotoHeight * unit);
        context.save();
        context.drawImage(img4, unit * 0, unit * 518, unit * 750, unit * 816);
        context.save();

        context.drawImage(img5, unit * 30, unit * 20, unit * 181, unit * 45);
        context.save();

        context.drawImage(img3, unit * 29, unit * 932, unit * 690, unit * 360);
        context.save();

        context.drawImage(img2, unit * 442.8, unit * 950, unit * 183, unit * 189);
        context.save();

        context.drawImage(img6, unit * 62, unit * 983, unit * 281, unit * 52);
        context.save();

        if (cardInfo.USERNAME.length == '2') {
          context.setTextAlign('left');
          context.setFontSize(54 * unit);
          context.setFillStyle('#FFFFFF');
          context.fillText(cardInfo.USERNAME, unit * 56, unit * 727);
          context.save();

          if (cardInfo.TEXT5 != '0') {
            context.setTextAlign('left');
            context.setFontSize(42 * unit);
            context.setFillStyle('#E0B283');
            context.fillText(cardInfo.PHONE, unit * 205, unit * 735);
            context.save();
          }
        } else if (cardInfo.USERNAME.length == '3') {
          context.setTextAlign('left');
          context.setFontSize(54 * unit);
          context.setFillStyle('#FFFFFF');
          context.fillText(cardInfo.USERNAME, unit * 56, unit * 727);
          context.save();

          if (cardInfo.TEXT5 != '0') {
            context.setTextAlign('left');
            context.setFontSize(42 * unit);
            context.setFillStyle('#E0B283');
            context.fillText(cardInfo.PHONE, unit * 255, unit * 735);
            context.save();
          }
        } else if (cardInfo.USERNAME.length == '4') {
          context.setTextAlign('left');
          context.setFontSize(54 * unit);
          context.setFillStyle('#FFFFFF');
          context.fillText(cardInfo.USERNAME, unit * 56, unit * 727);
          context.save();

          if (cardInfo.TEXT5 != '0') {
            context.setTextAlign('left');
            context.setFontSize(42 * unit);
            context.setFillStyle('#E0B283');
            context.fillText(cardInfo.PHONE, unit * 305, unit * 735);
            context.save();
          }
        }

        cardInfo.ORG = cardInfo.ORG.replace('/', '').replace('（普惠金融部）', '').replace('(普惠金融部)', '');
        context.setTextAlign('left');
        context.setFontSize(32 * unit);
        context.setFillStyle('#FFFEFF');
        context.fillText(cardInfo.ORG + cardInfo.POSITION, unit * 56, unit * 800);
        context.save();

        context.setTextAlign('left');
        context.setFontSize(32 * unit);
        context.setFillStyle('#FFFFFF');
        context.fillText(cardInfo.PRO_FIELD.substring(0, 20), unit * 56, unit * 860);
        context.save();

        if (cardInfo.PRO_FIELD.length > 20) {
          context.setTextAlign('left');
          context.setFontSize(32 * unit);
          context.setFillStyle('#FFFFFF');
          context.fillText(cardInfo.PRO_FIELD.substring(20), unit * 56, unit * 900);
          context.save();
        }

        context.setTextAlign('left');
        context.setFontSize(28 * unit);
        context.setFillStyle('#30435E');
        context.fillText('让您的融资不再难', unit * 60, unit * 1082);
        context.save();

        context.setTextAlign('left');
        context.setFontSize(28 * unit);
        context.setFillStyle('#30435E');
        context.fillText('最高可贷', unit * 60, unit * 1137);
        context.save();

        context.setTextAlign('left');
        context.setFontSize(48 * unit);
        context.setFillStyle('#D5A97C');
        context.fillText('1000', unit * 183, unit * 1140);
        context.save();

        context.setTextAlign('left');
        context.setFontSize(28 * unit);
        context.setFillStyle('#D5A97C');
        context.fillText('万元', unit * 295, unit * 1137);
        context.save();

        context.setTextAlign('left');
        context.setFontSize(28 * unit);
        context.setFillStyle('#30435E');
        context.fillText('年利率低至4.35%，借款1万元每日还息1.2元', unit * 60, unit * 1187);
        context.save();

        context.strokeStyle = '#B68D63';
        context.lineWidth = 1 * unit;
        context.strokeRect(638 * unit, 960 * unit, 43 * unit, 167 * unit);

        let shareDesc = ['长', '按', '有', '惊', '喜'];
        for (let i = 0; i < shareDesc.length; i++) {
          context.setFontSize(24 * unit);
          context.setTextAlign('center');

          context.setFillStyle('#EDC59C');

          context.fillText(shareDesc[i], unit * 660, unit * (990 + 30 * i));
          context.save();
        }

        let descs = ['线上申请', '秒速审批', '循环额度', '随借随还'];
        for (let i = 0; i < 4; i++) {
          context.setTextAlign('center');
          context.strokeStyle = '#D5A97C';
          context.lineWidth = 1 * unit;
          context.strokeRect((60 + 163 * i) * unit, 1216 * unit, 140 * unit, 46 * unit);
          context.save();
        }
        for (let i = 0; i < descs.length; i++) {
          context.setTextAlign('center');
          context.setFillStyle('#B68D63');
          context.fillText(descs[i], unit * (130 + 163 * i), unit * 1247);
          context.save();
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
                let posterImgs = that.data.posterImgs;
                posterImgs[2].poster = a.tempFilePath;
                that.setData({
                  imagePath: a.tempFilePath,
                  posterImgs,
                });
                wx.hideToast();
              },
              fail: (err) => {
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

  generateCardPoster4() {
    var that = this;
    let cardInfo = that.data.cardInfo;

    const width = that.data.posterBoxWidth;
    const height = that.data.posterBoxHeight;
    const unit = that.data.unit;
    let { img1, img2, img3, img4, img5, img6, img7 } = that.data;

    let promise3 = api
      .generateMiniCode('sub1/pages/sui/index', that.data.empNo + 'a' + that.data.productCode)
      .then((res) => {
        if (res) {
          img3 = res;
          return res;
        } else {
          return Promise.reject();
        }
      });

    let promise4 = new Promise(function (resolve, reject) {
      img4 = '/static/wechat/img/sui/sui-1056.png';
      wx.getImageInfo({
        src: that.data.cndUrl + img4,
        success: function (res) {
          img4 = res.path;
          resolve(res);
        },
        fail: function (res) {
          reject(res);
        },
      });
    });

    Promise.all([promise3, promise4])
      .then(() => {
        let context = wx.createCanvasContext('mycanvas');
        myCanvas.roundRectColor(context, '#EEEEEE', 0, 0, width, height, 0);

        context.drawImage(img7, unit * 0, unit * 0, width, height);
        context.save();

        if (cardInfo.GENDER == '男' || cardInfo.GENDER == '女') {
          context.drawImage(img1, unit * 510, unit * 110, unit * 115, unit * 195.385);
          context.save();
        } else {
          context.drawImage(img1, unit * 495, unit * 133, unit * 147, unit * 141);
          context.save();
        }

        context.drawImage(img3, unit * 442.8, unit * 966, unit * 183, unit * 189);
        context.save();

        context.drawImage(img4, unit * 57, unit * 983, unit * 281, unit * 52);
        context.save();

        context.setTextAlign('left');
        context.setFontSize(74 * unit);
        context.setFillStyle('#30435E');
        context.fillText(cardInfo.USERNAME, unit * 55, unit * 385);
        context.save();

        cardInfo.ORG = cardInfo.ORG.replace('/', '').replace('（普惠金融部）', '').replace('(普惠金融部)', '');
        context.setTextAlign('left');
        context.setFontSize(32 * unit);
        context.setFillStyle('#30435E');
        context.fillText(cardInfo.ORG + cardInfo.POSITION, unit * 55, unit * 558);
        context.save();

        if (cardInfo.TEXT5 != '0') {
          context.setTextAlign('left');
          context.setFontSize(36 * unit);
          context.setFillStyle('#30435E');
          context.fillText(cardInfo.PHONE, unit * 55, unit * 492);
          context.save();
        }

        context.setTextAlign('left');
        context.setFontSize(30 * unit);
        context.setFillStyle('#30435E');
        context.fillText(cardInfo.PRO_FIELD.substring(0, 20), unit * 55, unit * 626);
        context.save();

        if (cardInfo.PRO_FIELD.length > 20) {
          context.setTextAlign('left');
          context.setFontSize(30 * unit);
          context.setFillStyle('#30435E');
          context.fillText(cardInfo.PRO_FIELD.substring(20), unit * 55, unit * 676);
          context.save();
        }

        context.setTextAlign('left');
        context.setFontSize(28 * unit);
        context.setFillStyle('#30435E');
        context.fillText('让您的融资不再难', unit * 60, unit * 1082);
        context.save();

        context.setTextAlign('left');
        context.setFontSize(28 * unit);
        context.setFillStyle('#30435E');
        context.fillText('最高可贷', unit * 60, unit * 1167);
        context.save();

        context.setTextAlign('left');
        context.setFontSize(48 * unit);
        context.setFillStyle('#D5A97C');
        context.fillText('1000', unit * 183, unit * 1170);
        context.save();

        context.setTextAlign('left');
        context.setFontSize(28 * unit);
        context.setFillStyle('#D5A97C');
        context.fillText('万元', unit * 295, unit * 1167);
        context.save();

        context.setTextAlign('left');
        context.setFontSize(28 * unit);
        context.setFillStyle('#30435E');
        context.fillText('年利率低至4.35%，借款1万元每日还息1.2元', unit * 60, unit * 1217);
        context.save();

        context.strokeStyle = '#B68D63';
        context.lineWidth = 1 * unit;
        context.strokeRect(638 * unit, 982 * unit, 43 * unit, 167 * unit);

        let shareDesc = ['长', '按', '有', '惊', '喜'];
        for (let i = 0; i < shareDesc.length; i++) {
          context.setFontSize(24 * unit);
          context.setTextAlign('center');
          context.setFillStyle('#EDC59C');
          context.fillText(shareDesc[i], unit * 660, unit * (1012 + 30 * i));
          context.save();
        }

        let descs = ['线上申请', '秒速审批', '循环额度', '随借随还'];
        for (let i = 0; i < 4; i++) {
          context.setTextAlign('center');
          context.strokeStyle = '#D5A97C';
          context.lineWidth = 1 * unit;
          context.strokeRect((60 + 163 * i) * unit, 1246 * unit, 140 * unit, 46 * unit);
        }
        for (let i = 0; i < descs.length; i++) {
          context.setTextAlign('center');
          context.setFillStyle('#D5A97C');
          context.fillText(descs[i], unit * (130 + 163 * i), unit * 1277);
          context.save();
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
                let posterImgs = that.data.posterImgs;
                posterImgs[2].poster = a.tempFilePath;
                that.setData({
                  imagePath: a.tempFilePath,
                  posterImgs,
                });
                wx.hideToast();
              },
              fail: (err) => {
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

  generateCardPosterActivity() {
    var that = this;
    let width = that.data.posterBoxWidth;
    let height = that.data.posterBoxHeight;

    let unit = that.data.unit;
    let cardInfo = that.data.cardInfo;
    let customerInfo = that.data.customerInfo;
    let img1 = '';
    let img2 = '';
    let img3 = '';
    let promise1 = new Promise(function (resolve, reject) {
      let src = app.globalData.CDNURL + '/static/wechat/img/sui/tjyf.png';
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
        api.generateMiniCode('sub1/pages/sui/index', that.data.empNo + 'a' + that.data.productCode).then((res) => {
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

    let promise3 = new Promise(function (resolve, reject) {
      if (that.data.empNo) {
        wx.getImageInfo({
          src: that.data.cardInfo.PHOTO2,
          success: function (res) {
            img3 = res.path;
            resolve(res);
          },
          fail: function (res) {
            reject(res);
          },
        });
      } else {
        console.log('avatarUrl', app.globalData.userInfo.avatarUrl);
        wx.getImageInfo({
          src: app.globalData.userInfo.avatarUrl,
          success: function (res) {
            img3 = res.path;
            resolve(res);
          },
          fail: function (res) {
            reject(res);
          },
        });
      }
    });

    Promise.all([promise1, promise2, promise3])
      .then(() => {
        let context = wx.createCanvasContext('mycanvas');
        context.drawImage(img1, 0, 0, width, height);
        context.save();

        context.drawImage(img2, 563 * unit, 1018 * unit, 144 * unit, 144 * unit);
        context.save();

        var avatarurl_width = unit * 80; //绘制的头像宽度
        var avatarurl_heigth = unit * 80; //绘制的头像高度
        var avatarurl_x = unit * 20; //绘制的头像在画布上的位置
        var avatarurl_y = unit * 1086; //绘制的头像在画布上的位置
        context.arc(
          avatarurl_width / 2 + avatarurl_x,
          avatarurl_heigth / 2 + avatarurl_y,
          avatarurl_width / 2,
          0,
          Math.PI * 2,
          false,
        );
        context.clip(); //画圆

        context.drawImage(img3, avatarurl_x, avatarurl_y, avatarurl_width, avatarurl_heigth); //画圆形头像
        context.restore();
        context.save();

        if (that.data.empNo) {
          context.setFontSize(40 * unit);
          context.setFillStyle('#3E415C');
          context.setTextAlign('left');
          context.fillText(cardInfo.USERNAME, unit * 111, unit * 1118);
          context.save();
          const length = cardInfo.USERNAME.length;

          let telFromLeft = 238;
          switch (length) {
            case 0:
            case 1:
            case 2:
              telFromLeft = 208;
              break;
            case 3:
              telFromLeft = 238;
              break;
            case 4:
              telFromLeft = 288;
              break;
          }

          context.setFontSize(28 * unit);
          context.setFillStyle('#3E415C');
          context.fillText(cardInfo.PHONE, unit * telFromLeft, unit * 1122);
          context.save();

          cardInfo.ORG = cardInfo.ORG.replace('/', '').replace('（普惠金融部）', '').replace('(普惠金融部)', '');
          context.setFontSize(24 * unit);
          context.setFillStyle('#30435E');
          context.fillText(cardInfo.ORG + ' | ' + cardInfo.POSITION, unit * 113, unit * 1161);
          context.save();
        } else {
          console.log('customerInfo.NICK_NAME', customerInfo.NICK_NAME);

          context.setFontSize(40 * unit);
          context.setFillStyle('#3E415C');
          context.fillText(customerInfo.NICK_NAME, unit * 111, unit * 1143);
          context.save();
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
                let posterImgs = that.data.posterImgs;
                posterImgs[1].poster = a.tempFilePath;
                that.setData({
                  imagePath: a.tempFilePath,
                  posterImgs,
                });
              },
              fail: (err) => {},
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

  generateCardPoster9() {
    var that = this;
    let width = that.data.posterBoxWidth;
    let height = that.data.posterBoxHeight;
    let unit = that.data.unit;
    let cardInfo = that.data.cardInfo;
    let customerInfo = that.data.customerInfo;
    let img1 = '';
    let img2 = '';
    //get poster background
    let promise1 = new Promise(function (resolve, reject) {
      let src =
        that.data.empNo != '' && cardInfo.TEXT5 == '1'
          ? app.globalData.CDNURL + '/static/wechat/img/sui/sui-1051.png'
          : app.globalData.CDNURL + '/static/wechat/img/sui/sui-1054.png';
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

    let promise2 = api
      .generateMiniCode('sub1/pages/sui/index', that.data.empNo + 'a' + that.data.productCode)
      .then((res) => {
        if (res) {
          img2 = res;
          return res;
        } else {
          return Promise.reject();
        }
      });

    Promise.all([promise1, promise2])
      .then(() => {
        let context = wx.createCanvasContext('mycanvas');
        context.drawImage(img1, 0, 0, width, height);
        context.save();

        context.drawImage(img2, 275 * unit, 935 * unit, 200 * unit, 200 * unit);
        context.save();

        context.setTextAlign('center');
        context.setFontSize(32 * unit);
        context.setFillStyle('#FFFFFF');
        if (that.data.empNo != '' && cardInfo.TEXT5 == '1') {
          context.fillText(cardInfo.USERNAME + ' | ' + cardInfo.PHONE, unit * 375, unit * 843);
        } else {
          let name = cardInfo.USERNAME || customerInfo.REAL_NAME || customerInfo.NICK_NAME;

          context.fillText(name + ' | 向您推荐', unit * 375, unit * 883);
        }

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
                let posterImgs = that.data.posterImgs;
                posterImgs[1].poster = a.tempFilePath;
                that.setData({
                  imagePath: a.tempFilePath,
                  posterImgs,
                });
                wx.hideToast();
              },
              fail: (err) => {
                wx.hideToast();
              },
            });
          }, 200);
        });
      })
      .catch((err) => {
        log.info('海报生成错误', err);

        wx.hideToast();
      });
  },

  generateNationalDayPoster() {
    var that = this;
    let width = that.data.posterBoxWidth;
    let height = that.data.posterBoxHeight;
    let unit = that.data.unit;
    let customerInfo = that.data.customerInfo;
    let cardInfo = that.data.cardInfo;
    let img1 = '';
    let img2 = '';
    let promise1 = new Promise(function (resolve, reject) {
      let src = app.globalData.CDNURL + '/static/wechat/img/sui/poster_1212.png';
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
      resolve();
      if (that.data.qrcodeUrl != '') {
        img2 = that.data.qrcodeUrl;
        resolve();
      } else {
        api.generateMiniCode('sub1/pages/sui/index', that.data.empNo + 'a' + that.data.productCode).then((res) => {
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

        context.drawImage(img2, 702 * unit, 1584 * unit, 271 * unit, 271 * unit);
        context.save();

        context.setTextAlign('center');
        context.setFontSize(46 * unit);
        context.setFillStyle('#FFFFFF');

        let name = cardInfo.USERNAME || customerInfo.REAL_NAME || customerInfo.NICK_NAME;

        if (name.length > 6) {
          name = name.substring(0, 4) + '...';
        }

        if (that.data.empNo != '' && cardInfo.TEXT5 == '1') {
          context.fillText(name + ' | ' + cardInfo.PHONE, unit * 540, unit * 1452);
        } else {
          context.fillText(name + ' | 向您推荐', unit * 540, unit * 1452);
        }
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
                let posterImgs = that.data.posterImgs;
                posterImgs[0].poster = a.tempFilePath;
                that.setData({
                  imagePath: a.tempFilePath,
                  posterImgs,
                });
                wx.hideToast();
              },
              fail: (err) => {
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
});
