// sub2/pages/billDisCount/applyExtra.js
var that;
const app = getApp();
var util = require('../../utils/util.js');

var encr = require('../../utils/encrypt.js'); //国密3段式加密
var aeskey = encr.key //随机数
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgs: [],
        imgs1: [],
        region: ['请选择'],
        customItem: '全部',
        imgPath1: '',
        imgPath2: '',
        orderNo: '',
        BatchID: '',
        regionCodeCur: '',
        preffixUrl: app.globalData.URL,
        scene: "",
        platFormNum: "",
        isdisabled: false,
        USERNAME: '',
        ORGNAME: '',
        BELONGORG: '',
        recommendOpenId: "",
        remark6: '',
        employeesNum:'',
        recommendNum:'',
        bankCardNo:'1111111111111'

    },
    bindRegionChange: function(e) {
        let local = false
        if (that.data.scene != '') {
            local = (that.data.scene.split(",")[2] === '1' ? true : false)
        }
        //是否异地
        let regionUse = ['广东省', '浙江省', '江苏省', '北京市', '上海市']

        if (regionUse.indexOf(e.detail.value[0]) == -1) {
            if (!local) {
                wx.showToast({
                    title: '您所选择区域我行暂无分支机构，无法发起额度申请',
                    icon: 'none',
                    duration: 5000
                })
                return;
            }
        }

        if (e.detail.code.length != 3) {
            wx.showToast({
                title: '请选择完整区域信息',
                icon: 'none',
                duration: 1500

            })
            return;
        }
        this.setData({
            region: e.detail.value
        })

        this.setData({
            regionCodeCur: e.detail.code[1],
            regionCode: e.detail.code,
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        that = this;
        if (options.batch) {
            that.setData({
                BatchID: options.batch
            })
        }

        if (options.id) {
            that.setData({
                id: options.id
            });
            that.notesRecord().then(res => {
                that.setData({
                    notesParams: res
                });
            })
        }


        if (wx.getStorageSync('billScene') != '') {
            that.setData({
                isdisabled: true,
                scene: wx.getStorageSync('billScene'),
                recommendNum: wx.getStorageSync('billScene').split(",")[1],
                platFormNum: wx.getStorageSync('billScene').split(",")[0]
            })
        }

        if (wx.getStorageSync('recommendNum') != '') {
            that.setData({
                remark6: wx.getStorageSync('recommendNum').split(",")[0],
                recommendOpenId: wx.getStorageSync('recommendNum').split(",")[1]
            })
            that.getorgcode().then(res => {
                that.setData({
                    USERNAME: res.LIST[0].USERNAME,
                    ORGNAME: res.LIST[0].ORGNAME,
                    BELONGORG: res.BELONGLIST[0].BRANCHORGNAME
                })
            })
        }
    },
    getorgcode() {
        return new Promise((resolve, reject) => {
            if (that.data.remark6 == '') {
                reject()
                return;
            }
            let m = JSON.stringify({
                USERID: that.data.remark6
            })
            let l = encr.jiami(m, aeskey)

            wx.request({
                url: app.globalData.YTURL + 'electric/selectOrgCode.do',
                data: encr.gwRequest(l),
                method: 'POST',
                success(res) {
                    var jsonData = encr.aesDecrypt(res.data.body, aeskey)
                    if (jsonData.LIST) {
                        resolve(jsonData);
                    } else {
                        reject();
                    }
                }
            })
            

        })
    },
    notesRecord() {
        return new Promise((resolve, reject) => {
            if (that.data.id == '') {
                resolve()
                return;
            }
            var dataJson = JSON.stringify({
                id: that.data.id
            })
            var custnameTwo = encr.jiami(dataJson, aeskey)
            wx.request({
                url: app.globalData.YTURL + 'electric/notesRecord.do',
                data: encr.gwRequest(custnameTwo),
                method: 'POST',
                header: {
                    'content-type': 'application/json',
                },
                success(res) {
                    wx.hideLoading()
                    if (res.data.head.H_STATUS === "1") {
                        var jsonData = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文
                        if (jsonData.flag == '1') {
                            resolve(jsonData.notes[0])
                            return;
                        }
                        reject();
                    } else {
                        wx.showToast({
                            title: res.data.head.H_MSG,
                            icon: 'none',
                            duration: 5000
                        })
                        reject();
                    }
                }
            })
        })
    },
    // 上传图片
    chooseImg: function(e) {
        wx.showLoading({
            title: '添加中', //提示的内容,
            mask: true //显示透明蒙层，防止触摸穿透,
        });
        var imgs = that.data.imgs;
        wx.chooseImage({
            count: 9,
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function(res) {
                var tempFilePaths = res.tempFilePaths;
                var imgs = that.data.imgs;
                for (var i = 0; i < tempFilePaths.length; i++) {
                    if (that.data.imgs.length > 9) {
                        wx.hideLoading();
                        wx.showToast({
                            title: '超出上传10张限制，请删除',
                            icon: 'none'
                        })
                        return false;
                    } else {
                        wx.compressImage({
                            src: tempFilePaths[i],
                            quality: 80,
                            success: function(res) {
                                that.imgDataSizeTest(res.tempFilePath).then(kk => {
                                    wx.hideLoading();
                                    if (that.data.imgs.length > 9) {
                                        wx.hideLoading();
                                        wx.showToast({
                                            title: '超出上传10张限制',
                                            icon: 'none'
                                        })
                                        return false;
                                    }
                                    imgs.push(res.tempFilePath);
                                    that.setData({
                                        imgs: imgs
                                    });
                                }).catch(err => {
                                    wx.hideLoading();
                                    wx.showToast({
                                        title: '上传图片过大，请重新选择', //提示的内容,
                                        icon: 'none', //图标,
                                        duration: 3000, //延迟时间,
                                    });
                                })

                            },
                            fail: err => {
                                wx.hideLoading();
                                wx.showToast({
                                    title: '图片格式错误',
                                    icon: 'none'
                                })
                            }
                        })


                    }
                }
            },
            fail: err => {
                wx.hideLoading();
                wx.showToast({
                    title: '取消选择',
                    icon: 'none'
                })
            }
        });
    },
    imgDataSizeTest(img) {
        return new Promise((resolve, reject) => {
            wx.uploadFile({
                url: app.globalData.URL + 'uploadCard',
                filePath: img,
                name: 'file',
                formData: {
                    option: '1',
                },
                success: res => {
                    if (res.statusCode == 200) {
                        resolve()

                    } else {
                        reject()
                    }
                },
                fail: err => {
                    reject()
                }
            })
        })
    },
    testDo(img) {
        return new Promise((resolve, reject) => {
            wx.uploadFile({
                url: app.globalData.URL + 'uploadCard',
                filePath: img,
                name: 'file',
                formData: {
                    option: '1',
                },
                success: res => {
                    wx.request({
                        url: app.globalData.YTURL + 'jsyh/test.do',
                        data: encr.gwRequest({
                            imgStr: res.data
                        }),
                        method: 'POST',
                        header: {
                            'content-type': 'application/json', // 默认值
                        },
                        success: function(res) {
                            if (res.data.body != undefined && Object.getOwnPropertyNames(res.data.body) != 0) {
                                resolve({ imgPath: res.data.body.imgFilePath })
                            } else {
                                wx.hideLoading();
                                wx.showToast({
                                    title: '上传图片过大，请重新选择', //提示的内容,
                                    icon: 'none', //图标,
                                    duration: 3000, //延迟时间,
                                });
                                reject()
                            }
                        }
                    })
                },
                fail: err => {
                    wx.hideLoading();
                    wx.showToast({
                        title: '上传图片过大，请重新选择', //提示的内容,
                        icon: 'none', //图标,
                        duration: 3000, //延迟时间,
                    });
                    reject()
                }
            })
        })

    },
    // 删除图片
    deleteImg: function(e) {
        var imgs = this.data.imgs;
        var index = e.currentTarget.dataset.index;
        imgs.splice(index, 1);
        this.setData({
            imgs: imgs
        });
    },
    // 预览图片
    previewImg: function(e) {
        //获取当前图片的下标
        var index = e.currentTarget.dataset.index;
        var imgs = this.data.imgs;
        wx.previewImage({
            current: imgs[index],
            urls: imgs
        })
    },
    // 上传图片
    chooseImg1: function(e) {
        var imgs = this.data.imgs1;
        wx.showLoading({
            title: '添加中', //提示的内容,
            mask: true //显示透明蒙层，防止触摸穿透,
        });
        wx.chooseImage({
            count: 10, // 默认9
            sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function(res) {
                var tempFilePaths = res.tempFilePaths;

                var imgs = that.data.imgs1;
                for (var i = 0; i < tempFilePaths.length; i++) {
                    if (that.data.imgs1.length > 9) {
                        wx.hideLoading();

                        wx.showToast({
                            title: '超出上传10张限制，请删除',
                            icon: 'none'
                        })
                        return false;
                    } else {
                        wx.compressImage({
                            src: tempFilePaths[i],
                            quality: 30,
                            success: function(res) {

                                that.imgDataSizeTest(res.tempFilePath).then(kk => {
                                    wx.hideLoading();
                                    if (that.data.imgs1.length > 9) {
                                        wx.hideLoading();
                                        wx.showToast({
                                            title: '超出上传10张限制',
                                            icon: 'none'
                                        })
                                        return false;
                                    }
                                    imgs.push(res.tempFilePath);
                                    that.setData({
                                        imgs1: imgs
                                    });
                                }).catch(err => {
                                    wx.hideLoading();
                                    wx.showToast({
                                        title: '上传图片过大，请重新选择', //提示的内容,
                                        icon: 'none', //图标,
                                        duration: 3000,
                                    });
                                })

                            },
                            fail: err => {
                                wx.hideLoading();
                                wx.showToast({
                                    title: '图片格式错误',
                                    icon: 'none'
                                })
                            }
                        })
                    }
                }
            },
            fail: err => {
                wx.hideLoading();
                wx.showToast({
                    title: '取消选择',
                    icon: 'none'
                })
            }
        });
    },
    // 删除图片
    deleteImg1: function(e) {
        var imgs = this.data.imgs1;
        var index = e.currentTarget.dataset.index;
        imgs.splice(index, 1);
        this.setData({
            imgs1: imgs
        });
    },
    inputForm(e){
      let name=  e.currentTarget.dataset.name

      that.setData({
          [name]:e.detail.value
      })

    },
    // 预览图片
    previewImg1: function(e) {
        var index = e.currentTarget.dataset.index;
        var imgs = this.data.imgs1;
        wx.previewImage({
            current: imgs[index],
            urls: imgs
        })
    },
    submitForms(e) {
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        const params = '';
        wx.requestSubscribeMessage({
            tmplIds: ['PrerGmNfOOQBahQ3PfmvGPE4vxoZD13p5jq5ix9Nk8Q'],
            success(a) {
                wx.hideLoading()
                if (a.PrerGmNfOOQBahQ3PfmvGPE4vxoZD13p5jq5ix9Nk8Q === 'accept') {
                    if (that.data.employeesNum == '' ||that.data.regionCodeCur == '') {
                        wx.showToast({
                            title: '请填写完整信息',
                            icon: 'none'
                        })
                        return;
                    }
                    if (that.data.imgs.length == 0 || that.data.imgs1.length == 0) {
                        wx.showToast({
                            title: '请上传影像资料图片',
                            icon: 'none'
                        })
                        return;
                    }


                    if (that.data.imgs.length > 10) {

                        wx.showToast({
                            title: '财务报表超出上传10张限制',
                            icon: 'none'
                        })
                        return;
                    }

                    if (that.data.imgs1.length > 10) {

                        wx.showToast({
                            title: '营业场所超出上传10张限制',
                            icon: 'none'
                        })
                        return;
                    }
                    that.checkRecommendNum(that.data.recommendNum).then(res => {
                        wx.showLoading({
                            title: '上传中',
                            mask: true
                        })
                        let promise1 = new Promise(function(resolve, reject) {
                            let i = 0;
                            let iList = [];
                            that.data.imgs.forEach((item, index) => {
                                that.testDo(item).then(res => {
                                    iList.push(res.imgPath)
                                    i++;
                                    if (i == that.data.imgs.length) {
                                        that.addFinancialToYxpt(iList).then(res => {
                                            resolve()
                                        }).catch(err => {
                                            wx.hideLoading();
                                            reject()
                                        })
                                    }
                                }).catch(err => {
                                    reject()
                                    wx.hideLoading();
                                    wx.showToast({
                                        title: '上传图片过大，请重新选择', //提示的内容,
                                        icon: 'none', //图标,
                                        duration: 3000,
                                    });
                                })
                            });
                        });
                       
                      
                        let promise2 = new Promise(function(resolve, reject) {
                            let j = 0;
                            let jList = [];

                            that.data.imgs1.forEach((item, index) => {
                                that.testDo(item).then(res => {
                                    jList.push(res.imgPath)
                                    j++;
                                    if (j == that.data.imgs1.length) {
                                        that.addBussinessPlaceToYxpt(jList).then(res => {
                                            resolve()

                                        }).catch(err => {
                                            wx.hideLoading();

                                            reject()
                                        })
                                    }

                                }).catch(err => {
                                    reject()
                                    wx.hideLoading();
                                    wx.showToast({
                                        title: '上传图片过大，请重新选择',
                                        icon: 'none',
                                        duration: 3000,
                                    });
                                })
                            });
                        });
                        let promise3 = new Promise(function(resolve, reject) {
                            if(that.data.remark6!=''){
                                that.setData({
                                    remark6:that.data.remark6
                                })
                                that.getorgcode().then(res => {
                                    resolve();
                                    that.setData({
                                        USERNAME: res.LIST[0].USERNAME,
                                        ORGNAME: res.LIST[0].ORGNAME,
                                        BELONGORG: res.BELONGLIST[0].BRANCHORGNAME
                                    })
                                }).catch(err=>{
                                    reject()
                                })
                            }else{
                                resolve()
                            }
                        });
                        Promise.all([promise1, promise2,promise3])
                            .then(res => {

                                if (wx.getStorageSync('openid') === '') {
                                    api.getSessionInfo().then(() => {
                                        that.addData(params);
                                    });
                                } else {
                                    that.addData(params);
                                }
                            }).catch(err => {
                                wx.hideLoading({
                                    success: (res) => {},
                                })
                                wx.showToast({
                                    title: '企业信息上传失败',
                                    icon: 'none'
                                })
                            })

                    }).catch(err => {
                        wx.hideLoading();
                        wx.showToast({
                            title: err.err,
                            icon: 'none',
                            duration: 5000
                        })
                    })

                } else {
                    wx.showToast({
                        title: "请允许通知订阅通知",
                        icon: "none",
                        duration: 2000,
                    });
                }
            },
            fail(res) {
                wx.hideLoading()

            }
        })

    },
    checkRecommendNum(params) {
        return new Promise((resolve, reject) => {

            if (params === '') {
                resolve();
                return;
            }
            var dataJson = JSON.stringify({
                UserID: params
            })
            var custname = encr.jiami(dataJson, aeskey) //3段加密

            wx.request({
                url: app.globalData.YTURL + 'electric/checkUserId.do',
                data: encr.gwRequest(custname),
                method: 'POST',
                header: {
                    'content-type': 'application/json',
                },
                success: function(res) {

                    if (res.data.body != undefined && Object.getOwnPropertyNames(res.data.body) != 0 && res.data.head.H_STATUS == '1') {
                        var jsonData = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文

                        if (jsonData.length != 0) {
                            resolve()
                        } else {
                            if (res.data.head.H_STATUS == 'XG0000') {
                                reject({
                                    err: '该推荐人工号不存在，请重新输入'
                                })
                                return;
                            }
                            reject({
                                err: res.data.head.H_MSG
                            })
                        }
                    } else {
                        if (res.data.head.H_STATUS == 'XG0000') {
                            reject({
                                err: '该推荐人工号不存在，请重新输入'
                            })
                            return;
                        }
                        reject({
                            err: res.data.head.H_MSG
                        })
                    }
                }
            })
        })
    },

    //查询平台名称
    getPlatFormNum() {
        return new Promise((resolve, reject) => {
            if (that.data.platFormNum === "") {
                resolve()
            }
            var dataJson = JSON.stringify({
                TERRACENUM: that.data.platFormNum
            })
            var custname = encr.jiami(dataJson, aeskey)
            wx.request({
                url: app.globalData.YTURL + 'electric/terrace.do',
                data: encr.gwRequest(custname),
                method: 'POST',
                header: {
                    'content-type': 'application/json', // 默认值
                },
                success: function(res) {
                    if (res.data.body != undefined && Object.getOwnPropertyNames(res.data.body) != 0) {
                        var jsonData = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文
                        resolve(jsonData)
                    } else {
                        reject()
                    }
                }
            })
        })
    },
    addData(params) {
        
      
        that.getCustomers().then(jbInfo => {
            that.getPlatFormNum().then(source => {
                let paramsUp;
                if (that.data.BatchID == '') {
                    paramsUp = {
                        'partyName': that.data.notesParams.partyName,
                        'employeesNum': that.data.employeesNum,
                        'bankCardNo': that.data.bankCardNo,
                        'creditCode': that.data.notesParams.creditCode,
                        'esDate': that.data.notesParams.esDate,
                        'opscope': that.data.notesParams.opscope,
                        'regcap': that.data.notesParams.regcap,
                        'entype': that.data.notesParams.entype,
                        'companyAddr': that.data.notesParams.companyAddr,
                        'tradeData': '',
                        'frName': that.data.notesParams.frName,
                        'frIdCard': that.data.notesParams.frIdCard,
                        'jbrName': jbInfo.REAL_NAME,
                        'jbrMobileNo': jbInfo.TEL,
                        'jbrIdType': '身份证',
                        'idCard': jbInfo.ID_CARD,
                        'source': that.data.platFormNum == "" ? '小程序' : source.TERRACENAME,
                        'recommendNum': that.data.recommendNum,
                        'remark6': that.data.remark6,

                        'orderNo': that.data.orderNo,
                        'idEndDate': that.data.notesParams.idEndDate,
                        'orgType': '',
                        'openId': wx.getStorageSync('openid'),
                        'remark1': that.data.notesParams.remark1,
                        'BatchID': that.data.notesParams.remark1,
                        'remark2': '',
                        'remark3': '',
                        'remark4': '',
                        'remark5': '',
                        'remark7': '',
                        'remark8': '',
                        'remark9': '',
                        'remark10': '',
                        'region': that.data.regionCodeCur,
                        'orgCode': that.data.notesParams.creditCode,
                        'custNo': '',
                        'reserve1': '',
                        'reserve2': '',
                        'reserve3': '',
                        'state': '2',
                        'id': that.data.id,
                        'USERNAME': that.data.USERNAME,
                        'ORGNAME': that.data.ORGNAME,
                        'BELONGORG': that.data.BELONGORG
                    }
                } else {
                    paramsUp = JSON.parse(wx.getStorageSync('upParam'));

                    paramsUp.employeesNum = that.data.employeesNum
                    paramsUp.BatchID = that.data.BatchID
                    paramsUp.remark1 = that.data.BatchID
                    paramsUp.bankCardNo = that.data.bankCardNo
                    paramsUp.recommendNum = that.data.recommendNum
                    paramsUp.remark6 = that.data.remark6

                    paramsUp.region = that.data.regionCodeCur
                    paramsUp.orgCode = paramsUp.creditCode
                    paramsUp.state = '2'
                    paramsUp.id = that.data.id
                    paramsUp.USERNAME = that.data.USERNAME
                    paramsUp.ORGNAME = that.data.ORGNAME
                    paramsUp.BELONGORG = that.data.BELONGORG
                }
                var dataJson = JSON.stringify(paramsUp)
                var custname = encr.jiami(dataJson, aeskey) //3段加密


                if (that.data.BatchID != '') {
                    that.upInfomation(custname)
                    return;
                }
                wx.request({
                    url: app.globalData.YTURL + 'electric/updateNotes.do',
                    data: encr.gwRequest(custname),
                    method: 'POST',
                    header: {
                        'content-type': 'application/json', // 默认值
                    },
                    success: function(res) {
                        wx.hideLoading({
                            success: (res) => {},
                        })
                        if (res.data.body != undefined && Object.getOwnPropertyNames(res.data.body) != 0 && res.data.head.H_STATUS == '1') {
                            var jsonData = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文
                            wx.removeStorageSync('recommendNum')
                            wx.removeStorageSync('billScene')
                            wx.redirectTo({
                                url: './confirm?id=' + jsonData.id,
                            })
                        } else {
                            wx.showToast({
                                title: res.data.head.H_MSG,
                                icon: 'none',
                                duration: 5000
                            })
                        }

                    }
                })
            }).catch(err => {
                wx.hideLoading({
                    success: (res) => {},
                })
                wx.showToast({
                    title: '查询平台名失败',
                    icon: 'none',
                    duration: 5000
                });
            })


        }).catch(err => {
            wx.hideLoading({
                success: (res) => {},
            })
            wx.showToast({
                title: '经办人信息查询失败',
                icon: 'none',
                duration: 2000
            })
        })

    },
    upInfomation(custname) {
        wx.request({
            url: app.globalData.YTURL + 'electric/upInformation.do',
            data: encr.gwRequest(custname),
            method: 'POST',
            header: {
                'content-type': 'application/json', // 默认值
            },
            success: function(res) {
                wx.hideLoading({
                    success: (res) => {},
                })
                if (res.data.body != undefined && Object.getOwnPropertyNames(res.data.body) != 0 && res.data.head.H_STATUS == '1') {
                    var jsonData = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文

                    /**
                     * @param RET_CODE
                     *  1002 内部错误
                        1001 验证失败
                        1004 订单不存在
                        1029 调用接口异常
                        0000 成功
                     */
                    if (jsonData.RET_CODE === '0000') {
                        wx.showToast({
                            title: '信息上传成功',
                            duration: 3000
                        })
                        setTimeout((res) => {
                            wx.removeStorageSync('upParam');
                            wx.navigateBack({
                                delta: 1
                            })
                        }, 1500)

                    } else {
                        wx.showToast({
                            title: jsonData.RET_MSG,
                            icon: 'none',
                            duration: 2000
                        })
                    }
                } else {
                    wx.showToast({
                        title: res.data.head.H_MSG,
                        icon: 'none',
                        duration: 2000
                    })
                }
            }
        })
    },
    getCustomers() {
        return new Promise((resolve, reject) => {
            var dataJson = JSON.stringify({
                openId: wx.getStorageSync('openid')
            })
            var custname = encr.jiami(dataJson, aeskey) //3段加密
            wx.request({
                url: app.globalData.YTURL + 'jsyh/getCustomers.do',
                data: encr.gwRequest(custname),
                method: 'POST',
                header: {
                    'content-type': 'application/json', // 默认值
                },
                success: function(res) {
                    if (res.data.body != undefined && Object.getOwnPropertyNames(res.data.body) != 0) {
                        var jsonData = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文

                        if (jsonData.LIST[0].ID_CARD === '' ||
                            jsonData.LIST[0].ID_CARD == undefined || jsonData.LIST[0].REAL_NAME === '' ||
                            jsonData.LIST[0].REAL_NAME == undefined || jsonData.LIST[0].TEL === '' ||
                            jsonData.LIST[0].TEL == undefined) {
                            reject()
                            wx.showModal({
                                title: '提示',
                                content: '身份信息未认证，去认证',
                                success(res) {
                                    if (res.confirm) {
                                        wx.navigateTo({
                                            url: '/sub1/pages/auth/index'
                                        })
                                    } else if (res.cancel) {}
                                }
                            })
                        } else {
                            resolve(jsonData.LIST[0])
                        }
                    } else {
                        reject()
                    }
                }
            })
        })
    },
    back() {
      
        wx.navigateBack({
            delta: 1
        })
    },
    addFinancialToYxpt(img) {
        return new Promise((resolve, reject) => {

            var dataJson = JSON.stringify({
                'FINANCIALS': img,
                'BatchID': that.data.BatchID == '' ? that.data.notesParams.remark1 : (that.data.BatchID),
                'RE_CUST_ID':that.data.notesParams.frIdCard
            })
            var custname = encr.jiami(dataJson, aeskey) //3段加密
            wx.request({
                url: app.globalData.YTURL + 'electric/addFinancialToYxpt.do',
                data: encr.gwRequest(custname),
                method: 'POST',
                header: {
                    'content-type': 'application/json', // 默认值
                },
                success: function(res) {
                    if (res.data.body != undefined && Object.getOwnPropertyNames(res.data.body) != 0) {
                        var jsonData = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文
                        resolve()
                    } else {
                        reject()
                    }
                }
            })
        })
    },
    addBussinessPlaceToYxpt(img) {
        return new Promise((resolve, reject) => {

            var dataJson1 = JSON.stringify({
                'PLACES': img,
                'BatchID': that.data.BatchID == '' ? that.data.notesParams.remark1 : (that.data.BatchID),
                'RE_CUST_ID':that.data.notesParams.frIdCard

            })
            var custname1 = encr.jiami(dataJson1, aeskey) //3段加密

            wx.request({
                url: app.globalData.YTURL + 'electric/addPlaceToYxpt.do',
                data: encr.gwRequest(custname1),
                method: 'POST',
                header: {
                    'content-type': 'application/json', // 默认值
                },
                success: function(res) {

                    if (res.data.body != undefined && Object.getOwnPropertyNames(res.data.body) != 0) {
                        var jsonData = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文
                        resolve()
                    } else {
                        reject()
                    }
                }
            })
        })
    }

})