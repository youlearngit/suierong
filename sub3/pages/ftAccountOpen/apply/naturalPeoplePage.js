// sub3/pages/ftAccountOpen/apply/naturalPeoplePage.js
import WxValidate from '../../../../assets/plugins/wx-validate/WxValidate';
import requestYT from "../../../../api/requestYT";
import enumType from '../component/enum';
import Toast from '../../../static/vant-weapp/toast/toast';

const app = getApp();
var encr = require('../../../../utils/encrypt/encrypt.js'); //国密3段式加密
Page({

  /**
   * 页面的初始数据
   */
  data: {
    preffixUrl:'',
    isCreate:'',
    uniqId:'',
    natureId: '',
    formDisabeld:false,
    accountType: '',

   //表单请求体
   legalName:'', //法定代表人姓名
   legalCardType: '', //法定代表人证件类型
   legalCardNo: '', //法定代表人证件号码
   legalCardValidDate: '', //法定代表人证件有效期
   legalPhone: '', //法定代表人手机号

   sqOpenAccountName: '', //授权开户代理人姓名
   sqOpenAccountCardType: '', //授权开户代理人证件类型
   sqOpenAccountCardNo: '', //授权开户代理人证件号码
   sqOpenAccountCardValidDate:'', //授权开户代理人证件有效期
   sqOpenAccountPhone: '', //授权开户代理人手机号码
   
   financialName: '', //财务姓名
   financialCardType: '', //财务证件种类
   financialCardNo: '', //财务证件号码
   financialValidDate: '',//财务证件有效期
   financialPhone: '', //财务电话

   contactName:'', //联系人姓名
   contactCardType: '', //联系人证件种类
   contactCardNo: '', //联系人证件号码
   contactValidDate: '',//联系人证件有效期
   contactPhone: '', //联系人电话

   deczcontactName1: '', //大额查证联系人姓名1
   deczcontactCardType1:'', //大额查证证件种类1
   deczcontactCardNo1: '', //大额查证联系人证件号码1
   deczcontactPhone1: '', //大额查证联系人电话1
   deczcontactCardValidDate1: '', //大额查证联系人证件有效期1

   deczcontactName2: '', //大额查证联系人姓名2
   deczcontactCardType2:'', //大额查证证件种类2
   deczcontactCardNo2: '', //大额查证联系人证件号码2
   deczcontactPhone2: '', //大额查证联系人电话2
   deczcontactCardValidDate2: '', //大额查证联系人证件有效期2


    // activeNames:[], //折叠面板打开项
    activeNames:['fddbr','sqkhdlr','cwfzr','lxr','deczlxr1','deczlxr2'], //折叠面板打开项
    activeCWDialog: false,//财务负责人叠着面板控制
    activeLXRDialg:false, //联系人叠着面板控制
    activeDE1Dialg:false, //联系人叠着面板控制
    activeDE2Dialg:false, //联系人叠着面板控制

    //消息弹窗标记
    showTip: false,
    //弹窗提示信息
    message:"为保障我单位资金安全，我单位在你行开立的结算账户，在办理大额付款业务时可联系下述两名主管人员之一配合进行电话查证，并以电话方式确认付款业务是否真实存在。贵行电话查证不作为我单位付款的必要条件。",

    // 证件类型
    fdzjlx:'',
    sqzjlx:'',
    cwzjlx:'',
    lxzjlx:'',
    de1zjlx:'',
    de2zjlx:'',
    zjlxIndex: ['0'],
    zjlxItems:enumType.type.sjfddbrzjItems,

    //ocr识别返回接收参数
    ocrInfo:{},

    //证件有效选择范围
    fdcertValidityFlag:true, //法定代表人有效期输入框是否显示
    sqcertValidityFlag:true, //授权代理人有效期输入框是否显示
    cwcertValidityFlag:true, //财务负责人有效期输入框是否显示
    lxrcertValidityFlag:true, //联系人人有效期输入框是否显示
    de1certValidityFlag:true, //大额1有效期输入框是否显示
    de2certValidityFlag:true, //大额2有效期输入框是否显示

    fdcertValidityItems:[
      {value:'0',name:'长期',marginRight:'50'},
      {value:'1',name:'有效期',checked: 'true'}
    ],
    sqcertValidityItems:[
      {value:'0',name:'长期',marginRight:'50'},
      {value:'1',name:'有效期',checked: 'true'}
    ],
    cwcertValidityItems:[
      {value:'0',name:'长期',marginRight:'50'},
      {value:'1',name:'有效期',checked: 'true'}
    ],
    lxrcertValidityItems:[
      {value:'0',name:'长期',marginRight:'50'},
      {value:'1',name:'有效期',checked: 'true'}
    ],
    de1certValidityItems:[
      {value:'0',name:'长期',marginRight:'50'},
      {value:'1',name:'有效期',checked: 'true'}
    ],
    de2certValidityItems:[
      {value:'0',name:'长期',marginRight:'50'},
      {value:'1',name:'有效期',checked: 'true'}
    ],

    //是否是否授权他人办理开户
    legalIssq:true,//法定代表人是否授权他人办理开户 0:true，1:false
    legalIssqSelectItems:[
      {value:'1',name:'否',marginRight:'0'},
      {value:'0',name:'是',checked: 'true'}
    ],

    //同步人物信息类型选项
    cwfzrSyncSelectName:'其他', //财务负责人选择同步类型
    cwfzrSyncInfoIndex:['2'], //授权开户代理人选择数值
    lxsSyncSelectName:'其他', //联系人选择同步类型
    lxsSyncInfoIndex:['3'], //联系人选择同步类型数值
    dae1SyncSelectName:'其他', //大额1选择同步类型
    dae1SyncInfoIndex:['0'], //大额1选择同步类型数值
    dae2SyncSelectName:'其他', //大额2人选择同步类型
    dae2SyncInfoIndex:['0'], //大额2选择同步类型数值
    // 财务负责人可选同步类型
    cwsyncInfoItems:[[
      { value:"1" , name:'法定代表人' },
      { value:"2" , name:'授权开户代理人' },
      { value:"0" , name:'其他' },
    ]],
     // 联系人可选同步类型
    lxrsyncInfoItems:[[
      { value:"1" , name:'法定代表人' },
      { value:"2" , name:'授权开户代理人' },
      { value:"3" , name:'同财务负责人' },
      { value:"0" , name:'其他' },
    ]],
     // 大额查证联系人可选同步类型
    daesyncInfoItems:[[
      { value:"1" , name:'法定代表人' },
      { value:"2" , name:'授权开户代理人' },
      { value:"3" , name:'同财务负责人' },
      { value:"4" , name:'同联系人' },
      { value:"0" , name:'其他' },
    ]],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      preffixUrl: app.globalData.CDNURL,
      uniqId: options.uniqId,
      accountType: options.accountType,
      isCreate: options.isCreate,
    });
    if(options.isCreate == '2'){//已预约，查看详情，表单禁止改写
      that.setData({
        formDisabeld: true
      });
    }
    that.getAccountInfo();
    //监听器
    app.watch(this, {
      legalIssq: function (newVal) {
        var newItems = that.data.legalIssqSelectItems;
        var flag = newVal?'0':'1';
        newItems.forEach((obj)=>{
          if(obj.value == flag){
            obj.checked = true;
          }else{
            obj.checked = false;
          }
        });
        that.setData({
          legalIssqSelectItems : newItems
        });
      },
    })
  },
  getAccountInfo(){
    var that = this;
    let options = {
      url: '/ft/searchInfoByUniqId.do',
      data: {
        uniqId: that.data.uniqId,
        type: '3',
      }
    };
    requestYT(options).then((res) => {
      if(res.STATUS =='1'){
        if(res.natureInfo != ''){
          var info = JSON.parse(res.natureInfo);
            //表单请求体
            that.setData({
              legalName:info.NATURE_LEGAL_NAME, //法定代表人姓名
              legalCardType:info.NATURE_LEGAL_CARD_TYPE, //法定代表人证件类型
              legalCardNo: info.NATURE_LEGAL_CARD_NO, //法定代表人证件号码
              legalCardValidDate: info.NATURE_LEGAL_CARD_VALID_DATE == '9999-12-31' ? "" : info.NATURE_LEGAL_CARD_VALID_DATE, //法定代表人证件有效期
              legalPhone: info.NATURE_LEGAL_PHONE, //法定代表人手机号
              legalIssq: info.NATURE_LEGAL_ISSQ == "0", //法定代表人是否授权开户代理人

              sqOpenAccountName: info.NATURE_SQOPEN_ACCOUNT_NAME?info.NATURE_SQOPEN_ACCOUNT_NAME:'', //授权开户代理人姓名
              sqOpenAccountCardType: info.NATURE_SQOPEN_ACCOUNT_TYPE?info.NATURE_SQOPEN_ACCOUNT_TYPE:'', //授权开户代理人证件类型
              sqOpenAccountCardNo: info.NATURE_SQOPEN_ACCOUNT_NO?info.NATURE_SQOPEN_ACCOUNT_NO:'', //授权开户代理人证件号码
              sqOpenAccountCardValidDate : info.REMARK3 == '9999-12-31' ? "" : info.REMARK3, ////授权开户代理人证件有效期
              sqOpenAccountPhone: info.NATURE_SQOPEN_ACCOUNT_PHONE?info.NATURE_SQOPEN_ACCOUNT_PHONE:'', //授权开户代理人手机号码
              
              financialName: info.FINANCE_NAME?info.FINANCE_NAME:'', //财务姓名
              financialCardType: info.FINANCE_CARD_TYPE?info.FINANCE_CARD_TYPE:'', //财务证件种类
              financialCardNo: info.FINANCE_CARD_NO?info.FINANCE_CARD_NO:'', //财务证件号码
              financialValidDate: info.REMARK1 == '9999-12-31' ? "" : info.REMARK1, //财务证件有效期
              financialPhone: info.FINANCE_PHONE?info.FINANCE_PHONE:'', //财务电话

              contactName:info.CONTACT_NAME, //联系人姓名
              contactCardType: info.CONTACT_CARD_TYPE, //联系人证件种类
              contactCardNo: info.CONTACT_CARD_NO, //联系人证件号码
              contactValidDate: info.REMARK2 == '9999-12-31' ? "" : info.REMARK2, //联系人证件有效期
              contactPhone: info.CONTACT_PHONE, //联系人电话

              deczcontactName1: info.DECZ_CONTACT_NAME1, //大额查证联系人姓名1
              deczcontactCardType1:info.DECZ_CONTACT_TYPE1, //大额查证证件种类1
              deczcontactCardNo1: info.DECZ_CONTACT_NO1, //大额查证联系人证件号码1
              deczcontactPhone1: info.DECZ_CONTACT_PHONE1, //大额查证联系人电话1
              deczcontactCardValidDate1: info.DECZ_CONTACT_DATE1 == '9999-12-31' ? "" : info.DECZ_CONTACT_DATE1, //大额查证联系人证件有效期1

              deczcontactName2: info.DECZ_CONTACT_NAME2, //大额查证联系人姓名2
              deczcontactCardType2:info.DECZ_CONTACT_TYPE2, //大额查证证件种类2
              deczcontactCardNo2: info.DECZ_CONTACT_NO2, //大额查证联系人证件号码2
              deczcontactPhone2: info.DECZ_CONTACT_PHONE2, //大额查证联系人电话2
              deczcontactCardValidDate2: info.DECZ_CONTACT_DATE2 == '9999-12-31' ? "" : info.DECZ_CONTACT_DATE2, //大额查证联系人证件有效期2
            });
            that.convertzjlx("fd",info.NATURE_LEGAL_CARD_TYPE);
            if(info.NATURE_LEGAL_ISSQ == '0'){
              that.convertzjlx("sq",info.NATURE_SQOPEN_ACCOUNT_TYPE);
            }
            //转换证件类型名称
            that.convertzjlx("cw",info.FINANCE_CARD_TYPE);
            that.convertzjlx("lx",info.CONTACT_CARD_TYPE);
            that.convertzjlx("de1",info.DECZ_CONTACT_TYPE1);
            that.convertzjlx("de2",info.DECZ_CONTACT_TYPE2);
            // 转换证件有效期类型
            that.convertCertValidity(info.NATURE_LEGAL_CARD_VALID_DATE,'fd');
            that.convertCertValidity(info.REMARK3,'sq');
            that.convertCertValidity(info.REMARK1,'cw');
            that.convertCertValidity(info.REMARK2,'lxr');
            that.convertCertValidity(info.DECZ_CONTACT_DATE1,'dae1');
            that.convertCertValidity(info.DECZ_CONTACT_DATE2,'dae2');
        }
      }
    });
  },
  onActiveChange: function(e){
    var that = this;
    if(that.data.isCreate == '2'){
      return;
    }
   if(that.data.cwfzrSyncInfoIndex[0]!='2' && e.detail.indexOf('cwfzr')>1){//禁止打开财务负责人信息折叠板
      if(that.data.activeNames.indexOf('cwfzr')>1){
        that.data.activeNames.splice(that.data.activeNames.indexOf('cwfzr'),1);
        that.setData({
          activeNames: that.data.activeNames
        });
      }
   }else if (that.data.lxsSyncInfoIndex[0]!='3' && e.detail.indexOf('lxr')>1){
    if(that.data.activeNames.indexOf('lxr')>1){
      that.data.activeNames.splice(that.data.activeNames.indexOf('lxr'),1);
      that.setData({
        activeNames: that.data.activeNames
      });
    }
   }else if (that.data.dae1SyncInfoIndex[0]!='0' && e.detail.indexOf('deczlxr1')>1){
    if(that.data.activeNames.indexOf('lxr')>1){
      that.data.activeNames.splice(that.data.activeNames.indexOf('deczlxr1'),1);
      that.setData({
        activeNames: that.data.activeNames
      });
    }
   }else if (that.data.dae2SyncInfoIndex[0]!='0' && e.detail.indexOf('deczlxr2')>1){
    if(that.data.activeNames.indexOf('lxr')>1){
      that.data.activeNames.splice(that.data.activeNames.indexOf('deczlxr2'),1);
      that.setData({
        activeNames: that.data.activeNames
      });
    }
   }else{
    that.setData({
      activeNames: e.detail,
    });
   }
  },
  //证件有效期单选
  certValidityChange: function(e){
    var type = e.currentTarget.dataset.id;
    var value = e.detail.value;
    switch(type){
      case 'fd':
        this.setData({
          fdcertValidityFlag : value == '0' ? false: true
        });
        break;
      case 'sq':
        this.setData({
          sqcertValidityFlag : value == '0' ? false: true
        });
        break;
      case 'cw':
        this.setData({
          cwcertValidityFlag : value == '0' ? false: true
        });
        break;
      case 'lxr':
        this.setData({
          lxrcertValidityFlag : value == '0' ? false: true
        });
        break;
      case 'de1':
        this.setData({
          de1certValidityFlag : value == '0' ? false: true
        });
        break;
      case 'de2':
        this.setData({
          de2certValidityFlag : value == '0' ? false: true
        });
        break;
    }
  },
  //证件有效期单选
  convertCertValidity: function(value,type){
    var that = this;
    switch(type){
      case 'fd':
        var newItems = that.data.fdcertValidityItems;
        this.setData({
          fdcertValidityFlag : value == '9999-12-31' ? false: true
        });
        newItems.forEach((obj)=>{
          if(obj.value == (this.data.fdcertValidityFlag?'1':'0')){
            obj.checked = true;
          }else{
            obj.checked = false;
          }
        });
        that.setData({
          fdcertValidityItems : newItems
        });
        break;
      case 'sq':
        var newItems = that.data.sqcertValidityItems;
        this.setData({
          sqcertValidityFlag : value == '9999-12-31' ? false: true
        });
        newItems.forEach((obj)=>{
          if(obj.value == (this.data.sqcertValidityFlag?'1':'0')){
            obj.checked = true;
          }else{
            obj.checked = false;
          }
        });
        that.setData({
          sqcertValidityItems : newItems
        });
        break;
      case 'cw':
        var newItems = that.data.cwcertValidityItems;
        this.setData({
          cwcertValidityFlag : value == '9999-12-31' ? false: true
        });
        newItems.forEach((obj)=>{
          if(obj.value == (this.data.cwcertValidityFlag?'1':'0')){
            obj.checked = true;
          }else{
            obj.checked = false;
          }
        });
        that.setData({
          cwcertValidityItems : newItems
        });
        break;
      case 'lxr':
      var newItems = that.data.lxrcertValidityItems;
      this.setData({
        lxrcertValidityFlag : value == '9999-12-31' ? false: true
      });
      newItems.forEach((obj)=>{
        if(obj.value == (this.data.lxrcertValidityFlag?'1':'0')){
          obj.checked = true;
        }else{
          obj.checked = false;
        }
      });
      that.setData({
        lxrcertValidityItems : newItems
      });
      break;
      case 'dae1':
        var newItems = that.data.de1certValidityItems;
        this.setData({
          de1certValidityFlag : value == '9999-12-31' ? false: true
        });
        newItems.forEach((obj)=>{
          if(obj.value == (this.data.de1certValidityFlag ? '1' : '0')){
            obj.checked = true;
          }else{
            obj.checked = false;
          }
        });
        that.setData({
          de1certValidityItems : newItems
        });
        break;
      case 'dae2':
        var newItems = that.data.de2certValidityItems;
        this.setData({
          de2certValidityFlag : value == '9999-12-31' ? false: true
        });
        newItems.forEach((obj)=>{
          if(obj.value == (this.data.de2certValidityFlag?'1':'0')){
            obj.checked = true;
          }else{
            obj.checked = false;
          }
        });
        that.setData({
          de2certValidityItems : newItems
        });
        break;
    }
  },
  authorizationSelectChange: function(e){
    this.setData({
      legalIssq:  e.detail.value == '0'
    });
  },
  //同上选项
  syncInfoChange: function(e){
    var that = this;
    var type = e.currentTarget.dataset.id;
    var index = e.detail.value[0];
    var activeNames = that.data.activeNames;
    var items = [];
    //识别不同类型获取数组
    switch(type){
      case 'cw':
        items = that.data.cwsyncInfoItems;
        break;
      case 'lxr':
        items = that.data.lxrsyncInfoItems;
        break;
      case 'dae1':
      case 'dae2':
        items = that.data.daesyncInfoItems;
        break;
    };
    var value = items[0][index].value;
    var name = items[0][index].name;
    //法定代表人姓名信息是否完善
    if(that.data.legalName === '' || that.data.legalCardType === '' || that.data.legalCardNo === '' || (that.data.legalCardValidDate === '' && that.data.fdcertValidityFlag == true) || that.data.legalPhone === ''){
      Toast("请先补充法定代表人信息");
      return;
    }
    //判断是否开启授权人授权以及完善
    if (value == '2'){
      if(that.data.legalIssq == false){
        Toast("未开启授权开户代理人授权，请先开启");
        return;
      }else {
        if(that.data.sqOpenAccountName === '' || that.data.sqOpenAccountCardType === '' || that.data.sqOpenAccountCardNo === '' || (that.data.sqOpenAccountCardValidDate === '' && that.data.sqcertValidityFlag == true) || that.data.sqOpenAccountPhone === ''){
          Toast("请先补充授权开户代理人信息");
          return;
        }
      }
    }
    switch(type){
      case 'cw':
        that.setData({
          cwfzrSyncInfoIndex:index,
          cwfzrSyncSelectName:name, //财务负责人名称
        });
        if(value !="0"){
          if(activeNames.indexOf('cwfzr')>1){
            activeNames.splice(activeNames.indexOf('cwfzr'),1);
            that.setData({ 
              activeNames : activeNames,
              activeCWDialog : true,//禁用
            });
          }else{
            that.setData({
              activeCWDialog : true,//禁用
            });
          }
        }else{
          activeNames.push('cwfzr');
          that.setData({
            activeNames : activeNames,
            activeCWDialog : false,//禁用
          });
        }
        break;
      case 'lxr':
        if(value == '3' && (that.data.financialName==='' || that.data.financialCardType=='' || that.data.financialCardNo=='' || (that.data.financialValidDate == '' && that.data.cwcertValidityFlag ==true)) && that.data.cwfzrSyncSelectName == '其他'){
          Toast("请先补充财务负责人信息");
          return;
        }
        that.setData({
          lxsSyncInfoIndex:index,
          lxsSyncSelectName:name,
        });
        if(value != "0"){
          if(activeNames.indexOf('lxr')>1){
            activeNames.splice(activeNames.indexOf('lxr'),1);
            that.setData({ 
              activeNames : activeNames,
              activeLXRDialg : true,//禁用
            });
          }else{
            that.setData({
              activeLXRDialg : true,//禁用
            });
          }
        }else{
          activeNames.push('lxr');
          that.setData({
            activeNames : activeNames,
            activeLXRDialg : false,//禁用
          });
        }
        break;
      case 'dae1':
        if(value == '3' && (that.data.financialName==='' || that.data.financialCardType=='' || that.data.financialCardNo=='' || that.data.financialPhone=='' || (that.data.contactValidDate == ''&& that.data.cwcertValidityFlag == true)) && that.data.cwfzrSyncSelectName == '其他'){
          Toast("请先补财务负责人信息");
          return;
        }
        if(value == '4' && (that.data.contactName===''|| that.data.contactCardType===''||that.data.contactCardNo===''||(that.data.contactValidDate == '' && that.data.lxrcertValidityFlag == true)||that.data.contactPhone==='') && that.data.lxsSyncSelectName == '其他'){
          Toast("请先补联系人信息");
          return;
        }
        if(value !="0"){
          if(activeNames.indexOf('dae1')>1){
            activeNames.splice(activeNames.indexOf('dae1'),1);
            that.setData({ 
              activeNames : activeNames,
              activeDE1Dialg : true,//禁用
            });
          }else{
            that.setData({
              activeDE1Dialg : true,//禁用
            });
          }
        }else{
          activeNames.push('dae1');
          that.setData({
            activeNames : activeNames,
            activeDE1Dialg : false,//禁用
          });
        }
        that.setData({
          dae1SyncInfoIndex:index,
          dae1SyncSelectName:name,
        });
        break;
      case 'dae2':
        if(value == '3' && (that.data.financialName==='' || that.data.contactCardType=='' || that.data.contactCardNo=='' || that.data.contactPhone=='') && that.data.cwfzrSyncSelectName == '其他'){
          Toast("请先补财务负责人信息");
          return;
        }
        if(value == '4' && (that.data.contactName===''|| that.data.contactCardType===''||that.data.contactCardNo===''||(that.data.convertCertValidity == '' && that.data.lxrcertValidityFlag == true)||that.data.contactPhone==='') && that.data.lxsSyncSelectName == '其他'){
          Toast("请先补联系人信息");
          return;
        }
        if(value !="0"){
          if(activeNames.indexOf('dae2')>1){
            activeNames.splice(activeNames.indexOf('dae2'),1);
            that.setData({ 
              activeNames : activeNames,
              activeDE2Dialg : true,//禁用
            });
          }else{
            that.setData({
              activeDE2Dialg : true,//禁用
            });
          }
        }else{
          activeNames.push('dae2');
          that.setData({
            activeNames : activeNames,
            activeDE2Dialg : false,//禁用
          });
        }
        that.setData({
          dae2SyncInfoIndex:index,
          dae2SyncSelectName:name,
        });
        break;
      }
  },
  //证件种类
  zjlxChange: function(e){
    var that = this;
    var type =e.currentTarget.dataset.id;
    var value = that.data.zjlxItems[0][e.detail.value[0]].name;
    var key = that.data.zjlxItems[0][e.detail.value[0]].value;
    switch(type){
      case 'fd':
        this.setData({
          fdzjlx: value,
          legalCardType:key,
        });
        break;
      case 'sq':
        this.setData({
          sqzjlx: value,
          sqOpenAccountCardType:key,
        });
        break;
      case 'cw':
        this.setData({
          cwzjlx: value,
          financialCardType:key,
        });
        break;
      case 'lx':
        this.setData({
          lxzjlx: value,
          contactCardType:key,
        });
        break;
      case 'de1':
        this.setData({
          de1zjlx: value,
          deczcontactCardType1:key
        });
        break;
      case 'de2':
        this.setData({
          de2zjlx: value,
          deczcontactCardType2:key
        });
        break;

    }
  },
  convertzjlx(type,value){
    var obj = this.data.zjlxItems[0].find(function(x) {
      return x.value == value;
    });
    switch(type){
      case 'fd':
        this.setData({
          fdzjlx : obj.name
        });
        break
      case 'sq':
        this.setData({
          sqzjlx : obj.name,
        });
        break;
      case 'cw':
        this.setData({
          cwzjlx : obj.name
        });
        break;
      case 'lx':
        this.setData({
          lxzjlx : obj.name
        });
        break;
      case 'de1':
        this.setData({
          de1zjlx : obj.name
        });
        break;
      case 'de2':
        this.setData({
          de2zjlx : obj.name
        });
        break;
    }
  },
  //大额查证查看提示信息
  showdeczlxrMessage: function(e){
    this.setData({
      showTip:true
    });
  },
  //OCR识别
  checkFddbrOCR: function(e){
    if(this.data.formDisabeld == true){
      return;
    }
    var type = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: './ocr?type='+type,
    })
  },
  initValidate: function(){
    var that = this;
    let rules = {
      legalName: {required:true}, //法定代表人姓名
      fdzjlx: {required:true}, //法定代表人证件类型
      legalCardNo: {required:true}, //法定代表人证件号码
      legalCardValidDate: {required:that.data.fdcertValidityFlag,maxlength:10}, //法定代表人证件有效期
      legalPhone: {required:true}, //法定代表人手机号

      sqOpenAccountName: {required: that.data.legalIssq}, //授权开户代理人姓名
      sqzjlx: {required:that.data.legalIssq}, //授权开户代理人证件类型
      sqOpenAccountCardNo: {required:that.data.legalIssq}, //授权开户代理人证件号码
      sqOpenAccountCardValidDate: {required:that.data.legalIssq && that.data.sqcertValidityFlag,maxlength:10}, //授权开证件有效期
      sqOpenAccountPhone: {required:that.data.legalIssq}, //授权开户代理人手机号码

      //判断是否同步
      financialName: {required:that.data.cwfzrSyncInfoIndex == '2'},//财务姓名
      cwzjlx: {required:that.data.cwfzrSyncInfoIndex == '2'}, //财务证件种类
      financialCardNo: {required:that.data.cwfzrSyncInfoIndex == '2'}, //财务证件号码
      financialValidDate:{required:that.data.cwfzrSyncInfoIndex == '2' && (that.data.cwcertValidityFlag) , maxlength:10}, //财务证件有效期
      financialPhone: {required:that.data.cwfzrSyncInfoIndex == '2'},//财务电话
   
      contactName:{required:that.data.lxsSyncInfoIndex == '3'}, //联系人姓名
      lxzjlx: {required:that.data.lxsSyncInfoIndex == '3'}, //联系人证件种类
      contactCardNo: {required:that.data.lxsSyncInfoIndex == '3'}, //联系人证件号码
      contactValidDate:{required:that.data.lxsSyncInfoIndex == '3' && (that.data.lxrcertValidityFlag), maxlength:10}, //财务证件有效期
      contactPhone: {required:that.data.lxsSyncInfoIndex == '3'},//联系人电话
   
      // deczcontactName1: {required:that.data.dae1SyncInfoIndex[0] == '0'}, //大额查证联系人姓名1
      // de1zjlx:{required:that.data.dae1SyncInfoIndex[0] == '0'}, //大额查证证件种类1
      // deczcontactCardNo1: {required:that.data.dae1SyncInfoIndex[0] == '0'}, //大额查证联系人证件号码1
      // deczcontactPhone1: {required:that.data.dae1SyncInfoIndex[0] == '0'}, //大额查证联系人电话1
      // deczcontactCardValidDate1: {required:that.data.dae1SyncInfoIndex[0] == '0'? that.data.de1certValidityFlag : false}, //大额查证联系人证件有效期1
      deczcontactName1: {required:true}, //大额查证联系人姓名1
      de1zjlx:{required:true}, //大额查证证件种类1
      deczcontactCardNo1: {required:true}, //大额查证联系人证件号码1
      deczcontactPhone1: {required:true}, //大额查证联系人电话1
      deczcontactCardValidDate1: {required:that.data.de1certValidityFlag,maxlength:10}, //大额查证联系人证件有效期1
   
      // deczcontactName2: {required:that.data.dae2SncInfoIndex[0] == '0'}, //大额查证联系人姓名2
      // de2zjlx:{required:that.data.dae2SncInfoIndex[0] == '0'}, //大额查证证件种类2
      // deczcontactCardNo2: {required:that.data.dae2SncInfoIndex[0] == '0'}, //大额查证联系人证件号码2
      // deczcontactPhone2: {required:that.data.dae2SncInfoIndex[0] == '0'}, //大额查证联系人电话2
      // deczcontactCardValidDate2: {required:that.data.dae2SyncInfoIndex[0] == '0'? that.data.de2certValidityFlag : false}, //大额查证联系人证件有效期2
      deczcontactName2: {required:true}, //大额查证联系人姓名2
      de2zjlx:{required:true}, //大额查证证件种类2
      deczcontactCardNo2: {required:true}, //大额查证联系人证件号码2
      deczcontactPhone2: {required:true,}, //大额查证联系人电话2
      deczcontactCardValidDate2: {required: that.data.de2certValidityFlag ,maxlength:10}, //大额查证联系人证件有效期2
    };
    let messages = {
      legalName: {required:"请输入法定代表人姓名"}, //法定代表人姓名
      fdzjlx: {required:"请选择法定代表人证件类型"}, //法定代表人证件类型
      legalCardNo: {required:"请输入法定代表人证件号码"}, //法定代表人证件号码
      legalCardValidDate: {required:"请输入法定代表人证件有效期",maxlength:'法人证件有效期,请按格式正确填写'}, //法定代表人证件有效期
      legalPhone: {required:"请输入法定代表人手机号"}, //法定代表人手机号

      sqOpenAccountName: {required: "请输入授权开户代理人姓名"}, //授权开户代理人姓名
      sqzjlx: {required: "请选择授权开户代理人证件类型"}, //授权开户代理人证件类型
      sqOpenAccountCardNo: {required:"请输入授权开户代理人证件号码"}, //授权开户代理人证件号码
      sqOpenAccountCardValidDate:{required:"请输入授权开户代理人证件证件有效期"}, //授权开户代理人证件号码
      sqOpenAccountPhone: {required:"请输入授权开户代理人手机号码"}, //授权开户代理人手机号码

      //判断是否同步
      financialName: {required:"请输入财务姓名"},//财务姓名
      cwzjlx: {required:"请选择财务证件种类"}, //财务证件种类
      financialCardNo: {required:"请输入财务证件号码"}, //财务证件号码
      financialValidDate: {required:"请输入财务负责人证件有效期",maxlength:'财务负责人证件有效期,请按格式正确填写'}, //财务证件有效期
      financialPhone: {required:"请输入财务电话"},//财务电话
   
      contactName:{required:"请输入联系人姓名"}, //联系人姓名
      lxzjlx: {required:"请选择联系人证件种类"}, //联系人证件种类
      contactCardNo: {required:"请输入联系人证件号码"}, //联系人证件号码
      contactValidDate: {required:"请输入联系人证件有效期",maxlength:'联系人证件有效期,请按格式正确填写'}, //联系人证件有效期
      contactPhone: {required:"请输入联系人电话"},//联系人电话
   
      deczcontactName1: {required:"请输入大额查证联系人姓名1"}, //大额查证联系人姓名1
      de1zjlx:{required:"请选择大额查证证件种类1"}, //大额查证证件种类1
      deczcontactCardNo1: {required:"请输入大额查证联系人证件号码1"}, //大额查证联系人证件号码1
      deczcontactPhone1: {required:"请输入大额查证联系人电话1"}, //大额查证联系人电话1
      deczcontactCardValidDate1: {required:"请输入大额查证联系人证件有效期1",maxlength:'大额查证联系人1有效期,请按格式正确填写'}, //大额查证联系人证件有效期1
   
      deczcontactName2: {required:"请输入大额查证联系人姓名2"}, //大额查证联系人姓名2
      de2zjlx:{required:"请选择大额查证证件种类2"}, //大额查证证件种类2
      deczcontactCardNo2: {required:"请输入大额查证联系人证件号码2"}, //大额查证联系人证件号码2
      deczcontactPhone2: {required:"请输入大额查证联系人电话2"}, //大额查证联系人电话2
      deczcontactCardValidDate2: {required:"请输入大额查证联系人证件有效期2",maxlength:'大额查证联系人2有效期,请按格式正确填写'}, //大额查证联系人证件有效期2
    };
    that.WxValidate = new WxValidate(rules, messages);
  },
  //提交表单
  submitForm: function(e){
    var that =this;
    let params = e.detail.value;
    this.initValidate(); 
    // 数据组装
    if (!that.WxValidate.checkForm(params)) {
      wx.hideLoading();
      Toast(that.WxValidate.errorList[0].msg.replace('。', ''));
    }else{
      wx.showLoading({
        title: '请稍后...',
        mask: true
      })
      if(that.data.isCreate == '2'){
        wx.hideLoading();
        wx.navigateTo({
          url: "/sub3/pages/ftAccountOpen/apply/reservationOutletsPage?uniqId="+that.data.uniqId+"&isCreate="+that.data.isCreate+"&accountType="+that.data.accountType,
        })
      }else{
        if(that.data.legalIssq){
          if(that.data.legalCardNo == that.data.sqOpenAccountCardNo){
            wx.hideLoading();
            Toast("法定代表人不可与授权人代理人为同一人");
            return ;
          }
        }
        if(that.data.deczcontactCardNo1 == that.data.deczcontactCardNo2){
          Toast("大额查证联系人1不可与大额查证联系人1为同一人");
          wx.hideLoading();
          return ;
        }
        if(this.data.legalCardType != '021' && this.data.legalIssq == false){
          wx.hideLoading();
          Toast("法人证件类别如为非二代身份证，授权代理人为必输项");
          return ;
        }
        let data = {
          openId: wx.getStorageSync('openid'), //微信id
          uniqId: that.data.uniqId  != ''? that.data.uniqId : '', //数据唯一标识,区别新增/修改
          natureId: that.data.natureId != '' ? that.data.natureId : '', //自然人数据唯一标示，区别新增或者修改
          //法人
          legalName: that.data.legalName, //法定代表人姓名
          legalCardType: that.data.legalCardType, //法定代表人证件类型
          legalCardNo: that.data.legalCardNo, //法定代表人证件号码
          legalCardValidDate: that.data.fdcertValidityFlag ?that.data.legalCardValidDate : '9999-12-31', //法定代表人证件有效期
          legalPhone: that.data.legalPhone, //法定代表人手机号
          legalIssq: that.data.legalIssq ? '0' : '1', //法定代表人是否授权他人办理开户
          //授权开户代理人
          sqOpenAccountName: that.data.legalIssq == false? '': that.data.sqOpenAccountName, //授权开户代理人姓名
          sqOpenAccountCardType: that.data.legalIssq == false? '': that.data.sqOpenAccountCardType, //授权开户代理人证件类型
          sqOpenAccountCardNo: that.data.legalIssq == false? '': that.data.sqOpenAccountCardNo, //授权开户代理人证件号码
          remark3: that.data.legalIssq == false? '': that.data.sqcertValidityFlag?that.data.sqOpenAccountCardValidDate:'9999-12-31', //授权开户代理人证件有效期
          sqOpenAccountPhone: that.data.legalIssq == false? '': that.data.sqOpenAccountPhone, //授权开户代理人手机号码
    
          //大额1
          deczcontactName1: that.data.deczcontactName1, //大额查证联系人姓名1
          deczcontactCardType1:that.data.deczcontactCardType1, //大额查证证件种类1
          deczcontactCardNo1: that.data.deczcontactCardNo1, //大额查证联系人证件号码1
          deczcontactPhone1: that.data.deczcontactPhone1, //大额查证联系人电话1
          deczcontactCardValidDate1: that.data.de1certValidityFlag ? that.data.deczcontactCardValidDate1 : '9999-12-31', //大额查证联系人证件有效期1
          //大额2
          deczcontactName2: that.data.deczcontactName2, //大额查证联系人姓名2
          deczcontactCardType2:that.data.deczcontactCardType2, //大额查证证件种类2
          deczcontactCardNo2: that.data.deczcontactCardNo2, //大额查证联系人证件号码2
          deczcontactPhone2: that.data.deczcontactPhone2, //大额查证联系人电话2
          deczcontactCardValidDate2: that.data.de2certValidityFlag ? that.data.deczcontactCardValidDate2 : '9999-12-31', //大额查证联系人证件有效期2
        }
        //财务负责人
        data.financialName = that.data.cwfzrSyncInfoIndex == '2' ? that.data.financialName : that.data.cwfzrSyncInfoIndex == '0' ? that.data.legalName : that.data.sqOpenAccountName, //财务姓名
        data.financialCardType = that.data.cwfzrSyncInfoIndex == '2' ? that.data.financialCardType : that.data.cwfzrSyncInfoIndex == '0' ? that.data.legalCardType : that.data.sqOpenAccountCardType, //财务证件种类
        data.financialCardNo = that.data.cwfzrSyncInfoIndex == '2' ? that.data.financialCardNo : that.data.cwfzrSyncInfoIndex == '0' ? that.data.legalCardNo : that.data.sqOpenAccountCardNo, //财务证件号码
        data.remark1 = that.data.cwfzrSyncInfoIndex == '2' ? (that.data.cwcertValidityFlag ?that.data.financialValidDate : '9999-12-31') : that.data.cwfzrSyncInfoIndex == '0' ? data.legalCardValidDate : data.remark3, //财务证件有效期
        data.financialPhone = that.data.cwfzrSyncInfoIndex == '2' ? that.data.financialPhone : that.data.cwfzrSyncInfoIndex == '0' ? that.data.legalPhone : that.data.sqOpenAccountPhone,//财务电话
        //联系人
        data.contactName =that.data.lxsSyncInfoIndex == '3' ? that.data.contactName : that.data.lxsSyncInfoIndex == '0' ? that.data.legalName : that.data.lxsSyncInfoIndex == '1' ? that.data.sqOpenAccountName : data.financialName, //联系人姓名
        data.contactCardType = that.data.lxsSyncInfoIndex == '3' ? that.data.contactCardType : that.data.lxsSyncInfoIndex == '0' ? that.data.legalCardType : that.data.lxsSyncInfoIndex == '1' ? that.data.sqOpenAccountCardType : data.financialCardType; //联系人证件种类
        data.contactCardNo = that.data.lxsSyncInfoIndex == '3' ? that.data.contactCardNo : that.data.lxsSyncInfoIndex == '0' ? that.data.legalCardNo : that.data.lxsSyncInfoIndex == '1' ? that.data.sqOpenAccountCardNo : data.financialCardNo; //联系人证件号码
        data.remark2 = that.data.lxsSyncInfoIndex == '3' ? (that.data.lxrcertValidityFlag!='' ?that.data.contactValidDate : '9999-12-31') : that.data.lxsSyncInfoIndex == '0' ? data.legalCardValidDate : that.data.lxsSyncInfoIndex == '1' ? data.remark3 : data.remark1; //联系人证件有效期
        data.contactPhone = that.data.lxsSyncInfoIndex == '3' ? that.data.contactPhone : that.data.lxsSyncInfoIndex == '0' ? that.data.legalPhone : that.data.lxsSyncInfoIndex == '1' ? that.data.sqOpenAccountPhone : data.financialPhone;//联系人电话
        let options = {
          url: '/ft/recordNatureInfo.do',
          data: data
        };
        requestYT(options).then((res) => {
          if(res.msgCode =='0000'){
            wx.hideLoading();
            wx.navigateTo({
                    url: "/sub3/pages/ftAccountOpen/apply/reservationOutletsPage?uniqId="+that.data.uniqId+"&isCreate="+that.data.isCreate+"&accountType="+that.data.accountType,
            })
          }else{
            wx.hideLoading();
            wx.showToast({
              title: '提交失败',
              image: res.msg,
              icon: 'none',
            });
          }
        },
        (fail)=>{
          wx.hideLoading();
          wx.showToast({
            title: '提交失败',
            icon: 'none',
          });
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