var app = getApp();
const {
    $Toast
} = require('../../dist/base/index');
var encr = require('../../utils/encrypt.js'); //国密3段式加密
var aeskey = encr.key
var that;
Page({
    data: {
        patha: '', //身份证头像路径
        pathb: '', //身份证国徽路径
        preffixUrl: app.globalData.URL,
        camera_flag: true,
        img: {
            renxiang: app.globalData.URL + 'static/wechat/img/temp/mine/s2_ren_bg.jpg',
            guohui: app.globalData.URL + 'static/wechat/img/temp/mine/s2_guo_bg.jpg',
        },
        takephoto: {
            noticeTxt: '', //渲染提示文字
            coverImg: '', //渲染遮罩层图片
            id: '', //
            tempImage: '', //存放拍照数据
        },
        authInfo: {}, //授权人信息
        idcard: {}, //OCR识别的身份证信息
        id:'',
        authType:'1',
    },

    onLoad(e) {
        that = this;

        if (e.business_type) {
            that.setData({
                business_type: e.business_type,
                id: e.id,
                authType: e.type 
            });
            that.getAuthInfo(e.id,e.type != '1' ? 1: '');
        }
        if (e.id != undefined && e.id != '') {
            wx.showModal({
                title: '提示',
                showCancel: false,
                content: '请点击证件框范围，进行拍照上传正反面证件信息',
                success(res) {}
            })
        }

    },
    getAuthInfo(id,type) {
        if (id == undefined || id == '') {
            wx.showModal({
                title: '提示',
                showCancel: false,
                content: '查询失败,请退出扫码重试',
                success(res) {
                    wx.switchTab({
                        url: '/pages/shop/index2',
                    })
                }
            })
            return;
        }
        var dataJsons = JSON.stringify({
            id: id,
            type: type
        })
        var custnameTwos = encr.jiami(dataJsons, aeskey) //3段加密
        wx.request({
            url: app.globalData.creditUrl + 'findAuthInfoById.do',
            data: encr.gwRequest(custnameTwos),
            method: 'POST',
            success: (res => {
                if (res.data.head.H_STATUS === "1") {
                    let jsonData = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文
                    if (jsonData.LIST == undefined || jsonData.LIST.length == 0) {
                        wx.showModal({
                            title: '提示',
                            content: '授权信息已失效',
                            showCancel: true,
                            success(res) {
                                if (res.confirm) {
                                    wx.switchTab({
                                        url: '/pages/shop/index2'
                                    })
                                }
                            },
                        });
                        return;
                    }
                    var data = jsonData.LIST[0];
                    //对公获取信息转换公共变量名称
                    if(type == '1'){
                      data.AUTH_NAME = data.BOR_PER_NAME;
                      data.AUTH_CERT_NO = data.BOR_PER_CODE;
                      data.AUTH_CERT_TYPE = data.BOR_PER_TYPE;
                    }
                    that.setData({
                        authInfo: data,
                        business_id: data.BUSINESS_ID,
                    });

                }

            })
        })
    },
    judgeAuth(id, ocr_name, ocr_no,date) {
        return new Promise((resolve, reject) => {
            var dataJsons = JSON.stringify({
                id: id,
                ocr_name: ocr_name,
                ocr_no: ocr_no,
                validDate:date,
                type: that.data.authType != '1' ? '1' : ''
            })
            var custnameTwos = encr.jiami(dataJsons, aeskey) //3段加密
            wx.request({
                url: app.globalData.creditUrl + 'judgeAuth.do',
                data: encr.gwRequest(custnameTwos),
                method: 'POST',
                success: (res => {
                    if (res.data.head.H_STATUS === "1") {
                        let jsonData = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文
                        console.log(jsonData)
                        if(jsonData.resultCode == 'PR99'){
                            reject({errCode:1})
                            return;
                        }
                        
                        if (jsonData.result == '0') {
                            resolve()
                            return;
                        }
                        
                        reject({errCode:2})
                    } else {
                        reject({errCode:3})
                    }

                })
            })
        })

    },
    creatPhoto(e) {
        const c = e.target.id;
		    var cameraF = 0;
        //点击后调取拍照/选已有sheet  关闭手机相册选取： itemList: ['立即拍照', '从手机相册选择'],
        wx.showActionSheet({
            itemList: ["立即拍照", "从手机相册选择"],
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
                if (_ind == "0") {
                  wx.getSetting({
                    success(res) {
                      for (var key in res.authSetting) {
                        if (key == "scope.camera") {
                          if (res.authSetting[key] == true) {
                            cameraF = 1;
                          }
                        }
                      }
                      if (cameraF == 1) {
                        that.setData({
                          camera_flag: false,
                          v: "1",
                        });
                      } else {
                        wx.authorize({
                          scope: "scope.camera", // 权限名称
                          // 请求权限成功后回调
                          success: res => {
                            that.setData({
                              camera_flag: false,
                              v: "1",
                            });
                          },
        
                          // 请求权限失败后回调
                          fail: () => {
                            //console.log("scope.camera 权限获取失败");
                            wx.showToast({
                              title: "相机权限未开启",
                              icon: "none",
                              image: "",
                              duration: 1500,
                              mask: false,
                              success: result => {
                                setTimeout(() => {
                                  wx.navigateBack();
                                }, 1500);
                              },
                              fail: () => {},
                              complete: () => {},
                            });
                            //wx.navigateBack({});
                          },
                        });
                      }
        
                      
                    },
                  });
        
                  //立即拍照
                }  else if (_ind == '1') {
                    wx.chooseImage({
                        count: 1,
                        sizeType: ['original', 'compressed'], //compressed压缩图，original原图
                        sourceType: ['album'],
                        success(res) {
                            var tempFilePaths = res.tempFilePaths;
                            var size = res.tempFiles[0].size;
                            wx.getImageInfo({
                                src: tempFilePaths[0],
                                success: function (res) {
                                    var ctx = wx.createCanvasContext('attendCanvasId');
                                    var ratio = 1;
                                    var canvasWidth = res.width;
                                    var canvasHeight = res.height;
                                    var quality = 1;
                                    while (canvasWidth > 500) {
                                        canvasWidth = Math.trunc(res.width / ratio);
                                        canvasHeight = Math.trunc(res.height / ratio);
                                        ratio += 0.1;
                                    }
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
                                    setTimeout(function () {
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

    //拍照调取原生组件方法
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
                    success: function (res) {
                        var _w = res.width;
                        var _h = res.height;

                        var relW = 700;
                        var relH = parseInt((relW * _h) / _w);
                        that.setData({
                            canvasHeight2: relH,
                            canvasWidth2: relW,
                        });
                        var ctx = wx.createCanvasContext("attendCanvasId2");
                        ctx.drawImage(res.path, 0, 0, relW, relH);
                        ctx.draw();

                        setTimeout(function () {
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

                                },
                            });
                        }, 600);
                    },
                });
            },
            fail: res => {},
        });
    },

    //识别
    reader() {

        var _rx = that.data.img.renxiang;
        var _gh = that.data.img.guohui;

        if (_rx == app.globalData.URL + 'static/wechat/img/temp/mine/s2_ren_bg.jpg') {
            wx.showToast({
                title: '请上传您的身份证人像面',
                icon: 'none',
                mask: true,
                duration: 2000,
            });
        } else
        if (_gh == app.globalData.URL + 'static/wechat/img/temp/mine/s2_guo_bg.jpg') {
            wx.showToast({
                title: '请上传您的身份证国徽面',
                icon: 'none',
                mask: true,
                duration: 2000,
            });
        } else {
            wx.showLoading({
                title: '智能识别中',
                mask: true,
            });
            wx.uploadFile({
                url: that.data.preffixUrl + 'uploadCard',
                filePath: _rx,
                name: 'file',
                formData: {
                    option: '1',
                },
                success: res => {
                    that.setData({
                        patha: res.data,
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
                            that.setData({
                                pathb: res.data,
                            });
                            let dataJson = JSON.stringify({
                                "IMAGE_IDCARD_B": that.data.pathb,
                                "IMAGE_IDCARD_A": that.data.patha,
                                "IMAGE_MODE": "02",
                                'type':'2'
                            })

                            wx.request({
                                //  url: app.globalData.YTURL + 'idcardRecognition/addToYxpt.do',
                                url: app.globalData.creditUrl + 'ocrRecognition.do',
                                data: encr.gwRequest({
                                    "IMAGE_IDCARD_B": that.data.pathb,
                                    "IMAGE_IDCARD_A": that.data.patha,
                                    "IMAGE_MODE": "02",
                                    // "type":'2',
                                    'openid':wx.getStorageSync('openid')
                                }),
                                method: 'POST',
                                success(author) {
                                    wx.hideLoading();
                                    
                                    if (author.data.head.H_STATUS != '1') {
                                        $Toast({
                                            content:author.data.head.H_MSG ,
                                            type: 'warning',
                                            duration: 1,
                                        });
                                  
                                        return;
                                    }
                                    if (author.data.body.TRAN_STATUS != 'COMPLETE') {
                                //  if (author.data.body.resultCode != 'PR00') {
                                        // $Toast({
                                        //     content:author.data.body.resultMsg,
                                        //     type: 'warning',
                                        //     duration: 1,
                                        // });
                                   
                                        $Toast({
                                            content: '身份证OCR照片识别失败',
                                            type: 'warning',
                                            duration: 1,
                                        });
                                        return;
                                    }
                                    if (author.data.body.RE_LEGALITY == '01') {
                                        wx.hideToast();
                                        that.judgeAuth(that.data.id, author.data.body.RE_CUST_NAME,author.data.body.RE_CUST_ID,author.data.body.RE_VALID_DATE).then(res => {
                                            that.setData({
                                                SEQ_NO: author.data.body.SEQ_NO
                                            })
                                            let promise1 = new Promise(function (resolve, reject) {
                                                wx.request({
                                                    url: app.globalData.creditUrl + 'test.do',
                                                    data: encr.gwRequest({
                                                        "imgStr": that.data.patha,
                                                    }),
                                                    method: 'POST',
                                                    success(res) {
                                                        if (res.data.head.H_STATUS != '1') {
                                                            wx.showToast({
                                                                title: '上传影像：' + res.data.head.H_MSG,
                                                                icon: 'none'
                                                            })
                                                            reject();
                                                            return;
                                                        }
                                                        let json = res.data.body;
                                                        resolve({
                                                            img1: json.imgFilePath
                                                        })
                                                    }
                                                })

                                            })
                                            let promise2 = new Promise(function (resolve, reject) {


                                                wx.request({
                                                    url: app.globalData.creditUrl + 'test.do',
                                                    data: encr.gwRequest({
                                                        "imgStr": that.data.pathb,
                                                    }),
                                                    method: 'POST',
                                                    success(res) {
                                                        if (res.data.head.H_STATUS != '1') {
                                                            wx.showToast({
                                                                title: '上传影像：' + res.data.head.H_MSG,
                                                                icon: 'none'
                                                            })
                                                            reject();
                                                            return;
                                                        }
                                                        let json = res.data.body;

                                                        resolve({
                                                            img2: json.imgFilePath
                                                        })
                                                    }
                                                })


                                            })

                                            Promise.all([promise1, promise2])
                                                .then((imgList) => {

                                                    let dataJson3 = JSON.stringify({
                                                        "SEQ_NO": that.data.SEQ_NO,
                                                        "IMAGE_IDCARD_A": imgList[0].img1,
                                                        "IMAGE_IDCARD_B": imgList[1].img2,
                                                        "RE_CUST_ID": that.data.authInfo.AUTH_CERT_NO

                                                    })
                                                    let custnameTwo3 = encr.jiami(dataJson3, aeskey) //3段加密

                                                    wx.request({
                                                        url: app.globalData.creditUrl + 'addIdcardToYxOp.do',

                                                        data: encr.gwRequest(custnameTwo3),
                                                        method: 'POST',
                                                        success(res) {
                                                            let json = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文

                                                            let remark1 = JSON.stringify({
                                                                img1Path: imgList[0].img1,
                                                                img2Path: imgList[0].img1,
                                                                BatchID: json.BatchID,
                                                                BatchID1: json.BatchID1
                                                            })
                                                            that.updateBatch(that.data.id, remark1)
                                                            that.setData({
                                                                caijiFlag: true,
                                                                reshowFlag: false,
                                                                idcard: {
                                                                    name: author.data.body.RE_CUST_NAME,
                                                                    number: author.data.body.RE_CUST_ID,
                                                                    date: author.data.body.RE_VALID_DATE,
                                                                    gender: author.data.body.RE_GENDER, //性别
                                                                    certificate_type: '二代身份证', //证件类型
                                                                    legality: author.data.body.RE_LEGALITY, //合法性验证结果
                                                                    address: author.data.body.RE_ADDRESS, //地址
                                                                    race: author.data.body.RE_RACE, //民族
                                                                    birthday: author.data.body.RE_BIRTHDAY, //生日
                                                                    issued_by: author.data.body.RE_ISSUED_BY, //签发机关
                                                                },
                                                            });
                                                            $Toast({
                                                                content: '身份证OCR照片识别成功',
                                                                type: 'success',
                                                                duration: 1,
                                                            });
                                                            // 更改状态//
                                                            var dataJsons = JSON.stringify({
                                                                id: that.data.id,
                                                                status: '1',
                                                                auth_time: that.getNowTime(),
                                                                type: that.data.authType != 1 ? 1 : 0,
                                                            })
                                                            var custnameTwos = encr.jiami(dataJsons, aeskey) //3段加密
                                                            wx.request({
                                                                url: app.globalData.creditUrl + 'updateAuthStatus.do',
                                                                data: encr.gwRequest(custnameTwos),
                                                                method: 'POST',
                                                                success(res) {
                                                                    setTimeout(() => {
                                                                        wx.navigateTo({
                                                                            url: 'authocrInfo?idcard=' +
                                                                                encodeURIComponent(JSON.stringify(that.data.idcard)) +
                                                                                '&authInfo=' + encodeURIComponent(JSON.stringify(that.data.authInfo)) + 
                                                                                '&business_type=' + that.data.business_type + 
                                                                                '&type=' + that.data.authType
                                                                        });
                                                                    }, 1000);
                                                                }
                                                            })
                                                        
                                                        }
                                                    })

                                                })
                                                .catch((err) => {
                                                    wx.showToast({
                                                        title: '上传影像失败',
                                                        icon: 'none'
                                                    })
                                                })
                                        }).catch(err => {
                                            if(err.errCode==1){
                                                wx.showModal({
                                                    title: '提示',
                                                    content: '身份证件已过期，请上传有效证件',
                                                    showCancel: false,
                                                    success(res) {}
                                                }) 
                                            }else if(err.errCode==2){
                                                wx.showModal({
                                                    title: '提示',
                                                    content: '个人信息与当前授权人('+that.data.authInfo.AUTH_NAME+')信息不符，无法进行授权，请重新进行身份证OCR识别',
                                                    showCancel: false,
                                                    success(res) {}
                                                }) 
                                            }else{
                                                wx.showModal({
                                                    title: '提示',
                                                    content: '身份信息识别失败',
                                                    showCancel: false,
                                                    success(res) {}
                                                }) 
                                            }
                                          
                                        })

                                    } else if (author.data.body.RE_LEGALITY == '02') {
                                        wx.hideToast();
                                        wx.showModal({
                                            title: '提示',
                                            content: '请拍照上传正常有效身份证原件(不允许拍照身份证复印件,身份证二次拍照)',
                                            showCancel: false, //是否显示取消按钮
                                            success: function (res) {},
                                            fail: function (res) {}, //接口调用失败的回调函数
                                            complete: function (res) {}, //接口调用结束的回调函数（调用成功、失败都会执行）
                                        });
                                    } else {
                                        wx.hideToast();
                                        wx.showModal({
                                            title: '提示',
                                            content: '识别失败',
                                            showCancel: false, //是否显示取消按钮
                                            success: function (res) {},
                                            fail: function (res) {}, //接口调用失败的回调函数
                                            complete: function (res) {}, //接口调用结束的回调函数（调用成功、失败都会执行）
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
                        },
                    });
                },
            });
        }
    },
    updateBatch(id, param) {
        var dataJsons = JSON.stringify({
            data: JSON.stringify({
                id: id,
                remark1: param,
                type: that.data.authType != 1 ? 1 : 0,
            })
        })
        console.log(dataJsons)
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

                }
            }
        })
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
    },
    //确定按钮
    chose() {
        this.setData({
            flag_self_ocr: false,
            preview_flag: true,
            v: '0',
        });
    },
    getNowTime: function () {
        let dateTime
        let yy = new Date().getFullYear()
        let mm = new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1
        let dd = new Date().getDate() < 10 ? ('0' + new Date().getDate()) : new Date().getDate()
        let hh = new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours()
        let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() :
            new Date().getMinutes()
        let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() :
            new Date().getSeconds()
        dateTime = yy + '/' + mm + '/' + dd + ' ' + hh + ':' + mf + ':' + ss
        return dateTime
    },


});