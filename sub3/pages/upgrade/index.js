// sub3/pages/upgrade/index.js
import util from '../../../utils/util';
import requestP from '../../../utils/requsetP';
import WxValidate from '../../../assets/plugins/wx-validate/WxValidate';
import api from '../../../utils/api';
import user from '../../../utils/user';
import emp from '../../../utils/Emp';
import encr from '../../../utils/encrypt/encrypt.js';
import log from '../../../log.js';
import Org from '../../../api/Org';
import requestYT from '../../../api/requestYT';
import Order from '../../../api/Order';
import User from '../../../utils/user';

var app = getApp();

Page({
  /**
   * Page initial data
   */
  data: {
    cndUrl: app.globalData.CDNURL,

    showBaseEnter: false,
    enterpriseCardInfo: [],
    enterpriseAdded: [],
    showBaseEnter: false,
    enterpriseInfo: {},
    customerInfo: {},
  },

  onLoad: function (options) {},
  onShow() {
    User.getIdentityInfo()
      .then((customerInfo) => {
        this.setData({
          customerInfo,
        });
      })
      .catch((err) => {
        console.log(err);
        if (err === 'unSelectIdcard') {
          wx.showModal({
            title: '提示',
            content: '请先完成身份认证',
            showCancel: false,
            confirmText: '确定',
            success: (result) => {
              if (result.confirm) {
                wx.redirectTo({
                  url: '/sub1/pages/auth/index',
                });
              }
            },
          });
        } else {
          wx.showModal({
            title: '提示',
            content: err.message || err,
            showCancel: false,
            confirmText: '确定',
            success: (result) => {
              if (result.confirm) {
                wx.navigateBack({
                  delta: 1,
                });
              }
            },
          });
        }
      });
  },

  showBaseEnter(e) {
    var that = this;
    if (e.detail.value.length == '') {
      Org.getLocalEnterpriseList(null, '14').then((res) => {
        that.setData({
          enterpriseCardInfo: res,
          enterpriseAdded: res,
        });
      });
    }
    this.setData({
      showBaseEnter: true,
    });
  },

  searchEnter(e) {
    console.log(1);
    this.setData({
      'enterpriseInfo.orgCode': '',
    });
    console.log(e.detail.value);
    if (e.detail.value.length >= 4 && /^[\u4E00-\u9FA5-（）()]{4,50}$/.test(e.detail.value)) {
      Org.getEnterpriseList(e.detail.value)
        .then((enterpriseCardInfo) => {
          this.setData({
            enterpriseCardInfo,
          });
        })
        .catch((err) => {});
    }
  },

  /**
   * 选中企业
   * @param {*} e
   */
  async chooseEnter(e) {
    var that = this;
    wx.showLoading({
      title: '加载中 ',
      mask: true,
    });
    let index = e.currentTarget.dataset.index;
    let companyName = that.data.enterpriseCardInfo[index].ORG_NAME;

    Org.getEnterpriseInfo({
      type: '1',
      companyName,
    })
      .then((res) => {
        console.log('授权人身份校验结果', res);
        if (!res.enterpriseInfo) {
          wx.showToast({
            title: '未查询到相关企业信息',
            icon: 'none',
          });
          return;
        }

        if (!(res.enterpriseInfo.eNTNAME && res.enterpriseInfo.cREDITCODE)) {
          wx.showToast({
            title: '企业信息异常',
            icon: 'none',
          });
          return;
        }

        that.setData({
          enterpriseInfo: {
            orgName: res.enterpriseInfo.eNTNAME,
            orgCode: res.enterpriseInfo.cREDITCODE,
          },
        });
        that.setData({
          showBaseEnter: false,
        });
        wx.hideLoading();
      })
      .catch((err) => {
        wx.hideLoading();
      });
  },

  async confirm() {
    let { enterpriseInfo, customerInfo } = this.data;
    if (!enterpriseInfo.orgCode) {
      wx.showModal({
        title: '提示',
        content: '请选择企业',
        showCancel: false,
        confirmText: '确定',
        confirmColor: '#5A84F7',
      });
      return;
    }

    try {
      let options = {
        url: 'sui/transferCustomer.do',
        data: JSON.stringify({
          unifyCode: enterpriseInfo.orgCode,
          idcardno: customerInfo.ID_NUMBER,
        }),
      };
      const res = await requestYT(options);
      console.log(options.url, res);
      if (res.STATUS === '1' && res.resultCode === '0000') {
        wx.showModal({
          title: '提示',
          content: '升级成功',
          showCancel: false,
          confirmText: '确定',
          confirmColor: '#5A84F7',
        });
        return;
      }
      throw new Error(res.resultMsg);
    } catch (error) {
      wx.showModal({
        title: '提示',
        content: error.message || error,
        showCancel: false,
        confirmText: '确定',
        confirmColor: '#5A84F7',
      });
    }
  },

  onShareAppMessage: function () {
    return api.shareApp('', '', '随e贷线上化升级');
  },
});
