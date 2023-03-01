// sub6/pages/toolkit/index.js
const app = getApp();
import utils from './utils';
import user from "../../../utils/user";
import api from "../../../utils/api"
import myCanvas from '../../../utils/canvas';
import emp from '../../../utils/Emp';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cndUrl: app.globalData.CDNURL,
    preffixUrls: utils.preffixUrl(),
    location_json: '',
    bbx_channel: '',
    location: '',
    loginFlag: true, //授权提示控制
    hidePoster: true, //隐藏海报
    maskHidden: true, //控制遮罩层
    hidePoster: true,
    showApply: true,
    showPosterBox: false,
    preffixUrl: app.globalData.CDNURL,
    nick: "", //授权昵称
    avatar: "", //授权头像
    wechat: "", //本详情页二维码
    bg: "/static/wechat/img/gjx/fxbj.jpg", //图片背景图
    //touxiang: "/pages/public/img/temp/touxiang.jpg",//头像路径
    maskHidden: true, //控制遮罩层
    edushow: true,
    imagePath: "", //存放canvas生成的图片
    canvasId: "mycanvas",
    loginFlag: true,
    submit: true,
    userInfo: {},
    newbg: '',
    wechat :'',
    top:"10vh",
    height:"75vh",
    empNo:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.locationInit()
    this.getCardInfo()
    api.getSystemInfo2(750, 1346, 1.4).then((res) => {
      console.log('res0', res);
      this.setData({
        posterBoxHeight: res.posterBoxHeight,
        posterBoxWidth: res.posterBoxWidth,
        unit: res.unit,
        empNo: this.data.empNo ? this.data.empNo : app.globalData.empNo,
        screenWidth: res.systemInfo.screenWidth,
      });
    });
    console.log(!(options.type && options.type === 'share'));
    this.setData({
      showApply: !(options.type && options.type === 'share'),
    });
    let that = this
    //把背景图片保存到本地
    wx.downloadFile({
      url: this.data.cndUrl + this.data.bg,
      success: function (res) {
        console.log(res);
        if (res.statusCode === 200) {
          // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
          that.setData({
            newbg: res.tempFilePath, //授权头像
          });
        }
        //console.log(res.tempFilePath);
      },
    });
    // wx.showToast({
    //   title: "加载中...",
    //   mask: true,
    //   icon: "loading",
    //   duration: 20000,
    // });
    // that.userInfo();
    // 查看是否授权
  },
  userInfo: function () {
    //console.log(app.globalData.userInfo);
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
      });
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
        });
      };
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理

    }
  },
  createPoster() {
    console.log(1);
    var that = this;
    that.closePopUp();
    that.setData({
      shareBox: 'shareBox on',
      hidePoster: false,
    });

  },
  logincancel: function () {
    var that = this;
    that.setData({
      loginFlag: true,
    });
  },
  closePopUp() {
    this.setData({
      showPosterBox: false,
      showComplain: false,
    });
    console.log(this.data);
  },
  //点击分享
  showShare: function () {
    var that = this;
    //let cxt_arc = wx.createCanvasContext('canvasArc'); //创建并返回绘图上下文context对象。
    // cxt_arc.draw(cxt_arc);
    // //console.log(cxt_arc)
    // 查看是否授权
    user.ifAuthUserInfo().then(res => {
      console.log(res);
      console.log(app.globalData.userInfo);
      if (res) {
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
              console.log('res2', res);
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
      } else {
        that.setData({
          loginFlag: false,
        });
      }
    })
  },
  getCardInfo(){
    var that = this
    console.log(app.globalData.empNo);
    emp.getCardInfoByEmp(app.globalData.empNo).then((res) => {
      console.log('getCardInfoByEmp',res);
      that.setData({
        cardInfo:res
      })
    })
  },
  //取消分享
  showHide: function () {
    var that = this;
    that.setData({
      shareBox: "shareBox",
      edushow: true,
    });
  },
  //点击生成海报按钮function
  showCreat: function (e) {
    var that = this;
    if (that.data.submit) {
      that.setData({
        submit: false,
      });
      //请求接口

      api.generateMiniCode("sub6/pages/toolkit/index").then(res => {
        console.log(res);
     
        that.setData({
          wechat: res, //赋值本地的二维码图片给data.wechat
        });
        console.log(that);
        that.createNewImg();

      })
    }
  },
  baocun: function () {
    var that = this;
    //console.log(that.data.imagePath)
    wx.showToast({
      title: "加载中",
      icon: "loading",
      //mask: true,
      duration: 5000,
    });
    wx.saveImageToPhotosAlbum({
      filePath: that.data.imagePath,
      success(res) {
        wx.hideToast();

        wx.showModal({
          content: "图片已保存到相册，赶紧晒一下吧~",
          showCancel: false,
          confirmText: "好的",
          confirmColor: "#333",
          success: function (res) {
            if (res.confirm) {
              //console.log("用户点击确定");
              that.setData({
                maskHidden: true,
                shareBox: "shareBox",
              });
            }
          },
          fail: function (res) {
            wx.hideToast();
          },
        });
      },
    });
  },
  //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
  createNewImg: function () {
    let width = this.data.posterBoxWidth
    let height = this.data.posterBoxHeight
    let cardInfo = this.data.cardInfo;
    console.log(55555);
    var that = this;
    var context = wx.createCanvasContext("mycanvas");
    context.setFillStyle("#e2e0e0");
    context.fillRect(0, 0, width, height);
    // context.fillRect(0, 0, 750, 1216);
    var path = that.data.newbg;
    console.log('path',path);
    context.drawImage(path, 0, 0, width, height); //背景绘制
    // context.drawImage(path, 0, 0, 750, 1216); //背景绘制
    context.drawImage(that.data.wechat, width - 250, height - 280, 180, 180); //小程序码
    // context.drawImage(that.data.wechat, 550, 980, 150, 150); //小程序码
    console.log('wechat',that.data.wechat);
    var touxiang = that.data.avatar;
    console.log('touxiang',touxiang);
    context.drawImage(touxiang, 100, height - 230, 120, 120);//头像绘制
    // context.drawImage(touxiang, 50, 985, 140, 140); //头像绘制
    //绘制昵称
    var nickname = ''
    console.log('nickname',nickname);
    context.setFillStyle("#333");
    context.setFontSize(28);
    context.setTextAlign("left");
    // context.fillText(nickname, 50, 1165); //昵称绘制
    if (cardInfo && (cardInfo.USERNAME.length == '4' || cardInfo.USERNAME.length == '3' || cardInfo.USERNAME.length == '2')) {
      nickname = cardInfo.USERNAME + '|' + cardInfo.POSITION
    } else {
      nickname = "@" + that.data.nick + " 向您推荐";
    }
    context.fillText(nickname, 50, height - 40, 500, 2065); //昵称绘制
    context.stroke();
    context.setFontSize(20);
    // context.fillText("长按立即申请", 565, 1156); //提示绘制
    //绘制头像
    context.setStrokeStyle("#fff");
    context.setLineWidth(0);
    context.arc(120, 1055, 70, 0, 2 * Math.PI, false); //画一个圆形裁剪区域
    context.clip();
    // context.drawImage(touxiang,  100, 1300, 150, 150); //头像绘制
    context.stroke();
    context.draw();
    //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
    var _time = setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: "mycanvas",
        fileType: "jpg",
        quality: 0.7,
        success: function (res) {
          console.log('nicknameres',res);
          wx.hideToast();
          var tempFilePath = res.tempFilePath;

          that.setData({
            imagePath: tempFilePath,
            canvasHidden: true,
          });
          console.log('imagePath',that.data.imagePath);
          console.log('shareBox',that.data.shareBox);
        },
        fail: function (res) {
          //console.log(res);
        },
      });
    }, 300);
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
  locationInit: async function (e) {
    let {
      location,
      location_json,
      bbx_channel
    } = this.data;

    switch (bbx_channel) {
      case '320282': {
        location = await utils.getLocationByAdcode(bbx_channel);
      }
      break;
    case '310000': {
      location = await utils.getLocationByAdcode(bbx_channel);
    }
    break;
    default: {
      location = await utils.getUserLocation();
    }
    break;
    }
    location_json = JSON.stringify(location);

    this.setData({
      location,
      location_json
    });
  },
  // 跳转债券融资
  getObligatoryRight() {
    wx.navigateTo({
      url: "./ObligatoryRight"
    })
  },
  // 跳转股权融资
  getStockRights() {
    wx.navigateTo({
      url: "./stockRights"
    })
  },
  // 跳转管家服务
  getSteward() {
    wx.navigateTo({
      url: "./steward"
    })
  },
  // 跳转科技创新券
  getTechnology() {
    wx.navigateTo({
      url: "./technology"
    })
  },
  // 科技政策
  getScience() {
    wx.navigateTo({
      url: "./science"
    })
  },
  // 人才政策
  getTalents() {
    wx.navigateTo({
      url: "./talents"
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})