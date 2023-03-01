import requestYT from '../../../api/requestYT';

export const getSalaryList = async (year, tel) => {
  const options = {
    url: 'salary/getSalarySlipList.do',
    data: JSON.stringify({
      tel,
      year,
    }),
  };

  const res = await requestYT(options);
  console.log(res);
  return res;
};

export const getSalaryCode = async (tel) => {
  const options = {
    url: 'salary/getSalaryCode.do',
    data: JSON.stringify({
      tel,
    }),
  };

  const res = await requestYT(options);
  console.log(res);
  if (res.STATUS === '1' && res.result_code === '0000') {
    return JSON.parse(res.data);
  }
  return Promise.reject(res.flag);
};
