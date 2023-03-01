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
import { getRegionCode2 } from '../../../api/region';

var date = new Date();
var aeskey = encr.key;
var app = getApp();
var myPerformance = require('../../../utils/performance.js');

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
    citysUncontainedInStep4: false,
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
    applyTimeArray: ['12个月', '24个月', '36个月'],
    cityCanApply: ['32', '11', '31', '44', '33'],
    // noNeedTaxCitys: ['11', '31', '33', '44'], //不需要税务授权地区
    noNeedTaxCitys: ['11', '31', '33'], //不需要税务授权地区
    day_time: date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日',
    expirationTime: date.getFullYear() + 1 + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日',
    expirationTime2: {
      year: date.getFullYear() + 3,
      mounth: date.getMonth() + 1,
      day: date.getDate(),
    },
    day_time2: date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate(),
    applyType: '', // 申请类型
    applyNum: '',
    applyTime: '',
    step: '0', //当前节点号
    times: '60', //倒计时
    cityName: '', //经营地址
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
  },

  onLoad: function (options) {
    const pages = getCurrentPages();
    this.setData({
      lastPage: pages[pages.length - 2].route,
    });
    log.info('申请页面全局参数展示' + JSON.stringify(app.globalData));
    wx.hideShareMenu();
    myPerformance.reportBegin(2006, 'sub1_sui_index2');
    this.setData({
      recommendOpenId: app.globalData.share_person,
      platformUserId: app.globalData.sharerEmpNo,
    });
    myPerformance.reportEnd(2006, 'sub1_sui_index2');
    console.log('回显订单信息options', options)
    this.initOnloadData(options);
  },

  onShow() {
    var that = this;
    if (that.data.step == '0') {
      that.initOnShowData();
    } else {
      user.getFaceVerify().then((res) => {
        that.setData({
          batchID: res.BATCH_ID || '',
        });
      });
    }
    // 税务通过返回
    if (that.data.taxflag) {
      let nodeInfo = JSON.stringify({
        node4: {
          day_time2: that.data.day_time2,
          authTax: "1"
        },
      });
      that.updateNodeInfo('4', nodeInfo).then(() => {
        that.setData({
          step: '4',
        });
        that.toStep('step' + that.data.step);
      });
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
    let { enterpriseInfo, multiArray3 } = this.data;
    // if (!enterpriseInfo.orgCode || enterpriseInfo.orgCode.length < 8) {
    //   wx.showToast({
    //     title: '请录入正确的统一信用代码',
    //     icon: 'none',
    //   });
    //   return;
    // }

    if (multiArray3.length > 0) {
      this.setData({
        showRegionPicker: true,
      });
      return;
    }
    regionCode = enterpriseInfo.orgCode ? enterpriseInfo.orgCode.substring(2, 8) : '';
    let arr = await getRegionCode2(regionCode);
    console.log('arr', arr);
    this.setData({
      multiArray3: arr,
      showRegionPicker: true,
    });
  },

  /**
   * 校验补录信息
   * @param {*} e
   */
  async addRelatedPersonnelInformation(e) {
    var that = this;
    let params = e.detail.value;
    await this.initValidate();
    if (!this.WxValidate.checkForm(params)) {
      wx.showToast({
        title: this.WxValidate.errorList[0].msg.replace('。', ''),
        icon: 'none',
        duration: 2000,
        mask: false,
      });
    } else {
      wx.showLoading({
        title: '信息校验中',
        mask: true,
      });
      let arr = [];
      if (params.legalName && params.legalCard) {
         //新工商
        arr.push(
          Org.checkShareHolderInfo({
            entmark1: that.data.enterpriseInfo.ORG_NAME,
            emc: params.legalCard,
            productNo: '120025',
            deptName: '小企业金融部',
          }).then((res) => {
            if (res!=1) {
              return Promise.reject("法人信息校验失败");
            } else {
              that.setData({
                legalInfo: {
                  legalName: params.legalName,
                  legalCard: params.legalCard,
                  legalMobile: params.legalMobile,
                  legalCardType: '021',
                  legalOpenId: '',
                  legalJob: '',
                  leaglValidEnd: '',
                },
              });
              that.getRencai(params.legalCard);
              return;
            }
          }),
        );
      }

      if (params.shareholderName && params.shareholderCard) {
        //新工商
        arr.push(
          Org.getShareHolderInfo({
            entmark: that.data.enterpriseInfo.ORG_NAME,
            name: params.shareholderName,
            productNo: '120025',
            deptName: '小企业金融部',
          },'gd').then((res) => {
            if (res!=1) {
              return Promise.reject("股东信息校验失败");
            } else {
              that.setData({
                shareholderInfo: {
                  shareholderName: params.shareholderName,
                  shareholderCard: params.shareholderCard,
                  shareholderMobile: params.shareholderMobile,
                  shareholderCardType: '021',
                  shareholderOpenId: '',
                  shareholderJob: '',
                  shareholderValidEnd: '',
                },
              });
              return;
            }
          }),
        );
      }

      if (params.actualShareholderName && params.actualShareholderCard) {
        arr.push(
          User.verifyIdentity(params.actualShareholderName, params.actualShareholderCard, '实控人').then((res) => {
            that.setData({
              actualShareholderInfo: {
                actualShareholderName: params.actualShareholderName,
                actualShareholderCard: params.actualShareholderCard,
                actualShareholderMobile: params.actualShareholderMobile,
                actualShareholderCardType: '021',
                actualShareholderOpenId: '',
                actualShareholderJob: '',
                actualShareholderValidEnd: '',
              },
            });
          }),
        );
      }

      Promise.all(arr)
        .then(() => {
          wx.hideLoading();
          that.onClose();
          wx.showToast({
            title: '校验成功',
            icon: 'success',
            duration: 1500,
          });
          that.updateNode5();
        })
        .catch((err) => {
          wx.hideLoading();
          wx.showToast({
            title: err,
            icon: 'none',
            image: '',
            duration: 1500,
            mask: false,
          });
        });
    }
  },
  /**
   * 更具1676返回的applyBorr添加申请人信息
   */
  getApplyerInfo() {
    var that = this;
    let applyerInfo = {};
    let info = {};
    switch (that.data.applyBorr) {
      case '0':
        info = that.data.legalInfo;
        applyerInfo = {
          applyName: info.legalName,
          applyCard: info.legalCard,
          applyMobile: info.legalMobile,
          applyCardType: '021',
          applyOpenId: '',
        };
        break;
      case '1':
        info = that.data.shareholderInfo;
        applyerInfo = {
          applyName: info.shareholderName,
          applyCard: info.shareholderCard,
          applyMobile: info.shareholderMobile,
          applyCardType: '021',
          applyOpenId: '',
        };
        break;
      case '3':
        info = that.data.actualShareholderInfo;
        applyerInfo = {
          applyName: info.actualShareholderName,
          applyCard: info.actualShareholderCard,
          applyMobile: info.actualShareholderMobile,
          applyCardType: '021',
          applyOpenId: '',
        };
        break;
      default:
        break;
    }
    that.setData({
      applyerInfo,
    });
  },

  confirmBorrowBody() {
    var that = this;
    if (that.data.loanType === '') {
      wx.showToast({
        title: '请选择借款主体',
        icon: 'none',
      });
      return;
    }
    if (that.data.collectionInfo != '') {
      that.setData({
        showExtraInfo: true,
      });
    } else {
      that.updateNode5();
    }
  },
  /**
   * 更新节点5
   */
  async updateNode5() {
    var that = this;
    that.getApplyerInfo();
    let {
      applyBorr,
      loanType,
      collectionInfo,
      channelAuthorizationType,
      supplyAuthorizationShow,
      supplyAuthorizationObject,
      shareholderInfo,
      legalInfo,
      actualShareholderInfo,
      applyerInfo,
      isTalent,
      applyerType,
    } = that.data;

    let authCode = '';
    if (loanType.split('')[0] === '1') {
      //1 企业 2 个人
      switch (applyerType) {
        case '0': //法人
          authCode = '1';
          break;
        case '1': //股东
          authCode = '2';
          break;
        case '2': //经办人
          authCode = '';
          break;
        case '3': //实控人
          authCode = '2';
          break;
        default:
          break;
      }
    } else {
      switch (applyerType) {
        case '0': //法人
          authCode = '01';
          break;
        case '1': //股东
          authCode = '01';
          break;
        case '2': //经办人
          authCode = '';
          break;
        case '3': //实控人
          authCode = '01';
          break;
        default:
          break;
      }
    }
    console.log('最终authcode;', authCode);
    let nodeInfo = JSON.stringify({
      node5: {
        isTalent,
        applyBorr,
        loanType,
        collectionInfo,
        channelAuthorizationType,
        supplyAuthorizationShow,
        supplyAuthorizationObject,
        authCode,
      },
    });
    let pinfo = JSON.stringify({
      gd: shareholderInfo,
      fr: legalInfo,
      sk: actualShareholderInfo,
      jk: applyerInfo,
    });
    try {
      await that.updateNodeInfo('5', nodeInfo, pinfo);
      that.setData({
        step: '5',
      });
      that.toStep('step' + that.data.step);
    } catch (error) { }
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
    let { channelAuthorizationType, supplyAuthorizationShow } = this.data;
    let config = {
      20: '法人',
      21: '法人',
      22: '股东',
      23: '实际控制人',
      30: '企业',
    };
    let authSteps = [];
    channelAuthorizationType = channelAuthorizationType.split(',');
    supplyAuthorizationShow = supplyAuthorizationShow.split(',');

    channelAuthorizationType.forEach((e) => {
      if (config[e]) {
        authSteps.push({
          text: `${config[e]}授权`,
          activeIcon: 'success',
        });
      }
    });
    supplyAuthorizationShow.forEach((e) => {
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
    //订单信息回显
    if (options.applyInfo) {
      let applyInfo = JSON.parse(decodeURIComponent(options.applyInfo));
      let nodeInfo = JSON.parse(applyInfo.WDGL1661_REQ);
      let pinfo = applyInfo.WDGL1663_REQ ? JSON.parse(applyInfo.WDGL1663_REQ) : {};

      that.setData({
        legalInfo: pinfo.fr ? pinfo.fr : {},
        shareholderInfo: pinfo.gd ? pinfo.gd : {},
        actualShareholderInfo: pinfo.sk ? pinfo.sk : {},
        applyerInfo: pinfo.jk ? pinfo.jk : {},
      });
      let { order_no, recommendOpenId, platformUserId } = nodeInfo.node1;
      let {
        enterpriseInfo,
        cityName,
        enterWorkStation,
        enterDetailAddress,
        citysUncontainedInStep4,
        applyerType,
        applyAmountAndTerm,
        isTalent,
        loanType1674,
        depositBankName,
      } = nodeInfo.node2;

      if (applyInfo.NODE >= '2') {
        that.setData({
          depositBankName,
          isTalent,
          loanType1674,
          applyerType,
          enterpriseInfo,
          cityName,
          enterWorkStation,
          enterDetailAddress,
          citysUncontainedInStep4,
          order_no,
          sed_id: applyInfo.SED_ID,
          step: applyInfo.NODE,
          recommendOpenId:
            typeof recommendOpenId != 'undefined' && recommendOpenId != ''
              ? recommendOpenId
              : that.data.recommendOpenId,
          platformUserId:
            typeof platformUserId != 'undefined' && platformUserId != '' ? platformUserId : that.data.platformUserId,
        });

        applyAmountAndTerm.forEach((e) => {
          e.applyMaxTerms = Math.max.apply(null, e.termOpt.split('、')) / 12;
        });
        that.setData({
          applyAmountAndTerm,
        });
      }
      if (applyInfo.NODE >= '3') {
        let { applyNum, applyTime, applyType, update_time, houseChoosed, borrowBodyConfigList, isWhite } =
          nodeInfo.node3;
        that.setData({
          applyNum,
          applyTime,
          applyType,
          update_time,
          houseChoosed: houseChoosed ? houseChoosed : [],
          borrowBodyConfigList,
          isWhite,
        });

        that.data.applyAmountAndTerm.forEach((e) => {
          if (e.businessType === applyType) {
            this.setData({
              applyMaxNum: e.maxAmt,
              applyMaxTerms: e.applyMaxTerms,
            });
          }
        });
      }
      if (applyInfo.NODE >= '4') {
        let { day_time2 } = nodeInfo.node4;
        that.setData({
          day_time2,
        });
      }
      if (applyInfo.NODE >= '5') {
        let {
          loanType,
          collectionInfo,
          channelAuthorizationType,
          supplyAuthorizationShow,
          applyBorr,
          supplyAuthorizationObject,
          isTalent,
        } = nodeInfo.node5;
        that.setData({
          loanType,
          collectionInfo,
          channelAuthorizationType,
          supplyAuthorizationShow,
          applyBorr,
          supplyAuthorizationObject,
          isTalent,
        });
        that.showAuthList();
        this.data.borrowBodyConfigList.forEach((e) => {
          if (e.loanType == that.data.loanType) {
            this.setData({
              loanTpyeName: e.showName,
            });
          }
        });
      }

      if (enterpriseInfo.province == '11') {
        that.setData({
          showTaxlevelBox: true,
        });
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

    //加载柜台主人信息
    if (that.data.platformUserId) {
      emp.getCardInfoByEmp(that.data.platformUserId).then((res) => {
        that.setData({
          cardInfo: res,
        });
      });
    }
  },

  initOnShowData() {
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
        if (res.REAL_NAME) {
          return user.getFaceVerify();
        } else {
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
      .then((res) => {


        let customerInfo = Object.assign(that.data.customerInfo, res);

        console.log("custoemrInfo", customerInfo)
        // if (res.ATTR3 != '' && res.ATTR3 != undefined && res.ATTR3 != null) {
          that.setData({
            customerInfo,
            step: that.data.step == '0' ? '1' : that.data.step,
            userInfoLevel: '2',
          });
        // } else {
        //   that.setData({
        //     customerInfo,
        //     // step: that.data.step == '0' ? '1' : that.data.step,
        //     userInfoLevel: '1',
        //   });
        // }

        if (that.data.step === '1' && wx.getStorageSync('channelEnterpriseInfo')) {
          const enterpriseInfo = wx.getStorageSync('channelEnterpriseInfo');
          that.chooseEnter(null, enterpriseInfo.companyName);
        }
      })
      .catch((err) => { });
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
      success() { },
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
   * 动态显示最高申请额度
   * @param {*} e
   */
  showApplyTypeBox(e) {
    var that = this;
    var type = e.currentTarget.dataset.type;
    let applyAmountAndTerm = that.data.applyAmountAndTerm;
    applyAmountAndTerm.forEach((e) => {
      if (e.businessType === type) {
        let applyTimeArray = ['36', '24', '12']
        that.setData({
          applyType: type,
          // applyTimeArray: applyTimeArray.map((e) => e + '个月'),
          applyTime: applyTimeArray[applyTimeArray.length - 1],
          showApplyTypeBox: true,
          applyNum: e.maxAmt,
          applyMaxNum: e.maxAmt,
          applyMaxTerms: Math.max.apply(null, applyTimeArray) / 12,
        });
        if(type == '1'){
          that.setData({
            applyTimeArray: ['60个月', '48个月', '36个月', '24个月', '12个月']
          });
        }else{
          that.setData({
            applyTimeArray: ['36个月', '24个月', '12个月'],
          });
        }

      }
    });
  },

  chooseChannelType(e) {
    console.log(e);
    this.setData({
      channelType: e.detail,
    });
  },

  /**
   * 选择借款类型
   */
  async chooseApplyType() {
    var that = this;
    if (parseInt(that.data.applyNum) > parseInt(that.data.applyMaxNum)) {
      wx.showToast({
        title: `申请金额不能超过${that.data.applyMaxNum}万元!`,
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
      });
      return;
    }
    if (that.data.applyNum === '' || that.data.applyNum < 1) {
      wx.showToast({
        title: '请重新输入申请金额!',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
      });
      return;
    }
    wx.showLoading({
      title: '请稍后',
      mask: true,
    });

    let List = [{ loanType: '20', showName: '个人经营贷（法人代表）', showRemark: '贷款发放到企业法人代表个人账户，用于企业经营。' },
    { loanType: '21', showName: '个人经营贷（股东）', showRemark: '贷款发放到企业股东个人账户，用于企业经营。' }];
    let isWhite = '1';

    let borrowBodyConfigList = List;
    that.setData({
      borrowBodyConfigList: List,
      isWhite,
    });
    if (that.data.applyType === '0' || that.data.applyType === '3') {
      if (that.data.isWhite == '0') {
        let nodeInfo = JSON.stringify({
          node3: {
            applyType: that.data.applyType,
            applyNum: that.data.applyNum,
            applyTime: that.data.applyTime,
            borrowBodyConfigList,
            isWhite,
          },
          node4: {
            day_time2: that.data.day_time2,
          },
        });
        await that.updateNodeInfo('34', nodeInfo).then(() => {
          that.setData({
            step: 4,
            showApplyTypeBox: false,
            borrowBodyConfigList,
          });
          that.toStep('step' + that.data.step);
        });
      } else {
        let nodeInfo = JSON.stringify({
          node3: {
            applyType: that.data.applyType,
            applyNum: that.data.applyNum,
            applyTime: that.data.applyTime,
            borrowBodyConfigList,
            isWhite,
          },
        });
        await that.updateNodeInfo('3', nodeInfo).then(() => {
          that.setData({
            step: 3,
            showApplyTypeBox: false,
            borrowBodyConfigList,
            isWhite,
          });
          that.toStep('step' + that.data.step);
        });
      }
    } else if (that.data.applyType == '1' || that.data.applyType === '2') {
      that.setData({
        step: '2.5',
        showApplyTypeBox: false,
      });
      that.toStep('step25');
    }
    wx.hideLoading();

  },

  async chooseApplyBody(e) {
    var that = this;
    let loanType = e.detail;
    this.data.borrowBodyConfigList.forEach((e) => {
      if (e.loanType === loanType) {
        this.setData({
          loanTpyeName: e.showName,
        });
      }
    });
    wx.showLoading({
      title: '加载中',
      mask: true,
    });

    // try {
    let applyBorr
    let collectionInfo
    let channelAuthorizationType
    let supplyAuthorizationObject
    let supplyAuthorizationShow
    if (loanType == '20') {
      applyBorr = '0';
      collectionInfo = '';
      channelAuthorizationType = '1,4';
      supplyAuthorizationObject = '';
      supplyAuthorizationShow = '';

    }
    if (loanType == '21') {
      applyBorr = '1';
      collectionInfo = '0';
      channelAuthorizationType = '1,4';
      supplyAuthorizationObject = '0';
      supplyAuthorizationShow = '3,4';
    }
    // let {
    //   applyBorr, //借款人类型
    //   collectionInfo, //需要补录人员
    //   channelAuthorizationType, //申请授权书类型
    //   supplyAuthorizationObject, //补录用对象身份
    //   supplyAuthorizationShow, //补录用对象授权书
    // } = await that.wdgl1676(loanType);
    wx.hideLoading();
    that.setData({
      loanType,
      canSubmitNode5: false,
      applyBorr,
      collectionInfo,
      channelAuthorizationType,
      supplyAuthorizationObject,
      supplyAuthorizationShow,
    });
    that.showAuthList();
    // } catch (error) {
    //   that.setData({
    //     canSubmitNode5: true,
    //   });
    //   wx.hideLoading();
    //   wx.showModal({
    //     title: '提示',
    //     content: error,
    //     confirmText: '确定',
    //   });
    // }
  },

  /**
   * 阅读协议
   */
  AuthDocuments() {
    let { applyerType, loanType, supplyAuthorizationShow } = this.data;

    if (applyerType === '2' || (applyerType === '1' && loanType !== '21')) {
      this.subscribeMessage();
    } else {
      this.setData({
        showAuthDocunments: true,
      });
    }
    // if (supplyAuthorizationShow == '') {
    //   if (applyerType === '2' || (applyerType === '1' && loanType !== '21')) {
    //     this.subscribeMessage();
    //   } else {
    //     this.setData({
    //       showAuthDocunments: true,
    //     });
    //   }

    //   return;
    // } else {
    //   this.setData({
    //     sendAuthDoc: true,
    //   });
    // }

    //经办人、股东选个人不需要授权
  },

  /**
   * 暂不录入房产信息
   */
  async finishStep3() {
    var that = this;
    let nodeInfo = {};
    if (that.data.isWhite == '0') {
      nodeInfo = JSON.stringify({
        node3: {
          applyType: that.data.applyType,
          applyNum: that.data.applyNum,
          applyTime: that.data.applyTime,
          houseChoosed: that.data.houseChoosed,
          borrowBodyConfigList: that.data.borrowBodyConfigList,
          isWhite: that.data.isWhite,
        },
        node4: {
          day_time2: that.data.day_time2,
        },
      });
      await that.updateNodeInfo('34', nodeInfo);
    } else {
      nodeInfo = JSON.stringify({
        node3: {
          applyType: that.data.applyType,
          applyNum: that.data.applyNum,
          applyTime: that.data.applyTime,
          houseChoosed: that.data.houseChoosed,
          borrowBodyConfigList: that.data.borrowBodyConfigList,
          isWhite: that.data.isWhite,
        },
      });
      await that.updateNodeInfo('3', nodeInfo);
    }

    that.setData({
      step: that.data.isWhite == '0' ? '4' : '3',
    });
    that.toStep('step' + that.data.step);
  },

  finishStep4() {
    var that = this;
    let customerInfo = that.data.customerInfo;
    that.setData({
      step: '4',
    });
    that.toStep('step' + that.data.step);

    let nodeInfo = JSON.stringify({
      node4: {
        day_time2: that.data.day_time2,
        authTax: '0'
      },
    });
    that.updateNodeInfo('4', nodeInfo);
  },

  /**
   * 选择借款期限
   * @param {*} e
   */
  pickApplyTime(e) {
    var that = this;
    let applyTime = that.data.applyTimeArray[e.detail.value].replace('个月', '');
    that.setData({
      applyTime,
    });
  },

  /**
   * 步骤4 跳转授权页面税务授权
   * @param {*} e
   */
  AuthTax(e) {
    var that = this;
    if (that.data.citysUncontainedInStep4) {
      if (that.data.enterpriseInfo.province === '11') {
        that.setData({
          showTaxImg: true,
        });
        // that.validateTax(e);
      } else {
        let nodeInfo = JSON.stringify({
          node4: {
            day_time2: that.data.day_time2,
            authTax: '1'
          },
        });
        that.updateNodeInfo('4', nodeInfo).then(() => {
          that.setData({
            step: '4',
          });
          that.toStep('step' + that.data.step);
        });
      }
    } else {
      let version = wx.getAccountInfoSync().miniProgram.envVersion;

      if (version === 'develop') {
        that.setData({
          step: '4',
        });
        that.toStep('step' + that.data.step);
        let nodeInfo = JSON.stringify({
          node4: {
            day_time2: that.data.day_time2,
            authTax: '1'

          },
        });
        that.updateNodeInfo('4', nodeInfo);
        return;
      }

      that.validateTax(e);
    }
  },

  copyOrgCode() {
    wx.setClipboardData({
      data: this.data.enterpriseInfo.ORG_CODE,
      success: function (res) {
        wx.showToast({
          title: '统一码复制成功',
          icon: 'none',
          duration: 1500,
          mask: false,
        });
      },
    });
  },

  initValidate() {
    let rule1 = {
      legalName: {
        required: true,
        name: true,
      },
      legalCard: {
        required: true,
        idcard: true,
      },
      legalMobile: {
        required: true,
        tel: true,
      },
    };

    let messages1 = {
      legalName: {
        required: '请输入法人代表姓名',
        orgName: '请检查法人代表姓名',
      },
      legalCard: {
        required: '请输入法人代表证件号码',
      },
      legalMobile: {
        required: '请输入法人代表手机号码',
      },
    };

    let rules2 = {
      shareholderName: {
        required: true,
        name: true,
      },
      shareholderCard: {
        required: true,
        idcard: true,
      },
      shareholderMobile: {
        required: true,
        tel: true,
      },
    };

    let messages2 = {
      shareholderName: {
        required: '请输入股东姓名',
        orgName: '请检查法人代表姓名',
      },
      shareholderCard: {
        required: '请输入股东证件号码',
      },
      shareholderMobile: {
        required: '请输入股东手机号码',
      },
    };

    let rules3 = {
      actualShareholderName: {
        required: true,
        name: true,
      },
      actualShareholderCard: {
        required: true,
        idcard: true,
      },
      actualShareholderMobile: {
        required: true,
        tel: true,
      },
    };

    let messages3 = {
      actualShareholderName: {
        required: '请输入实际控制人姓名',
        orgName: '请检查实际控制人姓名',
      },
      actualShareholderCard: {
        required: '请输入实际控制人证件号码',
      },
      actualShareholderMobile: {
        required: '请输入实际控制人手机号码',
      },
    };

    let rules = {};
    let messages = {};
    let { applyerType, loanType } = this.data;

    if (applyerType !== '0') {
      rules = rule1;
      messages = messages1;
    }
    if (applyerType == '2' && (loanType == '12' || loanType == '21')) {
      rules = Object.assign(rules, rules2);
      messages = Object.assign(messages, messages2);
    }

    if (loanType === '22' || loanType === '13') {
      rules = Object.assign(rules, rules3);
      messages = Object.assign(messages, messages3);
    }

    // 创建实例对象
    this.WxValidate = new WxValidate(rules, messages);
  },

  /**
   * 提交页面企业信息
   * @param {*} e
   */
  submitNode2() {
    var that = this;
    let msg = '';
    if (!this.data.channelType) {
      msg = '请选择渠道';
      wx.showToast({
        icon: 'none',
        title: msg,
        duration: 1500,
        mask: false,
      });
      that.toStep('step0');

      return;
    }
    if (this.data.channelType === 'G' && !this.data.extraChannelInfo) {
      msg = '请补充渠道信息';
      wx.showToast({
        icon: 'none',
        title: msg,
        duration: 1500,
        mask: false,
      });
      that.toStep('step0');

      return;
    }

    const { ORG_CODE2, ORG_CODE, province } = this.data.enterpriseInfo;

    if (ORG_CODE2 && ORG_CODE.indexOf(ORG_CODE2) === -1) {
      wx.showToast({
        title: '请输入正确的企业统一码',
        icon: 'none',
        duration: 1500,
        mask: true,
      });
      return;
    }

    if (that.data.showTaxlevelBox && that.data.employeeNumber == '') {
      msg = '请输入从业人数';
      wx.showToast({
        icon: 'none',
        title: msg,
        duration: 1500,
        mask: false,
      });
      return;
    }
    if (typeof that.data.enterpriseInfo.ORG_NAME == 'undefined' || that.data.enterpriseInfo.ORG_NAME == '') {
      msg = '请填写公司名称';
      wx.showToast({
        icon: 'none',
        title: msg,
        duration: 1500,
        mask: false,
      });
      return;
    } else if (!that.data.enterpriseInfo.ORG_CODE) {
      msg = '请输入企业统一码';
      wx.showToast({
        icon: 'none',
        title: msg,
        duration: 1500,
        mask: false,
      });
      return;
    } else if (typeof that.data.enterWorkStation == 'undefined' || that.data.enterWorkStation == '') {
      msg = '请选择经营地址';
      wx.showToast({
        icon: 'none',
        title: msg,
        duration: 1500,
        mask: false,
      });
      return;
    } else if (
      typeof that.data.enterDetailAddress == 'undefined' ||
      that.data.enterDetailAddress == '' ||
      that.data.enterDetailAddress.replace(/\n/g, '').replace(/\s/g, '') == ''
    ) {
      msg = '请填写详细地址';
      wx.showToast({
        icon: 'none',
        title: msg,
        duration: 1500,
        mask: false,
      });
      return;
    } else {
      if (ORG_CODE2) {
        if (that.data.cityCanApply.indexOf(province) < 0) {
          wx.showModal({
            title: '提示',
            content: '暂不支持该地区企业申请业务',
            showCancel: false,
            confirmText: '确定',
          });
          return;
        }

        //北京地区显示税务授权
        that.setData({
          showTaxlevelBox: province == '11',
        });

        //判断是否需要跳转纳税页面
        if (that.data.noNeedTaxCitys.indexOf(province) > -1) {
          that.setData({
            citysUncontainedInStep4: true,
          });
        }
      }
      that.setData({
        enterDetailAddress: that.data.enterDetailAddress.replace(/\n/g, '').replace(/\s/g, ''),
      });

      that.createApply();
    }
  },

  async wdgl1674() {
    var that = this;
    let options = {
      url: 'sui/sui1674.do',
      data: JSON.stringify({
        companyName: this.data.enterpriseInfo.ORG_NAME,
        creCompanyNo: this.data.enterpriseInfo.ORG_CODE,
        loanType: this.data.applyerType === '0' ? '0' : '1',
        legalName: this.data.customerInfo.REAL_NAME,
        legalCardType: '021',
        legalCard: this.data.customerInfo.ID_CARD,
        province: this.data.enterpriseInfo.province,
        // city: '3205',
        city: this.data.enterpriseInfo.city,
        area: this.data.enterpriseInfo.country,
        resvFld1: '',
        resvFld2: '',
        resvFld3: '',
        resvFld4: '',
        resvFld5: '',
      }),
    };
    console.log(options.url, options.data);

    const res = await requestYT(options);
    console.log('1674返回', res);
    log.info('1674返回', JSON.stringify(res));
    if (res.STATUS === '1' && res.resultCode === '0000') {
      return res;
    } else {
      return Promise.reject('配置信息获取失败');
    }
  },

  async wdgl1675() {
    var that = this;
    let options = {
      url: 'jsyh/query1675.do',
      data: JSON.stringify({
        fillsInID: that.data.applyerType,
        vouchType: that.data.applyType,
        applyCard: that.data.customerInfo.ID_CARD,
        resvFld1: that.data.loanType1674,
      }),
    };
    console.log('1675canshu', JSON.parse(options.data));
    const res = await requestYT(options);
    console.log('1675返回', res);
    log.info('1675返回', JSON.stringify(res));
    if (res.STATUS === '1' && res.resultCode === '0000' && res.List) {
      let index = res.List.findIndex((e) => e.loanType === '20');
      if (index != -1) {
        let temp = res.List[0];
        res.List[0] = res.List[index];
        res.List[index] = temp;
      }
      return res;
    } else {
      return Promise.reject('配置信息获取失败');
    }
  },

  async wdgl1676(loanType) {
    var that = this;
    let options = {
      url: 'jsyh/query1676.do',
      data: JSON.stringify({
        fillsInID: that.data.applyerType,
        vouchType: that.data.applyType,
        loanType,
      }),
    };
    const res = await requestYT(options);
    console.log('1676返回', res);
    log.info('1676返回', JSON.stringify(res));
    if (res.STATUS === '1' && res.resultCode === '0000') {
      return res;
    } else {
      return Promise.reject('配置信息获取失败');
    }
  },

  async wdgl1679(cityCode, windFlag) {
    let options = {
      url: 'jsyh/query1679.do',
      data: JSON.stringify({
        cityCode,
        resvFld1: '0000',
        resvFld2: windFlag,
      }),
    };
    console.log(options.url, arguments);
    const res = await requestYT(options);
    console.log('1679返回', res);
    log.info('1679返回', JSON.stringify(res));
    if (res.STATUS === '1' && res.resultCode === '0000' && res.listBusinessParams) {
      return JSON.parse(res.listBusinessParams);
    } else {
      return Promise.reject(new Error(res.resultMsg || '配置信息获取失败'));
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
      // const wdgl1674Result = await this.wdgl1674(); //南京地区传了分头
      const wdgl1674Result = {
        windFlag: '000',
        depositBankName: ''
      }

      let { windFlag, depositBankName } = wdgl1674Result;

      let isWhite1674 = 0;
      if (isWhite1674 === '1' && this.data.applyerType === '2') {
        let { customerInfo } = this.data;
        that.setData({
          applyerType: '0',
          legalInfo: {
            legalOpenId: wx.getStorageSync('openid'),
            legalName: customerInfo.REAL_NAME,
            legalCardType: '021',
            legalCard: customerInfo.ID_CARD,
            legalMobile: customerInfo.TEL,
            legalJob: '',
            leaglValidEnd: customerInfo.VALID_DATE,
          },
        });
      }

      this.setData({
        isWhite1674,
        loanType1674: '004',
        depositBankName,
      });
      //   windFlag = '0011';
      if (windFlag == '0011') {
        that.setData({
          applyAmountAndTerm: [
            {
              termOpt: '12',
              loanType: '002',
              city: '苏州市',
              maxAmt: '500',
              businessType: '3',
              cityChannel: '0000',
              applyMaxTerms: 3,
              termUnit: '月',
            },
          ],
        });
      } else {
        that.setData({
          applyAmountAndTerm: [
            {
              termOpt: '12、24、36',
              loanType: '000',
              city: '',
              maxAmt: '300',
              businessType: '0',
              cityChannel: '',
              applyMaxTerms: 36,
              termUnit: '月',
            },
            {
              termOpt: '12、24、36',
              loanType: '000',
              city: '',
              maxAmt: '300',
              businessType: '3',
              cityChannel: '',
              applyMaxTerms: 36,
              termUnit: '月',
            },
            {
              termOpt: '12、24、36、48、60',
              loanType: '000',
              city: '',
              maxAmt: '300',
              businessType: '1',
              cityChannel: '',
              applyMaxTerms: 60,
              termUnit: '月',
            }
          ],
        });

      }

      await that.addApplyInfo().then((res) => {
        wx.hideLoading();
        if (res.plaEmpno) {
          emp.getCardInfoByEmp(res.plaEmpno).then((res) => {
            that.setData({
              cardInfo: res,
            });
          });
        }
        that.setData({
          order_no: res.order_no,
          sed_id: res.sed_id,
          step: 2,
          plaName: res.plaName,
          platformUserId: res.plaEmpno ? res.plaEmpno : that.data.platformUserId,
        });
        that.toStep('step' + that.data.step);
        that.addCompany();
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
      let { applyerType, loanType, applyType } = that.data;
      if (applyerType === '0') {
        if (loanType == '10' || loanType == '11') {
          if (this.data.enterpriseInfo.city === '3204') {
            if (this.data.applyType === '3') {
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
            }
          } else {
            if (this.data.applyType === '3') {
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
            }
          }
        } else {
          if (this.data.enterpriseInfo.city === '3204') {
            if (this.data.applyType === '3') {
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
            }
          } else {
            if (this.data.applyType === '3') {
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
            }
          }
        }
      } else if (applyerType === '1') {
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
    if (this.data.enterpriseInfo.city === '3204') {
      Order.authorization3204(this.data.sed_id, this.data.order_no);
    }
    try {
      if (this.data.applyerType === '0' && !this.data.batchID) {
        await api.getImageBatchId(this.data.customerInfo.REAL_NAME, this.data.customerInfo.ID_CARD);
        this.setData({
          batchID: 'success',
        });
      }
      console.log('提交1680');
      //   return;
      await this.submitApply();
    } catch (error) {
      console.log('123', error);
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
                    fail: () => { },
                    complete: () => { },
                  });
                } else {
                  wx.redirectTo({
                    url: '/pages/mine/mine_list',
                  });
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
    let appChannelInfo = this.data.questions.find((e) => this.data.channelType === e.value);
    let node_info = JSON.stringify({
      node1: {
        openid: wx.getStorageSync('openid'),
        managerId: app.globalData.shareID,
        recommendOpenId: app.globalData.share_person,
        platformUserId: app.globalData.sharerEmpNo,
        channelNo: app.globalData.channelNo,
        applyerInfo: {
          openid: wx.getStorageSync('openid'),
          name: customerInfo.REAL_NAME,
          idCrad: customerInfo.ID_CARD,
          tel: customerInfo.TEL,
          isTalent: that.data.isTalent,
        },
        appChannel:
          this.data.channelType === 'G'
            ? appChannelInfo.value + this.data.extraChannelInfo
            : appChannelInfo.value + appChannelInfo.desc,
      },
      node2: {
        enterpriseInfo: ent,
        cityName: that.data.cityName,
        enterWorkStation: that.data.enterWorkStation,
        enterDetailAddress: that.data.enterDetailAddress,
        citysUncontainedInStep4: that.data.citysUncontainedInStep4,
        applyerType: that.data.applyerType, //0法人 1股东 2经办人 3实际控制人
        applyAmountAndTerm: that.data.applyAmountAndTerm,
        isTalent: that.data.isTalent,
        applyTypeSZ: '000',
        loanType1674: that.data.loanType1674,
        depositBankName: that.data.depositBankName,
        isWhite1674: that.data.isWhite1674,
      },
    });

    var dataJson = JSON.stringify({
      pinfo: JSON.stringify({
        gd: that.data.shareholderInfo,
        fr: that.data.legalInfo,
      }),
      node: '2',
      node_info: node_info,
    });

    let options = {
      url: 'sui/addWeiApply.do',
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
    var that = this;
    let cust = that.data.customerInfo;
    let ent = that.data.enterpriseInfo;

    let allInfo = {};
    if (that.data.houseChoosed.length > 0) {
      allInfo.houseInfo = that.data.houseChoosed;
    }

    let {
      applyOpenId = '',
      applyName = '',
      applyCardType = '',
      applyCard = '',
      applyMobile = '',
    } = that.data.applyerInfo;

    let {
      legalOpenId = '',
      legalName = '',
      legalCardType = '',
      legalCard = '',
      legalMobile = '',
      legalJob = '',
      leaglValidEnd = '',
    } = that.data.legalInfo;

    let {
      shareholderOpenId = '',
      shareholderName = '',
      shareholderCardType = '',
      shareholderCard = '',
      shareholderMobile = '',
      shareholderJob = '',
      shareholderValidEnd = '',
    } = that.data.shareholderInfo;

    let {
      actualShareholderOpenId = '',
      actualShareholderName = '',
      actualShareholderCardType = '',
      actualShareholderCard = '',
      actualShareholderMobile = '',
      actualShareholderJob = '',
      actualShareholderValidEnd = '',
    } = that.data.actualShareholderInfo;

    var dataJson = JSON.stringify({
      managerId: app.globalData.shareID,
      aid: that.data.sed_id,
      projCode: 'WEB2020111SYDJ',
      productCode: 'WEB2020111SYDJ',
      serialNo: '',
      applyDateTime: '',
      companyName: ent.ORG_NAME,
      creCompanyNo: ent.ORG_CODE,
      province: ent.province,
      city: ent.city,
      area: ent.country,
      companyAddress: that.data.enterWorkStation + that.data.enterDetailAddress,
      registerAdd: ent.city,
      applyAmount: parseInt(that.data.applyNum) * 10000 + '',
      applyTerm: that.data.applyTime,
      orderNo: that.data.order_no,
      caozuo: '1',
      isHouse: that.data.houseChoosed.length > 0 ? '0' : '1',
      isTalentedPerson: that.data.isTalent,
      vouchType: that.data.applyType,
      fillsInID: that.data.applyerType,
      loanType: that.data.loanType,

      applyOpenId,
      applyName,
      applyCardType,
      applyCard,
      applyMobile,

      legalOpenId,
      legalName,
      legalCardType,
      legalCard,
      legalMobile,
      legalJob,
      leaglValidEnd,

      shareholderOpenId,
      shareholderName,
      shareholderCardType,
      shareholderCard,
      shareholderMobile,
      shareholderJob,
      shareholderValidEnd,

      actualShareholderOpenId,
      actualShareholderName,
      actualShareholderCardType,
      actualShareholderCard,
      actualShareholderMobile,
      actualShareholderJob,
      actualShareholderValidEnd,

      fillsInOpenId: wx.getStorageSync('openid'),
      fillsInName: cust.REAL_NAME,
      fillsInCardType: '021',
      fillsInCard: cust.ID_CARD,
      fillsInMobile: cust.TEL,
      fillsInJob: '',
      fillsInValidEnd: cust.VALID_DATE,

      recommendOpenId: '',
      recommendName: '',
      recommendCertNo: '',
      recommendMobile: '',
      recommendUserId: '',

      managerOpenId: '',
      managerName: '',
      managerCertNo: '',
      managerMobile: '',
      managerUserId: '',

      platformOpenId: '',
      platformName: '',
      platformCertNo: '',
      platformMobile: '',
      platformUserId: '',

      extraInfomation: allInfo,
      resvFld2: that.data.employeeNumber,
    });
    console.log(JSON.parse(dataJson));
    var custname = encr.jiami(dataJson, aeskey);
    return requestP({
      url: app.globalData.YTURL + 'sui/sui1680.do',
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

  editHouseInfo(e) {
    let type = e.currentTarget.dataset.type;
    let { step, applyType, applyNum, applyTime, sed_id, isWhite, enterpriseInfo, borrowBodyConfigList } = this.data;
    let province = enterpriseInfo.province;
    borrowBodyConfigList = JSON.stringify(borrowBodyConfigList);
    let url = `house2?node=${step}&applyType=${applyType}&applyNum=${applyNum}&applyTime=${applyTime}&sed_id=${sed_id}&type=${type}&isWhite=${isWhite}&province=${province}&borrowBodyConfigList=${borrowBodyConfigList}`;
    wx.navigateTo({
      url,
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

  getCompanyNameInfo() {
    const { ORG_NAME } = this.data.enterpriseInfo;
    this.chooseEnter(null, ORG_NAME);
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
    Org.checkShareHolderInfo({
      entmark1: companyName,
      emc: customerInfo.ID_NUMBER,
      productNo: '120026',
      deptName: '小企业金融部',
    }).then(async(res) => {
      if (res == 1) {
        var  applyerType  = '0';
        that.chooseEnter2(companyName,applyerType,customerInfo,that)
      }else{
        Org.getShareHolderInfoByPosition({
          entmark: companyName,
          name: customerInfo.NAME,
          productNo: '120026',
          deptName: '小企业金融部',
        }).then(sharePositionRes =>{
          let { applyerType } = sharePositionRes;
          if (applyerType === '') {
            applyerType = '2';
            // wx.showToast({
            //   title: '申请人身份校验错误',
            //   icon: 'none',
            // });
          }
          that.chooseEnter2(companyName,applyerType,customerInfo,that)
        }).catch(err=>{
            wx.hideLoading()
        });
      }
    }).catch(err=>{
      Org.getShareHolderInfoByPosition({
        entmark: companyName,
        name: customerInfo.NAME,
        productNo: '120026',
        deptName: '小企业金融部',
      }).then(sharePositionRes =>{
        let { applyerType } = sharePositionRes;
        if (applyerType === '') {
          applerType = '2';
          // wx.showToast({
          //   title: '申请人身份校验错误',
          //   icon: 'no
        }
        that.chooseEnter2(companyName,applyerType,customerInfo,that)
      }).catch(err=>{
        wx.hideLoading()
    });
    });

  },

  chooseEnter2(companyName,applyerType,customerInfo,that){
    Org.getEnterpriseInfo({
      // openid: wx.getStorageSync('openid'),
      type: '1',
      companyName,
    })
      .then(async (res) => {
        console.log('授权人身份校验结果', res);
        log.info('授权人身份校验结果', res);
        console.log("applyerType: "+ applyerType);
        // let { applyerType } = res;

        if (applyerType === '') {
          wx.showToast({
            title: '申请人身份校验错误',
            icon: 'none',
          });
          return;
        }

        if (applyerType === '0') {
          that.getRencai(that.data.customerInfo.ID_NUMBER);
        // } else if (applyerType === '1') {
        } else {
          that.setData({
            isTalent: '1',
          });
        } 
        // else {
        //   wx.showToast({
        //     title: '您不是该企业法人或股东，暂不支持',
        //     icon: 'none',
        //   });
        // }
        if (!res.enterpriseInfo) {
          wx.showToast({
            title: '未查询到相关企业信息',
            icon: 'none',
          });
          return;
        }
        let cREDITCODE = res.enterpriseInfo.cREDITCODE.substr(2,4);
        if(cREDITCODE==='3204'||cREDITCODE==='3301'||cREDITCODE==='3202'){
      
        if (!(res.enterpriseInfo.eNTNAME && res.enterpriseInfo.cREDITCODE)) {
          if (that.data.lastPage === 'sub1/pages/warehousing/index' && res.enterpriseInfo.eNT_INFO) {
            let org = res.enterpriseInfo.eNT_INFO.oRGDETAIL || res.enterpriseInfo.eNT_INFO.oRGBASIC[0]
            console.log(org)
            let enterpriseInfo = {
              ORG_NAME: org.jGMC,
              ORG_CODE: '', //统一码
              ORG_CODE2: org.jGDM, //组织机构代码
            };

            that.setData({
              enterpriseInfo,
              showBaseEnter: false,
            });
            that.setData({
              applyerType,
              enterWorkStation: '',
              multiArray3: [],
            });

            if (applyerType === '0') {
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
              });
            }

            if (applyerType === '1') {
              that.setData({
                shareholderInfo: {
                  shareholderOpenId: wx.getStorageSync('openid'),
                  shareholderName: customerInfo.REAL_NAME,
                  shareholderCardType: '021',
                  shareholderCard: customerInfo.ID_CARD,
                  shareholderMobile: customerInfo.TEL,
                  shareholderJob: '',
                  shareholderValidEnd: customerInfo.VALID_DATE,
                },
              });
            }

            wx.hideLoading();

            return;
          }

          wx.showToast({
            title: '企业信息异常',
            icon: 'none',
          });
          return;
        }

        let {
          eNTSTATUS, //企业经营状态,
          eNTTYPE, //企业性质
        } = res.enterpriseInfo;

        const STATUS = ['存续', '在营', '开业'];
        if (STATUS.findIndex((e) => eNTSTATUS.indexOf(e) > -1) === -1) {
          wx.showToast({
            title: '经营状态不正常',
            icon: 'none',
            image: '',
            duration: 1500,
            mask: false,
          });
          return;
        }

        that.setData({
          applyerType,
          enterWorkStation: '',
        });

        if (applyerType === '0') {
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
          });
        }

        if (applyerType === '1') {
          that.setData({
            shareholderInfo: {
              shareholderOpenId: wx.getStorageSync('openid'),
              shareholderName: customerInfo.REAL_NAME,
              shareholderCardType: '021',
              shareholderCard: customerInfo.ID_CARD,
              shareholderMobile: customerInfo.TEL,
              shareholderJob: '',
              shareholderValidEnd: customerInfo.VALID_DATE,
            },
          });
        }

        let orgCode = res.enterpriseInfo.cREDITCODE;
        // orgCode = '913205051339298643H';

        let enterpriseInfo = {
          fRNAME: res.enterpriseInfo.fRNAME,
          ORG_NAME: res.enterpriseInfo.eNTNAME,
          ORG_CODE: orgCode,
          province: orgCode.substring(2, 4),
          city: orgCode.substring(2, 6),
          country: orgCode.substring(2, 8),
        };

        if (that.data.cityCanApply.indexOf(enterpriseInfo.province) < 0) {
          wx.hideLoading();
          console.log(1);
          wx.showModal({
            title: '提示',
            content: '暂不支持该地区企业申请业务',
            showCancel: false,
            confirmText: '确定',
          });
          return;
        }

        that.setData({
          enterpriseInfo,
        });

        //北京地区显示税务授权
        if (enterpriseInfo.province == '11') {
          that.setData({
            showTaxlevelBox: true,
          });
        } else {
          that.setData({
            showTaxlevelBox: false,
          });
        }

        //判断是否需要跳转纳税页面
        if (that.data.noNeedTaxCitys.indexOf(enterpriseInfo.province) > -1) {
          that.setData({
            citysUncontainedInStep4: true,
          });
        }

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

        that.setData({
          showBaseEnter: false,
        });
        wx.hideLoading();
      }else{
        wx.showModal({
          title: '提示', //提示的标题,
          content: '暂不支持申请该业务', //提示的内容,
          showCancel: false, //是否显示取消按钮,
          cancelColor: '#000000', //取消按钮的文字颜色,
          confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
          confirmColor: '#3CC51F', //确定按钮的文字颜色,
          success: res => {
            if (res.confirm) {
     wx.navigateBack({
       delta: 1,
     })      } else if (res.cancel) {
            }
          }
        });
      }
      })
      .catch((err) => {
        wx.hideLoading();
      });
  },

  addOrgCode(e) {
    this.setData({
      'enterpriseInfo.ORG_CODE': e.detail.value,
    });
  },

  /**
   * 模糊查询企业
   * @param {*} e
   */
  searchEnter(e) {
    if (this.data.lastPage === 'sub1/pages/warehousing/index') {
      this.setData({
        'enterpriseInfo.ORG_NAME': e.detail.value,
        'enterpriseInfo.ORG_CODE': '',
      });
      return;
    }
    var that = this;
    that.setData({
      'enterpriseInfo.ORG_CODE': '',
    });
    if (e.detail.value.length >= 4 && /^[\u4E00-\u9FA5-（）()]{4,50}$/.test(e.detail.value)) {
      Org.getEnterpriseList(e.detail.value)
        .then((enterpriseCardInfo) => {
          that.setData({
            enterpriseCardInfo,
          });
        })
        .catch((err) => { });
    }
  },

  //地区选择
  bindMultiPickerChange2: function (e) {
    var that = this;
    let adcode = that.data.country[e.detail.value[2]].adcode;
    let multiArray = that.data.multiArray2;
    let enterpriseInfo = that.data.enterpriseInfo;
    enterpriseInfo.city = adcode.substring(0, 4);
    enterpriseInfo.country = adcode.substring(0, 6);
    let enterWorkStation =
      enterpriseInfo.province == '11' || enterpriseInfo.province == '31'
        ? multiArray[1][e.detail.value[1]] + multiArray[2][e.detail.value[2]]
        : multiArray[0][e.detail.value[0]] + multiArray[1][e.detail.value[1]] + multiArray[2][e.detail.value[2]];
    that.setData({
      enterWorkStation,
      enterpriseInfo,
    });
  },

  //地区选择
  bindMultiPickerColumnChange2: function (e) {
    var that = this;
    let arr = that.data.multiArray2;
    switch (e.detail.column) {
      case 0:
        break;
      case 1:
        let index = e.detail.value;
        if (that.data.city.length === 0) {
          return;
        }
        let adcode = that.data.city[index].adcode;
        that.getDistarct(adcode).then((res) => {
          let districts = res.districts[0].districts;
          let column3 = [];
          for (let i = 0; i < districts.length; i++) {
            column3.push(districts[i].name);
          }
          arr[2] = column3;
          that.setData({
            multiArray2: arr,
            country: districts,
          });
        });
      default:
        break;
    }
  },

  /**
   * 高德api查询子地区行政区域码
   * @param {*} code
   */
  getDistarct(code) {
    return requestP({
      url:
        'https://restapi.amap.com/v3/config/district?keywords=' +
        code +
        '&subdistrict=1&key=f50fb5855088b5dee3b232e3971542f3',
      method: 'get',
    }).then((res) => {
      if (res.status === '1' && res.districts.length > 0) {
        return res;
      } else {
        return Promise.reject('未查询到相关地区：' + code);
      }
    });
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

  confirmTaxInfo() {
    var that = this;
    let nodeInfo = JSON.stringify({
      node4: {
        day_time2: that.data.day_time2,
      },
    });
    that.updateNodeInfo('4', nodeInfo).then(() => {
      that.setData({
        step: '4',
      });
      this.onClose();
      that.toStep('step' + that.data.step);
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
    var that = this;
    let index = e.currentTarget.dataset.index;

    let { result, applyerType, loanType } = that.data;
    if (result.indexOf(index) < 0) {
      result.push(index);
      that.setData({
        result,
      });
    }

    var arr = [];
    arr[0] = {
      10: '101',
      11: '102',
      20: '103',
    }; //数字为模板编号
    arr[1] = {
      21: '105',
    };

    let docList = {
      101: {
        doc_self: false,
        doc_borrower: false,
        doc_checkbox1: false,
        doc_checkbox2: false,
        doc_checkbox3: true,
        doc_checkbox5: false,
      },
      102: {
        doc_self: false,
        doc_borrower: false,
        doc_checkbox1: true,
        doc_checkbox2: false,
        doc_checkbox3: false,
        doc_checkbox5: true,
      },
      103: {
        doc_self: true,
        doc_borrower: true,
        doc_checkbox1: true,
        doc_checkbox2: false,
        doc_checkbox3: false,
        doc_checkbox5: true,
      },
      105: {
        doc_self: true,
        doc_borrower: false,
        doc_checkbox1: true,
        doc_checkbox2: false,
        doc_checkbox3: false,
        doc_checkbox5: true,
      },
    };

    console.log('授权书', `${applyerType}，${loanType}`);
    let config = docList[arr[applyerType][loanType]];
    console.log('授权书配置', config);
    that.setData({
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
