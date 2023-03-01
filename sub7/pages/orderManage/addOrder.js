import Get from "../../../api/Get";
var dateTimePicker = require('../../../utils/dateTimePicker.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        preffixUrl: getApp().globalData.CDNURL,
        shType: 0, //0新增  1修改
        shType1: 0, //针对有些不能修改0可修改 1查看  2提示不能修改
        info: 0, //0确认新增 1确认修改
        customerId: '', //商户id
        allList: '',
        downsearch: false,
        height: '',
        listvalue: {
            orderNo: '', //订单号
            orderMoney: '', //订单金额
            remark: '', //商品信息
            customerName: '', //商户名称
            collectionTime: '', //应收时间
            collectRemark: '', //已付款备注
            seller: '', //营销人员
            sellerPhone: '' //营销人员手机号
        },
        TimeID: -1,
        orderStatus: '0', //订单状态 0已付款 1未付款 2欠款
        dateTimeArray1: null,
        dateTime1: null,
        startYear: null,
        endYear: null,
        inputMarBot: false, //input框聚焦时，让框距离底部的距离为200rpx
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // 获取完整的年月日 时分秒，以及默认显示的数组
        var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
        var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
        // 精确到分的处理，将数组的秒去掉
        //var lastArray = obj1.dateTimeArray.pop();
        //var lastTime = obj1.dateTime.pop();

        this.setData({
            dateTimeArray1: obj1.dateTimeArray,
            dateTime1: obj1.dateTime
        });


        console.log(options)
        if (options.msg == '0') {
            wx.setNavigationBarTitle({
                title: "新增订单"
            })
            this.setData({
                shType: 0,
                shType1: 0
            })
        } else {
            wx.setNavigationBarTitle({
                title: "修改订单"
            })
            this.setData({
                shType: 1,
                shType1: 1
            })
            console.log(JSON.parse(options.listvalue))
            if (options.listvalue) {
                this.setData({
                    listvalue: JSON.parse(options.listvalue),
                    orderStatus: JSON.parse(options.listvalue).orderStatus //订单状态
                });
            }
        }
        console.log(this.data.shType)
        this.getAllShList();
        if (this.data.allList.length >= 5) {
            this.setData({
                height: '385rpx'
            });
        } else {
            this.setData({
                height: 'auto'
            });
        }
    },
    //获取所有商户
    async getAllShList() {
        let data = {}
        data.Authorization = wx.getStorageSync('token');
        data.currentPage = '1';
        data.pageSize = '0';
        var that = this;
        await Get.getMerchantList(data).then(res => {
            that.setData({
                allList: JSON.parse(res.list)
            });
        })
        console.log(this.data.allList)
        if (this.data.allList.length >= 5) {
            this.setData({
                height: '385rpx'
            });
        } else {
            this.setData({
                height: 'auto'
            });
        }
    },
    //搜索商户名称
    getValue(e) {
        let val = e.detail.value.trim();
        let name = e.currentTarget.dataset.name;
        let item = 'listvalue.' + name
        this.setData({
            [item]: val
        });
        console.log(this.data.listvalue.customerName)
        if (val.length > 0) {
            let arr = [];
            for (let i = 0; i < this.data.allList.length; i++) {
                if (this.data.allList[i].customerName.indexOf(val) > -1) {
                    arr.push({
                        acctno: this.data.allList[i].acctno,
                        bankAccountNumber: this.data.allList[i].bankAccountNumber == undefined ? '' : this.data.allList[i].bankAccountNumber,
                        checked: false,
                        createBy: this.data.allList[i].createBy,
                        createTime: this.data.allList[i].createTime,
                        currency: this.data.allList[i].currency,
                        customerName: this.data.allList[i].customerName,
                        id: this.data.allList[i].id,
                        linkman: this.data.allList[i].linkman,
                        subAccount: this.data.allList[i].subAccount,
                        telephone: this.data.allList[i].telephone,
                        seller: this.data.allList[i].seller == undefined ? '' : this.data.allList[i].seller,
                        sellerPhone: this.data.allList[i].sellerPhone == undefined ? '' : this.data.allList[i].sellerPhone
                    })
                }
            }
            this.setData({
                allList: arr,
            })
            console.log(this.data.allList)

        } else {
            console.log('2222')
            this.setData({
                allList: []
            })
            this.getAllShList();
        }
        if (this.data.allList.length >= 5) {
            this.setData({
                height: '385rpx'
            });
        } else {
            this.setData({
                height: 'auto'
            });
        }
    },
    settingMbShow: function () {
        this.setData({
            inputMarBot: true
        })
    },
    jumpcustomerName(e) {
        console.log(e)
        let arr = [];
        let only = e.currentTarget.dataset.item;
        let name = only.customerName;
        let id = only.id;
        console.log(name)
        console.log(only)
        arr.push(only)
        this.setData({
            [`listvalue.customerName`]: name,
            customerId: id,
            downsearch: false
        })
    },
    bindEvent() {
        this.setData({
            downsearch: true
        })
    },
    funInput(e) {
        console.log(e)
        var getValue = e.currentTarget.dataset.name;
        var item = 'listvalue.' + getValue;
        this.setData({
            [item]: e.detail.value.trim()
        })
        if (getValue == 'customerName') {
            this.setData({
                inputMarBot: false
                // downsearch:false
            })
            if (this.data.allList.length >= 5) {
                this.setData({
                    height: '385rpx'
                });
            } else {
                this.setData({
                    height: 'auto'
                });
            }
        }
    },
    // 只输入字母和数字
    inputonly(e) {
        var getValue = e.currentTarget.dataset.name;
        var item = 'listvalue.' + getValue;
        this.setData({
            [item]: e.detail.value.trim().replace(/[^\w\/]/ig, '')
        })
    },
    inputIimit(e) {
        var value = this.money(e.detail.value.trim());
        var getValue = e.currentTarget.dataset.name;
        var item = 'listvalue.' + getValue;
        this.setData({
            [item]: value
        })
    },
    // 验证输入金额
    money(val) {
        let num = val.toString(); //先转换成字符串类型
        if (num.indexOf('.') == 0) { //第一位就是 .
            num = '1' + num
        }
        num = num.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符
        num = num.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
        num = num.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        num = num.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
        if (num.indexOf(".") < 0 && num != "") {
            num = parseFloat(num);
        }
        return num
    },
    // 选择日期时间
    changeDateTime1(e) {
        console.log(e.detail.value)
        this.setData({
            dateTime1: e.detail.value,
            [`listvalue.collectionTime`]: this.data.dateTimeArray1[0][this.data.dateTime1[0]] + '-' + this.data.dateTimeArray1[1][this.data.dateTime1[1]] + '-' + this.data.dateTimeArray1[2][this.data.dateTime1[2]] + ' ' + this.data.dateTimeArray1[3][this.data.dateTime1[3]] + ':' + this.data.dateTimeArray1[4][this.data.dateTime1[4]] + ':' + this.data.dateTimeArray1[5][this.data.dateTime1[5]]
        });
        console.log(this.data.dateTimeArray1[0][this.data.dateTime1[0]] + '-' + this.data.dateTimeArray1[1][this.data.dateTime1[1]] + '-' + this.data.dateTimeArray1[2][this.data.dateTime1[2]] + ' ' + this.data.dateTimeArray1[3][this.data.dateTime1[3]] + ':' + this.data.dateTimeArray1[4][this.data.dateTime1[4]] + ':' + this.data.dateTimeArray1[5][this.data.dateTime1[5]])
    },
    changeDateTimeColumn1(e) {
        var arr = this.data.dateTime1,
            dateArr = this.data.dateTimeArray1;

        arr[e.detail.column] = e.detail.value;
        dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

        this.setData({
            dateTimeArray1: dateArr,
            dateTime1: arr
        });
    },
    cancle() {
        wx.navigateTo({
            url: '../orderManage/orderManage',
        })
    },
    // 编辑
    editorEvent(e) {
        console.log(e)
        let val = e.currentTarget.dataset.message;
        if (val == 'editor') {
            this.setData({
                info: 1,
                shType: 0,
                shType1: 2
            })
        }
    },
    uneditor() {
        wx.showToast({
            title: '数据不能修改',
            icon: 'none'
        })
    },
    //改变订单状态
    changeOrderStatus(e) {
        console.log(e)
        let orderStatus = e.currentTarget.dataset.status;
        this.setData({
            orderStatus: orderStatus
        })
        console.log(this.data.orderStatus)
    },
    sureAdd() {
        let {
            orderMoney,
            collectionTime,
            collectRemark,
            remark,
            seller,
            sellerPhone
        } = this.data.listvalue;
        if (!orderMoney) {
            wx.showToast({
                title: '请输入订单金额！',
                icon: 'none',
                duration: 2000
            })
            return false;
        }
        const regex = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
        // if(!seller){
        //   wx.showToast({
        //     title: '请输入营销人员姓名！',
        //     icon: 'none',
        //     duration: 2000
        //   })
        //   return false;
        // }
        // if(!sellerPhone){
        //   wx.showToast({
        //     title: '请输入营销人员手机号！',
        //     icon: 'none',
        //     duration: 2000
        //   })
        //   return false;
        // }
        if (sellerPhone && sellerPhone.length !== 0) {
            if (sellerPhone.length !== 11 || !regex.test(sellerPhone)) {
                wx.showToast({
                    title: '请输入正确的营销人员联系方式！',
                    icon: 'none',
                    duration: 2000
                })
                return false;
            }
        };
        if (!collectionTime) {
            wx.showToast({
                title: '请输入应收时间！',
                icon: 'none',
                duration: 2000
            })
            return false;
        }
        if (this.data.orderStatus == '0') {
            if (!collectRemark) {
                wx.showToast({
                    title: '请输入已付款备注！',
                    icon: 'none',
                    duration: 2000
                })
                return false;
            }
        }

        console.log('chenggong')
        //确认修改
        if (this.data.info == 1) {
            const data = {
                Authorization: wx.getStorageSync('token'),
                orderNo: this.data.listvalue.orderNo, //订单号
                orderMoney: this.data.listvalue.orderMoney.toString(), //订单金额
                orderStatus: this.data.orderStatus, //订单状态
            }
            if (this.data.orderStatus == '0') {
                data.collectRemark = this.data.listvalue.collectRemark //已付款的备注 为0时传这个字段
            }
            console.log(data)
            clearTimeout(this.TimeID);
            this.TimeID = setTimeout(() => {
                Get.updateOrder(data).then(res => {
                    wx.showToast({
                        title: '更新成功',
                        icon: 'success',
                        duration: 2000
                    });
                    setTimeout(() => {
                        wx.reLaunch({
                            url: '../orderManage/orderManage',
                        })
                    }, 2000)
                })
            }, 1000)
        } else {
            //确认新增
            const data = {
                Authorization: wx.getStorageSync('token'),
                customerId: this.data.customerId.toString(), //商户id
                orderMoney: this.data.listvalue.orderMoney, //订单金额
                collectionTime: this.data.listvalue.collectionTime, //订单应收款时间
                orderStatus: this.data.orderStatus, //订单状态
                remark: this.data.listvalue.remark
            }
            if (this.data.orderStatus == '0') {
                data.collectRemark = this.data.listvalue.collectRemark //已付款的备注 为0时传这个字段
            }
            if (this.data.listvalue.seller != '') {
                data.seller = this.data.listvalue.seller
            }
            if (this.data.listvalue.sellerPhone != '') {
                data.sellerPhone = this.data.listvalue.sellerPhone
            }
            console.log(data)
            clearTimeout(this.TimeID);
            this.TimeID = setTimeout(() => {
                Get.newOrder(data).then(res => {
                    wx.showToast({
                        title: '新增成功',
                        icon: 'success',
                        duration: 1000
                    });
                    setTimeout(() => {
                        wx.reLaunch({
                            url: '../orderManage/orderManage',
                        })
                    }, 1000)
                }).catch(res => {
                    wx.showToast({
                        title: '新增失败',
                        icon: 'none',
                        duration: 1000
                    });
                    setTimeout(() => {
                        wx.reLaunch({
                            url: '../orderManage/orderManage',
                        })
                    }, 1000)
                })
            }, 1000)
        }

    },
})