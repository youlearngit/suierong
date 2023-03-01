// sub4/pages/identityCard.js
import requestYT from '../../api/requestYT';
var encr = require('../../utils/encrypt/encrypt.js'); //国密3段式加密
var util = require("../../utils/util.js");
// import { gwRequest } from '../../../utils/encrypt/encrypt.js';
const date = new Date();
import {
    maoeronSubmit,
    getQyName,
    getGsxx,
    selectMyrInfo,
    myrSign,
    recordStep
} from '../../api/mer'
const {
    $Toast
} = require('../dist/base/index');
const app = getApp();
var aeskey = encr.key
Page({

    /**
     * 页面的初始数据
     */
    data: {
        disabled: true,
        idCardFrontImage: '',
        idCardBackImage: '',
        preffixUrl: '',
        Eid: '',
        faPhone: '',
        batch_id:'',
        cWidth: 0,
        cHeight : 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            preffixUrl: app.globalData.CDNURL,
            preffixUrlUrl: app.globalData.URL,
            Eid: options.Eid,
            faPhone: options.faPhone,

            openId:  wx.getStorageSync('openid'),
        })
        this.selectMyrInfo()
    },
    // 提交
    async getImageBatchID() {
        console.log(!this.data.idCardFrontImage);
        if (!this.data.idCardFrontImage || !this.data.idCardBackImage) {
            wx.showToast({
                title: '请先上传证件照片', //提示的内容,
                icon: 'none', //图标,
                duration: 3000, //延迟时间,
            });
        } else {
            let that = this
            var _rx = that.data.idCardFrontImage;
            var _gh = that.data.idCardBackImage;
            wx.showLoading({
                title: '正在识别',
                mask: true
            })
            wx.uploadFile({
                url: that.data.preffixUrlUrl + 'uploadCard',
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
                    that.setData({
                        patha: res.data,
                    });
                    wx.uploadFile({
                        url: that.data.preffixUrlUrl + 'uploadCard',
                        filePath: _gh,
                        name: 'file',
                        formData: {
                            option: '2',
                            type: 1,
                        },

                        success: res => {
                            console.log('pathb', res);
                            if (res.statusCode != 200) {
                                wx.hideLoading();
                                wx.showToast({
                                    title: '上传证件反面过大，请重新选择', //提示的内容,
                                    icon: 'none', //图标,
                                    duration: 3000, //延迟时间,
                                });
                                return;
                            }
                            that.setData({
                                pathb: res.data,
                            });
                           
                            wx.request({
                                url: app.globalData.YTURL + 'jsyh/ocrRecognition.do',
                                data: encr.gwRequest({
                                    "IMAGE_IDCARD_B": that.data.pathb,
                                    "IMAGE_IDCARD_A": that.data.patha,
                                    "IMAGE_MODE": "02"
                                }),
                                method: 'POST',
                                success(res) {

                                    wx.hideLoading();

                                    if (res.data.body.TRAN_STATUS != 'COMPLETE') {
                                        wx.showModal({
                                            title: '提示',
                                            content: '身份证OCR照片识别失败',
                                            showCancel: false, //是否显示取消按钮
                                            success: function (res) {},
                                            fail: function (res) {}, //接口调用失败的回调函数
                                            complete: function (res) {}, //接口调用结束的回调函数（调用成功、失败都会执行）
                                        });

                                        return;
                                    }
                                    if (res.data.body.RE_LEGALITY == '01') {
                                        console.log('res', res.data);
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
                                                re_valid_date: res.data.body.RE_VALID_DATE, //签发机关
                                            },
                                        })
                                        let promise1 = new Promise(function (resolve, reject) {

                                            wx.request({
                                                url: app.globalData.YTURL + 'jsyh/test.do',
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
                                                    resolve({
                                                        img1: res.data.body.imgFilePath
                                                    })
                                                }
                                            })
                                        })
                                        let promise2 = new Promise(function (resolve, reject) {
            
                                            wx.request({
                                                url: app.globalData.YTURL + 'jsyh/test.do',
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
            
                                                    resolve({
                                                        img2: res.data.body.imgFilePath
                                                    })
                                                }
                                            })
                                        })
            
                                        Promise.all([promise1, promise2]).then((pro) => {
            
                                            let dataJson3 = JSON.stringify({
                                                "IMAGE_IDCARD_A": pro[0].img1,
                                                "IMAGE_IDCARD_B": pro[1].img2,
                                                "RE_CUST_ID": res.data.body.RE_CUST_ID
                                            })
            
            
                                            let custnameTwo3 = encr.jiami(dataJson3, aeskey) //3段加密
                                            console.log(' res.data.body.RE_CUST_ID:', res.data.body.RE_CUST_ID)
                                           let m1=new Promise((resolve,reject)=>{
                                                wx.request({
                                                    url: app.globalData.YTURL + 'electric/addIdCardtoYxpt.do',
                                                    data: encr.gwRequest(custnameTwo3),
                                                    method: 'POST',
                                                    success(res) {
                                                        console.log('electric/addIdCardtoYxptTy.do', res)
                                                        let jsonBatch = encr.aesDecrypt(res.data.body, aeskey)
                                                        console.log('jsonBatch', jsonBatch)
                                                        console.log(jsonBatch.BatchID)
                
                                                        let batch_id = jsonBatch.BatchID;
                                                        console.log('batch_id', batch_id);
                                                        that.setData({
                                                            batch_id:batch_id
                                                        })
                                                        let dataJson4 = JSON.stringify({
                                                            "batch_id": batch_id,
                                                            "id_card": that.data.idcard.number
                                                        })
                                                        let custnameTwo4 = encr.jiami(dataJson4, aeskey) //3段加密
                                                        wx.request({
                                                            url: app.globalData.YTURL + 'sui/updateCusInfoBatchid.do',
                                                            data: encr.gwRequest(custnameTwo4),
                                                            method: 'POST',
                                                            success(res) {
                                                                console.log('sui/updateCusInfoBatchid.do', res)
                                                                let datares = encr.aesDecrypt(res.data.body, aeskey)
                                                                console.log('jsonBatch', datares)
                                                                resolve();
                                                            }
                                                        })
                                                        wx.hideLoading()
                                                    }
                                                })
                                           })
                                            Promise.all([m1]).then(()=>{
                                                var data={
                                                    openId: wx.getStorageSync('openid'),
                                                    fName: res.data.body.RE_CUST_NAME, // 法人姓名
                                                    fCard:  res.data.body.RE_CUST_ID, // 法人身份证
                                                    duties: '法定代表人', //法定代表人
                                                    imageABatchId: that.data.batch_id,
                                                    imageBBatchId: that.data.batch_id,
                                                    eId: that.data.Eid==undefined?'':that.data.Eid,
                                                    frCardEndDate:that.getCaption(res.data.body.RE_VALID_DATE)
                                                }
                                                console.log(data)
                                                // return;
                                                maoeronSubmit(data).then(res => {
                                                    if (res) {
                                                    console.log(res);
                                                    that.setData({
                                                      Eid: res.Eid ? res.Eid : that.data.Eid
                                                    });
                                                    var params={
                                                        openId:wx.getStorageSync('openid'),
                                                        step:'01'
                                                    }
                                                    recordStep(params).then(res=>{
                                                        console.log(res)
                                                    })
                                                    }
                                                })
                                            })
                                        })
                                        that.startface(res.data.body.RE_CUST_NAME, res.data.body.RE_CUST_ID, res.data.body.RE_VALID_DATE)


                                    } else if (res.data.body.RE_LEGALITY == '02') {
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
    getCaption(obj) {
      var index=obj.lastIndexOf("\-");
      obj=obj.substring(index+1,obj.length);
      obj = obj.replace(/\./g,'')
  //  console.log(obj);
      if (obj == '长期') {
        obj = '99991231'
      }
      return obj;
  },
    compareName(params) {
        return new Promise((resolve, reject) => {
            var data1 = JSON.stringify({
                cust_name: params.name,
                cust_id: params.idcard,
                cust_addr: '1',
                cust_sex: '1',
                nation: '1',
                birthday: '00000000',
                is_agent: '0',
                busicode: '02'
            })
            var custnameTwos1 = encr.jiami(data1, aeskey)
            console.log(data1);
            wx.request({
                url: app.globalData.creditUrl + 'compareIdName.do',
                data: encr.gwRequest(custnameTwos1),
                method: 'POST',
                header: {
                    'content-type': 'application/json',
                },
                success(res) {
                    console.log(res);
                    if (res.data.head.H_STATUS === "1") {
                        var jsonData = encr.aesDecrypt(res.data.body, aeskey)
                        console.log(jsonData)
                        if (jsonData.chk_result == '00' || jsonData.chk_result == '01') {
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
    // 查询反显
    selectMyrInfo() {
        let data = {
            openId: wx.getStorageSync('openid')
        }
        console.log(data);
        var that=this;
        selectMyrInfo(data).then(res => {
            console.log(res);
            console.log(JSON.parse(res.myrInfo));
            var res1=JSON.parse(res.myrInfo);
            if (res.msgCode == '0000') {
                that.setData({
                    faName: JSON.parse(res.myrInfo).FA_NAME, // 法人姓名
                    faPhone: JSON.parse(res.myrInfo).FA_PHONE, // 法人手机号
                    faCard: JSON.parse(res.myrInfo).FA_CARD, // 法人身份证
                    Eid: JSON.parse(res.myrInfo).E_ID,
                    re_valid_date:JSON.parse(res.myrInfo).FA_CARD_DATE_END
                })
                if(res1.STEP=='01'){
                    that.startface(res1.FA_NAME,res1.FA_CARD,res1.FA_CARD_DATE_END)
                }
                // if (!this.data.submitCard && !this.data.submitCredit) {
                //     this.getIsCord()
                // }
            }

        })
    },
    startface(name, idcard, re_valid_date) {
        console.log(1111);
        let params = {
            name: name,
            idcard: idcard
        }
        let that = this
        that.compareName(params).then(res => {
            console.log(res);
            wx.startFacialRecognitionVerify({
                name: name, //身份证名称
                idCardNumber: idcard, //身份证号码
                success: function (res) {
                    console.log('res人脸', res);
                    var verifyResult = res.verifyResult; //认证结果
                    //调用接口
                    var data={
                        eId: that.data.Eid==undefined?'':that.data.Eid,
                        frCardEndDate:that.getCaption(re_valid_date),
                        openId: wx.getStorageSync('openid'),
                        imageFaceBatchId: verifyResult
                    }
                    maoeronSubmit(data).then(res => {
                        if (res) {
                        console.log(res);
                        var params={
                            openId:wx.getStorageSync('openid'),
                            step:'02'
                        }
                        recordStep(params).then(res=>{
                            console.log(res)
                        })
                        }
                    })
                    wx.redirectTo({
                        url: './fillInInformation?faName=' + name + '&faCard=' + idcard + '&re_valid_date=' + re_valid_date + '&verifyResult=' + verifyResult + '&submitCard=true' + '&Eid=' + that.data.Eid + '&faPhone=' + that.data.faPhone + '&batch_id=' + that.data.batch_id + '&verifyResult=' + res.verifyResult + '&procedure=1',
                    })
                },
                checkAliveType: 2, //屏幕闪烁(人脸核验的交互方式，默认0,读数字)
                fail: err => {
                    wx.showToast('请保持光线充足，面部正对手机，且无遮挡')
                }
            })
        }).catch(err => {
            console.log(err);
            wx.showToast({
                title: '身份信息验证失败，请输入正确的身份信息',
                icon: 'none'
            })
        })

    },
    async uploadImage(imageList) {
        console.log('imageListfefore', imageList);
        imageList = await this.convertImg(imageList);
        console.log('imageListafter', imageList);
        imageList = imageList.map((e) => {
            return {
                imgpath: e,
            };
        });
        console.log(imageList);

        let options = {
            url: 'jsyh/toYxpt.do',
            data: JSON.stringify({
                imgpathlist: imageList,
                imgname: '11',
                EcmCatalogCode: 'SYS021_BIZ01_110',
                imggs: 'jpg',
                imgbq: '相关证书',
                batch: 'SYS021_8229_',
                EcmBusiType: 'SYS021_BIZ01',
                RE_CUST_ID: this.data.idCard,
            }),
        };
        const res = await requestYT(options);
        if (res.STATUS === '1' && res.code === '1') {
            return res.BatchID;
        } else {
            return Promise.reject(new Error(res.msg || '上传影像系统失败，请稍后重试'));
        }
    },
    async convertImg(imgList) {
        let that = this;
        const promiseList = imgList.map(that.transfromIamge);
        // console.log(promiseList);
        // let imgUpLoadList = [];
        // imgList.forEach(async (img) => {
        //   let cc = that.upload(img);
        //   let jpg = await cc;
        //   //   let base64 = await that.upload(img);
        //   //   let jpg = await that.imageBase64toJPG(base64);
        //   imgUpLoadList.push({
        //     imgpath: jpg,
        //   });
        //   if (imgUpLoadList.length == imgList.length) {
        //     return imgUpLoadList;
        //   }
        // });

        // for (const img of imgList) {
        //   console.log(img);

        //   let cc = that.upload(img);

        //   let jpg = await cc;
        //   //   let base64 = await that.upload(img);
        //   //   let jpg = await that.imageBase64toJPG(base64);
        //   imgUpLoadList.push({
        //     imgpath: jpg,
        //   });
        // }
        // console.log('imgUpLoadList', imgUpLoadList);

        let imgUpLoadList = await Promise.all(promiseList);
        console.log(imgUpLoadList);
        return imgUpLoadList;
        //这个是有执行顺序的
        // try {
        //   for (let promise of promiseList) {
        //     let jpg = await promise;
        //     console.log('jpg', jpg);
        //     imgUpLoadList.push({
        //       imgpath: jpg,
        //     });
        //   }
        //   for (let i=0;i<promiseList.length;i++ ) {
        //     let jpg = await promiseList[i];
        //     console.log('jpg', jpg);
        //     imgUpLoadList.push({
        //       imgpath: jpg,
        //     });
        //   }
        // } catch (error) {
        //   console.log(error);
        // }

        // promiseList.forEach(async (e) => {
        //   let cc = e;
        //   let jpg = await cc;
        //   console.log('jpg', jpg);
        //   imgUpLoadList.push({
        //     imgpath: jpg,
        //   });
        // });

        // return imgUpLoadList;

        // all has uploaded and finish task

        // 先小后大有问题 异常没捕捉到

        // 要等所有 await 结束  不管是await返回时异常还是成功
    },
    async transfromIamge(img) {
        console.log(img);
        let base64 = await this.upload(img);
        let jpg = await this.imageBase64toJPG(base64);
        return jpg;
    },
    uploading(e) {
        const that = this;
        let type = e.currentTarget.dataset.type;
        wx.chooseImage({
            count: 1,
            sizeType: [ 'original'],
            sourceType: ['album', 'camera'],
            success: function (photo) {
                console.log(photo);
                wx.getImageInfo({
                  src: photo.tempFilePaths[0],
                  success(res){
                      console.log(res);
                      var ratio = 1 
                      var canvasWidth = res.width
                      var canvasHeight = res.height
                      while(canvasWidth > 600){
                          canvasWidth = Math.trunc(res.width / ratio)
                          canvasHeight = Math.trunc(res.height / ratio)
                          ratio++
                      }
                      that.setData({
                          cWidth:canvasWidth,
                          cHeight:canvasHeight
                      })
                      var ctx = wx.createCanvasContext('canvas')
                      ctx.drawImage(res.path, 0, 0, canvasWidth, canvasHeight)
                      ctx.draw(false, setTimeout(function(){
                        wx.canvasToTempFilePath({
                            canvasId: 'canvas',
                            destWidth: canvasWidth,
                            destHeight: canvasHeight,
                            success: function (res) {
                                console.log(res.tempFilePath)//最终图片路径
                                that.addImage(type,res.tempFilePath);
                            },
                            fail: function (res) {
                                console.log(res.errMsg)
                           }
                       })
                      },100))
                    
                  }
                })
                
            },
        });
    },
    addImage(type, files) {
        if (type === 'front') {
            this.setData({
                idCardFrontImage: files,
            });
        }
        if (type === 'back') {
            this.setData({
                idCardBackImage: files,
            });
        }
        this.canSubmit();
    },
    // 判断是否可以提交
    canSubmit() {
        let {
            imgList,
            disabled
        } = this.data;

        let {
            idCardFrontImage,
            idCardBackImage
        } = this.data;

        if (idCardFrontImage && idCardBackImage) {
            this.setData({
                disabled: false,
            });
            console.log(this.data.disabled);
        }




    },
    upload(filePath) {
        let that = this;
        return new Promise((resolve, reject) => {
            wx.uploadFile({
                url: app.globalData.URL + 'uploadCard',
                filePath,
                name: 'file',
                formData: {
                    option: '2',
                    type: 1,
                },
                success(res) {
                    console.log(res);
                    if (res.statusCode === 413) {
                        reject(new Error('上传图片过大，请重新选择'));
                        return;
                    }
                    if (res.statusCode !== 200) {
                        reject(new Error('图片上传失败，请稍后重试'));
                        return;
                    }
                    that
                        .imageBase64toJPG(res.data)
                        .then((res) => {
                            console.log(res);
                            resolve(res);
                        })
                        .catch((error) => {
                            reject(error);
                        });
                },
            });
        });
    },
    async imageBase64toJPG(imgStr) {
        let options = {
            url: 'jsyh/test.do',
            data: JSON.stringify({
                imgStr,
            }),
            ifEncrypt: false,
        };
        const res = await requestYT(options);
        console.log(options.url, res);
        if (res.STATUS === '1' && res.imgFilePath) {
            return res.imgFilePath;
        } else {
            return Promise.reject(new Error('图片转化失败，请稍后重试'));
        }
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})