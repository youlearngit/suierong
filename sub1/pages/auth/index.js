const app = getApp();
var util = require('../../../utils/util.js');
var citys = require('../../../pages/public/city_zj.js');
import api from '../../../utils/api';
var QQMapWX = require('../../../assets/plugins/qqmap-wx-jssdk1.2/qqmap-wx-jssdk.js');
var qqmapsdk;

import user from '../../../utils/user';
import House from '../../../api/House';
import Org from '../../../api/Org';
var myPerformance = require('../../../utils/performance.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    reurl: '../auth/index',
    loading: true,
    accessToken: '',
    verifyResult: '', //认证返回值
    apply: [],
    preffixUrl: '',
    isRealName: '',
    showNon1: '', //对应身份证
    showNon2: '', //对应手机号
    showNon3: 0, //对应我的企业
    showNon4: '', //对应税务信息
    showNon5: '', //对应房产
    showNon6: 0, //对应房产评估
    showNon7: '', //对应车辆
    showNon8: '', //对应人才
    showNon9: '', //对应配偶
    showNum: 0,
    showMoreCom: '',
    userInfo: {},
    identity: [], //身份信息 identity.ID_NUMBER [{ ID_NUMBER:'32120219911022062X',NAME:'陈超'}]
    hasUserInfo: false,
    url: '',
    type: '',
    mobile: '', //手机号
    company: [],
    taxation: [], //税务信息
    house: [
      {
        detail: '11111111',
        ass: '2222',
      },
    ], //房产
    qual: [
      {
        detail: '11111111',
      },
    ], //资质
    companyInfo: [],
    taxDate: '',
    taxChannel: '',
    taxInfos: [],
    taxflag: false,
    isTax: 0,
    rencai: '去认证',
    ifHideAmout: true,
    js_code: '',
    iv: '',
    encData: '',
    rencaidengji: '',
    rencaiquyu: '',

        // 分割线
        houseInfo: [],
        house_mini: 1,
        card_mini: 1,
        tax_mini: 1,
        form: {
            orgID: '', //企业统一信用代码
            orgName: '',
            province: '', //省
            city: '', //市
            name: '', //法人姓名
            tel: '', //法人手机
            idCard: '', //法人身份证
            address: '', //法人联系地址
            timeIndex: '0', //申请期限
            slider: '200', //贷款额度
            // loadCardNo: '', //中征码
            provinceCode: '', //省码
            cityCode: '', //市码
            typeIndex: '0', //申请类型
        },
        rencaidiqu: [{
                key: '1',
                value: '南京市',
            },
            {
                key: '2',
                value: '无锡市',
            },
            {
                key: '3',
                value: '徐州市',
            },
            {
                key: '4',
                value: '常州市',
            },
            {
                key: '5',
                value: '苏州市',
            },
            {
                key: '6',
                value: '南通市',
            },
            {
                key: '7',
                value: '连云港市',
            },
            {
                key: '8',
                value: '淮安市',
            },
            {
                key: '9',
                value: '盐城市',
            },
            {
                key: '10',
                value: '扬州市',
            },
            {
                key: '11',
                value: '镇江市',
            },
            {
                key: '12',
                value: '泰州市',
            },
            {
                key: '13',
                value: '宿迁市',
            },
            {
                key: '14',
                value: '江苏省',
            },
            {
                key: '15',
                value: '全国',
            },
            { key: '16', value: '北京市' },
            { key: '17', value: '上海市' },
            { key: '18', value: '杭州市' },
            { key: '19', value: '深圳市' },
            { key: '20', value: '浙江省' },
            { key: '21', value: '广东省' },
        ],
        loginFlag: true,
        isEmp: false,
        cardlist: [],
        dept: '230004',
        status: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        if (options.taxflag == true || options.taxflag == 'true') {
            that.setData({
                taxflag: true,
            });
        }
        qqmapsdk = new QQMapWX({
            key: '2RIBZ-UTLC2-AWQUY-C7I2T-3YKN5-AIF4D',
        });
        myPerformance.reportBegin(2013, 'sub1_auth_index');
        that.setData({
            preffixUrl: app.globalData.URL,
            url: options.url == undefined || options.url == null ? '' : options.url,
            type: options.type == undefined ? '' : options.type,
            status: options.status || '',
        });
        that.setData({
            preffixUrl: app.globalData.URL,
            objectMultiArray: citys.citys,
            multiArray: citys.multiArray,
            org_cities: citys.org_cities,
            navTop: app.globalData.statusBarTop,
            navHeight: app.globalData.statusBarHeight,
        });
        console.log('status', that.data.status);
        myPerformance.reportEnd(2013, 'sub1_auth_index');
    },

  /**
   * 取消
   */
  logincancel: function () {
    var that = this;
    that.setData({
      loginFlag: true,
    });
  },

  /**
   * 用户信息授权
   */
  ifAuthUserInfo() {
    var that = this;
    return user.ifAuthUserInfo().then((res) => {
      that.setData({
        loginFlag: res,
      });
      return res;
    });
  },

  addHouseInfo() {
    var that = this;
    that.ifAuthUserInfo().then((res) => {
      if (res) {
        if (!this.data.showNon1) {
          wx.showToast({
            title: '请您先完成个人信息实名',
            icon: 'none',
            duration: 2000,
          });
        } else if (!this.data.isRealName) {
          wx.showToast({
            title: '请您先完成人脸识别认证',
            icon: 'none',
            duration: 2000,
          });
        } else if (!this.data.showNon2) {
          wx.showToast({
            title: '请您先绑定手机号',
            icon: 'none',
            duration: 2000,
          });
        } else {
          wx.navigateTo({
            url: '/sub1/pages/sui/house?type=sui',
          });
        }
      }
    });
  },

  getDeailHouseInfo(e) {
    var that = this;
    let index = e.currentTarget.dataset.index;
    let houseInfo = that.data.houseInfo[index];
    wx.navigateTo({
      url: '/sub1/pages/info/house_info?data=' + encodeURIComponent(JSON.stringify(houseInfo)),
    });
  },

  getHouseInfo() {
    var that = this;

    return House.getHouseInfoByUserID();
  },

  showAllHouse() {
    var that = this;
    that.setData({
      house_mini: that.data.houseInfo.length,
    });
  },
  hideAllHouse() {
    var that = this;
    that.setData({
      house_mini: 1,
    });
  },

  showAllConmany() {
    var that = this;
    that.setData({
      card_mini: that.data.cardlist.length,
    });
  },
  hideAllConmany() {
    var that = this;
    that.setData({
      card_mini: 1,
    });
  },

  showAllTax() {
    var that = this;
    that.setData({
      tax_mini: that.data.cardlist.length,
    });
  },

  hideAllTax() {
    var that = this;
    that.setData({
      tax_mini: 1,
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    //计算百分比
    var count = 0;

    wx.showLoading({
      title: '加载中...',
    });

    user.getCustomerInfo().then((res) => {
      //console.log("getCustomerInfo/",res)
      that.setData({
        showNon2: res.TEL ? true : false,
      });
      that.setData({
        mobile: api.formatePhone(res.TEL),
      });
      count++;
    });

    that.getHouseInfo().then((res) => {
      let communityName = '';
      ////console.log("11111");
      ////console.log(res);
      if (res != null && res != undefined && res != 'undefined') {
        for (let i = 0; i < res.length; i++) {
          communityName = res[i].COMMUNITYNAME;
          res[i].ADDRESS = res[i].ADDRESS.replace(communityName, '');
          res[i].LOANS = (res[i].SALEPRICE * 0.00007).toFixed(0);
          res[i].GUJIA = (res[i].SALEPRICE * 0.0001).toFixed(0);
          res[i].KEDAI = (res[i].SALEPRICE * 0.00007).toFixed(0);
        }

        that.setData({
          houseInfo: res,
          showNon6: res.length,
        });

        count++;
      } else {
        that.setData({
          houseInfo: '',
        });
      }
    });
    //企业信息

    //证件拍照
    user
      .getIdentityInfo()
      .then((res) => {
        var shengfe = res;
        //console.log("shengfe", shengfe);
        shengfe.NAME2 = api.formateName(shengfe.NAME);
        that.setData({
          identity: shengfe,
          showNon1: true,
        });
        count++;

        user
          .getRencai(that.data.identity.ID_NUMBER)
          .then((res) => {
            for (var i = 0; i < that.data.rencaidiqu.length; i++) {
              if (res.basic.talentplancity == that.data.rencaidiqu[i].key) {
                that.setData({
                  rencaiquyu: that.data.rencaidiqu[i].value,
                  showNon8: true,
                });
                count++;
              }
            }

            if (res.basic.talentlevel == '1') {
              that.setData({
                rencaidengji: '国家级',
                showNon8: true,
              });
            } else if (res.basic.talentlevel == '2') {
              that.setData({
                rencaidengji: '省级',
                showNon8: true,
              });
            } else if (res.basic.talentlevel == '3') {
              that.setData({
                rencaidengji: '市级',
                showNon8: true,
              });
            } else if (res.basic.talentlevel == '4') {
              that.setData({
                rencaidengji: '区县',
                showNon8: true,
              });
            }
          })
          .catch((err) => {
            //console.log(err)
          });

        user.getFaceVerify().then((res) => {
          that.setData({
            isRealName: true,
          });
          count++;
          that.setData({
            showNum: ((count * 100) / 9).toFixed(0),
          });
        });
        wx.hideLoading();

        Org.getLocalEnterpriseList().then((res) => {
          var cardlist1 = res;

          var listname = [];
          //consol±e.log("ide", that.data.identity);
          let isWhite = that.data.identity && that.data.identity.ATTR2 ? that.data.identity.ATTR2 : '';
          //console.log("isWhite", isWhite);
          if (cardlist1 != null && cardlist1 != undefined) {
            count++;

            if (isWhite != '0') {
              for (let i = cardlist1.length - 1; i > -1; i--) {
                if (
                  cardlist1[i].TAX_DATE != null &&
                  cardlist1[i].TAX_DATE != undefined &&
                  cardlist1[i].TAX_DATE != 'undefined'
                ) {
                  var startTime1 = '';
                  var endTime1 = '';
                  var endYear1 = parseInt(cardlist1[i].TAX_DATE.substring(0, 4));
                  var endMonth1 = parseInt(cardlist1[i].TAX_DATE.substring(4, 6));
                  var endDay1 = parseInt(cardlist1[i].TAX_DATE.substring(6, 8));
                  startTime1 =
                    cardlist1[i].TAX_DATE.substring(0, 4) +
                    '-' +
                    cardlist1[i].TAX_DATE.substring(4, 6) +
                    '-' +
                    cardlist1[i].TAX_DATE.substring(6, 8);
                  if (
                    endMonth1 == 1 ||
                    endMonth1 == 3 ||
                    endMonth1 == 5 ||
                    endMonth1 == 7 ||
                    endMonth1 == 8 ||
                    endMonth1 == 10 ||
                    endMonth1 == 12
                  ) {
                    if (endDay1 > 3) {
                      endMonth1 = endMonth1 + 1;
                      if (endMonth1 < 9) {
                        endMonth1 = '0'.concat(endMonth1);
                      } else if (endMonth1 == 10) {
                        endMonth1 = '11';
                      } else if (endMonth1 == 12) {
                        endMonth1 = '01';
                        endYear1 = ''.concat(endYear1 + 1);
                      }
                      endDay1 = ''.concat(endDay1 - 2);
                    } else {
                      endMonth1 = ''.concat(endMonth1);
                      endDay1 = '31';
                    }
                  } else if (endMonth1 == 4 || endMonth1 == 6 || endMonth1 == 9 || endMonth1 == 11) {
                    if (endDay1 > 2) {
                      endDay1 = ''.concat(endDay1 - 1);
                      if (endMonth1 < 9) {
                        endMonth1 = endMonth1 + 1;
                        if (endMonth1 < 9) {
                          endMonth1 = '0'.concat(endMonth1);
                        } else if (endMonth1 == 11) {
                          endMonth1 = '12';
                        }
                      } else {
                        endMonth1 = ''.concat(endMonth1);
                        endDay1 = '30';
                      }
                    } else {
                      endDay1 = '30';
                    }
                  } else if (endMonth1 == 2) {
                    endMonth1 = '03';
                    endDay1 = endDay1 + 1;
                    endYear1 = '' + endYear1;
                  }
                  endYear1 = ''.concat(endYear1);
                  if (endDay1.length == 1) {
                    endDay1 = '0' + endDay1;
                  }

                  endTime1 = endYear1 + '-' + endMonth1 + '-' + endDay1;
                  cardlist1[i].endTime = endTime1;
                  cardlist1[i].startTime = startTime1;
                  cardlist1[i].isTax = true;
                }
                listname.push(cardlist1[i].ORG_NAME);

                //let address1 = cardlist1[i].ORG_CODE.substring(2, 6) + '00';
                let address1 = cardlist1[i].ORG_ADDRESS + '00';
                //  let promise1 =  new Promise((resolve, reject) => {

                //   });

                // if()
                //    var reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
                //     if (reg.test(city)) {
                //             continue
                //   }

                wx.request({
                  url:
                    'https://restapi.amap.com/v3/config/district?keywords=' +
                    address1 +
                    '&subdistrict=1&key=f50fb5855088b5dee3b232e3971542f3',
                  method: 'get',
                  success(res) {
                    if (res.data.districts[0] != undefined) {
                      cardlist1[i].ORG_ADDRESS_NAME = res.data.districts[0].name;
                    }
                    that.setData({
                      cardlist: cardlist1,
                      cardname: listname,
                      busiCardList: listname,
                      falg1: '1',
                      showNon3: cardlist1.length,
                    });

                    // let districts = res.data.districts[0].districts;
                    // let column3 = []
                    // let cityName = res.data.districts[0].name
                    // that.setData({
                    //   "multiArray[2]": column3,
                    //   distractInfo: districts
                    // })
                  },
                  fail(err) {
                    ////console.log("获取地区异常", err);
                    wx.showToast({
                      title: '网络异常，请稍后重试',
                      icon: 'none',
                      mask: true,
                      duration: 2000,
                    });
                  },
                });
              }

              that.setData({
                cardlist: cardlist1,
                cardname: listname,
                busiCardList: listname,
                falg1: '1',
                showNon3: cardlist1.length,
              });

              if (that.data.taxflag && that.data.cardname.length != 0) {
                wx.request({
                  url: app.globalData.URL + 'getTaxInfos',
                  data: {
                    companyName: JSON.stringify(that.data.cardname),
                    openId: wx.getStorageSync('openid'),
                  },
                  header: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    key: Date.parse(new Date()).toString().substring(0, 6),
                    sessionId: wx.getStorageSync('sessionid'),
                    transNo: 'XC025',
                  },
                  method: 'POST',
                  success(res) {
                    //console.log("getTaxInfos", res.data);
                    if (res.data.code == 1) {
                      let decryptData = util.dect(res.data.stringData);
                      decryptData = JSON.parse(decryptData);
                      var taxInfoRes = decryptData[0].basic.aUTHLIST;
                      for (let a = 0; a < taxInfoRes.length; a++) {
                        for (let b = 0; b < that.data.cardlist.length; b++) {
                          if (taxInfoRes[a].nsrSbh == that.data.cardlist[b].ORG_CODE) {
                            taxInfoRes[a].companyName = that.data.cardlist[b].ORG_NAME;
                            taxInfoRes[a].startTime = taxInfoRes[a].createdTs.substring(0, 10);
                            let endtime = taxInfoRes[a].createdTs.substring(0, 10);
                            let endYear = parseInt(endtime.substring(0, 4));
                            let endMonth = parseInt(endtime.substring(5, 7));
                            let endDay = parseInt(endtime.substring(8, 10));
                            if (
                              endMonth == 1 ||
                              endMonth == 3 ||
                              endMonth == 5 ||
                              endMonth == 7 ||
                              endMonth == 8 ||
                              endMonth == 10 ||
                              endMonth == 12
                            ) {
                              if (endDay > 3) {
                                endMonth = endMonth + 1;
                                if (endMonth < 9) {
                                  endMonth = '0'.concat(endMonth);
                                } else if (endMonth == 10) {
                                  endMonth = '11';
                                } else if (endMonth == 12) {
                                  endMonth = '01';
                                  endYear = ''.concat(endYear + 1);
                                }
                                endDay = ''.concat(endDay - 2);
                              } else {
                                endMonth = ''.concat(endMonth);
                                endDay = '31';
                              }
                            } else if (endMonth == 4 || endMonth == 6 || endMonth == 9 || endMonth == 11) {
                              if (endDay > 2) {
                                endDay = ''.concat(endDay - 1);
                                if (endMonth < 9) {
                                  endMonth = endMonth + 1;
                                  if (endMonth < 9) {
                                    endMonth = '0'.concat(endMonth);
                                  } else if (endMonth == 11) {
                                    endMonth = '12';
                                  }
                                } else {
                                  endMonth = ''.concat(endMonth);
                                  endDay = '30';
                                }
                              } else {
                                endDay = '30';
                              }
                            } else if (endMonth == 2) {
                              endMonth = '03';
                              endDay = endDay + 1;
                              endYear = '' + endYear;
                            }
                            endYear = ''.concat(endYear);
                            if (endDay.length == 1) {
                              endDay = '0' + endDay;
                            }

                            taxInfoRes[a].endTime = endYear + '-' + endMonth + '-' + endDay;
                            cardlist1[b].startTime = taxInfoRes[a].startTime;
                            cardlist1[b].endTime = taxInfoRes[a].endTime;
                            cardlist1[b].startTime = taxInfoRes[a].startTime;
                            cardlist1[b].isTax = true;
                            cardlist1[b].channelID = taxInfoRes[a].channelID;
                          }
                        }
                      }

                      that.setData({
                        taxInfos: taxInfoRes,
                        cardlist: cardlist1,
                      });
                    }
                  },
                  error(res) {},
                });
              } else {
              }
            } else {
              var date1 = new Date();
              var date2 = new Date(date1);
              date2.setDate(date1.getDate() + 30);
              let endTime =
                date2.getFullYear() +
                '-' +
                util.formatNumber(date2.getMonth() + 1) +
                '-' +
                util.formatNumber(date2.getDate());
              //console.log("税务授权白名单");
              cardlist1.forEach((v) => {
                v.isTax = true;
                v.startTime = util.formatTime(date1);
                v.channelID = 8118;
                v.endTime = endTime;
              });

              that.setData({
                cardlist: cardlist1,
                falg1: '1',
                showNon3: cardlist1.length,
              });
            }
          }
        });
        return;
      })
      .catch((err) => {
        that.setData({
          showNon1: false,
        });
        wx.hideLoading();
      });
  },

    //获取手机号
    set_2: function() {
        var that = this;
        that.ifAuthUserInfo().then((res) => {
            //console.log(res);
            if (res) {
                if (!this.data.mobile) {
                    wx.showToast({
                        title: '请您先绑定手机号',
                        icon: 'none',
                    });
                    return;
                }
                wx.navigateTo({
                    //url: 'set_2?url=' + this.data.url + '&type=' + this.data.type,
                    url: '../info/identify?url=' + this.data.url + '&type=' + this.data.type + '&status=' + this.data.status,
                });
            }
        });
    },

    identifyDetail: function() {
        var that = this;
        that.ifAuthUserInfo().then((res) => {
            if (res) {
                wx.navigateTo({
                    //url: 'set_2?url=' + this.data.url + '&type=' + this.data.type,
                    url: '../info/identify?url=' + this.data.url + '&type=' + this.data.type + '&status=' + this.data.status,
                });
            }
        });
    },

  mobileInfo: function () {
    var that = this;
    that.ifAuthUserInfo().then((res) => {
      if (res) {
        wx.navigateTo({
          //url: 'set_2?url=' + this.data.url + '&type=' + this.data.type,
          url: '../info/set_1_show',
        });
      }
    });
    // if (app.globalData.userInfo == null) {
    //   wx.showToast({
    //     title: "请您先授权登录",
    //     icon: "none",
    //     duration: 2000,
    //   });
    // } else {
    //     wx.navigateTo({
    //         //url: 'set_2?url=' + this.data.url + '&type=' + this.data.type,
    //         url: "../info/set_1_show",
    //       });
    // }
  },

  set_company: function () {
    var that = this;
    that.ifAuthUserInfo().then((res) => {
      if (res) {
        if (!this.data.showNon1) {
          wx.showToast({
            title: '请您先完成个人信息实名',
            icon: 'none',
            duration: 2000,
          });
        } else if (!this.data.isRealName) {
          wx.showToast({
            title: '请您先完成人脸识别认证',
            icon: 'none',
            duration: 2000,
          });
        } else if (!this.data.showNon2) {
          wx.showToast({
            title: '请您先绑定手机号',
            icon: 'none',
            duration: 2000,
          });
        } else {
          wx.navigateTo({
            //url: 'set_2?url=' + this.data.url + '&type=' + this.data.type,
            url: '../info/company_info?url=' + this.data.url + '&type=' + this.data.type,
          });
        }
      }
    });
  },

  set_tax: function (e) {
    var that = this;
    if (!this.data.isRealName) {
      wx.showToast({
        title: '请您先完成人脸识别认证',
        icon: 'none',
        duration: 2000,
      });
    } else if (!this.data.showNon1) {
      wx.showToast({
        title: '请您先完成个人信息实名',
        icon: 'none',
        duration: 2000,
      });
    } else if (!this.data.showNon2) {
      wx.showToast({
        title: '请您先绑定手机号',
        icon: 'none',
        duration: 2000,
      });
    } else if (this.data.cardlist.length == 0) {
      wx.showToast({
        title: '请您先添加企业信息',
        icon: 'none',
        duration: 2000,
      });
    } else {
      wx.navigateTo({
        //url: 'set_2?url=' + this.data.url + '&type=' + this.data.type,
        url: '../info/tax_list', //?companyName=' + e.currentTarget.dataset.orgname,
      });
    }
  },

  company_detail: function (e) {
    let index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../info/company_detail?companyInfo=' + JSON.stringify(this.data.cardlist[index]),
    });
  },

  set_rencai: function (e) {
    var that = this;
    if (!this.data.showNon1) {
      wx.showToast({
        title: '请您先完成个人信息实名',
        icon: 'none',
        duration: 2000,
      });
    } else if (!this.data.showNon2) {
      wx.showToast({
        title: '请您先绑定手机号',
        icon: 'none',
        duration: 2000,
      });
    } else if (!this.data.isRealName) {
      wx.showToast({
        title: '请您先完成人脸识别认证',
        icon: 'none',
        duration: 2000,
      });
    } else {
      wx.navigateTo({
        url: '../info/set_rencai?talentname=' + e.currentTarget.dataset.name,
      });
    }
  },

  get_tax: function () {
    var that = this;
  },
  getPhoneNumber3(e) {
    var that = this;
    wx.showLoading({
      title: '获取中...',
    });
    api
      .getPhoneNumber(e)
      .then((phone) => {
        console.log(phone);
        if (phone && phone != null) {
          that.setData({
            mobile: phone,
            showNon2: true,
          });
        }
      })
      .catch((err) => {
        console.log('解密手机号错误', err);

        if (err.code === '1010') {
          let userInfo = JSON.parse(err.stringData);
          wx.checkIsSupportFacialRecognition({
            success() {
              wx.startFacialRecognitionVerifyAndUploadVideo({
                name: userInfo[0].REAL_NAME, //身份证名称
                idCardNumber: userInfo[0].ID_CARD, //身份证号码
                checkAliveType: 2,
                success: function (res) {
                  console.log('人脸success', res);
                },
                fail: function (err) {
                  console.log('人脸fail', err);
                },
                complete: (res) => {
                  console.log('complete', res);

                   api.getWeChatFaceResult(res.verifyResult).then(res=>{
                    user
                      .addCustomer(
                        userInfo[0].REAL_NAME,
                        userInfo[0].ID_CARD,
                        userInfo[0].TEL,
                        err.code,
                        that.data.dept,
                      )
                      .then((res) => {
                        console.log(res);
                        app.globalData.int_id = res.int_id || app.globalData.int_id;

                        that.setData({
                          showNon2: true,
                          mobile: api.formatePhone(userInfo[0].TEL),
                          count: that.data.count++,
                        });
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                                    }).catch(err=>{
                  
                                    })
                  return;
                  if (res.errCode === 0) {
                    user
                      .addCustomer(
                        userInfo[0].REAL_NAME,
                        userInfo[0].ID_CARD,
                        userInfo[0].TEL,
                        err.code,
                        that.data.dept,
                      )
                      .then((res) => {
                        console.log(res);
                        app.globalData.int_id = res.int_id || app.globalData.int_id;

                        that.setData({
                          showNon2: true,
                          mobile: api.formatePhone(userInfo[0].TEL),
                          count: that.data.count++,
                        });
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  } else {
                    console.log('msg', res.errCode + res.errMsg);
                  }
                },
              });
            },
            fail(res) {
              user.addFaceInfo('1', '设备不支持人脸').then((res) => {});
              that.setData({
                facialType: 'bank',
              });
              console.log(res);
              wx.showToast({
                title: '您的微信版本暂不支持人脸识别，请您先升级。',
                icon: 'none',
              });
            },
          });
        } else if (err.code === '1000' || err.code === '1001') {
          wx.showModal({
            title: '提示',
            content: '手机号已被使用，是否进行身份认证',
            showCancel: true,
            cancelText: '放弃',
            cancelColor: '#000000',
            confirmText: '确定',
            //   confirmColor: '#3CC51F',
            success: (result) => {
              if (result.confirm) {
                const confilctUserInfo = JSON.parse(err.stringData);
                console.log(confilctUserInfo);
                // cosnt custinfo={
                //     TEL:
                // }
                wx.navigateTo({
                  url: `/sub1/pages/info/user_info?custinfo=${JSON.stringify(confilctUserInfo[0])}&type=2&dept=${
                    this.data.dept
                  }`,
                });
              } else {
                //
              }
            },
            fail: () => {},
            complete: () => {},
          });
        } else {
          wx.showToast({
            title: err.msg,
            icon: 'none',
          });
        }
      });
    wx.hideLoading();
  },

  getSessionKey() {
    var that = this;
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          wx.request({
            url: app.globalData.URL + 'getwechatid',
            data: {
              js_code: res.code,
              isProxy: false,
            },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded', // 默认值
              key: Date.parse(new Date()).toString().substring(0, 6),
            },
            success: (res) => {
              if (res.data != undefined) {
                wx.setStorageSync('openid', res.data.openid);
                wx.setStorageSync('key', res.data.key);
                wx.setStorageSync('sessionid', res.data.session_key);
              }
              resolve();
            },
          });
        },
        fail: (err) => {
          reject(err);
        },
      });
    });
  },

  nothing() {
    wx.showToast({
      title: '敬请期待',
      icon: 'none',
      duration: 2000,
    });
  },

  //统一码失焦
  blurCity: function (e) {
    var that = this;
    ////console.log(that.data.cardlist);
    ////console.log(e);
    if (
      e.currentTarget.dataset.orgname == undefined ||
      e.currentTarget.dataset.orgname == null ||
      e.currentTarget.dataset.orgname.trim() == '' ||
      e.currentTarget.dataset.orgname.length < 18
    ) {
      return;
    }

    var that = this;
    var provinceID = e.currentTarget.dataset.orgname.substring(2, 4);
    var cityID = e.currentTarget.dataset.orgname.substring(2, 6);

    if (provinceID == '32' || provinceID == '44') {
      ////console.log("准备授权");
    } else {
      ////console.log(provinceID);
      wx.showModal({
        title: '提示',
        content: '该地区请通过税务官方网站等渠道进行授权',
        showCancel: false, //是否显示取消按钮
        success: function (res) {},
        fail: function (res) {}, //接口调用失败的回调函数
        complete: function (res) {}, //接口调用结束的回调函数（调用成功、失败都会执行）
      });
      return;
    }
    if (cityID == 3305 || cityID == 3306 || cityID == 3300) {
      //浙江绍兴，湖州默认为杭州
      cityID = 3301;
    } else if (cityID == 3200) {
      //江苏默认为南京
      cityID = 3201;
    } else if (cityID == 4400) {
      //广东默认为深圳
      cityID = 4403;
    } else if (cityID == 3100) {
      //上海
      cityID = 3101;
    }
    var province = that.data.org_cities[provinceID];
    var city = that.data.org_cities[cityID];

    // if (province == undefined || city == undefined){
    // that.setData({
    // //isArea:false
    // })
    // wx.showModal({
    // title: '提示',
    // content: '您所在的区域不接受此项业务办理',
    // showCancel: false,//是否显示取消按钮
    // success: function (res) {

    // },
    // fail: function (res) { },//接口调用失败的回调函数
    // complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
    // })
    // return;
    // }
    that.setData({
      'form.orgID': e.currentTarget.dataset.orgname,
      'form.province': province,
      'form.city': city,
      'form.provinceCode': provinceID,
      'form.cityCode': cityID,
      provinceName: province,
      cityName: city,
      isArea: true,
    });

    wx.navigateTo({
      // url: 'tax?proCode=' + that.data.form.provinceCode + "0000&cityCode=" + that.data.form.cityCode + '00&creditCode=' + params.orgID + '&str=' + applyData + "&uid=" + res.data.stringData + "&formId=" + e.detail.formId
      url:
        '../info/tax?proCode=' +
        that.data.form.provinceCode +
        '0000&cityCode=' +
        that.data.form.cityCode +
        '00' +
        '&formId=' +
        e.detail.formId +
        '&reurl=' +
        that.data.reurl +
        '&creditCode=' +
        e.currentTarget.dataset.orgname,
    });
  },
});
