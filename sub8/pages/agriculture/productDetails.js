// sub6/pages/agriculture/productDetails.js
const app = getApp();
import talent from './talent';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cndUrl: app.globalData.CDNURL,
    ID:''
  },
  getProjectList() {
    let data = {
      ids:this.data.ID
    }
    console.log(
      data
    );
    talent.projectList(data).then(res => {
      console.log(res);
      let list = res.entityList[0]
      if (res.entityList) {
        list.DETAIL = this.formatPic(res.entityList[0].DETAIL) 
        console.log(list.DETAIL);
        this.setData({
          productList:list
        })
        
      }
    })
  },
  formatPic: function(pic) {
    if (!pic) return pic
    if (pic.indexOf('<img') < 0) {
      pic = pic.replace(/<p([\s\w"=\/\.:;]+)((?:(style="[^"]+")))/ig, '<p')
        .replace(/<p([\s\w"=\/\.:;]+)((?:(class="[^"]+")))/ig, '<p')
        .replace(/<p>/ig, '<p class="text_class">')
        .replace(/\s{2,}/ig, ' ')
        .replace(/<span([\s\w"-=\/\.:;]+)((?:(style="[^"]+")))/ig, '<span$1')
        .replace(/<table([\s\w"=\/\.:;]+)((?:(style="[^"]+")))/ig, '<table')
        .replace(/<td([\s\w"-=\/\.:;]+)((?:(style="[^"]+")))/ig, '<td$1')
        .replace(/<table/gi, '<table border="1"  style="border-collapse:collapse;border-top: 1px solid ; border-left: 1px solid ; width: 100%;"')
        .replace(/<th/gi, '<th style="border-right: 1px solid ; border-bottom: 1px solid ;"')
        .replace(/<td/gi, '<td style="border-right: 1px solid ; border-bottom: 1px solid ;"')
    } else  {
      pic = pic.replace(/<p([\s\w"=\/\.:;]+)((?:(style="[^"]+")))/ig, '<p')
        .replace(/<p([\s\w"=\/\.:;]+)((?:(class="[^"]+")))/ig, '<p')
        .replace(/<table([\s\w"=\/\.:;]+)((?:(style="[^"]+")))/ig, '<table')
        .replace(/<td([\s\w"-=\/\.:;]+)((?:(style="[^"]+")))/ig, '<td$1')
        // .replace(/<table/gi, '<table border="1"  style="border-top: 1px solid;border-left: 1px solid;border-right: 1px solid; width: 100%;"')
        .replace(/<table/gi, '<table border="1"  style="border-collapse:collapse;border-top: 1px solid ; border-left: 1px solid ; width: 100%;"')
        .replace(/<th/gi, '<th style="border-right: 1px solid ; border-bottom: 1px solid ;"')
        .replace(/<td/gi, '<td style="border-right: 1px solid ; border-bottom: 1px solid ;"')


        // .replace(/<p>/ig, '<p class="p_class">')
        // .replace(/<img([\s\w"-=\/\.:;]+)((?:(height="[^"]+")))/ig, '<img$1')
        // .replace(/<img([\s\w"-=\/\.:;]+)((?:(width="[^"]+")))/ig, '<img$1')
        .replace(/<img([\s\w"-=\/\.:;]+)((?:(style="[^"]+")))/ig, '<img$1')
        .replace(/<img([\s\w"-=\/\.:;]+)((?:(word_img="[^"]+")))/ig, '<img$1')
        .replace(/<img([\s\w"-=\/\.:;]+)((?:(hspace="[^"]+")))/ig, '<img$1')
        .replace(/<img([\s\w"-=\/\.:;]+)((?:(background="[^"]+")))/ig, '<img$1')
        .replace(/<img([\s\w"-=\/\.:;]+)((?:(alt="[^"]+")))/ig, '<img$1')
        // .replace(/<span([\s\w"-=\/\.:;]+)((?:(margin-top="[^"]+")))/ig, '<span$1')
        // .replace(/<span([\s\w"-=\/\.:;]+)((?:(margin-left="[^"]+")))/ig, '<span$1')
        .replace(/<span([\s\w"-=\/\.:;]+)((?:(style="[^"]+")))/ig, '<span$1')
        .replace(/<span([\s\w"-=\/\.:;]+)((?:(alt="[^"]+")))/ig, '<span$1')
        .replace(/<span/gi, '<span style="margin: 0 auto;" ')
        .replace(/<img/gi, '<img width=96% style="width: 100%;margin-top: 16px auto;height:150px !importan;display:block;margin: 0 auto;"')
        .replace(/\s{2,}/ig, '')
    }
    return pic
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      ID:options.ID
    })
    this.getProjectList()
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