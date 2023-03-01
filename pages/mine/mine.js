import user from '../../utils/user';
import emp from '../../utils/Emp';
import util from '../../utils/util.js';

const app = getApp();
const date = new Date();
var myPerformance = require('../../utils/performance.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    preffixUrl: app.globalData.URL,
    cndUrl: app.globalData.CDNURL,
    day: date.getDate(),
    week: date.getDay(),
    month: '',
    jitang: '',
    hasUserInfo: false,
    showEmpModules: false,
    months: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
    customerInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.userInfo);
    myPerformance.reportBegin(2004, 'mine_mine');
    this.setData({
      month: this.data.months[date.getMonth()],
    });
    this.getSoup();
    myPerformance.reportEnd(2004, 'mine_mine');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;

    user.getCustomerInfo().then((res) => {
      let customerInfo = res;
      user.ifAuthUserInfo().then((res) => {
        that.setData({
          hasUserInfo: res,
          customerInfo,
          showEmpModules: customerInfo.USERID && res ? true : false,
          'customerInfo.PHOTO': customerInfo.PHOTO,
          'customerInfo.NICK_NAME': customerInfo.NICK_NAME,
        });
      });
    });
  },

  getSoup() {
    var that = this;
    wx.request({
      url: app.globalData.URL + 'getSoup',
      header: {
        'content-type': 'application/json', // 默认值
        key: Date.parse(new Date()).toString().substring(0, 6),
      },
      success: (res) => {
        that.setData({
          jitang: res.data.CONTENT,
        });
      },
    });
  },

  /**
   * 获取名片信息
   */
  getCardInfo() {
    var that = this;
    emp
      .getCardInfoByEmp(that.data.customerInfo.USERID)
      .then(() => {
        wx.navigateTo({
          url: '/sub1/pages/shop/index?empNo=' + that.data.customerInfo.USERID,
        });
      })
      .catch((err) => {
        if (err === 'unGetCardByEmp') {
          wx.showModal({
            title: '提示',
            content: '未查询到个人名片信息,请前往工作平台编辑',
            showCancel: false,
          });
        }
      });
  },

  async toDevOfficer() {
    wx.showLoading({
      title: '跳转中',
      mask: true,
    });
    try {
      let customerInfo = this.data.customerInfo,
        empInfo = {};
      console.log(customerInfo.USERID);
      if (customerInfo.USERID) {
        empInfo = await emp.getCardInfoByEmp(customerInfo.USERID);
      }
      console.log('empInfo', empInfo);
      customerInfo = Object.assign(customerInfo, empInfo);
      console.log('customerInfo', customerInfo);
      customerInfo.RMNG_BEAN = customerInfo.RMNG_BEAN || 0;
      customerInfo.AMT_BEAN = customerInfo.AMT_BEAN || 0;
      wx.hideLoading();
      wx.navigateTo({
        url: '/sub3/pages/recommendationInvitation/recommendationInvitation'
      })
    } catch (error) {
      console.log(error);
      wx.hideLoading();
      if (error === 'unGetCardByEmp') {
        wx.showModal({
          title: '提示',
          content: '未查询到个人名片信息,请前往工作平台编辑',
          showCancel: false,
        });
      }
    }
    // url="/sub3/pages/recommend/index?empNo={{customerInfo.USERID||''}}"
  },

  async toRecommend() {
    wx.showLoading({
      title: '跳转中',
      mask: true,
    });
    try {
      let customerInfo = this.data.customerInfo,
        empInfo = {};
      console.log(customerInfo.USERID);
      if (customerInfo.USERID) {
        empInfo = await emp.getCardInfoByEmp(customerInfo.USERID);
      }
      console.log('empInfo', empInfo);
      customerInfo = Object.assign(customerInfo, empInfo);
      console.log('customerInfo', customerInfo);
      customerInfo.RMNG_BEAN = customerInfo.RMNG_BEAN || 0;
      customerInfo.AMT_BEAN = customerInfo.AMT_BEAN || 0;
      wx.hideLoading();
      wx.navigateTo({
        url: `/sub3/pages/recommend/index?customerInfo= ${encodeURIComponent(JSON.stringify(customerInfo))}`,
      });
    } catch (error) {
      console.log(error);
      wx.hideLoading();
      if (error === 'unGetCardByEmp') {
        wx.showModal({
          title: '提示',
          content: '未查询到个人名片信息,请前往工作平台编辑',
          showCancel: false,
        });
      }
    }
    // url="/sub3/pages/recommend/index?empNo={{customerInfo.USERID||''}}"
  },
  getUserInfo(){
    wx.navigateTo({
      url: '/pages/mine/getInfo',
    })
  },
  getUserInfo1() {
    var that = this;
    wx.getUserProfile({
      desc: '获取用户信息',
      success: (res) => {
        let userInfo = res.userInfo;
        app.globalData.userInfo = JSON.parse(JSON.stringify(userInfo));
        this.setData({
          showEmpModules: this.data.customerInfo.USERID ? true : false,
          hasUserInfo: true,
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
                  that.setData({
                    'customerInfo.PHOTO': userInfo.avatarUrl,
                    'customerInfo.NICK_NAME': userInfo.nickName,
                  });
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

  scanCode() {
    wx.scanCode({
      success(res) {
        console.log(res);
      },
    });
  },
});
