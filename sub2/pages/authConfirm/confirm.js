const util = require('../../utils/util');
var app = getApp();
const {
    $Toast
} = require('../../dist/base/index');
var encr = require('../../utils/encrypt.js');
var aeskey = encr.key
var that;
Page({
    data: {
        pdfFile: '',
        preffixUrl: '',
        clickControl:false,
        isCheck: false,
        loading: true,
        AUTH_CERT_TYPE: '',
        pdfPath: '',
        pdfPath1: '',
        pdfTime: '',
        yewuName: '',
        showBook: false,
        ocrInfo: '',
        faceInfo: '',
        yxptBatchID:'',
        yewulxtype_array: [{
                'id': '01',
                'name': '个人商用房贷款'
            }, {
                'id': '02',
                'name': '个人住房贷款'
            },
            {
                'id': '03',
                'name': '个人消费贷款'
            }, {
                'id': '05',
                'name': '其他'
            }
        ],
        auth_cert_type_array: [
            "身份证",
            // "户口薄",
            // "护照",
            // "军官证",
            // "士兵证",
            // "港澳居民来往内地通行证",
            // "台湾同胞来往内地通行证",
            // "临时身份证",
            // "外国人居留证",
            // "警官证",
            // "香港身份证",
            // "澳门身份证",
            // "台湾身份证",
            // "其他证件",
        ],
        auth_type_array: [
            {
                'id': '01',
                'name': '借款人'
            },
            {
                'id': '02',
                'name': '借款人配偶（不提供担保）'
            },
            {
                'id': '03',
                'name': '担保人'
            }
        ],
        auth_type_array2: [
            {
                'id': '01',
                'name': '借款人'
            },
            {
                'id': '03',
                'name': '担保人'
            },
            {
                'id': '05',
                'name': '实体企业法定代表人、高管、股东'
            }
            ,
            {
                'id': '07',
                'name': '授信业务其他相关自然人'
            }
        ],
        auth_enterprise_type_array: [
            {
                'id': '1',
                'name': '借款企业法定代表人（不提供担保）'
            },
            {
                'id': '2',
                'name': '高管 / 自然人股东（不提供担保）'
            },
            {
                'id': '2',
                'name': '实际控制人（不提供担保）'
            }
            ,
            {
                'id': '3',
                'name': '个人连带责任保证人/抵押人/质押人'
            }
            ,
            {
                'id': '7',
                'name': '授信业务其他相关自然人'
            }
        ],
        //对公授权
        auth_enterprise_type_array2:[
          {
            'id': '10',
            'name': '借款企业'
          },
          {
            'id': '30',
            'name': '担保（保证、抵押、质押）企业'
          },
          {
            'id': '40',
            'name': '关联企业'
          }
        ],
        //对公授权-个人
        auth_enterprise_type_array3:[
          {
            'id': '20',
            'name': '借款人经营实体'
          },
          {
            'id': '30',
            'name': '担保（保证、抵押、质押）企业'
          },
          {
            'id': '40',
            'name': '关联企业'
          }
        ],
        authType: '', //业务类型 '':个人,1:对公
        submitCount: 0, //提交次数限制
    },
    createPDF() {
        // if (that.data.business_type == 3) {
        //     return;
        // }
        wx.showLoading({
            title: '正在生成授权书',
            mask: true
        })
        let img1Path = that.data.ocrInfo.img1Path;
        let img2Path = that.data.ocrInfo.img2Path;
        var flags = '1';
        let name = that.data.borrowerInfo.BORROW_NAME

        if (that.data.business_type == 1) {
            wx.setStorageSync('book1', true)
            if (that.data.authInfo.AUTH_TYPE == '0') {
                flags = '2'
            } else if (that.data.authInfo.AUTH_TYPE == '1') {
                flags = '3'
            } else {
                flags = '1'
            }
        }

        if (that.data.business_type == 2) {
            if (that.data.authInfo.AUTH_TYPE == '0') {
                flags = '6'
            } else if (that.data.authInfo.AUTH_TYPE == '1') {
                flags = '5'
            } else if (that.data.authInfo.AUTH_TYPE == '2' ) {
                flags = '7'
            } else {
                flags = '8'
            }
        }

        if (that.data.business_type == 3) {
            if (that.data.authInfo.AUTH_ENTERPRISE_TYPE == '0' || that.data.authInfo.AUTH_ENTERPRISE_TYPE == '1' || that.data.authInfo.AUTH_ENTERPRISE_TYPE == '2') {
                flags = '9'
            } else if (that.data.authInfo.AUTH_ENTERPRISE_TYPE == '3') {
                flags = '10'
            } else {
                flags = '11'
            }
        }
        let BORROW_TYPE = that.data.borrowerInfo.BORROW_TYPE;

        if (that.data.business_type == 1) {
            if (BORROW_TYPE == '01') {
                name = that.data.yewulxtype_array[0].name
            } else if (BORROW_TYPE == '02') {
                name = that.data.yewulxtype_array[1].name
            } else if (BORROW_TYPE == '03') {
                name = that.data.yewulxtype_array[2].name
            } else if (BORROW_TYPE.indexOf('05') != -1) {
                name =
                    that.data.borrowerInfo.BORROW_TYPE.substr(2)
            }
        }
        if (that.data.business_type == 3) {
            name = that.data.borrowerInfo.ENTERPRISE_NAME
        }
        let pdfTime = that.getNow();
        that.setData({
            pdfTime: pdfTime,
            yewuName: name
        })


        wx.request({
            url: app.globalData.creditUrl + 'wordTopdf.do',
            data: encr.gwRequest({
                name: name,
                xm: that.data.borrowerInfo.BORROW_NAME,
                phone: that.data.authInfo.AUTH_PHONE,
                sqname: that.data.authInfo.AUTH_NAME,
                type: that.data.auth_cert_type_array[that.data.authInfo.AUTH_CERT_TYPE], //证件类型
                num: that.data.authInfo.AUTH_CERT_NO, //证件号码
                data: pdfTime,
                flag: flags, //授权书类型
                photo1: img1Path.substring(img1Path.lastIndexOf("/") + 1), //身份证正面
                photo2: img2Path.substring(img2Path.lastIndexOf("/") + 1), //身份证反面
                photo1path: img1Path, //身份证正面
                photo2path: img2Path, //身份证反面
            }),
            method: 'POST',
            success(res) {
                if (res.data.head.H_STATUS == "1" && res.data.body != null) {
                    var jsonData = res.data.body //解密返回的报文

                    if (that.data.business_type == 1) {
                        that.setData({
                            showBook: true
                        })
                    }
                    that.setData({
                        pdfPath: jsonData.pdfPath
                    })
                    wx.getFileSystemManager().writeFile({
                        filePath: wx.env.USER_DATA_PATH + jsonData.pdfPath.split("book")[1], //创建一个临时文件名
                        data: jsonData.PDF, //写入的文本或二进制数据
                        encoding: 'base64', //写入当前文件的字符编码
                        success: res => {
                            wx.hideLoading({
                                success: (res) => {},
                            })
                            wx.showToast({
                                title: '授权书生成成功',
                                icon: 'none',
                                duration: 1500
                            })
                            that.setData({ pdfFile: wx.env.USER_DATA_PATH + jsonData.pdfPath.split("book")[1], })
                        },
                        fail: err => {
                            wx.hideLoading({
                                success: (res) => {},
                            })
                            wx.showToast({
                                title: '生成失败',
                                icon: 'none'
                            })
                        }
                    })
                    return;
                    if (that.data.business_type == 2) {
                        //综合授权书 20210715 合并授权书
                        wx.request({
                            url: app.globalData.creditUrl + 'wordTopdf.do',
                            data: encr.gwRequest({
                                name: that.data.authInfo.AUTH_NAME,
                                phone: that.data.authInfo.AUTH_PHONE, //授权人手机号
                                sqname: that.data.authInfo.AUTH_NAME, //授权人姓名
                                type: that.data.auth_cert_type_array[that.data.authInfo.AUTH_CERT_TYPE], //证件类型
                                num: that.data.authInfo.AUTH_CERT_NO, //证件号码
                                data: that.data.pdfTime, //证件类型
                                flag: '4', //授权书类型
                                photo1: img1Path.substring(img1Path.lastIndexOf("/") + 1),
                                photo2: img2Path.substring(img2Path.lastIndexOf("/") + 1),
                                photo1path: img1Path,
                                photo2path: img2Path,
                            }),
                            method: 'POST',
                            success(res) {
                                if (res.data.head.H_STATUS == "1" && res.data.body != null) {
                                    var jsonData = res.data.body

                                    that.setData({
                                        pdfPath1: jsonData.pdfPath
                                    })
                                    let a = JSON.stringify({
                                        IMAGE_IDCARD_A: that.data.pdfPath1,
                                        RE_CUST_ID: that.data.authInfo.AUTH_CERT_NO,

                                    })
                                    var b = encr.jiami(a, aeskey)
                                    wx.request({
                                        url: app.globalData.creditUrl + 'pdfToYxpt.do',
                                        data: encr.gwRequest(b),
                                        method: 'POST',
                                        success(res) {
                                            if (res.data.head.H_STATUS == "1" && res.data.body != null) {
                                                // let jsonData = encr.aesDecrypt(res.data.body, aeskey)
                                                // that.setData({
                                                //     yxptBatchID: jsonData.BatchID
                                                // })
                                            }
                                        },
                                    });

                                }
                            },
                        });


                        return;
                    }

                } else {
                    wx.hideLoading({
                        success: (res) => {},
                    })
                    wx.showToast({
                        title: '授权书上传失败',
                        icon: 'none'
                    })
                }
            },
        });
    },
    //对公生成pdf
    createPDF2() {
      wx.showLoading({
          title: '正在生成授权书',
          mask: true
      })
      let pdfTime = that.getNow();
      var name1 = that.data.authType == '3'?
      that.data.auth_enterprise_type_array3[parseInt(that.data.borrowerInfo.BUSINESS_TYPE)-1].name :
       that.data.auth_enterprise_type_array2[parseInt(that.data.borrowerInfo.BUSINESS_TYPE)-1].name //授权主体类型
      if(that.data.authType == '3' && that.data.borrowerInfo.BUSINESS_TYPE == '1'){
        name1 = '借款人经营实体'
      }
      
      var name = '';
      if(that.data.borrowerInfo.BUSINESS_TYPE == '1'){
        name = '(1）、（2）、（4)';
      }else if(that.data.borrowerInfo.BUSINESS_TYPE == '2'){
        name = '（3）、（4）';
      }else  if(that.data.borrowerInfo.BUSINESS_TYPE == '3'){
        name = '（5）';
      }
      let img1Path = that.data.ocrInfo.img1Path;
      let img2Path = that.data.ocrInfo.img2Path;
      that.setData({
          pdfTime: pdfTime,
          yewuName: name1
      })
      var pdfReq = {}
      if(that.data.authType == '2'){
        // 企业对公
        pdfReq =  {
          borrow_type: '0'+that.data.borrowerInfo.BUSINESS_TYPE , //业务类型
          xm: that.data.borrowerInfo.ENTERPRISE_NAME, //借款方公司名称
          name: name, //条约
          empower_company: that.data.authInfo.EMPOWER == '0' ? '/' : that.data.authInfo.EMPOWER_COMPANY , //第三方授权名称
          sqdwname : that.data.authInfo.AUTH_ENTER_NAME,//授权单位名称
          sqname: that.data.authInfo.AUTH_NAME,  //授权人姓名
          data: pdfTime, //生成时间
          flag: '12', //授权书类型
          photo1: img1Path.substring(img1Path.lastIndexOf("/") + 1), //身份证正面
          photo2: img2Path.substring(img2Path.lastIndexOf("/") + 1), //身份证反面
          photo1path: img1Path, //身份证正面
          photo2path: img2Path, //身份证反面
          type: that.data.auth_cert_type_array[that.data.authInfo.AUTH_CERT_TYPE], //证件类型
          num: that.data.authInfo.AUTH_CERT_NO, //证件号码
        }
      }else{
        //个人对公
        pdfReq = {
          borrow_type: '0'+that.data.borrowerInfo.BUSINESS_TYPE , //业务类型
          xm: that.data.borrowerInfo.BORROW_NAME, //借款方公司名称
          name: name, //条约
          empower_company: that.data.authInfo.EMPOWER == '0' ? '/' : that.data.authInfo.EMPOWER_COMPANY , //第三方授权名称
          sqdwname : that.data.authInfo.AUTH_ENTER_NAME,//授权单位名称
          sqname: that.data.authInfo.BOR_PER_NAME,  //授权人姓名
          data: pdfTime, //生成时间
          flag: '13', //授权书类型
          photo1: img1Path.substring(img1Path.lastIndexOf("/") + 1), //身份证正面
          photo2: img2Path.substring(img2Path.lastIndexOf("/") + 1), //身份证反面
          photo1path: img1Path, //身份证正面
          photo2path: img2Path, //身份证反面
          type: that.data.auth_cert_type_array[that.data.authInfo.AUTH_CERT_TYPE], //证件类型
          num: that.data.authInfo.BOR_PER_CODE, //证件号码
        }
      }
      wx.request({
          url: app.globalData.creditUrl + 'wordTopdf.do',
          data: encr.gwRequest(pdfReq),
          method: 'POST',
          success(res) {
              if (res.data.head.H_STATUS == "1" && res.data.body != null) {
                  var jsonData = res.data.body //解密返回的报文
                  that.setData({
                      pdfPath: jsonData.pdfPath
                  })
                  wx.getFileSystemManager().writeFile({
                      filePath: wx.env.USER_DATA_PATH + jsonData.pdfPath.split("book")[1], //创建一个临时文件名
                      data: jsonData.PDF, //写入的文本或二进制数据
                      encoding: 'base64', //写入当前文件的字符编码
                      success: res => {
                          wx.hideLoading({
                              success: (res) => {},
                          })
                          wx.showToast({
                              title: '授权书生成成功',
                              icon: 'none',
                              duration: 1500
                          })
                          that.setData({ pdfFile: wx.env.USER_DATA_PATH + jsonData.pdfPath.split("book")[1], })
                      },
                      fail: err => {
                          wx.hideLoading({
                              success: (res) => {},
                          })
                          wx.showToast({
                              title: '生成失败',
                              icon: 'none'
                          })
                      }
                  })
                  return;
              } else {
                  wx.hideLoading({
                      success: (res) => {},
                  })
                  wx.showToast({
                      title: '授权书上传失败',
                      icon: 'none'
                  })
              }
          },
      });
    },
    navTo() {
        if(that.data.submitCount > 0 ){
          return;
        }
        that.setData({
          submitCount: 1,
        });
        if (!that.data.isCheck) {
          that.setData({
            submitCount: 0,
          });
            $Toast({
                content: "请勾选'我已阅读所有授权书'",
                type: 'warning',
                duration: 2,
                mask: false,
            });
            return;
        }

        // if (that.data.business_type == 1) {
        //     if (wx.getStorageSync('book1') != true) {
        //         $Toast({
        //             content: "请阅读授权书",
        //             type: 'warning',
        //             duration: 2,
        //             mask: false,
        //         });
        //         return;
        //     }
        // } else {
        //     if (wx.getStorageSync('book1') != true) {
        //         $Toast({
        //             content: "请阅读第一份授权书",
        //             type: 'warning',
        //             duration: 2,
        //             mask: false,
        //         });
        //         return;
        //     }
        //     if (wx.getStorageSync('book2') != true) {
        //         $Toast({
        //             content: "请阅读第二份授权书",
        //             type: 'warning',
        //             duration: 2,
        //             mask: false,
        //         });
        //         return;
        //     }
        // }

        if (wx.getStorageSync('book1') != true && that.data.authType == '1') {
            that.setData({
              submitCount: 0,
            });
            $Toast({
                content: "请阅读授权书",
                type: 'warning',
                duration: 2,
                mask: false,
            });
            return;
        }
        if(that.data.clickControl){
            that.setData({
              submitCount: 0,
            });
            return;
        }
        that.setData({
            clickControl:true
        })
        setTimeout(() => {
            that.setData({
                clickControl:false
            })   
        }, 6000);
        wx.showLoading({
            title: '正在提交',
            mask:true
        })
        that.getPdfToYxpt().then(res => {
            that.submitLat();

        }).catch(err => {
            wx.hideLoading({
                success: (res) => {},
            })
            wx.showToast({
                title: '上传失败',
                icon: 'none'
            })
            that.setData({
                clickControl:false,
                submitCount: 0,
            })   
        })
        return;

        if (that.data.businessType == 2 || that.data.business_type == 1) {
            wx.showLoading({
                title: '正在提交',
            })
            that.getPdfToYxpt().then(res => {
                that.submitLat();
            }).catch(err => {
                wx.hideLoading({
                    success: (res) => {},
                })
                wx.showToast({
                    title: '上传失败',
                    icon: 'none'
                })
            })
            return;
        }

        let img1Path = that.data.ocrInfo.img1Path;
        let img2Path = that.data.ocrInfo.img2Path;

        console.log('img1Path')
        console.log(img1Path)
        console.log('img2Path')
        console.log(img2Path)
        var flags = '1';
        //20201222修改：高管/自然人股东/实际控制人”拆分
        if (that.data.business_type == 3) {
            if (that.data.authInfo.AUTH_ENTERPRISE_TYPE == '0' || that.data.authInfo.AUTH_ENTERPRISE_TYPE == '1' || that.data.authInfo.AUTH_ENTERPRISE_TYPE == '2') {
                flags = '9'
            } else if (that.data.authInfo.AUTH_ENTERPRISE_TYPE == '3') {
                flags = '10'
            } else {
                flags = '11'
            }
        } else if (that.data.business_type == 1) {

            if (that.data.authInfo.AUTH_TYPE == '0') {
                flags = '2'
            } else if (that.data.authInfo.AUTH_TYPE == '1') {
                flags = '3'
            } else {
                flags = '1'
            }
        } else if (that.data.business_type == 2) {
            if (that.data.authInfo.AUTH_TYPE == '0') {
                flags = '6'
            } else if (that.data.authInfo.AUTH_TYPE == '1') {
                flags = '5'
            } else if (that.data.authInfo.AUTH_TYPE == '2' ) {
                // || that.data.authInfo.AUTH_TYPE == '4' || that.data.authInfo.AUTH_TYPE == '5'
                flags = '7'
            } else {
                flags = '8'
            }
        }

        wx.showLoading({
            title: '正在提交',
        })

        let pdfTime = that.getNow();
        that.setData({
            pdfTime: pdfTime
        })

        let BORROW_TYPE = that.data.borrowerInfo.BORROW_TYPE;
        let name = ''
        if (that.data.business_type == 1) {
            if (BORROW_TYPE == '01') {
                name = that.data.yewulxtype_array[0].name
            } else if (BORROW_TYPE == '02') {
                name = that.data.yewulxtype_array[1].name
            } else if (BORROW_TYPE == '03') {
                name = that.data.yewulxtype_array[2].name
            } else if (BORROW_TYPE.indexOf('05') != -1) {
                name =
                    that.data.borrowerInfo.BORROW_TYPE.substr(2)
            }
        } else if (that.data.business_type == 2) {
            name = that.data.borrowerInfo.BORROW_NAME
        } else if (that.data.business_type == 3) {
            name = that.data.borrowerInfo.ENTERPRISE_NAME
        }



        wx.request({
            url: app.globalData.creditUrl + 'wordTopdf.do',
            data: encr.gwRequest({
                name: name,
                xm: that.data.borrowerInfo.BORROW_NAME,
                phone: that.data.authInfo.AUTH_PHONE,
                sqname: that.data.authInfo.AUTH_NAME,
                type: that.data.auth_cert_type_array[that.data.authInfo.AUTH_CERT_TYPE], //证件类型
                num: that.data.authInfo.AUTH_CERT_NO, //证件号码
                data: pdfTime,
                flag: flags, //授权书类型
                photo1: img1Path.substring(img1Path.lastIndexOf("/") + 1), //身份证正面
                photo2: img2Path.substring(img2Path.lastIndexOf("/") + 1), //身份证反面
                photo1path: img1Path, //身份证正面
                photo2path: img2Path, //身份证反面
            }),
            method: 'POST',
            success(res) {
                if (res.data.head.H_STATUS == "1" && res.data.body != null) {

                    var jsonData = res.data.body

                    that.setData({
                        pdfPath: jsonData.pdfPath
                    })

                    if (that.data.business_type == 1||that.data.business_type==2) {
                        //个人零售一份授权书
                        that.getPdfToYxpt().then(res => {
                            that.submitLat();

                        }).catch(err => {
                            wx.hideLoading({
                                success: (res) => {},
                            })
                            wx.showToast({
                                title: '上传失败',
                                icon: 'none'
                            })
                        })
                        return;
                    }


                    wx.request({
                        url: app.globalData.creditUrl + 'wordTopdf.do',
                        data: encr.gwRequest({
                            name: that.data.authInfo.AUTH_NAME,
                            phone: that.data.authInfo.AUTH_PHONE, //授权人手机号
                            sqname: that.data.authInfo.AUTH_NAME, //授权人姓名
                            type: that.data.auth_cert_type_array[that.data.authInfo.AUTH_CERT_TYPE], //证件类型
                            num: that.data.authInfo.AUTH_CERT_NO, //证件号码
                            data: that.data.pdfTime, //证件类型
                            flag: '4', //授权书类型
                            photo1: img1Path.substring(img1Path.lastIndexOf("/") + 1),
                            photo2: img2Path.substring(img2Path.lastIndexOf("/") + 1),
                            photo1path: img1Path,
                            photo2path: img2Path,
                        }),
                        method: 'POST',
                        success(res) {
                            if (res.data.head.H_STATUS == "1" && res.data.body != null) {
                                var jsonData = res.data.body

                                that.setData({
                                    pdfPath1: jsonData.pdfPath
                                })
                                let a = JSON.stringify({
                                    IMAGE_IDCARD_A: that.data.pdfPath1,
                                    RE_CUST_ID: that.data.authInfo.AUTH_CERT_NO,
                                })
                                var b = encr.jiami(a, aeskey)
                                wx.request({
                                    url: app.globalData.creditUrl + 'pdfToYxpt.do',
                                    data: encr.gwRequest(b),
                                    method: 'POST',
                                    success(res) {
                                        if (res.data.head.H_STATUS == "1" && res.data.body != null) {
                                            let jsonData = encr.aesDecrypt(res.data.body, aeskey)

                                           
                                            that.getPdfToYxpt().then(res => {
                                                that.submitLat();
                                            }).catch(err => {
                                                wx.hideLoading({
                                                    success: (res) => {},
                                                })
                                                wx.showToast({
                                                    title: '上传失败',
                                                    icon: 'none'
                                                })
                                            })

                                        } else {
                                            wx.hideLoading({
                                                success: (res) => {},
                                            })
                                            wx.showToast({
                                                title: '上传失败',
                                                icon: 'none'
                                            })
                                        }
                                    },
                                });

                            }
                        },
                    });
                } else {
                    wx.hideLoading({
                        success: (res) => {},
                    })
                    wx.showToast({
                        title: '授权书上传失败',
                        icon: 'none',
                        duration: 5000
                    })
                }
            },
        });
    },
    getPdfToYxpt() {
        return new Promise((resolve, reject) => {
            let pa = JSON.stringify({
                IMAGE_IDCARD_A: that.data.pdfPath,
                RE_CUST_ID: that.data.authInfo.AUTH_CERT_NO,
            })
            var con = encr.jiami(pa, aeskey)
            wx.request({
                url: app.globalData.creditUrl + 'pdfToYxpt.do',
                data: encr.gwRequest(con),
                method: 'POST',
                success(res) {

                    if (res.data.head.H_STATUS == "1" && res.data.body != null) {
                        var jsonData = encr.aesDecrypt(res.data.body, aeskey)
                        that.setData({
                            authorImgBatchNo: jsonData.BatchID
                        })
                        resolve();

                    } else {
                        reject();
                    }
                },
            });
        })

    },
    getNowTime: function() {
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
    getNow: function() {
        let dateTime
        let yy = new Date().getFullYear()
        let mm = new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1
        let dd = new Date().getDate() < 10 ? ('0' + new Date().getDate()) : new Date().getDate()
        dateTime = yy + '年' + mm + '月' + dd + '日'
        return dateTime
    },
    submitLat() {
        var url = 'qzzx.do';
        var datasource
        var BatchID = that.data.ocrInfo.BatchID;
        var BatchID1 = that.data.ocrInfo.BatchID1;
        if (BatchID === '' || BatchID1 === '') {
            wx.hideLoading({
                success: (res) => {},
            })
            wx.showToast({
                title: '身份影像信息缺失',
                icon: 'none'
            })
            return;
        }
        that.getorgcode().then(res => {
          //个人
          if(that.data.authType == '1'){
            if (that.data.business_type == 1) {
                url = 'grlsQz.do';
                datasource = JSON.stringify({
                    custManagerOrgId: res.LIST[0].ORGCODE,
                    custManagerUserId: res.USERIDLIST[0].USERID,
                    authorDate: that.getNowTime(),
                    authorName: that.data.authInfo.AUTH_NAME,
                    authorCertType: that.data.AUTH_CERT_TYPE,
                    authorCertNo: that.data.authInfo.AUTH_CERT_NO,
                    authorType:that.data.auth_type_array[parseInt(that.data.authInfo.AUTH_TYPE)].id,  
                    // authorType: '0' + (parseInt(that.data.authInfo.AUTH_TYPE) + 1),
                    businessType: that.data.borrowerInfo.BORROW_TYPE.substr(0, 2), //业务品类
                    businessBelongOrg: '',
                    lendName: that.data.borrowerInfo.BORROW_NAME,
                    lendCertType: that.convertCertType(that.data.borrowerInfo.BORROW_CERT_TYPE),
                    lendCertNo: that.data.borrowerInfo.BORROW_CERT_NO,
                    authorImgBatchNoType: 'SYS043_BIZ01',
                    authorImgBatchNoCode: 'SYS043_BIZ01_101',
                    authorImgBatchNo: that.data.authorImgBatchNo,
                    idenImgBatchNoType: 'SYS043_BIZ01',
                    idenImgBatchNoCode: 'SYS043_BIZ01_101',
                    idenImgBatchNo: BatchID,
                    backidenImgBatchNoType: 'SYS043_BIZ01',
                    backidenImgBatchNoCode: 'SYS043_BIZ01_101',
                    backidenImgBatchNo: BatchID1,
                    faceImgBatchNoType: 'SYS043_BIZ01',
                    faceImgBatchNoCode: 'SYS043_BIZ01_101',
                    faceImgBatchNo: that.data.faceInfo.faceImgBatchNo,
                    requestSource: '',
                    busSerialNo: '',
                    extends1: '0' + that.data.business_type,
                    extends2: res.USERIDLIST[0].USERNAME,
                    extends3: that.getNowTime(),
                    extends4: '',
                    extends5: '',
                    extends6: '',
                    extends7: '',
                    extends8: ''
                })
            } else {
                let MainType = ''
                if (that.data.business_type == 3) {
                    MainType=that.data.auth_enterprise_type_array[parseInt(that.data.authInfo.AUTH_ENTERPRISE_TYPE)].id  
                    // if (parseInt(that.data.authInfo.AUTH_ENTERPRISE_TYPE) < 4) {
                    //     if (that.data.authInfo.AUTH_ENTERPRISE_TYPE == '2' || that.data.authInfo.AUTH_ENTERPRISE_TYPE == '3') {
                    //         MainType = '2'
                    //     } else {
                    //         MainType = '1'
                    //     }
                    // } else {
                    //     MainType = parseInt(that.data.authInfo.AUTH_ENTERPRISE_TYPE) - 1;
                    // }

                } else {
                    MainType=that.data.auth_type_array2[parseInt(that.data.authInfo.AUTH_TYPE)].id  

                    // MainType = ('0' +
                    //     (parseInt(that.data.authInfo.AUTH_TYPE) + 1))
                }

                datasource = JSON.stringify({
                    custManagerOrgId: res.LIST[0].ORGCODE,
                    custManagerUserId: res.USERIDLIST[0].USERID,
                    authorDate: that.getNowTime(),
                    authorName: that.data.authInfo.AUTH_NAME,
                    authorCertType: that.data.AUTH_CERT_TYPE,
                    authorCertNo: that.data.authInfo.AUTH_CERT_NO,
                    mobilePhone: that.data.authInfo.AUTH_PHONE,
                    authorMainType: MainType,
                    lendType: that.data.business_type == 3 ? 'ENT' : 'IND',
                    lendName: that.data.business_type == 3 ? that.data.borrowerInfo.ENTERPRISE_NAME : that.data.borrowerInfo.BORROW_NAME,
                    lendCertType: that.data.business_type == 3 ? '' : that.convertCertType(that.data.borrowerInfo.BORROW_CERT_TYPE),
                    lendCertNo: that.data.business_type == 3 ? '' : that.data.borrowerInfo.BORROW_CERT_NO,
                    lendCreditcode: that.data.borrowerInfo.CREDIT_CODE,
                    lendLoanCardNo: '',
                    lendOrgcode: that.data.borrowerInfo.ENTERPRISE_CODE,
                    authorImgBatchNoType: 'SYS043_BIZ01',
                    authorImgBatchNoCode: 'SYS043_BIZ01_101',
                    authorImgBatchNo: that.data.authorImgBatchNo,
                    idenImgBatchNoType: 'SYS043_BIZ01',
                    idenImgBatchNoCode: 'SYS043_BIZ01_101',
                    idenImgBatchNo: BatchID,
                    backidenImgBatchNoType: 'SYS043_BIZ01',
                    backidenImgBatchNoCode: 'SYS043_BIZ01_101',
                    backidenImgBatchNo: BatchID1,
                    faceImgBatchNoType: 'SYS043_BIZ01',
                    faceImgBatchNoCode: 'SYS043_BIZ01_101',
                    faceImgBatchNo: that.data.faceInfo.faceImgBatchNo,
                    requestSource: '',
                    busSerialNo: '',
                    extends1: '0' + that.data.business_type,
                    extends2: res.USERIDLIST[0].USERNAME,
                    extends3: that.data.business_type == 2 ? that.data.borrowerInfo.ENTERPRISE_NAME : '',
                    extends4:'',
                    extends5:'',
                    extends6: '',
                    extends7: '',
                    extends8: ''
                })
            }
          }else{//对公授权
            url='comEnterAdd.do';
            datasource = JSON.stringify({
              id: that.data.authInfo.ID,
              custManagerOrgId: res.LIST[0].ORGCODE, //客户经理所在机构号
              custManagerUserId: res.USERIDLIST[0].USERID, //客户经理员工号
              authorDate: that.getNowTime(), //授权日期
              authorName: that.data.authInfo.AUTH_ENTER_NAME, //授权企业名称
              lrName: that.data.authType == 2 ? that.data.authInfo.AUTH_NAME: that.data.authInfo.BOR_PER_NAME , //授权主体法人代表
              subjectCreditCode: that.data.authInfo.AUTH_ENTER_CODE, //授权主体社会统一码
              subjectOrgCodes: that.data.authInfo.AUTH_ENTER_ORGNO, //授权主体组织机构代码
              subjectLoanCardno: that.data.authInfo.SIGN_CODE, //授权主体中征码
              authorMainType: that.data.authType == '3'?
              that.data.auth_enterprise_type_array3[parseInt(that.data.borrowerInfo.BUSINESS_TYPE)-1].id : 
              that.data.auth_enterprise_type_array2[parseInt(that.data.borrowerInfo.BUSINESS_TYPE)-1].id , //授权主体类型
              authorBusType: '1',//授权企业类型
              lendType: that.data.authType == 2? 'ENT' : 'IND', //借款人类型（企业、个人）
              lendName: that.data.authType == '2'? that.data.borrowerInfo.ENTERPRISE_NAME : that.data.borrowerInfo.BORROW_NAME, //借款企业/自然人名称
              lendCertType: that.data.authType == '2' ? '' : that.convertCertType(that.data.borrowerInfo.BORROW_CERT_TYPE), //借款人证件类型(个人)
              lendCertNo: that.data.authType == '2' ? '' : that.data.borrowerInfo.BORROW_CERT_NO, //借款人证件号码（个人）
              lendCreditcode: that.data.borrowerInfo.CREDIT_CODE, //借款主体社会统一代码
              lendOrgcode: that.data.borrowerInfo.ENTERPRISE_CODE, //借款主体组织机构代码
              requestSource: '', //产品编号
              busSerialNo: '', //业务流水号
              authorloanType: '04', //授信业务类型
              inputUserName: res.USERIDLIST[0].USERNAME, //客户经理姓名
              lendBusType: '1', //借款企业类型
              opreateType: that.data.authInfo.SERIAL_NO == '' ? '1' : '2', //操作类型
              authorSerialNo: that.data.authInfo.SERIAL_NO, //授权码
              //授权书
              authorImgBatchNoType: 'SYS043_BIZ01', //业务类型
              authorImgBatchNoCode: 'SYS043_BIZ01_101', //文档分类编码
              authorImgBatchNo: that.data.authorImgBatchNo, //授权书批次号（影像号）
              //身份证正面
              idenImgBatchNoType: 'SYS043_BIZ01', //业务类型
              idenImgBatchNoCode: 'SYS043_BIZ01_101', //文档分类编码
              idenImgBatchNo: BatchID, //身份证影像件批次号
              //身份证反面
              extends1: 'SYS043_BIZ01', //业务类型
              extends2: 'SYS043_BIZ01_101', //文档分类编码
              extends3: BatchID1,
              //人脸
              faceimgbatchnotype:'SYS043_BIZ01', //人脸识别图像业务类型 
              faceimgbatchnocode: 'SYS043_BIZ01_101', //人脸识别图像文档分类编码
              faceimgbatchno: that.data.faceInfo.faceImgBatchNo, //人脸识别图像批次号
              //工商营业执照
              busLicImgBatchNoType: 'SYS050_BIZ01', //工商营业执照影像业务类型
              busLicImgBatchNoCode: 'SYS050_BIZ01_101',//工商营业执照影像文档分类编码
              busLicImgBatchNo: that.data.authInfo.BUSBATCHNO, //工商营业执照影像批次号
            }) 
          }
            wx.request({
                url: app.globalData.creditUrl + url,
                data: encr.gwRequest(encr.jiami(datasource, aeskey)),
                method: 'POST',
                success(res) {

                   

                    if (res.data.head.H_STATUS != '1') {
                        wx.hideLoading({
                            success: (res) => {
                              that.setData({
                                submitCount : 0
                              });
                            },
                        })
                        wx.showToast({
                            title: res.data.head.H_MSG,
                            icon: 'none'
                        })
                        return;
                    }
                    let json1 = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文
                    //个人授权返回ERROR_CODE字段、对公授权返回result_code字段
                    if (res.data.body == undefined || Object.getOwnPropertyNames(res.data.body) == 0 || (that.data.authType == '1' ? json1.ERROR_CODE != '0000' : json1.result_code != '0000')) {
                        wx.hideLoading({
                            success: (res) => {
                              that.setData({
                                submitCount : 0
                              });
                            },
                        })
                        wx.showToast({
                            title: res.data.head.H_MSG,
                            icon: 'none'
                        })
                        return;
                    }
                    var dataJsons = JSON.stringify({
                        id: that.data.authInfo.ID,
                        status: '5',
                        auth_time: that.getNowTime(),
                        type: that.data.authType != 1 ? '1' : 0,
                    })
                    var custnameTwos = encr.jiami(dataJsons, aeskey) //3段加密
                    wx.request({
                        url: app.globalData.creditUrl + 'updateAuthStatus.do',
                        data: encr.gwRequest(custnameTwos),
                        method: 'POST',
                        success(res) {
                            that.setData({
                              submitLat : 0
                            });
                            wx.hideLoading({
                                success: (res) => {},
                            })
                            $Toast({
                                content: "授权信息验证完毕",
                                type: 'success',
                                duration: 3,
                                mask: true,
                            });
                            setTimeout(res => {
                                wx.removeStorageSync('book1')
                                wx.removeStorageSync('book2')
                                wx.switchTab({
                                    url: '/pages/shop/index2',
                                })
                            }, 2000)

                        },
                    });

                }
            })
        }).catch(err => {
            wx.hideLoading({
                success: (res) => {},
            })
            $Toast({
                content: "查询客户经理信息失败",
                type: 'warning',
                duration: 2,
                mask: false,
            });
        })
    },
    getorgcode() {
        return new Promise((resolve, reject) => {
            //查询客户经理
            let dataJson = JSON.stringify({
                openId: that.data.borrowerInfo.OPENID,
            });
            var custnameTwo = encr.jiami(dataJson, aeskey)
            wx.request({
                url: app.globalData.creditUrl + 'getCustomer.do',
                data: encr.gwRequest(custnameTwo),
                method: 'POST',
                header: {
                    'content-type': 'application/json',
                },
                success(res) {
                    if (res.data.head.H_STATUS == '1') {
                        var jsonData = encr.aesDecrypt(res.data.body, aeskey)
                        if (jsonData.ID_CARD == "" || jsonData.ID_CARD == undefined) {
                            reject();
                            return;
                        }
                        let m = JSON.stringify({
                            idcard: jsonData.ID_CARD
                        })
                        let l = encr.jiami(m, aeskey)

                        wx.request({
                            url: app.globalData.creditUrl + 'getorgcode.do',
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

                    }else{
                        wx.hideLoading({
                          success: (res) => {},
                        })
                        wx.showToast({
                          title: '身份信息查询失败',
                          icon:'none'
                        })
                    }

                },
                fail(err) {}
            })

        })
    },
    onLoad(e) {
        that = this;

        var authInfos = JSON.parse(e.authInfo)
        var a = authInfos.QR_CODE_DATE
        var s = a.substring(0, 4) + '年' + a.substring(4, 6) + '月' + a.substring(6) + '日'
        authInfos.QR_CODE_DATE = s;

        that.setData({
            preffixUrl: app.globalData.JSBURL,
            authInfo: authInfos,
            authType: e.type
        });
        that.getBorrowInfo(authInfos.BUSINESS_ID).then(res=>{
            that.getAuthInfo()

        })
        that.setData({
            AUTH_CERT_TYPE: that.convertCertType(that.data.authInfo.AUTH_CERT_TYPE)
        })

    },
    getAuthInfo() {
        var dataJsons = JSON.stringify({
            id: that.data.authInfo.ID,
            type: that.data.authType != 1 ? 1 : '',
        })
        var custnameTwos = encr.jiami(dataJsons, aeskey) //3段加密
        wx.request({
            url: app.globalData.creditUrl + 'findAuthInfoById.do',
            data: encr.gwRequest(custnameTwos),
            method: 'POST',
            success: (res => {
                if (res.data.head.H_STATUS === "1") {
                    let jsonData = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文
                    if(jsonData.LIST==undefined||jsonData.LIST.length==0){
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
                    if(data.REMARK1==undefined||data.REMARK1==''||data.REMARK3==undefined||data.REMARK3==''){
                        wx.showModal({
                            title: '提示',
                            content: '采集信息已失效，请重新录入',
                            showCancel: true,
                            success(res) {
                                if (res.confirm) {
                                    var dataJsons = JSON.stringify({
                                        id: that.data.authInfo.ID,
                                        status: '0',
                                        auth_time: that.getNowTime()
                                    })
                                    var custnameTwos = encr.jiami(dataJsons, aeskey) //3段加密
                                    wx.request({
                                        url: app.globalData.creditUrl + 'updateAuthStatus.do',
                                        data: encr.gwRequest(custnameTwos),
                                        method: 'POST',
                                        success(res) {
                
                                            wx.redirectTo({
                                                url: '../authConfirm/index?scene=' + that.data.authInfo.ID + '&type=' + that.data.authType
                                              })
                
                                        },
                                    });
                                    
                                } 
                            },
                        });
                        return;
                    }
                                 
                    that.setData({
                        ocrInfo: JSON.parse(data.REMARK1),
                        faceInfo: JSON.parse(data.REMARK3)
                    });
                    if(that.data.authType == '1'){
                      that.createPDF();
                    }else{
                      that.createPDF2();
                    }

                }

            })
        })
    },
    getBorrowInfo(id) {
        return new Promise((resolve,reject)=>{
            if (id == undefined) {
                resolve()
                return;
            }
            var dataJsons = JSON.stringify({
                id: id,
            })
            var custnameTwos = encr.jiami(dataJsons, aeskey) //3段加密
            wx.request({
                url: app.globalData.creditUrl + 'getBizVoById.do',
                data: encr.gwRequest(custnameTwos),
                method: 'POST',
                success: (res => {
                    if (res.data.head.H_STATUS === "1") {
                        let jsonData = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文
                        var data2 = jsonData.LIST;
                        that.setData({
                            borrowerInfo: data2[0],
                            business_type: data2[0].BUSINESS_TYPE
                        });
                        resolve()

                    }else{
                        reject()
                    }
                })
            })
        })
       

    },
    convertCertType(type) {
        let AUTH_CERT_TYPE = '10'

        switch (type) {
            case '0':
                AUTH_CERT_TYPE = '10'
                break;
            case '1':
                AUTH_CERT_TYPE = '1'
                break;
            case '2':
                AUTH_CERT_TYPE = '2'
                break;
            case '3':
                AUTH_CERT_TYPE = '20'
                break;
            case '4':
                AUTH_CERT_TYPE = '20'
                break;
            case '5':
                AUTH_CERT_TYPE = '5'
                break;
            case '6':
                AUTH_CERT_TYPE = '6'
                break;
            case '7':
                AUTH_CERT_TYPE = '10'
                break;
            case '8':
                AUTH_CERT_TYPE = '8'
                break;
            case '9':
                AUTH_CERT_TYPE = '9'
                break;
            case '10':
                AUTH_CERT_TYPE = 'A'
                break;
            case '11':
                AUTH_CERT_TYPE = 'B'
                break;
            case '12':
                AUTH_CERT_TYPE = 'C'
                break;
            case '13':
                AUTH_CERT_TYPE = 'X'
                break;
            default:
                AUTH_CERT_TYPE = '10'
                break;
        }
        return AUTH_CERT_TYPE;
    },

    showDetail(e) {
        let id = e.currentTarget.dataset.id;
        if (id == 1) {
            wx.setStorageSync('book1', true)
            if (that.data.pdfFile === '') {
                wx.showToast({
                    title: '授权书打开失败，请稍后再试',
                    icon: 'none'
                })
                return;
            }
            wx.openDocument({
                filePath: that.data.pdfFile,
                success: function(res) {
                    console.log('打开文档成功')
                },
                fail: function(res) {
                    console.log('打开文档失败')
                },
            })
            return;
        }
        if (id == 2) {
            wx.setStorageSync('book2', true)
        }
        if (id == 3) {
            wx.setStorageSync('book1', true)
            if (that.data.pdfFile === '') {
                wx.showToast({
                    title: '授权书打开失败，请稍后再试',
                    icon: 'none'
                })
                return;
            }
            wx.openDocument({
                filePath: that.data.pdfFile,
                success: function(res) {
                    console.log('打开文档成功')
                },
                fail: function(res) {
                    console.log('打开文档失败')
                },
            })
            return;
        }
        if (id == 4) {
            wx.setStorageSync('book1', true)
            if (that.data.pdfFile === '') {
                wx.showToast({
                    title: '授权书打开失败，请稍后再试',
                    icon: 'none'
                })
                return;
            }
            wx.openDocument({
                filePath: that.data.pdfFile,
                success: function(res) {
                    console.log('打开文档成功')
                },
                fail: function(res) {
                    console.log('打开文档失败')
                },
            })
            return;
        }
        wx.navigateTo({
            url: '../authConfirm/book?data=' + id + '&id=' + that.data.authInfo.ID + "&type=" + that.data.authType
        });
    },
    handleChange(e) {
        that.setData({
            isCheck: e.detail.value.length == 0 ? false : true
        })
    }

});