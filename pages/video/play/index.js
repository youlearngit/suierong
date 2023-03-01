import api from '../../../utils/api';
const util = require('../../../utils/util');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    preffixUrl: app.globalData.URL,
    cndUrl: app.globalData.CDNURL,
    ifPlay: false,
    clickPrePage: false,
    videoName: '',
    videoSrc: '',
    videoId: '',
    desc: '',
    playTimeNow: 0, //当前时间
    playSpeed: 0, //当前播放进度
    playProcess: 0,  //历史进度/起始时间
    fromShare: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      navTop: app.globalData.statusBarTop,
      navHeight: app.globalData.statusBarHeight,
    })
    console.log(options,'options')
    this.setData({
      videoName: options.name,
      videoSrc: options.src,
      videoId: options.id,
      desc: options.desc,
      playProcess: options.playProcess
    })
    if(options.share_date){
      this.setData({fromShare:true})
    }else{
      this.setData({fromShare:false})
    }
  },
  async prePage() {
    var that = this
    this.setData({ clickPrePage : true })
    if(this.data.ifPlay == true){
      wx.showLoading({
        title: '跳转中...',
      })
      api.saveProcess(app.globalData.playSpeed).then((res) => {
        if(res.STATUS == '1'){
          if(that.data.fromShare){
            wx.switchTab({
              url: '/pages/shop/index2',
            });
          }else{
            wx.navigateBack();
          }
          wx.hideLoading({
            success: (res) => {},
          })
        }
      }).catch(err=>{
        wx.showToast({
          title: err || '进度保存失败!',
          duration: 1500,
          icon: 'none'
        });
        wx.hideLoading();
        if(that.data.fromShare){
          wx.switchTab({
            url: '/pages/shop/index2',
          });
        }else{
          wx.navigateBack();
        }
      });
    }else{
      if(that.data.fromShare){
        wx.switchTab({
          url: '/pages/shop/index2',
        });
      }else{
        wx.navigateBack();
      }
    }
  },
  videoUpdate(e){
    var that = this;
    this.setData({ playTimeNow : e.detail.currentTime });
    // console.log(e);
    app.globalData.playSpeed = {
      videoId : parseInt(that.data.videoId),
      openId: wx.getStorageSync('openid'),
      playProcess: e.detail.currentTime
    };
  },
  bindplay(e){
    this.setData({ ifPlay : true })
  },
  bindpause(e) {
    console.log('当前具体时间:'+this.data.playTimeNow);
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
    var that = this
    console.log('leave')
    if(this.data.clickPrePage == false){
      if(that.data.ifPlay == true){
        api.saveProcess(app.globalData.playSpeed).then((res) => {

        }).catch(err=>{
          wx.showToast({
            title: err || '进度保存失败!',
            duration: 1500,
            icon: 'none'
          });
        });
      }
    }

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
  onShareAppMessage: function () {
    let pages = getCurrentPages(); //获取加载的页面
    let currentPage = pages[pages.length - 1]; //获取当前页面的对象
    let url = currentPage.route;//当前页面url
    let share_id = wx.getStorageSync('openid');
    let params = '236'
    var path = 'pages/video/play/index' + "?open_id=" + share_id + "&share_date=" + util.formatTime(new Date())+"&name=" + this.data.videoName +"&src="+this.data.videoSrc+"&id="+this.data.videoId+"&desc="+this.data.desc;
    return {
      path: path,
    }
  },
})