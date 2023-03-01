import Order from '../../../api/Order';

// sub1/pages/xsd/index2.js
var app = getApp();

Page({
  /**
   * Page initial data
   */
  data: {
    preffixUrl: app.globalData.URL,
    cndUrl: app.globalData.CDNURL,
  },

  apply: (e) => {
    console.log(e);
    const { type } = e.currentTarget.dataset;
    if (type === '0') {
      wx.navigateTo({
        url:
          '/pages/showWeb/showWeb?skipUrl=' +
          encodeURIComponent(
            'https://vbank.jsbchina.cn/wbank/loan/recommendMech.do?qdNo=QD060033&qdName=5b6Q5bee5YiG6KGM6Zu25ZSu6YOo&branchNo=0600&branchName=5b6Q5bee5YiG6KGM',
          ),
      });
      return;
    }

    Order.getUnfinishedOrder();
  },
});
