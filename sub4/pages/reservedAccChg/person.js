// sub3/pages/reservedAccChg/person.js
var app = getApp();
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    preffixUrl: app.globalData.CDNURL,
    checked: true,
    currentDate: new Date().getTime(),
    minDate: new Date(1945, 0, 1).getTime(),
    maxDate: new Date(2050, 10, 1).getTime(),

    dateSel:'',
    dateType:'',
    idCardType:'',
    formatter(type, value) {
      if (type === 'year') {
        return `${value}`;
      }
      if (type === 'month') {
        return `${value}`;
      }

      if (type === 'day') {
        return `${value}`;
      }
      return value;
    },
    cardTypeList: [{
      id: "021",
      text: "第二代居民身份证"
    },
    {
      id: "031",
      text: "临时身份证"
    },
    {
      id: "042",
      text: "中国护照"
    },
    {
      id: "155",
      text: "香港通行证"
    },
    {
      id: "165",
      text: "澳门通行证"
    },
    {
      id: "175",
      text: "台湾通行证或有效旅行证件"
    },
    {
      id: "18A",
      text: "外国人永久居留证"
    },
    {
      id: "202",
      text: "外国护照"
    },
  ],
  cardTypeList1: [
    { id: "1", text: "身份证" },
    { id: "2", text: "护照" },
    { id: "3", text: "军人证" },
    { id: "4", text: "武警证" },
    { id: "5", text: "港澳台通行证" },
    { id: "7", text: "警官证" },
    { id: "8", text: "其他" },
    { id: "9", text: "边民证" },
    { id: "A", text: "外国人永久居留证" },
    { id: "B", text: "临时身份证" },
  ],
  e015:{},
  idCardSelShow:false,
  idCardSelShow1:false,
  selectId:{text:'请选择'},
  dateSelShow: false,
  info:{},
  same1Pop:false,
  onConfirm1Index:'',
  columns1: ["同法定代表人", "其他"],
  onConfirm2Index:'',
  columns2: ["同法定代表人","同联系人", "其他"],
  },
  cancelPop(){
    this.setData({
      same1Pop:false
    })
  },
  onConfirmPop(event) {
    that.setData({
      onConfirm1Index:event.detail.value,
      same1Pop:false

    })
  },
  cancel2Pop(){
    this.setData({
      same2Pop:false
    })
  },
  onConfirm2Pop(event) {
    that.setData({
      onConfirm2Index:event.detail.value,
      same2Pop:false

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
that=this;


if(options.data){
  let data1 = this.data.cardTypeList;
  let d = JSON.parse(options.data)
  data1.forEach((item, index) => {
    if (item.id == d.legalCertType) {
     d.legalCertTypeTxt = item.text;
    }
    if (item.id == d.contactZjlx) {
      d.contactZjlxTxt = item.text;
     }
  
   
  });
  let data2 = this.data.cardTypeList1;

  data2.forEach((item, index) => {

     if (item.id == d.dcl1cjlx) {
      d.zjzl1Txt = item.text;
     }
     if (item.id == d.dcl2cjlx) {
      d.zjzl2Txt = item.text;
     }

     if (item.id == d.remark11) {
      d.zjzl3Txt = item.text;
     }
     if (item.id == d.remark16) {
      d.zjzl4Txt = item.text;
     }
   
  });
  if(d.zjyxq3=='99991231'){
    d.zjyxq3Radio='99991231'
  }else{
    d.zjyxq3Radio='2'

  }
  if(d.zjyxq2=='99991231'){
    d.zjyxq2Radio='99991231'
  }else{
    d.zjyxq2Radio='2'

  }
  if(d.zjyxq1=='99991231'){
    d.zjyxq1Radio='99991231'
  }else{
    d.zjyxq1Radio='2'

  }
  if(d.zjyxq4=='99991231'){
    d.zjyxq4Radio='99991231'
  }else{
    d.zjyxq4Radio='2'

  }
  if(d.contactzjyxqend=='99991231'){
    d.contactzjyxqendRadio='99991231'
  }else{
    d.contactzjyxqendRadio='2'
  }
  if(d.reserve9=='99991231'){
    d.reserve9Radio='99991231'
  }else{
    d.reserve9Radio='2'
  }
  
that.setData({
  info:d
})
}
if(options.e015!=undefined && options.e015!="{}"){
  that.setData({
    e015:JSON.parse(options.e015)
  })
  let d = that.data.info;
  let e015 = that.data.e015;

  d.deczlxrxm1=e015.dcl1Mc
d.zjh1=e015.dcl1Zjhm
d.lxdh1=e015.dcl1Sjh

d.companyName=e015.sjjgmc
d.leadCompanyNo=e015.sjbmdmz
d.legalName=e015.frdbxm
d.legalCertNo=e015.frdbzjhm
d.date=e015.frdbzjyxqq
d.reserve9=e015.frdbzjyxqz
d.legalPhoneNo=e015.frdbdh
d.financeMaster=e015.cwzg
d.financeTel=e015.remark27
d.financeZjhm=e015.remark26

//联系人
d.contactName=e015.lxrmc
d.contactZjhm=e015.lxrzjhm
d.contactzjyxq=e015.lxrzjyxq
d.contactzjyxqend=e015.remark8
d.contactPhoneNo=e015.lxrdh

d.contactMobileNo=e015.lxrsj


//对账联系人

d.dzlxrName=e015.dzlxr
d.dzlxrPhone=e015.dzlxrdh
d.dzlxrAddress=e015.dzdz
d.dzlxrCode=e015.dzdzyb


d.deczlxrxm2=e015.dcl2Mc
d.zjh2=e015.dcl2Zjhm
d.lxdh2=e015.dcl2Sjh


d.deczlxrxm3=e015.remark9
d.zjh3=e015.remark11
d.lxdh3=e015.remark12

d.deczlxrxm4=e015.remark15
d.zjh4=e015.remark17
d.lxdh4=e015.remark18

  let data1 = this.data.cardTypeList;

  data1.forEach((item, index) => {
    if (item.id == e015.frdbzjlx) {
      d.legalCertTypeTxt = item.text;
     }
     if (item.id == e015.lxrzjzl) {
      d.contactZjlxTxt = item.text;
     }
 if(item.id == e015.remark25){
  d.financeZjzlTxt=item.text

 }
   
  });
  let data2 = this.data.cardTypeList1;

  data2.forEach((item, index) => {

     if (item.id == e015.dcl1Cjlx) {
      d.zjzl1Txt = item.text;
     }
     if (item.id == e015.dcl2Cjlx) {
      d.zjzl2Txt = item.text;
     }

     if (item.id == e015.remark11) {
      d.zjzl3Txt = item.text;
     }
     if (item.id == e015.remark16) {
      d.zjzl4Txt = item.text;
     }
   
  });
  if(e015.remark14=='99991231'){
    d.zjyxq3Radio='99991231'
  }else{
    d.zjyxq3Radio='2'
d.zjyxq1=e015.remark6
  }
  if(e015.remark7=='99991231'){
    d.zjyxq2Radio='99991231'
  }else{
    d.zjyxq2Radio='2'
    d.zjyxq2=e015.remark7

  }
  if(e015.remark6=='99991231'){
    d.zjyxq1Radio='99991231'
  }else{
    d.zjyxq1Radio='2'
    d.zjyxq3=e015.remark14

  }
  if(e015.remark20=='99991231'){
    d.zjyxq4Radio='99991231'
  }else{
    d.zjyxq4Radio='2'
    d.zjyxq3=e015.remark20

  }
  if(e015.frdbzjyxqz=='99991231'){
    d.reserve9Radio='99991231'
  }else{
    d.reserve9Radio='2'
    d.reserve9=e015.frdbzjyxqz

  }

  if(e015.lxr=='99991231'){
    d.contactzjyxqendRadio='99991231'
  }else{
    d.contactzjyxqendRadio='2'
    d.contactzjyxqend=e015.remark8
  }
  that.setData({
    info:d
  })

  }
  },
  same1Pop(){
    this.setData({
      same1Pop:true
    })
  },
  same2Pop(){
    this.setData({
      same2Pop:true
    })
  },
  clickreserve9(event){
    if(event.detail!='99991231'){
      this.setData({
        dateSelShow: !this.data.dateSelShow,
        dateType:'reserve9'
      });
    }
    this.setData({
      'info.reserve9Radio': event.detail,
      'info.reserve9':event.detail

    });
  },
  clickContact(event){
    if(event.detail!='99991231'){
      this.setData({
        dateSelShow: !this.data.dateSelShow,
        dateType:'contactzjyxqend'
      });
    }
    this.setData({
      'info.contactzjyxqendRadio': event.detail,
      'info.contactzjyxqend':event.detail

    });
  },
  clickLarge3(event){
    if(event.detail!='99991231'){
      this.setData({
        dateSelShow1: !this.data.dateSelShow,
        dateType:'zjyxq3'
      });
    }
    this.setData({
      'info.zjyxq3Radio': event.detail,
      'info.zjyxq3':event.detail

    });
  },
  clickLarge4(event){
    if(event.detail!='99991231'){
      this.setData({
        dateSelShow1: !this.data.dateSelShow,
        dateType:'zjyxq4'
      });
    }
    this.setData({
      'info.zjyxq4Radio': event.detail,
      'info.zjyxq4':event.detail

    });
  },
  clickLarge2(event){
    if(event.detail!='99991231'){
      this.setData({
        dateSelShow1: !this.data.dateSelShow,
        dateType:'zjyxq2'
      });
    }
    this.setData({
      'info.zjyxq2Radio': event.detail,
      'info.zjyxq2':event.detail

    });
  },
  clickLarge1(event){
    if(event.detail!='99991231'){
      this.setData({
        dateSelShow1: !this.data.dateSelShow,
        dateType:'zjyxq1'
      });
    }
  
    this.setData({
      'info.zjyxq1Radio': event.detail,
      'info.zjyxq1':event.detail
    });
  },
  submitForm(e){
    const params = e.detail.value;
    let info = that.data.info
    var obj = Object.assign(info, params);
 console.log(obj)
  wx.navigateTo({
    url: './dAccount?data='+JSON.stringify(obj)+'&e015='+JSON.stringify(that.data.e015),
  })
  },
  onPopupEvent: function (e) {
    this.setData({
      idCardSelShow: !this.data.idCardSelShow
    });

  },
  onCancel: function (e) {
    this.setData({
      idCardSelShow: false,
      idCardSelShow1: false,

    });

  },
  click1(e){
    let type= e.currentTarget.dataset.name
    this.setData({
      idCardSelShow: !this.data.idCardSelShow,
      idCardType:type
    });
  },
  click2(e){
    let type= e.currentTarget.dataset.name
    this.setData({
      idCardSelShow1: !this.data.idCardSelShow1,
      idCardType:type
    });
  },
  clickDate1(e){
    let type= e.currentTarget.dataset.name

    this.setData({
      dateSelShow: !this.data.dateSelShow,
      dateType:type
    });
  },
  confirmIdCard(event) {
    const {
      picker,
      value,
      index
    } = event.detail;
  
    that.setData({
      selectId: value,
      ['info.'+that.data.idCardType]:value.id,
      ['info.'+that.data.idCardType+'Txt']:value.text,
      idCardSelShow: false,
      idCardSelShow1: false
    })

  },
  onPopupEvent2: function (e) {
    this.setData({
      dateSelShow: !this.data.dateSelShow
    });

  },
  onCancel2: function (e) {
    this.setData({
      dateSelShow: false,
      idCardSelShow1: false

    });

  },
  confirm2(event) {

    that.setData({
      dateSelShow: !that.data.dateSelShow,
      dateSel: this.timestampToTime(event.detail),
      ['info.'+that.data.dateType]:this.timestampToTime(event.detail),
    })

  },
  onInput(event) {
    this.setData({
      currentDate: event.detail,
    });
  },
  timestampToTime(timestamp) {

    var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000

    let Y = date.getFullYear() ;

    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) ;

    let D = date.getDate();

    let h = date.getHours() + ':';

    let m = date.getMinutes() + ':';

    let s = date.getSeconds();

    return Y + ''+M +''+ D;

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