// sub1/pages/list/index.js

import requestP from '../../../utils/requsetP';
import skip from '../../../utils/skip';
import api from '../../../utils/api';
import productDesc from '../../../utils/product';

var QQMapWX = require('../../../assets/plugins/qqmap-wx-jssdk1.2/qqmap-wx-jssdk.js');
var qqmapsdk;
const app = getApp();
var myPerformance = require('../../../utils/performance.js');
Page({
  data: {
    maskHidden: true, //控制遮罩层
    imagePath: '', //海报路径
    hidePoster: true, //隐藏海报
    cardInfo: {}, //员工名片信息
    configInfo: {},
    hotList: [], //热门推荐
    showEmpbox: false, //显示选择客户经理
    empPhotoHeight: 1, //按比例显示职业照片
    showHotList: true,
    isSelf: false, //客户经理是否是本人
    showBless: false,
    style: [
      'border: 1rpx #3A67E0 solid; color: #3A67E0;opacity: 0.7; ',
      'border: 1rpx #FF6B05 solid; color: #FF6B05;opacity: 0.7; ',
      'border: 1rpx #13B2C0 solid; color: #13B2C0;opacity: 0.7; ',
    ], //标签样式
    inputVal: '', //搜索输入
    bankList: [], //支行列表
    emplist: [], //员工列表
    showBank: false,
    activeIndex: -1, //当前tab
    empActiveIndex: -1, //当前支行
    cardCur: 0,
    typeIndex: 0,
    tabs: [
      {
        name: '杭州',
        code: '18',
        productCode: 'AM011',
      },
      {
        name: '南京',
        code: '19',
        productCode: 'AM013',
      },
      {
        name: '无锡',
        code: '02',
        productCode: 'AM014',
      },
      {
        name: '苏州',
        code: '03',
        productCode: 'AM021',
      },
      {
        name: '南通',
        code: '04',
        productCode: 'AM015',
      },
      {
        name: '常州',
        code: '05',
        productCode: 'AM016',
      },
      {
        name: '淮安',
        code: '06',
        productCode: 'AM012',
      },
      {
        name: '镇江',
        code: '10',
        productCode: 'AM017',
      },

      {
        name: '宿迁',
        code: '12',
        productCode: 'AM024',
      },
      {
        name: '泰州',
        code: '13',
        productCode: 'AM019',
      },
      {
        name: '徐州',
        code: '14',
        productCode: 'AM022',
      },
      {
        name: '北京',
        code: '15',
        productCode: 'AM023',
      },
    ],

    zh_products: [
      {
        name: '网点查询',
        code: 'CP001',
      },
      {
        name: '房产评估',
        code: 'AP001',
      },
      {
        name: '企业手机银行',
        code: 'BP002',
      },
      {
        name: '企业网银',
        code: 'BP001',
      },
      {
        name: '对公账户查询',
        code: 'CP002',
      },
      {
        name: '创业家卡',
        code: 'GP001',
      },
      {
        name: '开户资料查询',
        code: 'CP003',
      },
      {
        name: '线上征信',
        code: 'HP001',
      },
    ],

    areaPorductCode: '',
    CustomBar: app.globalData.StatusBar,
    showRecentChat: false,
    contactList: [],
    cndUrl: app.globalData.CDNURL,
    preffixUrl: app.globalData.URL,
  },

  onLoad() {
    qqmapsdk = new QQMapWX({
      key: '2RIBZ-UTLC2-AWQUY-C7I2T-3YKN5-AIF4D',
    });
  },

  skip(e) {
    let code = e.currentTarget.dataset.code;
    skip.skipProduct(code);
  },

  skipByArea() {
    let code = e.currentTarget.dataset.code;
  },

  developing() {
    wx.showToast({
      title: '敬请期待',
      icon: 'none',
      image: '',
      duration: 1500,
      mask: false,
      success: (result) => {},
      fail: () => {},
      complete: () => {},
    });
  },

  hasProduct(code) {
    //console.log("code", code);
    for (let i = 0; i < productDesc.length; i++) {
      if (code == productDesc[i].id) {
        return i;
      }
    }
    return '-1';
  },

  onShow: function (e) {
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
  
    this.getUserLocation();
  },

  getUserLocation: function () {
    let that = this;
    wx.getSetting({
      success: (res) => {
        // //console.log(res);
        if (res.authSetting['scope.userLocation'] == false) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000,
                });
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    if (dataAu.authSetting['scope.userLocation'] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000,
                      });
                      that.getLocation();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000,
                      });
                    }
                  },
                });
              }
            },
          });
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          that.getLocation();
        } else {
          that.getLocation();
        }
      },
    });
  },

  // 微信获得经纬度
  getLocation: function () {
    let that = this;
    wx.getLocation({
      type: 'wgs84', //gcj02
      success: function (res) {
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude,
          },
          success: function (res) {
            // //console.log("res",res)
            let name = res.result.ad_info.city;
            let area = that.data.tabs.find((e) => name.indexOf(e.name) > -1);
            //console.log("areaPorductCode", area);
            myPerformance.reportBegin(2020, 'sub1_financial_index');
            that.setData({
              areaPorductCode: area ? area.productCode : 'AM013',
            });
            myPerformance.reportEnd(2020, 'sub1_financial_index');
          },
        });
      },
    });
  },

    onShareAppMessage() {
        return api.shareApp('');
    },
    comingSoon() {
        wx.showToast({
            title: "敬请期待！",
            icon: 'none'
        })
    },
});
