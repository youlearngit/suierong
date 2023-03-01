// sub3/pages/ftAccountOpen/apply/accountInfoPage.js
import WxValidate from '../../../../assets/plugins/wx-validate/WxValidate';
import requestYT from "../../../../api/requestYT";
import Toast from '../../../static/vant-weapp/toast/toast';
import enumType from '../component/enum';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    preffixUrl:'',

    uniqId:'', //唯一识别标识
    isCreate:'',
    formDisabeld:false, //是否可编辑
    accountType:'', //开户类型

    //表单体
    accountId: '', //账户识别id
    accountName:'', //账户名称
    zhxz:'', //账户性质选择显示名称
    accountInfoNature:'',
    dzdz:'', //对账地址
    zipCode: '', //邮编
    baseAccounthzh: '', //基本存款账户开户许可证核准号
    capitalNature:'', //资金性质
    zjxz:'', //资金性质选择显示名称
    accountUseDateTo: '',//账户使用有效期至
    openAccountReson: '', //开户原因
    khyy:'',//开户原因显示名称
    openAccountPhonehzr: '', //开户电话核实人
    khdhhsr:'',//开户电话核实人类型选择显示名称

    //账户性质
    zhxzIndex:['0'],
    zhxzItems:enumType.type.zhxzItems,
    //资金性质选择
    zjxzIndex:['0'],
    zjxzItems:enumType.type.zjxzItems,
    //开户原因
    khyyIndex:['0'],
    khyyItems:enumType.type.khyyItems,
    //开户电话核实人类型选择
    khdhhsrIndex:['0'],
    khdhhsrItems:enumType.type.khdhhsrItems,


    //弹窗标记
    dialogFlag:{
      accountUseDateTo: false, //证明文件有效期弹窗标记
    },
    accountUseDateToPicker:'', //证明文件有效期时间戳记录
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
    that.getAccountInfo(); //修改、查看状态下，查询数据信息
    //监听器
    app.watch(this, {
      //账户性质
      accountInfoNature : function(newVal){
        that.data.zhxzItems[0].forEach((obj,index)=>{
          if(obj.value == newVal){
            that.setData({
              zhxz : obj.name,
            });
          }
        })
      },
      
      //账户使用有效期致
      accountUseDateTo: function(newVal){
        //todo 暂不使用该字段
      },
    });
  },
   //修改、查看状态下，查询数据信息
  getAccountInfo(){
    var that = this;
    let options = {
      url: '/ft/searchInfoByUniqId.do',
      data: {
        uniqId: that.data.uniqId,
        type: '2',
      }
    };
    requestYT(options).then((res) => {
      if(res.STATUS =='1'){
        if(res.accountInfo != ''){
          var info = JSON.parse(res.accountInfo);
            if(info.ACCOUNT_NATURE !== '00'){
              that.setData({
                baseAccounthzh: info.BASEA_CCOUNT_KHXKZHZH&&info.BASEA_CCOUNT_KHXKZHZH!=='00'?info.BASEA_CCOUNT_KHXKZHZH.substring(info.BASEA_CCOUNT_KHXKZHZH.indexOf('J')+1):'', //基本存款账户开户许可证核准号
                capitalNature: info.CAPITAL_NATURE?info.CAPITAL_NATURE:'', //资金性质
                // accountUseDateTo: info.ACCOUNT_USE_DATETO?info.ACCOUNT_USE_DATETO:'', //账户使用有效期致 暂不使用该字段
              });
              that.convertzjxz(info.CAPITAL_NATURE);
            }
            that.setData({
              accountId: info.ID?info.ID:'',
              accountName: info.ACCOUNT_NAME?info.ACCOUNT_NAME:'', //账户名称
              accountInfoNature: info.ACCOUNT_NATURE?info.ACCOUNT_NATURE:'',//账户性质选择
              dzdz: info.DZDZ?info.DZDZ:'', //对账地址
              zipCode: info.ZIP_CODE?info.ZIP_CODE:'', //邮编,
              openAccountReson: info.OPEN_ACCOUNT_REASON?info.OPEN_ACCOUNT_REASON:'', //开户原因
              openAccountPhonehzr: info.OPEN_ACCOUNT_PHONEHZR?info.OPEN_ACCOUNT_PHONEHZR:'',//开户电话核实人
            });
            that.convertkhyy(info.OPEN_ACCOUNT_REASON);
            that.convertkhdhhsr(info.OPEN_ACCOUNT_PHONEHZR);
           
        }else{
          //如果没有查询到信息，反显单位信息部分数据
          let options = {
            url: '/ft/searchInfoByUniqId.do',
            data: {
              uniqId: that.data.uniqId,
              type: '1',
            }
          };
          requestYT(options).then((res) => {
            if(res.enterpriseInfo!=''){
              var info = JSON.parse(res.enterpriseInfo);
              that.setData({
                accountName: info.ACCOUNT_NAME, //客户名称反显账户名称
                dzdz: info.WORK_PLACE //对账地址反显注册地址
              });
            }
          });
        }
      }
    });
  },
  //账户性质选择
  zhxzChange: function(e){
    var that =this;
    that.setData({
      accountInfoNature: that.data.zhxzItems[0][e.detail.value[0]].value,
      zhxz: that.data.zhxzItems[0][e.detail.value[0]].name
    });
  },
  // 资金性质选择
  zjxzChange:function(e){
    var that =this;
    that.setData({
      zjxz: that.data.zjxzItems[0][e.detail.value[0]].name,
      capitalNature: that.data.zjxzItems[0][e.detail.value[0]].value
    });
  },
  //资金性质
  convertzjxz: function(value){
    var obj = this.data.zjxzItems[0].find(function(x) {
      return x.value == value;
    });
    this.setData({
      zjxz : obj.name,
    });
  },
  //开户原因选择
  khyyChange: function(e){
    var that =this;
    that.setData({
      khyy: that.data.khyyItems[0][e.detail.value[0]].name,
      openAccountReson: that.data.khyyItems[0][e.detail.value[0]].value
    });
  },
    //开户原因
  convertkhyy: function(value){
    var obj = this.data.khyyItems[0].find(function(x) {
      return x.value == value;
    });
    this.setData({
      khyy : obj.name,
    });
  },
  //开户电话核实人选择
  khdhhsrChange: function(e){
    var that =this;
    that.setData({
      khdhhsr: that.data.khdhhsrItems[0][e.detail.value[0]].name,
      openAccountPhonehzr: that.data.khdhhsrItems[0][e.detail.value[0]].value
    });
  },
  convertkhdhhsr: function(value){
    var obj = this.data.khdhhsrItems[0].find(function(x) {
      return x.value == value;
    });
    this.setData({
      khdhhsr : obj.name,
    });
  },

  //选择日期
  accountUseDateToChange: function(e){
    var that = this;
    that.setData({
      dialogFlag:{
        accountUseDateTo : true
      }
    });
  },
  onAccountUseDateToEvent: function (e) {
    var that = this;
    let {type,detail} = e;
    that.setData({
      accountUseDateTo : Date.DateFormat(new Date(detail),'yyyy-MM-dd'),
      accountUseDateToPicker:detail,
    });
    that.onClose();
  },
  onClose() {
    this.setData({
      dialogFlag:{
        dentityFileDateFlag : false,
      }
    });
  },
  initValidate(){
    var that =this;
    //校验规则
    let rules = {
      accountName: {required: true, maxlength:80}, //账户名称
      zhxz: {required: true}, //账户性质
      dzdz: {required: true,maxlength:450}, //对账地址
      zipCode: {required: true,maxlength:6,minlength:6}, //邮编
      baseAccounthzh: {required: that.data.accountInfoNature === '31',maxlength:13,minlength:13}, //基本存款账户开户许可证核准号
      zjxz: {required: that.data.accountInfoNature === '31'}, //资金性质
      accountUseDateTo: {required: false },//账户使用有效期致
      khyy: {required: true}, //开户原因
      khdhhsr: {required: true}, //开户电话核实人
    }
    //提示错误信息
    let messages = {
      custName: {required: "请输入账户名称"}, 
      zhxz: {required: "请选择账户性质"}, 
      dzdz: {required: "请输入对账地址"}, 
      zipCode: {required: "请输入6位数邮编"},
      baseAccounthzh: {required:"请输入基本存款账户开户许可证核准号",maxlength:"基本存款账户开户许可证核准号为13位数字",minlength:"基本存款账户开户许可证核准号为13位数字"},
      zjxz: {required: "请选择资金性质"},
      khyy: {required: "请选择开户原因"},
      khdhhsr: {required: "请选择开户电话核实人"}
    }
    // 校验
    that.WxValidate = new WxValidate(rules, messages);
  },
  //提交表单
  submitForm: function(e){
    var that = this;
    wx.showLoading({
      title: '请稍后...',
      mask: true
    })
    if(that.data.isCreate == '2'){
      wx.hideLoading();
      wx.navigateTo({
        url: "/sub3/pages/ftAccountOpen/apply/naturalPeoplePage?uniqId="+that.data.uniqId+"&isCreate="+that.data.isCreate+"&accountType="+that.data.accountType,
      })
    }else{
      let params = e.detail.value;
      this.initValidate(); 
      if (!that.WxValidate.checkForm(params)) {
        wx.hideLoading();
        Toast(that.WxValidate.errorList[0].msg.replace('。', ''));
      }else{
        let data = {
          openId: wx.getStorageSync('openid'), //微信id
          uniqId: that.data.uniqId  != ''? that.data.uniqId : '', //数据唯一标识,区别新增/修改
          accountId: that.data.accountId, //新增传空、修改提交、只读提交
          accountName: that.data.accountName, //账户名称
          accountInfoNature: that.data.accountInfoNature, //账户性质
          dzdz: that.data.dzdz, //对账地址
          zipCode: that.data.zipCode, //邮编
          baseAccounthzh: that.data.accountInfoNature !== '00' ?"J"+that.data.baseAccounthzh:'', //基本存款账户开户许可证核准号
          capitalNature: that.data.accountInfoNature !== '00' ?that.data.capitalNature:'', //资金性质
          accountUseDateTo: that.data.accountInfoNature !== '00'&& that.data.accountInfoNature !== '31' ? that.data.accountUseDateTo:'',//账户使用有效期致
          openAccountReson: that.data.openAccountReson, //开户原因
          openAccountPhonehzr: that.data.openAccountPhonehzr, //开户电话核实人
        }
        let options = {
          url: '/ft/recordAccountInfo.do',
          data: data
        };
        requestYT(options).then((res) => {
          if(res.msgCode =='0000'){
            wx.hideLoading();
            wx.navigateTo({
                url: "/sub3/pages/ftAccountOpen/apply/naturalPeoplePage?uniqId="+that.data.uniqId+"&isCreate="+that.data.isCreate+"&accountType="+that.data.accountType,
            })
          }else{
            wx.hideLoading();
            wx.showToast({
              title: '提交失败',
              image: res.msg,
              icon: 'none',
            });
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