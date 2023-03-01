import requestYT from './requestYT';

export default class Config {
  static async getFundConfig() {
    let options = {
      url: 'fund/select.do',
      data: JSON.stringify({}),
    };
    const res = await requestYT(options);
    if (res.STATUS === '1' && res.flag === '1') {
      let {
        PAGE_URL, //首页
        BUSINESS_URL, //个人业务
        FUND_URL, // 介绍页背景图
        MOMENTS_URL, // 分享海报
        BUTTON_URL, //分享按钮
        APPLY_URL, //申请俺妞妞
        APPLY_BG_URL, //申请背景
        PRODUCT_CODE, //
        STATUS, //
        LENGTH, //
        WIDTH, //
      } = res.LIST[0];

      let fundConfig = {
        PAGE_URL, //首页
        BUSINESS_URL, //个人业务
        FUND_URL, // 介绍页背景图
        MOMENTS_URL, // 分享海报
        BUTTON_URL, //分享按钮
        APPLY_URL, //申请俺妞妞
        APPLY_BG_URL, //申请背景
        PRODUCT_CODE, //
        STATUS, //
        LENGTH, //
        WIDTH, //
      };
      return fundConfig;
    } else {
      return Promise.reject(res.MSG);
    }
  }
}
