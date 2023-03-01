// sub2/pages/kingsley/index.js
var app = getApp();
const api = require('../../../utils/api');
import user from '../../../utils/user';
var encr = require('../../utils/encrypt.js'); //国密3段式加密
var aeskey = encr.key //随机数
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    CDNURL: app.globalData.CDNURL + '/static/wechat/img/yan/',
    nick: '', //授权昵称
    avatar: '', //授权头像
    wechat: "", //本详情页二维码
    bg: "yan_share_poster.png", //图片背景图
    maskHidden: true, //控制遮罩层
    imagePath: "", //存放canvas生成的图片
    canvasId: 'mycanvas',
    qrcodeUrl: '',
    shareBox: "shareBox",
    preffixUrl: app.globalData.URL,
    previewI: true,
    empNo: '',
    int_id: '',
    windowHeight: "",
    shareIntId: '',
    shareEmpNo: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    
    if (options.scene) {
      var scene = decodeURIComponent(options.scene);
      let str = scene

      that.setData({
        shareIntId: str.split("a")[0],
        shareEmpNo: str.split("a")[2]
      })
    }

    if (options.empNo) {
        that.setData({
          shareEmpNo: options.empNo
        })
      }
      if (options.intId) {
        that.setData({
          shareIntId: options.intId
        })
      }
      
    wx.getSystemInfo({
      success(res) {
        that.setData({
          windowHeight: res.windowHeight + 170
        })
      }
    })
    api.getSystemInfo2(750, 1246, 1.3).then(res => {
      this.setData({
        posterBoxHeight: res.posterBoxHeight,
        posterBoxWidth: res.posterBoxWidth,
        unit: res.unit,
        screenWidth: res.systemInfo.screenWidth,
      });
    });
    user.getCustomerInfo().then(res => {
        let empNo = res.USERID ? res.USERID : "";
        let int_id = res.INT_ID ? res.INT_ID : "";
        that.setData({
          customerInfo: res,
          empNo,
          int_id
        });
      })
      .catch(err => {});
      this.setData({
        showApply: !(options.type && options.type === 'share'),
      });
  },
  share() {
    if (!that.data.previewI) {
      return;
    }
    wx.showLoading({
      title: '生成中',
    })
    this.setData({
      previewI: false
    })
    setTimeout(() => {
      that.setData({
        previewI: true
      })
    }, 1500);
    wx.getImageInfo({
      src: that.data.CDNURL + that.data.bg,
      success(res) {
        that.setData({
          newbg: res.path
        })
        if (that.data.qrcodeUrl != '') {
          that.createNewImg();
          return;
        }
        api.generateMiniCode('sub2/pages/kingsley/index', that.data.empNo).then(res => {
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
  },
  //取消分享
  showHide: function () {
    that.setData({
      shareBox: "shareBox",
    })
  },
  //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
  createNewImg: function () {


    const width = that.data.posterBoxWidth;
    const height = that.data.posterBoxHeight;
    const unit = that.data.unit;

    var context = wx.createCanvasContext('mycanvas');


    var path = that.data.newbg;
    context.drawImage(path, 0, 0, width, height); //背景绘制
    context.drawImage(that.data.qrcodeUrl, 290 * unit, 950 * unit, 170 * unit, 170 * unit); //小程序码

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
          that.setData({
            shareBox: "shareBox on",
            canvasHidden: true
          })

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
  getCustomers() {


    return new Promise((resolve, reject) => {

      var dataJson = JSON.stringify({
        openId: wx.getStorageSync('openid')
      })
      var custname = encr.jiami(dataJson, aeskey) //3段加密
      wx.request({
        url: app.globalData.YTURL + 'jsyh/getCustomers.do',
        data: encr.gwRequest(custname),
        method: 'POST',
        header: {
          'content-type': 'application/json', // 默认值
        },
        success: function (res) {

          if (res.data.body != undefined && Object.getOwnPropertyNames(res.data.body) != 0) {
            
            var jsonData = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文
           
            if (jsonData.LIST == undefined || jsonData.LIST[0].TEL === '' ||
              jsonData.LIST[0].TEL == undefined) {
              reject()
              wx.showModal({
                title: '提示',
                content: '手机号未注册，去注册',
                success(res) {
                  if (res.confirm) {
                    wx.navigateTo({
                      url: '/sub1/pages/auth/index'
                    })
                  } else if (res.cancel) {}
                }
              })

            } else if (jsonData.LIST[0].ID_CARD === '' ||
              jsonData.LIST[0].ID_CARD == undefined || jsonData.LIST[0].REAL_NAME === '' ||
              jsonData.LIST[0].REAL_NAME == undefined) {
              reject()
              wx.showModal({
                title: '提示',
                content: '身份信息未认证，去认证',
                success(res) {
                  if (res.confirm) {
                    wx.navigateTo({
                      url: '/sub1/pages/info/identify'
                    })
                  } else if (res.cancel) {}
                }
              })
            } else {
              
      user.getIdentityInfo().then(res=>{
        resolve(jsonData.LIST[0])

      }).catch(err=>{
        reject()
        wx.showModal({
          title: '提示',
          content: '身份信息未认证，去认证',
          success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/sub1/pages/info/identify'
              })
            } else if (res.cancel) {}
          }
        })        
      })
            }
          } else {
            reject()
            wx.showToast({
              title: res.data.head.H_MSG,
              icon: 'none',
              duration: 5000
            })
          }
        },
        fail: function (res) {
          reject()
          wx.showToast({
            title: '网络错误',
            icon: 'none',
            duration: 5000
          })

        }
      })
    })
  },
  goTo() {
    that.getCustomers().then(res => {
      let cardEnd = res.VALID_DATE.replace('-','').replace(/[.]/g,"").substr(8)
      //判断是否有特殊字符进行转换
      let seesionId = wx.getStorageSync("sessionid").replace(/\+/g,'SID1').replace(/\=/g,'SID2').replace(/\-/g,'SID3').replace(/\//g,'SID4');
      let seesionKey = wx.getStorageSync("key").replace(/\&/g,'SKEY1');
      //跳转烟商贷h5，分享信息有则携带跳转
      //测试环境
      //let url = "https://wxapptest.jsbchina.cn:9629/kingsleyOnline/home?id="+ seesionId + '&key=' + seesionKey +'&cardEnd='+cardEnd +'&openid='+wx.getStorageSync('openid')+'&shareopenid='+app.globalData.share_person+'&shareid='+app.globalData.shareID+'&shareempno='+that.data.shareEmpNo;
       //生产环境
       let url = "https://openservice.jsbchina.cn/kingsleyOnline/home?id="+ seesionId + '&key=' + seesionKey +'&cardEnd='+cardEnd +'&openid='+wx.getStorageSync('openid')+'&shareopenid='+app.globalData.share_person+'&shareid='+app.globalData.shareID+'&shareempno='+that.data.shareEmpNo;
      wx.navigateTo({
      url: "/pages/showWeb/showWeb?skipUrl=" + encodeURIComponent(url),
    });

      // var dataJson = JSON.stringify({
      //   intid: that.data.shareIntId,
      //   platformUserId: that.data.shareEmpNo,
      //   SHARE_ID: app.globalData.shareID,
      //   apply_open_id: wx.getStorageSync('openid'),
      //   idCard: res.ID_CARD,
      // })
      // var custnameTwo = encr.jiami(dataJson, aeskey)
      // wx.request({
      //   url: app.globalData.YTURL + 'jsyh/ysdApply.do',
      //   data: encr.gwRequest(custnameTwo),
      //   method: 'POST',
      //   header: {
      //     'content-type': 'application/json', // 默认值
      //   },
      //   success: function (res) {
      //     if (res.data.body != undefined && Object.getOwnPropertyNames(res.data.body) != 0 && res.data.head.H_STATUS == '1') {
      //       var jsonData = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文
    
      //     } else {
      //       wx.showToast({
      //         title: res.data.head.H_MSG,
      //         icon: 'none',
      //         duration: 5000
      //       })
      //     }

      //   }
      // })


    })

    
  },
  

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let imagePath = that.data.CDNURL + that.data.bg;
    if (that.data.imagePath) {
      imagePath = that.data.imagePath;
    }
    let params = '&empNo=' + that.data.empNo + '&intId=' + that.data.int_id;
    return api.shareApp(imagePath, params);
  }
})