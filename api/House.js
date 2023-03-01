import requestYT from './requestYT';

export default class House {
  /**
   * 获取房产信息
   */
  static async getHouseInfoByUserID() {
    let options = {
      url: 'sui/getmessagebyopenid.do',
      data: JSON.stringify({
        open_id: wx.getStorageSync('openid'),
      }),
    };
    const res = await requestYT(options);
    let list = JSON.parse(res.stringData);
    await list.forEach((e) => {
      e.gujia = parseInt(e.SALEPRICE / 10000);
    });
    return list;
  }

  /**
   *
   * @param {*} zcs      // 注册市
   * @param {*} wywzdz   // 物业完整地址u
   * @param {*} jzmj     // 建筑面积
   * @param {*} remark1  // 物业类型
   * @returns
   */
  static async measureHousePrice(zcs, wywzdz, jzmj, remark1, zcprovicecode, zcxq, ldmc, fhmc, dqlc, zlc) {
    console.log('参数', arguments);
    let options = {
      url: 'house/houseValue.do',
      data: JSON.stringify({
        zcs,
        wywzdz,
        jzmj,
        remark1,
        zcprovicecode,
        zcxq,
        ldmc,
        fhmc,
        dqlc,
        zlc,
      }),
    };
    return requestYT(options).then((res) => {
      //console.log('house/houseEvaluate.do', res);
      if (res.STATUS === '1' && res.successCode === 'PR00') {
        return JSON.parse(res.slfcInfo);
      } else {
        return Promise.reject(new Error(res.msg));
      }
    });
  }

  static async updateHouseInfo(data) {
    //console.log('参数', arguments);
    let options = {
      url: 'sui/updateprice.do',
      data: JSON.stringify({
        data,
      }),
    };
    return requestYT(options).then((res) => {
      console.log('sui/updateprice.do', res);
      if (res.STATUS === '1' && res.result_code == '0000') {
        return;
      } else {
        return Promise.reject(new Error(res.result_msg));
      }
    });
  }
}
