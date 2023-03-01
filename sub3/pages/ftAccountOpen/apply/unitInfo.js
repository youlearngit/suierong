import WxValidate from '../../../../assets/plugins/wx-validate/WxValidate';
import requestYT from "../../../../api/requestYT";
import gs from "../../../../api/gs";
import industry from '../component/industry';
import user from '../../../../utils/user';
import enumType from '../component/enum';
import Toast from '../../../static/vant-weapp/toast/toast';
import Org from '../../../../api/Org'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    preffixUrl:'',
    isCreate:'', //状态: 0-新增、1-修改、2已预约
    uniqId:'', //用于修改
    formDisabeld: false, //表单是否制只读
    minDate: new Date().getTime(),//日期选择控制

    //营业执照识别信息
    gsInfo: {},
    canvasWidth:'',
    canvasHeight:'',


    //表单体
    //单位信息
    phone:'', //预约手机号,获取微信默认手机号
    shxydm:'',
    custName:'',
    identityFileType:'', //证明文件种类
    identityFileTypeother: '', //其他证明文件种类
    identityFileNo:'',  //证明文件编号
    identityFileNoother:'', //其他证明文件编号
    identityFileDate:'', //证明文件有效期
    identityFileDateother:'', //其他证明文件有效期
    specialorgNo:'', //特殊机构赋码编号
    orgCode:'',
    stateTaxRegisterNo:'',
    landTaxRegisterNo:'',
    depositorType:'',
    industryType: '',
    registerCapital:'',
    zcyb:'',
    businessScope:'',
    registerAddress:'',
    registerPhone:'',
    workAddress:'',
    workAddressCode:'',
    establishDate:'',
    licenceApproveOrg:'', //特殊机构赋码编号,ftn必填
    specialorgNo: '',

    // 上级机构信息
    preLegalEnterprise:'',
    preBaseAccountxkzh:'',
    preDmzNo:'',
    preDmzType:'',
    preLegalName:'',
    preLegalCardType:'',
    preLegalCardNo:'',

    //开户类型
    khlx:'FTE',
    formAccountTypeItems: enumType.type.formAccountTypeItems,
    //是否有上级机构
    isHaveProOrg: false, 
    hasInstitutionsItems: enumType.type.hasInstitutionsItems,//是否有上级机构选择类型
    //居住状态选项
    sjdmzl:'',
    sjdmzlIndex: [''],
    sjdmzlItems:enumType.type.sjdmzlItems,
    //上级法定代表人证件类型选项
    sjfddbrzj:'',
    sjfddbrzjIndex: [''],
    sjfddbrzjItems:enumType.type.sjfddbrzjItems,
    //证明文件种类
    zmwjzl:'',
    zmwjzlIndex:['0'],
    zmwjzlItems:enumType.type.zmwjzlItems,
    //其他证明文件种类
    qtzmwjzl:'',
    qtzmwjzlIndex:['0'],
    qtzmwjzlItems:enumType.type.qtzmwjzlItems,
    //存款人类别
    ckrlb:'',
    ckrlbIndex:['0'],
    ckrlbItems: enumType.type.ckrlbItems,
    //注册资金币种
    zczjbz:'',
    zczjbzIndex:['0'],
    zczjbzItems: enumType.type.zczjbzItems,
    //证明文件有效期时间戳记录
    identityFileDateDatePicker:'', 
    identityFileDateotherDatePicker:'',
    //证明文件有效期选择
    businessValidityIndex:['0'],
    businessValidity:'',
    businessValidityItem: enumType.type.businessValidityItem,
    //其他证明文件有效期选择
    qtbusinessValidityIndex:['0'],
    qtbusinessValidity:'',
    qtbusinessValidityItem: enumType.type.businessValidityItem,
    //行业分类
    showOver: false,
    hyfl:'',
    hyflIndex:['0'],
    hyflItems: industry.industry1,
    //错误名称提示头
    erroName:enumType.type.erroNames,
    //弹窗标记
    dialogFlag:{
      businessValidityType: false, //证明文件有效期类型选择标记
      identityFileDate: false, //证明文件有效期弹窗标记
      identityFileDateother: false, //其他证明文件有效期弹窗标记
      establishDate: false,//成立日期弹窗标记
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =this;
    that.setData({
      preffixUrl: app.globalData.CDNURL,
      isCreate: options.isCreate,
      uniqId : options.uniqId
    });
  },
  //获取已经提交本地的数据
  getApplyInfo(){
    var that = this;
    let options = {
      url: '/ft/searchInfoByUniqId.do',
      data: {
        uniqId: that.data.uniqId,
        type: '1',
      }
    };
    requestYT(options).then((res) => {
      if(res.STATUS =='1'){
        var info = JSON.parse(res.enterpriseInfo);
        that.setData({
          //单位信息
          phone : info.CUSTOMER_PHONE?info.CUSTOMER_PHONE:'', //预约手机号
          khlx : info.KHLX?info.KHLX:'', //开户类型
          custName: info.ACCOUNT_NAME?info.ACCOUNT_NAME:'', //客户名称
          shxydm : info.SHXYDM?info.SHXYDM:'', //社会统一信用代码
          identityFileType : info.PROVE_FILE_TYPE?info.PROVE_FILE_TYPE:'', //证明文件种类
          zmwjzl: info.PROVE_FILE_TYPE ? that.convertzmwjzl(info.PROVE_FILE_TYPE):'',
          identityFileTypeother: info.PROVE_FILE_TYPE_OTHER?info.PROVE_FILE_TYPE_OTHER:'', //其他证明文件种类
          convertqtzmwjzl:info.PROVE_FILE_TYPE_OTHER?that.convertqtzmwjzl(info.PROVE_FILE_TYPE_OTHER):'',
          identityFileNo: info.PROVE_FILE_NO?info.PROVE_FILE_NO:'', //证明文件编号
          identityFileNoother : info.PROVE_FILE_NO_OTHER?info.PROVE_FILE_NO_OTHER:'', //其他证明文件编号
          identityFileDate: info.PROVE_FILE_VALIDDATE?info.PROVE_FILE_VALIDDATE:'', //证明文件有效期
          businessValidity:that.convertBusinessValidityType(info.PROVE_FILE_VALIDDATE),
          identityFileDateother: info.PROVE_FILE_VALIDDATE_OTHER?info.PROVE_FILE_VALIDDATE_OTHER:'', //其他证明文件有效期
          qtbusinessValidity:info.PROVE_FILE_VALIDDATE_OTHER?that.convertqtBusinessValidity(info.PROVE_FILE_VALIDDATE_OTHER):'',
          specialorgNo: info.SPECIAL_ORG_CODE_NO?info.SPECIAL_ORG_CODE_NO:'', //特殊机构赋码编号
          orgCode: info.KHLX == 'FTE'?info.ORGANISATION_CODE?info.ORGANISATION_CODE:'':'', // 组织机构代码 
          stateTaxRegisterNo: info.KHLX == 'FTE'?info.STATE_TAX_REGISTER?info.STATE_TAX_REGISTER:'':'', //国税登记证号
          landTaxRegisterNo: info.KHLX == 'FTE'?info.LAND_TAX_REGISTER?info.LAND_TAX_REGISTER:'':'', //地税登记证号
          depositorType: info.DEPOSITOR_TYPE?info.DEPOSITOR_TYPE:'', //存款人类别
          ckrlb: info.DEPOSITOR_TYPE?that.convertckrln(info.DEPOSITOR_TYPE):'',
          industryType:  info.INDUSTRY_TYPE?info.INDUSTRY_TYPE:'', //行业类别
          hyfl : info.INDUSTRY_NAME?info.INDUSTRY_NAME:'', //行业名称
          registerCapitalType: info.REGISTER_CAPITALCUR_TYPE?info.REGISTER_CAPITALCUR_TYPE:'', //注册资金币种
          zczjbz: info.REGISTER_CAPITALCUR_TYPE?that.convertzczjbz(info.REGISTER_CAPITALCUR_TYPE):'',
          registerCapital: info.REGISTER_CAPITAL?info.REGISTER_CAPITAL:'', //注册资金
          businessScope: info.BUSINESS_SCOPE?info.BUSINESS_SCOPE:'', //经营范围
          registerAddress: info.REGISTER_ADDRESS?info.REGISTER_ADDRESS:'', //注册地址
          registerPhone: info.REGISTER_PHONE?info.REGISTER_PHONE:'', //注册电话
          zcyb: info.REGISTERCODE?info.REGISTERCODE:'', //注册邮编
          workAddress: info.WORK_PLACE?info.WORK_PLACE:'', //办公地址
          workAddressCode: info.WORK_PLACE_CODE?info.WORK_PLACE_CODE:'', //办公邮编
          establishDate: info.ESTABLISH_DATE?info.ESTABLISH_DATE:'', //成立日期 to 转
          licenceApproveOrg: info.LICENSE_APPROVE_ORG?info.LICENSE_APPROVE_ORG:'', //执照批准机关

          //上级机构信息
          isHaveProOrg: info.ISHAVE_PREORG == "1", //有无上级机构
          preLegalEnterprise: info.ISHAVE_PREORG == "1" ? info.PRELEGALORMASTERENTERPRISE : '', //上级法人或主管单位名称
          preBaseAccountxkzh: info.ISHAVE_PREORG == "1" ? info.PREBASEACCOUNTXKZH : '', //上级基本存款账户开户许可证号
          preDmzType: info.ISHAVE_PREORG == "1" ? info.PREDMZTYPE : '', //上级代码证件种类
          sjdmzl:info.PREDMZTYPE?that.convertsjdmzl(info.PREDMZTYPE):'',
          preDmzNo: info.ISHAVE_PREORG == "1" ? info.DMZNO : '', //上级代码证件编号
          preLegalName: info.ISHAVE_PREORG == "1" ? info.PRE_LEGAL_NAME : '', //上级法定代表人名称
          preLegalCardType: info.ISHAVE_PREORG == "1" ? info.PRE_LEGAL_CARDTYPE : '', //上级法定代表人证件类型
          sjfddbrzj: info.PRE_LEGAL_CARDTYPE ? that.convertsjfddbrzj(info.PRE_LEGAL_CARDTYPE) :'',
          preLegalCardNo: info.ISHAVE_PREORG == "1" ? info.PRE_LEGAL_CARDNO : '', //上级法定代表人证件号码
        });
        that.isHaveProOrg(info.ISHAVE_PREORG);
      }
    });
  },
  // 返转值显示


  inputSerchshxydm: function(e){
    var that = this;
    this.getRegisterInfo(that.data.shxydm,"");
  },

  // 选择表单类型
  selectAccountType: function(e){
    this.setData({
      khlx: e.detail.value
    });
  },
  //是否有上级机构
  hasInstitutionsChange: function(e){
    this.setData({
      isHaveProOrg: e.detail.value == '2' ? false: true
    });
  },
  //是否有上级机构
  isHaveProOrg: function (newVal) {
    var that = this;
    var newItems = that.data.hasInstitutionsItems;
    newItems.forEach((obj)=>{
      if(obj.value == newVal){
        obj.checked = true;
      }else{
        obj.checked = false;
      }
    });
    that.setData({
      hasInstitutionsItems : newItems
    });
  },
  // 选择上级代码种类
  sjdmzlChange: function(e){
    var that =this;
    if(that.data.formDisabeld){
      return;
    }
    this.setData({
      sjdmzl: that.data.sjdmzlItems[0][e.detail.value[0]].name,
      preDmzType: that.data.sjdmzlItems[0][e.detail.value[0]].value
    });
  },
   convertsjdmzl: function(value){
    var obj = this.data.sjdmzlItems[0].find(function(x) {
      return x.value == value;
    });
    this.setData({
      sjdmzl : obj.name
    });
  },
  // 选择法定代表人证件类型选项
  sjfddbrzjChange: function(e){
    var that =this;
    this.setData({
      sjfddbrzj: that.data.sjfddbrzjItems[0][e.detail.value[0]].name,
      preLegalCardType: that.data.sjfddbrzjItems[0][e.detail.value[0]].value
    });
  },
  convertsjfddbrzj: function(value){
    var obj = this.data.sjfddbrzjItems[0].find(function(x) {
      return x.value == value;
    });
    this.setData({
      sjfddbrzj : obj.name
    });
  },
  
  // 选择证明文件种类
  zmwjzlChange: function(e){
    this.setData({
      zmwjzl:this.data.zmwjzlItems[0][e.detail.value[0]].name,
      identityFileType: this.data.zmwjzlItems[0][e.detail.value[0]].value
    });
  },
  //选择证明文件种类反转
  convertzmwjzl: function(value){
      var obj = this.data.zmwjzlItems[0].find(function(x) {
        return x.value == value;
      });
      this.setData({
        zmwjzl : obj.name
      });
  },
  // 选择其他证明文件种类
  qtzmwjzlChange: function(e){
    if(this.data.qtzmwjzlItems[0][e.detail.value[0]].value==='-1'){
      this.setData({
        qtzmwjzl:'',
        identityFileTypeother: ''
      });
    }else{
      this.setData({
        qtzmwjzl:this.data.qtzmwjzlItems[0][e.detail.value[0]].name,
        identityFileTypeother: this.data.qtzmwjzlItems[0][e.detail.value[0]].value
      });
    }
  },
  convertqtzmwjzl: function(value){
    var obj = this.data.qtzmwjzlItems[0].find(function(x) {
      return x.value == value;
    });
    this.setData({
      qtzmwjzl : obj.name
    });
  },
  // 选择存款人类别
  ckrlnChange: function(e){
    var that =this;
    if(that.data.khlx == 'FTN'){
      return;
    }
    this.setData({
      ckrlb: that.data.ckrlbItems[0][e.detail.value[0]].name,
      depositorType : that.data.ckrlbItems[0][e.detail.value[0]].value
    });
  },
  convertckrln: function(value){
    var obj = this.data.ckrlbItems[0].find(function(x) {
      return x.value == value;
    });
    this.setData({
      ckrlb : obj.name
    });
  },
  //注册资金币种
  zczjbzChange: function(e){
    var that =this;
    that.setData({
      zczjbz: that.data.zczjbzItems[0][e.detail.value[0]].name,
      registerCapitalType: that.data.zczjbzItems[0][e.detail.value[0]].value
    });
  },
  convertzczjbz: function(value){
    var obj = this.data.zczjbzItems[0].find(function(x) {
      return x.value == value;
    });
    this.setData({
      zczjbz : obj.name
    });
  },
  //选择证明文件有效期类型
  businessValidityTypeChange(e){
    var that = this;
    var item = that.data.businessValidityItem[0][e.detail.value[0]];
    if(item.value != '0'){
      that.setData({
        identityFileDateDatePicker : '',
        identityFileDate: item.value == '1'?'9999-12-31':'9999-12-30'
      });
    }
    that.setData({
      businessValidityIndex: item.value,
      businessValidity: item.name, //显示证明文件有效期选项
      dialogFlag:{ //有效期则显示添加时间按钮
        identityFileDate: item.value == '0'
      }
    });
  },
  convertBusinessValidityType(value){
    if(value == '9999-12-31' || value == '9999-12-30'){
      this.setData({
        businessValidityIndex: value=='9999-12-31'?'1':'2',
        businessValidity : value == '9999-12-31'?'长期':'无有效期',
        identityFileDateDatePicker: '',
      });
    }else{
      this.setData({
        businessValidityIndex:'0',
        businessValidity : '固定有效期',
        identityFileDateDatePicker: value != ''?this.converDateToTimes(value):'',
      });
    }
  },
  qtBusinessValidityTypeChange(e){
    var that = this;
    var item = that.data.qtbusinessValidityItem[0][e.detail.value[0]];
    if(item.value != '0'){
      that.setData({
        identityFileDateotherDatePicker : '',
        identityFileDateother: item.value == '1'?'9999-12-31':'9999-12-30'
      });
    }
    that.setData({
      qtbusinessValidityIndex: item.value,
      qtbusinessValidity: item.name, //显示证明文件有效期选项
      dialogFlag:{ //有效期则显示添加时间按钮
        identityFileDateother: item.value == '0'
      }
    });
  },
  convertqtBusinessValidity(value){
    if(value == '9999-12-31' || value == '9999-12-30'){
      this.setData({
        qtbusinessValidityIndex: value=='9999-12-31'?'1':'2',
        qtbusinessValidity : value == '9999-12-31'?'长期':'无有效期',
        identityFileDateotherDatePicker: '',
      });
    }else{
      this.setData({
        qtbusinessValidityIndex: '0',
        qtbusinessValidity : '固定有效期',
        identityFileDateotherDatePicker: value != ''?this.converDateToTimes(value):'',
      });
    }
  },
  //选择日期
  identityFileDateChange: function(e){
    var that = this;
    if(that.data.formDisabeld){
      return;
    }
    that.setData({
      dialogFlag:{
        identityFileDate : true
      }
    });
  },
  qtIdentityFileDateChange: function(e){
    var that = this;
    if(that.data.formDisabeld){
      return;
    }
    that.setData({
      dialogFlag:{
        identityFileDateother : true
      }
    });
  },
  // 行业分类
  clickType :function(e) {
    if(this.data.formDisabeld){
      return;
    }
    this.setData({
      showOver: !this.data.showOver
    })
  },
  industryInfo(res){
    var res = res.detail;
    this.setData({
      hyfl:res.name,
      industryType: res.value,
    });
  },
  //成立日期
  establishDateChange: function(e){
    var that = this;
    if(that.data.formDisabeld){
      return;
    }
    that.setData({
      dialogFlag:{
        establishDate : true
      }
    });
  },
  //关闭所有弹窗
  onClose() {
    var that = this;
    this.setData({
      dialogFlag:{
        businessValidityType: false,
        identityFileDate : false , //限制取消按钮
        identityFileDateother : false, //限制取消按钮
        establishDate:false,
      }
    });
  },
  onBusinessValidityTypeEvent: function(e){
    var that = this;
    let {type,detail} = e;
    that.setData({
      identityFileDate: Date.DateFormat(new Date(detail),'yyyy-MM-dd'),
      identityFileDateDatePicker:detail,
    });
    that.onClose();
  },
  onIdentityFileDateEvent: function (e) {
    var that = this;
    let {type,detail} = e;
    that.setData({
      identityFileDate: Date.DateFormat(new Date(detail),'yyyy-MM-dd'),
      identityFileDateDatePicker:detail,
    });
    that.onClose();
  },
  onQTIdentityFileDateEvent: function (e) {
    var that = this;
    let {type,detail} = e;
    that.setData({
      identityFileDateother: Date.DateFormat(new Date(detail),'yyyy-MM-dd'),
      identityFileDateotherDatePicker:detail,
    });
    that.onClose();
  },
  onEstablishDateEvent: function (e) {
    var that = this;
    let {type,detail} = e;
    that.setData({
      establishDate : Date.DateFormat(new Date(detail),'yyyy-MM-dd'),
      establishDatePickerDatePicker: detail
    });
    that.onClose();
  },

  // 上传营业执照
  async getGS() {
    var ctx =  wx.createCanvasContext("attendCanvasId");
    var that = this;
    var gsInfo = await gs.getGSInfo('attendCanvasId',ctx,that);
    this.getRegisterInfo(gsInfo.RE_REGISTER_ID,gsInfo);
  },
  //通过社会信用统一码获取
  async getRegisterInfo(registerId,gsInfo){
    if(registerId == '' || registerId.length != 18){
      return
    }
    var flag = 0;
    var that = this;
    wx.hideLoading({
      success: (res) => {
        wx.showLoading({
          title: "正在识别",
        })
      },
    })
    const res = await Org.getEnterpriseInfo({
      type: '2', //1 企业名称  2统一码
      companyCode:registerId,
    });
    if(res.enterpriseInfo != ''){
      var info = res.enterpriseInfo;
      that.setData({
        custName: info.eNTNAME?info.eNTNAME:'',
        shxydm: info.cREDITCODE?info.cREDITCODE:'',
        identityFileNo: info.cREDITCODE?info.cREDITCODE:'',
        landTaxRegisterNo: info.cREDITCODE?info.cREDITCODE:'',
        stateTaxRegisterNo: info.cREDITCODE?info.cREDITCODE:'',
        businessScope: info.oPSCOPE?info.oPSCOPE:'',
        orgCode: info.oRGCODES?info.oRGCODES:'',
        zcyb:info.rEGORGCODE?info.rEGORGCODE:'',
        //营业执照类型反显
        identityFileType: that.data.zmwjzlItems[0][0].value,
        zmwjzl: that.data.zmwjzlItems[0][0].name,
        //建立日期反显
        establishDate:  info.oPFROM?that.converTimeStringFormart(info.oPFROM,'-'):'',
        establishDatePickerDatePicker: info.oPFROM?that.converDateToTimes(info.oPFROM):'',//反显时间戳

        //证明文件起始有效期
        identityFileDate:  info.oPTO!='长期'?info.oPTO:'9999-12-31',
        businessValidityIndex: info.oPTO=='长期'?'1':'0',
        businessValidity:info.oPTO=='长期'?'长期':'固定有效期',
        identityFileDateDatePicker: info.oPTO != '长期'?that.converDateToTimes(info.oPTO):'',
        identityFileType: that.data.zmwjzlItems[0][0].value,
        zmwjzl: that.data.zmwjzlItems[0][0].name,
      });
      flag++;
    }
    if(gsInfo != ''){
      that.setData({
            //证明文件有效期反显，内喊长期
            registerAddress: gsInfo.RE_ADDRESS?gsInfo.RE_ADDRESS:'',
      });
      flag++;
    }else{
      wx.hideLoading()
    }
    if(flag>0){
      wx.hideLoading({
        success: (res) => {
            wx.showToast({
                title: '识别成功',
            })
        },
      })
    }else{
      wx.hideLoading({
        success: (res) => {
            wx.showToast({
                title: '未识别到企业信息，请重试',
            })
        },
      })
    }
  },

  //日期格式转换为时间戳
  converDateToTimes: function (timeString) {
    var reDateString = this.converTimeStringFormart(timeString,'-');
    return new Date(reDateString).getTime();
  },
  //年月日字符串替换
  converTimeStringFormart: function(string,type){
    if(string.indexOf("-")>-1){
      return string;
    }
    return string.replace('年',type).replace('月',type).replace('日','');
  },
  //表单校验
  initValidate(){
    var that =this;
    //校验字段
    let rules = {
      // 单位信息
      custName: {required: true, maxlength:80}, //客户名称
      shxydm : {required: that.data.khlx == 'FTE' ,maxlength:50}, //社会统一信用代码
      specialorgNo: {required: that.data.khlx == 'FTN',maxlength:9}, //特殊机构赋码编号
      zmwjzl : {required: true}, //证明文件种类
      identityFileNo: {required: true,maxlength:20}, //证明文件编号
      identityFileNoother: {required: false,maxlength:20}, //其他证明文件编号
      identityFileDate: {required: that.data.businessValidityIndex[0] == '0'}, //证明文件有效期
      orgCode: {required: that.data.khlx == 'FTE',maxlength:9}, // 组织机构代码
      stateTaxRegisterNo: {required: that.data.khlx == 'FTE',maxlength:150}, //国税登记证号
      landTaxRegisterNo: {required: that.data.khlx == 'FTE',maxlength:150}, //地税登记证号
      ckrlb: {required: true}, //存款人类别
      hyfl: {required: true}, //行业类别
      zczjbz: {required: true}, //注册资金币种
      registerCapital: {required: true,maxlength:50}, //注册资金
      businessScope: {required: true,maxlength:1000}, //经营范围
      registerAddress: {required: true,maxlength:200}, //注册地址
      registerPhone: {required: true,maxlength:20,number:true}, //注册电话
      zcyb: {required: true,maxlength:10,}, //注册电话
      workAddress: {required: true,maxlength:450}, //办公地址
      workAddressCode: {required: true,minlength:6, maxlength:6,digts:true}, //办公邮编
      establishDate: {required: true}, //成立日期
      licenceApproveOrg: {required: that.data.khlx == 'FTE',maxlength:90}, //执照批准机关
    }
    //错误提示信息
    let messages = {
      custName: {required: "请输入客户名称"}, //客户名称
      shxydm : {required: "请输入统一社会信用代码或其他证明文件编号"}, //社会统一信用代码
      zmwjzl : {required: that.data.khlx == "FTN"?"请选择证明文件类型1":"请选择证明文件种类"}, //证明文件种类
      identityFileNo: {required: "请输入证明文件编号"}, //证明文件编号
      identityFileDate: {required: "请选择证明文件有效期"}, //证明文件有效期
      specialorgNo:{required: "请输入特殊机构赋码编号"}, //特殊机构赋码编号
      orgCode: {required: "请输入组织机构代码"}, // 组织机构代码
      stateTaxRegisterNo: {required: "请输入国税登记证号"}, //国税登记证号
      landTaxRegisterNo: {required: "请输入地税登记证号"}, //地税登记证号
      ckrlb: {required: "请选择存款人类别"}, //存款人类别
      hyfl: {required: "请选择行业类别"}, //行业类别
      zczjbz: {required: "请选择注册资金币种"}, //注册资金币种
      registerCapital: {required: "请输入注册资金"}, //注册资金
      businessScope: {required: "请输入经营范围"}, //经营范围
      registerAddress: {required: "请输入注册地址"}, //注册地址
      registerPhone: {required: "请输入注册电话"}, //注册电话
      zcyb: {required: "请输入注册邮编"}, //注册电话
      workAddress: {required: "请输入办公地址"}, //办公地址
      workAddressCode: {required: "请输入6位数办公邮编"}, //办公邮编
      establishDate: {required: "请选择成立日期"}, //成立日期
      licenceApproveOrg: {required: "请输入执照批准机关"}, //执照批准机关
    }
    //是否有上级机构信息
    if (that.data.isHaveProOrg) {
      rules = Object.assign(rules, {
        //追加机构信息校验
        preLegalEnterprise: {required: true,maxlength:50}, //上级法人或主管单位名称
        preBaseAccountxkzh: {required: true,maxlength:50}, //上级基本存款账户开户许可证号
        sjdmzl: {required: true}, //上级代码证件种类
        preDmzNo: {required: true,maxlength:50}, //上级代码证件编号
        preLegalName: {required: true,maxlength:50}, //上级法定代表人名称
        sjfddbrzj: {required: true}, //上级法定代表人证件类型
        preLegalCardNo: {required: true,maxlength:50} //上级法定代表人证件号码
      });
      messages = Object.assign(messages,{
        //追加机构信息错误提示
        preLegalEnterprise: {required: '请输入上级法人或主管单位名称'},//上级法人或主管单位名称
        preBaseAccountxkzh : {required: '请输入上级基本存款账户开户许可证号'},//上级基本存款账户开户许可证号
        sjdmzl:{required:'请选择上级代码证件种类'}, //上级代码证件种类
        preDmzNo:{required: '请输入代码证件编号'}, //上级代码证件编号
        preLegalName: {required:'请输入法定代表人名称'}, //上级法定代表人名称
        sjfddbrzj:{required:'请选择上级法定代表人证件类型'},//上级法定代表人证件类型
        preLegalCardNo: {required: "请输入上级法定代表人证件号码"} //上级法定代表人证件号码
      });
    }
    that.WxValidate = new WxValidate(rules, messages);
  },
  //提交表单
  submitForm: function(e){
    var that = this;
    //已提交预约状态，只读
    wx.showLoading({
      title: '请稍后...',
      mask: true
    })
    if(that.data.isCreate == '2'){
      wx.hideLoading();
      wx.navigateTo({
        url: "/sub3/pages/ftAccountOpen/apply/accountInfoPage?uniqId="+that.data.uniqId+"&isCreate="+that.data.isCreate+"&accountType="+that.data.khlx,
      })
    }else{
      //已提交预约状态，可以新增、修改
      let params = e.detail.value;
      that.initValidate(); 
      if (!that.WxValidate.checkForm(params)) {
        wx.hideLoading();
        var error = that.WxValidate.errorList[0];
        var message = error.value != '' ? that.data.erroName[error.param] : '';
        Toast(message + that.WxValidate.errorList[0].msg.replace('。', ''));
      }else{
        //单位信息
        let data = {
          openId: wx.getStorageSync('openid'), //微信id
          uniqId: that.data.uniqId  != ''? that.data.uniqId : '', //数据唯一标识,区别新增/修改
          //单位信息
          phone:that.data.phone, //预约手机号
          khlx : that.data.khlx, //开户类型
          custName: that.data.custName, //客户名称
          shxydm : that.data.khlx == "FTE" ? that.data.shxydm : that.data.specialorgNo, //社会统一信用代码
          identityFileType : that.data.identityFileType, //证明文件种类
          identityFileTypeother : that.data.identityFileTypeother, //其他证明文件种类
          identityFileNo: that.data.identityFileNo, //证明文件编号
          identityFileNoother : that.data.identityFileTypeother ===''? '': that.data.identityFileNoother, //其他证明文件编号
          identityFileDate: that.data.identityFileDate, //证明文件有效期
          identityFileDateother : that.data.identityFileTypeother ===''? '':that.data.identityFileDateother, //其他证明文件有效期
          specialorgNo: that.data.khlx == 'FTN' ?that.data.specialorgNo :'', //特殊机构赋码编号
          orgCode: that.data.khlx == 'FTE'?that.data.orgCode:'', // 组织机构代码
          stateTaxRegisterNo: that.data.khlx == 'FTE'?that.data.stateTaxRegisterNo:'', //国税登记证号
          landTaxRegisterNo: that.data.khlx == 'FTE'?that.data.landTaxRegisterNo:'', //地税登记证号
          depositorType: that.data.depositorType, //存款人类别
          industryType: that.data.industryType, //行业类别
          industryName: that.data.hyfl, //行业类别名称
          registerCapitalType: that.data.registerCapitalType, //注册资金币种
          registerCapital: that.data.registerCapital, //注册资金币种
          businessScope: that.data.businessScope, //经营范围
          registerAddress: that.data.registerAddress, //注册地址
          registerPhone: that.data.registerPhone, //注册电话
          zcyb: that.data.zcyb, //注册邮编
          workAddress: that.data.workAddress, //办公地址
          workAddressCode: that.data.workAddressCode, //办公邮编
          establishDate: that.data.establishDate, //成立日期
          licenceApproveOrg: that.data.licenceApproveOrg, //执照批准机关

          //上级机构信息
          isHaveProOrg: that.data.isHaveProOrg ?'1':'2', //有无上级机构
          preLegalEnterprise: that.data.isHaveProOrg ? that.data.preLegalEnterprise : '', //上级法人或主管单位名称
          preBaseAccountxkzh: that.data.isHaveProOrg ? that.data.preBaseAccountxkzh : '', //上级基本存款账户开户许可证号
          preDmzType: that.data.isHaveProOrg ? that.data.preDmzType : '', //上级代码证件种类
          preDmzNo: that.data.isHaveProOrg ? that.data.preDmzNo : '', //上级代码证件编号
          preLegalName: that.data.isHaveProOrg ? that.data.preLegalName : '', //上级法定代表人名称
          preLegalCardType: that.data.isHaveProOrg ? that.data.preLegalCardType : '', //上级法定代表人证件类型
          preLegalCardNo: that.data.isHaveProOrg ? that.data.preLegalCardNo : '', //上级法定代表人证件号码
        }
        let options = {
          url: '/ft/recordEnterpriseInfo.do',
          data: data
        };
        requestYT(options).then((res) => {
          if(res.msgCode =='0000'){
            that.setData({
              uniqId: res.uniqId
            });
            wx.hideLoading();
            wx.navigateTo({
                    url: "/sub3/pages/ftAccountOpen/apply/accountInfoPage?uniqId="+res.uniqId+"&isCreate="+that.data.isCreate+"&accountType="+that.data.khlx,
            })
          }else{
            wx.hideLoading();
            Toast(res.msg);
          }
        });
      }
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    if(that.options.isCreate != '0'){//状态为修改，查询数据
      if(that.options.isCreate == '2'){//已预约，查看详情，表单禁止改写
        that.setData({
          formDisabeld: true
        });
      }
      that.getApplyInfo();
    }else{
      //新建获取手机号
      user.getCustomerInfo().then((res) => {
        that.setData({
          phone: res.TEL?res.TEL:'',
        });
      });
    }
    //监听器,用于读取数据反显选项
    app.watch(that, {
      //开户类型数据监听
      khlx: function (newVal) {
        var newItems = that.data.formAccountTypeItems;
        newItems.forEach((obj)=>{
          obj.checked = obj.name.indexOf(newVal)>-1;
        });
        //上级机构单选按钮默认无
        if(newVal == 'FTE'){
          that.setData({
            isHaveProOrg: false
          });
          that.isHaveProOrg('2');
        }else{
          //FTN存款人类别固定为境外机构，不可选择
          that.setData({
            ckrlb: '境外机构',
            depositorType : '108',
          });
        }
       
        that.setData({
          formAccountTypeItems : newItems
        });
      },
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})