// pages/mine/mine_applicate.js
const App = getApp();
const date = new Date();
var util = require('../../utils/util.js');
import Order from '../../api/Order';
import requestP from '../../utils/requsetP';
import api from '../../utils/api';
var myPerformance = require('../../utils/performance.js');
import requestYT from '../../api/requestYT';
import user from '../../utils/user';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    _apply: '',
    type: '',
    preffixUrl: '',
    showNon: false,
    queryResult: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    enterpriseInfo: {},
    orderNo: {},
    sedId: '',
    state: '',
    result: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.setData({
      preffixUrl: App.globalData.URL,
      type: options.type,
    });
    wx.showLoading({
      title: '加载中...',
    });
    var that = this;
    that.userInfo();

    myPerformance.reportBegin(2012, 'mine_mine_applicate');
    that.getOrderInfo(options.orderNo);
    var result = await Order.getApplyInfoByOrderNo(options.orderNo);
    wx.hideLoading();
    let queryResult = result[0].QUERY_RESULT ? JSON.parse(result[0].QUERY_RESULT) : {};
    queryResult.CERT_NO2 = queryResult.CERT_NO ? api.formateIdCard(queryResult.CERT_NO) : '';
    queryResult.PERSON_NAME2 = queryResult.PERSON_NAME ? api.formateName(queryResult.PERSON_NAME) : '';
    // queryResult.CAGT = result[0].ATTR2 ? JSON.parse(result[0].ATTR2).MAJOR_CATG: '';
    // console.log(JSON.parse(result[0].ATTR2));
    if (result[0].APPLY_TYPE == 21) {
      if (result[0].APPLY_AMOUNT) {
        console.log(result[0].APPLY_AMOUNT.split('.'));
        result[0].APPLY_AMOUNT = result[0].APPLY_AMOUNT.split('.')[0]
      }
    }
    
        //烟商贷状态专属处理
    if(result[0].APPLY_TYPE == 18 && result[0].SHOW_STATE == 4 ){
      switch(result[0].ORDER_STATE){
        case '1001':
        case '1002':
        case '1003':
        case '1004':
        case '1010':
        case '1011':
          result[0].invalidText = '审批未通过'
          break;
        case '1005':
        case '1006':
        case '1007':
        case '1008':
        case '1009':
        case '1050':
        case '1096': 
        case '1097':
          result[0].invalidText = '业务已终结'
          break;
        case '1098':
        case '1099':
          result[0].invalidText = '系统异常，请稍后再试'
          break;
        default:
          result[0].invalidText = '审批未通过'
          break;
        }
    }
    that.setData({
      _apply: result[0],
      queryResult,
    });
    myPerformance.reportEnd(2012, 'mine_mine_applicate');
  },

  getOrderInfo(orderNo) {
    var that = this;
    Order.getApplyByOrderNo(orderNo)
      .then((res) => {
        let data = res;
        let state = data.SHOW_STATE;
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
      })
      .catch((err) => {
        // console.log(err);
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

  confirmResult() {
    var that = this;
    wx.navigateTo({
      url:
        '/sub1/pages/sui/success?params=' +
        encodeURIComponent(JSON.stringify(that.data.result)) +
        '&enterpriseInfo=' +
        encodeURIComponent(JSON.stringify(that.data.enterpriseInfo)) +
        '&orderNo=' +
        that.data.orderNo +
        '&sedId=' +
        that.data.sedId,
    });
  },
  confirmResult1() {
    var that = this;

    let options = {
      url: 'jsyh/selectYSDmsg.do',
      data: JSON.stringify({
        orderNo: that.data._apply.ORDER_NO,
      }),
    };
    requestYT(options).then((res) => {
      wx.navigateTo({
        url:
          '/sub1/pages/sui/success?params=' +
          encodeURIComponent(JSON.stringify(res)) +
          '&enterpriseInfo=' +
          encodeURIComponent(JSON.stringify(that.data.enterpriseInfo)) +
          '&orderNo=' +
          that.data._apply.ORDER_NO +
          '&sedId=' +
          that.data.sedId +
          '&type=18',
      });
    });
  },

  getResult() {
    var that = this;
    wx.navigateTo({
      url: '/sub1/pages/sui/success?params=' + encodeURIComponent(JSON.stringify(that.data.result)) + '&page=result',
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
    ////console.log(wx.getStorageSync('openid'))
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

  getUserInfo() {
    var that = this;
    wx.getUserProfile({
      desc: '获取用户信息',
      success: (res) => {
        let userInfo = res.userInfo;
        App.globalData.userInfo = JSON.parse(JSON.stringify(userInfo));
        this.setData({
          hasUserInfo: true,
          userInfo: App.globalData.userInfo,
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
          userInfo: App.globalData.userInfo,
        });
      }
    });
  },
});
