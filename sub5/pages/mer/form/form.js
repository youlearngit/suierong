const App = getApp();
const computedBehavior = require('miniprogram-computed').behavior;
import { Mer } from '../services/Mer';
import { areaList } from '@vant/area-data';
import dayjs from 'dayjs';
import WxValidate from '../../../../utils/WxValidate';
import Dialog from '@vant/weapp/dialog/dialog';
import Toast from '@vant/weapp/toast/toast';
import * as mock from '../mock/mock';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cdnMer: App.globalData.CDNURL + '/static/wechat/img/mer/',

    eid: '',
    step: 0,

    // step.1
    appl_name: '',
    appl_phone: '',
    appl_idcard: '',
    appl_idcard_batch_id: '',
    appl_idcard_edate: '',
    appl_idcard_edate_val: '',
    appl_face: '',
    appl_is_legal: '1',
    appl_job: '',
    appl_job_idx: 0,
    legal_phone: '',

    // step.2
    corp_name: '',
    corp_credit: '',
    corp_code: '',
    corp_legal_name: '',
    corp_date: '',
    corp_date_val: dayjs().valueOf(),
    corp_region: '',
    corp_region_val: '',
    corp_addr: '',
    corp_batch_id: '',
    corp_type: '',

    // step.3
    blockchain: '',
    tax_sqnum: '0', // 0-手机授权 1-电脑授权
    tax_state: '0',
    is_sinosure: '0',
    sinosures: [''],
    sinosures_val: '',

    // step.4
    pdfs_batch_id: [],
    
    city_contact: '',

    picker_show: false,
    picker_event: '',
    appl_job_columns: ['总经理','秘书','财务主管','会计','其他',],
    corp_region_columns: areaList,
    corp_date_range: [dayjs().subtract(50,'year').valueOf(), dayjs().valueOf()],
    appl_idcard_edate_range: [dayjs().valueOf(), dayjs().add(100,'year').valueOf()],

    dialog_show: false,
    tax_show: false,
    
    agreement_show: false,
    agreement_check: false,
    agreements: [
      {type:'1',read:false,name:'《授权书》'},
      {type:'2',read:false,name:'《江苏银行综合信息查询使用授权书》'}
    ],

    search_corps: [],

    wait_tax: false,
    container_show: true,

  },

  behaviors: [computedBehavior],
  watch: {
    'corp_region_val': async function (val) {
      let res_contact = await Mer.getContactInfo(val[1].name.replace(/市/g,''));
      if (!res_contact.landline) {
        res_contact = await Mer.getContactInfo('南京');
      }
      this.setData({city_contact:res_contact.landline});
    },
  },
  computed: {
    sinosures_val(data) {
      return data.sinosures.filter(r=>r).join();
    },
  },

  goStep(e) {
    let {step} = this.data;
    let go_step = e.currentTarget.dataset.step;
    go_step = go_step*1;
    if (step!=go_step) {
      // this.setData({step:go_step})
    }
  },

  async goTax() {
    if (this.data.tax_state=='1') {
      return;
    }

    Toast.loading({
      message: '正在授权',
      forbidClick: true,
      duration: 0,
    });

    let {eid,corp_credit,corp_name,corp_region_val,legal_phone,appl_is_legal,appl_phone,tax_sqnum} = this.data;
    let pro_code = corp_region_val[0].code; // '320000'
    let city_code = corp_region_val[1].code; // '320100'
    let phone = legal_phone || (appl_is_legal=='1'?appl_phone:'');
    let order_no = eid;
    if (pro_code == '110000' || city_code == '330100'|| tax_sqnum == '1') {
      let res_tax = await Mer.queryOnlineLoan(corp_credit,corp_name);
      if (res_tax.RESULT_CODE == '0000') {
        Toast.clear();
        Toast.success('授权成功');
        this.setData({ tax_state:'1' });
        return;
      }
      if (pro_code == '110000') {
        Toast.clear();
        Dialog.confirm({
          title: '提示',
          message: '未查询到有效的税务授权',
          confirmButtonText: '查看详情',
        }).then(() => { // on confirm
          this.showTax();
        }).catch(() => { // on cancel

        });
      } else {
        Toast.clear();
        Toast.fail('未查询到有效的税务授权');
      }
      return;
    } 

    if (pro_code != '320000' && pro_code != '310000' && city_code != '440300') {
      Toast.clear();
      Toast.fail('很抱歉，该区域暂不受理此业务。');
      return;
    }

    Toast.clear();
    wx.navigateTo({
      url: `../tax/tax?proCode=${pro_code}&cityCode=${city_code}&creditCode=${corp_credit}&phone=${phone}&orderNo=${order_no}`,
      events: {
        taxWaitEvent: (data) => {
          this.setData({
            wait_tax: data,
          })
        },
        taxRltEvent: (data) => {
          this.setData({
            tax_state: data,
          })
        }
      }
    });

  },

  async goAgreement(e) {
    Toast.loading({
      forbidClick: true,
      duration: 0,
    });

    try{
      let {idx} = e.currentTarget.dataset;
      let {agreements,pdfs_batch_id} = this.data;
      let openid = Mer.openid();
      let type = agreements[idx].type;
      
      if (this.data.appl_is_legal != '1') {
        throw '必须是法人才可以继续操作';
      }
      let legal_name = this.data.appl_name;
      let legal_idcard = this.data.appl_idcard;

      let res_sign = await Mer.myrSign(openid,type,this.data.corp_name,this.data.corp_credit,legal_name,legal_idcard,this.data.appl_idcard);
      pdfs_batch_id[idx] = res_sign.BatchID;
      this.setData({pdfs_batch_id});
      
      Toast.clear();
      wx.navigateTo({
        url: '../agreement/agreement',
        events: {
          agreementReadEvent: (data) => {
            let {agreements} = this.data;
            agreements = agreements.map(r=>{
              if (r.type==data.type) {
                r.read = data.read;
              }
              return r;
            })
            this.setData({agreements});
          },
        },
        success: (res) => {
          res.eventChannel.emit('setPdfData', { 
            custName: this.data.corp_name,
            idCard: legal_idcard,
            sqrName: legal_name,
            type: type,
            creditCode: this.data.corp_credit,
          })
        }
      })
    } catch(err) {
      console.error(err);
      Toast.clear();
      Toast.fail(err);
    }

  },

  async idcardEvent(data) {
    this.setData({
      step: 1,
      appl_name: data.name,
      appl_idcard: data.idcard,
      appl_idcard_batch_id: data.batch_id,
      appl_face: data.face,
      appl_idcard_edate: data.valid_dates[1],
      appl_idcard_edate_val: dayjs(data.valid_dates[1]).valueOf(),
    })
    await this.saveStep(0);
    let res_step = await Mer.recordStep(this.data.eid, 1);
  },

  goIdcard() {
    wx.navigateTo({
      url: '../idcard/idcard',
      events: {
        idcardEvent: async (data) => {
          await this.idcardEvent(data);
        },
      }
    })
  },

  async licenseEvent(data) {
    this.setData({
      step: 2,
      corp_name: data.name,
      corp_credit: data.credit,
      corp_code: data.code,
      corp_legal_name: data.legal_name,
      corp_date: data.date,
      corp_date_val: dayjs(data.date).valueOf(),
      corp_region: data.region,
      corp_addr: data.addr,
      corp_batch_id: data.batch_id,
      corp_type: data.type,
    })
    await this.saveStep(2);
    let res_step = await Mer.recordStep(this.data.eid, 2);
  },

  goLicense() {
    wx.navigateTo({
      url: '../license/license',
      events: {
        licenseEvent: async (data) => {
          await this.licenseEvent(data);
        },
      }
    })
  },

  sinosureAdd() {
    let {sinosures} = this.data;
    if (sinosures.length>=5) {
      Toast.fail('最多只能新增5条');
      return;
    }
    sinosures.push('');
    this.setData({sinosures});
  },

  sinosureDel(e) {
    let {idx} = e.currentTarget.dataset;
    let {sinosures} = this.data;
    if (sinosures.length<=1) {
      Toast.fail('至少保留一条数据');
      return;
    }
    sinosures.splice(idx,1);
    this.setData({sinosures});
  },

  sinosureInput(e) {
    let {detail} = e;
    let {idx} = e.currentTarget.dataset;
    let {sinosures} = this.data;
    detail = detail.replace(/,/g,'')
    sinosures[idx] = detail;
    this.setData({sinosures});
  },

  onChangeRadio(event) {
    this.setData({
      [event.currentTarget.dataset.event]: event.detail
    });
  },

  clipboard(e) {
    let {event} = e.currentTarget.dataset;
    wx.setClipboardData({
      data: event,
      success: (res) => {
        Toast.success('复制成功');
        // wx.getClipboardData({
        //   success: (res) => {}
        // })
      }
    })
  },

  searchCorp(e) {
    let keyword = e.detail.trim();
    if (keyword.length<4) {
      return;
    }
    let search_corps = [];
    Mer.getQyName(keyword).then(res=>{
      if (res.entNamesList) {
        search_corps = res.entNamesList.map(r=>{return r.entNames});
      }
      this.setData({search_corps});
    })
  },

  async selectCorp(e) {
    let company_name = e.currentTarget.dataset.item;
    this.setData({
      search_corps: [],

      corp_name: company_name,
      corp_credit: '',
      corp_legal_name: '',
      corp_addr: '',
      corp_date: '',
      corp_date_val: dayjs().valueOf(),
    });

    let res_info = await Mer.getBusInfo(company_name);
    this.setData({
      corp_credit: res_info.cREDITCODE,
      corp_legal_name: res_info.fRNAME,
      corp_addr: res_info.dOM,
      corp_date: res_info.eSDATE,
      corp_date_val: dayjs(res_info.eSDATE).valueOf(),
    })
  },

  showDialog(e) {
    this.setData({ dialog_show: !this.data.dialog_show });
  },

  showTax(e) {
    this.setData({ tax_show: !this.data.tax_show });
  },

  showPicker(e) {
    if (e) {
      let {event} = e.currentTarget.dataset;
      this.setData({ picker_event: event });
    }
    this.setData({ picker_show: !this.data.picker_show });
  },

  showAgreement(e) {
    this.setData({agreement_show:!this.data.agreement_show});
  },

  onConfirmPicker(e) {
    let {event} = e.currentTarget.dataset;
    switch (event) {
      case 'appl_job': {
        let {index,value} = e.detail;
        this.setData({
          [event]: value,
          [event+'_idx']: index,
        })
      } break;
      case 'corp_region': {
        let {values} = e.detail;
        this.setData({
          [event]: values.map(r=>{return r.name}).join(''),
          [event+'_val']: values,
        })
      } break;
      case 'corp_date': {
        let {detail} = e;
        this.setData({
          [event]: dayjs(detail).format('YYYY-MM-DD'),
          [event+'_val']: detail,
        })
      } break;
      case 'appl_idcard_edate': {
        let {detail} = e;
        this.setData({
          [event]: dayjs(detail).format('YYYY-MM-DD'),
          [event+'_val']: detail,
        })
      } break;
      default: break;
    }
    this.showPicker();
  },

  async formValid(step) {
    let rules,messages;

    switch (step) {
      case 1: {
        rules = {
          appl_name: { required:true },
          appl_phone: { required:true, tel:true },
          appl_idcard: { required:true, idcard:true },
        }
        messages = {
          appl_name: { required:'请输入申请人姓名' },
          appl_phone: { required:'请输入申请人手机号码', tel:'请输入有效的申请人手机号码' },
          appl_idcard: { required:'请输入申请人身份证号', idcard:'请输入有效的申请人身份证号' },
        }
        if (this.data.appl_is_legal=='0') {
          rules.appl_job = { required:true }
          rules.legal_phone = { required:true, tel:true }
          messages.appl_job = { required:'请选择公司职务' }
          messages.legal_phone = { required:'请输入法人手机号', tel:'请输入有效的法人手机号' }
        }
      } break;
      case 2: {
        rules = {
          corp_name: { required:true },
          corp_credit: { required:true },
          corp_legal_name: { required:true },
          corp_date: { required:true },
          corp_region: { required:true },
          corp_addr: { required:true, minlength:5 },
        }
        messages = {
          corp_name: { required:'请输入企业名称' },
          corp_credit: { required:'请输入统一社会信用代码' },
          corp_legal_name: { required:'请输入法定代表人' },
          corp_date: { required:'请选择成立日期' },
          corp_region: { required:'请选择企业所在区域' },
          corp_addr: { required:'请输入经营地址', minlength:'经营地址长度不能少于5个字符' },
        }
      } break;
      case 3: {
        rules = {
          blockchain: { required:true },
          tax_state: { contains:'1' },
        }
        messages = {
          blockchain: { required:'请输入外管区块链平台授权码' },
          tax_state: { contains:'请您进行税务授权' }, 
        }
        if (this.data.is_sinosure=='1') {
          rules.sinosures_val = { required:true }
          messages.sinosures_val = { required:'请输入有效的保单编号' }
        }
      } break;
      default: break;
    }
    
    let validate = new WxValidate(rules, messages);
    // this.setData(Object.keys(rules).reduce((obj,item) => {
    //   obj[item+'_err'] = '';
    //   return obj;
    // }, {}));
    if (!validate.checkForm(this.data)) {
      // this.setData(validate.errorList.reduce((obj,item)=>{
      //   obj[item.param+'_err'] = item.msg;
      //   return obj;
      // },{}))
      return Promise.reject(validate.errorList[0].msg)
    }

    switch (step) {
      case 1: {
        let {appl_idcard_batch_id,appl_face,appl_name,appl_idcard} = this.data;
        if (!appl_idcard_batch_id || !appl_face) {
          return Promise.reject('请您上传身份证并进行人脸识别');
        }
        let res_compare = await Mer.compareIdName(appl_name,appl_idcard).catch(err=>{
          throw '身份信息验证失败，请输入正确的身份信息';
        })
      } break;
      case 2: {
        let {corp_batch_id} = this.data;
        if (!corp_batch_id) {
          return Promise.reject('请您上传营业执照照片');
        }
      } break;
      case 3: {
        let res_authcode = await Mer.checkAuthorizationCode(this.data.blockchain,this.data.corp_credit)
        if (res_authcode.code==0) {
          return Promise.reject('区块链暂时未查询到有效的授权')
        }
      } break;
      default: break;
    }

    return Promise.resolve();
  },

  async formSubmit() {
    Toast.loading({
      forbidClick: true,
      duration: 0,
    });

    try  {
      let {step,eid} = this.data;
      let openid = Mer.openid();
      let share_openid = Mer.tjropenid();

      await this.formValid(step);
      await this.saveStep(step);

      // before next step
      switch (step) {
        case 1: {
          let {corp_batch_id} = this.data;
          if (!corp_batch_id) {
            let res_step = await Mer.recordStep(eid, 2);
            Toast.clear();
            this.goLicense();
            return;
          }
        } break;
        case 2: {

        } break;
        case 3: {
          if (this.data.appl_is_legal!='1') {
            let res_step = await Mer.recordStep(eid, 4);
            Toast.clear();
            wx.redirectTo({
              url: '../finish/finish?type=4',
            })
            return;
          }
          if (!this.data.agreement_show) {
            Toast.clear();
            this.setData({agreement_show:true});
            return;
          }
          if (this.data.agreements.find(r=>{return !r.read})) {
            Toast.clear();
            Toast.fail('请阅读协议');
            return;
          }
  
          let legal_face_batchid = this.data.appl_face;
          let legal_idcard_batchid = this.data.appl_idcard_batch_id;
          let legal_idcard = this.data.appl_idcard;
          let legal_name = this.data.appl_name;
          try {
            let res_qzzx = await Mer.qzzx(this.data.corp_name,this.data.corp_credit,legal_face_batchid,legal_idcard_batchid,legal_idcard,legal_name)
          } catch(err) {
  
          }
  
          let res_wd = await Mer.submitTowd(openid,share_openid,eid);
  
          if (res_wd.resultCode == '0000' || res_wd.resultCode == '2000') {
            let res_step = await Mer.recordStep(eid, 4);
            Toast.clear();
            wx.redirectTo({
              url: '../finish/finish?type=1',
            })
          } else {
            Toast.clear();
            Toast.fail(res_wd.resultMsg);
          }
          return;
        } break;
        default: break;
      }

      step = step+1;
      let res_step = await Mer.recordStep(eid, step);
      this.setData({step});
      Toast.clear();

      // after next step
      switch (step) {
        case 1: {

        } break;
        case 2: {

        } break;
        case 3: {

        } break;
        default: break;
      }

    } catch (err) {
      console.error(err);
      Toast.clear();
      Toast.fail(err);
    }
  },

  async saveStep(step) {
    let openid = Mer.openid();
    
    let data = {
      eId: this.data.eid || '',
      openId: openid,
      submitTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      legalPersonFlag: this.data.appl_is_legal=='1'?'1':'2', // 1-法人 2-非法人
    };
    switch (step) {
      case 0: {
        data.applicantName = this.data.appl_name;
        data.applicantCard = this.data.appl_idcard;
        data.applicantImageABatchId = this.data.appl_idcard_batch_id;
        data.applicantImageBBatchId = this.data.appl_idcard_batch_id;
        data.applicantImageFaceBatchId = this.data.appl_face;
        data.applicantCardDateEnd = dayjs(this.data.appl_idcard_edate).format('YYYYMMDD');
      } break;
      case 1: {
        data.applicantName = this.data.appl_name;
        data.applicantCard = this.data.appl_idcard;
        data.applicantPhone = this.data.appl_phone;
        if (this.data.appl_is_legal=='1') { // 法人
          data.fName = this.data.appl_name;
          data.fPhone = this.data.appl_phone;
          data.fCard = this.data.appl_idcard;
          data.duties = '法定代表人';
          data.imageABatchId = this.data.appl_idcard_batch_id;
          data.imageBBatchId = this.data.appl_idcard_batch_id;
          data.frCardEndDate = dayjs(this.data.appl_idcard_edate).format('YYYYMMDD');
          data.imageFaceBatchId = this.data.appl_face;
        } else { // 非法人
          data.duties = this.data.appl_job;
          data.fPhone = this.data.legal_phone;
        }
      } break;
      case 2: {
        data.enterpriseName = this.data.corp_name;
        data.creditCode = this.data.corp_credit;
        data.businessLicenceCode = this.data.corp_code;
        data.enterpriseDate = this.data.corp_date_val ? dayjs(this.data.corp_date_val).format('YYYY年MM月DD日') : ''
        data.businessAddress = this.data.corp_addr;
        data.fName = this.data.corp_legal_name;
        data.imageId = this.data.corp_batch_id;
        data.businessType = this.data.corp_type;
        data.city = this.data.corp_region_val[1] ? this.data.corp_region_val[1].name.replace(/市/g,'') : '';
        data.province = this.data.corp_region_val[0] ? this.data.corp_region_val[0].code : '';
        data.region = this.data.corp_region_val ? this.data.corp_region_val.map(r=>{return r.name}).join() : '';
      } break;
      case 3: {
        data.authorizationCode = this.data.blockchain;
        data.existZhPolicy = this.data.is_sinosure;
        data.policyNo = this.data.sinosures_val;
        data.imagePdfBatchId = this.data.pdfs_batch_id.join();
      } break;
      default: break;
    }

    let res_save = await Mer.myrAddOrUpdate(data);
    if (res_save.Eid) {
      this.setData({eid:res_save.Eid});
    }

  },

  async loadStep() {
    Toast.loading({
      forbidClick: true,
      duration: 0,
    });

    let openid = Mer.openid();
    let res_info = await Mer.selectMyrInfo(openid);
    if (res_info.msgCode != '0000') {
      Toast.clear();
      return;
    }
    let infos = JSON.parse(res_info.myrInfo);
    console.log('infos',infos)
    let info = infos[0];
    this.setData({eid:info.E_ID});
    let updata = {
      eid: info.E_ID,
      step: info.STEP,
    };
    if (info.STEP=='') {
      Toast.clear();
      return;
    }

    if (info.LEGAL_PERSON_FLAG==undefined || info.LEGAL_PERSON_FLAG=='') {
      //存量数据处理
      Toast.clear();
      await Dialog.alert({
        title: '提示',
        message: '版本已更新，请重新进行人脸识别！',
      })
      updata.step = 1;
    } else {
      updata.appl_name = info.APPLICANT_NAME;
      updata.appl_idcard = info.APPLICANT_CARD;
      updata.appl_idcard_batch_id = info.APPLICANT_IMAGE_A_BATCHID;
      updata.appl_face = info.APPLICANT_IMAGE_FACE_BATCHID;
      updata.appl_idcard_edate = info.APPLICANT_CARD_DATE_END;
      updata.appl_is_legal = info.LEGAL_PERSON_FLAG;
      updata.appl_phone = info.APPLICANT_PHONE;
      updata.legal_phone = info.FA_PHONE;
      updata.appl_job = info.DUTIES;

      updata.corp_name = info.ENTERPRISE_NAME;
      updata.corp_credit = info.CREDIT_CODE;
      updata.corp_code = info.BUSINESS_LICENCE_CODE;
      updata.corp_legal_name = info.FA_NAME;
      updata.corp_date = info.ENTERPRISE_DATE;
      updata.corp_addr = info.BUSINESS_ADDRESS;
      updata.corp_type = info.BUSINESS_TYPE;
      updata.corp_batch_id = info.IMAGE_ID;
      updata.corp_region = info.AREA;
    }

    if (updata.step != undefined) {
      updata.step = updata.step*1;
      if (updata.step<1) {
        updata.step = 1;
      }
      if (updata.step>3) {
        Toast.clear();
        return;
      }
    }
    if (updata.appl_idcard_edate != undefined) {
      updata.appl_idcard_edate = dayjs(updata.appl_idcard_edate).format('YYYY-MM-DD');
      updata.appl_idcard_edate_val = dayjs(updata.appl_idcard_edate).valueOf();
    }
    if (updata.appl_is_legal != undefined) {
      updata.appl_is_legal = updata.appl_is_legal=='1'?'1':'0';
    }
    if (updata.appl_job != undefined) {
      if (updata.appl_job == '法定代表人') {
        updata.appl_job = '';
        updata.appl_job_idx = 0;
      } else {
        let _job_idx = this.data.appl_job_columns.indexOf(updata.appl_job);
        if (_job_idx>-1) {
          updata.appl_job_idx = _job_idx;
        }
      }
    }
    if (updata.corp_date != undefined) {
      let _corp_date = updata.corp_date.replace(/年|月/g,'-').replace(/日/g,' ').replace(/(^\s*)|(\s*$)/g, '');
      updata.corp_date = dayjs(_corp_date).format('YYYY-MM-DD');
      updata.corp_date_val = dayjs(_corp_date).valueOf();
    }

    if (updata.corp_region != undefined) {
      let _region_val = [];
      let _area = updata.corp_region.split(',');
      Object.keys(areaList.province_list).forEach((code) => {
        let name = areaList.province_list[code];
        if (name == _area[0]) {
          _region_val.push({code,name})
        }
      })
      Object.keys(areaList.city_list).forEach((code) => {
        let name = areaList.city_list[code];
        if (name == _area[1]) {
          _region_val.push({code,name})
        }
      })
      Object.keys(areaList.county_list).forEach((code) => {
        let name = areaList.county_list[code];
        if (name == _area[2]) {
          _region_val.push({code,name})
        }
      })
      updata.corp_region_val = _region_val;
      updata.corp_region = _region_val.map(r=>{return r.name}).join('');
    }

    let data = {};
    Object.keys(updata).forEach((k) => {
      if (updata[k] != undefined) {
        data[k] = updata[k];
      }
    })

    this.setData(data);
    Toast.clear();

  },

  async loadStepAfter() {
    let {step} = this.data;
    if (step<1) { step=1 }
    switch (step) {
      case 1: {
        let {appl_name,appl_idcard} = this.data;
        if (!appl_name || !appl_idcard) {
          this.goIdcard();
          return;
        }
      } break;
      case 2: {
        let {corp_batch_id} = this.data;
        if (!corp_batch_id) {
          this.goLicense();
          return;
        }
      } break;
      default: break;
    }
  },

  preStep() {
    let {step} = this.data;
    step--;
    if (step>0) {
      this.setData({
        container_show: true,
        step,
      });
    } else {
      wx.navigateBack();
    }
  },

  async initData(options) {
    await this.loadStep();

    if (options.idcard) {
      await this.idcardEvent(JSON.parse(options.idcard));
    }
    if (options.license) {
      await this.licenseEvent(JSON.parse(options.license));
    }

    await this.loadStepAfter();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.initData(options);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let {wait_tax} = this.data;
    if (wait_tax) {
      Dialog.alert({
        title: '提示',
        message: '已存在信用办理中的申请订单，暂时无法重复提交',
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})