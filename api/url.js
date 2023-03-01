import requestYT from './requestYT';


//撮合平台需求查询
export const custMatchInfoQuery = async (data) => {
  const options = {
    url: 'demand/custMatchInfoQuery.do',
    data:JSON.stringify(data)
  };

  const res = await requestYT(options);
  return res
};





