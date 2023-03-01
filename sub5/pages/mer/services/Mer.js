const App = getApp();
const encr = require('../../../../utils/encrypt/encrypt.js');
import requestYT from '../../../../api/requestYT';
import { Wx } from '../../../../utils/Wx';

const Mer = {

  openid: () => {
    let openid = wx.getStorageSync('openid');
    return openid;
  },
  tjropenid: () => {
    let openid = wx.getStorageSync('tjropenid');
    return openid;
  },

  addBizLicenseOcr: (license_path,idcard_number) => {
    return new Promise(function (resolve, reject) {
      let url = 'electric/addBizLicenseOcr.do'
      let data = {
        IMAGE_BIZLICENSE_URL: license_path,
        RE_REGISTER_ID: '1',
        RE_CUST_ID: idcard_number+'' //身份证号
      }
      let data_jiami = encr.jiami(JSON.stringify(data), encr.key)
      wx.request({
        url: App.globalData.YTURL + url,
        data: encr.gwRequest(data_jiami),
        method: 'POST',
        success: (res) => {
          try {
            let re_jiami = res.data.body;
            let re_json = encr.aesDecrypt(re_jiami, encr.key);
            let batch_id = re_json.BatchID;
            console.log({url,data,res:re_json})
            resolve(batch_id)
          } catch(err) {
            reject(res);
          }
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  },

  ocrBusinessLicense: (batch_id) => {
    return new Promise(function (resolve, reject) {
      let url = 'jsyh/ocrBusinessLicense.do';
      let data = {
        IMAGE_MODE: '03',
        IMAGE_DOC_ID: batch_id,
        OBJ_NAME: 'SYS050_BIZ01',
        FILE_TYPE: 'SYS050_BIZ01_101'
      }
      wx.request({
        url: App.globalData.YTURL + url,
        data: encr.gwRequest(data),
        method: 'POST',
        success: (res) => {
          console.log({url,data,res})
          if (res.data.body.STATUS != '1' || res.data.body.STATUS == undefined) {
            reject('系统开小差了，请重新上传');
            return;
          }
          resolve(res.data.body)
          // MSG: "交易成功"
          // RE_ADDRESS: "作云港经济技术开发区大港西路99号3号楼115号房间"
          // RE_BIZ_TERM: "2015年11月20日至2025年11月19日"
          // RE_COMPANY_NAME: "江苏昌恒机电工程有限公司"
          // RE_COMPANY_TYPE: "有限责任公司"
          // RE_FORM: ""
          // RE_FOUNDATION_DATE: "2015年11月20日"
          // RE_LEGAL_REPRESENTATIVE: "李霄"
          // RE_MANAGEMENT_SCOPE: "商务信息咨术服务;机电设备、五金交电的销售;会务服务;服服水术电安览工程、网络工程的施工;农用机械备的安备、充电租品、礼发设备、净水设备、空调设备、预售体化设批、配电可销售、安装.(依法须经批准的项目,经相关部门批准后方可开展经营活动)"
          // RE_OCRRESULT: "01"
          // RE_REGISTERED_CAPITAL: "5000万元整"
          // RE_REGISTER_ID: "91320700MA1MBGC09C"
          // STATUS: "1"
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  },

  getBusInfo: async (company_name) => {
    let options = {
      url: '/sui/getBusInfo.do',
      data: {
        companyName: company_name,
        type: '1',
      }
    };
    let res = await requestYT(options);
    if (!res.stringData) {
      return Promise.reject(res.result_msg)
    }
    return JSON.parse(res.stringData);
    // aBUITEM: "机电设备技术服务；机电设备..."
    // aNCHEYEAR: "2020"
    // cREDITCODE: "91320700MA1MBGC09C"
    // dOM: "连云港经济技术开发区大港西路99号3号楼115号房间"
    // eNTNAME: "江苏昌恒机电工程有限公司"
    // eNTSTATUS: "在营（开业）"
    // eNTTYPE: "有限责任公司(自然人投资或控股)"
    // eSDATE: "2015-11-20"
    // fRNAME: "叶健"
    // iNDUSTRYCOCODE: "1301"
    // mAINREGNO: "320700000206390"
    // oPFROM: "2015-11-20"
    // oPSCOPE: "机电设备技术服务；机电设备..."
    // oPTO: "长期"
    // oRGCODES: "MA1MBGC09"
    // rECCAP: "5000.000000"
    // rEGCAP: "5000.000000"
    // rEGCAPCUR: "人民币元"
    // rEGNO: "320700000206390"
    // rEGORG: "连云港市市场监督管理局"
    // rEGORGCODE: "320700"
    // tEL: "18000176593"
  },

  uploadCard: async (filePath,formData) => {
    let url = 'uploadCard'
    let res = await Wx.uploadFile({
      url: App.globalData.URL + url,
      filePath: filePath,
      name: 'file',
      formData: formData,
      // formData: {
      //   option: '1',
      //   type: 1
      // },
    })
    console.log({url,data:{filePath,formData},res});
    if (res.statusCode == 200) {
      return Promise.resolve(res.data)
    } else {
      return Promise.reject(res)
    }
  },

  ocrRecognition: (a_data,b_data) => {
    return new Promise((resolve, reject) => {
      let url = 'jsyh/ocrRecognition.do';
      let data = {
        "IMAGE_IDCARD_B": b_data,
        "IMAGE_IDCARD_A": a_data,
        "IMAGE_MODE": "02"
      }
      wx.request({
        url: App.globalData.YTURL + url,
        data: encr.gwRequest(data),
        method: 'POST',
        success: (res) => {
          console.log({url,data,res});
          if (res.data.body.TRAN_STATUS != 'COMPLETE') {
            reject(res.data.body.MSG || '身份证OCR照片识别失败')
            return;
          }
          if (res.data.body.RE_LEGALITY == '02') {
            reject('请拍照上传正常有效身份证原件(不允许拍照身份证复印件,身份证二次拍照)');
            return;
          }
          if (res.data.body.RE_LEGALITY != '01') {
            reject('识别失败');
            return;
          }
          let idcard = res.data.body;
          resolve(idcard);
          // IMAGE_INDEX: "",
          // MSG: "交易成功",
          // RE_ADDRESS: "南京市秦淮区中华路26号2407室",
          // RE_BIRTHDAY: "1996.8.30",
          // RE_CUST_ID: "320103199608300774",
          // RE_CUST_NAME: "王晓天",
          // RE_GENDER: "男",
          // RE_ISSUED_BY: "南京市公安局秦淮分局",
          // RE_LEGALITY: "01",
          // RE_LEGALITY_A: "IdPhoto",
          // RE_LEGALITY_B: "Photocopy",
          // RE_RACE: "汉",
          // RE_SIDE: "",
          // RE_VALID_DATE: "2015.10.24-2035.10.24",
          // SEQ_NO: "MB0903500000001120",
          // STATUS: "1",
          // TRAN_STATUS: "COMPLETE",
        },
        fail: (err) => {
          reject('请检查网络')
        }
      })
    })
  },

  upYx: (imgStr) => {
    return new Promise(function (resolve, reject) {
      let url = 'jsyh/test.do';
      let data = {
        imgStr: imgStr,
      }
      wx.request({
        url: App.globalData.YTURL + url,
        data: encr.gwRequest(data),
        method: 'POST',
        success: (res) => {
          console.log({url,data,res});
          if (res.data.head.H_STATUS != '1') {
            reject('上传影像：' + res.data.head.H_MSG);
            return;
          }
          resolve(res.data.body.imgFilePath);
        },
        fail: (err) => {
          reject('上传影像：请检查网络');
        }
      })
    })
  },

  addIdCardtoYxpt: (a_path,b_path,idcard_number) => {
    return new Promise(function (resolve, reject) {
      let url = 'electric/addIdCardtoYxpt.do';
      let data = {
        IMAGE_IDCARD_A: a_path,
        IMAGE_IDCARD_B: b_path,
        RE_CUST_ID: idcard_number
      }
      let data_jiami = encr.jiami(JSON.stringify(data), encr.key)
      wx.request({
        url: App.globalData.YTURL + url,
        data: encr.gwRequest(data_jiami),
        method: 'POST',
        success: (res) => {
          try {
            let re_jiami = res.data.body;
            let re_json = encr.aesDecrypt(re_jiami, encr.key);
            let batch_id = re_json.BatchID;
            console.log({url,data,res:re_json});
            resolve(batch_id);
          } catch(err) {
            reject(res)
          }
        },
        fail: (err) => {
          reject(err);
        }
      })
    })
  },

  updateCusInfoBatchid: (batch_id,idcard_number) => {
    return new Promise(function (resolve, reject) {
      let url = 'sui/updateCusInfoBatchid.do';
      let data = {
          "batch_id": batch_id,
          "id_card": idcard_number
      }
      let data_jiami = encr.jiami(JSON.stringify(data), encr.key)
      wx.request({
        url: App.globalData.YTURL + url,
        data: encr.gwRequest(data_jiami),
        method: 'POST',
        success: (res) => {
          try {
            let re = encr.aesDecrypt(res.data.body, encr.key)
            console.log({url,data,res:re});
            resolve(re);
          } catch(err) {
            reject(res);
          }
        },
        fail: (err) => {
          reject(err);
        }
      })
    })
  },

  compareIdName: (name,idcard_number) => {
    return new Promise(function (resolve, reject) {
      let url = 'compareIdName.do';
      let data = {
        cust_name: name,
        cust_id: idcard_number,
        cust_addr: '1',
        cust_sex: '1',
        nation: '1',
        birthday: '00000000',
        is_agent: '0',
        busicode: '02'
      }
      let data_jiami = encr.jiami(JSON.stringify(data), encr.key);
      wx.request({
        url: App.globalData.creditUrl + url,
        data: encr.gwRequest(data_jiami),
        method: 'POST',
        header: { 'content-type': 'application/json' },
        success: (res) => {
          if (res.data.head.H_STATUS === "1") {
            try {
              let re = encr.aesDecrypt(res.data.body, encr.key);
              console.log({url,data,res:re});
              if (re.chk_result == '00' || re.chk_result == '01') {
                resolve(re);
              } else {
                reject(re.MSG);
              }
            } catch(err) {
              reject(res);
            }
          } else {
            reject(res.body.MSG);
          }
        },
        fail: (err) => {
          reject(err);
        }
      })
    })
  },

  getContactInfo: async (city_name) => {
    let options = {
      url: '/jsyh/getContactInfo.do',
      data: {
        branch: city_name
      }
    };
    let res = await requestYT(options);
    return res;
    // branch: "南京"
    // MSG: "交易成功"
    // STATUS: "1"
    // landline: "025-58588483"
    // phone: "18914785065"
  },

  queryOnlineLoan: async (org_credit,org_name) => {
    let options = {
      url: 'queryOnlineLoan/result.do',
      data: {
        TAX_NUM: org_credit, // 统一信用码
        COMPANY_NAME: org_name,
      }
    };
    let res = await requestYT(options);
    return res;
  },

  suiTaxSh: async (org_credit,openid) => {
    let options = {
      url: "sui/suiTaxSh.do",
      data: JSON.stringify({
        tyshxydm: org_credit,
        openid: openid,
      }),
    };
    let res = await requestYT(options);
    return res;
    // MSG: "交易成功"
    // STATUS: "1"
    // extend_infos: ""
    // h5_homepage: "https://tax.shbanking.cn/m/#/e44b57638dc043838786737e3c42f72b27c6bfc4662c4b9d85e9f447257ec1de"
    // request_id: "pwt81669772093395"
    // result_code: "0000"
    // result_msg: "success"
  },

  tax: (proCode,cityCode,openid) => {
    return new Promise(function (resolve, reject) {
      let url = 'tax';
      let data = {
        proCode: proCode,
        cityCode: cityCode,
        id: openid,
      }
      wx.request({
        url: App.globalData.URL + url,
        data: data,
        success: (res) => {
          console.log({url,data,res})
          resolve(res);
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  },

  taxresultSh: (org_credit) => {
    return new Promise(function (resolve, reject) {
      let url = 'sui/taxresultSh.do';
      let data = {
        request_id: org_credit
      }
      let data_jiami = encr.jiami(JSON.stringify(data), encr.key)
      wx.request({
        url: App.globalData.YTURL + url,
        data: encr.gwRequest(data_jiami),
        method: 'POST',
        success: (res) => {
          try {
            let re_jiami = res.data.body;
            let re_json = encr.aesDecrypt(re_jiami, encr.key);
            console.log({url,data,res:re_json});
            resolve(re_json);
            // MSG: "交易成功"
            // STATUS: "1"
            // result_code: "0001"
            // result_msg: "还未回调"
          } catch (err) {
            reject(err);
          }
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  },

  gettaxresult2: (org_credit,openid) => {
    return new Promise(function (resolve, reject) {
      let url = 'gettaxresult2';
      let data = {
        data: org_credit,
        openid: openid,
      }
      wx.request({
        url: App.globalData.URL + url,
        data: data,
        success: (res) => {
          let re = res.data;
          console.log({url,data,res:re});
          resolve(re);
          // code: 0
          // msg: "还未授权"
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  },

  sendMsg: async (phone,order_num) => {
    let options = {
      url: 'myr/sendMsg.do',
      data: JSON.stringify({
        phone: phone,
        orderNum: order_num,
      }),
    };
    let res = await requestYT(options);
    return res;
    // MSG: "交易成功"
    // STATUS: "1"
    // resultVo: "{"code":1,"msg":"发送成功"}"
  },

  selectMyrInfo: async (openId) => {
    let options = {
      url: 'myr/selectMyrInfo.do',
      data: {
        openId: openId,
      }
    };
    let res = await requestYT(options);
    return res
  },

  selApplyResult: async (openId) => {
    let options = {
      url: 'myr/selApplyResult.do',
      data: {
        openId: openId,
      }
    };
    let res = await requestYT(options);
    return res
  },

  checkAuthorizationCode: async (auth_code,org_credit) => {
    let options = {
      url: '/jsyh/checkAuthorizationCode.do',
      data: {
        queryCode: auth_code,
        entCode: org_credit,
      }
    };
    let res = await requestYT(options);
    return res
  },

  myrSign: async (openid,type,org_name,org_credit,legal_name,legal_idcard,appl_idcard) => {
    let date = new Date();
    let data = {
      qyName: org_name,
      custName: legal_name,
      idCard: legal_idcard,
      sqrName: legal_name,
      year: date.getFullYear()+'',
      month: (date.getMonth()+1)+'',
      day: date.getDate()+'',
      openId: openid,
      type: type+'',
      idCardType: '二代身份证',
      creditCode: org_credit,
      sqDw: org_name,
      applicantCard: appl_idcard,
    }
    let options = {
      url: 'myr/myrSign.do',
      data: JSON.stringify(data)
    };
    let res = await requestYT(options);
    return res
    // BatchID: "SYS050_8229_20221205dnkVaDIf"
    // MSG: "交易成功"
    // STATUS: "1"
    // wordPath: "/home/app/data/myr/ec468c81-0fbd-47fa-acec-3f2e6e15e7ed.doc"
  },

  qzzx: async (org_name,org_credit,legal_face_batchid,legal_idcard_batchid,legal_idcard,legal_name) => {
    let options = {
      url: '/jsyh/qzzx.do',
      data: {
        authorMainType: '03',
        lendCertType: '10',
        faceImgBatchNo: legal_face_batchid,
        backidenImgBatchNoCode: legal_idcard_batchid,
        idenImgBatchNoCode: legal_idcard_batchid,
        authorDate: '',
        extends: org_name,
        extends1: "02",
        faceImgBatchNoType: legal_face_batchid,
        lendCertNo: legal_idcard,
        authorCertType: 10,
        authorImgBatchNoCode: 'SYS043_BIZ01_101',
        lendCreditcode: org_credit,
        backidenImgBatchNo: legal_idcard_batchid,
        authorImgBatchNoType: 'SYS043_BIZ01',
        authorCertNo: legal_idcard_batchid,
        lendOrgcode: org_credit,
        custManagerOrgId: '9910',
        mobilePhone: legal_name,
        lendName: legal_name,
        authorName: legal_name,
      }
    };
    let res = await requestYT(options);
    return res
  },

  submitTowd: async (openid,share_openid,eid) => {
    let options = {
      url: 'myr/submitTowd.do',
      data: {
        openId: openid,
        shareOpenId: share_openid,
        eId: eid,
      }
    };
    let res = await requestYT(options);
    return res
  },

  selectMyrInfo: async (openid,step_flag=1) => {
    let options = {
      url: 'myr/selectMyrInfo.do',
      data: {
        openId: openid,
        stepFlag: step_flag+'',
      }
    };
    let res = await requestYT(options);
    return res
  },

  myrAddOrUpdate: async (data) => {
    let options = {
      url: 'myr/myrAddOrUpdate.do',
      data: data
    };
    let res = await requestYT(options);
    return res
    // Eid: "bbbf9cbefd404889a297c0c0943378b5"
    // MSG: "交易成功"
    // STATUS: "1"
    // msg: "保存成功"
    // msgCode: "0000"
  },

  selectMyrByEid: async (eid) => {
    let options = {
      url: 'myr/selectMyrByEid.do',
      data: {
        eId: eid
      }
    };
    let res = await requestYT(options);
    return res
  },

  recordStep: async (eid,step) => {
    let options = {
      url: 'myr/recordStep.do',
      data: {
        eId: eid,
        step: step+'',
      }
    };
    let res = await requestYT(options);
    return res
    // MSG: "交易成功"
    // STATUS: "1"
  },

  getSydAccountInfo: async (openid) => {
    let options = {
      url: 'myr/getSydAccountInfo.do',
      data: {
        openId: openid,
      }
    };
    let res = await requestYT(options);
    return res
    // MSG: "交易成功"
    // STATUS: "1"
    // accrec: "1"
    // customersid: "99144463"
    // customersname: "梁乐"
    // gender: "2"
    // idno: "310203199703127392"
    // idtype: "A"
    // idtypename: "身份证"
    // phoneNo: "18602513842"
    // resCode: "1"
    // resMsg: "查询成功"
    // voucherrec: "0"

    /*
      resCode: 返回code 0位失败，1为成功
      resMsg: 返回提示
      customersid: 客户号
      customersname: 客户名称
      idtype: 证件类型
      idtypename: 证件类型名称
      idno: 证件号码
      gender: 客户性别
      accrec: 积分账户记录数
      phoneNo: 电话号码
      voucherrec: 关联凭证记录数
      pointsaccs: 积分账户列表
        pointstypeno: 积分类型
        pointstypename: 积分类型名称
        pointsbalance: 积分余额
        freezingpoints: 冻结余额
        availablepoints: 可用余额
        pointstypeno: 积分类型
      vouchers: 关联凭证列表
        vouchertypeno: 凭证类型
        description: 凭证类型名
        voucherno: 凭证编号
        voucheraccname: 开户姓名
        voucheropendate: 开户日期
        voucherbranch: 开户机构编号
        institutionname: 开户机构名称
    */

  },

  getSydDealInfo: async (openid,sdate,edate,page,limit) => {
    let options = {
      url: 'myr/getSydDealInfo.do',
      data: {
        openId: openid,
        bgndate: sdate,
        enddate: edate,
        indexpage: page+'',
        pagesize: limit+'',
      }
    };
    let res = await requestYT(options);
    return res
    // MSG: "交易成功"
    // STATUS: "1"
    // acctranrec: "0"
    // availablepoints: "20021"
    // ctotalPoint: "0.0"
    // customersname: "梁乐"
    // dtotalPoint: "0.0"
    // freezingpoints: "0"
    // idno: "310203199703127392"
    // idtype: "A"
    // idtypename: "身份证"
    // pointsbalance: "20021"
    // pointstypename: "苏银豆"
    // pointstypeno: "0012"
    // resCode: "1"
    // resMsg: "查询成功"
    // totalpage: "0"
    // totalrec: "0"

    /*
      resCode: 返回code 0位失败，1为成功
      resMsg: 返回提示
      customersname: 客户名称
      idtype: 证件类型
      idtypename: 证件类型名称
      idno: 证件号码
      pointstypeno: 积分类型
      pointstypename: 积分类型名称
      pointsbalance: 积分余额
      freezingpoints: 冻结余额
      availablepoints: 可用余额
      totalrec: 总记录数
      totalpage: 总页数
      acctranrec: 交易明细记录数
      ctotalPoint: 总共增加的积分数
      dtotalPoint: 总共减少的积分数
      acctrans: 积分交易列表
        transdate: 交易日期
        transtime: 交易时间
        debitorcredit: 借贷标志 C+D-
        pointsamount: 交易金额
        pointsbalance: 积分余额
        description: 备注
        transtypeno: 交易类型
    */
  },

  getMyrAward: async (openid,sDate,eDate) => {
    let options = {
      url: 'myr/getMyrAward.do',
      data: JSON.stringify({
        openId: openid,
        startDate: sDate,
        endDate: eDate,
      }),
    };
    let res = await requestYT(options);
    return res
  },

  
  getAwardConf: async () => {
    let options = {
      url: 'myr/getAwardConf.do',
      data: {}
    };
    let res = await requestYT(options);
    return res
  },

  getShareInfoDetail: async (openid,sDate,eDate) => {
    let options = {
      url: 'myr/getShareInfoDetail.do',
      data: JSON.stringify({
        openId: openid,
        startDate: sDate,
        endDate: eDate,
      }),
    };
    let res = await requestYT(options);
    return res
  },

  getQyName: async (keyword) => {
    let options = {
      url: 'jsyh/getQyName.do',
      data: JSON.stringify({
        keyWord: keyword
      })
    };
    let res = await requestYT(options);
    return res
    // MSG: "交易成功"
    // STATUS: "1"
    // entNamesList: [
    //   {entNames: "江苏昌恒机电工程有限公司"}
    //   {entNames: "江苏恒昌机电设备工程有限公司"}
    // ]
  },

}

export {Mer}
