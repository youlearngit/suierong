import WxValidate from "../../../assets/plugins/wx-validate/WxValidate";
import Org from '../../../api/Org';
const util = require("../../utils/util");
import http from "../../utils/requsetP.js";
var app = getApp();
const {
    $Toast
} = require("../../dist/base/index");
var encr = require('../../utils/encrypt.js');
var aeskey = encr.key
import requestYT from '../../../api/requestYT';
var that;
Page({
    data: {
        sqrName: '',
        enterpriseName: '',//输入的企业名称
        iDNumInput:'',  //输入的证件号
        submitLim: false,
        ywlxIndex: 0,
        form: {
            yewu: '02'
        },
        searchTime:true,
        enterpriseFrIndex: '0',
        enterpriseFrType: ['法人企业', '非法人企业'],
        items: [{
                value: '否',
                name: '1',
                checked: true
            },
            {
                value: '是',
                name: '0',
                checked: false
            }
        ],
        yewulxtype_array: [{
                'id': '01',
                'name': '个人商用房贷款'
            }, {
                'id': '02',
                'name': '个人住房贷款'
            },
            {
                'id': '03',
                'name': '个人消费贷款'
            }, {
                'id': '05',
                'name': '其他'
            }
        ],
        auth_enterprise_type_array: [
            '借款人',
            '借款人配偶',
            '担保人'
        ],
        auth_enterprise_type: '',
        submit: false,
        formData: {},
        business_type: 0,
        is_same_person: 1,
        is_have_guarantor: 1,
        business_id: "",
        borrow_cert_type: "",
        enterprise_name: "",
        auth_cert_type: "0",
        preffixUrl: app.globalData.JSBURL,
        selectComList: [],
        inputCom: "",
        coverHidden: true,
        credit_code: '',
        registration_no: '',
        enterprise_code: "",
        borrow_cert_type_array: [
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
        radio: "0",
        ywlxIndex: 1,
        borTypeList: []
    },

    onLoad(e) {
        that = this;
        that.setData({
            business_type: e.business_type,
            preffixUrl: app.globalData.JSBURL,
        });
        if (wx.getStorageSync('openid') === '') {
            app
                .getSessionInfo()
                .then(res => {

                })
        }

        if (that.data.business_type == 1) {
            this.queryProduct().then(res => {
                let list = [];
                let data = res.LIST;
                data.forEach((item, index) => {
                    list.push(item.PRD_NAME)
                })
                that.setData({
                    borTypeList: list
                })
            }).catch(err => {
                $Toast({
                    content: "网络异常",
                    type: "warning",
                    duration: 1,
                });
            })
        }

        this.initValidate();
    },
    //下拉框动态绑定数据
    bindPickerChange(e) {
        let id = e.currentTarget.id;
        if (id == 'auth_type') {
            that.setData({
                auth_enterprise_type: parseInt(e.detail.value) + 1,
            });
            if (e.detail.value != 0) {
                that.setData({
                    is_have_guarantor: 0
                })
            } else {
                that.setData({
                    is_have_guarantor: 1
                })
            }
        } else {
            that.setData({
                enterpriseFrIndex: e.detail.value
            });
        }
    },

    bindChange(e) {
        let data = "";

        this.setData({
            is_same_person: e.detail.value,
        });
    },
    pickChangeyewu(e) {
        const value = parseInt(e.detail.value)
        wx.hideKeyboard()
        this.setData({
            'form.yewu': that.data.yewulxtype_array[value].id,
            ywlxIndex: value,
        })
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
            case "is_same_person":
                data = "is_same_person";
                break;
            case "is_have_guarantor":
                data = "is_have_guarantor";
                break;
            case "borrow_typeExtra":
                data = "borType";
                break;
            default:
                break;
        }
        that.setData({
            [data]: e.detail.value,
        });
    },
    beback() {
        this.setData({
            coverHidden: true
        })
    },
    searchkey() {

        that.setData({
            credit_code: '',
            registration_no: '',
            enterprise_code: '',
        })
        var dataJson = JSON.stringify({
            keyWord: that.data.inputCom
        })

        var custnameTwo = encr.jiami(dataJson, aeskey)
        wx.request({
            url: app.globalData.creditUrl + 'getQyName.do',
            data: encr.gwRequest(custnameTwo),
            method: 'POST',
            header: {
                'content-type': 'application/json',
            },
            success(res) {
                if (res.data.head.H_STATUS === "1") {
                    var jsonData = encr.aesDecrypt(res.data.body, aeskey)

                    if (jsonData.entNamesList) {
                        that.setData({
                            selectComList: jsonData.entNamesList
                        })
                    } else {
                        $Toast({
                            content: res.data.head.H_MSG,
                            type: "warning",
                            duration: 1,
                        });
                    }
                }
                if (that.data.coverHidden) {

                    if (that.data.selectComList.length == 0) {
                        $Toast({
                            content: "暂无数据",
                            type: "warning",
                            duration: 1,
                        });

                        return;
                    }
                    that.setData({
                        coverHidden: false
                    })
                }

            }
        })

    },
    getInput(e) {
        that.setData({
            inputCom: e.detail.value
        })
        if(e.detail.value==''){
            that.setData({
                coverHidden:true
              }) 
           }
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
           }
       }
       

    },
    ed0161(e) {
        wx.setStorageSync('enterprise', e.currentTarget.dataset.name)
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
        var custnameTwo = encr.jiami(dataJson, aeskey)
        wx.request({
            url: app.globalData.creditUrl + 'getEnterpriseIcData.do',
            data: encr.gwRequest(custnameTwo),
            method: 'POST',
            header: {
                'content-type': 'application/json',
            },
            success(res) {
                if (res.data.head.H_STATUS === "1") {
                    var jsonData = encr.aesDecrypt(res.data.body, aeskey)
                    if(jsonData.ENT_INFO==undefined){
                        wx.showToast({
                            title: '企业工商查询:暂无该单位信息！',
                            icon: 'none'
                        })
                        return;
                    }
                    that.setData({
                        credit_code: jsonData.ENT_INFO[0].CREDITCODE,
                        registration_no: jsonData.ENT_INFO[0].REGNO,
                        enterprise_code: jsonData.ENT_INFO[0].ORGCODES,
                    })

                } else {
                    wx.showToast({
                        title: '企业工商查询：' + res.data.head.H_MSG,
                        icon: 'none'
                    })
                }
            }
        })

    },
    //企业信息查询
    ed0079(){
      if(that.data.inputCom == '' || that.data.inputCom.length<6){
        wx.showToast({
          title: '请输入不低于长度为6的企业全名称',
          icon: 'none'
        })
        return;
      }
      var enterprise_name = that.data.inputCom;
      const options = {
        url: '/jsyh/getGsxx.do',
        data : {
          name: enterprise_name,
          deptName: '风险管理部',
          productNo: '090014'
        }
      };
      requestYT(options).then(res=>{
        if (res.ENT_INFO){
          wx.setStorageSync('enterprise', that.data.inputCom);
          var info = res.ENT_INFO[0];
          if (info.ENTNAME == enterprise_name) {
            that.setData({
              enterprise_name: info.ENTNAME,
              credit_code: info.CREDITCODE,
              registration_no: info.REGNO,
              enterprise_code: info.ORGCODES,
            });
            this.setData({coverHidden: true})
          }else if(info.JGMC == enterprise_name){
            that.setData({
              enterprise_name: info.JGMC,
              credit_code: '',
              registration_no: '',
              enterprise_code: info.JGDM,
            });
            this.setData({coverHidden: true})
          }else{
            this.setData({coverHidden: true})
            wx.showToast({
              title: '企业工商查询:暂无该单位信息！',
              icon: 'none'
            })
            return;
          }
        }else{
          this.setData({coverHidden: true})
          wx.showToast({
            title: '企业工商查询:暂无该单位信息！',
            icon: 'none'
          })
          return;
        }
      }).catch(err=>{
        this.setData({coverHidden: true})
        wx.showToast({
          title: '查询异常，请稍后再试',
          icon: 'none'
        })
      });
    },
    /**
     * 获取企业三码
     */
    getCode(e) {
        let name = e.detail.value;
    },

    /**
     * 提交表单
     */
    submitForm(e) {
        that.setData({enterpriseName : e.detail.value.enterprise_name});
        that.setData({sqrName : e.detail.value.borrow_name});
        that.setData({iDNumInput : e.detail.value.borrow_cert_no});
        if(that.data.business_type == '3'){
          const rules3 = {
            // enterprise_name: {
            //     required: true,
            //     orgName: true,
            // },
            credit_code: {
                required: true
            },
            enterpriseFrType: {
                required: true
            }
          };
          const messages3 = {
              // enterprise_name: {
              //     required: "请输入企业名称",
              // },
              credit_code: {
                  required: '请输入统一信用代码'
              },
              enterpriseFrType: {
                  required: "请选择企业类型",
              }
          };
          const rules3_1 = {
            enterpriseFrType: {
                required: true
            }
          };
          const messages3_1 = {
            enterpriseFrType: {
                required: "请选择企业类型",
            }
          };
          if(that.data.enterpriseFrIndex != '1'){
            //法人
            this.WxValidate = new WxValidate(rules3, messages3);
          }else{
            //非法人
            this.WxValidate = new WxValidate(rules3_1, messages3_1);
          }
        }
        
        if (that.data.submitLim) {
            wx.showToast({
                title: '操作频繁，请稍后',
                icon: 'none'
            })
            setTimeout(res => {
                that.setData({
                    submitLim: false
                })
            }, 6000)
            return;
        }
        that.setData({
            submitLim: true
        })
        let formData = that.data.formData;
        let params = e.detail.value;
        params.auth_type = '1'; //个人经营贷企业征信授权
        params.is_have_guarantor = '1';
        params.is_same_person = that.data.is_same_person;
        params.business_type = that.data.business_type;
        params.openid = wx.getStorageSync("openid");
        params.borrow_cert_type = that.data.borrow_cert_type;
        params.borrow_type = that.data.form.yewu;
        if (that.data.business_type == 1 && that.data.ywlxIndex == 3) {
            if (params.borrow_typeExtra == '') {
                $Toast({
                    content: "请选择贷款品种",
                    type: "warning",
                    duration: 2,
                });
                return;
            }
            params.borrow_type = that.data.form.yewu + params.borrow_typeExtra
        }
        that.setData({
            credit_code: params.credit_code
        })

        if (that.data.submit) {
            if (JSON.stringify(formData) == JSON.stringify(params)) {
                $Toast({
                    content: "请勿重复提交",
                    type: "warning",
                    duration: 1,
                });

                setTimeout(function() {
                    wx.redirectTo({
                        url: "../creditInfo/authList?business_type=" +
                            that.data.business_type +
                            "&business_id=" +
                            that.data.business_id,
                    });
                }, 1000);
                return;
            } else {
                wx.showModal({
                    title: "提示",
                    content: "数据已修改,是否保存",
                    success(res) {
                        //判断三码至少有一个
                        if (params.business_type == 3) {
                            let i = 0;
                            if (params.enterprise_code != "") {
                                i++;
                            }
                            if (params.credit_code != "") {
                                i++;
                            }
                            if (params.registration_no != "") {
                                i++;
                            }
                            if (i == 0) {
                                $Toast({
                                    content: "统一社会信用代码、工商注册号、组织机构代码，至少有一个不为空",
                                    type: "warning",
                                    duration: 2,
                                });

                                return;
                            }
                        }
                        if (res.confirm) {
                            params.id = that.data.business_id;
                            that.setData({
                                formData: params,
                            });
                            if (!that.WxValidate.checkForm(params)) {
                                const error = this.WxValidate.errorList[0];
                                $Toast({
                                    content: error.msg,
                                    type: "warning",
                                    duration: 1,
                                });

                            } else {
                                $Toast({
                                    content: "保存中",
                                    type: "loading",
                                    duration: 0,
                                    mask: true,
                                });
                                var dataJson = JSON.stringify({
                                    data: JSON.stringify(params)
                                })
                                var custnameTwo = encr.jiami(dataJson, aeskey)
                                wx.request({
                                    url: app.globalData.creditUrl + 'chgBorrower.do',
                                    data: encr.gwRequest(custnameTwo),
                                    method: 'POST',
                                    header: {
                                        'content-type': 'application/json',
                                    },
                                    success(res) {
                                        if (res.data.head.H_STATUS === "1") {
                                            var jsonData = encr.aesDecrypt(res.data.body, aeskey)
                                            that.setData({
                                                submit: true,
                                                formData: params,
                                                business_id: jsonData.id
                                            });
                                            $Toast.hide();
                                            wx.hideLoading({
                                                success: (res) => {},
                                            })
                                            wx.showToast({
                                                title: "保存成功",
                                                icon: "success",
                                                duration: 1000,
                                                mask: true,
                                                success: res => {
                                                    setTimeout(function() {
                                                        that.setData({
                                                            submitLim: false
                                                        })
                                                        wx.redirectTo({
                                                            url: "../creditInfo/authList?business_type=" +
                                                                that.data.business_type +
                                                                "&business_id=" +
                                                                that.data.business_id,
                                                        });
                                                    }, 1000);
                                                },
                                            });
                                        }
                                    }
                                })
                            }
                        } else if (res.cancel) {

                            wx.redirectTo({
                                url: "../creditInfo/authList?business_type=" +
                                    that.data.business_type +
                                    "&business_id=" +
                                    that.data.business_id,
                            });
                            return;
                        }
                    },
                });
            }
        } else {
            that.setData({
                formData: params,
            });
            //判断三码至少有一个
            if (params.business_type == 3) {
                let i = 0;
                if (params.enterprise_code != "") {
                    i++;
                }
                if (params.credit_code != "") {
                    i++;
                }
                if (params.registration_no != "") {
                    i++;
                }
                if(params.enterprise_name==''){
                    $Toast({
                        content: "企业名称不能为空",
                        type: "warning",
                        duration: 2,
                    });
                    return;
                }
                if (i == 0) {
                    $Toast({
                        content: "统一社会信用代码、工商注册号、组织机构代码，至少有一个不为空",
                        type: "warning",
                        duration: 2,
                    });
                    return;
                }
            }

            if (!this.WxValidate.checkForm(params)) {
                const error = this.WxValidate.errorList[0];
                $Toast({
                    content: error.msg,
                    type: "warning",
                    duration: 1,
                });

            } else {
                if (that.data.business_type == 2) {
                        that.compareName(params).then(res => {
                            that.saveBorrow(params);
                        }).catch(err => {
                            wx.showToast({
                                title: '身份信息验证失败，请输入正确的身份信息',
                                icon: 'none'
                            })
                        })
                   
                } else if (that.data.business_type == 1) {
                    //身份二要素关闭
                    that.saveBorrow(params);

                } else {
                    that.saveBorrow(params);
                }
            }
        }
    },
    //保存信息
    saveBorrow(params) {
        wx.showToast({
            title: "保存中",
            icon: "loading",
            image: "",
            duration: 1500,
            mask: true,
        });
        wx.setStorageSync('borrow_cert_no', params.borrow_cert_no == undefined ? '' : params.borrow_cert_no)
        that.saveBor(params)
            .then(res => {
                if (res.STATUS == "1") {
                    that.setData({
                        business_id: res.id,
                    });
                    if (that.data.business_type == 2 && that.data.is_same_person == '0') {
                        let param = {}
                        param.business_id = res.id;
                        param.auth_type = '0';
                        param.auth_cert_type = that.data.borrow_cert_type;
                        param.auth_name = params.borrow_name
                        param.auth_cert_no = params.borrow_cert_no;
                        param.remark2 = params.borrow_cert_no
                        param.remark4 = that.data.business_type

                        let str = JSON.stringify({
                            data: JSON.stringify(
                                param
                            )
                        });
                        console.log('saveAuthInfo')

                        let custnameTwos = encr.jiami(str, aeskey) //3段加密

                        wx.request({
                            url: app.globalData.creditUrl + 'saveAuthInfo.do',
                            data: encr.gwRequest(custnameTwos),
                            method: 'POST',
                            header: {
                                'content-type': 'application/json',
                            },
                            success(res) {

                                if (res.data.head.H_STATUS === "1") {
                                    let jsonData = encr.aesDecrypt(res.data.body, aeskey)
                                    if (jsonData.result == '1' && that.data.business_type == 2) {
                                        wx.showToast({
                                            title: '系统已有该授权信息，请勿重复提交',
                                            icon: 'none',
                                            duration: 5000
                                        })
                                        return;
                                    }

                                    that.setData({
                                        submit: true,
                                        formData: params,
                                    });
                                    wx.hideToast();
                                    wx.showToast({
                                        title: "保存成功",
                                        icon: "success",
                                        duration: 1000,
                                        mask: true,
                                        success: res => {
                                            setTimeout(function() {
                                                //个人零售贷 经营贷 是否为本人跳过授权人录入
                                                if ((that.data.business_type == 1 || that.data.business_type == 2) && that.data.is_same_person == '0') {
                                                    wx.redirectTo({
                                                        url: "../creditInfo/authList?business_type=" +
                                                            that.data.business_type +
                                                            "&business_id=" +
                                                            that.data.business_id,
                                                    });
                                                    return;
                                                }
                                                that.setData({
                                                    submitLim: false
                                                })
                                                let scene = ''
                                                if (that.data.business_type == 1) {
                                                    scene = '&borrow_name=' + params.borrow_name
                                                } else {
                                                    scene = '&credit_code=' + that.data.credit_code + '&enterpriseFrIndex=' + that.data.enterpriseFrIndex
                                                }
                                                wx.redirectTo({
                                                    url: "../creditInfo/auth?business_type=" + that.data.business_type + "&page=1&business_id=" + that.data.business_id + scene,
                                                });
                                            }, 1000);
                                        },
                                    });
                                }
                            }
                        })
                        return;

                    }
                    that.setData({
                        submit: true,
                        formData: params,
                    });
                    wx.hideToast();
                    wx.showToast({
                        title: "保存成功",
                        icon: "success",
                        duration: 1000,
                        mask: true,
                        success: res => {
                            setTimeout(function() {
                                //个人零售贷 经营贷 是否为本人跳过授权人录入
                                if ((that.data.business_type == 1 || that.data.business_type == 2) && that.data.is_same_person == '0') {
                                    wx.redirectTo({
                                        url: "../creditInfo/authList?business_type=" +
                                            that.data.business_type +
                                            "&business_id=" +
                                            that.data.business_id,
                                    });
                                    return;
                                }
                                that.setData({
                                    submitLim: false
                                })
                                let scene = ''
                                if (that.data.business_type == 1) {
                                    scene = '&borrow_name=' + params.borrow_name
                                } else {
                                    scene = '&credit_code=' + that.data.credit_code + '&enterpriseFrIndex=' + that.data.enterpriseFrIndex
                                }
                                wx.redirectTo({
                                    url: "../creditInfo/auth?business_type=" + that.data.business_type + "&page=1&business_id=" + that.data.business_id + scene,
                                });
                            }, 1000);
                        },
                    });
                } else {
                    wx.showToast({
                        title: "请检查网络",
                        icon: "none",
                        image: "",
                        duration: 1500,
                        mask: false,
                    });
                }
            })
            .catch(err => {
                wx.showToast({
                    title: "请检查网络",
                    icon: "none",
                    image: "",
                    duration: 1500,
                    mask: false,
                });
            });
    },
    saveBor(params) {
        return new Promise((resolve, reject) => {
            var dataJson = JSON.stringify({
                data: JSON.stringify(params)
            })
            console.log(dataJson)
            var custnameTwo = encr.jiami(dataJson, aeskey)
            wx.request({
                url: app.globalData.creditUrl + "savePerson.do",
                data: encr.gwRequest(custnameTwo),
                method: 'POST',
                header: {
                    'content-type': 'application/json',
                },
                success(res) {
                    if (res.data.head.H_STATUS === "1") {
                        var jsonData = encr.aesDecrypt(res.data.body, aeskey)
                        resolve(jsonData);
                    } else {
                        reject();
                    }

                },
                fail(res) {
                    reject();
                }
            })
        })
    },
    //type==2 工商校验
    gsCheck(params) {
        return new Promise((resolve, reject) => {

            if (that.data.credit_code == '' || params.enterprise_name == '' || params.registration_no == '') {
                resolve()
                return;
            }
            var dataJson = JSON.stringify({
                palgorithmid: params.borrow_cert_no,
                deptName: '风险管理部',
                productNo: '090014'
            })
            var custnameTwo = encr.jiami(dataJson, aeskey)
        

            Org.getEnterpriseInfoNewC({
                entmark1: that.data.enterpriseName,
                // name: that.data.sqrName,
                emc: that.data.iDNumInput,
                deptName: '风险管理部',
                productNo: "090014",
              }).then((res) => {
                console.log('校验返回', res);
                // console.log('企业是否匹配', (JSON.parse(res.entInfo))[0].matched);
                if(res.relation == ''){
                    wx.hideLoading({
                        success: (res) => {},
                    })
                    wx.showToast({
                      title: `${res.msg}`,
                      icon: 'none'
                    });
                }else if(res.relation !== ''){
                if ((JSON.parse(res.relation))[0].matched !=='1'){
                    wx.showToast({
                        title: '工商信息验证失败，请选择对应的身份信息',
                        icon: 'none'
                    })
                }else{
                    resolve();
                }
                }
            });   

        })
    },
    compareName(params) {
        return new Promise((resolve, reject) => {
            var data1 = JSON.stringify({
                cust_name: params.borrow_name,
                cust_id: params.borrow_cert_no,
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
    queryProduct() {
        return new Promise((resolve, reject) => {
            var data1 = JSON.stringify({})

            var custnameTwos1 = encr.jiami(data1, aeskey)
            wx.request({
                url: app.globalData.creditUrl + 'queryProduct.do',
                data: encr.gwRequest(custnameTwos1),
                method: 'POST',
                header: {
                    'content-type': 'application/json',
                },
                success(res) {
                    console.log(res)
                    if (res.data.head.H_STATUS === "1") {
                        var jsonData = encr.aesDecrypt(res.data.body, aeskey)
                        resolve(jsonData)
                    } else {
                        reject();
                    }
                }
            })
        })
    },
    initValidate() {
        //business_type为1,时
        const rules1 = {
            borrow_name: {
                required: true,
            },
            borrow_cert_type: {
                required: true,
            },
            borrow_cert_no: {
                required: true,
            }
        };
        const messages1 = {
            borrow_name: {
                required: "请输入用户名",
            },
            borrow_cert_type: {
                required: "请选择证件类型",
            },
            borrow_cert_no: {
                required: "请输入证件号码",
            },

        };

        let rules2;
        let messages2;
        if (this.data.is_have_guarantor == 0) {
            //business_type为2,有担保人时
            rules2 = {
                borrow_name: {
                    required: true,
                },
                borrow_cert_type: {
                    required: true,
                },
                borrow_cert_no: {
                    required: true,
                },
                // enterprise_name: {
                //     required: true,
                //     orgName: true,
                // },
            };
            messages2 = {
                borrow_name: {
                    required: "请输入用户名",
                },
                borrow_cert_type: {
                    required: "请选择证件类型",
                },
                borrow_cert_no: {
                    required: "请输入证件号码",
                },

                // enterprise_name: {
                //     required: "请输入企业名称",
                // },
            };
        } else {
            //business_type为2,无担保人时
            rules2 = {
                borrow_name: {
                    required: true,
                    // name: true,
                },
                borrow_cert_type: {
                    required: true,
                },
                borrow_cert_no: {
                    required: true,
                },
                // enterprise_name: {
                //     required: true,
                //     orgName: true,
                // },
                // credit_code: {
                //     required: true,
                // }
            };
            messages2 = {
                borrow_name: {
                    required: "请输入用户名",
                },
                borrow_cert_type: {
                    required: "请选择证件类型",
                },
                borrow_cert_no: {
                    required: "请输入证件号码",
                },
                // enterprise_name: {
                //     required: "请输入企业名称",
                // },
                // credit_code: {
                //     required: '请输入信用代码',
                // }
            };
        }
        //business_type为3时
        const rules3 = {
            // enterprise_name: {
            //     required: true,
            //     orgName: true,
            // },
            credit_code: {
                required: true
            },
            enterpriseFrType: {
                required: true
            }
        };
        const messages3 = {
            // enterprise_name: {
            //     required: "请输入企业名称",
            // },
            credit_code: {
                required: '请输入统一信用代码'
            },
            enterpriseFrType: {
                required: "请选择企业类型",
            }

        };
        if (this.data.business_type == 1) {
            this.WxValidate = new WxValidate(rules1, messages1);
        } else if (this.data.business_type == 2) {
            this.WxValidate = new WxValidate(rules2, messages2);
        } else {
            if(that.data.enterpriseFrIndex != '1'){
              //法人
              this.WxValidate = new WxValidate(rules3, messages3);
            }
            
        }
    },
});