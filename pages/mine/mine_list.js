var util = require('../../utils/util.js');
import requestP from '../../utils/requsetP';
import encr from '../../utils/encrypt/encrypt.js'; //国密3段式加密
import Order from '../../api/Order';

var aeskey = encr.key;
const App = getApp();
var myPerformance = require('../../utils/performance.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    apply: [],
    preffixUrl: '',
    showNon: false,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    page: 1,
    pageSize: 5,
    pageTips: '上拉加载更多',
    cndUrl: App.globalData.CDNURL,
    TimeID: -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    myPerformance.reportBegin(2007, 'mine_mine_list');
    this.setData({
      preffixUrl: App.globalData.URL,
    });
    myPerformance.reportEnd(2007, 'mine_mine_list');
    var that = this;

    that.userInfo();
  },

  applyArtificialService(e) {
    var that = this;
    let orderNo = e.currentTarget.dataset.orderno;
    let index = e.currentTarget.dataset.index;

    Order.applyArtificialService(orderNo).then((res) => {
      let apply = that.data.apply;
      apply[index].obligate4 = '1';
      that.setData({
        apply,
      });
      wx.showModal({
        title: '提示',
        content: '申请人工服务成功',
        showCancel: false,
        confirmText: '确定',
      });
    }).catch((err) => {
      wx.showModal({
        title: '提示',
        content: err,
        showCancel: false,
        confirmText: '确定',
      });
    });
  },

  toUp() {
    wx.navigateTo({
      url: '/sub1/pages/creditStation/index',
    });
  },

  toCommon(e) {
    var that = this;
    let sedId = e.currentTarget.dataset.sedid;
    var dataJson = JSON.stringify({
      sed_id: sedId,
    });

    var custname = encr.jiami(dataJson, aeskey); //3段加密
    return requestP({
      url: App.globalData.YTURL + 'sui/getNodeInfoById.do',
      data: encr.gwRequest(custname),
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值x
      },
    }).then((res) => {
      var jsonData = encr.aesDecrypt(res.body, aeskey); //解密返回的报文
      if (jsonData.STATUS === '1') {
        let orderInfo = JSON.parse(jsonData.list)[0].WDGL1661_REQ;
        orderInfo = JSON.parse(orderInfo);
        let houseChoosed = orderInfo.node3.houseChoosed ? orderInfo.node3.houseChoosed : [];
        houseChoosed = houseChoosed.map((e) => {
          return {
            address: e.address,
            area: e.area,
          };
        });
        let applyInfo = {
          orgName: orderInfo.node2.enterpriseInfo.ORG_NAME,
          applyNum: orderInfo.node3.applyNum,
          applyTime: orderInfo.node3.applyTime,
          applyType: orderInfo.node3.applyType,
          houseChoosed: houseChoosed,
          address: orderInfo.node2.enterWorkStation + orderInfo.node2.enterDetailAddress,
          applyBodyType: orderInfo.node5.type ? orderInfo.node5.type : '0',
          recommendOpenId: orderInfo.node1.recommendOpenId,
          platformUserId: orderInfo.node1.platformUserId,
          // recommendOpenId:"odypO5Wiq3qMXlGOSMbQZ9-LZfJ8"
          // applyBodyType:"1"
        };
        wx.navigateTo({
          url: `/sub3/pages/common/apli?page=sui&applyInfo=${JSON.stringify(applyInfo)}`,
        });
      }
    });
  },

  async toMineApplicate(e) {
    const { apply, sedid, orderno } = e.currentTarget.dataset;

    if (apply.APPLY_TYPE === '14' && apply.ORDER_STATE === '3') {
      return;
    }

    if (
      apply.APPLY_TYPE === '14' &&
      (apply.ORDER_STATE == 41 ||
        apply.ORDER_STATE == 42 ||
        apply.ORDER_STATE == 43 ||
        apply.ORDER_STATE == 44 ||
        apply.ORDER_STATE == 46)
    ) {
      try {
        const orderInfo = await Order.getApplyInfoByAID(sedid);

        if (orderInfo.node10 && orderInfo.node10.isEvaluation) {
          wx.navigateTo({
            url: `/pages/mine/mine_applicate?orderNo=${orderno}&type=10`,
          });
        } else {
          wx.navigateTo({
            url: `/sub1/pages/evaluate/index?apply=${JSON.stringify(apply)}&enterpriseInfo=${JSON.stringify(
              orderInfo.node2.enterpriseInfo,
            )}`,
          });
        }
      } catch (error) {
        wx.showModal({
          title: '提示',
          content: error.message || error,
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
    } else {
      wx.navigateTo({
        url: `/pages/mine/mine_applicate?orderNo=${orderno}&type=10`,
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showLoading({
      title: '加载中...',
    });
    this.setData({
      apply: [],
      page: 1,
    });
    this.getApply();

    if (wx.getStorageSync('openid') == null || wx.getStorageSync('openid') == '') {
      wx.login({
        success: (res) => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          util.openid(res.code, App.globalData.URL);
        },
      });
    } else {
      //判断数据库了里是否存在密钥
      wx.request({
        url: App.globalData.URL + 'existkey',
        data: {
          sessionId: wx.getStorageSync('sessionid'),
        },
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          key: Date.parse(new Date()).toString().substring(0, 6),
        },
        success(res) {
          if (res.data == undefined || res.data != true) {
            wx.login({
              success: (res) => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                util.openid(res.code, App.globalData.URL);
              },
            });
          }
        },
        fail() {
          wx.showToast({
            title: '网络异常',
            icon: 'none',
            duration: 2000,
          });
        },
      });
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  userInfo: function () {

  },

  onReachBottom: function () {
    if (this.data.pageTips == '已无更多数据') {
      return;
    }
    wx.showLoading({
      title: '加载中...',
    });
    wx.showNavigationBarLoading();
    this.getApply();
    this.setData({
      pageTips: '加载中',
    });
  },

  getApply: function () {
    var that = this;
    let param = {
      openid: wx.getStorageSync('openid'),
      page: that.data.page,
      pageSize: that.data.pageSize,
      typeQuery:'1'
    };
    Order.getApplyList(param).then((res) => {
      wx.hideLoading();
      var apply = that.data.apply;
      res.forEach((e) => {
        if (e.APPLY_TYPE == 21) {
          e.APPLY_AMOUNT = Number(e.APPLY_AMOUNT) / 10000
        }
        // if (e.ATTR2) {
        //   e.obligate4 = JSON.parse(e.ATTR2).obligate4;
        // }
      });
      var pageTips = '上拉加载';
      // var arr = []
      for (var i = 0; i < res.length; i++) {
        try {
          if(res[i].ATTR1){
            res[i].ATTR1 = JSON.parse(res[i].ATTR1)
          }
          if(res[i].AMOUNT_FD.indexOf('.')!='-1'){
            res[i].AMOUNT_FD = res[i].AMOUNT_FD.substring(0,res[i].AMOUNT_FD.indexOf('.'))
          }
          if(res[i].AMOUNT_GD.indexOf('.')!='-1'){
            res[i].AMOUNT_GD = res[i].AMOUNT_GD.substring(0,res[i].AMOUNT_GD.indexOf('.'))
          }
          if(res[i].APPLY_AMOUNT.indexOf('.')!='-1'){
            res[i].APPLY_AMOUNT = res[i].APPLY_AMOUNT.substring(0,res[i].APPLY_AMOUNT.indexOf('.'))
          }
        } catch (error) {

        }
        apply.push(res[i]);
      }
      if (res.length < 5) {
        pageTips = '已无更多数据';
      }
      that.setData({
        apply: apply,
        pageTips: pageTips,
        page: that.data.page + 1,
      });
      if (that.data.apply.length < 1) {
        //显示暂无数据
        that.setData({
          showNon: true,
        });
      }
    }).catch((err) => {
      that.setData({
        pageTips: '已无更多数据',
      });
      wx.hideLoading();
      wx.showToast({
        title: '网络异常',
        icon: 'none',
        duration: 2000,
      });
    });
  },

  async confirm(e) {
    var that = this
    let orderNo = e.currentTarget.dataset.orderno;
    const { apply } = e.currentTarget.dataset;
    wx.showLoading({
      title: '请等待',
      mask: true,
      duration: 60000,
    });
    if (apply.APPLY_TYPE == '21') {
      let data = {
        orderNo: orderNo,
        applyDate: apply.APPLY_DATE,
        applyAmount: JSON.stringify(apply.APPLY_AMOUNT * 10000),
        applyStatus:'3',
        queryResult: apply.QUERY_RESULT,
        orgId:apply.REQUEST_SEQ_NO,
        txnNo:apply.TXN_NO,
      }
      clearTimeout(that.TimeID);
      that.TimeID = setTimeout(() => {
        Order.myrAddOrUpdata(data).then(res => {
          if (res.msgCode == '0000') {
            wx.hideLoading();
            wx.showModal({
              title: '提示',
              content: '确认额度成功',
              showCancel: false,
              confirmText: '确定',
              success: async (result) => {
                if (result.confirm) {
                  that.setData({
                    apply: [],
                    page: 1,
                  });
                  that.getApply();
                }
              },
            });
          } else {
            wx.hideLoading();
            if(res.msg=='订单状态更新失败:在我行已存在贸易融订单'){
              wx.showModal({
                  title: '提示',
                  content: `在我行已存在贸e融订单`,
                  showCancel: true,
                  confirmText: '确定',
                });
            }else{
              wx.showModal({
                title: '提示',
                content: `确认额度失败`,
                showCancel: true,
                confirmText: '确定',
              });
            }
          }
        })
      }, 1000);
    } else {
      Order.confirmLoanAmount(orderNo).then((res) => {
        let recommendContent = ''
        if (res.recommendName) {
          recommendContent = '您已确认审批结果，客户经理（' +res.recommendName+ ' ，' + res.recommendPhone +'）将尽快联系您，协助您完成合同签约及贷款支用。'
        } else {
          recommendContent = '您已确认审批结果，客户经理将尽快联系您，协助您完成合同签约及贷款支用。'
        }
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: recommendContent,
          showCancel: false,
          confirmText: '确定',
          success: async (result) => {
            if (result.confirm) {
              //   wx.reLaunch({
              //     url: '/pages/shop/index2',
              //   });
              try {
                wx.showLoading({
                  title: '跳转中',
                  mask: true,
                });
                const { apply } = e.currentTarget.dataset;
                const orderInfo = await Order.getApplyInfoByAID(apply.A_ID);
                wx.navigateTo({
                  url: `/sub1/pages/evaluate/index?apply=${JSON.stringify(apply)}&enterpriseInfo=${JSON.stringify(
                    orderInfo.node2.enterpriseInfo,
                  )}&managerId=${orderInfo.node1.managerUserId}`,
                });
              } catch (error) {

              } finally {
                wx.hideLoading();
              }
            }
          },
        });
      }).catch((err) => {
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: `确认额度失败,${err.message || err}`,
          showCancel: true,
          confirmText: '确定',
        });
      });
    }
    return;
  },

  confirmCz(e){
    let orderNo = e.currentTarget.dataset.orderno;
    let sedid = e.currentTarget.dataset.sedid;
    var dataJson = JSON.stringify({
      sedid: sedid,
      orderNo: orderNo,
    });

    var custname = encr.jiami(dataJson, aeskey); //3段加密
    return requestP({
      url: App.globalData.YTURL + 'sui/sui5005.do',
      data: encr.gwRequest(custname),
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值x
      },
    }).then((res) => {
      var jsonData = encr.aesDecrypt(res.body, aeskey); //解密返回的报文
      if (jsonData.STATUS === '1') {
        
      }
    });
  },

});
