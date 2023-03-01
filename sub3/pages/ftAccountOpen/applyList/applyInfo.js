Page({
  /**
   * 页面的初始数据
   */
  data: {
    uniqId:'', //唯一标识

    //预约审核状态
    yyStatusItem:[
      {value:'yhdsh',name:'银行待审核'},
      {value:'yhshz',name:'银行审核中'},
      {value:'yhshtg',name:'银行审核通过'},
      {value:'yhshbjj',name:'银行审核被拒绝'},
      {value:'khcg',name:'资料已审核完成，3个工作日内为贵司开立账户，谢谢配合！'},
   ],
    
    //查询详情返回请求体
    applyInfo:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var info = JSON.parse(options.info);
    var status = '';
    that.data.yyStatusItem.forEach(item=>{
      if(item.value == info.khjd){
        status = item.name
        return 
      }
    })
    info.status = status;
    that.setData({
      applyInfo: info,
    });
  },
  back(e){
    wx.navigateBack({
      delta: 1,
    })
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