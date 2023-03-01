// sub5/pages/index.js
const util = require('../../utils/util');
var that
var systemWidth
import user from "../../utils/user"
import api from "../../utils/api"
import Order from '../../api/Order';
import log from '../../log.js';
import Emp from '../../utils/Emp';
import { selectMyrInfo } from '../../api/mer';
import tool from "../../utils/tool";
import { Mer } from './mer/services/Mer';
const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cndUrl: App.globalData.CDNURL,
    preffixUrl:'',
    unfold:false,
    loginFlag: true, //授权提示控制
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: {},
    timer: '',
    submit: true,
    nick: '', //授权昵称
    avatar: '', //授权头像
    wechat: "", //本详情页二维码
    bg: "/static/wechat/img/mer/minihb.png", //图片背景图
    bg2: "/static/wechat/img/sui/sui_img1.png", //图片背景图
    //touxiang: "/pages/public/img/temp/touxiang.jpg",//头像路径
    maskHidden: true, //控制遮罩层
    hidePoster: true, //隐藏海报
    imagePath: "", //存放canvas生成的图片
    canvasId: 'mycanvas',
    shareBox: "shareBox",
    showPosterBox: false, //弹出海报框
    posterIdselected: -1,
    posterImgs: [
      {
        img: App.globalData.CDNURL + '/static/wechat/img/mer/minihb.png',
        poster: '',
      },
      {
        img: App.globalData.CDNURL + '/static/wechat/img/sui/sui_img.png',
        poster: '',
      },
      {
        img: App.globalData.CDNURL + '/static/wechat/img/sui/sui_img1.png',
        poster: '',
      },
    ],
    qrcodeUrl: '',
    empNo: '',
    customerInfo: {},
    cardInfo: {},
    preffixUrl: '',
    path: '',
    newbg: '',
    scene: '',
    showImgData: '',
    wechat: '',
    height:'',
    height1:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.scene){
      var scene = decodeURIComponent(options.scene);
      console.log('scene:',scene);
      wx.setStorageSync('tjropenid', scene);
    }
    if(options.open_id){
      var open_id = decodeURIComponent(options.open_id);
      console.log('open_id:',open_id);
      wx.setStorageSync('tjropenid', open_id);
    }
    this.setData({
        preffixUrl: App.globalData.CDNURL,
    })
    console.log(wx.getStorageSync('openid'));
    //openid，加密相关
    if (wx.getStorageSync('openid') == null && wx.getStorageSync('openid') == '') {
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          util.openid(res.code, App.globalData.URL);
        }
      })
    }
    let that = this;
    that.setData({
      preffixUrl: App.globalData.CDNURL,
      navTop: App.globalData.statusBarTop,
      navHeight: App.globalData.statusBarHeight,
    })

    var pagenum = getCurrentPages()
    that.setData({
      pageFlag: pagenum.length
    })
    if (pagenum.length > 2) {
      //console.log("有返回")
    } else {
      //console.log("到主页")
    };
    
    //把背景图片保存到本地
    wx.downloadFile({
      url: this.data.preffixUrl + this.data.bg,
      success: function (res) {
        if (res.statusCode === 200) {
          // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
          that.setData({
            newbg: res.tempFilePath //授权头像
          })
        }
        //console.log(res.tempFilePath);
      }
    })
    wx.showToast({
      title: '加载中...',
      mask: true,
      icon: 'loading',
      duration: 20000
    });
    that.userInfo();
    // 查看是否授权

    // -------
    this.setData({
      empNo: options.empNo ? options.empNo : App.globalData.empNo,
    });
    if (this.data.empNo) {
      Emp.getCardInfoByEmp(this.data.empNo).then((cardInfo) => {
        that.setData({
          cardInfo,
        });
      });
    }
    this.loadUserInfo();
    this.getSelectMyrInfo();
  },
  async getSelectMyrInfo() {
    var that = this;
    console.log("反显")
    // 查询反显
    let data = {
      openId: wx.getStorageSync('openid')
    }
    console.log(data);
    await selectMyrInfo(data).then(res => {
      console.log(res);
      if (res.msgCode == '0000') {
        var res1 = JSON.parse(res.myrInfo);
        console.log(res1)
        console.log('res1.STEP:', res1.STEP)
        that.setData({
          STEP: res1.STEP
        })
      }
    })
  },
  pageDown() {
    this.jumpPage();
  },
  jumpPage: tool.throttle(function () {
    let openid = wx.getStorageSync('openid');
    Mer.selectMyrInfo(openid).then(res=>{
      if (res.msgCode != '0000') {
        wx.navigateTo({
          url: './mer/idcard/idcard?reurl=/sub5/pages/mer/form/form',
        })
        return;
      }
      let infos = JSON.parse(res.myrInfo);
      let info = infos[0];
      if (info.STEP=='2' && !info.IMAGE_ID) {
        wx.navigateTo({
          url: './mer/license/license?reurl=/sub5/pages/mer/form/form',
        })
        return;
      }
      wx.navigateTo({
        url: './mer/form/form',
      })
    })
    return;
    console.log(this.data.STEP)
    var STEP = this.data.STEP;
    if (STEP) {
      if (STEP == '01') { //01s上传身份证跳人脸识别
        wx.navigateTo({
          url: '/sub5/pages/identityCard'
        })
      } else if (STEP == '02') { //02人脸识别跳填写身份信息页
        wx.navigateTo({
          url: '/sub5/pages/fillInInformation?step=0'
        })
      } else if (STEP == '1') { //1跳营业执照页
        wx.navigateTo({
          url: '/sub5/pages/recognitionLicense'
        })
      } else if (STEP == '03') { //03营业执照跳填写企业信息
        wx.navigateTo({
          url: '/sub5/pages/fillInInformation?step=1'
        })
      } else if (STEP == '2') { //2信息填写跳授权页
        wx.navigateTo({
          url: '/sub5/pages/fillInInformation?step=' + STEP
        })
      } else {
        wx.navigateTo({
          url: './identityCard',
        })
      }
    } else {
      wx.navigateTo({
        url: './identityCard',
      })
    }
  }),
onPageScroll:function(e){ // 获取滚动条当前位置
    console.log(e)
},
openUnfold(){
    this.setData({
        unfold:!this.data.unfold
    })
    if(this.data.unfold){
      this.setData({
        height:'2000rpx',
        height1:'1450rpx'
      })
    }else{
      this.setData({
        height:'100%',
        height1:'auto'
      })
    }
    if (wx.pageScrollTo) {
        wx.pageScrollTo({//pageScrollTo将页面滚动到指定位置scrollTop是属性
          scrollTop: 500
        })
      } else {
        wx.showModal({//提示框以下是属性
          title: '提示',
          content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
        })
      }
},

  
  userInfo: function () {
    //console.log(app.globalData.userInfo)

  },
  //取消登录
  logincancel: function () {
    var that = this;
    that.setData({
      loginFlag: true,
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.hideToast();
    this.loadUserInfo();
    // var that = this;
    //     user.getCustomerInfo().then((res) => {
    //       let customerInfo = res;
    //       console.log('customerInfo',customerInfo)
    //       user.ifAuthUserInfo().then((res) => {
    //         console.log(res)
    //         that.setData({
    //           hasUserInfo: res,
    //           customerInfo,
    //           'customerInfo.PHOTO': customerInfo.PHOTO,
    //           'customerInfo.NICK_NAME': customerInfo.NICK_NAME,
    //         });
    //       });
    //     });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let share_id = wx.getStorageSync('openid');
    var path = '/sub5/pages/index' + "?open_id=" + share_id
    return {
      path: path,
      imageUrl: this.data.preffixUrl + "/static/wechat/img/mer/minihb.png"
    }
  },
  prePage() {
    wx.navigateBack();
  },
  indexpage: function () {
    wx.switchTab({
      url: "/pages/shop/index2"
    })
  },
  //敬请期待
  waiting() {
    wx.showToast({
      title: '敬请期待！',
      icon: 'none',
      mask: true,
      duration: 2000
    })
  },

  //点击分享
  showShare: function () {
    var that = this;
    user.ifAuthUserInfo().then(res=>{
        if(res){
            var isCreat = that.data.imagePath;
            that.setData({
                shareBox: "shareBox on",
            });
            if (isCreat) {
                wx.hideToast();
            } else {
                wx.showToast({
                    title: "海报绘制中...",
                    icon: "loading",
                    mask: true,
                    duration: 20000,
                });

                that.setData({
                    nick: App.globalData.userInfo.nickName, //授权昵称
                });
                wx.downloadFile({
                    url: App.globalData.userInfo.avatarUrl,
                    success: function (res) {
                        if (res.statusCode === 200) {
                            // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                            that.setData({
                                avatar: res.tempFilePath, //授权头像
                            });
                            that.showCreat();
                        }
                    },
                });
            }
        }else{
            that.setData({
                loginFlag: false,
            });
        }
    })
  },
  //取消分享
  showHide: function () {
    var that = this;
    that.setData({
      shareBox: "shareBox",
    })
  },
  //点击保存到相册
  baocun: function () {
    var that = this
    ////console.log(that.data.imagePath)
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      //mask: true,
      duration: 5000
    })
    wx.saveImageToPhotosAlbum({
      filePath: that.data.imagePath,
      success(res) {
        wx.hideToast();

        wx.showModal({

          content: '图片已保存到相册，赶紧晒一下吧~',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#333',
          success: function (res) {
            if (res.confirm) {
              //console.log('用户点击确定');
              that.setData({
                maskHidden: true,
                shareBox: "shareBox",
              })
            }
          },
          fail: function (res) {
            wx.hideToast();
          }
        })
      }
    })
  },
  callGetPhone(e) {
    let that = this;
    // 号码
    let telPhone = e.currentTarget.dataset.getphone;
    wx.showModal({
      title: '温馨提示',
      content: '您确定要拨打' + telPhone + "?",
      showCancel: true,
      cancelText: "取消",
      confirmText: "立即拨打", //默认是“确定”
      success: function (res) {
        if (res.cancel) {
          //点击取消,默认隐藏弹框
        } else {
          //点击确定
          that.callPhone(telPhone);
        }
      },
      fail: function (res) { }, //接口调用失败的回调函数
      complete: function (res) { }, //接口调用结束的回调函数（调用成功、失败都会执行）
    })
  },
  callPhone(phoneNumber) {
    wx.makePhoneCall({
      phoneNumber: phoneNumber,
      success: function () {
        //console.log("拨打电话成功！")
      },
      fail: function () {
        //console.log("拨打电话失败！")
      }
    })
  },
  apli: function () {
    var that = this;
    // 查看是否授权

    user.ifAuthUserInfo().then(res=>{
            if(res){
               Order.getUnfinishedOrder()
            }else{
                that.setData({
                    loginFlag: false,
                  }) 
            }
        })
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
  },
  createPoster() {
    var that = this;
    that.onClose();
    that.setData({
      shareBox: 'shareBox on',
      hidePoster: false,
    });
  },
  async choosePoster(e) {
    var that = this;
    let index = e.currentTarget.dataset.id;
    that.setData({
      posterIdselected: index,
    });
    console.log('index',index)
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
          await api.getSystemInfo2(750, 1225, 1.3).then((res) => {
            this.setData({
              posterBoxHeight: res.posterBoxHeight,
              posterBoxWidth: res.posterBoxWidth,
              unit: res.unit,
              screenWidth: res.systemInfo.screenWidth,
            });
          });
          await that.generateCardPoster0();
          break;
          case 2:
          await api.getSystemInfo2(750, 1225, 1.3).then((res) => {
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
  async generatePoster10(index) {
    var that = this;
    await api.getSystemInfo2(750, 1225, 1.3).then((res) => {
      this.setData({
        posterBoxHeight: res.posterBoxHeight,
        posterBoxWidth: res.posterBoxWidth,
        unit: res.unit,
        screenWidth: res.systemInfo.screenWidth,
      });
    });
    that.generateCardPoster10(index);
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
      if (index == 1) {
        img1 = App.globalData.CDNURL + '/static/wechat/img/sui/sui_img.png';
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
        api.generateMiniCode('sub5/pages/index','',wx.getStorageSync('openid')).then((res) => {
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
        console.log('img1', img1);
        console.log('img2', img2);
        let context = wx.createCanvasContext('mycanvas');
        context.drawImage(img1, 0, 0, width, height);
        context.save();
        this.circleImg(context,img2,570 * unit, 1030 * unit, 80 * unit)
        // context.drawImage(img2, 550 * unit, 1060 * unit, 140 * unit, 140 * unit);
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
  // 圆形图片
  circleImg: function (context, img, x, y, r){
    context.save()
    var d = 2 * r;
    var cx = x + r;
    var cy = y + r;
    context.arc(cx, cy, r, 0, 2 * Math.PI);
    context.clip();
    context.setFillStyle('#fff') // 填充背景颜色
    context.fill() // 用fill方法真正的画到canvas中
    context.drawImage(img, x, y, d, d);
    context.restore();
},
   /**
   * 生成海报
   */
  generateCardPoster0() {
    var that = this;
    const width = that.data.posterBoxWidth;
    const height = that.data.posterBoxHeight;
    const unit = that.data.unit;

    let img1 = '';
    let img2 = '';

    let promise1 = new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: that.data.preffixUrl + that.data.bg,
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
        console.log(wx.getStorageSync('openid'))
        api.generateMiniCode('sub5/pages/index','',wx.getStorageSync('openid')).then((res) => {
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

        // context.drawImage(img2, 523 * unit, 1006 * unit, 178 * unit, 180 * unit);
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
        wx.hideToast();
      });
  },
  generateCardPoster2() {
    var that = this;
    const width = that.data.posterBoxWidth;
    const height = that.data.posterBoxHeight;
    const unit = that.data.unit;

    let img1 = '';
    let img2 = '';

    let promise1 = new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: that.data.preffixUrl + that.data.bg2,
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
        api.generateMiniCode('sub5/pages/index','',wx.getStorageSync('openid')).then((res) => {
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
        console.log('img1', img1);
        console.log('img2', img2);
        let context = wx.createCanvasContext('mycanvas');
        context.drawImage(img1, 0, 0, width, height);
        context.save();
        this.circleImg(context,img2,570 * unit, 1030 * unit, 80 * unit)
        // context.drawImage(img2, 550 * unit, 1060 * unit, 140 * unit, 140 * unit);
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
                console.log(a.tempFilePath);
                let posterImgs = that.data.posterImgs;

                posterImgs[2].poster = a.tempFilePath;
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
  onClose() {
    this.setData({
      show: false,
      showPosterBox: false,
    });
  },
  cancelPoster(e) {
    //console.log(e);
    this.setData({
      showPosterBox: true,
    });
  },
  async recommend() {
    // 查看是否授权
    var that=this;
    user.ifAuthUserInfo().then(res => {
      console.log(res)
      if (res) {
        wx.showLoading({
          title: '跳转中',
          mask: true,
        });
        let customerInfo = this.data.customerInfo;
        console.log('customerInfo', customerInfo);
        wx.hideLoading();
        wx.navigateTo({
          // url: `/sub5/pages/recommend?customerInfo= ${encodeURIComponent(JSON.stringify(customerInfo))}`,
          url: './mer/recommend/recommend'
        });
      } else {
        that.setData({
          loginFlag: false, //授权提示控制
        })
      }
    })
  },
})
