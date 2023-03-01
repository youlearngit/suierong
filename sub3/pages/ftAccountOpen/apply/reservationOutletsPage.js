// sub3/pages/ftAccountOpen/apply/reservationOutletsPage.js
import WxValidate from '../../../../assets/plugins/wx-validate/WxValidate';
import requestYT from "../../../../api/requestYT";
import optionsSycz from '../component/city-collection'
import Toast from '../../../static/vant-weapp/toast/toast';
var encr = require('../../../../utils/encrypt/encrypt'); //国密3段式加密
var aeskey = encr.key //随机数
const app = getApp();
const citys = optionsSycz.citys;
var encr = require('../../../../utils/encrypt/encrypt.js'); //国密3段式加密
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isSubmit :0,
    preffixUrl:'',
    uniqId:'',
    isCreate:'',
    formDisabeld:false, //是否可编辑
    accountType:'',
    selectWd:{},

    //表单体
    recommNo: '', //推荐人工号
    cyrs: '', //从业人数
    zyyw: '', // 主营业务
    lastYearYysr: '', //请输入上年营业收入
    lastYearLrsp: '', // 上年利润水平
    WDMC: "",
    // selectedOptions: {},
    people_num: "",
    main_business: "",
    incom: "",
    profit: "",
    main_id: "",
    fieldValue: "",
    address: "",
    wdh: "",
    wdmc: "",
    wdconfirm: false,
    showShop: false,
    cascaderValue: "",
    YYH: "",
    keyShop: "",
    selected: 0,
    tabIndex: "0",
    columns: [{
      values: Object.keys(citys),
      className: 'column1',
    },
    //试点结束放开
    {
      values: citys['江苏省'],
      className: 'column2',
      defaultIndex: 0,
    },

    {
      values: [],
      className: 'column3',
      defaultIndex: 0,
    },
    ],


    business_scope: "",
    reg_cap: "",

    isClick: true,
    localData: {},
    node: "",
    wlqdyl: "",

    onCancel:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      preffixUrl: app.globalData.CDNURL,
      uniqId: options.uniqId,
      isCreate:options.isCreate,
      accountType: options.accountType
    });
    if(options.isCreate == '2'){//已预约，查看详情，表单禁止改写
      that.setData({
        formDisabeld: true
      });
    }
    that.getInfo(); //修改、查看状态下，查询数据信息
    that.getData('0001'); //试点结束改回0001、测试0018
    //todo 判断上某个表单是否有完成

    //数据监听
    app.watch(this,{
        keyShop(newName, oldName) {
          console.log(this.tabIndex);
          if (this.$store.state.type === "1") {
            Toast.fail("苏银城镇暂不支持网点搜索");
            return;
          }
          if (newName.length == 0) {
            this.options = this.options1;
            if (this.tabIndex == "0" || this.tabIndex == "1") {
              this.options = [
                {
                  text: "江苏省",
                  value: "0",
                  children: [
                    {
                      text: "南京市",
                      value: "0001",
                      children: [],
                    },
                    {
                      text: "无锡市",
                      value: "0002",
                      children: [],
                    },
                    {
                      text: "苏州市",
                      value: "0003",
                      children: [],
                    },
                    {
                      text: "南通市",
                      value: "0005",
                      children: [],
                    },
                    {
                      text: "常州市",
                      value: "0008",
                      children: [],
                    },
                    {
                      text: "淮安市",
                      value: "0010",
                      children: [],
                    },
                    {
                      text: "徐州市",
                      value: "0006",
                      children: [],
                    },
                    {
                      text: "扬州市",
                      value: "0009",
                      children: [],
                    },
                    {
                      text: "镇江市",
                      value: "0007",
                      children: [],
                    },
                    {
                      text: "盐城市",
                      value: "0012",
                      children: [],
                    },
                    {
                      text: "连云港市",
                      value: "0011",
                      children: [],
                    },
                    {
                      text: "宿迁市",
                      value: "0015",
                      children: [],
                    },
                    {
                      text: "泰州市",
                      value: "0016",
                      children: [],
                    },
                  ],
                },
                {
                  text: "上海市",
                  value: "1",
                  children: [
                    {
                      text: "上海市",
                      value: "0018",
                      children: [],
                    },
                  ],
                },
                {
                  text: "广东省",
                  value: "2",
                  children: [
                    {
                      text: "深圳市",
                      value: "0019",
                      children: [],
                    },
                  ],
                },
                {
                  text: "北京市",
                  value: "3",
                  children: [
                    {
                      text: "北京市",
                      value: "0020",
                      children: [],
                    },
                  ],
                },
                {
                  text: "浙江省",
                  value: "4",
                  children: [
                    {
                      text: "杭州市",
                      value: "0021",
                      children: [],
                    },
                  ],
                },
              ];
            }
            if (this.tabIndex == "2") {
              let value = this.selected;
    
              requestYT({
                url: "/open/getOaInfo.do",
                data: { main_id: value, type: "13" },
              }).then((res) => {
                if (res.result_code === "0000") {
                  let data = JSON.parse(res.list);
                  switch (value) {
                    case "0001":
                      setTimeout(() => {
                        this.options[0].children[0].children = data;
                        this.options1 = this.options;
                      }, 500);
                      break;
                    case "0002":
                      setTimeout(() => {
                        this.options[0].children[1].children = data;
                        this.options1 = this.options;
                      }, 500);
                      break;
                    case "0003":
                      setTimeout(() => {
                        this.options[0].children[2].children = data;
                        this.options1 = this.options;
                      }, 500);
                      break;
                    case "0005":
                      setTimeout(() => {
                        this.options[0].children[3].children = data;
                        this.options1 = this.options;
                      }, 500);
                      break;
                    case "0008":
                      setTimeout(() => {
                        this.options[0].children[4].children = data;
                        this.options1 = this.options;
                      }, 500);
                      break;
                    case "0010":
                      setTimeout(() => {
                        this.options[0].children[5].children = data;
                        this.options1 = this.options;
                      }, 500);
                      break;
                    case "0006":
                      setTimeout(() => {
                        this.options[0].children[6].children = data;
                        this.options1 = this.options;
                      }, 500);
                      break;
                    case "0009":
                      setTimeout(() => {
                        this.options[0].children[7].children = data;
                        this.options1 = this.options;
                      }, 500);
                      break;
                    case "0007":
                      setTimeout(() => {
                        this.options[0].children[8].children = data;
                        this.options1 = this.options;
                      }, 500);
                      break;
                    case "0012":
                      setTimeout(() => {
                        this.options[0].children[9].children = data;
                        this.options1 = this.options;
                      }, 500);
                      break;
                    case "0011":
                      setTimeout(() => {
                        this.options[0].children[10].children = data;
                        this.options1 = this.options;
                      }, 500);
                      break;
                    case "0015":
                      setTimeout(() => {
                        this.options[0].children[11].children = data;
                        this.options1 = this.options;
                      }, 500);
                      break;
                    case "0016":
                      setTimeout(() => {
                        this.options[0].children[12].children = data;
                        this.options1 = this.options;
                      }, 500);
                      break;
                    case "0018":
                      setTimeout(() => {
                        this.options[1].children[0].children = data;
                        this.options1 = this.options;
                      }, 500);
                      break;
                    case "0019":
                      setTimeout(() => {
                        this.options[2].children[0].children = data;
                        this.options1 = this.options;
                      }, 500);
                      break;
                    case "0020":
                      setTimeout(() => {
                        this.options[3].children[0].children = data;
                        this.options1 = this.options;
                      }, 500);
                      break;
                    case "0021":
                      setTimeout(() => {
                        this.options[4].children[0].children = data;
                        this.options1 = this.options;
                      }, 500);
                      break;
                    default:
                      break;
                  }
                } else {
                  Toast.fail(res.result_msg);
                }
              });
            }
            return;
          }
          switch (this.tabIndex) {
            case "0":
              let data = this.options;
              let data1 = data.filter((item) => {
                return item.text.indexOf(newName) != -1;
              });
              that.options = data1;
              break;
            case "1":
              let data4 = [];
              let data2 = this.options;
              data2.forEach((item, index, arr) => {
                if (index == this.selected) {
                  data4 = item.children.filter((item1, index1, arr1) => {
                    return item1.text.indexOf(newName) != -1;
                  });
                  item.children = data4;
                }
              });
              that.options = data2;
              break;
            case "2":
              let data5 = [];
              let data3 = this.options;
              data3.forEach((item, index, arr) => {
                item.children.forEach((item1, index1, arr1) => {
                  if (item1.value == this.selected) {
                    data5 = item1.children.filter((item2, index2, arr2) => {
                      return item2.text.indexOf(newName) != -1;
                    });
                    item1.children = data5;
                  }
                });
              });
              that.options = data3;
              break;
            default:
              break;
          }
        },
    });
  },
   //修改、查看状态下，查询数据信息
   getInfo(){
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
              fieldValue:info.NET_NAME,
             'selectWd.text':info.NET_NAME,
              recommNo: info.RECOMMANDNO, //推荐人工号
              cyrs: info.CYRS, //从业人数
              zyyw: info.ZYYW, // 主营业务
              lastYearYysr: info.LASTYEAR_YYSR, //请输入上年营业收入
              lastYearLrsp: info.LASTYAER_LRSP, // 上年利润水平
            });
          }
        });
      }
    });
  },

  //网点选择操作
  showWd() {
    if(this.data.isCreate == '2'){
      return;
    }
    this.setData({
      showShop : true
    })
  },
  onCancel: function (e) {
    this.setData({
      showShop: !this.data.showShop
    });
  },
  onChangeWd(event) {
    var that = this;
    const {
      picker,
      value,
      index
    } = event.detail;
    picker.setColumnValues(1, citys[value[0]]);
    if (index == 1) {
      that.getData(value[1].value)
    }
    if (index == 0) {
      let d = that.data.columns
      d[1].values = citys[value[0]]
      that.setData({
        columns: d
      })
      that.getData(that.data.columns[1].values[0].value)
    }
  },
  confirmWd(event) {
    var that = this;
    const {
      picker,
      value,
      index
    } = event.detail;
    that.setData({
      selectWd: value[2],
      fieldValue: value[2].text
    })
    this.setData({
      showShop: !this.data.showShop
    });
  },
  getData(value) {
    return new Promise((resolve, reject) => {
      var that = this;
      let dataJson = JSON.stringify({
        main_id: value,
        type: "13"
      })
      let custnameTwo = encr.jiami(dataJson, aeskey) //3段加密

      wx.request({
        url: app.globalData.YTURL + 'open/getOaInfo.do',
        data: encr.gwRequest(custnameTwo),
        method: 'POST',
        success(res) {
          if (res.data.head.H_STATUS != '1') {
            wx.hideLoading({
              success: (res) => {},
            })
         
            reject({
              err: 0
            });
            return;
          }
          let json = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文
          
          if (json.result_code === "0000") {
            let data = JSON.parse(json.list);
            data.forEach((item, index) => {
              item.text = item.text.substr(4)
            })
            let col = that.data.columns;
            col[2].values = data

            that.setData({
              columns: col
            })

          } else {
            reject()
            wx.showToast({
              title: json.result_msg,
              icon: 'none'
            })
          }
        }
      })
    })
  },
  //end 网点选择操作结束


  resultCascaderInfo: function(res){
    var info = res.detail;
    this.setData({
      cascaderValue: info.cascaderValue,
      keyShop: info.keyShop
    });
  },

  initValidate(){
    var that = this;
    if(that.data.selectWd.text == ''){
      Toast("请选择开户网点");
      return;
    }
    let rules = {
      recommNo:{required: true, maxlength:8,minlength:8},
      cyrs:{required: true, maxlength:10},
      zyyw:{required: true, maxlength:50},
      lastYearYysr:{required: true, maxlength:20},
      lastYearLrsp:{required: true, maxlength:20},
    };
    let messages = {
      recommNo:{required: "请输入10位长度推荐人工号",maxlength:'请输入10位长度推荐人工号',minlength:'请输入10位长度推荐人工号'},
      cyrs:{required: "请输入从业人数"},
      zyyw:{required: "请输入主营业务"},
      lastYearYysr:{required: "请输入上年营业收入"},
      lastYearLrsp:{required: "请输入上年利润水平"},
    };
    that.WxValidate = new WxValidate(rules, messages);
  },

  //提交表单
  submitForm: function(e){
    
    var that = this;
    let params = e.detail.value;
    if(that.data.fieldValue == '' || typeof that.data.fieldValue == "undefined"){
      Toast('请选择预约网点');
      return
    }
    this.initValidate(); 
    if (!that.WxValidate.checkForm(params)) {
      Toast(that.WxValidate.errorList[0].msg.replace('。', ''));
    }else{
      //控制提交次数
      wx.showLoading({
        title: '请稍后...',
        mask: true
      })
      that.setData({
        isSubmit: this.data.isSubmit+1,
      })
      let data = {
        uniqId: that.data.uniqId,
        netNo: that.data.selectWd.value, //网点号
        netName : that.data.selectWd.text, //网点名称
        recommNo: that.data.recommNo, //推荐人工号
        cyrs: that.data.cyrs, //从业人数
        zyyw: that.data.zyyw, // 主营业务
        lastYearYysr: that.data.lastYearYysr, //上年营业收入
        lastYearLrsp: that.data.lastYearLrsp, // 上年利润水平
      }
      let options = {
        url: '/ft/openAccount.do',
        data: data
      };
      if(that.data.isSubmit > 1){
        return
      }
      requestYT(options).then((res) => {
        if(res.msgCode =='0000'){
          that.setData({
            isSubmit:0
          })
          wx.hideLoading();
          wx.navigateTo({
            url: "/sub3/pages/ftAccountOpen/apply/resultPage?accountType="+that.data.accountType+"&&yybh="+res.yybh+"&&yywd="+data.netName
          })
        }else{
          that.setData({
            isSubmit:0
          })
          wx.hideLoading();
          Toast(res.msg);
        }
      });
    }
  },
  checkMoney: function(e){
    var id  = e.currentTarget.dataset.id;
    var money = e.detail;
    if(money.indexOf('.')>-1){
      if(money.split('.').length>1){
        if(money.split('.')[1].length>2){
          if(id === 'lrsp'){
            this.setData({
              lastYearLrsp: money.substring(0,money.length-1),
            })
          }else{
            this.setData({
              lastYearYysr: money.substring(0,money.length-1),
            })
          }
        }
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