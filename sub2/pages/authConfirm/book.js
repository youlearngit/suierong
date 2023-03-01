// pages/authConfirm/book.js
var that;
import http from '../../utils/requsetP.js';
const util = require('../../utils/util');
const {
    $Toast
} = require('../../dist/base/index');
var app = getApp();
var encr = require('../../utils/encrypt.js');
var aeskey = encr.key
var that;
Page({

    data: {
        id: 1,
        yewuName: '',
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
        yewulxtype_array2: [{
                'id': '01',
                'name': '借款企业'
            }, {
                'id': '02',
                'name': '担保企业'
            },
            {
                'id': '03',
                'name': '关联企业'
            }, {
                'id': '05',
                'name': '其他'
            }
        ],
        yewulxtype_array3: [{
              'id': '01',
              'name': '经营实体'
          }, {
              'id': '02',
              'name': '担保企业'
          },
          {
              'id': '03',
              'name': '关联企业'
          }, {
              'id': '05',
              'name': '其他'
          }
      ],
        borrow_typeName: '个人商用房贷款',
        items: [{
                value: '贷款审批',
                checked: false,
                id: '8'
            },
            {
                value: '额度审批',
                checked: false,
                id: '9'
            },
            {
                value: '担保资格审查',
                checked: false,
                id: '10'
            },
            {
                value: '资信审查',
                checked: false,
                id: '11'
            },
            {
                value: '客户准入资格审查',
                checked: false,
                id: '12'
            },
            {
                value: '贷后管理',
                checked: false,
                id: '8'
            },
            {
                value: '异议核查',
                checked: false,
                id: '13'
            },
            {
                value: '/',
                checked: false,
                id: '14'
            }
        ],
        authType: '', //业务类型 '':个人,1:对公
    },
    getNow: function() {
        let dateTime
        let yy = new Date().getFullYear()
        let mm = new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1
        let dd = new Date().getDate() < 10 ? ('0' + new Date().getDate()) : new Date().getDate()
        dateTime = yy + '年' + mm + '月' + dd + '日'
        return dateTime
    },
    getAuthInfo() {
        var dataJsons = JSON.stringify({
            id: that.data.authId,
            type: that.data.authType != '1' ? 1 : ''
        })
        var custnameTwos = encr.jiami(dataJsons, aeskey) //3段加密
        wx.request({
            url: app.globalData.creditUrl + 'findAuthInfoById.do',
            data: encr.gwRequest(custnameTwos),
            method: 'POST',
            success: (res => {
                if (res.data.head.H_STATUS === "1") {
                    let jsonData = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文

                    var authInfos = jsonData.LIST[0];
                    var a = authInfos.QR_CODE_DATE
                    var s = a.substring(0, 4) + '年' + a.substring(4, 6) + '月' + a.substring(6) + '日'
                    authInfos.QR_CODE_DATE = s;
                    //对公授权字段现实同步
                    if(that.data.authType != '1'){
                      authInfos.AUTH_NAME = authInfos.BOR_PER_NAME;
                      authInfos.AUTH_CERT_NO = authInfos.BOR_PER_CODE;
                      authInfos.AUTH_CERT_TYPE = authInfos.BOR_PER_TYPE;
                    }
                    that.setData({
                        authInfo: authInfos
                    });
                    that.getBorrowInfo();

                }

            })
        })
    },
    onLoad: function(options) {
        that = this;

        that.setData({
            preffixUrl: app.globalData.JSBURL,
            id: options.data,
            curDate: that.getNow(),
            authId: options.id,
            authType: options.type 
        });
        that.getAuthInfo()
        if (options.data == 4) {
            if (wx.getStorageSync('flags')) {
                const id = wx.getStorageSync('flags')
                let items1 = that.data.items

                for (let i = 0, lenI = items1.length; i < lenI; ++i) {
                    if (items1[i].value === id) {
                        if (items1[i].id == '8') {
                            items1[0].checked = true
                            items1[5].checked = true
                        } else if ((items1[i].id == '9')) {
                            items1[1].checked = true
                            items1[5].checked = true
                        } else if ((items1[i].id == '10')) {
                            items1[2].checked = true
                            items1[5].checked = true
                        } else if ((items1[i].id == '11')) {
                            items1[3].checked = true
                            items1[5].checked = true
                        }
                        items1[i].checked = true
                    }
                }
                that.setData({
                    items: items1
                })
            } else {
                wx.showToast({
                    title: '请勾选（1）-（8）任意选项',
                    icon: 'none',
                    duration: 3000
                })
            }
        }
    },

    checkboxChange(e) {
        let originItem = [{
                value: '贷款审批',
                checked: false,
                id: '8'
            },
            {
                value: '额度审批',
                checked: false,
                id: '9'
            },
            {
                value: '担保资格审查',
                checked: false,
                id: '10'
            },
            {
                value: '资信审查',
                checked: false,
                id: '11'
            },
            {
                value: '客户准入资格审查',
                checked: false,
                id: '12'
            },
            {
                value: '贷后管理',
                checked: false,
                id: '8'
            },
            {
                value: '异议核查',
                checked: false,
                id: '13'
            },
            {
                value: '/',
                checked: false,
                id: '14'
            }
        ];
        that.setData({
            items: originItem
        })
        let items1 = this.data.items
        const id = e.detail.value[e.detail.value.length - 1]

        for (let i = 0, lenI = items1.length; i < lenI; ++i) {
            if (items1[i].value === id) {
                if (items1[i].id == '8') {
                    items1[0].checked = true
                    items1[5].checked = true
                } else if ((items1[i].id == '9')) {
                    items1[1].checked = true
                    items1[5].checked = true
                } else if ((items1[i].id == '10')) {
                    items1[2].checked = true
                    items1[5].checked = true
                } else if ((items1[i].id == '11')) {
                    items1[3].checked = true
                    items1[5].checked = true
                }
                wx.setStorageSync('flags', items1[i].id)
                items1[i].checked = true
            }
        }
        that.setData({
            items: items1
        })

    },
    getBorrowInfo() {
        var dataJson = JSON.stringify({
            id: that.data.authInfo.BUSINESS_ID
        })
        var custnameTwo = encr.jiami(dataJson, aeskey)
        wx.request({
            url: app.globalData.creditUrl + 'getBizVoById.do',
            data: encr.gwRequest(custnameTwo),
            method: 'POST',
            header: {
                'content-type': 'application/json',
            },
            success(res) {
                if (res.data.head.H_STATUS === "1") {
                    var jsonData = encr.aesDecrypt(res.data.body, aeskey)
                    var data2 = jsonData.LIST;
                    let BORROW_TYPE = data2[0].BORROW_TYPE;
                    let name = ''
                    if(that.data.authType == '1'){
                        if (BORROW_TYPE == '01') {
                            name = that.data.yewulxtype_array[0].name
                        } else if (BORROW_TYPE == '02') {
                            name = that.data.yewulxtype_array[1].name
                        } else if (BORROW_TYPE == '03') {
                            name = that.data.yewulxtype_array[2].name
                        } else if (BORROW_TYPE.indexOf('05') != -1) {
                            name = data2[0].BORROW_TYPE.substr(2)
                        }
                    }else{
                      //对公企业征信授权
                      var businessType = data2[0].BUSINESS_TYPE;
                      if (businessType == '1') {
                        name = that.data.yewulxtype_array2[0].name
                      } else if (businessType == '2') {
                          name = that.data.yewulxtype_array2[1].name
                      } else if (businessType == '3') {
                          name = that.data.yewulxtype_array2[2].name
                      } 
                    }
                    
                    that.setData({
                        borrowerInfo: data2[0],
                        business_type: data2[0].BUSINESS_TYPE,
                        borrow_typeName: name
                    });
                }
            }
        })


    },
    onShow: function() {

        if (that.data.id == '4') {
            if (wx.getStorageSync('flags')) {
                const id = wx.getStorageSync('flags')
                let items1 = that.data.items
                for (let i = 0, lenI = items1.length; i < lenI; ++i) {
                    if (items1[i].id === id) {
                        if (items1[i].id == '8') {
                            items1[0].checked = true
                            items1[5].checked = true
                        } else if ((items1[i].id == '9')) {
                            items1[1].checked = true
                            items1[5].checked = true
                        } else if ((items1[i].id == '10')) {
                            items1[2].checked = true
                            items1[5].checked = true
                        } else if ((items1[i].id == '11')) {
                            items1[3].checked = true
                            items1[5].checked = true
                        }
                        items1[i].checked = true
                    }
                }
                that.setData({
                    items: items1
                })
            }
        }
    }

});