var that
var systemWidth
const util = require('../../utils/util')
const app = getApp();
import api from "../../utils/api"
import user from '../../utils/user';

Page({
  data: {
    loginFlag: true, //授权提示控制
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: {},
    shareBox: "shareBox",
    submit: true,
    maskHidden: true,
    nick: '', //授权昵称
    avatar: '', //授权头像
    wechat: "", //本详情页二维码
    bg: "/static/wechat/img/temp/share_kh_bg.jpg", //图片背景图
    introimg: "/static/wechat/img/temp/kaihujieshao.jpg",
    maskHidden: true, //控制遮罩层
    edushow: true,
    //imagePath: "", //存放canvas生成的图片
    canvasId: 'mycanvas',
    preffixUrl: '',
    path: '',
    newbg: '',
    scene: '',
    id: '',
    type:''//1-苏银城镇
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.scene) {
      if(options.scene.substr(0,5)==='0000a'){
        this.setData({
          scene: options.scene.substr(5)
        })
      }
    }

    if (options.type) {
        this.setData({
          type: options.type
        })
    }
    user.getCustomerInfo().then(res => {
      this.setData({
        id: res.INT_ID
      })
    })

    if (wx.getStorageSync('openid') == null && wx.getStorageSync('openid') == '') {
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          util.openid(res.code, app.globalData.URL);
        }
      })
    }
    let that = this;
    this.setData({
      preffixUrl: app.globalData.URL,
      navTop: app.globalData.statusBarTop,
      navHeight: app.globalData.statusBarHeight,
    });
    var pagenum = getCurrentPages()
    that.setData({
      pageFlag: pagenum.length
    });
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
          that.setData({
            newbg: res.tempFilePath
          })
        }
        //console.log(res.tempFilePath);
      }
    })
    that.userInfo();
    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success(res) {
              that.setData({
                nick: res.userInfo.nickName, //授权昵称
              })
              //console.log(res.userInfo.avatarUrl)
              wx.downloadFile({
                url: res.userInfo.avatarUrl,
                success: function (res) {
                  if (res.statusCode === 200) {
                    // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                    that.setData({
                      avatar: res.tempFilePath //授权头像
                    })
                    that.showCreat();
                  }
                  //console.log(res.tempFilePath);
                }
              })

            }
          })


        }
      }
    })

  },
  userControll() {
    let that = this;

    wx.showToast({
      title: '登录成功',
      icon: 'success',
      mask: true,
      duration: 2000
    });
    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success(res) {
              that.setData({
                nick: res.userInfo.nickName, //授权昵称
              })
              //console.log(res.userInfo.avatarUrl)
              wx.downloadFile({
                url: res.userInfo.avatarUrl,
                success: function (res) {
                  if (res.statusCode === 200) {
                    // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                    that.setData({
                      avatar: res.tempFilePath //授权头像
                    })
                    that.showCreat();
                  }
                  //console.log(res.tempFilePath);
                }
              })
            }
          })


        }
      }
    })
  },


  userInfo: function () {
    //console.log(app.globalData.userInfo)
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  //取消登录
  logincancel: function () {
    var that = this;
    that.setData({
      loginFlag: true,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let pages = getCurrentPages(); //获取加载的页面
    let currentPage = pages[pages.length - 1]; //获取当前页面的对象
    let url = currentPage.route; //当前页面url
    let share_id = wx.getStorageSync('openid');
    var path = 'pages/kaihu1/kaihu1' + "?open_id=" + share_id + "&share_date=" + util.formatTime(new Date());
    return {
      path: path,
      imageUrl: this.data.imagePath
    }
  },
  //点击分享
  showShare: function () {
    let that = this;
    //console.log("ss")
    // 查看是否授权
    wx.getSetting({
      success(res) {
        //console.log(res);
        if (res.authSetting['scope.userInfo']) {
          // 已经授权

          var isCreat = that.data.imagePath;
          that.setData({
            shareBox: "shareBox on",
          });
          if (isCreat) {
            wx.hideToast();
          } else {
            wx.showToast({
              title: '海报绘制中...',
              icon: 'loading',
              mask: true,
              duration: 20000
            });
            that.showCreat();
          };




        } else {
          //未授权
          that.setData({
            loginFlag: false,
          })
        }
      }
    });
  },
  //取消分享
  showHide: function () {
    var that = this;
    that.setData({
      shareBox: "shareBox",
      edushow: true
    })
  },
  //点击生成海报按钮function
  showCreat: function (e) {
    var that = this;
    //请求接口
    api.generateMiniCode("pages/kaihu1/kaihu1").then(res => {
      that.setData({
        wechat: res, //赋值本地的二维码图片给data.wechat
      });
      that.createNewImg();

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
  //开户介绍下载
  intro: function () {
    var that = this;
    var imgSrc = that.data.preffixUrl + that.data.introimg;
    wx.downloadFile({
      url: imgSrc,
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.showModal({
              content: '开户介绍已保存到相册，去查看吧~',
              showCancel: false,
              confirmText: '好的',
              confirmColor: '#333',
              success: function (res) {
                if (res.confirm) {
                  that.setData({
                    maskHidden: true,
                    shareBox: "shareBox",
                  })
                }
              },
              fail: function (res) {}
            })
          }
        })
      }
    })
  },
  //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
  createNewImg: function () {
    var that = this;

    var context = wx.createCanvasContext('mycanvas');
    context.setFillStyle("white");
    context.fillRect(0, 0, 750, 1216);
    var path = that.data.newbg;
    context.drawImage(path, 0, 0, 750, 1216); //背景绘制
    context.drawImage(that.data.wechat, 550, 995, 150, 150); //小程序码

    var touxiang = that.data.avatar;
    //绘制昵称
    var nickname = '@' + that.data.nick + " 向您推荐";
    context.setFillStyle('#333');
    context.setFontSize(28);
    context.setTextAlign('left');
    context.fillText(nickname, 50, 1166); //昵称绘制
    context.stroke();
    context.setFontSize(22);
    context.fillText("长按立即申请", 560, 1166); //提示绘制
    //绘制头像
    context.setStrokeStyle('#fff');
    context.setLineWidth(0);
    context.arc(120, 1065, 70, 0, 2 * Math.PI, false) //画一个圆形裁剪区域
    context.clip();
    context.drawImage(touxiang, 50, 995, 140, 140); //头像绘制
    context.stroke();
    context.draw();
    //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
    var _time = setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        fileType: "jpg",
        quality: 0.7,
        success: function (res) {
          wx.hideToast();
          var tempFilePath = res.tempFilePath;

          that.setData({
            imagePath: tempFilePath,
            canvasHidden: true
          });
        },
        fail: function (res) {
          //console.log(res);
        }
      });
    }, 350);
  },
  prePage() {
    wx.navigateBack();
  },
  indexpage: function () {
    wx.switchTab({
      url: "/pages/shop/index2"
    })
  },
  apli: function () {
    var that = this;

    user.getCustomerInfo().then(res => {

      this.setData({
        id: res.INT_ID
      })

      // let url ='https://wxapptest.jsbchina.cn:9629/account/applyInfo?id='+res.INT_ID+'&qdh='+this.data.scene+'&type='+this.data.type
      let url = 'https://openservice.jsbchina.cn/account/applyInfo?id=' + res.INT_ID + '&qdh=' + this.data.scene+'&type='+this.data.type
      wx.navigateTo({
        url: "/pages/showWeb/showWeb?skipUrl=" + encodeURIComponent(url),
      });
    }).catch(err => {
      wx.showToast({
        title: '登录失效',
        icon: 'none'
      })
    })

    return;
    // 查看是否授权
    wx.getSetting({
      success(res) {
        //console.log(res);
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接跳转申请

          wx.getUserInfo({
            success(res) {
              if (res.userInfo != undefined && res.userInfo != null) {
                var str = JSON.stringify({
                  STRING_OPEN_ID: wx.getStorageSync('openid'),
                  STRING_NICK_NAME: res.userInfo.nickName,
                  STRING_COUNTRY: res.userInfo.country,
                  STRING_PROVINCE: res.userInfo.province,
                  STRING_CITY: res.userInfo.city,
                  STRING_GENDER: res.userInfo.gender
                });
                var data = util.enct(str) + util.digest(str)
                wx.request({
                  url: app.globalData.URL + 'addcustomer',
                  data: {
                    data: data
                  },
                  method: 'POST',
                  header: {
                    "Content-Type": "application/x-www-form-urlencoded", // 默认值
                    "key": (Date.parse(new Date())).toString().substring(0, 6),
                    "sessionId": wx.getStorageSync('sessionid'),
                    "transNo": "XC006"
                  },
                  success(res) {
                    //console.log(res.data);
                    wx.request({
                      url: app.globalData.URL + 'getapplycount',
                      data: {
                        openid: wx.getStorageSync('openid')
                      },
                      header: {
                        "Content-Type": "application/json", // 默认值
                        "key": (Date.parse(new Date())).toString().substring(0, 6)
                      },
                      success(res) {
                        if (res.data != undefined && res.data != '' && res.data > 0) {
                          that.setData({
                            apply: true
                          })
                        }
                      },
                      fail() {
                        wx.showToast({
                          title: '网络异常',
                          icon: 'none',
                          duration: 2000
                        })
                      }
                    })

                  }
                })
              }
            }
          })
        } else {
          //未授权
          that.setData({
            loginFlag: false,
          })
        }
      }
    });


  },
})