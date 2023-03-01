// sub2/pages/billDisCount/applyOcr.js
var app =
    getApp();
var that;
import WxValidate from "../../../assets/plugins/wx-validate/WxValidate";
import user from '../../../utils/user';
import requestYT from '../../../api/requestYT';
var util = require('../../utils/util.js');
var encr = require('../../utils/encrypt.js'); //国密3段式加密
var aeskey = encr.key //随机数
const {
    $Toast
} = require('../../dist/base/index');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        img: {
            renxiang: app.globalData.URL + 'static/wechat/img/temp/mine/s2_ren_bg.jpg',
            guohui: app.globalData.URL + 'static/wechat/img/temp/mine/s2_guo_bg.jpg',
        },
        preffixUrl: app.globalData.URL,
        camera_flag: true,
        gsImg: '',
        gsInfo: {},
        idcard: {},
        orderNo: '',
        imgs: [app.globalData.URL + '/static/wechat/img/apli_yyzz.png'],
        platFormNum: "",
        TERRACENAME: "小程序",
        isRegister: false,
        batchID:'',
        ID_CARD:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        that = this;

        this.initValidate();

        wx.showLoading({
            title: '加载中',
            mask: true
        })
        that.getCompanyInfo().then(cardlist1 => {
            that.notesDelete(cardlist1).then(res => {
                if (cardlist1.length == 0) {
                    wx.hideLoading()
                    return;
                }
                let a = [];
                cardlist1.forEach((item, index) => {
                    a.push(item.ORG_NAME)
                })
                wx.hideLoading()
                wx.showActionSheet({
                    itemList: a,
                    success(res) {
                        wx.showLoading({
                            title: '查询中',
                            mask: true
                        })
                        that.setData({
                            'gsInfo.RE_REGISTER_ID': cardlist1[res.tapIndex].ORG_CODE,
                            'gsInfo.RE_COMPANY_NAME': cardlist1[res.tapIndex].ORG_NAME,
                            'gsInfo.RE_ADDRESS': cardlist1[res.tapIndex].ORG_ADDRESS
                        })
                        that.selectNotes(cardlist1[res.tapIndex].ORG_CODE).then(notes => {
                            //查询企业是否有额度
                            that.CheckTicketPro().then(res => {
                                that.checkWd(that.data.gsInfo.RE_REGISTER_ID).then(res => {
                                    wx.hideLoading()
                                    wx.showModal({
                                        title: '提示',
                                        content: '该企业(' + that.data.gsInfo.RE_COMPANY_NAME + ')有尚未完成的订单,是否继续处理',
                                        confirmText: '继续',
                                        cancelText: '不继续',
                                        success(res) {
                                            if (res.confirm) {
                                                let page = './applyExtra'
                                                switch (notes.state) {
                                                    case '1':
                                                        page = './applyExtra'
                                                        break;
                                                    case '2':
                                                        page = './confirm'
                                                        break;
                                                    case '3':
                                                        page = './status'
                                                        break;
                                                    case '4':
                                                        page = './status'
                                                        break;
                                                    default:
                                                        page = './applyExtra'
                                                        break;
                                                }
                                            
                                                wx.redirectTo({
                                                    url: page + '?id=' +
                                                        notes.id,
                                                })
                                            } else if (res.cancel) {
                                                that.deleteNotes(notes.id)
                                            }
                                        }
                                    })
                                }).catch(err => {
                                    wx.hideLoading()
                                    wx.showToast({
                                        title: err.msg,
                                        icon: 'none',
                                        duration: 2000,
                                    });
                                    setTimeout(() => {
                                        wx.navigateBack({
                                            delta: 1,
                                        });
                                    }, 2000)
                                })
                            }).catch(err => {
                                wx.hideLoading()

                                wx.showToast({
                                    title: err.msg,
                                    icon: 'none',
                                    duration: 2000,
                                });
                                setTimeout(() => {
                                    wx.navigateBack({
                                        delta: 1,
                                    });
                                }, 2000)
                            })


                        }).catch(err => {
                            wx.hideLoading()


                        })
                    },
                    fail(res) {}
                })

            })
        });


        if (options.orderNo) {
            that.setData({
                orderNo: options.orderNo
            })
        }
        if (wx.getStorageSync('billScene') != '') {
            that.setData({
                scene: wx.getStorageSync('billScene'),
                platFormNum: wx.getStorageSync('billScene').split(",")[0]
            })
            that.getPlatFormNum()
        }

    },
    update(params, BatchID) {
        return new Promise((resolve, reject) => {
            var dataJson = JSON.stringify({
                'state': '1',
                'openId': wx.getStorageSync("openid"),
                'partyName': params.RE_COMPANY_NAME,
                'creditCode': params.RE_REGISTER_ID,
                'esDate': that.data.gsInfo.RE_FOUNDATION_DATE,
                'opscope': params.RE_MANAGEMENT_SCOPE,
                'regcap': params.RE_REGISTERED_CAPITAL,
                'entype': that.data.gsInfo.RE_COMPANY_TYPE,
                'companyAddr': params.RE_ADDRESS,
                'frName': params.RE_CUST_NAME,
                'frIdCard': params.RE_CUST_ID,
                'idEndDate': that.data.idcard.date.substr(11).split('.').join(''),
                'remark1': BatchID,
                'BatchID': BatchID,
                'orgCode': params.RE_REGISTER_ID

            })
            var custnameTwo = encr.jiami(dataJson, aeskey)
            wx.request({
                url: app.globalData.YTURL + 'electric/updateNotes.do',
                data: encr.gwRequest(custnameTwo),
                method: 'POST',
                header: {
                    'content-type': 'application/json', // 默认值
                },
                success: function(res) {

                    if (res.data.body != undefined && Object.getOwnPropertyNames(res.data.body) != 0 && res.data.head.H_STATUS == '1') {
                        var jsonData = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文
                        that.setData({
                            id: jsonData.id
                        })
                        resolve(jsonData.id)

                    } else {
                        wx.hideLoading()
                        reject()
                        wx.showToast({
                            title: res.data.head.H_MSG,
                            icon: 'none',
                            duration: 5000
                        })
                    }

                }
            })
        })

    },
    checkWd(creditCode) {
        return new Promise((resolve, reject) => {

            var dataJson = JSON.stringify({
                creditCode: creditCode
            })
            var custname = encr.jiami(dataJson, aeskey)
            wx.request({
                url: app.globalData.YTURL + 'electric/checkWd.do',
                data: encr.gwRequest(custname),
                method: 'POST',
                header: {
                    'content-type': 'application/json', // 默认值
                },
                success: function(res) {
                    if (res.data.head.H_STATUS == '1') {
                        var jsonData = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文
                        if (jsonData.RET_CODE == '9999') {
                            reject({ msg: jsonData.RET_MSG })
                            return;
                        }
                        resolve()
                    } else {
                        reject({ msg: res.data.head.H_MSG })

                    }
                }
            })


        })
    },
    deleteNotes(id) {
        return new Promise((resolve, reject) => {

            var dataJson = JSON.stringify({
                id: id
            })
            var custname = encr.jiami(dataJson, aeskey)
            wx.request({
                url: app.globalData.YTURL + 'electric/deleteNotes.do',
                data: encr.gwRequest(custname),
                method: 'POST',
                header: {
                    'content-type': 'application/json', // 默认值
                },
                success: function(res) {
                    if (res.data.head.H_STATUS == '1') {

                        resolve()

                    } else {
                        reject()
                        wx.showToast({
                            title: res.data.head.H_MSG,
                            icon: 'none',
                            duration: 3000,
                        });
                    }
                }
            })


        })
    },
    notesDelete(list) {
        return new Promise((resolve, reject) => {
            let orgcodes = []
            if (list.length > 0) {
                list.forEach((item, index) => {
                    orgcodes.push(item.ORG_CODE)
                })
            }
            var dataJson = JSON.stringify({
                creditCodes: orgcodes,
                openId: wx.getStorageSync('openid')
            })
            var custname = encr.jiami(dataJson, aeskey)
            wx.request({
                url: app.globalData.YTURL + 'electric/notesDelete.do',
                data: encr.gwRequest(custname),
                method: 'POST',
                header: {
                    'content-type': 'application/json', // 默认值
                },
                success: function(res) {
                    if (res.data.head.H_STATUS == '1') {

                        resolve()

                    } else {
                        reject()
                        wx.showToast({
                            title: res.data.head.H_MSG,
                            icon: 'none',
                            duration: 3000,
                        });
                    }
                }
            })


        })
    },
    addEnterprise(jbInfo, params) {
        return new Promise((resolve, reject) => {
            that.getCompanyInfo().then(companyList => {

                if (companyList instanceof Array && companyList.length == 0) {
                    var dataJson = JSON.stringify({
                        ORG_ID: "",
                        ORG_TAGS: "14",
                        ORG_NAME: params.RE_COMPANY_NAME,
                        ORG_CODE: params.RE_REGISTER_ID,
                        ORG_ADDRESS: params.RE_ADDRESS,
                        ARTIFICIAL_NAME: jbInfo.REAL_NAME,
                        ORG_TEL: jbInfo.TEL,
                        USER_ID: wx.getStorageSync('openid')
                    })
                    var custname = encr.jiami(dataJson, aeskey)
                    wx.request({
                        url: app.globalData.YTURL + 'electric/addCard.do',
                        data: encr.gwRequest(custname),
                        method: 'POST',
                        header: {
                            'content-type': 'application/json', // 默认值
                        },
                        success: function(res) {
                            if (res.data.head.H_STATUS == '1') {

                                resolve({ msg: '绑定企业成功' })

                            } else {
                                reject()
                                wx.showToast({
                                    title: res.data.head.H_MSG,
                                    icon: 'none',
                                    duration: 3000,
                                });
                            }
                        }
                    })
                    return;
                }
                let a = companyList.filter(function(value) {
                        return value.ORG_CODE === params.RE_REGISTER_ID
                    })
                    //企业绑定查重
                if (a.length != 0) {
                    resolve({ msg: '已绑过该企业，请直接点击下一步' })
                    return;
                }

                var dataJson = JSON.stringify({
                    ORG_ID: "",
                    ORG_NAME: params.RE_COMPANY_NAME,
                    ORG_CODE: params.RE_REGISTER_ID,
                    ORG_ADDRESS: params.RE_ADDRESS,
                    ARTIFICIAL_NAME: jbInfo.REAL_NAME,
                    ORG_TEL: jbInfo.TEL,
                    USER_ID: wx.getStorageSync('openid')
                })
                var custname = encr.jiami(dataJson, aeskey)
                wx.request({
                    url: app.globalData.YTURL + 'electric/addCard.do',
                    data: encr.gwRequest(custname),
                    method: 'POST',
                    header: {
                        'content-type': 'application/json', // 默认值
                    },
                    success: function(res) {
                        if (res.data.head.H_STATUS == '1') {

                            resolve({ msg: '绑定企业成功' })

                        } else {
                            reject()
                            wx.showToast({
                                title: res.data.head.H_MSG,
                                icon: 'none',
                                duration: 3000,
                            });
                        }
                    }
                })


            })

        })
    },
    //查询平台名称
    getPlatFormNum() {
        return new Promise((resolve, reject) => {
            if (that.data.platFormNum == '') {
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
                        that.setData({
                            TERRACENAME: jsonData.TERRACENAME
                        })
                        resolve(jsonData)
                    } else {
                        reject()
                    }
                }
            })
        })
    },
    getCompanyInfo() {
        return new Promise((resolve, reject) => {
            wx.request({
                url: app.globalData.URL + "getuseCard",
                data: {
                    userId: wx.getStorageSync("openid"),
                },
                header: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    key: Date.parse(new Date()).toString().substring(0, 6),
                    sessionId: wx.getStorageSync("sessionid"),
                    transNo: "XC008",
                },
                method: "POST",
                success(res) {

                    if (res.data.stringData == undefined || res.data.stringData == '') {
                        console.log('绑定企业为空')
                        resolve([])
                        return;
                    }
                    var cardlist = res.data.stringData;
                    var cardlist1 = JSON.parse(util.dect(cardlist));
                    resolve(cardlist1)
                },
                fail: function(res) {
                    reject()
                    wx.hideLoading({
                        success: (res) => {},
                    })
                    wx.showToast({
                        title: '网络异常',
                        icon: 'none',
                        mask: true,
                        duration: 3000,
                    });
                }
            })
        })
    },
    creatPhoto(e) {
        const c = e.target.id;
        wx.showActionSheet({
            itemList: ['立即拍照', '从手机相册选择'],
            success(res) {
                if (c == 'renxiang') {
                    that.setData({
                        takephoto: {
                            coverImg: '/static/wechat/img/camera_box.png',
                            noticeTxt: '请将身份证人像面放入框内',
                            id: 'renxiang',
                        },
                    });
                } else if (c == 'guohui') {
                    that.setData({
                        takephoto: {
                            coverImg: '/static/wechat/img/camera_box_guo.png',
                            noticeTxt: '请将身份证国徽面放入框内',
                            id: 'guohui',
                        },
                    });
                }

                var _ind = res.tapIndex;
                if (_ind == '0') {

                    that.setData({
                        camera_flag: false,
                        v: '1',
                    });
                } else if (_ind == '1') {
                    //选择相册
                    wx.chooseImage({
                        count: 1,
                        sizeType: ['compressed'], //compressed压缩图，original原图
                        sourceType: ['album'],
                        success(res) {
                            var tempFilePaths = res.tempFilePaths;
                            //压缩图片处理
                            var size = res.tempFiles[0].size;
                            wx.getImageInfo({
                                src: tempFilePaths[0],
                                success: function(res) {
                                    var ctx = wx.createCanvasContext('attendCanvasId');
                                    var ratio = 1;
                                    var canvasWidth = res.width;
                                    var canvasHeight = res.height;
                                    var quality = 1;

                                    quality = (quality + ratio / 10).toFixed(1);
                                    if (quality > 1) {
                                        quality = 0.7;
                                    }
                                    that.setData({
                                        canvasWidth: canvasWidth,
                                        canvasHeight: canvasHeight,
                                    });
                                    ctx.drawImage(
                                        tempFilePaths[0],
                                        0,
                                        0,
                                        canvasWidth,
                                        canvasHeight,
                                    );
                                    ctx.draw();
                                    setTimeout(function() {
                                        wx.canvasToTempFilePath({
                                            canvasId: 'attendCanvasId',
                                            width: 0,
                                            height: 0,
                                            destWidth: canvasWidth,
                                            destHeight: canvasHeight,
                                            fileType: 'jpg',
                                            quality: quality,
                                            success(res) {
                                                if (c == 'renxiang') {
                                                    that.setData({
                                                        'img.renxiang': res.tempFilePath,
                                                    });
                                                } else if (c == 'guohui') {
                                                    that.setData({
                                                        'img.guohui': res.tempFilePath,
                                                    });
                                                }
                                                if (that.data.img.renxiang != (app.globalData.URL + 'static/wechat/img/temp/mine/s2_ren_bg.jpg') && that.data.img.guohui != (app.globalData.URL + 'static/wechat/img/temp/mine/s2_guo_bg.jpg')) {
                                                    //ocr人像识别
                                                    that.ocrIdcard();
                                                }

                                            },
                                        });
                                    }, 600);
                                },
                            });
                        },
                        fail(res) {
                            wx.showToast({
                                title: '请重新选择图片或拍照',
                                icon: 'none',
                                mask: true,
                                duration: 1000,
                            });
                        },
                    });
                }
            },
        });
    },
    takePhoto(e) {
        //选取id号sfz--身份证，yyzz--营业执照
        const c = e.target.id;
        const ctx = wx.createCameraContext();
        ctx.takePhoto({
            quality: 'high',
            success: res => {
                var tempImg = res.tempImagePath;

                wx.getImageInfo({
                    src: tempImg,
                    success: function(res) {
                        var _w = res.width;
                        var _h = res.height;

                        //start
                        var relW = 700;
                        var relH = parseInt((relW * _h) / _w);
                        that.setData({
                            canvasHeight2: relH,
                            canvasWidth2: relW,
                        });
                        var ctx = wx.createCanvasContext("attendCanvasId2");
                        ctx.drawImage(res.path, 0, 0, relW, relH);
                        ctx.draw();

                        setTimeout(function() {
                            wx.canvasToTempFilePath({
                                canvasId: "attendCanvasId2",
                                x: 0,
                                y: 0.3 * relH,
                                width: relW,
                                height: 0.4 * relH,
                                destWidth: 500,
                                destHeight: 350,
                                fileType: "jpg",
                                quality: 0.7,
                                success(res) {
                                    //这里是将图片上传到服务器中并识别
                                    if (c == "renxiang") {
                                        that.setData({
                                            "img.renxiang": res.tempFilePath,
                                        });
                                    } else if (c == "guohui") {
                                        that.setData({
                                            "img.guohui": res.tempFilePath,
                                        });
                                    }
                                    //传值并关闭拍照界面
                                    that.setData({
                                        camera_flag: true, //隐藏拍照界面
                                        v: "0",
                                    });
                                    if (that.data.img.renxiang != (app.globalData.URL + 'static/wechat/img/temp/mine/s2_ren_bg.jpg') && that.data.img.guohui != (app.globalData.URL + 'static/wechat/img/temp/mine/s2_guo_bg.jpg')) {
                                        //ocr人像识别
                                        that.ocrIdcard();
                                    }
                                },
                            });
                        }, 600);
                    },
                });
            },
            fail: res => {},
        });
    },
    //重拍按钮
    reTake() {
        this.setData({
            camera_flag: true,
        });
        wx.showToast({
            title: '您已取消拍照',
            icon: 'none',
            duration: 2000,
        });
    }, // 删除图片
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
        //所有图片
        var imgs = this.data.imgs;
        wx.previewImage({
            current: imgs[index],
            urls: imgs
        })
    },
    getGS(e) {
        //选择相册
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                var tempFilePaths = res.tempFilePaths;
                that.setData({
                    imgs: tempFilePaths
                });
                wx.showLoading({
                        title: '正在识别',
                        mask: true
                    })
                    //压缩图片处理
                var size = res.tempFiles[0].size;
                wx.getImageInfo({
                    src: tempFilePaths[0],
                    success: function(res) {
                        var ctx = wx.createCanvasContext('attendCanvasId3');
                        var ratio = 1;
                        var canvasWidth = res.width;
                        var canvasHeight = res.height;
                        var quality = 1;

                        quality = (quality + ratio / 10).toFixed(1);
                        if (quality > 1) {
                            quality = 0.6;
                        }
                        that.setData({
                            canvasWidth: canvasWidth,
                            canvasHeight: canvasHeight,
                        });
                        ctx.drawImage(
                            tempFilePaths[0],
                            0,
                            0,
                            canvasWidth,
                            canvasHeight,
                        );
                        ctx.draw();
                        setTimeout(function() {
                            wx.canvasToTempFilePath({
                                canvasId: 'attendCanvasId3',
                                width: 0,
                                height: 0,
                                destWidth: canvasWidth,
                                destHeight: canvasHeight,
                                fileType: 'jpg',
                                quality: quality,
                                success(res) {
                                    that.setData({
                                        gsImg: res.tempFilePath,
                                    });

                                    wx.uploadFile({
                                        url: that.data.preffixUrl + 'uploadCard',
                                        filePath: res.tempFilePath,
                                        name: 'file',
                                        formData: {
                                            option: '2',
                                            type: 1,
                                        },
                                        success: res => {
                                            if (res.statusCode != 200) {
                                                wx.hideLoading();
                                                wx.showToast({
                                                    title: '上传营业执照图片过大，请重新选择', //提示的内容,
                                                    icon: 'none', //图标,
                                                    duration: 3000, //延迟时间,
                                                });
                                                return;
                                            }
                                            that.setData({
                                                pathc: res.data,
                                            });
                                            wx.request({
                                                url: app.globalData.YTURL + 'jsyh/test.do', //base64 转 图片地址
                                                data: encr.gwRequest({
                                                    "imgStr": that.data.pathc,
                                                }),
                                                method: 'POST',
                                                success(res) {
                                                    if (res.data.head.H_STATUS != '1') {
                                                        wx.showToast({
                                                            title: '上传影像：' + res.data.head.H_MSG,
                                                            icon: 'none'
                                                        })
                                                    }else{
                                                      //营业执照
                                                      let dataJson4 = JSON.stringify({
                                                        "IMAGE_BIZLICENSE_URL": res.data.body.imgFilePath,
                                                        "RE_REGISTER_ID": '1',
                                                        "RE_CUST_ID":app.globalData.int_id.toString(),//身份证号
                                                      })
                                                      let custnameTwo4 = encr.jiami(dataJson4, aeskey) //3段加密
                                                      wx.request({
                                                          url: app.globalData.YTURL + 'electric/addBizLicenseOcr.do', //图片地址 转 batchID
                                                          data: encr.gwRequest(custnameTwo4),
                                                          method: 'POST',
                                                          success(res) {
                                                              let jsonBatch = encr.aesDecrypt(res.data.body, aeskey);//3段加密
                                                              that.setData({
                                                                  batchID:jsonBatch.BatchID
                                                              });
                                                              wx.request({
                                                                  url: app.globalData.YTURL + 'jsyh/ocrBusinessLicense.do',
                                                                  data: encr.gwRequest({
                                                                      "IMAGE_MODE": '03',
                                                                      "IMAGE_DOC_ID": jsonBatch.BatchID,
                                                                      "OBJ_NAME": "SYS050_BIZ01",
                                                                      "FILE_TYPE": "SYS050_BIZ01_101"
                  
                                                                  }),
                                                                  method: 'POST',
                                                                  success(res) {
                                                                      if (res.data.body.STATUS != '1' || res.data.body.STATUS == undefined) {
                                                                          wx.showToast({
                                                                              title: res.data.head.H_MSG + ',请重新上传或者手工输入',
                                                                              icon: 'none',
                                                                              duration: 3000
                  
                                                                          })
                                                                          return;
                                                                      }
                  
                                                                      wx.hideLoading({
                                                                          success: (res) => {
                                                                              wx.showToast({
                                                                                  title: '识别成功',
                                                                              })
                                                                          },
                                                                      })
                                                                      that.setData({
                                                                          gsInfo: res.data.body
                                                                      })
                  
                                                                  },
                                                                  fail(res) {
                                                                      wx.hideLoading({
                                                                          success: (res) => {
                                                                              wx.showToast({
                                                                                  title: '失败',
                                                                              })
                                                                          },
                                                                      })
                                                                  }
                                                              })
                                                          }
                                                      });
                                                    }              
                                                }
                                            });
                                        }
                                    })
                                },
                            });
                        }, 600);
                    },
                });
            },
            fail(res) {
                wx.showToast({
                    title: '请重新选择图片或拍照',
                    icon: 'none',
                    mask: true,
                    duration: 1000,
                });
            },
        });
    },
    submit1() {
        that.upload();
    },
    upload(e) {

        const params = e.detail.value;

        var _rx = that.data.img.renxiang;
        var _gh = that.data.img.guohui;
        var _gs = that.data.gsImg;
        if (!this.WxValidate.checkForm(params)) {
            const error = this.WxValidate.errorList[0];
            wx.showToast({
                title: error.msg,
                icon: 'none'
            })
            return;
        }

        if (_rx == (app.globalData.URL + 'static/wechat/img/temp/mine/s2_ren_bg.jpg')) {
            wx.showToast({
                title: '请上传您的身份证人像面',
                icon: 'none',
                mask: true,
                duration: 2000,
            });
            return;
        }

        if (_gh == (app.globalData.URL + 'static/wechat/img/temp/mine/s2_guo_bg.jpg')) {
            wx.showToast({
                title: '请上传您的身份证国徽面',
                icon: 'none',
                mask: true,
                duration: 2000,
            });
            return;

        }
        if (_gs === '') {
            wx.showToast({
                title: '请上传工商营业执照',
                icon: 'none',
                mask: true,
                duration: 2000,
            });
            return;
        }
        that.setData({
            'gsInfo.RE_REGISTER_ID': params.RE_REGISTER_ID
        })
        if (!that.data.idcard.hasOwnProperty('date')) {
            wx.showToast({
                title: '身份信息获取失败，请重新上传身份证正反面图片',
                icon: 'none',
                mask: true,
                duration: 2000,
            });
            return;
        }

        that.gsYZ(params).then(res => {
            wx.showLoading({
                title: '上传中',
                mask: true,
            });
             that.update(params, that.data.batchID).then(res => {
                that.getCustomers().then(jbInfo => {
                    that.addEnterprise(jbInfo, params).then(ress => {
                        wx.hideLoading()
                        wx.showToast({
                            title: ress.msg,
                            icon: "none",
                            duration: 5000
                        })
                        that.setData({
                            isRegister: true
                        })
                    }).catch(err => {
                        wx.hideLoading()
                    })
                })
            })
        }).catch((err) => {
            wx.hideLoading()
            wx.showToast({
                title: '上传影像失败',
                icon: 'none'
            })
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
    navback() {
        wx.navigateBack({
            delta: 1,
        })
    },
    selectNotes(creditCode) {
        return new Promise((resolve, reject) => {
            var dataJson = JSON.stringify({
                openId: wx.getStorageSync('openid'),
                creditCode: creditCode
            })
            var custnameTwo = encr.jiami(dataJson, aeskey) //3段加密
            wx.request({
                url: app.globalData.YTURL + 'electric/selectNotes.do',
                data: encr.gwRequest(custnameTwo),
                method: 'POST',
                header: {
                    'content-type': 'application/json', // 默认值
                },
                success(res) {
                    if (res.data.head.H_STATUS === "1") {
                        var jsonData = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文

                        console.log(jsonData)
                        if (jsonData.flag == '1') {
                            let list = jsonData.notes
                            if (list[0].state == '4') {
                                reject()
                                return;
                            }
                            resolve(list[0])
                            return;
                        }
                        reject();
                    } else {
                        reject();
                        wx.showToast({
                            title: res.data.head.H_MSG,
                            icon: 'none',
                            duration: 5000
                        })
                    }
                }

            })
        })
    },

    gsYZ(params) {
        return new Promise((resolve, reject) => {
          //新工商
              let requestData = {
                url: 'qyfr/check.do',
                data:{
                  name: params.RE_CUST_NAME, 
                  entmark1: params.RE_COMPANY_NAME,
                  emc:params.RE_CUST_ID,
                  productNo: '140001',
                  deptName: '金融同业部',
                }
              }
              requestYT(requestData).then(res=>{
                  if (res.STATUS === "1") {
                    if(res.msgCode ==='0000'){
                        if (res.entInfo != '') {
                          console.log("新工商接口292:\n"+JSON.parse(res.entInfo))
                          var entInfo= JSON.parse(res.entInfo)[0];//企业信息是否匹配
                          var relation = JSON.parse(res.relation)[0];//个人信息
                                //校验工商信息是否匹配
                              if (entInfo.matched !== '1') {
                                wx.showToast({
                                    title: '上传企业名称与工商登记信息不一致， 请选择正确的信息',
                                    icon: 'none',
                                    duration: 3000
                                })
                                reject();
                                return;
                              }
                              //校验法人姓名是否匹配
                              if (relation.name != '1' || ( relation.matched !== '1' && relation.id !=='1')) {
                                  wx.showToast({
                                      title: '上传法人姓名与工商登记信息不一致， 请输入正确的信息',
                                      icon: 'none',
                                      duration: 3000
                                  })
                                  reject();
                                  return;
                              }
                              resolve();
                        } else {
                            reject();
                            wx.showToast({
                                title: '上传身份信息与工商登记信息不一致， 请选择正确的信息 ',
                                icon: 'none'
                            })
                        }
                    }else{
                      reject();
                      wx.showToast({
                          title: res.msg,
                          icon: 'none',
                          duration: 5000
                      })
                  }
                  } else {
                    reject();
                    wx.showToast({
                        title: res.msg,
                        icon: 'none',
                        duration: 5000
                    })
                  }
                },
                err=>{
                  reject();
                  wx.showToast({
                    title: '',
                    icon: 'none',
                    duration: 5000
                })
              })
        })

    },
    ocrIdcard() {
        var _rx = that.data.img.renxiang;
        var _gh = that.data.img.guohui;
        if(that.data.batchID == ''){
            $Toast({
                content: '请先上传营业执照',
                type: 'warning',
                duration: 1,
            });
            that.setData({
                img: {
                    renxiang: app.globalData.URL + 'static/wechat/img/temp/mine/s2_ren_bg.jpg',
                    guohui: app.globalData.URL + 'static/wechat/img/temp/mine/s2_guo_bg.jpg',
                },
            });
            return;
        }
        wx.showLoading({
            title: '正在识别',
            mask: true
        })
        wx.uploadFile({
            url: that.data.preffixUrl + 'uploadCard',
            filePath: _rx,
            name: 'file',
            formData: {
                option: '1',
            },
            success: res => {
                if (res.statusCode != 200) {
                    wx.hideLoading();
                    wx.showToast({
                        title: '上传证件正面过大，请重新选择', //提示的内容,
                        icon: 'none', //图标,
                        duration: 3000, //延迟时间,
                    });
                    return;
                }
                wx.request({
                    url: app.globalData.YTURL + 'jsyh/test.do', //base64 转 图片地址
                    data: encr.gwRequest({
                        "imgStr": res.data,
                    }),
                    method: 'POST',
                    success(res) {
                      if (res.data.head.H_STATUS != '1') {
                        wx.showToast({
                            title: '上传影像：' + res.data.head.H_MSG,
                            icon: 'none'
                        })
                      }else{
                            that.setData({
                                patha: res.data.body.imgFilePath,
                          });
                          wx.uploadFile({
                              url: that.data.preffixUrl + 'uploadCard',
                              filePath: _gh,
                              name: 'file',
                              formData: {
                                  option: '2',
                                  type: 1,
                              },
                              success: res => {
                                  if (res.statusCode != 200) {
                                      wx.hideLoading();
                                      wx.showToast({
                                          title: '上传证件反面过大，请重新选择', //提示的内容,
                                          icon: 'none', //图标,
                                          duration: 3000, //延迟时间,
                                      });
                                      return;
                                  }
                                  wx.request({
                                      url: app.globalData.YTURL + 'jsyh/test.do', //base64 转 图片地址
                                      data: encr.gwRequest({
                                          "imgStr": res.data,
                                      }),
                                      method: 'POST',
                                      success(res) {
                                        if (res.data.head.H_STATUS != '1') {
                                          wx.showToast({
                                              title: '上传影像：' + res.data.head.H_MSG,
                                              icon: 'none'
                                          })
                                      }else{
                                            that.setData({
                                              pathb: res.data.body.imgFilePath,
                                          });
                                          let dataJson3 = JSON.stringify({
                                              "IMAGE_IDCARD_B": that.data.pathb,
                                              "IMAGE_IDCARD_A": that.data.patha,
                                              "bacthId": that.data.batchID,
                                              "RE_CUST_ID": app.globalData.int_id.toString(),
                                          })
                                          let custnameTwo3 = encr.jiami(dataJson3, aeskey) //3段加密
                                          wx.request({
                                              url: app.globalData.YTURL + 'yp/addIdCardToyxyp.do',
                                              data: encr.gwRequest(custnameTwo3),
                                              method: 'POST',
                                              success(res) {
                                                let jsonData = encr.aesDecrypt(res.data.body, aeskey);
                                                if(jsonData.STATUS != '1'){
                                                  wx.hideLoading();
                                                    $Toast({
                                                        content: '身份证上传失败',
                                                        type: 'warning',
                                                        duration: 1,
                                                    });
                                                    that.setData({
                                                        img: {
                                                            renxiang: app.globalData.URL + 'static/wechat/img/temp/mine/s2_ren_bg.jpg',
                                                            guohui: app.globalData.URL + 'static/wechat/img/temp/mine/s2_guo_bg.jpg',
                                                        },
                                                    });
                                                    return;
                                                  }
                                                  wx.request({
                                                      url: app.globalData.YTURL + 'jsyh/ocrRecognition.do',
                                                      data: encr.gwRequest({
                                                          "IMAGE_MODE": "03",
                                                          "IMAGE_DOC_ID": that.data.batchID,
                                                          "OBJ_NAME": "SYS050_BIZ01",
                                                          "FILE_TYPE":"SYS050_BIZ01_102"
                                                      }),
                                                      method: 'POST',
                                                      success(res) {
                          
                                                          wx.hideLoading();
                          
                                                          if (res.data.body.TRAN_STATUS != 'COMPLETE') {
                                                              $Toast({
                                                                  content: '身份证OCR照片识别失败',
                                                                  type: 'warning',
                                                                  duration: 1,
                                                              });
                                                              that.setData({
                                                                  img: {
                                                                      renxiang: app.globalData.URL + 'static/wechat/img/temp/mine/s2_ren_bg.jpg',
                                                                      guohui: app.globalData.URL + 'static/wechat/img/temp/mine/s2_guo_bg.jpg',
                                                                  },
                                                              });
                                                              return;
                                                          }
                                                          if (res.data.body.RE_LEGALITY == '01') {
                                                              wx.hideToast();
                                                              that.setData({
                                                                  idcard: {
                                                                      custId: res.data.body.RE_CUST_ID,
                                                                      name: res.data.body.RE_CUST_NAME,
                                                                      number: res.data.body.RE_CUST_ID,
                                                                      date: res.data.body.RE_VALID_DATE,
                                                                      gender: res.data.body.RE_GENDER, //性别
                                                                      certificate_type: '二代身份证', //证件类型
                                                                      legality: res.data.body.RE_LEGALITY, //合法性验证结果
                                                                      address: res.data.body.RE_ADDRESS, //地址
                                                                      race: res.data.body.RE_RACE, //民族
                                                                      birthday: res.data.body.RE_BIRTHDAY, //生日
                                                                      issued_by: res.data.body.RE_ISSUED_BY, //签发机关
                                                                  },
                                                              })
                                                              $Toast({
                                                                  content: '身份证OCR照片识别成功',
                                                                  type: 'success',
                                                                  duration: 1,
                                                              });
                          
                                                          } else if (res.data.body.RE_LEGALITY == '02') {
                                                              wx.hideToast();
                                                              wx.showModal({
                                                                  title: '提示',
                                                                  content: '请拍照上传正常有效身份证原件(不允许拍照身份证复印件,身份证二次拍照)',
                                                                  showCancel: false, //是否显示取消按钮
                                                                  success: function(res) {},
                                                                  fail: function(res) {}, //接口调用失败的回调函数
                                                                  complete: function(res) {}, //接口调用结束的回调函数（调用成功、失败都会执行）
                                                              });
                                                          } else {
                                                              wx.hideToast();
                                                              wx.showModal({
                                                                  title: '提示',
                                                                  content: '识别失败',
                                                                  showCancel: false, //是否显示取消按钮
                                                                  success: function(res) {},
                                                                  fail: function(res) {}, //接口调用失败的回调函数
                                                                  complete: function(res) {}, //接口调用结束的回调函数（调用成功、失败都会执行）
                                                              });
                                                          }
                                                      },
                                                      fail(res) {
                                                          wx.hideLoading();
                                                          $Toast({
                                                              content: '请检查网络',
                                                              type: 'warning',
                                                              duration: 1,
                                                          });
                                                      }
                                                  });
                                              }
                                          });
                                      }
                                      }
                                  });
                              },
                          });
                      }
                    }
                });
            },
        });
    },
    initValidate() {
        const rules1 = {
            RE_COMPANY_NAME: {
                required: true,
            },
            RE_REGISTER_ID: {
                required: true,
            },
            RE_LEGAL_REPRESENTATIVE: {
                required: true,
            },
            RE_REGISTERED_CAPITAL: {
                required: true,
            },
            RE_ADDRESS: {
                required: true,
            },
            RE_MANAGEMENT_SCOPE: {
                required: true,
            },
            RE_CUST_NAME: {
                required: true,
            },
            RE_CUST_ID: {
                required: true,
                idcard:true
            },

        };
        const messages1 = {
            RE_COMPANY_NAME: {
                required: '请输入企业名称',
            },
            RE_REGISTER_ID: {
                required: '请输入统一信用代码',
            },
            RE_LEGAL_REPRESENTATIVE: {
                required: '请输入法人名称',
            },
            RE_REGISTERED_CAPITAL: {
                required: '请输入注册资本',
            },
            RE_ADDRESS: {
                required: '请输入企业所在地',
            },
            RE_MANAGEMENT_SCOPE: {
                required: '请输入RE_MANAGEMENT_SCOPE',
            },
            RE_CUST_NAME: {
                required: '请输入法定代表人姓名',
            },
            RE_CUST_ID: {
                required: '请输入法定代表人身份证号码',
            },
        };

        this.WxValidate = new WxValidate(rules1, messages1);

    },
    CheckTicket() {
        if (that.data.gsImg === '') {
            wx.showToast({
                title: '请上传工商营业执照',
                icon: 'none',
                mask: true,
                duration: 2000,
            });
            return;
        }
        if (!that.data.isRegister) {
            wx.showToast({
                title: "请点击左下角'绑定企业'按钮",
                icon: 'none',
                mask: true,
                duration: 2000,
            });
            return;
        }
        that.CheckTicketPro().then(res => {
            that.checkWd(that.data.gsInfo.RE_REGISTER_ID).then(res => {
                if (that.data.orderNo != '') {
                    wx.redirectTo({
                        url: './applyExtra?orderNo=' + that.data.orderNo + '&id=' +
                            that.data.id,
                    })
                } else {
                    wx.redirectTo({
                        url: './applyExtra?id=' + that.data.id
                    })
                }
            }).catch(err => {
                wx.showToast({
                    title: err.msg,
                    icon: 'none',
                    duration: 3000,
                });
            })
        }).catch(err => {
            wx.showToast({
                title: err.msg,
                icon: 'none',
                duration: 3000,
            });
        })

    },
    CheckTicketPro() {
        return new Promise((resolve, reject) => {

            var dataJson = JSON.stringify({
                orgCode: that.data.gsInfo.RE_REGISTER_ID
            })
            var custnameTwo = encr.jiami(dataJson, aeskey) //3段加密
            wx.request({
                url: app.globalData.YTURL + 'electric/CheckTicket.do',
                data: encr.gwRequest(custnameTwo),
                method: 'POST',
                header: {
                    'content-type': 'application/json', // 默认值
                },
                success(res) {
                    if (res.data.head.H_STATUS === "1") {
                        var jsonData = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文
                        if (jsonData.isCredit === '1') {
                            reject({ msg: jsonData.RET_MSG })

                        } else {
                            resolve()
                        }
                    } else {
                        reject({ msg: res.data.head.H_MSG })

                    }
                }

            })
        })


    }
})