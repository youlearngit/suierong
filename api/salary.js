import requestYT from './requestYT';

export const getSalaryCode = async (tel) => {
  const options = {
    url: 'salary/getSalaryCode.do',
    data: JSON.stringify({
      tel,
    }),
  };

  const res = await requestYT(options);
  return res
};