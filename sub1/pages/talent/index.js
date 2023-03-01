const util = require('../../../utils/util');
const app = getApp();
import api from '../../../utils/api';
import user from '../../../utils/user';
import requestYT from '../../../api/requestYT';
import Order from "../../../api/Order";
var encr = require('../../../utils/encrypt/encrypt.js'); //国密3段式加密
var aeskey = encr.key //随机数

Page({
  data: {
    loginFlag: true, //授权提示控制
    hidePoster: true,
    shareBox: 'shareBox',
    nick: '', //授权昵称
    avatar: '', //授权头像
    wechat: '', //本详情页二维码
    bg: '/static/wechat/img/sui/poster_talent.jpg', //图片背景图
    imagePath: '',
    newbg: '',
    entrepreneurUrl: {
      finalUrl: '',
        // 'https://direct.jsbchina.cn/direct/page/index.html#page/100/999/30/P99930.html?cardNo=0075&cnl=0162&organ=00&mobile=',
        // 'https://p2ptest1.jsbchina.cn:998/direct/page/index.html#page/100/999/30/P99930.html?cardNo=0075&cnl=0162&organ=00&mobile=',
    },
    preffixUrl: app.globalData.CDNURL,
    currentPage: '',
    recommend_no:'', //分享人id
    //分享者详情信息
    idcard: "",
    nick_name: "",
    real_name: "",
    tel: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let {channel} = options;
    channel = channel || '0162';

    let {entrepreneurUrl} = this.data;
    user.getCustomerInfo().then( r =>{
       let options = {
        url: '/encrypt/data.do',
        data: {
          accType: '',
          accNo: '',
          custName: r.REAL_NAME,
          phoneNo:r.TEL,
          certType:'1',
          certNo:r.ID_CARD,
        }
      };
      requestYT(options).then((res) => {
        if(res.STATUS == '1'){
          //A产线
          entrepreneurUrl.finalUrl = `https://direct.jsbchina.cn/direct/page/index.html#page/100/999/30/P99930.html?cardNo=0075&cnl=${channel}&organ=00=&authdata=`+ res.genPostData+`&recommend_no=`+that.data.recommend_no+`&mobile=`;
           //b产线
          // entrepreneurUrl.finalUrl = `https://directb.jsbchina.cn/direct/page/index.html#page/100/999/30/P99930.html?cardNo=0075&cnl=${channel}&organ=00=&authdata=`+ res.genPostData+`&recommend_no=`+that.data.recommend_no+`&mobile=`;
          //测试
          // entrepreneurUrl.finalUrl = `https://p2ptest1.jsbchina.cn:998/direct/page/index.html#page/100/999/30/P99930.html?cardNo=0075&cnl=${channel}&organ=00=&authdata=`+ res.genPostData+`&recommend_no=`+that.data.recommend_no+`&mobile=`;
          console.log("加密后链接"+entrepreneurUrl.finalUrl);

          //分享代码
          // if (
          //   app.globalData.share_person != undefined &&
          //   app.globalData.share_person != null &&
          //   app.globalData.share_person != ""
          // ) {
          //   user.getCustomerInfo(app.globalData.share_person).then(res => {
          //     if (res.ID_CARD) {
          //       this.setData({
          //         idcard: res.ID_CARD ? res.ID_CARD : "",
          //         nick_name: res.NICK_NAME ? res.NICK_NAME : "",
          //         real_name: res.REAL_NAME ? res.REAL_NAME : "",
          //         tel: res.TEL ? res.TEL : "",
          //       });
          //       Order.getLatestApplyID().then(res => {
          //         let data = JSON.stringify({
          //           id_ID: "id",
          //           string_sharer_open_id: app.globalData.share_person, //分享人open_id
          //           string_sharer_nice_name: this.data.nick_name, //分享人昵称
          //           string_sharer_name: this.data.real_name, //分享人真实姓名
          //           string_sharer_id_card_no: this.data.id_card, //分享人身份证号码
          //           string_sharer_phone_number: this.data.tel, //分享人手机号码
          //           string_open_id: wx.getStorageSync("openid"), //申请人open_id
          //           string_apply_id: res[0].A_ID, //产品编号
          //           string_apply_type: "5",
          //         });
          //         console.log("添加分享详情:"+ data);
          //         Order.addApplyShareInfo(data).then(res=>{
          //           wx.navigateTo({
          //             url: "/pages/showWeb/showWeb?skipUrl=" + encodeURIComponent(url),
          //           });
          //         })
          //       });
          //     }
          //   });
          // }
        } else{
          return Promise.reject('网络异常');
        }
       })
    });
    
  
    
    this.setData({
      currentPage: getCurrentPages().length,
      entrepreneurUrl,
    });
    
    //把背景图片保存到本地
    wx.getImageInfo({
      src: app.globalData.CDNURL + this.data.bg,
      success: (res) => {
        that.setData({
          newbg: res.path,
        });
      },
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    let imagePath = '';
    if (that.data.imagePath) {
      imagePath = that.data.imagePath;
    }
    return api.shareApp(imagePath);
  },
  //点击分享
  showShare: function () {
    let that = this;
    user
      .ifAuthUserInfo()
      .then((res) => {
        if (res) {
          that.setData({
            shareBox: 'shareBox on',
            hidePoster: false,
          });
          if (that.data.imagePath) {
            console.log(1);
            that.setData({
              imagePath: that.data.imagePath,
            });
          } else {
            wx.showToast({
              title: '海报绘制中...',
              icon: 'loading',
              mask: true,
              duration: 20000,
            });
            that.createNewImg();
          }
        } else {
          that.setData({
            loginFlag: false,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },

  createNewImg: function () {
    var that = this;
    var context = wx.createCanvasContext('mycanvas');

    let promise1 = api.generateMiniCode('sub1/pages/talent/index').then((res) => {
      that.setData({
        wechat: res, //赋值本地的二维码图片给data.wechat
      });
    });
    let promise2 = new Promise((resolve, rej) => {
      that.setData({
        nick: app.globalData.userInfo.nickName, //授权昵称
      });
      wx.downloadFile({
        url: app.globalData.userInfo.avatarUrl,
        success: function (res) {
          if (res.statusCode === 200) {
            that.setData({
              avatar: res.tempFilePath, //授权头像
            });
            resolve();
          }
        },
      });
    });

    Promise.all([promise1, promise2]).then(() => {
      context.setFillStyle('white');
      context.fillRect(0, 0, 750, 1216);
      var path = that.data.newbg;
      context.drawImage(path, 0, 0, 750, 1216); //背景绘制
      context.drawImage(that.data.wechat, 550, 995, 150, 150); //小程序码
      var touxiang = that.data.avatar;
      //绘制昵称
      var nickname = '@' + that.data.nick + ' 向您推荐';
      context.setFillStyle('#333');
      context.setFontSize(28);
      context.setTextAlign('left');
      context.fillText(nickname, 50, 1166); //昵称绘制
      context.stroke();
      context.setFontSize(22);
      context.fillText('长按立即申请', 560, 1166); //提示绘制
      context.save();

      //绘制头像
      context.setStrokeStyle('#fff');
      context.setLineWidth(0);
      context.arc(160, 1065, 70, 0, 2 * Math.PI, false); //画一个圆形裁剪区域
      context.clip();
      context.drawImage(touxiang, 90, 995, 140, 140); //头像绘制
      context.stroke();
      context.draw();
      context.save();

      //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
      setTimeout(function () {
        wx.canvasToTempFilePath({
          canvasId: 'mycanvas',
          fileType: 'jpg',
          quality: 0.7,
          success: function (res) {
            wx.hideToast();
            var tempFilePath = res.tempFilePath;
            that.setData({
              imagePath: tempFilePath,
            });
          },
        });
      }, 300);
    });
  },

  apli1(){
    var that = this;
    let skipUrl = that.data.entrepreneurUrl.finalUrl;
    wx.navigateTo({
      url: '/pages/showWeb/showWeb?skipUrl=' + encodeURIComponent(skipUrl),
    });
  },

  async apli() {
    var that = this;
    wx.showLoading({
      title: '校验中',
      mask: true,
    });
    try {
      const identityInfo = await user.getIdentityInfo();
      await user.getRencai(identityInfo.ID_NUMBER, '消费金融与信用卡中心', '180046');
      let skipUrl = that.data.entrepreneurUrl.finalUrl;
      if (app.globalData.share_person) {
        await user.getCustomerInfo(app.globalData.share_person).then((res) => {
          skipUrl += res.USERID || res.TEL || '';
        });
      }
      wx.navigateTo({
        url: '/pages/showWeb/showWeb?skipUrl=' + encodeURIComponent(skipUrl),
      });
      wx.hideLoading();
    } catch (error) {
      wx.hideLoading();
      if (error === 'unSelectIdcard') {
        wx.showModal({
          title: '',
          content: '请先完善个人信息',
          showCancel: false,
          confirmText: '确定',
          success: (result) => {
            if (result.confirm) {
              wx.navigateTo({
                url: '/sub1/pages/auth/index',
              });
            }
          },
          fail: () => {},
          complete: () => {},
        });
      } else if (error === 'unRencai') {
        wx.showModal({
          title: '',
          content: '请先行办理人才资质认定',
          showCancel: false,
          confirmText: '确定',
          success: (result) => {
            if (result.confirm) {
              wx.navigateTo({
                // url: '/sub1/pages/creditStationPerson/index', // 旧版入口
                url: '/sub4/pages/rcrz/apply', // 新版入口
              });
            }
          },
          fail: () => {},
          complete: () => {},
        });
      } else {
        wx.showModal({
          title: '',
          content: error.message || err,
          showCancel: false,
          confirmText: '确定',
          success: (result) => {
            if (result.confirm) {
            }
          },
          fail: () => {},
          complete: () => {},
        });
      }
    }
  },
});
