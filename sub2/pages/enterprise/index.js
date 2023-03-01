// sub2/pages/enterprise/index.js
import User from '../../../utils/user';
import { getSalaryCode } from '../../../api/salary';
var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        cndUrl: app.globalData.CDNURL,
        userInfo:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        User.getCustomerInfo().then((res)=>{
           if(res.USERID){
            this.setData({
                userInfo: true,
              });
        }
        });
        
       
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },
    async toXX() {
        wx.showLoading({
          title: '跳转中',
          mask: true,
        });
        try {
          const userInfo = await User.getCustomerInfo();
          console.log(userInfo);
    
          if (!userInfo.REAL_NAME || !userInfo.TEL) {
            wx.showModal({
              title: '提示',
              content: '请先完成身份认证',
              showCancel: false,
              confirmText: '确定',
              success: (result) => {
                if (result.confirm) {
                  wx.navigateTo({
                    url: '/sub1/pages/auth/index',
                  });
                }
              },
              fail: () => {},
              complete: () => {},
            });
            return;
          }
    
          if (!userInfo.USERID) {
            wx.showToast({
              title: '暂只支持行员进入',
              icon: 'none',
            });
            return;
          }
    
          wx.navigateToMiniProgram({
            appId: 'wxb7900801fb32390b',
            path: `pages/index/main?INVITER_NAME=${userInfo.REAL_NAME}&INVITER_PHONE=${userInfo.TEL}&INVITER_ID=${userInfo.USERID}`,
            extraData: {
              INVITER_NAME: userInfo.REAL_NAME,
              INVITER_PHONE: userInfo.TEL,
              INVITER_ID: userInfo.USERID,
            },
            envVersion: 'release', //release trial develop
            success(res) {
              console.log('success', res);
            },
          });
        } catch (error) {
          console.log(error);
        } finally {
          wx.hideLoading();
        }
      },
      
  async getCode() {
    wx.showLoading({
      title: '跳转中',
      mask: true,
    });

    try {
      const userInfo = await User.getCustomerInfo();
      console.log(userInfo);

      if (!userInfo.TEL) {
        wx.navigateTo({
          url: '/sub1/pages/auth/index',
        });
        return;
      }

      const res = await getSalaryCode(userInfo.TEL);
      console.log(res);
      let skipUrl = '';
      if (res.flag === '1') {
        skipUrl = `https://qygj.jsbchina.cn/mxcp/index.html#/HrMain?CODE=${res.data}&CHNL_TYPE=wxmp`;
       //skipUrl = `https://qygj-test.jsbchina.cn/mxcp/index.html#/HrMain?CODE=${res.data}&CHNL_TYPE=wxmp`;
        console.log(skipUrl);
        wx.navigateTo({
          url: '/pages/showWeb/showWeb?skipUrl=' + encodeURIComponent(skipUrl),
        });
      } else {
        wx.showModal({
          title: '提示',
          content: '暂无权限，是否前往注册页面',
          showCancel: true,
          cancelText: '取消',
          cancelColor: '#000000',
          confirmText: '确定',
          success: (result) => {
            if (result.confirm) {
              skipUrl = 'https://qygj.jsbchina.cn/mxcp/index.html#/register';
              //   skipUrl = 'https://qygj-test.jsbchina.cn/mxcp/index.html#/register';
              wx.navigateTo({
                url: '/pages/showWeb/showWeb?skipUrl=' + encodeURIComponent(skipUrl),
              });
            }
          },
          fail: () => {},
          complete: () => {},
        });
      }
    } catch (error) {
    } finally {
      wx.hideLoading();
    }
  },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})