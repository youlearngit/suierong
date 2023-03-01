import requestYT from './requestYT';
export const maoeronSubmit = async (data) => {
    const options = {
      url: 'myr/myrAddOrUpdate.do',
      data
    };
    console.log('maoeronSubmit:',options.data)
    const res = await requestYT(options);
    return res
};
// 缓存页面参数接口
export const recordStep = async (data) => {
  const options = {
    url: 'myr/recordStep.do',
    data
  };
  console.log('recordStep:',options.data)
  const res = await requestYT(options);
  return res
};
export const getQyName = async (data) => {
  const options = {
    url: 'jsyh/getQyName.do',
    data
  };

  const res = await requestYT(options);
  return res
};
export const queryOnlineLoan = async (data) => {
  const options = {
    url: 'queryOnlineLoan/result.do',
    data
  };
  const res = await requestYT(options);
  return res
};
export const getGsxx = async (data) => {
  const options = {
    url: '/sui/getBusInfo.do',
    data
  };

  const res = await requestYT(options);
  return res
};
export const selectMyrInfo = async (data) => {
  const options = {
    url: 'myr/selectMyrInfo.do',
    data
  };

  const res = await requestYT(options);
  return res
};
// 授权签章
export const myrSign = async (data) => {
  const options = {
    url: 'myr/myrSign.do',
    data
  };

  const res = await requestYT(options);
  return res
};
// 提交给网贷
export const submitTowd = async (data) => {
  const options = {
    url: 'myr/submitTowd.do',
    data
  };

  const res = await requestYT(options);
  return res
};
// 申请结果查询
export const selApplyResult = async (data) => {
  const options = {
    url: 'myr/selApplyResult.do',
    data
  };

  const res = await requestYT(options);
  return res
};
// 申请结果查询
// authorMainType授权主体类型?,lendCertType=10借款人证件类型，faceImgBatchNo人脸影响批次号，authorImgBatchNo授权书批次号，backidenImgBatchNoCode身份证反面影像批次号，idenImgBatchNoCode身份证反面影像批次号，authorDate日期，extends3公司名称，extends2空，extends1":"02",faceImgBatchNoType人脸影响批次号，lendCertNo身份证，authorCertType=10authorImgBatchNoCodeSYS043_BIZ01_101",lendCreditcode统一信用代码，backidenImgBatchNo身份证反面影像批次号，authorImgBatchNoType":"SYS043_BIZ01",authorCertNo法人身份证idenImgBatchNo身份证反面影像批次号，lendOrgcode统一信用代码（9-16）custManagerOrgId‘9910’mobilePhone手机号，lendName姓名authorName姓名

export const qzzx = async (data) => {
  const options = {
    url: '/jsyh/qzzx.do',
    data
  };

  const res = await requestYT(options);
  return res
};
export const getOaInfo = async (data) => {
  const options = {
    url: '/open/getOaInfo.do',
    data
  };

  const res = await requestYT(options);
  return res
};
// 根据地区查询联系方式
export const getContactInfo = async (data) => {
  const options = {
    url: '/jsyh/getContactInfo.do',
    data
  };

  const res = await requestYT(options);
  return res
};
// 根据id查询地区名
export const getLocationById = async (data) => {
  const options = {
    url: '/jsyh/getLocationById.do',
    data
  };

  const res = await requestYT(options);
  return res
};
// 授权验证
export const checkAuthorizationCode = async (data) => {
  const options = {
    url: '/jsyh/checkAuthorizationCode.do',
    data
  };
  const res = await requestYT(options);
  return res
};
// 答题奖励
export const addAnswerAward = async (data) => {
  const options = {
    url: '/jsyh/addAnswerAward.do',
    data
  };
  const res = await requestYT(options);
  return res
};
// 是否是外汇管家
export const checkMobile = async (data) => {
  const options = {
    url: 'jsyh/checkMobile.do',
    data
  };
  const res = await requestYT(options);
  return res
};
// 判断是否第二次登录
export const checkLogin = async (data) => {
    const datamito = {
      url: 'jsyh/checkLogin.do',
      data
    };
    const res = await requestYT(datamito);
    return res
  };
// 答题结果
export const getAnswerAward = async (data) => {
    const datijieg = {
      url: 'jsyh/getAnswerAward.do',
      data
    };
    const res = await requestYT(datijieg);
    return res
  };

