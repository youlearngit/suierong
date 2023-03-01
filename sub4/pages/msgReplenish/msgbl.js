const App = getApp();
import {
  benInformation,
  benInformationAdd
} from '../../../api/suierong';
const idcard = require('../../../utils/idcard'); //身份证校验
Page({
  data: {
    preffixUrl: '',
    arr1: [
      "直接或间接拥有超过25%公司股权或表决权",
      "通过人事、财务等方式对公司进行控制（不存在直接或间接股权比例超过25%（含）的自然人）",
      "公司的高级管理人员（不存在直接或间接股权比例超过25%（含）的自然人）",
      "拥有超过25%合伙权益（仅适用于合伙企业）"
    ],
    arr1_code: ['0806', '5109', '0109', '0301'],
    BENEFICIARYLIST:[],//受益人数组
    CERT_TYPE: "021", //证件种类传固定值（第二代居民身份证）
    ADDRESS: '',
    flag: false,
    TimeID: -1,
    jkflag: false,
    showSYR:true,
    boxbox:false, //状态码为'666666',受益人所有信息不可点击
    QCERT_NO:'',//统一码
    height:1060
  },
  async onLoad(options) {
    var code;
    if (options.code) {
      code = options.code;
    } else {
      code = ''
    }
    console.log('code:', code)
    this.setData({
      QCERT_NO:code
    })
    let data = {
      ECIF_CUST_NO: '', //客户编号
      EXT_SYSTEM_ID: '', //系统编号
      CERT_TYPE: '23402', //证件类型
      PARTY_NAME:'',
      RESOLVE_TYPE:'3',//识别方式	
      // QCERT_NO: code || '91320621MA1WPXTJ44' //统一码  必填
      QCERT_NO: code //统一码  必填
    }
    console.log('查询受益人:', data)
    await benInformation(data).then(res => {
      console.log(res)
      if (res.MSGCODE == '000000') {
        if(res.BENEFICIARYLIST&&res.BENEFICIARYLIST.length>0){
          let { PARTY_NAME,LEGAL_NAME,LEGAL_CERT_TYPE,LEGAL_CERT_NO,LEGAL_CERT_TERM} = res;
          let BENEFICIARYLIST = res.BENEFICIARYLIST;
          this.setData({
            showSYR:true,
            boxbox:false,
            PARTY_NAME,
            LEGAL_NAME,
            LEGAL_CERT_TYPE,
            LEGAL_CERT_NO,
            LEGAL_CERT_TERM:`${LEGAL_CERT_TERM.substring(0,4)}-${LEGAL_CERT_TERM.substring(4,6)}-${LEGAL_CERT_TERM.substr(6,8)}`,
            MSGCODE:res.MSGCODE,
            BENEFICIARYLIST
          });
      }else{
        let { PARTY_NAME,LEGAL_NAME,LEGAL_CERT_TYPE,LEGAL_CERT_NO,LEGAL_CERT_TERM} = res;
        this.setData({
          showSYR:false,
          boxbox:false,
          PARTY_NAME,
          LEGAL_NAME,
          LEGAL_CERT_TYPE,
          LEGAL_CERT_NO,
          LEGAL_CERT_TERM:`${LEGAL_CERT_TERM.substring(0,4)}-${LEGAL_CERT_TERM.substring(4,6)}-${LEGAL_CERT_TERM.substr(6,8)}`,
          MSGCODE:res.MSGCODE,
        });
      }
      }else if(res.MSGCODE == '666666'){
        if(res.BENEFICIARYLIST&&res.BENEFICIARYLIST.length>0){
          let { PARTY_NAME,LEGAL_NAME,LEGAL_CERT_TYPE,LEGAL_CERT_NO,LEGAL_CERT_TERM} = res;
          let BENEFICIARYLIST = res.BENEFICIARYLIST;
          this.setData({
            BENEFICIARYLIST,
            showSYR:true,
            boxbox:true,
            PARTY_NAME, //企业名称
            LEGAL_NAME, //法定代表人姓名
            LEGAL_CERT_TYPE, //证件种类
            LEGAL_CERT_NO, //法人证件号码
            LEGAL_CERT_TERM:`${LEGAL_CERT_TERM.substring(0,4)}-${LEGAL_CERT_TERM.substring(4,6)}-${LEGAL_CERT_TERM.substr(6,8)}`, //法人证件有效期
            MSGCODE:res.MSGCODE
          });
          var  that=this;
          console.log('BENEFICIARYLIST:',BENEFICIARYLIST)
          BENEFICIARYLIST.forEach((item,index)=>{
            var select=''
            if(item.REL_TYPE=='0806'){
              select=0
            }else if(item.REL_TYPE=='5109'){
              select=1
            }else if(item.REL_TYPE=='0109'){
              select=2
            }else if(item.REL_TYPE=='0301'){
              select=3
            }
            that.setData({
              // [`BENEFICIARYLIST[${index}].CONTACT_DESC`]:`${item.CONTACT_DESC.substring(0,4)}-${item.CONTACT_DESC.substring(4,6)}-${item.CONTACT_DESC.substr(6,8)}`,
              // [`BENEFICIARYLIST[${index}].CERT_EXPD_DATE`]:`${item.CERT_EXPD_DATE.substring(0,4)}-${item.CERT_EXPD_DATE.substring(4,6)}-${item.CERT_EXPD_DATE.substr(6,8)}`,
              [`BENEFICIARYLIST[${index}].CONTACT_DESC`]:item.CONTACT_DESC,
              [`BENEFICIARYLIST[${index}].CERT_EXPD_DATE`]:item.CERT_EXPD_DATE,
              [`BENEFICIARYLIST[${index}].selectedItems`]:select
            })
          })
      }else{
        let { PARTY_NAME,LEGAL_NAME,LEGAL_CERT_TYPE,LEGAL_CERT_NO,LEGAL_CERT_TERM} = res;
        this.setData({
          showSYR:false,
          boxbox:false,
          PARTY_NAME, //企业名称
          LEGAL_NAME, //法定代表人姓名
          LEGAL_CERT_TYPE, //证件种类
          LEGAL_CERT_NO, //法人证件号码
          LEGAL_CERT_TERM:`${LEGAL_CERT_TERM.substring(0,4)}-${LEGAL_CERT_TERM.substring(4,6)}-${LEGAL_CERT_TERM.substr(6,8)}`, //法人证件有效期
          MSGCODE:res.MSGCODE
        });
      }
        wx.showModal({
          title: '温馨提示',
          content: '该企业已维护过受益人信息',
          confirmText: '我知道了',
          showCancel: false
        });
      }else{
        wx.showToast({
          title: res.ERROR_MSG,
          icon: 'none',
          duration: 2000
        })
      }
    })
    this.data.BENEFICIARYLIST.forEach(item=>{
      Object.assign(item,{'selectedItems':-1,'CERT_TYPE':'021'})
    })
    console.log(this.data.BENEFICIARYLIST)
    this.setData({
      preffixUrl: App.globalData.URL
    })
  },
  funInput(e) {
    var index = e.currentTarget.dataset.index;
      this.setData({
        [`BENEFICIARYLIST[${index}].CERT_NO`]: e.detail.value.trim()
      })
    console.log(this.data.BENEFICIARYLIST)
  },
  funInput1(e) {
    var index = e.currentTarget.dataset.index;
      this.setData({
        [`BENEFICIARYLIST[${index}].ADDRESS`]: e.detail.value.trim()
      })
    console.log(this.data.BENEFICIARYLIST)
  },
  funInput2(e) {
    var index = e.currentTarget.dataset.index;
      this.setData({
        [`BENEFICIARYLIST[${index}].CONTACT_NAME`]: e.detail.value.trim()
      })
    console.log(this.data.BENEFICIARYLIST)
  },
  choose(e) {
    let item = e.currentTarget.dataset.item;
    this.setData({
      [`BENEFICIARYLIST[${item}].selectedItems`]: parseInt(e.detail.value, 10),
      [`BENEFICIARYLIST[${item}].REL_TYPE`]: this.data.arr1_code[parseInt(e.detail.value, 10)]
    });
    console.log(this.data.BENEFICIARYLIST)
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let item = e.currentTarget.dataset.item;
    this.setData({
      flag: false,
      [`BENEFICIARYLIST[${item}].CONTACT_DESC`]: e.detail.value.replace(/\-/g, "")
    })
    console.log(this.data.BENEFICIARYLIST)
  },
  bindDateChange_sub: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let item = this.data.dqrListItem;
    this.setData({
      flag: false,
      [`BENEFICIARYLIST[${item}].CERT_EXPD_DATE`]: e.detail.value.replace(/\-/g, "")
    })
    console.log(this.data.BENEFICIARYLIST)
  },
  bindDateChange1() {
    let item = this.data.dqrListItem;
    this.setData({
      flag: false,
      [`BENEFICIARYLIST[${item}].CERT_EXPD_DATE`]: '99991231'
    })
  },
  showModalDate(e) {
    let item = e.currentTarget.dataset.item;
    this.setData({
      flag: true,
      dqrListItem:item
    })
  },
  closeTap() {
    this.setData({
      flag: false
    })
  },
  cancelDataTime(){
    this.setData({
      flag: false
    })
  },
  sureSubmit() {
    console.log(this.data.BENEFICIARYLIST)
    if (this.data.MSGCODE == '666666') {
      wx.showModal({
        title: '温馨提示',
        content: '该企业已维护过受益人信息',
        confirmText: '我知道了',
        showCancel: false,
        success: (result) => {
          if (result.confirm) {
            wx.switchTab({
              url: "/pages/shop/index2"
            });
          }
        },
      });
      return false;
    }
    var flag = 0;
    if (this.data.showSYR) {
      var that = this;
      for (var i = 0; i < that.data.BENEFICIARYLIST.length; i++) {
        if (flag > 0) {
          return
        }
        flag = flag + that.validReqParams(that.data.BENEFICIARYLIST[i]) ? 1 : 0;
      }
    }
    if (flag > 0) {
      return
    }
    if(this.data.showSYR){
      console.log(this.data.BENEFICIARYLIST)
      this.data.BENEFICIARYLIST.forEach((item,index)=>{
        this.setData({
          [`BENEFICIARYLIST[${index}].CONTACT_DESC`]:item.CONTACT_DESC.replace(/\-/g, ""),
          [`BENEFICIARYLIST[${index}].CERT_EXPD_DATE`]:item.CERT_EXPD_DATE.replace(/\-/g, "") 
        })
      })
    var data = {
      PARTY_NAME: this.data.PARTY_NAME, //企业名称
      LEGAL_NAME: this.data.LEGAL_NAME, //法人代表名称
      LEGAL_CERT_TYPE: this.data.LEGAL_CERT_TYPE, //法人代表证件类型
      LEGAL_CERT_NO: this.data.LEGAL_CERT_NO, //法人代表证件号码
      LEGAL_CERT_TERM: this.data.LEGAL_CERT_TERM.replace(/\-/g, ""), //法人证件有效期
      CERT_TYPE: '23402', //证件类型
      RESOLVE_TYPE:'3',
      QCERT_NO:this.data.QCERT_NO
    }
    data.GRP_REL_PSN_LIST=this.data.BENEFICIARYLIST;
    console.log(this.data.BENEFICIARYLIST)
  }else{
    var data = {
      PARTY_NAME: this.data.PARTY_NAME, //企业名称
      LEGAL_NAME: this.data.LEGAL_NAME, //法人代表名称
      LEGAL_CERT_TYPE: this.data.LEGAL_CERT_TYPE, //法人代表证件类型
      LEGAL_CERT_NO: this.data.LEGAL_CERT_NO, //法人代表证件号码
      LEGAL_CERT_TERM: this.data.LEGAL_CERT_TERM.replace(/\-/g, ""), //法人证件有效期
      CERT_TYPE: '23402', //证件类型
      RESOLVE_TYPE:'3',
      QCERT_NO:this.data.QCERT_NO
    }
  }
    console.log('新增data:',data)
    if (this.data.jkflag) {
      return;
    }
    this.setData({
      jkflag: true
    })
    wx.showLoading({
      title: '提交中'
    })
    clearTimeout(this.TimeID);
    this.TimeID = setTimeout(() => {
      var that = this;
        benInformationAdd(data).then(res => {
          console.log(res)
          wx.hideLoading();
          if (res.MSGCODE == '000000') {
            wx.showToast({
              title: '提交成功',
              icon: 'success',
              duration: 2000
            })
            that.setData({
              jkflag: false
            })
            setTimeout(() => {
              wx.switchTab({
                url: "/pages/shop/index2",
              });
            }, 2000)
          } else {
            wx.showToast({
              title: res.ERROR_MSG,
              icon: 'none',
              duration: 2000
            })
            that.setData({
              jkflag: false
            })
          }
        }).catch(err => {
          wx.showToast({
            title: err,
            icon: 'none',
            duration: 2000
          })
          that.setData({
            jkflag: false
          })
        })
    }, 1000)
  },
  validReqParams(item){
    if (!item.REL_TYPE) {
      wx.showToast({
        title: '请选择受益人类型！',
        icon: 'none',
        duration: 2000
      })
      return true;
    }
    if (!item.CONTACT_NAME) {
      wx.showToast({
        title: '请输入受益人姓名！',
        icon: 'none',
        duration: 2000
      })
      return true;
    }
    if (!item.CERT_NO) {
      wx.showToast({
        title: '请输入您的身份证号！',
        icon: 'none',
        duration: 2000
      })
      return true;
    } else if (!idcard.checkIdCard(item.CERT_NO)) {
      wx.showToast({
        title: '请输入正确的身份证号',
        icon: 'none',
        duration: 2000
      })
      return true;
    };
    if (!item.ADDRESS) {
      wx.showToast({
        title: '请输入联系地址！',
        icon: 'none',
        duration: 2000
      })
      return true;
    } else if (item.ADDRESS.length < 10) {
      wx.showToast({
        title: '请输入超过10位的联系地址！',
        icon: 'none',
        duration: 2000
      })
      return true;
    }
    if (!item.CONTACT_DESC) {
      wx.showToast({
        title: '请输入证件起始日！',
        icon: 'none',
        duration: 2000
      })
      return true;
    }
    if (!item.CERT_EXPD_DATE) {
      wx.showToast({
        title: '请输入证件到期日！',
        icon: 'none',
        duration: 2000
      })
      return true;
    }
  }
})