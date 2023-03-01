import requestYT from '../../../api/requestYT';

export const addEvaluation = async (params) => {
  console.log('参数', params);
  const options = {
    url: 'suie/evaluationCollect.do',
    data: JSON.stringify(params),
  };
  const res = await requestYT(options);
  console.log(res);

  if (res.STATUS === '1' && res.resultCode === '0000') {
    return res;
  }
  
  return Promise.reject(new Error(res.resultMsg));
};
