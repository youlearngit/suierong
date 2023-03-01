import WxValidate from "../../../assets/plugins/wx-validate/WxValidate";
import Org from '../../../api/Org';
const util = require('../../utils/util');
import http from '../../utils/requsetP.js';
var app = getApp();
var encr = require('../../utils/encrypt.js'); //国密3段式加密
var aeskey = encr.key //随机数
var that;
/**
 * 20201222修改：高管/自然人股东/实际控制人”拆分
 * 20210602修改:个人零售类贷款：
                    01:借款人
                    02:借款人配偶（不提供担保）
                    03:担保人
                对公个人经营贷：
                    01:借款人
                    03:担保人
                    05:实体企业法定代表人、高管、股东
                    07:授信业务其他相关自然人
                对公授信相关自然人
                    1:借款企业法定代表人
                    2:高管/自然人股东
                    2.实际控制人 
                    3:个人连带责任保证人/抵押人/质押人
                    7:授信业务其他相关自然人
 */
Page({
    data: {
        submit: false,
        coverHidden: true,
        borrow_name: "",
        searchTime:true,
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
        enterpriseFrIndex: '',
        
      
      
        // auth_type_array2: [
        //     '借款人',
        //     '借款人配偶',
        //     '担保人',
        //     '担保人配偶(不承担担保责任)',
        //     '实体企业法定代表人、高管、股东',
        //     '实体企业其他相关人员及配偶'
        // ],
        // auth_enterprise_type_array: [
        //     '借款企业法定代表人',
        //     '高管 / 自然人股东',
        //     '实际控制人',
        //     '个人连带责任保证人/抵押人/质押人',
        //     '高管配偶/自然人股东配偶/实际控制人配偶',
        //     '担保企业法定代表人/高管/自然人股东/实际控制人',
        //     '担保企业法定代表人配偶/高管配偶/自然人股东配偶/实际控制人配偶',
        // ],
        auth_type_array: [
            '借款人',
            '借款人配偶（不提供担保）',
            '担保人',
        ],
        auth_type_array2: [
            '借款人',
            '担保人',
            '实体企业法定代表人、高管、股东',
            '授信业务其他相关自然人',
        ],
        auth_enterprise_type_array: [
            '借款企业法定代表人（不提供担保）',
            '高管/自然人股东（不提供担保）',
            '实际控制人（不提供担保）' ,
           '个人连带责任保证人/抵押人/质押人',
            '授信业务其他相关自然人',
        ],
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
        auth_enterprise_type: '',
        auth_cert_type: '',
        auth_type: 1,
        business_type: 0, //业务类型
        business_id: '', //当前业务id
        page: -1, //0是查询详细页面  1是添加页面,
        auth_Info: {}, //接收授权人信息
        borrowData: {}, //接收借款人信息
        preffixUrl: '',
        sqrName: '', //输入的授权人姓名
        iDNumInput: '' //输入的证件号码
    },
    beback() {
        this.setData({
            coverHidden: true
        })
    },
    ed0161(e) {
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
                    that.setData({
                        credit_code: jsonData.ENT_INFO[0].CREDITCODE,
                        'borrowerInfo.ENTERPRISE_NAME': jsonData.ENT_INFO[0].ENTNAME,
                        'borrowerInfo.CREDIT_CODE': jsonData.ENT_INFO[0].CREDITCODE,
                        'borrowerInfo.REGISTRATION_NO': jsonData.ENT_INFO[0].REGNO,
                        'borrowerInfo.ENTERPRISE_CODE': jsonData.ENT_INFO[0].ORGCODES,
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
    getInput(e) {
        that.setData({
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
        let business_type = this.data.business_type;
        let url = app.globalData.creditUrl + 'saveAuthInfo.do'

        var page = this.data.page;
        params.business_id = this.data.business_id;
        params.id = this.data.auth_Info.ID;
        params.auth_enterprise_type = this.data.auth_enterprise_type;
        params.auth_type = this.data.auth_type;
        params.auth_cert_type = this.data.auth_cert_type;

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
            if (that.data.business_type == 2 && params.auth_type == 0 && that.data.page != 0) {
                if (params.auth_cert_no != that.data.borrowerInfo.BORROW_CERT_NO || params.auth_name != that.data.borrowerInfo.BORROW_NAME) {
                    wx.showToast({
                        title: '借款人本人身份信息不一致',
                        icon: 'none'
                    })
                    return;
                }
            }

            if (that.data.business_type == 2 && params.auth_type == 0 && that.data.page == 0) {
                if (params.auth_cert_no != params.borrow_cert_no || params.auth_name != params.borrow_name) {
                    wx.showToast({
                        title: '借款人本人身份信息不一致',
                        icon: 'none'
                    })
                    return;
                }
            }
            //工商数据进行验证（ED0079)
            if (params.auth_enterprise_type === '0' && that.data.enterpriseFrIndex == '0') {
                console.log(wx.getStorageSync('enterprise'),'111')
                        Org.getEnterpriseInfoNewC({
                            entmark1: wx.getStorageSync('enterprise'),
                            // name: that.data.sqrName,
                            emc: that.data.iDNumInput,
                            deptName: '风险管理部',
                            productNo: "090014",
                          }).then((res) => {
                            console.log('校验返回', res);
                            // console.log('企业是否匹配', (JSON.parse(res.relation))[0].matched);
                            if(res.relation == ''){
                                wx.hideLoading({
                                    success: (res) => {},
                                })
                                wx.showToast({
                                  title: `${res.msg}`,
                                  icon: 'none'
                                });
                            }else if(res.relation !== ''){
                            if ((JSON.parse(res.relation))[0].matched !=='1' && (JSON.parse(res.relation))[0].id !=='1'){
                                wx.showToast({
                                    title: '授权主体类型与工商登记信息不一致，请选择正确的授权主体类型',
                                    icon: 'none'
                                })
                            }else{
                                var data1 = JSON.stringify({
                                    cust_name: params.auth_name,
                                    cust_id: params.auth_cert_no,
                                    cust_addr: '1',
                                    cust_sex: '1',
                                    nation: '1',
                                    birthday: '00000000',
                                    is_agent: '0',
                                    busicode: '02'
                                })
                                var custnameTwos1 = encr.jiami(data1, aeskey) //3段加密
                                wx.request({
                                    url: app.globalData.creditUrl + 'compareIdName.do',
                                    data: encr.gwRequest(custnameTwos1),
                                    method: 'POST',
                                    header: {
                                        'content-type': 'application/json', // 默认值
                                    },
                                    success(res) {
                                        console.log('compareIdName.do成功',res.data)
                                        if (res.data.head.H_STATUS === "1") {

                                            var jsonData = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文

                                            if (jsonData.chk_result == '00'|| jsonData.chk_result == '01') {
                                                console.log(that.data.page,'page')
                                                //判断是修改还是增加
                                                if (that.data.page == 0) {
                                                    //若是修改界面
                                                    url = app.globalData.creditUrl + 'updataPerson.do'
                                                }
                                                //类型若是本人判断是否一致
                                                params.remark2 = wx.getStorageSync('borrow_cert_no')
                                                params.remark4 = that.data.business_type
                                                let vo = params;
                                                let str = JSON.stringify({
                                                    data: JSON.stringify(
                                                        vo
                                                    )
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
                                                        console.log('成功:',res)
                                                        if (res.data.head.H_STATUS === "1") {
                                                            if (that.data.page == 0) {
                                                                //若是修改界面
                                                                that.gsCheck(params.borrow_cert_no, params, 'borrow').then(res => {
                                                                    that.compareName(params).then(res => {
                                                                        that.changeBorrow(params);
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
                                                                                        url: '../creditInfo/authList?business_type=' +
                                                                                            that.data.business_type +
                                                                                            '&business_id=' +
                                                                                            that.data.business_id + '&credit_code=' + that.data.credit_code,
                                                                                    });
                                                                                }, 1000);
                                                                            },
                                                                        });

                                                                    }).catch(err => {
                                                                        wx.showToast({
                                                                            title: '借款人身份信息验证失败，请输入正确的身份信息',
                                                                            icon: 'none'
                                                                        })
                                                                    })
                                                                }).catch(err => {
                                                                    wx.showToast({
                                                                        title: '工商信息验证失败，请输入对应的身份信息',
                                                                        icon: 'none'
                                                                    })
                                                                })
                                                                return;
                                                            }
                                                            that.gsCheck(params.auth_cert_no, params, 'auth').then(res => {
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
                                                                                url: '../creditInfo/authList?business_type=' +
                                                                                    that.data.business_type +
                                                                                    '&business_id=' +
                                                                                    that.data.business_id + '&credit_code=' + that.data.credit_code,
                                                                            });
                                                                        }, 1000);
                                                                    },
                                                                });
                                                            }).catch(err => {
                                                                wx.showToast({
                                                                    title: '工商信息验证失败，请输入对应的身份信息',
                                                                    icon: 'none'
                                                                })
                                                            })

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
                                            } else {
                                                wx.showToast({
                                                    title: '授权主体名字与证件号号码不一致，请输入正确的身份信息',
                                                    icon: 'none'
                                                })
                                            }
                                        } else {
                                            wx.showToast({
                                                title: res.data.head.H_MSG,
                                                icon: 'none'
                                            })
                                        }
                                    },
                                    fail(res){
                                        console.log(res,'compareIdName.do失败')
                                    }
                                })
                            }
                        }  
                        });      
            } else if(params.auth_enterprise_type === '1' || params.auth_enterprise_type === '2'){
                Org.getShareHolderInfoC({
                    entmark: wx.getStorageSync('enterprise'),
                    name: that.data.sqrName,
                    deptName: '风险管理部',
                    productNo: "090014",
                  }).then((res) => {
                    console.log('高管校验',wx.getStorageSync('enterprise'),that.data.sqrName)
                    console.log('校验高管返回', res)
                    if(res.msgCode !=='0000'){
                        wx.hideLoading({
                            success: (res) => {},
                        })
                        wx.showToast({
                          title: `${res.msg}`,
                          icon: 'none'
                        });
                    }else if(res.msgCode =='0000'){
                
                        var data1 = JSON.stringify({
                            cust_name: params.auth_name,
                            cust_id: params.auth_cert_no,
                            cust_addr: '1',
                            cust_sex: '1',
                            nation: '1',
                            birthday: '00000000',
                            is_agent: '0',
                            busicode: '02'
                        })
                        var custnameTwos1 = encr.jiami(data1, aeskey) //3段加密
                        wx.request({
                            url: app.globalData.creditUrl + 'compareIdName.do',
                            data: encr.gwRequest(custnameTwos1),
                            method: 'POST',
                            header: {
                                'content-type': 'application/json', // 默认值
                            },
                            success(res) {
                                if (res.data.head.H_STATUS === "1") {

                                    var jsonData = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文

                                    if (jsonData.chk_result == '00'|| jsonData.chk_result == '01') {

                                        //判断是修改还是增加
                                        if (that.data.page == 0) {
                                            //若是修改界面
                                            url = app.globalData.creditUrl + 'updataPerson.do'
                                        }
                                        //类型若是本人判断是否一致
                                        params.remark2 = wx.getStorageSync('borrow_cert_no')
                                        params.remark4 = that.data.business_type
                                        let vo = params;
                                        let str = JSON.stringify({
                                            data: JSON.stringify(
                                                vo
                                            )
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
                                                    if (that.data.page == 0) {
                                                        //若是修改界面
                                                        that.gsCheck(params.borrow_cert_no, params, 'borrow').then(res => {
                                                            that.compareName(params).then(res => {
                                                                that.changeBorrow(params);
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
                                                                                url: '../creditInfo/authList?business_type=' +
                                                                                    that.data.business_type +
                                                                                    '&business_id=' +
                                                                                    that.data.business_id + '&credit_code=' + that.data.credit_code,
                                                                            });
                                                                        }, 1000);
                                                                    },
                                                                });

                                                            }).catch(err => {
                                                                wx.showToast({
                                                                    title: '借款人身份信息验证失败，请输入正确的身份信息',
                                                                    icon: 'none'
                                                                })
                                                            })
                                                        }).catch(err => {
                                                            wx.showToast({
                                                                title: '工商信息验证失败，请输入对应的身份信息',
                                                                icon: 'none'
                                                            })
                                                        })
                                                        return;
                                                    }
                                                    that.gsCheck(params.auth_cert_no, params, 'auth').then(res => {
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
                                                                        url: '../creditInfo/authList?business_type=' +
                                                                            that.data.business_type +
                                                                            '&business_id=' +
                                                                            that.data.business_id + '&credit_code=' + that.data.credit_code,
                                                                    });
                                                                }, 1000);
                                                            },
                                                        });
                                                    }).catch(err => {
                                                        wx.showToast({
                                                            title: '工商信息验证失败，请输入对应的身份信息',
                                                            icon: 'none'
                                                        })
                                                    })

                                                } else {
                                                    wx.showToast({
                                                        title: '请检查网络',
                                                        icon: 'none'
                                                    })
                                                }
                                            }

                                        })
                                    } else {
                                        wx.showToast({
                                            title: '授权主体名字与证件号号码不一致，请输入正确的身份信息',
                                            icon: 'none'
                                        })
                                    }
                                } else {
                                    wx.showToast({
                                        title: res.data.head.H_MSG,
                                        icon: 'none'
                                    })
                                }
                            }
                        })
                    
                }  
                }); 
            }else if(1==2){ //无效
                //执行保存
                var data1 = JSON.stringify({
                    cust_name: params.auth_name,
                    cust_id: params.auth_cert_no,
                    cust_addr: '1',
                    cust_sex: '1',
                    nation: '1',
                    birthday: '00000000',
                    is_agent: '0',
                    busicode: '02'
                })

                var custnameTwos1 = encr.jiami(data1, aeskey) //3段加密
                wx.request({
                    url: app.globalData.creditUrl + 'compareIdName.do',
                    data: encr.gwRequest(custnameTwos1),
                    method: 'POST',
                    header: {
                        'content-type': 'application/json', // 默认值
                    },
                    success(res) {
                        if (res.data.head.H_STATUS === "1") {
                            console.log(res,'compareIdName.do')
                            wx.hideLoading({
                                success: (res) => {},
                            })
                            var jsonData = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文
                            if (jsonData.chk_result == '00' || that.data.business_type == 1|| jsonData.chk_result == '01') {
                                //判断是修改还是增加
                                if (that.data.page == 0) {
                                    //若是修改界面
                                    url = app.globalData.creditUrl + 'updataPerson.do'
                                }
                                params.remark2 = wx.getStorageSync('borrow_cert_no')
                                params.remark4 = that.data.business_type

                                let vo = params;
                                let str = JSON.stringify({
                                    data: JSON.stringify(
                                        vo
                                    )
                                });
                                let custnameTwos = encr.jiami(str, aeskey) //3段加密

                                that.gsCheck(params.auth_cert_no, params, 'auth').then(res => {
                                    wx.request({
                                        url: url,
                                        data: encr.gwRequest(custnameTwos),
                                        method: 'POST',
                                        header: {
                                            'content-type': 'application/json',
                                        },
                                        success(res) {
                                            console.log(res,)
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
                                                if (that.data.page == 0) {
                                                    //若是修改界面
                                                    that.gsCheck(params.borrow_cert_no, params, 'borrow').then(res => {
                                                        that.compareName(params).then(res => {
                                                            that.changeBorrow(params);
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
                                                                            url: '../creditInfo/authList?business_type=' +
                                                                                that.data.business_type +
                                                                                '&business_id=' +
                                                                                that.data.business_id + '&credit_code=' + that.data.credit_code,
                                                                        });
                                                                    }, 1000);
                                                                },
                                                            });
                                                        }).catch(err => {
                                                            wx.showToast({
                                                                title: '借款人身份信息验证失败，请输入正确的身份信息',
                                                                icon: 'none'
                                                            })
                                                        })
                                                    }).catch(err => {
                                                        wx.showToast({
                                                            title: '工商信息验证失败，请输入对应的身份信息',
                                                            icon: 'none'
                                                        })
                                                    })
                                                    return;
                                                }
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
                                                                url: '../creditInfo/authList?business_type=' +
                                                                    that.data.business_type +
                                                                    '&business_id=' +
                                                                    that.data.business_id + '&credit_code=' + that.data.credit_code,
                                                            });
                                                        }, 1000);
                                                    },
                                                });

                                            } else {
                                                wx.hideLoading({
                                                    success: (res) => {},
                                                })
                                                wx.showToast({
                                                    title: '请检查网络',
                                                    icon: 'none'
                                                })
                                            }
                                        }
                                    })

                                }).catch(err => {
                                    wx.showToast({
                                        title: '工商信息验证失败，请输入对应的身份信息',
                                        icon: 'none'
                                    })
                                })

                            } else {
                                wx.hideLoading({
                                    success: (res) => {},
                                })
                                wx.showToast({
                                    title: jsonData.chk_issue,
                                    icon: 'none'
                                })
                            }
                        } else {
                            wx.hideLoading({
                                success: (res) => {},
                            })
                            wx.showToast({
                                title: '授权主体名字与证件号号码不一致，请输入正确的身份信息',
                                icon: 'none'
                            })
                        }
                    }
                })

            }else if(that.data.business_type==2 && params.auth_type == '2'){
                console.log(params,'01')
                // 校验高管
                Org.getShareHolderInfoC({
                    entmark: wx.getStorageSync('enterprise'),
                    name: that.data.sqrName,
                    deptName: '风险管理部',
                    productNo: "090014",
                  }).then((res) => {
                    console.log('高管校验',wx.getStorageSync('enterprise'),that.data.sqrName)
                    console.log('校验高管返回', res)
                    if(res.msgCode !=='0000'){
                        wx.hideLoading({
                            success: (res) => {},
                        })
                        // 校验法人
                        Org.getEnterpriseInfoNewC({
                            entmark1: wx.getStorageSync('enterprise'),
                            // name: that.data.sqrName,
                            emc: that.data.iDNumInput,
                            deptName: '风险管理部',
                            productNo: "090014",
                          }).then((res) => {
                            console.log('校验返回', res);
                            // console.log('企业是否匹配', (JSON.parse(res.relation))[0].matched);
                            if(res.relation == ''){
                                wx.hideLoading({
                                    success: (res) => {},
                                })
                                wx.showToast({
                                  title: `${res.msg}`,
                                  icon: 'none'
                                });
                            }else if(res.relation !== ''){
                            if ((JSON.parse(res.relation))[0].matched !=='1' && (JSON.parse(res.relation))[0].id !=='1'){
                                wx.showToast({
                                    title: '授权主体类型与工商登记信息不一致，请选择正确的授权主体类型',
                                    icon: 'none'
                                })
                            }else{
                                var data1 = JSON.stringify({
                                    cust_name: params.auth_name,
                                    cust_id: params.auth_cert_no,
                                    cust_addr: '1',
                                    cust_sex: '1',
                                    nation: '1',
                                    birthday: '00000000',
                                    is_agent: '0',
                                    busicode: '02'
                                })
                                var custnameTwos1 = encr.jiami(data1, aeskey) //3段加密
                                wx.request({
                                    url: app.globalData.creditUrl + 'compareIdName.do',
                                    data: encr.gwRequest(custnameTwos1),
                                    method: 'POST',
                                    header: {
                                        'content-type': 'application/json', // 默认值
                                    },
                                    success(res) {
                                        console.log('compareIdName.do成功',res.data)
                                        if (res.data.head.H_STATUS === "1") {

                                            var jsonData = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文

                                            if (jsonData.chk_result == '00'|| jsonData.chk_result == '01') {
                                                console.log(that.data.page,'page')
                                                //判断是修改还是增加
                                                if (that.data.page == 0) {
                                                    //若是修改界面
                                                    url = app.globalData.creditUrl + 'updataPerson.do'
                                                }
                                                //类型若是本人判断是否一致
                                                params.remark2 = wx.getStorageSync('borrow_cert_no')
                                                params.remark4 = that.data.business_type
                                                let vo = params;
                                                let str = JSON.stringify({
                                                    data: JSON.stringify(
                                                        vo
                                                    )
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
                                                        console.log('成功:',res)
                                                        if (res.data.head.H_STATUS === "1") {
                                                            if (that.data.page == 0) {
                                                                //若是修改界面
                                                                // that.gsCheck(params.borrow_cert_no, params, 'borrow').then(res => {
                                                                    that.compareName(params).then(res => {
                                                                        that.changeBorrow(params);
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
                                                                                        url: '../creditInfo/authList?business_type=' +
                                                                                            that.data.business_type +
                                                                                            '&business_id=' +
                                                                                            that.data.business_id + '&credit_code=' + that.data.credit_code,
                                                                                    });
                                                                                }, 1000);
                                                                            },
                                                                        });

                                                                    }).catch(err => {
                                                                        wx.showToast({
                                                                            title: '借款人身份信息验证失败，请输入正确的身份信息',
                                                                            icon: 'none'
                                                                        })
                                                                    })
                                                                // }).catch(err => {
                                                                //     wx.showToast({
                                                                //         title: '工商信息验证失败，请输入对应的身份信息',
                                                                //         icon: 'none'
                                                                //     })
                                                                // })
                                                                return;
                                                            }
                                                            // that.gsCheck(params.auth_cert_no, params, 'auth').then(res => {
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
                                                                                url: '../creditInfo/authList?business_type=' +
                                                                                    that.data.business_type +
                                                                                    '&business_id=' +
                                                                                    that.data.business_id + '&credit_code=' + that.data.credit_code,
                                                                            });
                                                                        }, 1000);
                                                                    },
                                                                });
                                                            // })

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
                                            } else {
                                                wx.showToast({
                                                    title: '授权主体名字与证件号号码不一致，请输入正确的身份信息',
                                                    icon: 'none'
                                                })
                                            }
                                        } else {
                                            wx.showToast({
                                                title: res.data.head.H_MSG,
                                                icon: 'none'
                                            })
                                        }
                                    },
                                    fail(res){
                                        console.log(res,'compareIdName.do失败')
                                    }
                                })
                            }
                        }  
                        }); 
                    }else if(res.msgCode =='0000'){
                
                        var data1 = JSON.stringify({
                            cust_name: params.auth_name,
                            cust_id: params.auth_cert_no,
                            cust_addr: '1',
                            cust_sex: '1',
                            nation: '1',
                            birthday: '00000000',
                            is_agent: '0',
                            busicode: '02'
                        })
                        var custnameTwos1 = encr.jiami(data1, aeskey) //3段加密
                        wx.request({
                            url: app.globalData.creditUrl + 'compareIdName.do',
                            data: encr.gwRequest(custnameTwos1),
                            method: 'POST',
                            header: {
                                'content-type': 'application/json', // 默认值
                            },
                            success(res) {
                                if (res.data.head.H_STATUS === "1") {

                                    var jsonData = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文

                                    if (jsonData.chk_result == '00'|| jsonData.chk_result == '01') {

                                        //判断是修改还是增加
                                        if (that.data.page == 0) {
                                            //若是修改界面
                                            url = app.globalData.creditUrl + 'updataPerson.do'
                                        }
                                        //类型若是本人判断是否一致
                                        params.remark2 = wx.getStorageSync('borrow_cert_no')
                                        params.remark4 = that.data.business_type
                                        let vo = params;
                                        let str = JSON.stringify({
                                            data: JSON.stringify(
                                                vo
                                            )
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
                                                    if (that.data.page == 0) {
                                                        //若是修改界面
                                                        // that.gsCheck(params.borrow_cert_no, params, 'borrow').then(res => {
                                                            that.compareName(params).then(res => {
                                                                that.changeBorrow(params);
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
                                                                                url: '../creditInfo/authList?business_type=' +
                                                                                    that.data.business_type +
                                                                                    '&business_id=' +
                                                                                    that.data.business_id + '&credit_code=' + that.data.credit_code,
                                                                            });
                                                                        }, 1000);
                                                                    },
                                                                });

                                                            }).catch(err => {
                                                                wx.showToast({
                                                                    title: '借款人身份信息验证失败，请输入正确的身份信息',
                                                                    icon: 'none'
                                                                })
                                                            })
                                                        // }).catch(err => {
                                                        //     wx.showToast({
                                                        //         title: '工商信息验证失败，请输入对应的身份信息',
                                                        //         icon: 'none'
                                                        //     })
                                                        // })
                                                        return;
                                                    }
                                                    // that.gsCheck(params.auth_cert_no, params, 'auth').then(res => {
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
                                                                        url: '../creditInfo/authList?business_type=' +
                                                                            that.data.business_type +
                                                                            '&business_id=' +
                                                                            that.data.business_id + '&credit_code=' + that.data.credit_code,
                                                                    });
                                                                }, 1000);
                                                            },
                                                        });
                                                    // }).catch(err => {
                                                    //     wx.showToast({
                                                    //         title: '工商信息验证失败，请输入对应的身份信息',
                                                    //         icon: 'none'
                                                    //     })
                                                    // })

                                                } else {
                                                    wx.showToast({
                                                        title: '请检查网络',
                                                        icon: 'none'
                                                    })
                                                }
                                            }

                                        })
                                    } else {
                                        wx.showToast({
                                            title: '授权主体名字与证件号号码不一致，请输入正确的身份信息',
                                            icon: 'none'
                                        })
                                    }
                                } else {
                                    wx.showToast({
                                        title: res.data.head.H_MSG,
                                        icon: 'none'
                                    })
                                }
                            }
                        })
                    
                }  
                }); 
            }else{
                console.log(params,'01')
                var data1 = JSON.stringify({
                    cust_name: params.auth_name,
                    cust_id: params.auth_cert_no,
                    cust_addr: '1',
                    cust_sex: '1',
                    nation: '1',
                    birthday: '00000000',
                    is_agent: '0',
                    busicode: '02'
                })
                var custnameTwos1 = encr.jiami(data1, aeskey) //3段加密
                wx.request({
                    url: app.globalData.creditUrl + 'compareIdName.do',
                    data: encr.gwRequest(custnameTwos1),
                    method: 'POST',
                    header: {
                        'content-type': 'application/json', // 默认值
                    },
                    success(res) {
                        console.log('compareIdName.do成功',res.data)
                        if (res.data.head.H_STATUS === "1") {

                            var jsonData = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文

                            if (jsonData.chk_result == '00'|| jsonData.chk_result == '01') {
                                console.log(that.data.page,'page')
                                //判断是修改还是增加
                                if (that.data.page == 0) {
                                    //若是修改界面
                                    url = app.globalData.creditUrl + 'updataPerson.do'
                                }
                                //类型若是本人判断是否一致
                                params.remark2 = wx.getStorageSync('borrow_cert_no')
                                params.remark4 = that.data.business_type
                                let vo = params;
                                let str = JSON.stringify({
                                    data: JSON.stringify(
                                        vo
                                    )
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
                                        console.log('成功:',res)
                                        if (res.data.head.H_STATUS === "1") {
                                            if (that.data.page == 0) {
                                                //若是修改界面
                                                // that.gsCheck(params.borrow_cert_no, params, 'borrow').then(res => {
                                                    that.compareName(params).then(res => {
                                                        that.changeBorrow(params);
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
                                                                        url: '../creditInfo/authList?business_type=' +
                                                                            that.data.business_type +
                                                                            '&business_id=' +
                                                                            that.data.business_id + '&credit_code=' + that.data.credit_code,
                                                                    });
                                                                }, 1000);
                                                            },
                                                        });

                                                    }).catch(err => {
                                                        wx.showToast({
                                                            title: '借款人身份信息验证失败，请输入正确的身份信息',
                                                            icon: 'none'
                                                        })
                                                    })
                                                // }).catch(err => {
                                                //     wx.showToast({
                                                //         title: '工商信息验证失败，请输入对应的身份信息',
                                                //         icon: 'none'
                                                //     })
                                                // })
                                                return;
                                            }
                                            // that.gsCheck(params.auth_cert_no, params, 'auth').then(res => {
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
                                                                url: '../creditInfo/authList?business_type=' +
                                                                    that.data.business_type +
                                                                    '&business_id=' +
                                                                    that.data.business_id + '&credit_code=' + that.data.credit_code,
                                                            });
                                                        }, 1000);
                                                    },
                                                });
                                            // })

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
                            } else {
                                wx.showToast({
                                    title: '授权主体名字与证件号号码不一致，请输入正确的身份信息',
                                    icon: 'none'
                                })
                            }
                        } else {
                            wx.showToast({
                                title: res.data.head.H_MSG,
                                icon: 'none'
                            })
                        }
                    },
                    fail(res){
                        console.log(res,'compareIdName.do失败')
                    }
                })
            }
        }

    },

    compareName(params) {
        return new Promise((resolve, reject) => {

            if (that.data.business_type != 2) {
                resolve()
                return;
            }
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
        //jsyh/chgBorrower.do
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
        } else if (id == 'auth_enterprise_type') {
            that.setData({
                auth_enterprise_type: e.detail.value,
                // 修改点  auth_enterprise_type  :+ 1
            });
        } else if (id == 'auth_type') {
            if (that.data.borrow_name != '' && e.detail.value == 0) {
                wx.showToast({
                    title: '已有借款人，请重新选择',
                    icon: 'none',
                    image: '',
                    duration: 2000
                });
                return;
            }

            that.setData({
                auth_type: e.detail.value,
            });
        } else {}
    },
    getBorrowInfo(id) {
        if (id == undefined) {
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
                        borrowerInfo: data2[0],
                        borrow_name: data2[0].BORROW_NAME,

                        borrow_cert_type: data2[0].BORROW_CERT_TYPE
                    });
                    let ywlxIndex = 0;
                    let BORROW_TYPE = data2[0].BORROW_TYPE;
                    if (BORROW_TYPE == '01') {
                        ywlxIndex = 0;
                    } else if (BORROW_TYPE == '02') {
                        ywlxIndex = 1;
                    } else if (BORROW_TYPE == '03') {
                        ywlxIndex = 2;
                    } else if (BORROW_TYPE.indexOf('05') != -1) {

                        ywlxIndex = 3;
                    }
                    that.setData({
                        ywlxIndex: ywlxIndex
                    })
                    if (that.data.business_type != 1) {
                        that.setData({
                            inputCom: data2[0].ENTERPRISE_NAME
                        })
                    }

                }
            })
        })



    },
    delAuth() {
        var that = this;
        let txt = '是否删除改授权人信息'
        let txt1 = '授权人类型为本人或担保人时无法删除'

        if (that.data.business_type == 2) {
            txt = '是否失效该授权人信息'
            txt1 = '授权人类型为本人时无法删除'
        }
        wx.showModal({
            title: '提示',
            content: txt,
            success(res) {
                if (res.confirm) {

                    //授权类型是本人时 判断是否一致
                    if (
                        that.data.auth_Info.AUTH_TYPE == 0 ||
                        that.data.auth_Info.AUTH_TYPE == 2
                    ) {

                        if (that.data.business_type == 2 && that.data.auth_Info.AUTH_TYPE == 2) {
                            that.toChange(that.data.auth_Info.ID)
                            return
                        }
                        wx.showModal({
                            title: '提示',
                            content: txt1,
                            showCancel: false,
                            success: res => {
                                wx.redirectTo({
                                    url: '../creditInfo/authList?business_type=' +
                                        that.data.business_type +
                                        '&business_id=' +
                                        that.data.business_id + '&credit_code=' + that.data.credit_code,
                                });

                            },
                        });
                        return;
                    } else {

                        if (that.data.business_type == 2) {
                            that.toChange(that.data.auth_Info.ID)
                            return
                        }
                        var dataJson = JSON.stringify({
                            id: that.data.auth_Info.ID,
                        })
                        var custnameTwo = encr.jiami(dataJson, aeskey)
                        wx.request({
                            url: app.globalData.creditUrl + 'delAuth.do',
                            data: encr.gwRequest(custnameTwo),
                            method: 'POST',
                            header: {
                                'content-type': 'application/json',
                            },
                            success(res) {
                                if (res.data.head.H_STATUS === "1") {
                                    wx.showToast({
                                        title: '删除成功',
                                        icon: 'success',
                                        duration: 1000,
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
                                        title: '请检查网络',
                                        icon: 'none'
                                    })
                                }
                            }
                        })

                    }
                }
            },
        });
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
            app
                .getSessionInfo()
                .then(res => {

                })
        }

        this.setData({
            preffixUrl: app.globalData.JSBURL,
            // preffixUrl: app.globalData.CDNURL,
        });
        if (e.enterpriseFrIndex) {
            that.setData({
                enterpriseFrIndex: e.enterpriseFrIndex
            });
            console.log('enterpriseFrIndex:'+e.enterpriseFrIndex)
        }
        that.getBorrowInfo(e.business_id)
        if (e.borrow_name) {
            that.setData({ borrow_name: e.borrow_name })
        }
        if (e.page == 0) {
            let auth_Info = JSON.parse(e.data);
            this.setData({
                auth_Info: auth_Info,
                business_id: e.business_id,
                auth_cert_type: auth_Info.AUTH_CERT_TYPE,
                auth_type: auth_Info.AUTH_TYPE,
                auth_enterprise_type: auth_Info.AUTH_ENTERPRISE_TYPE
            });
        } else {
            this.setData({
                business_id: e.business_id,
            });
        }
        if (e.auth_info) {
            let auth_Info = JSON.parse(e.auth_info)
            auth_Info.AUTH_NAME = auth_Info.borrow_name
            auth_Info.AUTH_CERT_TYPE = auth_Info.borrow_cert_type
            auth_Info.AUTH_CERT_NO = auth_Info.borrow_cert_no
            auth_Info.AUTH_TYPE = '0'

            this.setData({
                auth_Info: auth_Info,
                auth_cert_type: auth_Info.borrow_cert_type,
                auth_type: '0'
            });
        }
        this.setData({
            business_type: e.business_type,
            page: e.page,
            credit_code: e.business_type == 3 ? e.credit_code : ''
        });
        this.initValidate();
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
            auth_type: {
                required: true,
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

            auth_type: {
                required: '请输入授权人类型',
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
            auth_enterprise_type: {
                required: true,
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

            auth_enterprise_type: {
                required: '请选择授权主体类型',
            },
        };
        if (this.data.business_type == 3) {
            this.WxValidate = new WxValidate(rules2, messages2);
        } else {
            this.WxValidate = new WxValidate(rules1, messages1);
        }
    },
    gsCheck(cert_no, params, type) {
        return new Promise((resolve, reject) => {
            if (that.data.business_type != '2') {
                resolve()
                return;
            }
            //20210916  企业法定代表人、高管、股东 工商控制
            if (type === 'auth' && that.data.business_type == '2' && params.auth_type != '2') {
                resolve()
                return;
            }
           
            var dataJson = JSON.stringify({
                palgorithmid: cert_no,
                deptName: '风险管理部',
                productNo: '090014'
            })
            var custnameTwo = encr.jiami(dataJson, aeskey)
            wx.request({
                url: app.globalData.creditUrl + 'getGsxx.do',

                data: encr.gwRequest(custnameTwo),
                method: 'POST',
                header: {
                    'content-type': 'application/json',
                },
                success(res) {
                    console.log(res,'getGsxx.do')
                    if (res.data.head.H_STATUS === "1") {
                        var jsonData = encr.aesDecrypt(res.data.body, aeskey)
                        if (jsonData.PERSON_INFO != undefined) {
                            let a = jsonData.PERSON_INFO.filter(function(value) {
                                return value.CREDITCODE === (that.data.page == 0 ? params.credit_code : that.data.borrowerInfo.CREDIT_CODE)
                            })
                            if (a.length == 0) {
                                reject();
                            } else {
                                resolve();
                            }
                        } else {
                            reject();
                        }
                    } else {
                        reject();
                    }
                },
                fail(res){
                    console.log(res,'fail getGsxx.do')
                }
            })
        })
    },
});