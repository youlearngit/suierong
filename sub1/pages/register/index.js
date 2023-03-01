const util = require('../../../utils/util');
var that;
var systemWidth;
const app = getApp();
import user from "../../../utils/user"
import api from "../../../utils/api"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginFlag: true, //授权提示控制
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: {},
    number: 2000000,
    timer: '',
    shareBox: "shareBox",
    submit: true,
    maskHidden: true,
    nick: '',//授权昵称
    avatar: '',//授权头像
    wechat: "",//本详情页二维码
    bg: "/static/wechat/img/register/share_ebank.jpg",//图片背景图
   
    maskHidden: true,//控制遮罩层
    imagePath: "",//存放canvas生成的图片
    canvasId: 'mycanvas',
    preffixUrl: '',
    path: '',
    newbg: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageSync('openid') == null && wx.getStorageSync('openid') == '') {
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          util.openid(res.code, app.globalData.URL);
        }
      })
    }
    let that = this;
    // 以下两个是测试数据
    let totalItems = 400;
    let rightItems = 200;
    let completePercent = parseInt((rightItems / totalItems) * 100);
    that.showScoreAnimation(rightItems, totalItems);
    this.setData({
      preffixUrl: app.globalData.URL,
      navTop: app.globalData.statusBarTop,
      navHeight: app.globalData.statusBarHeight,
    })
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


  showScoreAnimation: function (rightItems, totalItems) {
    /*
    cxt_arc.arc(x, y, r, sAngle, eAngle, counterclockwise);
    x	                    Number	  圆的x坐标
    y	                    Number	  圆的y坐标
    r	                    Number	  圆的半径
    sAngle	            Number	  起始弧度，单位弧度（在3点钟方向）
    eAngle	            Number	  终止弧度
    counterclockwise	    Boolean	  可选。指定弧度的方向是逆时针还是顺时针。默认是false，即顺时针。
    */
    let that = this;
    let copyRightItems = 0;
    that.setData({
      timer: setInterval(function () {
        copyRightItems++;
        if (copyRightItems > rightItems) {
          clearInterval(that.data.timer)
        } else {
          // 页面渲染完成
          // 这部分是灰色底层
          ////console.log(copyRightItems)
          //真实宽度转换成rpx
          let systemWidth = wx.getSystemInfoSync().windowWidth;
          let _w = parseInt(systemWidth * 215 / 750);
          that.setData({
            resultComment: copyRightItems + "0000"
          })
          let cxt_arc = wx.createCanvasContext('canvasArc');//创建并返回绘图上下文context对象。
          cxt_arc.setLineWidth(6);//绘线的宽度
          cxt_arc.setStrokeStyle('#e8d9bb');//绘线的颜色
          cxt_arc.setLineCap('round');//线条端点样式
          cxt_arc.beginPath();//开始一个新的路径
          cxt_arc.arc(_w, _w, _w - 3, -Math.PI * 1.1, Math.PI / 10, false);
          //112, 112, 109,
          cxt_arc.stroke();//对当前路径进行描边
          //这部分是蓝色部分
          cxt_arc.setLineWidth(6);
          cxt_arc.setStrokeStyle('#dcac45');
          cxt_arc.setLineCap('round')
          cxt_arc.beginPath();//开始一个新的路径
          cxt_arc.arc(_w, _w, _w - 3, -Math.PI * 1.1, 2 * Math.PI * (copyRightItems / totalItems) - Math.PI, false);
          cxt_arc.stroke();//对当前路径进行描边
          cxt_arc.draw();
        }
      }, 20)
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
    var path = 'sub1/pages/register/index' + "?open_id=" + share_id + "&share_date=" + util.formatTime(new Date());
    return {
      path: path,
      imageUrl: this.data.preffixUrl + "/static/wechat/img/register/share_ebank.jpg"
    }
  },
  indexpage: function () {
    wx.switchTab({
        url: '/pages/shop/index2',
    });
  },
  //点击分享
  showShare: function () {
    var that = this;
    // 查看是否授权

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
    if (that.data.submit) {
      that.setData({
        submit: false
      })
      //请求接口

      api.generateMiniCode("sub1/pages/register/index").then(res=>{
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
    context.drawImage(path, 0, 0, 750, 1216);//背景绘制
    context.drawImage(that.data.wechat, 550, 980, 150, 150);//小程序码

    var touxiang = that.data.avatar;
    //context.drawImage(touxiang, 100, 1010, 100, 100);//头像绘制
    //绘制昵称
    var nickname = '@' + that.data.nick + " 向您推荐";
    context.setFillStyle('#333');
    context.setFontSize(28);
    context.setTextAlign('left');
    context.fillText(nickname, 50, 1165);//昵称绘制
    context.stroke();
    context.setFontSize(20);
    context.fillText("长按立即申请", 565, 1156);//提示绘制
    //绘制头像
    context.setStrokeStyle('#fff');
    context.setLineWidth(0);
    context.arc(120, 1055, 70, 0, 2 * Math.PI, false) //画一个圆形裁剪区域
    context.clip();
    context.drawImage(touxiang, 50, 985, 140, 140);//头像绘制
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
  prePage() {
    wx.navigateBack();
  },
  apli: function () {
    var that = this;
    // wx.navigateTo({
    //   url: 'apli',
    // })
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
                        url: '/sub1/pages/auth/index?type=2&url=/sub1/pages/register/apli',
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
})





