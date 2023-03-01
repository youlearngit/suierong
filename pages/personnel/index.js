const util = require('../../utils/util');
var that
var systemWidth
const app = getApp();
import user from "../../utils/user"
import api from "../../utils/api"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginFlag: true, //授权提示控制
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: {},
    timer: '',
    shareBox: "shareBox",
    submit: true,
    maskHidden: true,
    nick: '', //授权昵称
    avatar: '', //授权头像
    wechat: "", //本详情页二维码
    bg: "/static/wechat/img/temp/rced.jpg", //图片背景图
    //touxiang: "/pages/public/img/temp/touxiang.jpg",//头像路径
    maskHidden: true, //控制遮罩层
    imagePath: "", //存放canvas生成的图片
    canvasId: 'mycanvas',
    preffixUrl: '',
    path: '',
    newbg: '',
    scene: '',
    showImgData: '',
    wechat: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //openid，加密相关
    if (wx.getStorageSync('openid') == null && wx.getStorageSync('openid') == '') {
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          util.openid(res.code, app.globalData.URL);
        }
      })
    }

    let that = this;
    that.setData({
      preffixUrl: app.globalData.URL,
      navTop: app.globalData.statusBarTop,
      navHeight: app.globalData.statusBarHeight,
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.hideToast();
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
    let url = currentPage.route;//当前页面url
    let share_id = wx.getStorageSync('openid');
    var path = url + "?open_id=" + share_id + "&share_date=" + util.formatTime(new Date())
    return {
      path: path,
      imageUrl: this.data.preffixUrl +  "/static/wechat/img/temp/rced.jpg"
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
    //console.log(app.globalData.int_id + "&" + util.formatTime(new Date()) + "123456")
    var qd = app.globalData.int_id + "&" + util.formatTime(new Date())
    //console.log(qd.split("&")[1])
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
                    nick: app.globalData.userInfo.nickName, //授权昵称
                });
                wx.downloadFile({
                    url: app.globalData.userInfo.avatarUrl,
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
    // 查看是否授权


  },
  //取消分享
  showHide: function () {
    var that = this;
    that.setData({
      shareBox: "shareBox",
    })
  },
  //点击生成海报按钮function
  showCreat: function (e) {
    var that = this;
    //let share_id = wx.getStorageSync('openid');
    //var path = url + "?open_id=" + 
    if (that.data.submit) {
      that.setData({
        submit: false
      })
      //请求接口
      api.generateMiniCode("pages/personnel/index").then(res=>{
        that.setData({
            wechat: res, //赋值本地的二维码图片给data.wechat
        });
        that.createNewImg();

    })
   
    }
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
  //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
  createNewImg: function () {
    var that = this;
    var context = wx.createCanvasContext('mycanvas');
    context.setFillStyle("white");
    context.fillRect(0, 0, 750, 1216);
    var path = that.data.newbg;
    context.drawImage(path, 0, 0, 750, 960); //背景绘制
    context.drawImage(that.data.wechat, 550, 980, 150, 150); //小程序码

    var touxiang = that.data.avatar;
    //var touxiang = that.data.userInfo.avatarUrl;
    //context.drawImage(touxiang, 100, 1010, 100, 100);//头像绘制
    //绘制昵称
    var nickname = '@' + that.data.nick + " 向您推荐";
    //var nickname = '@' + that.data.userInfo.nickName + " 向您推荐";
    context.setFillStyle('#333');
    context.setFontSize(28);
    context.setTextAlign('left');
    context.fillText(nickname, 50, 1165); //昵称绘制
    context.stroke();
    context.setFontSize(20);
    context.fillText("长按立即申请", 565, 1156); //提示绘制
    //绘制头像
    context.setStrokeStyle('#fff');
    context.setLineWidth(0);
    context.arc(120, 1055, 70, 0, 2 * Math.PI, false) //画一个圆形裁剪区域
    context.clip();
    context.drawImage(touxiang, 50, 985, 140, 140); //头像绘制
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
    }, 300);
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
    
    user.ifAuthUserInfo().then((res) => {
        if (res) {
          //证件拍照
          user
            .getIdentityInfo()
            .then((res) => {
                wx.navigateTo({
                    url: "apli",
                });
            })
            .catch((err) => {
              if (err === 'unSelectIdcard') {
                wx.showModal({
                  title: '提示',
                  content: '请先进行身份证拍照认证',
                  showCancel: true, //是否显示取消按钮
                  success: function (res) {
                    if (!res.confirm) {
                      return;
                    }
                    wx.navigateTo({
                        url: '/sub1/pages/auth/index?type=2&url=/pages/personnel/apli',
                    });
                  },
                });
              }
            });
          // 已经授权，可以直接跳转申请
        } else {
          //未授权
          that.setData({
            loginFlag: false,
          });
        }
      });
  },
  //判断数据库了里是否存在密钥
  isExistKey: function () {
    var that = this;
   
  },
})