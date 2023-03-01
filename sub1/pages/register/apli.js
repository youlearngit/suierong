import WxValidate from '../../../assets/plugins/wx-validate/WxValidate';
var citys = require('../../../pages/public/city.js');
var util = require('../../../utils/util.js');
import user from "../../../utils/user"
import Org from '../../../api/Org'
import api from "../../../utils/api"

const App = getApp();
const date = new Date();

var list = [];
Page({
  data: {
    falg1: '',
    busiCardList: [],
    cardlist: [], //企业名片列表
    cardname: [], //企业名片名称列表，用于展示
    idcard: '', //身份证号码
    phone1: '',
    no: '',
    nick_name: '',
    real_name: '',
    tel: '',
    trbsName: '',
    qiGeGuan: '',
    form: {
      name: '', //申请人姓名(法人)
      cardType: "二代身份证", //申请人证件类型
      idCard: '', //申请人证件号码
      password: '', //密码
      passwordTwo: '', //确定密码
      gender: '', //性别
      orgName: '', //企业名称
      orgID: '', //企业统一信用代码
      orgAddress: '', //企业地址
      province: '', //省
      city: '', //市
      jine: '', //贷款额度
      timeIndex: '', //申请期限
      qiGe: '', //企业与个人关系
      saleIndex: '', //企业上年销售收入
      tel: '', //手机
      provinceCode: '', //地区省码
      cityCode: '', //地区市码
      type: '', //主体类型
      relationIndex: '', //主体级别
    },
    phone: '',

    provinceName: "", //省
    provinceNameID: "", //省ID
    cityName: "", //市
    cityNameID: "", //市ID
    multiIndex: ["", ""],
    multiArray: [],
    objectMultiArray: [],
    org_cities: {},

    times: ['12个月', '11个月', '10个月', '9个月', '8个月', '7个月', '6个月', '5个月', '4个月', '3个月', '2个月', '1个月'],
    relation: ['法定代表人'], //, '实际控制人', '股东', '其他'
    sale: ['3000万元以上', '1000万元-3000万元', '200万元-1000万元', '200万元以下'],
    gender: ['男', '女'],
    rencaiList: [
      ['专业大户', '家庭农场', '农民合作社', '农业企业', '农业社会化服务组织', '其它'],
      ['专业大户']
    ],
    objectrencaiList: [
      [{
          id: 0,
          name: '专业大户'
        },
        {
          id: 1,
          name: '家庭农场'
        },
        {
          id: 2,
          name: '农民合作社'
        },
        {
          id: 3,
          name: '农业企业'
        },
        {
          id: 4,
          name: '农业社会化服务组织'
        },
        {
          id: 5,
          name: '其它'
        }
      ],
    ],
    rencaiIndex: [],
    rencaiGrade: "",
    flag: true,
    flag_0: true,
    flag_1: true,
    flag_2: true,
    flag_3: true,
    flag_4: true,
    flag_org_diy: false,
    flag_org_ocr: true,
    flag_self_diy: true,
    flag_self_ocr: false,
    disabled: '',
    code: '', //验证码
    iscode: null, //用于存放验证码接口里获取到的code
    codename: '获取验证码',
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
    accessToken: '',
    level_json: {
      '专业大户': '101',
      '省级示范家庭农场': '201',
      '市级示范家庭农场': '202',
      '县(区)级示范家庭农场': '203',
      '其它家庭农场': '204',
      '省级示范合作社': '301',
      '市级示范合作社': '302',
      '县(区)级示范合作社': '303',
      '其它合作社': '304',
      '省级农业产业化龙头企业': '401',
      '市级农业产业化龙头企业': '402',
      '县(区)级农业产业化龙头企业': '403',
      '其它农业产业化龙头企业': '404',
      '农业社会化服务组织': '501',
      '其它': '601'
    }
  },

  onLoad() {
      user.getCustomerInfo().then(res=>{
        if (res.TEL) {
            this.setData({
              'form.tel': res.TEL
            })
          }
      })
  
    var that = this;

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
        if (res.data.stringData != undefined) {
          var cardlist = res.data.stringData;
          var cardlist1 = JSON.parse(util.dect(cardlist));
          var taggs = '';

          var listname = []
          if (cardlist1 != null && cardlist1 != undefined) {
            for (var i = 0; i < cardlist1.length; i++) {
              listname.push(
                cardlist1[i].ORG_NAME,
              )
            }
          }
          if (cardlist1.length <= 0) {

          } else {
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
    })
    //请求接口


    this.setData({
      preffixUrl: App.globalData.URL,
      objectMultiArray: citys.citys,
      multiArray: citys.multiArray,
      org_cities: citys.org_cities,
      navTop: App.globalData.statusBarTop,
      navHeight: App.globalData.statusBarHeight,
      'form.qiGe': 0,
      qiGeGuan: '1'
    })

    this.initValidate();
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 20000
    })

  },
  onShow: function() {
    wx.hideToast();
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
    //先通过open_id查他的身份证号码  然后通过身份证号码查工号和手机号码
    if (App.globalData.share_person != undefined && App.globalData.share_person != null && App.globalData.share_person != '') {
     
        user.getCustomerInfo(App.globalData.share_person).then(res=>{
            if (res.ID_CARD != undefined) {
                this.setData({
                  idcard: res.ID_CARD,
                  nick_name: res.NICK_NAME,
                  real_name: res.REAL_NAME,
                  tel: res.TEL,
                  phone1: res.TEL?res.TEL:'',
                  no: res.USERID?res.USERID:"",
                  trbsName: res.REAL_NAME?res.REAL_NAME:'',
                })
              }
         })
            
   }
    wx.hideToast();
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
    that.setData({
      showModalStatus: true
    })
    wx.showActionSheet({
      itemList: ['《江苏银行信贷业务申请书》', '《个人征信查询授权书》', '《个人综合信息查询授权委托书》', '《企业征信查询授权书》', '《综合信息查询授权委托书》'],
      itemColor: "#0066b3",
      success(res) {
        that.setData({
          pagescroll: ".page .noscroll"
        })
        if (res.tapIndex == 0) {
          that.setData({
            flag: false,
            flag_0: false,
            flag_1: true,
            flag_2: true,
            flag_3: true,
            flag_4: true,
          })

        } else if (res.tapIndex == 1) {
          that.setData({
            flag: false,
            flag_0: true,
            flag_1: false,
            flag_2: true,
            flag_3: true,
            flag_4: true,
          })

        } else if (res.tapIndex == 2) {
          that.setData({
            flag: false,
            flag_0: true,
            flag_1: true,
            flag_2: false,
            flag_3: true,
            flag_4: true,
          })

        } else if (res.tapIndex == 3) {
          that.setData({
            flag_0: true,
            flag_1: true,
            flag_2: true,
            flag_3: false,
            flag_4: true,
          })

        } else if (res.tapIndex == 4) {
          that.setData({
            flag_0: true,
            flag_1: true,
            flag_2: true,
            flag_3: true,
            flag_4: false,
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
  },
  // 遮罩层隐藏
  conceal: function() {
    var that = this;
    that.setData({
      showModalStatus: true
    })
    wx.showActionSheet({
      itemList: ['《江苏银行信贷业务申请书》', '《个人征信查询授权书》', '《个人综合信息查询授权委托书》', '《企业征信查询授权书》', '《综合信息查询授权委托书》'],
      itemColor: "#0066b3",
      success(res) {
        that.setData({
          showModalStatus: true
        })
        if (res.tapIndex == 0) {
          that.setData({
            flag: false,
            flag_0: false,
            flag_1: true,
            flag_2: true,
            flag_3: true,
            flag_4: true,
          })

        } else if (res.tapIndex == 1) {
          that.setData({
            flag: false,
            flag_0: true,
            flag_1: false,
            flag_2: true,
            flag_3: true,
            flag_4: true,
          })

        } else if (res.tapIndex == 2) {
          that.setData({
            flag: false,
            flag_0: true,
            flag_1: true,
            flag_2: false,
            flag_3: true,
            flag_4: true,
          })

        } else if (res.tapIndex == 3) {
          that.setData({
            flag_0: true,
            flag_1: true,
            flag_2: true,
            flag_3: false,
            flag_4: true,
          })

        } else if (res.tapIndex == 4) {
          that.setData({
            flag_0: true,
            flag_1: true,
            flag_2: true,
            flag_3: true,
            flag_4: false,
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
    })
  },

  submitForm(e) {

    var that = this;
    const params = e.detail.value;
    const fId = e.detail.formId;

    // 传入表单数据，调用验证方法
    if (!this.WxValidate.checkForm(params)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false
    }
    if (params.pwd != params.pwdTwo) {
      wx.showToast({
        title: '确认密码与登录密码不一致',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (this.data.submit) {
      wx.showLoading({
        title: '提交中...',
        mask: true
      })
      wx.request({
        url: App.globalData.URL + 'login', // 仅为示例，并非真实的接口地址
        data: {
          name: params.name,
          phone: params.tel,
          code: this.data.code,
          idCard: params.idCard,
          password: params.pwd
        },
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success(res) {
          wx.hideLoading();
          wx.showToast({
            title: res.data.eRROR_MSG?res.data.eRROR_MSG:"",
            icon: 'none',
            duration: 2000
          })
          if (res.data.tRAN_STATUS.value == 'COMPLETE') {
            wx.navigateTo({
              url: 'submit_suc'
            })
          }
        },
        fail() {
          that.setData({
            submit: true
          })
          wx.showToast({
            title: '网络异常',
            icon: 'none',
            duration: 2000
          })
        }
      })

    } else {
      wx.showToast({
        title: '您已提交过了',
        icon: 'none',
        duration: 2000
      })
    }
  },
  initValidate() {
    const rules = {
      name: {
        required: true,
        name: true,
      },
      idCard: {
        required: true,
        idcard: true,
      },
      tel: {
        required: true,
        tel: true,
      },
      verycode: {
        required: true,
      },
      pwd: {
        required: true
      },
      pwdTwo: {
        required: true
      }

    }

    // 验证字段的提示信息，若不传则调用默认的信息
    const messages = {
      name: {
        required: '请输入姓名',
        name: '姓名只能是中文名',
      },
      idCard: {
        required: '请输入身份证号码',
        idcard: '请输入正确的身份证号码',
      },
      tel: {
        required: "请输入手机号",
        tel: "请输入手机号",
      },
      verycode: {
        required: '请输入手机验证码',
      },
      pwd: {
        required: '请输入密码'
      },
      pwdTwo: {
        required: '请输入确认密码'
      }

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
  //个人与企业的关系
  bindQiGeChange(e) {
    const qige = e.detail.value;
    if (qige == "0") {
      this.setData({
        qiGeGuan: '1',
      })
    } else if (qige == "1") {
      this.setData({
        qiGeGuan: '2',
        'form.qiGe': qige
      })
    } else if (qige == "2") {
      this.setData({
        qiGeGuan: '3'
      })
    } else {
      this.setData({
        qiGeGuan: '4'
      })
    }
    this.setData({
      'form.qiGe': qige
    })


  },
  //企业上年销售收入选择
  bindSaleChange(e) {
    const value = e.detail.value
    this.setData({
      'form.saleIndex': value,
    })
  },
  //性别选择
  bindGender(e) {
    this.setData({
      'form.gender': e.detail.value
    })
  },

  //获取输入的手机号，以供发验证码
  getPhoneValue: function(e) {
    var _this = this;
    _this.setData({
      phone: e.detail.value,
      "form.tel": e.detail.value,
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


    var a = this.data.form.tel;
    var _this = this;
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
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
    }
    //获取验证码
    if (a != null && a != '') {
        api.sendCode(this.data.form.tel,14).then(res=>{
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
  
      
   } else {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 1000
      })
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
    var url = App.globalData.URL;
    util.createPhoto(c, that, url) //截取图片
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
                fileType: 'jpg',
                fileType: 'jpg',
                quality: 0.7,
                success(res) {
                  //这里是将图片上传到服务器中并识别
                  //console.log(res.tempFilePath)

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
                    //console.log(that.data.takephoto.tempImage) //请上传这个图片并调用身份证识别
                  } else if (c == "yyzz_take") {
                    wx.showToast({
                      title: "智能识别中...",
                      icon: 'loading',
                      duration: 20000
                    })
                    wx.uploadFile({
                      url: App.globalData.URL + "upload", // 仅为示例，非真实的接口地址
                      filePath: that.data.takephoto.tempImage,
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
                            'form.orgAddress': result.rE_ADDRESS,
                            "form.province": province,
                            "form.city": city,
                            'form.provinceCode': result.rE_REGISTER_ID.substring(2, 4),
                            'form.cityCode': result.rE_REGISTER_ID.substring(2, 6),
                            "provinceName": province,
                            "cityName": city,
                            //'form.faren': result.rE_LEGAL_REPRESENTATIVE,
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
                    //console.log(that.data.takephoto.tempImage) //请上传这个图片并调用营业执照识别
                  }
                }
              })
            }, 1000)

          }
        });
      },
      fail: (res) => {
        //console.log(res)
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
    //console.log(e.detail)
  },
  //手写input绑定form值
  blur(e) {
    let idname = e.target.id;

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
    } else if (idname == "jine") {
      this.setData({
        "form.jine": e.detail.value
      })
    } else if (idname == "city") {
      this.setData({
        "form.city": e.detail.value
      })
    } else if (idname == "orgAddress") {
      this.setData({
        "form.orgAddress": e.detail.value
      })
    } else if (idname == "idCard") {
      this.setData({
        "form.idCard": e.detail.value
      })
    } else if (idname == "name") {
      this.setData({
        "form.name": e.detail.value
      })
    } else if (idname == "faren") {
      this.setData({
        "form.faren": e.detail.value
      })
    } else if (idname == "tel") {
      this.setData({
        "form.tel": e.detail.value
      })
    }
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

  blurCity: function(e) {
    var that = this;
    var provinceID = e.detail.value.substring(2, 4);
    var cityID = e.detail.value.substring(2, 6);
    var province = that.data.org_cities[provinceID];
    var city = that.data.org_cities[cityID];
    that.setData({
      "form.orgID": e.detail.value,
      "form.province": province,
      "form.city": city,
      'form.provinceCode': provinceID,
      'form.cityCode': cityID,
      "provinceName": province,
      "cityName": city
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
  bindRencaiPickerChange: function(e) {
    this.setData({
      rencaiIndex: e.detail.value
    })
  },
  bindRencaiPickerColumnChange: function(e) {

    var data = {
      rencaiList: this.data.rencaiList,
      rencaiIndex: this.data.rencaiIndex,
    };
    data.rencaiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.rencaiIndex[0]) {
          case 0:
            data.rencaiList[1] = ['专业大户'];
            this.setData({
              'form.type': data.rencaiIndex[0] + 1
            })
            break;
          case 1:
            data.rencaiList[1] = ['省级示范家庭农场', '市级示范家庭农场', '县(区)级示范家庭农场', '其它家庭农场'];
            this.setData({
              'form.type': data.rencaiIndex[0] + 1
            })
            break;
          case 2:
            data.rencaiList[1] = ['省级示范合作社', '市级示范合作社', '县(区)级示范合作社', '其它合作社'];
            this.setData({
              'form.type': data.rencaiIndex[0] + 1
            })
            break;
          case 3:
            data.rencaiList[1] = ['省级农业产业化龙头企业', '市级农业产业化龙头企业', '县(区)级农业产业化龙头企业', '其它农业产业化龙头企业'];
            this.setData({
              'form.type': data.rencaiIndex[0] + 1
            })
            break;
          case 4:
            data.rencaiList[1] = ['农业社会化服务组织'];
            this.setData({
              'form.type': data.rencaiIndex[0] + 1
            })
            break;
          case 5:
            data.rencaiList[1] = ['其它'];
            this.setData({
              'form.type': data.rencaiIndex[0] + 1
            })
            break;
        }
        break;
    }
    this.setData(data);


  },
  prePage() {
    wx.navigateBack();
  },
  indexpage: function() {
    wx.switchTab({
        url: '/pages/shop/index2',
    });
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

    that.setData({
        bcindex: e.detail.value
      }),
      Org.getEnterpriseInfoByName(that.data.busiCardList[e.detail.value]).then(res=>{
        //console.log(res)
        that.setData({
            'form.orgID': res.ORG_CODE,
            'form.orgName': res.ORG_NAME,
            'form.officeAdd': res.ORG_ADDRESS,

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