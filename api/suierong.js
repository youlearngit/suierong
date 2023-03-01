import requestYT from './requestYT';

export const getSalaryNews = async (data) => {
  const options = {
    url: 'messageReminder/messageSelect.do',
    data: JSON.stringify(data),
  };

  const res = await requestYT(options);
  return res
};

export const getSalaryBanners = async (data) => {
  const options = {
    url: 'pictureBanner/pictureSelect.do',
    data: JSON.stringify(data),
  };

  const res = await requestYT(options);
  return res
};

// 联行号查询
export const bankIdQuery = async (data) => {
  const options = {
    url: 'pro/bankIdQuery.do',
    data: JSON.stringify(data),
  };

  const res = await requestYT(options);
  return res
};

//额度查询
export const cerditLimitQuery = async (data) => {
  const options = {
    url: 'pro/cerditLimitQuery.do',
    data: JSON.stringify(data),
  };

  const res = await requestYT(options);
  return res
};

//受益人信息查询
export const benInformation = async (data) => {
  const options = {
    url: 'benInformation/qry.do',
    data: JSON.stringify(data)
  };

  const res = await requestYT(options);
  return res
};

//受益人信息新增
export const benInformationAdd = async (data) => {
  const options = {
    url: 'benInformation/add.do',
    data: JSON.stringify(data)
  };

  const res = await requestYT(options);
  return res
};