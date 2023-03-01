var encr = require('../utils/encrypt/encrypt');
var aeskey = encr.key; //随机数
const app = getApp();
export default class Ocr {
  /**
   * 身份证正反面获取识别信息
   * @param {e} info
   * info : {
   *    _rx: '', 正面
   *    _gh: '', 反面
   * }
   */
  static getIdentificationInfo(info) {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: app.globalData.URL + "uploadCard", // 仅为示例，非真实的接口地址
        filePath: info._rx, //that.data.takephoto.tempImage,
        name: "file",
        formData: {
          option: "1", //1生产环境
          type: 1
        },
        success: res => {
          if (res.statusCode === 413) {
            wx.showToast({
              title: "上传证件正面过大，请重新选择",
              icon: "none",
              mask: true,
              duration: 2000,
            });
            return;
          }
          if (res.statusCode == 200) {
            console.log(res.data)
            // that.setData({
            //   patha: res.data,
            // });
            wx.request({
              url: app.globalData.YTURL + 'jsyh/test.do', //base64 转 图片地址
              data: encr.gwRequest({
                "imgStr": res.data,
              }),
              method: 'POST',
              success(res1) {
                if (res1.data.head.H_STATUS != '1') {
                  wx.showToast({
                    title: '上传影像：' + res1.data.head.H_MSG,
                    icon: 'none'
                  })
                } else {
                  wx.uploadFile({
                    url: app.globalData.URL + 'uploadCard',
                    filePath: info._gh,
                    name: 'file',
                    formData: {
                      option: '1',
                      type: 1
                    },
                    success: res => {
                      if (res.statusCode === 413) {
                        wx.showToast({
                          title: "上传证件反面过大，请重新选择",
                          icon: "none",
                          mask: true,
                          duration: 2000,
                        });
                        return;
                      }
                      if (res.statusCode == 200) {
                        // that.setData({
                        //   pathb: res.data,
                        // });
                        wx.request({
                          url: app.globalData.YTURL + 'jsyh/test.do', //base64 转 图片地址
                          data: encr.gwRequest({
                            "imgStr": res.data,
                          }),
                          method: 'POST',
                          success(res2) {
                            if (res2.data.head.H_STATUS != '1') {
                              wx.showToast({
                                title: '上传影像：' + res2.data.head.H_MSG,
                                icon: 'none'
                              })
                            } else {
                              let dataJson3 = JSON.stringify({
                                "IMAGE_IDCARD_A": res1.data.body.imgFilePath,
                                "IMAGE_IDCARD_B": res2.data.body.imgFilePath,
                                "RE_CUST_ID": info.RE_CUST_ID
                              })
                              let custnameTwo3 = encr.jiami(dataJson3, aeskey) //3段加密
                              wx.request({
                                url: app.globalData.YTURL + 'electric/addIdCardtoYxpt.do',
                                data: encr.gwRequest(custnameTwo3),
                                method: 'POST',
                                success(res) {
                                  let jsonData = encr.aesDecrypt(res.data.body, aeskey)
                                  console.log('jsyh/ocrRecognition.do:', {
                                    "IMAGE_MODE": "03",
                                    "IMAGE_DOC_ID": jsonData.BatchID,
                                    "OBJ_NAME": 'SYS050_BIZ01',
                                    "FILE_TYPE": 'SYS050_BIZ01_102'
                                  })
                                  wx.request({
                                    url: app.globalData.YTURL + 'jsyh/ocrRecognition.do',
                                    data: encr.gwRequest({
                                      "IMAGE_MODE": "03",
                                      "IMAGE_DOC_ID": jsonData.BatchID,
                                      "OBJ_NAME": 'SYS050_BIZ01',
                                      "FILE_TYPE": 'SYS050_BIZ01_102'
                                    }),
                                    method: "POST",
                                    success(res) {
                                      console.log(res)
                                      if (res.data.body.TRAN_STATUS != 'COMPLETE') {
                                        wx.showModal({
                                          title: '提示',
                                          content: '身份证OCR照片识别失败',
                                          showCancel: false, //是否显示取消按钮
                                          success: function (res) {},
                                          fail: function (res) {}, //接口调用失败的回调函数
                                          complete: function (res) {}, //接口调用结束的回调函数（调用成功、失败都会执行）
                                        });
                                        wx.hideLoading();
                                        return;
                                      }
                                      if (res.data.body.RE_LEGALITY == '01') {
                                        resolve(res)
                                      } else if (res.data.body.RE_LEGALITY == "02") {
                                        wx.hideLoading();
                                        wx.showModal({
                                          title: "提示",
                                          content: "请拍照上传正常有效身份证原件(不允许拍照身份证复印件,身份证二次拍照)",
                                          showCancel: false, //是否显示取消按钮
                                          success: function (res) {},
                                          fail: function (res) {}, //接口调用失败的回调函数
                                          complete: function (res) {}, //接口调用结束的回调函数（调用成功、失败都会执行）
                                        });
                                      } else {
                                        wx.hideLoading();
                                        wx.showModal({
                                          title: "提示",
                                          content: '识别失败',
                                          showCancel: false, //是否显示取消按钮
                                          success: function (res) {},
                                          fail: function (res) {}, //接口调用失败的回调函数
                                          complete: function (res) {}, //接口调用结束的回调函数（调用成功、失败都会执行）
                                        });
                                      }
                                    }
                                  })
                                }
                              });
                            }
                          }
                        })
                      } else {
                        wx.hideLoading();
                        wx.showToast({
                          title: "图片上传失败，请稍后重试",
                          icon: "none",
                          mask: true,
                          duration: 2000
                        });
                      }
                    }
                  })
                }
              }
            })
          } else {
            wx.hideLoading();
            wx.showToast({
              title: "图片上传失败，请稍后重试",
              icon: "none",
              mask: true,
              duration: 2000
            });
          }
        },
      });
    })
  }
}


