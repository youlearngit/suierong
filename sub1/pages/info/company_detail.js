// sub1/pages/info/company_detail.js
import WxValidate from '../../../assets/plugins/wx-validate/WxValidate';
var citys = require('../../../pages/public/city.js');
var util = require('../../../utils/util.js');
import requestP from '../../../utils/requsetP';
var QQMapWX = require('../../../assets/plugins/qqmap-wx-jssdk1.2/qqmap-wx-jssdk.js');
var qqmapsdk;
const App = getApp();
const date = new Date();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    companyInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      companyInfo: JSON.parse(options.companyInfo),
    });
  },

  deleteOrg(e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认删除该企业信息',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      success: (result) => {
        if (result.confirm) {
          return requestP({
            url: App.globalData.URL + 'deleteOrgCard',
            data: {
              ORG_ID: that.data.companyInfo.ORG_ID,
            },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded',
              key: Date.parse(new Date()).toString().substring(0, 6),
            },
            method: 'POST',
          })
            .then((res) => {
              if (res.code == '1') {
                wx.showToast({
                  title: '删除成功',
                  icon: 'none',
                  image: '',
                  duration: 1500,
                  mask: true,
                  success: (result) => {
                    setTimeout(() => {
                      wx.navigateBack({
                        delta: 1,
                      });
                    }, 1500);
                  },
                });
              }
            })
            .catch((err) => {
              console.error('删除房产信息失败:', err);
            });
        }
      },
    });
  },
});
