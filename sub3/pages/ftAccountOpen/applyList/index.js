// sub3/pages/ftAccountOpen/applyList/index.js
import requestYT from "../../../../api/requestYT";
import user from '../../../../utils/user';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasDataFlag: false,
    preffixUrl: '',
    resultItem:[],
    bookingStatus: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      preffixUrl: app.globalData.CDNURL,
      bookingStatus : options.bookingStatus,
    });
    that.getData();
  },
  getData: function(){
    var that = this;
    let options = {
      url: '/ft/searchYyList.do',
      data: {
        openId: wx.getStorageSync('openid'),
        yyzt: that.data.bookingStatus
      }
    };
    requestYT(options).then((res) => {
      if(res.STATUS == '1'){
        if(res.yyInfoList != '[]'){
          that.setData({
            resultItem: JSON.parse(res.yyInfoList) 
          });
        }else{
          that.setData({
            hasDataFlag: true,
          });
        }
      }else{
        that.setData({
          hasDataFlag: true,
        });
        wx.showToast({
          title: '获取数据异常',
        })
      }
    });
  },
  //跳转详情页
  toInfoPage : function(e){
    var formStatus = e.currentTarget.dataset.formstatus; //formStatus 状态: 0-新增、1-修改、2已预
    if(formStatus == '2' && this.data.bookingStatus == '1'){
      //查 功能
      var info = e.currentTarget.dataset.yyinfo; //数据唯一标示
      var toApplyUrl = "/sub3/pages/ftAccountOpen/applyList/applyInfo?info="+JSON.stringify(info);
      wx.navigateTo({
        url: toApplyUrl
      })
    }else{
      //增、改 功能
      var uniqId = e.currentTarget.dataset.uid?e.currentTarget.dataset.uid:''; //数据唯一标示
       //新建获取手机号
       user.getCustomerInfo().then((res) => {
        if(!res.TEL){
          wx.showToast({
            title: '请先补充个人信息',
            icon: 'none',
          });
        }else{
          var toCreateOrUpdateUrl = "/sub3/pages/ftAccountOpen/apply/unitInfo?isCreate="+formStatus + "&uniqId="+uniqId ;
          wx.navigateTo({
            url: toCreateOrUpdateUrl
          })
        }
      });
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