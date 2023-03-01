// pages/home/home.js
import utils from '../../utils';
import {custMatchInfoQuery} from '../../../api/url';

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */

  data: {
    showDialog:false,
    tabList: [
      { name: '意向类', type: 0 },
      { name: '名单类', type: 1 }
    ],
    preffixUrl: utils.preffixUrl(),
    url:app.globalData.CDNURL,
    list:[],
    pageNo:1,
    pageSize:10,
    loadtext: "没有更多了", //1,上拉加载更多，2，加载中...3,没有更多了
    PUB_TYPE:'资金供给-投资意向',
    fs_type:0,
    info:{},
    QUERY_TYPE:3,
    FUND_SUP_CUST:'',
    PROJECT_NAME:'',
    INVEST_NUMBER:''
  },

  handleSwitch(e){
   console.log(e)
   if(e.detail.type==0){
     this.data.PUB_TYPE='资金供给-投资意向'
     this.data.QUERY_TYPE=1
   }
   if(e.detail.type==1){
    this.data.PUB_TYPE='资金供给-名单类'
    this.data.QUERY_TYPE=2
   }
   this.data.pageNo=1;
   this.data.list=[]
   this.getList();
   this.setData({
    fs_type:e.detail.type
   })

  },

  goProposedProject(e){
    console.log(e)
  wx.navigateTo({
    url: '/pages/proposedProject/proposedProject?FUND_SUP_CUST='+e.currentTarget.dataset.item.FUND_SUP_CUST+'&PROJECT_NAME='+e.currentTarget.dataset.item.PROJECT_NAME
  })
  },

  goDetail(e){
    console.log(e)
    var that= this;
   
    let data = {
      QUERY_TYPE:'1',
      MATCH_ID:e.currentTarget.dataset.match_id
    }
    console.log(data)
    custMatchInfoQuery(data).then(res => {
      console.log(res);
      that.setData({
        info:res.LIST[0]
      }) 
    })
    this.setData({
      showDialog: true
    })
  },
  handleCloseDialog() {
    this.setData({
      showDialog: false
    })
  },
  // 搜索框
  toSearch() {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    this.setData({
      FUND_SUP_CUST:e.FUND_SUP_CUST,
      PROJECT_NAME:e.PROJECT_NAME,
      INVEST_NUMBER:e.INVEST_NUMBER
    })
    this.getList() 
  },


  getList() {
    var that= this;
   
    let data = {
      FIRST_NO:String(this.data.pageNo),
      RESULT_SIZE:String(this.data.pageSize),
      QUERY_TYPE:String(this.data.QUERY_TYPE),
      FUND_SUP_CUST:this.data.FUND_SUP_CUST,
      PROJECT_NAME:this.data.PROJECT_NAME
    }
    console.log(data)
    custMatchInfoQuery(data).then(res => {
      console.log(res);
      var list = res.LIST;
      for (var i=0;i<list.length;i++) {
        list[i].CREATED_TS = list[i].CREATED_TS.substring(0,10);
      }
      that.setData({
        list:[...this.data.list, ...list]
      })

      that.setData({
        loadtext: this.data.loadtext = this.data.list.length < res.ALL_RESULT_SIZE ? "上拉加载更多" : "没有更多了"
      })
      
     
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
   
    this.data.pageNo=1;
    this.data.list=[]
    this.getList();

    wx.stopPullDownRefresh(); 
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.loadtext !== "没有更多了") {
      this.data.pageNo++;
      this.getList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
