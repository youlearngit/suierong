import WxValidate from '../../assets/plugins/wx-validate/WxValidate'
var citys = require('../public/city_zj.js');
var util = require('../../utils/util.js');
import user from "../../utils/user"
import api from "../../utils/api"

import Org from '../../api/Org'

const App = getApp();
const date = new Date();
// 91320104682547854D
//南京善登企业管理咨询有限公司
//杨巧云
//340221199408195502
//江苏省南京市鼓楼区测试

//432326196802185158
// 无锡市凯悦木制品制造有限公司
// 李雨保
// 91320211MA1MAD1Q8A

//91330105MA2808BR0P
//杭州欣帅物流有限公司
//薛峰
//320222197405286138
//13706175001
//15150512630
var list = [];
Page({
  data: {
    day: date.getDate(), //天
    month: date.getMonth() + 1, //月份
    imageData: '',
    photo: 'http://66.1.41.199:9080/rhedt/static/wechat/img/no_avator.png', //推荐人头像
    openid: '', //推荐人open_id
    falg1: '',
    busiCardList: [],
    cardlist: [], //企业名片列表
    cardname: [], //企业名片名称列表，用于展示
    phone1: '',
    idcard: '', //身份证号码
    managerTel: '',
    managerID: '',
    nick_name: '',
    real_name: '',
    tel: '',
    form: {
      orgID: '', //企业统一信用代码
      orgName: '',
      province: '', //省
      city: '', //市
      name: '', //法人姓名
      tel: '', //法人手机
      idCard: '', //法人身份证
      address: '', //法人联系地址
      timeIndex: '0', //申请期限
      slider: '200', //贷款额度
      // loadCardNo: '', //中征码
      provinceCode: '', //省码
      cityCode: '', //市码
      typeIndex: '0', //申请类型
    },
    phone: '',
    times: ['36个月', '24个月', '12个月', '6个月'],
    types: ['个人贷', '企业贷'],
    edu: "000",
    flag: true,
    flag_0: true,
    flag_1: true,
    flag_2: true,
    flag_3: true,
    flag_4: true,
    flag_5: true,
    flag_6: true,
    flag_7: true,
    flag_8: true,
    flag_9: true,
    flag_org_diy: true,
    flag_org_ocr: false,
    flag_self_diy: true,
    flag_self_ocr: false,
    disabled: '',
    code: '', //验证码
    iscode: null, //用于存放验证码接口里获取到的code
    codename: '获取验证码',
    region: ['江苏省', '南京市'], //暂时无用

    provinceName: "", //省
    provinceNameID: "", //省ID
    cityName: "", //市
    cityNameID: "", //市ID
    multiIndex: ["", ""],
    multiArray: [],
    objectMultiArray: [],
    org_cities: {},

    ocrSelfsrc: "",
    component: App.components[2],
    camera_flag: true,
    takephoto: {
      noticeTxt: "", //渲染提示文字
      coverImg: "", //渲染遮罩层图片
      id: "", //
      tempImage: "" //存放拍照数据
    },
    pagescroll: ".page",
    src: "",
    showModalStatus: "false",
    day_time: date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日",
    preffixUrl: '',
    v: "0", //调用camera组件
    submit: true, //重复提交
    isArea: true,
    formId: '',
    managerTel: '', //推荐人手机号
    managerID: '', //客户经理工号
    trbsName: '', //客户经理姓名
  },
  onLoad(options) {
   
    var that = this
    user.getIdentityInfo().then(res=>{
        that.setData({
            'form.idCard': res.ID_NUMBER,
            'form.name': res.NAME,
            'form.address':res.ADDRESS
          })
    })
   

    //console.log(options.apply)
    // var that = this;
    //tax页返回的
    if (options.apply != undefined && options.apply != null && options.uid !== undefined && options.uid !== null) {
      that.submitApply(options.apply, options.uid, options.formId);
    }
    that.setData({
      preffixUrl: App.globalData.URL,
      objectMultiArray: citys.citys,
      multiArray: citys.multiArray,
      org_cities: citys.org_cities,
      navTop: App.globalData.statusBarTop,
      navHeight: App.globalData.statusBarHeight
    })

    that.initValidate();
    wx.request({
      url: App.globalData.URL + 'getuseCard',
      data: {
        userId: wx.getStorageSync('openid')
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "key": (Date.parse(new Date())).toString().substring(0, 6),
        "sessionId": wx.getStorageSync("sessionid"),
        "transNo": "XC008"
      },
      method: 'POST',
      success(res) {
		  if(res.data!=undefined){
        if (res.data.stringData != undefined) {
          var cardlist = res.data.stringData;
          var cardlist1 = JSON.parse(util.dect(cardlist));
          var taggs = '';
          //console.log(cardlist1)
          //console.log(cardlist1.length)
          var listname = []
          if (cardlist1 != null && cardlist1 != undefined) {
            for (var i = 0; i < cardlist1.length; i++) {
              listname.push(
                cardlist1[i].ORG_NAME,
              )
            }
          }
          if (cardlist1.length <= 0) {} else {
            that.setData({
              cardlist: cardlist1,
              cardname: listname,
              busiCardList: listname,
              falg1: 'true'
            });
            //console.log(that.data.falg1)
          }
        }
		  }

      }
    })
  },
  onShow: function() {

    //先通过open_id查他的身份证号码 然后通过身份证号码查工号和手机号码

    if (App.globalData.share_person != undefined && App.globalData.share_person != null && App.globalData.share_person != '') {
        user.getCustomerInfo(App.globalData.share_person).then(res=>{
            if (res.ID_CARD != undefined) {
                this.setData({
                  idcard: res.ID_CARD,
                  real_name: res.REAL_NAME,
                  managerTel: res.TEL, //
                  photo: res.TEL,
                  nick_name: res.NICK_NAME,
                  managerTel: res.TEL?res.TEL:'',
                  managerID: res.USERID?res.USERID:"",
                  trbsName: res.REAL_NAME?res.REAL_NAME:'',
                })
              }
         })
            }

    if (wx.getStorageSync('openid') == null || wx.getStorageSync('openid') == '') {
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          util.openid(res.code, App.globalData.URL);
        }
      })
    } else {
      //判断数据库了里是否存在密钥
      wx.request({
        url: App.globalData.URL + 'existkey',
        data: {
          sessionId: wx.getStorageSync('sessionid')
        },
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "key": (Date.parse(new Date())).toString().substring(0, 6)
        },
        success(res) {
          if (res.data == undefined || res.data != true) {
            wx.login({
              success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                util.openid(res.code, App.globalData.URL);
              }
            })
          }
        },
        fail() {
          wx.showToast({
            title: '网络异常',
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
  },

  showModal(error) {
    wx.showToast({
      title: error.msg,
      icon: 'none',
      duration: 2000
    })
  },
  //切换企业执照手动录入
  change_org() {
    this.setData({
      flag_org_diy: false,
      flag_org_ocr: true,
    })
  },
  //切换企业执照OCR
  change_org_ocr() {
    this.setData({
      flag_org_diy: true,
      flag_org_ocr: false,
    })
  },
  //切换法人手动录入
  change_self() {
    this.setData({
      flag_self_diy: false,
      flag_self_ocr: true,
    })
  },
  //切换法人OCR
  change_self_ocr() {
    this.setData({
      flag_self_diy: true,
      flag_self_ocr: false,
    })
  },
  // 遮罩层显示
  show: function() {
    var that = this;
    var apliType = that.data.form.typeIndex; //申请类型
    that.setData({
      showModalStatus: true
    })
    if (apliType == 0) {
      wx.showActionSheet({
        itemList: ['《个人征信查询授权书》', '《个人综合信息查询授权委托书》', '《企业征信查询授权书》', '《企业综合信息查询授权委托书》'],
        itemColor: "#0066b3",
        success(res) {
          that.setData({
            pagescroll: ".page .noscroll"
          });
          if (res.tapIndex == 0) {
            that.setData({
              flag: false,
              flag_1: false,
              flag_2: true,
              flag_3: true,
              flag_4: true,
              flag_5: true,
              flag_6: true,
              flag_7: true,
              flag_8: true,
              flag_9: true,
            })

          } else if (res.tapIndex == 1) {
            that.setData({
              flag: false,
              flag_1: true,
              flag_2: false,
              flag_3: true,
              flag_4: true,
              flag_5: true,
              flag_6: true,
              flag_7: true,
              flag_8: true,
              flag_9: true,
            })

          } else if (res.tapIndex == 2) {
            that.setData({
              flag: false,
              flag_1: true,
              flag_2: true,
              flag_3: false,
              flag_4: true,
              flag_5: true,
              flag_6: true,
              flag_7: true,
              flag_8: true,
              flag_9: true,
            })

          } else if (res.tapIndex == 3) {
            that.setData({
              flag: false,
              flag_1: true,
              flag_2: true,
              flag_3: true,
              flag_4: false,
              flag_5: true,
              flag_6: true,
              flag_7: true,
              flag_8: true,
              flag_9: true,
            })
          }
        },
        fail(res) {
          ////console.log(res.errMsg)
          that.setData({
            pagescroll: ".page"
          })
        }
      })

    } else if (apliType == 1) {
      wx.showActionSheet({
        itemList: ['《“税e融”贷款业务申请书》', '《个人征信查询授权书》', '《个人综合信息查询授权委托书》', '《企业征信查询授权书》', '《企业综合信息查询授权委托书》'],
        itemColor: "#0066b3",
        success(res) {
          that.setData({
            pagescroll: ".page .noscroll"
          });
          if (res.tapIndex == 0) {
            that.setData({
              flag: false,
              flag_1: true,
              flag_2: true,
              flag_3: true,
              flag_4: true,
              flag_5: false,
              flag_6: true,
              flag_7: true,
              flag_8: true,
              flag_9: true,
            })

          } else if (res.tapIndex == 1) {
            that.setData({
              flag: false,
              flag_1: true,
              flag_2: true,
              flag_3: true,
              flag_4: true,
              flag_5: true,
              flag_6: false,
              flag_7: true,
              flag_8: true,
              flag_9: true,
            })

          } else if (res.tapIndex == 2) {
            that.setData({
              flag: false,
              flag_1: true,
              flag_2: true,
              flag_3: true,
              flag_4: true,
              flag_5: true,
              flag_6: true,
              flag_7: false,
              flag_8: true,
              flag_9: true,
            })

          } else if (res.tapIndex == 3) {
            that.setData({
              flag: false,
              flag_1: true,
              flag_2: true,
              flag_3: true,
              flag_4: true,
              flag_5: true,
              flag_6: true,
              flag_7: true,
              flag_8: false,
              flag_9: true,
            })
          } else if (res.tapIndex == 4) {
            that.setData({
              flag: false,
              flag_1: true,
              flag_2: true,
              flag_3: true,
              flag_4: true,
              flag_5: true,
              flag_6: true,
              flag_7: true,
              flag_8: true,
              flag_9: false,
            })
          }

        },
        fail(res) {
          ////console.log(res.errMsg)
          that.setData({
            pagescroll: ".page"
          })
        }
      })
    }

  },
  // 遮罩层隐藏
  conceal: function() {
    var that = this;
    that.setData({
      showModalStatus: true
    })
    wx.showActionSheet({
      itemList: ['《个人征信查询授权书》', '《个人综合信息查询授权委托书》', '《企业征信查询授权书》', '《企业综合信息查询授权委托书》'],
      itemColor: "#0066b3",
      success(res) {
        that.setData({
          showModalStatus: true
        })
        if (res.tapIndex == 0) {
          that.setData({
            flag: false,
            flag_1: false,
            flag_2: true,
            flag_3: true,
            flag_4: true,
            flag_5: true,
            flag_6: true,
            flag_7: true,
            flag_8: true,
            flag_9: true,
          })

        } else if (res.tapIndex == 1) {
          that.setData({
            flag: false,
            flag_1: true,
            flag_2: false,
            flag_3: true,
            flag_4: true,
            flag_5: true,
            flag_6: true,
            flag_7: true,
            flag_8: true,
            flag_9: true,
          })

        } else if (res.tapIndex == 2) {
          that.setData({
            flag: false,
            flag_1: true,
            flag_2: true,
            flag_3: false,
            flag_4: true,
            flag_5: true,
            flag_6: true,
            flag_7: true,
            flag_8: true,
            flag_9: true,
          })

        } else if (res.tapIndex == 3) {
          that.setData({
            flag: false,
            flag_1: true,
            flag_2: true,
            flag_3: true,
            flag_4: false,
            flag_5: true,
            flag_6: true,
            flag_7: true,
            flag_8: true,
            flag_9: true,
          })
        }
      },
      fail(res) {
        ////console.log(res.errMsg)
        that.setData({
          pagescroll: ".page"
        })
      }
    })
    that.setData({
      flag: true,
      flag_0: true,
      flag_1: true,
      flag_2: true,
      flag_3: true,
      flag_4: true,
      flag_5: true,
      flag_6: true,
      flag_7: true,
      flag_8: true,
      flag_9: true,
    })
  },
  // 遮罩层隐藏
  conceal_1: function() {
    var that = this;
    that.setData({
      showModalStatus: true
    })
    wx.showActionSheet({
      itemList: ['《“税e融”贷款业务申请书》', '《个人征信查询授权书》', '《个人综合信息查询授权委托书》', '《企业征信查询授权书》', '《企业综合信息查询授权委托书》'],
      itemColor: "#0066b3",
      success(res) {
        that.setData({
          showModalStatus: true
        })
        if (res.tapIndex == 0) {
          that.setData({
            flag: false,
            flag_1: true,
            flag_2: true,
            flag_3: true,
            flag_4: true,
            flag_5: false,
            flag_6: true,
            flag_7: true,
            flag_8: true,
            flag_9: true,
          })

        } else if (res.tapIndex == 1) {
          that.setData({
            flag: false,
            flag_1: true,
            flag_2: true,
            flag_3: true,
            flag_4: true,
            flag_5: true,
            flag_6: false,
            flag_7: true,
            flag_8: true,
            flag_9: true,
          })

        } else if (res.tapIndex == 2) {
          that.setData({
            flag: false,
            flag_1: true,
            flag_2: true,
            flag_3: true,
            flag_4: true,
            flag_5: true,
            flag_6: true,
            flag_7: false,
            flag_8: true,
            flag_9: true,
          })

        } else if (res.tapIndex == 3) {
          that.setData({
            flag: false,
            flag_1: true,
            flag_2: true,
            flag_3: true,
            flag_4: true,
            flag_5: true,
            flag_6: true,
            flag_7: true,
            flag_8: false,
            flag_9: true,
          })
        } else if (res.tapIndex == 4) {
          that.setData({
            flag: false,
            flag_1: true,
            flag_2: true,
            flag_3: true,
            flag_4: true,
            flag_5: true,
            flag_6: true,
            flag_7: true,
            flag_8: true,
            flag_9: false,
          })
        }
      },
      fail(res) {
        ////console.log(res.errMsg)
        that.setData({
          pagescroll: ".page"
        })
      }
    })
    that.setData({
      flag: true,
      flag_0: true,
      flag_1: true,
      flag_2: true,
      flag_3: true,
      flag_4: true,
      flag_5: true,
      flag_6: true,
      flag_7: true,
      flag_8: true,
      flag_9: true,
    })
  },
  submitForm(e) {

    if (wx.getStorageSync('openid') == null || wx.getStorageSync('openid') == '') {
      wx.showToast({
        title: '请重新打开小程序',
        icon: 'loading',
        duration: 2000
      })
      return;
    }
    var that = this;
    const params = e.detail.value;
    that.setData({
      formId: e.detail.formId
    })


    //form_id
    //未勾选同意按钮
    if (this.data.checklist != 'checked') {
      wx.showToast({
        title: '请勾选同意协议',
        icon: 'none',
        duration: 2000,
      })
      return;
    }
    ///不在业务范围
    // if(!that.data.isArea){
    //   wx.showModal({
    //     title: '提示',
    //     content: '您所在的区域不接受此项业务办理',
    //     showCancel: false,//是否显示取消按钮
    //     success: function (res) {

    //     },
    //     fail: function (res) { },//接口调用失败的回调函数
    //     complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
    //   })
    //   return;
    // }

    //传入表单数据，调用验证方法
    if (!this.WxValidate.checkForm(params)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false;
    }
    if (this.data.submit) {
      const that = this
      setTimeout(function() {
        let str = JSON.stringify({
          string_id_card_no: params.idCard, //身份证号
          string_enterprise_name: params.orgName, //企业名称
          string_legal_name: params.name, //法人
          string_credit_code: params.orgID, //统一社会信用代码
          string_apply_amount: params.slider + '', //申请额度
          string_apply_term: that.data.times[params.timeIndex].replace('个月', ''), //申请期限
          string_referrer_mobile: params.managerTel, //推荐人手机号
          string_manager_num: params.managerID, //客户经理工号
          string_mobile: params.tel, //联系电话
          // string_load_card_no: params.loadCardNo, //中征码（银行卡号）
          string_apply_type: params.typeIndex, //申请类型
          string_contact_address: params.address, //联系地址
          string_province: that.data.form.provinceCode, //企业实体所在省
          string_city: that.data.form.cityCode, //企业实体所在市
          string_open_id: that.data.openid,
          string_idcard: that.data.idcard, //推荐人身份证号码
          string_real_name: that.data.real_name,
          string_referrer_mobile: that.data.managerTel
        });
        //console.log(str)
        var dataTwo = str
        str = util.toCDB(str.replace(/\(/g, '-括号').replace(/\（/g, '-括号').replace(/\)/g, '括号-').replace(/\）/g, '括号-'));
        var applyData = str;
        str = util.enct(str) + util.digest(str);
        wx.showLoading({
          title: '校验信息中...',
        })
        wx.request({
          url: App.globalData.URL + 'addshuiapply', // 仅为示例，并非真实的接口地址
          data: {
            data: str,
            code: that.data.code,
            phone: params.tel,
            open_id: wx.getStorageSync("openid"),
            type: 1
          },
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
            "key": (Date.parse(new Date())).toString().substring(0, 6),
            "transNo": 'XC014',
            "sessionId": wx.getStorageSync("sessionid"),
          },
          success(res) {
            //console.log(res.data)
            wx.hideLoading();
            if (res.data != undefined && res.data.code != undefined && res.data.code != -1) {
              var adoptId = wx.getStorageSync("openid");
              // that.submitApply(dataTwo, res.data.stringData, e.detail.formId);//测试用
              if (adoptId == "odypO5VfPpoTpHmcJ4pACMM5wUs8" || adoptId == "odypO5V_kmpiTL1J0N6kGqBVXOo0" || adoptId == "odypO5UstG4mkD9p-ZwHCpe5scyg" || adoptId == "odypO5S2BBDb-Cfqc0mLQDSMpCto" || adoptId == "odypO5Wyp6pfoXlzsSPMqriQ0J0E" || adoptId == "odypO5amI8JA7xnVrlGgbYYS6t5Q" || adoptId == "odypO5QX-VP1enrWh42b_5IiZlaY"|| adoptId == "odypO5YO_86TkvLUfax7EBaBt_rk"|| adoptId =="odypO5cPfZKWRK7hV3KR1qHhDqzc"|| adoptId =="odypO5cS2UaYJitZcfGgqPixrWdg") {
                that.submitApply(dataTwo, res.data.stringData, e.detail.formId);
              } else {
                wx.navigateTo({
                  url: 'tax?proCode=' + that.data.form.provinceCode + "0000&cityCode=" + that.data.form.cityCode + '00&creditCode=' + params.orgID + '&str=' + applyData + "&uid=" + res.data.stringData + "&formId=" + e.detail.formId
                })
              }
              //直接跳转成功页面
              // wx.navigateTo({
              //   url: 'apply_result?data=' + res.data.stringData
              // })
            } else {
              that.setData({
                submit: true
              })
              wx.hideToast();
              wx.showModal({
                title: '提示',
                content: res.data.msg,
                showCancel: false, //是否显示取消按钮
                success: function(res) {},
                fail: function(res) {}, //接口调用失败的回调函数
                complete: function(res) {}, //接口调用结束的回调函数（调用成功、失败都会执行）
              })
            }
          },
          fail() {
            wx.showToast({
              title: '网络异常',
              icon: 'none',
              duration: 2000
            })
            that.setData({
              submit: true
            })
          }
        })
      }, 0)

    } else {
      wx.showToast({
        title: '您已提交过了',
        icon: 'none',
        duration: 2000
      })
    }
  },
  initValidate() {
    // 验证字段的规则
    const rules = {
      orgID: {
        required: true,
        orgID: true,
      },
      orgName: {
        required: true,
        orgName: true,
      },
      name: {
        required: true,
        name: true,
      },

      idCard: {
        required: true,
        idcard: true,
      },
      address: {
        required: true,
        address: true,
      },
      timeIndex: {
        required: true,
        timeIndex: true,
      },
      slider: {
        required: true,
        slider: true,
      },
      // loadCardNo: {
      //   required: true,
      //   minlength: 16,
      //   maxlength: 16,
      // },
      tel: {
        required: true,
        tel: true,
      },
      verycode: {
        required: true,
      },
      managerTel: {
        tel: false,
        minlength: 11,
        maxlength: 11,
      },
      managerID: {
        minlength: 8,
        maxlength: 8,
      },
    }

    // 验证字段的提示信息，若不传则调用默认的信息
    const messages = {

      name: {
        required: '请输入法人姓名',
        name: '法人姓名仅支持汉字（8位内）',
      },
      tel: {
        required: "请输入法人代表手机号",
        tel: "请输入正确的法人代表手机号",
      },
      idCard: {
        required: '请输入身份证号码',
        idcard: '请输入正确的身份证号码',
      },
      address: {
        required: '请输入联系地址',
      },
      orgID: {
        required: '请输入企业统一社会信用代码',
        orgID: '请输入正确的统一社会信用代码',
      },

      orgName: {
        required: '请输入企业名称',
        orgName: '企业名称只能包含汉字及全/半角括号'
      },
      slider: {
        required: '请选择申请金额',
        min: '金额不小于10万',
        max: '金额不大于200万',
      },
      timeIndex: {
        required: '请选择申请期限',
      },
      // loadCardNo: {
      //   required: '请输入中征码',
      //   minlength: '请输入16位中征码',
      //   maxlength: '请输入16位中征码',
      // },
      verycode: {
        required: '请输入手机验证码',
      },
      managerTel: {
        tel: '请输入正确的推荐人手机号',
        minlength: '请输入11位推荐人手机号',
        maxlength: '请输入11位推荐人手机号',
      },
      managerID: {
        minlength: '请输入8位客户经理工号',
        maxlength: '请输入8位客户经理工号',
      },
    }

    // 创建实例对象
    this.WxValidate = new WxValidate(rules, messages)
  },
  //期限选择
  bindTimeChange(e) {
    const value = e.detail.value
    this.setData({
      'form.timeIndex': value,
    })
  },
  //申请类型
  bindTypeChange(e) {
    const value = e.detail.value
    this.setData({
      'form.typeIndex': value,
    })
  },
  //拖动slider
  changeSlider(e) {
    const value = e.detail.value;
    this.setData({
      'form.slider': value,
    })
  },

  //获取输入的手机号，以供发验证码
  getPhoneValue: function(e) {
    var _this = this
    _this.setData({
      phone: e.detail.value,
    })
  },
  //获取输入的验证码
  getCodeValue: function(e) {
    this.setData({
      code: e.detail.value,
    })
  },

  //校验手机号、后台发送验证码至手机
  getCode: function() {
    var a = this.data.phone;
    var _this = this;
    //var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    if (a == "") {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000
      })
      setTimeout(function() {
        _this.setData({
          codename: '获取验证码',
          disabled: false
        }, 3000)
      })
      return false;
    } else if (a.length != 11) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000
      })
      setTimeout(function() {
        _this.setData({
          codename: '获取验证码',
          disabled: false
        }, 3000)
      })
      return false;
    } else {
        api.sendCode(this.data.phone,3).then(res=>{
            console.log(res)
            if (res.code === 1) {
              var num = 60;
              var timer = setInterval(function () {
                num--;
                if (num <= 0) {
                  clearInterval(timer);
                  _this.setData({
                    codename: '重新发送',
                    disabled: false
                  })
                } else {
                  _this.setData({
                    codename: num + "s"
                  })
                }
              }, 1000)
              wx.showToast({
                title: res.msg,
                icon: 'none',
                duration: 2000
              })
            } else {
              wx.showToast({
                title: res.msg,
                icon: 'none',
                duration: 2000
              })
              _this.setData({
                disabled: false
              })
            }
        }).catch(err=>{
          wx.showToast({
              title: '发送失败',
              icon: 'none',
              duration: 1000
            })
            _this.setData({
              disabled: false
            })
        })
      var num = 60;
      var timer = setInterval(function() {
        num--;
        if (num <= 0) {
          clearInterval(timer);
          _this.setData({
            codename: '重新发送',
            disabled: false
          })
        } else {
          _this.setData({
            codename: num + "s"
          })
        }
      }, 1000)
    }
  },
  //点击获取验证码按钮，出发按钮事件
  getVerificationCode(e) {
    this.getCode();
    var _this = this
    _this.setData({
      disabled: true
    })
  },

  //调取拍照控件或选择图片方法控件
  creatPhoto(e) {
    //选取id号sfz--身份证，yyzz--营业执照
    const c = e.target.id;
    var that = this;
    //点击后调取拍照/选已有sheet
    wx.showActionSheet({
      itemList: ['立即拍照', "从手机相册选择"],
      success(res) {
        //身份证提示
        if (c == "sfz") {
          that.setData({
            takephoto: {
              coverImg: "img/camera_box.png",
              noticeTxt: "请将身份证人像面放入框内",
              id: "sfz_take"
            },
          });
        } else if (c == "yyzz") {
          //营业执照提示
          that.setData({
            takephoto: {
              coverImg: "img/camera_box_org.png",
              noticeTxt: "请将营业执照（竖版）放入框内",
              id: "yyzz_take"
            },
          });
        }
        var _ind = res.tapIndex;
        //拍照界面弹出方法0--立即拍照调取takephoto；1选取已有
        if (_ind == "0") {
          that.setData({
            camera_flag: false,
            v: "1"
          });
        } else if (_ind == "1") {
          const c = that.data.takephoto.id
          wx.chooseImage({
            count: 1,
            sizeType: ['compressed'], //compressed压缩图，original原图
            sourceType: ['album'],
            success(res) {
              // tempFilePath可以作为 img标签的src属性显示图片
              var tempFilePaths = res.tempFilePaths
              // var FSM = wx.getFileSystemManager(); 
              // FSM.readFile({
              //   filePath: res.tempFilePaths[0],
              //   encoding: "base64",
              //   success: function (data) {
              //     that.setData({
              //       imageData:data.data
              //     })
              //   }
              // });


              //压缩图片处理
              var size = res.tempFiles[0].size;
              wx.getImageInfo({
                src: tempFilePaths[0],
                success: function(res) {
                  var ctx = wx.createCanvasContext('attendCanvasId');
                  var ratio = 1;
                  var canvasWidth = res.width
                  var canvasHeight = res.height;
                  var quality = 1;
                  while (canvasWidth > 700) {
                    canvasWidth = Math.trunc(res.width / ratio)
                    canvasHeight = Math.trunc(res.height / ratio)
                    ratio += 0.1;
                  }
                  quality = (quality + (ratio / 10)).toFixed(1);
                  //console.log(quality)
                  if (quality > 1) {
                    quality = 0.7;
                  }
                  that.setData({
                    canvasWidth: canvasWidth,
                    canvasHeight: canvasHeight
                  });
                  ctx.drawImage(tempFilePaths[0], 0, 0, canvasWidth, canvasHeight);
                  ctx.draw();
                  setTimeout(function() {
                    wx.canvasToTempFilePath({
                      canvasId: 'attendCanvasId',
                      width: 0,
                      height: 0,
                      destWidth: canvasWidth,
                      destHeight: canvasHeight,
                      fileType: 'jpg',
                      quality: quality,
                      success(res) {


                        //这里是将图片上传到服务器中并识别
                        //console.log(res.tempFilePath)


                        ////console.log(res)
                        that.setData({
                          "takephoto.tempImage": res.tempFilePath,
                        })
                        if (c == "sfz_take") {
                          wx.showToast({
                            title: "智能识别中...",
                            icon: 'loading',
                            mask: true,
                            duration: 20000
                          })
                          wx.uploadFile({
                            url: App.globalData.URL + "upload", // 仅为示例，非真实的接口地址
                            filePath: that.data.takephoto.tempImage,
                            name: 'file',
                            formData: {
                              option: '1'
                            },
                            header: {
                              "key": (Date.parse(new Date())).toString().substring(0, 6),
                              "sessionId": wx.getStorageSync("sessionid")
                            },
                            success: res => {
                              wx.hideToast();
                              //console.log(res)

                              if(res.data){
                                const result = JSON.parse(res.data)
                                if(result.rE_LEGALITY==="IdPhoto"){
                                    that.setData({
                                        flag_self_diy: false,
                                        flag_self_ocr: true,
                                        'form.name': result.rE_CUST_NAME,
                                        'form.idCard': result.rE_CUST_ID,
                                        'form.address': result.rE_ADDRESS
                                      })
                                }else{
                                    wx.showToast({
                                        title: "请上传正常有效的身份证原件（不允许拍照身份证复印件，身份证二次拍照）",
                                        icon: 'none',
                                        mask: true,
                                        duration: 2000
                                      })
                                }
                              }else{
                                wx.showToast({
                                    title: res.errMsg,
                                    icon: 'none',
                                    mask: true,
                                    duration: 2000
                                  })
                              } 
                            }
                          })
                        } else if (c == "yyzz_take") {
                          wx.showToast({
                            title: "智能识别中...",
                            icon: 'loading',
                            mask: true,
                            duration: 20000
                          })
                          wx.uploadFile({
                            url: App.globalData.URL + "upload", // 仅为示例，非真实的接口地址
                            filePath: that.data.takephoto.tempImage,
                            name: 'file',
                            formData: {
                              option: '2',
                              // img: that.data.imageData  //图片地址64
                            },
                            header: {
                              "key": (Date.parse(new Date())).toString().substring(0, 6),
                              "sessionId": wx.getStorageSync("sessionid")
                            },
                            success: res => {
                              wx.hideToast();
                              if (res.data != '') {
                                var result = JSON.parse(res.data);
                                var provinceID = result.rE_REGISTER_ID.substring(2, 4);
                                var cityID = result.rE_REGISTER_ID.substring(2, 6);
                                var province = that.data.org_cities[provinceID];
                                var city = that.data.org_cities[cityID];
                                that.setData({
                                  flag_org_diy: false,
                                  flag_org_ocr: true,
                                  'form.orgID': result.rE_REGISTER_ID,
                                  'form.orgName': result.rE_COMPANY_NAME,
                                  "form.province": province,
                                  "form.city": city,
                                  'form.provinceCode': result.rE_REGISTER_ID.substring(2, 4),
                                  'form.cityCode': result.rE_REGISTER_ID.substring(2, 6),
                                  "provinceName": province,
                                  "cityName": city

                                })
                              } else {
                                wx.showToast({
                                  title: '您上传的图片太大啦，请您重新上传。',
                                  icon: 'none',
                                  mask: true,
                                  duration: 2000
                                })

                              }
                            }
                          })
                        }
                      },
                      fail(e) {
                        wx.hideLoading();
                        wx.showToast({
                          title: '上传失败',
                          icon: 'success',
                          duration: 2000
                        });
                      }
                    });
                  }, 1000);
                }
              })
              //压缩结束

            },
            fail(res) {
              wx.showToast({
                title: "请拍照上传",
                icon: 'none',
                duration: 1000
              })
            }
          })
        }

      },
      fail(res) {}
    })
  },
  //图片转编码64
  urlTobase64(url) {
    wx.request({
      url: url,
      responseType: 'arraybuffer', //最关键的参数，设置返回的数据格式为arraybuffer
      success: res => {
        //把arraybuffer转成base64
        let base64 = wx.arrayBufferToBase64(res.data);

        //不加上这串字符，在页面无法显示的哦
        base64 = 'data:image/jpeg;base64,' + base64

        //打印出base64字符串，可复制到网页校验一下是否是你选择的原图片呢
        //console.log("正常的64位" + base64)
      }
    })
  },
  //拍照调取原生组件方法
  takePhoto(e) {
    var that = this;
    //选取id号sfz--身份证，yyzz--营业执照
    const c = e.target.id;
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        var tempImg = res.tempImagePath;
        wx.getImageInfo({
          src: tempImg,
          success: function(res) {
            //console.log(res.path)
            var _w = res.width;
            var _h = res.height;
            var relW = 700;
            var relH = parseInt(relW * _h / _w);
            ////console.log(relH)
            that.setData({
              canvasHeight2: 0.75 * relH,
              canvasWidth2: relW
            })
            var ctx = wx.createCanvasContext('attendCanvasId2');
            ctx.drawImage(res.path, 0, 0, relW, relH);
            ctx.draw();

            setTimeout(function() {
              wx.canvasToTempFilePath({
                canvasId: 'attendCanvasId2',
                x: 0,
                y: 0.2 * relH,
                width: relW,
                height: 0.6 * relH,
                destWidth: 600, //最终图片大小
                destHeight: parseInt(360 * relH / relW),
                //570parseInt(200 * relH / relW)最终图片大小
                // x: relW/5,
                // y: relH/4,
                // width: 0.7*relW,
                // height: relH*3/4,
                // destWidth: 400,//最终图片大小
                // destHeight: parseInt(288 * relH / relW),//最终图片大小
                fileType: 'jpg',
                quality: 0.7,
                success(res) {
                  //这里是将图片上传到服务器中并识别
                  //console.log(res.tempFilePath)
                  let pangData = util.enct(res.tempFilePath) + util.digest(res.tempFilePath)
                  //console.log("图片地址" + pangData);
                  //传值并关闭拍照界面
                  that.setData({
                    "takephoto.tempImage": res.tempFilePath,
                    camera_flag: true, //隐藏拍照界面
                    v: "0"
                  });
                  //判断调用身份证还是营业执照
                  if (c == "sfz_take") {
                    wx.showToast({
                      title: "智能识别中...",
                      icon: 'loading',
                      mask: true,
                      duration: 20000
                    })
                    wx.uploadFile({
                      url: App.globalData.URL + "upload", // 仅为示例，非真实的接口地址
                      filePath: that.data.takephoto.tempImage,
                      name: 'file',
                      formData: {
                        option: '1'
                      },
                      header: {
                        "key": (Date.parse(new Date())).toString().substring(0, 6),
                        "sessionId": wx.getStorageSync("sessionid")
                      },
                      success: res => {
                        wx.hideToast();
                        if(res.data){
                            const result = JSON.parse(res.data)
                            if(result.rE_LEGALITY==="IdPhoto"){
                                that.setData({
                                    flag_self_diy: false,
                                    flag_self_ocr: true,
                                    'form.name': result.rE_CUST_NAME,
                                    'form.idCard': result.rE_CUST_ID,
                                    'form.address': result.rE_ADDRESS
                                  })
                            }else{
                                wx.showToast({
                                    title: "请上传正常有效的身份证原件（不允许拍照身份证复印件，身份证二次拍照）",
                                    icon: 'none',
                                    mask: true,
                                    duration: 2000
                                  })
                            }
                          }else{
                            wx.showToast({
                                title: res.errMsg,
                                icon: 'none',
                                mask: true,
                                duration: 2000
                              })
                          } 
                      }
                    })
                  } else if (c == "yyzz_take") {
                    wx.showToast({
                      title: "智能识别中...",
                      icon: 'loading',
                      mask: true,
                      duration: 20000
                    })

                    wx.uploadFile({
                      url: App.globalData.URL + "upload", // 仅为示例，非真实的接口地址
                      filePath: pangData,
                      name: 'file',
                      formData: {
                        option: '2'
                      },
                      header: {
                        "key": (Date.parse(new Date())).toString().substring(0, 6),
                        "sessionId": wx.getStorageSync("sessionid")
                      },
                      success: res => {
                        wx.hideToast();
                        if (res.data != '') {
                          var result = JSON.parse(res.data);
                          var provinceID = result.rE_REGISTER_ID.substring(2, 4);
                          var cityID = result.rE_REGISTER_ID.substring(2, 6);
                          var province = that.data.org_cities[provinceID];
                          var city = that.data.org_cities[cityID];
                          that.setData({
                            flag_org_diy: false,
                            flag_org_ocr: true,
                            'form.orgID': result.rE_REGISTER_ID,
                            'form.orgName': result.rE_COMPANY_NAME,
                            "form.province": province,
                            "form.city": city,
                            'form.provinceCode': result.rE_REGISTER_ID.substring(2, 4),
                            'form.cityCode': result.rE_REGISTER_ID.substring(2, 6),
                            "provinceName": province,
                            "cityName": city
                          })

                        } else {
                          wx.showToast({
                            title: '您上传的图片太大啦，请您重新上传。',
                            icon: 'none',
                            mask: true,
                            duration: 2000
                          })

                        }
                      }
                    })
                  }
                }
              })
            }, 1000)

          }
        });
      },
      fail: (res) => {
        ////console.log(res)
      }
    })

  },

  //重拍按钮
  reTake() {
    this.setData({
      camera_flag: true
    })
    wx.showToast({
      title: "您已取消拍照",
      icon: 'none',
      duration: 2000
    })
  },
  //确定按钮
  chose() {
    this.setData({
      flag_self_ocr: false,
      preview_flag: true,
      v: "0"
    })
  },
  error(e) {
    ////console.log(e.detail)
  },
  //手写input绑定form值
  blur(e) {
    let idname = e.target.id
    if (idname == "orgID") {
      this.setData({
        "form.orgID": e.detail.value
      })
    } else if (idname == "orgName") {
      this.setData({
        "form.orgName": e.detail.value
      })
    } else if (idname == "province") {
      this.setData({
        "form.province": e.detail.value
      })
    } else if (idname == "city") {
      this.setData({
        "form.city": e.detail.value
      })
    } else if (idname == "idCard") {
      this.setData({
        "form.idCard": e.detail.value
      })
    } else if (idname == "name") {
      this.setData({
        "form.name": e.detail.value
      })
    } else if (idname == "tel") {
      this.setData({
        "form.tel": e.detail.value
      })
    }
    ////console.log(this.data)
  },
  //同意框选中
  checkedList: function(e) {
    if (e.detail.value[0] == 'true') { //以选中
      this.setData({
        checklist: 'checked'
      })
    } else {
      this.setData({ //反之
        checklist: ''
      })
    }
  },
  //统一码失焦
  blurCity: function(e) {
    if (e.detail.value == undefined || e.detail.value == null || e.detail.value.trim() == '' || e.detail.value.length < 18) {
      return;
    }
    var that = this;
    var provinceID = e.detail.value.substring(2, 4);
    var cityID = e.detail.value.substring(2, 6);
    if (cityID == 3305 || cityID == 3306 || cityID == 3300) { //浙江绍兴，湖州默认为杭州
      cityID = 3301;
    } else
    if (cityID == 3200) { //江苏默认为南京
      cityID = 3201;
    } else
    if (cityID == 4400) { //广东默认为深圳
      cityID = 4403;
    } else
    if (cityID == 3100) { //上海
      cityID = 3101;
    }
    var province = that.data.org_cities[provinceID];
    var city = that.data.org_cities[cityID];
    //console.log(province + ' ' + city)

    // if (province == undefined || city == undefined){
    //   that.setData({
    //     //isArea:false
    //   })
    //   wx.showModal({
    //     title: '提示',
    //     content: '您所在的区域不接受此项业务办理',
    //     showCancel: false,//是否显示取消按钮
    //     success: function (res) {

    //     },
    //     fail: function (res) { },//接口调用失败的回调函数
    //     complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
    //   })
    //   return;
    // }
    that.setData({
      "form.orgID": e.detail.value,
      "form.province": province,
      "form.city": city,
      'form.provinceCode': provinceID,
      'form.cityCode': cityID,
      "provinceName": province,
      "cityName": city,
      isArea: true
    })
  },
  //地区选择
  bindMultiPickerChange: function(e) {
    var arrs = []
    var that = this;
    var provinceNameID = that.data.objectMultiArray[e.detail.value[0]].regid
    var provinceName = that.data.objectMultiArray[e.detail.value[0]].regname
    that.setData({
      'form.provinceCode': provinceNameID,
      'form.province': provinceName,
      "provinceName": provinceName
    });

    for (var i = 0; i < that.data.objectMultiArray.length; i++) {
      if (that.data.objectMultiArray[i].parid == that.data.objectMultiArray[e.detail.value[0]].regid && that.data.objectMultiArray[i].regtype == 2) {
        arrs.push(that.data.objectMultiArray[i]);
      }
    }
    ////console.log(arrs[e.detail.value[1]].regid)//市区ID
    var cityNameID = arrs[e.detail.value[1]].regid
    var cityName = arrs[e.detail.value[1]].regname
    that.setData({
      'form.cityCode': cityNameID,
      'form.city': cityName,
      "cityName": cityName
    });
    that.setData({
      "multiIndex[0]": e.detail.value[0],
      "multiIndex[1]": e.detail.value[1]
    })
  },
  //地区选择
  bindMultiPickerColumnChange: function(e) {
    var that = this;
    switch (e.detail.column) {
      case 0:
        list = []
        for (var i = 0; i < that.data.objectMultiArray.length; i++) {
          if (that.data.objectMultiArray[i].parid == that.data.objectMultiArray[e.detail.value].regid) {
            list.push(that.data.objectMultiArray[i].regname);
          }
        }
        that.setData({
          "multiArray[1]": list,
          "multiIndex[0]": e.detail.value,
          "multiIndex[1]": 0
        })
    }
  },

  prePage() {
    wx.navigateBack();
  },
  indexpage: function() {
    wx.switchTab({
      url: "/pages/shop/index2"
    })
  },
  scrollBottom() {
    wx.createSelectorQuery()
      .select("#alpi")
      .boundingClientRect(function(rect) {
        wx.pageScrollTo({
          scrollTop: rect.bottom,
          duration: 0
        });
      })
      .exec();
  },
  submitApply: function(applyData, uid, formId) {
    var apply = JSON.parse(applyData);
    //console.log(apply)
    var that = this;
    wx.showLoading({
      title: '提交中...',
      mask: true
    })
    //请求接口

    //console.log(apply.string_apply_term)
    var term = 0; //给申请期限赋值
    for (var i = 0; i < that.data.times.length; i++) {
      if (that.data.times[i] == apply.string_apply_term + '个月') {
        term = i;
      }
    }
    //console.log(apply.string_province + "\t" + apply.string_city)
    //console.log(that.data.org_cities[apply.string_province] + "\t" + that.data.org_cities[apply.string_city])
    that.setData({
      flag_org_diy: false,
      flag_org_ocr: true,
      flag_self_diy: false,
      flag_self_ocr: true,
      form: {
        orgID: apply.string_credit_code, //企业统一信用代码
        orgName: apply.string_enterprise_name,
        province: apply.string_province, //省
        city: apply.string_city, //市
        name: apply.string_legal_name, //法人姓名
        tel: apply.string_mobile, //法人手机
        idCard: apply.string_id_card_no, //法人身份证
        address: apply.string_contact_address, //法人联系地址
        timeIndex: term, //申请期限
        slider: apply.string_apply_amount, //贷款额度
        // loadCardNo: apply.string_load_card_no, //中征码
        provinceCode: apply.string_province, //省码
        cityCode: apply.string_city, //市码
        typeIndex: apply.string_apply_type, //申请类型
        //open_id: apply.string_open_id
      },
      provinceName: that.data.org_cities[apply.string_province],
      cityName: that.data.org_cities[apply.string_city],
      managerTel: apply.string_referrer_mobile,
      managerID: apply.string_manager_num
    })
    setTimeout(function() {
      var str = util.enct(applyData) + util.digest(applyData);
      wx.request({
        url: App.globalData.URL + 'addshuiapply', // 仅为示例，并非真实的接口地址
        data: {
          data: str,
          open_id: wx.getStorageSync("openid"),
          type: 2,
          id: uid
        },
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "key": (Date.parse(new Date())).toString().substring(0, 6),
          "transNo": 'XC014',
          "sessionId": wx.getStorageSync("sessionid"),
        },
        success(res) {
          //console.log(res)
          wx.hideLoading();
          if (res.data != undefined && res.data.code != undefined && res.data.code != -1) {
            var resultData = JSON.parse(res.data.stringData);
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 1000
            })
            //成功后跳转
            wx.navigateTo({
              //url: '/pages/mine/mine_applicate?orderNo=' + res.data.stringData + '&type=10',
              url: 'apply_result?data=' + res.data.stringData + "&orgName=" + apply.string_enterprise_name + "&orgID=" + apply.string_credit_code + "&name=" + apply.string_legal_name + "&officeAdd=" + that.data.form.cityCode + "&applicantTel=" + apply.string_mobile + "&loadCardNo=" + apply.string_load_card_no,
            })
          } else {
            wx.hideToast();
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false, //是否显示取消按钮
              success: function(res) {},
              fail: function(res) {}, //接口调用失败的回调函数
              complete: function(res) {}, //接口调用结束的回调函数（调用成功、失败都会执行）
            })
          }

        },
        fail() {
          wx.showToast({
            title: '网络异常',
            icon: 'none',
            duration: 2000
          })
        }
      })
    }, 500)
  },
  businesCard: function(e) {
    let that = this;
    that.setData({
      flag_org_diy: false,
      flag_org_ocr: true,
    })

    wx.showLoading({
      title: '数据加载中...',
      mask: true
    })

    //wx.request 成功后执行
    wx.hideLoading();


  },
  pickBC: function(e) {
    let that = this;
    //console.log(that.data.busiCardList[e.detail.value] + "sddsad")
    that.setData({
        bcindex: e.detail.value
      }),


      Org.getEnterpriseInfoByName(that.data.busiCardList[e.detail.value]).then(res=>{
        //console.log(res)
        that.setData({
            'form.orgID': res.ORG_CODE,
            'form.orgName': res.ORG_NAME,
            'form.officeAdd': res.ORG_ADDRESS,
            'form.loadCardNo': res.ZCODE,

          })

          let provinceID = res.ORG_CODE.substring(2, 4);
          let cityID = res.ORG_CODE.substring(2, 6);
          let province = that.data.org_cities[provinceID];
          let city = that.data.org_cities[cityID];
          that.setData({
            "form.province": province,
            "form.city": city,
            'form.provinceCode': provinceID,
            'form.cityCode': cityID,
            "provinceName": province,
            "cityName": city
          })
       
      }).catch(err=>{
          //console.log(err)
      })

     
  },
})