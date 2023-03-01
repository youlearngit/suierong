import WxValidate from '../../assets/plugins/wx-validate/WxValidate'
const util = require('../../utils/util');
import user from "../../utils/user"
import api from "../../utils/api"

const app = getApp();
const date = new Date();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        type: '', //申请类型
        cun: '', //帮扶人所在村
        value1: '', //输入的合作社名称
        value2: '', //输入的社会统一吗
        name1: '',
        name2: '',
        preffixUrl: '',
        agree_flag: true,
        apliman_flag: true,
        showModalStatus: false,
        checklist: '',
        day_time: date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日",
        form: {
            orgID: '', //合作社统一信用代码
            orgName: '', //合作社名称
            name: '', //申请人姓名
            tel: '', //申请人手机
            idCard: '', //申请人身份证
            timeIndex: '0', //申请期限
        },
        flag_info: true, //控制6003查询信息
        codename: '获取验证码',
        times: ['12个月', '24个月', '36个月'], //申请期限
        aplitypes: [{
                name: '0',
                value: '农户贷款',
                checked: 'true'
            },
            {
                name: '1',
                value: '合作社贷款'
            }
        ], //申请类型
        flag_org: true, //合作社控制
        flag: true,
        flag_0: true,
        flag_1: true,
        flag_2: true,
        flag_3: true,
        flag_4: true,
        disabled: '',
        code: '', //验证码
        iscode: null, //用于存放验证码接口里获取到的code
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function() {
        this.setData({
            preffixUrl: app.globalData.URL,
            navTop: app.globalData.statusBarTop,
            navHeight: app.globalData.statusBarHeight,
        })
        this.initValidate();
        wx.showToast({
            title: '加载中...',
            icon: 'loading',
            duration: 2000
        })

        var that = this;
       
        user.getCustomerInfo().then(res=>{
            this.setData({
                'form.tel': res.TEL?res.TEL:'',
            })
        })

         user.getIdentityInfo().then(res=>{
            var info = res;

            //console.log(info)
            that.setData({
                 'form.name': info.NAME,
                 'form.idCard': info.ID_NUMBER,
            })

            let data = JSON.stringify({
                string_name: that.data.form.name,
                string_idcard: that.data.form.idCard
            })
            wx.request({
                url: app.globalData.URL + 'get6603',
                data: {
                    data: data
                },
                method: 'POST',
                header: {
                    "Content-Type": "application/x-www-form-urlencoded", // 默认值
                    "key": (Date.parse(new Date())).toString().substring(0, 6),
                },
                success: res => {
                    wx.hideLoading()
                    //console.log("get6603")
                    //console.log(res.data)
                    if (res.data.resultCode == '0000') {
                        that.setData({
                            cun: res.data.info9
                        })
                    }
                    wx.hideLoading()
                }
            })
         })
     

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
            // address: {
            //   required: true,
            //   address: true,
            // },
            timeIndex: {
                required: true,
                timeIndex: true,
            },
            slider: {
                required: true,
                slider: true,
            },
            verycode: {
                required: true,
            },
            managerTel: {
                tel: true,
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
            // tel: {
            //   required: "请输入法人代表手机号",
            //   tel: "请输入正确的法人代表手机号",
            // },
            idCard: {
                required: '请输入身份证号码',
                idcard: '请输入正确的身份证号码',
            },
            // address: {
            //   required: '请输入联系地址',
            // },
            orgID: {
                required: '请输入企业统一社会信用代码',
                orgID: '请输入正确的统一社会信用代码',
            },

            orgName: {
                required: '请输入企业名称',
                orgName: '企业名称只能包含汉字及全/半角括号'
            },
            slider: {
                required: '请输入申请金额',
                min: '申请金额不小于1万元',
                max: '申请金额不大于1000万元',
            },
            timeIndex: {
                required: '请选择申请期限',
            },
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


    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },



    indexpage: function() {
        wx.switchTab({
            url: "/pages/shop/index2"
        })
    },
    prePage() {
        wx.navigateBack();
    },
    //期限选择
    bindTimeChange(e) {
        const value = e.detail.value
        this.setData({
            'form.timeIndex': value,
        })
    },
    //申请类型
    radioChange: function(e) {
        let val = e.detail.value;
        let that = this;
        if (val == 0) {
            that.setData({
                flag_org: true
            })
        } else {
            that.setData({
                flag_org: false
            })
        }
        //console.log(that.data.flag_org)
    },
    mount: function(e) {
        let val = e.detail.value;
        let that = this
        if (that.data.flag_org == true) {
            var type = '0'
            that.setData({
                type: '0'
            }) //  申请类型
            var patrn = /^\d+(\.\d+)?$/;
            if (val > 5 || val <= 0 || val == '') {
                wx.showToast({
                    title: '农户贷款金额不能大于5万或小于0',
                    icon: 'none',
                    duration: 2000,
                })
                that.setData({
                    'form.slider': '',
                })
                return
            }
        } else {
            var type = '1'
            that.setData({
                type: '1'
            })
            var patrn = /^\d+(\.\d+)?$/;

            if (val > 100 || val < 0 || val == '') {
                wx.showToast({
                    title: '合作社贷款金额不能大于100万或小于0',
                    icon: 'none',
                    duration: 2000,
                })
                that.setData({
                    'form.slider': '',
                })
                return
            } else if (!patrn.exec(val)) {
                wx.showToast({
                    title: '请您输入正确数字',
                    icon: 'none',
                    duration: 2000,
                })
                that.setData({
                    'form.slider': '',
                })
            }
        }

    },
    //获取输入的手机号，以供发验证码
    getPhoneValue: function(e) {
        var _this = this
        _this.setData({
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
        } else if (a != null && a != '') {

            api.sendCode(this.data.form.tel,9).then(res=>{
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
    // 遮罩层显示
    show: function() {
        //console.log("ter")
        var that = this;
        that.setData({
            showModalStatus: true
        })
        if (that.data.flag_org == true) {
            wx.showActionSheet({
                itemList: ['《个人征信查询授权书》', '《个人综合信息查询授权委托书》'],
                itemColor: "#0066b3",
                success(res) {
                    that.setData({
                        pagescroll: ".page .noscroll"
                    })
                    if (res.tapIndex == 0) {
                        that.setData({
                            flag: false,
                            flag_0: true,
                            flag_1: false,
                            flag_2: true,
                            flag_3: true,
                            flag_4: true,
                        })

                    } else if (res.tapIndex == 1) {
                        that.setData({
                            flag: false,
                            flag_0: true,
                            flag_1: true,
                            flag_2: false,
                            flag_3: true,
                            flag_4: true,
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
        } else {
            wx.showActionSheet({
                itemList: ['《个人征信查询授权书》', '《个人综合信息查询授权委托书》', '《企业征信查询授权书》', '《企业综合信息查询授权委托书》'],
                itemColor: "#0066b3",
                success(res) {
                    that.setData({
                        pagescroll: ".page .noscroll"
                    })
                    if (res.tapIndex == 0) {
                        that.setData({
                            flag: false,
                            flag_0: true,
                            flag_1: false,
                            flag_2: true,
                            flag_3: true,
                            flag_4: true,
                        })

                    } else if (res.tapIndex == 1) {
                        that.setData({
                            flag: false,
                            flag_0: true,
                            flag_1: true,
                            flag_2: false,
                            flag_3: true,
                            flag_4: true,
                        })
                    } else if (res.tapIndex == 2) {
                        that.setData({
                            flag: false,
                            flag_0: true,
                            flag_1: true,
                            flag_2: true,
                            flag_3: false,
                            flag_4: true,
                        })
                    } else if (res.tapIndex == 3) {
                        that.setData({
                            flag: false,
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
        }

    },
    // 遮罩层隐藏
    conceal: function() {
        var that = this;
        that.setData({
            showModalStatus: true
        })
        if (that.data.flag_org == true) {
            wx.showActionSheet({
                itemList: ['《个人征信查询授权书》', '《个人综合信息查询授权委托书》'],
                itemColor: "#0066b3",
                success(res) {
                    that.setData({
                        showModalStatus: true
                    })
                    if (res.tapIndex == 0) {
                        that.setData({
                            flag: false,
                            flag_0: true,
                            flag_1: false,
                            flag_2: true,
                            flag_3: true,
                            flag_4: true,
                        })

                    } else if (res.tapIndex == 1) {
                        that.setData({
                            flag: false,
                            flag_0: true,
                            flag_1: true,
                            flag_2: false,
                            flag_3: true,
                            flag_4: true,
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

        } else {
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
                            flag_0: true,
                            flag_1: false,
                            flag_2: true,
                            flag_3: true,
                            flag_4: true,
                        })

                    } else if (res.tapIndex == 1) {
                        that.setData({
                            flag: false,
                            flag_0: true,
                            flag_1: true,
                            flag_2: false,
                            flag_3: true,
                            flag_4: true,
                        })

                    } else if (res.tapIndex == 2) {
                        that.setData({
                            flag: false,
                            flag_0: true,
                            flag_1: true,
                            flag_2: true,
                            flag_3: false,
                            flag_4: true,
                        })
                    } else if (res.tapIndex == 3) {
                        that.setData({
                            flag: false,
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
        }

    },
    //
    showInfo: function() {
        let that = this;
        // that.setData({
        //     flag_info: false
        // })
        if (that.data.flag_org) {
            //console.log("个人")
            //调个人查询6003
            wx.showToast({
                title: '加载中...',
                icon: 'loading',
                duration: 1000
            })
            let data = JSON.stringify({
                string_name: that.data.form.name,
                string_idcard: that.data.form.idCard
                // string_name:'程琳',
                // string_idcard:'320104199210080853'
            })
            wx.request({
                url: app.globalData.URL + 'get6603',
                data: {
                    data: data
                },
                method: 'POST',
                header: {
                    "Content-Type": "application/x-www-form-urlencoded", // 默认值
                    "key": (Date.parse(new Date())).toString().substring(0, 6),
                },
                success: res => {
                    wx.hideLoading()
                    //console.log(res.data)
                    if (res.data.resultCode == '0000' && res.data.info3 != '') {
                        this.setData({
                            'name1': res.data.info3,
                            'name2': res.data.info5,
                            flag_info: false
                        })
                    } else {
                        wx.showToast({
                            title: '很抱歉，没有查到相关信息',
                            icon: 'none',
                            duration: 2000,
                        })
                    }

                }
            })

        } else {
            //console.log("合作社")
            if (this.data.form.orgName != "" && this.data.form.orgID != "") {
                wx.showToast({
                    title: '加载中...',
                    icon: 'loading',
                    duration: 1000
                })
                let data = JSON.stringify({
                    string_name: that.data.form.name,
                    string_idcard: that.data.form.idCard
                    // string_name: '程琳',
                    // string_idcard: '320104199210080853'
                })
                //console.log("合作社111111111111")
                wx.request({
                    url: app.globalData.URL + 'get6603',
                    data: {
                        data: data
                    },
                    method: 'POST',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded", // 默认值
                        "key": (Date.parse(new Date())).toString().substring(0, 6),
                    },
                    success: res => {
                        wx.hideLoading()
                        //console.log(res.data)
                        if (res.data.resultCode = '0000' && res.data.info10 != '') {
                            this.setData({
                                'name1': res.data.info10,
                                'name2': res.data.info12,
                                flag_info: false,
                            })
                        } else {
                            wx.showToast({
                                title: '很抱歉，没有查到相关信息',
                                icon: 'none',
                                duration: 2000,
                            })
                        }

                    }
                })
            } else {
                wx.showToast({
                    title: '请录入合作社名称和统一信用代码',
                    icon: 'none',
                    duration: 2000,
                })
                this.setData({
                    flag_info: true
                })
                //console.log("合作社22222")
            }
            return
        }
    },
    cloinfobox: function() {
        let that = this;
        that.setData({
            flag_info: true
        })
    },
    // 拿到合作社
    getvalue1: function(e) {
        var val = e.detail.value;
        this.setData({
            'form.orgName': val
        })
        //console.log(val)
    },
    getvalue2: function(e) {
        var val1 = e.detail.value;
        this.setData({
            'form.orgID': val1
        })
        //console.log(val1)
    },
    //提交按钮
    submitForm(e) {
        var that = this
        const params = e.detail.value; //获取表单参数
        //console.log(params)
        //未勾选同意按钮
        if (that.data.checklist != 'checked') {
            wx.showToast({
                title: '请勾选同意协议',
                icon: 'none',
                duration: 2000,
            })
            return;
        }
        if (that.data.flag_org == true) {
            var type = '0'
            that.setData({
                type: '0'
            }) //  申请类型
            var patrn = /^\d+(\.\d+)?$/;
            if (params.slider > 5 || params.slider <= 0 || params.slider == '') {
                wx.showToast({
                    title: '农户贷款金额不能大于5万或小于0',
                    icon: 'none',
                    duration: 2000,
                })
                that.setData({
                    'form.slider': '',
                })
                return
            } else if (!patrn.exec(params.slider)) {
                wx.showToast({
                    title: '请您输入正确数字',
                    icon: 'none',
                    duration: 2000,
                })
                that.setData({
                    'form.slider': '',
                })
            }
        } else {
            var type = '1'
            that.setData({
                type: '1'
            })
            var patrn = /^\d+(\.\d+)?$/;
            if (params.orgName == '' || params.orgID == '') {
                wx.showToast({
                    title: '合作社名称或统一信用码不能为空',
                    icon: 'none',
                    duration: 2000,
                })
                return
            }
            if (params.slider > 100 || params.slider < 0 || params.slider == '') {
                wx.showToast({
                    title: '合作社贷款金额不能大于100万或小于0',
                    icon: 'none',
                    duration: 2000,
                })
                that.setData({
                    'form.slider': '',
                })
                return
            } else if (!patrn.exec(params.slider)) {
                wx.showToast({
                    title: '请您输入正确数字',
                    icon: 'none',
                    duration: 2000,
                })
                that.setData({
                    'form.slider': '',
                })
            }
        }
        //console.log(that.data.code) //验证码
        if (that.data.code == '') {
            wx.showToast({
                title: '请您输入验证码',
                icon: 'none',
                duration: 2000,
            })
            return
        }

        let str = JSON.stringify({
             string_custname: params.name, //姓名
             string_certid: params.idCard, //身份证号码
            string_phoneno: params.tel, //电话
            string_entprisename: params.orgName, //企业信息
            string_socialcreditcode: params.orgID, //统一吗
            string_entpriseaddr: '', //企业地址
            string_applyamount: params.slider, //申请金额
            string_applyterm: params.timeIndex.substring(0, 2), //申请期限
            string_contacts: '',
            string_phonenumber: '',
            string_district: '',
            string_type: that.data.type,
            string_cun: that.data.cun
        })
        //console.log(str)
        str = util.toCDB(str.replace(/\(/g, '-括号').replace(/\（/g, '-括号').replace(/\)/g, '括号-').replace(/\）/g, '括号-'));
        str = util.enct(str) + util.digest(str);
        wx.showLoading({
            title: '校验信息中...',
        })
        wx.request({
            url: app.globalData.URL + 'addSunshineApply', // 仅为示例，并非真实的接口地址
            data: {
                data: str,
                code: that.data.code,
                phone: params.tel,
                open_id: wx.getStorageSync("openid"),
            },
            method: 'POST',
            header: {
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
                "key": (Date.parse(new Date())).toString().substring(0, 6),
                "transNo": 'XC014',
                "sessionId": wx.getStorageSync("sessionid"),
            },
            success(res) {
                //console.log(res.data)
                //console.log(res.data.stringData)

                wx.hideLoading()

                if (res.data.stringData != undefined) {
                    var pms = JSON.parse(res.data.stringData)
                    if (pms.orderNo != undefined) {
                        //说明成功了

                        //console.log("成功了！！！！！！！！！！！！")
                        wx.showToast({
                            title: '提交成功',
                            icon: 'none',
                            duration: 1000
                        })
                        wx.navigateTo({
                            url: 'apply_result?data=' + res.data.stringData
                        })
                    }

                } else {
                    //失败了，提示返回信息
                    wx.showModal({
                        title: '提示',
                        content: res.data.msg,
                        showCancel: false, //是否显示取消按钮
                        success: function(res) {},
                        fail: function(res) {}, //接口调用失败的回调函数
                        complete: function(res) {}, //接口调用结束的回调函数（调用成功、失败都会执行）
                    })
                }
            }
        })
    }
})