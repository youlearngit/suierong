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
        form: {
            carApplyAmount: '', //房贷申请金额
            carApplyMonth: '', //房贷申请期限
            suiEApplyAmount: '', //消费随e贷申请金额
            suiEApplyMonth: '', //消费随e贷申请期限
            purchase_address: '',
            chargeOrgId: '', //经办客户经理工号
            tel: '', //手机号码
        },
        dealerInfo: {
            dealer: '',
            name: '',
            tel: '',
            address: '',
        }, //车商信息
        smsCode: '', //短信验证码
        verifySMSFlag: false, //短信验证码校验标记
        disabled: false,
        preffixUrl: app.globalData.CDNURL,
        verifyResul: '', //获取人脸识别返回verifyResul字段，用于查询batchId
        btnFlag: false,
        intId: '',
        scene: '',
        prdCode: '',
        codename: '获取验证码',
        contractPageFlag: false, //协议弹窗标记
        backBtnName: 5,
        showContractFlag: 1,
        batchNo: '', //征信授权返回的唯一表示
        photo: '',
        batchId: '',
        // 合同使用固定参数
        nbsp: '&nbsp;&nbsp;&nbsp;&nbsp;',
        Y: '',
        M: '',
        D: '',
        topNum: 0, //返回顶部
        product: '',
        productIndex: ['0'],
        productArray: [],
        bookType: 'C06'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        let { scene, prdCode, jsonStr } = options;
        let form = JSON.parse(jsonStr)
        let prdCodeList = prdCode.endsWith(',')?prdCode.substring(0,prdCode.length-1).split(',') : prdCode.split(',');
        let productArr = [];
        prdCodeList.forEach(item => {
            let obj = {};
            obj.code = item;
            switch (item) {
                case '910101':
                    obj.name = '个人一手住房贷款';
                    break;
                case '930001':
                    obj.name = '个人一手住房省公组合贷款';
                    break;
                case '930003':
                    obj.name = '个人一手住房市公组合贷款';
                    break;
                case '910106':
                    obj.name = '公转商一手房补息贷款';
                    break;
                case '910104':
                    obj.name = '个人一手商业用房贷款';
                    break;
                case '910102':
                    obj.name = '个人二手住房贷款';
                    break;
                case '930002':
                    obj.name = '个人二手住房省公组合贷款';
                    break;
                case '930004':
                    obj.name = '个人二手住房市公组合贷款';
                    break;
                case '910107':
                    obj.name = '公转商二手房补息贷款';
                    break;
                default:
                    break;
            }
            productArr.push(obj);
        })
        let resultArr = productArr.filter(item => item.code !== '930001').filter(item => item.code !== '930002');
        that.setData({
            form,
            scene,
            prdCode,
            preffixUrl: app.globalData.CDNURL,
            intId: wx.getStorageSync('openid'),
            productArray: [resultArr],
        });
        
        that.goDetail();
        let timestamp = Date.parse(new Date());
        let date = new Date(timestamp);
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
                var newRes2 = JSON.parse(res.baseList);
                this.setData({
                    dealerInfo: {
                        dealer: newRes.cAR_DEALER_NAME,
                        name: newRes.sALESMAN_NAME,
                        tel: newRes.sALESMAN_PHONE,
                        address: newRes.oPERATE_ADDR,
                    },
                    bookType: newRes2.pRJ_NAME.indexOf('贝壳')>-1 ? 'C06-1' : 'C06'
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
    //选择产品类型
    productProfession(e) {
        let { productArray, productIndex } = this.data;
        productIndex[0] = e.detail.value[0];
        var formtab = this.data.form;
        formtab.product = productArray[0][e.detail.value[0]].code
        this.setData({
            form: formtab,
            product: productArray[0][e.detail.value[0]].name,
            productIndex,
            
        });
    },
    //房贷申请金额
    inputCarApplyAmount(e) {
        var formtab = this.data.form;
        formtab.carApplyAmount = e.detail.value;
        if (formtab.carApplyAmount && formtab.suiEApplyAmount) {
            let pay1 = Number(formtab.carApplyAmount);
            let pay2 = Number(formtab.suiEApplyAmount);
            formtab.suiEApplyMonth = ((pay2 - pay1) / pay2) * 100;
        } else {
            formtab.suiEApplyMonth = ''
        }
        this.setData({
            form: formtab
        });
    },
    //房贷申请期限
    inputCarApplyMonth(e) {
        var formtab = this.data.form;
        formtab.carApplyMonth = e.detail.value;
        this.setData({
            form: formtab
        });
    },
    //购买总价
    inputSuiEApplyAmount(e) {
        var formtab = this.data.form;
        formtab.suiEApplyAmount = e.detail.value;
        if (formtab.carApplyAmount && formtab.suiEApplyAmount) {
            let pay1 = Number(formtab.carApplyAmount);
            let pay2 = Number(formtab.suiEApplyAmount);
            formtab.suiEApplyMonth = ((pay2 - pay1) / pay2) * 100;
        } else {
            formtab.suiEApplyMonth = ''
        }
        this.setData({
            form: formtab
        });
    },
    //首付比例
    inputSuiEApplyMonth(e) {
        var formtab = this.data.form;
        formtab.suiEApplyMonth = e.detail.value;
        this.setData({
            form: formtab
        });
    },
    inputCompanyName(e) {
        var formtab = this.data.form;
        formtab.purchase_address = e.detail.value;
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
        // console.log(formtab.product)
        if (!formtab.product) {
            this.alertError('请选择房贷申请产品')
            return;
        }
        if (formtab.carApplyAmount == '' || formtab.carApplyAmount == undefined) {
            this.alertError('请输入房贷申请金额')
            return;
        } else if (Number(formtab.carApplyAmount) < 30000) {
            this.alertError('房贷申请金额需大于30000')
            return;
        }
        if (formtab.carApplyMonth == '' || formtab.carApplyAmount == undefined) {
            this.alertError('请输入房贷申请期限')
            return;
        }
        if (Number(formtab.carApplyMonth) > 360 || Number(formtab.carApplyMonth) < 1) {
            this.alertError('房贷申请期限请在1-360月之间')
            return;
        }
        if ((formtab.suiEApplyAmount == '' && formtab.suiEApplyAmount == undefined)) {
            this.alertError('请输入购买总价');
            return;
        }
        if (formtab.suiEApplyMonth == '' && formtab.suiEApplyMonth == undefined) {
            this.alertError('请输入首付比例');
            return;
        }
        if (!formtab.purchase_address) {
            this.alertError('请输入拟购房地址');
            return;
        }
        if (this.countNumbers(formtab.purchase_address) < 20) {
            this.alertError('请录入的拟购房地址不少于10个汉字');
            return;
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
        var type = that.data.bookType;
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
            console.log('sign签章', res)
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
            console.log(e)
            this.alertError('网络异常');
            wx.hideLoading();
        });
    },
    //保存表单
    saveFormDate() {
        let that = this;
        let { productArray, product, scene, intId, batchNo, batchId, form, dealerInfo } = that.data;
        let productArr = productArray[0];
        let productObj = productArr.find(item => item.name === product);
        let prdName = productObj.name || '';
        let prdCode = productObj.code || '';
        let certType = '0';
        let cusType = 'A01';
        let authorType = '01';
        let options = {
            url: 'carloan/submitFirstAuditInfo.do',
            data: {
                TYPE: wx.getStorageSync('loanType') == '1' ? '0' : '1',
                prjId: scene, //项目编号
                prdCode, //产品编号
                prdName, //产品名称
                intId,
                mobilePhone: form.tel,
                carDealerName: dealerInfo.dealer,
                saleManName: dealerInfo.name,
                saleManPhone: dealerInfo.tel,
                operateAddr: dealerInfo.address,
                cusName: form.name,
                certCode: form.number,
                certType,
                certEndDate: form.date === '长期' ? '9999-12-31' : form.date,
                sex: form.gender == '女' ? '2' : '1',
                marStatus: form.hyzk, //婚姻状态
                cusType,
                occupation: form.profession,
                yearIncome: form.tax_income,
                fundCity: form.gjj_city,
                workUnitName: form.company_name,
                workAddrCode: form.company_city_code,
                workAddrStreet: form.company_address,
                cusSedApplyAmt: '',
                cusSedApplyTerm: '',
                chargeOrgId: form.chargeOrgId,
                cusApplyAmt: form.carApplyAmount,
                cusApplyTerm: form.carApplyMonth,
                iveStatus: form.select_ddress_status,
                batchNo,
                lendCertNo: form.number,
                lendName: form.name,
                authorType,
                imageLotNumber: batchId,
                fullCost: form.suiEApplyAmount || '0',
                downPaymentPer: that.percentage(form.suiEApplyMonth),
                houseAddr: form.purchase_address,
            }
        };
        //wx.hideLoading();
        requestYT(options).then((res) => {
            console.log('提交初审', options, res)
            if (res.msgCode === '0000') {
                this.toResultPage("1", "");
            } else if (res.msgCode == '1111') {
                this.toResultPage("0", res.msg);
            } else if (res.msgCode == '2222') {
                that.alertError(res.msg);
            }
        }).catch((err) => {
            console.log(err)
            wx.hideLoading();
            return Promise.reject('网络异常');
        });
    },
    //跳转到结果页面
    toResultPage(status, errorMsg) {
        var str = '/sub3/pages/apply/loan/resultPage?status=' + status + '&type=1';
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

    successUpdateContract() {
        this.setData({
            showContractFlag: 1,
            contractPageFlag: false, //第二张协议弹窗标记
            btnFlag: true
        });
    },
    failUpdateContract() {
        this.setData({
            contractPageFlag: false, //第二张协议弹窗标记
            showContractFlag: "1",
            btnFlag: false
        });
    },
    // 点击勾选查看授权书提示
    seeCont(e) {
        if (!this.data.btnFlag) {
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
            if (time < 1) {
                this.setData({
                    dialogflag: false,
                });
                clearInterval(cutDown);
            }
            this.setData({
                backBtnName: time,
            });
        }, 1000);
    },
    //识别工作单位输入字符长度，数字计算为0.5个字符，其他正常计算为1
    countNumbers(str) {
        // 计数变量
        let count = 0;
        if (str) {
            for (let i = 0; i < str.length; i++) {
                if (str.charCodeAt(i) > 255) {
                    count += 2;
                } else {
                    count++;
                }
            }
            return count
        } else {
            return 0
        }
    },
    //百分比处理
    percentage(str) {
        let num = parseFloat(str);
        if (typeof num === 'number') {
            return String(num / 100)
        } else {
            return '0'
        }
    },
})