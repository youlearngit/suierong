import requestYT from '../../../api/requestYT';

export const addInviteInfo = async (e) => {
  console.log(e)
  let options = {
    url: 'sui/addShareInvite.do',
    data: JSON.stringify(e),
  };
  const res = await requestYT(options);
  console.log(res);
  if (res.STATUS === '1' && res.result_code === '0000') {
    return res.id;
  } else {
    return Promise.reject(new Error(res.result_msg));
  }
};

export const accpetInvitation = async (e) => {
  let options = {
    url: 'sui/acceptInvitation.do',
    data: JSON.stringify(e),
  };
  const res = await requestYT(options);
  console.log(res);
  if (res.STATUS === '1' && res.result_code === '0000') {
    return;
  } else {
    return Promise.reject(new Error(res.result_msg));
  }
};
