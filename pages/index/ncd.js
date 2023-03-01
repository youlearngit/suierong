const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    preffixUrl: '',
    callGetPhone: '025-58587263',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options)
    this.setData({
      preffixUrl: app.globalData.URL,
      navTop: app.globalData.statusBarTop,
      navHeight: app.globalData.statusBarHeight,
    })

    var pagenum = getCurrentPages()
    this.setData({
      pageFlag: pagenum.length
    })
    if (pagenum.length > 2) {
      //console.log("有返回")
    } else {
      //console.log("到主页")
    }

  },
  // 拨打电话给收件人
   callGetPhone(e) {
     // 号码
     let telPhone = e.currentTarget.dataset.getphone;
     this.callPhone(telPhone);
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

  indexpage: function () {
    wx.switchTab({
      url: "/pages/shop/index2"
    })
  },
  prePage() {
    wx.navigateBack();
  },
  callGetPhone(e) {
    let that = this;
    // 号码
    let telPhone = e.currentTarget.dataset.getphone;
    wx.showModal({
      title: '温馨提示',
      content: '您确定要拨打' + telPhone + "?",
      showCancel: true,
      cancelText: "取消",
      cancelColor: 'skyblue',//取消文字的颜色
      confirmText: "立即拨打",//默认是“确定”
      confirmColor: 'skyblue',
      success: function (res) {
        if (res.cancel) {
          //点击取消,默认隐藏弹框
        } else {
          //点击确定
          that.callPhone(telPhone);
        }
      },
      fail: function (res) { },//接口调用失败的回调函数
      complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
    })
  },
  callPhone(phoneNumber) {
    wx.makePhoneCall({
      phoneNumber: phoneNumber,
      success: function () {
        //console.log("拨打电话成功！")
      },
      fail: function () {
        //console.log("拨打电话失败！")
      }
    })
  },
})