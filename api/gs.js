import user from '../utils/user';
var encr = require('../utils/encrypt/encrypt.js'); //国密3段式加密
var aeskey = encr.key //随机数
const app = getApp();

  /**
   * 获取营业执照信息
   * 
   * tempFilePaths
   * 
   */
  const getGSInfo = async(canvasId,ctx,that)=>  {
    var imgs = '';
    var gsImg = '';
    var pathc = '';
    var canvasWidth = '';
    var canvasHeight = '';

    return new Promise(function (resolve, reject) {
        //选择相册
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                var tempFilePaths = res.tempFilePaths;
                imgs = tempFilePaths;
                
                wx.showLoading({
                    title: '正在识别',
                    mask: true
                })
                //压缩图片处理
                wx.getImageInfo({
                    src: tempFilePaths[0],
                    success: function(res) {
                        var ratio = 1;
                        canvasWidth = res.width;
                        canvasHeight = res.height;
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
                        setTimeout(() => {
                        //画面渲染
                        ctx.draw(false, setTimeout(() => {
                            //临时存储图片路径
                            wx.canvasToTempFilePath({
                            canvasId: canvasId,
                            width: 0,
                            height: 0,
                            destWidth: canvasWidth,
                            destHeight: canvasHeight,
                            fileType: 'jpg',
                            quality: quality,
                            success(res) {
                                gsImg = res.tempFilePath;
                                wx.uploadFile({
                                    url: app.globalData.CDNURL + 'uploadCard',
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
                                        pathc = res.data;
                                        wx.request({
                                            url: app.globalData.YTURL + 'jsyh/test.do', //base64 转 图片地址
                                            data: encr.gwRequest({
                                                "imgStr": pathc,
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
                                                    var ID_CARD ='';
                                                    user.getCustomerInfo().then((r) => {
                                                        //营业执照
                                                        ID_CARD = r.INT_ID;
                                                        let dataJson4 = JSON.stringify({
                                                            "IMAGE_BIZLICENSE_URL": res.data.body.imgFilePath,
                                                            "RE_REGISTER_ID": '1',
                                                            "RE_CUST_ID":String(r.INT_ID)//身份证号
                                                        })
                                                        let custnameTwo4 = encr.jiami(dataJson4, aeskey) //3段加密
                                                        let batchID = '';
                                                        wx.request({
                                                        url: app.globalData.YTURL + 'electric/addBizLicenseOcr.do', //图片地址 转 batchID
                                                        data: encr.gwRequest(custnameTwo4),
                                                        method: 'POST',
                                                        success(res) {
                                                            let jsonBatch = encr.aesDecrypt(res.data.body, aeskey);//3段加密
                                                            batchID = jsonBatch.BatchID;
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
                                                                    //识别成功返回营业执照信息
                                                                    resolve(res.data.body);
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
                                                    });
                                                }
                                            },
                                            });
                                    }
                                })
                            },
                        });
                        },600))
                        }, 600)
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
    });
  }



module.exports = {
    getGSInfo: getGSInfo
}