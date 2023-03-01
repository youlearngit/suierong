/**
 * promise请求
 * 参数：参考wx.request
 * 返回值：[promise]res
 */
function requestP(options = {}) {
  const { success, fail } = options;
  return new Promise((resolve, reject) => {
    wx.request(
      Object.assign({}, options, {
        success(r) {
          const isSuccess = isHttpSuccess(r.statusCode);
          if (isSuccess) {
            // 成功的请求状态
            resolve(r.data);
          } else {
            reject({
              msg: `网络错误:${r.statusCode}`,
              detail: r,
            });
          }
        },
        fail: reject,
      }),
    );
  });
}

/**
 * 判断请求状态是否成功
 * 参数：http状态码
 * 返回值：[Boolen]
 */
function isHttpSuccess(status) {
  return (status >= 200 && status < 300) || status === 304;
}

module.exports.requestP = requestP;
