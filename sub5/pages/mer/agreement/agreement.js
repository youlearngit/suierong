const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cdnMer: App.globalData.CDNURL + '/static/wechat/img/mer/',
    
    type: 0,
    count_down: 3,
    timer_count: false,

    custName: '',
    idCard: '',
    sqrName: '',
    creditCode: '', // 统一社会信用代码 18位
    creditCode_org: '', // 组织机构代码 统一社会信用代码 9-17位
    year: '',
    month: '',
    day: '',

  },

  timerCount() {
    let {timer_count} = this.data;
    if (timer_count) { return }
    timer_count = setInterval(async () => {
      let {count_down} = this.data;
      count_down--;
      this.setData({count_down});
      if (count_down<=0) {
        clearInterval(timer_count);
      }
    },1000)
    this.setData({timer_count});
  },

  goAgree() {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.emit('agreementReadEvent', {
      type: this.data.type,
      read: true,
    });
    wx.navigateBack();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let date = new Date();
    this.setData({
      year: date.getFullYear()+'',
      month: (date.getMonth()+1)+'',
      day: date.getDate()+'',
    })

    let that = this;
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('setPdfData', function(data) {
      // data.creditCode_org = data.creditCode.substring(8,17);
      data.creditCode_org = data.creditCode;
      that.setData({...data})
    });
    
    this.timerCount();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})