import requestP from '../utils/requsetP';
import requestYT from '../api/requestYT';
import util from '../utils/util';

const app = getApp();
export default class Org {
  /**
   * 获取企业信息，更具企业全称和用户id
   */
  static getEnterpriseInfoByName(orgName) {
    return requestP({
      url: app.globalData.URL + 'getmessagebyname',
      data: {
        org_name: orgName,
        open_id: wx.getStorageSync('openid'),
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        key: Date.parse(new Date()).toString().substring(0, 6),
        sessionId: wx.getStorageSync('sessionid'),
        transNo: 'XC023',
      },
      method: 'POST',
    }).then((res) => {
      let _result = util.dect(res);
      if (_result) {
        _result = JSON.parse(_result);
        if (_result.length === 0) {
          return Promise.reject('unFindEnterprise');
        } else {
          return _result[0];
        }
      } else {
        return Promise.reject('unFindEnterprise');
      }
    });
  }

  /**
   * ed0011
   * @param {e} companyName
   */
  static getEnterpriseList(companyName) {
    let options = {
      url: 'jsyh/getQyName.do',
      data: JSON.stringify({
        keyWord: companyName,
      }),
    };
    return requestYT(options).then((res) => {
      if (res.STATUS == '1' && res.entNamesList && res.entNamesList.length > 0) {
        let enterpriseCardInfo = [];
        for (let i = 0; i < res.entNamesList.length; i++) {
          let obj = {};
          obj.ORG_NAME = res.entNamesList[i].entNames;
          enterpriseCardInfo.push(obj);
        }
        return enterpriseCardInfo;
      } else {
        wx.showToast({
          title: '未查询到相关企业',
          icon: 'none',
          duration: 1500,
          mask: false,
        });
        return Promise.reject('未查询到相关企业');
      }
    });
  }

    /**
   * 获取借据列表
   * @param {*} p
   */
  static async getIousList(p) {
    let data = {
      custName: '',  //企业名称或者个人名称
      custCode: '',  //统一信用代码或者证件号码
    };
    let options = {
      url: 'sui/getAssetCodeList.do',
      data: JSON.stringify(p),
    };
    const res = await requestYT(options);
    if (res.STATUS === '1' && res.msgCode === '0000') {
      console.log(res,'借据接口查询成功')
      return res;
    } else {
      if(res.STATUS === '1' && res.msgCode === '2222'){
        console.log(res,'借据接口查询为空')
        // wx.showModal({
        //   title: '提示',
        //   content: '暂不满足延期业务申请条件',
        //   showCancel: false,
        //   confirmText: '确定',
        // });
        return res;
      } else if (res.STATUS === '1' && res.msgCode === '') {
        return Promise.reject('未查询到客户号');
      } else{
        console.log(res,'借据接口查询失败')
        return Promise.reject(res.Msg || res.msg || '借据列表获取失败');
        // return Promise.reject(res.Msg);
      }
    }
  }
  
  /**
   * ed0292    
   * @param {*} p
   */
  static async getShareHolderInfoC(p) {
    let data = {
      intid: '',
      openid: '',
      type: '',
      companyName: '',
      companyCode: '',
      checkIdcard: '',
      checkName: '',
    };
    let options = {
      url: 'commInvest/select.do',
      data: JSON.stringify(p),
    };
    const res = await requestYT(options);
    if (res.STATUS === '1') {
      // let result = {
      //   applyerType: res.aType,
      //   enterpriseInfo: res.stringData ? JSON.parse(res.stringData) || JSON.parse(res.stringData) : null,
      //   check_result: res.check_result,
      // };
      return res;
    } else {
      return Promise.reject(res.msg);
    }
  }

  /**
   * ed0293    替代ed0200
   * @param {*} p
   */
  static async getEnterpriseInfoNewC(p) {
    let data = {
      intid: '',
      openid: '',
      type: '',
      companyName: '',
      companyCode: '',
      checkIdcard: '',
      checkName: '',
    };
    let options = {
      url: 'qyfr/check.do',
      data: JSON.stringify(p),
    };
    const res = await requestYT(options);
    if (res.STATUS === '1' && res.msgCode === '0000') {
      return res;
    } else {
      return Promise.reject('上传身份信息与工商登记信息不一致,请选择正确信息');
    }
  }

  /**
   * ed0200
   * @param {*} p
   */
  static async getEnterpriseInfo(p) {
    let data = {
      intid: '',
      openid: '',
      type: '',
      companyName: '',
      companyCode: '',
      checkIdcard: '',
      checkName: '',
    };
    let options = {
      url: 'sui/getBusInfo.do',
      data: JSON.stringify(Object.assign(data, p)),
    };
    const res = await requestYT(options);
    //console.log(res);
    if (res.STATUS === '1' && res.result_code === '1') {
      let result = {
        applyerType: res.aType,
        enterpriseInfo: res.stringData ? JSON.parse(res.stringData) || JSON.parse(res.stringData) : null,
        check_result: res.check_result,
      };
      return result;
    } else {
      return Promise.reject(res.result_msg);
    }
  }
  static async wxPubDel(data){
   
    let options = {
      url: 'judge/wxPubDel.do',
      data: data
    };
    const res = await requestYT(options);
    console.log(res);
    if (res.STATUS === '1') {
    
      return res;
    } 
  }
  //新工商校查询口 292 针对股东非法人校验
  static async getShareHolderInfo(requestData,type) {
    var flag = 1;
    let options = {
      url: 'commInvest/select.do',//查询工商接口
      data: requestData,
    };
    var res = await requestYT(options);
    console.log("新工商接口292返回信息\n"+JSON.stringify(res));
    if (res.STATUS === "1") {
      if(res.msgCode ==='0000'){
        if(type=='fr'){ //查法人,待定，需要实践，还需校验返回的社会统一信用码
          if (res.frinfo != '') {
            var body= JSON.parse(res.frinfo);
            console.log("工商292过滤后法人信息：\n"+JSON.stringify(body))
            let a = body.filter(function(value) {
                return (value.eNTNAME == requestData.entmark && value.rYNAME == requestData.name);
            })
            if (a.length == 0) {
                flag = 0;
            }else{
              return a;
            }
          } else {
            flag = 0;
          }
        }else if (type=='gg'){ // 查高管
          if (res.gginfo != '') {
            var body= JSON.parse(res.gginfo);
            console.log("工商292过滤后高管信息：\n"+JSON.stringify(body))
            let a = body.filter(function(value) {
                return (value.eNTNAME == requestData.entmark && value.rYNAME == requestData.name);
            })
            if (a.length == 0) {
                flag = 0;
            }
          } else {
            flag = 0;
          }
        }else if (type == 'gd'){ //查股东
          if (res.gdinfo != '') { 
            var body= JSON.parse(res.gdinfo);
            console.log("工商292过滤后股东信息：\n"+JSON.stringify(body))
            let a = body.filter(function(value) {
                return (value.eNTNAME == requestData.entmark && value.rYNAME == requestData.name);
            })
            if (a.length == 0) {
                flag = 0;
            }
          } else {
            flag = 0;
          }
        }
      }else{
        flag = 0;
      }
    }else{
      flag = 0;
    }
    return flag;
  };
  //新工商校查询口 292 查找职位
  static async getShareHolderInfoByPosition(requestData) {
    var applyerType = '';
    let options = {
      url: 'commInvest/select.do',//查询工商接口
      data: requestData,
    };
    var res = await requestYT(options);
    console.log("新工商接口292返回信息\n"+JSON.stringify(res));
    if (res.STATUS === "1") {
      if(res.msgCode ==='0000'){
        if (res.frinfo != '') {
          var body= JSON.parse(res.frinfo);
          console.log("工商292过滤后法人信息：\n"+JSON.stringify(body))
          let a = body.filter(function(value) {
              return (value.eNTNAME == requestData.entmark && value.rYNAME == requestData.name);
          })
          if(a.length> 0){
            applyerType = '0';
          }
        }else if (res.gdinfo != '') { 
            var body= JSON.parse(res.gdinfo);
            console.log("工商292过滤后股东信息：\n"+JSON.stringify(body))
            let a = body.filter(function(value) {
                return (value.eNTNAME == requestData.entmark && value.rYNAME == requestData.name);
            })
            if (a.length == 0) {
              applyerType = '1';
            }
        }else {
          var body= JSON.parse(res.gginfo);
          console.log("工商292过滤后高管信息：\n"+JSON.stringify(body))
          let a = body.filter(function(value) {
              return (value.eNTNAME == requestData.entmark && value.rYNAME == requestData.name);
          })
          applyerType = '2';
        }
      }else{
        applyerType = '2';
      }
    }else{
      applyerType = '2';
    }
    let result = {
      applyerType: applyerType,
    }
    return result;
  };
  //新工商校验接口 293
  static async checkShareHolderInfo(requestData) {
    let options = {
      url: 'qyfr/check.do',
      data: requestData,
    };
    const res = await requestYT(options);
    console.log("新工商接口返回数据:\n"+JSON.stringify(res));
    if (res.STATUS === '1' && res.msgCode ==='0000') {
      if(res.entInfo === ''){
        return Promise.reject("上传身份信息与工商登记信息不一致， 请选择正确的信息");
      }else{
        var entInfo = JSON.parse(res.entInfo)[0];//企业信息是否
        var relation = JSON.parse(res.relation)[0];//个人信息
        //企业是否匹配
        var flag = 1;
        if(entInfo.matched !== '1' || relation.matched !== '1'){
          flag = 0;
        }
        return flag;
      }
    } else {
      return Promise.reject("获取企业信息失败");
    }
  }

  static async getLocalEnterpriseList(userId, type) {
    let options = {
      url: 'sui/getuseCard.do',
      data: JSON.stringify({
        userId: userId || wx.getStorageSync('openid'),
        type: type || '',
      }),
    };
    const res = await requestYT(options);
    //console.log('getuseCard.do', res);
    if (res.STATUS == '1' && res.result_code === '1') {
      return JSON.parse(res.result_msg);
    } else {
      wx.showToast({
        title: '未查询到相关企业',
        icon: 'none',
        duration: 1500,
        mask: false,
      });
      return Promise.reject('未查询到相关企业');
    }
  }

  static async getTaxUrl(proCode, cityCode) {
    let options = {
      url: 'sui/suiTax.do',
      data: JSON.stringify({
        proCode,
        cityCode,
        id: wx.getStorageSync('openid'),
      }),
    };
    const res = await requestYT(options);
    //console.log(options.url, res);
    if (res.STATUS == '1' && res.resultCode === '0000') {
      return res.certUri;
    } else {
      return Promise.reject(new Error(res.resultMsg));
    }
  }

  static async getTaxResult(data) {
    let options = {
      url: 'sui/gettaxresult2.do',
      data: JSON.stringify({
        data,
        id: wx.getStorageSync('openid'),
      }),
    };
    const res = await requestYT(options);
    //console.log(options.url, res);
    if (res.STATUS == '1' && res.resultCode === '0000') {
      return true;
    } else {
      return Promise.reject(new Error(res.resultMsg));
    }
  }
}
