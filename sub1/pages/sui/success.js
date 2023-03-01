import requestP from '../../../utils/requsetP';
import log from '../../../log.js';
import Order from '../../../api/Order';
import requestYT from '../../../api/requestYT';

var app = getApp();

Page({
  data: {
    result: {},
    enterpriseInfo: {},
    sedId: '',
    orderNo: '',
    page: '',
    ifSubmit: false,
    preffixUrl: app.globalData.URL,
    cndUrl: app.globalData.CDNURL,
  },

  onLoad(options) {
    if (options.type) {
      this.setData({
        type: 18,
      });
    }
    if (options.params) {
      let result = decodeURIComponent(options.params);
      result = JSON.parse(result);
      result.amount = parseInt(parseInt(result.amount));
      this.setData({
        result,
      });
    }

    let enterpriseInfo = {};
    if (options.enterpriseInfo) {
      enterpriseInfo = decodeURIComponent(options.enterpriseInfo);
      enterpriseInfo = JSON.parse(enterpriseInfo);
    }

    if (typeof options.sedId == 'undefined') {
      options.sedId = '';
    }

    this.setData({
      enterpriseInfo,
      sedId: options.sedId,
      orderNo: options.orderNo,
      page: options.page,
    });

    if (options.page == 'msg') {
      this.getOrderInfo(options.orderNo);
    }
  },

  /**
   * 查询订单信息
   * @param {} orderNo
   */
  getOrderInfo(orderNo) {
    var that = this;

    Order.getApplyByOrderNo(orderNo).then((res) => {
      console.log(res);
      let data = res;
      let state = data.SHOW_STATE;
      if (state == '5') {
        that.setData({
          page: 'result',
        });
      }
      let orderNo = data.ORDER_NO;
      let sedId = data.A_ID;
      let result = {};
      if (data.MEASURE_TIME) {
        result.amount = data.AMOUNT;
        result.rateRealYear = data.RATEREALYEAR;
        result.terms = data.TERMS;
        result.tranDateTime = that.formateDate(data.MEASURE_TIME);
      }

      let applyInfo = JSON.parse(data.WDGL1661_REQ);
      let enterpriseInfo = {};
      enterpriseInfo.ORG_NAME = applyInfo.companyName;
      enterpriseInfo.ORG_CODE = applyInfo.creCompanyNo;
      enterpriseInfo.ARTIFICIAL_NAME = applyInfo.applyName;

      that.setData({
        enterpriseInfo,
        orderNo,
        sedId,
        state,
        result,
      });
    });
  },

  confirm() {
    var that = this;
    if (that.data.ifSubmit) {
      wx.showToast({
        title: '请勿重复提交',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
      });
      return;
    } else {
      that.setData({
        ifSubmit: true,
      });
    }

    var pages = getCurrentPages();
    var prepage = pages[pages.length - 2];
    log.setFilterMsg(that.data.orderNo);

    if (prepage && prepage.route) {
      log.info(prepage.route);
    } else {
      log.info('订阅通知进入');
    }

    wx.showLoading({
      title: '请等待',
      mask: true,
      duration: 60000,
    });

    if (that.data.type == '18') {
      let options = {
        // url: 'jsyh/confirmYSDQuota.do',
        url: 'jsyh/mconfirm.do',
        data: JSON.stringify({
          orderNo: that.data.orderNo,
          operationType: '0',
          resvFld1: '',
          resvFld2: '',
          resvFld3: '',
          resvFld4: '',
          resvFld5: '',
        }),
      };

      requestYT(options)
        .then((res) => {
          wx.hideLoading();
          //   console.log('1664',res)
          if (res.resultCode == '0000') {
            wx.showModal({
              title: '提示',
              content: '确认额度成功',
              showCancel: false,
              confirmText: '确定',
              success: (result) => {
                if (result.confirm) {
                  wx.reLaunch({
                    url: '/pages/shop/index2',
                  });
                }
              },
            });
          } else {
            wx.showModal({
              title: '提示',
              content: '确认额度失败,' + res.resultMsg,
              showCancel: true,
              confirmText: '确定',
              success: (result) => {
                if (result.confirm) {
                  wx.reLaunch({
                    url: '/pages/shop/index2',
                  });
                }
              },
            });
          }
        })
        .catch((err) => {
          wx.hideLoading();
          wx.showModal({
            title: '提示',
            content: '确认额度失败,' + res,
            showCancel: true,
            confirmText: '确定',
            success: (result) => {
              if (result.confirm) {
              }
            },
          });
        });
      return;
    }

    let params = {
      req64: {
        orderNo: that.data.orderNo,
        operationType: '0',
        resvFld1: 'test',
      },
    };
    log.setFilterMsg(that.data.orderNo);
    log.info('64提交' + new Date().toString() + ',订单号:' + that.data.orderNo);


    Order.confirmLoanAmount(that.data.orderNo).then(() => {
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: '确认额度成功',
          showCancel: false,
          confirmText: '确定',
          success: result => {
            if (result.confirm) {
              wx.reLaunch({
                url: '/pages/shop/index2',
              });
            }
          },
        });
      }).catch(err=> {
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content:`确认额度失败,${err.message||err}`,
          showCancel: true,
          confirmText: '确定',
        });
      });


      return 

    requestP({
      url: app.globalData.URL + 'sed/confirmQuota',
      data: JSON.stringify(params),
      header: {
        'Content-Type': 'application/json',
        key: Date.parse(new Date()).toString().substring(0, 6),
        sessionId: wx.getStorageSync('sessionid'),
      },
      method: 'POST',
    })
      .then((res1) => {
        let res = res1.res64;
        if (res1.code == '-4') {
          wx.showToast({
            title: '您已确认额度,请勿重复提交',
            icon: 'none',
            duration: 1500,
            mask: true,
          });
        } else {
          if (res.resultCode == '0000') {
            wx.showModal({
              title: '提示',
              content: '确认额度成功',
              showCancel: false,
              confirmText: '确定',
              success: (result) => {
                if (result.confirm) {
                  wx.reLaunch({
                    url: '/pages/shop/index2',
                  });
                }
              },
            });
          } else {
            wx.hideLoading();
            wx.showModal({
              title: '提示',
              content: '确认额度失败,' + res,
              showCancel: true,
              confirmText: '确定',
              success: (result) => {
                if (result.confirm) {
                }
              },
            });
          }
        }
      })
      .catch((err) => {
        wx.hideLoading();
        // console.error("确认额度失败:", err);
      });
  },

  formateDate(date) {
    return (
      date.substring(0, 4) +
      '-' +
      date.substring(4, 6) +
      '-' +
      date.substring(6, 8) +
      '  ' +
      date.substring(8, 10) +
      ':' +
      date.substring(10, 12) +
      ':' +
      date.substring(12, 14)
    );
  },
});
