// sub6/pages/agriculture/projectCooperation.js
var app = getApp();
import utils from './utils';
import talent from './talent';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cndUrl: app.globalData.CDNURL,
    preffixUrl: utils.preffixUrl(),
    active: 0,
    typeList:'2',
    LIST3:[
      {
        name:'开发开发',
        cordname:'开发开发开发开发开发开发开发开发',
        url:'/static/wechat/img/zssn/xmgxhzbg.png',
        type:'1'
      },
      {
        name:'开发开发',
        cordname:'开发开发开发开发开发开发开发开发',
        url:'/static/wechat/img/zssn/xmgxhzbg.png',
        type:'1'
      },
    ],
    productList:[
      {
        name:'开发开发',
        cordname:'开发开发开发开发开发开发开发开发',
        url:'/static/wechat/img/zssn/xmgxhzbg.png'
      },
      {
        name:'开发开发开开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发发开发开发开发开发开发',
        cordname:'开发开发开发开发开发开发开发开发',
        url:'/static/wechat/img/zssn/xmgxhzbg.png'
      },
    ],
    

  },
  onSearchEvent(e) {
    console.log(e.detail.value);
    console.log(this.data.typeList);
    if (this.data.typeList == 2) {
      wx.navigateTo({
          url: './projectCooperationList?keywords=' + this.data.keywords 
      });
    } else {
      wx.navigateTo({
        url: '/sub9/pages/agriculture/ArticleList?keywords=' + this.data.keywords
    });
    }
  },
  onChange(event) {
    console.log(event);
    if (event.detail.index == 0 ) {
      this.setData({
        typeList: '2',

      })
      this.getProjectList()
    } else {
      this.setData({
        typeList: '1',
        
      })
      this.getList()
    }
    
  },
  getLists() {
    if (this.data.typeList == 2) {
      wx.navigateTo({
        url: './projectCooperationList'
      });
    } else {

      wx.navigateTo({
        url: './projectCooperationList?typeList=' + this.data.typeList
      });
    }
    
  },
  getProductDetails(e) {
    wx.navigateTo({
      url: "./productDetails?ID=" + e.currentTarget.dataset.id 
    })
  },
  getProjectList() {
    let data = {
      type: this.data.typeList,
      ifRecom:'1'
    }
    console.log(data);
    talent.projectList(data).then(res => {
      if (res.entityList) {
        this.setData({
          productList:res.entityList
        })
        
      } else {
        this.setData({
          productList:[]
        })
      }
    })
  },
  getList() {
    let data = {
      CATEGORY: '',
      TYPE:''
    }
    talent.project(data).then(res => {
      console.log(res);
      let {LIST} = res
      if (LIST) {
        LIST = JSON.parse(LIST)
      }
      console.log(LIST);
      this.setData({
        LIST3:LIST
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // this.setData({
    //   typeList: 1,

    // })
    this.getList()
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