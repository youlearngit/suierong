import skip from '../../../utils/skip';
import Chat from '../../../api/Chat';
import Emp from '../../../utils/Emp';
import Config from '../../../api/Config';
import api from '../../../utils/api';
var app = getApp();
var myPerformance = require('../../../utils/performance.js');

Page({
  data: {
    preffixUrl: app.globalData.URL,
    cndUrl: app.globalData.CDNURL,
    CustomBar: app.globalData.StatusBar,
    zh_products: [
      {
        name: '手机银行',
        code: 'FO001',
      },
      {
        name: '网点查询',
        code: 'CP001',
      },
      {
        name: '房产评估',
        code: 'AP001',
      },
      {
        name: '企业手机银行',
        code: 'BP002',
      },
      {
        name: '企业网银',
        code: 'BP001',
      },
      {
        name: '对公账户查询',
        code: 'CP002',
      },
      {
        name: '创业家卡',
        code: 'GP001',
      },
      {
        name: '开户资料查询',
        code: 'CP003',
      },
    ],
    showRecentChat: false,
    showChatComponent: false,
    contactList: [],
  },

  skip(e) {
    console.log(e)
    if(e.currentTarget.dataset.code==='creditloan'){
      wx.navigateTo({
        url: '/sub1/pages/creditLoanH5/index',
      })
    }else{
      skip.skipProduct(e.currentTarget.dataset.code);

    }
  },

  onLoad() {
    myPerformance.reportBegin(2015, 'sub1_personal_index');
    this.setData({
      currentPage: getCurrentPages().length,
    });

    // this.setData({
    //   showChatComponent: app.globalData.showChatComponent,
    // });
    api.getLocation().then(() => {
      this.setData({
        showChatComponent: app.globalData.showChatComponent,
      });
    });
    
    myPerformance.reportEnd(2015, 'sub1_personal_index');

    Config.getFundConfig()
      .then(fundConfig => {
        this.setData({
          fundConfig,
        });
      })
      .catch(err => {});

    const chat = new Chat();
    var that = this;
    chat
      .getRecentContact()
      .then(res => {
        that.setData({
          showRecentChat: true,
        });
        return Promise.all(
          res.LIST.map(e => {
            return Emp.getCardInfo(e.managerNo).then(res => {
              return res;
            });
          }),
        );
      })
      .then(res => {
        that.setData({
          contactList: res,
        });
      })
      .catch(err => {});
  },
});
