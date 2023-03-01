import components from './helpers/components';
import requestYT from './api/requestYT';
import util from 'utils/util';
import log from 'log';
import requestP from './utils/requsetP';
//app.js
App({
  components,
  globalData: {
    channelFromH5:'',
    playSpeed: {},  //视频播放进度
    int_id: '', //用户id,用于代替open_id
    share_person: '', //分享者openid
    sharerEmpNo: '', //柜台员工号
    empNo: '', //当前用户的员工号
    shareID: '', //share_manager 表id
    channelNo: '', // 渠道号
    userInfo: wx.getStorageSync('userInfo'),//null
    canOpenApp: false,
    statusBarHeight: '',
    statusBarTop: '',
    devUrl: {
      testUrl: 'http://66.1.41.199:9080/rhedt/',
      verifyUrl: 'http://66.1.41.203:7080/rhedt/',
    },
    finalUrl: 'https://wxapp.jsbchina.cn:7080/rhedt/',
    testUrl: 'https://wxapptest.jsbchina.cn/rhedt/',
    verifyUrl: 'https://wxappverify.jsbchina.cn:7080/rhedt/',
    JSBURL: 'https://wxapp.jsbchina.cn:7080/creditAuth/',
    // JSBURL: "https://wxapptest.jsbchina.cn/creditAuth/",
    JSB: 'https://wxapp.jsbchina.cn:7080/jsb/',
    URL: '',
    //  YTURL: 'https://wxapptest.jsbchina.cn:9629/wxgatewaysit/',
    //  YTURL: "https://wxapptest.jsbchina.cn:9629/wxgatewayuat/",
      YTURL: 'https://appservice.jsbchina.cn/wxgatewayuat/',
    CDNURL: 'https://app.jsbchina.cn/file/upload/wwcdn/wxapp',
    creditUrl: 'https://appservice.jsbchina.cn/wxgatewayuat/jsyh/',
    // creditUrl: 'https://wxapptest.jsbchina.cn:9629/wxgatewaysit/jsyh/',
    showChatComponent: false,

    tabBar1: {
        "color": "#C3C4D0",
        "selectedColor": "#168BFB",
        "backgroundColor": "#fff",
        "borderStyle": "#ccc",
        "list": [
          {
            "pagePath": "/sub7/pages/index/index",
            "text": "首页",
            "iconPath": "/sub7/images/tabbar1/sy.png",
            "selectedIconPath": "/sub7/images/tabbar1/sy_active.png",
            "clas": "menu-item1",
            "selectedColor": "#168BFB",
            "active": false
          },
          {
            "pagePath": "/sub7/pages/merchantManage/merchantManage",
            "text": "商户管理",
            "iconPath": "/sub7/images/tabbar1/shgl.png",
            "selectedIconPath": "/sub7/images/tabbar1/shgl_active.png",
            "selectedColor": "#168BFB",
            "clas": "menu-item1",
            "active": true
          },
          {
            "pagePath": "/sub7/pages/orderManage/orderManage",
            "text": "订单管理",
            "iconPath": "/sub7/images/tabbar1/ddgl.png",
            "selectedIconPath": "/sub7/images/tabbar1/ddgl_active.png",
            "selectedColor": "#168BFB",
            "clas": "menu-item1",
            "active": false
          },
          {
            "pagePath": "/sub7/pages/me/me",
            "text": "我的",
            "iconPath": "/sub7/images/tabbar1/wd.png",
            "selectedIconPath": "/sub7/images/tabbar1/wd_active.png",
            "selectedColor": "#168BFB",
            "clas": "menu-item1",
            "active": false
          }
        ],
        "position": "bottom"
      }
  },

  onLaunch() {
    // console.log('onLaunch');

    //设置运行环境
     this.globalData.URL = this.globalData.finalUrl;
    // this.globalData.URL = this.globalData.testUrl;
    // this.globalData.URL = this.globalData.verifyUrl;
    //this.globalData.CDNURL = this.globalData.testUrl;

    //初始化胶囊按钮
    this.loadStatusBar();

    // this.autoUpdate();

    // this.getLocation();
  },
  editTabBar1: function () {
    var curPageArr = getCurrentPages();
    var curPage = curPageArr[curPageArr.length - 1];
    var pagePath = curPage.route;
    if (pagePath.indexOf('/') != 0) {
      pagePath = '/' + pagePath;
    }
    var tabBar = this.globalData.tabBar1;
    for (var i = 0; i < tabBar.list.length; i++) {
      tabBar.list[i].active = false;
      if (tabBar.list[i].pagePath == pagePath) {
        tabBar.list[i].active = true; 
      }
    }
    curPage.setData({
      tabBar: tabBar
    });
  },
  getLocation: function () {
    var that = this;
    return new Promise((resolve, reject) => {
      wx.getLocation({
        type: 'wgs84',
        altitude: false,
        success: (res) => {
          return requestP({
            url:
              'https://restapi.amap.com/v3/geocode/regeo?location=' +
              res.longitude +
              ',' +
              res.latitude +
              '&subdistrict=1&key=f50fb5855088b5dee3b232e3971542f3',
            method: 'get',
          })
            .then((res) => {
              if (
                res.info === 'OK' &&
                typeof res.regeocode.addressComponent.adcode === 'string' &&
                res.regeocode.addressComponent.adcode.substring(0, 4) === '3201'
              ) {
                this.globalData.showChatComponent = true;
              }
              resolve();
            })
            .catch();
        },
        fail: () => {},
        complete: () => {},
      });
    });
  },

  onShow: async function (options) {
    this.autoUpdate();
    console.log('options', options);
    log.info('onshow:', options);
    this.initData(options);

    if (options.scene === 1036 || options.scene === 1069) {
      this.globalData.canOpenApp = true;
    } else if (options.scene === 1038 || options.scene === 1068 || options.scene === 1090) {
    } else {
      this.globalData.canOpenApp = false;
    }
  },
  async getUserInfo(channel, data) {
    data = decodeURIComponent(data);
    const options = {
      url: 'sui/decodeh5.do',
      data: JSON.stringify({
        channel,
        data,
      }),
    };
    const res = await requestYT(options);
    if (res.STATUS === '1' && res.result_code === '0000') {
      return JSON.parse(res.stringData);
    }
    // throw new Error(res || res.result_msg);
    return Promise.reject(new Error(res.result_msg));
  },

  async initData(options) {
    var that = this;
    if (wx.getStorageSync('openid') == '') {
      await that.getSessionInfo();
    }
    that.readShareInfo(options);
    that
      .getCustomerInfo()
      .then((res) => {
        that.globalData.empNo = res.USERID ? res.USERID : '';
        that.globalData.int_id = res.INT_ID;
        // console.log('myIntID', that.globalData.int_id);
        // console.log('empNo', that.globalData.empNo);
      })
      .catch((err) => {
        if (err === 'unCustomerInfo') {
          that.addCustomerInfo();
        }
      });
  },

  getSessionInfo() {
    var that = this;
    return new Promise((resolve, reject) => {
      wx.login({
        timeout: 10000,
        success: (res) => {
          wx.request({
            url: that.globalData.URL + 'getwechatid',
            data: {
              js_code: res.code,
              isProxy: false,
            },
            header: {
              'content-type': 'application/json', // 默认值
              key: Date.parse(new Date()).toString().substring(0, 6),
            },
            success(res) {
              if (res.data != '') {
                wx.setStorageSync('openid', res.data.openid);
                wx.setStorageSync('key', res.data.key); //加解密
                wx.setStorageSync('sessionid', res.data.session_key);
                resolve();
              } else {
                let version = wx.getAccountInfoSync().miniProgram.envVersion;

                if (version === 'develop') {
                  wx.showModal({
                    title: '提示',
                    content: '获取openid失败,重新扫码直至不弹出提示',
                    showCancel: false,
                    confirmText: '确定',
                    confirmColor: '#3CC51F',
                    success: (result) => {
                      if (result.confirm) {
                      }
                    },
                    fail: () => {},
                    complete: () => {},
                  });
                }
                // console.log('获取openid失败');
                log.info('获取openid失败');
              }
            },
            fail(err) {
              // console.log('getOpenidERR', err);
            },
          });
        },
        fail: (err) => {
          reject(err);
        },
      });
    });
  },

  loadStatusBar() {
    var that = this;
    wx.getSystemInfo({
      success: (res) => {
        that.globalData.StatusBar = res.statusBarHeight;
        if (wx.getMenuButtonBoundingClientRect) {
          let capsule = wx.getMenuButtonBoundingClientRect();
          that.globalData.Custom = capsule;
          that.globalData.CustomBar = capsule.bottom + capsule.top - res.statusBarHeight;
          that.globalData.statusBarTop = capsule.top;
          that.globalData.statusBarHeight = capsule.height;
        } else {
          that.globalData.CustomBar = res.statusBarHeight + 50;
        }
      },
    });
  },

  autoUpdate() {
    var self = this;
    log.setFilterMsg('autoUpdate');
    log.info('开始检测更新');
    // 获取小程序更新机制兼容
    console.log(wx.canIUse('getUpdateManager'),'是否可以使用更新机制')
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager();
      //1. 检查小程序是否有新版本发布
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        console.log('是否有更新', res);
        log.info('检测是否有更新', res);
        if (res.hasUpdate) {
          //2. 小程序有新版本，则静默下载新版本，做好更新准备
          log.info('检测到更新准备下载');
          updateManager.onUpdateReady(function () {
            log.info('新的版本已经下载成功');
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  log.info('同意更新');
                  //3. 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate();
                } else if (res.cancel) {
                  //如果需要强制更新，则给出二次弹窗，如果不需要，则这里的代码都可以删掉了
                  log.info('拒绝更新');
                  wx.showModal({
                    title: '温馨提示~',
                    content: '本次版本更新涉及到新的功能添加，旧版本无法正常访问的哦~',
                    success: function (res) {
                      self.autoUpdate();
                    },
                  });
                }
              },
            });
          });
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            });
          });
        }
      });
    } else {
      log.info('不支持更新');
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
      });
    }
  },

  async readShareInfo(options) {
    var that = this;
    let share_click = wx.getStorageSync('openid');
    if (options.scene == 1007 || options.scene == 1008) {
      if (options.query.open_id) {
        // console.log('卡片分享进入参数:', options);
        log.info('卡片分享进入参数:' + JSON.stringify(options.query));
        that.globalData.sharerEmpNo = options.query.empNo || '';
        that.globalData.share_person = options.query.open_id || '';
        options = {
          shareDate: options.query.share_date,
          shareWay: '0',
          ...options,
        };
        log.info('赋值柜台主人号全局变量' + that.globalData.sharerEmpNo);
        log.info('赋值分享者openid全局变量' + that.globalData.share_person);
        if (
          options.path === 'sub1/pages/sui/index' &&
          options.shareDate &&
          (new Date() - new Date(options.shareDate)) / (1 * 24 * 60 * 60 * 1000) > 7 &&
          that.globalData.sharerEmpNo === ''
        ) {
          log.info('sharing information has expired');
          wx.showModal({
            title: '提示',
            content: '分享信息已过期',
            showCancel: false,
            confirmText: '确定',
            success: (result) => {
              if (result.confirm) {
              }
            },
            fail: () => {},
            complete: () => {},
          });
          return;
        }

        if (that.globalData.share_person === share_click) {
          // console.log('本人分享自己');
          return;
        } else {
          // console.log('开始查询分享者信息');
          that
            .getShareInfo(that.globalData.share_person, wx.getStorageSync('openid'))
            .then((res) => {
              return that.viewHistoryShareInfo(res, options);
            })
            .catch((err) => {
              // console.log(err);
            });
        }
      } else {
        // console.log('not contain sharerInfo');
        log.info('not contain sharerInfo');
      }
    } else if (options.scene == 1047 || options.scene == 1048 || options.scene == 1049 || options.scene == 1035 || options.scene == 1069) {
      // console.log('扫描小程序码', options);
      if (options.query.scene) {
        let scene = decodeURIComponent(options.query.scene).split('a');
        log.info('扫描小程序码进入参数:' + JSON.stringify(options.query));
        if (scene[0] == '0000') {
          // console.log('渠道吗进入' + scene[1]);
          log.info('渠道进入:' + scene[1]);
          that.globalData.channelNo = scene[1] ? scene[1] : '';
          that.globalData.sharerEmpNo = '';
          that.globalData.share_person = '';

          options = {
            shareDate: util.formatTime(new Date()),
            shareWay: '2',
            ...options,
          };

          // console.log('开始查询分享者信息');
          that
            .getShareInfo(that.globalData.channelNo, wx.getStorageSync('openid'))
            .then((res) => {
              return that.viewHistoryShareInfo(res, options);
            })
            .catch((err) => {
              // console.log(err);
            });
        } else {
          that.globalData.channelNo = '';
          var int_id = scene[0] ? scene[0] : '';
          that.globalData.sharerIntID = int_id;
          that.globalData.sharerEmpNo = scene.length > 2 && /^[0-9]{8}$/.test(scene[2]) ? scene[2] : '';
          log.info('赋值柜台主人号全局变量' + that.globalData.sharerEmpNo);
          // console.log('赋值柜台主人号全局变量' + that.globalData.sharerEmpNo);
          options = {
            shareDate: scene[1] ? scene[1] : '',
            shareWay: '1',
            ...options,
          };
          if (
            options.path === 'sub1/pages/sui/index' &&
            options.shareDate &&
            (new Date() - new Date(options.shareDate)) / (1 * 24 * 60 * 60 * 1000) > 7 &&
            that.globalData.sharerEmpNo === ''
          ) {
            log.info('sharing information has expired');

            wx.showModal({
              title: '提示',
              content: '分享信息已过期',
              showCancel: false,
              confirmText: '确定',
              success: (result) => {
                if (result.confirm) {
                }
              },
              fail: () => {},
              complete: () => {},
            });
            return;
          }
          if (int_id) {
            // console.log('开始查询分享者者openid');
            that
              .getOpenIdByID(int_id)
              .then((sharer_open_id) => {
                if (sharer_open_id) {
                  that.globalData.share_person = sharer_open_id;
                  log.info('赋值分享者openid全局变量' + that.globalData.share_person);
                  // console.log('share_person', that.globalData.share_person);
                  if (share_click === sharer_open_id) {
                    // console.log('本人分享自己');
                    return Promise.reject('本人分享自己');
                  } else {
                    // console.log('开始查询分享者信息');
                    return that.getShareInfo(that.globalData.share_person, wx.getStorageSync('openid'));
                  }
                } else {
                  return Promise.reject('not find openid');
                }
              })
              .then((res) => {
                return that.viewHistoryShareInfo(res, options);
              })
              .catch((err) => {
                // console.log('错误', err);
                log.info('错误', err);
              });
          } else {
            // console.log('not contain sharerInfo');
            log.info('not contain sharerInfo');
          }
        }
      }
    }
    //圆融跳转逻辑
    else if (options.scene === 1037) {
      if (options.query.channel && options.query.data) {
        // console.log('渠道吗进入' +options.query.channel);
        log.info('渠道进入:' + options.query.channel);
        that.globalData.channelNo = options.query.channel;
        that.globalData.sharerEmpNo = '';
        that.globalData.share_person = '';

        options = {
          shareDate: util.formatTime(new Date()),
          shareWay: '3',
          ...options,
        };

        // console.log('开始查询分享者信息');
        that
          .getShareInfo(that.globalData.channelNo, wx.getStorageSync('openid'))
          .then((res) => {
            return that.viewHistoryShareInfo(res, options);
          })
          .catch((err) => {
            // console.log(err);
          });

        try {
          const { channel, data } = options.query;
          const res = await that.getUserInfo(channel, data);
          //console.log('解密后的数据', res);
          log.info(res);
          if (res.companyInfo && res.companyInfo.companyName) {
            wx.setStorageSync('channelEnterpriseInfo', res.companyInfo);
          }
          wx.setStorageSync('channelInfo', res);
        } catch (error) {
          console.log(error);
          wx.showModal({
            title: '提示',
            content: error.message || error,
            showCancel: false,
            confirmText: '确定',
          });
        }
      }
    }
  },

  viewHistoryShareInfo(shareList, options) {
    // console.log('start /viewHistoryShareInfo');
    var that = this;

    let data = {
      //id_id: "SHARE_ID", //分享id唯一的
      share_person: that.globalData.channelNo || that.globalData.share_person, //分享人
      share_website: options.path, //分享网址
      share_click: wx.getStorageSync('openid'), //被分享人
      share_date: options.shareDate,
      share_way: options.shareWay,
      emp_no:
        that.globalData.sharerEmpNo == undefined || that.globalData.sharerEmpNo.length > 8
          ? ''
          : that.globalData.sharerEmpNo,
    };
    if (shareList.length == 0) {
      // console.log('开始添加分享数据');
      that.addShareInfo(data);
    } else {
      // console.log('分享者存在分享数据');
      // console.log('开始遍历信息');

      let flag = shareList.find(
        (r) =>
          r.SHARE_CLICK == wx.getStorageSync('openid') &&
          r.SHARE_WEBSITE == options.path &&
          r.CREATE_DATE == util.formatTime(new Date()).substring(0, 10).replace('-', '').replace('-', ''),
      );
      if (flag) {
        // console.log('flag', flag);
        that.globalData.shareID = flag.ID;
        // console.log('分享链ID:', that.globalData.shareID);
        log.info('分享链ID:' + that.globalData.shareID);
        // console.log('分享者为本人/今日已存在分享关系,不添加');
      } else {
        // console.log('今日未存在分享关系');
        that.addShareInfo(data);
      }
    }
  },

  async addCustomerInfo() {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        let data = JSON.stringify({
          STRING_OPEN_ID: wx.getStorageSync('openid'),
          STRING_VERSION: res,
          STRING_SYSINFO: wx.getAccountInfoSync().miniProgram.version,
        });
        wx.request({
          url: that.globalData.URL + 'addversion',
          data: {
            data: data,
          },
          header: {
            'content-type': 'application/json', // 默认值
            key: Date.parse(new Date()).toString().substring(0, 6),
          },
          success(res) {},
        });
      },
    });

    let options = {
      url: 'customer/addcustomer.do',
      data: JSON.stringify({
        data: JSON.stringify({
          STRING_OPEN_ID: wx.getStorageSync('openid'),
          STRING_NICK_NAME: '',
          STRING_COUNTRY: '',
          STRING_PROVINCE: '',
          STRING_CITY: '',
          STRING_GENDER: '',
          STRING_PHOTO: '',
        }),
      }),
      ifEncrypt: false,
    };
    const res = await requestYT(options);
    // console.log('customer/addcustomer.do', res);
    if (res.STATUS === '1' && res.resultVo.stringData) {
      that.globalData.int_id = res.resultVo.stringData;
      // // console.log("myIntID after add", that.globalData.int_id);
      log.info('myIntID after add', that.globalData.int_id);
    }
  },

  async getOpenIdByID(INT_ID) {
    let options = {
      url: 'customer/getopen_id2.do',
      data: JSON.stringify({
        INT_ID,
      }),
    };
    const res = await requestYT(options);
    if (res.STATUS === '1' && res.resultVo.length > 0) {
      // console.log('getopen_id2', res.resultVo[0].OPEN_ID);
      return res.resultVo[0].OPEN_ID;
    } else {
      return Promise.reject('unGetOpenIdByID');
    }
  },

  async getShareInfo(open_id, click) {
    let options = {
      url: 'share/getshare.do',
      data: JSON.stringify({
        open_id,
        click,
      }),
    };
    return requestYT(options).then((res) => {
      // console.log('getshare', res);
      log.info('getshare', res);
      if (res.STATUS === '1') {
        return JSON.parse(res.list);
      } else {
        return Promise.reject('unShareInfo');
      }
    });
  },

  async getCustomerInfo(openId) {
    let options = {
      url: 'customer/getcustomer.do',
      data: JSON.stringify({
        openId: openId || wx.getStorageSync('openid'),
        version: util.formatTime4(new Date()),
      }),
    };
    const res = await requestYT(options);
    if (res.STATUS === '1' && res.resultVo.code === 1) {
      return res.resultVo.data[0];
    } else {
      return Promise.reject('unCustomerInfo');
    }
  },

  async addShareInfo(data) {
    var that = this;
    let options = {
      url: 'share/addShare.do',
      data: JSON.stringify(data),
    };
    try {
      const res = await requestYT(options);
      // console.log('addShare', res);
      log.info('addShare:', JSON.stringify(res));
      if (res.STATUS === '1') {
        if (res.code === '1') {
          that.globalData.shareID = res.id;
          //console.info('分享链ID:' + that.globalData.shareID);
          log.info('分享链ID:' + that.globalData.shareID);
        }
      } else {
        log.info('分享链ID获取失败');
      }
    } catch (res_1) {
      log.info('添加分享记录失败');
      // console.log(res_1);
    }
  },

  // 设置监听器
watch: function (ctx, obj) {
  Object.keys(obj).forEach(key => {
    this.observer(ctx.data, key, ctx.data[key], function (value) {
      obj[key].call(ctx, value)
    })
  })
},
// 监听属性，并执行监听函数
observer: function (data, key, val, fn) {
  Object.defineProperty(data, key, {
    configurable: true,
    enumerable: true,
    get: function () {
      return val
    },
    set: function (newVal) {
      if (newVal === val) return
      fn && fn(newVal)
      val = newVal
    },
  })
}
});
