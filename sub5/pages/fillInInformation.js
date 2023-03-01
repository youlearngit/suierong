// sub4/pages/fillInInformation.js
const App = getApp();
var date = new Date();
var encr = require('../../utils/encrypt/encrypt.js'); //国密3段式加密
import tool from "../../utils/tool";
var aeskey = encr.key
import {
    maoeronSubmit,
    getQyName,
    getGsxx,
    selectMyrInfo,
    myrSign,
    submitTowd,
    qzzx,
    getOaInfo,
    getContactInfo,
    getLocationById,
  queryOnlineLoan,
  checkAuthorizationCode,
  ocrBusinessLicense,
  recordStep

} from '../../api/mer'
import requestYT from '../../api/requestYT';
Page({

    /**
     * 页面的初始数据
     */
    data: {
    typeSH:true,
    TimeID: -1,
    procedure: 1,
    username: '',
    phone: '',
    taxShow: false,
    show: false,
    landline: '',
    code:'',
        agreementShow: false,
        agreementList: [{
                name: '《授权书》',
                type:1
            },
            {
                name: '《江苏银行综合信息查询使用授权书》',
                type:2
            },
            // {
            //     name: '《授权书（适用于个人经营贷及对公授信业务相关自然人）》',
            //     type:3
            // },
            // {
            //     name: '《江苏银行综合信息查询授权委托书（适用于法人及其他经济组织）》',
            //     type:4
            // },
        ],
        preffixUrl: '',
        faName: '', // 法人姓名
        faPhone: '', // 法人手机号
        openId: '', // 每一个用户的独有id
        imageId: '', // 影像的唯一标识
        protocolAddress: '', // 协议地址
        faCard: '', // 法人身份证
        agreementTypeOne:false,
        agreementTypeTwe:false,
        readonly:false,
        submitCard:true,
        submitCredit:true,
        duties: '法定代表人', // 公司职务
        enterpriseName: '', // 企业名称
        creditCode: '', // 统一信用代码
        enterpriseDate: '', // 企业成立日期
        businessAddress: '', // 经营地址
        authorizationCode: '', // 平台授权码
        authorizationStatus: '', // 税务授权状态  
        RE_MANAGEMENT_SCOPE:'', //公司类型
        Eid: '',
        year:'',
        month:'',
        day:'',
        cityCode:'',
        re_valid_date:'',
        verifyResult:'',
        entNamesList:[],
        entNameShow:false,
        customItem: '',
        region: [],
        checked: false, // 
        province:'',
        idCardBatch_id:'',
        creditCodeName:'',
        agreementTypeThree: false,
        agreementTypeFour: false,
        verifyResult:'',
        steps: [{
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
        currentDate: new Date().getTime(),
        minDate: new Date(1990.01).getTime(),
        formatter(type, value) {
            if (type === 'year') {
                return `${value}年`;
            } else if (type === 'month') {
                return `${value}月`;
            }
            return value;
        },
        timeShow: false,
        day_time2: date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate(),
        selectOpen:["否","是"],
        _num:'0',  //是1否0
        bhList:[
          {
            bhValue:''
          }
        ],
        pdfbatchid:[], //pdf batchid
        selectOpen1:["线上授权","官网授权"],
        sqnum:'0',  //0手机授权  1电脑授权
	unDisabled:false
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    console.log('获取e',e);
    if(e.step){
      if(e.step=='0'||e.step=='1'||e.step=='2'){
        this.setData({
          procedure:parseInt(e.step)+1
        })
      }
    }
    if ( e && e.yesOrNo == 'true') {
      wx.showModal({
        title: "提示",
        content: "请查询企业名称",
        showCancel: false,
        success: function (res) {





        },
      })
    }
    this.setData({
      preffixUrl: App.globalData.CDNURL,
      openId: wx.getStorageSync('openid'),
    })
    if (e.procedure == 2) {
      console.log('that.data.Eid', e.Eid);
      console.log(e.enterpriseName);
      this.setData({
        orgCode:e.orgCode,
                procedure:2,
                RE_MANAGEMENT_SCOPE:e.RE_MANAGEMENT_SCOPE,
                creditCode:e.creditCode,
                enterpriseName:e.enterpriseName,
                imageId:e.batchID,
                businessAddress:e.businessAddress,
                enterpriseDate:e.enterpriseDate,
                Eid:e.Eid,
                faName:e.faName,
                re_valid_date:this.getCaption(e.re_valid_date),
                faPhone:e.faPhone != 'undefined' ? e.faPhone : '',
                faCard: e.faCard ? e.faCard : '',
                verifyResult:e.verifyResult,
                idCardBatch_id:e.idCardBatch_id,
                currentDate:new Date(e.enterpriseDate.replace('年','-').replace('月','-').replace('日','')).getTime()
            })
      this.getSelectMyrInfo()
      // this.selectEntName()
    }
    if (e.submitCredit) {
      this.setData({
        submitCredit: e.submitCredit
      })
    }
    // if (!this.data.Eid) {
    //   this.getSelectMyrInfo()
    // }
        if (e.faName) {
            this.setData({
                faName: e.faName,
                faCard: e.faCard ? e.faCard : '',
                re_valid_date:this.getCaption(e.re_valid_date),
                verifyResult:e.verifyResult,
                submitCard:e.submitCard,
                Eid:e.Eid != 'undefined' ? e.Eid : '',
                faPhone:e.faPhone != 'undefined' ? e.faPhone : '',
                idCardBatch_id:e.batch_id,
                verifyResult:e.verifyResult,
                procedure:e.procedure
            })
        }
        if (!e.faName) {
            this.getSelectMyrInfo()
        }
    },
  // switch开关切换值
  switchChange(_ref) {
    var currentTarget = _ref.currentTarget;
    var tab = currentTarget.dataset.index;
    if (tab == "0") {
        this.setData({
            _num:0,
        })  
    } else {
        this.setData({
            _num:1,
        })
        }
    },
    switchChange1(_ref) {
      var currentTarget = _ref.currentTarget;
      var tab = currentTarget.dataset.index;
      if (tab == "0") {
          this.setData({
            sqnum:0,
          })  
      } else {
          this.setData({
            sqnum:1,
          })
          }
      },
  // 动态赋值
  addValue(e){
    let index = e.target.dataset.id;
    let bhList = this.data.bhList;
    bhList[index].bhValue = e.detail.value.trim().replace(/[^\w\/]/ig,'');
    this.setData({
      bhList
    })
  },
  // 新增保单
  addBH() {
    let bhList = this.data.bhList;
    if(bhList.length<=4){
    if (bhList[bhList.length - 1].bhValue.trim() !== '') {
      setTimeout(() => {
        let bhList = this.data.bhList;
        bhList.push({
          bhValue: ""
        })
        this.setData({
          bhList
        }, 300)
      })
    } else {
      wx.showToast({
        title: '请填写完整再追加',
        icon: 'none',
        duration: 2000
      })
      return;
    }
  }else{
    wx.showToast({
      title: '最多只能新增5条',
      icon: 'none',
      duration: 2000
    })
    return;
  }
  },
  //删除保单编号
  delBH(e){
    console.log(this.data.bhList.length)
    if(this.data.bhList.length>1){
    var id=e.currentTarget.dataset.id;
    this.data.bhList.splice(id,1);
    this.setData({
      bhList:this.data.bhList
    })
  }else{
    wx.showToast({
      title: '至少保留一条数据',
      icon: 'none',
      duration: 2000
    })
    return;
    }
  },
  // 监听企业名称，失焦事件
  getEnterpriseName() {
    this.setData({
      entNameShow:false
    })
    // this.selectEntName(this.data.enterpriseName)
  },
  getCaption(obj) {

        var index=obj.lastIndexOf("\-");
        obj=obj.substring(index+1,obj.length);
        obj = obj.replace(/\./g,'')
    //  console.log(obj);
        if (obj == '长期') {
          obj = '99991231'
        }
        return obj;
    },
    bindRegionChange: function (e) {
        console.log('picker发送选择改变，携带值为', e)
        this.setData({
          region: e.detail.value,
          province:e.detail.code[1].substring(0,2),
          cityCode:e.detail.code[1],
          creditCodeName:e.detail.value[1].replace("市","")
        })
    // let dataJson = JSON.stringify({
    //   id: e.detail.code[1],
    // })
    // getLocationById(dataJson).then(add => {
    //   console.log('dataJson', add);
    //   add.name = add.name.replace("市", "")
    //   this.setData({
    //     creditCodeName: add.name,
    //   })
    // })
    this.getContact()
  },
  // 查看协议
  toAgreement(add) {
    let type = ''
    if (add == 1) {
      type = 1
    } else if (add == 2) {
      type = 2
    } else {
      type = add.currentTarget.dataset.type
    }
    let that = this
    var date = new Date();
    let month = date.getMonth()
    console.log('month', );
    let data = {
      qyName: this.data.enterpriseName, // 企业名称
      custName:this.data.faName, //客户名称
      idCard: this.data.faCard,
      sqrName: this.data.faName,
      year: JSON.stringify(date.getFullYear()),
      month: JSON.stringify(month + 1),
      day: JSON.stringify(date.getDate()),
      openId: this.data.openId,
      type: JSON.stringify(type),
      idCardType: '二代身份证',
      creditCode: this.data.creditCode,
      sqDw: this.data.enterpriseName
    }
    console.log('data', data);
    wx.showLoading({
      title: '加载中'
    })
    clearTimeout(that.TimeID);
    that.TimeID = setTimeout(() => {
      myrSign(JSON.stringify(data)).then(res => {
        wx.hideLoading();
        console.log(res)
        console.log('pdfbatchid:', res.BatchID);
        if (add == 1) {
          this.setData({
            agreementTypeOne: true
          })
        } else if (add == 2) {
          this.setData({
            agreementTypeTwe: true
          })
        } else {
          if (add.currentTarget.dataset.type == 1) {
            wx.navigateTo({
              url: './agreement?custName=' + that.data.enterpriseName + '&idCard=' + that.data.faCard + '&sqrName=' + that.data.faName + '&year=' + JSON.stringify(date.getFullYear()) + '&month=' + JSON.stringify(month + 1) + '&day=' + JSON.stringify(date.getDate()) + '&type=' + type + '&idCardType=' + that.data.enterpriseName + '&creditCode=' + that.data.creditCode,
            })
            this.setData({
              agreementTypeOne: true,
              [`pdfbatchid[0]`]:res.BatchID
            })
          } else if (add.currentTarget.dataset.type == 2) {
            wx.navigateTo({
              url: './agreement?custName=' + that.data.enterpriseName + '&idCard=' + that.data.faCard + '&sqrName=' + that.data.faName + '&year=' + JSON.stringify(date.getFullYear()) + '&month=' + JSON.stringify(month + 1) + '&day=' + JSON.stringify(date.getDate()) + '&type=' + type + '&idCardType=' + that.data.enterpriseName + '&creditCode=' + that.data.creditCode,
            })
            this.setData({
              agreementTypeTwe: true,
              [`pdfbatchid[1]`]:res.BatchID
            })
          }
        }
      })
    },1000)
  },

    // 查询反显
    getSelectMyrInfo() {
        let data = {
            openId:wx.getStorageSync('openid')
        }
        console.log(data);
        selectMyrInfo(data).then(res => {
      console.log(res);
            if (res.msgCode == '0000') {
              if(JSON.parse(res.myrInfo).STEP=='1'||JSON.parse(res.myrInfo).STEP=='02'){
                this.setData({
                    faName: JSON.parse(res.myrInfo).FA_NAME, // 法人姓名
                    faPhone:  JSON.parse(res.myrInfo).FA_PHONE, // 法人手机号
                    faCard:  JSON.parse(res.myrInfo).FA_CARD, // 法人身份证
                    Eid: JSON.parse(res.myrInfo).E_ID,
                    duties: JSON.parse(res.myrInfo).DUTIES, //法定代表人
                    idCardBatch_id: JSON.parse(res.myrInfo).IMAGE_A_BATCHID,
                    re_valid_date:JSON.parse(res.myrInfo).FA_CARD_DATE_END,
                    verifyResult: JSON.parse(res.myrInfo).IMAGE_FACE_BATCHID,
                })
              }
             
                // if (!this.data.submitCard && !this.data.submitCredit) {
                //     this.getIsCord()
                // }
                if(JSON.parse(res.myrInfo).STEP=='2'||JSON.parse(res.myrInfo).STEP=='03'){
                this.setData({
                  faName: JSON.parse(res.myrInfo).FA_NAME, // 法人姓名
                  faPhone:  JSON.parse(res.myrInfo).FA_PHONE, // 法人手机号
                  faCard:  JSON.parse(res.myrInfo).FA_CARD, // 法人身份证
                  Eid: JSON.parse(res.myrInfo).E_ID,
                  duties: JSON.parse(res.myrInfo).DUTIES, //法定代表人
                  idCardBatch_id: JSON.parse(res.myrInfo).IMAGE_A_BATCHID, //身份证id
                  verifyResult: JSON.parse(res.myrInfo).IMAGE_FACE_BATCHID, //人脸id

                  creditCode:JSON.parse(res.myrInfo).CREDIT_CODE, //统一社会信用代码
                  enterpriseDate:JSON.parse(res.myrInfo).ENTERPRISE_DATE, //成立时间
                  businessAddress:JSON.parse(res.myrInfo).BUSINESS_ADDRESS, //公司地址
                  enterpriseName:JSON.parse(res.myrInfo).ENTERPRISE_NAME, //企业名称
                  cityCode:JSON.parse(res.myrInfo).PROVINCE, //市的code
                  province:JSON.parse(res.myrInfo).PROVINCE.substring(0,2), //市的code
                  businessLicenceCode:JSON.parse(res.myrInfo).BUSINESS_LICENCE_CODE,  //统一社会信用代码
                  RE_MANAGEMENT_SCOPE:JSON.parse(res.myrInfo).BUSINESS_TYPE, //公司类型
                  creditCodeName:JSON.parse(res.myrInfo).CITY, //城市名
                  re_valid_date:JSON.parse(res.myrInfo).FA_CARD_DATE_END,//身份证到期时间
                  imageId:JSON.parse(res.myrInfo).IMAGE_ID //营业执照id
                })
                if(JSON.parse(res.myrInfo).AREA){
                  console.log(JSON.parse(res.myrInfo).AREA.split(','))
                  this.setData({
                      region:JSON.parse(res.myrInfo).AREA.split(',')
                  })
                }
              }
              console.log(this.data)
            }
            
        })
    },
    // 监听手机号
    watchPhone(add) {
        console.log(add);
        let re = /^1(3|4|5|6|7|8|9)\d{9}$/
        let str = add.detail.value;
    
      if (re.test(str)) {
        return
      } else {
          this.reminder('手机号输入有误')
        
      }
    },
    reminder(value) {
        wx.showToast({
            title: value,
            icon: 'none',
        });
    },
    // 监听企业名称
    watchEnterpriseName(value) {
        this.setData({
            entNamesList: [],
            enterpriseName:value.detail.trim(),
            creditCode: ''
        })
    console.log('this.data.enterpriseName',this.data.enterpriseName);
        if ( value.detail.trim() && value.detail.trim().length >= 4) {
            console.log(value.detail.length);
            let data = JSON.stringify({
                keyWord:value.detail.trim()
              })
            getQyName(data).then(res => {
                console.log(res);
        if(this.data.enterpriseName!==res.entNamesList.entNames){
          wx.showToast({
            title: '请检查企业名称是否正确',
            icon: 'none',
            duration: 3000
          })
        }
        if (!res.entNamesList) {
          this.setData({
            entNameShow: false
          })
        } else {
          this.setData({
            entNamesList: res.entNamesList,
            entNameShow: true
          })
        }
      })
    } else if (value.detail.trim().length == 0) {
      this.setData({
        entNamesList: [],
        entNameShow: false
      })
    } else {
      this.setData({
        entNamesList: [],
        entNameShow: false
      })
    }
    console.log('this.data.enterpriseName', this.data.enterpriseName);
   
  },
  selectEntName(add) {
    console.log(add);
    console.log('add.currentTarget.dataset',add.currentTarget.dataset);
      this.setData({
        entNameShow: false,
        enterpriseName: add.currentTarget.dataset.item
      })

    let data = {
      companyName: this.data.enterpriseName,
      type: '1',
    }
    console.log(data);
    // return;
    clearTimeout(this.TimeID);
    this.TimeID = setTimeout(() => {
      getGsxx(data).then(res => {
        console.log(res);
        console.log(JSON.parse(res.stringData))
        console.log(res.stringData)
        if (!JSON.parse(res.stringData)) {
          this.setData({
            creditCode: ''
          })
          wx.showToast({
            title: '暂未查询到该公司的统一社会信用代码',
            icon:'none',
            duration:2000
          })
        } else {
          this.setData({
            creditCode: JSON.parse(res.stringData).cREDITCODE,
            enterpriseDate: JSON.parse(res.stringData).eSDATE.replace('-', '年').replace('-', '月') + '日',
            businessAddress: JSON.parse(res.stringData).dOM
            // cityCode: JSON.parse(res.stringData).rEGORGCODE
          })
          let dataJson = JSON.stringify({
            id: JSON.parse(res.stringData).rEGORGCODE,
          })
          getLocationById(dataJson).then(add => {
            console.log(add);
            add.name = add.name.replace("市", "")
            this.setData({
              entNameShow: false,
              creditCodeName: add.name
            })
            // this.getContact()
          })
        }
      })
    },1000)
  },
  getContact() {
    let dataInfo = {
      branch: this.data.creditCodeName
    }
    getContactInfo(dataInfo).then(item => {
      this.setData({
        landline: item.landline
      })
      console.log('this.data.landline',this.data.landline);
    })
  },
  /**
   * 查询企业
   * @param {
   * 		openid
   * 		companyName
   * }
   * @return {
   * 		aBUITEM: 许可经营项目
   * 		aNCHEYEAR: 最后年检年度
   * 		cREDITCODE: 统一信用代码
   * 		dOM: 住址 eg."南京市雨花台区软件大道106号2幢1202-1室"
   * 		eNTNAME: 企业名称 eg."江苏谷科软件有限公司"
   * 		eNTSTATUS: 经营状态 eg."在营（开业）"
   * 		eNTTYPE: 企业类型 eg."有限责任公司(自然人投资或控股)"
   * 		eSDATE: 成立日期 eg."2011-09-07"
   * 		fRNAME: 法定代表人/负责人/执行事务合伙人 eg."罗剑宏"
   * 		iNDUSTRYCOCODE: 国民经济行业代码 eg."651"
   * 		mAINREGNO: 注册号（查询企业的） eg."320102000219043"
   * 		oPFROM: 经营期限自 eg."2011-09-07"
   * 		oPSCOPE: 经营（业务）范围
   * 		oPTO: 经营期限至 eg."长期"     
   * 		oRGCODES: 组织机构代码 eg."580471246"
   * 		rECCAP: 实收资本（万元） eg."1000.000000"
   * 		rEGCAP: 注册资本（万元） eg."1000.000000"
   * 		rEGCAPCUR: 注册资本币种 eg."人民币元"
   * 		rEGNO: 注册号 eg."320102000219043"
   * 		rEGORG: 登记机关 eg."南京市雨花台区市场监督管理局"
   * 		rEGORGCODE: 注册地址行政编号 eg."320114"
   * 		tEL: 联系人电话 eg."13655189394"
   * }
   */
  async getBusInfo(companyName) {
    // companyName = companyName.replace(/\(/g,"（");
    // companyName = companyName.replace(/\)/g,"）");

    let options = {
      url: "commInvest/select.do",
      data: {
        openid: wx.getStorageSync('openid'),
        type: '1',
        companyName: this.data.enterpriseName,
      },
    };
    let res = await requestYT(options);
    if (res.STATUS === '1' && res.stringData) {
      return JSON.parse(res.stringData);
    }

    return Promise.reject(new Error(res.result_msg));
  },
  async getShareHolderInfo(p) {
    let options = {
      url: 'commInvest/select.do',
      data: JSON.stringify(p),
    };
    const res = await requestYT(options);
    if (res.STATUS === '1') {
      return res;
    } else {
      return Promise.reject(res.msg);
    }
  },



  onInput(event) {
    this.setData({
      enterpriseDate: `${new Date(event.detail).getFullYear()}年${new Date(event.detail).getMonth() + 1}月${new Date(event.detail).getDate()}日`,
      year: new Date(event.detail).getFullYear(),
      month: new Date(event.detail).getMonth(),
      day: new Date(event.detail).getDate(),
      timeShow: false
    });
  },
  timePopup() {
    this.setData({
      timeShow: true
    })
  },
  /**
   * 步骤4 跳转授权页面税务授权
   * @param {*} e
   */
  AuthTax(e) {
    var that = this;
    // if (that.data.citysUncontainedInStep4) {
    //     if (that.data.enterpriseInfo.province === '11') {
    //         that.setData({
    //             showTaxImg: true,
    //         });
    //         // that.validateTax(e);
    //     } else {
    //         let nodeInfo = JSON.stringify({
    //             node4: {
    //                 day_time2: that.data.day_time2,
    //             },
    //         });
    //         that.updateNodeInfo('4', nodeInfo).then(() => {
    //             that.setData({
    //                 step: '4',
    //             });
    //             that.toStep('step' + that.data.step);
    //         });
    //     }
    // } else {
    let version = wx.getAccountInfoSync().miniProgram.envVersion;

        if (version === 'develop') {
            that.setData({
                step: '4',
            });
            that.toStep('step' + that.data.step);
            let nodeInfo = JSON.stringify({
                node4: {
                    day_time2: that.data.day_time2,
                },
            });
            console.log('nodeInfo', nodeInfo);
            that.updateNodeInfo('4', nodeInfo);
            return;
        }

    that.validateTax(e);
    // }
  },
  onCloseTax() {
    this.setData({
      taxShow: false
    });
  },
  //跳转税务
  validateTax: function (e) {
    var that = this;
    console.log(that.data.province);
    if (that.data.province == '11' || that.data.cityCode == '330100'||that.data.sqnum == '1') {
      let data = {
        TAX_NUM: that.data.creditCode,
        COMPANY_NAME: that.data.enterpriseName
      }
      queryOnlineLoan(data).then(res => {
        if (res.RESULT_CODE == '0000') {
          wx.showModal({
            title: '提示',
            content: '授权成功',
            showCancel: false,
          });
          that.setData({
            authorizationStatus: '已授权'
          })
        } else {
          if (that.data.province == '11') {
            wx.showModal({
              title: '提示',
              content: '未查询到有效的税务授权',
              confirmText:'查看详情',
              success(res) {
                if (res.confirm) {
                  that.setData({
                    taxShow: true
                  })
                } else if (res.cancel) {}
              }
            });
          } else {
            wx.showModal({
              title: '提示',
              content: '未查询到有效的税务授权',
              showCancel: false,
            });
          }
          
          
        }
      })
    } else {
     
      if (that.data.province != '32' && that.data.province != '31' && that.data.cityCode != '440300') {
        wx.showModal({
          title: '提示',
          content: '很抱歉，该区域暂不受理此业务。',
          showCancel: false,
        });
        return;
      }
      wx.navigateTo({
        url: './tax?proCode=' +
          // '31'+
          that.data.province +
          // '0000&cityCode=' + '320000' +
          '0000&cityCode=' + this.data.cityCode +
          '&is_redirect=Y' +
          '&reurl=' +
          './fillInInformation' +
          '&creditCode=' +
          that.data.creditCode + // 营业执照好吗
          '&phone=' +
          that.data.faPhone + // 电话
          '&orderNo=' +
          that.data.Eid, //订单号
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
  // 协议弹窗
  getAgreement() {
    var flag=false;  
    if(this.data._num==1){
      for(var item of this.data.bhList){
        if(item.bhValue != ''){
          flag = true;
        }else{
          flag = false;
          wx.showToast({
            title: '请填写完整保单编号',
            icon: 'none',
            duration: 2000
          });
          return;
        }
      }
    }else{
      flag = true;
    }
    console.log("flag:"+flag)
    if(flag==true){
      console.log(5555)
      this.func();
    }
  },
  func(){
    let datebou={
      queryCode:this.data.authorizationCode,//用户输入
      entCode:this.data.creditCode,//组织机构代码，是getbusinfo返回的orgcodes字段。加上用户输入的那个授权码，调张亮那边的接口校验
    }
    checkAuthorizationCode(datebou).then(item=>{
      if(item.code==0){
        wx.showToast({
          title: '提示：区块链暂时未查询到有效的授权！',
          icon: 'none',
          duration: 3000
        })
      }else if(item.code == 1){
         this.setData({
          agreementShow: true
        })
      }
    })
  },
  // 身份证识别跳转
  getIsCord() {

    wx.redirectTo({
      url: './identityCard?Eid=' + this.data.Eid + '&faPhone=' + this.data.faPhone,
    })
  },
  twegetIsCord() {
    let that = this
    wx.showModal({
      title: '提示',
      content: '确定重新上传图片吗？',
      success(res) {
        if (res.confirm) {
          that.getIsCord()
        } else if (res.cancel) {
          console.log('取消')
        }
      }
    });
  },
  // 第一步骤提交
  async getSubmit() {
    let re = /^1(3|4|5|6|7|8|9)\d{9}$/
    let rCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    let that = this
    if (!this.data.submitCard) {
      wx.showModal({
        title: '提示',
        content: '请上传身份证图片',
        success(res) {
          if (res.confirm) {
            that.getIsCord()
          } else if (res.cancel) {
            console.log('取消')
          }
        }
      });
    } else if (!that.data.faPhone || !that.data.faName || !that.data.faCard) {
      that.reminder('请完善法人信息填写')
      return
    } else if (!re.test(that.data.faPhone)) {
      that.reminder('手机号输入有误')
      return
    } else if (!rCard.test(that.data.faCard)) {
      that.reminder('身份证号有误')
      return
    } else {
      let data = {
        openId: that.data.openId,
        fName: that.data.faName, // 法人姓名
        fPhone: that.data.faPhone, // 法人手机号
        fCard: that.data.faCard, // 法人身份证
        duties: that.data.duties,
        imageABatchId: that.data.idCardBatch_id,
        imageBBatchId: that.data.idCardBatch_id,
        eId: that.data.Eid,
        imageFaceBatchId: that.data.verifyResult
      }
      console.log('用户信息', data);
      let params = {
        name: that.data.faName,
        idcard: that.data.faCard
      }
      console.log('身份信息:'+params)
      that.compareName(params).then(add => {
        console.log('add',add);
      maoeronSubmit(data).then(res => {
        if (res) {
          console.log(res);
          this.setData({
            // procedure: 2
            Eid: res.Eid ? res.Eid : this.data.Eid
          })
          console.log('that.data.Eid', that.data.Eid);
          var params={
            openId: that.data.openId,
            step:that.data.procedure.toString()
          }
          recordStep(params).then(res=>{
            console.log(res)
          })
          this.getRecognitionLicense();
        }
      })
      })
      .catch(err => {
          wx.showToast({
              title: '身份信息验证失败，请输入正确的身份信息',
              icon: 'none'
          })
      })


        }
    },
    compareName(params) {
        return new Promise((resolve, reject) => {
            var data1 = JSON.stringify({
                cust_name: params.name,
                cust_id: params.idcard,
                cust_addr: '1',
                cust_sex: '1',
                nation: '1',
                birthday: '00000000',
                is_agent: '0',
                busicode: '02'
            })
            var custnameTwos1 = encr.jiami(data1, aeskey)
            console.log(data1);
            wx.request({
                url: App.globalData.creditUrl + 'compareIdName.do',
                data: encr.gwRequest(custnameTwos1),
                method: 'POST',
                header: {
                    'content-type': 'application/json',
                },
                success(res) {
                    console.log(res);
                    if (res.data.head.H_STATUS === "1") {
                        var jsonData = encr.aesDecrypt(res.data.body, aeskey)
                        console.log(jsonData)
                        if (jsonData.chk_result == '00'|| jsonData.chk_result == '01') {
                            resolve();
                        } else {
                            reject();
                        }
                    } else {
                        reject();
                    }
                }
            })
        })
    },
    async getSubmittwe() {
        let that = this
    this.getContact()
        // if (!this.data.creditCode || !this.data.enterpriseDate || !this.data.businessAddress || !this.data.enterpriseName) {
            if (!that.data.submitCredit) {
                
            
            wx.showModal({
                title: '提示',
                content: '请上传营业执照图片',
                success (res) {
          console.log(res);
                    if (res.confirm) {
                        that.getRecognitionLicense()
                    } else if (res.cancel) {
                      console.log('取消')
                    }
                  }
            });
    } else if (!this.data.creditCode || !this.data.enterpriseDate || !this.data.businessAddress || !this.data.enterpriseName || this.data.region.length == 0) {
      that.reminder('请完善企业信息');
    }else if (this.data.creditCode.length!=18) {
      that.reminder('请检查统一社会信用代码为18位');
    }else if(this.data.businessAddress.length<=5){
      that.reminder('请填写完整的经营地址');
    }else {
      // this.setData({
      //   procedure: 3
      // })
      //第二次走提交
      var data={
          openId: that.data.openId,
          fName: that.data.faName, // 法人姓名
          fPhone: that.data.faPhone, // 法人手机号
          fCard: that.data.faCard, // 法人身份证
          duties: that.data.duties,
          creditCode: that.data.creditCode,
          enterpriseDate: that.data.enterpriseDate,
          businessAddress: that.data.businessAddress,
          enterpriseName: that.data.enterpriseName,
          eId: that.data.Eid,
          province: that.data.cityCode,
          businessLicenceCode: that.data.creditCode,
          businessType: that.data.RE_MANAGEMENT_SCOPE,
          city: that.data.creditCodeName,
          frCardEndDate: that.data.re_valid_date,
          imageId: that.data.imageId//营业执照batchID
      }
      console.log(this.data.procedure)
      console.log('maoeronSubmit',data);
        clearTimeout(that.TimeID);
        that.TimeID = setTimeout(() => {
          maoeronSubmit(data).then(res => {
            if (res) {
              if (res.msgCode == '0000') {
                var params={
                  openId: that.data.openId,
                  step:that.data.procedure.toString(), //缓存页面步骤
                  region:that.data.region.join()    //反显省市区
                }
                recordStep(params).then(res=>{
                  console.log(res)
                })
                this.setData({
                  procedure: 3
                })
                } else {
                  wx.showToast({
                    title: res.msg ? res.msg : '提交失败',
                    icon: "none",
                    mask: true,
                    duration: 2000,
                  });
                }
            }
          })
        }, 1000);
      
    }
  },
  // async getmaoeronSubmit(data) {
  //   console.log(data);
  //   let options = {
  //     url: 'myr/myrAddOrUpdate.do',
  //     data: data
  //   };
  //   const res = await requestYT(options);
  //   console.log(res);
  //   return res
  // },
  // 是否阅读并同意
  onChange(event) {
    this.setData({
      checked: event.detail,
    });
  },
  // 跳转识别营业执照
  getTweRecognition() {
    let that = this
    wx.showModal({
      title: '提示',
      content: '确定重新上传图片吗？',
      success(res) {
        if (res.confirm) {
          that.getRecognitionLicense()
        } else if (res.cancel) {
          console.log('取消')
        }
      }
    });
  },
  getRecognitionLicense() {
    console.log('this.data.Eid', this.data.Eid);
    wx.redirectTo({
      url: './recognitionLicense?faCard=' + this.data.faCard + '&Eid=' + this.data.Eid + '&re_valid_date=' + this.data.re_valid_date + '&faName=' + this.data.faName + '&faCard=' + this.data.faCard + '&faPhone=' + this.data.faPhone + '&verifyResult=' + this.data.verifyResult + '&idCardBatch_id=' + this.data.idCardBatch_id,
    })
  },
  // 跳转查看协议
  getSign() {
    this.goGetSign();
  },
  // 跳转查看协议
    goGetSign:  tool.throttle(function() {
    let that = this;
    wx.showLoading({
      title: '申请中....',
      mask: true
    })
    if (!this.data.checked) {
      wx.showToast({
        title: '请确认勾选同意相关协议',
        icon: 'none',
      });
    } else {
      if (!that.data.authorizationCode) {
          wx.showToast({
              title: "请填写外管区块链平台授权码",
              icon: "none",
              mask: true,
              duration: 2000,
          });
      } 
      if (!that.data.authorizationStatus) {
        wx.showToast({
          title: "税务未授权",
          icon: "none",
          mask: true,
          duration: 2000,
        });
      } 
      else {
        if (!that.data.agreementTypeOne || !that.data.agreementTypeTwe) {
          wx.showToast({
            title: "请阅读协议",
            icon: "none", 
            mask: true,
            duration: 2000,
          });
          return
        }
        console.log(that.data._num)
        console.log(that.data.bhList)
        var newarr=[];
        that.data.bhList.forEach(item=>{
          newarr.push(item.bhValue)
        })
        console.log('newarr',newarr)
        console.log(newarr.join())


        let data = {
          openId: that.data.openId,
          fName: that.data.faName, // 法人姓名
          fPhone: that.data.faPhone, // 法人手机号
          fCard: that.data.faCard, // 法人身份证
          duties: that.data.duties,
          creditCode: that.data.creditCode,
          enterpriseDate: that.data.enterpriseDate,
          businessAddress: that.data.businessAddress,
          enterpriseName: that.data.enterpriseName,
          eId: that.data.Eid,
          province: that.data.cityCode,
          authorizationCode: that.data.authorizationCode,
          businessLicenceCode: that.data.creditCode,
          businessType: that.data.RE_MANAGEMENT_SCOPE,
          city: that.data.creditCodeName,
          frCardEndDate: that.data.re_valid_date,
          imageId: that.data.imageId,  //营业执照batchID
          authorizationStatus: that.data.authorizationStatus,
          existZhPolicy:that.data._num.toString(), //是否存在保单 0不存在 1存在
          policyNo:that.data._num.toString()=='1'?newarr.join():'',
          imagePdfBatchId:that.data.pdfbatchid.join()
        }
        console.log('maoeronSubmit',data);
        var p1=new Promise((resolve,reject)=>{
          maoeronSubmit(data).then(res => {
            if (res) {
              if (res.msgCode == '0000') {
                //新增-------
                var params={
                  openId: that.data.openId,
                  step:that.data.procedure.toString()
                }
                recordStep(params).then(res=>{
                  wx.hideLoading();
                  console.log(res)
                })
                resolve();
                //------------
                } else {
                  wx.hideLoading();
                  wx.showToast({
                    title: res.msg ? res.msg : '提交失败',
                    icon: "none",
                    mask: true,
                    duration: 2000,
                  });
                }
            }
          }).catch(err=>{
            wx.showToast({
              title: err,
              duration: 1500,
              icon: 'none'
            });
            reject();
          })
        })
        Promise.all([p1]).then(()=>{
          that.getQzzx();
          that.getsubmitTowd();
        })
        // let options = {
        //     url: 'myr/myrAddOrUpdate.do',
        //     data: data
        // };
        // const res = await requestYT(options);

        // wx.navigateTo({
        //     url: './finish',
        // })

      }
    }
  }),
  // authorMainType授权主体类型?,lendCertType=10借款人证件类型，faceImgBatchNo人脸影响批次号，authorImgBatchNo授权书批次号，backidenImgBatchNoCode身份证反面影像批次号，idenImgBatchNoCode身份证反面影像批次号，authorDate日期，extends3公司名称，extends2空，extends1":"02",faceImgBatchNoType人脸影响批次号，lendCertNo身份证，authorCertType=10authorImgBatchNoCodeSYS043_BIZ01_101",lendCreditcode统一信用代码，backidenImgBatchNo身份证反面影像批次号，authorImgBatchNoType":"SYS043_BIZ01",authorCertNo法人身份证idenImgBatchNo身份证反面影像批次号，lendOrgcode统一信用代码（9-16）custManagerOrgId‘9910’mobilePhone手机号，lendName姓名authorName姓名
  getQzzx() {
    let data = {
      authorMainType: '03',
      lendCertType: '10',
      faceImgBatchNo: this.data.verifyResult,
      backidenImgBatchNoCode: this.data.idCardBatch_id,
      idenImgBatchNoCode: this.data.idCardBatch_id,
      authorDate: '',
      extends: this.data.enterpriseName,
      extends1: "02",
      faceImgBatchNoType: this.data.verifyResult,
      lendCertNo: this.data.faCard,
      authorCertType: 10,
      authorImgBatchNoCode: 'SYS043_BIZ01_101',
      lendCreditcode: this.data.creditCode,
      backidenImgBatchNo: this.data.idCardBatch_id,
      authorImgBatchNoType: 'SYS043_BIZ01',
      authorCertNo: this.data.idCardBatch_id,
      lendOrgcode: this.data.creditCode,
      custManagerOrgId: '9910',
      mobilePhone: this.data.faName,
      lendName: this.data.faName,
      authorName: this.data.faName,
    }
    qzzx(data).then(res => {
      wx.hideLoading();
      console.log('getQzzxres',res)
    })
  },
  getsubmitTowd() {
    var that=this;
    let data = {
      openId: that.data.openId,
      shareOpenId:wx.getStorageSync('tjropenid')
    }
    console.log("提交网贷",data)
    submitTowd(data).then(res => {
      console.log('submitTowdres:',res)
      if (res.resultCode == '0000' || res.resultCode == '2000') {
        this.setData({
          unDisabled:true
        });
        wx.hideLoading({})
        wx.navigateTo({
          url: '/sub5/pages/finish?type=1',
        })
      } else {
        wx.hideLoading({})
        wx.showToast({
          title: res.resultMsg,
          icon: "none",
          mask: true,
          duration: 5000,
        });
      }
    }).catch(err => {

            wx.hideLoading({})
            wx.showToast({
                title: err,
                icon: "none",
                mask: true,
                duration: 5000,
            });
        })
    },
    onClickLeft() {
      this.setData({
      show: false,
      authorizationStatus: '',
    });
    this.setData({
      
    })
    // wx.showToast({ title: '点击返回', icon: 'none' });
    if (this.data.procedure == 1) {
      wx.navigateBack({
        delta: 1 //返回上一级页面
      })
    } else if (this.data.procedure == 2) {
      this.setData({
        procedure: 1
      })
    } else if (this.data.procedure == 3) {
      this.setData({
        procedure: 2
      })
    }
  },
  onClickRight() {
    wx.showToast({
      title: '点击按钮',
      icon: 'none'
    });
  },
  getPage() {
    // http://zwfw.safe.gov.cn/asone/WelcomeServlet
    // wx.navigateTo({
    //     url: './administration' ,
    // })
    wx.setClipboardData({
      data: 'http://zwfw.safe.gov.cn/asone/WelcomeServlet', //要复制的数据
      success(res) {
        wx.showToast({
          title: '复制成功',
          duration: 3000
        })
        wx.getClipboardData({
          success(res) {}
        })
      }
    })
  },
  // 提示弹窗
  showPopup() {
    this.setData({
      show: true
    });
  },
  // 关闭提示弹窗
  onClose() {
    this.setData({
      show: false,
      timeShow: false
    });
  },
  // 关闭协议弹窗
  onCloseAgreement() {
    this.setData({
      agreementShow: false
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (a) {
    console.log(a);
    if (!this.data.typeSH) {
      wx.showModal({
        title: "提示",
        content:"已存在信用办理中的申请订单，暂时无法重复提交",
        showCancel: false,
        success: function (res) {
          
          
          

          
        },
      });
    }
    console.log(this.data.taxflag);
    if (this.data.taxflag) {
      this.setData({
        authorizationStatus: '确认授权'
      })
    }
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