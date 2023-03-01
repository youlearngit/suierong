// sub3/pages/ftAccountOpen/home.js
import user from '../../../utils/user';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginFlag: true, //授权提示控制
    listToApplyFlag:false, //列表跳转申请页面 
    applyToListFlag:false, //申请结果页面跳转列表页面
    preffixUrl: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      preffixUrl: app.globalData.CDNURL,
    });
  },
  //取消授权
  cancelLogin: function(event){
    this.setData({
      loginFlag: true,
    });
  },
  //获取用户信息
  getAmount() {
    user.ifAuthUserInfo().then((res) => {
      if (res) {
         //已查询到登陆用户数据
        this.setData({
          loginFlag: true,
        });
      } else {
        //未查询到登陆用户数据
        this.setData({
          loginFlag: false,
        });
        return Promise.reject('未授权登陆');
      }
    }).catch((err) => {});
  },
  //跳转列表页面
  toList(e){
    if(this.data.loginFlag == true){
      this.getAmount();
    }else{
      var bookingStatus = e.currentTarget.dataset.bookingstatus;
      wx.navigateTo({
        url: "/sub3/pages/ftAccountOpen/applyList/index?bookingStatus="+bookingStatus //bookingStatus:0 已预约
      })
    }
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
    var that = this;
    //判断是否从列表跳回进入开户页
    if(that.data.listToApplyFlag){
      that.setData({
        listToApplyFlag: false
      });
      wx.navigateTo({
        url: '/sub3/pages/ftAccountOpen/apply/unitInfo',
      })
    }
    if(that.data.applyToListFlag){
      that.setData({
        applyToListFlag: false
      });
      wx.navigateTo({
        url: '/sub3/pages/ftAccountOpen/applyList/index',
      })
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