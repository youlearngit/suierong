import requestP from './requsetP';
import api from './api';
import util from './util';
import requestYT from '../api/requestYT';

const app = getApp();

export default class User {
  static async getOpenIdByID(INT_ID) {
    let options = {
      url: 'customer/getopen_id2.do',
      data: JSON.stringify({
        INT_ID,
      }),
    };
    const res = await requestYT(options);
    if (res.STATUS === '1' && res.resultVo.length > 0) {
      console.log('getopen_id2', res.resultVo[0].OPEN_ID);
      return res.resultVo[0].OPEN_ID;
    } else {
      return Promise.reject('unGetOpenIdByID');
    }
  }
  static async addWXUserInfo(userInfo) {
    var data = JSON.stringify({
      STRING_OPEN_ID: wx.getStorageSync('openid'),
      STRING_NICK_NAME: userInfo.nickName,
      STRING_COUNTRY: userInfo.country,
      STRING_PROVINCE: userInfo.province,
      STRING_CITY: userInfo.city,
      STRING_GENDER: userInfo.gender,
      STRING_PHOTO: userInfo.avatarUrl,
    });
    let options = {
      url: 'customer/addcustomer.do',
      data: JSON.stringify({
        data,
      }),
      ifEncrypt: false,
    };
    const res = await requestYT(options);

    //console.log('addcustomer.do', res);
    if (res.STATUS === '1' && res.resultVo.code === 1) {
      return res;
    }
    return Promise.reject(new Error(res.resultVo.msg));
  }

  static async addCustomer(name, idCard, tel, code, dept) {
    let options = {
      url: 'sui/addCust.do',
      data: JSON.stringify({
        open_id: wx.getStorageSync('openid'),
        int_id: app.globalData.int_id + '',
        name,
        id_card: idCard,
        tel,
        code,
        dept,
      }),
    };
    const res = await requestYT(options);

    //console.log('sui/addCust.do', res);
    if (res.STATUS === '1') {
      return res;
    }
    return Promise.reject(new Error(res.result_msg));
  }

  static async updateCustomer(open_id_choosed, int_id_choosed, name, idCard, tel, code, dept) {
    //console.log('name', name);
    //console.log(arguments);
    let options = {
      url: 'sui/updateCust.do',
      data: JSON.stringify({
        open_id_choosed: open_id_choosed || wx.getStorageSync('openid'),
        int_id_choosed: int_id_choosed || app.globalData.int_id + '',
        open_id_current: wx.getStorageSync('openid') + '',
        int_id_current: app.globalData.int_id + '',
        name,
        id_card: idCard,
        tel,
        code,
        dept,
      }),
    };
    const res = await requestYT(options);

    //console.log('sui/updateCust.do', res);
    if (res.STATUS === '1' && res.result_code === '0000') {
      return res;
    } else {
      return Promise.reject(new Error(res.result_msg));
    }
  }

  static async getOpenIdByID(INT_ID) {
    let options = {
      url: 'customer/getopen_id2.do',
      data: JSON.stringify({
        INT_ID,
      }),
    };
    return requestYT(options).then((res) => {
      if (res.STATUS === '1') {
        // //console.log("getopen_id2", res.resultVo[0].OPEN_ID);
        return res.resultVo[0].OPEN_ID;
      } else {
        return Promise.reject('unGetOpenIdByID');
      }
    });
  }

  static updateAddress(address) {
    let options = {
      url: 'phoneMsg/updateAddress.do',
      data: JSON.stringify({
        openid: wx.getStorageSync('openid'),
        address: address,
      }),
    };
    return requestYT(options).then((res) => {
      if (res.STATUS === '1') {
        let _res = JSON.parse(res.resultVo);
        //console.log(_res);
        if (_res.code === 1) {
          return _res.msg;
        } else {
          return Promise.reject(_res.msg);
        }
      } else {
        return Promise.reject('unGetOpenIdByID');
      }
    });
  }

  static async getShareInfo(open_id, click) {
    let options = {
      url: 'share/getshare.do',
      data: JSON.stringify({
        open_id,
        click,
      }),
    };
    return requestYT(options)
      .then((res) => {
        // //console.log("getshare",res)
        if (res.STATUS === '1') {
          return JSON.parse(res.list);
        } else {
          return Promise.reject('unShareInfo');
        }
      })
      .catch((res) => {
        //console.log(res);
      });
  }

  static async getCustomerInfo(openId) {
    let options = {
      url: 'customer/getcustomer.do',
      data: JSON.stringify({
        openId: openId || wx.getStorageSync('openid') || wx.getStorageSync('openid'),
      }),
    };
    return requestYT(options).then((res) => {
      if (res.STATUS === '1') {
        if (res.resultVo.code === 1) {
          return res.resultVo.data[0];
        } else {
          return Promise.reject('unCustomerInfo');
        }
      } else {
        return Promise.reject('unCustomerInfo');
      }
    });
  }

  static async getIdentityInfo(openId) {
    let options = {
      url: 'customer/selectIdcard.do',
      data: JSON.stringify({
        openid: openId || wx.getStorageSync('openid'),
      }),
    };
    return requestYT(options).then((res) => {
      if (res.STATUS === '1') {
        if (res.resultVo.code === 1) {
          return JSON.parse(res.resultVo.stringData)[0];
        } else {
          return Promise.reject('unSelectIdcard');
        }
      } else {
        return Promise.reject('unSelectIdcard');
      }
    });
  }
  static async deleteIdentityInfo(idCard) {
    let options = {
      url: 'sui/deleteIdcard.do',
      data: JSON.stringify({
        id_number: idCard,
      }),
    };
    const res = await requestYT(options);
    console.log(options.url, res);
    if (res.STATUS === '1' && res.code === '0000') {
      return;
    } else {
      return Promise.reject(new Error(res.msg || '删除身份信息失败'));
    }
  }
  static async updateIdentityInfo(data) {
    let options = {
      url: 'sui/updateIdcard.do',
      data: JSON.stringify({
        data,
      }),
    };
    const res = await requestYT(options);
    console.log(options.url, res);

    if (res.STATUS === '1' && res.code === '0000') {
      return;
    } else {
      return Promise.reject(new Error(res.msg || '更新身份信息失败'));
    }
  }

  static async getFaceVerify(openId) {
    return requestP({
      url: app.globalData.URL + 'getfaceverify',
      data: {
        openid: openId || wx.getStorageSync('openid'),
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        key: Date.parse(new Date()).toString().substring(0, 6),
        sessionId: wx.getStorageSync('sessionid'),
        transNo: 'XC023',
      },
      method: 'POST',
    }).then((res) => {
      console.log(res,'res')
      if (res.code === 1) {
        let _result = JSON.parse(util.dect(res.stringData));
        //console.log('_result');
        console.log(_result,'000');
        if (_result.length === 0) {
          return Promise.reject('faceUnVerified');
        } else {
          if (_result[0].ERRCODE === '0' || _result[0].ERRCODE === '2') {
            return _result[0];
          } else {
            return Promise.reject('weChatFaceFail');
          }
        }
      } else {
        return Promise.reject('faceUnVerified');
      }
    });
  }

  static async addFaceInfo(code, errmsg, batchId = '') {
    //console.log('code', code);
    let options = {
      url: 'customer/addFace.do',
      data: JSON.stringify({
        errcode: code,
        errmsg,
        openid: wx.getStorageSync('openid'),
        batch_id: batchId,
        data: JSON.stringify({
          string_check_alive_type: '2',
          string_errcode: code,
          string_open_id: wx.getStorageSync('openid'),
          string_errmsg: errmsg,
          string_batch_id: batchId,
        }),
      }),
    };

    return requestYT(options).then((res) => {
      //console.log('addFace', res);
      if (res.STATUS === '1' && res.resultVo.code == '1') {
        if (code === '0' || code === '2') {
          wx.showToast({
            title: '人脸识别认证完成',
            icon: 'none',
            duration: 1500,
            mask: false,
            success() {
              if (code === '2') {
                setTimeout(() => {
                  wx.navigateBack();
                }, 1500);
              }
            },
          });
        } else {
          return;
        }
      } else {
        return Promise.reject('录入失败');
      }
    });
  }

  static async getRencai(talentQueryCode, dept = '', productCode = '') {
    const options = {
      url: '/sui/getRcrz.do',
      data: JSON.stringify({
        talentQueryCode,
        code: '1',
        dept,
        productCode,
      }),
    };
    const res = await requestYT(options);
    //console.log("res",res);
    if (res.STATUS === '1' && res.code === '1') {
      const result = JSON.parse(res.data);
      if (result.length === 0) {
        return Promise.reject('unRencai');
      } else {
        if (result[0].basic) {
          return result[0];
        }
        return Promise.reject('unRencai');
      }
    }
    return Promise.reject(new Error(res.msg));
  }

  static async getTalentInfo2(idCard) {
    const options = {
      url: 'sui/suiZHYQ0019.do',
      data: JSON.stringify({
        zjhm: idCard,
        mark: '1',
      }),
    };
    const res = await requestYT(options);
    if (res.STATUS === '1' && res.result_code === '0000') {
      const _res = JSON.parse(res.stringData);
      if (_res.rET_CODE === '0') {
        return _res;
      } else {
        return Promise.reject(new Error(_res.rET_MSG));
      }
    }

    return Promise.reject(new Error(res.result_msg));
  }

  static async getTalentInfo(idCard, dept = '', productCode = '') {
    try {
      return await User.getTalentInfo2(idCard);
    } catch (error) {
      return await User.getRencai(idCard, dept, productCode);
    }
  }
  static async getTalentFin (){
      const options = {
        url: 'talentFin/query.do',
        data: {},
      };
      const res = await requestYT(options);
      console.log("res",res);
      if(res && res.STATUS){
        return res
      }else{
        return Promise.reject(new Error(res.MSG));
      }
  }
  /**
   * 用户信息授权
   */
  static ifAuthUserInfo() {
    return new Promise((resolve, reject) => {
      if (app.globalData.userInfo && app.globalData.userInfo.language) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }

  /**
   * 更具员工好获取员工名片信息
   * @param {员工号} empNo
   */
  static async getCardInfo(empNo) {
    try {
      const res = await requestP({
        url: app.globalData.URL + 'adviser/getCardByEmp',
        data: {
          empNo: empNo,
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          key: Date.parse(new Date()).toString().substring(0, 6),
          sessionId: wx.getStorageSync('sessionid'),
          transNo: 'XC022',
        },
        method: 'GET',
      });
      if (util.dect(res) != 'null') {
        let cardInfo = JSON.parse(util.dect(res));
        cardInfo.PHOTO = encodeURIComponent(cardInfo.PHOTO);
        cardInfo.TAG2 = cardInfo.TAG.split('_');
        cardInfo.TAG3 = cardInfo.TAG.replace(/\_/g, ' ');
        if (cardInfo.PHOTO && cardInfo.TEXT2 && cardInfo.TEXT2 == '1') {
          await api.downloadFile(cardInfo.PHOTO).then((res) => {
            cardInfo.PHOTO2 = res;
          });
        } else {
          let avatarName = '';
          if (cardInfo.GENDER == '男') {
            avatarName = 'sui_502.png';
          } else if (cardInfo.GENDER == '女') {
            avatarName = 'sui_503.png';
          } else {
            avatarName = 'sui_501.png';
          }
          cardInfo.PHOTO2 = app.globalData.CDNURL + '/static/wechat/img/sui/' + avatarName;
        }
        return cardInfo;
      } else {
        return Promise.reject('not found cardInfo');
      }
    } catch (err) {}
  }

  static async verifyIdentity(name, idcard, type) {
    let options = {
      url: 'sui/sui99602.do',
      data: JSON.stringify({
        name,
        idcard,
      }),
    };

    const res = await requestYT(options);
    //console.log('sui99602', res);
    if (res.STATUS === '1' && res.result_code === '0') {
      return;
    } else {
      return Promise.reject(type + '信息校验失败');
    }
  }

  static async ocrIdCard(IMAGE_IDCARD_B, IMAGE_IDCARD_A) {
    let options = {
      url: 'idcardRecognition/addToYxpt.do',
      data: JSON.stringify({
        IMAGE_IDCARD_B,
        IMAGE_IDCARD_A,
        IMAGE_MODE: '02',
        openid: wx.getStorageSync('openid'),
        type: '2',
      }),
      ifEncrypt: false,
    };
    const res = await requestYT(options);
    console.log(options.url, res);
    if (res.STATUS === '1' && res.resultCode === '0000') {
      return res;
    } else {
      return Promise.reject(new Error(res.resultMsg));
    }
  }

  static async ocrBusinessLicense(IMAGE_IDCARD_B, IMAGE_IDCARD_A) {
    let options = {
      url: 'acc/addToYxpt.do',
      data: JSON.stringify({
        IMAGE_IDCARD_B,
        IMAGE_IDCARD_A,
        IMAGE_MODE: '02',
        openid: wx.getStorageSync('openid'),
        type: '2',
      }),
    };
    const res = await requestYT(options);
    console.log(options.url, res);
    if (res.STATUS === '1' && res.resultCode === '0000') {
      return;
    } else {
      return Promise.reject(new Error(res.resultMsg));
    }
  }

  static async addTalentInfo(data) {
    let options = {
      url: 'jsyh/addRencai.do',
      data: JSON.stringify(data),
    };
    const res = await requestYT(options);
    console.log(options.url, res);
    if (res.STATUS === '1' && res.result_code === '0000') {
      return;
    } else {
      return Promise.reject(new Error(res.result_msg));
    }
  }
  
  static async insertIdcardNew(data) {
    let options = {
      url: 'customer/insertIdcardNew.do',
      data: JSON.stringify({data:data}),
    };
    const res = await requestYT(options);
    console.log(options.url, res);
    return res;
  }
}
