import { getSalaryList, getSalaryCode } from './api';
import User from '../../../utils/user';
import api from '../../../utils/api';
import Dialog from '../../../sub3/static/vant/weapp/dialog/dialog';
import Toast from '../../../sub3/static/vant/weapp/toast/toast';
var app = getApp();

Page({
  data: {
    cndUrl: app.globalData.CDNURL,
    showCalendarBox: true,
    showPhoneButton: false,
    currentYear: new Date().getFullYear(),
    tel: '',
    salaryList: [],
  },

  async onLoad(o) {
    if (o.tel) {
      this.setData({
        tel: o.tel,
      });
    }
  },

  async onShow() {
    if (this.data.tel && this.data.salaryList.length === 0) {
      this.getSalaryList();
      return;
    }
    if (wx.getStorageSync('openid') == '') {
      await api.getSessionInfo();
    }
    const userInfo = await User.getCustomerInfo();
    // userInfo.TEL = null;
    if (!userInfo.TEL) {
      this.setData({
        showPhoneButton: true,
      });
      return;
    }
    this.setData({
    //tel: '18505659599' ,
      tel:  userInfo.TEL, 
    });
    await this.getSalaryList();
  },

  async getphonenumber(e) {
    try {
      const tel = await api.getPhoneNumber(e);
      this.setData({
        tel,
      });
    } catch (err) {
      if (err.code === '1010' || err.code === '1000' || err.code === '1001') {
        Dialog.alert({
          title: '提示',
          message: err.msg,
        }).then(() => {
          wx.navigateTo({
            url: '/sub1/pages/auth/index',
          });
        });
      } else {
        Dialog.alert({
          title: '提示',
          message: err.message || err.msg || err,
        }).then(() => {
          this.setData({
            showPhoneButton: true,
          });
        });
      }
    }
  },

  getSalaryDetail(e) {
    console.log(e);
    const skipUrl = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: '/pages/showWeb/showWeb?skipUrl=' + encodeURIComponent(skipUrl),
    });
  },

  async getSalaryList() {
    Toast.loading({
      message: '加载中...',
      forbidClick: true,
    });
    try {
      const res = await getSalaryList(this.data.currentYear + '', this.data.tel);
      //console.log(res);
      if (res.RSPTB1 === '1') {
        let salaryList = JSON.parse(res.data);
        if (salaryList.length === 0) {
          this.setData({
            salaryList: [],
          });
          Dialog.alert({
            title: '提示',
            message: '未查到工资条信息',
          }).then(() => {});
          return;
        }
        salaryList = salaryList.map((e) => {
          console.log(e.mONTH.split('-')[1] / 1);
          e.mounth = e.mONTH.split('-')[1] / 1;
          return e;
        });

        salaryList.sort((a, b) => {
          return b.mounth - a.mounth;
        });
        this.setData({
          salaryList,
        });
      } else {
        Dialog.confirm({
          title: '提示',
          message: '暂无权限，是否前往注册页面',
        })
          .then(() => {
            const skipUrl = 'https://qygj.jsbchina.cn/mxcp/index.html#/register';
            // const skipUrl = 'https://qygj-test.jsbchina.cn/mxcp/index.html#/register';
            wx.navigateTo({
              url: '/pages/showWeb/showWeb?skipUrl=' + encodeURIComponent(skipUrl),
            });
          })
          .catch(() => {
            wx.switchTab({
              url: '/pages/shop/index2',
            });
          });
      }
    } catch (err) {
      Dialog.alert({
        title: '提示',
        message: err.message || err,
      }).then(() => {
        wx.switchTab({
          url: '/pages/shop/index2',
        });
      });
    } finally {
      Toast.clear();
    }
  },

  onClose() {
    this.setData({
      showPhoneButton: false,
    });
  },

  chooseYear(e) {
    this.setData({
      currentYear: e.detail.value,
    });
    this.getSalaryList();
  },
});
