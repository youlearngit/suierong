// sub1/pages/crossBorderE/list.js
import api from "../../../utils/api";
import util from "../../../utils/util";
var that;
var app = getApp();

Page({
  /**
   * Page initial data
   */
  data: {
    desc1: "   江苏银行自贸云服务平台融合了最新的金融科技，能够为企业自贸区业务开展、提供一站式、全线上化的跨境结算、跨境融资和跨境交易等自贸金融综合服务。",
    maskHidden: true, //控制遮罩层
    imagePath: "", //海报路径
    hidePoster: true, //隐藏海报
    tm: ''
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    that = this;
    this.setData({
      preffixUrl: app.globalData.URL,
    });

    api.getSystemInfo(751, 1201, 2.3).then((res) => {
      that.setData({
        posterBoxHeight: res.posterBoxHeight,
        posterBoxWidth: res.posterBoxWidth,
        unit: res.unit,
        screenWidth: res.systemInfo.screenWidth,
      });
    });
  },

  toDesc(e) {
    //console.log(e.currentTarget.dataset);
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "listInfo?id=" + id,
      success: (result) => {},
      fail: () => {},
      complete: () => {},
    });
  },

  register() {
    wx.navigateTo({
      url: "register",
      success: function (res) {},
      fail: function (res) {},
      complete: function (res) {},
    });
  },

  //点击分享
  showShare: function () {
    var that = this;
    var isCreat = that.data.imagePath;
    that.setData({
      shareBox: "shareBox on",
    });
    if (isCreat != "") {
      wx.hideToast();
      that.setData({
        hidePoster: false,
      });
    } else {
      wx.showToast({
        title: "海报绘制中...",
        icon: "loading",
        mask: true,
        duration: 20000,
      });
      that.generateCardPoster();
    }
  },

  //取消分享
  showHide: function () {
    var that = this;
    that.setData({
      shareBox: "shareBox",
      hidePoster: true,
    });
  },

  /**
   * 点击保存到相册
   */
  baocun() {
    var that = this;
    api.saveImage(that.data.imagePath)
      .then((res) => {
        that.setData({
          shareBox: "shareBox",
          hidePoster: true,
        });
      })
      .catch((res) => {
        console.error(res);
        if (res.errMsg === "saveImageToPhotosAlbum:fail auth deny" || res.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || res.errMsg === "saveImageToPhotosAlbum:fail authorize no response") {

          wx.showModal({
            title: '提示',
            content: '需要您授权保存相册',
            showCancel: false,
            success: modalSuccess => {
              wx.openSetting({
                success(settingdata) {
                  if (settingdata.authSetting['scope.address.writePhotoAlbum']) {
                    //console.log("获取权限成功")
                  } else {
                    console.error('获取权限失败')
                  }
                }
              })
            }
          })
        }

      });
  },

  /**
   * 使用生成名片海报
   */
  generateCardPoster() {

    var that = this;
    const width = that.data.posterBoxWidth / 2.3;
    const height = that.data.posterBoxHeight / 2.3;
    const unit = that.data.unit;
    let img1 = "";
    let img2 = "";
    let token ="";
    //get poster background
    let promise1 = new Promise(function (resolve, reject) {
      wx.getImageInfo({
        // src: that.data.preffixUrl + "/static/wechat/img/zm/zm_38.jpg",
        src:that.data.preffixUrl +"/static/wechat/img/zm/5.jpg",
        success: function (res) {
          img1 = res.path;
          resolve(res);
        },
        fail: function (res) {
      

          reject(res);
        },
      });
    });

    // get minicode


    let promise2 = new Promise(function (resolve, reject) {
            api.generateMiniCode("sub2/pages/crossBorderE/list").then(res => {
                console.log(res);
                if (res) {
                    img2 = res;
                    resolve();
                } else {
                    reject();
                }
            });
    });

    Promise.all([promise1, promise2])
      .then((res) => {
        console.log("img1", img1); //头像
        console.log("img2", img2); //黑色底

        const context = wx.createCanvasContext("mycanvas");
        context.setFillStyle("#fff");
        context.drawImage(img1, 0, 0, width, height);
        context.save();
        // context.beginPath();

        // context.arc(  
        //    (unit * 128) / 2 + unit * 80,
        // (unit * 128) / 2 + unit * 1010,
        // (unit * 128) / 2,
        // 0,
        // Math.PI * 2,
        // false)
        // context.setFillStyle('#fff')
        // context.fill()
        // context.restore();

      
        context.arc(
          (unit * 128) / 2 + unit * 86,
          (unit * 128) / 2 + unit * 1020,
          (unit * 128) / 2,
          0,
          Math.PI * 2,
          false
        );
        context.clip(); //画圆
        context.drawImage(
          img2,
          unit * 86,
          unit * 1020,
          unit * 128,
          unit * 128
        );


        context.restore();

        context.draw(false, function () {
          setTimeout(() => {
            wx.canvasToTempFilePath({
              canvasId: "mycanvas",
              x: 0,
              y: 0,
              width: width,
              height: height,
              destWidth: width,
              destHeight: height,
              quality: 1,
              success: (a) => {
                // //console.log(a.tempFilePath);
                that.setData({
                  imagePath: a.tempFilePath,
                  hidePoster: false,
                });
                wx.hideLoading();
                wx.hideToast();
              },
              fail: (err) => {
                
                wx.hideLoading();
                wx.showToast({
                  title: "生成海报失败，请打开重试",
                  icon: "none",
                  mask: true,
                  duration: 200,
                });
                wx.hideToast();
                //console.log(err);
                that.setData({
                  hidePoster: true,
                });
              },
            });
          }, 800);
        });
      })
      .catch((err) => {
        wx.hideLoading();
        wx.showToast({
          title: "生成海报失败，请打开重试",
          icon: "none",
          mask: true,
          duration: 200,
        });
        console.log(err);
      });
  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {},
});