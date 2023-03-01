import { addEvaluation } from './api';
import User from '../../../utils/user';
const app = getApp();

Page({
  /**
   * Page initial data
   */
  data: {
    preffixUrl: app.globalData.CDNURL,
    cndUrl: app.globalData.CDNURL,
    pingjia: '',
    applyInfo: {},
    customerInfo: {},
    enterpriseInfo: {},
    isWillingToShare: '',
    descList: [
      { name: '产品无法满足需求（额度、利率、期限、还款方式等）', value: '1' },
      { name: '办理流程繁琐、操作复杂', value: '2' },
      { name: '客户经理服务态度', value: '3' },
      { name: '客户经理专业能力', value: '4' },
      { name: '客户经理工作效率', value: '5' },
    ],
    isUnfold: true,
    managerId: '',
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: async function (options) {
    console.log(options, options,'options');
    let applyInfo = JSON.parse(options.apply);
          try {
            if(applyInfo.ATTR1){
              applyInfo.ATTR1 = JSON.parse(applyInfo.ATTR1)
            }
            if(applyInfo.AMOUNT_FD.indexOf('.')!='-1'){
              applyInfo.AMOUNT_FD = applyInfo.AMOUNT_FD.substring(0,applyInfo.AMOUNT_FD.indexOf('.'))
            }
            if(applyInfo.AMOUNT_GD.indexOf('.')!='-1'){
              applyInfo.AMOUNT_GD = applyInfo.AMOUNT_GD.substring(0,applyInfo.AMOUNT_GD.indexOf('.'))
            }
            if(applyInfo.APPLY_AMOUNT.indexOf('.')!='-1'){
              applyInfo.APPLY_AMOUNT = applyInfo.APPLY_AMOUNT.substring(0,applyInfo.APPLY_AMOUNT.indexOf('.'))
            }
          } catch (error) {
            console.log(error,'44')
          }
    

    applyInfo.APPLY_DATE = applyInfo.APPLY_DATE.split(' ');
    this.setData({
      applyInfo,
      enterpriseInfo: JSON.parse(options.enterpriseInfo),
      managerId: options.managerId,
    });
    console.log(this.data.applyInfo,'applyInfo')
    const customerInfo = await User.getCustomerInfo();

    this.setData({
      customerInfo,
    });
  },

  pingjiaStar(e) {
    console.log(e.currentTarget.dataset);
    let { event, star } = e.currentTarget.dataset;
    let { pingjia } = this.data;
    if (!pingjia) {
      pingjia = {};
      this.setData({
        pingjia,
      });
    }

    if (event === 'downup1') {
      if (star.toString() === '0') {
        this.setData({
          isUnfold: !this.data.isUnfold,
        });
        return;
      }
      if (pingjia.downup1 && pingjia.downup1.indexOf(star.toString()) > -1) {
        pingjia.downup1 = pingjia.downup1.replace(star.toString(), '');
      } else {
        pingjia.downup1 = (pingjia.downup1 || '') + star.toString();
      }

      this.setData({
        pingjia,
      });
      return;
    }

    pingjia[event] = star.toString();

    if (pingjia.zongti === '5' && pingjia.chanpin === '5' && pingjia.fuwu == '5') {
      pingjia.downup1 = '';
      this.setData({
        isWillingToShare: true,
      });
    } else {
      this.setData({
        isWillingToShare: '',
      });
    }

    this.setData({
      pingjia,
    });
  },

  choiceIfWillingToShare(e) {
    console.log(e.currentTarget.dataset);
    this.setData({
      isWillingToShare: e.currentTarget.dataset.choice,
      url: e.currentTarget.dataset.url,
    });
  },

  async pingjiaConfirm(e) {
    wx.showLoading({
      title: '请稍等',
      mask: true,
    });
    const { customerInfo, enterpriseInfo, pingjia, applyInfo, isWillingToShare, descList, managerId } = this.data;
    try {
      const serviceSuggestionList = descList.filter((e) => pingjia.downup1.indexOf(e.value) > -1);
      const serviceSuggestion = serviceSuggestionList.map((e) => e.value + '-' + e.name).join('|');
      const evaluationInfo = {
        custName: customerInfo.REAL_NAME, //客户名称
        certNo: customerInfo.ID_CARD, //身份证号
        phoneNo: customerInfo.TEL, //手机号
        companyName: enterpriseInfo.ORG_NAME, //公司名称
        socialCreditCode: enterpriseInfo.ORG_CODE, //社会信用代码
        evaluationCollectionStage: '1', //评价采集阶段
        satisfiedService: '', //本次服务是否满意
        willingToRecommend: isWillingToShare ? '1' : isWillingToShare === '' ? '' : '0', //是否愿意推荐给亲友 传什么值
        overallSatisfaction: pingjia.zongti, //总体满意度
        productSatisfaction: pingjia.chanpin, //产品满意度
        serviceSatisfaction: pingjia.fuwu, //服务满意度
        serviceSuggestion, //服务提示建议
        sedId: applyInfo.A_ID,
        orderNo: applyInfo.ORDER_NO, // 订单号
        managerId,
      };
      addEvaluation(evaluationInfo);
      console.log(this.data.pingjia);

      if (isWillingToShare) {
        wx.redirectTo({
          url: '/sub1/pages/share/index',
        });
        return;
      }
      wx.navigateBack({
        delta: 1,
      });
      return;
      wx.showModal({
        title: '提示',
        content: '提交成功',
        showCancel: false,
        confirmText: '确定',
        success: (result) => {
          if (result.confirm) {
            if (isWillingToShare) {
              wx.redirectTo({
                url: '/sub1/pages/share/index',
              });
              return;
            }
            wx.navigateBack({
              delta: 1,
            });
          }
        },
        fail: () => {},
        complete: () => {},
      });
    } catch (error) {
      console.log(error);
      wx.showModal({
        title: '提示',
        content: error.message || error,
        showCancel: false,
        confirmText: '确定',
        success: (result) => {
          if (result.confirm) {
          }
        },
        fail: () => {},
        complete: () => {},
      });
    } finally {
      wx.hideLoading();
    }
  },
});
