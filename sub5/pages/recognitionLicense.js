// sub4/pages/identityCard.js
import requestYT from '../../api/requestYT';
var encr = require('../../utils/encrypt/encrypt.js'); //国密3段式加密
import user from '../../utils/user';
import Org from '../../api/Org'
var encr = require('../../utils/encrypt/encrypt.js'); //国密3段式加密
var {
  getGSInfo
} = require('../gs.js'); //国密3段式加密
import {
  getGsxx,
  maoeronSubmit,
  selectMyrInfo,
  recordStep
} from '../../api/mer'
var aeskey = encr.key //随机数
// import { gwRequest } from '../../../utils/encrypt/encrypt.js';
const {
  $Toast
} = require('../dist/base/index');
const app = getApp();
Page({

    /**
     * 页面的初始数据
     * /home/app/wxapp/yxpt/20220316/61378b110a92454c86ccbfb8350baa00.jpg
     */
    data: {
        disabled:true,
        licenseImage:'',
        preffixUrl:'',
        faCard:'',
        canvasWidth:'',
        canvasHeight:'',
        Eid:'',
        re_valid_date:'',
        faName:'',
        faPhone:'',
        verifyResult:'',
        idCardBatch_id:''
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    if (options.faCard) {
      this.setData({
        faCard: options.faCard,
        Eid: options.Eid,
        faName: options.faName,
        re_valid_date: options.re_valid_date,
        faPhone: options.faPhone != 'undefined' ? options.faPhone : '',
        faCard: options.faCard ? options.faCard : '',
        verifyResult: options.verifyResult,
        idCardBatch_id: options.idCardBatch_id
      })
    }else{
      this.selectMyrInfo();
    }
    this.setData({
      preffixUrl: app.globalData.CDNURL,
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
        }
    })
},
  // 上传营业执照
  async getGS() {
    var ctx = wx.createCanvasContext("attendCanvasId");
    console.log(ctx);
    var that = this;
    let eNTNAME = ''
    let creditCode = ''
    let yesOrNo = false
    var gsInfo = await getGSInfo('attendCanvasId', ctx, that);
    console.log(gsInfo);
    console.log('企业名称', gsInfo.RE_COMPANY_NAME);
    let data = {
      companyName: gsInfo.RE_COMPANY_NAME,
      type: '1',
    }
    getGsxx(data).then(res => {
      console.log(res); 
      console.log(data);
      if (res.stringData) {
        if (JSON.parse(res.stringData).eNTNAME == gsInfo.RE_COMPANY_NAME) {
          console.log(1);
          eNTNAME = gsInfo.RE_COMPANY_NAME
          creditCode = gsInfo.RE_REGISTER_ID
        } else {
          console.log(2);
          eNTNAME = ''
          creditCode = ''
          yesOrNo = true
        }
      } else {
        console.log(3);
        eNTNAME = ''
          creditCode = ''
          yesOrNo = true
      }
      var data={
          openId:wx.getStorageSync('openid'),
          fName:this.data.faName, // 法人姓名
          fPhone:this.data.faPhone, // 法人手机号
          fCard:this.data.faCard, // 法人身份证
          duties: '法定代表人',
          creditCode: creditCode,
          enterpriseDate: gsInfo.RE_FOUNDATION_DATE,
          businessAddress:gsInfo.RE_ADDRESS,
          enterpriseName: eNTNAME,
          eId: that.data.Eid,
//           province: that.data.cityCode,
          businessLicenceCode:creditCode,
          businessType: gsInfo.RE_COMPANY_TYPE,
//           city: that.data.creditCodeName,
          frCardEndDate: that.data.re_valid_date,
          imageId: gsInfo.batchID//营业执照batchID
    }
      console.log('用户信息', data);
      maoeronSubmit(data).then(res => {
        if (res) {
          console.log(res);
          var params={
            openId:wx.getStorageSync('openid'),
            step:'03'
          }
          recordStep(params).then(res=>{
            console.log(res)
          })
        }
      })
      console.log('./fillInInformation?&procedure=2&enterpriseName=' + eNTNAME + '&enterpriseDate=' + gsInfo.RE_FOUNDATION_DATE + '&businessAddress=' + gsInfo.RE_ADDRESS + '&batchID=' + gsInfo.batchID + '&creditCode=' + creditCode + '&RE_MANAGEMENT_SCOPE=' + gsInfo.RE_COMPANY_TYPE + '&submitCredit=true' + '&Eid=' + that.data.Eid + '&re_valid_date=' + that.data.re_valid_date + '&faName=' + that.data.faName + '&faCard=' + this.data.faCard + '&faPhone=' + this.data.faPhone + '&verifyResult=' + this.data.verifyResult + '&idCardBatch_id=' + this.data.idCardBatch_id + '&yesOrNo=' + yesOrNo +'&orgCode=' + JSON.parse(res.stringData).oRGCODES)
      // return;
      wx.redirectTo({
        url: './fillInInformation?&procedure=2&enterpriseName=' + eNTNAME + '&enterpriseDate=' + gsInfo.RE_FOUNDATION_DATE + '&businessAddress=' + gsInfo.RE_ADDRESS + '&batchID=' + gsInfo.batchID + '&creditCode=' + creditCode + '&RE_MANAGEMENT_SCOPE=' + gsInfo.RE_COMPANY_TYPE + '&submitCredit=true' + '&Eid=' + that.data.Eid + '&re_valid_date=' + that.data.re_valid_date + '&faName=' + that.data.faName + '&faCard=' + this.data.faCard + '&faPhone=' + this.data.faPhone + '&verifyResult=' + this.data.verifyResult + '&idCardBatch_id=' + this.data.idCardBatch_id + '&yesOrNo=' + yesOrNo +'&orgCode=' + JSON.parse(res.stringData).oRGCODES ,
      })
    })
   


    // this.getRegisterInfo(gsInfo.RE_REGISTER_ID,gsInfo);
  },
  //通过社会信用统一码获取
  async getRegisterInfo(registerId, gsInfo) {
    if (registerId == '' || registerId.length != 18) {
      return
    }
    var flag = 0;
    var that = this;
    wx.hideLoading({
      success: (res) => {
        wx.showLoading({
          title: "正在识别",
        })
      },
    })
    const res = await Org.getEnterpriseInfo({
      type: '2', //1 企业名称  2统一码
      companyCode:registerId,
    });
    if(res.enterpriseInfo != ''){
      var info = res.enterpriseInfo;
      that.setData({
        custName: info.eNTNAME?info.eNTNAME:'',
        shxydm: info.cREDITCODE?info.cREDITCODE:'',
        identityFileNo: info.cREDITCODE?info.cREDITCODE:'',
        landTaxRegisterNo: info.cREDITCODE?info.cREDITCODE:'',
        stateTaxRegisterNo: info.cREDITCODE?info.cREDITCODE:'',
        businessScope: info.oPSCOPE?info.oPSCOPE:'',
        orgCode: info.oRGCODES?info.oRGCODES:'',
        zcyb:info.rEGORGCODE?info.rEGORGCODE:'',
        //营业执照类型反显
        identityFileType: that.data.zmwjzlItems[0][0].value,
        zmwjzl: that.data.zmwjzlItems[0][0].name,
        //建立日期反显
        establishDate:  info.oPFROM?that.converTimeStringFormart(info.oPFROM,'-'):'',
        establishDatePickerDatePicker: info.oPFROM?that.converDateToTimes(info.oPFROM):'',//反显时间戳

        //证明文件起始有效期
        identityFileDate:  info.oPTO!='长期'?info.oPTO:'9999-12-31',
        businessValidityIndex: info.oPTO=='长期'?'1':'0',
        businessValidity:info.oPTO=='长期'?'长期':'固定有效期',
        identityFileDateDatePicker: info.oPTO != '长期'?that.converDateToTimes(info.oPTO):'',
        identityFileType: that.data.zmwjzlItems[0][0].value,
        zmwjzl: that.data.zmwjzlItems[0][0].name,
      });
      flag++;
    }
    if(gsInfo != ''){
      that.setData({
            //证明文件有效期反显，内喊长期
            registerAddress: gsInfo.RE_ADDRESS?gsInfo.RE_ADDRESS:'',
      });
      flag++;
    }else{
      wx.hideLoading()
    }
    if(flag>0){
      wx.hideLoading({
        success: (res) => {
            wx.showToast({
                title: '识别成功',
            })
        },
      })
    }else{
      wx.hideLoading({
        success: (res) => {
            wx.showToast({
                title: '未识别到企业信息，请重试',
            })
        },
      })
    }
  },
    toBack() {
        
    },
    // 提交
    async getImageBatchID() {
      let that = this
      var _gh = that.data.licenseImage;
      wx.showLoading({
          title: '正在识别',
          mask: true
      })
      wx.uploadFile({
        url: that.data.preffixUrl + 'uploadCard',
        filePath: _gh,
        name: 'file',
        formData: {
            option: '2',
            type: 1,
        },
        success: res => {
          console.log('pathc',res);
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
                        //证件拍照
                        user.getCustomerInfo().then((r) => {
                            console.log(r);
                            //营业执照
                            that.setData({
                                ID_CARD:r.ID_CARD
                            });
                            console.log();
                            wx.request({
                                //你缺少这个接口调用，这个接口正经的才是给你拿batchid的地方
                                url: app.globalData.YTURL + 'electric/addIdCardtoYxpt.do',
                                data: encr.gwRequest(custnameTwo3),
                                method: 'POST',
                                success(res) {
                                    console.log(res);
                                    let dataJson4 = JSON.stringify({
                                        "IMAGE_BIZLICENSE_URL": res.data.body.imgFilePath,
                                        "RE_REGISTER_ID": '1',
                                        "RE_CUST_ID":that.data.faCard//身份证号
                                    })
                                    console.log('dataJson4',dataJson4);
                                    let custnameTwo4 = encr.jiami(dataJson4, aeskey) //3段加密
                                    wx.request({
                                        url: app.globalData.YTURL + 'electric/addBizLicenseOcr.do', //图片地址 转 batchID
                                        data: encr.gwRequest(custnameTwo4),
                                        method: 'POST',
                                        success(add) {
                                            console.log(add);
                                            let jsonBatch = encr.aesDecrypt(add.data.body, aeskey);//3段加密
                                            console.log(jsonBatch);
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
                                                success(item) {
                                                    console.log(item);
                                                    if (item.data.body.STATUS != '1' || item.data.body.STATUS == undefined) {
                                                        wx.showToast({
                                                            title: item.data.head.H_MSG + ',请重新上传或者手工输入',
                                                            icon: 'none',
                                                            duration: 3000
        
                                                        })
                                                        wx.hideLoading()
                                                        return;
                                                    }
                                                    console.log('11111');
                                                    wx.hideLoading({
                                                    })
                                                    that.setData({
                                                        gsInfo: item.data.body
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
                            })
                           
                        });
                    }              
                }
            })
            // console.log(res.data);
            // wx.request({
            //     url: app.globalData.YTURL + 'jsyh/ocrRecognition.do',
            //     data: encr.gwRequest({
            //         "IMAGE_IDCARD_B": that.data.pathc,
            //         id: "yyzz_take"
            //     }),
            //     method: 'POST',
            //     success(res) {
            //         wx.hideLoading();
            //         if (res.data.body.TRAN_STATUS != 'COMPLETE') {
            //             wx.showModal({
            //               title: '提示',
            //               content: '身份证OCR照片识别失败',
            //               showCancel: false, //是否显示取消按钮
            //               success: function(res) {},
            //               fail: function(res) {}, //接口调用失败的回调函数
            //               complete: function(res) {}, //接口调用结束的回调函数（调用成功、失败都会执行）
            //           });
                       
            //             return;
            //         }
            //         if (res.data.body.RE_LEGALITY == '01') {
            //           console.log('res',res.data);
            //             wx.hideToast();
            //             that.setData({
            //                 idcard: {
            //                     custId: res.data.body.RE_CUST_ID,
            //                     name: res.data.body.RE_CUST_NAME,
            //                     number: res.data.body.RE_CUST_ID,
            //                     date: res.data.body.RE_VALID_DATE,
            //                     gender: res.data.body.RE_GENDER, //性别
            //                     certificate_type: '二代身份证', //证件类型
            //                     legality: res.data.body.RE_LEGALITY, //合法性验证结果
            //                     address: res.data.body.RE_ADDRESS, //地址
            //                     race: res.data.body.RE_RACE, //民族
            //                     birthday: res.data.body.RE_BIRTHDAY, //生日
            //                     issued_by: res.data.body.RE_ISSUED_BY, //签发机关
            //                 },
            //             })
            //             wx.redirectTo({
            //               url: './fillInInformation?faName=' + res.data.body.RE_CUST_NAME+ '&faCard=' + res.data.body.RE_CUST_ID,
            //           })
                       

            //         } else if (res.data.body.RE_LEGALITY == '02') {
            //             wx.hideToast();
            //             wx.showModal({
            //                 title: '提示',
            //                 content: '请拍照上传正常有效身份证原件(不允许拍照身份证复印件,身份证二次拍照)',
            //                 showCancel: false, //是否显示取消按钮
            //                 success: function(res) {},
            //                 fail: function(res) {}, //接口调用失败的回调函数
            //                 complete: function(res) {}, //接口调用结束的回调函数（调用成功、失败都会执行）
            //             });
            //         } else {
            //             wx.hideToast();
            //             wx.showModal({
            //                 title: '提示',
            //                 content: '识别失败',
            //                 showCancel: false, //是否显示取消按钮
            //                 success: function(res) {},
            //                 fail: function(res) {}, //接口调用失败的回调函数
            //                 complete: function(res) {}, //接口调用结束的回调函数（调用成功、失败都会执行）
            //             });
            //         }
            //     },
            //     fail(res) {
            //         wx.hideLoading();
            //         $Toast({
            //             content: '请检查网络',
            //             type: 'warning',
            //             duration: 1,
            //         });
            //     }
            // });
        },
        fail: err => {
            console.log(err);
        }
    });
     
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
        this.getGS()
        // const that = this;
        // let type = e.currentTarget.dataset.type;
        // wx.chooseImage({
        //     count: 10,
        //     sizeType: ['original', 'compressed'],
        //     sourceType: ['album', 'camera'],
        //     success: function (res) {
        //         that.addImage(type, res.tempFilePaths);
        //     },
        // });
    },
    addImage(type, files) {
      
        if (type === 'back') {
          this.setData({
            licenseImage: files[0],
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
      licenseImage
    } = this.data;

    if (licenseImage) {
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