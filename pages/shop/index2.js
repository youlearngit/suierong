import api from '../../utils/api';
import Chat from '../../api/Chat.js';
import Emp from '../../utils/Emp';
import Config from '../../api/Config';
import { getSalaryCode } from '../../api/salary';
import User from '../../utils/user';

const chat = new Chat();
var app = getApp();
Page({
  data: {
    preffixUrl: app.globalData.URL,
    cndUrl: app.globalData.CDNURL,
    CustomBar: app.globalData.CustomBar + 24,
    showRecentChat: false,
    contactInfo: {},
    showChatComponent: false,
    showBless: false,
  },

  onLoad: function (o) {
    Config.getFundConfig()
      .then((fundConfig) => {
        this.setData({
          fundConfig,
        });
      })
      .catch((err) => {});
  },

  onShow() {
    var that = this;

    /**新春祝福展示 */
    let date = new Date();
    let d =
      date.getFullYear() +
      '-' +
      (date.getMonth() + 1) +
      '-' +
      date.getDate() +
      ' ' +
      date.getHours() +
      ':' +
      date.getMinutes();
    let startTime = new Date('2023-1-18 0:00'.replace(/-/g, '/')).getTime();
    let endTime = new Date('2023-2-06 0:00'.replace(/-/g, '/')).getTime();
    let nowTime = new Date(d.replace(/-/g, '/')).getTime();
    console.log();
    if (nowTime > startTime && nowTime < endTime) {
      that.setData({
        showBless: true,
      });
    } else {
      that.setData({
        showBless: false,
      });
    }

    // api.getLocation().then(() => {
    //   this.setData({
    //     showChatComponent: app.globalData.showChatComponent,
    //   });
    // });

    this.initOnloadData();
  },

  async toXX() {
    wx.showLoading({
      title: '跳转中',
      mask: true,
    });
    try {
      const userInfo = await User.getCustomerInfo();
      console.log(userInfo);

      if (!userInfo.REAL_NAME || !userInfo.TEL) {
        wx.showModal({
          title: '提示',
          content: '请先完成身份认证',
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
        return;
      }

      if (!userInfo.USERID) {
        wx.showToast({
          title: '暂只支持行员进入',
          icon: 'none',
        });
        return;
      }

      wx.navigateToMiniProgram({
        appId: 'wxb7900801fb32390b',
        path: `pages/index/main?INVITER_NAME=${userInfo.REAL_NAME}&INVITER_PHONE=${userInfo.TEL}&INVITER_ID=${userInfo.USERID}`,
        extraData: {
          INVITER_NAME: userInfo.REAL_NAME,
          INVITER_PHONE: userInfo.TEL,
          INVITER_ID: userInfo.USERID,
        },
        envVersion: 'release', //release trial develop
        success(res) {
          console.log('success', res);
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      wx.hideLoading();
    }
  },

  /**
   * 小程序智能人事跳转获取code
   */
  async getCode() {
    wx.showLoading({
      title: '跳转中',
      mask: true,
    });

    try {
      const userInfo = await User.getCustomerInfo();
      console.log(userInfo);

      if (!userInfo.TEL) {
        wx.navigateTo({
          url: '/sub1/pages/auth/index',
        });
        return;
      }

      const res = await getSalaryCode(userInfo.TEL);
      console.log(res);
      let skipUrl = '';
      if (res.flag === '1') {
         skipUrl = `https://qygj.jsbchina.cn/mxcp/index.html#/Home?CODE=${res.data}&CHNL_TYPE=wxmp`;
        //skipUrl = `https://qygj-test.jsbchina.cn/mxcp/index.html#/HrMain?CODE=${res.data}&CHNL_TYPE=wxmp`;
        console.log(skipUrl);
        wx.navigateTo({
          url: '/pages/showWeb/showWeb?skipUrl=' + encodeURIComponent(skipUrl),
        });
      } else {
        wx.showModal({
          title: '提示',
          content: '暂无权限，是否前往注册页面',
          showCancel: true,
          cancelText: '取消',
          cancelColor: '#000000',
          confirmText: '确定',
          success: (result) => {
            if (result.confirm) {
               skipUrl = 'https://qygj.jsbchina.cn/mxcp/index.html#/register';
               // skipUrl = 'https://qygj-test.jsbchina.cn/mxcp/index.html#/register';
              wx.navigateTo({
                url: '/pages/showWeb/showWeb?skipUrl=' + encodeURIComponent(skipUrl),
              });
            }
          },
          fail: () => {},
          complete: () => {},
        });
      }
    } catch (error) {
    } finally {
      wx.hideLoading();
    }
  },

  initOnloadData() {
    var that = this;
    //获取最近联系人
    chat
      .getRecentContact()
      .then((res) => {
        let empNo = res.LIST[0].managerNo;
        that.setData({
          'contactInfo.empNo': empNo,
        });
        return Emp.getCardInfo(empNo);
        //查询员工信息
      })
      .then((res) => {
        that.setData({
          contactInfo: Object.assign(that.data.contactInfo, res),
          showRecentChat: true,
        });
      })
      .catch((err) => {
        // console.log(err);
      });
  },

  call() {
    api.call('123123');
  },

  onShareAppMessage() {
    let imagePath = this.data.preffixUrl + '/static/wechat/img/sui/sui-1021.png';
    return api.shareApp(imagePath);
  },
  jumpToSkipurl(){
     let skipUrl = 'https://app.jsbchina.cn/file/upload/app/imagesLinks/20220607192624472.html';
     wx.navigateTo({
      url: '/pages/showWeb/showWeb?skipUrl=' + encodeURIComponent(skipUrl),
    });
    },
    greenCredit() {

    }
});
