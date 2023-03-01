var encr = require('../utils/encrypt/encrypt');
var aeskey = encr.key;
const YTURL = 'https://wxapptest.jsbchina.cn:9629/wxgatewaysit/';
//  const YTURL="https://wxapptest.jsbchina.cn:9629/wxgatewayuat/"
//const YTURL = 'https://appservice.jsbchina.cn/wxgatewayuat/';
const requestYT = (options = {}) => {
  let { url, data, ifEncrypt = true } = options;
  //   console.log('ifEncrypt', ifEncrypt);
  let _data = ifEncrypt ? encr.jiami(data, aeskey) : data;
  _data = encr.gwRequest(_data);
  return new Promise((resolve, reject) => {
    wx.request(
      Object.assign(
        {
          url: YTURL + url,
          data: _data,
          method: 'POST',
        },
        {
          success(r) {
            const isSuccess = isHttpSuccess(r.statusCode);
            if (isSuccess) {
              // console.log(url)
              if (r.data.head.H_STATUS === '1' || r.data.body.STATUS === '1') {
                let json = ifEncrypt ? encr.aesDecrypt(r.data.body, aeskey) : r.data.body;
                resolve(json);
              } else {
                console.log(url, r.data.head.H_MSG || r.data.body.MSG);
                reject(r.data.head.H_MSG || r.data.body.MSG);
                // wx.showToast({
                //     title: r.data.head.H_MSG || r.data.body.MSG,
                //     icon: 'none',
                //     image: '',
                //     duration: 2500,
                //     mask: falze,
                //   });
              }
            } else {
              reject({
                msg: `网络错误:${r.statusCode}`,
                detail: r,
              });
            }
          },
          fail(err) {
            console.log('errYT', err);
            if (err.errMsg === 'request:fail ') {
              wx.showToast({
                title: '请检查网络',
                icon: 'none',
                image: '',
                duration: 2500,
                mask: false,
              });
            }
            reject(err);
          },
        },
      ),
    );
  });
};

/**
 * 判断请求状态是否成功
 * 参数：http状态码
 * 返回值：[Boolen]
 */
function isHttpSuccess(status) {
  return (status >= 200 && status < 300) || status === 304;
}

export default requestYT;
