// sub3/pages/bbx/talents/index.js
var app = getApp();
import talent from '../talent';
import user from '../../../utils/user';
import Chat from '../../../api/Chat';
import Order from '../../../api/Order';
import api from "../../../utils/api"
const chat = new Chat();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginFlag: true,
    preffixUrl: app.globalData.URL,
    openid: wx.getStorageSync('openid'),
    talents: 0,
    submit: true,
    shareBox: "shareBox",
    cndUrl: app.globalData.CDNURL,
    wechat: "", //本详情页二维码
    maskHidden: true, //控制遮罩层
    imagePath: "", //存放canvas生成的图片
    canvasId: 'mycanvas',
    bg: "/static/wechat/img/rcd/rcdjydfxbj.png", //图片背景图
    channel: '11',
    phone: '11',
    talent_level: '11',
    idcard: '11',
    name: '11',
    showComplain: false,
    newbg: '',
    showTips:false,
    kpList: [{
        title: '线上申请',
        image: 'xssqrcd'
      },
      {
        title:'快速办理',
        image:'ksblrcd'
      },
      {
        title:'担保灵活',
        image:'dblhrcd'
      },
      {
        title:'优惠利率',
        image:'yhllrcd'
      },
      {
        title:'随借随还',
        image:'sjshrcd'
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.talents) {
      this.setData({
        talents: options.talents,
        channel: options.channel,
        phone: options.tel,
        talent_level: options.level,
        idcard: options.idcard,
        name: options.name,
        path:'创新积分贷'
      })
    }
    // this.getRecord()
    let that = this
    let bgUrl = ''
    if (options.talents == 0) {
      bgUrl = "/static/wechat/img/rcd/rcdjydfxbj.png"
      console.log(this.data.cndUrl + bgUrl);
      wx.downloadFile({
        url: this.data.cndUrl + bgUrl,
        success: function (res) {
          if (res.statusCode === 200) {
            // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
            that.setData({
              newbg: res.tempFilePath //授权头像
            })
          }
        }
      })
      this.setData({
        bg:bgUrl
      })
    } else {
      bgUrl = "/static/wechat/img/rcd/rcdjydfxbj.png"
      console.log(this.data.cndUrl + this.data.bg);
      wx.downloadFile({
        url: this.data.cndUrl + bgUrl,
        success: function (res) {
          if (res.statusCode === 200) {
            // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
            that.setData({
              newbg: res.tempFilePath //授权头像
            })
          }
        }
      })
      this.setData({
        bg:bgUrl
      })
    }

    //把背景图片保存到本地
  
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
  closePopUp() {
    this.setData({
      showPosterBox: false,
      showComplain: false,
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
  getRecord() {
    console.log(1111);
    let {
      openid,
      path,
      location,
      time,
      phone,
      idcard,
      talent_level,
      share_intid
    } = this.data
    talent.record({
      openid,
      path,
      location,
      time,
      phone,
      idcard,
      talent_level,
      share_intid
    }).then(res => {
      console.log('record', res);
    })
  },
  getApplyInfo(){
    this.setData({
      showTips: false,
    });
    let url ="/sub1/pages/sui/index2";
       
    Order.getUnfinishedOrder(url);
  },
  getSYD() {
    let that = this
    // /sub1/pages/consumer/index
    user.ifAuthUserInfo().then(res => {
      if (res) {
      
       
        this.setData({
          showTips:true
        })
      } else {
        that.setData({
          loginFlag: false,
        });
      }
    })
    
  },
  //点击分享
  showShare: function () {
    var that = this;
    user.ifAuthUserInfo().then(res => {

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
              if (res.statusCode === 200) {
                console.log('res.tempFilePath', res.tempFilePath);
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
    console.log('showCreat');
    if (that.data.submit) {
      that.setData({
        submit: false
      })
      //请求接口
      console.log('sub6\pages\toolkit\clipNeck.wxml');
      // /sub3/pages/bbx/innovate/index
      api.generateMiniCode("sub6/pages/rcdjyd/index").then(res => {
        console.log(res);
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
    console.log('createNewImg');
    var that = this;
    var context = wx.createCanvasContext('mycanvas');
    context.setFillStyle("white");
    context.fillRect(0, 0, 750, 1216);
    var path = that.data.newbg;
    context.drawImage(path, 0, 0, 750, 1216); //背景绘制
    context.drawImage(that.data.wechat, 550, 990, 120, 120); //小程序码
    console.log('that.data.nick', that.data.nick);
    var touxiang = that.data.avatar;
    // var touxiang = that.data.userInfo.avatarUrl;
    context.drawImage(touxiang, 100, 990, 100, 100);//头像绘制
    //绘制昵称
    var nickname = '@' + that.data.nick + " 向您推荐";
    // console.log('nickname', nickname);
    // var nickname = " 识别二维码进入";
    // context.setFillStyle('#488EA4');
    // context.setFontSize(36);
    context.setFillStyle('#333');
    context.setFontSize(30);
    context.setTextAlign('left');
    context.fillText(nickname,30, 1146); //昵称绘制
    context.stroke();
    context.setFontSize(20);
    // context.setFontSize(36);
    context.fillText("长按立即申请", 545, 1146); //提示绘制
    // context.fillText("江苏银行人才服务百宝箱", 250, 1046); //提示绘制
    //绘制头像
    context.setStrokeStyle('#333');
    // context.setStrokeStyle('#488EA4');
    context.setLineWidth(0);
    // context.arc(140, 1095, 70, 0, 2 * Math.PI, false) //画一个圆形裁剪区域
    context.clip();
    // context.drawImage(touxiang, 70, 1025, 140, 140); //头像绘制
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