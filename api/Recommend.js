import requestYT from './requestYT';

export const addRecommendInfo = async (openid, empno,recPhone) => {
  let options = {
    url: 'sui/addRec.do',
    data: JSON.stringify({
      openid,
      empno,
      recPhone
    }),
  };
  const res = await requestYT(options);
  console.log(options.url, res);
  if (res.STATUS == '1' && res.resultCode === '0000') {
    return res.certUri;
  } else {
    return Promise.reject(new Error(res.resultMsg));
  }
};

export const getRecommendList = async (empNo, pageSize, currentPage) => {
  let options = {
    url: 'sui/suiRecList.do',
    data: JSON.stringify({
      emp_no: empNo,
      pageSize,
      currentPage,
    }),
  };
  const res = await requestYT(options);
  console.log(options.url, res);
  if (res.STATUS === '1' && res.code == '1') {
    let _res = JSON.parse(res.stringData);
    let _data = {
      totalNum: res.count,
      value: _res,
    };
    return _data;
  } else {
    return Promise.reject(new Error(res.msg));
  }
};

export const getRecommendApplyList = async (type, date, pageSize, currentPage, startDate, endDate) => {
  let options = {
    url: 'sui/suiLists.do',
    data: JSON.stringify({
      open_id: wx.getStorageSync('openid'),
      type,
      date,
      pageSize: pageSize.toString(),
      currentPage: currentPage.toString(),
      startDate,
      endDate,
    }),
  };
  const res = await requestYT(options);
  console.log(options.url + type, res);
  if (res.STATUS === '1' && res.code == '1') {
    let _res = JSON.parse(res.stringData);
    let _data = {
      totalNum: res.count,
      value: _res,
    };
    return _data;
  } else {
    return Promise.reject(new Error(res.msg));
  }
};

export const findBeans = async () => {
  let options = {
    url: 'share/shuadouzi.do',
    data: JSON.stringify({
      openid: wx.getStorageSync('openid'),
    }),
  };
  const res = await requestYT(options);
  console.log('share/shuadouzi.do', res);
};

export const getRecommendApplyDetailList = async (
  open_id,
  type,
  type2,
  pageSize,
  currentPage,
  open_id2,
  startDate = '',
  endDate = '',
) => {
  let options = {
    url: 'sui/suiDetailList.do',
    data: JSON.stringify({
      open_id,
      type,
      type2,
      pageSize: pageSize.toString(),
      currentPage: currentPage.toString(),
      startDate,
      endDate,
      open_id2,
    }),
  };
  console.log(JSON.parse(options.data));

  const res = await requestYT(options);
  console.log(options.url, res);
  if (res.STATUS === '1' && res.code == '1') {
    let _res = res.stringData ? JSON.parse(res.stringData) : [];
    let _data = {
      totalNum: res.count,
      value: _res,
    };
    return _data;
  } else {
    return Promise.reject(new Error(res.msg));
  }
};
