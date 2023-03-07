const log = require('../../../log.js');
const { default: User } = require('../../../utils/user.js');
import { addRecommendInfo } from '../../../api/Recommend';
import emp from '../../../utils/Emp';
import api from '../../../utils/api';

var app = getApp();

Page({
  data: {
    cndUrl: app.globalData.CDNURL,
    bindStatus: false,
    sharerInfo: {},
    loading: false,
    clerkInfo:{},
    customerInfo:{},
    showBindPhone:false
  },
  async getPhoneNumber3(e) {
    var that = this;
    wx.showLoading({
      title: '获取中...',
    });
  await api
      .getPhoneNumber(e)
      .then((phone) => {
        console.log(phone);
      })
      .catch((err) => {
        console.log('解密手机号错误', err);
        wx.showToast({
          title: err.msg,
          icon: 'none',
        });
      
      });
    that.data.customerInfo = await User.getCustomerInfo();
    console.log(that.data.customerInfo)
    that.setData({
      customerInfo: that.data.customerInfo,
      showBindPhone: false,
    });
    wx.hideLoading();
  },

  onLoad: async function (options) {

        // const sharerIntID = '1100123555';
        // console.log('分享者intId', sharerIntID);
        // const sharerOpenID = await User.getOpenIdByID(sharerIntID);
        // const customerInfo = await User.getCustomerInfo();

        // console.log(customerInfo)

        // console.log(sharerOpenID)
        // const shareInfo = await User.getCustomerInfo(sharerOpenID);

        // console.log(shareInfo)
        // shareInfo.REAL_NAME = shareInfo.REAL_NAME ? api.formateName(shareInfo.REAL_NAME) : '';
        // this.setData({
        //   shareInfo,
        //   customerInfo,
        //   loading: true,
        // });
        // this.getCardInfo()
      

    if (options.scene) {
      try {
        wx.showLoading({
          title: '加载中',
          mask: true,
        });
        const scene = decodeURIComponent(options.scene).split('a');
        const sharerIntID = scene[0];
        console.log('分享者intId', sharerIntID);
        const sharerOpenID = await User.getOpenIdByID(sharerIntID);
        const shareInfo = await User.getCustomerInfo(sharerOpenID);

         const customerInfo = await User.getCustomerInfo();

        shareInfo.REAL_NAME = shareInfo.REAL_NAME ? api.formateName(shareInfo.REAL_NAME) : '';
        this.setData({
          shareInfo,
          customerInfo,
          loading: true,
        });
      
        wx.hideLoading();
      } catch (error) {
        wx.hideLoading();
        console.log(error);
      }
      this.getCardInfo()
    }
  },

  /**
   * 获取名片信息
   */
  getCardInfo() {
    var that = this;
    emp
      .getCardInfoByEmp(that.data.shareInfo.USERID)
      .then((res) => {
        console.log(res)
       this.setData({
        clerkInfo:res
       })
      })
      .catch((err) => {
        if (err === 'unGetCardByEmp') {
          wx.showModal({
            title: '提示',
            content: '未查询到个人名片信息,请前往工作平台编辑',
            showCancel: false,
          });
        }
      });


  },

  addRecommendInfo() {
    // wx.navigateTo({
    //   url: '/sub3/pages/inviteFriend/inviteFriend?NICK_NAME='+'cc'
    // })
   
    console.log('openid', this.data.customerInfo.OPEN_ID);
    console.log('当前用户员工号', this.data.shareInfo.USERID);

    console.log('推荐官手机号', this.data.customerInfo.TEL);
   
    
    if(typeof(this.data.customerInfo.TEL)=='undefined'){

    return  this.setData({
        showBindPhone: true
      });
    
    }
    addRecommendInfo(this.data.customerInfo.OPEN_ID,this.data.shareInfo.USERID,this.data.customerInfo.TEL)
      .then((res) => {
        console.log(res);
        this.setData({
          bindStatus: true,
        });
        wx.navigateTo({
          url: '/sub3/pages/inviteFriend/inviteFriend?NICK_NAME='+this.data.clerkInfo.USERNAME
        })
      })
      .catch((error) => {
        wx.showModal({
          title: '提示',
          content: error.message || error,
          showCancel: false,
          confirmText: '确定',
          success: (result) => {
            if (result.confirm) {
            }
          },
        });
        console.log(error);
      });
  },
});
