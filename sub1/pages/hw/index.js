import util from '../../../utils/util';
import requestP from '../../../utils/requsetP';

import api from '../../../utils/api';
import user from '../../../utils/user';

import encr from '../../../utils/encrypt/encrypt.js';
import log from '../../../log.js';
import Org from '../../../api/Org';
import requestYT from '../../../api/requestYT';
import Order from '../../../api/Order';
import User from '../../../utils/user';
import { getRegionCode2 } from '../../../api/region';

var date = new Date();
var aeskey = encr.key;
var app = getApp();

Page({
  data: {
    cndUrl: app.globalData.CDNURL,
    preffixUrl: app.globalData.URL,
    userInfoLevel: '-1', //用户身份证等级
    steps: [
      {
        text: '手机号码',
        activeIcon: 'success',
      },
      {
        text: '人脸识别',
        activeIcon: 'success',
      },
      {
        text: '证件信息',
        activeIcon: 'success',
      },
    ],
    questions: [
      {
        desc: '银行官方网站、微信公众号、电子银行等；',
        value: 'A',
      },
      {
        desc: '银行网点；',
        value: 'B',
      },
      {
        desc: '广播、电视、报刊、轨道交通、户外广告等；',
        value: 'C',
      },
      {
        desc: '政府、园区、协会等机构，或组织的银企对接会；',
        value: 'D',
      },
      {
        desc: '亲戚、朋友、生意伙伴、合作机构等熟人介绍；',
        value: 'E',
      },
      {
        desc: '银行工作人员主动营销（电话、微信、上门拜访等）；',
        value: 'F',
      },
      {
        desc: '其他。',
        value: 'G',
      },
    ],
    channelType: '',
    extraChannelInfo: '',
    hasSubmitNode2: false, //是否提交节点2
    isSubmit: false, //提交1670
    submit0652: true, //是否提交0652 只有倒数10s会查一次
    canSubmitApply: true, //提交测额按钮
    enterAddrShow: false,
    showBaseEnter: false,
    showApplyTypeBox: false,
    showHouseBox: false,
    showTaxlevelBox: false,
    showAuthDocunments: false,
    showExtraInfo: false, //填写法人、股东、实际控制人信息
    showTaxImg: false, //展示税务
    sendAuthDoc: false, //发送授权
    canSubmitNode5: true,
    flag_0: true,
    flag_1: true,
    flag_2: true,
    flag_3: true,
    flag_4: true,
    flag_5: true,
    flag_6: true,
    flag_7: true,
    isWhite: '1',
    isWhite1674: '0', //0/N 1/Y
    isTalent: '1',
    isHouse: '1',
    multiIndex2: [0, 0, 0], //以下省市选择过度
    multiArray2: [],
    enterpriseCardInfo: [], //本地名片表
    enterpriseAdded: [], //下拉列表显示
    houseChoosed: [],
    result: [], //已查看的授权书
    applyTimeArray: ['36个月', '24个月', '12个月'],
    cityCanApply: ['32'],
    noNeedTaxCitys: ['11', '31', '33'], //不需要税务授权地区
    day_time: date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日',
    expirationTime: date.getFullYear() + 1 + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日',
    expirationTime2: {
      year: date.getFullYear() + 3,
      mounth: date.getMonth() + 1,
      day: date.getDate(),
    },
    day_time2: date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate(),
    applyType: '3', // 申请类型
    applyNum: '',
    applyTime: '12',
    applyMaxNum: '500',
    step: '0', //当前节点号
    times: '60', //倒计时
    enterWorkStation: '', //经营地址
    enterDetailAddress: '', //详细地址
    order_no: '', //订单号
    sed_id: '', //id号
    recommendOpenId: '', //推荐人
    platformUserId: '', //平台主人
    cardInfo: {}, //名片信息
    customerInfo: {}, //申请人信息
    enterpriseInfo: {}, //企业信息
    loanType: '', //0企业法人 1个人法人 2企业股东 3个人股东 4实际控制人
    plaName: '', //后台补充后返回的平台主人名称
    plaEmpno: '', //后台补充后返回的平台主人号
    applyerType: '', //身份人类型 0 法人 1股东 2经办人
    legalInfo: {}, //法人信息
    actualShareholderInfo: {}, //实际控制人信息
    shareholderInfo: {}, //股东信息
    fillsInInfo: {}, //申请人信息
    applyerInfo: {}, //借款人信息
    employeeNumber: '', //企业从业人数
    loanType1674: '', //贷款类型
    depositBankName: '', //开户行
    batchID: '', // 人脸影像批次号
    backBtnName: -1,
    lastPage: '',
    multiArray3: [],
    showRegionPicker: false,
    applyBorr: '0',
    loanType: '20',
    loanTpyeName: '个人经营贷（法人代表）',
  },

  onLoad: function (options) {
    //回显订单信息
    this.initOnloadData(options);
  },

  async onShow() {
    var that = this;
    if (that.data.step == '0') {
      var a =  wx.getStorageSync('channelInfo');
      // console.log("data----------")
      // console.log(a);
      var datahh = JSON.parse(a.data);
      // console.log(datahh);
      // console.log(datahh.amount);
      // console.log(datahh.companyInfo);
      // console.log(datahh.companyInfo.companyName);
      // console.log(datahh.authOrderNo);
      // const { amount,authOrderNo, companyInfo = {} } = wx.getStorageSync('channelInfo');
      try {
        var amount = datahh.amount;
        var companyInfo = datahh.companyInfo;
        var authOrderNo = datahh.authOrderNo;
        if (!amount) {
          throw new Error('渠道未携带贷款金额信息');
        }
        if (!companyInfo.companyName) {
          throw new Error('渠道未携带企业信息');
        }
        this.setData({
          applyNum: amount,
          enterpriseInfo: companyInfo,
          authOrderNo: authOrderNo,
        });
        that.initOnShowData();
      } catch (error) {
        wx.showModal({
          title: '提示',
          content: error.message,
          showCancel: false,
          confirmText: '确定',
          success: (result) => {
            if (result.confirm) {
              wx.navigateBack({
                delta: 1,
              });
            }
          },
          fail: () => {},
          complete: () => {},
        });
      }
    } else {
      user.getFaceVerify().then((res) => {
        that.setData({
          batchID: res.BATCH_ID || '',
        });
      });
    }
    // 税务通过返回
    if (that.data.taxflag) {
      this.finishStep45();
    }
  },

  onConfirm(e) {
    let { enterpriseInfo } = this.data;
    let region = e.detail.value;
    let adcode = region[2].adcode;
    enterpriseInfo.province = adcode.substring(0, 2);
    enterpriseInfo.city = adcode.substring(0, 4);
    enterpriseInfo.country = adcode;
    let enterWorkStation = region.map((e) => e.name).join('');
    this.setData({
      enterWorkStation,
      enterpriseInfo,
    });
    this.onClose();
  },

  onChange(e) {
    console.log(e);
    const { picker, value, index } = e.detail;
    switch (index) {
      case 0:
        picker.setColumnValues(1, value[0].districts);
        picker.setColumnValues(2, value[0].districts[0].districts);
        break;
      case 1:
        let city = value[0].districts.find((e) => e.adcode === value[1].adcode);
        picker.setColumnValues(2, city.districts);
        break;
      default:
        break;
    }
  },

  async selectRegion(regionCode) {
    const { enterpriseInfo, multiArray3 } = this.data;

    if (multiArray3.length > 0) {
      this.setData({
        showRegionPicker: true,
      });
      return;
    }
    regionCode = enterpriseInfo.orgCode ? enterpriseInfo.orgCode.substring(2, 8) : '';
    const arr = await getRegionCode2(regionCode);
    console.log('arr', arr);
    this.setData({
      multiArray3: arr,
      showRegionPicker: true,
    });
  },

  readingCoundDown() {
    let time = 5;
    this.setData({
      backBtnName: time,
    });
    let cutDown = setInterval(() => {
      time--;
      console.log(time);
      if (time < 1) {
        clearInterval(cutDown);
      }
      this.setData({
        backBtnName: time,
      });
    }, 1000);
  },

  showAuthList() {
    let config = {
      20: '法人',
      21: '法人',
      22: '股东',
      23: '实际控制人',
      30: '企业',
    };
    let authSteps = [];
    ['20', '30'].forEach((e) => {
      if (config[e]) {
        authSteps.push({
          text: `${config[e]}授权`,
          activeIcon: 'success',
        });
      }
    });

    this.setData({
      authSteps,
    });
  },

  initOnloadData(options) {
    var that = this;
    if (options.msg) {
      wx.showModal({
        title: '提示',
        content: '检测到您最近一笔订单申请失败,请重试',
        showCancel: false,
        confirmText: '确定',
      });
    }

    if (options.applyInfo) {
      let applyInfo = JSON.parse(decodeURIComponent(options.applyInfo));
      let nodeInfo = JSON.parse(applyInfo.WDGL1661_REQ);
      let pinfo = applyInfo.WDGL1663_REQ ? JSON.parse(applyInfo.WDGL1663_REQ) : {};

      that.setData({
        legalInfo: pinfo.fr ? pinfo.fr : {},
        applyerInfo: pinfo.jk ? pinfo.jk : {},
      });

      const { order_no } = nodeInfo.node1;
      const { enterpriseInfo, enterWorkStation, enterDetailAddress, applyerType, isTalent } = nodeInfo.node2;

      if (applyInfo.NODE >= '2') {
        that.setData({
          isTalent,
          applyerType,
          enterpriseInfo,
          enterWorkStation,
          enterDetailAddress,
          order_no,
          sed_id: applyInfo.SED_ID,
          step: applyInfo.NODE,
        });
      }

      if (applyInfo.NODE >= '3') {
        let { applyNum, applyTime, applyType } = nodeInfo.node3;
        that.setData({
          applyNum,
          applyTime,
          applyType,
        });
      }

      if (applyInfo.NODE >= '4') {
        let { day_time2 } = nodeInfo.node4;
        that.setData({
          day_time2,
        });
      }

      if (applyInfo.NODE >= '5') {
        let { loanType, applyBorr, isTalent } = nodeInfo.node5;
        that.setData({
          loanType,
          applyBorr,
          isTalent,
        });
        that.showAuthList();
      }

      that.toStep('step' + that.data.step);
      console.log('回显成功');
      log.info('回显成功');
      user
        .getCustomerInfo()
        .then((res) => {
          that.setData({
            customerInfo: res,
          });
        })
        .then(() => {
          return user.getIdentityInfo();
        })
        .then((res) => {
          let customerInfo = Object.assign(that.data.customerInfo, res);
          that.setData({
            customerInfo,
            userInfoLevel: '2',
          });
        });
    }
  },

  async initOnShowData() {
    var that = this;
    // 个人信息三级认证
    user
      .getCustomerInfo()
      .then((res) => {
        that.setData({
          customerInfo: res,
        });

        if (res.TEL) {
          that.setData({
            userInfoLevel: '0',
          });
        } else {
          return Promise.reject();
        }

        // const { userInfo = {} } = wx.getStorageSync('channelInfo');

        var b =  wx.getStorageSync('channelInfo');

      var datahhb = JSON.parse(b.data);
      var userInfo = datahhb.userInfo;
      console.log('datahh--------------');
      console.log(datahhb);
      console.log(userInfo);
        if (userInfo.name && userInfo.name !== res.REAL_NAME) {
          wx.showModal({
            title: '提示',
            content: '渠道携带用户信息与小程序认证信息不一致,请前往小程序个人信息管理修改用户信息',
            showCancel: false,
            confirmText: '确定',
            success: (result) => {
              if (result.confirm) {
                // wx.navigateBack({
                //   delta: 1,
                // });
                wx.switchTab({
                  url: '/pages/mine/mine',
                });
              }
            },
            fail: () => {},
            complete: () => {},
          });
          return Promise.reject();
        }

        if (res.REAL_NAME) {
          return user.getFaceVerify();
        } else {
          //添加用户详细
          return Promise.reject();
        }
      })
      .then((res) => {
        console.log('face:', res);
        that.setData({
          userInfoLevel: '1',
          batchID: res.BATCH_ID || '',
        });
        //OCR验证
        return user.getIdentityInfo();
      })
      .then(async (res) => {
        const customerInfo = Object.assign(that.data.customerInfo, res);
        that.setData({
          customerInfo,
          step: that.data.step == '0' ? '1' : that.data.step,
          userInfoLevel: '2',
        });

        if (that.data.step === '1') {
          try {
            await that.chooseEnter(null, this.data.enterpriseInfo.companyName);
            // await that.submitNode2();
          } catch (error) {
            wx.hideLoading();
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
            console.log(error);
          }
        }
      })
      .catch((err) => {});
  },

  /**
   * 输入借款金额
   * @param {*} e
   */
  numInput(e) {
    var that = this;
    that.setData({
      applyNum: parseInt(e.detail.value, 10) ? parseInt(e.detail.value, 10) + '' : '',
    });
  },

  employeeNumberInput(e) {
    this.setData({
      employeeNumber: parseInt(e.detail.value, 10) ? parseInt(e.detail.value, 10) : '',
    });
  },

  /**
   * 录入详细地址
   * @param {*} e
   */
  enterDetailAddressInput(e) {
    var that = this;
    that.setData({
      enterDetailAddress: e.detail.value
        .replace(/\$/g, '')
        .replace(/\#/g, '')
        .replace(/\%/g, '')
        .replace(/\¥/g, '')
        .replace(/\｜/g, '')
        .replace(/\‖/g, '')
        .replace(/\|/g, '')
        .replace(/\n/g, '')
        .replace(/\s/g, '')
        .replace(/\&/g, '')
        .replace(' ', ''),
    });
  },

  /**
   * 电话联系客户经理
   */
  openPhoneDialog() {
    var that = this;
    let cardInfo = that.data.cardInfo;
    if (cardInfo.TEXT5 != '0') {
      api.call(cardInfo.PHONE, cardInfo.USERNAME);
    } else {
      wx.showToast({
        title: '敬请期待！',
        icon: 'none',
        mask: true,
        duration: 1000,
      });
    }
  },

  /**
   * 跳转特定步骤
   * @param {*} stepname
   */
  toStep(stepname) {
    let selector = '#' + stepname;
    wx.pageScrollTo({
      selector: selector,
      success() {},
    });
  },

  getRencai(id) {
    var that = this;
    user.getRencai(id).then(() => {
      that.setData({
        isTalent: '0',
      });
    });
  },

  /**
   * 阅读协议
   */
  AuthDocuments() {
    let { applyerType, loanType } = this.data;

    if (applyerType === '2' || (applyerType === '1' && loanType !== '21')) {
      this.subscribeMessage();
    } else {
      this.setData({
        showAuthDocunments: true,
      });
    }
  },

  /**
   * 步骤4 跳转授权页面税务授权
   * @param {*} e
   */
  async AuthTax(e) {

    var that = this;
    let version = wx.getAccountInfoSync().miniProgram.envVersion;

    if (version === 'develop') {
      that.finishStep45();
      return;
    }

    that.validateTax(e);
  },

  async finishStep45() {
    const { applyBorr, loanType, isTalent, day_time2, legalInfo, applyerInfo } = this.data;

    const nodeInfo = JSON.stringify({
      node4: {
        day_time2,
      },
      node5: {
        isTalent,
        applyBorr,
        loanType,
        authCode: '05',
      },
    });
    await this.updateNodeInfo('45', nodeInfo);
    this.showAuthList();
    this.setData({
      step: '5',
    });
    this.toStep('step' + this.data.step);
    return;
  },

  /**
   * 提交页面企业信息
   * @param {*} e
   */
  submitNode2() {
    var that = this;
    console.log(that.data.enterpriseInfo,'提交页面企业信息');
    try {
      if (!that.data.enterpriseInfo.ORG_NAME) {
        throw new Error('请填写公司名称');
      }
      if (!that.data.enterpriseInfo.ORG_CODE) {
        throw new Error('请输入企业统一码');
      }
      if (!that.data.enterWorkStation) {
        throw new Error('请选择经营地址');
      }
      if (!that.data.enterDetailAddress) {
        throw new Error('请填写详细地址');
      }

      that.createApply();
    } catch (error) {
      wx.showToast({
        icon: 'none',
        title: error.message || error,
        duration: 1500,
        mask: false,
      });
    }
  },

  /**
   * 提交网贷校验信息
   */
  async createApply() {
    var that = this;

    if (that.data.hasSubmitNode2) {
      wx.showToast({
        title: '请勿重复提交',
        icon: 'none',
        duration: 1500,
        mask: true,
      });
      return;
    }

    that.setData({
      hasSubmitNode2: true,
    });

    try {
      wx.showLoading({
        title: '校验中',
        mask: true,
      });

      await that.addApplyInfo().then((res) => {
        that.setData({
          order_no: res.order_no,
          sed_id: res.sed_id,
          step: 3,
        });
        that.toStep('step' + that.data.step);
      });
    } catch (err) {
      console.log(err);
      wx.hideLoading();
      wx.showModal({
        title: '提示',
        content: err.message || err,
        confirmText: '确定',
      });
      that.setData({
        hasSubmitNode2: false,
      });
    } finally {
      wx.hideLoading();
    }
  },

  // 70接口成功后添加企业
  addCompany() {
    var that = this;
    let enterpriseAdded = that.data.enterpriseAdded;
    for (let i = 0; i < enterpriseAdded.length; i++) {
      if (that.data.enterpriseInfo.ORG_CODE == enterpriseAdded[i].ORG_CODE) {
        return;
      }
    }
    let str = JSON.stringify({
      id_org_id: 'id',
      string_org_name: that.data.enterpriseInfo.ORG_NAME, //企业名称
      string_org_code: that.data.enterpriseInfo.ORG_CODE, //统一吗
      string_org_address: that.data.enterpriseInfo.city, //企业地址
      string_artificial_name: that.data.enterpriseInfo.rYNAME, //法人姓名
      string_org_tel: '', //申请人电话
      string_user_id: wx.getStorageSync('openid'),
    });
    str = util.toCDB(
      str.replace(/\(/g, '-括号').replace(/\（/g, '-括号').replace(/\)/g, '括号-').replace(/\）/g, '括号-'),
    );
    var data = util.enct(str) + util.digest(str);
    wx.request({
      url: app.globalData.URL + 'add/card2',
      data: {
        data: data,
      },
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        key: Date.parse(new Date()).toString().substring(0, 6),
        sessionId: wx.getStorageSync('sessionid'),
        transNo: 'XC007',
      },
      success(res) {
        if (res.data.msg == 'success') {
        }
      },
    });
  },

  /**
   * 阅读协议
   * @param {*} e
   */
  readDocument(e) {
    var that = this;
    if (e.detail.indexOf('99') > -1) {
      if (e.detail.length == 5) {
        that.setData({
          result: e.detail,
          canSubmitApply: false,
        });
      } else {
        wx.showModal({
          title: '提示',
          content: '请先阅读相关协议',
          showCancel: false,
          confirmText: '确定',
        });
      }
    } else {
      that.setData({
        canSubmitApply: true,
      });
      that.setData({
        result: e.detail,
      });
    }
  },

  /**
   * 订阅通知
   */
  subscribeMessage() {
    var that = this;
    if (wx.requestSubscribeMessage) {
      wx.requestSubscribeMessage({
        tmplIds: ['nZjEYoMUyZ3A6zNxRgWHG_fHteF7AJnrAGDLEG_ybZo'],
        success(res) {
          let templateId = res.nZjEYoMUyZ3A6zNxRgWHG_fHteF7AJnrAGDLEG_ybZo;
          if (templateId == 'accept') {
            that.actionsBeforeSubmit();
          } else {
            wx.showModal({
              showCancel: true,
              cancelText: '取消',
              cancelColor: '#000000',
              confirmText: '确认',
              content: '您已拒绝订阅消息授权，将无法获取申请结果通知',
              showCancel: true,
              success: (result) => {
                if (result.confirm) {
                  that.actionsBeforeSubmit();
                } else {
                }
              },
              title: '提示',
            });
          }
        },
        fail(err) {
          if (err.errCode == '20004') {
            that.guideOpenSubscribeMessage();
          } else {
            log.info('订阅通知错误' + JSON.stringify(err));
            that.actionsBeforeSubmit();
          }
        },
      });
    } else {
      that.actionsBeforeSubmit();
    }
  },

  async actionsBeforeSubmit() {
    try {
      if (!this.data.batchID) {
        await api.getImageBatchId(this.data.customerInfo.REAL_NAME, this.data.customerInfo.ID_CARD);
        this.setData({
          batchID: 'success',
        });
      }
      console.log('提交1680');
      //   return;
      await this.submitApply();
    } catch (error) {
      console.log(error);
      wx.showModal({
        title: '提示',
        content: error.message || error,
        showCancel: false,
        confirmText: '确定',
        success: (result) => {
          if (result.confirm) {
          }
        },
      });
    }

    //申请人为法人时 是否上传影像
  },

  /**
   * 提交测额
   */
  submitApply() {
    var that = this;
    if (that.data.isSubmit) {
      wx.showToast({
        title: '请勿请复提交',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
      });
      return;
    } else {
      that.setData({
        isSubmit: true,
      });
    }
    that.setData({
      step: 6,
    });
    that.toStep('step' + that.data.step);
    that.onClose();
    var times = 60;
    var interval = setInterval(() => {
      times--;
      if (times == 0) {
        clearInterval(interval);
      } else if (times == 10) {
        that.setData({
          times: times,
        });
        if (that.data.submit0652) {
          that.setData({
            submit0652: false,
          });
          Order.getApplyStatus(that.data.order_no, that.data.sed_id)
            .then((res) => {
              clearInterval(interval);
              if (res.resultCode === '0000') {
                if (res.Obligate3 === '') {
                  that.setData({
                    step: '5',
                  });
                  that.toStep('step' + that.data.step);
                  wx.showModal({
                    title: '提示',
                    content: '测额失败,请重试',
                    showCancel: false,
                    confirmText: '确定',
                    success: (result) => {
                      if (result.confirm) {
                        that.setData({
                          isSubmit: false,
                        });
                      }
                    },
                    fail: () => {},
                    complete: () => {},
                  });
                } else {
                  wx.redirectTo({
                    url: '/pages/mine/mine_list',
                  });

                  //   that.setData({
                  //     step: '7',
                  //   });
                }
              } else {
                return Promise.reject('查询订单信息失败,请检查网络');
              }
            })
            .catch((err) => {
              wx.showToast({
                title: err.message || err,
                icon: 'none',
                image: '',
                duration: 1500,
                mask: false,
              });
            });
        }

        //查询网贷订单状态
      } else {
        that.setData({
          times: times,
        });
      }
    }, 1000);
    that
      .measure()
      .then((res) => {
        log.setFilterMsg(that.data.customerInfo.REAL_NAME);
        log.info('80测额结果' + JSON.stringify(res));
        console.log('80测额结果' + JSON.stringify(res));

        if (
          typeof res != 'undefined' &&
          typeof res.body != 'undefined' &&
          typeof res.body.STATUS != 'undefined' &&
          res.body.STATUS == 'net.connect.error'
        ) {
          log.info('80请求超时');
        } else if (
          typeof res != 'undefined' &&
          typeof res.body != 'undefined' &&
          typeof res.body.STATUS != 'undefined' &&
          res.body.STATUS != '1' &&
          res.body.STATUS != 'net.connect.error'
        ) {
          clearInterval(interval);
          that.setData({
            step: 5,
          });
          that.setData({
            isSubmit: false,
          });
          wx.showModal({
            title: '提示',
            content: res.body.MSG,
            showCancel: false,
            confirmText: '确定',
            success: (result) => {
              if (result.confirm) {
              }
            },
          });
        } else {
          wx.redirectTo({
            url: '/pages/mine/mine_list',
          });
          //   that.setData({
          //     step: '7',
          //   });
          clearInterval(interval);
        }
      })
      .catch((err) => {
        clearInterval(interval);
        log.setFilterMsg(that.data.customerInfo.REAL_NAME);
        log.info('80测额异常' + JSON.stringify(err));
        console.log('80测额异常' + JSON.stringify(err));

        if (err.errMsg && err.errMsg.indexOf('request:fail') > -1) {
          wx.showModal({
            title: '提示',
            content: '网络异常,请稍后再试',
            showCancel: false,
            confirmText: '确定',
            success: (result) => {
              if (result.confirm) {
                wx.navigateBack();
              }
            },
          });
          return;
        }

        that.setData({
          step: 5,
        });
        that.setData({
          isSubmit: false,
        });
        wx.showModal({
          title: '提示',
          content: err,
          showCancel: false,
          confirmText: '确定',
          success: (result) => {
            if (result.confirm) {
            }
          },
        });
      });
  },

  /**
   * 70接口 提交网贷校验信息
   */
  addApplyInfo() {
    var that = this;
    let customerInfo = that.data.customerInfo;
    let ent = that.data.enterpriseInfo;
    let node_info = JSON.stringify({
      node1: {
        authOrderNo: that.data.authOrderNo,
        openid: wx.getStorageSync('openid'),
        channelNo: '5001HH',
        applyerInfo: {
          openid: wx.getStorageSync('openid'),
          name: customerInfo.REAL_NAME,
          idCrad: customerInfo.ID_CARD,
          tel: customerInfo.TEL,
          isTalent: that.data.isTalent,
        },
        appChannel: 'G合作方推荐',
      },
      node2: {
        enterpriseInfo: ent,
        enterWorkStation: that.data.enterWorkStation,
        enterDetailAddress: that.data.enterDetailAddress,
        applyerType: that.data.applyerType, //0法人 1股东 2经办人 3实际控制人
        isTalent: that.data.isTalent,
        loanType1674: '0012',
      },
      node3: {
        applyType: that.data.applyType,
        applyNum: that.data.applyNum,
        applyTime: that.data.applyTime,
      },
    });

    const dataJson = JSON.stringify({
      pinfo: JSON.stringify({
        fr: that.data.legalInfo,
        jk: that.data.applyerInfo,
      }),
      node: '3',
      node_info: node_info,
      openid: wx.getStorageSync('openid'),
      channel: '5001HH',
    });

    const options = {
      url: 'sui/addSedApplyhh.do',
      data: dataJson,
    };

    return requestYT(options).then((res) => {
      console.log('node2创建订单', res);
      log.info('node2创建订单' + JSON.stringify(res));

      if (res.result_code == '1') {
        return res;
      } else {
        return Promise.reject(res.result_msg);
      }
    });
  },

  /**
   * 71接口返回
   */
  measure() {
    let that = this;
    const dataJson = JSON.stringify({
      aid: that.data.sed_id,
      orderNo: that.data.order_no,
      isTalentedPerson: that.data.isTalent,
    });
    console.log(JSON.parse(dataJson));
    var custname = encr.jiami(dataJson, aeskey);
    return requestP({
      url: app.globalData.YTURL + 'sui/sui1680hh.do',
      data: encr.gwRequest(custname),
      method: 'POST',
      header: {
        'content-type': 'application/json',
      },
    }).then((res) => {
      if (res.head.H_STATUS != '1') {
        return res;
      }
      var jsonData = encr.aesDecrypt(res.body, aeskey);
      if (jsonData.resultCode == '0000') {
        return jsonData;
      } else {
        return Promise.reject(jsonData.resultMsg);
      }
    });
  },

  /**
   * 取消订单
   */
  finishApply() {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否确认取消订单',
      showCancel: true,
      cancelText: '取消',
      confirmText: '确定',
      success: (result) => {
        if (result.confirm) {
          let nodeInfo = JSON.stringify({
            node0: {
              date: new Date(),
            },
          });
          this.updateNodeInfo('0', nodeInfo).then(() => {
            wx.navigateBack();
          });
        }
      },
    });
  },

  /**
   * 更新节点信息
   * @param {*} node
   * @param {*} nodeInfo
   */
  updateNodeInfo(node, nodeInfo, pinfo) {
    var that = this;
    let options = {
      url: 'sui/updateNodeInfo.do',
      data: JSON.stringify({
        node: node,
        pinfo: pinfo || '',
        open_id: wx.getStorageSync('openid'),
        sed_id: that.data.sed_id,
        node_info: nodeInfo,
      }),
    };
    return requestYT(options).then((res) => {
      if (res.STATUS === '1' && res.result_code === '1') {
        return;
      } else {
        wx.showToast({
          title: '更新节点信息失败,请重试',
          icon: 'none',
        });
        return Promise.reject(`更新节点信息失败,请重试`);
      }
    });
  },

  /**
   * 选中企业
   * @param {*} e
   */
  async chooseEnter(e, companyName) {
    var that = this;
    wx.showLoading({
      title: '加载中 ',
      mask: true,
    });

    if (e) {
      let index = e.currentTarget.dataset.index;
      companyName = that.data.enterpriseCardInfo[index].ORG_NAME;
    }

    let customerInfo = that.data.customerInfo;

    //todo 工商查询293
    Org.checkShareHolderInfo({
      entmark1: companyName,
      emc: customerInfo.ID_NUMBER,
      productNo: '120026',
      deptName: '小企业金融部',
    }).then((res) => {
      if (res == 1) {
        var  applyerType  = '0';
        that.chooseEnter2(companyName,applyerType,customerInfo,that)
      }else{
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: '法人信息校验失败' || err,
          showCancel: false,
          confirmText: '确定',
          success: (result) => {
            if (result.confirm) {
              return;
            }
          },
          fail: () => {},
          complete: () => {},
        });
        return;
      }
      // else{
      //   Org.getShareHolderInfoByPosition({
      //     entmark: companyName,
      //     name: customerInfo.NAME,
      //     productNo: '120026',
      //     deptName: '小企业金融部',
      //   }).then(sharePositionRes =>{
      //     let { applyerType } = sharePositionRes;
      //     if (applyerType === '') {
      //       applyerType = '2';
      //     }
      //     that.chooseEnter2(companyName,applyerType,customerInfo,that)
      //   }).catch(err=>{
      //       wx.hideLoading()
      //   });
      // }
    }).catch(error=>{
    //   Org.getShareHolderInfoByPosition({
    //     entmark: companyName,
    //     name: customerInfo.NAME,
    //     productNo: '120026',
    //     deptName: '小企业金融部',
    //   }).then(sharePositionRes =>{
    //     let { applyerType } = sharePositionRes;
    //     if (applyerType === '') {
    //       applyerType = '2';
    //     }
    //     that.chooseEnter2(companyName,applyerType,customerInfo,that)
    //   }).catch(err=>{
    //     wx.hideLoading()
    // });
    wx.showModal({
      title: '提示',
      content: '法人信息校验失败' || error,
      showCancel: false,
      confirmText: '确定',
      success: (result) => {
        if (result.confirm) {
          wx.hideLoading()
          return;
        }
      },
      fail: () => {},
      complete: () => {},
    });
    return;
    });

  

  },
  async chooseEnter2(companyName,applyerType,customerInfo,that){
    Org.getEnterpriseInfo({
      // openid: wx.getStorageSync('openid'),
      type: '1',
      companyName,
    }).then(async (res) => {   
      console.log(res,'res')  
      console.log("applyerType: "+ applyerType); 
      if (applyerType !== '0') {
        return Promise.reject(new Error('法人信息校验失败'));
      }
      if (!res.enterpriseInfo) {
        return Promise.reject(new Error('未查询到相关企业信息'));
      }
  
      that.getRencai(that.data.customerInfo.ID_NUMBER);
  
      const {
        eNTSTATUS, //企业经营状态,
      } = res.enterpriseInfo;
  
      const STATUS = ['存续', '在营', '开业'];
      if (STATUS.findIndex((e) => eNTSTATUS.indexOf(e) > -1) === -1) {
        return Promise.reject(new Error('经营状态不正常'));
      }
  
      that.setData({
        applyerType,
        enterWorkStation: '',
      });
  
      that.setData({
        legalInfo: {
          legalOpenId: wx.getStorageSync('openid'),
          legalName: customerInfo.REAL_NAME,
          legalCardType: '021',
          legalCard: customerInfo.ID_CARD,
          legalMobile: customerInfo.TEL,
          legalJob: '',
          leaglValidEnd: customerInfo.VALID_DATE,
        },
        applyerInfo: {
          applyName: customerInfo.REAL_NAME,
          applyCard: customerInfo.ID_CARD,
          applyMobile: customerInfo.TEL,
          applyCardType: '021',
          applyOpenId: '',
        },
      });
  
      let orgCode = res.enterpriseInfo.cREDITCODE;
  
      let enterpriseInfo = {
        fRNAME: res.enterpriseInfo.fRNAME,
        ORG_NAME: res.enterpriseInfo.eNTNAME,
        ORG_CODE: orgCode,
        province: orgCode.substring(2, 4),
        city: orgCode.substring(2, 6),
        country: orgCode.substring(2, 8),
      };
  
      if (that.data.cityCanApply.indexOf(enterpriseInfo.province) < 0) {
        return Promise.reject(new Error('暂不支持该地区企业申请业务'));
      }
  
      that.setData({
        enterpriseInfo,
        enterDetailAddress: this.data.customerInfo.ADDRESS,
        showBaseEnter: false,
      });
  
      let arr = await getRegionCode2(enterpriseInfo.country);
      let country = arr[2].values.find((e) => e.adcode === enterpriseInfo.country);
      if (country) {
        that.setData({
          multiArray3: arr,
          enterWorkStation: arr[0].values[0].name + arr[1].values[0].name + country.name,
        });
      } else {
        that.setData({
          multiArray3: arr,
        });
      }
      console.log('that.data.enterpriseInfo：'+that.data.enterpriseInfo,'enterWorkStation:'+that.data.enterWorkStation)
      wx.hideLoading();
      that.submitNode2();
      // return;
    }).catch((error) => {
      wx.hideLoading();
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
    });
  },
  /**
   * 模糊查询企业
   * @param {*} e
   */
  searchEnter(e) {
    this.setData({
      'enterpriseInfo.ORG_CODE': '',
    });
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
   * 显示企业选择框
   * @param {}} e
   */
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

  /**
   * 关闭弹出框
   */
  onClose(e) {
    this.setData({
      enterAddrShow: false,
      showApplyTypeBox: false,
      showAuthDocunments: false,
      showExtraInfo: false,
      showTaxImg: false,
      showRegionPicker: false,
    });
  },

  //跳转税务
  validateTax: function (e) {
    var that = this;
    let { ORG_CODE, province, city } = that.data.enterpriseInfo;
    if (province != '32' && province != '44') {
      wx.showModal({
        title: '提示',
        content: '该地区请通过税务官方网站等渠道进行授权',
        showCancel: false,
      });
      return;
    }

    wx.navigateTo({
      url:
        '../info/tax?proCode=' +
        province +
        '0000&cityCode=' +
        city +
        '00' +
        '&formId=' +
        e.detail.formId +
        '&reurl=' +
        '../sui/index2' +
        '&creditCode=' +
        ORG_CODE +
        '&phone=' +
        that.data.customerInfo.TEL +
        '&orderNo=' +
        that.data.order_no,
    });
  },

  /**
   * 显示协议
   * @param {*} e
   */
  viewDocunment(e) {
    let index = e.currentTarget.dataset.index;
    let { result } = this.data;

    if (result.indexOf(index) < 0) {
      result.push(index);
      this.setData({
        result,
      });
    }

    const config = {
      doc_self: true,
      doc_borrower: true,
      doc_checkbox1: true,
      doc_checkbox2: false,
      doc_checkbox3: false,
      doc_checkbox5: true,
    };

    this.setData({
      ['flag_' + index]: false,
    });

    for (let key in config) {
      this.setData({
        [key]: config[key],
      });
    }

    this.readingCoundDown();
  },

  /**
   * 隐藏协议
   */
  conceal: function () {
    if (this.data.backBtnName !== 0) {
      return;
    }
    this.setData({
      flag_0: true,
      flag_1: true,
      flag_2: true,
      flag_3: true,
      flag_4: true,
      flag_5: true,
      flag_6: true,
      flag_7: true,
    });
  },

  /**
   * 引导用户，手动引导用户去设置页开启，
   */
  guideOpenSubscribeMessage() {
    var that = this;
    wx.showModal({
      title: '提示',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确认',
      content: '检测到您没有开启订阅消息的权限，是否去设置？',
      showCancel: true,
      success: (result) => {
        if (result.confirm) {
          wx.openSetting({
            withSubscriptions: true,
            success() {
              that.guidSubscribeMessageAuthAfter();
            },
          });
        } else {
          wx.showModal({
            title: '提示',
            showCancel: true,
            cancelText: '取消',
            cancelColor: '#000000',
            confirmText: '确认',
            content: '您已拒绝订阅消息授权，将无法获取申请结果通知',
            showCancel: true,
            success: (result) => {
              if (result.confirm) {
                that.actionsBeforeSubmit();
              }
            },
          });
        }
      },
    });
  },

  /**
   * 订阅通知
   */
  guidSubscribeMessageAuthAfter() {
    var that = this;
    wx.getSetting({
      withSubscriptions: true,
      success: (res) => {
        let { authSetting = {}, subscriptionsSetting: { mainSwitch = false, itemSettings = {} } = {} } = res;
        if (
          (authSetting['scope.subscribeMessage'] || mainSwitch) &&
          itemSettings['nZjEYoMUyZ3A6zNxRgWHG_fHteF7AJnrAGDLEG_ybZo'] === 'accept'
        ) {
          that.actionsBeforeSubmit();
        } else {
        }
      },
    });
  },
});
