import requestP from '../utils/requsetP';
import util from '../utils/util';
import requestYT from './requestYT';
import log from '../log';
const app = getApp();

export default class Order {
  /**
   * 本地订单geneneservice  apply表查询订单信息
   */
  static getOrderInfoByOrderNo(orderNo) {
    return requestP({
      url: app.globalData.URL + 'selectorder',
      data: {
        orderNo,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        key: Date.parse(new Date()).toString().substring(0, 6),
        sessionId: wx.getStorageSync('sessionid'),
        transNo: 'XC023',
      },
      method: 'POST',
    }).then((res) => {
      if (res.stringData) {
        let _result = util.dect(res.stringData);
        if (_result) {
          _result = JSON.parse(_result);
          return _result[0];
        } else {
          return Promise.reject();
        }
      } else {
        return Promise.reject();
      }
    });
  }

  /**
   * 苏州征信贷 （不是我写的不懂逻辑）
   * @param {*} creditCode
   * @param {*} enterpriseName
   */
  static getOrderInfoByEnterprise(creditCode, enterpriseName) {
    return requestP({
      url: app.globalData.URL + 'selectOrderInfo',
      data: {
        creditCode,
        enterpriseName,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        key: Date.parse(new Date()).toString().substring(0, 6),
        sessionId: wx.getStorageSync('sessionid'),
        transNo: 'XC023',
      },
      method: 'POST',
    }).then((res) => {
      if (res === '数据不存在') {
        return;
      }
      let _result = JSON.parse(util.dect(res));
      return _result[0];
    });
  }

  /**
   * 网贷查询用户订单
   * @param {w} idCard
   * @param {*} type
   * @param {*} tpye1
   */
  static getOrderInfoByIdCard(idCard, type, tpye1) {
    let options = {
      url: 'apply/authorization.do',
      data: JSON.stringify({
        idCard,
        type,
        tpye1,
      }),
    };
    return requestYT(options).then((res) => {
      if (res.STATUS === '1') {
        res = JSON.parse(res.stringData);
        if (res.resultCode === '0000') {
          return res.authorizers;
        } else {
          return Promise.reject(res.resultMsg);
        }
      } else {
        return Promise.reject('网络异常');
      }
    });
  }

  /**
   * 查询订单的授权人信息
   * @param {*} orderNo
   */
  static getOrderInfoByOrderNoWithinWD(orderNo) {
    let options = {
      url: 'apply/authorization1.do',
      data: JSON.stringify({
        orderNo,
      }),
    };
    return requestYT(options).then((res) => {
      if (res.STATUS === '1') {
        res = JSON.parse(res.stringData);
        if (res.resultCode === '0000') {
          return res.authorizers;
        } else {
          return Promise.reject(res.resultMsg);
        }
      } else {
        return Promise.reject('网络异常');
      }
    });
  }

  /**
   * 查询订单借款人姓名
   * @param {*} orderNo
   */
  static async getBorrowerName(orderNo) {
    // let options = {
    //   url: 'jsyh/getJieName.do',
    //   data: JSON.stringify({
    //     orderNo,
    //   }),
    // };
    // const res = await requestYT(options);
    // console.log('jsyh/getJieName.do', res);
    // if (res.STATUS === '1') {
    //   res = JSON.parse(res.result);
    //   console.log(JSON.parse(res.stringData));
    //   let _result = JSON.parse(util.dect(res_1.stringData));
    //   return _result.orderQueryList.orderQuery[0];
    // } else {
    //   return Promise.reject('网络异常');
    // }
    const res_1 = await requestP({
      url: app.globalData.URL + 'getJieName',
      data: {
        orderNo,
      },
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        key: Date.parse(new Date()).toString().substring(0, 6),
        sessionId: wx.getStorageSync('sessionid'),
        transNo: 'XC023',
      },
      method: 'POST',
    });
    let _result = JSON.parse(util.dect(res_1.stringData));
    return _result.orderQueryList.orderQuery[0];
  }

  /**
   * 获取用户最新一笔订单
   * @param {*} openid
   */
  static getLatestApplyID(openid) {
    return requestP({
      url: app.globalData.URL + 'getapplyone',
      data: {
        openid: openid || wx.getStorageSync('openid'),
      },
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        key: Date.parse(new Date()).toString().substring(0, 6),
        sessionId: wx.getStorageSync('sessionid'),
        transNo: 'XC023',
      },
    }).then((res) => {
      if (res.code === 1) {
        let _result = JSON.parse(util.dect(res.stringData));
        return _result;
      } else {
        return Promise.reject('noLatestApplyID');
      }
    });
  }

  /**
   * 查询本地订单信息
   * @param {*} orderNo
   */
  static getApplyByOrderNo(orderNo) {
    return requestP({
      url: app.globalData.URL + 'sed/getApplyByOrderNo',
      data: {
        orderNo,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        key: Date.parse(new Date()).toString().substring(0, 6),
        sessionId: wx.getStorageSync('sessionid'),
        transNo: 'XC008',
      },
    }).then((res) => {
      let _result = JSON.parse(util.dect(res));
      if (_result.data) {
        return _result.data;
      } else {
        return Promise.reject('noApplyInfo');
      }
    });
  }

  static async getApplyInfoByOrderNo(orderNo) {
    let options = {
      url: 'sui/getapplybyorderno.do',
      data: JSON.stringify({
        orderNo,
      }),
    };
    const res = await requestYT(options);
    console.log(res);
    if (res.STATUS === '1' && res.result_code === '0000') {
      return JSON.parse(res.stringData);
    } else {
      return Promise.reject('noAwardLists' + mod);
    }
  }

  /**
   * 添加分享申请记录
   * @param {*} data
   */
  static addApplyShareInfo(data) {
    data = util.enct(data) + util.digest(data);
    return requestP({
      url: app.globalData.URL + 'addShare1',
      data: {
        data: data,
      },
      header: {
        'content-type': 'application/json', // 默认值
        key: Date.parse(new Date()).toString().substring(0, 6),
        sessionId: wx.getStorageSync('sessionid'),
        transNo: 'XC025',
      },
    }).then((res) => {});
  }

  static getShareRecord(currentPage, pageSize, mod) {
    let options = {
      url: 'share/getAwardLists1.do',
      data: JSON.stringify({
        openid: wx.getStorageSync('openid'),
        currentPage,
        pageSize,
        mod,
      }),
    };
    return requestYT(options).then((res) => {
      if (res.STATUS === '1' && res.code == '1') {
        let _res = JSON.parse(res.stringData);
        let _data = {
          totalNum: res.count,
          value: _res,
        };
        return _data;
      } else {
        return Promise.reject('noAwardLists' + mod);
      }
    });
  }

  static getNodeInfoByOrderNo(orderNo) {
    let options = {
      url: 'sui/getInfoByOrderNo.do',
      data: JSON.stringify({
        orderNo,
      }),
    };
    return requestYT(options).then((res) => {
      if (res.STATUS === '1' && res.resultCode == '1') {
        let _res = JSON.parse(res.data);
        _res[0].form = JSON.parse(_res[0].WDGL1661_REQ);
        _res[0].pInfo = JSON.parse(_res[0].WDGL1663_REQ);
        return _res[0];
      } else {
        return Promise.reject();
      }
    });
  }
  /**
   * 随e贷确认授权 wdgl1678
   */
  static suiAuth(data) {
    let options = {
      url: 'sui/suiAuth.do',
      data: JSON.stringify({
        data: data,
      }),
    };
    return requestYT(options).then((res) => {
      if (res.STATUS === '1' && res.resultCode == '0000') {
        return;
      } else {
        return Promise.reject(res.resultMsg);
      }
    });
  }
  /**
   *
   */
  static applyArtificialService(orderNo) {
    let options = {
      url: 'sui/toOffline.do',
      data: JSON.stringify({
        orderNo,
        operationType: '0', //转线下
        resvFld1: '',
        resvFld2: '',
        resvFld3: '',
        resvFld4: '',
        resvFld5: '',
      }),
    };
    return requestYT(options).then((res) => {
      if (res.STATUS === '1' && res.resultCode == '0000') {
        return;
      } else {
        return Promise.reject(res.resultMsg);
      }
    });
  }

  static getApplyStatus(orderNo, sed_id) {
    let options = {
      url: 'sui/wdgl0652.do',
      data: JSON.stringify({
        orderNo,
        sed_id,
      }),
    };
    return requestYT(options).then((res) => {
      if (res.STATUS === '1' && res.resultCode === '0000') {
        //console.log(orderNo, `Obligate3:${res.Obligate3},Obligate4:${res.Obligate4}`);
        return res;
      } else {
        return Promise.reject(new Error(res.resultMsg || '查询订单状态失败'));
      }
    });
  }
  static getApplyList(p) {
    let { openid, page, pageSize,typeQuery } = p;
    console.log(page + ',' + pageSize);
    let options = {
      url: 'apply/getApply.do',
      data: JSON.stringify({
        openid,
        page,
        pageSize,
        typeQuery
      }),
    };
    return requestYT(options).then((res) => {
      if (res.STATUS === '1' && res.code === '1') {
        return JSON.parse(res.stringData);
      } else {
        return Promise.reject('网络异常');
      }
    });
  }

  static getTalentApply(cert_no) {
    let options = {
      url: 'jsyh/queryRencaiMsg.do',
      data: JSON.stringify({
        openid: wx.getStorageSync('openid'),
        cert_no,
      }),
    };
    return requestYT(options).then((res) => {
      if (res.STATUS === '1') {
        return res.flag;
      }
    });
  }

  static async authorization3204(aid, orderNo) {
    let options = {
      url: 'sui/authCz.do',
      data: JSON.stringify({
        aid,
        orderNo,
      }),
    };
    const res = await requestYT(options);
    console.log('sui/authCz.do', res);
    if (res.STATUS === '1' && res.result_code === '0000') {
      return res.flag;
    }
    return Promise.reject(new Error(res.result_msg));
  }

  static async confirmLoanAmount(orderNo) {
    let options = {
      url: 'sui/sedConfirm.do',
      data: JSON.stringify({
        orderNo: orderNo,
      }),
    };
    const res = await requestYT(options);
    console.log(options.url, res);
    if (res.STATUS === '1' && res.resultCode === '0000') {
      return res;
    }
    return Promise.reject(new Error(res.resultMsg));
  }
  static async myrAddOrUpdata(data) {
    let options = {
      url: 'myr/updateStatus.do',
      data: data
    };
    const res = await requestYT(options);
    console.log(options.url, res);
    if (res.STATUS === '1' && res.resultCode === '0000') {
      return res
    }
    return res
  }
  static async getNodeInfo(orderNo) {
    let options = {
      url: 'sui/getNode.do',
      data: JSON.stringify({
        openid: wx.getStorageSync('openid'),
      }),
    };
    const res = await requestYT(options);
    if (res.STATUS === '1') {
      return res;
    }
    return Promise.reject(new Error(res.resultMsg));
  }

  static async getNodeInfoCz(orderNo) {
    let options = {
      url: 'sui/getNodeCz.do',
      data: JSON.stringify({
        openid: wx.getStorageSync('openid'),
      }),
    };
    const res = await requestYT(options);
    if (res.STATUS === '1') {
      return res;
    }
    return Promise.reject(new Error(res.resultMsg));
  }

  static async getUnfinishedOrder(url = '') {
    try {
      wx.showLoading({
        title: '加载中',
        mask: true,
      });
      const res = await Order.getNodeInfo();
      log.setFilterMsg(`getUnfinishedOrder:${wx.getStorageSync('openid')}`);
      log.info(res);
      if (res.result_code === '0') {
        wx.navigateTo({
          url: url || '/sub1/pages/sui/index2',
        });
        return;
      }
      let UnfinishedOrderList = JSON.parse(res.list);
      // 查询网贷订单状态
      let orderStatusList = UnfinishedOrderList.map((applyInfo) => {
        // 此段用于老订单,无节点判断
        if (!applyInfo.NODE) {
          return Promise.reject(new Error('not cotain nodeInfo'));
        }
        const node = applyInfo.NODE;
        if (node < 6) {
          return Promise.resolve({
            Obligate3: '',
          });
        }

        if(url === '/sub1/pages/cz/index2'){
          return Promise.resolve({
            Obligate3: '1',
          });
        }
        let nodeInfo = JSON.parse(applyInfo.WDGL1661_REQ);
        console.log(nodeInfo);
        let orderNo =
          applyInfo.WDGL1663_REQ && nodeInfo.applyName // 老订单数据格式，与新订单不同
            ? JSON.parse(applyInfo.WDGL1663_REQ).orderNo
            : nodeInfo.node1.order_no;

        return Order.getApplyStatus(orderNo, applyInfo.SED_ID);
      });
      // 明天测试下多笔订单的情况

      orderStatusList = await Promise.all(orderStatusList);
      orderStatusList = orderStatusList.map((orderStatus, index) => {
        return Object.assign(orderStatus, UnfinishedOrderList[index]);
      });

      const statusFilter = (order) => {
        const { Obligate3, Obligate4 } = order;
        const errorStatus = ['5', '6', '7', '8', '9', '10', '12'];
        return !(
          Obligate4 === '1' || // 走线下
          Obligate3 === '41' ||
          Obligate3 === '42' ||
          Obligate3 === '43' ||
          Obligate3 === '46' ||
          Obligate3 === '48' ||
          Obligate3 === '49' ||

          errorStatus.indexOf(Obligate3) > -1
        );
      };
      // 过滤网贷不允许重复申请的订单状态
      orderStatusList = orderStatusList.filter(statusFilter);
      console.log('最终订单列表：', orderStatusList);
      log.info('最终订单列表：', orderStatusList);
      if (orderStatusList.length === 0) {
        wx.navigateTo({
          url: url || '/sub1/pages/sui/index2',
        });
        return;
      }

      if (orderStatusList.length > 1) {
        throw new Error('存在多笔订单');
      }

      if (orderStatusList.length === 1) {
        let orderInfo = orderStatusList[0];
        console.log(JSON.parse(orderInfo.WDGL1661_REQ))
        const channelNo = JSON.parse(orderInfo.WDGL1661_REQ).node1.channelNo;
        let { Obligate3, NODE: node } = orderInfo;
        console.log(Obligate3);
        if (Obligate3 === '0' || Obligate3 === '1' || Obligate3 === '2' || Obligate3 === '11') {
          wx.navigateTo({
            url: node === '6' ? '/sub1/pages/sui/review' : '/pages/mine/mine_list',
          });
        } else if (Obligate3 === '') {
          let msg = '';
          if (parseInt(node) >= 6) {
            console.log('node', node);
            let arr = ['6', '6-5', '7-5', '8-5', '9-5'];
            orderInfo.NODE = arr.indexOf(node) > -1 ? '5' : node;
            msg = '1';
          }

          if (channelNo === '5001HH') {
            url = '/sub1/pages/hw/index';
          }
          wx.navigateTo({
            url: `${url || '/sub1/pages/sui/index2'}?applyInfo=${encodeURIComponent(
              JSON.stringify(orderInfo),
            )}&msg=${msg}`,
          });
        } else {
          wx.navigateTo({
            url: '/pages/mine/mine_list',
          });
        }
      }
    } catch (error) {
      wx.showModal({
        title: '提示',
        content: error.message || error,
        showCancel: false,
        confirmText: '确定',
      });
    } finally {
      wx.hideLoading();
    }
  }

  static async getApplyInfoByAID(sed_id) {
    let options = {
      url: 'sui/getNodeInfoById.do',
      data: JSON.stringify({
        sed_id,
      }),
    };
    const res = await requestYT(options);
    //console.log(res);
    if (res.STATUS === '1') {
      return JSON.parse(JSON.parse(res.list)[0].WDGL1661_REQ);
    }
    return Promise.reject(new Error(res.resultMsg));
  }

  static async getUnfinishedOrderCz(url = '') {
    try {
      wx.showLoading({
        title: '加载中',
        mask: true,
      });
      const res = await Order.getNodeInfoCz();
      log.setFilterMsg(`getUnfinishedOrder:${wx.getStorageSync('openid')}`);
      log.info(res);
      if (res.result_code === '0') {
        wx.navigateTo({
          url: url || '/sub1/pages/sui/index2',
        });
        return;
      }
      let UnfinishedOrderList = JSON.parse(res.list);
      // 查询网贷订单状态
      let orderStatusList = UnfinishedOrderList.map((applyInfo) => {
        // 此段用于老订单,无节点判断
        if (!applyInfo.NODE) {
          return Promise.reject(new Error('not cotain nodeInfo'));
        }
        const node = applyInfo.NODE;
        if (node < 6) {
          return Promise.resolve({
            Obligate3: '',
          });
        }

        if(url === '/sub1/pages/cz/index2'){
          return Promise.resolve({
            Obligate3: '1',
          });
        }
        let nodeInfo = JSON.parse(applyInfo.WDGL1661_REQ);
        console.log(nodeInfo);
        let orderNo =
          applyInfo.WDGL1663_REQ && nodeInfo.applyName // 老订单数据格式，与新订单不同
            ? JSON.parse(applyInfo.WDGL1663_REQ).orderNo
            : nodeInfo.node1.order_no;

        return Order.getApplyStatusCz(orderNo, applyInfo.SED_ID);
      });
      // 明天测试下多笔订单的情况

      orderStatusList = await Promise.all(orderStatusList);
      orderStatusList = orderStatusList.map((orderStatus, index) => {
        return Object.assign(orderStatus, UnfinishedOrderList[index]);
      });

      const statusFilter = (order) => {
        const { Obligate3, Obligate4 } = order;
        const errorStatus = ['5', '6', '7', '8', '9', '10', '12'];
        return !(
          Obligate4 === '1' || // 走线下
          Obligate3 === '41' ||
          Obligate3 === '42' ||
          Obligate3 === '43' ||
          Obligate3 === '46' ||
          Obligate3 === '48' ||
          errorStatus.indexOf(Obligate3) > -1
        );
      };
      // 过滤网贷不允许重复申请的订单状态
      orderStatusList = orderStatusList.filter(statusFilter);
      console.log('最终订单列表：', orderStatusList);
      log.info('最终订单列表：', orderStatusList);
      if (orderStatusList.length === 0) {
        wx.navigateTo({
          url: url || '/sub1/pages/sui/index2',
        });
        return;
      }

      if (orderStatusList.length > 1) {
        throw new Error('存在多笔订单');
      }

      if (orderStatusList.length === 1) {
        let orderInfo = orderStatusList[0];
        const channelNo = JSON.parse(orderInfo.WDGL1661_REQ).node1.channelNo;
        let { Obligate3, NODE: node } = orderInfo;
        console.log(Obligate3);
        if (Obligate3 === '0' || Obligate3 === '1' || Obligate3 === '2' || Obligate3 === '11') {
          wx.navigateTo({
            url: node === '6' ? '/sub1/pages/sui/review' : '/pages/mine/mine_list',
          });
        } else if (Obligate3 === '') {
          let msg = '';
          if (parseInt(node) >= 6) {
            console.log('node', node);
            let arr = ['6', '6-5', '7-5', '8-5', '9-5'];
            orderInfo.NODE = arr.indexOf(node) > -1 ? '5' : node;
            msg = '1';
          }

          if (channelNo === '5001HH') {
            url = '/sub1/pages/hw/index';
          }
          wx.navigateTo({
            url: `${url || '/sub1/pages/sui/index2'}?applyInfo=${encodeURIComponent(
              JSON.stringify(orderInfo),
            )}&msg=${msg}`,
          });
        } else {
          wx.navigateTo({
            url: '/pages/mine/mine_list',
          });
        }
      }
    } catch (error) {
      wx.showModal({
        title: '提示',
        content: error.message || error,
        showCancel: false,
        confirmText: '确定',
      });
    } finally {
      wx.hideLoading();
    }
  }
  // 贸e融用户获取苏银豆信息
  static async getMyrAward(startDate,endDate) {
    let options = {
      url: 'myr/getMyrAward.do',
      data: JSON.stringify({
        openId:wx.getStorageSync('openid'),
        startDate:startDate,
        endDate:endDate
      }),
    };
    console.log('苏银豆信息参数:',options.data)
    const res = await requestYT(options);
    return res;
  }
  // 贸e融苏银豆奖励详细
  static async getShareInfoDetail(startDate,endDate) {
    let options = {
      url: 'myr/getShareInfoDetail.do',
      data: JSON.stringify({
        openId:wx.getStorageSync('openid'),
        startDate:startDate,
        endDate:endDate
      }),
    };
    console.log('苏银豆奖励详细:',options.data)
    const res = await requestYT(options);
    return res;
  }
   // 贸e融提取苏银豆
   static async extractAward(awardNum) {
    let options = {
      url: 'myr/extractAward.do',
      data: JSON.stringify({
        openId:wx.getStorageSync('openid'),
        awardNum:awardNum
      }),
    };
    console.log(options.data)
    const res = await requestYT(options);
    return res;
  }
}
