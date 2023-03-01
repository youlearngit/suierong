// sub2/pages/newYearBless/index.js
var app = getApp();
import api from '../../../utils/api';
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cdnUrl: app.globalData.CDNURL,
    zhufu: '',
    previewI: false,
    isScroll: true,
    qrcodeUrl: '',
    shareBox: "shareBox",
    maskHidden: true,
    zhufuRen: '',
    loginFlag: true,
    previewImage: '',
    submit: true,
    index: '1',
    imagePath: '',
    preffixUrl: app.globalData.URL,
    navTop: app.globalData.statusBarTop,
    navHeight: app.globalData.statusBarHeight
  },
  // 获取焦点事件
  bindfocus(e) {
    this.setData({
      isScroll: false
    })
  },
  // 失去焦点事件
  closeblur(e) {
    this.setData({
      isScroll: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
 
    var pagenum = getCurrentPages()
    this.setData({
      pageFlag: pagenum.length
    })
    api.getSystemInfo2(1080, 1920, 1.3).then(res => {
      this.setData({
        posterBoxHeight: res.posterBoxHeight,
        posterBoxWidth: res.posterBoxWidth,
        unit: res.unit,
        screenWidth: res.systemInfo.screenWidth,
      });
    });
  },
  home() {
    wx.switchTab({
      url: '/pages/shop/index2',
    })
  },
  prePage() {
    wx.navigateBack();
  },
  //取消分享
  showHide: function () {
    that.setData({
      shareBox: "shareBox",
    })
  },
  create() {
    this.setData({
      previewI: true
    })
    if (that.data.previewImage == '') {
      wx.showToast({
        title: '请点击选择祝福模板(步骤三)',
        icon: 'none',
        duration: 3000
      })
      return;
    }
    if (that.data.zhufu == '') {
      wx.showToast({
        title: '请填写祝福的人(步骤一)',
        icon: 'none',
        duration: 3000
      })
      return;
    }
    if (that.data.zhufuRen == '') {
      wx.showToast({
        title: '请填写祝福人姓名(步骤二)',
        icon: 'none',
        duration: 3000
      })
      return;
    }
    wx.showLoading({
      title: '生成中..',
    })

    that.showCreat()
  },
  preview(e) {

    if (that.data.zhufu == '') {
      wx.showToast({
        title: '请填写祝福的人(步骤一)',
        icon: 'none',
        duration: 3000
      })
      return;
    }
    if (that.data.zhufuRen == '') {
      wx.showToast({
        title: '请填写祝福人姓名(步骤二)',
        icon: 'none',
        duration: 3000
      })
      return;
    }
    let index = e.currentTarget.dataset.id;
 
    let img = this.data.cdnUrl + '/static/wechat/img/zm/sheep_preview' + index + '.jpg'
    this.setData({
      previewImage: img,
      index: index,
      previewI: false
    })
    wx.showLoading({
      title: '预览中..',
    })
    that.showCreat()

    
  },
  //点击生成海报按钮function
  showCreat: function (e) {
    if (that.data.submit) {
      that.setData({
        submit: false
      })
      setTimeout(res => {
        that.setData({
          submit: true
        })
      }, 1500)

      wx.getImageInfo({
        src: that.data.previewImage,
        success(res) {
          that.setData({
            newbg: res.path //授权头像
          })
          if (that.data.qrcodeUrl != '') {
            that.createNewImg();

            return;
          }
          api.generateMiniCode('sub1/pages/sui/index', app.globalData.empNo).then(res => {
            if (res) {

              that.setData({
                qrcodeUrl: res
              })
              that.createNewImg();
            } else {
              wx.hideLoading({
                success: (res) => {},
              })
              wx.showToast({
                title: '生成失败，请重试',
              })
            }
          });

        },
        fail(res) {}
      })
    }
  },
  //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
  createNewImg: function () {


    const width = that.data.posterBoxWidth;
    const height = that.data.posterBoxHeight;
    const unit = that.data.unit;

    var context = wx.createCanvasContext('mycanvas');


    var path = that.data.newbg;
    context.drawImage(path, 0, 0, width, height); //背景绘制
    context.drawImage(that.data.qrcodeUrl, 850 * unit, 1665 * unit, 160 * unit, 160 * unit); //小程序码


    //绘制祝福
    var zhufu = that.data.zhufu;
    context.setFillStyle('#ffeeb0');

    if(zhufu.length==7){
      context.setFontSize(60 * unit);
      context.setTextAlign('left');
      if (that.data.index == '1') {
        context.fillText(zhufu, 390 * unit, 290 * unit); //昵称绘制
      } else if (that.data.index == '2') {
        context.fillText(zhufu, 370 * unit, 345 * unit);
      } else if (that.data.index == '3') {
        context.fillText(zhufu, 380 * unit, 300 * unit);
      } else if (that.data.index == '4') {
        context.fillText(zhufu, 420 * unit, 290 * unit);
      } else if (that.data.index == '5') {
        context.fillText(zhufu, 440 * unit, 300 * unit);
      }else {
        context.fillText(zhufu, 380 * unit, 282 * unit);
      }
    }else{
      context.setFontSize(60 * unit);
      context.setTextAlign('center');
      if (that.data.index == '1') {
        context.fillText(zhufu, 560 * unit, 280 * unit); //昵称绘制
      } else if (that.data.index == '2') {
        context.fillText(zhufu, 535 * unit, 345 * unit);
      } else if (that.data.index == '3') {
        context.fillText(zhufu, 560 * unit, 285 * unit);
      } else if (that.data.index == '4') {
        context.fillText(zhufu, 560 * unit, 280 * unit);
      }  else if (that.data.index == '5') {
        context.fillText(zhufu, 570* unit, 285 * unit);
      }
    }
 


    context.stroke();

    //绘制祝福人
    var zhufuRen = that.data.zhufuRen;
    console.log(zhufuRen);
    
    context.setTextAlign('center');1
    if(zhufuRen.length==7||zhufuRen.length==6){
      context.setFontSize(45 * unit);
    }else{
      context.setFontSize(55 * unit);

    }

    if (that.data.index == '1') {
      context.fillText(zhufuRen, 540 * unit, 1465 * unit); //昵称绘制
      context.setFillStyle('#ffeeb0');
    } else if (that.data.index == '2'){
      context.fillText(zhufuRen, 540 * unit, 1560 * unit);
      context.setFillStyle('#ffeeb0');
    } else if (that.data.index == '3'){
      context.fillText(zhufuRen, 540 * unit, 1455 * unit);
      context.setFillStyle('#ffeeb0');
    } else if (that.data.index == '4'){
      context.fillText(zhufuRen, 540 * unit, 1460 * unit);
      context.setFillStyle('#ffeeb0');
    } else if (that.data.index == '5'){
      console.log(1111);
      context.fillText(zhufuRen, 550 * unit, 1460 * unit);
      context.setFillStyle('#ffeeb0');
     
    }
    context.setFontSize(60);
    context.stroke();


    context.stroke();
    context.draw();
    //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
    var _time = setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        fileType: "jpg",
        quality: 0.7,
        success: function (res) {
          wx.hideLoading({
            success: (res) => {},
          })
          wx.hideToast();
          var tempFilePath = res.tempFilePath;
          that.setData({
            imagePath: tempFilePath,
          });
          if (that.data.previewI) {
            that.setData({
              shareBox: "shareBox on",
              canvasHidden: true
            })
          }
        },
        fail: function (res) {
          //console.log(res);
        }
      });
    }, 300);
  },
  //点击保存到相册
  baocun: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 5000
    })
    console.log('that.data.imagePath',that.data.imagePath);
    wx.saveImageToPhotosAlbum({
      filePath: that.data.imagePath,
      success(res) {
        console.log(res);
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
            console.log(res);
            wx.hideToast();
          }
        })
      }
    })
    
  },
  /**
   * 登陆授权组件回调
   * @param {*} e
   */
  getAuthInfo(e) {
    if (e.detail.userInfo) {
      that.setData({
        nick: e.detail.userInfo.nickName, //授权昵称
      })
      wx.downloadFile({
        url: e.detail.userInfo.avatarUrl,
        success: function (res) {
          if (res.statusCode === 200) {
            that.setData({
              avatar: res.tempFilePath //授权头像
            })
            that.setData({
              loginFlag: true
            })
          }
        }
      })
    }
  },
  //取消登录
  logincancel: function () {
    that.setData({
      loginFlag: true,
    })
  },
  zhufu(e) {
    var value = e.detail.value
    this.setData({
      zhufu: value
    })
  },
  zhufuRen(e) {

    var value = e.detail.value
    this.setData({
      zhufuRen: value
    })
  },
  ifAuthUserInfo() {

    return new Promise((resolve, reject) => {
      wx.getSetting({
        success(res) {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.getUserInfo({
              success(res) {
                that.setData({
                  nick: res.userInfo.nickName, //授权昵称
                })
                wx.downloadFile({
                  url: res.userInfo.avatarUrl,
                  success: function (res) {
                    if (res.statusCode === 200) {
                      that.setData({
                        avatar: res.tempFilePath //授权头像
                      })
                    }
                  }
                })

              }
            })
            resolve(true);
          } else {
            that.setData({
              loginFlag: false,
            });
            resolve(false);
          }
        },
      });
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    // console.log(this.data.cdnUrl + '/static/wechat/img/nq/fx.jpg');
    // const promise = new Promise(resolve => {
    //   setTimeout(() => {
    //     resolve({
    //       title: '江苏银行普惠金融专属定制春联',
    //   path: '/sub1/pages/sui/index',
    //   imageUrl:this.data.cdnUrl + '/static/wechat/img/zm/fx1.jpg',
    //     })
    //   }, 2000)
    // })
    // return {
    //   title: '自定义转发标题',
    //   path: '/sub1/pages/sui/index',
    //   imageUrl:this.data.preffixUrl + '/static/wechat/img/zm/fx1.jpg',
    //   promise 
    // }
    // let imagePath = that.data.imagePath;
    // if (that.data.imagePath == '') {
    //   imagePath = that.data.newbg;
    // }
    // let params = '&empNo=' + app.globalData.empNo + '&intId=' + app.globalData.int_id;
    // return api.shareApp(imagePath, params);
  }
})