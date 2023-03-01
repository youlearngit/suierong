import Get from '../../../api/Get';
import user from '../../../utils/user';
const app = getApp();
Page({
    data: {
        preffixUrl: getApp().globalData.CDNURL,
        hasUserInfo: ''
    },
    onShow() {
        app.editTabBar1();    //显示自定义的底部导航
        var that = this;
        user.getCustomerInfo().then((res) => {
          let customerInfo = res;
          console.log('customerInfo',customerInfo)
          user.ifAuthUserInfo().then((res) => {
            console.log(res)
            that.setData({
              hasUserInfo: res,
              customerInfo,
              'customerInfo.PHOTO': customerInfo.PHOTO,
              'customerInfo.NICK_NAME': customerInfo.NICK_NAME,
            });
          });
        });
        Get.companyMsgQuery().then(res => {
            if (res.code == '500' && res.msg == "无效的token") {
                wx.showModal({
                    title: '提示',
                    content: 'token失效，请退出重新登录!',
                    showCancel: false,
                    cancelColor: '#000000',
                    confirmText: '确定',
                    success: (result) => {
                        if (result.confirm) {
                            wx.removeStorageSync('token');
                            wx.showToast({
                                title: '退出成功！',
                                icon: 'none',
                                duration: 2000
                            })
                            setTimeout(() => {
                                wx.navigateTo({
                                    url: '../login/login',
                                })
                            }, 2000)
                        }
                    }
                });
            }
        })
    },
    login() {
      wx.navigateTo({
        url: '/pages/mine/getInfo',
      })
    },
    loginOut() {
        Get.loginOut().then(res => {
            wx.removeStorageSync('token');
            wx.showToast({
                title: '退出成功！',
                icon: 'none',
                duration: 2000
            })
            setTimeout(() => {
                wx.navigateTo({
                    url: '../login/login',
                })
            }, 2000)
        })
    }
})