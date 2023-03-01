
import WxValidate from '../../../assets/plugins/wx-validate/WxValidate';
var util = require('../../../utils/util.js');
import user from "../../../utils/user"
import api from "../../../utils/api"

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {
      tel: '',//电话
      verycode: '',
    },
    rederect_url: '',
    address: '',//联系地址
    preffixUrl: '',
    codename: '获取验证码',
    type: '',
    times: '',
    name1: '',
    idCard1: '',
    tel1: '',//判断信息是否重复
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.URL + 'selectreset', // 仅为示例，并非真实的接口地址
      data: {
        open_id: wx.getStorageSync('openid'),
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "key": (Date.parse(new Date())).toString().substring(0, 6),
      },
      success(res) {
        wx.hideLoading()
        //console.log(res.data)
        if (res.data.stringData == null || res.data.stringData == '' || res.data.stringData == undefined) {
        } else {
          // wx.showModal({
          //   title: '提示',
          //   content: "您已提交过审核,请等待管理员审核后再次修改",
          //   showCancel: false,//是否显示取消按钮
          //   success: function (res) {
          //    wx.switchTab({
        //     url: '/pages/shop/index2',
        // });
          //   },
          //   fail: function (res) { },//接口调用失败的回调函数
          //   complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
          // })
        }
      }
    })
    user.getCustomerInfo().then(res=>{
        this.setData({
            name1: res.REAL_NAME,
            idCard1: res.ID_CARD,
            tel1: res.TEL,
          });
    })
   
    this.setData({
      preffixUrl: app.globalData.URL,
    });
    if (options.url != undefined && options.url != null) {
      this.setData({
        rederect_url: options.url,
        type: options.type
      })
    }
    this.initValidate();
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
    wx.hideToast();
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
  submitForm(e) {
    var that = this;
    const params = e.detail.value;
    const fId = e.detail.formId;

    

    // let data = JSON.stringify({
    //   REAL_NAME: that.data.name1,
    //   ID_CARD: that.data.idCard1,
    //   TEL: params.tel,
    //   OPEN_ID: wx.getStorageSync('openid'),
    // });
    // //console.log('00000000')
    // //console.log(data)
    // data = util.enct(data) + util.digest(data);
    if (params.verycode != null || params.verycode != '') {
      var reg = /^\d{6}$/;
      if (!reg.test(params.verycode)) {
        wx.showToast({
          title: '请输入6位数字验证码',
          icon: 'none',
          duration: 2000
        })
        return;
      }
    } else {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    //本页面已停用 若启用请补充完整
   
    // wx.request({
    //   url: app.globalData.URL + 'addWxPhone',
    //   data: {
    //     phone: params.tel,
    //     openid: wx.getStorageSync("openid"),
    //     code: params.verycode,
    //   },
    //   header: {
    //     "Content-Type": "application/x-www-form-urlencoded",
    //     "key": (Date.parse(new Date())).toString().substring(0, 6),

    //   },
    //   method: 'POST',
    //   success(res) {
    //     //console.log(res);
    //     var msg = res.data.msg

    //     if(msg == '查询成功'){
    //       msg = '修改成功'
    //     }
    //     wx.showToast({
    //       title: msg,
    //         icon: 'none',
    //         duration: 2000,
    //         complete:function(){
    //           setTimeout(function () {
    //             //要延时执行的代码
    //             wx.navigateTo({
    //               //url: 'set_2?url=' + this.data.url + '&type=' + this.data.type,
    //               url: '../auth/index'//?talentname=' + e.currentTarget.dataset.name,
    //             })
    //           }, 2000)
              
    //         }
    //       })

        
    //     // if (res.data.code == 1) {
    //     //   that.setData({
    //     //     mobile: num,
    //     //     showNon2: true
    //     //   })
    //     // }

    //   },
    //   error(res) {
    //     //console.log(res)
    //   }
    // })
    
   
      // wx.showLoading({
      //   title: '提交中...',
      //   mask: true
      //})
      // wx.request({
      //   url: app.globalData.URL + 'author2', // 仅为示例，并非真实的接口地址
      //   data: {
      //     data: data,
      //     code: params.verycode,
      //     phone: params.tel
      //   },
      //   method: 'POST',
      //   header: {
      //     "Content-Type": "application/x-www-form-urlencoded",
      //     "key": (Date.parse(new Date())).toString().substring(0, 6),
      //     "sessionId": wx.getStorageSync("sessionid"),
      //     "transNo": 'XC016'
      //   },
      //   success(res) {
      //     //console.log('33333333')
      //     //console.log(res)
      //     //console.log('44444444')
      //     //console.log(res.data.msg)
      //     var result = res;
      //     var msg = res.data.msg == undefined || res.data.msg == null ? "认证失败！" : res.data.msg;
      //     if (res.data.msg == '手机号绑定成功') {
      //       var msg = "手机号绑定成功"
      //     }
      //     wx.hideLoading();
      //     wx.showModal({
      //       title: '提示',
      //       content: msg,
      //       showCancel: false,//是否显示取消按钮
      //       success: function (res) {
      //         if (result.data.code == 1) {
      //           if (that.data.rederect_url != undefined && that.data.rederect_url != null && that.data.rederect_url != '' && that.data.type == '1') {
      //             wx.redirectTo({
      //               url: that.data.rederect_url,
      //             })
      //           } else {
      //             wx.navigateBack({})
      //           }
      //         }
      //       },
      //       fail: function (res) { },//接口调用失败的回调函数
      //       complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
      //     })
      //   }, fail() {
      //     wx.hideLoading();
      //     wx.showToast({
      //       title: '网络异常',
      //       icon: 'none',
      //       duration: 2000
      //     })
      //   }
      // })
    

  },

  //前端校验匹配
  initValidate() {
    const rules = {
      // name: {
      //   required: true,
      //   name: true,
      // },
      tel: {
        required: true,
        tel: true,
      },
      // idCard: {
      //   required: true,
      //   idcard: true,
      // },
    }
    // 验证字段的提示信息，若不传则调用默认的信息
    const messages = {
      // name: {
      //   required: '请输入姓名',
      //   name: '姓名只能是中文名',
      // },
      // idCard: {
      //   required: '请输入身份证号码',
      //   idcard: '请输入正确的身份证号码',
      // },
      tel: {
        required: "请输入手机号",
        tel: "请输入正确的手机号",
      },
      verycode: {
        required: '请输入手机验证码',
        verycode: '9'
      },
    }

    // 创建实例对象
    this.WxValidate = new WxValidate(rules, messages)
  },
  blur(e) {
    let that = this;
    let idname = e.target.id;
    if (idname == "name") {
      this.setData({
        "form.name": e.detail.value
      })
    } else if (idname == "idCard") {
      this.setData({
        "form.idCard": e.detail.value
      })
    } else if (idname == "tel") {
      this.setData({
        "form.tel": e.detail.value
      })
    } else if (idname == "verycode") {
      this.setData({
        "form.verycode": e.detail.value
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
  //获取输入的手机号，以供发验证码
  getPhoneValue: function (e) {
    var _this = this
    _this.setData({
      'form.tel': e.detail.value,
    })
  },
  //获取输入的验证码
  getCodeValue: function (e) {
    this.setData({
      'from.verycode': e.detail.value,
    })
  },

  //校验手机号、后台发送验证码至手机
  getCode: function () {
    var a = this.data.form.tel;
    var _this = this;
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    if (a == null || a == "") {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000
      })
      setTimeout(function () {
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
      setTimeout(function () {
        _this.setData({
          codename: '获取验证码',
          disabled: false
        }, 3000)
      })
      return false;
    } else {
      ////console.log(this.data.phone)
      api.sendCode(a,99).then(res=>{
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
})