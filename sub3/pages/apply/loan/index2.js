// pages/carLoans/apply/loan/index2.js
import log from '../../../../log.js';
import requestYT from "../../../../api/requestYT";
import api from '../../../../utils/api.js'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form :{
      carApplyAmount:'',//车贷申请金额
      carApplyMonth:'',//车贷申请期限
      suiEApplyAmount:'',//消费随e贷申请金额
      suiEApplyMonth:'',//消费随e贷申请期限
      chargeOrgId:'',//经办客户经理工号
      tel:'',//手机号码
    },
    dealerInfo:{
      dealer:'',
      name: '',
      tel: '',
      address: '',
    }, //车商信息
    smsCode:'',//短信验证码
    verifySMSFlag:false, //短信验证码校验标记
    disabled: false,
    preffixUrl: app.globalData.CDNURL,
    verifyResul:'', //获取人脸识别返回verifyResul字段，用于查询batchId
    btnFlag: false,
    intId:'',
    scene:'',
    prdCode:'',
    codename: '获取验证码',
    contractPageFlag: false, //协议弹窗标记
    backBtnName:5,
    showContractFlag: 1,

    batchNo:'',//征信授权返回的唯一表示
    photo:'',
    batchId:'',

    // 合同使用固定参数
    nbsp:'&nbsp;&nbsp;&nbsp;&nbsp;',
    Y:'',
    M:'',
    D:'',
    topNum: 0,//返回顶部
  },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        var form = JSON.parse(options.jsonStr)
        that.setData({
            form: form,
            scene: options.scene,
            prdCode: options.prdCode,
            preffixUrl: app.globalData.CDNURL,
            intId: wx.getStorageSync('openid'),
        });
        that.goDetail();
        var timestamp = Date.parse(new Date());
        var date = new Date(timestamp);
        //获取年份  
        this.setData({
            Y: date.getFullYear(),
            M: (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1),
            D: date.getDate() < 10 ? '0' + date.getDate() : date.getDate(),
        });
    },
    //获取车商详情
    goDetail: function() {
        let options = {
            url: 'carloan/searchCarSellerInfo.do',
            data: {
                prjId: this.data.scene
            }
        };
        var than = this;
        requestYT(options).then((res) => {
            if (res.STATUS === '1') {
                var newRes = JSON.parse(res.carList);
                this.setData({
                    dealerInfo: {
                        dealer: newRes.cAR_DEALER_NAME,
                        name: newRes.sALESMAN_NAME,
                        tel: newRes.sALESMAN_PHONE,
                        address: newRes.oPERATE_ADDR
                    }
                });
            } else {
                return Promise.reject('网络异常');
            }
        });
    },
    // 获取短信验证码
    getCode: function(e) {
        if (this.data.codename != '获取验证码' && this.data.codename != '重新发送') {
            return;
        };
        var tel = this.data.form.tel;
        var _this = this;
        var myreg = /^1[3456789]\d{9}$/;
        if (tel == "" || tel == undefined) {
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
        } else if (tel.length != 11) {
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
        } else if (!myreg.test(tel)) {
            wx.showToast({
                title: '手机号格式不对',
                icon: 'none',
                duration: 1000
            })
        } else {
            let options = {
                url: "/phoneMsg/getCode.do",
                data: {
                    phone: tel,
                    type: 200,
                    openid: wx.getStorageSync('openid'),
                },
            };
            requestYT(options).then(res => {
                if (res.result_code == '0000') {
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
            }).catch(err => {
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
    //点击获取验证码按钮，触发按钮事件
    getVerificationCode(e) {
        this.getCode();
        var _this = this
        _this.setData({
            disabled: true
        })
    },
    //记录信息
    inputCarApplyAmount(e) {
        var formtab = this.data.form;
        formtab.carApplyAmount = e.detail.value;
        if (formtab.suiEApplyAmount != '' && formtab.suiEApplyAmount != undefined) {
            formtab.suiEApplyMonth = formtab.carApplyMonth;
        } else {
            formtab.suiEApplyMonth = '';
        }
        this.setData({
            form: formtab
        });
    },
    inputCarApplyMonth(e) {
        var formtab = this.data.form;
        formtab.carApplyMonth = e.detail.value;
        if (formtab.suiEApplyAmount != '' && formtab.suiEApplyAmount != undefined) {
            formtab.suiEApplyMonth = formtab.carApplyMonth;
        } else {
            formtab.suiEApplyMonth = '';
        }
        this.setData({
            form: formtab
        });
    },
    inputSuiEApplyAmount(e) {
        var formtab = this.data.form;
        formtab.suiEApplyAmount = e.detail.value;
        if (formtab.suiEApplyAmount != '' && formtab.suiEApplyAmount != undefined) {
            formtab.suiEApplyMonth = formtab.carApplyMonth;
        } else {
            formtab.suiEApplyMonth = '';
        }
        this.setData({
            form: formtab
        });
    },
    inputSuiEApplyMonth(e) {
        var formtab = this.data.form;
        formtab.suiEApplyMonth = e.detail.value;
        this.setData({
            form: formtab
        });
    },
    inputChargeOrgId(e) {
        var formtab = this.data.form;
        formtab.chargeOrgId = e.detail.value;
        this.setData({
            form: formtab
        });
    },
    inputTel(e) {
        var formtab = this.data.form;
        formtab.tel = e.detail.value;
        this.setData({
            form: formtab
        });
    },
    inputSmsCode(e) {
        var that = this;
        that.setData({
            smsCode: e.detail.value,
        });
        var tel = that.data.form.tel;
        var code = e.detail.value;
        if (code.length == 6 && tel.length == 11) {
            let options = {
                url: "/jsyh/compareCode.do",
                data: {
                    uuid: wx.getStorageSync('openid'),
                    code: code,
                },
            };
            requestYT(options).then((res) => {
                if (res.STATUS === "1") {
                    that.setData({
                        verifySMSFlag: true,
                    });
                }
            }).catch(err => {});
        }
    },
    //end
    //提交表单
    goSubmit() {
        var that = this;
        var formtab = this.data.form;
        var re = /^[0-9]+$/; //正整数校验判断

        if (formtab.carApplyAmount == '' || formtab.carApplyAmount == undefined) {
            this.alertError('请输入车贷申请金额')
            return;
        } else if (Number(formtab.carApplyAmount) < 30000) {
            this.alertError('车贷申请金额需大于30000')
            return;
        }
        if (formtab.carApplyMonth == '' || formtab.carApplyAmount == undefined) {
            this.alertError('请输入车贷申请期限')
            return;
        } else if (Number(formtab.carApplyMonth) > 36 || Number(formtab.carApplyMonth) < 6) {
            this.alertError('车贷申请期限请在6-36月之间')
            return;
        }
        if ((formtab.suiEApplyAmount != '' && formtab.suiEApplyAmount != undefined)) {
            if (Number(formtab.suiEApplyAmount) < 1000) {
                this.alertError('随e贷申请金额需大于1000')
                return;
            }
        } else {
            if (formtab.suiEApplyMonth != '' && formtab.suiEApplyMonth != undefined) {
                this.alertError('请输入随e贷申请金额');
                return;
            }
        }
        if (formtab.suiEApplyAmount != '' && formtab.suiEApplyAmount != undefined) {
            if (formtab.suiEApplyMonth != '' && formtab.suiEApplyMonth != undefined) {
                if (Number(formtab.suiEApplyMonth) > 36 || Number(formtab.suiEApplyMonth) < 6) {
                    this.alertError('随e贷申请期限请在6-36月之间')
                    return;
                }
            } else {
                this.alertError('请输入随e贷申请期限')
                return;
            }
        }
        if (formtab.tel == '' || formtab.tel == undefined) {
            this.alertError('请输入手机号')
            return;
        }
        if (!that.data.smsCode) {
            this.alertError('请输入验证码')
            return;
        }
        if (!this.data.verifySMSFlag) {
            this.alertError('验证码校验失败')
            return;
        }
        if (!this.data.btnFlag) {
            this.alertError('请阅读授权书内容')
            return;
        }
        this.toSubmit();
    },
    // 人脸识别
    async getBatchId() {
        var that = this;
        if (that.data.backBtnName > 0) {
            return
        }
        try {
            const res = await api.getImageAndBatchId(that.data.form.name, that.data.form.number);
            that.setData({
                photo: res.image,
                batchId: res.batchID
            })
            await that.uploadPhoto();
        } catch (error) {
            wx.showModal({
                title: '提示',
                content: error.message || error,
                showCancel: false,
                confirmText: '确定',
                success: (result) => {
                    if (result.confirm) {}
                },
            });
        }
    },
    //上传影像
    uploadPhoto() {
        wx.showLoading({
            title: '请稍候',
            mask: true,
        });
        var that = this;
        let options = {
            url: 'carloan/uploadPicToYxpy.do',
            data: JSON.stringify({
                certCode: this.data.form.number,
                batchId: that.data.batchId,
            }),
        };
        requestYT(options).then((res) => {
            if (res.msgCode == '0000') {
                wx.hideLoading();
                that.successUpdateContract();
            } else {
                wx.showToast({
                    title: '影像获取失败',
                    icon: 'none',
                    duration: 1000
                })
                that.failUpdateContract();
            }
        })
    },
    //发起签章
    toSubmit() {
        //签章
        wx.showLoading({
            title: '请稍候',
            mask: true
        });
        var that = this;
        var type = 'b06';
        let options = {
            url: 'carloan/sign.do',
            data: {
                type: type.toLocaleUpperCase(),
                certCode: that.data.form.number,
                applyName: that.data.form.name,
                lendCertNo: that.data.form.number,
                lendName: that.data.form.name,
                base64: that.data.photo,
            }
        };
        requestYT(options).then((res) => {
            if (res.msgCode === '0000') {
                this.setData({
                    batchNo: res.batchNo
                });
                //签章保存成功,下一步保存表单数据
                that.saveFormDate();
            } else {
                wx.showToast({
                    title: res.msg,
                    icon: 'none',
                });
                wx.hideLoading();
            }
        }).catch(e => {
            this.alertError('网络异常');
            wx.hideLoading();
        });
    },
    //保存表单
    saveFormDate() {
        var that = this;
        let options = {
            url: 'carloan/submitFirstAuditInfo.do',
            data: {

                prjId: that.data.scene, //项目编号
                prdCode: that.data.prdCode, //产品编号
                prdName: that.data.prdCode == '910201' ? '个人一手汽车消费贷款' : '个人二手汽车消费贷款', //产品名称
                intId: that.data.intId,
                mobilePhone: that.data.form.tel,
                carDealerName: that.data.dealerInfo.dealer,
                saleManName: that.data.dealerInfo.name,
                saleManPhone: that.data.dealerInfo.tel,
                operateAddr: that.data.dealerInfo.address,
                cusName: that.data.form.name,
                certCode: that.data.form.number,
                certType: '0',
                certEndDate: that.data.form.date == '长期' ? '9999-12-31' : that.data.form.date,
                sex: that.data.form.gender == '女' ? '2' : '1',
                marStatus: '', //婚姻状态
                cusType: 'A01',
                occupation: that.data.form.profession,
                yearIncome: that.data.form.tax_income,
                fundCity: that.data.form.gjj_city,
                workUnitName: that.data.form.company_name,
                workAddrCode: that.data.form.company_city_code,
                workAddrStreet: that.data.form.company_address,
                cusSedApplyAmt: that.data.form.suiEApplyAmount == undefined ? "0" : that.data.form.suiEApplyAmount,
                cusSedApplyTerm: that.data.form.suiEApplyMonth == undefined ? "0" : that.data.form.suiEApplyMonth,
                chargeOrgId: that.data.form.chargeOrgId || '',
                cusApplyAmt: that.data.form.carApplyAmount,
                cusApplyTerm: that.data.form.carApplyMonth,
                iveStatus: that.data.form.select_ddress_status,
                batchNo: that.data.batchNo,
                lendCertNo: that.data.form.number,
                lendName: that.data.form.name,
                authorType: '01',
                imageLotNumber: that.data.batchId
            }
        };
        console.log(options.data);
        requestYT(options).then((res) => {
            if (res.msgCode === '0000') {
                this.toResultPage("1", "");
            } else if (res.msgCode == '1111') {
                this.toResultPage("0", res.msg);
            } else if (res.msgCode == '2222') {
                that.alertError(res.msg);
            }
        }).catch((err) => {
            wx.hideLoading();
            return Promise.reject('网络异常');
        });
    },
    //跳转到结果页面
    toResultPage(status, errorMsg) {
        var str = '/sub3/pages/apply/loan/resultPage?status=' + status;
        if (status == '0') {
            str = str + '&errorMsg=' + errorMsg
        }
        wx.navigateTo({
            url: str,
        })
    },
    //提示错误信息
    alertError(content) {
        wx.showModal({
            title: '提示',
            content: content,
            showCancel: false,
            confirmText: '确定',
            confirmColor: '#3CC51F',
            success: (result) => {
                if (result.confirm) {}
            },
            fail: () => {},
            complete: () => {},
        });
    },
    //打开合同
    openAction(e) {
        this.setData({
            showContractFlag: 1,
            contractPageFlag: true,
        });
        this.readingCoundDown();
    },
    //下一份合同
    nextAction(e) {
        if (this.data.backBtnName > 0) {
            return
        }
        this.setData({
            showContractFlag: this.data.showContractFlag + 1,
            backBtnName: 5,
            topNum: 0
        });
        this.readingCoundDown();
    },

  successUpdateContract(){
    this.setData({
      showContractFlag: 1,
      contractPageFlag: false,//第二张协议弹窗标记
      btnFlag:true
    });
  },
  failUpdateContract(){
    this.setData({
      contractPageFlag: false,//第二张协议弹窗标记
      showContractFlag:"1",
      btnFlag:false
    });
  },
  // 点击勾选查看授权书提示
  seeCont(e){
    if(!this.data.btnFlag){
      this.alertError('请阅读《综合信息查询授权授权书》、《征信查询授权书》')
      return;
    }
  },
  // 按钮倒计时5秒
  readingCoundDown() {
    let time = 5;
    this.setData({
      backBtnName: time,
    });
    let cutDown = setInterval(() => {
      time--;
      if (time < 1 ) {
        this.setData({
          dialogflag : false,
        });
        clearInterval(cutDown);
      }
      this.setData({
        backBtnName: time,
      });
    }, 1000);
  },
})