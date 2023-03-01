// sub3/pages/ftAccountOpen/applyList/updateSplitPage.js
import Toast from '../../../static/vant-weapp/toast/toast';
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    readonluStatus:false, //只读页面状态
    uniqId:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.setData({
      uniqId : options.uniqId,
      readonluStatus: options.formStatus == '2'
    });
  },
  goSetpInfoPage(e){
    var infoType = ''; //跳转页面标识
    var toUrl = ''; //接收跳转页面
    switch(infoType){
      case 'unitInfo':
        toUrl = '../apply/unitInfo';
      break;
      case 'accountInfoPage':
        toUrl = '../apply/accountInfoPage';
      break;
      case 'unitInfo':
        toUrl = '../apply/naturalPeoplePage';
      break;
      case 'unitInfo':
        toUrl = '../apply/reservationOutletsPage';
      break;
      default:
        toUrl = '../apply/resultPage';
        break;
    }
    Toast(that.data.readonluStatus == 'true'? "现在不可以修改哦，只能读取数据":"emmmmm，就放开让你修改吧")
    // wx.navigateTo({
    //   url: toUrl + "?uniqId=" + that.data.uniqId + "&readonluStatus=" + that.data.readonluStatus,
    // })
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