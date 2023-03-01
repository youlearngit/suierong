import WxValidate from "../../../assets/plugins/wx-validate/WxValidate";
import Org from '../../../api/Org';
const util = require('../../utils/util');
import http from '../../utils/requsetP.js';
import requestYT from '../../../api/requestYT';
var app = getApp();
var encr = require('../../utils/encrypt.js'); //国密3段式加密
var aeskey = encr.key //随机数
var that;
/**
 * 
  *2022823新增: 对公授权模块
 */
Page({
    data: {
        submit: false,
        coverHidden: true,
        borrow_name: "",
        searchTime:true,
        auth_cert_type_array: [
            '身份证',
            // '户口薄',
            // '护照',
            // '军官证',
            // '士兵证',
            // '港澳居民来往内地通行证',
            // '台湾同胞来往内地通行证',
            // '临时身份证',
            // '外国人居留证',
            // '警官证',
            // '香港身份证',
            // '澳门身份证',
            // '台湾身份证',
            // '其他证件',
        ],
        auth_cert_type: '',
        business_type: 0, //业务类型
        business_id: '', //当前业务id
        page: -1, //0是查询详细页面  1是添加页面,
        auth_Info: {}, //接收授权人信息
        borrowData: {}, //接收借款人信息
        preffixUrl: '',
        sqrName: '', //输入的授权人姓名
        iDNumInput: '', //输入的证件号码
        BInfo:{}, //申请企业信息
        mangerInfo:{},//客户经理信息

        //是否是否授权他人办理开户
        legalIssq: false,//法定代表人是否授权他人办理开户
        legalIssqSelectItems:[
          {value:'0',name:'否',checked: 'true'},
          {value:'1',name:'是',}
        ],
        anthNameInputType:'',
    },
    beback() {
        this.setData({
            coverHidden: true
        })
    },
    //企业工商信息查询
    ed0161(e) {
         //第三方授权企业不查询
        if(that.data.anthNameInputType == 'empower'){
          that.setData({
            'borrowerInfo.empower_company': e.currentTarget.dataset.name,
            coverHidden: true
          });
          return;
        }
        that.setData({
          enterprise_name: e.currentTarget.dataset.name,
          inputCom: e.currentTarget.dataset.name,
          coverHidden: true
       })
        var dataJson = JSON.stringify({
            name: that.data.enterprise_name,
            deptName: '风险管理部',
            productNo: '090014'
        })
        var custnameTwo = encr.jiami(dataJson, aeskey) //3段加密
        wx.request({
            url: app.globalData.creditUrl + 'getEnterpriseIcData.do',
            data: encr.gwRequest(custnameTwo),
            method: 'POST',
            header: {
                'content-type': 'application/json', // 默认值
            },
            success(res) {
                if (res.data.head.H_STATUS === "1") {
                    var jsonData = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文
                      that.getSignCode('1',jsonData.ENT_INFO[0].CREDITCODE).then(res=>{
                        if(res.status == 'success'){
                            //获取中证码成功返现工商信息
                                that.setData({
                                    credit_code: jsonData.ENT_INFO[0].CREDITCODE,
                                    'borrowerInfo.ENTERPRISE_NAME': jsonData.ENT_INFO[0].ENTNAME,
                                    'borrowerInfo.CREDIT_CODE': jsonData.ENT_INFO[0].CREDITCODE,
                                    'borrowerInfo.REGISTRATION_NO': jsonData.ENT_INFO[0].REGNO,
                                    'borrowerInfo.ENTERPRISE_CODE': jsonData.ENT_INFO[0].ORGCODES,
                                    'borrowerInfo.signCode': res.signCode
                                })
                        }else{
                          //获取中证码,组织机构代码
                          that.getSignCode('2',jsonData.ENT_INFO[0].ORGCODES).then(res=>{
                            if(res.status == 'success'){
                                //获取中证码成功返现工商信息
                                    that.setData({
                                        credit_code: jsonData.ENT_INFO[0].CREDITCODE,
                                        'borrowerInfo.ENTERPRISE_NAME': jsonData.ENT_INFO[0].ENTNAME,
                                        'borrowerInfo.CREDIT_CODE': jsonData.ENT_INFO[0].CREDITCODE,
                                        'borrowerInfo.REGISTRATION_NO': jsonData.ENT_INFO[0].REGNO,
                                        'borrowerInfo.ENTERPRISE_CODE': jsonData.ENT_INFO[0].ORGCODES,
                                        'borrowerInfo.signCode': res.signCode
                                    })
                            }else{
                              that.setData({
                                'borrowerInfo.CREDIT_CODE': '',
                                'borrowerInfo.REGISTRATION_NO': '',
                                'borrowerInfo.ENTERPRISE_CODE': '',
                                'borrowerInfo.signCode': '',
                              });
                              wx.showToast({
                                title: '该客户无有效中征码',
                                icon: 'none'
                              }) 
                            }
                         })
                        }
                      }).catch(err=>{
                        that.getSignCode('2',jsonData.ENT_INFO[0].ORGCODES).then(res=>{
                          if(res.status == 'success'){
                              //获取中证码成功返现工商信息
                                  that.setData({
                                      credit_code: jsonData.ENT_INFO[0].CREDITCODE,
                                      'borrowerInfo.ENTERPRISE_NAME': jsonData.ENT_INFO[0].ENTNAME,
                                      'borrowerInfo.CREDIT_CODE': jsonData.ENT_INFO[0].CREDITCODE,
                                      'borrowerInfo.REGISTRATION_NO': jsonData.ENT_INFO[0].REGNO,
                                      'borrowerInfo.ENTERPRISE_CODE': jsonData.ENT_INFO[0].ORGCODES,
                                      'borrowerInfo.signCode': res.signCode
                                  })
                          }else{
                            that.setData({
                              'borrowerInfo.CREDIT_CODE': '',
                              'borrowerInfo.REGISTRATION_NO': '',
                              'borrowerInfo.ENTERPRISE_CODE': '',
                              'borrowerInfo.signCode': '',
                            });
                            wx.showToast({
                              title: '该客户无有效中征码',
                              icon: 'none'
                            }) 
                          }
                       }).catch(err=>{
                        that.setData({
                          'borrowerInfo.CREDIT_CODE': '',
                          'borrowerInfo.REGISTRATION_NO': '',
                          'borrowerInfo.ENTERPRISE_CODE': '',
                          'borrowerInfo.signCode': '',
                        });
                        wx.showToast({
                          title: '该客户无有效中征码',
                          icon: 'none'
                        }) 
                       })
                      });
                } else {
                    wx.showToast({
                        title: '企业工商查询：' + res.data.head.H_MSG,
                        icon: 'none'
                    })
                }
            }
        })
    },
    //输入企业名称
    getInput(e) {
        that.setData({
            anthNameInputType: e.target.dataset.type,
            inputCom: e.detail.value
        })
        if(that.data.searchTime){
            that.setData({
             searchTime:false
            })
            setTimeout(() => {
             that.setData({
                 searchTime:true
                })  
            }, 500);
            if(e.detail.value!=''){
             that.searchkey()
 
            }else{
               that.setData({
                 coverHidden:true
               }) 
            }
        }
        
    },
    //模糊查询企业列表
    searchkey() {
        that.setData({
            credit_code: '',
            registration_no: '',
            enterprise_code: '',
        })
        var dataJson = JSON.stringify({
            keyWord: that.data.inputCom
        })
        var custnameTwo = encr.jiami(dataJson, aeskey) //3段加密

        wx.request({
            url: app.globalData.creditUrl + 'getQyName.do',
            data: encr.gwRequest(custnameTwo),
            method: 'POST',
            header: {
                'content-type': 'application/json', // 默认值
            },
            success(res) {
                if (res.data.head.H_STATUS === "1") {
                    var jsonData = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文
                    if (jsonData.entNamesList) {
                        that.setData({
                            selectComList: jsonData.entNamesList
                        })
                    } else {
                        wx.showToast({
                            title: '系统异常',
                            icon: 'none'
                        })
                    }
                }
                if (that.data.coverHidden) {
                    if (that.data.selectComList.length == 0) {
                        wx.showToast({
                            title: '暂无数据',
                            icon: 'none'
                        })
                        return;
                    }
                    that.setData({
                        coverHidden: false
                    })
                }

            }
        })

    },
    submitForm(e) {
        console.log(e,'表单内容');
        console.log(wx.getStorageSync('enterprise'),'上一页面选择公司');
        console.log(e.detail.value.auth_name,'姓名');
        console.log(e.detail.value.auth_cert_no,'证件号码');
        that.setData({sqrName : e.detail.value.auth_name});
        that.setData({iDNumInput : e.detail.value.auth_cert_no});
        if (that.data.submit) {
            wx.showToast({
                title: '操作频繁，请稍后',
                icon: 'none',
                duration: 2000
            })
            setTimeout(res => {
                that.setData({
                    submit: false
                })
            }, 5000)
            return;
        }
        that.setData({
            submit: true
        })
        wx.showLoading({
            title: '保存中',
            mask: true
        })

        const params = e.detail.value;
        //对公授信-借款企业类型判断：借款企业信息需与授权企业一致
        if(that.data.business_type == '1' && wx.getStorageSync('business3') != ''){
          var busInfo = JSON.parse(wx.getStorageSync('business3'));
          if(
            busInfo.enterprise_name != params.ENTERPRISE_NAME || 
            busInfo.credit_code != params.credit_code || 
            busInfo.enterprise_code != params.enterprise_code || 
            busInfo.registration_no != params.registration_no
           ){
            wx.showToast({
              title: '借款企业信息与授权企业信息不一致，请检查后提交！',
              icon: 'none'
            }) 
            return;
          }
        }
          //中征码校验
        if(that.data.borrowerInfo.signCode == ''){
          wx.showToast({
            title: '该客户无有效中征码',
            icon: 'none'
          }) 
          return;
        }
        //是否授权第三方校验
        if(that.data.legalIssq && that.data.borrowerInfo.empower_company == ''){
          wx.showToast({
            title: '请填向写第三方提供信用报告信息！',
            icon: 'none'
          })
          return;
        }
        if (!this.WxValidate.checkForm(params)) {
            const error = this.WxValidate.errorList[0];
            wx.hideLoading({
                success: (res) => {},
            })
            wx.showToast({
                title: error.msg,
                icon: 'none'
            })
        } else {
            //检查身份信息
            that.compareName(params.auth_name,params.auth_cert_no).then(res => {
              //工商校验身份信息与公司
              that.ED0293(params.ENTERPRISE_NAME,params.auth_cert_no,params.auth_name).then(res=>{
                that.sendForm(params);
              }).catch(err=>{
                //封装方法中处理过了，所以这里不用写
              })   
            }).catch(err => {
              wx.showToast({
                title: err.chk_issue,
                icon: 'none'
              }) 
          })
        }
    },
    //中证码查询
    getSignCode(entType,entCode){
      return new Promise((resolve, reject) => {
        let data = {
          signCodeTypeID: '3013979', //中证码查询身份标识  3013979,境内企业、3013980,境外企业、3013981,自然人
          entTypeID: entType == '1' ? '1001047' : '1000724', //企业证件类型 1001047,统一信用码、 1000724，社会组织机构代码
          entCertNum: entCode, //企业证件号码
          nationalityID: '3008222', //国别
          // operateUserId: that.data.mangerInfo.USERIDLIST[0].USERID, //业务经理id
          operateUserId: '19010384', //业务经理id 测试
          operateOrgId: that.data.mangerInfo.LIST[0].ORGCODE//业务经理机构
        }
        let str = JSON.stringify(data);
        let custnameTwos = encr.jiami(str, aeskey)
        wx.request({
            url: app.globalData.creditUrl + 'crqz001.do',
            data: encr.gwRequest(custnameTwos),
            method: 'POST',
            header: {
                'content-type': 'application/json',
            },
            success(res) {
                if (res.data.head.H_STATUS === "1") {
                  var resJson = encr.aesDecrypt(res.data.body, aeskey);
                  if(resJson.result_code == '0000' && resJson.signCode != ''){
                    resolve({
                      status: 'success',
                      signCode: resJson.signCode
                    });
                  }else{
                    reject({
                      status: 'fail',
                      signCode: ''
                    });
                  }
                }else{
                  wx.hideLoading({
                    success: (res) => {
                      reject({
                        status: 'fail',
                        signCode: ''
                      });
                    },
                  })
                }
            },
            catch(err) {
              wx.hideLoading({
                success: (res) => {
                  reject({
                    status: 'fail',
                    code: ''
                  });
                },
              })
            }
        });
      });
      
    },
     //查询客户经理
    getorgcode() {
      return new Promise((resolve, reject) => {
          let options = {
            url: 'customer/getcustomer.do',
            data: JSON.stringify({
              openId: that.data.BInfo.OPENID,
              version: util.formatTime4(new Date()),
            }),
          };
          requestYT(options).then(res=>{
            if (res.STATUS === '1' && res.resultVo.code === 1) {
              var jsonData= res.resultVo.data[0];
              if (jsonData.ID_CARD == "" || jsonData.ID_CARD == undefined) {
                reject();
                return;
               }
              let m = JSON.stringify({
                  idcard: jsonData.ID_CARD
              })
              let l = encr.jiami(m, aeskey)
              wx.request({
                  url: app.globalData.creditUrl + 'getorgcode.do',
                  data: encr.gwRequest(l),
                  method: 'POST',
                  success(res) {
                      var jsonData = encr.aesDecrypt(res.data.body, aeskey)
                      if (jsonData.LIST) {
                          that.setData({
                            mangerInfo:jsonData
                          });
                          resolve();
                      } else {
                          reject();
                      }
                  }
              })
            }
          });
          
      })
    },
    getBorrowInfo(id) {
      return new Promise((resolve,reject)=>{
          if (id == undefined) {
              resolve()
              return;
          }
          var dataJsons = JSON.stringify({
              id: id,
          })
          var custnameTwos = encr.jiami(dataJsons, aeskey) //3段加密
          wx.request({
              url: app.globalData.creditUrl + 'getBizVoById.do',
              data: encr.gwRequest(custnameTwos),
              method: 'POST',
              success: (res => {
                  if (res.data.head.H_STATUS === "1") {
                      let jsonData = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文
                      var data2 = jsonData.LIST;
                      that.setData({
                          BInfo: data2[0]
                      });
                      resolve()

                  }else{
                      reject()
                  }
              })
          })
      })
    },
    //表单提交
    sendForm(params){
      let url = app.globalData.creditUrl + 'comAddCompany.do'
      var page = this.data.page;
      console.log("提交business_id ：" + this.data.business_id);
      params.business_id = this.data.business_id;
      params.id = this.data.auth_Info.ID;
      params.AUTH_ENTER_NAME = params.ENTERPRISE_NAME;
      params.AUTH_ENTER_CODE = params.credit_code;
      params.AUTH_ENTER_NO = params.registration_no;
      params.AUTH_ENTER_ORGNO = params.enterprise_code;
      params.BOR_PER_NAME = params.auth_name;
      params.BOR_PER_TYPE = this.data.auth_cert_type;
      params.BOR_PER_CODE = params.auth_cert_no;
      params.EMPOWER = that.data.legalIssq ? '1':'0';
      params.EMPOWER_COMPANY = that.data.legalIssq ? that.data.borrowerInfo.empower_company : '';
      params.SIGN_CODE = that.data.borrowerInfo.signCode;
      //类型若是本人判断是否一致(对公不判断)
      params.remark2 = '';
      params.remark4 = that.data.business_type;
      let vo = params;
      let str = JSON.stringify({
          data: JSON.stringify(vo)
      });
      let custnameTwos = encr.jiami(str, aeskey)
      wx.request({
          url: url,
          data: encr.gwRequest(custnameTwos),
          method: 'POST',
          header: {
              'content-type': 'application/json',
          },
          success(res) {
              if (res.data.head.H_STATUS === "1") {
                if(page == 1){
                  that.toAuthListPage();
                }else{
                  wx.showToast({
                    title: '保存成功',
                    icon: 'success',
                    duration: 1000,
                    mask: true,
                    success: res => {
                        setTimeout(function() {
                          that.setData({
                            submit: false
                          })
                        });
                    }
                  });
                }
              } else {
                  wx.showToast({
                      title: '请检查网络',
                      icon: 'none'
                  })
              }
          },
          fail(res){
              console.log(res,'失败')
          }
      })
    },
    toAuthListPage(){
      wx.showToast({
        title: '保存成功',
        icon: 'success',
        duration: 1000,
        mask: true,
        success: res => {
            setTimeout(function() {
                that.setData({
                    submit: false
                })
                wx.redirectTo({
                    url: '../creditInfo/authList?business_type=' +that.data.business_type +
                        '&business_id=' +that.data.business_id + 
                        '&credit_code=' + that.data.credit_code + 
                        '&type=1',
                });
            }, 1000);
        },
      });
    },
    //ED0293公司法人校验
    ED0293(enterprise,iDNumInput,name){
      return new Promise((resolve, reject) => {
        Org.getEnterpriseInfoNewC({
          entmark1: enterprise,
          name: name,
          emc: iDNumInput,
          deptName: '风险管理部',
          productNo: "090014",
        }).then((res) => {
          if(res.relation == ''){
            wx.hideLoading({
                success: (res) => {
                  wx.showToast({
                    title: `${res.msg}`,
                    icon: 'none'
                  });
                  reject();
                },
            })
          }else if(res.relation !== ''){
            var verifyResult = (JSON.parse(res.relation))[0];
            
              if (verifyResult.matched !=='1' ||  verifyResult.id !=='1' || verifyResult.name !=='1' ){
                  wx.showToast({
                      title: '上传身份信息与工商登记信息不一致,请选择正确信息',
                      icon: 'none'
                  })
                  reject();
              }else{
                resolve();
              }
          }
        }).catch(err=>{
          wx.hideLoading({
            success: (res) => {
              wx.showToast({
                title: err,
                icon: 'none'
              });
              reject();
            },
        })
        });
      });
    },
    //公司名称模糊查询
    compareName(name,certNo) {
        return new Promise((resolve, reject) => {
            var data1 = JSON.stringify({
                cust_name: name,
                cust_id: certNo,
                cust_addr: '1',
                cust_sex: '1',
                nation: '1',
                birthday: '00000000',
                is_agent: '0',
                busicode: '02'
            })
            var custnameTwos1 = encr.jiami(data1, aeskey)
            wx.request({
                url: app.globalData.creditUrl + 'compareIdName.do',
                data: encr.gwRequest(custnameTwos1),
                method: 'POST',
                header: {
                    'content-type': 'application/json',
                },
                success(res) {
                    if (res.data.head.H_STATUS === "1") {

                        var jsonData = encr.aesDecrypt(res.data.body, aeskey)

                        if (jsonData.chk_result == '00'|| jsonData.chk_result == '01') {
                            resolve(jsonData);
                        } else {
                            reject(jsonData);
                        }
                    } else {
                        reject(res);
                    }
                }
            })
        })
    },
    authorizationSelectChange: function(e){
      this.setData({
        legalIssq:  e.detail.value == '1'
      });
    },
    pickChange(e) {
        let data = "";
        wx.hideKeyboard()
        switch (e.currentTarget.dataset.type) {
            case "borrow_cert_type":
                data = "borrow_cert_type";
                break;
            case "auth_cert_type":
                data = "auth_cert_type";
                break;
            default:
                break;
        }
        that.setData({
            [data]: e.detail.value,
        });
    },
    changeBorrow(params) {
        let borPar = params;
        borPar.id = that.data.business_id;
        borPar.BORROW_CERT_TYPE = that.data.borrow_cert_type
        let str = JSON.stringify({
            data: JSON.stringify(borPar)
        });
        var custnameTwo = encr.jiami(str, aeskey)
        wx.request({
            url: app.globalData.creditUrl + 'chgBorrower.do',
            data: encr.gwRequest(custnameTwo),
            method: 'POST',
            header: {
                'content-type': 'application/json',
            },
            success(res) {
                if (res.data.head.H_STATUS === "1") {}
            }
        })


    },
    //下拉框动态绑定数据
    bindPickerChange(e) {
        var that = this;
        let id = e.currentTarget.id;
        if (id == 'auth_cert_type') {
            that.setData({
                auth_cert_type: e.detail.value,
            });
        } 
    },
    toChange(id) {
        var dataJsons = JSON.stringify({
            data: JSON.stringify({
                id: id,
                is_push: '1'
            })
        })
        var custnameTwos = encr.jiami(dataJsons, aeskey) //3段加密
        wx.request({
            url: app.globalData.creditUrl + 'updataPerson.do',
            data: encr.gwRequest(custnameTwos),
            method: 'POST',
            header: {
                'content-type': 'application/json', // 默认值
            },
            success(res) {
                if (res.data.head.H_STATUS === "1") {

                    wx.showToast({
                        title: '已做失效处理',
                        icon: 'success',
                        duration: 5000,
                        success: res => {
                            setTimeout(function() {
                                wx.redirectTo({
                                    url: '../creditInfo/authList?business_type=' +
                                        that.data.business_type +
                                        '&business_id=' +
                                        that.data.business_id +
                                        '&credit_code=' + that.data.credit_code,
                                });
                            }, 1000);
                        },
                    });
                } else {
                    wx.showToast({
                        title: '删除失败',
                        icon: 'none',
                        duration: 2000,
                    })
                }
            }
        })
    },
    onLoad(e) {
        that = this;
        if (wx.getStorageSync('openid') === '') {
            app.getSessionInfo().then(res => {})
        }
        this.setData({
            preffixUrl: app.globalData.JSBURL,
        });
        //获取授权方信息
        if (e.page == 0) {
          that.getAuth(e.business_id,1);
        }
        this.setData({
            business_id: e.business_id,
            business_type: e.business_type,
            page: e.page,
            credit_code: e.credit_code
        });
        that.getBorrowInfo(e.business_id).then(res=>{
          that.getorgcode();
        })
        this.initValidate();
    },
    //获取授权人信息
    getAuth(business_id,type) {
      var dataJsons = JSON.stringify({
          bizId: business_id,
          type: type
      })
      var custnameTwos = encr.jiami(dataJsons, aeskey) //3段加密
      wx.request({
          url: app.globalData.creditUrl +'getAuthList.do', //根据对公、个人类型，调用不同查询授权方信息接口
          data: encr.gwRequest(custnameTwos),
          method: 'POST',
          success: (res => {
              if (res.data.head.H_STATUS === "1") {
                  let jsonData = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文
                  var data = jsonData.LIST==undefined?[]:jsonData.LIST;
                  let auth_Info = data[0];//获取第一个信息
                  var b_info = {
                    AUTH_NAME: auth_Info.BOR_PER_NAME,
                    AUTH_CERT_TYPE: auth_Info.BOR_PER_TYPE,
                    AUTH_CERT_NO: auth_Info.BOR_PER_CODE,
                  }
                  var a_info={
                    ENTERPRISE_NAME: auth_Info.AUTH_ENTER_NAME,
                    CREDIT_CODE: auth_Info.AUTH_ENTER_CODE,
                    REGISTRATION_NO: auth_Info.AUTH_ENTER_NO,
                    ENTERPRISE_CODE: auth_Info.AUTH_ENTER_ORGNO,
                    empower_company: auth_Info.EMPOWER_COMPANY
                  }
                  this.setData({
                      auth_Info: b_info,
                      borrowerInfo: a_info,
                      auth_cert_type: auth_Info.BOR_PER_TYPE,
                      legalIssq : auth_Info.EMPOWER == '1'
                  });
                  let {legalIssqSelectItems} = that.data;
                  legalIssqSelectItems.forEach(element => {
                    element.checked = (element.value == auth_Info.EMPOWER)
                  });
                  that.setData({
                    legalIssqSelectItems
                  });
                  that.setData({
                      authData: data,
                  });
              } else {
                  $Toast({
                      content: '请检查网络',
                      type: 'warning',
                      duration: 1,
                  });
              }
          })
      })
    },
    initValidate() {
        //business_type为1,2时
        const rules1 = {
            auth_name: {
                required: true,
                // name: true,
            },
            auth_cert_type: {
                required: true,
            },
            auth_cert_no: {
                required: true,
                // idcard:true
            },
        };
        const messages1 = {
            auth_name: {
                required: '请输入用户名',
            },
            auth_cert_type: {
                required: '请选择证件类型',
            },
            auth_cert_no: {
                required: '请输入证件号码',
            },
        };
        //business_type为3时
        const rules2 = {
            auth_name: {
                required: true,
                // name: true,
            },
            auth_cert_type: {
                required: true,
            },
            auth_cert_no: {
                required: true,
                // idcard: true
            },
        };
        const messages2 = {
            auth_name: {
                required: '请输入用户名',
            },
            auth_cert_type: {
                required: '请选择证件类型',
            },
            auth_cert_no: {
                required: '请输入证件号码',
            },
        };
        if (this.data.business_type == 3) {
            this.WxValidate = new WxValidate(rules2, messages2);
        } else {
            this.WxValidate = new WxValidate(rules1, messages1);
        }
    },

});