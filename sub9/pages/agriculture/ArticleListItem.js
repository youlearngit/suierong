// sub9/pages/agriculture/ArticleListItem.js
var app = getApp();
import utils from './utils';
import talent from './talent';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cndUrl: app.globalData.CDNURL,
    PROID:'',
    CATEGORY:'0',
    article:{}
  },
  getList() {
    let data = {
      PROID:this.data.PROID
    }
    console.log(data);
    talent.project(data).then(res => {
      console.log(res);
      let {LIST} = res
      LIST = JSON.parse(LIST)
      console.log(LIST);
      this.setData({
        article:LIST[0]
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let {ID,CATEGORY} = options
    this.setData({
      PROID:ID,
      CATEGORY:CATEGORY
    })
    this.getList()
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