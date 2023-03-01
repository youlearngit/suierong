import util from '../utils/util';
import requestP from '../utils/requsetP';
import requestYT from '../api/requestYT';
import log from '../log';
import User from './user';
var app = getApp();
/**
 * get poster params
 *  (*2) 生成2倍像素图
 * @param {*} width  background width
 * @param {*} height background height
 * @param {*} ratio
 */

/**
 * exchange my beans
 */
async function exchangeBeans(num) {
  let options = {
    url: 'jsyh/sydtq.do',
    data: JSON.stringify({
      openid: wx.getStorageSync('openid'),
      num,
    }),
  };
  const res = await requestYT(options);
  console.log(res);
  if (res.STATUS === '1' && res.flag) {
    console.log('jsyh/sydtq.do', res);
    return JSON.parse(res.flag);
  } else {
    return Promise.reject(new Error(res.MSG));
  }
}
//获取法人信息
const getFrInfo = function (entName) {
  let options = {
    url: 'fb/selectFrName.do',
    data: JSON.stringify({
      entName: entName,
    }),
  };
  return requestYT(options).then((res) => {
    // return res;
    if (res.STATUS === '1') {
      return res;
    } else {
      return Promise.reject(new Error(res.MSG));
      // wx.showToast({
      //   title: '法人信息获取失败',
      //   icon: 'none',
      //   duration: 1500,
      //   mask: false,
      // });
    }
  });
};
// 解密start
const userInfoDecode = function (needDecode) {
  let options = {
    url: 'cz/userInfoDecode.do',
    data: JSON.stringify({
      needDecode: needDecode,
    }),
  };
  return requestYT(options).then((res) => {
    return res;
 });
};

const getSystemInfo2 = (width, height, scal) => {
  return new Promise((resolve, reject) => {
    let unit = scal;
    let result = {};
    wx.getSystemInfo({
      success: (res) => {
        if (res.system.indexOf('Android') >= 0) {
          unit *= res.screenWidth / 411;
        } else {
          unit *= res.screenWidth / 375;
        }
        result.systemInfo = res;
        result.unit = unit;
        result.posterBoxWidth = unit * width;
        result.posterBoxHeight = unit * height;
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};

const getSessionInfo = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      timeout: 10000,
      success: (res) => {
        wx.request({
          url: app.globalData.URL + 'getwechatid',
          data: {
            js_code: res.code,
            isProxy: false,
          },
          header: {
            'content-type': 'application/json', // 默认值
            key: Date.parse(new Date()).toString().substring(0, 6),
          },
          success(res) {
            if (typeof res.data != 'undefined') {
              wx.setStorageSync('openid', res.data.openid);
              wx.setStorageSync('key', res.data.key); //加解密
              wx.setStorageSync('sessionid', res.data.session_key);
              resolve();
            } else {
              resolve();
            }
          },
        });
      },
      fail: (err) => {
        reject(err);
      },
      complete: () => {},
    });
  });
};

const getSystemInfo = (width, height, ratio) => {
  return new Promise((resolve, reject) => {
    let unit = 0;
    let result = {};
    wx.getSystemInfo({
      success: (res) => {
        if (res.system.indexOf('Android') >= 0) {
          unit = res.screenWidth / 411;
        } else {
          unit = res.screenWidth / 375;
        }
        result.systemInfo = res;
        result.unit = unit;
        result.posterBoxWidth = unit * width * ratio;
        result.posterBoxHeight = unit * height * ratio;
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};

const downloadFile = (filePath) => {
  return new Promise((resolve, reject) => {
    wx.downloadFile({
      url: app.globalData.URL + 'adviser/getAvatar?picId=' + encodeURIComponent(filePath),
      success(res) {
        if (res.errMsg === 'downloadFile:ok') {
          resolve(res.tempFilePath);
        } else {
          wx.downloadFile({
            url: app.globalData.URL + 'adviser/getAvatar?picId=' + encodeURIComponent(filePath),
            success(res) {
              if (res.errMsg === 'downloadFile:ok') {
                resolve(res.tempFilePath);
              } else {
                reject(res);
              }
            },
            fail: function (res) {
              reject('图片下载失败:' + res);
            },
          });
        }
      },
      fail: function (res) {
        wx.downloadFile({
          url: app.globalData.URL + 'adviser/getAvatar?picId=' + encodeURIComponent(filePath),
          success(res) {
            if (res.errMsg === 'downloadFile:ok') {
              resolve(res.tempFilePath);
            } else {
              reject(res);
            }
          },
          fail: function (res) {
            reject('图片下载失败:' + res);
          },
        });
        // reject("图片下载失败:" + res);
      },
    });
  });
};

/**
 * 跳转小程序
 * @param {string} appId
 * @param {string} path
 * @param {object} extraData
 */
const skipToMiniProgram = (appId, path, extraData) => {
  return new Promise((resolve, reject) =>
    wx.navigateToMiniProgram({
      appId: appId,
      path: path,
      extraData: extraData,
      envVersion: 'release',
      success: resolve,
      fail: reject,
    }),
  );
};
/**
 * 跳转h5
 * @param {string} skipUrl
 */
const skipToWebView = (skipUrl) => {
  wx.navigateTo({
    url: '/pages/showWeb/showWeb?skipUrl=' + encodeURIComponent(skipUrl),
  });
};

/**
 * save image
 * @param {*} imagePath
 */
const saveImage = (imagePath) => {
  return new Promise((resolve, reject) => {
    //看看是否有保存图片的权限，没有就去打开权限
    wx.getSetting({
      success: (res) => {
        // 照片是否授权
        if (typeof res.authSetting['scope.writePhotosAlbum'] != 'undefined') {
          // 授权过
          if (res.authSetting['scope.writePhotosAlbum']) {
            // 确认授权
            resolve(save(imagePath));
          } else {
            // 拒绝授权
            wx.openSetting({
              success: function (data) {
                if (data.authSetting['scope.writePhotosAlbum'] == true) {
                  wx.showToast({
                    title: '授权成功',
                    icon: 'none',
                  });
                  resolve(save(imagePath));
                } else {
                  wx.showToast({
                    title: '授权失败',
                    icon: 'none',
                  });
                }
              },
            });
          }
        } else {
          // 未授权
          resolve(save(imagePath));
        }
      },
      fail: function (err) {
        reject(err);
        console.error(err);
      },
    });
  });
};

/**
 * savePhoto
 * @param {*} imagePath
 */
const save = (imagePath) => {
  wx.showToast({
    title: '保存中',
    icon: 'loading',
    mask: true,
    duration: 20000,
  });
  return new Promise((resolve, reject) => {
    wx.saveImageToPhotosAlbum({
      filePath: imagePath,
      success(res) {
        // save success
        if ((res.errMsg = 'saveImageToPhotosAlbum:ok')) {
          resolve();
          wx.hideToast();
          wx.showModal({
            content: '图片已保存到相册，赶紧晒一下吧~',
            showCancel: false,
            confirmText: '好的',
            success: function (res) {
              wx.hideToast();
            },
          });
        } else reject();
      },
      fail(err) {
        // cancel save or auth deny
        reject(err);
        wx.hideToast();
        if ((err.errMsg = 'saveImageToPhotosAlbum:fail auth deny')) {
          wx.showModal({
            content: '请您授权保存图片到相册',
            showCancel: false,
            confirmText: '好的',
            confirmColor: '#333',
            success: function (res) {
              wx.hideToast();
            },
          });
        }
      },
    });
  });
};

/**
 * shareApp
 * @param {} imagePath
 */
const shareApp = (imagePath = '', params = '', title = '', url = '') => {
  // 获取加载的页面
  let pages = getCurrentPages();
  // 获取当前页面的对象
  let currentPage = pages[pages.length - 1];
  // 当前页面url
  url = url || currentPage.route;
  let share_id = wx.getStorageSync('openid');
  var path = url + '?open_id=' + share_id + '&share_date=' + util.formatTime(new Date()) + params;
  return {
    title: title,
    path: path,
    imageUrl: imagePath,
    success(res) {},
    fail(err) {},
  };
};

/**
 * 生产小程序吗
 * @param {} params
 */
const generateMiniCode = (page, params = '', scene) => {
  console.log(scene);
  return new Promise(function (resolve, reject) {
    wx.request({
      url: 'https://wxapp.jsbchina.cn:7080/rhedt/generateCode',
      method: 'post',
      data: {
        page: page,
        scene: scene ? scene : app.globalData.int_id + 'a' + util.formatTime(new Date()) + 'a' + params,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded', // 默认值
        key: Date.parse(new Date()).toString().substring(0, 6),
      },
      success(res) {
        if (res.data != '' && res.data != null) {
          //把二维码图片保存到本地
          wx.downloadFile({
            url: 'https://wxapp.jsbchina.cn:7080/rhedt//getqrcode?file=' + decodeURIComponent(res.data),
            success: function (res) {
              if (res.statusCode === 200) {
                resolve(res.tempFilePath);
              } else {
                reject('小程序码生成失败');
              }
            },
          });
        }
      },
      fail() {
        reject('网络异常');
      },
    });
  });
};

/**
 * 致电
 */
const call = (phone, name) => {
  wx.showActionSheet({
    itemList: ['呼叫', '复制电话', '添加到手机通讯录'],
    success: function (res) {
      if (!res.cancel) {
        let index = res.tapIndex;
        switch (index) {
          case 0:
            wx.makePhoneCall({
              phoneNumber: phone,
            });
            break;
          case 1:
            wx.setClipboardData({
              data: phone,
              success: function (res) {
                wx.getClipboardData({
                  success: function (res) {
                    wx.showToast({
                      title: '复制成功',
                    });
                  },
                });
              },
            });
            break;
          case 2:
            wx.addPhoneContact({
              firstName: name, //名字
              mobilePhoneNumber: phone, //手机号
            });
            break;
          default:
            break;
        }
      }
    },
  });
};

/**
 * 解密手机号
 * @param {*} encryptedData
 * @param {*} iv
 */
const decryptData = (encryptedData, iv) => {
  return new Promise((resolve, reject) => {
    wx.checkSession({
      success() {
        return requestP({
          url: 'https://wxapp.jsbchina.cn:7080/jsb/decryptdata',
          data: {
            encryptDataB64: encryptedData,
            sessionKeyB64: wx.getStorageSync('sessionid').substring(4),
            ivB64: iv,
          },
          header: {
            'Content-Type': 'application/json', // 默认值
            key: Date.parse(new Date()).toString().substring(0, 6),
          },
        })
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      },
      fail() {
        return getSessionInfo().then(() => {
          return requestP({
            url: 'https://wxapp.jsbchina.cn:7080/jsb/decryptdata',
            data: {
              encryptDataB64: encryptedData,
              sessionKeyB64: wx.getStorageSync('sessionid').substring(4),
              ivB64: iv,
            },
            header: {
              'Content-Type': 'application/json', // 默认值
              key: Date.parse(new Date()).toString().substring(0, 6),
            },
          })
            .then((res) => {
              resolve(res);
            })
            .catch((err) => {
              reject(err);
            });
        });
      },
    });
  });
};

/**
 * 获取手机号
 * @param {*} e
 */
const getPhoneNumber = (e) => {
  let phoneNumber = '';
  if (e.detail.errMsg == 'getPhoneNumber:fail user deny' || e.detail.errMsg == 'getPhoneNumber:fail:user deny') {
    // wx.showModal({
    //   title: '提示',
    //   content: '您点击了拒绝授权,无法获取该服务',
    //   showCancel: false,
    //   confirmText: '返回授权',
    //   success: (result) => {
    //     if (result.confirm) {

    //     }
    //   },
    //   fail: () => {},
    //   complete: () => {},
    // });
    return Promise.reject(new Error('您点击了拒绝授权,无法获取该服务'));

  } else if (
    e.detail.errMsg == 'getPhoneNumber:fail user cancel' ||
    e.detail.errMsg == 'getPhoneNumber:fail:user cancel'
  ) {
    return Promise.reject(new Error(e.detail.errMsg));
  } else {
    wx.showLoading({
      title: '获取中...',
    });
    return decryptData(e.detail.encryptedData, e.detail.iv)
      .then((res) => {
        if (res && res.phoneNumber) {
          wx.hideLoading();
          phoneNumber = res.phoneNumber;
          return addPhone(res.phoneNumber);
        } else {
          return Promise.reject(new Error('解密手机号信息失败' + res));
        }
      })
      .then(() => {
        return phoneNumber;
      });
  }
};

/**
 * 添加手机号
 * @param {*} phone
 */
const addPhone = (phone) => {
  let options = {
    url: 'phoneMsg/addWxPhone.do',
    data: JSON.stringify({
      phone: phone,
      openid: wx.getStorageSync('openid'),
    }),
  };
  return requestYT(options).then((res) => {
    console.log('addWxPhone.do', res);
    if (res.STATUS === '1') {
      let _res = JSON.parse(res.resultVo);
      _res.phone = phone;
      if (_res.code === '0000') {
        return _res.msg;
      } else {
        return Promise.reject(_res);
      }
    } else {
      return Promise.reject('addWxPhoneFail');
    }
  });
};

const sendCode = function (phone, type) {
  let options = {
    url: 'phoneMsg/getCode.do',
    data: JSON.stringify({
      openid: wx.getStorageSync('openid'),
      phone: phone,
      type: type,
    }),
  };
  return requestYT(options).then((res) => {
    if (res.STATUS === '1') {
      let _res = JSON.parse(res.resultVo);
      if (_res.code === 1) {
        return _res;
      } else {
        return Promise.reject(_res.msg);
      }
    } else {
      return Promise.reject('getOpenIdByIDFail');
    }
  });
};
const sendCode1 = function (phone) {
    let options = {
      url: 'ddt/getPhoneCode.do',
      data: JSON.stringify({
        phone: phone
      }),
    };
    console.log(options.data)
    return requestYT(options).then((res) => {
      console.log(res)
      if (res.STATUS === '1') {
          return res;
      } else {
        return Promise.reject(res.msg);
      }
    });
  }; 
const checkCode = async (tel, code) => {
  const options = {
    url: '/sui/checkSuiCode.do',
    data: JSON.stringify({
      int_id: wx.getStorageSync('openid'),
      tel,
      code,
    }),
  };
  const res = await requestYT(options);
  if (res.STATUS === '1') {
    return res;
  }
  return Promise.reject(new Error('something bad happened'));
};
const formatNumber = (n) => {
  n = n.toString();
  return n[1] ? n : `0${n}`;
};

const formatTime = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // return [year, month, day].map(formatNumber).join('-') +'/'+ [hour, minute, second].map(formatNumber).join(':')
  return [year, month, day].map(formatNumber).join('-');
};

const getProducts = function () {
  let options = {
    url: 'jsyh/getProducts.do',
    data: JSON.stringify({}),
  };
  return requestYT(options).then((res) => {
    if (res.STATUS === '1' && res.products) {
      return JSON.parse(res.products);
    } else {
      return Promise.reject('unGetProducts');
    }
  });
};

const getProductConfig = function (empNo) {
  let options = {
    url: 'jsyh/getProductConfig.do',
    data: JSON.stringify({
      empNo: empNo,
    }),
  };
  return requestYT(options).then((res) => {
    if (res.STATUS === '1' && res.productConfig) {
      return JSON.parse(res.productConfig);
    } else {
      return Promise.reject('unGetProductConfig');
    }
  });
};

const getImageBatchId = async (name, idCardNumber) => {
  return new Promise((resolve, reject) => {
    wx.checkIsSupportFacialRecognition({
      success(res) {
        wx.startFacialRecognitionVerify({
          name,
          idCardNumber,
          checkAliveType: 2,
          success(res) {},
          fail(err) {},
          complete: async (res) => {
            console.log('complete', res);
            log.setFilterMsg(`vface${name}`);
            log.info('人脸识别结果' + JSON.stringify(res));
            if (res.errCode == 0) {
              try {
                if (!res.verifyResult) {
                  reject(new Error('人脸识别图像异常!'));
                }
                // 获取影像批次号
                let options = {
                  url: 'sui/suiFace.do',
                  data: JSON.stringify({
                    verify_result: res.verifyResult,
                    idcard: idCardNumber,
                  }),
                };
                const res1 = await requestYT(options);
                console.log('sui/suiFace.do', res1);
                if (res1.STATUS === '1' && res1.result_code === '0000' && res1.BatchID) {
                  await User.addFaceInfo('0', res.errCode + res.errMsg, res1.BatchID);
                  resolve(res1.BatchID);
                } else {
                  reject(new Error(res1.result_msg));
                }
              } catch (error) {
                reject(new Error(error.message || error));
              }
            } else {
              reject(new Error(`${res.errCode}: ${res.errMsg}`));
            }
          },
        });
      },
      fail(err) {
        reject(new Error('您的设备不支持人脸识别!'));
      },
    });
  });
};
const getImageAndBatchId = async (name, idCardNumber) => {
  return new Promise((resolve, reject) => {
    wx.checkIsSupportFacialRecognition({
      success(res) {
        wx.startFacialRecognitionVerify({
          name,
          idCardNumber,
          checkAliveType: 2,
          success(res) {},
          fail(err) {},
          complete: async (res) => {
            console.log('complete', res);
            log.setFilterMsg(`vface${name}`);
            log.info('人脸识别结果' + JSON.stringify(res));
            if (res.errCode == 0) {
              try {
                if (!res.verifyResult) {
                  reject(new Error('人脸识别图像异常!'));
                }
                // 获取影像批次号
                let options = {
                  url: 'sui/suiFace.do',
                  data: JSON.stringify({
                    verify_result: res.verifyResult,
                    idcard: idCardNumber,
                  }),
                };
                const res1 = await requestYT(options);
                console.log('sui/suiFace.do', res1);
                if (res1.STATUS === '1' && res1.result_code === '0000' && res1.BatchID) {
                  await User.addFaceInfo('0', res.errCode + res.errMsg, res1.BatchID);
                  resolve({
                    batchID:res1.BatchID,
                    image:res1.picBase64
                  });
                } else {
                  reject(new Error(res1.result_msg));
                }
              } catch (error) {
                reject(new Error(error.message || error));
              }
            } else {
              reject(new Error(`${res.errCode}: ${res.errMsg}`));
            }
          },
        });
      },
      fail(err) {
        reject(new Error('您的设备不支持人脸识别!'));
      },
    });
  });
};
const formateName = (name) => {
  let str = '';
  for (let i = 0; i < name.length - 2; i++) {
    str += '*';
  }
  return name
    ? name.length == '2'
      ? '*' + name.substring(1)
      : name.substring(0, 1) + str + name.substring(name.length - 1)
    : '';
};
const formatePhone = (name) => {
  return name ? name.substring(0, 3) + '****' + name.substring(9) : '';
};

const formateIdCard = (name) => {
  return name ? name.substring(0, 1) + '****************' + name.substring(name.length - 1) : '';
};

const getLocation = function () {
  return new Promise((resolve, reject) => {
    wx.getLocation({
      type: 'wgs84',
      altitude: false,
      success: (res) => {
        return requestP({
          url:
            'https://restapi.amap.com/v3/geocode/regeo?location=' +
            res.longitude +
            ',' +
            res.latitude +
            '&subdistrict=1&key=f50fb5855088b5dee3b232e3971542f3',
          method: 'get',
        })
          .then((res) => {
            if (
              res.info === 'OK' &&
              typeof res.regeocode.addressComponent.adcode === 'string'
            ) {
              app.globalData.showChatComponent = true;
            }
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      },
      fail: () => {},
      complete: () => {},
    });
  });
};

async function getDistarct(code, subdistrict = 1) {
  const res = await requestP({
    url: `https://restapi.amap.com/v3/config/district?keywords=${code}&subdistrict=${subdistrict}&key=f50fb5855088b5dee3b232e3971542f3`,
    method: 'get',
  });
  if (res.status === '1' && res.districts.length > 0) {
    return res;
  } else {
    return Promise.reject('未查询到相关地区：' + code);
  }
}
const login = async () => {
  try {
    const hasWXUserInfo = await User.ifAuthUserInfo();
    if (hasWXUserInfo) {
      await User.getIdentityInfo();
      return true;
    } else {
      return Promise.reject(new Error('unLogin'));
    }
  } catch (error) {
    if (error === 'unSelectIdcard') {
      wx.showModal({
        title: '提示',
        content: '请先进行身份证拍照认证',
        showCancel: true, //是否显示取消按钮
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/sub1/pages/auth/index',
            });
          }
        },
      });
    }
  }
};


const getWeChatFaceResult = function (verifyResult) {
  return new Promise((resolve, reject) => {



    let options = {
      url: 'sui/weChatFaceResult.do',
      data: JSON.stringify({
        verify_result: verifyResult
      }),
    };
    requestYT(options).then((res1) => {
      console.log(res1)
      if (res1.STATUS === '1' && res1.result_code === '0000') {
        let resp = JSON.parse(res1.result_msg)
  
        if (resp.errcode == 0) {
          //识别成功
          resolve();
        } else {
          reject()
        }
  
      } else {
        reject(new Error(res1.result_msg));
      }
    });

 
  });
};

//光伏贷提交接口
const greenPvloan = async(data) => {
    const {
        customerName,
        socialCreditCode,
        contactPerson,
        contactWay,
        itemBelongCity,
        itemFinancing,
        itemType,
        enterpriseType,
        itemInvestType,
        openId,
    } = data;
    let options = {
        url: 'green/pvloan.do',
        data: {
            customerName,
            socialCreditCode,
            contactPerson,
            contactWay,
            itemBelongCity,
            itemFinancing,
            itemType,
            enterpriseType,
            itemInvestType,
            openId
        },
    };
    const res = await requestYT(options);
    return res;
};
//光伏贷查询省市区县
const talentSelectLocation = async(data) => {
    const { id } = data;
    let options = {
        url: 'talent/selectLocation.do',
        data: { id },
    };
    const res = await requestYT(options);
    return res
}

//绿色信贷智能认定-获取各字段选择项
const greenGetField = async(data) => {
    const { parentOption,fieldName, keyword } = data;
    let options = {
        // url: 'green/getField.do',
        url:'greenfinance/SmartOptionIdentify.do',
        data: {
          parentOption,
            fieldName,
            keyword
        }
    }

    // console.log(options)
    const res = await requestYT(options);
    return res
}

//绿色信贷智能认定-获取各字段选择项
const greenCogn = async(data) => {
    const { variety, projectName, varietyIdentification, levelOneIdentification, levelFour, levelFourIdentification } = data;
    let options = {
        // url: 'green/cogn.do',
        url: 'greenfinance/SmartOptionIdentifySubmit.do',
        data: {
            variety,
            projectName,
            varietyIdentification,
            levelOneIdentification,
            levelFour,
            levelFourIdentification
        }
    }
    const res = await requestYT(options);
    return res
}

//光伏贷查询历史信息
const historyQuery = async(data) => {
    const { openId } = data;
    let options = {
        url: 'green/historyQuery.do',
        data: {
            openId,
        }
    }
    const res = await requestYT(options);
    return res
}

const saveProcess = function (data) {
  let options = {
    url: 'video/saveProcess.do',
    data: {
      videoId : data.videoId,
      openId: wx.getStorageSync('openid'),
      playProcess: data.playProcess.toString()
    },
    // data: JSON.stringify({
    //   videoId : data.videoId,
    //   openId: wx.getStorageSync('openid'),
    //   playProcess: data.playProcess
    // }),
  };
  console.log(options.data,'video/saveProcess.do入参')
  return requestYT(options).then((res) => {
    if (res.STATUS === '1' ) {
      return res;
    } else {
      return Promise.reject(MSG || 'err!');
    }
  });
};
const getProcess = function () {
  let options = {
    url: 'video/getProcess.do',
    data: JSON.stringify({
      openId: wx.getStorageSync('openid'),
    }),
  };
  return requestYT(options).then((res) => {
    console.log(res,'getProcess')
    if (res.STATUS === '1' ) {
      return res;
    } else {
      return Promise.reject(MSG || 'err!');
    }
  });
};
module.exports = {
  getSystemInfo: getSystemInfo,
  getSystemInfo2: getSystemInfo2,
  saveImage: saveImage,
  shareApp: shareApp,
  generateMiniCode: generateMiniCode,
  skipToWebView: skipToWebView,
  skipToMiniProgram,
  call,
  decryptData,
  downloadFile: downloadFile,
  getSessionInfo: getSessionInfo,
  getPhoneNumber,
  formateName,
  formatePhone,
  formateIdCard,
  sendCode,
  sendCode1,
  getProductConfig,
  getProducts,
  getLocation,
  getImageBatchId,
  getImageAndBatchId,
  exchangeBeans,
  userInfoDecode,
  checkCode,
  addPhone,
  getDistarct,
  login,
  getWeChatFaceResult,
    getFrInfo,
    greenPvloan,
    talentSelectLocation,
    greenGetField,
    greenCogn,
    historyQuery,
    saveProcess,
    getProcess
};
