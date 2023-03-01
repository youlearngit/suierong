// sub6/pages/toolkit/clipNeck.js
var app = getApp();
import user from '../../../utils/user';
import Order from '../../../api/Order';
import api from "../../../utils/api"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginFlag:true,
    preffixUrl: app.globalData.CDNURL,
    shareBox: "shareBox",
    submit: true,
    cndUrl: app.globalData.CDNURL,
    maskHidden: true,
    nick: '', //授权昵称
    avatar: '', //授权头像
    wechat: "", //本详情页二维码
    bg: "/static/wechat/img/temp/kbzfx.jpg", //图片背景图
    //touxiang: "/pages/public/img/temp/touxiang.jpg",//头像路径
    maskHidden: true, //控制遮罩层
    imagePath: "", //存放canvas生成的图片
    canvasId: 'mycanvas',
    path: '',
    newbg: '',
    scene: '',
    showImgData: '',
    wechat: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this
    //把背景图片保存到本地
    console.log(this.data.preffixUrl + this.data.bg);
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
  },
   //取消登录
   logincancel: function () {
    var that = this;
    that.setData({
      loginFlag: true,
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
    //let share_id = wx.getStorageSync('openid');
    //var path = url + "?open_id=" + 
    if (that.data.submit) {
      that.setData({
        submit: false
      })
      //请求接口
      // sub6\pages\toolkit\clipNeck.wxml
      api.generateMiniCode("sub6/pages/toolkit/clipNeck").then(res=>{
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
    context.drawImage(path, 0, 0, 750, 1216); //背景绘制
    context.drawImage(that.data.wechat, 550, 1020, 150, 150); //小程序码

    var touxiang = that.data.avatar;
    //var touxiang = that.data.userInfo.avatarUrl;
    //context.drawImage(touxiang, 100, 1010, 100, 100);//头像绘制
    //绘制昵称
    var nickname = '@' + that.data.nick + " 向您推荐";
    //var nickname = '@' + that.data.userInfo.nickName + " 向您推荐";
    context.setFillStyle('#333');
    context.setFontSize(28);
    context.setTextAlign('left');
    context.fillText(nickname, 30, 1205); //昵称绘制
    context.stroke();
    context.setFontSize(20);
    context.fillText("长按立即申请", 565, 1196); //提示绘制
    //绘制头像
    context.setStrokeStyle('#fff');
    context.setLineWidth(0);
    context.arc(140, 1095, 70, 0, 2 * Math.PI, false) //画一个圆形裁剪区域
    context.clip();
    context.drawImage(touxiang, 70, 1025, 140, 140); //头像绘制
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
  getAmount() {
    var that = this;
 
      
      user
        .ifAuthUserInfo()
        .then((res) => {
          if (res) {
            Order.getUnfinishedOrder();
          } else {
            that.setData({
              loginFlag: false,
            });
            return Promise.reject('未授权登陆');
          }
        })
        .catch((err) => {});
   
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})