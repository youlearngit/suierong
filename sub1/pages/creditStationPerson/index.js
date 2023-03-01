import Order from '../../../api/Order';
import Org from '../../../api/Org';
import {getRegionCode3 } from './region';

import WxValidate from '../../../assets/plugins/wx-validate/WxValidate';
import user from '../../../utils/user.js';
import api from '../../../utils/api.js';
import requestYT from '../../../api/requestYT';
const app = getApp();
var encr = require('../../../utils/encrypt/encrypt.js');
var aeskey = encr.key;
var that; //用其他组件的话 识别不到that
const nowDate = new Date();

Page({
  data: {
    preffixUrl: app.globalData.CDNURL,
    SUPPORT_LEVEL: ['国家级', '省级', '市级', '区县级'],
    SUPPORT_LEVELTxt: '',
    RATE_AREA_ID: '15',
    RATE_AREA_NAME: '',
    isDisable: true,
    RETE_AREAList: [],
    RETE_AREAListP: [
      {
        id: '14',
        name: '江苏省',
      },
      {
        id: '20',
        name: '浙江省',
      },
      {
        id: '21',
        name: '广东省',
      },
    ],
    RATE_AREAListC: [
      {
        id: '16',
        name: '北京市',
      },
      {
        id: '17',
        name: '上海市',
      },

      {
        id: '1',
        name: '南京市',
      },
      {
        id: '2',
        name: '无锡市',
      },
      {
        id: '3',
        name: '徐州市',
      },
      {
        id: '4',
        name: '常州市',
      },
      {
        id: '5',
        name: '苏州市',
      },
      {
        id: '6',
        name: '南通市',
      },
      {
        id: '7',
        name: '连云港市',
      },
      {
        id: '8',
        name: '淮安市',
      },
      {
        id: '9',
        name: '盐城市',
      },
      {
        id: '10',
        name: '扬州市',
      },
      {
        id: '11',
        name: '镇江市',
      },
      {
        id: '12',
        name: '泰州市',
      },
      {
        id: '13',
        name: '宿迁市',
      },
      {
        id: '18',
        name: '杭州市',
      },
      {
        id: '19',
        name: '深圳市',
      },
    ],
    SUPPORT_LEVELIndex: '',
    IS_SELF_FLAG: false,
    // degree picker
    degree: '',
    degreeIndex: ['0'],
    degreeArray: [
      [
        { name: '研究生（博士）', code: '01' },
        { name: '研究生（硕士）', code: '02' },
        { name: '大学本科', code: '03' },
        { name: '大学专科', code: '04' },
        { name: '中专及以下', code: '05' },
      ],
    ],
    //profession picker
    profession: '',
    professionIndex: ['0'],
    professionArray: [
      [
        { name: '企业高管', code: '01' },
        { name: '公务员', code: '02' },
        { name: '高级技术人员', code: '03' },
        { name: '高级教授', code: '04' },
        { name: '一般员工', code: '05' },
        { name: '其他', code: '06' },
      ],
    ],
    //position picker
    position: '',
    positionIndex: ['0'],
    positionArray: [
      [
        { name: '法定代表人', code: '01' },
        { name: '股东', code: '02' },
        { name: '实际控制人', code: '03' },
        { name: '其他', code: '04' },
      ],
    ],
    isGovernmentTalent: false, //是否是政府人才
    showBaseEnter: false,
    // enterprise fuzzy query
    enterpriseCardInfo: [],
    enterpriseAdded: [],
    enterpriseInfo: {},
    cityCanApply: ['32', '11', '31', '44', '33'],
    multiIndex2: [0, 0, 0], //以下省市选择过度
    multiArray2: [],
    multiArray3: [],

    // userInfo
    customer: {},
    talentInfo: {},

    // constant
    currentYear: nowDate.getFullYear(),

    // images uploaded
    idCardBatchId: '',
    talentBatchId: '',
    imgList: [],
    idCardFrontImage: '',
    idCardBackImage: '',
    showRegionPicker: false,
  },

  async onLoad(options) {
      console.log(options)
    this.setData({
      type: options.type,
      talentInfo:options.talentInfo?JSON.parse(options.talentInfo):{}
    });
    let customer = await user.getCustomerInfo();
    this.setData({
      customer,
    });
    this.loadTalentInfo(customer.ID_CARD);
  },

  uploadImage() {
    let { IS_SELF_FLAG, customer, imgList, idCardFrontImage, idCardBackImage } = this.data;
    wx.navigateTo({
      url: `upload?isSelf=${IS_SELF_FLAG}&idCard=${customer.ID_CARD}&imgList=${JSON.stringify(
        imgList,
      )}&idCardFrontImage=${idCardFrontImage}&idCardBackImage=${idCardBackImage}`,
    });
  },

  loadTalentInfo(idCard) {

        let { talentInfo,RETE_AREAListP, RATE_AREAListC, SUPPORT_LEVEL } = this.data;
      if(!talentInfo.talentplancity){
          return
      }
        console.log(talentInfo);
        if (talentInfo.talentplancity === '15') {
          this.setData({
            isDisable: true,
            RATE_AREA_NAME: '国家',
            RATE_AREA_ID: '15',
          });
        }

        RETE_AREAListP.forEach((e) => {
          if (talentInfo.talentplancity === e.id) {
            this.setData({
              RATE_AREA_NAME: e.name,
              RATE_AREA_ID: e.id,
              isDisable: false,
              RETE_AREAList: RETE_AREAListP,
            });
            return;
          }
        });

        RATE_AREAListC.forEach((e) => {
          if (talentInfo.talentplancity === e.id) {
            this.setData({
              RATE_AREA_NAME: e.name,
              RATE_AREA_ID: e.id,
              isDisable: false,
              RETE_AREAList: RATE_AREAListC,
            });
            return;
          }
        });
        let SUPPORT_LEVELIndex = talentInfo.talentlevel - 1 + '';
        this.setData({
          talentInfo,
          SUPPORT_LEVELIndex,
          isDisable: SUPPORT_LEVELIndex === '0',
          PLAN_NAME: talentInfo.talentplanname,
          RATE_YEAR: talentInfo.talentplandate,
          SUPPORT_LEVELTxt: SUPPORT_LEVEL[SUPPORT_LEVELIndex],
          isGovernmentTalent: true,
        });

     
  },

  judgeIsGovernmentTalent(e) {
    console.log(e);
    this.setData({
      isGovernmentTalent: e.detail === 'true',
    });
  },

  showBaseEnter(e) {
    console.log(e);
    if (e.detail.value.length == '') {
      Org.getLocalEnterpriseList(null, '14').then((res) => {
        this.setData({
          enterpriseCardInfo: res,
          enterpriseAdded: res,
          showBaseEnter: true,
        });
      });
    } else {
      this.setData({
        showBaseEnter: true,
      });
    }
  },

  searchEnter(e) {
    this.setData({
      'enterpriseInfo.orgCode': '',
      'enterpriseInfo.orgName': e.detail,
    });
    let companyName = e.detail;
    if (companyName.length >= 4 && /^[\u4E00-\u9FA5-（）()]{4,50}$/.test(companyName)) {
      Org.getEnterpriseList(companyName)
        .then((enterpriseCardInfo) => {
          this.setData({
            enterpriseCardInfo,
            showBaseEnter: true,
          });
        })
        .catch(() => {
          this.setData({
            showBaseEnter: false,
          });
        });
    }
  },

  async chooseEnter(e) {
    var that = this;
    wx.showLoading({
      title: '加载中 ',
      mask: true,
    });
    let index = e.currentTarget.dataset.index;
    let companyName = that.data.enterpriseCardInfo[index].ORG_NAME;
    try {
      const res = await Org.getEnterpriseInfo({
        //   openid: wx.getStorageSync('openid'),
        type: '1', //1 企业名称  2统一码
        companyName,
      });

      console.log('授权人身份校验结果', res);

      if (!(res.enterpriseInfo.eNTNAME && res.enterpriseInfo.cREDITCODE)) {
        wx.showToast({
          title: '企业信息异常，请手动录入',
          icon: 'none',
        });
        throw new Error('enterpriseInfo error');
      }

      let {
        eNTSTATUS, //企业经营状态,
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
        enterWorkStation: '',
      });

      let orgCode = res.enterpriseInfo.cREDITCODE;

      let enterpriseInfo = {
        fRNAME: res.enterpriseInfo.fRNAME,
        orgName: res.enterpriseInfo.eNTNAME,
        orgCode: orgCode,
        province: orgCode.substring(2, 4),
        city: orgCode.substring(2, 6),
        country: orgCode.substring(2, 8),
      };

      if (that.data.cityCanApply.indexOf(enterpriseInfo.province) < 0) {
        wx.hideLoading();
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
      let arr = await getRegionCode3(enterpriseInfo.orgCode.substring(2, 8));
      let country = arr[2].values.find((e) => e.adcode === enterpriseInfo.country);
      if (country) {
        this.setData({
          multiArray3: arr,
          enterWorkStation: arr[0].values[0].name + arr[1].values[0].name + country.name,
        });
      } else {
        this.setData({
          multiArray3: arr,
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      that.setData({
        showBaseEnter: false,
      });
      wx.hideLoading();
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
    let arr = await getRegionCode3(regionCode);
    console.log('arr', arr);
    this.setData({
      multiArray3: arr,
      showRegionPicker: true,
    });
  },

  pickDegree(e) {
    let { degreeArray, degreeIndex } = this.data;
    degreeIndex[0] = e.detail.value[0];
    this.setData({
      degree: degreeArray[0][e.detail.value[0]].name,
      degreeIndex,
    });
  },
  pickProfession(e) {
    let { professionArray, professionIndex } = this.data;
    professionIndex[0] = e.detail.value[0];
    this.setData({
      profession: professionArray[0][e.detail.value[0]].name,
      professionIndex,
    });
  },
  pickPosition(e) {
    let { positionArray, positionIndex } = this.data;
    positionIndex[0] = e.detail.value[0];
    this.setData({
      position: positionArray[0][e.detail.value[0]].name,
      positionIndex,
    });
  },

  editOrgCode(e) {
    this.setData({
      'enterpriseInfo.orgCode': e.detail,
      multiArray3: [],
    });
  },

  onClose() {
    this.setData({
      showRegionPicker: false,
    });
  },

  onConfirm(e) {
    let { enterpriseInfo } = this.data;
    let region = e.detail.value;
    let adcode = region[2].adcode;
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

  async bindMultiPickerChange2(e) {
    console.log(e);

    let { multiArray2, enterpriseInfo } = this.data;
    if (!enterpriseInfo.orgCode) {
      wx.showToast({
        title: '请录入正确的统一信用代码',
        icon: 'none',
      });
      return;
    }
    if (e.type === 'tap') {
      return;
    }
    let adcode = multiArray2[2][e.detail.value[2]].adcode;
    enterpriseInfo.city = adcode.substring(0, 4);
    enterpriseInfo.country = adcode;
    let enterWorkStation =
      multiArray2[0][e.detail.value[0]].name +
      multiArray2[1][e.detail.value[1]].name +
      multiArray2[2][e.detail.value[2]].name;
    this.setData({
      enterWorkStation,
      enterpriseInfo,
    });
  },

  bindMultiPickerColumnChange2: function (e) {
    console.log(e);
    var that = this;
    let arr = that.data.multiArray2;
    switch (e.detail.column) {
      case 0:
        break;
      case 1:
        let index = e.detail.value;
        let { multiArray2 } = this.data;
        multiArray2[2] = multiArray2[1][index].districts;
        this.setData({
          multiArray2: arr,
        });
      default:
        break;
    }
  },

  initValidate() {
    let rules1 = {
      PERSON_NAME: {
        required: true,
      },
      CERT_NO: {
        required: true,
        idcard: true,
      },

      tel: {
        required: true,
        tel: true,
      },

      degree: {
        required: true,
      },

      profession: {
        required: true,
      },

      annualIncome: {
        required: true,
      },

      COMPANY_NAME: {
        required: true,
      },

      //   CREDIT_CODE: {
      //     required: true,
      //   },
      enterWorkStation: {
        required: true,
      },

      position: {
        required: true,
      },
    };

    let messages1 = {
      PERSON_NAME: {
        required: '请输入申请人名称',
      },
      CERT_NO: {
        required: '请输入申请人证件号码',
      },

      tel: {
        required: '请输入手机号',
      },

      degree: {
        required: '请选择学历',
      },

      profession: {
        required: '请选择职位',
      },

      COMPANY_NAME: {
        required: '请输入工作单位名称',
      },

      enterWorkStation: {
        required: '请选择工作地区',
      },

      annualIncome: {
        required: '请输入年收入',
      },

      CREDIT_CODE: {
        required: '请输入企业统一信用代码',
      },

      position: {
        required: '请选择与企业关系',
      },
    };

    if (this.data.isGovernmentTalent) {
      rules1 = Object.assign(rules1, {
        SUPPORT_LEVEL: {
          required: true,
        },
        PLAN_NAME: {
          required: true,
        },
        RATE_YEAR: {
          required: true,
        },
        RATE_AREA: {
          required: true,
        },
      });
      messages1 = Object.assign(messages1, {
        SUPPORT_LEVEL: {
          required: '请选择人才计划等级',
        },
        PLAN_NAME: {
          required: '请选择人才计划名称',
        },
        RATE_YEAR: {
          required: '请选择人才评定年份',
        },
        RATE_AREA: {
          required: '请选择人才评定区域',
        },
      });
    }
    this.WxValidate = new WxValidate(rules1, messages1);
  },

  async getTalentPlans() {
    let options = {
      url: 'jsyh/queryRencai.do',
      data: JSON.stringify({
        rcjhmc: this.data.PLAN_NAME,
        rcdj: that.data.SUPPORT_LEVELTxt,
      }),
    };
    const res = await requestYT(options);
    console.log(options.url, res);
    if (res.STATUS === '1' && res.result) {
      return JSON.parse(res.result);
    } else {
      return Promise.reject(new Error('暂无人才相关数据'));
    }
  },
  async queryRencai() {
    that = this;
    if (that.data.SUPPORT_LEVELTxt == '') {
      wx.showToast({
        title: '请选择人才计划等级',
        icon: 'none',
        duration: 5000,
      });
      return;
    }
    try {
      let talentInfoList = await this.getTalentPlans();
      console.log(talentInfoList);
      talentInfoList = talentInfoList.slice(0, 5).map((e) => e.RCJHMC);
      wx.showActionSheet({
        itemList: talentInfoList,
        alertText: '人才计划列表',
        success(res) {
          that.setData({
            PLAN_NAME: talentInfoList[res.tapIndex],
          });
        },
      });
    } catch (error) {
      console.log(error);
    }

    return;
  },

  pickChange(e) {
    // '区县级',
    // '设区市', RETE_AREAListC
    // '省级',   RETE_AREAListP
    // '国家级'
    if (e.detail.value == '0') {
      this.setData({
        isDisable: true,
        RATE_AREA_NAME: '国家',
        RATE_AREA_ID: '15',
      });
    } else if (e.detail.value == '1') {
      this.setData({
        isDisable: false,
        RATE_AREA_NAME: '',
        RATE_AREA_ID: '',
        RETE_AREAList: this.data.RETE_AREAListP,
      });
    } else {
      this.setData({
        isDisable: false,
        RATE_AREA_NAME: '',
        RATE_AREA_ID: '',
        RETE_AREAList: this.data.RATE_AREAListC,
      });
    }
    this.setData({
      SUPPORT_LEVELIndex: e.detail.value,
      SUPPORT_LEVELTxt: this.data.SUPPORT_LEVEL[e.detail.value],
    });
  },

  bindDateChange: function (e) {
    this.setData({
      RATE_YEAR: e.detail.value,
    });
  },

  pickChange1(e) {
    that = this;
    let { SUPPORT_LEVELIndex } = this.data;
    if (SUPPORT_LEVELIndex === '') {
      wx.showToast({
        title: '请先选择人才计划等级',
        icon: 'none',
        duration: 5000,
      });
      return;
    }
    if (e.detail.value) {
      let index = e.detail.value;
      let { RETE_AREAListP, RATE_AREAListC } = this.data;
      let areaList = SUPPORT_LEVELIndex == '1' ? RETE_AREAListP : RATE_AREAListC;
      that.setData({
        RATE_AREA_NAME: areaList[index].name,
        RATE_AREA_ID: areaList[index].id,
      });
    }
  },

  isSelf(e) {
    this.setData({
      IS_SELF_FLAG: e.detail === 'true',
      talentBatchId: '',
    });
  },

  async submitForm(e) {
    console.log('参数列表', e);

    that = this;
    await this.initValidate();
    const params = e.detail.value;
    if (!this.WxValidate.checkForm(params)) {
      wx.showToast({
        title: this.WxValidate.errorList[0].msg,
        icon: 'none',
      });
      return;
    }
    let { IS_SELF_FLAG, talentBatchId, idCardBatchId } = this.data;  // ./upload.js 会给talentBatchId，idCardBatchId赋值
    const canSubmit = IS_SELF_FLAG ? this.data.talentBatchId && true : idCardBatchId && talentBatchId;
    if (!canSubmit) {
      wx.showToast({
        title: '请先上传影像资料',
        icon: 'none',
        duration: 4000,
      });
      return;
    }

    console.log(params);

    try {
      if (!this.data.IS_SELF_FLAG) {
        await user.verifyIdentity(params.PERSON_NAME, params.CERT_NO);
      }

      wx.showLoading({
        title: '正在上传',
        mask: true,
      });

      await Order.getTalentApply(params.CERT_NO).then((flag) => {
        console.log(flag);
        if (flag === '0') {
          throw new Error('已有待认证信息，无需重复提交');
        }
      });

      let {
        degreeArray,
        degreeIndex,
        positionArray,
        positionIndex,
        professionArray,
        professionIndex,
        isGovernmentTalent,
        customer,
      } = this.data;
      let params2 = {
        ORDER_NUMBER: '',
        IS_SELF_FLAG: that.data.IS_SELF_FLAG ? '是' : '否',
        PERSON_NAME: params.PERSON_NAME,
        CERT_NO: params.CERT_NO,
        CUST_PHONE_NO: params.tel,
        CUST_EDU: degreeArray[0][degreeIndex[0]].code,
        CUST_OCC: professionArray[0][professionIndex[0]].code,
        CERT_TYPE: '1',
        COMPANY_NAME: params.COMPANY_NAME,
        CUST_CADR: that.data.enterpriseInfo.country,
        CUST_INC: params.annualIncome,
        CREDIT_CODE: params.CREDIT_CODE,
        TAL_REL_TYPE: positionArray[0][positionIndex[0]].code,
        INC_FLAG: isGovernmentTalent ? '1' : '0',
        APPLY_NAME: customer.REAL_NAME,
        APPLY_CERT_NO: customer.ID_CARD,
        PHONE_NO: customer.TEL,
        STO_FLAG: that.data.talentInfo.talentplanname ? '1' : '0',
        SUPPORT_LEVEL: isGovernmentTalent ? parseInt(that.data.SUPPORT_LEVELIndex, 10) + 1 + '' : '5',
        RATE_AREA: isGovernmentTalent ? that.data.RATE_AREA_ID : '',
        PLAN_NAME: isGovernmentTalent ? params.PLAN_NAME : '',
        RATE_YEAR: isGovernmentTalent ? params.RATE_YEAR : '',
        NODE_INFO: that.data.idCardBatchId,
        NODE_INFO_SP: that.data.talentBatchId,
        OPEN_ID: wx.getStorageSync('openid'),
        AREANAME: isGovernmentTalent ? that.data.RATE_AREA_NAME : '',
        LEVELNAME: isGovernmentTalent ? that.data.SUPPORT_LEVEL[that.data.SUPPORT_LEVELIndex] : '',
      };
      console.log(params2);
      await user.addTalentInfo(params2);
      wx.hideLoading();

      wx.showModal({
        title: '',
        content: '提交成功',
        showCancel: false,
        confirmText: '确定',
        success: (result) => {
          if (result.confirm) {
            wx.navigateBack();
          }
        },
      });
    } catch (error) {
      wx.hideLoading();
      wx.showModal({
        title: '提示',
        content: error.message || error,
        showCancel: false,
        confirmText: '确定',
      });
      console.log(error);
    }
  },
});
