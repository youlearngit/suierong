import WxValidate from "../../../assets/plugins/wx-validate/WxValidate";
const app = getApp();
var that;
import requestP from "../../../utils/requsetP";
const {
  $Toast
} = require("../../dist/base/index");
var encr = require('../../utils/encrypt.js'); //国密3段式加密
var aeskey = encr.key //随机数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qkytExtra: '',
    zjlxExtra: "",
    poi: "",
    mkData: "",
    lbxzIndex: 0,
    zjlxIndex: 0,
    qkytIndex: 0,
    yyqdIndex: 4,
    lbxzTitle: "行业类型",
    form: {
      gsbz: 1, //业务类型：0-对公；1-个人
      lbxz: "1", //境内居民1；境内非居民2
      zjlx: 1,
      qkyt: 1101,
      yyqd: 5,
      qkzh: '',
      khmc: '',
      timeIndex: 0, //预约时间段
      idCard: '', //身份证
      name: '', //姓名
      phone: '', //手机号,获取微信绑定手机号，赋值到此
      booktime: '请选择', //预约时间
    },
    sessionKey: '',
    submit: true,
    real_name: '',
    id_card: '',
    tel: '',
    types: ['自用', '其他'],
    lbxzType: [{
      'id': "A",
      'name': '农、林、牧、渔'
    }, {
      'id': "B",
      'name': '采矿业'
    }, {
      'id': "C",
      'name': '制造业'
    }, {
      'id': "D",
      'name': '电力、热力、燃气及水生产和供应业'
    }, {
      'id': "E",
      'name': '建筑业'
    }, {
      'id': "F",
      'name': '批发和零售业'
    }, {
      'id': "G",
      'name': '交通运输、仓储和邮政业'
    }, {
      'id': "H",
      'name': '住宿和餐饮业'
    }, {
      'id': "I",
      'name': '信息传输、软件和信息技术服务业'
    }, {
      'id': "J",
      'name': '金融业'
    }, {
      'id': "K",
      'name': '房地产业'
    }, {
      'id': "L",
      'name': '租赁和商业服务业'
    }, {
      'id': "M",
      'name': '科学研究和技术服务业'
    }, {
      'id': "N",
      'name': '水利、环境和公共设施管理业'
    }, {
      'id': "O",
      'name': '居民服务、修理和其他服务业'
    }, {
      'id': "P",
      'name': '教育'
    }, {
      'id': "Q",
      'name': '卫生和社会工作'
    }, {
      'id': "R",
      'name': '文化、体育和娱乐业'
    }, {
      'id': "S",
      'name': '采矿公共管理、社会保障和社会组织业'
    }, {
      'id': "T",
      'name': '国际组织'
    }],
    lbxzType1: [{
      'id': 1,
      'name': '境内居民'
    }, {
      'id': 2,
      'name': '境内非居民'
    }],
    lbxzType2: [{
      'id': "A",
      'name': '农、林、牧、渔'
    }, {
      'id': "B",
      'name': '采矿业'
    }, {
      'id': "C",
      'name': '制造业'
    }, {
      'id': "D",
      'name': '电力、热力、燃气及水生产和供应业'
    }, {
      'id': "E",
      'name': '建筑业'
    }, {
      'id': "F",
      'name': '批发和零售业'
    }, {
      'id': "G",
      'name': '交通运输、仓储和邮政业'
    }, {
      'id': "H",
      'name': '住宿和餐饮业'
    }, {
      'id': "I",
      'name': '信息传输、软件和信息技术服务业'
    }, {
      'id': "J",
      'name': '金融业'
    }, {
      'id': "K",
      'name': '房地产业'
    }, {
      'id': "L",
      'name': '租赁和商业服务业'
    }, {
      'id': "M",
      'name': '科学研究和技术服务业'
    }, {
      'id': "N",
      'name': '水利、环境和公共设施管理业'
    }, {
      'id': "O",
      'name': '居民服务、修理和其他服务业'
    }, {
      'id': "P",
      'name': '教育'
    }, {
      'id': "Q",
      'name': '卫生和社会工作'
    }, {
      'id': "R",
      'name': '文化、体育和娱乐业'
    }, {
      'id': "S",
      'name': '采矿公共管理、社会保障和社会组织业'
    }, {
      'id': "T",
      'name': '国际组织'
    }],
    zjlxType: [{
      'id': 1,
      'name': '统一社会信用代码证'
    }, {
      'id': 2,
      'name': '组织机构代码证'
    }, {
      'id': 3,
      'name': '营业执照'
    }, {
      'id': 4,
      'name': '税务登记证'
    }, {
      'id': 99,
      'name': '其他证件'
    }],
    zjlxType1: [{
      'id': 1,
      'name': '统一社会信用代码证'
    }, {
      'id': 2,
      'name': '组织机构代码证'
    }, {
      'id': 3,
      'name': '营业执照'
    }, {
      'id': 4,
      'name': '税务登记证'
    }, {
      'id': 99,
      'name': '其他证件'
    }],
    zjlxType2: [{
      'id': 1,
      'name': '中国居民身份证'
    }, {
      'id': 2,
      'name': '军警证'
    }, {
      'id': 3,
      'name': '港澳台居民来往内地通行证'
    }, {
      'id': 4,
      'name': '护照'
    }, {
      'id': 5,
      'name': '外国人永久居留证'
    }, {
      'id': 6,
      'name': '港澳台居民居住证'
    }, {
      'id': 99,
      'name': '其他证件'
    }],
    gsbzType: ['对公取款', '对私取款'],
    qkytTypes: [{
      'id': 1101,
      'name': '职工工资、津贴'
    }, {
      'id': 1102,
      'name': '个人劳务报酬'
    }, {
      'id': 1103,
      'name': '根据国家规定颁发给个人的科学技术、文化艺术、体育等各种奖金'
    }, {
      'id': 1104,
      'name': '各种劳保、福利费用以及国家规定的对个人的其他支出'
    }, {
      'id': 1105,
      'name': '向个人收购农副产品和其他物资的价款'
    }, {
      'id': 1106,
      'name': '出差人员必须随身携带的差旅费'
    }, {
      'id': 1109,
      'name': '其他'
    }],
    qkytTypes1: [{
      'id': 1101,
      'name': '职工工资、津贴'
    }, {
      'id': 1102,
      'name': '个人劳务报酬'
    }, {
      'id': 1103,
      'name': '根据国家规定颁发给个人的科学技术、文化艺术、体育等各种奖金'
    }, {
      'id': 1104,
      'name': '各种劳保、福利费用以及国家规定的对个人的其他支出'
    }, {
      'id': 1105,
      'name': '向个人收购农副产品和其他物资的价款'
    }, {
      'id': 1106,
      'name': '出差人员必须随身携带的差旅费'
    }, {
      'id': 1109,
      'name': '其他'
    }],
    qkytTypes2: [{
      'id': 1201,
      'name': '食品烟酒'
    }, {
      'id': 1202,
      'name': '衣着'
    }, {
      'id': 1203,
      'name': '居住'
    }, {
      'id': 1204,
      'name': '生活用品及服务'
    }, {
      'id': 1205,
      'name': '交通和通信'
    }, {
      'id': 1206,
      'name': '教育、文化和娱乐'
    }, {
      'id': 1207,
      'name': '医疗保健'
    }, {
      'id': 1208,
      'name': '个人收藏品交易'
    }, {
      'id': 1209,
      'name': '经营性支出'
    }, {
      'id': 1210,
      'name': '境外消费'
    }, {
      'id': 1211,
      'name': '境外投资'
    }, {
      'id': 1212,
      'name': '境外贸易'
    }, {
      'id': 1299,
      'name': '其他用品和服务'
    }],
    yyqdTypes: [{
        'id': 1,
        'name': '电话'
      },
      {
        'id': 2,
        'name': '柜台'
      },
      {
        'id': 3,
        'name': '本行网站'
      },

      {
        'id': 4,
        'name': '本行移动端应用'
      },
      {
        'id': 5,
        'name': '微信'
      },
      {
        'id': 6,
        'name': '其他'
      }
    ],
    //日期
    timeList: [],
    //可预约天数
    yyDay: 3,
    //预约时间段
    hourList: [{
        hour: "9:30",
        n: 9,
        isShow: true
      },
      {
        hour: "10:30",
        n: 10,
        isShow: true
      },
      {
        hour: "12:30",
        n: 11,
        isShow: false
      },
      {
        hour: "13:30",
        n: 13,
        isShow: false
      },
      {
        hour: "14:30",
        n: 14,
        isShow: true
      },
      {
        hour: "15:30",
        n: 15,
        isShow: true
      },
      {
        hour: "16:30",
        n: 16,
        isShow: true
      },
      {
        hour: "17:30",
        n: 17,
        isShow: true
      },
    ],
    //是否显示
    timeShow: false,
    currentTab: 0,
    //选择时间
    chooseHour: "",
    //选择日期
    chooseTime: "",
    hourIndex: -1,
  },
  //大额取款
  getMax() {
    return new Promise((resolve, reject) => {
      //大额贷款
      let dataJson = JSON.stringify({
        openId: wx.getStorageSync('openid'),
      });
      //console.log(dataJson)
      var custnameTwo = encr.jiami(dataJson, aeskey) //3段加密
      wx.request({
        url: app.globalData.YTURL + 'jsyh/getCustomer.do',
        data: encr.gwRequest(custnameTwo),
        method: 'POST',
        header: {
          'content-type': 'application/json', // 默认值
        },
        success(res) {

          if (res.data.head.H_STATUS == 1) {
            var jsonData = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文
            //console.log('解密getCustomer返回的报文==')
            //console.log(jsonData)
            resolve(jsonData)
          }
        },
        fail(err) {
          reject()
        }
      })
    })
  },
  getSessionKey() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          wx.request({
            url: app.globalData.URL + "getwechatid",
            data: {
              js_code: res.code,
              isProxy: false,
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded", // 默认值
              key: Date.parse(new Date())
                .toString()
                .substring(0, 6),
            },
            success: (res) => {

              if (res.data != undefined) {
                wx.setStorageSync("openid", res.data.openid);
                wx.setStorageSync("key", res.data.key);
                wx.setStorageSync("sessionid", res.data.session_key);
              }
              resolve();
            },
          });
        },
        fail: (err) => {
          reject(err);
        },
      });
    });
  },
  getTel(a, b) {
    requestP({
        url: "https://wxapp.jsbchina.cn:7080/jsb/decryptdata",
        data: {
          encryptDataB64: a,
          sessionKeyB64: wx.getStorageSync("sessionid").substring(4),
          ivB64: b,
        },
        header: {
          "Content-Type": "application/json", // 默认值
          key: Date.parse(new Date()).toString().substring(0, 6),
        },
      })
      .then((res) => {
        wx.hideLoading({
          success: (res) => {},
        })
        //console.log("解密手机号信息成功", res);
        //console.log("查询手机号")
        //console.log(res)
        //console.log(res.phoneNumber)
        that.setData({
          tel: res.phoneNumber
        })

      })
      .catch((err) => {
        wx.hideLoading({
          success: (res) => {},
        })
        console.error("解密手机号信息失败:", err);
      });
  },
  //获取手机号
  getPhoneNumber(e) {
    wx.showLoading({
      title: '获取中...',
    })
    that.getSessionKey().then(() => {
      that.getTel(e.detail.encryptedData, e.detail.iv);
    });



  },
  bindDateChange: function (e) {

    var date = new Date(Date.parse(e.detail.value.replace(/-/g, "/"))).getDay();
    if (date == 6 || date == 0) {
      $Toast({
        content: "本渠道暂不支持周末和节假日预约服务,建议您拨打网点电话办理预约。",
        type: "warning",
      });
      return;
    }
    var s = e.detail.value.replace(/-/g, "");

    that.setData({
      'form.booktime': s
    })
  },
  getDateStr(dayCount) {
    if (null == dayCount) {
      dayCount = 0;
    }
    var format = 'yyyy-MM-dd';
    var dd = new Date();
    dd.setDate(dd.getDate() + dayCount); //设置日期
    format = format.replace(/yyyy|YYYY/, dd.getFullYear());
    format = format.replace(/MM/, (dd.getMonth() + 1) > 9 ? (dd.getMonth() + 1).toString() : '0' + (dd.getMonth() + 1));
    format = format.replace(/dd|DD/, dd.getDate() > 9 ? dd.getDate().toString() : '0' + dd.getDate());
    return format;
  },
  getDateStr1(dayCount) {
    if (null == dayCount) {
      dayCount = 0;
    }
    var format = 'yyyyMMdd';
    var dd = new Date();
    dd.setDate(dd.getDate() + dayCount); //设置日期
    format = format.replace(/yyyy|YYYY/, dd.getFullYear());
    format = format.replace(/MM/, (dd.getMonth() + 1) > 9 ? (dd.getMonth() + 1).toString() : '0' + (dd.getMonth() + 1));
    format = format.replace(/dd|DD/, dd.getDate() > 9 ? dd.getDate().toString() : '0' + dd.getDate());
    return format;
  },

  getHoilday() {
    return new Promise((resolve, reject) => {
      let dataJson = JSON.stringify({});
      var custnameTwo = encr.jiami(dataJson, aeskey) //3段加密
      wx.request({
        url: app.globalData.YTURL + 'jsyh/judgeDate.do',
        data: encr.gwRequest(custnameTwo),
        method: 'POST',
        header: {
          'content-type': 'application/json', // 默认值
        },
        success(res) {
          var toDo = true;

          if (res.data.head.H_STATUS == 1 && res.data.body != null) {
            var jsonData = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文
            let a = jsonData.LIST;
            let curdate = that.getDateStr1(0);
            a.forEach((item, index) => {
              if (item.FESTIVAL_DATE == curdate) {
                toDo = false
              }
            })
            //console.log('judgeDate==')
            //console.log(jsonData)
          }
          var currentTime = new Date().getDay()
         if((currentTime==6||currentTime==0)){
            toDo = false
         }
          resolve(toDo);

        },
        fail(err) {
          reject();
        }
      })
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;

    if (options.org_short_name == '111') {
      wx.showModal({
        title: '提示',
        content: '本网点暂不提供现金服务',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            wx.navigateBack({
              delta: 1,
            })
          } else if (res.cancel) {
            wx.navigateBack({
              delta: 1,
            })
          }
        }
      })

    }
    if (options.bankname.indexOf('杭州') != -1 || options.bankname.indexOf('深圳') != -1) {

    } else {
      wx.showModal({
        title: '提示',
        content: '敬请期待',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            wx.navigateBack({
              delta: 1,
            })
          } else if (res.cancel) {
            wx.navigateBack({
              delta: 1,
            })
          }
        }
      })
    }

    this.getHoilday().then((res) => {
      if (!res) {
        wx.showModal({
          title: '提示',
          content: '本渠道暂不支持周末和节假日预约服务，建议您拨打网点电话办理预约。',
          success(res) {
            if (res.confirm) {
              wx.navigateBack({
                delta: 1,
              })
            } else if (res.cancel) {
              wx.navigateBack({
                delta: 1,
              })
            }
          }
        })
        return;
      }
    })
    var myDate = new Date();

    var currentTime = myDate.getHours() + "" + (parseInt(myDate.getMinutes()) > 11 ? (myDate.getMinutes()) : ('0' + myDate.getMinutes()))

    var curDate = currentTime < 1500 ? that.getDateStr(1) : that.getDateStr(2)
    var date1 = new Date(Date.parse(curDate.replace(/-/g, "/"))).getDay();

    var endTime = currentTime < 1500 ? that.getDateStr(3) : that.getDateStr(4)
    var date = new Date(Date.parse(endTime.replace(/-/g, "/"))).getDay();
    if (date1 == 6) {
      curDate = currentTime < 1500 ? that.getDateStr(3) : that.getDateStr(4)
      endTime = currentTime < 1500 ? that.getDateStr(5) : that.getDateStr(6)
    } else if (date1 == 0) {
       if(new Date(Date.parse(that.getDateStr(0).replace(/-/g, "/"))).getDay()==5){
        curDate = currentTime < 1500 ? that.getDateStr(3) : that.getDateStr(4)
        endTime = currentTime < 1500 ? that.getDateStr(5) : that.getDateStr(6) 
       }else{
        curDate = currentTime < 1500 ? that.getDateStr(2) : that.getDateStr(3)
        endTime = currentTime < 1500 ? that.getDateStr(4) : that.getDateStr(5)
       }
      
    }

    if (date == 6) {
      endTime = currentTime < 1500 ? that.getDateStr(5) : that.getDateStr(6)
    } else if (date == 0) {

      endTime = currentTime < 1500 ? that.getDateStr(5) : that.getDateStr(6)

    }


    //对私
    that.setData({
      lbxzTitle: "居民性质",
      lbxzType: that.data.lbxzType1,
      zjlxType: that.data.zjlxType2,
      qkytTypes: that.data.qkytTypes2,
      curDate: curDate,
      endDate: endTime,
      'form.lbxz': 1,
      'form.qkyt': 1201
    })
    this.getMax().then((res) => {

      if (res.ID_CARD == "") {
        wx.showModal({
          title: '提示',
          content: '请先实名认证',
          success(res) {
            if (res.confirm) {
              wx.redirectTo({
                url: '/sub1/pages/auth/index',
              })

            } else if (res.cancel) {
              wx.navigateBack({
                delta: 1,
              })
            }
          }
        })

        return;
      } else {
        this.setData({
          zjhm: res.ID_CARD,
          ['form.khmc']: res.REAL_NAME
        })
      }
    })
    Date.prototype.format = function (formatStr) {
      var str = formatStr;
      var Week = ['日', '一', '二', '三', '四', '五', '六'];
      str = str.replace(/yyyy|YYYY/, this.getFullYear());
      str = str.replace(/MM/, (this.getMonth() + 1) > 9 ? (this.getMonth() + 1).toString() : '0' + (this.getMonth() + 1));
      str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
      return str;
    }

    this.setData({
    //   preffixUrl: "https://wxapp.jsbchina.cn:7080/jsb/"
      preffixUrl: app.globalData.JSB,
      currentDate: new Date().format("yyyy-MM-dd")
    })
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    //console.log(options);
    that.setData({
      mkData: JSON.parse(options.data),
      mkDatas: options.data,
      'poi.latitude': options.latitude,
      'poi.org_code': options.org_code,
      'poi.longitude': options.longitude,
      'poi.bankname': options.bankname,
      'poi.bankaddress': options.bankaddress,
    })
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: that.data.preffixUrl + "getwechatid",
          data: {
            js_code: res.code,
            isProxy: false
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded", // 默认值
            "key": (Date.parse(new Date())).toString().substring(0, 6)
          },
          success: res => {
            if (res.data != undefined) {
              this.setData({
                sessionKey: res.data.session_key
              })
            }
          }
        })
      }
    })
    this.initValidate();
    // 获取用户信息
    wx.request({
      url: that.data.preffixUrl + "getmessagebyopenid",
      data: {
        open_id: wx.getStorageSync('openid'),
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded", // 默认值
        "key": (Date.parse(new Date())).toString().substring(0, 6),
        "sessionId": wx.getStorageSync('sessionid'),
        "transNo": "XC006"
      },
      success: function (res) {
        wx.hideLoading();
        //console.log(res)
        if (res.data.data[0] != '' && res.data.data[0] != null && res.data.data[0] != undefined) {
          that.setData({
            real_name: res.data.data[0].REAL_NAME,
            tel: res.data.data[0].TEL,
            id_card: res.data.data[0].ID_CARD,
          })
        }
      }
    })
  },
  test(e) {


  },
  submitForm(e) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    const params = e.detail.value;
    //console.log(that.data.poi.bankname)
    // 传入表单数据，调用验证方法
    if (that.data.tel == '' || that.data.tel == null || that.data.tel == undefined) {
      wx.hideLoading({
        success: (res) => {},
      })
      wx.showToast({
        title: '请获取手机号码',
        icon: "none",
        mask: true,
        duration: 2000
      });
      return false;
    }
    if (that.data.form.qkyt == 1299) {
      if (params.qkytExtra == "") {
        wx.hideLoading({
          success: (res) => {},
        })
        wx.showToast({
          title: '请输入补充取款用途',
          icon: "none",
          mask: true,
          duration: 2000
        });
        return;
      }
    }
    if (that.data.form.zjlx == 99) {
      if (params.zjlxExtra == "") {
        wx.hideLoading({
          success: (res) => {},
        })
        wx.showToast({
          title: '请输入补充证件类型',
          icon: "none",
          mask: true,
          duration: 2000
        });
        return;
      }
    }

    if (that.data.form.booktime == '请选择') {
      wx.hideLoading({
        success: (res) => {},
      })
      wx.showToast({
        title: '请选择预约时间',
        icon: "none",
        mask: true,
        duration: 2000
      });
      return false;
    }


    if (!that.WxValidate.checkForm(params)) {
      const error = that.WxValidate.errorList[0]
      that.showModal(error)
      return false
    }
    var reg = /^[1-9]\d*$|^0$/;
    if (!reg.test(params.yyje) || !reg.test(params.qkzh)) {
      wx.hideLoading({
        success: (res) => {},
      })
      $Toast({
        content: "取款信息格式不正确，请输入数字信息",
        type: "warning",
      });
      return;
    }
    let a = params.yyje;
    if (parseInt(a) < 200000 || parseInt(a) > 1000000 || parseInt(a) == 1000000) {
      wx.hideLoading({
        success: (res) => {},
      })
      $Toast({
        content: "大额取现预约金额：人民币20万（含）-100万元之间，100万元（含）以上建议您拨打网点电话办理预约",
        type: "warning",
      });
      return;
    }

    if (that.data.submit) {
      that.setData({
        submit: false
      })
      var qkytTex = '';
      var zjlxTex = '';
      if (that.data.form.qkyt == 1299) {
        qkytTex = that.data.form.qkyt + '-' + params.qkytExtra

      } else {
        qkytTex = that.data.form.qkyt + '-' + that.data.qkytTypes[that.data.qkytIndex].name

      }
      if (that.data.form.zjlx == 99) {
        zjlxTex = that.data.form.zjlx + '-' + params.zjlxExtra;


      } else {
        zjlxTex = that.data.form.zjlx + '-' + that.data.zjlxType[that.data.zjlxIndex].name

      }


      let dataJson = JSON.stringify({
        gsbz: params.gsbz,
        khmc: params.khmc,
        lbxz: that.data.form.lbxz,
        zjlx: zjlxTex,
        zjhm: params.zjhm,
        qkzh: params.qkzh,
        yyje: params.yyje,
        qkyt: qkytTex,
        qkrq: that.data.form.booktime,
        lxfs: that.data.tel,
        yyqd: that.data.form.yyqd,
        spjg: '',
        yywd: that.data.poi.org_code,
        remark1: that.data.poi.bankname,
        remark2: 0,
        remark3: ''

      });
      //console.log(dataJson)

      var custnameTwo = encr.jiami(dataJson, aeskey) //3段加密
      wx.request({
        url: app.globalData.YTURL + 'jsyh/saveMaxmoney.do',
        data: encr.gwRequest(custnameTwo),
        method: 'POST',
        header: {
          'content-type': 'application/json', // 默认值
        },
        success(res) {
          var jsonData = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文
          //console.log('解密saveMaxmoney返回的报文==')
          //console.log(jsonData)
          if (res.data.head.H_STATUS === "1") {
            if (jsonData.STATUS == '1') {
              wx.navigateTo({
                url: './result?yyh=' + jsonData.yyh + '&status=1' + '&time=' + that.data.form.booktime,
              })
            } else {
              wx.navigateTo({
                url: './result?yyh=0&status=0' + '&time=' + that.data.form.booktime,
              })
            }
          }
        }
      })
    } else {
      wx.showToast({
        title: '您已提交过了',
        icon: 'none',
        duration: 2000
      })
    }
    wx.hideLoading({
      success: (res) => {},
    })
  },
  showModal(error) {
    wx.showToast({
      title: error.msg,
      icon: 'none',
      mask: true,
      duration: 2000
    })
  },
  initValidate() {

    // 验证字段的规则
    const rules = {
      khmc: {
        required: true,
        khmc: true
      },
      zjhm: {
        required: true,
        zjhm: true
      },
      qkzh: {
        required: true,
        qkzh: true
      },
      yyje: {
        required: true,
        yyje: true
      },
      qkrq: {
        required: true,
        qkrq: true
      },
    }
    // 验证字段的提示信息，若不传则调用默认的信息
    const messages = {
      khmc: {
        required: '请填写取款人姓名',
      },
      zjhm: {
        required: "请输入证件号码",
      },
      qkzh: {
        required: '请输入取款账号',
      },
      yyje: {
        required: '请输入预约金额',
      },
      qkrq: {
        required: '请输入取款日期',
      },
    }
    // 创建实例对象
    this.WxValidate = new WxValidate(rules, messages)
  },
  //居民性质
  lbxzTypeChange(e) {
    const value = parseInt(e.detail.value)

    this.setData({
      'form.lbxz': that.data.lbxzType[value].id,
      lbxzIndex: value,
    })
  },
  //取款类型
  gsbzTypeChange(e) {
    const value = e.detail.value
    this.setData({
      'form.gsbz': value,
    })
    if (value == 0) {
      that.setData({
        lbxzTitle: "行业类别",
        lbxzType: that.data.lbxzType2,
        zjlxType: that.data.zjlxType1,
        qkytTypes: that.data.qkytTypes1,
        'form.lbxz': A,
        'form.qkyt': 1101
      })

    } else {
      that.setData({
        lbxzTitle: "居民性质",
        lbxzType: that.data.lbxzType1,
        zjlxType: that.data.zjlxType2,
        qkytTypes: that.data.qkytTypes2,
        'form.lbxz': 1,
        'form.qkyt': 1201
      })
    }
  },
  //证件类型
  zjlxTypeChange(e) {
    const value = parseInt(e.detail.value)

    this.setData({
      'form.zjlx': that.data.zjlxType[value].id,
      zjlxIndex: value,
    })
    if (that.data.zjlxType[value].id == 99) {

    }
    if (that.data.form.gsbz == 1) {
      that.setData({
        zjlxType: that.data.zjlxType2
      })

    } else {
      that.setData({
        zjlxType: that.data.zjlxType1
      })
    }
  },
  //证件类型
  qkytTypeChanges(e) {
    const value = parseInt(e.detail.value)

    this.setData({
      'form.qkyt': that.data.qkytTypes[value].id,
      qkytIndex: value,
    })


  },
  //预约渠道
  yyqdTypeChanges(e) {
    const value = parseInt(e.detail.value)

    that.setData({
      'form.yyqd': that.data.yyqdTypes[value].id,
      yyqdIndex: value,
    })


  },
  //期限选择
  typeChanges(e) {
    const value = e.detail.value
    this.setData({
      'form.typeIndexs': value,
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
  onShow: function () {

    Date.prototype.Format = function (format) {
      var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
      }
      if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      }
      for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
          format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
      }
      return format;
    }
    Date.prototype.DateAdd = function (interval, number) {
      number = parseInt(number);
      var date = new Date(this.getTime());
      switch (interval) {
        case "y":
          date.setFullYear(this.getFullYear() + number);
          break;
        case "m":
          date.setMonth(this.getMonth() + number);
          break;
        case "d":
          date.setDate(this.getDate() + number);
          break;
        case "w":
          date.setDate(this.getDate() + 7 * number);
          break;
        case "h":
          date.setHours(this.getHours() + number);
          break;
        case "n":
          date.setMinutes(this.getMinutes() + number);
          break;
        case "s":
          date.setSeconds(this.getSeconds() + number);
          break;
        case "l":
          date.setMilliseconds(this.getMilliseconds() + number);
          break;
      }
      return date;
    }


    var dateList = [];
    var now = new Date();
    for (var i = 0; i < this.data.yyDay; i++) {
      var d = {};
      var day = new Date().DateAdd('d', i).getDay();
      if (day == 1) {
        var w = "周一"
      }
      if (day == 2) {
        var w = "周二"
      }
      if (day == 3) {
        var w = "周三"
      }
      if (day == 4) {
        var w = "周四"
      }
      if (day == 5) {
        var w = "周五"
      }
      if (day == 6) {
        var w = "周六"
      }
      if (day == 0) {
        var w = "周日"
      }
      d.name = w;
      d.date = new Date().DateAdd('d', i).Format("MM-dd");
      dateList.push(d)
    }
    this.setData({
      timeList: dateList
    });
    //初始化判断
    //当前时间
    var hour = new Date().getHours();

    for (var i = 0; i < this.data.hourList.length; i++) {
      var list = this.data.hourList;
      //过时不可选
      if (this.data.hourList[i].n <= hour) {
        list[i].isShow = false;
        this.setData({
          hourList: list
        })
      }
    }
  },



  //弹出按钮
  showTimeModel: function () {
    this.setData({
      timeShow: !this.data.timeShow,
      chooseTime: this.data.timeList[0].date,
    });
  },
  //点击外部取消
  modelCancel: function () {
    this.setData({
      timeShow: !this.data.timeShow,
      chooseTime: this.data.timeList[0].date,
    });
  },
  //日期选择
  timeClick: function (e) {
    //非今天-不判断超过当前时间点(所有时间点都可选择)
    if (e.currentTarget.dataset.index != 0) {
      var list = this.data.hourList;
      for (var i = 0; i < list.length; i++) {
        list[i].isShow = true;
      }
      this.setData({
        hourList: list
      })
    } else {
      //今天-过时不可预约
      var hour = new Date().getHours();
      for (var i = 0; i < this.data.hourList.length; i++) {
        var list = this.data.hourList;
        if (this.data.hourList[i].n <= hour) {
          list[i].isShow = false;
          this.setData({
            hourList: list
          })
        }
      }
    }
    this.setData({
      currentTab: e.currentTarget.dataset.index,
      chooseTime: this.data.timeList[e.currentTarget.dataset.index].date,
      'form.booktime': '',
      chooseHour: "",
      hourIndex: -1
    });
    //console.log(this.data.chooseTime)
  },
  // 时间选择
  hourClick: function (e) {
    // 时间不可选择
    if (!e.currentTarget.dataset.isshow) {
      return false;
    }
    this.setData({
      hourIndex: e.currentTarget.dataset.index,
      chooseHour: this.data.hourList[e.currentTarget.dataset.index].hour,

    });
    var chooseTime = new Date().getFullYear() + "-" + this.data.chooseTime + " " + this.data.chooseHour
    this.setData({
      'form.booktime': chooseTime
    })
    //console.log(chooseTime)
  },

})