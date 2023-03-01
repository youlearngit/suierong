const app = getApp();
var util = require('../../../utils/util.js');
import requestYT from '../../../api/requestYT';
import user from '../../../utils/user';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    preffixUrl: '',
    cndUrl: '',
    queryResult: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.setData({
      preffixUrl: app.globalData.URL,
      cndUrl: app.globalData.CDNURL
    });
    wx.showLoading({
      title: '加载中...',
      mask:true
    });
    var that = this;
    that.userInfo();
    that.getInfo();
  },

  getInfo() {
    var that = this;
    let options = {
      url: 'smoke/marketMessage.do',
      data: JSON.stringify({
        openId: wx.getStorageSync('openid')
      }),
    };
    requestYT(options).then(res=>{
      if(res.STATUS == 1 && res.LIST){
        console.log('奖励信息', res.LIST);
        res.LIST.push({
          over:true
        });
        wx.hideLoading();
        that.setData({
          queryResult:res.LIST
        })
      }else{
        wx.hideLoading()
      }
    }).catch(err=>{
      wx.hideLoading();
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.hideToast();
    // if (wx.getStorageSync('openid') == null || wx.getStorageSync('openid') == '') {
    //   wx.login({
    //     success: (res) => {
    //       util.openid(res.code, app.globalData.URL);
    //     },
    //   });
    // } else {
    //   wx.request({
    //     url: app.globalData.URL + 'existkey',
    //     data: {
    //       sessionId: wx.getStorageSync('sessionid'),
    //     },
    //     method: 'POST',
    //     header: {
    //       'Content-Type': 'application/x-www-form-urlencoded',
    //       key: Date.parse(new Date()).toString().substring(0, 6),
    //     },
    //     success(res) {
    //       if (res.data == undefined || res.data != true) {
    //         wx.login({
    //           success: (res) => {
    //             util.openid(res.code, app.globalData.URL);
    //           },
    //         });
    //       }
    //     },
    //     fail() {
    //       wx.showToast({
    //         title: '网络异常',
    //         icon: 'none',
    //         duration: 2000,
    //       });
    //     },
    //   });
    // }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  getUserInfo() {
    var that = this;
    wx.getUserProfile({
      desc: '获取用户信息',
      success: (res) => {
        let userInfo = res.userInfo;
        app.globalData.userInfo = JSON.parse(JSON.stringify(userInfo));
        this.setData({
          hasUserInfo: true,
          userInfo: app.globalData.userInfo,
        });
        if (wx.getStorageSync('openid') != null) {
          wx.downloadFile({
            url: userInfo.avatarUrl,
            success: function (temp) {
              wx.getFileSystemManager().readFile({
                filePath: temp.tempFilePath,
                encoding: 'base64',
                success: (file) => {
                  userInfo.avatarUrl = 'data:image/png;base64,' + file.data;
                  user
                    .addWXUserInfo(userInfo)
                    .then(() => {
                      that.setData({
                        loginFlag: true,
                      });
                      wx.showToast({
                        title: '登录成功',
                        icon: 'success',
                        mask: true,
                        duration: 2000,
                      });
                    })
                    .catch((err) => {
                      console.log('123123', err);
                    });
                  return;
                },
              });
            },
          });
        }
      },
      fail(err) {},
      complete(res) {},
    });
  },
  userInfo: function () {
    console.log(1);
    user.ifAuthUserInfo().then((res) => {
      console.log(res);
      if (res) {
        this.setData({
          hasUserInfo: true,
          userInfo: app.globalData.userInfo,
        });
      }
    });
  },
});
