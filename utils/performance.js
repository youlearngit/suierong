import requestYT from '../api/requestYT';

/*
var myPerformance = require("../../../utils/performance.js");

myPerformance.reportBegin(1001,'map');
myPerformance.reportEnd(1001,'map');
 */
const report = (id, val, dimensions) => {
  if (!wx.canIUse('reportPerformance')) {
    return;
  }
  if (val <= 0) {
    val = 1;
  }
//   console.log('wx.reportPerformance: #' + id + '#' + dimensions + ': ' + val);
  wx.reportPerformance(id, val, dimensions);

  let name_idx = {
    1001: '网点',
    2002: '消费贷申请页面',
    2003: '消费贷首页',
    2004: '我的页面',
    2005: '经营贷认证页',
    2006: '经营贷首页',
    2007: '我的申请页面',
    2008: '随e贷邀请活动页',
    2009: '借款申请身份认证页',
    2010: '征信授权信息查询页',
    2011: '征信授权首页',
    2012: '随e贷申请记录查询页',
    2013: '个人信息管理页',
    2014: '授权管理页面',
    2015: '个人业务页面',
    2016: '征信线上化授权人管理页',
    2017: '个人柜台',
    2018: '方案页首页',
    2019: '消息页首页',
    2020: '企业金融首页',
    2021: '房产评估页',
  };

  let name = name_idx[id];
  let options = {
    url: 'monitor/insert.do',
    data: JSON.stringify({
      PERFORMANCE_ID: String(id),
      NAME: name,
      LOAD_TIME: String(val),
      // LOAD_DATE: datetime
    }),
  };
  requestYT(options).then((res) => {
    // console.log('api./monitor/insert.do: res: ' + res);
  });
};

var myPerformanceArr = {};

const reportBegin = (id, dimensions) => {
  myPerformanceArr[id + '#' + dimensions + '#' + 'tBegin'] = new Date().getTime();
};

const reportEnd = (id, dimensions) => {
  if (!myPerformanceArr[id + '#' + dimensions + '#' + 'tBegin']) {
    return;
  }
  myPerformanceArr[id + '#' + dimensions + '#' + 'tEnd'] = new Date().getTime();
  let val =
    myPerformanceArr[id + '#' + dimensions + '#' + 'tEnd'] - myPerformanceArr[id + '#' + dimensions + '#' + 'tBegin'];
  report(id, val, dimensions);
};

module.exports = {
  report: report,
  reportBegin: reportBegin,
  reportEnd: reportEnd,
};
